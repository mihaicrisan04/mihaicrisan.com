"use client";

import { motion } from "motion/react";
import { HeroSection } from "@/components/hero-section";
import { ContentSection } from "@/components/content-section";
import { CurrentWork } from "@/components/current-work";
import { WorkHistory } from "@/components/work-history";
import { RecentWork } from "@/components/recent-work";
import workExperienceData from "@/data/work-experience.json";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Home() {
  const currentRole = workExperienceData.find((job) => job.current);
  const featuredProjects = useQuery(api.projects.getFeaturedProjects);

  return (
    <div className="max-w-xl mx-auto px-6">
      <div className="py-8 space-y-10">
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
            avatarSrcLight="/avatar-light.jpeg"
            avatarSrcDark="/avatar-dark.jpeg"
          />
        </motion.div>

        {/* Work Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <ContentSection title="Work">
            <div className="space-y-4">
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
              I'm into clean code and solid solutions. Good architecture feels
              like art to me, and choosing variable names is a big deal. I
              always aim for neat, elegant logic.
              <br />
              <br />
              Outside of tech, I'm passionate about sports and inspired by
              clever design. I'm also a speed typing enthusiast - you can check
              out my{" "}
              <a
                href="https://monkeytype.com/profile/mitzaqe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground/65 hover:text-foreground hover:underline"
              >
                Monkeytype
              </a>{" "}
              profile. For a peek into the movies that inspire me, check out my{" "}
              <a
                href="https://letterboxd.com/mihaicrisan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground/65 hover:text-foreground hover:underline"
              >
                Letterboxd
              </a>
              .
            </p>
          </ContentSection>
        </motion.div>

        {/* Recent Work Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <ContentSection title="Recent Work">
            {featuredProjects ? (
              <RecentWork projects={featuredProjects} />
            ) : (
              <div className="text-muted-foreground">Loading projects...</div>
            )}
          </ContentSection>
        </motion.div>
      </div>
    </div>
  );
}
