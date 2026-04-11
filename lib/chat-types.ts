// UIMessage part from @convex-dev/agent
export interface MessagePart {
  type?: string;
  text?: string;
  state?: string;
  toolName?: string;
  toolCallId?: string;
  input?: Record<string, unknown>;
  output?: unknown;
  errorText?: string;
}

// UIMessage from @convex-dev/agent
export interface UIMessage {
  id?: string;
  key?: string;
  role?: string;
  status?: string;
  parts?: MessagePart[];
  _creationTime?: number;
}
