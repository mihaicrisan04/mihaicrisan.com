"use client"

import { motion } from "motion/react"
import { HeroSection } from "@/components/hero-section"
import { ContentSection } from "@/components/content-section"
import { CurrentWork } from "@/components/current-work"
import { WorkHistory } from "@/components/work-history"
import { AboutMe } from "@/components/about-me"
import workExperienceData from "@/data/work-experience.json"

export default function Home() {
  const currentRole = workExperienceData.find(job => job.current)
  
  return (
    <div className="py-8 space-y-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <HeroSection
          name="Mihai"
          title="I'm a Computer Science student at Babeș-Bolyai University and a software engineer with a growing passion for AI and all things tech."
          description="I'm addicted to clean code and perfectly engineered solutions. I treat good architecture like an art form and see naming variables as a spiritual journey. I chase elegant logic like most people chase weekends."
          contactHref="mailto:crisanmihai2004@gmail.com"
          avatarSrc="/avatar.jpeg"
        />
      </motion.div>

      {/* Work Experience Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <ContentSection title="Work">
          <div className="space-y-6">
            {currentRole && <CurrentWork workData={currentRole} />}
            <WorkHistory workHistory={workExperienceData} />
          </div>
        </ContentSection>
      </motion.div>

      {/* About Me Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <ContentSection title="About me">
          <p className="text-base text-muted-foreground leading-relaxed">
            I’m into clean code and solid solutions. Good architecture feels like art to me, and choosing variable names is a big deal. I always aim for neat, elegant logic.
            <br /><br />
            Outside of tech, I'm passionate about sports and inspired by clever design. For a peek into the movies that inspire me, check out my <a href="https://letterboxd.com/mihaicrisan" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline transition-all">Letterboxd</a>.
          </p>
        </ContentSection>
      </motion.div>

      {/* Links Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        <ContentSection title="For more of my professional background and work">
          <div className="space-y-3">
            <div className="flex items-center justify-between group hover:bg-muted/50 -mx-2 px-2 py-1 rounded transition-colors">
              <a href="/cv" className="text-sm hover:text-foreground transition-colors">my cv</a>
              <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex items-center justify-between group hover:bg-muted/50 -mx-2 px-2 py-1 rounded transition-colors">
              <a href="https://github.com/mihaicrisan" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-foreground transition-colors">my github</a>
              <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <div className="flex items-center justify-between group hover:bg-muted/50 -mx-2 px-2 py-1 rounded transition-colors">
              <a href="https://linkedin.com/in/mihaicrisan" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-foreground transition-colors">my linkedin</a>
              <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            Get in touch at{" "}
            <a href="mailto:crisanmihai2004@gmail.com" className="underline hover:no-underline transition-all">
              crisanmihai2004@gmail.com
            </a>
          </p>
        </ContentSection>
      </motion.div>

    </div>
  )
}
