'use client'

import { useState } from 'react'
import type { TbPost, TbDrop } from '@/lib/types'
import PostCard from '@/components/PostCard'
import ComposeModal from '@/components/ComposeModal'

interface HomeFeedProps {
  posts: TbPost[]
  drops: TbDrop[]
  currentUserId?: string
}

type FeedTab = 'for-you' | 'following' | 'receipts'

export default function HomeFeed({ posts, drops, currentUserId }: HomeFeedProps) {
  const [tab, setTab] = useState<FeedTab>('for-you')
  const [showCompose, setShowCompose] = useState(false)

  const filteredPosts = tab === 'receipts'
    ? posts.filter(p => p.post_type === 'receipt')
    : posts

  return (
    <div className="feed-page">
      <div className="feed-header">
        <div className="feed-tabs">
          {(['for-you', 'following', 'receipts'] as FeedTab[]).map(t => (
            <button
              key={t}
              className={`feed-tab ${tab === t ? 'feed-tab-active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'for-you' ? 'For You' : t === 'following' ? 'Following' : 'Receipts'}
            </button>
          ))}
        </div>
      </div>

      {currentUserId && (
        <div className="compose-trigger" onClick={() => setShowCompose(true)}>
          <div className="compose-avatar" />
          <span className="compose-placeholder">What&apos;s the signal?</span>
          <button className="btn-primary compose-btn">Drop</button>
        </div>
      )}

      <div className="feed-list">
        {filteredPosts.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title">No posts yet</p>
            <p className="empty-sub">Be the first to drop a Receipt</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <PostCard key={post.id} post={post} currentUserId={currentUserId} />
          ))
        )}
      </div>

      {showCompose && (
        <ComposeModal
          drops={drops}
          onClose={() => setShowCompose(false)}
        />
      )}
    </div>
  )
}
