import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/PostCard'
import type { TbPost } from '@/lib/types'

export default async function WhatsPoppin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data } = await supabase
    .from('tb_posts')
    .select(`
      *,
      author:tb_profiles(id, username, display_name, avatar_url),
      drop:tb_drops(id, name, slug, accent_color)
    `)
    .order('flame_score', { ascending: false })
    .limit(50)

  let posts = (data ?? []) as unknown as TbPost[]

  if (user && posts.length > 0) {
    const { data: votes } = await supabase
      .from('tb_votes')
      .select('post_id, vote_type')
      .eq('user_id', user.id)
      .in('post_id', posts.map(p => p.id))
    if (votes) {
      const voteMap = Object.fromEntries(votes.map(v => [v.post_id, v.vote_type]))
      posts = posts.map(p => ({ ...p, user_vote: voteMap[p.id] ?? null }))
    }
  }

  return (
    <div className="feed-page">
      <div className="feed-header">
        <h1 className="page-title">🔥 What&apos;s Poppin</h1>
        <p className="page-subtitle">Ranked by flame score — the hottest signals right now</p>
      </div>
      <div className="feed-list">
        {posts.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title">Nothing&apos;s poppin yet</p>
            <p className="empty-sub">Drop a Receipt to get the fire started</p>
          </div>
        ) : (
          posts.map((post, i) => (
            <div key={post.id} className="trending-row">
              <span className="trending-rank">#{i + 1}</span>
              <div className="trending-post">
                <PostCard post={post} currentUserId={user?.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
