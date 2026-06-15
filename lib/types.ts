export type UserRole = 'user' | 'company'
export type PostType = 'drip' | 'receipt'
export type SignalType = 'wishlist' | 'glitch' | 'no_cap' | 'big_brain'
export type PostStatus = 'open' | 'seen' | 'planned' | 'building' | 'built' | 'rip'
export type VoteType = 'hype' | 'cap'

export interface TbProfile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  role: UserRole
  hype_score: number
  follower_count: number
  created_at: string
}

export interface TbDrop {
  id: string
  profile_id: string
  name: string
  slug: string
  banner_url: string | null
  accent_color: string
  widgets: unknown[]
  verified: boolean
  tap_in_count: number
  health_score: number
  description: string | null
  created_at: string
}

export interface TbPost {
  id: string
  drop_id: string
  author_id: string
  post_type: PostType
  signal_type: SignalType | null
  title: string | null
  body: string
  status: PostStatus
  hype_count: number
  cap_count: number
  flame_score: number
  is_flame: boolean
  created_at: string
  updated_at: string
  // Joined
  author?: TbProfile
  drop?: TbDrop
  user_vote?: VoteType | null
}

export interface TbVote {
  id: string
  post_id: string
  user_id: string
  vote_type: VoteType
  created_at: string
}

export interface TbComment {
  id: string
  post_id: string
  author_id: string
  parent_id: string | null
  body: string
  is_official: boolean
  hype_count: number
  created_at: string
  author?: TbProfile
  replies?: TbComment[]
}

export interface TbTapIn {
  id: string
  user_id: string
  drop_id: string
  created_at: string
}

// Insert types (exclude joined/computed fields)
interface TbProfileInsert { id?: string; username?: string; display_name?: string | null; avatar_url?: string | null; bio?: string | null; role?: UserRole; hype_score?: number; follower_count?: number; created_at?: string }
interface TbDropInsert { id?: string; profile_id?: string; name?: string; slug?: string; banner_url?: string | null; accent_color?: string; widgets?: unknown[]; verified?: boolean; tap_in_count?: number; health_score?: number; description?: string | null; created_at?: string }
interface TbPostInsert { id?: string; drop_id?: string; author_id?: string; post_type?: PostType; signal_type?: SignalType | null; title?: string | null; body?: string; status?: PostStatus; hype_count?: number; cap_count?: number; flame_score?: number; is_flame?: boolean; created_at?: string; updated_at?: string }
interface TbVoteInsert { id?: string; post_id?: string; user_id?: string; vote_type?: VoteType; created_at?: string }
interface TbCommentInsert { id?: string; post_id?: string; author_id?: string; parent_id?: string | null; body?: string; is_official?: boolean; hype_count?: number; created_at?: string }
interface TbTapInInsert { id?: string; user_id?: string; drop_id?: string; created_at?: string }

// For use with createBrowserClient / createServerClient generic
export interface Database {
  public: {
    Tables: {
      tb_profiles: { Row: TbProfile; Insert: TbProfileInsert; Update: TbProfileInsert; Relationships: [] }
      tb_drops: { Row: TbDrop; Insert: TbDropInsert; Update: TbDropInsert; Relationships: [] }
      tb_posts: { Row: TbPost; Insert: TbPostInsert; Update: TbPostInsert; Relationships: [] }
      tb_votes: { Row: TbVote; Insert: TbVoteInsert; Update: TbVoteInsert; Relationships: [] }
      tb_comments: { Row: TbComment; Insert: TbCommentInsert; Update: TbCommentInsert; Relationships: [] }
      tb_tap_ins: { Row: TbTapIn; Insert: TbTapInInsert; Update: TbTapInInsert; Relationships: [] }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
