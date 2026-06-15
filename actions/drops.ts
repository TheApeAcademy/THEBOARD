'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { generateSlug } from '@/lib/utils'

interface ActionResult<T = undefined> {
  ok: boolean
  error?: string
  data?: T
}

interface CreateDropInput {
  name: string
  description?: string
  accent_color?: string
}

export async function createDrop(input: CreateDropInput): Promise<ActionResult<{ slug: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('tb_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'company') return { ok: false, error: 'Only companies can create Drops' }

  const baseSlug = generateSlug(input.name)
  let slug = baseSlug
  let attempt = 0
  while (attempt < 5) {
    const { data: existing } = await supabase.from('tb_drops').select('id').eq('slug', slug).single()
    if (!existing) break
    attempt++
    slug = `${baseSlug}-${attempt}`
  }

  const { data, error } = await supabase
    .from('tb_drops')
    .insert({
      profile_id: user.id,
      name: input.name,
      slug,
      description: input.description ?? null,
      accent_color: input.accent_color ?? '#1D9BF0',
      banner_url: null,
      widgets: [],
      verified: false,
      tap_in_count: 0,
      health_score: 0,
    })
    .select('slug')
    .single()

  if (error) return { ok: false, error: error.message }
  revalidatePath('/')
  return { ok: true, data: { slug: data.slug } }
}

export async function tapIn(dropId: string): Promise<ActionResult<{ tapped: boolean }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { data: existing } = await supabase
    .from('tb_tap_ins')
    .select('id')
    .eq('user_id', user.id)
    .eq('drop_id', dropId)
    .single()

  if (existing) {
    const { error } = await supabase.from('tb_tap_ins').delete().eq('id', existing.id)
    if (error) return { ok: false, error: error.message }
    return { ok: true, data: { tapped: false } }
  } else {
    const { error } = await supabase.from('tb_tap_ins').insert({ user_id: user.id, drop_id: dropId })
    if (error) return { ok: false, error: error.message }
    return { ok: true, data: { tapped: true } }
  }
}

export async function updateDrop(dropId: string, updates: { name?: string; description?: string; accent_color?: string; banner_url?: string }): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('tb_drops')
    .update(updates)
    .eq('id', dropId)
    .eq('profile_id', user.id)

  if (error) return { ok: false, error: error.message }
  revalidatePath('/')
  return { ok: true }
}
