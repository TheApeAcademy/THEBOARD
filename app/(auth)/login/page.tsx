'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BluebirdSVG from '@/components/BluebirdSVG'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      try {
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          setError(error.message || 'Sign in failed. Check your email and password.')
        } else {
          router.push('/home')
          router.refresh()
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unexpected error occurred. Please try again.')
      }
    })
  }

  return (
    <div className="auth-page">
      <div className="auth-panel-image">
        <Image
          src="/601f6aba8b93dd4e41e8cc8a3bdfbfd0.jpg"
          alt="The Board"
          fill
          style={{ objectFit: 'cover' }}
        />
        <div className="auth-panel-image-overlay">
          <p className="auth-panel-image-quote">Where user signals become product decisions.</p>
          <p className="auth-panel-image-sub">Real time. In public. No cap.</p>
        </div>
      </div>
      <div className="auth-card-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <BluebirdSVG size={48} />
        </div>
        <h1 className="auth-title">Sign in to The Board</h1>
        <p className="auth-subtitle">Where user signals become product decisions.</p>

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
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn-primary auth-submit" disabled={isPending}>
            {isPending ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="auth-link">Create one</Link>
        </p>
      </div>
      </div>
    </div>
  )
}
