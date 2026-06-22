import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { joinRoom } from '@/actions/rooms'
import Link from 'next/link'

interface Props {
  params: Promise<{ room_id: string }>
}

export default async function JoinRoomPage({ params }: Props) {
  const { room_id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: room } = await supabase
    .from('tb_rooms')
    .select('id, name, is_private, drop:tb_drops(id, name, slug, accent_color)')
    .eq('id', room_id)
    .single()

  if (!room) notFound()

  const drop = room.drop as unknown as { id: string; name: string; slug: string; accent_color: string } | null

  if (!user) {
    return (
      <div className="join-page">
        <div className="join-card">
          <div className="join-accent" style={{ backgroundColor: drop?.accent_color ?? '#1D9BF0' }} />
          <div className="join-body">
            <p className="join-drop-label">{drop?.name}</p>
            <h1 className="join-room-name">{room.name}</h1>
            {room.is_private && <span className="join-private-badge">Private Room</span>}
            <p className="join-sub">Sign in to join this room</p>
            <Link
              href={`/login?redirect=/join/${room_id}`}
              className="btn-primary"
            >
              Sign in to Join
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const result = await joinRoom(room_id)

  if (!result.ok) {
    return (
      <div className="join-page">
        <div className="join-card">
          <div className="join-accent" style={{ backgroundColor: drop?.accent_color ?? '#1D9BF0' }} />
          <div className="join-body">
            <p className="join-drop-label">{drop?.name}</p>
            <h1 className="join-room-name">{room.name}</h1>
            <p className="join-error">{result.error}</p>
            {drop && (
              <Link href={`/d/${drop.slug}`} className="btn-secondary">
                Back to {drop.name}
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  redirect(`/rooms/${room_id}`)
}
