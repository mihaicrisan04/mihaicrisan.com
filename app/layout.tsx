import './global.css'
import type { Metadata } from 'next'
import { ViewTransitions } from 'next-view-transitions'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { baseUrl } from './sitemap'
import SpriteCursor from './components/SpriteCursor'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Mihai Crisan - Portfolio',
    template: '%s | Mihai Crisan - Portfolio',
  },
  description: 'Personal portfolio of Mihai Crisan.',
  openGraph: {
    title: 'Mihai Crisan - Portfolio',
    description: 'Personal portfolio of Mihai Crisan.',
    url: baseUrl,
    siteName: 'Mihai Crisan - Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased max-w-2xl mx-auto px-4 mt-8">
        {/* <SpriteCursor /> */}
      <main className="min-w-0 mt-6 flex flex-col px-2 md:px-0">
        <Navbar />
        {children}
        <Footer />
        <Analytics />
        <SpeedInsights />
      </main>
    </body>
  </html>
  )
}
