import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono, Bebas_Neue } from 'next/font/google'
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar'
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
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'The Board',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
  },
  openGraph: {
    title: 'The Board',
    description: 'Where user signals become product decisions.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

const VIDEO_SRC = '/Black_grid_background_video___Motion_background_with_black_grid_video___Film_texture,_Motion_graphics_trends,_Motion_backgrounds.mp4'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${bebasNeue.variable}`}>
      <body>
        <video
          className="site-bg-video"
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  )
}
