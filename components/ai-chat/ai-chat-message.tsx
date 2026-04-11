"use client";

import { useSmoothText } from "@convex-dev/agent/react";
import { memo, useEffect, useState } from "react";
import type { MessagePart, UIMessage } from "@/lib/chat-types";
import { ToolStepFromPart } from "./ai-chat-tool-steps";
import { Markdown } from "./markdown";
import { MessageActionsBar } from "./message-actions";
import { Thinking } from "./thinking";
import { extractToolName } from "./tool-labels";

function textFromMessage(msg: UIMessage): string {
  return (
    msg.parts
      ?.filter((p) => p.type === "text")
      .map((p) => p.text ?? "")
      .join("") ?? ""
  );
}

function reasoningSignature(msg: UIMessage): string {
  if (!msg.parts) {
    return "";
  }
  return msg.parts
    .filter((p) => p.type === "reasoning")
    .map((p) => `${p.state ?? ""}|${(p.text ?? "").length}`)
    .join("||");
}

function toolPartsSignature(msg: UIMessage): string {
  if (!msg.parts) {
    return "";
  }
  return msg.parts
    .filter((p) => extractToolName(p) !== null)
    .map((p) => {
      const name = extractToolName(p) ?? "";
      const id = p.toolCallId ?? "";
      const state = p.state ?? "";
      const input = p.input ? JSON.stringify(p.input) : "";
      const output = p.output !== undefined ? JSON.stringify(p.output) : "";
      return `${id}|${name}|${state}|${input}|${output}`;
    })
    .join("||");
}

function ReasoningPart({
  text,
  isStreaming,
}: {
  text: string;
  isStreaming: boolean;
}) {
  // startStreaming: true for reasoning — animate from empty so the thinking
  // block appears immediately with the spinner before text arrives.
  // Reasoning parts don't suffer from the streaming→paginated double-render
  // issue since they're finalized before text parts begin.
  const [revealed] = useSmoothText(text, {
    startStreaming: isStreaming,
    charsPerSec: 600,
  });
  return (
    <div className="py-0.5">
      <Thinking isStreaming={isStreaming} text={revealed} />
    </div>
  );
}

function TextPart({ text }: { text: string }) {
  const [revealed] = useSmoothText(text, { charsPerSec: 600 });
  return (
    <div className="text-foreground text-sm leading-relaxed">
      <Markdown>{revealed}</Markdown>
    </div>
  );
}

function ToolPart({ part }: { part: MessagePart }) {
  return (
    <div className="py-0.5">
      <ToolStepFromPart part={part} />
    </div>
  );
}

/**
 * Reveals array items one at a time with a delay between each.
 * On mount: shows first item, then reveals subsequent ones sequentially.
 * For historical messages (isActive=false): shows all immediately.
 */
function useSequentialReveal<T>(items: T[], isActive: boolean, delayMs = 600): T[] {
  const [count, setCount] = useState(
    isActive ? Math.min(1, items.length) : items.length,
  );

  useEffect(() => {
    if (count >= items.length) {
      return;
    }
    const timer = setTimeout(() => {
      setCount((c) => c + 1);
    }, delayMs);
    return () => clearTimeout(timer);
  }, [count, items.length, delayMs]);

  return items.slice(0, count);
}

function AssistantParts({
  parts,
  isActive,
}: {
  parts: MessagePart[];
  isActive: boolean;
}) {
  // Filter to renderable parts first
  const renderableParts = parts.filter((p) => {
    if (p.type === "reasoning") {
      return (p.text ?? "").length > 0 || p.state === "streaming";
    }
    if (p.type === "text") {
      return (p.text ?? "").trim().length > 0;
    }
    return extractToolName(p) !== null;
  });

  // Reveal parts sequentially during streaming
  const visibleParts = useSequentialReveal(renderableParts, isActive);

  return (
    <>
      {visibleParts.map((part, index) => {
        if (part.type === "reasoning") {
          return (
            <ReasoningPart
              isStreaming={part.state === "streaming"}
              key={`reasoning-${index}`}
              text={part.text ?? ""}
            />
          );
        }

        if (part.type === "text") {
          return <TextPart key={`text-${index}`} text={part.text ?? ""} />;
        }

        return (
          <ToolPart key={`tool-${part.toolCallId ?? index}`} part={part} />
        );
      })}
    </>
  );
}

export interface AIChatMessageProps {
  message: UIMessage;
  forceActionsVisible?: boolean;
}

function AIChatMessageComponent({
  message,
  forceActionsVisible,
}: AIChatMessageProps) {
  const isUser = message.role === "user";
  const text = textFromMessage(message);
  const timestamp = message._creationTime;

  if (isUser) {
    if (!text) {
      return null;
    }
    return (
      <div className="group flex flex-col items-end gap-1">
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground text-sm leading-relaxed">
          {text}
        </div>
        <MessageActionsBar
          align="end"
          forceVisible={forceActionsVisible}
          text={text}
          timestamp={timestamp}
        />
      </div>
    );
  }

  const parts = message.parts ?? [];
  const hasRenderable = parts.some(
    (p) =>
      (p.type === "text" && (p.text ?? "").trim()) ||
      p.type === "reasoning" ||
      extractToolName(p) !== null
  );
  if (!hasRenderable) {
    return null;
  }

  return (
    <div className="group flex flex-col items-start gap-1">
      <div className="w-full space-y-1">
        <AssistantParts
          isActive={message.status === "streaming"}
          parts={parts}
        />
      </div>
      {text ? (
        <MessageActionsBar
          align="start"
          forceVisible={forceActionsVisible}
          text={text}
          timestamp={timestamp}
        />
      ) : null}
    </div>
  );
}

function areEqual(prev: AIChatMessageProps, next: AIChatMessageProps): boolean {
  if (prev.forceActionsVisible !== next.forceActionsVisible) {
    return false;
  }
  const a = prev.message;
  const b = next.message;
  if ((a.role ?? "") !== (b.role ?? "")) {
    return false;
  }
  if ((a.status ?? "") !== (b.status ?? "")) {
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
  if ((a._creationTime ?? 0) !== (b._creationTime ?? 0)) {
    return false;
  }
  return true;
}

export const AIChatMessage = memo(AIChatMessageComponent, areEqual);
AIChatMessage.displayName = "AIChatMessage";
