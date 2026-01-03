"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { AIChatTrigger } from "@/components/ai-chat-trigger";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function Navigation() {
	const { theme, setTheme } = useTheme();
	const pathname = usePathname();

	return (
		<div className="w-full bg-background">
			<div className="flex justify-center px-4 py-6">
				<motion.div
					animate={{ opacity: 1, y: 0 }}
					className="rounded-sm border border-border bg-background/80 px-4 py-2 backdrop-blur-sm"
					initial={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.0 }}
				>
					<div className="flex items-center justify-between">
						<nav className="flex items-center gap-3 sm:gap-6">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<motion.div
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											<Link
												className={`rounded px-2 py-1 font-medium text-sm transition-colors ${
													pathname === "/"
														? "text-foreground"
														: "text-muted-foreground hover:text-foreground"
												}`}
												href="/"
											>
												home
											</Link>
										</motion.div>
									</TooltipTrigger>
									<TooltipContent>
										<div className="flex items-center gap-2">
											<span>home</span>
											<Kbd>H</Kbd>
										</div>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<motion.div
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											<Link
												className={`rounded px-2 py-1 font-medium text-sm transition-colors ${
													pathname === "/work" || pathname?.startsWith("/work/")
														? "text-foreground"
														: "text-muted-foreground hover:text-foreground"
												}`}
												href="/work"
											>
												work
											</Link>
										</motion.div>
									</TooltipTrigger>
									<TooltipContent>
										<div className="flex items-center gap-2">
											<span>work</span>
											<Kbd>W</Kbd>
										</div>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<a
									className="rounded px-2 py-1 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
									href="/cv.pdf"
									rel="noopener noreferrer"
									target="_blank"
								>
									CV
								</a>
							</motion.div>
						</nav>

						<div className="mx-2 h-4 w-px bg-border sm:mx-4" />

						<div className="flex items-center gap-2 sm:gap-3">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<motion.div
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											<AIChatTrigger />
										</motion.div>
									</TooltipTrigger>
									<TooltipContent>
										<div className="flex items-center gap-2">
											<span>ask AI</span>
											<KbdGroup>
												<Kbd>⌘</Kbd>
												<Kbd>I</Kbd>
											</KbdGroup>
										</div>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>

						<div className="mx-2 h-4 w-px bg-border sm:mx-4" />

						<div className="flex items-center gap-2 sm:gap-3">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<motion.div
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											<Button
												className="h-8 w-8 p-1"
												onClick={() =>
													setTheme(theme === "dark" ? "light" : "dark")
												}
												size="icon"
												variant="ghost"
											>
												<Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
												<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
												<span className="sr-only">Toggle theme</span>
											</Button>
										</motion.div>
									</TooltipTrigger>
									<TooltipContent>
										<div className="flex items-center gap-2">
											<span>toggle theme</span>
											<Kbd>L</Kbd>
										</div>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
