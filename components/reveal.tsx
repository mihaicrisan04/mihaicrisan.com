import type { CSSProperties, ElementType, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
  id?: string;
}

// CSS-only entrance animation. Content is in the HTML and animates on paint,
// so nothing waits on JavaScript.
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
  id,
}: RevealProps) {
  const style = { "--reveal-delay": `${delay}s` } as CSSProperties;
  return (
    <Tag
      className={className ? `reveal ${className}` : "reveal"}
      id={id}
      style={style}
    >
      {children}
    </Tag>
  );
}
