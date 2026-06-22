import { createClient } from '@/lib/supabase/server'
import LeftNav from '@/components/LeftNav'
import RightSidebar from '@/components/RightSidebar'
import MobileNav from '@/components/MobileNav'
import RoomsPanel from '@/components/RoomsPanel'
import { ToastProvider } from '@/components/Toast'
import type { TbPost, TbDrop } from '@/lib/types'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const [profileResult, trendingResult, dropsResult, unreadResult, userRoomsResult, discoveryRoomsResult] = await Promise.all([
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
    user
      ? supabase.from('tb_notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('read', false)
      : Promise.resolve({ count: 0 }),
    user
      ? supabase
          .from('tb_room_members')
          .select('room_id, room:tb_rooms(id, name, description, is_private, drop:tb_drops(id, name, slug, accent_color))')
          .eq('user_id', user.id)
      : Promise.resolve({ data: [] }),
    supabase
      .from('tb_rooms')
      .select('id, name, description, is_private, drop:tb_drops(id, name, slug, accent_color)')
      .eq('is_private', false)
      .limit(12),
  ])

  const profile = profileResult.data
  const trendingPosts = (trendingResult.data ?? []) as unknown as TbPost[]
  const suggestedDrops = (dropsResult.data ?? []) as unknown as TbDrop[]
  const unreadCount = (unreadResult as { count: number | null }).count ?? 0

  type RoomEntry = { id: string; name: string; description: string | null; is_private: boolean; drop: { id: string; name: string; slug: string; accent_color: string } | null }

  const rawUserRooms = (userRoomsResult.data ?? []) as unknown as Array<{ room: RoomEntry | null }>
  const userRooms: RoomEntry[] = rawUserRooms.map(m => m.room).filter(Boolean) as RoomEntry[]
  const userRoomIds = new Set(userRooms.map(r => r.id))

  const allPublic = (discoveryRoomsResult.data ?? []) as unknown as RoomEntry[]
  const discoveryRooms = allPublic.filter(r => !userRoomIds.has(r.id))

  return (
    <ToastProvider>
      <div className="app-layout">
        <LeftNav profile={profile} unreadCount={unreadCount} />
        <main className="main-content">
          {children}
        </main>
        <RightSidebar trendingPosts={trendingPosts} suggestedDrops={suggestedDrops} />
        <MobileNav profile={profile} unreadCount={unreadCount} />
        {user && <RoomsPanel userRooms={userRooms} discoveryRooms={discoveryRooms} />}
      </div>
    </ToastProvider>
  )
}
