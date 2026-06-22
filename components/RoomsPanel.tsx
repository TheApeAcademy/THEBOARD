'use client'

import { useState } from 'react'
import Link from 'next/link'

interface RoomEntry {
  id: string
  name: string
  description: string | null
  is_private: boolean
  drop: {
    id: string
    name: string
    slug: string
    accent_color: string
  } | null
}

interface RoomsPanelProps {
  userRooms: RoomEntry[]
  discoveryRooms: RoomEntry[]
}

export default function RoomsPanel({ userRooms, discoveryRooms }: RoomsPanelProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const q = search.toLowerCase()
  const filteredUser = userRooms.filter(r =>
    r.name.toLowerCase().includes(q) || (r.drop?.name ?? '').toLowerCase().includes(q)
  )
  const filteredDiscover = discoveryRooms.filter(r =>
    r.name.toLowerCase().includes(q) || (r.drop?.name ?? '').toLowerCase().includes(q)
  )

  function close() { setOpen(false); setSearch('') }

  return (
    <>
      <button className="rooms-fab" onClick={() => setOpen(true)} title="Your Rooms" aria-label="Open rooms panel">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M16 3v18" />
          <circle cx="14" cy="12" r="1.2" fill="currentColor" stroke="none" />
        </svg>
        {userRooms.length > 0 && (
          <span className="rooms-fab-badge">{userRooms.length > 9 ? '9+' : userRooms.length}</span>
        )}
      </button>

      {open && (
        <div
          className="rooms-overlay"
          onClick={e => { if (e.target === e.currentTarget) close() }}
        >
          <div className="rooms-panel" role="dialog" aria-label="Rooms">
            <div className="rooms-panel-handle" />

            <div className="rooms-panel-header">
              <h2 className="rooms-panel-title">Rooms</h2>
              <button className="rooms-panel-close" onClick={close} aria-label="Close">✕</button>
            </div>

            <div className="rooms-panel-search-wrap">
              <input
                type="text"
                className="form-input rooms-panel-search"
                placeholder="Search rooms…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
              />
            </div>

            <div className="rooms-panel-body">
              {filteredUser.length > 0 && (
                <section className="rooms-section">
                  <h3 className="rooms-section-label">Joined</h3>
                  {filteredUser.map(room => (
                    <Link
                      key={room.id}
                      href={`/rooms/${room.id}`}
                      className="rooms-panel-row"
                      onClick={close}
                    >
                      <div
                        className="rooms-panel-accent"
                        style={{ backgroundColor: room.drop?.accent_color ?? '#444' }}
                      />
                      <div className="rooms-panel-row-info">
                        <span className="rooms-panel-row-name">
                          <span className="rooms-panel-row-prefix">{room.is_private ? '🔒' : '#'}</span>
                          {room.name}
                        </span>
                        {room.drop && (
                          <span className="rooms-panel-row-drop">{room.drop.name}</span>
                        )}
                      </div>
                      <span className="rooms-panel-row-arrow">→</span>
                    </Link>
                  ))}
                </section>
              )}

              {filteredUser.length === 0 && !search && (
                <div className="rooms-panel-empty">
                  <p>No rooms yet.</p>
                  <p>Tap into Drops and join their rooms.</p>
                </div>
              )}

              {filteredDiscover.length > 0 && (
                <section className="rooms-section">
                  <h3 className="rooms-section-label">Discover</h3>
                  {filteredDiscover.map(room => (
                    <Link
                      key={room.id}
                      href={`/rooms/${room.id}`}
                      className="rooms-panel-row rooms-panel-row-discover"
                      onClick={close}
                    >
                      <div
                        className="rooms-panel-accent"
                        style={{ backgroundColor: room.drop?.accent_color ?? '#444' }}
                      />
                      <div className="rooms-panel-row-info">
                        <span className="rooms-panel-row-name">
                          <span className="rooms-panel-row-prefix">#</span>
                          {room.name}
                        </span>
                        {room.drop && (
                          <span className="rooms-panel-row-drop">{room.drop.name}</span>
                        )}
                      </div>
                      <span className="rooms-panel-row-arrow rooms-panel-row-join">Join</span>
                    </Link>
                  ))}
                </section>
              )}

              {search && filteredUser.length === 0 && filteredDiscover.length === 0 && (
                <div className="rooms-panel-empty">
                  <p>No rooms match &ldquo;{search}&rdquo;</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
