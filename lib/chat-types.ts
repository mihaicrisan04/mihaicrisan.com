import {
  type UIMessage as AIUIMessage,
  isReasoningUIPart,
  isToolUIPart,
} from "ai";

// Re-export the AI SDK UIMessage type directly.
// Convex Agent's useUIMessages returns messages in this format, augmented
// with a per-message status ("streaming" while deltas are still arriving).
export type UIMessage = AIUIMessage & {
  _creationTime?: number;
  status?: "streaming" | "pending" | "success" | "failed";
};

// Individual message part — a union member of UIMessage["parts"]
export type MessagePart = UIMessage["parts"][number];

// Whether an assistant message part produces visible UI (used both for the
// "thinking…" indicator and for skipping empty assistant messages).
export function hasRenderableAssistantPart(part: MessagePart): boolean {
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
