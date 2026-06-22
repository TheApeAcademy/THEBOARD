'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { generateSlug } from '@/lib/utils'

interface ActionResult<T = undefined> {
  ok: boolean
  error?: string
  data?: T
}

export async function suggestDrop(name: string): Promise<ActionResult<{ slug: string; isNew: boolean }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const baseSlug = generateSlug(name)

  // Check if a drop with this slug already exists
  const { data: existing } = await supabase
    .from('tb_drops')
    .select('id, slug, is_claimed')
    .eq('slug', baseSlug)
    .single()

  if (existing) {
    // Record the tag regardless
    await supabase.from('tb_company_tags').insert({
      drop_id: existing.id,
      tagger_id: user.id,
      tagged_on: 'in_app',
    })
    return { ok: true, data: { slug: existing.slug, isNew: false } }
  }

  // Create a new unclaimed shadow Drop
  const { data, error } = await supabase
    .from('tb_drops')
    .insert({
      profile_id: null,
      name,
      slug: baseSlug,
      accent_color: '#1D9BF0',
      widgets: [],
      verified: false,
      tap_in_count: 0,
      health_score: 0,
      is_claimed: false,
      suggested_by: user.id,
    })
    .select('id, slug')
    .single()

  if (error) return { ok: false, error: error.message }

  await supabase.from('tb_company_tags').insert({
    drop_id: data.id,
    tagger_id: user.id,
    tagged_on: 'in_app',
  })

  revalidatePath('/')
  return { ok: true, data: { slug: data.slug, isNew: true } }
}

export async function claimDrop(slug: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('tb_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'company') return { ok: false, error: 'Only companies can claim Drops' }

  // Check the drop is unclaimed
  const { data: drop } = await supabase
    .from('tb_drops')
    .select('id, is_claimed, profile_id')
    .eq('slug', slug)
    .single()

  if (!drop) return { ok: false, error: 'Drop not found' }
  if (drop.is_claimed) return { ok: false, error: 'This Drop has already been claimed' }

  const { error } = await supabase
    .from('tb_drops')
    .update({
      profile_id: user.id,
      is_claimed: true,
      claimed_at: new Date().toISOString(),
    })
    .eq('id', drop.id)

  if (error) return { ok: false, error: error.message }

  revalidatePath(`/d/${slug}`)
  revalidatePath('/dashboard')
  return { ok: true }
}

export async function searchDrops(query: string): Promise<ActionResult<Array<{ id: string; name: string; slug: string; accent_color: string; is_claimed: boolean }>>> {
  const supabase = await createClient()

  if (!query.trim()) return { ok: true, data: [] }

  const { data, error } = await supabase
    .from('tb_drops')
    .select('id, name, slug, accent_color, is_claimed')
    .ilike('name', `%${query}%`)
    .order('tap_in_count', { ascending: false })
    .limit(10)

  if (error) return { ok: false, error: error.message }
  return { ok: true, data: data ?? [] }
}
