import { createClient } from '@/lib/supabase/server'
import HomeFeed from '../HomeFeed'
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

  // Following feed: posts from drops the user is tapped into
  let followingPosts: TbPost[] = []
  if (user) {
    const { data: tapIns } = await supabase
      .from('tb_tap_ins')
      .select('drop_id')
      .eq('user_id', user.id)

    const followedDropIds = (tapIns ?? []).map((t: { drop_id: string }) => t.drop_id)

    if (followedDropIds.length > 0) {
      const { data: fPosts } = await supabase
        .from('tb_posts')
        .select(`
          *,
          author:tb_profiles(id, username, display_name, avatar_url, hype_score),
          drop:tb_drops(id, name, slug, accent_color)
        `)
        .in('drop_id', followedDropIds)
        .order('created_at', { ascending: false })
        .limit(30)

      if (fPosts && fPosts.length > 0) {
        const fpIds = fPosts.map((p: { id: string }) => p.id)
        const { data: fVotes } = await supabase
          .from('tb_votes')
          .select('post_id, vote_type')
          .eq('user_id', user.id)
          .in('post_id', fpIds)

        const fVoteMap = Object.fromEntries((fVotes ?? []).map((v: { post_id: string; vote_type: string }) => [v.post_id, v.vote_type]))
        followingPosts = (fPosts as unknown as TbPost[]).map(p => ({ ...p, user_vote: (fVoteMap[p.id] ?? null) as import('@/lib/types').VoteType | null }))
      }
    }
  }

  return <HomeFeed posts={posts} drops={drops} currentUserId={user?.id} followingPosts={followingPosts} />
}
