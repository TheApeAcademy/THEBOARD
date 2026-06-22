export type UserRole = 'user' | 'company'
export type PostType = 'drip' | 'receipt'
export type SignalType = 'wishlist' | 'glitch' | 'no_cap' | 'big_brain'
export type PostStatus = 'open' | 'seen' | 'planned' | 'building' | 'built' | 'rip'
export type VoteType = 'hype' | 'cap'
export type NotificationType = 'status_update' | 'hype_milestone' | 'comment_reply' | 'official_response' | 'new_receipt'
export type RoomRole = 'owner' | 'team' | 'moderator' | 'member'

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
  profile_id: string | null
  name: string
  slug: string
  banner_url: string | null
  accent_color: string
  widgets: unknown[]
  verified: boolean
  tap_in_count: number
  health_score: number
  description: string | null
  is_claimed: boolean
  claimed_at: string | null
  suggested_by: string | null
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
  room_id: string | null
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

export interface TbNotification {
  id: string
  user_id: string
  type: NotificationType
  post_id: string | null
  drop_id: string | null
  from_profile_id: string | null
  message: string
  read: boolean
  created_at: string
  // Joined
  from_profile?: TbProfile | null
  post?: Pick<TbPost, 'id' | 'title' | 'body'> | null
  drop?: Pick<TbDrop, 'id' | 'name' | 'slug'> | null
}

export interface TbPostStatusHistory {
  id: string
  post_id: string
  old_status: string | null
  new_status: string
  changed_by: string | null
  note: string | null
  created_at: string
  changer?: TbProfile | null
}

export interface TbFollower {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

export interface TbRoom {
  id: string
  drop_id: string
  name: string
  description: string | null
  is_private: boolean
  created_by: string
  created_at: string
  // Joined
  drop?: Pick<TbDrop, 'id' | 'name' | 'slug' | 'accent_color'>
  member_count?: number
  is_member?: boolean
}

export interface TbRoomMember {
  id: string
  room_id: string
  user_id: string
  role: RoomRole
  joined_at: string
  profile?: TbProfile
}

export interface TbCompanyTag {
  id: string
  drop_id: string
  tagger_id: string
  tagged_on: string | null
  external_url: string | null
  created_at: string
}

// Insert types
interface TbProfileInsert { id?: string; username?: string; display_name?: string | null; avatar_url?: string | null; bio?: string | null; role?: UserRole; hype_score?: number; follower_count?: number; created_at?: string }
interface TbDropInsert { id?: string; profile_id?: string | null; name?: string; slug?: string; banner_url?: string | null; accent_color?: string; widgets?: unknown[]; verified?: boolean; tap_in_count?: number; health_score?: number; description?: string | null; is_claimed?: boolean; claimed_at?: string | null; suggested_by?: string | null; created_at?: string }
interface TbPostInsert { id?: string; drop_id?: string; author_id?: string; post_type?: PostType; signal_type?: SignalType | null; title?: string | null; body?: string; status?: PostStatus; hype_count?: number; cap_count?: number; flame_score?: number; is_flame?: boolean; room_id?: string | null; created_at?: string; updated_at?: string }
interface TbVoteInsert { id?: string; post_id?: string; user_id?: string; vote_type?: VoteType; created_at?: string }
interface TbCommentInsert { id?: string; post_id?: string; author_id?: string; parent_id?: string | null; body?: string; is_official?: boolean; hype_count?: number; created_at?: string }
interface TbTapInInsert { id?: string; user_id?: string; drop_id?: string; created_at?: string }
interface TbNotificationInsert { id?: string; user_id?: string; type?: NotificationType; post_id?: string | null; drop_id?: string | null; from_profile_id?: string | null; message?: string; read?: boolean; created_at?: string }
interface TbPostStatusHistoryInsert { id?: string; post_id?: string; old_status?: string | null; new_status?: string; changed_by?: string | null; note?: string | null; created_at?: string }
interface TbFollowerInsert { id?: string; follower_id?: string; following_id?: string; created_at?: string }
interface TbRoomInsert { id?: string; drop_id?: string; name?: string; description?: string | null; is_private?: boolean; created_by?: string; created_at?: string }
interface TbRoomMemberInsert { id?: string; room_id?: string; user_id?: string; role?: RoomRole; joined_at?: string }
interface TbCompanyTagInsert { id?: string; drop_id?: string; tagger_id?: string; tagged_on?: string | null; external_url?: string | null; created_at?: string }

export interface Database {
  public: {
    Tables: {
      tb_profiles: { Row: TbProfile; Insert: TbProfileInsert; Update: TbProfileInsert; Relationships: [] }
      tb_drops: { Row: TbDrop; Insert: TbDropInsert; Update: TbDropInsert; Relationships: [] }
      tb_posts: { Row: TbPost; Insert: TbPostInsert; Update: TbPostInsert; Relationships: [] }
      tb_votes: { Row: TbVote; Insert: TbVoteInsert; Update: TbVoteInsert; Relationships: [] }
      tb_comments: { Row: TbComment; Insert: TbCommentInsert; Update: TbCommentInsert; Relationships: [] }
      tb_tap_ins: { Row: TbTapIn; Insert: TbTapInInsert; Update: TbTapInInsert; Relationships: [] }
      tb_notifications: { Row: TbNotification; Insert: TbNotificationInsert; Update: TbNotificationInsert; Relationships: [] }
      tb_post_status_history: { Row: TbPostStatusHistory; Insert: TbPostStatusHistoryInsert; Update: TbPostStatusHistoryInsert; Relationships: [] }
      tb_followers: { Row: TbFollower; Insert: TbFollowerInsert; Update: TbFollowerInsert; Relationships: [] }
      tb_rooms: { Row: TbRoom; Insert: TbRoomInsert; Update: TbRoomInsert; Relationships: [] }
      tb_room_members: { Row: TbRoomMember; Insert: TbRoomMemberInsert; Update: TbRoomMemberInsert; Relationships: [] }
      tb_company_tags: { Row: TbCompanyTag; Insert: TbCompanyTagInsert; Update: TbCompanyTagInsert; Relationships: [] }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
