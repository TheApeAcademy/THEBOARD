import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/PostCard'
import CommentThread from '@/components/CommentThread'
import type { TbPost, TbComment } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const [postResult, commentsResult] = await Promise.all([
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
  ])

  if (!postResult.data) notFound()

  let post = postResult.data as unknown as TbPost
  const comments = (commentsResult.data ?? []) as unknown as TbComment[]

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
