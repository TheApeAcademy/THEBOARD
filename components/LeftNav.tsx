'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import BluebirdSVG from './BluebirdSVG'
import { createClient } from '@/lib/supabase/client'
import type { TbProfile } from '@/lib/types'
import { avatarLetter } from '@/lib/utils'

interface LeftNavProps {
  profile: TbProfile | null
  unreadCount?: number
}

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: '⊞' },
  { href: '/whats-poppin', label: "What's Poppin", icon: '🔥' },
  { href: '/search', label: 'Search', icon: '🔍' },
  { href: '/notifications', label: 'Notifications', icon: '🔔', showBadge: true },
  { href: '/dashboard', label: 'Dashboard', icon: '📊', companyOnly: true },
]

export default function LeftNav({ profile, unreadCount = 0 }: LeftNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="left-nav">
      <div className="left-nav-inner">
        <Link href="/" className="nav-logo">
          <BluebirdSVG size={36} />
          <span className="nav-logo-text">The Board</span>
        </Link>

        <ul className="nav-list">
          {NAV_ITEMS.map(item => {
            if (item.companyOnly && profile?.role !== 'company') return null
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`nav-item ${pathname === item.href ? 'nav-item-active' : ''}`}
                >
                  <span className="nav-icon-wrap">
                    <span className="nav-icon">{item.icon}</span>
                    {item.showBadge && unreadCount > 0 && (
                      <span className="nav-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                    )}
                  </span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            )
          })}
          {profile && (
            <li>
              <Link
                href={`/u/${profile.username}`}
                className={`nav-item ${pathname === `/u/${profile.username}` ? 'nav-item-active' : ''}`}
              >
                <span className="nav-icon">👤</span>
                <span className="nav-label">Profile</span>
              </Link>
            </li>
          )}
        </ul>

        <Link href="/drops/new" className="btn-drop-receipt">
          Drop a Receipt
        </Link>

        {profile && (
          <div className="nav-user">
            <div className="nav-user-info">
              <div className="nav-avatar">
                {profile.avatar_url
                  ? <img src={profile.avatar_url} alt={profile.display_name ?? profile.username} />
                  : <span>{avatarLetter(profile.display_name ?? profile.username)}</span>
                }
              </div>
              <div className="nav-user-text">
                <span className="nav-display-name">{profile.display_name ?? profile.username}</span>
                <span className="nav-username">@{profile.username}</span>
              </div>
            </div>
            <button className="nav-logout" onClick={handleLogout} title="Log out">
              ↩
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
