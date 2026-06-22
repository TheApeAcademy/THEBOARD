'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import Link from 'next/link'
import type { TbPost, TbDrop, TbProfile, SignalType, PostStatus } from '@/lib/types'
import StatusPill from '@/components/StatusPill'
import SignalBadge from '@/components/SignalBadge'
import FlameBadge from '@/components/FlameBadge'
import { updatePostStatus } from '@/actions/posts'
import { useToast } from '@/components/Toast'
import { formatCount } from '@/lib/utils'

type Contributor = { username: string; display_name: string | null; avatar_url: string | null; total_hype: number; post_count: number }
type VelocityPoint = { label: string; receipts: number; hype: number }

interface DashboardProps {
  profile: TbProfile
  drops: TbDrop[]
  receipts: TbPost[]
  currentUserId: string
  velocityData?: VelocityPoint[]
  contributors?: Contributor[]
}

const SIGNAL_FILTERS: (SignalType | 'all')[] = ['all', 'wishlist', 'glitch', 'no_cap', 'big_brain']
const STATUSES: PostStatus[] = ['open', 'seen', 'planned', 'building', 'built', 'rip']
const SIGNAL_COLORS: Record<SignalType, string> = {
  wishlist: '#1D9BF0',
  glitch: '#F4212E',
  no_cap: '#00BA7C',
  big_brain: '#9b59d6',
}
const SIGNAL_LABELS: Record<SignalType, string> = {
  wishlist: 'Wishlist',
  glitch: 'Glitch',
  no_cap: 'No Cap',
  big_brain: 'Big Brain',
}

function MiniSparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length === 0) return <div className="sparkline-empty" />
  const max = Math.max(...values, 1)
  const w = 80
  const h = 32
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1 || 1)) * w
    const y = h - (v / max) * h
    return `${x},${y}`
  }).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="sparkline" aria-hidden>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function SignalDonutChart({ receipts }: { receipts: TbPost[] }) {
  const counts: Record<SignalType, number> = { wishlist: 0, glitch: 0, no_cap: 0, big_brain: 0 }
  receipts.forEach(r => { if (r.signal_type) counts[r.signal_type]++ })
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  if (total === 0) return <div className="chart-empty">No data</div>

  let offset = 0
  const cx = 40; const cy = 40; const r = 30; const stroke = 12
  const circumference = 2 * Math.PI * r

  return (
    <div className="donut-chart-wrap">
      <svg viewBox="0 0 80 80" className="donut-chart">
        {(Object.entries(counts) as [SignalType, number][]).map(([type, count]) => {
          const pct = count / total
          const dash = pct * circumference
          const gap = circumference - dash
          const el = (
            <circle
              key={type}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={SIGNAL_COLORS[type]}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset * circumference}
              transform="rotate(-90 40 40)"
            />
          )
          offset += pct
          return el
        })}
      </svg>
      <div className="donut-legend">
        {(Object.entries(counts) as [SignalType, number][]).map(([type, count]) => (
          <div key={type} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: SIGNAL_COLORS[type] }} />
            <span className="legend-label">{SIGNAL_LABELS[type]}</span>
            <span className="legend-count">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusFunnel({ receipts }: { receipts: TbPost[] }) {
  const counts: Record<PostStatus, number> = { open: 0, seen: 0, planned: 0, building: 0, built: 0, rip: 0 }
  receipts.forEach(r => { counts[r.status]++ })
  const max = Math.max(...Object.values(counts), 1)
  const colors: Record<PostStatus, string> = {
    open: '#71767B',
    seen: '#1D9BF0',
    planned: '#9b59d6',
    building: '#FF7A00',
    built: '#00BA7C',
    rip: '#F4212E',
  }
  const labels: Record<PostStatus, string> = {
    open: 'Open', seen: 'Seen', planned: 'Planned', building: 'Building', built: 'Built', rip: "Won't Build",
  }
  return (
    <div className="status-funnel">
      {(Object.entries(counts) as [PostStatus, number][]).map(([status, count]) => (
        <div key={status} className="funnel-row">
          <span className="funnel-label">{labels[status]}</span>
          <div className="funnel-bar-wrap">
            <div className="funnel-bar" style={{ width: `${(count / max) * 100}%`, backgroundColor: colors[status] }} />
          </div>
          <span className="funnel-count">{count}</span>
        </div>
      ))}
    </div>
  )
}

function TopContributors({ contributors }: { contributors: Contributor[] }) {
  if (contributors.length === 0) return <div className="chart-empty">No data yet</div>
  return (
    <div className="top-contributors">
      {contributors.map((c, i) => (
        <div key={c.username} className="contributor-row">
          <span className="contributor-rank">#{i + 1}</span>
          <div className="contributor-avatar">
            {c.avatar_url
              ? <img src={c.avatar_url} alt={c.display_name ?? c.username} />
              : <span>{(c.display_name ?? c.username).charAt(0).toUpperCase()}</span>
            }
          </div>
          <div className="contributor-info">
            <span className="contributor-name">{c.display_name ?? c.username}</span>
            <span className="contributor-username">@{c.username}</span>
          </div>
          <div className="contributor-stats">
            <span className="contributor-hype">⬆ {formatCount(c.total_hype)}</span>
            <span className="contributor-posts">{c.post_count} posts</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function VelocityChart({ data, color, valueKey }: { data: VelocityPoint[]; color: string; valueKey: 'receipts' | 'hype' }) {
  const values = data.map(d => d[valueKey])
  const max = Math.max(...values, 1)
  const w = 240; const h = 60
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1 || 1)) * w
    const y = h - (v / max) * (h - 8)
    return `${x},${y}`
  }).join(' ')
  return (
    <div className="velocity-chart">
      <svg viewBox={`0 0 ${w} ${h}`} className="velocity-svg" aria-hidden>
        <defs>
          <linearGradient id={`grad-${valueKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,${h} ${pts} ${w},${h}`}
          fill={`url(#grad-${valueKey})`}
        />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <div className="velocity-labels">
        {data.map(d => (
          <span key={d.label} className="velocity-label">{d.label}</span>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard({ profile, drops, receipts, currentUserId, velocityData = [], contributors = [] }: DashboardProps) {
  const [selectedDrop, setSelectedDrop] = useState<string>('all')
  const [signalFilter, setSignalFilter] = useState<SignalType | 'all'>('all')
  const [updatingPost, setUpdatingPost] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<'receipts' | 'analytics' | 'rooms' | 'embed' | 'daye'>('receipts')
  const [isPending, startTransition] = useTransition()
  const [dayeMessages, setDayeMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [dayeInput, setDayeInput] = useState('')
  const [dayeLoading, setDayeLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const filtered = receipts
    .filter(r => selectedDrop === 'all' || r.drop_id === selectedDrop)
    .filter(r => signalFilter === 'all' || r.signal_type === signalFilter)

  const totalHype = receipts.reduce((acc, r) => acc + r.hype_count, 0)
  const flameCount = receipts.filter(r => r.is_flame).length
  const builtCount = receipts.filter(r => r.status === 'built').length
  const responseRate = receipts.length > 0
    ? Math.round((receipts.filter(r => r.status !== 'open').length / receipts.length) * 100)
    : 0

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [dayeMessages])

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

  async function sendDayeMessage() {
    if (!dayeInput.trim() || dayeLoading) return
    const dropId = selectedDrop !== 'all' ? selectedDrop : drops[0]?.id
    if (!dropId) { toast('Select a Drop first', 'error'); return }

    const userMsg = dayeInput.trim()
    setDayeInput('')
    setDayeMessages(m => [...m, { role: 'user', content: userMsg }, { role: 'assistant', content: '' }])
    setDayeLoading(true)

    try {
      const res = await fetch('/api/daye', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg, drop_id: dropId }),
      })
      if (!res.ok || !res.body) throw new Error('Bad response')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setDayeMessages(m => {
          const updated = [...m]
          updated[updated.length - 1] = { role: 'assistant', content: updated[updated.length - 1].content + chunk }
          return updated
        })
      }
    } catch {
      setDayeMessages(m => {
        const updated = [...m]
        updated[updated.length - 1] = { role: 'assistant', content: 'Something went wrong. Try again.' }
        return updated
      })
    } finally {
      setDayeLoading(false)
    }
  }

  const embedDrop = drops[0]
  const embedCode = embedDrop
    ? `<iframe\n  src="https://theboard.app/embed/${embedDrop.slug}"\n  width="100%"\n  height="480"\n  frameborder="0"\n  style="border:1px solid #2F3336;border-radius:12px;"\n></iframe>`
    : ''

  function copyEmbed() {
    if (!embedCode) return
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const SECTIONS = [
    { key: 'receipts', label: '🧾 Receipts' },
    { key: 'analytics', label: '📊 Analytics' },
    { key: 'rooms', label: '🏠 Rooms' },
    { key: 'embed', label: '🔌 Embed' },
    { key: 'daye', label: '✨ Daye AI' },
  ] as const

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
        <div className="stat-card stat-card-built">
          <span className="stat-number">{builtCount}</span>
          <span className="stat-label">✅ Built</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{responseRate}%</span>
          <span className="stat-label">Response Rate</span>
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

      <div className="dashboard-nav">
        {SECTIONS.map(s => (
          <button
            key={s.key}
            className={`dashboard-nav-btn ${activeSection === s.key ? 'dashboard-nav-btn-active' : ''}`}
            onClick={() => setActiveSection(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'receipts' && (
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
      )}

      {activeSection === 'analytics' && (
        <div className="analytics-section">
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3 className="analytics-card-title">Signal Breakdown</h3>
              <SignalDonutChart receipts={receipts} />
            </div>
            <div className="analytics-card">
              <h3 className="analytics-card-title">Status Funnel</h3>
              <StatusFunnel receipts={receipts} />
            </div>
          </div>

          {velocityData.length > 0 && (
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3 className="analytics-card-title">Receipt Velocity (7d)</h3>
                <VelocityChart data={velocityData} color="#1D9BF0" valueKey="receipts" />
              </div>
              <div className="analytics-card">
                <h3 className="analytics-card-title">Hype Velocity (7d)</h3>
                <VelocityChart data={velocityData} color="#00BA7C" valueKey="hype" />
              </div>
            </div>
          )}

          <div className="analytics-grid">
            <div className="analytics-card analytics-card-full">
              <h3 className="analytics-card-title">Top Receipts</h3>
              <div className="top-receipts-list">
                {receipts.slice(0, 5).map((r, i) => (
                  <Link key={r.id} href={`/p/${r.id}`} className="top-receipt-item">
                    <span className="top-receipt-rank">#{i + 1}</span>
                    <div className="top-receipt-info">
                      {r.signal_type && <SignalBadge type={r.signal_type} />}
                      <span className="top-receipt-body">{r.title ?? r.body.slice(0, 80)}</span>
                    </div>
                    <div className="top-receipt-stats">
                      <span>{formatCount(r.hype_count)} hype</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="analytics-card analytics-card-full">
              <h3 className="analytics-card-title">Top Contributors</h3>
              <TopContributors contributors={contributors} />
            </div>
          </div>

          <div className="analytics-card analytics-card-full coming-soon-card">
            <h3 className="analytics-card-title">Connected Socials</h3>
            <p className="coming-soon-desc">Connect your social accounts to see cross-platform analytics</p>
            <div className="socials-grid">
              {['Instagram', 'Facebook', 'WhatsApp', 'Twitter / X'].map(s => (
                <div key={s} className="social-connect-card">
                  <span className="social-name">{s}</span>
                  <span className="coming-soon-tag">Coming Soon</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'rooms' && (
        <div className="rooms-section">
          <div className="rooms-header">
            <h2 className="section-title">Manage Rooms</h2>
            <p className="section-desc">Create private Discord-style rooms for your team and VIP users</p>
          </div>
          <div className="empty-state">
            <p className="empty-title">Rooms coming to the dashboard</p>
            <p className="empty-sub">Visit your Drop pages to see and manage existing rooms</p>
            {drops.length > 0 && (
              <Link href={`/d/${drops[0].slug}`} className="btn-primary">
                Go to {drops[0].name} →
              </Link>
            )}
          </div>
        </div>
      )}

      {activeSection === 'embed' && (
        <div className="embed-section">
          <div className="embed-header">
            <h2 className="section-title">Embed on Your Site</h2>
            <p className="section-desc">Let users submit feedback without leaving your website</p>
          </div>

          {drops.length === 0 ? (
            <div className="empty-state">
              <p className="empty-title">Create a Drop first</p>
              <Link href="/drops/new" className="btn-primary">+ New Drop</Link>
            </div>
          ) : (
            <>
              <div className="embed-drop-select">
                <label className="form-label">Select Drop</label>
                <select
                  className="form-select"
                  value={selectedDrop}
                  onChange={e => setSelectedDrop(e.target.value)}
                >
                  {drops.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div className="embed-preview-wrap">
                <h3 className="embed-preview-title">Preview</h3>
                <div className="embed-preview-frame">
                  <iframe
                    src={`/embed/${embedDrop?.slug ?? ''}`}
                    width="100%"
                    height="480"
                    style={{ border: 'none', borderRadius: 8 }}
                  />
                </div>
              </div>

              <div className="embed-code-wrap">
                <h3 className="embed-code-title">Embed Code</h3>
                <pre className="embed-code">{embedCode}</pre>
                <button className="btn-primary" onClick={copyEmbed}>
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {activeSection === 'daye' && (
        <div className="daye-section">
          <div className="daye-header">
            <h2 className="section-title">✨ Daye AI</h2>
            <p className="section-desc">Your product intelligence co-pilot. Ask anything about your signals.</p>
          </div>

          <div className="daye-suggestions">
            {[
              "What should I build next?",
              "Why is sentiment dropping?",
              "Summarize this week's receipts",
              "What's the most requested feature?",
            ].map(q => (
              <button key={q} className="daye-suggestion" onClick={() => setDayeInput(q)}>
                {q}
              </button>
            ))}
          </div>

          <div className="daye-chat">
            <div className="daye-messages">
              {dayeMessages.length === 0 && (
                <div className="daye-empty">
                  <p>Ask Daye anything about your product signals</p>
                </div>
              )}
              {dayeMessages.map((m, i) => (
                <div key={i} className={`daye-message daye-message-${m.role}`}>
                  {m.role === 'assistant' && <span className="daye-label">Daye</span>}
                  <p>{m.content}</p>
                </div>
              ))}
              {dayeLoading && (
                <div className="daye-message daye-message-assistant">
                  <span className="daye-label">Daye</span>
                  <p className="daye-thinking">Thinking…</p>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="daye-input-row">
              <input
                type="text"
                className="form-input"
                placeholder="Ask Daye…"
                value={dayeInput}
                onChange={e => setDayeInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendDayeMessage()}
              />
              <button className="btn-primary" onClick={sendDayeMessage} disabled={dayeLoading}>
                {dayeLoading ? '…' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
