'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import type { TbPost } from '@/lib/types'
import { timeAgo, formatCount, avatarLetter } from '@/lib/utils'
import StatusPill from './StatusPill'
import SignalBadge from './SignalBadge'
import FlameBadge from './FlameBadge'
import DropTag from './DropTag'
import { castVote } from '@/actions/votes'
import { useToast } from './Toast'

interface PostCardProps {
  post: TbPost
  currentUserId?: string
  showDrop?: boolean
}

export default function PostCard({ post, currentUserId, showDrop = true }: PostCardProps) {
  const [hype, setHype] = useState(post.hype_count)
  const [cap, setCap] = useState(post.cap_count)
  const [myVote, setMyVote] = useState(post.user_vote ?? null)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  function handleVote(type: 'hype' | 'cap') {
    if (!currentUserId) {
      toast('Log in to vote', 'error')
      return
    }

    const prevVote = myVote
    const prevHype = hype
    const prevCap = cap

    // Optimistic update
    if (myVote === type) {
      setMyVote(null)
      if (type === 'hype') setHype(h => h - 1)
      else setCap(c => c - 1)
    } else {
      if (prevVote === 'hype') setHype(h => h - 1)
      if (prevVote === 'cap') setCap(c => c - 1)
      if (type === 'hype') setHype(h => h + 1)
      else setCap(c => c + 1)
      setMyVote(type)
    }

    startTransition(async () => {
      const result = await castVote(post.id, type)
      if (!result.ok) {
        setMyVote(prevVote)
        setHype(prevHype)
        setCap(prevCap)
        toast(result.error ?? 'Vote failed', 'error')
      }
    })
  }

  return (
    <article className={`post-card ${post.is_flame ? 'post-card-flame' : ''}`}>
      <div className="post-card-left">
        <Link href={post.author ? `/u/${post.author.username}` : '#'} className="avatar">
          {post.author?.avatar_url
            ? <img src={post.author.avatar_url} alt={post.author.display_name ?? post.author.username} />
            : <span>{avatarLetter(post.author?.display_name ?? post.author?.username)}</span>
          }
        </Link>
      </div>

      <div className="post-card-right">
        <div className="post-header">
          <div className="post-meta">
            <Link href={post.author ? `/u/${post.author.username}` : '#'} className="post-author">
              {post.author?.display_name ?? post.author?.username ?? 'Unknown'}
            </Link>
            <span className="post-username">@{post.author?.username}</span>
            <span className="post-time">{timeAgo(post.created_at)}</span>
          </div>
          <div className="post-badges">
            {post.signal_type && <SignalBadge type={post.signal_type} />}
            <StatusPill status={post.status} />
            {post.is_flame && <FlameBadge score={post.flame_score} />}
          </div>
        </div>

        {showDrop && post.drop && (
          <div className="post-drop">
            <DropTag drop={post.drop} />
          </div>
        )}

        {post.title && (
          <h3 className="post-title">
            <Link href={`/p/${post.id}`}>{post.title}</Link>
          </h3>
        )}

        <Link href={`/p/${post.id}`} className="post-body-link">
          <p className="post-body">{post.body}</p>
        </Link>

        <div className="post-actions">
          <button
            className={`vote-btn vote-hype ${myVote === 'hype' ? 'voted' : ''}`}
            onClick={() => handleVote('hype')}
            disabled={isPending}
            title="Hype"
          >
            <span className="vote-icon">⬆</span>
            <span className="vote-count">{formatCount(hype)}</span>
          </button>
          <button
            className={`vote-btn vote-cap ${myVote === 'cap' ? 'voted' : ''}`}
            onClick={() => handleVote('cap')}
            disabled={isPending}
            title="Cap"
          >
            <span className="vote-icon">⬇</span>
            <span className="vote-count">{formatCount(cap)}</span>
          </button>
          <Link href={`/p/${post.id}`} className="comment-btn">
            <span>💬</span>
            <span>Reply</span>
          </Link>
          <Link href={`/p/${post.id}`} className="share-btn">
            <span>↗</span>
            <span>Share</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
