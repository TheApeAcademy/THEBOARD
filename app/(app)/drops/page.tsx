import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { TbDrop } from '@/lib/types'

export default async function DropsPage() {
  const supabase = await createClient()

  const [claimedResult, unclaimedResult] = await Promise.all([
    supabase
      .from('tb_drops')
      .select('*')
      .eq('is_claimed', true)
      .order('tap_in_count', { ascending: false })
      .limit(40),
    supabase
      .from('tb_drops')
      .select('*, posts:tb_posts(count)')
      .eq('is_claimed', false)
      .order('tap_in_count', { ascending: false })
      .limit(20),
  ])

  const claimed = (claimedResult.data ?? []) as unknown as TbDrop[]
  const unclaimed = (unclaimedResult.data ?? []) as unknown as (TbDrop & { posts: { count: number }[] })[]

  return (
    <div className="drops-directory">
      <div className="feed-header">
        <h1 className="page-title">Drops</h1>
        <Link href="/drops/new" className="btn-primary btn-sm">+ Create Drop</Link>
      </div>

      <section className="drops-section">
        <h2 className="drops-section-title">
          <span className="drops-section-dot drops-section-dot-claimed" />
          Verified & Active
        </h2>
        <div className="drops-grid">
          {claimed.map(drop => (
            <Link key={drop.id} href={`/d/${drop.slug}`} className="drop-card-mini">
              <div className="drop-card-mini-accent" style={{ backgroundColor: drop.accent_color }} />
              <div className="drop-card-mini-body">
                <div className="drop-card-mini-name-row">
                  <span className="drop-card-mini-name">{drop.name}</span>
                  {drop.verified && <span className="verified-badge-sm">✓</span>}
                </div>
                {drop.description && (
                  <p className="drop-card-mini-desc">{drop.description.slice(0, 80)}{drop.description.length > 80 ? '…' : ''}</p>
                )}
                <span className="drop-card-mini-stat">{drop.tap_in_count.toLocaleString()} tapped in</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {unclaimed.length > 0 && (
        <section className="drops-section">
          <h2 className="drops-section-title">
            <span className="drops-section-dot drops-section-dot-unclaimed" />
            Waiting to be Claimed
            <span className="drops-section-sub">These drops were created by the community. Is this yours?</span>
          </h2>
          <div className="drops-grid">
            {unclaimed.map(drop => {
              const postCount = drop.posts?.[0]?.count ?? 0
              return (
                <Link key={drop.id} href={`/d/${drop.slug}`} className="drop-card-mini drop-card-mini-unclaimed">
                  <div className="drop-card-mini-accent" style={{ backgroundColor: drop.accent_color }} />
                  <div className="drop-card-mini-body">
                    <div className="drop-card-mini-name-row">
                      <span className="drop-card-mini-name">{drop.name}</span>
                      <span className="unclaimed-pill-sm">Unclaimed</span>
                    </div>
                    <span className="drop-card-mini-stat">{postCount} receipt{postCount !== 1 ? 's' : ''}</span>
                  </div>
                  <Link href={`/claim/${drop.slug}`} className="drop-claim-cta" onClick={e => e.stopPropagation()}>
                    Claim →
                  </Link>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {claimed.length === 0 && unclaimed.length === 0 && (
        <div className="empty-state">
          <p className="empty-title">No Drops yet</p>
          <p className="empty-sub">Be the first to create one</p>
        </div>
      )}
    </div>
  )
}
