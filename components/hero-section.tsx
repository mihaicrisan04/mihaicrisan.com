"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SpringElement } from "@/components/ui/spring-element"
import { useTheme } from "next-themes"
import { motion } from "motion/react"
import { useEffect, useState } from "react"

interface HeroSectionProps {
  name: string
  title: string
  description: string
  contactText?: string
  contactHref?: string
  avatarSrcLight: string
  avatarSrcDark: string
  avatarFallback?: string
}

export function HeroSection({
  name,
  title,
  description,
  contactText = "Say hello",
  contactHref = "mailto:contact@example.com",
  avatarSrcLight,
  avatarSrcDark,
  avatarFallback
}: HeroSectionProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isLight = theme === "light"

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex items-start gap-6">
      <div className="flex-shrink-0">
        <SpringElement>
          <Avatar className="w-16 h-16 relative">
            {mounted ? (
              <>
                {/* Dark theme avatar */}
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    opacity: isLight ? 0 : 1,
                    filter: isLight ? "blur(8px)" : "blur(0px)"
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                >
                  <AvatarImage 
                    src={avatarSrcDark} 
                    alt={`${name} - Dark`} 
                    draggable={false}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Light theme avatar */}
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    opacity: isLight ? 1 : 0,
                    filter: isLight ? "blur(0px)" : "blur(8px)"
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                >
                  <AvatarImage 
                    src={avatarSrcLight} 
                    alt={`${name} - Light`} 
                    draggable={false}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </>
            ) : (
              <AvatarImage 
                src={avatarSrcDark} 
                alt={name} 
                draggable={false}
                className="w-full h-full object-cover"
              />
            )}

            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl">
              {avatarFallback || name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </SpringElement>
      </div>

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
