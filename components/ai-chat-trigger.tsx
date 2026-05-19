"use client";

import { useAIChat } from "@/contexts/ai-chat-context";

export function AIChatTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open } = useAIChat();

  return (
    <button
      aria-label="open ai chat"
      className={className}
      onClick={(e) => {
        open();
        props.onClick?.(e);
      }}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
