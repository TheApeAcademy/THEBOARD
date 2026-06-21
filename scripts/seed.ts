/**
 * Seed script — run once against DOBERMAN project
 * Usage: npx tsx scripts/seed.ts
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const COMPANIES = [
  { name: 'Stripe', slug: 'stripe', color: '#635BFF' },
  { name: 'Notion', slug: 'notion', color: '#000000' },
  { name: 'Linear', slug: 'linear', color: '#5E6AD2' },
  { name: 'Figma', slug: 'figma', color: '#F24E1E' },
  { name: 'Vercel', slug: 'vercel', color: '#FFFFFF' },
  { name: 'Supabase', slug: 'supabase', color: '#3ECF8E' },
  { name: 'Loom', slug: 'loom', color: '#625DF5' },
  { name: 'Slack', slug: 'slack', color: '#4A154B' },
  { name: 'GitHub', slug: 'github', color: '#333333' },
  { name: 'Framer', slug: 'framer', color: '#0055FF' },
]

const SIGNAL_TYPES: ('wishlist' | 'glitch' | 'no_cap' | 'big_brain' | undefined)[] = ['wishlist', 'glitch', 'no_cap', 'big_brain']
const STATUSES = ['open', 'seen', 'planned', 'building', 'built', 'rip'] as const

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }

const RECEIPT_TEMPLATES = [
  { title: 'Dark mode for the dashboard', body: 'The dashboard is blinding at night. Please add dark mode, even a basic one.', signal: 'wishlist' as const },
  { title: 'API rate limits are too low', body: 'On the free plan the rate limits are killing our dev workflow. Even 2x would help.', signal: 'glitch' as const },
  { title: 'Finally fixed the mobile export bug', body: "The PDF export on mobile was broken for months. They finally patched it. Works perfectly now.", signal: 'no_cap' as const },
  { title: 'Offline mode is a must', body: "I lose work every time I'm on a plane. Even read-only offline would be huge.", signal: 'wishlist' as const },
  { title: 'The new keyboard shortcuts are game changing', body: 'Whoever designed the new shortcut system deserves a raise. Cmd+K everything.', signal: 'big_brain' as const },
  { title: 'Search is basically broken', body: "Can't find anything with the search. It ignores stop words, misses recent items, and lags 3+ seconds.", signal: 'glitch' as const },
  { title: 'Multi-workspace support', body: "I have 4 different client orgs. Switching accounts is a nightmare. Please give us multi-workspace.", signal: 'wishlist' as const },
  { title: 'SSO works flawlessly', body: "Set up Okta SSO in 10 minutes flat. No docs needed. Just worked.", signal: 'no_cap' as const },
  { title: 'AI summaries would be a killer feature', body: "Imagine if the tool auto-summarized long threads. Would save hours every week.", signal: 'big_brain' as const },
  { title: 'Data export is a mess', body: "The CSV export drops half the fields. We're having to manually fix our data every Monday.", signal: 'glitch' as const },
  { title: 'Please add Zapier integration', body: "We use Zapier for everything. Having a native Zapier integration would unlock so many workflows.", signal: 'wishlist' as const },
  { title: 'Collaboration latency is unreal', body: "5 people in the same doc and it's silky smooth. Whoever built the CRDT layer is a genius.", signal: 'big_brain' as const },
  { title: 'Billing page is confusing', body: "I couldn't figure out where to update my credit card for 20 minutes. The billing UX needs work.", signal: 'glitch' as const },
  { title: 'Guest access for clients', body: "Would love to share views with clients without them needing full accounts.", signal: 'wishlist' as const },
  { title: 'The notification system actually works now', body: "Used to miss half my mentions. New notification system is reliable.", signal: 'no_cap' as const },
]

const DRIP_TEMPLATES = [
  "Is anyone else's performance noticeably worse after the last update? Pages taking 3x longer to load.",
  "Just migrated 50k users to the new plan structure. Zero issues. Respect to the eng team.",
  "The community forum is dead. Nobody from the company responds anymore.",
  "Hot take: the pricing is actually fair for what you get. Most people complaining haven't tried the alternatives.",
  "Their support team is legitimately the best I've ever worked with. Responded in 4 minutes on a Sunday.",
  "This product has basically replaced 3 other tools for us. The cost savings are real.",
  "Still waiting on the mobile app. Been 'coming soon' for 18 months now.",
  "The onboarding flow is confusing for non-technical users. We lost 3 potential customers this week.",
]

async function main() {
  console.log('🌱 Seeding The Board...')

  // Create company profiles
  console.log('Creating company profiles...')
  const companyProfiles: { id: string; username: string }[] = []

  for (const company of COMPANIES) {
    const email = `${company.slug}@seed.theboard.app`
    const { data: existing } = await supabase
      .from('tb_profiles')
      .select('id, username')
      .eq('username', company.slug)
      .single()

    if (existing) {
      companyProfiles.push(existing)
      continue
    }

    const { data: authUser } = await supabase.auth.admin.createUser({
      email,
      password: 'Seed1234!',
      email_confirm: true,
    })

    if (!authUser.user) { console.warn(`Failed to create auth user for ${company.name}`); continue }

    const { data: profile } = await supabase
      .from('tb_profiles')
      .upsert({
        id: authUser.user.id,
        username: company.slug,
        display_name: company.name,
        role: 'company',
        hype_score: 0,
        follower_count: 0,
      }, { onConflict: 'id' })
      .select('id, username')
      .single()

    if (profile) companyProfiles.push(profile)
  }

  // Create Drops
  console.log('Creating Drops...')
  const dropMap: Record<string, string> = {} // slug → drop.id

  for (let i = 0; i < COMPANIES.length; i++) {
    const company = COMPANIES[i]
    const profile = companyProfiles[i]
    if (!profile) continue

    const { data: existing } = await supabase
      .from('tb_drops')
      .select('id, slug')
      .eq('slug', company.slug)
      .single()

    if (existing) { dropMap[existing.slug] = existing.id; continue }

    const { data: drop } = await supabase
      .from('tb_drops')
      .insert({
        profile_id: profile.id,
        name: company.name,
        slug: company.slug,
        accent_color: company.color,
        widgets: [],
        verified: true,
        tap_in_count: randInt(100, 5000),
        health_score: randInt(40, 95),
        is_claimed: true,
        claimed_at: new Date().toISOString(),
        description: `Official ${company.name} Drop on The Board. Drop your feedback, signal your needs.`,
      })
      .select('id, slug')
      .single()

    if (drop) dropMap[drop.slug] = drop.id
  }

  const dropIds = Object.values(dropMap)
  if (dropIds.length === 0) { console.error('No drops created'); process.exit(1) }

  // Create 50 user profiles
  console.log('Creating user profiles...')
  const userIds: string[] = []

  for (let i = 0; i < 50; i++) {
    const username = `user_${i.toString().padStart(3, '0')}`
    const email = `${username}@seed.theboard.app`

    const { data: existing } = await supabase
      .from('tb_profiles')
      .select('id')
      .eq('username', username)
      .single()

    if (existing) { userIds.push(existing.id); continue }

    const { data: authUser } = await supabase.auth.admin.createUser({
      email,
      password: 'Seed1234!',
      email_confirm: true,
    })

    if (!authUser.user) continue

    await supabase.from('tb_profiles').upsert({
      id: authUser.user.id,
      username,
      display_name: `User ${i}`,
      role: 'user',
      hype_score: randInt(0, 500),
      follower_count: randInt(0, 100),
    }, { onConflict: 'id' })

    userIds.push(authUser.user.id)
  }

  console.log(`Created ${userIds.length} users`)

  // Create tap-ins
  console.log('Creating tap-ins...')
  for (const userId of userIds) {
    const tappedDropIds = dropIds.sort(() => Math.random() - 0.5).slice(0, randInt(1, 5))
    for (const dropId of tappedDropIds) {
      await supabase.from('tb_tap_ins').upsert({ user_id: userId, drop_id: dropId }, { onConflict: 'user_id,drop_id' })
    }
  }

  // Create 300 posts
  console.log('Creating posts...')
  const postIds: string[] = []

  for (let i = 0; i < 300; i++) {
    const dropId = rand(dropIds)
    const authorId = rand(userIds)
    const isReceipt = Math.random() > 0.3
    const template = isReceipt ? rand(RECEIPT_TEMPLATES) : null
    const hype = randInt(0, 300)
    const cap = randInt(0, Math.floor(hype * 0.3))
    const flameScore = hype * 0.8 - cap * 1.5 + Math.random() * 10
    const statusOpts = STATUSES.filter(s => s !== 'open')
    const status = Math.random() > 0.6 ? rand(statusOpts) : 'open'

    const { data: post } = await supabase
      .from('tb_posts')
      .insert({
        drop_id: dropId,
        author_id: authorId,
        post_type: isReceipt ? 'receipt' : 'drip',
        signal_type: isReceipt ? (template?.signal ?? rand(SIGNAL_TYPES)) : null,
        title: isReceipt ? (template?.title ?? null) : null,
        body: isReceipt ? (template?.body ?? 'This is a receipt post.') : rand(DRIP_TEMPLATES),
        status,
        hype_count: hype,
        cap_count: cap,
        flame_score: flameScore,
        is_flame: flameScore > 100,
      })
      .select('id')
      .single()

    if (post) postIds.push(post.id)
  }

  console.log(`Created ${postIds.length} posts`)

  // Create votes (power-law distribution)
  console.log('Creating votes...')
  let voteCount = 0
  for (const postId of postIds) {
    const voterCount = randInt(1, 30)
    const voters = userIds.sort(() => Math.random() - 0.5).slice(0, voterCount)
    for (const userId of voters) {
      const voteType = Math.random() > 0.2 ? 'hype' : 'cap'
      const { error } = await supabase
        .from('tb_votes')
        .upsert({ post_id: postId, user_id: userId, vote_type: voteType }, { onConflict: 'post_id,user_id' })
      if (!error) voteCount++
    }
  }

  console.log(`Created ${voteCount} votes`)

  // Status history for some posts
  console.log('Creating status history...')
  const nonOpenPosts = await supabase
    .from('tb_posts')
    .select('id, status, drop_id')
    .neq('status', 'open')
    .limit(50)

  if (nonOpenPosts.data) {
    for (const post of nonOpenPosts.data) {
      const drop = Object.entries(dropMap).find(([, id]) => id === post.drop_id)
      if (!drop) continue
      const companyProfile = companyProfiles[COMPANIES.findIndex(c => c.slug === drop[0])]
      if (!companyProfile) continue

      await supabase.from('tb_post_status_history').insert({
        post_id: post.id,
        old_status: 'open',
        new_status: post.status,
        changed_by: companyProfile.id,
        note: post.status === 'built' ? 'Shipped in v2.4!' : null,
      })
    }
  }

  console.log('✅ Seed complete!')
  console.log(`  • ${COMPANIES.length} Drops`)
  console.log(`  • ${userIds.length} Users`)
  console.log(`  • ${postIds.length} Posts`)
  console.log(`  • ${voteCount} Votes`)
}

main().catch(console.error)
