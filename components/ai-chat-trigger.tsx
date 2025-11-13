'use client';

import { useAIChat } from '@/contexts/ai-chat-context';
import { Sparkles } from 'lucide-react';
import { useEffect, forwardRef } from 'react';

export const AIChatTrigger = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => {
  const { open, isOpen } = useAIChat();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'i' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!isOpen) {
          open();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, isOpen]);

  return (
    <button
      ref={ref}
      onClick={(e) => {
        open();
        props.onClick?.(e);
      }}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-all hover:bg-muted"
      aria-label="Open AI chat"
      {...props}
    >
      <Sparkles className="h-4 w-4" />
      <span className="hidden sm:inline text-sm">
        Ask AI
      </span>
    </button>
  );
});

AIChatTrigger.displayName = 'AIChatTrigger';