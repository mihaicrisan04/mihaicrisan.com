"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Grainient } from "@/components/grainient";

interface ShaderBackgroundProps {
  className?: string;
}

const DARK_PALETTE = {
  color1: "#2a2b32",
  color2: "#16171c",
  color3: "#08090c",
};

const LIGHT_PALETTE = {
  color1: "#ffffff",
  color2: "#eceef2",
  color3: "#d6d8de",
};

export function ShaderBackground({ className = "" }: ShaderBackgroundProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = !mounted || theme === "dark";
  const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <Grainient
        blendSoftness={0.22}
        color1={palette.color1}
        color2={palette.color2}
        color3={palette.color3}
        contrast={1.2}
        grainAmount={0.07}
        grainScale={2.5}
        rotationAmount={420.0}
        saturation={0.65}
        timeSpeed={0.35}
        warpAmplitude={50.0}
        warpFrequency={4.5}
        warpSpeed={2.4}
        warpStrength={1.5}
        zoom={0.95}
      />
    </div>
  );
}
