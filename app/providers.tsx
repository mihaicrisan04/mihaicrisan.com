"use client";

import { ImageKitProvider } from "@imagekit/next";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { LayoutGroup } from "motion/react";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { AIChatPopover } from "@/components/ai-chat-popover";
import { AIChatProvider } from "@/contexts/ai-chat-context";
import { KeyboardShortcutsProvider } from "@/contexts/keyboard-shortcuts-context";

const convex = new ConvexReactClient(
	process.env.NEXT_PUBLIC_CONVEX_URL ? process.env.NEXT_PUBLIC_CONVEX_URL : "",
);

export function Providers({ children }: { children: ReactNode }) {
	return (
		<ConvexProvider client={convex}>
			<ImageKitProvider
				urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					disableTransitionOnChange
					enableSystem={false}
					storageKey="theme"
				>
					<KeyboardShortcutsProvider>
						<AIChatProvider>
							<LayoutGroup>{children}</LayoutGroup>
							<AIChatPopover />
						</AIChatProvider>
					</KeyboardShortcutsProvider>
				</ThemeProvider>
			</ImageKitProvider>
		</ConvexProvider>
	);
}
