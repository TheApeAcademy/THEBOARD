'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface ActionResult<T = undefined> {
  ok: boolean
  error?: string
  data?: T
}

export async function markNotificationRead(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('tb_notifications')
    .update({ read: true })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { ok: false, error: error.message }
  revalidatePath('/notifications')
  return { ok: true }
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('tb_notifications')
    .update({ read: true })
    .eq('user_id', user.id)
    .eq('read', false)

  if (error) return { ok: false, error: error.message }
  revalidatePath('/notifications')
  return { ok: true }
}

export async function getUnreadCount(): Promise<ActionResult<number>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: true, data: 0 }

  const { count, error } = await supabase
    .from('tb_notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('read', false)

  if (error) return { ok: false, error: error.message }
  return { ok: true, data: count ?? 0 }
}

// Internal: called from updatePostStatus and castVote actions
export async function fanOutStatusNotification(
  supabase: Awaited<ReturnType<typeof createClient>>,
  postId: string,
  newStatus: string,
  dropId: string,
  changerProfileId: string,
  postTitle: string | null,
  postBody: string,
): Promise<void> {
  const { data: hypers } = await supabase
    .from('tb_votes')
    .select('user_id')
    .eq('post_id', postId)
    .eq('vote_type', 'hype')
    .neq('user_id', changerProfileId)

  if (!hypers || hypers.length === 0) return

  const preview = postTitle ?? postBody.slice(0, 60)
  const statusLabel: Record<string, string> = {
    seen: 'Seen 👀',
    planned: 'Planned 📋',
    building: 'Building 🔨',
    built: 'Built ✅',
    rip: 'Won\'t Build 💀',
  }
  const label = statusLabel[newStatus] ?? newStatus

  const notifications = hypers.map(h => ({
    user_id: h.user_id,
    type: 'status_update' as const,
    post_id: postId,
    drop_id: dropId,
    from_profile_id: changerProfileId,
    message: `"${preview}" is now ${label}`,
    read: false,
  }))

  await supabase.from('tb_notifications').insert(notifications)
}

export async function fanOutHypeMilestone(
  supabase: Awaited<ReturnType<typeof createClient>>,
  postId: string,
  dropId: string,
  authorId: string,
  hyperProfileId: string,
  hypeCount: number,
  postTitle: string | null,
  postBody: string,
): Promise<void> {
  const milestones = [50, 100, 250, 500, 1000]
  if (!milestones.includes(hypeCount)) return

  const preview = postTitle ?? postBody.slice(0, 60)

  await supabase.from('tb_notifications').insert({
    user_id: authorId,
    type: 'hype_milestone',
    post_id: postId,
    drop_id: dropId,
    from_profile_id: hyperProfileId,
    message: `🔥 "${preview}" just hit ${hypeCount} Hype!`,
    read: false,
  })
}
