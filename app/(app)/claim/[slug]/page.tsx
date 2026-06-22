import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { claimDrop } from '@/actions/shadowDrops'
import type { TbDrop } from '@/lib/types'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ClaimDropPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/login?next=/claim/${slug}`)

  const { data: profile } = await supabase
    .from('tb_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const { data: drop } = await supabase
    .from('tb_drops')
    .select('id, name, slug, accent_color, tap_in_count, is_claimed')
    .eq('slug', slug)
    .single()

  if (!drop) redirect('/')
  if (drop.is_claimed) redirect(`/d/${slug}`)

  const d = drop as unknown as TbDrop & { tap_in_count: number }

  async function handleClaim() {
    'use server'
    const result = await claimDrop(slug)
    if (result.ok) {
      redirect(`/d/${slug}`)
    }
  }

  const isCompany = profile?.role === 'company'

  return (
    <div className="claim-page">
      <div className="claim-container">
        <div className="claim-drop-preview" style={{ borderColor: d.accent_color }}>
          <div className="claim-drop-accent" style={{ backgroundColor: d.accent_color }} />
          <div>
            <h2 className="claim-drop-name">{d.name}</h2>
            <p className="claim-drop-stats">{d.tap_in_count} users tapped in · Waiting to be claimed</p>
          </div>
        </div>

        <div className="claim-card">
          <h1 className="claim-title">Claim {d.name} on The Board</h1>
          <p className="claim-desc">
            Users are already talking about {d.name}. Claim your Drop to respond to feedback,
            update receipt statuses, and build a direct community with your users.
          </p>

          {!isCompany ? (
            <div className="claim-no-access">
              <p className="claim-notice">
                You need a <strong>Business account</strong> to claim a Drop.
              </p>
              <a href="/register?role=company" className="btn-primary">
                Register as a Business →
              </a>
            </div>
          ) : (
            <div className="claim-form">
              <div className="claim-checklist">
                <div className="claim-check">✓ Respond to user receipts</div>
                <div className="claim-check">✓ Update status of feedback (Planned → Built)</div>
                <div className="claim-check">✓ Create private rooms for team &amp; VIP users</div>
                <div className="claim-check">✓ Embed The Board widget on your site</div>
                <div className="claim-check">✓ Access business growth analytics</div>
              </div>

              <form action={handleClaim}>
                <button type="submit" className="btn-primary claim-btn">
                  Claim {d.name} Drop →
                </button>
              </form>

              <p className="claim-fine-print">
                By claiming, you confirm you are an authorized representative of {d.name}.
                False claims will result in account suspension.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
