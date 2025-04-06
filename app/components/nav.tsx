"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { TransitionLink } from './TransitionLink'


interface Document {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransition
}

interface ViewTransition {
  finished: Promise<void>
  ready: Promise<void>
  updateCallbackDone: Promise<void>
  skipTransition: () => void
}

const navItems = {
  '/': {
    name: 'about',
  },
  '/projects': {
    name: 'projects',
  },
}

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  
  // Prefetch the projects page when on the main page
  useEffect(() => {
    if (pathname === '/') {
      // Pre-fetch the projects page data
      router.prefetch('/projects')
    }
  }, [pathname, router])
  
  return (
    <header className="mb-5">
      <h1 className="text-3xl font-bold mb-6 mt-4">
        <Link href="/" className="text-[var(--text-primary)] hover:text-[var(--text-primary)] hover:underline">
          Mihai Crisan
        </Link>
      </h1>
      <nav>
        <div className="flex space-x-4">
          {Object.entries(navItems).map(([path, { name }], index) => {
            return (
              <TransitionLink
                key={path}
                href={path}
              >
                {name}
              </TransitionLink>
            )
          })}
        </div>
      </nav>
    </header>
  )
}