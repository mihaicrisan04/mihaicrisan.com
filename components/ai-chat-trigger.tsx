"use client";

import { Bot } from "lucide-react";
import { forwardRef, useEffect } from "react";
import { useAIChat } from "@/contexts/ai-chat-context";

export const AIChatTrigger = forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
	const { open, isOpen } = useAIChat();

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "i" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				if (!isOpen) {
					open();
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [open, isOpen]);

	return (
		<button
			aria-label="Open AI chat"
			className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 font-medium text-foreground text-sm transition-all hover:bg-muted"
			onClick={(e) => {
				open();
				props.onClick?.(e);
			}}
			ref={ref}
			{...props}
		>
			<Bot className="h-4 w-4" />
			<span className="hidden text-sm sm:inline">ask AI</span>
		</button>
	);
});

AIChatTrigger.displayName = "AIChatTrigger";
