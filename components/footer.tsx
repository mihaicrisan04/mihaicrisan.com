"use client";

import { Heart } from "lucide-react";
import {
  type MotionValue,
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { CustomLink } from "@/components/custom-link";
import { TextLoop } from "./motion-primitives/text-loop";

const socialLinks = [
  { name: "GitHub", href: "https://github.com/mihaicrisan04" },
  { name: "LinkedIn", href: "https://linkedin.com/in/mihaicrisan04" },
  { name: "X", href: "https://x.com/mitzaqe" },
  { name: "Instagram", href: "https://instagram.com/mihaicrisann" },
  { name: "Email", href: "mailto:crisanmihai2004@gmail.com" },
];

// Calculate hill factor for parabola shape (center items bend more)
const getHillFactor = (index: number, total: number) => {
  const normalizedPos = ((index - (total - 1) / 2) / ((total - 1) / 2)) * 0.9;
  return 1 - normalizedPos ** 2;
};

// Sub-component for each bending link - encapsulates hook logic
function BendingLink({
  link,
  index,
  total,
  scrollYProgress,
}: {
  link: { name: string; href: string };
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const hillFactor = getHillFactor(index, total);
  const maxBend = -55 * hillFactor * 1.2;

  // Transform scroll progress to bend offset
  // Bend starts at 50% progress (footer half visible) and maxes at 100%
  const y = useTransform(scrollYProgress, [0.6, 1], [0, maxBend]);

  return (
    <motion.div style={{ y }}>
      <CustomLink
        className="text-base text-muted-foreground hover:text-foreground"
        external
        href={link.href}
      >
        {link.name}
      </CustomLink>
    </motion.div>
  );
}

export function Footer() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  // Track scroll progress of footer through viewport
  // 0 = footer just entering view, 1 = footer at bottom of viewport
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme-specific colors
  const themeStyles = {
    light: {
      background: "#f8fafc",
      gridColor: "#e2e8f0",
    },
    dark: {
      background: "var(--background)",
      gridColor: "var(--border)",
    },
  };

  // Use dark as fallback until mounted to prevent hydration mismatch
  const currentTheme = mounted && theme !== "dark" ? "light" : "dark";
  const styles = themeStyles[currentTheme];

  return (
    <motion.footer
      className="relative min-h-[60vh] overflow-hidden py-32"
      ref={footerRef}
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
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
        }}
      />

      {/* Footer Content */}
      <div className="relative z-10 mx-auto max-w-2xl px-2 md:px-6">
        <div className="flex flex-col items-center gap-8">
          {/* Social Links with Hill Bending Effect */}
          <div className="flex flex-wrap items-baseline justify-center gap-2 md:gap-13">
            {socialLinks.map((link, index) => (
              <BendingLink
                index={index}
                key={link.name}
                link={link}
                scrollYProgress={scrollYProgress}
                total={socialLinks.length}
              />
            ))}
          </div>

          {/* Signature Logo */}
          <div className="relative h-[80px] w-[240px] overflow-hidden">
            <Image
              alt="Mihai Crisan Signature"
              className="object-cover"
              fill
              src={
                currentTheme === "dark"
                  ? "/signature-white.png"
                  : "/signature-gray.png"
              }
            />
          </div>

          {/* Copyright / Location */}
          <div className="text-muted-foreground text-sm">
            <TextLoop interval={3}>
              <span>© 2026 Mihai Crisan</span>
              <span>
                Built with{" "}
                <Heart className="inline-block h-4 w-4 transition-colors duration-300 hover:text-red-500" />{" "}
                from Cluj-Napoca
              </span>
            </TextLoop>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
