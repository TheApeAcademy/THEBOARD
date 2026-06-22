'use client'

import { Suspense, useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import BluebirdSVG from '@/components/BluebirdSVG'
import { createClient } from '@/lib/supabase/client'

type Step = 'choose' | 'user-details' | 'company-details' | 'success'

function RegisterFlow() {
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role')

  function getInitialStep(): Step {
    if (roleParam === 'user') return 'user-details'
    if (roleParam === 'company') return 'company-details'
    return 'choose'
  }

  const [step, setStep] = useState<Step>(getInitialStep)
  const [successEmail, setSuccessEmail] = useState('')

  // User fields
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')

  // Company fields
  const [companyName, setCompanyName] = useState('')
  const [companyHandle, setCompanyHandle] = useState('')
  const [workEmail, setWorkEmail] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')
  const [industry, setIndustry] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [companyPassword, setCompanyPassword] = useState('')

  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleUserSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      try {
        const supabase = createClient()
        const { error } = await supabase.auth.signUp({
          email: userEmail,
          password: userPassword,
          options: {
            data: {
              role: 'user',
              username,
              display_name: displayName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/home`,
          },
        })
        if (error) {
          setError(error.message || 'Sign up failed. Check your details and try again.')
        } else {
          setSuccessEmail(userEmail)
          setStep('success')
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unexpected error occurred. Please try again.')
      }
    })
  }

  function handleCompanySubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: workEmail,
        password: companyPassword,
        options: {
          data: {
            role: 'company',
            username: companyHandle,
            display_name: companyName,
            company_name: companyName,
            company_website: companyWebsite,
            industry,
            company_size: companySize,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/home`,
        },
      })
      if (error) {
        setError(error.message || 'Sign up failed. Check your details and try again.')
      } else {
        setSuccessEmail(workEmail)
        setStep('success')
      }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unexpected error occurred. Please try again.')
      }
    })
  }

  // ── SUCCESS ──
  if (step === 'success') {
    return (
      <div className="register-flow">
        <div className="reg-step reg-success">
          <BluebirdSVG size={52} />
          <h1 className="reg-success-title">Check your inbox</h1>
          <p className="reg-success-sub">
            We sent a confirmation link to <strong>{successEmail}</strong>.
            Click it to activate your account and get on The Board.
          </p>
          <Link href="/login" className="hero-cta-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>
            Go to Sign In →
          </Link>
        </div>
      </div>
    )
  }

  // ── CHOOSE ──
  if (step === 'choose') {
    return (
      <div className="register-flow">
        <div className="reg-choose">
          <div className="reg-choose-header">
            <Link href="/" className="reg-logo">
              <BluebirdSVG size={32} />
              <span>The Board</span>
            </Link>
            <h1 className="reg-choose-title">Who are you?</h1>
            <p className="reg-choose-sub">Choose your path to The Board.</p>
          </div>
          <div className="reg-choose-cards">
            <button
              className="reg-type-card reg-type-user"
              onClick={() => setStep('user-details')}
            >
              <div className="reg-type-glow reg-type-glow-user" />
              <div className="reg-type-icon">👤</div>
              <h2 className="reg-type-title">I&apos;m a User</h2>
              <p className="reg-type-desc">Drop receipts, vote on feedback, and make companies listen.</p>
              <ul className="reg-type-features">
                <li>Post product experiences</li>
                <li>Vote to amplify the best signals</li>
                <li>Build your hype score</li>
                <li>Follow drops for your fav products</li>
              </ul>
              <span className="reg-type-cta">Continue as User →</span>
            </button>

            <button
              className="reg-type-card reg-type-company"
              onClick={() => setStep('company-details')}
            >
              <div className="reg-type-glow reg-type-glow-company" />
              <div className="reg-type-icon">🏢</div>
              <h2 className="reg-type-title">I&apos;m a Company</h2>
              <p className="reg-type-desc">Create a Drop, monitor signals, and respond to real users in public.</p>
              <ul className="reg-type-features">
                <li>Create a Drop for your product</li>
                <li>Real-time signal dashboard</li>
                <li>Respond publicly to posts</li>
                <li>Export insights to your roadmap</li>
              </ul>
              <span className="reg-type-cta">Continue as Company →</span>
            </button>
          </div>
          <p className="reg-signin-prompt">
            Already on The Board? <Link href="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    )
  }

  // ── USER DETAILS ──
  if (step === 'user-details') {
    return (
      <div className="register-flow">
        <div className="reg-step">
          <div className="reg-steps-indicator">
            <span className="reg-step-dot reg-step-dot-done" />
            <span className="reg-step-line" />
            <span className="reg-step-dot reg-step-dot-active" />
            <span className="reg-step-line" />
            <span className="reg-step-dot" />
          </div>

          <Link href="/" className="reg-logo reg-logo-centered">
            <BluebirdSVG size={28} />
          </Link>

          <h1 className="reg-form-title">Create your account</h1>
          <p className="reg-form-sub">You&apos;re signing up as a <strong>User</strong></p>

          <form onSubmit={handleUserSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="displayName">Display Name</label>
              <input
                id="displayName"
                type="text"
                className="form-input"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                required
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                className="form-input"
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                required
                placeholder="your_handle"
                pattern="[a-z0-9_]+"
                title="Lowercase letters, numbers, and underscores only"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
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
                value={userPassword}
                onChange={e => setUserPassword(e.target.value)}
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

          <button
            className="reg-back"
            onClick={() => { setError(''); setStep('choose') }}
          >
            ← Back
          </button>

          <p className="auth-switch">
            Already on The Board?{' '}
            <Link href="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    )
  }

  // ── COMPANY DETAILS ──
  return (
    <div className="register-flow">
      <div className="reg-step">
        <div className="reg-steps-indicator">
          <span className="reg-step-dot reg-step-dot-done" />
          <span className="reg-step-line" />
          <span className="reg-step-dot reg-step-dot-active" />
          <span className="reg-step-line" />
          <span className="reg-step-dot" />
        </div>

        <Link href="/" className="reg-logo reg-logo-centered">
          <BluebirdSVG size={28} />
        </Link>

        <h1 className="reg-form-title">Create your company</h1>
        <p className="reg-form-sub">You&apos;re signing up as a <strong>Company</strong></p>

        <form onSubmit={handleCompanySubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="companyName">Company Name</label>
            <input
              id="companyName"
              type="text"
              className="form-input"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              required
              placeholder="Acme Inc."
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="companyHandle">Handle / Username</label>
            <input
              id="companyHandle"
              type="text"
              className="form-input"
              value={companyHandle}
              onChange={e => setCompanyHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              required
              placeholder="acme_inc"
              pattern="[a-z0-9_]+"
              title="Lowercase letters, numbers, and underscores only"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="workEmail">Work Email</label>
            <input
              id="workEmail"
              type="email"
              className="form-input"
              value={workEmail}
              onChange={e => setWorkEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@company.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="companyWebsite">Company Website</label>
            <input
              id="companyWebsite"
              type="url"
              className="form-input"
              value={companyWebsite}
              onChange={e => setCompanyWebsite(e.target.value)}
              placeholder="https://yourcompany.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="industry">Industry</label>
            <select
              id="industry"
              className="form-input reg-select"
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              required
            >
              <option value="">Select industry…</option>
              <option value="SaaS">SaaS</option>
              <option value="E-commerce">E-commerce</option>
              <option value="FinTech">FinTech</option>
              <option value="HealthTech">HealthTech</option>
              <option value="EdTech">EdTech</option>
              <option value="Gaming">Gaming</option>
              <option value="Media & Entertainment">Media &amp; Entertainment</option>
              <option value="Consumer App">Consumer App</option>
              <option value="Developer Tools">Developer Tools</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="companySize">Company Size</label>
            <select
              id="companySize"
              className="form-input reg-select"
              value={companySize}
              onChange={e => setCompanySize(e.target.value)}
              required
            >
              <option value="">Select size…</option>
              <option value="1-10">1–10</option>
              <option value="11-50">11–50</option>
              <option value="51-200">51–200</option>
              <option value="201-1000">201–1,000</option>
              <option value="1000+">1,000+</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="companyPassword">Password</label>
            <input
              id="companyPassword"
              type="password"
              className="form-input"
              value={companyPassword}
              onChange={e => setCompanyPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="8+ characters"
              minLength={8}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary auth-submit" disabled={isPending}>
            {isPending ? 'Creating account…' : 'Create Company Account'}
          </button>
        </form>

        <button
          className="reg-back"
          onClick={() => { setError(''); setStep('choose') }}
        >
          ← Back
        </button>

        <p className="auth-switch">
          Already on The Board?{' '}
          <Link href="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
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
          <p className="auth-panel-image-quote">Real users. Real signals.<br />Zero PR spin.</p>
          <p className="auth-panel-image-sub">Join the community building better products.</p>
        </div>
      </div>
      <div className="auth-card-wrap" style={{ flex: 1 }}>
        <Suspense fallback={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <BluebirdSVG size={40} />
          </div>
        }>
          <RegisterFlow />
        </Suspense>
      </div>
    </div>
  )
}
