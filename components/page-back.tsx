"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

interface PageBackProps {
  label?: string;
  href?: string;
  direction?: "back" | "forward";
  external?: boolean;
  className?: string;
}

export function PageBack({
  label = "mihai",
  href = "/",
  direction = "back",
  external = false,
  className: classNameOverride = "",
}: PageBackProps) {
  const [hovered, setHovered] = useState(false);
  const isForward = direction === "forward";

  const className =
    `inline-flex items-center gap-2 font-mono text-muted-foreground text-sm transition-colors hover:text-foreground ${classNameOverride}`.trim();

  const icon = (
    <motion.span
      animate={{ x: hovered ? (isForward ? 3 : -3) : 0 }}
      transition={{ duration: 0.2 }}
    >
      {isForward ? (
        <ArrowRight className="h-3.5 w-3.5" />
      ) : (
        <ArrowLeft className="h-3.5 w-3.5" />
      )}
    </motion.span>
  );

  const content = (
    <>
      {!isForward && icon}
      <span>{label}</span>
      {isForward && icon}
    </>
  );

  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  if (external) {
    return (
      <a
        className={className}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        {...handlers}
      >
        {content}
      </a>
    );
  }

  return (
    <Link className={className} href={href} {...handlers}>
      {content}
    </Link>
  );
}
