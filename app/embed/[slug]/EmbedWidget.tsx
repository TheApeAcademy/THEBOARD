'use client'

import { useState, useTransition } from 'react'
import type { TbDrop, TbPost, SignalType } from '@/lib/types'
import { createPost } from '@/actions/posts'
import { signalLabel } from '@/lib/utils'

const SIGNAL_TYPES: SignalType[] = ['wishlist', 'glitch', 'no_cap', 'big_brain']

interface EmbedWidgetProps {
  drop: TbDrop
  topPosts: TbPost[]
  userId?: string
}

export default function EmbedWidget({ drop, topPosts, userId }: EmbedWidgetProps) {
  const [body, setBody] = useState('')
  const [signal, setSignal] = useState<SignalType>('wishlist')
  const [sent, setSent] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  // Guest flow
  const [guestEmail, setGuestEmail] = useState('')
  const [guestEmailSubmitted, setGuestEmailSubmitted] = useState(false)

  function handleGuestEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!guestEmail.trim() || !guestEmail.includes('@')) {
      setError('Enter a valid email address')
      return
    }
    setError('')
    setGuestEmailSubmitted(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return

    if (!userId && !guestEmailSubmitted) {
      setError('Please enter your email first')
      return
    }

    startTransition(async () => {
      if (userId) {
        const result = await createPost({
          drop_id: drop.id,
          post_type: 'receipt',
          signal_type: signal,
          title: null,
          body: body.trim(),
        })
        if (result.ok) {
          setSent(true)
          setBody('')
        } else {
          setError(result.error ?? 'Failed to post')
        }
      } else {
        // Guest: submit to widget API which stores the email + feedback
        const res = await fetch('/api/widget/guest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ drop_id: drop.id, email: guestEmail, body: body.trim(), signal_type: signal }),
        })
        if (res.ok) {
          setSent(true)
          setBody('')
        } else {
          const json = await res.json().catch(() => ({}))
          setError(json.error ?? 'Failed to send')
        }
      }
    })
  }

  return (
    <div className="embed-widget" style={{ '--accent': drop.accent_color } as React.CSSProperties}>
      <div className="embed-header" style={{ borderColor: drop.accent_color }}>
        <div className="embed-accent-dot" style={{ backgroundColor: drop.accent_color }} />
        <div>
          <h2 className="embed-title">{drop.name}</h2>
          <p className="embed-sub">Drop your feedback · Powered by The Board</p>
        </div>
      </div>

      {topPosts.length > 0 && (
        <div className="embed-trending">
          <p className="embed-trending-label">Trending feedback</p>
          {topPosts.map(p => (
            <div key={p.id} className="embed-post-item">
              <span className="embed-post-hype">⬆ {p.hype_count}</span>
              <span className="embed-post-body">{p.title ?? p.body.slice(0, 60)}</span>
            </div>
          ))}
        </div>
      )}

      {sent ? (
        <div className="embed-success">
          <p>✓ Feedback sent to {drop.name}!</p>
          <button className="embed-reset" onClick={() => setSent(false)}>Send another</button>
        </div>
      ) : !userId && !guestEmailSubmitted ? (
        <form onSubmit={handleGuestEmailSubmit} className="embed-form">
          <p className="embed-guest-prompt">Enter your email to drop feedback anonymously</p>
          <input
            type="email"
            className="embed-email-input"
            placeholder="your@email.com"
            value={guestEmail}
            onChange={e => setGuestEmail(e.target.value)}
            required
          />
          {error && <p className="embed-error">{error}</p>}
          <button
            type="submit"
            className="embed-submit"
            style={{ backgroundColor: drop.accent_color }}
            disabled={!guestEmail.trim()}
          >
            Continue
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="embed-form">
          {!userId && (
            <p className="embed-guest-label">
              Sending as <strong>{guestEmail}</strong>
              <button type="button" className="embed-change-email" onClick={() => setGuestEmailSubmitted(false)}>change</button>
            </p>
          )}
          <div className="embed-signal-row">
            {SIGNAL_TYPES.map(s => (
              <button
                key={s}
                type="button"
                className={`embed-signal-btn ${signal === s ? 'embed-signal-active' : ''}`}
                style={signal === s ? { borderColor: drop.accent_color, color: drop.accent_color } : {}}
                onClick={() => setSignal(s)}
              >
                {signalLabel(s)}
              </button>
            ))}
          </div>
          <textarea
            className="embed-textarea"
            placeholder={`Share your ${signal === 'glitch' ? 'bug report' : signal === 'wishlist' ? 'feature request' : 'feedback'} with ${drop.name}…`}
            value={body}
            onChange={e => setBody(e.target.value)}
            maxLength={500}
            rows={4}
            required
          />
          {error && <p className="embed-error">{error}</p>}
          <button
            type="submit"
            className="embed-submit"
            style={{ backgroundColor: drop.accent_color }}
            disabled={isPending || !body.trim()}
          >
            {isPending ? 'Sending…' : 'Send Feedback'}
          </button>
        </form>
      )}
    </div>
  )
}
