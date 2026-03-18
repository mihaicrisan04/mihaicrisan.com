"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import type { ChatStep, Message, MessagePart } from "@/lib/chat-types";
import { streamingChat } from "@/lib/stream-parser";

// Get the Convex URL for HTTP endpoints
function getConvexHttpUrl(): string {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
  // Replace .cloud with .site for HTTP actions
  return convexUrl.replace(".cloud", ".site");
}

interface UseAIChatStreamOptions {
  threadId: string | null;
  onThreadIdChange: (id: string) => void;
}

interface UseAIChatStreamReturn {
  messages: Message[];
  isStreaming: boolean;
  sendMessage: (content: string, isRegenerate?: boolean) => Promise<void>;
  regenerateMessage: (messageId: string) => Promise<void>;
  initializeWithWelcome: (welcomeMessage: string) => void;
  resetMessages: () => void;
}

export function useAIChatStream({
  threadId,
  onThreadIdChange,
}: UseAIChatStreamOptions): UseAIChatStreamReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamingMessageIdRef = useRef<string | null>(null);

  const initializeWithWelcome = useCallback((welcomeMessage: string) => {
    setMessages((prev) => {
      if (prev.length > 0) {
        return prev;
      }
      return [
        {
          id: "welcome",
          role: "assistant",
          content: welcomeMessage,
        },
      ];
    });
  }, []);

  const resetMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const sendMessage = useCallback(
    async (messageContent: string, isRegenerate = false) => {
      if (!messageContent.trim() || isStreaming) {
        return;
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: messageContent.trim(),
      };

      // Only add user message if not regenerating
      if (!isRegenerate) {
        setMessages((prev) => [...prev, userMessage]);
      }

      setIsStreaming(true);

      // Create assistant message placeholder
      const assistantMessageId = (Date.now() + 1).toString();
      streamingMessageIdRef.current = assistantMessageId;

      // Ref to track current reasoning part ID for appending deltas
      let currentReasoningPartId: string | null = null;

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          isStreaming: true,
          parts: [],
          // Legacy fields for backwards compat
          steps: [],
          reasoning: "",
          isReasoningStreaming: false,
        },
      ]);

      const convexUrl = getConvexHttpUrl();

      // Helper to generate unique part IDs
      const generatePartId = () =>
        `part_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      try {
        await streamingChat(convexUrl, messageContent, threadId, {
          onStepStart: (step: ChatStep) => {
            const partId = generatePartId();
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id === assistantMessageId) {
                  const newPart: MessagePart = {
                    type: "tool_call",
                    id: partId,
                    step,
                  };
                  return {
                    ...msg,
                    parts: [...(msg.parts || []), newPart],
                    // Also update legacy steps for backwards compat
                    steps: [...(msg.steps || []), step],
                  };
                }
                return msg;
              })
            );
          },

          onStepComplete: (stepId: string, data: Partial<ChatStep>) => {
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id === assistantMessageId) {
                  return {
                    ...msg,
                    // Update in parts array
                    parts: (msg.parts || []).map((part) => {
                      if (
                        part.type === "tool_call" &&
                        part.step.id === stepId
                      ) {
                        return {
                          ...part,
                          step: { ...part.step, ...data },
                        };
                      }
                      return part;
                    }),
                    // Also update legacy steps
                    steps: (msg.steps || []).map((step) =>
                      step.id === stepId ? { ...step, ...data } : step
                    ),
                  };
                }
                return msg;
              })
            );
          },

          onTextDelta: (content: string) => {
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id === assistantMessageId) {
                  const parts = msg.parts || [];
                  const lastPart = parts.at(-1);

                  // If last part is text, append to it
                  if (lastPart?.type === "text") {
                    return {
                      ...msg,
                      content: msg.content + content,
                      parts: parts.map((part, idx) =>
                        idx === parts.length - 1 && part.type === "text"
                          ? { ...part, content: part.content + content }
                          : part
                      ),
                    };
                  }

                  // Otherwise, create a new text part
                  const newPart: MessagePart = {
                    type: "text",
                    id: generatePartId(),
                    content,
                  };
                  return {
                    ...msg,
                    content: msg.content + content,
                    parts: [...parts, newPart],
                  };
                }
                return msg;
              })
            );
          },

          onReasoningStart: () => {
            const partId = generatePartId();
            currentReasoningPartId = partId;
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id === assistantMessageId) {
                  const newPart: MessagePart = {
                    type: "reasoning",
                    id: partId,
                    content: "",
                    isStreaming: true,
                  };
                  return {
                    ...msg,
                    parts: [...(msg.parts || []), newPart],
                    isReasoningStreaming: true,
                  };
                }
                return msg;
              })
            );
          },

          onReasoningDelta: (content: string) => {
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id === assistantMessageId) {
                  return {
                    ...msg,
                    // Update the current reasoning part in parts array
                    parts: (msg.parts || []).map((part) => {
                      if (
                        part.type === "reasoning" &&
                        part.id === currentReasoningPartId
                      ) {
                        return { ...part, content: part.content + content };
                      }
                      return part;
                    }),
                    // Also update legacy reasoning field
                    reasoning: (msg.reasoning || "") + content,
                  };
                }
                return msg;
              })
            );
          },

          onReasoningDone: () => {
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id === assistantMessageId) {
                  return {
                    ...msg,
                    // Mark reasoning part as complete
                    parts: (msg.parts || []).map((part) => {
                      if (
                        part.type === "reasoning" &&
                        part.id === currentReasoningPartId
                      ) {
                        return { ...part, isStreaming: false };
                      }
                      return part;
                    }),
                    isReasoningStreaming: false,
                  };
                }
                return msg;
              })
            );
            currentReasoningPartId = null;
          },

          onComplete: (newThreadId: string) => {
            if (newThreadId && !threadId) {
              onThreadIdChange(newThreadId);
            }
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id === assistantMessageId) {
                  return { ...msg, isStreaming: false };
                }
                return msg;
              })
            );
            setIsStreaming(false);
            streamingMessageIdRef.current = null;
          },

          onError: (error: string) => {
            console.error("Stream error:", error);
            toast.error("Failed to get a response. Please try again.");
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id === assistantMessageId) {
                  return {
                    ...msg,
                    isStreaming: false,
                    content:
                      msg.content ||
                      "Sorry, something went wrong. Please try again.",
                  };
                }
                return msg;
              })
            );
            setIsStreaming(false);
            streamingMessageIdRef.current = null;
          },
        });
      } catch (error) {
        console.error("Failed to get response:", error);
        toast.error("Failed to get a response. Please try again.");
        setIsStreaming(false);
        streamingMessageIdRef.current = null;
      }
    },
    [isStreaming, threadId, onThreadIdChange]
  );

  const regenerateMessage = useCallback(
    async (messageId: string) => {
      // Find the user message that came before this assistant message
      const messageIndex = messages.findIndex((m) => m.id === messageId);
      if (messageIndex <= 0) {
        return;
      }

      // Find the preceding user message
      let userMessageContent = "";
      for (let i = messageIndex - 1; i >= 0; i--) {
        if (messages[i].role === "user") {
          userMessageContent = messages[i].content;
          break;
        }
      }

      if (!userMessageContent) {
        return;
      }

      // Remove the message from view
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      await sendMessage(userMessageContent, true);
    },
    [messages, sendMessage]
  );

  return {
    messages,
    isStreaming,
    sendMessage,
    regenerateMessage,
    initializeWithWelcome,
    resetMessages,
  };
}
