"use client";

import {
	Check,
	Clock,
	Copy,
	Loader2,
	RefreshCw,
	Search,
	X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import {
	ChainOfThought,
	ChainOfThoughtContent,
	ChainOfThoughtItem,
	ChainOfThoughtStep,
	ChainOfThoughtTrigger,
} from "@/components/ui/chain-of-thought";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Action, Actions } from "@/components/ui/shadcn-io/ai/actions";
import {
	PromptInput,
	PromptInputSubmit,
	PromptInputTextarea,
	PromptInputToolbar,
} from "@/components/ui/shadcn-io/ai/prompt-input";
import { Response } from "@/components/ui/shadcn-io/ai/response";
import { Suggestion } from "@/components/ui/shadcn-io/ai/suggestion";
import {
	Marquee,
	MarqueeContent,
	MarqueeFade,
	MarqueeItem,
} from "@/components/ui/shadcn-io/marquee";
import { useAIChat } from "@/contexts/ai-chat-context";
import { type ChatStep, streamingChat } from "@/lib/stream-parser";

function CloseButton({ onClick }: { onClick: () => void }) {
	return (
		<motion.button
			animate={{ opacity: 1, scale: 1 }}
			aria-label="Close chat"
			className="absolute top-4 right-4 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-border/20 bg-muted/20 text-muted-foreground/90 transition-colors hover:border-border hover:bg-muted/50 hover:text-foreground"
			exit={{ opacity: 0, scale: 0.8 }}
			initial={{ opacity: 0, scale: 0.8 }}
			onClick={onClick}
			transition={{
				opacity: { delay: 0.05, duration: 0.15, ease: [0.4, 0, 0.2, 1] },
				scale: { type: "spring", stiffness: 700, damping: 15 },
			}}
			type="button"
			whileHover={{ scale: 1.15 }}
		>
			<X className="h-4 w-4" />
		</motion.button>
	);
}

function getToolIcon(toolName: string | undefined) {
	switch (toolName) {
		case "getCurrentTime":
			return <Clock className="size-4" />;
		default:
			return null;
	}
}

function getToolLabel(toolName: string | undefined, isLoading: boolean) {
	if (isLoading) {
		switch (toolName) {
			case "getCurrentTime":
				return "Fetching current time...";
			default:
				return `Calling ${toolName}...`;
		}
	}
	switch (toolName) {
		case "getCurrentTime":
			return "Fetched current time";
		default:
			return `Called ${toolName}`;
	}
}

function StreamingSteps({ steps }: { steps: ChatStep[] }) {
	if (!steps || steps.length === 0) {
		return null;
	}

	return (
		<motion.div
			animate={{ opacity: 1, y: 0 }}
			className="mb-3"
			initial={{ opacity: 0, y: 4 }}
			transition={{ duration: 0.2 }}
		>
			<ChainOfThought>
				{steps.map((step) => (
					<ChainOfThoughtStep key={step.id}>
						{step.type === "portfolio_search" ? (
							<>
								<ChainOfThoughtTrigger
									leftIcon={
										step.status === "loading" ? (
											<Loader2 className="size-4 animate-spin" />
										) : (
											<Search className="size-4" />
										)
									}
								>
									{step.status === "loading"
										? "Searching portfolio..."
										: `Searched portfolio (${step.resultsCount ?? 0} result${step.resultsCount !== 1 ? "s" : ""})`}
								</ChainOfThoughtTrigger>
								<ChainOfThoughtContent>
									{step.status === "complete" &&
										(step.resultsCount && step.resultsCount > 0 ? (
											<ChainOfThoughtItem>
												Found {step.resultsCount} relevant result
												{step.resultsCount !== 1 ? "s" : ""} in Mihai&apos;s
												portfolio
											</ChainOfThoughtItem>
										) : (
											<ChainOfThoughtItem>
												No specific information found, responding with general
												knowledge
											</ChainOfThoughtItem>
										))}
								</ChainOfThoughtContent>
							</>
						) : (
							<>
								<ChainOfThoughtTrigger
									leftIcon={
										step.status === "loading" ? (
											<Loader2 className="size-4 animate-spin" />
										) : (
											getToolIcon(step.name)
										)
									}
								>
									{getToolLabel(step.name, step.status === "loading")}
								</ChainOfThoughtTrigger>
								<ChainOfThoughtContent>
									{step.result && step.name !== "searchPortfolio" && (
										<ChainOfThoughtItem>
											<code className="break-all rounded bg-muted px-1.5 py-0.5 text-xs">
												{step.result}
											</code>
										</ChainOfThoughtItem>
									)}
								</ChainOfThoughtContent>
							</>
						)}
					</ChainOfThoughtStep>
				))}
			</ChainOfThought>
		</motion.div>
	);
}

interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	isStreaming?: boolean;
	steps?: ChatStep[];
}

const WELCOME_MESSAGE = `Hi! I'm Mihai's portfolio assistant. I can help you learn more about his work and experience. Feel free to ask me about:

- His technical skills and expertise
- Projects he's worked on
- His professional experience
- How to get in touch`;

const SUGGESTIONS = [
	"What technologies does Mihai work with?",
	"Tell me about his recent projects",
	"What is his background?",
	"How can I get in touch?",
	"What makes him different?",
	"Show me his skills",
];

// Get the Convex URL for HTTP endpoints
function getConvexHttpUrl(): string {
	// In development, use the local Convex URL
	// In production, this would be your deployed Convex URL
	const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
	// Replace .cloud with .site for HTTP actions
	return convexUrl.replace(".cloud", ".site");
}

export function AIChatPopover() {
	const { isOpen, close, threadId, setThreadId } = useAIChat();
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const scrollRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const [isStreaming, setIsStreaming] = useState(false);
	const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
	const [regeneratingMessageId, setRegeneratingMessageId] = useState<
		string | null
	>(null);
	const streamingMessageIdRef = useRef<string | null>(null);

	useEffect(() => {
		if (isOpen && messages.length === 0) {
			const welcomeMessage: Message = {
				id: "1",
				role: "assistant",
				content: WELCOME_MESSAGE,
			};
			setMessages([welcomeMessage]);
		}
	}, [isOpen, messages.length]);

	// Focus input when chat opens
	useEffect(() => {
		if (isOpen && inputRef.current) {
			const timeoutId = setTimeout(() => {
				const inputEl = inputRef.current;
				if (inputEl) {
					inputEl.focus();
					const length = inputEl.value.length;
					inputEl.setSelectionRange(length, length);
				}
			}, 100);

			return () => clearTimeout(timeoutId);
		}
	}, [isOpen]);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	useEffect(() => {
		const handleEscape = (e: globalThis.KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				close();
			}
		};
		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen, close]);

	const sendMessage = useCallback(
		async (messageContent: string, isRegenerate = false) => {
			if (!messageContent.trim() || isStreaming) {
				return;
			}

			const userMessage: Message = {
				id: Date.now().toString(),
				role: "user",
				content: messageContent.trim(),
			};

			// Only add user message if not regenerating
			if (!isRegenerate) {
				setMessages((prev) => [...prev, userMessage]);
			}

			setIsStreaming(true);

			// Create assistant message placeholder
			const assistantMessageId = (Date.now() + 1).toString();
			streamingMessageIdRef.current = assistantMessageId;

			setMessages((prev) => [
				...prev,
				{
					id: assistantMessageId,
					role: "assistant",
					content: "",
					isStreaming: true,
					steps: [],
				},
			]);

			const convexUrl = getConvexHttpUrl();

			try {
				await streamingChat(convexUrl, messageContent, threadId, {
					onStepStart: (step) => {
						setMessages((prev) =>
							prev.map((msg) => {
								if (msg.id === assistantMessageId) {
									return {
										...msg,
										steps: [...(msg.steps || []), step],
									};
								}
								return msg;
							}),
						);
					},

					onStepComplete: (stepId, data) => {
						setMessages((prev) =>
							prev.map((msg) => {
								if (msg.id === assistantMessageId) {
									return {
										...msg,
										steps: (msg.steps || []).map((step) =>
											step.id === stepId ? { ...step, ...data } : step,
										),
									};
								}
								return msg;
							}),
						);
					},

					onTextDelta: (content) => {
						setMessages((prev) =>
							prev.map((msg) => {
								if (msg.id === assistantMessageId) {
									return {
										...msg,
										content: msg.content + content,
									};
								}
								return msg;
							}),
						);
					},

					onComplete: (newThreadId) => {
						if (newThreadId && !threadId) {
							setThreadId(newThreadId);
						}
						setMessages((prev) =>
							prev.map((msg) => {
								if (msg.id === assistantMessageId) {
									return { ...msg, isStreaming: false };
								}
								return msg;
							}),
						);
						setIsStreaming(false);
						streamingMessageIdRef.current = null;
					},

					onError: (error) => {
						console.error("Stream error:", error);
						toast.error("Failed to get a response. Please try again.");
						setMessages((prev) =>
							prev.map((msg) => {
								if (msg.id === assistantMessageId) {
									return {
										...msg,
										isStreaming: false,
										content:
											msg.content ||
											"Sorry, something went wrong. Please try again.",
									};
								}
								return msg;
							}),
						);
						setIsStreaming(false);
						streamingMessageIdRef.current = null;
					},
				});
			} catch (error) {
				console.error("Failed to get response:", error);
				toast.error("Failed to get a response. Please try again.");
				setIsStreaming(false);
				streamingMessageIdRef.current = null;
			} finally {
				setRegeneratingMessageId(null);
			}
		},
		[isStreaming, threadId, setThreadId],
	);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		const messageContent = input.trim();
		setInput("");
		await sendMessage(messageContent);
	};

	const handleRegenerate = async (messageId: string) => {
		// Find the user message that came before this assistant message
		const messageIndex = messages.findIndex((m) => m.id === messageId);
		if (messageIndex <= 0) {
			return;
		}

		// Find the preceding user message
		let userMessageContent = "";
		for (let i = messageIndex - 1; i >= 0; i--) {
			if (messages[i].role === "user") {
				userMessageContent = messages[i].content;
				break;
			}
		}

		if (!userMessageContent) {
			return;
		}

		// Immediately remove the message from view
		setMessages((prev) => prev.filter((m) => m.id !== messageId));
		setRegeneratingMessageId(messageId);
		await sendMessage(userMessageContent, true);
	};

	const handleSuggestionClick = (suggestion: string) => {
		setInput(suggestion);
	};

	const handleCopy = (messageId: string, content: string) => {
		navigator.clipboard.writeText(content);
		setCopiedMessageId(messageId);
		toast.success("Copied to clipboard");

		// Reset after 2 seconds
		setTimeout(() => {
			setCopiedMessageId(null);
		}, 2000);
	};

	if (typeof window === "undefined") {
		return null;
	}

	return createPortal(
		<AnimatePresence mode="wait">
			{isOpen && (
				<motion.div
					animate={{ opacity: 1 }}
					className="fixed inset-0 z-50 flex items-center justify-center"
					exit={{ opacity: 0 }}
					initial={{ opacity: 0 }}
					transition={{ duration: 0.15, ease: "easeOut" }}
				>
					<motion.div
						animate={{ backdropFilter: "blur(10px) opacity(1)" }}
						className="absolute inset-0 bg-background/90"
						exit={{ backdropFilter: "blur(0px) opacity(0)" }}
						initial={{ backdropFilter: "blur(0px) opacity(0)" }}
						onClick={close}
						transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
					/>

					<motion.div
						animate={{ opacity: 1 }}
						className="relative z-10 mx-auto flex h-full w-full max-w-2xl flex-col"
						exit={{ opacity: 0 }}
						initial={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						<CloseButton onClick={close} />

						<MarqueeFade
							className="h-15 bg-linear-to-t from-background to-transparent"
							side="top"
						/>

						<motion.div
							animate={{ scale: 1, opacity: 1, y: 0 }}
							className="relative mt-15 flex-1 overflow-hidden"
							exit={{ scale: 0.98, opacity: 0, y: 8 }}
							initial={{ scale: 0.98, opacity: 0, y: 8 }}
							transition={{
								delay: 0.05,
								duration: 0.2,
								ease: [0.25, 0.1, 0.25, 1],
							}}
						>
							<div className="absolute inset-0" ref={scrollRef}>
								<ScrollArea className="relative h-full">
									<MarqueeFade className="h-8" side="top" />

									<div className="px-4 pt-6 pb-6">
										{messages.map((message, index) => (
											<motion.div
												animate={{ opacity: 1, y: 0 }}
												className="mb-6 flex gap-3"
												initial={{ opacity: 0, y: 6 }}
												key={message.id}
												transition={{
													delay: 0.1 + index * 0.02,
													duration: 0.2,
													ease: [0.25, 0.1, 0.25, 1],
												}}
											>
												<div className="min-w-0 flex-1">
													{message.role === "user" ? (
														<div>
															<p className="font-bold text-sm opacity-40">
																you
															</p>
															<p className="text-foreground text-sm">
																{message.content}
															</p>
														</div>
													) : (
														<div className="min-w-0 space-y-3">
															<p className="font-bold text-sm opacity-60">
																AI bot
															</p>
															{/* Chain of thought steps - streaming */}
															{message.steps && message.steps.length > 0 && (
																<StreamingSteps steps={message.steps} />
															)}

															{/* Response content */}
															{(message.content || message.isStreaming) && (
																<div className="prose prose-sm dark:prose-invert min-w-0 max-w-none">
																	{message.isStreaming && !message.content ? (
																		<TextShimmer
																			className="font-medium text-sm"
																			duration={1.5}
																		>
																			Thinking...
																		</TextShimmer>
																	) : (
																		<div className="relative min-w-0">
																			<Response className="text-muted-foreground text-sm">
																				{message.content}
																			</Response>
																		</div>
																	)}
																</div>
															)}

															{!message.isStreaming && message.content && (
																<Actions>
																	<Action
																		onClick={() =>
																			handleCopy(message.id, message.content)
																		}
																		tooltip={
																			copiedMessageId === message.id
																				? "Copied!"
																				: "Copy"
																		}
																	>
																		<AnimatePresence
																			initial={false}
																			mode="wait"
																		>
																			{copiedMessageId === message.id ? (
																				<motion.div
																					animate={{ opacity: 1, scale: 1 }}
																					exit={{ opacity: 0, scale: 0.5 }}
																					initial={{ opacity: 0, scale: 0.5 }}
																					key="check"
																					transition={{ duration: 0.15 }}
																				>
																					<Check className="h-4 w-4 text-green-500" />
																				</motion.div>
																			) : (
																				<motion.div
																					animate={{ opacity: 1, scale: 1 }}
																					exit={{ opacity: 0, scale: 0.5 }}
																					initial={{ opacity: 0, scale: 0.5 }}
																					key="copy"
																					transition={{ duration: 0.15 }}
																				>
																					<Copy className="h-4 w-4" />
																				</motion.div>
																			)}
																		</AnimatePresence>
																	</Action>
																	<Action
																		onClick={() => handleRegenerate(message.id)}
																		tooltip="Regenerate"
																	>
																		<motion.div
																			animate={{
																				rotate:
																					regeneratingMessageId === message.id
																						? 360
																						: 0,
																			}}
																			transition={{
																				duration: 1,
																				repeat:
																					regeneratingMessageId === message.id
																						? Number.POSITIVE_INFINITY
																						: 0,
																				ease: "linear",
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
									</div>

									<MarqueeFade className="h-14" side="bottom" />
								</ScrollArea>
							</div>
						</motion.div>

						<MarqueeFade
							className="absolute right-0 bottom-0 left-0 h-33 bg-linear-to-b from-background to-transparent"
							side="bottom"
						/>

						<motion.div
							animate={{ opacity: 1, y: 0 }}
							className="relative z-20 px-4 pb-4"
							exit={{ opacity: 0, y: 12 }}
							initial={{ opacity: 0, y: 12 }}
							transition={{
								delay: 0.1,
								duration: 0.2,
								ease: [0.25, 0.1, 0.25, 1],
							}}
						>
							<PromptInput onSubmit={handleSendMessage}>
								<PromptInputTextarea
									disabled={isStreaming}
									onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
										setInput(e.currentTarget.value)
									}
									placeholder="Ask about Mihai's work..."
									ref={inputRef}
									value={input}
								/>
								<PromptInputToolbar>
									<div className="relative flex-1 overflow-hidden">
										<Marquee>
											<MarqueeFade className="w-8" side="left" />
											<MarqueeContent speed={20}>
												{SUGGESTIONS.map((suggestion) => (
													<MarqueeItem key={suggestion}>
														<Suggestion
															onClick={handleSuggestionClick}
															suggestion={suggestion}
														/>
													</MarqueeItem>
												))}
											</MarqueeContent>
											<MarqueeFade className="w-8" side="right" />
										</Marquee>
									</div>
									<PromptInputSubmit
										disabled={!input.trim() || isStreaming}
										status={isStreaming ? "streaming" : "ready"}
									/>
								</PromptInputToolbar>
							</PromptInput>
						</motion.div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>,
		document.body,
	);
}
