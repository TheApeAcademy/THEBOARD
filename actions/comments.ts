'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface ActionResult<T = undefined> {
  ok: boolean
  error?: string
  data?: T
}

export async function createComment(postId: string, body: string, parentId?: string): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }
  if (!body.trim()) return { ok: false, error: 'Comment cannot be empty' }

  const { data: profile } = await supabase
    .from('tb_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const { data, error } = await supabase
    .from('tb_comments')
    .insert({
      post_id: postId,
      author_id: user.id,
      parent_id: parentId ?? null,
      body: body.trim(),
      is_official: profile?.role === 'company',
      hype_count: 0,
    })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }
  revalidatePath(`/p/${postId}`)
  return { ok: true, data: { id: data.id } }
}

export async function deleteComment(commentId: string, postId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('tb_comments')
    .delete()
    .eq('id', commentId)
    .eq('author_id', user.id)

  if (error) return { ok: false, error: error.message }
  revalidatePath(`/p/${postId}`)
  return { ok: true }
}
