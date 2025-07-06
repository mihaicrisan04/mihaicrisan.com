"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { Separator } from "@radix-ui/react-separator"

export function Navigation() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  return (
    <div className="w-full bg-background">
      <div className="flex justify-center px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
            </nav>

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
    </div>
  )
} 