export interface ChatStep {
  id: string;
  toolCallId?: string;
  type: "portfolio_search" | "tool_call";
  status: "loading" | "complete";
  // Tool call info
  name?: string;
  args?: Record<string, unknown>;
  result?: string;
  // Portfolio search specific (extracted from args/result)
  query?: string;
  resultsCount?: number;
}

// A single part of a message, preserving chronological order
export type MessagePart =
  | { type: "reasoning"; id: string; content: string; isStreaming?: boolean }
  | { type: "tool_call"; id: string; step: ChatStep }
  | { type: "text"; id: string; content: string };

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  // Ordered chronological parts (reasoning, tool calls, text in sequence)
  parts?: MessagePart[];
  // Legacy fields for backwards compatibility
  steps?: ChatStep[];
  reasoning?: string;
  isReasoningStreaming?: boolean;
}
