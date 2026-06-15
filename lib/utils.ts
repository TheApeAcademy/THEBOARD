import type { SignalType, PostStatus } from './types'

export function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function signalLabel(type: SignalType): string {
  return { wishlist: '🌈 Wishlist', glitch: '⚡ Glitch', no_cap: '🎙 No Cap', big_brain: '🧠 Big Brain' }[type]
}

export function statusLabel(status: PostStatus): string {
  return {
    open: 'Open', seen: 'Seen', planned: 'Planned',
    building: 'Building', built: 'Built', rip: 'RIP',
  }[status]
}

export function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

export function avatarLetter(name: string | null | undefined): string {
  return (name ?? 'U')[0].toUpperCase()
}

export function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
