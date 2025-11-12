'use client';

import { useAIChat } from '@/contexts/ai-chat-context';
import { AnimatePresence, motion } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { MorphingPopoverContent } from '@/components/motion-primitives/morphing-popover';

export function AIChatOverlay() {
  const { isOpen, close, uniqueId } = useAIChat();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed inset-0 z-50"
        >
          {/* Backdrop with blur - full screen */}
          <motion.div
            initial={{ backdropFilter: 'blur(0px)' }}
            animate={{ backdropFilter: 'blur(12px)' }}
            exit={{ backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-background/60"
            onClick={close}
          />

          {/* Chat interface container */}
          <div className="relative z-10 flex h-full w-full items-center justify-center p-4">
            <div className="flex h-full w-full max-w-3xl flex-col">
              {/* Close button */}
              <div className="flex justify-end mb-6">
                <button
                  type="button"
                  onClick={close}
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Chat messages area - no card, just content */}
              <div className="flex-1 overflow-y-auto px-4 mb-6">
                <div className="space-y-6 max-w-2xl mx-auto">
                  {/* Sample message - Assistant */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="text-sm text-muted-foreground">
                        <p className="mb-3">
                          Hi! I'm here to help you learn more about Mihai's work and experience. You can ask me about:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>His technical skills and expertise</li>
                          <li>Projects he's worked on</li>
                          <li>His professional experience</li>
                          <li>How to get in touch</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Sample message - User */}
                  <div className="flex gap-3 justify-end">
                    <div className="flex-1 max-w-[80%]">
                      <div className="rounded-lg bg-muted px-4 py-3">
                        <p className="text-sm text-foreground">
                          What technologies does Mihai work with?
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sample message - Assistant response */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="text-sm text-muted-foreground space-y-3">
                        <p>
                          Mihai is a full-stack developer with expertise in:
                        </p>
                        <div className="space-y-2">
                          <p>
                            <strong className="text-foreground font-semibold">Frontend:</strong> React, Next.js, TypeScript, Tailwind CSS, Framer Motion
                          </p>
                          <p>
                            <strong className="text-foreground font-semibold">Backend:</strong> Node.js, Python, REST APIs, GraphQL
                          </p>
                          <p>
                            <strong className="text-foreground font-semibold">Tools:</strong> Git, Docker, CI/CD pipelines
                          </p>
                        </div>
                        <p>
                          He's passionate about creating performant, accessible web experiences with clean architecture and delightful user interactions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Morphing input area at bottom - fixed position */}
              <div className="w-full max-w-2xl mx-auto px-4">
                <MorphingPopoverContent className="w-full border border-border bg-background shadow-lg rounded-xl p-0 overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <motion.span
                      layoutId={`popover-label-${uniqueId}`}
                      style={{
                        opacity: 1,
                      }}
                      className="absolute left-16 text-sm text-muted-foreground select-none pointer-events-none"
                    >
                      Ask me anything about Mihai...
                    </motion.span>
                    <input
                      type="text"
                      placeholder=""
                      className="flex-1 bg-transparent text-sm outline-none text-foreground"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          // Handle message send
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
                      onClick={(e) => {
                        e.preventDefault();
                        // Handle message send
                      }}
                    >
                      Send
                    </button>
                  </div>
                </MorphingPopoverContent>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}