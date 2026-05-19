"use client";

import { useEffect, useRef, useState } from "react";

interface LinkWaveProps {
  href: string;
  children: string;
  charDuration?: number;
  waveHalfWidth?: number;
  maxTranslate?: number;
}

export function LinkWave({
  href,
  children,
  charDuration = 50,
  waveHalfWidth = 1,
  maxTranslate = 4,
}: LinkWaveProps) {
  const text = children.trim();
  const buildInitial = (): number[] => Array.from(text).map(() => 0);
  const [intensities, setIntensities] = useState<number[]>(buildInitial);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const cancelTick = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const startAnimation = () => {
    cancelTick();
    const center = (text.length - 1) / 2;
    const maxDist = Math.max(center, text.length - 1 - center);
    const totalDuration = (maxDist + waveHalfWidth) * charDuration;
    startRef.current = performance.now();

    const tick = (now: number) => {
      const start = startRef.current;
      if (start === null) {
        return;
      }
      const elapsed = now - start;
      const frontDist = elapsed / charDuration;
      const next: number[] = Array.from(text).map((_, i) => {
        const dist = Math.abs(i - center);
        const waveDelta = Math.abs(dist - frontDist);
        if (waveDelta >= waveHalfWidth) {
          return 0;
        }
        return 1 - waveDelta / waveHalfWidth;
      });
      setIntensities(next);
      if (elapsed < totalDuration) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setIntensities(buildInitial());
        rafRef.current = null;
        startRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(
    () => () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    },
    []
  );

  return (
    <a
      className="inline-block whitespace-nowrap align-baseline font-medium text-foreground transition-opacity hover:opacity-70"
      href={href}
      onFocus={startAnimation}
      onMouseEnter={startAnimation}
      rel="noopener noreferrer"
      target="_blank"
    >
      {Array.from(text).map((ch, i) => {
        const intensity = intensities[i] ?? 0;
        const ty = -(intensity * maxTranslate);
        const style: React.CSSProperties = {
          display: "inline-block",
          transform: `translate3d(0, ${ty}px, 0)`,
        };
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: text is static and order is stable
          <span key={i} style={style}>
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </a>
  );
}
