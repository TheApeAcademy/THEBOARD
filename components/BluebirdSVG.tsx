export default function BluebirdSVG({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="32" cy="32" r="32" fill="#1D9BF0" />
      <path
        d="M48 20c-1.5 2-3.5 3.5-5.5 4.5 2-3 2.5-6.5 2-9.5-2 1-4 2.5-5.5 4.5-1-2-3-3.5-5-3.5-5.5 0-9 5-8.5 11 0 .5 0 1 .1 1.5C18.5 28 12 23 8.5 16.5c-1 2-1.5 4.5-1.5 7 0 5 2.5 9.5 6.5 12-2 0-4-.5-5.5-1.5 0 6 4 11 9.5 12-2 .5-3.5.5-5.5.5C14 50 19 53 25 53c11 0 20-9 20-20 0-.5 0-1-.1-1.5C47 29.5 48.5 27 49.5 24c-.5 0-1 0-1.5-.5V20z"
        fill="white"
      />
    </svg>
  )
}
