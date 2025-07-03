"use client"

import { Github, Linkedin, Mail } from "lucide-react"

const socialLinks = [
  { name: "GitHub", icon: Github, href: "https://github.com" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
  { name: "Email", icon: Mail, href: "mailto:crisanmihai2004@gmail.com" }
]

export function Footer() {
  return (
    <footer className="mt-24 py-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex flex-col items-center gap-6">
          {/* Logo/Name */}
          <div className="text-lg font-medium">
            Mihai Crisan
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
              >
                <link.icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © 2025 Mihai Crisan
          </div>
        </div>
      </div>
    </footer>
  )
} 