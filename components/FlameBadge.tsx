export default function FlameBadge({ score }: { score?: number }) {
  return (
    <span className="flame-badge">
      🔥 {score !== undefined ? `${Math.round(score)}` : 'Going Flame'}
    </span>
  )
}
