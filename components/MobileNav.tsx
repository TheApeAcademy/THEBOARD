'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { TbProfile } from '@/lib/types'

interface MobileNavProps {
  profile: TbProfile | null
}

export default function MobileNav({ profile }: MobileNavProps) {
  const pathname = usePathname()

  const items = [
    { href: '/home', icon: '⊞', label: 'Home' },
    { href: '/whats-poppin', icon: '🔥', label: 'Poppin' },
    { href: '/drops/new', icon: '+', label: 'Post', isPrimary: true },
    { href: '/notifications', icon: '🔔', label: 'Alerts' },
    { href: profile ? `/u/${profile.username}` : '/login', icon: '👤', label: 'Profile' },
  ]

  return (
    <nav className="mobile-nav">
      {items.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={`mobile-nav-item ${item.isPrimary ? 'mobile-nav-primary' : ''} ${pathname === item.href ? 'mobile-nav-active' : ''}`}
        >
          <span className="mobile-nav-icon">{item.icon}</span>
          <span className="mobile-nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}
