import Link from 'next/link'
import BluebirdSVG from '@/components/BluebirdSVG'

export default function LandingPage() {
  return (
    <div className="landing">
      {/* ── NAV ── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-nav-logo">
            <BluebirdSVG size={28} />
            <span className="landing-nav-wordmark">The Board</span>
          </div>
          <div className="landing-nav-actions">
            <Link href="/login" className="landing-nav-signin">Sign In</Link>
            <Link href="/register" className="landing-nav-cta">Get on The Board</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="landing-hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>

        <div className="hero-content">
          <div className="hero-signal-pills">
            <span className="signal-pill signal-pill-wishlist">🌈 Wishlist</span>
            <span className="signal-pill signal-pill-glitch">⚡ Glitch</span>
            <span className="signal-pill signal-pill-nocap">🎙 No Cap</span>
            <span className="signal-pill signal-pill-bigbrain">🧠 Big Brain</span>
          </div>

          <h1 className="hero-title">
            CARRY<br />THE<br />SIGNAL.
          </h1>

          <p className="hero-sub">
            The Board is where real users drop receipts, call out glitches, and speak their truth — and where companies actually listen. No PR spin. No filters. Just signal.
          </p>

          <div className="hero-cta-group">
            <Link href="/register" className="hero-cta-primary">
              Get on The Board <span className="hero-cta-arrow">→</span>
            </Link>
            <Link href="/login" className="hero-cta-ghost">
              Sign In
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="mock-feed">
            <div className="mock-post">
              <div className="mock-post-header">
                <div className="mock-avatar mock-avatar-purple" />
                <div className="mock-meta">
                  <span className="mock-name">sarah_builds</span>
                  <span className="mock-handle">@sarah · 2m</span>
                </div>
                <span className="mock-signal-badge mock-badge-glitch">⚡ Glitch</span>
              </div>
              <p className="mock-post-body">The checkout flow breaks on iOS every single time I try to use Apple Pay. Three weeks, no fix, zero comms. @Acme you gotta do better 🧾</p>
              <div className="mock-post-footer">
                <span className="mock-drop-tag"># AcmeApp</span>
                <div className="mock-votes">
                  <span className="mock-vote mock-vote-up">▲ 847</span>
                  <span className="mock-vote mock-vote-down">▼ 12</span>
                </div>
              </div>
            </div>

            <div className="mock-post mock-post-2">
              <div className="mock-post-header">
                <div className="mock-avatar mock-avatar-blue" />
                <div className="mock-meta">
                  <span className="mock-name">devdave</span>
                  <span className="mock-handle">@devdave · 8m</span>
                </div>
                <span className="mock-signal-badge mock-badge-bigbrain">🧠 Big Brain</span>
              </div>
              <p className="mock-post-body">What if the dashboard had a dark mode that actually matched the brand? Not asking for much, the contrast is killing my eyes at 2am 👀</p>
              <div className="mock-post-footer">
                <span className="mock-drop-tag"># LinearFeedback</span>
                <div className="mock-votes">
                  <span className="mock-vote mock-vote-up">▲ 2.1k</span>
                  <span className="mock-vote mock-vote-down">▼ 3</span>
                </div>
              </div>
            </div>

            <div className="mock-post mock-post-3">
              <div className="mock-post-header">
                <div className="mock-avatar mock-avatar-green" />
                <div className="mock-meta">
                  <span className="mock-name">ux_maya</span>
                  <span className="mock-handle">@ux_maya · 14m</span>
                </div>
                <span className="mock-signal-badge mock-badge-wishlist">🌈 Wishlist</span>
              </div>
              <p className="mock-post-body">Would love bulk export as CSV. Power users have been asking for years. This would be a massive W 🙌</p>
              <div className="mock-post-footer">
                <span className="mock-drop-tag"># NotionWishes</span>
                <div className="mock-votes">
                  <span className="mock-vote mock-vote-up">▲ 413</span>
                  <span className="mock-vote mock-vote-down">▼ 5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="landing-section how-it-works">
        <div className="landing-section-inner">
          <div className="section-label">How it works</div>
          <h2 className="section-title">Signal in. Product out.</h2>
          <div className="how-grid">
            <div className="how-card">
              <div className="how-number">01</div>
              <h3 className="how-card-title">Drop a Receipt</h3>
              <p className="how-card-desc">Users post about real product experiences — glitches, wins, wishlist items, or hot takes. Tag a company drop and pick your signal type.</p>
            </div>
            <div className="how-card">
              <div className="how-number">02</div>
              <h3 className="how-card-title">The Board Votes</h3>
              <p className="how-card-desc">The community upvotes what matters. Real signal rises, noise falls. No algorithm manipulation — just people with opinions.</p>
            </div>
            <div className="how-card">
              <div className="how-number">03</div>
              <h3 className="how-card-title">Companies Respond</h3>
              <p className="how-card-desc">Brands see the signal in their dashboard, engage publicly, and ship based on what actually matters to their users. Accountability in public.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SIGNAL SYSTEM ── */}
      <section className="landing-section signal-system">
        <div className="landing-section-inner">
          <div className="section-label">The Signal System</div>
          <h2 className="section-title">Four ways to be heard.</h2>
          <div className="signal-grid">
            <div className="signal-card signal-card-wishlist">
              <div className="signal-card-glow signal-glow-wishlist" />
              <div className="signal-card-icon">🌈</div>
              <h3 className="signal-card-name">Wishlist</h3>
              <p className="signal-card-desc">Feature requests and ideas. Tell companies what you actually want built next.</p>
            </div>
            <div className="signal-card signal-card-glitch">
              <div className="signal-card-glow signal-glow-glitch" />
              <div className="signal-card-icon">⚡</div>
              <h3 className="signal-card-name">Glitch</h3>
              <p className="signal-card-desc">Bugs, breakage, and bad UX. Name it in public and companies can&apos;t ignore it.</p>
            </div>
            <div className="signal-card signal-card-nocap">
              <div className="signal-card-glow signal-glow-nocap" />
              <div className="signal-card-icon">🎙</div>
              <h3 className="signal-card-name">No Cap</h3>
              <p className="signal-card-desc">Raw hot takes and honest reviews. Unfiltered user truth, no PR spin allowed.</p>
            </div>
            <div className="signal-card signal-card-bigbrain">
              <div className="signal-card-glow signal-glow-bigbrain" />
              <div className="signal-card-icon">🧠</div>
              <h3 className="signal-card-name">Big Brain</h3>
              <p className="signal-card-desc">Strategic ideas and product vision. The kind of insights PMs dream about.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR WHO ── */}
      <section className="landing-section for-who">
        <div className="landing-section-inner">
          <div className="section-label">For Who</div>
          <h2 className="section-title">Two sides. One board.</h2>
          <div className="for-who-grid">
            <div className="for-who-card for-who-users">
              <div className="for-who-icon">👤</div>
              <h3 className="for-who-title">For Users</h3>
              <p className="for-who-desc">Your feedback actually lands. Drop receipts, vote on what matters, and watch companies respond in real time.</p>
              <ul className="for-who-list">
                <li>Post product experiences publicly</li>
                <li>Vote to amplify the best signals</li>
                <li>Build your hype score over time</li>
                <li>Follow drops for your favourite products</li>
              </ul>
              <Link href="/register?role=user" className="for-who-cta">Join as User</Link>
            </div>
            <div className="for-who-card for-who-companies">
              <div className="for-who-icon">🏢</div>
              <h3 className="for-who-title">For Companies</h3>
              <p className="for-who-desc">Stop guessing what users want. See real-time feedback dashboards, respond publicly, and build in public.</p>
              <ul className="for-who-list">
                <li>Create a Drop for your product</li>
                <li>Monitor signal across all 4 types</li>
                <li>Respond to posts publicly</li>
                <li>Export insights to your roadmap</li>
              </ul>
              <Link href="/register?role=company" className="for-who-cta for-who-cta-company">Join as Company</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="landing-section final-cta-section">
        <div className="landing-section-inner">
          <div className="final-cta-card">
            <div className="final-cta-glow" />
            <div className="section-label">Ready?</div>
            <h2 className="final-cta-title">No cap, no filters.<br />Just signal.</h2>
            <p className="final-cta-sub">Join thousands of users and companies already on The Board. Free to get started.</p>
            <div className="final-cta-actions">
              <Link href="/register" className="hero-cta-primary">
                Get on The Board <span className="hero-cta-arrow">→</span>
              </Link>
              <Link href="/login" className="hero-cta-ghost">Already have an account?</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-logo">
            <BluebirdSVG size={22} />
            <span className="landing-footer-wordmark">The Board</span>
          </div>
          <p className="landing-footer-tagline">Carry the Signal. No cap.</p>
          <div className="landing-footer-links">
            <Link href="/login">Sign In</Link>
            <Link href="/register">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
