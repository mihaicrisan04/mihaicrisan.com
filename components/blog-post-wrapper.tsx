"use client"

import { ReactNode } from "react"
import { ScrollProgress } from "@/components/motion-primitives/scroll-progress"

interface BlogPostWrapperProps {
  children: ReactNode
}

export function BlogPostWrapper({ children }: BlogPostWrapperProps) {
  return (
    <div className="relative">
      {/* Scroll Progress Bar */}
      <div className="pointer-events-none fixed left-0 top-0 w-full z-50">
        <div className="absolute left-0 top-0 h-0.5 w-full bg-border" />
        <ScrollProgress
          className="fixed top-0 h-0.5 bg-[linear-gradient(to_right,rgba(0,0,0,0),#000000_75%,#000000_100%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0),#ffffff_75%,#ffffff_100%)]"
          springOptions={{
            stiffness: 280,
            damping: 18,
            mass: 0.3,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  )
} 
