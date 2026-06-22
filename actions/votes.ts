'use server'

import { createClient } from '@/lib/supabase/server'
import { fanOutHypeMilestone } from './notifications'
import type { VoteType } from '@/lib/types'

interface ActionResult {
  ok: boolean
  error?: string
}

export async function castVote(postId: string, voteType: VoteType): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  const { data: existing } = await supabase
    .from('tb_votes')
    .select('id, vote_type')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    if (existing.vote_type === voteType) {
      const { error } = await supabase.from('tb_votes').delete().eq('id', existing.id)
      if (error) return { ok: false, error: error.message }
    } else {
      const { error } = await supabase.from('tb_votes').update({ vote_type: voteType }).eq('id', existing.id)
      if (error) return { ok: false, error: error.message }
    }
  } else {
    const { error } = await supabase.from('tb_votes').insert({ post_id: postId, user_id: user.id, vote_type: voteType })
    if (error) return { ok: false, error: error.message }
  }

  // Check hype milestones after a hype vote (not cap, not removal)
  if (voteType === 'hype' && !existing) {
    const { data: post } = await supabase
      .from('tb_posts')
      .select('hype_count, drop_id, author_id, title, body')
      .eq('id', postId)
      .single()

    if (post && post.author_id !== user.id) {
      const newCount = post.hype_count + 1
      await fanOutHypeMilestone(
        supabase,
        postId,
        post.drop_id,
        post.author_id,
        user.id,
        newCount,
        post.title,
        post.body,
      )
    }
  }

  return { ok: true }
}
