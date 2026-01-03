"use client";

import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { type ReactNode, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SpringElement } from "@/components/ui/spring-element";

interface HeroSectionProps {
	name: string;
	title: ReactNode;
	avatarSrcLight: string;
	avatarSrcDark: string;
	avatarFallback?: string;
}

export function HeroSection({
	name,
	title,
	avatarSrcLight,
	avatarSrcDark,
	avatarFallback,
}: HeroSectionProps) {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const isLight = theme === "light";

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="flex items-start gap-6">
			<div className="shrink-0">
				<SpringElement>
					<Avatar className="relative h-16 w-16">
						{mounted ? (
							<>
								<motion.div
									animate={{
										opacity: isLight ? 0 : 1,
										filter: isLight ? "blur(8px)" : "blur(0px)",
									}}
									className="absolute inset-0"
									initial={false}
									transition={{ duration: 0.5, ease: "easeInOut" }}
								>
									<AvatarImage
										alt={`${name} - Dark`}
										className="h-full w-full object-cover"
										draggable={false}
										src={avatarSrcDark}
									/>
								</motion.div>

								<motion.div
									animate={{
										opacity: isLight ? 1 : 0,
										filter: isLight ? "blur(0px)" : "blur(8px)",
									}}
									className="absolute inset-0"
									initial={false}
									transition={{ duration: 0.5, ease: "easeInOut" }}
								>
									<AvatarImage
										alt={`${name} - Light`}
										className="h-full w-full object-cover"
										draggable={false}
										src={avatarSrcLight}
									/>
								</motion.div>
							</>
						) : (
							<AvatarImage
								alt={name}
								className="h-full w-full object-cover"
								draggable={false}
								src={avatarSrcDark}
							/>
						)}

						<AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 font-bold text-white text-xl">
							{avatarFallback ||
								name
									.split(" ")
									.map((n) => n[0])
									.join("")}
						</AvatarFallback>
					</Avatar>
				</SpringElement>
			</div>

			<div className="flex-1">
				<h1 className="font-medium text-lg">
					hey, i'm {name}
					<span className="text-muted-foreground">{title}</span>
				</h1>
			</div>
		</div>
	);
}
