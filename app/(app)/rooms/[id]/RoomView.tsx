'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import Link from 'next/link'
import type { TbRoom, TbPost, TbRoomMember } from '@/lib/types'
import PostCard from '@/components/PostCard'
import { createPost } from '@/actions/posts'
import { useToast } from '@/components/Toast'
import { avatarLetter } from '@/lib/utils'

interface RoomViewProps {
  room: TbRoom
  posts: TbPost[]
  members: TbRoomMember[]
  currentUserId?: string
  myRole: string | null
}

export default function RoomView({ room, posts: initialPosts, members, currentUserId, myRole }: RoomViewProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [body, setBody] = useState('')
  const [showMembers, setShowMembers] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const bottomRef = useRef<HTMLDivElement>(null)
  const drop = (room as TbRoom & { drop?: { id: string; name: string; slug: string; accent_color: string } | null }).drop

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [posts.length])

  function handlePost(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim() || !drop) return
    const trimmed = body.trim()
    setBody('')
    startTransition(async () => {
      const result = await createPost({
        drop_id: drop.id,
        post_type: 'drip',
        signal_type: null,
        title: null,
        body: trimmed,
        room_id: room.id,
      })
      if (result.ok) {
        toast('Posted', 'success')
        setPosts(prev => [...prev, {
          id: result.data!.id,
          drop_id: drop.id,
          author_id: currentUserId!,
          post_type: 'drip',
          signal_type: null,
          title: null,
          body: trimmed,
          status: 'open',
          hype_count: 0,
          cap_count: 0,
          flame_score: 0,
          is_flame: false,
          room_id: room.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
      } else {
        toast(result.error ?? 'Failed to post', 'error')
        setBody(trimmed)
      }
    })
  }

  return (
    <div className="room-view">
      <div className="room-view-header" style={{ borderBottom: `2px solid ${drop?.accent_color ?? 'var(--border)'}` }}>
        {drop && (
          <Link href={`/d/${drop.slug}`} className="room-breadcrumb">
            ← {drop.name}
          </Link>
        )}
        <div className="room-view-title-row">
          <span className="room-view-icon">{room.is_private ? '🔒' : '#'}</span>
          <h1 className="room-view-title">{room.name}</h1>
          {room.is_private && <span className="room-private-badge">Private</span>}
          {myRole && <span className="room-my-role">{myRole}</span>}
        </div>
        {room.description && <p className="room-view-desc">{room.description}</p>}
        <div className="room-view-meta">
          <button
            className="room-members-toggle"
            onClick={() => setShowMembers(v => !v)}
          >
            {members.length} member{members.length !== 1 ? 's' : ''} {showMembers ? '▲' : '▼'}
          </button>
          <span>{posts.length} post{posts.length !== 1 ? 's' : ''}</span>
        </div>

        {showMembers && (
          <div className="room-members-list">
            {members.map(m => {
              const p = m.profile as TbRoomMember['profile']
              if (!p) return null
              return (
                <Link key={m.id} href={`/u/${p.username}`} className="room-member-chip">
                  <span className="room-member-avatar">
                    {p.avatar_url
                      ? <img src={p.avatar_url} alt={p.display_name ?? p.username} />
                      : avatarLetter(p.display_name ?? p.username)
                    }
                  </span>
                  <span>{p.display_name ?? p.username}</span>
                  {m.role !== 'member' && <span className="room-member-role">{m.role}</span>}
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <div className="room-view-body">
        <div className="room-feed">
          {posts.length === 0 ? (
            <div className="empty-state">
              <p className="empty-title">No posts yet</p>
              <p className="empty-sub">Start the conversation in {room.name}</p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} currentUserId={currentUserId} showDrop={false} />
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {currentUserId && myRole ? (
          <form onSubmit={handlePost} className="room-compose">
            <textarea
              className="form-textarea room-compose-input"
              placeholder={`Post in ${room.name}…`}
              value={body}
              onChange={e => setBody(e.target.value)}
              maxLength={2000}
              rows={3}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handlePost(e as unknown as React.FormEvent)
              }}
            />
            <div className="room-compose-footer">
              <span className="char-count">{body.length}/2000</span>
              <span className="room-compose-hint">⌘↵ to post</span>
              <button type="submit" className="btn-primary btn-sm" disabled={isPending || !body.trim()}>
                {isPending ? 'Posting…' : 'Post'}
              </button>
            </div>
          </form>
        ) : !currentUserId ? (
          <div className="room-auth-nudge">
            <Link href="/login" className="btn-primary">Sign in to post</Link>
          </div>
        ) : (
          <div className="room-readonly-nudge">
            <p>You need an invite to post here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
