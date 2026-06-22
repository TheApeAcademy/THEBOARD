import { createClient } from '@/lib/supabase/server'
import HomeFeed from './HomeFeed'
import type { TbPost, TbDrop } from '@/lib/types'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const [postsResult, dropsResult] = await Promise.all([
    supabase
      .from('tb_posts')
      .select(`
        *,
        author:tb_profiles(id, username, display_name, avatar_url, hype_score),
        drop:tb_drops(id, name, slug, accent_color)
      `)
      .order('created_at', { ascending: false })
      .limit(30),
    supabase
      .from('tb_drops')
      .select('id, name, slug, accent_color')
      .order('tap_in_count', { ascending: false })
      .limit(50),
  ])

  let posts = (postsResult.data ?? []) as unknown as TbPost[]
  const drops = (dropsResult.data ?? []) as unknown as TbDrop[]

  // Attach user votes if logged in
  if (user && posts.length > 0) {
    const postIds = posts.map(p => p.id)
    const { data: votes } = await supabase
      .from('tb_votes')
      .select('post_id, vote_type')
      .eq('user_id', user.id)
      .in('post_id', postIds)

    if (votes) {
      const voteMap = Object.fromEntries(votes.map(v => [v.post_id, v.vote_type]))
      posts = posts.map(p => ({ ...p, user_vote: voteMap[p.id] ?? null }))
    }
  }

  return <HomeFeed posts={posts} drops={drops} currentUserId={user?.id} />
}
