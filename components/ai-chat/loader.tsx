"use client";

import { cn } from "@/lib/utils";

export interface LoaderProps {
  variant?: "dots" | "typing";
  size?: "sm" | "md" | "lg";
  className?: string;
}

function TypingLoader({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dotSizes = { sm: "size-1", md: "size-1.5", lg: "size-2" };
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          className={cn(
            "animate-[typing_1s_infinite] rounded-full bg-primary",
            dotSizes[size]
          )}
          key={i}
          style={{ animationDelay: `${i * 250}ms` }}
        />
      ))}
      <span className="sr-only">Loading</span>
      <style>{`
        @keyframes typing {
          0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

function Loader({ variant = "typing", size = "md", className }: LoaderProps) {
  switch (variant) {
    case "typing":
      return <TypingLoader className={className} size={size} />;
    default:
      return <TypingLoader className={className} size={size} />;
  }
}

Loader.displayName = "Loader";

export { Loader, TypingLoader };
