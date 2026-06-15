'use client'

import { useState, useTransition } from 'react'
import type { TbComment, TbProfile } from '@/lib/types'
import { timeAgo, avatarLetter } from '@/lib/utils'
import { createComment } from '@/actions/comments'
import { useToast } from './Toast'

interface CommentThreadProps {
  comments: TbComment[]
  postId: string
  currentUserId?: string
  currentProfile?: TbProfile | null
}

function CommentItem({
  comment,
  postId,
  currentUserId,
  depth = 0,
}: {
  comment: TbComment
  postId: string
  currentUserId?: string
  depth?: number
}) {
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  function submitReply(e: React.FormEvent) {
    e.preventDefault()
    if (!replyText.trim()) return
    startTransition(async () => {
      const result = await createComment(postId, replyText, comment.id)
      if (result.ok) {
        setReplyText('')
        setShowReply(false)
        toast('Reply posted', 'success')
      } else {
        toast(result.error ?? 'Failed', 'error')
      }
    })
  }

  return (
    <div className={`comment ${comment.is_official ? 'comment-official' : ''} ${depth > 0 ? 'comment-reply' : ''}`}>
      <div className="comment-avatar">
        {comment.author?.avatar_url
          ? <img src={comment.author.avatar_url} alt={comment.author.username} />
          : <span>{avatarLetter(comment.author?.display_name ?? comment.author?.username)}</span>
        }
      </div>
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">
            {comment.author?.display_name ?? comment.author?.username}
          </span>
          {comment.is_official && <span className="official-badge">✓ Official</span>}
          <span className="comment-time">{timeAgo(comment.created_at)}</span>
        </div>
        <p className="comment-body">{comment.body}</p>
        <div className="comment-actions">
          {currentUserId && depth < 2 && (
            <button className="comment-reply-btn" onClick={() => setShowReply(!showReply)}>
              Reply
            </button>
          )}
        </div>
        {showReply && (
          <form onSubmit={submitReply} className="reply-form">
            <textarea
              className="form-textarea reply-textarea"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Write a reply…"
              rows={2}
              required
            />
            <div className="reply-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowReply(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={isPending}>
                {isPending ? 'Posting…' : 'Reply'}
              </button>
            </div>
          </form>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-replies">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} postId={postId} currentUserId={currentUserId} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CommentThread({ comments, postId, currentUserId }: CommentThreadProps) {
  const [newComment, setNewComment] = useState('')
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  function submitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim()) return
    startTransition(async () => {
      const result = await createComment(postId, newComment)
      if (result.ok) {
        setNewComment('')
        toast('Comment posted', 'success')
      } else {
        toast(result.error ?? 'Failed', 'error')
      }
    })
  }

  // Build nested structure
  const topLevel = comments.filter(c => !c.parent_id)
  const byParent: Record<string, TbComment[]> = {}
  comments.forEach(c => {
    if (c.parent_id) {
      byParent[c.parent_id] = byParent[c.parent_id] ?? []
      byParent[c.parent_id].push(c)
    }
  })
  const nested = topLevel.map(c => ({ ...c, replies: byParent[c.id] ?? [] }))

  return (
    <div className="comment-thread">
      {currentUserId && (
        <form onSubmit={submitComment} className="comment-compose">
          <textarea
            className="form-textarea"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add your take…"
            rows={3}
          />
          <div className="compose-actions">
            <button type="submit" className="btn-primary" disabled={isPending}>
              {isPending ? 'Posting…' : 'Comment'}
            </button>
          </div>
        </form>
      )}

      <div className="comments-list">
        {nested.length === 0 ? (
          <p className="empty-comments">No comments yet. Be the first.</p>
        ) : (
          nested.map(c => (
            <CommentItem key={c.id} comment={c} postId={postId} currentUserId={currentUserId} />
          ))
        )}
      </div>
    </div>
  )
}
