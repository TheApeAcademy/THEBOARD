import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RoomView from './RoomView'
import type { TbRoom, TbPost, TbRoomMember } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function RoomPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: room } = await supabase
    .from('tb_rooms')
    .select('*, drop:tb_drops(id, name, slug, accent_color)')
    .eq('id', id)
    .single()

  if (!room) notFound()

  let myMembership: { role: string } | null = null
  if (user) {
    const { data: membership } = await supabase
      .from('tb_room_members')
      .select('role')
      .eq('room_id', id)
      .eq('user_id', user.id)
      .single()
    myMembership = membership
  }

  // Private rooms require membership
  if (room.is_private && !myMembership) {
    return (
      <div className="room-locked">
        <div className="room-locked-inner">
          <span className="room-locked-icon">🔒</span>
          <h1 className="room-locked-title">Private Room</h1>
          <p className="room-locked-sub">You need an invite to access <strong>{room.name}</strong>.</p>
        </div>
      </div>
    )
  }

  const { data: posts } = await supabase
    .from('tb_posts')
    .select('*, author:tb_profiles(id, username, display_name, avatar_url), drop:tb_drops(id, name, slug, accent_color)')
    .eq('room_id', id)
    .order('created_at', { ascending: true })
    .limit(100)

  const { data: members } = await supabase
    .from('tb_room_members')
    .select('*, profile:tb_profiles(id, username, display_name, avatar_url)')
    .eq('room_id', id)
    .order('joined_at', { ascending: true })
    .limit(30)

  let roomPosts = (posts ?? []) as unknown as TbPost[]
  if (user && roomPosts.length > 0) {
    const { data: votes } = await supabase
      .from('tb_votes')
      .select('post_id, vote_type')
      .eq('user_id', user.id)
      .in('post_id', roomPosts.map(p => p.id))
    if (votes) {
      const voteMap = Object.fromEntries(votes.map(v => [v.post_id, v.vote_type]))
      roomPosts = roomPosts.map(p => ({ ...p, user_vote: voteMap[p.id] ?? null }))
    }
  }

  return (
    <RoomView
      room={room as unknown as TbRoom}
      posts={roomPosts}
      members={(members ?? []) as unknown as TbRoomMember[]}
      currentUserId={user?.id}
      myRole={myMembership?.role ?? null}
    />
  )
}
