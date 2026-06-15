import { createClient } from '@/lib/supabase/server'
import LeftNav from '@/components/LeftNav'
import RightSidebar from '@/components/RightSidebar'
import MobileNav from '@/components/MobileNav'
import { ToastProvider } from '@/components/Toast'
import type { TbPost, TbDrop } from '@/lib/types'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const [profileResult, trendingResult, dropsResult] = await Promise.all([
    user
      ? supabase.from('tb_profiles').select('*').eq('id', user.id).single()
      : Promise.resolve({ data: null }),
    supabase
      .from('tb_posts')
      .select('*, drop:tb_drops(name, slug, accent_color), author:tb_profiles(username, display_name, avatar_url)')
      .order('flame_score', { ascending: false })
      .limit(5),
    supabase
      .from('tb_drops')
      .select('*')
      .order('tap_in_count', { ascending: false })
      .limit(5),
  ])

  const profile = profileResult.data
  const trendingPosts = (trendingResult.data ?? []) as unknown as TbPost[]
  const suggestedDrops = (dropsResult.data ?? []) as unknown as TbDrop[]

  return (
    <ToastProvider>
      <div className="app-layout">
        <LeftNav profile={profile} />
        <main className="main-content">
          {children}
        </main>
        <RightSidebar trendingPosts={trendingPosts} suggestedDrops={suggestedDrops} />
        <MobileNav profile={profile} />
      </div>
    </ToastProvider>
  )
}
