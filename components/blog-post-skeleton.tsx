"use client"

import { motion } from "motion/react"
import { Skeleton } from "@/components/ui/skeleton"

export function BlogPostSkeleton() {
  return (
    <motion.div 
      className="py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="max-w-2xl mx-auto px-6">
        {/* Back Button Skeleton */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Skeleton className="h-9 w-20 rounded-md" />
        </motion.div>
        
        {/* Blog Post Header Skeleton */}
        <motion.header 
          className="mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-5/6" />
        </motion.header>

        {/* Blog Post Content Skeleton */}
        <motion.article 
          className="prose dark:prose-invert max-w-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-4/5" />
            
            <div className="my-6">
              <Skeleton className="h-5 w-1/3 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />

            <div className="my-6">
              <Skeleton className="h-32 w-full rounded-md" />
            </div>

            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-4/5" />
          </div>
        </motion.article>

        {/* Bottom Spacing */}
        <div className="mt-24"></div>
      </div>
    </motion.div>
  )
}
