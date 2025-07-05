import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "motion/react"

interface HeroSectionProps {
  name: string
  title: string
  description: string
  contactText?: string
  contactHref?: string
  avatarSrc?: string
  avatarFallback?: string
}

export function HeroSection({
  name,
  title,
  description,
  contactText = "Say hello",
  contactHref = "mailto:contact@example.com",
  avatarSrc,
  avatarFallback
}: HeroSectionProps) {
  return (
    <div className="flex items-start gap-6">
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
        className="flex-shrink-0"
      >
        <Avatar className="w-16 h-16 cursor-pointer">
          <AvatarImage src={avatarSrc} alt={name} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl">
            {avatarFallback || name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      </motion.div>
      
      <div className="flex-1">
        <div className="mb-4">
          <h1 className="text-lg font-medium mb-1">
            Hey, I'm {name}.{" "}
            <span className="text-muted-foreground">{title}</span>
          </h1>
        </div>
        
        {/* <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p> */}
      </div>
    </div>
  )
} 