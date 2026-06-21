import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/PostCard'
import CommentThread from '@/components/CommentThread'
import type { TbPost, TbComment, TbPostStatusHistory } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  seen: 'Seen 👀',
  planned: 'Planned 📋',
  building: 'Building 🔨',
  built: 'Built ✅',
  rip: "Won't Build 💀",
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const [postResult, commentsResult, historyResult] = await Promise.all([
    supabase
      .from('tb_posts')
      .select(`
        *,
        author:tb_profiles(id, username, display_name, avatar_url, hype_score),
        drop:tb_drops(id, name, slug, accent_color)
      `)
      .eq('id', id)
      .single(),
    supabase
      .from('tb_comments')
      .select('*, author:tb_profiles(id, username, display_name, avatar_url, role)')
      .eq('post_id', id)
      .order('created_at', { ascending: true }),
    supabase
      .from('tb_post_status_history')
      .select('*, changer:tb_profiles(username, display_name)')
      .eq('post_id', id)
      .order('created_at', { ascending: true }),
  ])

  if (!postResult.data) notFound()

  let post = postResult.data as unknown as TbPost
  const comments = (commentsResult.data ?? []) as unknown as TbComment[]
  const history = (historyResult.data ?? []) as unknown as TbPostStatusHistory[]

  if (user) {
    const { data: vote } = await supabase
      .from('tb_votes')
      .select('vote_type')
      .eq('post_id', id)
      .eq('user_id', user.id)
      .single()
    post = { ...post, user_vote: vote?.vote_type ?? null }
  }

  const { data: profile } = user
    ? await supabase.from('tb_profiles').select('*').eq('id', user.id).single()
    : { data: null }

  return (
    <div className="post-detail-page">
      <div className="detail-header">
        <a href="javascript:history.back()" className="back-btn">← Back</a>
        <h2 className="detail-label">Post</h2>
      </div>

      <PostCard post={post} currentUserId={user?.id} />

      {history.length > 0 && (
        <div className="status-timeline">
          <h3 className="timeline-title">Status Timeline</h3>
          <div className="timeline-track">
            {history.map((h, i) => (
              <div key={h.id} className="timeline-event">
                <div className="timeline-dot" />
                {i < history.length - 1 && <div className="timeline-line" />}
                <div className="timeline-content">
                  <div className="timeline-status">
                    {h.old_status && (
                      <span className="timeline-old">{STATUS_LABELS[h.old_status] ?? h.old_status}</span>
                    )}
                    <span className="timeline-arrow">→</span>
                    <span className="timeline-new">{STATUS_LABELS[h.new_status] ?? h.new_status}</span>
                  </div>
                  {h.note && <p className="timeline-note">{h.note}</p>}
                  <span className="timeline-meta">
                    {h.changer ? `by ${(h.changer as { display_name: string | null; username: string }).display_name ?? (h.changer as { username: string }).username} · ` : ''}
                    {new Date(h.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="detail-divider" />

      <CommentThread
        comments={comments}
        postId={id}
        currentUserId={user?.id}
        currentProfile={profile}
      />
    </div>
  )
}
