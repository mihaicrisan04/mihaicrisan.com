import type { CSSProperties } from "react";

interface LinkWaveProps {
  href: string;
  children: string;
}

// Each character gets a delay proportional to its distance from the center,
// so the wave ripples outward on hover. Pure CSS, see .link-wave in globals.
export function LinkWave({ href, children }: LinkWaveProps) {
  const chars = Array.from(children.trim());
  const center = (chars.length - 1) / 2;

  return (
    <a
      aria-label={children.trim()}
      className="link-wave inline-block whitespace-nowrap align-baseline font-medium text-foreground transition-opacity hover:opacity-70"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {chars.map((ch, i) => {
        const style = { "--i": Math.abs(i - center) } as CSSProperties;
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
