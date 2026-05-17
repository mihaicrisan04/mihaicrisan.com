"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Grainient } from "@/components/grainient";

interface ShaderBackgroundProps {
  className?: string;
}

const DARK_PALETTE = {
  color1: "#1f2024",
  color2: "#15161a",
  color3: "#0d0e11",
};

const LIGHT_PALETTE = {
  color1: "#fafafb",
  color2: "#f2f2f4",
  color3: "#e8e9ec",
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
        blendSoftness={0.18}
        color1={palette.color1}
        color2={palette.color2}
        color3={palette.color3}
        contrast={1.1}
        grainAmount={0.06}
        grainScale={2.5}
        rotationAmount={320.0}
        saturation={0.5}
        timeSpeed={0.2}
        warpAmplitude={55.0}
        warpFrequency={4.0}
        warpSpeed={1.8}
        warpStrength={1.0}
        zoom={1.1}
      />
    </div>
  );
}
