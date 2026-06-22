import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Dashboard from './Dashboard'
import type { TbPost, TbDrop } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('tb_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'company') redirect('/')

  const { data: drops } = await supabase
    .from('tb_drops')
    .select('*')
    .eq('profile_id', user.id)

  const myDrops = (drops ?? []) as unknown as TbDrop[]
  const dropIds = myDrops.map(d => d.id)

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const [postsResult, recentPostsResult, contributorPostsResult] = await Promise.all([
    dropIds.length > 0
      ? supabase
          .from('tb_posts')
          .select('*, author:tb_profiles(id, username, display_name, avatar_url)')
          .in('drop_id', dropIds)
          .eq('post_type', 'receipt')
          .order('flame_score', { ascending: false })
          .limit(100)
      : Promise.resolve({ data: [] }),
    dropIds.length > 0
      ? supabase
          .from('tb_posts')
          .select('created_at, hype_count')
          .in('drop_id', dropIds)
          .eq('post_type', 'receipt')
          .gte('created_at', sevenDaysAgo.toISOString())
      : Promise.resolve({ data: [] }),
    dropIds.length > 0
      ? supabase
          .from('tb_posts')
          .select('author_id, hype_count, author:tb_profiles(username, display_name, avatar_url)')
          .in('drop_id', dropIds)
          .eq('post_type', 'receipt')
          .order('hype_count', { ascending: false })
          .limit(200)
      : Promise.resolve({ data: [] }),
  ])

  const receipts = (postsResult.data ?? []) as unknown as TbPost[]

  const velocityData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().slice(0, 10)
    const dayPosts = (recentPostsResult.data ?? []).filter(
      (p: { created_at: string; hype_count: number }) => p.created_at.slice(0, 10) === dateStr
    )
    return {
      label: d.toLocaleDateString('en', { weekday: 'short' }),
      receipts: dayPosts.length,
      hype: dayPosts.reduce((s: number, p: { hype_count: number }) => s + p.hype_count, 0),
    }
  })

  type ContributorRow = { author_id: string; hype_count: number; author: { username: string; display_name: string | null; avatar_url: string | null } | null }
  const contributorMap: Record<string, { username: string; display_name: string | null; avatar_url: string | null; total_hype: number; post_count: number }> = {}
  for (const p of (contributorPostsResult.data ?? []) as unknown as ContributorRow[]) {
    if (!p.author) continue
    if (!contributorMap[p.author_id]) {
      contributorMap[p.author_id] = { ...p.author, total_hype: 0, post_count: 0 }
    }
    contributorMap[p.author_id].total_hype += p.hype_count
    contributorMap[p.author_id].post_count++
  }
  const contributors = Object.values(contributorMap)
    .sort((a, b) => b.total_hype - a.total_hype)
    .slice(0, 5)

  return (
    <Dashboard
      profile={profile}
      drops={myDrops}
      receipts={receipts}
      currentUserId={user.id}
      velocityData={velocityData}
      contributors={contributors}
    />
  )
}
