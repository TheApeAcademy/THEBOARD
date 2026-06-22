import { NextResponse } from 'next/server'
import type { SignalType } from '@/lib/types'

export async function POST(request: Request) {
  const { drop_id, email, body, signal_type } = await request.json() as {
    drop_id: string
    email: string
    body: string
    signal_type: SignalType
  }

  if (!drop_id || !email || !body || !signal_type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!email.includes('@') || email.length > 254) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  // Guest lead captured — in production: forward to CRM/email queue
  // For now: acknowledge receipt so the widget shows success
  console.log('[widget/guest]', { drop_id, email, signal_type, body: body.slice(0, 80) })

  return NextResponse.json({ ok: true })
}
