"use client";

import type { RefObject } from "react";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "@/components/ui/shadcn-io/ai/prompt-input";
import { Suggestion } from "@/components/ui/shadcn-io/ai/suggestion";
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/ui/shadcn-io/marquee";

interface SuggestionsCarouselProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

function SuggestionsCarousel({
  suggestions,
  onSuggestionClick,
}: SuggestionsCarouselProps) {
  return (
    <div className="relative flex-1 overflow-hidden">
      <Marquee>
        <MarqueeFade className="w-8" side="left" />
        <MarqueeContent speed={20}>
          {suggestions.map((suggestion) => (
            <MarqueeItem key={suggestion}>
              <Suggestion onClick={onSuggestionClick} suggestion={suggestion} />
            </MarqueeItem>
          ))}
        </MarqueeContent>
        <MarqueeFade className="w-8" side="right" />
      </Marquee>
    </div>
  );
}

export interface AIChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSuggestionClick: (suggestion: string) => void;
  isStreaming: boolean;
  suggestions: string[];
  inputRef?: RefObject<HTMLTextAreaElement | null>;
}

export function AIChatInput({
  value,
  onChange,
  onSubmit,
  onSuggestionClick,
  isStreaming,
  suggestions,
  inputRef,
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
        placeholder="Ask about Mihai's work..."
        ref={inputRef}
        value={value}
      />
      <PromptInputToolbar>
        <SuggestionsCarousel
          onSuggestionClick={onSuggestionClick}
          suggestions={suggestions}
        />
        <PromptInputSubmit
          disabled={!value.trim() || isStreaming}
          status={isStreaming ? "streaming" : "ready"}
        />
      </PromptInputToolbar>
    </PromptInput>
  );
}
