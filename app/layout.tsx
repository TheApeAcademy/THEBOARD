import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono, Bebas_Neue } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jetbrains-mono',
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas-neue',
})

export const metadata: Metadata = {
  title: 'The Board — Carry the Signal',
  description: 'Where user signals become product decisions. In real time, in public, no cap.',
  openGraph: {
    title: 'The Board',
    description: 'Where user signals become product decisions.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${bebasNeue.variable}`}>
      <body>{children}</body>
    </html>
  )
}
