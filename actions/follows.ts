'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface ActionResult<T = undefined> {
  ok: boolean
  error?: string
  data?: T
}

export async function followUser(targetUserId: string): Promise<ActionResult<{ following: boolean }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }
  if (user.id === targetUserId) return { ok: false, error: 'Cannot follow yourself' }

  const { data: existing } = await supabase
    .from('tb_followers')
    .select('id')
    .eq('follower_id', user.id)
    .eq('following_id', targetUserId)
    .single()

  if (existing) {
    await supabase.from('tb_followers').delete().eq('id', existing.id)
    const { data: p } = await supabase.from('tb_profiles').select('follower_count').eq('id', targetUserId).single()
    if (p) {
      await supabase.from('tb_profiles').update({ follower_count: Math.max(0, (p.follower_count ?? 0) - 1) }).eq('id', targetUserId)
    }
    revalidatePath(`/u/`)
    return { ok: true, data: { following: false } }
  }

  const { error } = await supabase.from('tb_followers').insert({
    follower_id: user.id,
    following_id: targetUserId,
  })

  if (error) return { ok: false, error: error.message }

  const { data: p } = await supabase.from('tb_profiles').select('follower_count').eq('id', targetUserId).single()
  if (p) {
    await supabase.from('tb_profiles').update({ follower_count: (p.follower_count ?? 0) + 1 }).eq('id', targetUserId)
  }

  const { data: myProfile } = await supabase.from('tb_profiles').select('display_name, username').eq('id', user.id).single()
  if (myProfile) {
    await supabase.from('tb_notifications').insert({
      user_id: targetUserId,
      type: 'new_receipt',
      from_profile_id: user.id,
      message: `${myProfile.display_name ?? myProfile.username} started following you`,
    })
  }

  revalidatePath(`/u/`)
  return { ok: true, data: { following: true } }
}
