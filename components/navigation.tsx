"use client"

import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { Separator } from "@radix-ui/react-separator"
import { useState, useEffect } from "react"
import CommandButton from "@/components/kokonutui/command-button"
import { MorphingPopover, MorphingPopoverTrigger, MorphingPopoverContent } from "@/components/motion-primitives/morphing-popover"
import { Input } from "@/components/ui/input"
import { createPortal } from "react-dom"

export function Navigation() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [commandOpen, setCommandOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
      if (e.key === "Escape" && commandOpen) {
        e.preventDefault()
        setCommandOpen(false)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [commandOpen])

  return (
    <div className="w-full bg-background">
      <div className="flex justify-center px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.0 }}
          className="bg-background/80 backdrop-blur-sm border border-border rounded-sm px-4 py-2"
        >
          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/" 
                  className={`text-sm font-medium transition-colors px-2 py-1 rounded ${
                    pathname === "/" 
                      ? "text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Home
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/projects" 
                  className={`text-sm font-medium transition-colors px-2 py-1 rounded ${
                    pathname === "/projects" || pathname?.startsWith("/projects/")
                      ? "text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Projects
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/blog" 
                  className={`text-sm font-medium transition-colors px-2 py-1 rounded ${
                    pathname === "/blog" || pathname?.startsWith("/blog/")
                      ? "text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Blog
                </Link>
              </motion.div>
            </nav>

            <div className="h-4 w-px bg-border mx-4" />

            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CommandButton 
                  onClick={() => setCommandOpen(true)}
                  className="h-8"
                />
              </motion.div>
            </div>

            <div className="h-4 w-px bg-border mx-4" />

            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="h-8 w-8 p-1"
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Portal-based Command Interface */}
      {mounted && createPortal(
        <AnimatePresence>
          {commandOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                onClick={() => setCommandOpen(false)}
              />
              
              {/* Command Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative w-full h-full sm:h-auto sm:w-[500px] sm:h-[400px] sm:rounded-lg sm:border sm:shadow-lg bg-background sm:bg-popover p-6 sm:p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-4 h-full flex flex-col">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Command Menu</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Type to search or start a conversation
                    </p>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <Input
                      placeholder="Type a command or message..."
                      className="w-full"
                      autoFocus
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                      Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">Esc</kbd> to close
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
} 
