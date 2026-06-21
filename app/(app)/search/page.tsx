import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { TbPost, TbDrop } from '@/lib/types'
import SignalBadge from '@/components/SignalBadge'
import { formatCount } from '@/lib/utils'

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '' } = await searchParams
  const query = q.trim()

  const supabase = await createClient()

  const [dropsResult, postsResult] = query
    ? await Promise.all([
        supabase
          .from('tb_drops')
          .select('id, name, slug, accent_color, tap_in_count, is_claimed, description')
          .ilike('name', `%${query}%`)
          .order('tap_in_count', { ascending: false })
          .limit(10),
        supabase
          .from('tb_posts')
          .select('*, author:tb_profiles(username, display_name), drop:tb_drops(name, slug, accent_color)')
          .or(`title.ilike.%${query}%,body.ilike.%${query}%`)
          .order('flame_score', { ascending: false })
          .limit(20),
      ])
    : [{ data: [] }, { data: [] }]

  const drops = (dropsResult.data ?? []) as unknown as (TbDrop & { description: string | null })[]
  const posts = (postsResult.data ?? []) as unknown as TbPost[]

  return (
    <div className="search-page">
      <div className="feed-header">
        <h1 className="page-title">Search</h1>
      </div>

      <form method="GET" action="/search" className="search-form">
        <input
          type="search"
          name="q"
          defaultValue={query}
          className="search-input-lg"
          placeholder="Search drops, receipts, drips…"
          autoFocus
        />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {query && (
        <>
          {drops.length > 0 && (
            <section className="search-section">
              <h2 className="section-title">Drops</h2>
              <div className="search-drops-grid">
                {drops.map(d => (
                  <Link key={d.id} href={`/d/${d.slug}`} className="search-drop-card" style={{ borderColor: d.accent_color }}>
                    <div className="drop-card-accent" style={{ backgroundColor: d.accent_color }} />
                    <div className="search-drop-info">
                      <span className="search-drop-name">{d.name}</span>
                      {!d.is_claimed && <span className="unclaimed-badge">Unclaimed</span>}
                      {d.description && <p className="search-drop-desc">{d.description}</p>}
                      <span className="search-drop-count">{formatCount(d.tap_in_count)} tapped in</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {posts.length > 0 && (
            <section className="search-section">
              <h2 className="section-title">Posts</h2>
              <div className="search-posts-list">
                {posts.map(p => (
                  <Link key={p.id} href={`/p/${p.id}`} className="search-post-item">
                    <div className="search-post-meta">
                      {p.signal_type && <SignalBadge type={p.signal_type} />}
                      <span className="search-post-drop" style={{ color: p.drop?.accent_color }}>
                        {p.drop?.name}
                      </span>
                    </div>
                    {p.title && <h3 className="search-post-title">{p.title}</h3>}
                    <p className="search-post-body">{p.body.slice(0, 140)}{p.body.length > 140 ? '…' : ''}</p>
                    <div className="search-post-footer">
                      <span>⬆ {formatCount(p.hype_count)}</span>
                      <span>@{(p.author as { username: string } | undefined)?.username}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {drops.length === 0 && posts.length === 0 && (
            <div className="empty-state">
              <p className="empty-title">No results for &ldquo;{query}&rdquo;</p>
              <p className="empty-sub">Try a different search term, or suggest a new Drop</p>
            </div>
          )}
        </>
      )}

      {!query && (
        <div className="empty-state">
          <p className="empty-title">Search The Board</p>
          <p className="empty-sub">Find drops, receipts, and product signals</p>
        </div>
      )}
    </div>
  )
}
