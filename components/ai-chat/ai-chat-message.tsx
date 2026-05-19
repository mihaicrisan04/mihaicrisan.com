"use client";

import { isReasoningUIPart, isToolUIPart } from "ai";
import { Check, Copy } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { Streamdown } from "streamdown";
import type { MessagePart, UIMessage } from "@/lib/chat-types";
import { cn } from "@/lib/utils";
import { AssistantMessageGroups } from "./assistant-message-groups";
import { streamdownComponents } from "./markdown";
import { ThinkingBlock } from "./thinking-block";
import { ToolCall } from "./tool-call";

// ---------------------------------------------------------------------------
// Message grouping types (ported from open-agents)
// ---------------------------------------------------------------------------

type ReasoningMessagePart = Extract<MessagePart, { type: "reasoning" }>;

type MessageRenderGroup =
  | { type: "part"; part: MessagePart; index: number; renderKey: string }
  | {
      type: "reasoning-group";
      parts: ReasoningMessagePart[];
      startIndex: number;
      renderKey: string;
    };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getPartIdentity(part: MessagePart): string {
  if (isToolUIPart(part)) {
    return part.toolCallId ? `tool:${part.toolCallId}` : `tool:${part.type}`;
  }
  if (isReasoningUIPart(part)) {
    return "reasoning";
  }
  if (part.type === "text") {
    return "text";
  }
  return `part:${part.type}`;
}

function getReasoningGroupText(parts: ReasoningMessagePart[]): string {
  return parts
    .map((part) => part.text)
    .filter((text) => text.trim().length > 0)
    .join("\n\n");
}

function hasRenderableAssistantPart(part: MessagePart): boolean {
  if (part.type === "text") {
    return (part as { text: string }).text.length > 0;
  }
  if (isToolUIPart(part)) {
    return true;
  }
  if (isReasoningUIPart(part)) {
    return (
      part.text.length > 0 || (part as { state?: string }).state === "streaming"
    );
  }
  return false;
}

function shouldKeepCollapsedReasoningStreaming(options: {
  isMessageStreaming: boolean;
  hasStreamingReasoningPart: boolean;
  hasRenderableContentAfterGroup: boolean;
}): boolean {
  return (
    options.isMessageStreaming &&
    (options.hasStreamingReasoningPart ||
      !options.hasRenderableContentAfterGroup)
  );
}

function textFromMessage(msg: UIMessage): string {
  return msg.parts
    .filter(
      (p): p is Extract<MessagePart, { type: "text" }> => p.type === "text"
    )
    .map((p) => p.text)
    .join("");
}

function reasoningSignature(msg: UIMessage): string {
  return msg.parts
    .filter(isReasoningUIPart)
    .map((p) => `${(p as { state?: string }).state ?? ""}|${p.text.length}`)
    .join("||");
}

function toolPartsSignature(msg: UIMessage): string {
  return msg.parts
    .filter(isToolUIPart)
    .map((p) => {
      const id = (p as { toolCallId?: string }).toolCallId ?? "";
      const state = (p as { state?: string }).state ?? "";
      return `${id}|${p.type}|${state}`;
    })
    .join("||");
}

