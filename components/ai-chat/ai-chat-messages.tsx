"use client";

import { motion } from "motion/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarqueeFade } from "@/components/ui/shadcn-io/marquee";
import type { Message } from "@/lib/chat-types";
import { AIChatMessage } from "./ai-chat-message";

export interface AIChatMessagesProps {
  messages: Message[];
  onCopy: (id: string, content: string) => void;
  onRegenerate: (id: string) => void;
  copiedMessageId: string | null;
  regeneratingMessageId: string | null;
}

export function AIChatMessages({
  messages,
  onCopy,
  onRegenerate,
  copiedMessageId,
  regeneratingMessageId,
}: AIChatMessagesProps) {
  return (
    <ScrollArea className="relative h-full">
      <MarqueeFade className="h-8" side="top" />
      <div className="px-4 pt-6 pb-6">
        {messages.map((message, index) => (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex gap-3"
            initial={{ opacity: 0, y: 6 }}
            key={message.id}
            transition={{
              delay: 0.1 + index * 0.02,
              duration: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <div className="min-w-0 flex-1">
              <AIChatMessage
                copiedMessageId={copiedMessageId}
                message={message}
                onCopy={onCopy}
                onRegenerate={onRegenerate}
                regeneratingMessageId={regeneratingMessageId}
              />
            </div>
          </motion.div>
        ))}
      </div>
      <MarqueeFade className="h-14" side="bottom" />
    </ScrollArea>
  );
}
