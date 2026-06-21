'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { RoomRole } from '@/lib/types'

interface ActionResult<T = undefined> {
  ok: boolean
  error?: string
  data?: T
}

export async function createRoom(dropId: string, name: string, description: string | null, isPrivate: boolean): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  // Verify the user owns this Drop
  const { data: drop } = await supabase
    .from('tb_drops')
    .select('id')
    .eq('id', dropId)
    .eq('profile_id', user.id)
    .single()

  if (!drop) return { ok: false, error: 'You do not own this Drop' }

  const { data, error } = await supabase
    .from('tb_rooms')
    .insert({
      drop_id: dropId,
      name,
      description,
      is_private: isPrivate,
      created_by: user.id,
    })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }

  // Auto-add creator as owner
  await supabase.from('tb_room_members').insert({
    room_id: data.id,
    user_id: user.id,
    role: 'owner',
  })

  revalidatePath(`/d/${dropId}`)
  return { ok: true, data: { id: data.id } }
}

export async function joinRoom(roomId: string): Promise<ActionResult<{ joined: boolean }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  // Check room is public
  const { data: room } = await supabase
    .from('tb_rooms')
    .select('id, is_private')
    .eq('id', roomId)
    .single()

  if (!room) return { ok: false, error: 'Room not found' }
  if (room.is_private) return { ok: false, error: 'This is a private room — you need an invite' }

  const { data: existing } = await supabase
    .from('tb_room_members')
    .select('id')
    .eq('room_id', roomId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    await supabase.from('tb_room_members').delete().eq('id', existing.id)
    return { ok: true, data: { joined: false } }
  }

  const { error } = await supabase.from('tb_room_members').insert({
    room_id: roomId,
    user_id: user.id,
    role: 'member',
  })

  if (error) return { ok: false, error: error.message }
  return { ok: true, data: { joined: true } }
}

export async function inviteToRoom(roomId: string, username: string, role: RoomRole = 'member'): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  // Verify inviter is owner or team
  const { data: myMembership } = await supabase
    .from('tb_room_members')
    .select('role')
    .eq('room_id', roomId)
    .eq('user_id', user.id)
    .single()

  if (!myMembership || !['owner', 'team'].includes(myMembership.role)) {
    return { ok: false, error: 'Only room owners and team members can invite' }
  }

  const { data: targetProfile } = await supabase
    .from('tb_profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (!targetProfile) return { ok: false, error: `User @${username} not found` }

  const { error } = await supabase.from('tb_room_members').upsert({
    room_id: roomId,
    user_id: targetProfile.id,
    role,
  }, { onConflict: 'room_id,user_id' })

  if (error) return { ok: false, error: error.message }

  // Notify the invited user
  const { data: room } = await supabase
    .from('tb_rooms')
    .select('name, drop:tb_drops(name, slug)')
    .eq('id', roomId)
    .single()

  if (room) {
    const dropName = (room.drop as unknown as { name: string; slug: string } | null)?.name ?? 'a Drop'
    await supabase.from('tb_notifications').insert({
      user_id: targetProfile.id,
      type: 'new_receipt',
      drop_id: null,
      post_id: null,
      from_profile_id: user.id,
      message: `You've been invited to the "${room.name}" room in ${dropName}`,
    })
  }

  revalidatePath('/dashboard')
  return { ok: true }
}

export async function updateMemberRole(roomId: string, memberId: string, role: RoomRole): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { data: myMembership } = await supabase
    .from('tb_room_members')
    .select('role')
    .eq('room_id', roomId)
    .eq('user_id', user.id)
    .single()

  if (myMembership?.role !== 'owner') return { ok: false, error: 'Only owners can change roles' }

  const { error } = await supabase
    .from('tb_room_members')
    .update({ role })
    .eq('room_id', roomId)
    .eq('user_id', memberId)

  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard')
  return { ok: true }
}
