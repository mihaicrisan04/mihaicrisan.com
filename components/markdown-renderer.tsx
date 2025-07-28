"use client"

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Image from 'next/image'
import { useState } from 'react'
import { 
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogImage,
  MorphingDialogClose
} from "@/components/motion-primitives/morphing-dialog"
import { XIcon } from 'lucide-react'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            
            if (!inline && language) {
              return (
                <SyntaxHighlighter
                  style={oneDark}
                  language={language}
                  PreTag="div"
                  className="rounded-lg text-sm"
                  customStyle={{
                    margin: '0',
                    padding: '1rem',
                    backgroundColor: 'rgb(23 23 23)',
                  } as any}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              )
            }
            
            return (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            )
          },
          img({ src, alt, ...props }: any) {
            if (!src || typeof src !== 'string') return null
            
            // Handle relative paths by prefixing with /content/projects/
            const imageSrc = src.startsWith('http') || src.startsWith('/') 
              ? src 
              : `/content/projects/${src}`
            
            return (
              <MorphingDialog
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
              >
                <MorphingDialogTrigger>
                  <MorphingDialogImage
                    src={imageSrc}
                    alt={alt || ''}
                    className="w-full rounded-lg object-cover border border-border hover:border-border/60 transition-colors cursor-pointer"
                  />
                </MorphingDialogTrigger>
                <MorphingDialogContainer>
                  <MorphingDialogContent className="relative">
                    <MorphingDialogImage
                      src={imageSrc}
                      alt={alt || ''}
                      className="h-auto w-full max-w-[90vw] rounded-lg object-cover lg:h-[90vh]"
                    />
                  </MorphingDialogContent>
                  <MorphingDialogClose
                    className="fixed right-6 top-6 h-fit w-fit rounded-full bg-white p-1"
                    variants={{
                      initial: { opacity: 0 },
                      animate: {
                        opacity: 1,
                        transition: { delay: 0.3, duration: 0.1 },
                      },
                      exit: { opacity: 0, transition: { duration: 0 } },
                    }}
                  >
                    <XIcon className="h-5 w-5 text-zinc-500" />
                  </MorphingDialogClose>
                </MorphingDialogContainer>
              </MorphingDialog>
            )
          },
          h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-semibold mb-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-medium mb-2">{children}</h3>,
          p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="mb-4 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground mb-4">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
} 
