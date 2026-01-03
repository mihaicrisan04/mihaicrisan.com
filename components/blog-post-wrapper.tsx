"use client";

import type { ReactNode } from "react";
import { ScrollProgress } from "@/components/motion-primitives/scroll-progress";

interface BlogPostWrapperProps {
  children: ReactNode;
}

export function BlogPostWrapper({ children }: BlogPostWrapperProps) {
  return (
    <div className="relative">
      {/* Scroll Progress Bar */}
      <div className="pointer-events-none fixed top-0 left-0 z-50 w-full">
        <div className="absolute top-0 left-0 h-0.5 w-full bg-border" />
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
      <div className="relative">{children}</div>
    </div>
  );
}
