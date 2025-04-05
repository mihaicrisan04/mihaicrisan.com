"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

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
  
  const handleNavigation = (href) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        router.push(href)
      })
    } else {
      router.push(href)
    }
  }
  
  return (
    <header className="mb-5">
      <h1 className="text-3xl font-bold mb-6">
        <Link href="/" className="text-[var(--text-primary)] hover:text-[var(--text-primary)] hover:underline">
          Mihai Crisan
        </Link>
      </h1>
      <nav>
        <div className="flex space-x-4">
          {Object.entries(navItems).map(([path, { name }], index) => {
            return (
              <Link
                key={path}
                href={path}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavigation(path)
                }}
                className={`text-white transition-all hover:text-white hover:underline hover:decoration-white py-1 ${index === 0 ? 'pl-0' : ''} px-2`}
              >
                {name}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
