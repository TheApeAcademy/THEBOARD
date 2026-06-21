'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import type { TbDrop, TbPost, TbRoom } from '@/lib/types'
import PostCard from '@/components/PostCard'
import ComposeModal from '@/components/ComposeModal'
import StatusPill from '@/components/StatusPill'
import SignalBadge from '@/components/SignalBadge'
import { tapIn } from '@/actions/drops'
import { useToast } from '@/components/Toast'
import { formatCount } from '@/lib/utils'
import type { SignalType, PostStatus } from '@/lib/types'

interface DropPageProps {
  drop: TbDrop & { profile?: { username: string; display_name: string | null; avatar_url: string | null; role: string } | null }
  posts: TbPost[]
  currentUserId?: string
  isTappedIn: boolean
  publicRooms: TbRoom[]
  myPrivateRooms: TbRoom[]
  isOwner: boolean
}

type DropTab = 'board' | 'receipts' | 'rooms'
const SIGNAL_FILTERS: (SignalType | 'all')[] = ['all', 'wishlist', 'glitch', 'no_cap', 'big_brain']
const STATUS_FILTERS: (PostStatus | 'all')[] = ['all', 'open', 'seen', 'planned', 'building', 'built', 'rip']

export default function DropPage({
  drop,
  posts,
  currentUserId,
  isTappedIn: initialTappedIn,
  publicRooms,
  myPrivateRooms,
  isOwner,
}: DropPageProps) {
  const [tab, setTab] = useState<DropTab>('board')
  const [tapped, setTapped] = useState(initialTappedIn)
  const [tapCount, setTapCount] = useState(drop.tap_in_count)
  const [showCompose, setShowCompose] = useState(false)
  const [signalFilter, setSignalFilter] = useState<SignalType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all')
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  function handleTapIn() {
    if (!currentUserId) { toast('Log in to tap in', 'error'); return }
    const prev = tapped
    const prevCount = tapCount
    setTapped(!tapped)
    setTapCount(c => tapped ? c - 1 : c + 1)

    startTransition(async () => {
      const result = await tapIn(drop.id)
      if (!result.ok) {
        setTapped(prev)
        setTapCount(prevCount)
        toast(result.error ?? 'Failed', 'error')
      } else {
        toast(result.data?.tapped ? 'Tapped in! 🎯' : 'Tapped out', 'info')
      }
    })
  }

  const filteredPosts = posts
    .filter(p => tab === 'receipts' ? p.post_type === 'receipt' : true)
    .filter(p => signalFilter === 'all' || p.signal_type === signalFilter)
    .filter(p => statusFilter === 'all' || p.status === statusFilter)

  const allRooms = [...publicRooms, ...myPrivateRooms]

  return (
    <div className="drop-page">
      {/* Unclaimed banner */}
      {!drop.is_claimed && (
        <div className="unclaimed-banner">
          <span className="unclaimed-icon">⚠️</span>
          <div className="unclaimed-text">
            <strong>This Drop is unclaimed</strong>
            <span> — Are you from {drop.name}? </span>
            <Link href={`/claim/${drop.slug}`} className="unclaimed-cta">Claim this Drop →</Link>
          </div>
        </div>
      )}

      <div
        className="drop-banner"
        style={{
          backgroundColor: drop.banner_url ? undefined : drop.accent_color + '22',
          backgroundImage: drop.banner_url ? `url(${drop.banner_url})` : undefined,
          borderBottom: `3px solid ${drop.accent_color}`,
        }}
      >
        <div className="drop-header-content">
          <div className="drop-accent-circle" style={{ backgroundColor: drop.accent_color }} />
          <div className="drop-info">
            <div className="drop-name-row">
              <h1 className="drop-name">{drop.name}</h1>
              {drop.verified && <span className="verified-badge">✓ Verified</span>}
              {!drop.is_claimed && <span className="unclaimed-pill">Unclaimed</span>}
            </div>
            {drop.description && <p className="drop-description">{drop.description}</p>}
            <div className="drop-stats">
              <span>{formatCount(tapCount)} tapped in</span>
              <span>{formatCount(posts.length)} posts</span>
              <span>Health: {drop.health_score}%</span>
            </div>
          </div>
          <div className="drop-actions">
            <button
              className={`tap-in-btn ${tapped ? 'tapped' : ''}`}
              onClick={handleTapIn}
              disabled={isPending}
              style={{ borderColor: drop.accent_color, color: tapped ? '#fff' : drop.accent_color, backgroundColor: tapped ? drop.accent_color : 'transparent' }}
            >
              {tapped ? '✓ Tapped In' : '+ Tap In'}
            </button>
            {currentUserId && (
              <button className="btn-primary" onClick={() => setShowCompose(true)}>
                Drop Receipt
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="drop-content">
        <div className="feed-tabs">
          {(['board', 'receipts', 'rooms'] as DropTab[]).map(t => (
            <button
              key={t}
              className={`feed-tab ${tab === t ? 'feed-tab-active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'board' ? 'All Posts' : t === 'receipts' ? 'Receipts Only' : `Rooms${allRooms.length > 0 ? ` (${allRooms.length})` : ''}`}
            </button>
          ))}
        </div>

        {tab === 'rooms' ? (
          <div className="rooms-list">
            {isOwner && (
              <div className="rooms-manage-hint">
                <Link href="/dashboard" className="btn-secondary btn-sm">Manage Rooms →</Link>
              </div>
            )}
            {allRooms.length === 0 ? (
              <div className="empty-state">
                <p className="empty-title">No rooms yet</p>
                <p className="empty-sub">{isOwner ? 'Create private rooms for your team or VIP members' : 'No public rooms for this Drop yet'}</p>
              </div>
            ) : (
              allRooms.map(room => (
                <div key={room.id} className="room-card">
                  <div className="room-card-info">
                    <div className="room-name-row">
                      <span className="room-icon">{room.is_private ? '🔒' : '#'}</span>
                      <h3 className="room-name">{room.name}</h3>
                      {room.is_private && <span className="room-private-badge">Private</span>}
                    </div>
                    {room.description && <p className="room-description">{room.description}</p>}
                  </div>
                  <Link href={`/rooms/${room.id}`} className="btn-secondary btn-sm">
                    Enter Room →
                  </Link>
                </div>
              ))
            )}
          </div>
        ) : (
          <>
            <div className="drop-filters">
              <div className="filter-row">
                {SIGNAL_FILTERS.map(s => (
                  <button
                    key={s}
                    className={`filter-chip ${signalFilter === s ? 'filter-chip-active' : ''}`}
                    onClick={() => setSignalFilter(s)}
                  >
                    {s === 'all' ? 'All Signals' : <SignalBadge type={s as SignalType} />}
                  </button>
                ))}
              </div>
              <div className="filter-row">
                {STATUS_FILTERS.map(s => (
                  <button
                    key={s}
                    className={`filter-chip ${statusFilter === s ? 'filter-chip-active' : ''}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s === 'all' ? 'All Status' : <StatusPill status={s as PostStatus} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="feed-list">
              {filteredPosts.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-title">No posts here yet</p>
                  <p className="empty-sub">Be the first to drop a Receipt for {drop.name}</p>
                </div>
              ) : (
                filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} currentUserId={currentUserId} showDrop={false} />
                ))
              )}
            </div>
          </>
        )}
      </div>

      {showCompose && (
        <ComposeModal
          drops={[drop]}
          defaultDropId={drop.id}
          onClose={() => setShowCompose(false)}
        />
      )}
    </div>
  )
}