// ---------------------------------------------------------------------------
// Copy button
// ---------------------------------------------------------------------------

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore
    }
  };

  return (
    <button
      aria-label={copied ? "Copied" : "Copy message"}
      className="inline-flex size-6 items-center justify-center rounded text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
      onClick={() => {
        handleCopy().catch(() => undefined);
      }}
      type="button"
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export interface AIChatMessageProps {
  message: UIMessage;
  isStreaming: boolean;
  startedAt: string | null;
}

function AIChatMessageComponent({
  message,
  isStreaming: isMessageStreaming,
  startedAt,
}: AIChatMessageProps) {
  const isUser = message.role === "user";
  const text = textFromMessage(message);
  const parts = message.parts;

  // Group consecutive reasoning parts
  const groups = useMemo(() => {
    const result: MessageRenderGroup[] = [];
    let currentReasoningGroup: ReasoningMessagePart[] = [];
    let reasoningGroupStartIndex = 0;
    const partIdentityCounts = new Map<string, number>();

    const getStableKey = (part: MessagePart): string => {
      const identity = getPartIdentity(part);
      if (isToolUIPart(part) && (part as { toolCallId?: string }).toolCallId) {
        return identity;
      }
      const count = partIdentityCounts.get(identity) ?? 0;
      partIdentityCounts.set(identity, count + 1);
      return `${identity}:${count}`;
    };

    const flushReasoning = () => {
      if (currentReasoningGroup.length === 0) {
        return;
      }
      result.push({
        type: "reasoning-group",
        parts: currentReasoningGroup,
        startIndex: reasoningGroupStartIndex,
        renderKey: `reasoning-group:${getStableKey(currentReasoningGroup[0])}`,
      });
      currentReasoningGroup = [];
    };

    for (const [index, part] of parts.entries()) {
      if (isReasoningUIPart(part)) {
        if (currentReasoningGroup.length === 0) {
          reasoningGroupStartIndex = index;
        }
        currentReasoningGroup.push(part as ReasoningMessagePart);
        continue;
      }
      flushReasoning();
      result.push({
        type: "part",
        part,
        index,
        renderKey: getStableKey(part),
      });
    }

    flushReasoning();
    return result;
  }, [parts]);

  // User message
  if (isUser) {
    if (!text) {
      return null;
    }
    return (
      <div className="flex flex-col gap-1">
        <div className="flex min-w-0 justify-end py-2">
          <div className="group relative w-fit min-w-0 max-w-[80%]">
            <div className="rounded-3xl bg-secondary px-4 py-2">
              <p className="whitespace-pre-wrap break-words">{text}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Assistant message
  const hasRenderable = parts.some(hasRenderableAssistantPart);
  if (!hasRenderable) {
    return null;
  }

  const renderGroups = (isToolCallsExpanded: boolean) =>
    groups.map((group) => {
      // REASONING GROUPS — render only if expanded
      if (group.type === "reasoning-group") {
        if (!isToolCallsExpanded) {
          return null;
        }
        return (
          <div
            className="max-w-full pl-[22px]"
            key={`${message.id}-${group.renderKey}`}
          >
            <ThinkingBlock
              isStreaming={shouldKeepCollapsedReasoningStreaming({
                isMessageStreaming,
                hasStreamingReasoningPart: group.parts.some(
                  (part) => (part as { state?: string }).state === "streaming"
                ),
                hasRenderableContentAfterGroup: parts
                  .slice(group.startIndex + group.parts.length)
                  .some(hasRenderableAssistantPart),
              })}
              partCount={group.parts.length}
              text={getReasoningGroupText(group.parts)}
            />
          </div>
        );
      }

      const p = group.part;

      // TEXT PARTS
      if (p.type === "text") {
        const partText = (p as { text: string }).text;
        if (partText.length === 0) {
          return null;
        }

        const isFinalAssistantTextPart = !parts
          .slice(group.index + 1)
          .some((part) => part.type === "text");

        // Collapse: hide non-final text parts
        if (!(isToolCallsExpanded || isFinalAssistantTextPart)) {
          return null;
        }

        const canCopy =
          isFinalAssistantTextPart &&
          !isMessageStreaming &&
          partText.trim().length > 0;

        return (
          <div
            className={cn(
              "flex min-w-0 justify-start py-2",
              isFinalAssistantTextPart && group.index > 0 && "mt-4",
              !isFinalAssistantTextPart && "pl-[22px]"
            )}
            key={`${message.id}-${group.renderKey}`}
          >
            <div className="group w-full min-w-0 overflow-hidden">
              <Streamdown
                animated={
                  isMessageStreaming
                    ? {
                        animation: "fadeIn" as const,
                        duration: 250,
                        easing: "ease-out",
                      }
                    : undefined
                }
                className="flex flex-col gap-2 text-foreground text-sm leading-relaxed"
                components={streamdownComponents}
                isAnimating={isMessageStreaming}
                mode={isMessageStreaming ? "streaming" : "static"}
              >
                {partText}
              </Streamdown>
              {canCopy && (
                <div className="mt-1 flex items-center justify-start opacity-0 transition-opacity group-hover:opacity-100">
                  <CopyButton text={text} />
                </div>
              )}
            </div>
          </div>
        );
      }

      // TOOL CALLS — render only if expanded
      if (isToolUIPart(p)) {
        if (!isToolCallsExpanded) {
          return null;
        }
        return (
          <div
            className="max-w-full pl-[22px]"
            key={`${message.id}-${group.renderKey}`}
          >
            <ToolCall isStreaming={isMessageStreaming} part={p} />
          </div>
        );
      }

      return null;
    });

  return (
    <AssistantMessageGroups
      isStreaming={isMessageStreaming}
      message={message}
      startedAt={startedAt}
    >
      {renderGroups}
    </AssistantMessageGroups>
  );
}

function areEqual(prev: AIChatMessageProps, next: AIChatMessageProps): boolean {
  if (prev.isStreaming !== next.isStreaming) {
    return false;
  }
  if (prev.startedAt !== next.startedAt) {
    return false;
  }
  const a = prev.message;
  const b = next.message;
  if (a.role !== b.role) {
    return false;
  }
  if (textFromMessage(a) !== textFromMessage(b)) {
    return false;
  }
  if (reasoningSignature(a) !== reasoningSignature(b)) {
    return false;
  }
  if (toolPartsSignature(a) !== toolPartsSignature(b)) {
    return false;
  }
  return true;
}

export const AIChatMessage = memo(AIChatMessageComponent, areEqual);
AIChatMessage.displayName = "AIChatMessage";
