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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    if (!userId) { setError('Sign in to post feedback'); return }

    startTransition(async () => {
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
      ) : (
        <form onSubmit={handleSubmit} className="embed-form">
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
            {isPending ? 'Sending…' : userId ? 'Send Feedback' : 'Sign in to send'}
          </button>
        </form>
      )}
    </div>
  )
}
