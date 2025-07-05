"use client"

import { CustomLink } from "@/components/custom-link"

const socialLinks = [
  { name: "GitHub", href: "https://github.com/mihaicrisan" },
  { name: "LinkedIn", href: "https://linkedin.com/in/mihaicrisan" },
  { name: "Twitter", href: "https://twitter.com/mihaicrisan" },
  { name: "Threads", href: "https://threads.net/@mihaicrisan" },
  { name: "Email", href: "mailto:crisanmihai2004@gmail.com" }
]

export function Footer() {
  return (
    <footer className="mt-24 py-0  bg-background">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex flex-col items-center gap-8">
          {/* Social Links */}
          <div className="flex items-center gap-8 flex-wrap justify-center">
            {socialLinks.map((link) => (
              <CustomLink
                key={link.name}
                href={link.href}
                external
                className="text-muted-foreground hover:text-foreground text-base"
              >
                {link.name}
              </CustomLink>
            ))}
          </div>

          {/* Logo Placeholder */}
          <div className="text-2xl font-light italic text-muted-foreground">
            placeholder
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground mb-4">
            © 2025 All rights reserved
          </div>
        </div>
      </div>
    </footer>
  )
} 