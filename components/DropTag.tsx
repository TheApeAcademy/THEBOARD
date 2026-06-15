import Link from 'next/link'
import type { TbDrop } from '@/lib/types'

export default function DropTag({ drop }: { drop: Pick<TbDrop, 'name' | 'slug' | 'accent_color'> }) {
  return (
    <Link href={`/d/${drop.slug}`} className="drop-tag" style={{ borderColor: drop.accent_color, color: drop.accent_color }}>
      {drop.name}
    </Link>
  )
}
