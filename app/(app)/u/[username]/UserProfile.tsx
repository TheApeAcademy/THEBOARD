'use client'

import { useState, useTransition } from 'react'
import type { TbPost, TbProfile } from '@/lib/types'
import PostCard from '@/components/PostCard'
import { updateProfile } from '@/actions/profiles'
import { useToast } from '@/components/Toast'
import { avatarLetter, formatCount } from '@/lib/utils'

interface UserProfileProps {
  profile: TbProfile
  posts: TbPost[]
  currentUserId?: string
  isOwnProfile: boolean
}

export default function UserProfile({ profile, posts, currentUserId, isOwnProfile }: UserProfileProps) {
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState(profile.display_name ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = await updateProfile({ display_name: displayName, bio })
      if (result.ok) {
        toast('Profile updated', 'success')
        setEditing(false)
      } else {
        toast(result.error ?? 'Failed', 'error')
      }
    })
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-lg">
          {profile.avatar_url
            ? <img src={profile.avatar_url} alt={profile.display_name ?? profile.username} />
            : <span>{avatarLetter(profile.display_name ?? profile.username)}</span>
          }
        </div>
        <div className="profile-info">
          <div className="profile-name-row">
            <h1 className="profile-display-name">{profile.display_name ?? profile.username}</h1>
            <span className="profile-role-badge">{profile.role}</span>
          </div>
          <span className="profile-username">@{profile.username}</span>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          <div className="profile-stats">
            <span><strong>{formatCount(profile.hype_score)}</strong> hype score</span>
            <span><strong>{formatCount(posts.length)}</strong> posts</span>
          </div>
          {isOwnProfile && !editing && (
            <button className="btn-secondary" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="profile-edit-form">
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input
              className="form-input"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              maxLength={50}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea
              className="form-textarea"
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={200}
              rows={3}
            />
          </div>
          <div className="compose-actions">
            <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isPending}>
              {isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      )}

      <div className="feed-list">
        {posts.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title">No posts yet</p>
            {isOwnProfile && <p className="empty-sub">Drop your first Receipt</p>}
          </div>
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} currentUserId={currentUserId} />
          ))
        )}
      </div>
    </div>
  )
}
