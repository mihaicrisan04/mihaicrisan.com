'use client';

import { motion } from 'motion/react';
import { Send } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';

export function ChatInput() {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Handle message send
      console.log('Send message:', input);
      setInput('');
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      console.log('Send message:', input);
      setInput('');
    }
  };

  return (
    <div className="relative w-full px-4 pb-4">
      <div className="w-full border border-border/50 bg-muted/50 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="flex-1 relative">
            <span
              className="absolute left-0 text-sm text-muted-foreground/60 select-none pointer-events-none transition-opacity duration-200"
              style={{
                opacity: input ? 0 : 1,
              }}
            >
              Ask BA Bot
            </span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-sm outline-none text-foreground"
            />
          </div>
          <button
            type="button"
            className="text-muted-foreground/60 hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted/80"
            onClick={handleSend}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Optional: Clear button row below */}
      <div className="mt-2 px-1">
        <button
          type="button"
          className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors flex items-center gap-1.5"
          onClick={() => setInput('')}
        >
          <span className="text-[10px]">🗑</span>
          Clear
        </button>
      </div>
    </div>
  );
}