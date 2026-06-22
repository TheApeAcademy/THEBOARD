'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import type { TbDrop, SignalType } from '@/lib/types'
import { createPost } from '@/actions/posts'
import { suggestDrop, searchDrops } from '@/actions/shadowDrops'
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
  const [dropSearch, setDropSearch] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{ id: string; name: string; slug: string; accent_color: string; is_claimed: boolean }>>([])
  const [selectedDropName, setSelectedDropName] = useState(drops.find(d => d.id === defaultDropId)?.name ?? '')
  const [showDropSearch, setShowDropSearch] = useState(!defaultDropId)
  const [signalType, setSignalType] = useState<SignalType>('wishlist')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isPending, startTransition] = useTransition()
  const [isSuggesting, startSuggestTransition] = useTransition()
  const { toast } = useToast()
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!dropSearch.trim()) {
      setSearchResults(drops.slice(0, 8).map(d => ({ id: d.id, name: d.name, slug: d.slug, accent_color: d.accent_color, is_claimed: d.is_claimed })))
      return
    }
    if (searchRef.current) clearTimeout(searchRef.current)
    searchRef.current = setTimeout(async () => {
      const result = await searchDrops(dropSearch)
      if (result.ok) setSearchResults(result.data ?? [])
    }, 300)
    return () => { if (searchRef.current) clearTimeout(searchRef.current) }
  }, [dropSearch, drops])

  function selectDrop(drop: { id: string; name: string }) {
    setDropId(drop.id)
    setSelectedDropName(drop.name)
    setShowDropSearch(false)
    setDropSearch('')
  }

  function handleSuggest() {
    if (!dropSearch.trim()) return
    startSuggestTransition(async () => {
      const result = await suggestDrop(dropSearch.trim())
      if (result.ok && result.data) {
        toast(result.data.isNew ? `Created Drop for ${dropSearch}` : `Found existing Drop`, 'success')
        // Reload to get the new drop — simplest approach
        setDropSearch('')
        setDropId('')
        setSelectedDropName(dropSearch.trim())
        toast('Company added! You can now post to them.', 'info')
      } else {
        toast(result.error ?? 'Failed', 'error')
      }
    })
  }

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

  const noExactMatch = dropSearch.trim() && searchResults.length === 0

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
            {!showDropSearch && dropId ? (
              <div className="selected-drop" onClick={() => setShowDropSearch(true)}>
                <span className="selected-drop-name">{selectedDropName}</span>
                <button type="button" className="selected-drop-change">Change</button>
              </div>
            ) : (
              <div className="drop-search-wrap">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search for a company…"
                  value={dropSearch}
                  onChange={e => setDropSearch(e.target.value)}
                  autoFocus={showDropSearch}
                />
                {searchResults.length > 0 && (
                  <ul className="drop-search-results">
                    {searchResults.map(d => (
                      <li key={d.id} className="drop-result-item" onClick={() => selectDrop(d)}>
                        <div className="drop-result-accent" style={{ backgroundColor: d.accent_color }} />
                        <span>{d.name}</span>
                        {!d.is_claimed && <span className="unclaimed-tag">Unclaimed</span>}
                      </li>
                    ))}
                  </ul>
                )}
                {noExactMatch && (
                  <div className="suggest-company">
                    <p className="suggest-text">
                      &ldquo;{dropSearch}&rdquo; isn&apos;t on The Board yet.
                    </p>
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={handleSuggest}
                      disabled={isSuggesting}
                    >
                      {isSuggesting ? 'Adding…' : `+ Suggest ${dropSearch}`}
                    </button>
                  </div>
                )}
              </div>
            )}
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
            <button type="submit" className="btn-primary" disabled={isPending || !dropId}>
              {isPending ? 'Posting…' : 'Drop It'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
