'use client';

import { useAIChat } from '@/contexts/ai-chat-context';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MarqueeFade } from '@/components/ui/shadcn-io/marquee';
import { Response } from '@/components/ai-elements/response';
import { ChatInput } from '@/components/chat-input';
import { createPortal } from 'react-dom';

// Extended fake conversation data
const FAKE_MESSAGES = [
  {
    id: 1,
    role: 'assistant',
    content: "Hi! I'm here to help you learn more about Mihai's work and experience. You can ask me about:\n\n- His technical skills and expertise\n- Projects he's worked on\n- His professional experience\n- How to get in touch"
  },
  {
    id: 2,
    role: 'user',
    content: 'What technologies does Mihai work with?'
  },
  {
    id: 3,
    role: 'assistant',
    content: "Mihai is a full-stack developer with expertise in:\n\n**Frontend:** React, Next.js, TypeScript, Tailwind CSS, Framer Motion\n\n**Backend:** Node.js, Python, REST APIs, GraphQL\n\n**Tools:** Git, Docker, CI/CD pipelines\n\nHe's passionate about creating performant, accessible web experiences with clean architecture and delightful user interactions."
  },
  {
    id: 4,
    role: 'user',
    content: 'Can you tell me about his recent projects?'
  },
  {
    id: 5,
    role: 'assistant',
    content: "Sure! Mihai has worked on several interesting projects:\n\n**Personal Portfolio** - The site you're on right now! Built with Next.js 15, featuring:\n- Advanced animations with Framer Motion\n- Custom morphing UI components\n- Responsive design with Tailwind CSS\n- AI-powered chat interface (that's me!)\n\n**E-commerce Platform** - A full-stack application with:\n- Real-time inventory management\n- Secure payment processing\n- Admin dashboard with analytics\n\n**SaaS Dashboard** - Enterprise-level application featuring:\n- Complex data visualizations\n- Role-based access control\n- Microservices architecture\n\nWould you like to know more about any specific project?"
  },
  {
    id: 6,
    role: 'user',
    content: 'Tell me more about the SaaS Dashboard project'
  },
  {
    id: 7,
    role: 'assistant',
    content: "The SaaS Dashboard was a particularly challenging and rewarding project. Here are the key highlights:\n\n**Tech Stack:**\n- Frontend: React with TypeScript, Redux for state management\n- Backend: Node.js with Express, PostgreSQL database\n- Infrastructure: AWS (EC2, S3, RDS), Docker containers\n- Real-time features: WebSocket connections for live updates\n\n**Key Features:**\n- Multi-tenant architecture supporting 100+ organizations\n- Custom chart library for interactive data visualizations\n- Advanced filtering and search with Elasticsearch\n- Export functionality (PDF, Excel, CSV)\n- Automated report generation and scheduling\n\n**Challenges Solved:**\n- Optimized queries to handle millions of records\n- Implemented caching strategies for 10x performance improvement\n- Built a robust permission system with granular access control\n- Designed responsive layouts that work on mobile devices\n\nThe dashboard processes over 500K daily active users and handles millions of transactions."
  },
  {
    id: 8,
    role: 'user',
    content: 'What about his background and education?'
  },
  {
    id: 9,
    role: 'assistant',
    content: "Mihai has a strong technical background:\n\n**Education:**\n- Computer Science degree with focus on software engineering\n- Specialized coursework in algorithms, data structures, and system design\n- Continuous learner - regularly updates skills with new technologies\n- Active in tech communities and conferences\n\n**Professional Experience:**\n- 5+ years of professional development experience\n- Led teams on multiple high-impact projects\n- Contributed to open-source projects\n- Mentored junior developers and conducted code reviews\n- Experience with agile methodologies and sprint planning\n\n**Philosophy:**\nHe believes in writing clean, maintainable code and creating intuitive user experiences. He's particularly interested in the intersection of design and engineering, which is why his work often features thoughtful animations and interactions.\n\nHe also values:\n- Test-driven development\n- Documentation and knowledge sharing\n- Performance optimization\n- Accessibility and inclusive design\n\nIs there anything specific about his experience you'd like to explore?"
  },
  {
    id: 10,
    role: 'user',
    content: 'How does he approach problem solving?'
  },
  {
    id: 11,
    role: 'assistant',
    content: "Great question! Mihai has a systematic approach to problem-solving:\n\n**1. Understanding the Problem**\n- Asks clarifying questions to fully understand requirements\n- Identifies constraints and success criteria\n- Considers edge cases early in the process\n\n**2. Research & Planning**\n- Researches existing solutions and best practices\n- Evaluates different architectural approaches\n- Creates technical specifications and diagrams\n- Estimates effort and identifies potential blockers\n\n**3. Iterative Development**\n- Breaks down complex problems into smaller, manageable tasks\n- Builds MVPs to validate assumptions quickly\n- Gets early feedback from stakeholders\n- Refactors and optimizes iteratively\n\n**4. Testing & Quality**\n- Writes unit tests and integration tests\n- Performs code reviews and pair programming\n- Uses debugging tools effectively\n- Monitors production for issues\n\n**5. Documentation**\n- Documents architectural decisions\n- Writes clear code comments\n- Creates user guides and API documentation\n- Shares knowledge with the team\n\nHe also believes in learning from failures and continuously improving processes."
  },
  {
    id: 12,
    role: 'user',
    content: 'What are his interests outside of work?'
  },
  {
    id: 13,
    role: 'assistant',
    content: "Beyond coding, Mihai has diverse interests that often inform his work:\n\n**Design & Creativity:**\n- Explores UI/UX design principles\n- Studies animation and motion design\n- Appreciates minimalist and functional design\n- Follows design trends and tools like Figma\n\n**Technology Trends:**\n- Keeps up with emerging technologies (AI, Web3, etc.)\n- Experiments with new frameworks and tools\n- Reads tech blogs and research papers\n- Participates in hackathons and tech meetups\n\n**Continuous Learning:**\n- Takes online courses on platforms like Frontend Masters\n- Builds side projects to learn new skills\n- Contributes to open source when possible\n- Writes technical blog posts\n\n**Other Interests:**\n- Enjoys photography and visual storytelling\n- Interested in product management and business strategy\n- Values work-life balance and mental health\n- Believes in sustainable and ethical tech practices\n\nThese interests help him bring a well-rounded perspective to his development work, especially when it comes to creating user-centered products."
  },
  {
    id: 14,
    role: 'user',
    content: 'How can I get in touch with him?'
  },
  {
    id: 15,
    role: 'assistant',
    content: "There are several ways to connect with Mihai:\n\n**Professional Channels:**\n- **Email:** You can find his email in the contact section of this portfolio\n- **LinkedIn:** Connect with him for professional networking\n- **GitHub:** Check out his code and contributions\n- **Twitter/X:** Follow for tech insights and updates\n\n**For Collaboration:**\nIf you're interested in working together, feel free to reach out with:\n- Project details and timeline\n- Technology stack requirements\n- Your budget and expectations\n- Any relevant background information\n\n**Response Time:**\nHe typically responds within 24-48 hours. For urgent matters, please mention that in your subject line.\n\n**Best For:**\n- Freelance development projects\n- Technical consulting\n- Speaking opportunities\n- Open source collaboration\n- Mentorship inquiries\n\nHe's always interested in hearing about exciting projects and opportunities to create impactful digital experiences!"
  },
  {
    id: 16,
    role: 'user',
    content: 'What makes him different from other developers?'
  },
  {
    id: 17,
    role: 'assistant',
    content: "Great question! Here's what sets Mihai apart:\n\n**1. Design-Engineering Hybrid**\nUnlike many developers who focus solely on functionality, Mihai deeply understands design principles. He can:\n- Implement pixel-perfect designs\n- Suggest UX improvements\n- Create smooth animations and micro-interactions\n- Bridge the gap between designers and developers\n\n**2. Full-Stack Versatility**\n- Comfortable working across the entire stack\n- Can architect systems from database to UI\n- Understands DevOps and deployment\n- Writes maintainable, scalable code\n\n**3. Performance-Obsessed**\n- Optimizes for Core Web Vitals\n- Implements efficient caching strategies\n- Reduces bundle sizes and load times\n- Monitors and improves performance metrics\n\n**4. Communication Skills**\n- Explains technical concepts clearly to non-technical stakeholders\n- Documents decisions and trade-offs\n- Collaborates effectively with cross-functional teams\n- Provides constructive code review feedback\n\n**5. Attention to Detail**\n- Sweats the small stuff that makes big differences\n- Considers edge cases and error states\n- Tests thoroughly across devices and browsers\n- Creates polished, production-ready products\n\n**6. Business Awareness**\n- Understands product strategy and business goals\n- Makes pragmatic technical decisions\n- Balances quality with time-to-market\n- Thinks about user impact and ROI\n\nThis combination of technical skill, design sense, and business acumen makes him a valuable partner for any project."
  }
];

