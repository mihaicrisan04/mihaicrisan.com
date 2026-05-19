"use client";

import { isReasoningUIPart, isToolUIPart } from "ai";
import { type ReactNode, useMemo, useState } from "react";
import type { UIMessage } from "@/lib/chat-types";
import { ToolCallsSummaryBar } from "./tool-calls-summary-bar";

function messageHasCollapsibleContent(message: UIMessage): boolean {
  return message.parts.some((p) => isToolUIPart(p) || isReasoningUIPart(p));
}

function countToolCalls(message: UIMessage): number {
  let count = 0;
  for (const part of message.parts) {
    if (isToolUIPart(part)) {
      count++;
    }
  }
  return count;
}

export interface AssistantMessageGroupsProps {
  message: UIMessage;
  isStreaming: boolean;
  startedAt: string | null;
  children: (isExpanded: boolean) => ReactNode;
}

export function AssistantMessageGroups({
  message,
  isStreaming,
  startedAt,
  children,
}: AssistantMessageGroupsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasCollapsible = useMemo(
    () => messageHasCollapsibleContent(message),
    [message]
  );

  const toolCallCount = useMemo(() => countToolCalls(message), [message]);

  if (!hasCollapsible) {
    return <>{children(true)}</>;
  }

  return (
    <>
      <ToolCallsSummaryBar
        isExpanded={isExpanded}
        isStreaming={isStreaming}
        onToggle={() => setIsExpanded((v) => !v)}
        startedAt={startedAt}
        statusWordSeed={message.id}
        toolCallCount={toolCallCount}
      />
      <div className="space-y-1">{children(isExpanded)}</div>
    </>
  );
}
