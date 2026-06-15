import type { SignalType } from '@/lib/types'
import { signalLabel } from '@/lib/utils'

export default function SignalBadge({ type }: { type: SignalType }) {
  return (
    <span className={`signal-badge signal-${type}`}>
      {signalLabel(type)}
    </span>
  )
}
