"use client";

import type { RefObject } from "react";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "@/components/ui/shadcn-io/ai/prompt-input";

export interface AIChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isStreaming: boolean;
  inputRef?: RefObject<HTMLTextAreaElement | null>;
  placeholder?: string;
}

export function AIChatInput({
  value,
  onChange,
  onSubmit,
  isStreaming,
  inputRef,
  placeholder = "Ask Zuzu anything...",
}: AIChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputTextarea
        disabled={isStreaming}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.currentTarget.value)
        }
        placeholder={placeholder}
        ref={inputRef}
        value={value}
      />
      <PromptInputToolbar>
        <div className="flex-1" />
        <PromptInputSubmit
          disabled={!value.trim() || isStreaming}
          status={isStreaming ? "streaming" : "ready"}
        />
      </PromptInputToolbar>
    </PromptInput>
  );
}
