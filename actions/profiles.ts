'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface ActionResult {
  ok: boolean
  error?: string
}

export async function updateProfile(updates: {
  display_name?: string
  bio?: string
  avatar_url?: string
}): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('tb_profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) return { ok: false, error: error.message }
  revalidatePath(`/`)
  return { ok: true }
}
