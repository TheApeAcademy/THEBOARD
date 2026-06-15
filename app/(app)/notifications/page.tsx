import { createClient } from '@/lib/supabase/server'

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch recent activity on the user's posts
  const { data: myPosts } = await supabase
    .from('tb_posts')
    .select('id, title, body')
    .eq('author_id', user.id)
    .limit(20)

  const postIds = (myPosts ?? []).map(p => p.id)

  const [commentsResult, statusResult] = await Promise.all([
    postIds.length > 0
      ? supabase
          .from('tb_comments')
          .select('*, author:tb_profiles(username, display_name, avatar_url), post:tb_posts(id, title, body)')
          .in('post_id', postIds)
          .neq('author_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20)
      : Promise.resolve({ data: [] }),
    postIds.length > 0
      ? supabase
          .from('tb_posts')
          .select('id, title, body, status, updated_at')
          .in('id', postIds)
          .neq('status', 'open')
          .order('updated_at', { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [] }),
  ])

  const comments = commentsResult.data ?? []
  const statusUpdates = statusResult.data ?? []

  return (
    <div className="notifications-page">
      <div className="feed-header">
        <h1 className="page-title">Notifications</h1>
      </div>

      {comments.length === 0 && statusUpdates.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">All quiet</p>
          <p className="empty-sub">When people comment on your posts, you&apos;ll see it here</p>
        </div>
      ) : (
        <div className="notifications-list">
          {statusUpdates.map(post => (
            <div key={`status-${post.id}`} className="notification-item notification-status">
              <span className="notification-icon">📋</span>
              <div className="notification-content">
                <p>Your post status was updated to <strong>{post.status}</strong></p>
                <p className="notification-context">{post.title ?? post.body.slice(0, 60)}</p>
              </div>
            </div>
          ))}
          {comments.map((comment: { id: string; author?: { display_name?: string | null; username?: string }; body: string; post?: { id?: string; title?: string | null; body?: string } }) => (
            <div key={`comment-${comment.id}`} className="notification-item notification-comment">
              <span className="notification-icon">💬</span>
              <div className="notification-content">
                <p>
                  <strong>{comment.author?.display_name ?? comment.author?.username}</strong>
                  {' '}commented on your post
                </p>
                <p className="notification-context">{comment.body.slice(0, 100)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
