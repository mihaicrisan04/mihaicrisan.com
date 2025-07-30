"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { motion, useInView } from "motion/react"
import Image from "next/image"
import { Heart } from "lucide-react"
import { CustomLink } from "@/components/custom-link"
import { TextLoop } from "./motion-primitives/text-loop"

const socialLinks = [
  { name: "GitHub", href: "https://github.com/mihaicrisan04" },
  { name: "LinkedIn", href: "https://linkedin.com/in/mihaicrisan04" },
  { name: "X", href: "https://x.com/mitzaqe" },
  { name: "Instagram", href: "https://instagram.com/mihaicrisann" },
  { name: "Email", href: "mailto:crisanmihai2004@gmail.com" }
]

export function Footer() {
  const { theme } = useTheme()
  const [scrollBend, setScrollBend] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [entryScrollPosition, setEntryScrollPosition] = useState<number | null>(null)
  const footerRef = useRef<HTMLElement>(null)
  
  // Use Motion's useInView hook for efficient viewport tracking
  const isInView = useInView(footerRef, { 
    amount: 0.6, // 60% threshold
    once: false // Keep tracking when leaving view
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Track when footer first enters view
  useEffect(() => {
    if (isInView && entryScrollPosition === null) {
      setEntryScrollPosition(window.scrollY)
    } else if (!isInView) {
      setEntryScrollPosition(null)
    }
  }, [isInView, entryScrollPosition])

  useEffect(() => {
    const handleScroll = () => {
      if (!isInView || entryScrollPosition === null) {
        setScrollBend(0)
        return
      }

      const currentScroll = window.scrollY
      const scrollSinceEntry = currentScroll - entryScrollPosition
      const maxScrollDistance = 200 // control how much scroll creates full bend
      
      // Calculate bend based on scroll distance since footer entered view
      const scrollFactor = Math.min(scrollSinceEntry / maxScrollDistance, 1)
      const bendIntensity = scrollFactor * 55 // Max 55px bend
      
      setScrollBend(-bendIntensity) // Negative for downward curve
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isInView, entryScrollPosition])

  // Calculate hill-shaped offset for each link
  const getHillOffset = (index: number, totalLinks: number) => {
    // Normalize position to -1 to 1 range (center is 0)
    const normalizedPos = (index - (totalLinks - 1) / 2) / ((totalLinks - 1) / 2) * 0.9
    
    // Create hill shape using inverted parabola: 1 - x²
    const hillFactor = 1 - Math.pow(normalizedPos, 2)
    
    return scrollBend * hillFactor * 1.2
  }

  // Theme-specific colors
  const themeStyles = {
    light: {
      background: '#f8fafc',
      gridColor: '#e2e8f0'
    },
    dark: {
      background: 'var(--background)',
      gridColor: 'var(--border)'
    }
  }

  // Use dark as fallback until mounted to prevent hydration mismatch
  const currentTheme = mounted ? (theme === 'dark' ? 'dark' : 'light') : 'dark'
  const styles = themeStyles[currentTheme]

  return (
    <motion.footer 
      ref={footerRef}
      className="relative py-32 overflow-hidden min-h-[60vh]"
      style={{ backgroundColor: styles.background }}
    >
      {/* Grid Background with Mask */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${styles.gridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${styles.gridColor} 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
        }}
      />
      
      {/* Footer Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6">
        <div className="flex flex-col items-center gap-8">
          {/* Social Links with Hill Bending Effect */}
          <div className="flex items-baseline gap-6 md:gap-13 flex-wrap justify-center">
            {socialLinks.map((link, index) => (
              <div
                key={link.name}
                className="transition-transform duration-100 ease-out"
                style={{
                  transform: `translateY(${getHillOffset(index, socialLinks.length)}px)`,
                }}
              >
                <CustomLink
                  href={link.href}
                  external
                  className="text-muted-foreground hover:text-foreground text-base"
                >
                  {link.name}
                </CustomLink>
              </div>
            ))}
          </div>

          {/* Signature Logo */}
          <div className="relative w-[240px] h-[80px] overflow-hidden">
            <Image
              src={currentTheme === 'dark' ? '/signature-white.png' : '/signature-gray.png'}
              alt="Mihai Crisan Signature"
              fill
              className="object-cover"
            />
          </div>

          {/* Copyright / Location */}
          <div className="text-sm text-muted-foreground">
            <TextLoop interval={3}>
              <span>© 2025 Mihai Crisan</span>
              <span>Built with <Heart className="inline-block w-4 h-4 hover:text-red-500 transition-colors duration-300" /> from Cluj-Napoca</span>
            </TextLoop>
          </div>
        </div>
      </div>
    </motion.footer>
  )
} 
