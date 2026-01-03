"use client";

import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { type ReactNode, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ProjectLinksProps {
  children: ReactNode;
}

export function ProjectLinks({ children }: ProjectLinksProps) {
  return (
    <div className="relative my-10 flex w-full items-center justify-center py-24">
      {/* Subtle gradient background */}
      {/*<div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/10 to-transparent rounded-xl" />*/}

      {/* Content*/}
      <div className="relative z-10 flex flex-col items-center gap-3">
        {children}
      </div>
    </div>
  );
}

interface ProjectLinkButtonProps {
  type: "github" | "live" | "demo" | "download";
  href: string;
  label?: string;
}

export function ProjectLinkButton({
  type,
  href,
  label,
}: ProjectLinkButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position for magnetic effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth magnetic movement
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Transform for the arrow animation
  const arrowX = useSpring(0, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current) {
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from center (magnetic pull strength)
    const distanceX = (e.clientX - centerX) * 0.15;
    const distanceY = (e.clientY - centerY) * 0.15;

    mouseX.set(distanceX);
    mouseY.set(distanceY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
    arrowX.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    arrowX.set(3);
  };

  const getIcon = () => {
    switch (type) {
      case "github":
        return <Github className="h-3.5 w-3.5" />;
      default:
        return <ExternalLink className="h-3.5 w-3.5" />;
    }
  };

  const getDefaultLabel = () => {
    switch (type) {
      case "github":
        return "View on GitHub";
      case "live":
        return "Visit Site";
      case "demo":
        return "View Demo";
      case "download":
        return "Download";
      default:
        return "View";
    }
  };

  return (
    <motion.a
      className={cn(
        "relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-medium text-xs transition-colors",
        "group no-underline! overflow-hidden border",
        "border-border bg-secondary/80 text-secondary-foreground hover:border-foreground/20 hover:bg-secondary"
      )}
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={buttonRef}
      rel="noopener noreferrer"
      style={{ x, y }}
      target="_blank"
      whileTap={{ scale: 0.97 }}
    >
      {/* Icon */}
      <span className="relative z-10">{getIcon()}</span>

      {/* Label */}
      <span className="relative z-10">{label || getDefaultLabel()}</span>

      {/* Animated Arrow */}
      <motion.span className="relative z-10" style={{ x: arrowX }}>
        <ArrowRight className="h-3.5 w-3.5" />
      </motion.span>

      {/* Border glow effect on hover */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          boxShadow:
            type === "github"
              ? "0 0 15px 1px rgba(128, 128, 128, 0.2)"
              : "0 0 15px 1px rgba(0, 0, 0, 0.15)",
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.a>
  );
}
