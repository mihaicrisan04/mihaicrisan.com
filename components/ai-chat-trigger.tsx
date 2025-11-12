'use client';

import { useAIChat } from '@/contexts/ai-chat-context';
import { MorphingPopoverTrigger } from '@/components/motion-primitives/morphing-popover';
import { Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { useEffect } from 'react';
import { motion } from 'motion/react';

export function AIChatTrigger() {
  const { open, isOpen, uniqueId } = useAIChat();

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
    <Tooltip>
      <TooltipTrigger asChild>
        <MorphingPopoverTrigger
          onClick={open}
          className="inline-flex items-center gap-2 rounded-md border border-zinc-950/10 bg-white px-3 py-1.5 text-sm font-medium text-zinc-950 transition-all hover:bg-zinc-50 dark:border-zinc-50/10 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          aria-label="Open AI chat"
        >
          <Sparkles className="h-4 w-4" />
          <motion.span layoutId={`popover-label-${uniqueId}`} className="text-sm">
            Ask AI
          </motion.span>
        </MorphingPopoverTrigger>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <span className="text-xs">+</span>
          <Kbd>I</Kbd>
        </KbdGroup>
      </TooltipContent>
    </Tooltip>
  );
}