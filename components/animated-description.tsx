"use client"

import { motion } from "motion/react"

interface AnimatedDescriptionProps {
  children: React.ReactNode
  delay?: number
}

export function AnimatedDescription({ children, delay = 0 }: AnimatedDescriptionProps) {
  return (
    <motion.div 
      className="mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <p className="text-muted-foreground">
        {children}
      </p>
    </motion.div>
  )
} 
