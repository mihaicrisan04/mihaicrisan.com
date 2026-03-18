"use client";

import { Check, Copy, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import { Action, Actions } from "@/components/ui/shadcn-io/ai/actions";
import { Response } from "@/components/ui/shadcn-io/ai/response";
import type { ChatStep, Message, MessagePart } from "@/lib/chat-types";
import { ReasoningDisplay } from "./ai-chat-reasoning";
import { ToolSteps } from "./ai-chat-tool-steps";

// Group consecutive parts for rendering
// This groups consecutive tool_call parts into a single array for rendering as one ToolSteps block
type GroupedPart =
  | { type: "reasoning"; id: string; content: string; isStreaming?: boolean }
  | { type: "tool_calls"; id: string; steps: ChatStep[] }
  | { type: "text"; id: string; content: string };

function groupParts(parts: MessagePart[]): GroupedPart[] {
  const grouped: GroupedPart[] = [];
  let currentToolCalls: ChatStep[] = [];
  let toolCallGroupId = "";

  for (const part of parts) {
    if (part.type === "tool_call") {
      // Accumulate consecutive tool calls
      if (currentToolCalls.length === 0) {
        toolCallGroupId = `tool_group_${part.id}`;
      }
      currentToolCalls.push(part.step);
    } else {
      // If we have accumulated tool calls, flush them first
      if (currentToolCalls.length > 0) {
        grouped.push({
          type: "tool_calls",
          id: toolCallGroupId,
          steps: [...currentToolCalls],
        });
        currentToolCalls = [];
      }
      // Add the non-tool-call part
      grouped.push(part);
    }
  }

  // Don't forget to flush remaining tool calls
  if (currentToolCalls.length > 0) {
    grouped.push({
      type: "tool_calls",
      id: toolCallGroupId,
      steps: currentToolCalls,
    });
  }

  return grouped;
}

interface MessageActionsProps {
  messageId: string;
  content: string;
  onCopy: (id: string, content: string) => void;
  onRegenerate: (id: string) => void;
  copiedMessageId: string | null;
  regeneratingMessageId: string | null;
}

function MessageActions({
  messageId,
  content,
  onCopy,
  onRegenerate,
  copiedMessageId,
  regeneratingMessageId,
}: MessageActionsProps) {
  return (
    <Actions>
      <Action
        onClick={() => onCopy(messageId, content)}
        tooltip={copiedMessageId === messageId ? "Copied!" : "Copy"}
      >
        <AnimatePresence initial={false} mode="wait">
          {copiedMessageId === messageId ? (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              initial={{ opacity: 0, scale: 0.5 }}
              key="check"
              transition={{ duration: 0.15 }}
            >
              <Check className="h-4 w-4 text-green-500" />
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              initial={{ opacity: 0, scale: 0.5 }}
              key="copy"
              transition={{ duration: 0.15 }}
            >
              <Copy className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </Action>
      <Action onClick={() => onRegenerate(messageId)} tooltip="Regenerate">
        <motion.div
          animate={{
            rotate: regeneratingMessageId === messageId ? 360 : 0,
          }}
          transition={{
            duration: 1,
            repeat:
              regeneratingMessageId === messageId
                ? Number.POSITIVE_INFINITY
                : 0,
            ease: "linear",
          }}
        >
          <RefreshCw className="h-4 w-4" />
        </motion.div>
      </Action>
    </Actions>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div>
      <p className="font-bold text-sm opacity-40">you</p>
      <p className="text-foreground text-sm">{content}</p>
    </div>
  );
}

interface AssistantMessageProps {
  message: Message;
  onCopy: (id: string, content: string) => void;
  onRegenerate: (id: string) => void;
  copiedMessageId: string | null;
  regeneratingMessageId: string | null;
}

function AssistantMessage({
  message,
  onCopy,
  onRegenerate,
  copiedMessageId,
  regeneratingMessageId,
}: AssistantMessageProps) {
  // Group consecutive tool calls together
  const groupedParts = useMemo(
    () => groupParts(message.parts || []),
    [message.parts]
  );

  // Render parts in chronological order if available, otherwise fall back to legacy fields
  const hasParts = message.parts && message.parts.length > 0;

  return (
    <div className="min-w-0 space-y-3">
      <p className="font-bold text-sm opacity-60">AI bot</p>

      {hasParts ? (
        // Render grouped parts in chronological order
        <>
          {groupedParts.map((part) => {
            switch (part.type) {
              case "reasoning":
                return (
                  <ReasoningDisplay
                    isStreaming={part.isStreaming ?? false}
                    key={part.id}
                    reasoning={part.content}
                  />
                );
              case "tool_calls":
                // Render all consecutive tool calls in a single ToolSteps block
                return <ToolSteps key={part.id} steps={part.steps} />;
              case "text":
                return (
                  <div
                    className="prose prose-sm dark:prose-invert min-w-0 max-w-none"
                    key={part.id}
                  >
                    <div className="relative min-w-0">
                      <Response className="text-muted-foreground text-sm">
                        {part.content}
                      </Response>
                    </div>
                  </div>
                );
              default:
                return null;
            }
          })}
          {/* Show dots loader only when streaming but no parts at all yet */}
          {message.isStreaming && message.parts?.length === 0 && (
            <div className="prose prose-sm dark:prose-invert min-w-0 max-w-none">
              <TextShimmer className="font-medium text-sm" duration={1.5}>
                ...
              </TextShimmer>
            </div>
          )}
        </>
      ) : (
        // Legacy rendering for backwards compatibility
        <>
          {/* Tool steps display (Steps) - shown first */}
          {message.steps && message.steps.length > 0 && (
            <ToolSteps steps={message.steps} />
          )}

          {/* Reasoning display (ChainOfThought) - shown below tools */}
          {(message.reasoning || message.isReasoningStreaming) && (
            <ReasoningDisplay
              isStreaming={message.isReasoningStreaming ?? false}
              reasoning={message.reasoning ?? ""}
            />
          )}

          {/* Response content */}
          {(message.content || message.isStreaming) && (
            <div className="prose prose-sm dark:prose-invert min-w-0 max-w-none">
              {message.isStreaming && !message.content ? (
                <TextShimmer className="font-medium text-sm" duration={1.5}>
                  Thinking...
                </TextShimmer>
              ) : (
                <div className="relative min-w-0">
                  <Response className="text-muted-foreground text-sm">
                    {message.content}
                  </Response>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Actions (copy, regenerate) */}
      {!message.isStreaming && message.content && (
        <MessageActions
          content={message.content}
          copiedMessageId={copiedMessageId}
          messageId={message.id}
          onCopy={onCopy}
          onRegenerate={onRegenerate}
          regeneratingMessageId={regeneratingMessageId}
        />
      )}
    </div>
  );
}

export interface AIChatMessageProps {
  message: Message;
  onCopy: (id: string, content: string) => void;
  onRegenerate: (id: string) => void;
  copiedMessageId: string | null;
  regeneratingMessageId: string | null;
}

export function AIChatMessage({
  message,
  onCopy,
  onRegenerate,
  copiedMessageId,
  regeneratingMessageId,
}: AIChatMessageProps) {
  if (message.role === "user") {
    return <UserMessage content={message.content} />;
  }

  return (
    <AssistantMessage
      copiedMessageId={copiedMessageId}
      message={message}
      onCopy={onCopy}
      onRegenerate={onRegenerate}
      regeneratingMessageId={regeneratingMessageId}
    />
  );
}
