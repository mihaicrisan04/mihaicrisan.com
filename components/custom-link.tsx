import Link from "next/link"
import { ReactNode, useState } from "react"
import { ArrowUpRight, ExternalLink } from "lucide-react"
import { motion } from "motion/react"

interface CustomLinkProps {
  href: string
  children: ReactNode
  underlineOnHover?: boolean
  external?: boolean
  className?: string
}

export function CustomLink({ 
  href, 
  children, 
  underlineOnHover = false, 
  external = false,
  className = ""
}: CustomLinkProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const baseClasses = "text-sm inline-flex items-center gap-1"
  const hoverClasses = underlineOnHover ? "hover:underline" : ""
  
  const combinedClasses = `${baseClasses} ${hoverClasses} ${className}`

  if (external) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClasses}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{ x: isHovered ? 4 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.span
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
        <motion.span
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            scale: isHovered ? 1 : 0.8 
          }}
          transition={{ duration: 0.2 }}
          className="inline-flex"
        >
          <ArrowUpRight className="w-4 h-4" />
        </motion.span>
      </motion.a>
    )
  }

  return (
    <motion.div
      className={combinedClasses}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={{ x: isHovered ? 4 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={href} className="inline-flex items-center gap-1">
        <motion.span
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
        <motion.span
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            scale: isHovered ? 1 : 0.8 
          }}
          transition={{ duration: 0.2 }}
          className="inline-flex"
        >
          <ArrowUpRight className="w-4 h-4" />
        </motion.span>
      </Link>
    </motion.div>
  )
} 