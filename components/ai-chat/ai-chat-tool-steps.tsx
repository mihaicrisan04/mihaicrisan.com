"use client";

import { Clock, Loader2, Search, Wrench } from "lucide-react";
import { motion } from "motion/react";
import {
  Steps,
  StepsContent,
  StepsItem,
  StepsTrigger,
} from "@/components/ui/steps";
import type { ChatStep } from "@/lib/chat-types";

// Dynamic message pools for different tool states
const PORTFOLIO_SEARCH_LOADING = [
  "Searching portfolio...",
  "Looking through Mihai's work...",
  "Digging into the portfolio...",
  "Scanning relevant projects...",
  "Finding information...",
  "Exploring the knowledge base...",
];

const PORTFOLIO_SEARCH_COMPLETE = [
  "Found relevant info",
  "Search complete",
  "Got the details",
  "Found what I needed",
  "Retrieved results",
];

const TIME_LOADING = [
  "Checking the time...",
  "Fetching current time...",
  "Looking at the clock...",
  "Getting time info...",
];

const TIME_COMPLETE = [
  "Got the time",
  "Time retrieved",
  "Clock checked",
  "Time fetched",
];

const GENERIC_LOADING = [
  "Working on it...",
  "Processing...",
  "Running tool...",
  "Executing...",
];

const GENERIC_COMPLETE = ["Done", "Complete", "Finished", "Tool executed"];

// Use step ID to pick a consistent message (won't change on re-render)
function getMessageFromPool(pool: string[], stepId: string): string {
  // Simple hash: sum of character codes multiplied by position
  let hash = 0;
  for (let i = 0; i < stepId.length; i++) {
    hash += stepId.charCodeAt(i) * (i + 1);
  }
  const index = Math.abs(hash) % pool.length;
  return pool[index];
}

function getStepIcon(step: ChatStep) {
  if (step.status === "loading") {
    return <Loader2 className="size-4 animate-spin" />;
  }

  if (step.type === "portfolio_search") {
    return <Search className="size-4" />;
  }

  switch (step.name) {
    case "getCurrentTime":
      return <Clock className="size-4" />;
    default:
      return <Wrench className="size-4" />;
  }
}

function getStepLabel(step: ChatStep): string {
  if (step.type === "portfolio_search") {
    if (step.status === "loading") {
      // Show query if available
      if (step.query) {
        return `Searching: "${step.query}"`;
      }
      return getMessageFromPool(PORTFOLIO_SEARCH_LOADING, step.id);
    }
    const count = step.resultsCount ?? 0;
    if (step.query) {
      return `Found ${count} result${count !== 1 ? "s" : ""} for "${step.query}"`;
    }
    const baseMessage = getMessageFromPool(PORTFOLIO_SEARCH_COMPLETE, step.id);
    return `${baseMessage} (${count} result${count !== 1 ? "s" : ""})`;
  }

  if (step.status === "loading") {
    switch (step.name) {
      case "getCurrentTime":
        return getMessageFromPool(TIME_LOADING, step.id);
      default:
        return getMessageFromPool(GENERIC_LOADING, step.id);
    }
  }

  switch (step.name) {
    case "getCurrentTime":
      return getMessageFromPool(TIME_COMPLETE, step.id);
    default:
      return getMessageFromPool(GENERIC_COMPLETE, step.id);
  }
}

function renderStepContent(step: ChatStep) {
  if (step.status === "loading") {
    // Show searching state with query
    if (step.type === "portfolio_search" && step.query) {
      return (
        <span className="text-muted-foreground italic">
          Looking for information about &quot;{step.query}&quot;...
        </span>
      );
    }
    return null;
  }

  if (step.type === "portfolio_search") {
    const count = step.resultsCount ?? 0;
    if (count > 0) {
      return (
        <span>
          Retrieved {count} relevant document{count !== 1 ? "s" : ""} from the
          portfolio knowledge base
        </span>
      );
    }
    return (
      <span>
        No specific information found, responding with general knowledge
      </span>
    );
  }

  // For other tools, show result if available
  if (step.result && step.name !== "searchPortfolio") {
    return (
      <code className="break-all rounded bg-muted px-1.5 py-0.5 text-xs">
        {step.result}
      </code>
    );
  }

  return null;
}

interface ToolStepItemProps {
  step: ChatStep;
}

function ToolStepItem({ step }: ToolStepItemProps) {
  const content = renderStepContent(step);
  // Open by default when loading (to show query) or complete (to show results)
  const shouldBeOpen = step.status === "loading" || step.status === "complete";

  return (
    <Steps defaultOpen={shouldBeOpen}>
      <StepsTrigger
        leftIcon={getStepIcon(step)}
        swapIconOnHover={step.status === "complete"}
      >
        {getStepLabel(step)}
      </StepsTrigger>
      {content && (
        <StepsContent>
          <StepsItem>{content}</StepsItem>
        </StepsContent>
      )}
    </Steps>
  );
}

interface ToolStepsProps {
  steps: ChatStep[];
}

export function ToolSteps({ steps }: ToolStepsProps) {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="mb-3 space-y-2"
      initial={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.2 }}
    >
      {steps.map((step) => (
        <ToolStepItem key={step.id} step={step} />
      ))}
    </motion.div>
  );
}
