'use client'

import { useState, useTransition } from 'react'
import type { TbDrop, SignalType } from '@/lib/types'
import { createPost } from '@/actions/posts'
import { useToast } from './Toast'
import { signalLabel } from '@/lib/utils'

const SIGNAL_TYPES: SignalType[] = ['wishlist', 'glitch', 'no_cap', 'big_brain']

interface ComposeModalProps {
  drops: TbDrop[]
  defaultDropId?: string
  onClose: () => void
  onSuccess?: () => void
}

export default function ComposeModal({ drops, defaultDropId, onClose, onSuccess }: ComposeModalProps) {
  const [postType, setPostType] = useState<'drip' | 'receipt'>('receipt')
  const [dropId, setDropId] = useState(defaultDropId ?? '')
  const [signalType, setSignalType] = useState<SignalType>('wishlist')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!dropId) { toast('Pick a Drop first', 'error'); return }
    if (!body.trim()) { toast('Write something', 'error'); return }

    startTransition(async () => {
      const result = await createPost({
        drop_id: dropId,
        post_type: postType,
        signal_type: postType === 'receipt' ? signalType : null,
        title: title || null,
        body,
      })
      if (result.ok) {
        toast(postType === 'receipt' ? 'Receipt dropped 🧾' : 'Drip posted 💧', 'success')
        onSuccess?.()
        onClose()
      } else {
        toast(result.error ?? 'Failed to post', 'error')
      }
    })
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {postType === 'receipt' ? '🧾 Drop a Receipt' : '💧 Drop a Drip'}
          </h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="compose-form">
          <div className="compose-type-toggle">
            <button
              type="button"
              className={`type-btn ${postType === 'receipt' ? 'type-btn-active' : ''}`}
              onClick={() => setPostType('receipt')}
            >
              Receipt
            </button>
            <button
              type="button"
              className={`type-btn ${postType === 'drip' ? 'type-btn-active' : ''}`}
              onClick={() => setPostType('drip')}
            >
              Drip
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Drop</label>
            <select
              className="form-select"
              value={dropId}
              onChange={e => setDropId(e.target.value)}
              required
            >
              <option value="">Select a Drop</option>
              {drops.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {postType === 'receipt' && (
            <div className="form-group">
              <label className="form-label">Signal</label>
              <div className="signal-picker">
                {SIGNAL_TYPES.map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`signal-option ${signalType === s ? 'signal-option-active' : ''}`}
                    onClick={() => setSignalType(s)}
                  >
                    {signalLabel(s)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {postType === 'receipt' && (
            <div className="form-group">
              <label className="form-label">Title (optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="One-line summary"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={120}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Body</label>
            <textarea
              className="form-textarea"
              placeholder={postType === 'receipt' ? "What's the signal? Be specific." : "What's the vibe?"}
              value={body}
              onChange={e => setBody(e.target.value)}
              required
              maxLength={2000}
              rows={5}
            />
            <span className="char-count">{body.length}/2000</span>
          </div>

          <div className="compose-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isPending}>
              {isPending ? 'Posting…' : 'Drop It'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
