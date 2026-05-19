"use client";

import { motion, useAnimationControls } from "motion/react";

interface LinkShimmerProps {
  href: string;
  children: React.ReactNode;
}

export function LinkShimmer({ href, children }: LinkShimmerProps) {
  const controls = useAnimationControls();

  const playSweep = () => {
    controls.set({ backgroundPosition: "100% 0%" });
    controls.start({
      backgroundPosition: "0% 0%",
      transition: { duration: 0.65, ease: [0.34, 0, 0.12, 1] },
    });
  };

  return (
    <motion.a
      animate={controls}
      className="link-shimmer whitespace-nowrap font-medium"
      href={href}
      initial={{ backgroundPosition: "0% 0%" }}
      onFocus={playSweep}
      onMouseEnter={playSweep}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </motion.a>
  );
}
