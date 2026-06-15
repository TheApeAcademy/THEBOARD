import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DropPage from './DropPage'
import type { TbPost, TbDrop } from '@/lib/types'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function DropRoute({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: drop } = await supabase
    .from('tb_drops')
    .select('*, profile:tb_profiles(username, display_name, avatar_url, role)')
    .eq('slug', slug)
    .single()

  if (!drop) notFound()

  const [postsResult, tapInResult] = await Promise.all([
    supabase
      .from('tb_posts')
      .select(`
        *,
        author:tb_profiles(id, username, display_name, avatar_url),
        drop:tb_drops(id, name, slug, accent_color)
      `)
      .eq('drop_id', drop.id)
      .order('flame_score', { ascending: false })
      .limit(30),
    user
      ? supabase.from('tb_tap_ins').select('id').eq('user_id', user.id).eq('drop_id', drop.id).single()
      : Promise.resolve({ data: null }),
  ])

  let posts = (postsResult.data ?? []) as unknown as TbPost[]

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

  return (
    <DropPage
      drop={drop as unknown as TbDrop}
      posts={posts}
      currentUserId={user?.id}
      isTappedIn={!!tapInResult?.data}
    />
  )
}
