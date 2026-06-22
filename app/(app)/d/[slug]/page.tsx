import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DropPage from './DropPage'
import type { TbPost, TbDrop, TbRoom } from '@/lib/types'

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

  const [postsResult, tapInResult, roomsResult] = await Promise.all([
    supabase
      .from('tb_posts')
      .select(`
        *,
        author:tb_profiles(id, username, display_name, avatar_url),
        drop:tb_drops(id, name, slug, accent_color)
      `)
      .eq('drop_id', drop.id)
      .is('room_id', null)
      .order('flame_score', { ascending: false })
      .limit(30),
    user
      ? supabase.from('tb_tap_ins').select('id').eq('user_id', user.id).eq('drop_id', drop.id).single()
      : Promise.resolve({ data: null }),
    supabase
      .from('tb_rooms')
      .select('*')
      .eq('drop_id', drop.id)
      .eq('is_private', false)
      .order('created_at', { ascending: true }),
  ])

  let posts = (postsResult.data ?? []) as unknown as TbPost[]
  const publicRooms = (roomsResult.data ?? []) as unknown as TbRoom[]

  // Also fetch private rooms user is a member of
  let myPrivateRooms: TbRoom[] = []
  if (user) {
    const { data: memberships } = await supabase
      .from('tb_room_members')
      .select('room_id, role')
      .eq('user_id', user.id)

    if (memberships && memberships.length > 0) {
      const memberRoomIds = memberships.map(m => m.room_id)
      const { data: privateRooms } = await supabase
        .from('tb_rooms')
        .select('*')
        .eq('drop_id', drop.id)
        .eq('is_private', true)
        .in('id', memberRoomIds)
        .order('created_at', { ascending: true })

      myPrivateRooms = (privateRooms ?? []) as unknown as TbRoom[]
    }
  }

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

  const isOwner = user && drop.profile_id === user.id

  return (
    <DropPage
      drop={drop as unknown as TbDrop}
      posts={posts}
      currentUserId={user?.id}
      isTappedIn={!!tapInResult?.data}
      publicRooms={publicRooms}
      myPrivateRooms={myPrivateRooms}
      isOwner={!!isOwner}
    />
  )
}
