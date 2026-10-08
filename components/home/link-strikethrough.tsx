interface LinkStrikethroughProps {
  href: string;
  children: React.ReactNode;
}

// Hover draws a hand-drawn strike through the word, then pops the X logo in.
// Choreography lives in .link-strike (globals.css).
export function LinkStrikethrough({ href, children }: LinkStrikethroughProps) {
  return (
    <a
      className="link-strike relative inline-block font-medium text-foreground"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span>{children}</span>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-0 h-[0.55em] w-full -translate-y-1/2 overflow-visible"
        preserveAspectRatio="none"
        role="presentation"
        viewBox="0 0 100 10"
      >
        <path
          className="strike-path"
          d="M 1 6 Q 12 2 24 5 T 48 4 T 72 6 T 99 4"
          fill="none"
          pathLength={1}
          stroke="#dc2626"
          strokeLinecap="round"
          strokeWidth={2.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg
        aria-hidden="true"
        className="strike-icon pointer-events-none absolute h-[0.95em] w-[0.95em] origin-bottom text-foreground"
        fill="currentColor"
        role="presentation"
        style={{ top: "-0.65em", right: "-0.85em" }}
        viewBox="0 0 24 24"
      >
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
      </svg>
    </a>
  );
}
