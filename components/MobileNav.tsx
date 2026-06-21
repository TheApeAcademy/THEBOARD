'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { TbProfile } from '@/lib/types'
import { avatarLetter } from '@/lib/utils'

interface MobileNavProps {
  profile: TbProfile | null
  unreadCount?: number
}

export default function MobileNav({ profile, unreadCount = 0 }: MobileNavProps) {
  const pathname = usePathname()

  const items = [
    { href: '/', icon: '⊞', label: 'Home' },
    { href: '/whats-poppin', icon: '🔥', label: 'Poppin' },
    { href: '/search', icon: '🔍', label: 'Search' },
    {
      href: '/notifications',
      icon: '🔔',
      label: 'Alerts',
      badge: unreadCount > 0 ? unreadCount : null,
    },
    profile
      ? { href: `/u/${profile.username}`, icon: null, label: 'Profile', isAvatar: true }
      : { href: '/login', icon: '👤', label: 'Sign In' },
  ]

  return (
    <nav className="mobile-nav">
      {items.map(item => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-nav-item ${isActive ? 'mobile-nav-active' : ''}`}
          >
            <div className="mobile-nav-icon-wrap">
              {'isAvatar' in item && item.isAvatar && profile ? (
                <div className="mobile-nav-avatar">
                  {profile.avatar_url
                    ? <img src={profile.avatar_url} alt={profile.display_name ?? profile.username} />
                    : <span>{avatarLetter(profile.display_name ?? profile.username)}</span>
                  }
                </div>
              ) : (
                <span className="mobile-nav-icon">{item.icon}</span>
              )}
              {'badge' in item && item.badge != null && (
                <span className="mobile-nav-badge">{item.badge > 99 ? '99+' : item.badge}</span>
              )}
            </div>
            <span className="mobile-nav-label">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
