'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { PostType, SignalType, PostStatus } from '@/lib/types'
import { fanOutStatusNotification } from './notifications'

interface ActionResult<T = undefined> {
  ok: boolean
  error?: string
  data?: T
}

interface CreatePostInput {
  drop_id: string
  post_type: PostType
  signal_type: SignalType | null
  title: string | null
  body: string
  room_id?: string | null
}

export async function createPost(input: CreatePostInput): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('tb_posts')
    .insert({
      drop_id: input.drop_id,
      author_id: user.id,
      post_type: input.post_type,
      signal_type: input.signal_type,
      title: input.title,
      body: input.body,
      status: 'open',
      hype_count: 0,
      cap_count: 0,
      flame_score: 0,
      is_flame: false,
      room_id: input.room_id ?? null,
    })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }
  revalidatePath('/')
  return { ok: true, data: { id: data.id } }
}

export async function updatePostStatus(postId: string, status: PostStatus, note?: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('tb_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'company') return { ok: false, error: 'Only companies can update status' }

  // Fetch current post for old status + notification context
  const { data: post } = await supabase
    .from('tb_posts')
    .select('id, status, drop_id, title, body')
    .eq('id', postId)
    .single()

  if (!post) return { ok: false, error: 'Post not found' }

  const { error } = await supabase
    .from('tb_posts')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', postId)

  if (error) return { ok: false, error: error.message }

  // Insert status history
  await supabase.from('tb_post_status_history').insert({
    post_id: postId,
    old_status: post.status,
    new_status: status,
    changed_by: user.id,
    note: note ?? null,
  })

  // Fan out notifications to all hypers
  await fanOutStatusNotification(
    supabase,
    postId,
    status,
    post.drop_id,
    user.id,
    post.title,
    post.body,
  )

  revalidatePath(`/p/${postId}`)
  revalidatePath('/dashboard')
  return { ok: true }
}

export async function deletePost(postId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('tb_posts')
    .delete()
    .eq('id', postId)
    .eq('author_id', user.id)

  if (error) return { ok: false, error: error.message }
  revalidatePath('/')
  return { ok: true }
}
