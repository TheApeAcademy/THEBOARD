'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createDrop } from '@/actions/drops'
import { useToast } from '@/components/Toast'

const ACCENT_COLORS = [
  '#1D9BF0', '#FF4500', '#46D160', '#FFD700', '#FF69B4',
  '#9B59B6', '#E67E22', '#1ABC9C', '#E74C3C', '#3498DB',
]

export default function NewDropPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [accentColor, setAccentColor] = useState('#1D9BF0')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { toast('Name is required', 'error'); return }
    startTransition(async () => {
      const result = await createDrop({ name: name.trim(), description: description.trim() || undefined, accent_color: accentColor })
      if (result.ok && result.data) {
        toast(`Drop "${name}" created! 🎯`, 'success')
        router.push(`/d/${result.data.slug}`)
      } else {
        toast(result.error ?? 'Failed to create Drop', 'error')
      }
    })
  }

  return (
    <div className="create-drop-page">
      <div className="create-drop-card">
        <h1 className="auth-title">Create a Drop</h1>
        <p className="auth-subtitle">Your company&apos;s home on The Board. Where signals land.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Drop Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Acme Corp, Notion, Linear"
              required
              maxLength={80}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Tell users what your product does"
              rows={3}
              maxLength={300}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Accent Color</label>
            <div className="color-picker">
              {ACCENT_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`color-swatch ${accentColor === color ? 'color-swatch-active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setAccentColor(color)}
                />
              ))}
              <input
                type="color"
                className="color-input"
                value={accentColor}
                onChange={e => setAccentColor(e.target.value)}
              />
            </div>
          </div>

          <div className="drop-preview">
            <div className="drop-preview-bar" style={{ backgroundColor: accentColor }} />
            <span className="drop-preview-name" style={{ color: accentColor }}>{name || 'Your Drop Name'}</span>
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={isPending}>
            {isPending ? 'Creating…' : 'Create Drop'}
          </button>
        </form>
      </div>
    </div>
  )
}
