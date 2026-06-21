import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EmbedWidget from './EmbedWidget'
import type { TbPost, TbDrop } from '@/lib/types'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function EmbedPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: drop } = await supabase
    .from('tb_drops')
    .select('id, name, slug, accent_color, description')
    .eq('slug', slug)
    .single()

  if (!drop) notFound()

  const { data: posts } = await supabase
    .from('tb_posts')
    .select('id, title, body, hype_count, signal_type, status')
    .eq('drop_id', drop.id)
    .is('room_id', null)
    .order('flame_score', { ascending: false })
    .limit(3)

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <EmbedWidget
      drop={drop as unknown as TbDrop}
      topPosts={(posts ?? []) as unknown as TbPost[]}
      userId={user?.id}
    />
  )
}
