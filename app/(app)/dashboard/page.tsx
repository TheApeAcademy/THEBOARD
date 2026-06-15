import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Dashboard from './Dashboard'
import type { TbPost, TbDrop } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('tb_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'company') redirect('/')

  const { data: drops } = await supabase
    .from('tb_drops')
    .select('*')
    .eq('profile_id', user.id)

  const myDrops = (drops ?? []) as unknown as TbDrop[]
  const dropIds = myDrops.map(d => d.id)

  const { data: posts } = dropIds.length > 0
    ? await supabase
        .from('tb_posts')
        .select(`
          *,
          author:tb_profiles(id, username, display_name, avatar_url)
        `)
        .in('drop_id', dropIds)
        .eq('post_type', 'receipt')
        .order('flame_score', { ascending: false })
        .limit(100)
    : { data: [] }

  const receipts = (posts ?? []) as unknown as TbPost[]

  return (
    <Dashboard
      profile={profile}
      drops={myDrops}
      receipts={receipts}
      currentUserId={user.id}
    />
  )
}
