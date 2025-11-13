'use client';

import { useAIChat } from '@/contexts/ai-chat-context';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';
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

const MOCK_RESPONSES = [
  "Hi! I'm here to help you learn more about Mihai's work and experience. You can ask me about:\n\n- His technical skills and expertise\n- Projects he's worked on\n- His professional experience\n- How to get in touch",
  
  "Mihai is a full-stack developer with expertise in:\n\n**Frontend:** React, Next.js, TypeScript, Tailwind CSS, Framer Motion\n\n**Backend:** Node.js, Python, REST APIs, GraphQL\n\n**Tools:** Git, Docker, CI/CD pipelines\n\nHe's passionate about creating performant, accessible web experiences with clean architecture and delightful user interactions.",
  
  "Sure! Mihai has worked on several interesting projects:\n\n**Personal Portfolio** - The site you're on right now! Built with Next.js 15, featuring:\n- Advanced animations with Framer Motion\n- Custom morphing UI components\n- Responsive design with Tailwind CSS\n- AI-powered chat interface (that's me!)\n\n**E-commerce Platform** - A full-stack application with:\n- Real-time inventory management\n- Secure payment processing\n- Admin dashboard with analytics\n\nWould you like to know more about any specific project?",
  
  "The SaaS Dashboard was a particularly challenging and rewarding project. Here are the key highlights:\n\n**Tech Stack:**\n- Frontend: React with TypeScript, Redux for state management\n- Backend: Node.js with Express, PostgreSQL database\n- Infrastructure: AWS (EC2, S3, RDS), Docker containers\n\n**Key Features:**\n- Multi-tenant architecture supporting 100+ organizations\n- Custom chart library for interactive data visualizations\n- Advanced filtering and search with Elasticsearch\n\nThe dashboard processes over 500K daily active users and handles millions of transactions.",
  
  "Mihai has a strong technical background:\n\n**Education:**\n- Computer Science degree with focus on software engineering\n- Specialized coursework in algorithms, data structures, and system design\n- Continuous learner - regularly updates skills with new technologies\n\n**Professional Experience:**\n- 5+ years of professional development experience\n- Led teams on multiple high-impact projects\n- Contributed to open-source projects\n- Experience with agile methodologies\n\nHe believes in writing clean, maintainable code and creating intuitive user experiences.",
];

const SUGGESTIONS = [
  'What technologies does Mihai work with?',
  'Tell me about his recent projects',
  'What is his background?',
  'How can I get in touch?',
  'What makes him different?',
  'Show me his skills',
];

function useStreamingResponse() {
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
        timeoutRef.current = setTimeout(streamToken, 30);
      } else {
        setIsStreaming(false);
        onComplete();
      }
    };

    streamToken();
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { streamingContent, isStreaming, startStreaming, stopStreaming };
}

export function AIChatPopover() {
  const { isOpen, close } = useAIChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { streamingContent, isStreaming, startStreaming } = useStreamingResponse();
  const messageIndexRef = useRef(0);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        role: 'assistant',
        content: MOCK_RESPONSES[0],
      };
      setMessages([welcomeMessage]);
      messageIndexRef.current = 1;
    }
  }, [isOpen, messages.length]);

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    const streamingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMessage, streamingMessage]);
    setInput('');

    const responseContent = MOCK_RESPONSES[messageIndexRef.current % MOCK_RESPONSES.length];
    messageIndexRef.current++;

    startStreaming(responseContent, () => {
      setMessages(prev => prev.map(msg => 
        msg.isStreaming 
          ? { ...msg, content: responseContent, isStreaming: false }
          : msg
      ));
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
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
            animate={{ backdropFilter: 'blur(10px)' }}
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
                              {!message.isStreaming && (
                                <Actions>
                                  <Action 
                                    tooltip="Copy" 
                                    onClick={() => handleCopy(message.content)}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Action>
                                  <Action tooltip="Good response">
                                    <ThumbsUp className="h-4 w-4" />
                                  </Action>
                                  <Action tooltip="Bad response">
                                    <ThumbsDown className="h-4 w-4" />
                                  </Action>
                                  <Action tooltip="Regenerate">
                                    <RefreshCw className="h-4 w-4" />
                                  </Action>
                                </Actions>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
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
                  value={input}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.currentTarget.value)}
                  placeholder="Ask about Mihai's work..."
                  disabled={isStreaming}
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
                    disabled={!input.trim() || isStreaming}
                    status={isStreaming ? 'streaming' : 'ready'}
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