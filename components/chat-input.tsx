"use client";

import { Send } from "lucide-react";
import { type KeyboardEvent, useState } from "react";

export function ChatInput() {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Handle message send
      console.log("Send message:", input);
      setInput("");
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      console.log("Send message:", input);
      setInput("");
    }
  };

  return (
    <div className="relative w-full px-4 pb-4">
      <div className="w-full overflow-hidden rounded-2xl border border-border/50 bg-muted/50 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="relative flex-1">
            <span
              className="pointer-events-none absolute left-0 select-none text-muted-foreground/60 text-sm transition-opacity duration-200"
              style={{
                opacity: input ? 0 : 1,
              }}
            >
              Ask BA Bot
            </span>
            <input
              className="w-full bg-transparent text-foreground text-sm outline-none"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              type="text"
              value={input}
            />
          </div>
          <button
            aria-label="Send message"
            className="rounded-md p-1.5 text-muted-foreground/60 transition-colors hover:bg-muted/80 hover:text-foreground"
            onClick={handleSend}
            type="button"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Optional: Clear button row below */}
      <div className="mt-2 px-1">
        <button
          className="flex items-center gap-1.5 text-muted-foreground/50 text-xs transition-colors hover:text-muted-foreground"
          onClick={() => setInput("")}
          type="button"
        >
          <span className="text-[10px]">🗑</span>
          Clear
        </button>
      </div>
    </div>
  );
}
