"use client";

import { useEffect, useRef, useState } from "react";

const CHARS_PER_SECOND = 200;

/**
 * Smoothly reveals text character-by-character while streaming.
 * Buffers incoming chunks and drips them out at a steady pace.
 * When streaming stops, snaps to the full text immediately.
 */
export function useStreamReveal(text: string, streaming: boolean): string {
  const [revealed, setRevealed] = useState(text);
  const bufferRef = useRef(text);
  const revealedLenRef = useRef(text.length);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    bufferRef.current = text;

    if (!streaming) {
      // Snap to full text when streaming ends
      revealedLenRef.current = text.length;
      setRevealed(text);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
      lastTimeRef.current = 0;
      return;
    }

    // Already animating — the tick loop will pick up the new buffer
    if (frameRef.current) {
      return;
    }

    function tick(now: number) {
      const dt = lastTimeRef.current ? now - lastTimeRef.current : 16;
      lastTimeRef.current = now;

      const target = bufferRef.current;
      const currentLen = revealedLenRef.current;

      if (currentLen < target.length) {
        const charsToReveal = Math.max(
          1,
          Math.round((CHARS_PER_SECOND / 1000) * dt)
        );
        const newLen = Math.min(currentLen + charsToReveal, target.length);
        revealedLenRef.current = newLen;
        setRevealed(target.slice(0, newLen));
      }

      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
      lastTimeRef.current = 0;
    };
  }, [text, streaming]);

  return revealed;
}
