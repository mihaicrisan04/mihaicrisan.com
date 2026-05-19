import type { UIMessage as AIUIMessage } from "ai";

// Re-export the AI SDK UIMessage type directly.
// Convex Agent's useUIMessages returns messages in this format.
export type UIMessage = AIUIMessage & {
  _creationTime?: number;
};

// Individual message part — a union member of UIMessage["parts"]
export type MessagePart = UIMessage["parts"][number];
