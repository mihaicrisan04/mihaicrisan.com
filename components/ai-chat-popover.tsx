'use client';

import { useAIChat } from '@/contexts/ai-chat-context';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, RefreshCw, Check } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MarqueeFade, Marquee, MarqueeContent, MarqueeItem } from '@/components/ui/shadcn-io/marquee';
import { Response } from '@/components/ui/shadcn-io/ai/response';
import { Actions, Action } from '@/components/ui/shadcn-io/ai/actions';
import { Suggestion } from '@/components/ui/shadcn-io/ai/suggestion';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputSubmit,
} from '@/components/ui/shadcn-io/ai/prompt-input';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { TextShimmer } from '@/components/motion-primitives/text-shimmer';

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.15 }}
      transition={{
        opacity: { delay: 0.05, duration: 0.15, ease: [0.4, 0, 0.2, 1] },
        scale: { type: 'spring', stiffness: 700, damping: 15 }
      }}
      onClick={onClick}
      className="absolute top-4 right-4 z-30 flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground/90 transition-colors bg-muted/20 hover:text-foreground hover:bg-muted/50 border border-border/20 hover:border-border"
      aria-label="Close chat"
    >
      <X className="h-4 w-4" />
    </motion.button>
  );
}

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
};

const WELCOME_MESSAGE = `Hi! I'm Mihai's portfolio assistant. I can help you learn more about his work and experience. Feel free to ask me about:

- His technical skills and expertise
- Projects he's worked on
- His professional experience
- How to get in touch`;

const SUGGESTIONS = [
  'What technologies does Mihai work with?',
  'Tell me about his recent projects',
  'What is his background?',
  'How can I get in touch?',
  'What makes him different?',
  'Show me his skills',
];

