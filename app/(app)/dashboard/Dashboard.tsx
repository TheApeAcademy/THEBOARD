'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import type { TbPost, TbDrop, TbProfile, SignalType, PostStatus } from '@/lib/types'
import PostCard from '@/components/PostCard'
import StatusPill from '@/components/StatusPill'
import SignalBadge from '@/components/SignalBadge'
import FlameBadge from '@/components/FlameBadge'
import { updatePostStatus } from '@/actions/posts'
import { useToast } from '@/components/Toast'
import { formatCount } from '@/lib/utils'

interface DashboardProps {
  profile: TbProfile
  drops: TbDrop[]
  receipts: TbPost[]
  currentUserId: string
}

const SIGNAL_FILTERS: (SignalType | 'all')[] = ['all', 'wishlist', 'glitch', 'no_cap', 'big_brain']
const STATUSES: PostStatus[] = ['open', 'seen', 'planned', 'building', 'built', 'rip']

export default function Dashboard({ profile, drops, receipts, currentUserId }: DashboardProps) {
  const [selectedDrop, setSelectedDrop] = useState<string>('all')
  const [signalFilter, setSignalFilter] = useState<SignalType | 'all'>('all')
  const [updatingPost, setUpdatingPost] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const filtered = receipts
    .filter(r => selectedDrop === 'all' || r.drop_id === selectedDrop)
    .filter(r => signalFilter === 'all' || r.signal_type === signalFilter)

  const totalHype = receipts.reduce((acc, r) => acc + r.hype_count, 0)
  const flameCount = receipts.filter(r => r.is_flame).length

  function handleStatusChange(postId: string, status: PostStatus) {
    startTransition(async () => {
      const result = await updatePostStatus(postId, status)
      if (result.ok) {
        toast(`Status → ${status}`, 'success')
        setUpdatingPost(null)
      } else {
        toast(result.error ?? 'Failed', 'error')
      }
    })
  }

  function exportCSV() {
    const rows = [
      ['ID', 'Signal', 'Title', 'Body', 'Hype', 'Cap', 'Flame Score', 'Status', 'Created'].join(','),
      ...filtered.map(r => [
        r.id,
        r.signal_type ?? '',
        `"${(r.title ?? '').replace(/"/g, '""')}"`,
        `"${r.body.replace(/"/g, '""')}"`,
        r.hype_count,
        r.cap_count,
        r.flame_score.toFixed(2),
        r.status,
        r.created_at,
      ].join(',')),
    ].join('\n')

    const blob = new Blob([rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `theboard-receipts-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">{profile.display_name ?? profile.username}&apos;s signal intelligence</p>
        </div>
        <div className="dashboard-header-actions">
          <Link href="/drops/new" className="btn-secondary">+ New Drop</Link>
          <button className="btn-secondary" onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-number">{drops.length}</span>
          <span className="stat-label">Drops</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{formatCount(receipts.length)}</span>
          <span className="stat-label">Receipts</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{formatCount(totalHype)}</span>
          <span className="stat-label">Total Hype</span>
        </div>
        <div className="stat-card stat-card-flame">
          <span className="stat-number">{flameCount}</span>
          <span className="stat-label">🔥 Going Flame</span>
        </div>
      </div>

      {drops.length > 0 && (
        <div className="dashboard-drops">
          <h2 className="section-title">Your Drops</h2>
          <div className="drops-grid">
            {drops.map(drop => (
              <Link key={drop.id} href={`/d/${drop.slug}`} className="drop-card" style={{ borderColor: drop.accent_color }}>
                <div className="drop-card-accent" style={{ backgroundColor: drop.accent_color }} />
                <h3 className="drop-card-name">{drop.name}</h3>
                <div className="drop-card-stats">
                  <span>{formatCount(drop.tap_in_count)} tapped in</span>
                  <span>{formatCount(drop.health_score)}% health</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard-receipts">
        <div className="receipts-header">
          <h2 className="section-title">Receipts ({filtered.length})</h2>
          <div className="receipts-filters">
            <select
              className="form-select"
              value={selectedDrop}
              onChange={e => setSelectedDrop(e.target.value)}
            >
              <option value="all">All Drops</option>
              {drops.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <div className="signal-filter-row">
              {SIGNAL_FILTERS.map(s => (
                <button
                  key={s}
                  className={`filter-chip ${signalFilter === s ? 'filter-chip-active' : ''}`}
                  onClick={() => setSignalFilter(s)}
                >
                  {s === 'all' ? 'All' : <SignalBadge type={s as SignalType} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title">No receipts yet</p>
            <p className="empty-sub">When users drop receipts on your Drops, they&apos;ll appear here ranked by flame score</p>
          </div>
        ) : (
          <div className="receipts-table">
            {filtered.map(post => (
              <div key={post.id} className="receipt-row">
                <div className="receipt-row-main">
                  {post.is_flame && <FlameBadge score={post.flame_score} />}
                  {post.signal_type && <SignalBadge type={post.signal_type} />}
                  <div className="receipt-content">
                    {post.title && <h4 className="receipt-title">{post.title}</h4>}
                    <p className="receipt-body">{post.body.slice(0, 120)}{post.body.length > 120 ? '…' : ''}</p>
                  </div>
                  <div className="receipt-votes">
                    <span className="vote-stat">⬆ {formatCount(post.hype_count)}</span>
                    <span className="vote-stat">⬇ {formatCount(post.cap_count)}</span>
                  </div>
                </div>
                <div className="receipt-row-footer">
                  <StatusPill status={post.status} />
                  {updatingPost === post.id ? (
                    <div className="status-changer">
                      {STATUSES.map(s => (
                        <button
                          key={s}
                          className="status-option"
                          onClick={() => handleStatusChange(post.id, s)}
                          disabled={isPending}
                        >
                          {s}
                        </button>
                      ))}
                      <button className="status-cancel" onClick={() => setUpdatingPost(null)}>✕</button>
                    </div>
                  ) : (
                    <button
                      className="btn-secondary btn-sm"
                      onClick={() => setUpdatingPost(post.id)}
                    >
                      Update Status
                    </button>
                  )}
                  <Link href={`/p/${post.id}`} className="btn-secondary btn-sm">View →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
