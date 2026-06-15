import Link from 'next/link'
import type { TbPost, TbDrop } from '@/lib/types'
import { formatCount } from '@/lib/utils'
import SignalBadge from './SignalBadge'

interface RightSidebarProps {
  trendingPosts?: TbPost[]
  suggestedDrops?: TbDrop[]
}

export default function RightSidebar({ trendingPosts = [], suggestedDrops = [] }: RightSidebarProps) {
  return (
    <aside className="right-sidebar">
      <div className="sidebar-search">
        <input
          type="search"
          className="search-input"
          placeholder="Search The Board"
        />
      </div>

      {trendingPosts.length > 0 && (
        <div className="sidebar-widget">
          <h3 className="widget-title">🔥 What&apos;s Poppin</h3>
          <ul className="widget-list">
            {trendingPosts.map(post => (
              <li key={post.id} className="widget-post">
                <Link href={`/p/${post.id}`} className="widget-post-link">
                  <div className="widget-post-meta">
                    {post.signal_type && <SignalBadge type={post.signal_type} />}
                    <span className="widget-drop-name">{post.drop?.name}</span>
                  </div>
                  <p className="widget-post-body">{post.body.slice(0, 80)}{post.body.length > 80 ? '…' : ''}</p>
                  <span className="widget-hype">{formatCount(post.hype_count)} hype</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {suggestedDrops.length > 0 && (
        <div className="sidebar-widget">
          <h3 className="widget-title">Drops to Tap In</h3>
          <ul className="widget-list">
            {suggestedDrops.map(drop => (
              <li key={drop.id} className="widget-drop">
                <Link href={`/d/${drop.slug}`} className="widget-drop-link">
                  <div className="widget-drop-accent" style={{ backgroundColor: drop.accent_color }} />
                  <div className="widget-drop-info">
                    <span className="widget-drop-title">{drop.name}</span>
                    <span className="widget-drop-count">{formatCount(drop.tap_in_count)} tapped in</span>
                  </div>
                  <span className="widget-tap-in-btn">Tap In</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="sidebar-footer">
        <span>© 2025 The Board</span>
      </div>
    </aside>
  )
}
