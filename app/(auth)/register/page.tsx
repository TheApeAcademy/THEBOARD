'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BluebirdSVG from '@/components/BluebirdSVG'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'company'>('user')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => router.push('/login'), 3000)
      }
    })
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card auth-success">
          <BluebirdSVG size={48} />
          <h1 className="auth-title">Check your inbox</h1>
          <p className="auth-subtitle">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <BluebirdSVG size={48} />
        </div>
        <h1 className="auth-title">Join The Board</h1>
        <p className="auth-subtitle">Carry the signal. No cap.</p>

        <div className="role-selector">
          <button
            type="button"
            className={`role-btn ${role === 'user' ? 'role-btn-active' : ''}`}
            onClick={() => setRole('user')}
          >
            <span className="role-icon">👤</span>
            <span className="role-label">I&apos;m a User</span>
            <span className="role-desc">Post Receipts & Drips</span>
          </button>
          <button
            type="button"
            className={`role-btn ${role === 'company' ? 'role-btn-active' : ''}`}
            onClick={() => setRole('company')}
          >
            <span className="role-icon">🏢</span>
            <span className="role-label">I&apos;m a Company</span>
            <span className="role-desc">Create a Drop & respond</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="8+ characters"
              minLength={8}
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn-primary auth-submit" disabled={isPending}>
            {isPending ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already on The Board?{' '}
          <Link href="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
