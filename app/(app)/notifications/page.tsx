import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import type { TbNotification } from '@/lib/types'

function NotificationIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    status_update: '📋',
    hype_milestone: '🔥',
    comment_reply: '💬',
    official_response: '🏢',
    new_receipt: '🧾',
  }
  return <span className="notif-icon">{icons[type] ?? '🔔'}</span>
}

async function markRead(id: string) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('tb_notifications').update({ read: true }).eq('id', id).eq('user_id', user.id)
  revalidatePath('/notifications')
}

async function markAllRead() {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('tb_notifications').update({ read: true }).eq('user_id', user.id).eq('read', false)
  revalidatePath('/notifications')
}

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('tb_notifications')
    .select('*, from_profile:tb_profiles(username, display_name, avatar_url)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const notifications = (data ?? []) as unknown as TbNotification[]
  const unread = notifications.filter(n => !n.read).length

  return (
    <div className="notifications-page">
      <div className="feed-header">
        <h1 className="page-title">Notifications</h1>
        {unread > 0 && (
          <form action={markAllRead}>
            <button type="submit" className="btn-secondary btn-sm">
              Mark all read
            </button>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">All quiet</p>
          <p className="empty-sub">When your posts get traction you&apos;ll see it here</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map(n => (
            <div key={n.id} className={`notification-item ${n.read ? 'notification-read' : 'notification-unread'}`}>
              <NotificationIcon type={n.type} />
              <div className="notification-content">
                {n.from_profile && (
                  <Link href={`/u/${(n.from_profile as { username: string }).username}`} className="notif-actor">
                    {(n.from_profile as { display_name: string | null; username: string }).display_name ?? (n.from_profile as { username: string }).username}
                  </Link>
                )}
                <p className="notif-message">{n.message}</p>
                <div className="notif-footer">
                  <span className="notif-time">{new Date(n.created_at).toLocaleDateString()}</span>
                  {n.post_id && (
                    <Link href={`/p/${n.post_id}`} className="notif-link">View post →</Link>
                  )}
                  {n.drop_id && !n.post_id && (
                    <Link href={`/d/${n.drop_id}`} className="notif-link">View drop →</Link>
                  )}
                </div>
              </div>
              {!n.read && (
                <form action={markRead.bind(null, n.id)}>
                  <button type="submit" className="notif-mark-read" title="Mark as read">·</button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
