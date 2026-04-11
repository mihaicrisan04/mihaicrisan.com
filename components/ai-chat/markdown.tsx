"use client";

import { memo } from "react";
import { type Components, Streamdown } from "streamdown";
import { cn } from "@/lib/utils";

export interface MarkdownProps {
  children: string;
  className?: string;
}

// biome-ignore lint/suspicious/noExplicitAny: streamdown component props are untyped
type P = Record<string, any>;

const INITIAL_COMPONENTS: Components = {
  code({ className, children, ...props }: P) {
    const isInline = !className?.includes("language-");
    if (isInline) {
      return (
        <code
          className={cn(
            "rounded-sm border bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground",
            className
          )}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={cn("font-mono text-sm", className)} {...props}>
        {children}
      </code>
    );
  },
  pre({ children }: P) {
    return (
      <pre className="my-2 overflow-x-auto rounded-lg border bg-muted p-3 text-sm">
        {children}
      </pre>
    );
  },
  a({ children, href, ...props }: P) {
    return (
      <a
        className="text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground"
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        {...props}
      >
        {children}
      </a>
    );
  },
  blockquote({ children }: P) {
    return (
      <blockquote className="my-2 border-muted-foreground/30 border-l-2 pl-4 text-muted-foreground italic">
        {children}
      </blockquote>
    );
  },
  table({ children }: P) {
    return (
      <div className="my-2 overflow-x-auto">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    );
  },
  th({ children }: P) {
    return (
      <th className="border-border border-b px-2 py-1 text-left font-medium">
        {children}
      </th>
    );
  },
  td({ children }: P) {
    return <td className="border-border border-b px-2 py-1">{children}</td>;
  },
  h1({ children }: P) {
    return (
      <h1 className="mt-2 mb-1 font-semibold text-foreground text-lg">
        {children}
      </h1>
    );
  },
  h2({ children }: P) {
    return (
      <h2 className="mt-2 mb-1 font-semibold text-base text-foreground">
        {children}
      </h2>
    );
  },
  h3({ children }: P) {
    return (
      <h3 className="mt-2 mb-1 font-semibold text-foreground text-sm">
        {children}
      </h3>
    );
  },
  ul({ children }: P) {
    return <ul className="my-1 list-disc space-y-0.5 pl-5">{children}</ul>;
  },
  ol({ children }: P) {
    return <ol className="my-1 list-decimal space-y-0.5 pl-5">{children}</ol>;
  },
  li({ children }: P) {
    return <li className="leading-relaxed">{children}</li>;
  },
  p({ children }: P) {
    return <p className="leading-relaxed">{children}</p>;
  },
  hr() {
    return <hr className="my-3 border-border" />;
  },
};

function MarkdownComponent({ children, className }: MarkdownProps) {
  return (
    <Streamdown
      className={cn("flex flex-col gap-2", className)}
      components={INITIAL_COMPONENTS}
    >
      {children}
    </Streamdown>
  );
}

const Markdown = memo(MarkdownComponent);
Markdown.displayName = "Markdown";

export { Markdown };
