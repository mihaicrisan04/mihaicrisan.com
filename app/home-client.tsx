"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ContentSection } from "@/components/content-section";
import { CurrentWork } from "@/components/current-work";
import { HeroSection } from "@/components/hero-section";
import { RecentWork } from "@/components/recent-work";
import { WorkHistory } from "@/components/work-history";
import type { Project } from "@/lib/projects";
import type { WorkExperience } from "@/lib/work";

interface HomeClientProps {
  currentRole: WorkExperience | undefined;
  featuredProjects: Project[];
  workExperience: WorkExperience[];
}

function FadeIn({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

export function HomeClient({
  currentRole,
  featuredProjects,
  workExperience,
}: HomeClientProps) {
  return (
    <div className="mx-auto max-w-xl px-6">
      <div className="space-y-10 py-8">
        <FadeIn delay={0.1}>
          <HeroSection
            avatarSrcDark="/avatar-dark.jpeg"
            avatarSrcLight="/avatar-light.jpeg"
            name="Mihai"
            title={
              <>
                , a software engineer based in
                <br />
                Cluj-Napoca
              </>
            }
          />
        </FadeIn>

        <FadeIn delay={0.15}>
          <ContentSection title="work">
            <div className="space-y-4">
              {currentRole && <CurrentWork workData={currentRole} />}
              <WorkHistory workHistory={workExperience} />
            </div>
          </ContentSection>
        </FadeIn>

        <FadeIn delay={0.2}>
          <ContentSection title="about me">
            <p className="text-base text-muted-foreground leading-relaxed">
              i'm a computer science student at babeș-bolyai university, lately
              geeking out about ai — tinkering with how to integrate it into
              apps and products to make them better.
              <br />
              <br />
              outside of tech, i'm passionate about sports and inspired by
              clever design. i'm also a speed typing enthusiast -{" "}
              <a
                className="text-muted-foreground/65 hover:text-foreground hover:underline"
                href="https://monkeytype.com/profile/mitzaqe"
                rel="noopener noreferrer"
                target="_blank"
              >
                Monkeytype
              </a>
              . for a peek into the movies that inspire me,{" "}
              <a
                className="text-muted-foreground/65 hover:text-foreground hover:underline"
                href="https://letterboxd.com/mihaicrisan"
                rel="noopener noreferrer"
                target="_blank"
              >
                Letterboxd
              </a>
              .
            </p>
          </ContentSection>
        </FadeIn>

        <FadeIn delay={0.25}>
          <ContentSection title="recent work">
            <RecentWork projects={featuredProjects} />
          </ContentSection>
        </FadeIn>
      </div>
    </div>
  );
}
