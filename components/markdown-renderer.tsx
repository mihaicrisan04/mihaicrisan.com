"use client";

import { XIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import {
	MorphingDialog,
	MorphingDialogClose,
	MorphingDialogContainer,
	MorphingDialogContent,
	MorphingDialogImage,
	MorphingDialogTrigger,
} from "@/components/motion-primitives/morphing-dialog";

// Top-level regex patterns for performance
const LANGUAGE_CLASS_PATTERN = /language-(\w+)/;
const TRAILING_NEWLINE_PATTERN = /\n$/;

interface MarkdownRendererProps {
	content: string;
	className?: string;
}

export function MarkdownRenderer({
	content,
	className = "",
}: MarkdownRendererProps) {
	return (
		<div className={`prose dark:prose-invert max-w-none ${className}`}>
			<ReactMarkdown
				components={{
					code({ className, children, ...props }) {
						const match = LANGUAGE_CLASS_PATTERN.exec(className || "");
						const language = match ? match[1] : "";

						// In react-markdown v10+, inline is no longer passed as a prop
						// Block code has a language class (language-xxx), inline code does not
						const isBlockCode = Boolean(language);

						if (isBlockCode) {
							return (
								<SyntaxHighlighter
									className="rounded-lg text-sm"
									customStyle={{
										margin: "0",
										padding: "1rem",
										backgroundColor: "rgb(23 23 23)",
									}}
									language={language}
									PreTag="div"
									style={oneDark}
								>
									{String(children).replace(TRAILING_NEWLINE_PATTERN, "")}
								</SyntaxHighlighter>
							);
						}

						return (
							<code
								className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
								{...props}
							>
								{children}
							</code>
						);
					},
					img({ src, alt }) {
						if (!src || typeof src !== "string") {
							return null;
						}

						// Handle relative paths by prefixing with /content/projects/
						const imageSrc =
							src.startsWith("http") || src.startsWith("/")
								? src
								: `/content/projects/${src}`;

						return (
							<MorphingDialog
								transition={{
									duration: 0.3,
									ease: "easeInOut",
								}}
							>
								<MorphingDialogTrigger>
									<MorphingDialogImage
										alt={alt || ""}
										className="w-full cursor-pointer rounded-lg border border-border object-cover transition-colors hover:border-border/60"
										src={imageSrc}
									/>
								</MorphingDialogTrigger>
								<MorphingDialogContainer>
									<MorphingDialogContent className="relative">
										<MorphingDialogImage
											alt={alt || ""}
											className="h-auto w-full max-w-[90vw] rounded-lg object-cover lg:h-[90vh]"
											src={imageSrc}
										/>
									</MorphingDialogContent>
									<MorphingDialogClose
										className="fixed top-6 right-6 h-fit w-fit rounded-full bg-white p-1"
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
						);
					},
					h1: ({ children }) => (
						<h1 className="mb-4 font-bold text-2xl">{children}</h1>
					),
					h2: ({ children }) => (
						<h2 className="mb-3 font-semibold text-xl">{children}</h2>
					),
					h3: ({ children }) => (
						<h3 className="mb-2 font-medium text-lg">{children}</h3>
					),
					p: ({ children }) => (
						<p className="mb-4 leading-relaxed">{children}</p>
					),
					ul: ({ children }) => <ul className="mb-4 space-y-1">{children}</ul>,
					ol: ({ children }) => <ol className="mb-4 space-y-1">{children}</ol>,
					li: ({ children }) => <li className="leading-relaxed">{children}</li>,
					blockquote: ({ children }) => (
						<blockquote className="mb-4 border-border border-l-4 pl-4 text-muted-foreground italic">
							{children}
						</blockquote>
					),
					a: ({ href, children }) => (
						<a
							className="text-blue-600 hover:underline dark:text-blue-400"
							href={href}
							rel="noopener noreferrer"
							target="_blank"
						>
							{children}
						</a>
					),
				}}
				rehypePlugins={[rehypeRaw, rehypeSanitize]}
				remarkPlugins={[remarkGfm]}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
