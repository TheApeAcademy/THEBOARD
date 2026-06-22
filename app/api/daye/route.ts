import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { question, drop_id } = await request.json() as { question: string; drop_id: string }
  if (!question || !drop_id) return NextResponse.json({ error: 'Missing question or drop_id' }, { status: 400 })

  // Verify user owns this drop
  const { data: drop } = await supabase
    .from('tb_drops')
    .select('id, name, tap_in_count, health_score')
    .eq('id', drop_id)
    .eq('profile_id', user.id)
    .single()

  if (!drop) return NextResponse.json({ error: 'Drop not found' }, { status: 404 })

  // Gather signal context
  const [receiptsResult, statsResult] = await Promise.all([
    supabase
      .from('tb_posts')
      .select('id, title, body, hype_count, cap_count, signal_type, status, flame_score')
      .eq('drop_id', drop_id)
      .eq('post_type', 'receipt')
      .order('flame_score', { ascending: false })
      .limit(20),
    supabase
      .from('tb_posts')
      .select('signal_type, status, hype_count, cap_count')
      .eq('drop_id', drop_id)
      .eq('post_type', 'receipt'),
  ])

  const receipts = receiptsResult.data ?? []
  const allStats = statsResult.data ?? []

  const signalCounts: Record<string, number> = {}
  const statusCounts: Record<string, number> = {}
  let totalHype = 0; let totalCap = 0

  allStats.forEach(r => {
    if (r.signal_type) signalCounts[r.signal_type] = (signalCounts[r.signal_type] ?? 0) + 1
    statusCounts[r.status] = (statusCounts[r.status] ?? 0) + 1
    totalHype += r.hype_count
    totalCap += r.cap_count
  })

  const context = `
Drop: ${drop.name}
Tap-ins: ${drop.tap_in_count}
Health Score: ${drop.health_score}%
Total Receipts: ${allStats.length}
Total Hype: ${totalHype} | Total Cap: ${totalCap}
Signal Breakdown: ${JSON.stringify(signalCounts)}
Status Breakdown: ${JSON.stringify(statusCounts)}

Top 10 Receipts by Flame Score:
${receipts.slice(0, 10).map((r, i) =>
  `${i + 1}. [${r.signal_type ?? 'drip'}] ${r.title ?? r.body.slice(0, 80)} | Hype: ${r.hype_count} | Status: ${r.status}`
).join('\n')}
`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    system: `You are Daye, an AI product intelligence co-pilot for The Board platform. You help product teams understand their user feedback signals and decide what to build next. Be concise, direct, and actionable. Use bullet points when listing recommendations. Reference specific receipts when relevant.`,
    messages: [
      {
        role: 'user',
        content: `Here is the context for ${drop.name}:\n\n${context}\n\nQuestion: ${question}`,
      },
    ],
  })

  const answer = response.content[0].type === 'text' ? response.content[0].text : 'No response'
  return NextResponse.json({ answer })
}
