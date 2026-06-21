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

      {/* ── STATS BAR ── */}
      <div className="landing-stats-bar">
        <div className="stats-bar-inner">
          <div className="stat-item">
            <span className="stat-number">10k+</span>
            <span className="stat-label">Receipts Dropped</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Company Drops</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">4</span>
            <span className="stat-label">Signal Types</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Public &amp; Accountable</span>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="landing-section how-it-works">
        <div className="landing-section-inner">
          <div className="section-label">How it works</div>
          <h2 className="section-title">Signal in. Product out.</h2>
          <div className="how-grid">
            <div className="how-card">
              <div className="how-number">01</div>
              <h3 className="how-card-title">Drop a Receipt</h3>
              <p className="how-card-desc">Users post about real product experiences — glitches, wins, wishlist items, or hot takes. Tag a company Drop and pick your signal type.</p>
            </div>
            <div className="how-card">
              <div className="how-number">02</div>
              <h3 className="how-card-title">The Board Votes</h3>
              <p className="how-card-desc">The community upvotes what matters. Real signal rises, noise falls. No algorithm manipulation — just people with opinions and receipts to prove it.</p>
            </div>
            <div className="how-card">
              <div className="how-number">03</div>
              <h3 className="how-card-title">Companies Respond</h3>
              <p className="how-card-desc">Brands see the signal in their dashboard, update status publicly, and ship based on what actually matters. Accountability in public.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE FEED ── */}
      <section className="landing-section feed-showcase">
        <div className="landing-section-inner feed-showcase-inner">
          <div className="feed-showcase-text">
            <div className="section-label">The Feed</div>
            <h2 className="section-title">Your signal, live.</h2>
            <p className="section-desc">
              The Board&apos;s feed is real-time and community-driven. Browse all posts, filter to people you follow, or zoom in on verified Receipts only — signal rises to the top.
            </p>
            <ul className="feature-list">
              <li className="feature-list-item">
                <span className="feature-icon">⊞</span>
                <div><strong>For You</strong> — personalized based on your tapped-in drops and follows</div>
              </li>
              <li className="feature-list-item">
                <span className="feature-icon">👥</span>
                <div><strong>Following</strong> — only posts from people you follow</div>
              </li>
              <li className="feature-list-item">
                <span className="feature-icon">🧾</span>
                <div><strong>Receipts</strong> — verified product experiences with signal tags</div>
              </li>
              <li className="feature-list-item">
                <span className="feature-icon">🔥</span>
                <div><strong>What&apos;s Poppin</strong> — trending posts ranked by live flame score</div>
              </li>
            </ul>
          </div>
          <div className="feed-showcase-visual">
            <div className="feed-demo-window">
              <div className="demo-window-bar">
                <div className="demo-window-dots">
                  <span className="demo-dot demo-dot-red" />
                  <span className="demo-dot demo-dot-yellow" />
                  <span className="demo-dot demo-dot-green" />
                </div>
                <span className="demo-window-title">The Board — Home</span>
              </div>
              <div className="feed-demo-tabs">
                <button className="feed-tab feed-tab-active">For You</button>
                <button className="feed-tab">Following</button>
                <button className="feed-tab">Receipts</button>
              </div>
              <div className="feed-demo-compose-bar">
                <div className="demo-compose-avatar" />
                <span className="demo-compose-placeholder">What&apos;s the signal?</span>
                <button className="demo-compose-btn">Drop Receipt</button>
              </div>
              <div className="feed-demo-posts">
                <div className="demo-post-card">
                  <div className="demo-post-left">
                    <div className="demo-avatar-circle demo-av-purple">S</div>
                  </div>
                  <div className="demo-post-right">
                    <div className="demo-post-header-row">
                      <span className="demo-author-name">sarah_builds</span>
                      <span className="demo-author-handle">· 2m</span>
                      <span className="demo-signal-badge signal-glitch">⚡ Glitch</span>
                      <span className="demo-status-pill status-open">Open</span>
                    </div>
                    <div className="demo-drop-tag-row">
                      <span className="demo-drop-tag-inline" style={{ color: '#f59e0b', borderColor: '#f59e0b40' }}># AcmeApp</span>
                    </div>
                    <p className="demo-post-body-text">Checkout breaks every time on iOS. Three weeks, no fix 🧾</p>
                    <div className="demo-post-actions">
                      <button className="demo-action-btn demo-hype-btn">▲ 847</button>
                      <button className="demo-action-btn demo-cap-btn">▼ 12</button>
                      <button className="demo-action-btn">💬 23</button>
                      <button className="demo-action-btn">↗</button>
                    </div>
                  </div>
                </div>
                <div className="demo-post-card demo-post-flame">
                  <div className="demo-post-left">
                    <div className="demo-avatar-circle demo-av-orange">D</div>
                  </div>
                  <div className="demo-post-right">
                    <div className="demo-post-header-row">
                      <span className="demo-author-name">devdave</span>
                      <span className="demo-author-handle">· 8m</span>
                      <span className="demo-signal-badge signal-bigbrain">🧠 Big Brain</span>
                      <span className="demo-flame-badge">🔥 Flame</span>
                    </div>
                    <div className="demo-drop-tag-row">
                      <span className="demo-drop-tag-inline" style={{ color: '#8b5cf6', borderColor: '#8b5cf640' }}># LinearFeedback</span>
                    </div>
                    <p className="demo-post-body-text">Dashboard dark mode that actually matches the brand. Eyes dying at 2am 👀</p>
                    <div className="demo-post-actions">
                      <button className="demo-action-btn demo-hype-btn demo-hype-active">▲ 2.1k</button>
                      <button className="demo-action-btn demo-cap-btn">▼ 3</button>
                      <button className="demo-action-btn">💬 41</button>
                      <button className="demo-action-btn">↗</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SIGNAL SYSTEM ── */}
      <section className="landing-section signal-system">
        <div className="landing-section-inner">
          <div className="section-label">The Signal System</div>
          <h2 className="section-title">Four ways to be heard.</h2>
          <p className="section-subtitle">Every receipt is tagged with one signal type. No vague &quot;feedback&quot; — precise, actionable categories that companies can actually act on.</p>
          <div className="signal-grid">
            <div className="signal-card signal-card-wishlist">
              <div className="signal-card-glow signal-glow-wishlist" />
              <div className="signal-card-icon">🌈</div>
              <h3 className="signal-card-name">Wishlist</h3>
              <p className="signal-card-desc">Feature requests and ideas. Tell companies what you actually want built next.</p>
              <div className="signal-example">
                <div className="signal-example-post">
                  <span className="signal-ex-author">@maya</span>
                  <span className="signal-ex-text">Bulk CSV export would make this perfect for power users 🙌</span>
                  <span className="signal-ex-votes">▲ 413</span>
                </div>
              </div>
            </div>
            <div className="signal-card signal-card-glitch">
              <div className="signal-card-glow signal-glow-glitch" />
              <div className="signal-card-icon">⚡</div>
              <h3 className="signal-card-name">Glitch</h3>
              <p className="signal-card-desc">Bugs, breakage, and bad UX. Name it in public and companies can&apos;t ignore it.</p>
              <div className="signal-example">
                <div className="signal-example-post">
                  <span className="signal-ex-author">@sarah</span>
                  <span className="signal-ex-text">Checkout breaks on iOS Apple Pay. 3 weeks, zero response 🧾</span>
                  <span className="signal-ex-votes">▲ 847</span>
                </div>
              </div>
            </div>
            <div className="signal-card signal-card-nocap">
              <div className="signal-card-glow signal-glow-nocap" />
              <div className="signal-card-icon">🎙</div>
              <h3 className="signal-card-name">No Cap</h3>
              <p className="signal-card-desc">Raw hot takes and honest reviews. Unfiltered user truth, no PR spin allowed.</p>
              <div className="signal-example">
                <div className="signal-example-post">
                  <span className="signal-ex-author">@trav_k</span>
                  <span className="signal-ex-text">Best onboarding I&apos;ve seen all year. No cap, they nailed it</span>
                  <span className="signal-ex-votes">▲ 201</span>
                </div>
              </div>
            </div>
            <div className="signal-card signal-card-bigbrain">
              <div className="signal-card-glow signal-glow-bigbrain" />
              <div className="signal-card-icon">🧠</div>
              <h3 className="signal-card-name">Big Brain</h3>
              <p className="signal-card-desc">Strategic ideas and product vision. The kind of insights PMs dream about.</p>
              <div className="signal-example">
                <div className="signal-example-post">
                  <span className="signal-ex-author">@devdave</span>
                  <span className="signal-ex-text">AI summaries on the dashboard — act on signal 10x faster</span>
                  <span className="signal-ex-votes">▲ 1.2k</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DROP A RECEIPT ── */}
      <section className="landing-section compose-showcase">
        <div className="landing-section-inner compose-showcase-inner">
          <div className="compose-visual">
            <div className="compose-demo-window">
              <div className="compose-demo-header">
                <span className="compose-demo-title">Drop a Receipt</span>
                <span className="compose-demo-close">✕</span>
              </div>
              <div className="compose-type-toggle">
                <button className="compose-type-btn compose-type-active">🧾 Receipt</button>
                <button className="compose-type-btn">💧 Drip</button>
              </div>
              <div className="compose-field-group">
                <label className="compose-label">Tag a Drop</label>
                <div className="compose-select-mock">
                  <span>AcmeApp</span>
                  <span>▾</span>
                </div>
              </div>
              <div className="compose-field-group">
                <label className="compose-label">Pick your signal</label>
                <div className="compose-signal-picker">
                  <button className="compose-signal-btn compose-signal-glitch compose-signal-active">⚡ Glitch</button>
                  <button className="compose-signal-btn compose-signal-wishlist">🌈 Wishlist</button>
                  <button className="compose-signal-btn compose-signal-nocap">🎙 No Cap</button>
                  <button className="compose-signal-btn compose-signal-bigbrain">🧠 Big Brain</button>
                </div>
              </div>
              <div className="compose-field-group">
                <label className="compose-label">Your take</label>
                <div className="compose-textarea-mock">
                  Checkout breaks every single time I try Apple Pay on iOS. This has been happening for 3 weeks and zero acknowledgment from the team...<span className="compose-cursor">|</span>
                </div>
                <span className="compose-char-count">156 / 2000</span>
              </div>
              <button className="compose-submit-btn">Drop It 🧾</button>
            </div>
          </div>
          <div className="compose-showcase-text">
            <div className="section-label">Drop a Receipt</div>
            <h2 className="section-title">Post with purpose.</h2>
            <p className="section-desc">
              Every post on The Board is intentional. Tag it to a Drop, give it a signal type, write your truth, and let the community vote. No generic reviews — just signal.
            </p>
            <ul className="feature-list">
              <li className="feature-list-item">
                <span className="feature-icon">🧾</span>
                <div><strong>Receipt</strong> — a verified product experience with a signal tag</div>
              </li>
              <li className="feature-list-item">
                <span className="feature-icon">💧</span>
                <div><strong>Drip</strong> — a quick take or observation, no signal tag required</div>
              </li>
              <li className="feature-list-item">
                <span className="feature-icon">#</span>
                <div><strong>Drop tag</strong> — link your post directly to a specific product</div>
              </li>
              <li className="feature-list-item">
                <span className="feature-icon">📊</span>
                <div><strong>Signal type</strong> — categorize so companies know what they&apos;re dealing with</div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── DROPS ── */}
      <section className="landing-section drops-showcase">
        <div className="landing-section-inner">
          <div className="section-label">Drops</div>
          <h2 className="section-title">Every product has a home.</h2>
          <p className="section-subtitle">
            A Drop is a product&apos;s dedicated page on The Board. Users tap in to follow, post receipts, and vote on signal. Companies monitor everything in real time.
          </p>
          <div className="drop-demo-container">
            <div className="drop-demo-banner">
              <div className="drop-demo-banner-accent" />
              <div className="drop-demo-banner-content">
                <div className="drop-demo-verified">Acme Inc. ✓</div>
                <h3 className="drop-demo-name">AcmeApp</h3>
                <p className="drop-demo-desc">The all-in-one project management tool for modern teams</p>
                <div className="drop-demo-stats-row">
                  <span>2.4k tapped in</span>
                  <span className="drop-demo-dot">·</span>
                  <span>847 posts</span>
                  <span className="drop-demo-dot">·</span>
                  <span className="drop-demo-health">Health: 91%</span>
                </div>
                <div className="drop-demo-actions-row">
                  <button className="drop-demo-tapbtn">+ Tap In</button>
                  <button className="drop-demo-receiptbtn">Drop Receipt</button>
                </div>
              </div>
            </div>
            <div className="drop-demo-filters">
              <div className="drop-filter-row">
                <button className="drop-filter-tab drop-filter-active">All Posts</button>
                <button className="drop-filter-tab">Receipts Only</button>
              </div>
              <div className="drop-chips-row">
                <span className="drop-chip drop-chip-active">All</span>
                <span className="drop-chip">🌈 Wishlist</span>
                <span className="drop-chip">⚡ Glitch</span>
                <span className="drop-chip">🎙 No Cap</span>
                <span className="drop-chip">🧠 Big Brain</span>
                <span className="drop-chip-spacer" />
                <span className="drop-chip">Open</span>
                <span className="drop-chip">Planned</span>
                <span className="drop-chip drop-chip-built">Built ✓</span>
              </div>
            </div>
            <div className="drop-demo-posts">
              <div className="demo-post-card">
                <div className="demo-post-left">
                  <div className="demo-avatar-circle demo-av-purple">S</div>
                </div>
                <div className="demo-post-right">
                  <div className="demo-post-header-row">
                    <span className="demo-author-name">sarah_builds</span>
                    <span className="demo-author-handle">· 2m</span>
                    <span className="demo-signal-badge signal-glitch">⚡ Glitch</span>
                    <span className="demo-status-pill status-open">Open</span>
                  </div>
                  <p className="demo-post-body-text">Checkout breaks every time on iOS. Three weeks, no fix 🧾</p>
                  <div className="demo-post-actions">
                    <button className="demo-action-btn demo-hype-btn">▲ 847</button>
                    <button className="demo-action-btn demo-cap-btn">▼ 12</button>
                    <button className="demo-action-btn">💬 23</button>
                    <button className="demo-action-btn">↗</button>
                  </div>
                </div>
              </div>
              <div className="demo-post-card">
                <div className="demo-post-left">
                  <div className="demo-avatar-circle demo-av-blue">D</div>
                </div>
                <div className="demo-post-right">
                  <div className="demo-post-header-row">
                    <span className="demo-author-name">devdave</span>
                    <span className="demo-author-handle">· 8m</span>
                    <span className="demo-signal-badge signal-wishlist">🌈 Wishlist</span>
                    <span className="demo-status-pill status-planned">Planned</span>
                  </div>
                  <p className="demo-post-body-text">Dark mode that actually matches the brand. Eyes begging at 2am 👀</p>
                  <div className="demo-post-actions">
                    <button className="demo-action-btn demo-hype-btn demo-hype-active">▲ 2.1k</button>
                    <button className="demo-action-btn demo-cap-btn">▼ 3</button>
                    <button className="demo-action-btn">💬 41</button>
                    <button className="demo-action-btn">↗</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GOING FLAME ── */}
      <section className="landing-section flame-showcase">
        <div className="landing-section-inner flame-showcase-inner">
          <div className="flame-showcase-text">
            <div className="section-label">Going Flame</div>
            <h2 className="section-title">When signal hits critical mass.</h2>
            <p className="section-desc">
              When a receipt gets enough hype relative to its age, it goes 🔥 Flame. The community has voted and companies can&apos;t look away. The hottest posts surface on <strong>What&apos;s Poppin</strong>.
            </p>
            <ul className="feature-list">
              <li className="feature-list-item">
                <span className="feature-icon">🔥</span>
                <div><strong>Flame Score</strong> — calculated from hype velocity over time</div>
              </li>
              <li className="feature-list-item">
                <span className="feature-icon">📈</span>
                <div><strong>What&apos;s Poppin</strong> — a live leaderboard of top posts by flame score</div>
              </li>
              <li className="feature-list-item">
                <span className="feature-icon">🚨</span>
                <div><strong>Dashboard Alert</strong> — Going Flame posts surface instantly in the company dashboard</div>
              </li>
            </ul>
          </div>
          <div className="flame-showcase-visual">
            <div className="poppin-demo">
              <div className="poppin-demo-header">
                <span className="poppin-title">🔥 What&apos;s Poppin</span>
                <span className="poppin-sub">Top posts right now</span>
              </div>
              <div className="poppin-posts">
                <div className="poppin-post">
                  <span className="poppin-rank poppin-rank-gold">#1</span>
                  <div className="poppin-post-info">
                    <div className="poppin-post-top">
                      <span className="demo-signal-badge signal-glitch">⚡ Glitch</span>
                      <span className="poppin-drop-tag"># AcmeApp</span>
                    </div>
                    <p className="poppin-post-text">Checkout breaks every time on iOS. Three weeks, no fix 🧾</p>
                    <span className="poppin-hype">▲ 847 hype &nbsp;·&nbsp; 🔥 2.4k flame</span>
                  </div>
                </div>
                <div className="poppin-post">
                  <span className="poppin-rank poppin-rank-silver">#2</span>
                  <div className="poppin-post-info">
                    <div className="poppin-post-top">
                      <span className="demo-signal-badge signal-bigbrain">🧠 Big Brain</span>
                      <span className="poppin-drop-tag"># LinearFeedback</span>
                    </div>
                    <p className="poppin-post-text">Dark mode that matches the brand. My eyes at 2am 👀</p>
                    <span className="poppin-hype">▲ 2.1k hype &nbsp;·&nbsp; 🔥 1.9k flame</span>
                  </div>
                </div>
                <div className="poppin-post">
                  <span className="poppin-rank poppin-rank-bronze">#3</span>
                  <div className="poppin-post-info">
                    <div className="poppin-post-top">
                      <span className="demo-signal-badge signal-wishlist">🌈 Wishlist</span>
                      <span className="poppin-drop-tag"># NotionWishes</span>
                    </div>
                    <p className="poppin-post-text">Bulk export as CSV. Power users have been asking for years 🙌</p>
                    <span className="poppin-hype">▲ 413 hype &nbsp;·&nbsp; 🔥 890 flame</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPANY DASHBOARD ── */}
      <section className="landing-section dashboard-showcase">
        <div className="landing-section-inner">
          <div className="section-label">Company Dashboard</div>
          <h2 className="section-title">Signal intelligence, live.</h2>
          <p className="section-subtitle">
            Companies get a real-time command center. See all signal across your Drops, manage receipts, update status publicly, and export insights straight to your roadmap.
          </p>
          <div className="dashboard-demo">
            <div className="dashboard-demo-header">
              <div>
                <h3 className="dash-title">Dashboard</h3>
                <p className="dash-sub">AcmeApp&apos;s signal intelligence</p>
              </div>
              <div className="dash-header-actions">
                <button className="dash-btn">+ New Drop</button>
                <button className="dash-btn dash-btn-secondary">Export CSV ↓</button>
              </div>
            </div>
            <div className="dashboard-stat-cards">
              <div className="dash-stat-card">
                <span className="dash-stat-label">Drops</span>
                <span className="dash-stat-value">3</span>
              </div>
              <div className="dash-stat-card">
                <span className="dash-stat-label">Total Receipts</span>
                <span className="dash-stat-value">847</span>
              </div>
              <div className="dash-stat-card">
                <span className="dash-stat-label">Total Hype</span>
                <span className="dash-stat-value">12.4k</span>
              </div>
              <div className="dash-stat-card dash-stat-flame">
                <span className="dash-stat-label">Going Flame 🔥</span>
                <span className="dash-stat-value dash-stat-flame-val">7</span>
              </div>
            </div>
            <div className="dashboard-receipts">
              <div className="dash-receipts-toolbar">
                <h4 className="dash-section-title">Receipts</h4>
                <div className="dash-toolbar-filters">
                  <div className="dash-filter-select">All Drops ▾</div>
                  <div className="dash-filter-select">All Signals ▾</div>
                </div>
              </div>
              <div className="dash-receipts-table">
                <div className="dash-receipt-row dash-receipt-flame-row">
                  <div className="dash-receipt-left">
                    <span className="demo-flame-badge">🔥</span>
                    <span className="demo-signal-badge signal-glitch">⚡ Glitch</span>
                  </div>
                  <div className="dash-receipt-text">
                    <p className="dash-receipt-body">Checkout breaks every time on iOS. Three weeks, no fix 🧾</p>
                  </div>
                  <div className="dash-receipt-votes">
                    <span className="dash-vote-up">▲ 847</span>
                    <span className="dash-vote-dn">▼ 12</span>
                  </div>
                  <div className="dash-receipt-right">
                    <span className="demo-status-pill status-open">Open</span>
                    <button className="dash-status-btn">Update ▾</button>
                  </div>
                </div>
                <div className="dash-receipt-row">
                  <div className="dash-receipt-left">
                    <span className="demo-signal-badge signal-wishlist">🌈 Wishlist</span>
                  </div>
                  <div className="dash-receipt-text">
                    <p className="dash-receipt-body">Dark mode that matches the brand. Eyes bleeding at 2am 👀</p>
                  </div>
                  <div className="dash-receipt-votes">
                    <span className="dash-vote-up">▲ 2.1k</span>
                    <span className="dash-vote-dn">▼ 3</span>
                  </div>
                  <div className="dash-receipt-right">
                    <span className="demo-status-pill status-planned">Planned</span>
                    <button className="dash-status-btn">Update ▾</button>
                  </div>
                </div>
                <div className="dash-receipt-row">
                  <div className="dash-receipt-left">
                    <span className="demo-signal-badge signal-bigbrain">🧠 Big Brain</span>
                  </div>
                  <div className="dash-receipt-text">
                    <p className="dash-receipt-body">AI summaries in the dashboard — act on signal 10x faster</p>
                  </div>
                  <div className="dash-receipt-votes">
                    <span className="dash-vote-up">▲ 1.2k</span>
                    <span className="dash-vote-dn">▼ 8</span>
                  </div>
                  <div className="dash-receipt-right">
                    <span className="demo-status-pill status-building">Building</span>
                    <button className="dash-status-btn">Update ▾</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATUS LIFECYCLE ── */}
      <section className="landing-section status-lifecycle">
        <div className="landing-section-inner">
          <div className="section-label">The Status Cycle</div>
          <h2 className="section-title">Accountability, in public.</h2>
          <p className="section-subtitle">
            When a company updates a receipt&apos;s status, everyone sees it. Users get notified. Progress is public. There&apos;s nowhere to hide — and that&apos;s the entire point.
          </p>
          <div className="status-flow">
            <div className="status-step">
              <div className="status-step-pill status-open">Open</div>
              <p className="status-step-desc">Receipt is live and voting is active.</p>
            </div>
            <div className="status-flow-arrow">→</div>
            <div className="status-step">
              <div className="status-step-pill status-seen">Seen</div>
              <p className="status-step-desc">Company acknowledges. User notified.</p>
            </div>
            <div className="status-flow-arrow">→</div>
            <div className="status-step">
              <div className="status-step-pill status-planned">Planned</div>
              <p className="status-step-desc">On the roadmap. Community knows it&apos;s coming.</p>
            </div>
            <div className="status-flow-arrow">→</div>
            <div className="status-step">
              <div className="status-step-pill status-building">Building</div>
              <p className="status-step-desc">In active development. Real accountability.</p>
            </div>
            <div className="status-flow-arrow">→</div>
            <div className="status-step">
              <div className="status-step-pill status-built">Built ✓</div>
              <p className="status-step-desc">Shipped. Signal became product.</p>
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
                <li>Follow Drops for your favourite products</li>
                <li>Get notified when status changes</li>
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
                <li>Update status to close the loop</li>
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
