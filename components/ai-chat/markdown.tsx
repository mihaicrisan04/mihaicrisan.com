"use client";

import { AnimatedMarkdown } from "@nvq/flowtoken";
import { memo } from "react";
import { cn } from "@/lib/utils";

export interface MarkdownProps {
  children: string;
  isStreaming?: boolean;
  className?: string;
}

function MarkdownComponent({
  children,
  isStreaming = false,
  className,
}: MarkdownProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:my-2 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic [&_code]:rounded-sm [&_code]:border [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_h1]:mt-2 [&_h1]:mb-1 [&_h1]:font-semibold [&_h1]:text-lg [&_h2]:mt-2 [&_h2]:mb-1 [&_h2]:font-semibold [&_h2]:text-base [&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:font-semibold [&_h3]:text-sm [&_li]:leading-relaxed [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:space-y-0.5 [&_ol]:pl-5 [&_p]:leading-relaxed [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:text-sm [&_ul]:my-1 [&_ul]:list-disc [&_ul]:space-y-0.5 [&_ul]:pl-5",
        className
      )}
    >
      <AnimatedMarkdown
        animation="fadeIn"
        animationDuration="0.35s"
        animationTimingFunction="ease-out"
        content={children}
        isStreaming={isStreaming}
      />
    </div>
  );
}

const Markdown = memo(MarkdownComponent);
Markdown.displayName = "Markdown";

export { Markdown };
