import type { PostStatus } from '@/lib/types'
import { statusLabel } from '@/lib/utils'

const STATUS_CLASSES: Record<PostStatus, string> = {
  open: 'status-open',
  seen: 'status-seen',
  planned: 'status-planned',
  building: 'status-building',
  built: 'status-built',
  rip: 'status-rip',
}

export default function StatusPill({ status }: { status: PostStatus }) {
  return (
    <span className={`status-pill ${STATUS_CLASSES[status]}`}>
      {statusLabel(status)}
    </span>
  )
}
