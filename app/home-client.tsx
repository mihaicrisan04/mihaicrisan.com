"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LinkGithub } from "@/components/home/link-github";
import { LinkSetup } from "@/components/home/link-setup";
import { LinkShimmer } from "@/components/home/link-shimmer";
import { LinkStrikethrough } from "@/components/home/link-strikethrough";
import { LinkWave } from "@/components/home/link-wave";

function FadeIn({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AvatarPeek({ visible }: { visible: boolean }) {
  return (
    <motion.div
      animate={{
        y: visible ? "42%" : "108%",
        rotate: visible ? -4 : -10,
      }}
      aria-hidden
      className="pointer-events-none absolute right-[28%] bottom-0 z-0 origin-bottom"
      initial={{ y: "108%", rotate: -10 }}
      transition={{ type: "spring", stiffness: 140, damping: 11, mass: 1 }}
    >
      <Image
        alt=""
        className="drop-shadow-xl"
        height={240}
        priority
        src="/avatar-cowboy.png"
        width={240}
      />
    </motion.div>
  );
}

export function HomeClient() {
  const [avatarVisible, setAvatarVisible] = useState(false);

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, []);

  return (
    <div className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden px-6">
      <div className="w-full max-w-md">
        <FadeIn delay={0.05}>
          <h1 className="font-medium text-foreground text-lg tracking-tight">
            <motion.span
              className="inline-block cursor-default"
              onHoverEnd={() => setAvatarVisible(false)}
              onHoverStart={() => setAvatarVisible(true)}
            >
              mihai crisan
            </motion.span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p className="mt-6 text-base text-muted-foreground leading-relaxed">
            software engineer based in cluj-napoca. currently building things at{" "}
            <LinkShimmer href="https://wolfpack-digital.com">
              wolfpack digital
            </LinkShimmer>
            , and studying computer science at{" "}
            <LinkWave href="https://www.ubbcluj.ro/en/">
              bbu university
            </LinkWave>
            .
          </p>
        </FadeIn>

        <FadeIn delay={0.25}>
          <p className="mt-5 text-base text-muted-foreground leading-relaxed">
            i care a lot about software in general, and lately a lot about ai.
            my <LinkSetup href="/setup">setup</LinkSetup> says a lot about me.
          </p>
        </FadeIn>

        <FadeIn delay={0.35}>
          <p className="mt-5 text-base text-muted-foreground leading-relaxed">
            reach out on{" "}
            <LinkStrikethrough href="https://x.com/mihaicrisann">
              twitter
            </LinkStrikethrough>
            , or see what i&apos;m working on on{" "}
            <LinkGithub
              href="https://github.com/mihaicrisan04"
              username="mihaicrisan04"
            >
              github
            </LinkGithub>
            .
          </p>
        </FadeIn>
      </div>

      <AvatarPeek visible={avatarVisible} />

      <motion.div
        animate={{ opacity: 1 }}
        className="absolute bottom-6 left-6 z-10 flex items-center gap-4 font-mono text-muted-foreground/60 text-xs"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <span className="text-muted-foreground/50">© 2026</span>
        <span aria-hidden className="text-muted-foreground/30">
          /
        </span>
        <Link className="transition-colors hover:text-foreground" href="/work">
          work
        </Link>
        <a
          className="transition-colors hover:text-foreground"
          href="/cv.pdf"
          rel="noopener noreferrer"
          target="_blank"
        >
          cv
        </a>
      </motion.div>
    </div>
  );
}
