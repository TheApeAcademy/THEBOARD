import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import UserProfile from './UserProfile'
import type { TbPost, TbProfile } from '@/lib/types'

interface Props {
  params: Promise<{ username: string }>
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('tb_profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) notFound()

  const { data: posts } = await supabase
    .from('tb_posts')
    .select(`
      *,
      author:tb_profiles(id, username, display_name, avatar_url),
      drop:tb_drops(id, name, slug, accent_color)
    `)
    .eq('author_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(30)

  let userPosts = (posts ?? []) as unknown as TbPost[]

  if (user && userPosts.length > 0) {
    const { data: votes } = await supabase
      .from('tb_votes')
      .select('post_id, vote_type')
      .eq('user_id', user.id)
      .in('post_id', userPosts.map(p => p.id))
    if (votes) {
      const voteMap = Object.fromEntries(votes.map(v => [v.post_id, v.vote_type]))
      userPosts = userPosts.map(p => ({ ...p, user_vote: voteMap[p.id] ?? null }))
    }
  }

  const isOwnProfile = user?.id === profile.id

  let isFollowing = false
  if (user && !isOwnProfile) {
    const { data: followRow } = await supabase
      .from('tb_followers')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', profile.id)
      .single()
    isFollowing = !!followRow
  }

  return (
    <UserProfile
      profile={profile as TbProfile}
      posts={userPosts}
      currentUserId={user?.id}
      isOwnProfile={isOwnProfile}
      isFollowing={isFollowing}
    />
  )
}