function useStreamingSimulation() {
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startStreaming = useCallback((text: string, onComplete: () => void) => {
    setIsStreaming(true);
    setStreamingContent('');

    const tokens = text.split(/(\s+|\n)/);
    let index = 0;

    const streamToken = () => {
      if (index < tokens.length) {
        setStreamingContent(prev => prev + tokens[index]);
        index++;
        timeoutRef.current = setTimeout(streamToken, 20);
      } else {
        setIsStreaming(false);
        onComplete();
      }
    };

    // Use setTimeout for the first token to avoid React batching with the empty string reset
    timeoutRef.current = setTimeout(streamToken, 20);
  }, []);

  const stopStreaming = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsStreaming(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { streamingContent, isStreaming, startStreaming, stopStreaming };
}

export function AIChatPopover() {
  const { isOpen, close, threadId, setThreadId } = useAIChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { streamingContent, isStreaming, startStreaming } = useStreamingSimulation();
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [regeneratingMessageId, setRegeneratingMessageId] = useState<string | null>(null);

  const chat = useAction(api.chat.chat);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        role: 'assistant',
        content: WELCOME_MESSAGE,
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timeoutId = setTimeout(() => {
        const input = inputRef.current;
        if (input) {
          input.focus();
          const length = input.value.length;
          input.setSelectionRange(length, length);
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, close]);

  const sendMessage = async (messageContent: string, isRegenerate = false) => {
    if (!messageContent.trim() || isStreaming || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent.trim(),
    };

    // Only add user message if not regenerating
    if (!isRegenerate) {
      setMessages(prev => [...prev, userMessage]);
    }

    setIsLoading(true);

    try {
      // Call the agent
      const result = await chat({
        threadId: threadId || undefined,
        message: messageContent,
      });

      // Store thread ID for future messages
      if (result.threadId && !threadId) {
        setThreadId(result.threadId);
      }

      // Now add streaming message and start streaming
      const streamingMessageId = (Date.now() + 1).toString();
      
      // Add new streaming message
      setMessages(prev => [...prev, {
        id: streamingMessageId,
        role: 'assistant',
        content: '',
        isStreaming: true,
      }]);

      // Simulate streaming for the response
      startStreaming(result.text, () => {
        setMessages(prev => prev.map(msg =>
          msg.isStreaming
            ? { ...msg, content: result.text, isStreaming: false }
            : msg
        ));
      });
    } catch (error) {
      console.error('Failed to get response:', error);
      toast.error('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
      setRegeneratingMessageId(null);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageContent = input.trim();
    setInput('');
    await sendMessage(messageContent);
  };

  const handleRegenerate = async (messageId: string) => {
    // Find the user message that came before this assistant message
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex <= 0) return;

    // Find the preceding user message
    let userMessageContent = '';
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        userMessageContent = messages[i].content;
        break;
      }
    }

    if (!userMessageContent) return;

    // Immediately remove the message from view
    setMessages(prev => prev.filter(m => m.id !== messageId));
    setRegeneratingMessageId(messageId);
    await sendMessage(userMessageContent, true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleCopy = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    toast.success('Copied to clipboard');
    
    // Reset after 2 seconds
    setTimeout(() => {
      setCopiedMessageId(null);
    }, 2000);
  };

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ backdropFilter: 'blur(0px)' }}
            animate={{ backdropFilter: 'blur(18px)' }}
            exit={{ backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 bg-background/60"
            onClick={close}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 flex flex-col h-full w-full max-w-2xl mx-auto"
          >
            <CloseButton onClick={close} />

            <MarqueeFade
              side="top"
              className="h-15 bg-gradient-to-t from-background to-transparent"
            />

            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 8 }}
              transition={{ delay: 0.05, duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative flex-1 overflow-hidden mt-15"
            >
              <div ref={scrollRef} className="absolute inset-0">
                <ScrollArea className="h-full relative">
                  <MarqueeFade side="top" className="h-14" />

                  <div className="px-4 pt-6 pb-6">
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.1 + index * 0.02,
                          duration: 0.2,
                          ease: [0.25, 0.1, 0.25, 1]
                        }}
                        className={`mb-6 flex gap-3 ${
                          message.role === 'user' ? 'justify-end' : ''
                        }`}
                      >
                        <div
                          className={`flex-1 ${
                            message.role === 'user' ? 'max-w-[75%]' : ''
                          }`}
                        >
                          {message.role === 'user' ? (
                            <div className="rounded-xl bg-muted px-4 py-3">
                              <p className="text-sm text-foreground">
                                {message.content}
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="prose prose-sm dark:prose-invert max-w-none">
                                <Response className="text-sm text-muted-foreground">
                                  {message.isStreaming ? streamingContent : message.content}
                                </Response>
                              </div>
                              {!message.isStreaming && message.content && (
                                <Actions>
                                  <Action
                                    tooltip={copiedMessageId === message.id ? "Copied!" : "Copy"}
                                    onClick={() => handleCopy(message.id, message.content)}
                                  >
                                    <AnimatePresence mode="wait" initial={false}>
                                      {copiedMessageId === message.id ? (
                                        <motion.div
                                          key="check"
                                          initial={{ opacity: 0, scale: 0.5 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          exit={{ opacity: 0, scale: 0.5 }}
                                          transition={{ duration: 0.15 }}
                                        >
                                          <Check className="h-4 w-4 text-green-500" />
                                        </motion.div>
                                      ) : (
                                        <motion.div
                                          key="copy"
                                          initial={{ opacity: 0, scale: 0.5 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          exit={{ opacity: 0, scale: 0.5 }}
                                          transition={{ duration: 0.15 }}
                                        >
                                          <Copy className="h-4 w-4" />
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </Action>
                                  <Action 
                                    tooltip="Regenerate"
                                    onClick={() => handleRegenerate(message.id)}
                                  >
                                    <motion.div
                                      animate={{ 
                                        rotate: regeneratingMessageId === message.id ? 360 : 0 
                                      }}
                                      transition={{ 
                                        duration: 1,
                                        repeat: regeneratingMessageId === message.id ? Infinity : 0,
                                        ease: "linear"
                                      }}
                                    >
                                      <RefreshCw className="h-4 w-4" />
                                    </motion.div>
                                  </Action>
                                </Actions>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Loading indicator - Thinking shimmer */}
                    {isLoading && !isStreaming && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-6"
                      >
                        <TextShimmer 
                          className="text-sm font-medium"
                          duration={1.5}
                        >
                          Thinking...
                        </TextShimmer>
                      </motion.div>
                    )}
                  </div>

                  <MarqueeFade side="bottom" className="h-14" />
                </ScrollArea>
              </div>
            </motion.div>

            <MarqueeFade
              side="bottom"
              className="h-25 bg-gradient-to-b from-background to-transparent"
            />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ delay: 0.1, duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative z-20 px-4 pb-4"
            >
              <PromptInput onSubmit={handleSendMessage}>
                <PromptInputTextarea
                  ref={inputRef}
                  value={input}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.currentTarget.value)}
                  placeholder="Ask about Mihai's work..."
                  disabled={isStreaming || isLoading}
                />
                <PromptInputToolbar>
                  <div className="relative flex-1 overflow-hidden">
                    <Marquee>
                      <MarqueeFade side="left" className="w-8" />
                      <MarqueeContent speed={20}>
                        {SUGGESTIONS.map((suggestion) => (
                          <MarqueeItem key={suggestion}>
                            <Suggestion
                              suggestion={suggestion}
                              onClick={handleSuggestionClick}
                            />
                          </MarqueeItem>
                        ))}
                      </MarqueeContent>
                      <MarqueeFade side="right" className="w-8" />
                    </Marquee>
                  </div>
                  <PromptInputSubmit
                    disabled={!input.trim() || isStreaming || isLoading}
                    status={isStreaming || isLoading ? 'streaming' : 'ready'}
                  />
                </PromptInputToolbar>
              </PromptInput>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