export function AIChatPopover() {
  const { isOpen, close } = useAIChat();
  const scrollRef = useRef<HTMLDivElement>(null);

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
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, close]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ backdropFilter: 'blur(0px)' }}
            animate={{ backdropFilter: 'blur(10px)' }}
            exit={{ backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0 bg-background/60"
            onClick={close}
          />

          {/* Main container - full height with close button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex flex-col h-full w-full max-w-2xl mx-auto"
          >
            {/* Close button - small and subtle */}
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              onClick={close}
              className="absolute top-4 right-4 z-30 flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground/90 transition-colors bg-muted/20 hover:text-foreground hover:bg-muted/50 border-border"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </motion.button>

						{/* This is the top gradient to hide the transition from the chat(must stay here)*/}
            <MarqueeFade
              side="top"
              className="h-15 bg-gradient-to-t from-background to-transparent"
            />

            {/* Chat content container - full screen with margins */}
            <motion.div
              initial={{ scale: 0.97, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0, y: 10 }}
              transition={{ delay: 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex-1 overflow-hidden mt-15"
            >
              {/* Messages scroll area */}
              <div ref={scrollRef} className="absolute inset-0">
                <ScrollArea className="h-full relative">
                  {/* Top fade gradient */}
                  <MarqueeFade
                    side="top"
                    className="h-14"
                  />

                  <div className="px-4 pt-6 pb-6">
                    {FAKE_MESSAGES.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.2 + index * 0.05,
                          duration: 0.3,
                          ease: 'easeOut'
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
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <Response className="text-sm text-muted-foreground">
                                {message.content}
                              </Response>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Bottom fade gradient */}
                  <MarqueeFade
                    side="bottom"
                    className="h-14"
                  />
                </ScrollArea>
              </div>
            </motion.div>

            <MarqueeFade
              side="bottom"
              className="h-25 bg-gradient-to-b from-background to-transparent"
            />

            {/* Input area - below scroll area and above bottom marquee */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="relative z-20"
            >
              <ChatInput />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
