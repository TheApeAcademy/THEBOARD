import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: drop } = await supabase
    .from('tb_drops')
    .select('id, name, slug, accent_color, tap_in_count, health_score, description')
    .eq('slug', slug)
    .single()

  if (!drop) {
    return NextResponse.json({ error: 'Drop not found' }, { status: 404 })
  }

  const { data: posts } = await supabase
    .from('tb_posts')
    .select('id, title, body, hype_count, signal_type, status, created_at')
    .eq('drop_id', drop.id)
    .is('room_id', null)
    .order('flame_score', { ascending: false })
    .limit(5)

  return NextResponse.json({
    drop,
    topPosts: posts ?? [],
    embedUrl: `https://theboard.app/embed/${slug}`,
  })
}
