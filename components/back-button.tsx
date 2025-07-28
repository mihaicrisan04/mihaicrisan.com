"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { TextLoop } from "./motion-primitives/text-loop"

export function BackButton() {
  const pathname = usePathname()
  const [isHovered, setIsHovered] = useState(false)
  const [direction, setDirection] = useState(-1)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [shouldTrigger, setShouldTrigger] = useState(false)
  
  // Determine back link and labels based on current route
  const isBlogRoute = pathname?.startsWith("/blog/")
  const backHref = isBlogRoute ? "/blog" : "/projects"
  const backLabels = isBlogRoute 
    ? ["Back", "All Posts"]
    : ["Back", "All Projects"]
  
  useEffect(() => {
    const targetIndex = isHovered ? 1 : 0
    if (currentIndex !== targetIndex) {
      setShouldTrigger(true)
      const timer = setTimeout(() => setShouldTrigger(false), 100)
      return () => clearTimeout(timer)
    }
  }, [isHovered, currentIndex])
  
  const handleIndexChange = (index: number) => {
    setCurrentIndex(index)
    setDirection(index === 0 ? -1 : 1)
    // Stop triggering once we reach the desired index
    const targetIndex = isHovered ? 1 : 0
    if (index === targetIndex) {
      setShouldTrigger(false)
    }
  }
  
  return (
    <Link href={backHref}>
      <motion.div
        className="inline-flex items-center gap-2 text-sm cursor-pointer mb-8"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.div
          animate={{ 
            x: isHovered ? -4 : 0
          }}
          transition={{ duration: 0.1 }}
          className={isHovered ? "text-foreground" : "text-muted-foreground"}
        >
          <ArrowLeft className="w-4 h-4" />
        </motion.div>
        
        <TextLoop
          trigger={shouldTrigger}
          interval={0.05}
          transition={{
            type: 'spring',
            stiffness: 150,
            damping: 19,
            mass: 1.2,
          }}
          onIndexChange={handleIndexChange}
          variants={{
            initial: {
              y: -direction * 20,
              rotateX: -direction * 90,
              opacity: 0,
              filter: 'blur(4px)',
            },
            animate: {
              y: 0,
              rotateX: 0,
              opacity: 1,
              filter: 'blur(0px)',
            },
            exit: {
              y: -direction * 20,
              rotateX: -direction * 90,
              opacity: 0,
              filter: 'blur(4px)',
            },
          }}
        >
          <span className="text-muted-foreground">{backLabels[0]}</span>
          <span className="text-foreground">{backLabels[1]}</span>
        </TextLoop>
      </motion.div>
    </Link>
  )
} 
