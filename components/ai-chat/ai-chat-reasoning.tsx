"use client";

import { Brain, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtItem,
  ChainOfThoughtStep,
  ChainOfThoughtTrigger,
} from "@/components/ui/chain-of-thought";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ui/reasoning";

interface ReasoningDisplayProps {
  reasoning: string;
  isStreaming: boolean;
}

// Regex patterns at top level for performance
const NUMBERED_PATTERN = /(?:^|\n)(?:\d+\.|Step \d+:|\*\*\d+\.\*\*)/;
const PARAGRAPH_SPLIT = /\n\n+/;
const LINE_SPLIT = /\n/;

// Generate a simple hash from string for stable keys
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash + str.charCodeAt(i) * (i + 1)) % 1_000_000;
  }
  return `step-${hash}`;
}

// Parse reasoning content into individual thought steps
function parseReasoningIntoSteps(reasoning: string): string[] {
  if (!reasoning.trim()) {
    return [];
  }

  // First try to split by numbered patterns like "1.", "2.", etc. or "Step 1:", etc.
  if (NUMBERED_PATTERN.test(reasoning)) {
    const steps = reasoning
      .split(NUMBERED_PATTERN)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (steps.length > 1) {
      return steps;
    }
  }

  // Otherwise split by double newlines (paragraphs)
  const paragraphs = reasoning
    .split(PARAGRAPH_SPLIT)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (paragraphs.length > 1) {
    return paragraphs;
  }

  // If still single block, try splitting by single newlines for shorter chunks
  const lines = reasoning
    .split(LINE_SPLIT)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (lines.length > 1) {
    // Group short lines together (less than 150 chars)
    const grouped: string[] = [];
    let current = "";
    for (const line of lines) {
      if (current.length + line.length < 150) {
        current = current ? `${current}\n${line}` : line;
      } else {
        if (current) {
          grouped.push(current);
        }
        current = line;
      }
    }
    if (current) {
      grouped.push(current);
    }
    return grouped;
  }

  // Return as single step
  return [reasoning.trim()];
}

// Get a label for a thought step based on its position and content
function getStepLabel(step: string, index: number, isLast: boolean): string {
  const lowerStep = step.toLowerCase();

  // Detect intent from content keywords
  if (
    lowerStep.includes("understand") ||
    lowerStep.includes("question") ||
    lowerStep.includes("asking")
  ) {
    return "Understanding the question";
  }
  if (
    lowerStep.includes("search") ||
    lowerStep.includes("look") ||
    lowerStep.includes("find")
  ) {
    return "Searching for information";
  }
  if (
    lowerStep.includes("found") ||
    lowerStep.includes("result") ||
    lowerStep.includes("retrieved")
  ) {
    return "Analyzing results";
  }
  if (
    lowerStep.includes("answer") ||
    lowerStep.includes("response") ||
    lowerStep.includes("conclude")
  ) {
    return "Forming response";
  }
  if (
    lowerStep.includes("consider") ||
    lowerStep.includes("think") ||
    lowerStep.includes("analyze")
  ) {
    return "Considering options";
  }

  // Default labels based on position
  if (index === 0) {
    return "Initial thoughts";
  }
  if (isLast) {
    return "Final analysis";
  }
  return `Thought ${index + 1}`;
}

// Format duration in seconds
function formatDuration(ms: number): string {
  const seconds = Math.round(ms / 1000);
  if (seconds < 1) {
    return "less than a second";
  }
  if (seconds === 1) {
    return "1 second";
  }
  return `${seconds} seconds`;
}

export function ReasoningDisplay({
  reasoning,
  isStreaming,
}: ReasoningDisplayProps) {
  const steps = useMemo(() => parseReasoningIntoSteps(reasoning), [reasoning]);
  const contentRef = useRef<HTMLDivElement>(null);

  // Track timing
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  // Track open/closed state - open while streaming, close when done
  const [isOpen, setIsOpen] = useState(true);

  // Start timer when streaming begins
  useEffect(() => {
    if (isStreaming && startTime === null) {
      setStartTime(Date.now());
      setIsOpen(true);
    }
  }, [isStreaming, startTime]);

  // Calculate duration and collapse when streaming ends
  useEffect(() => {
    if (!isStreaming && startTime !== null && duration === null) {
      const elapsed = Date.now() - startTime;
      setDuration(elapsed);
      // Collapse after a brief delay to let user see the final state
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isStreaming, startTime, duration]);

  // Auto-scroll to show new content as it streams
  useEffect(() => {
    if (isStreaming && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [isStreaming]);

  // Don't render if no content and not streaming
  if (!(reasoning || isStreaming)) {
    return null;
  }

  // Determine trigger content
  const triggerContent = isStreaming ? (
    <TextShimmer className="text-sm" duration={1.5}>
      Thinking...
    </TextShimmer>
  ) : (
    <span className="flex items-center gap-2 text-sm">
      <Brain className="size-4" />
      {duration !== null
        ? `Thought for ${formatDuration(duration)}`
        : "Thought process"}
    </span>
  );

  // Determine what to render inside ReasoningContent
  let content: React.ReactNode;
  if (steps.length > 0) {
    content = (
      <ChainOfThought className="py-2">
        {steps.map((step, index) => {
          const isLastStep = index === steps.length - 1;
          const label = getStepLabel(step, index, isLastStep);
          const stepKey = hashString(step);

          return (
            <ChainOfThoughtStep
              defaultOpen={isLastStep && isStreaming}
              key={stepKey}
            >
              <ChainOfThoughtTrigger
                leftIcon={<Sparkles className="size-3" />}
                swapIconOnHover={!isStreaming}
              >
                {label}
              </ChainOfThoughtTrigger>
              <ChainOfThoughtContent>
                <ChainOfThoughtItem>
                  <p className="whitespace-pre-wrap text-muted-foreground text-xs leading-relaxed">
                    {step}
                  </p>
                </ChainOfThoughtItem>
              </ChainOfThoughtContent>
            </ChainOfThoughtStep>
          );
        })}
      </ChainOfThought>
    );
  } else if (isStreaming) {
    // Show shimmer while waiting for first reasoning content
    content = (
      <div className="py-2">
        <TextShimmer className="text-muted-foreground text-xs" duration={1.5}>
          Processing thoughts...
        </TextShimmer>
      </div>
    );
  } else {
    content = null;
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="mb-3"
      initial={{ opacity: 0, y: 4 }}
      ref={contentRef}
      transition={{ duration: 0.2 }}
    >
      <Reasoning
        isStreaming={isStreaming}
        onOpenChange={setIsOpen}
        open={isOpen}
      >
        <ReasoningTrigger className="text-sm">
          {triggerContent}
        </ReasoningTrigger>
        <ReasoningContent
          className="ml-2 border-l-2 border-l-primary/20 pl-3"
          contentClassName="prose-sm"
        >
          {content}
        </ReasoningContent>
      </Reasoning>
    </motion.div>
  );
}
