import Image from 'next/image'

export default function BluebirdSVG({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <Image
      src="/icon-192.png"
      alt="The Board"
      width={size}
      height={size}
      className={className}
      style={{ borderRadius: '50%' }}
    />
  )
}
