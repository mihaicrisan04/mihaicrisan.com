"use client";
import { type HTMLMotionProps, motion } from "motion/react";
import { cn } from "@/lib/utils";

export const GRADIENT_ANGLES = {
	top: 0,
	right: 90,
	bottom: 180,
	left: 270,
};

export type ProgressiveFadeProps = {
	direction?: keyof typeof GRADIENT_ANGLES;
	className?: string;
} & HTMLMotionProps<"div">;

export function ProgressiveFade({
	direction = "bottom",
	className,
	...props
}: ProgressiveFadeProps) {
	const angle = GRADIENT_ANGLES[direction];

	// Create gradient from transparent to background color
	const gradient = `linear-gradient(${angle}deg, transparent 0%, oklch(var(--background)) 100%)`;

	return (
		<motion.div
			className={cn(
				"pointer-events-none absolute inset-0 rounded-[inherit]",
				className,
			)}
			style={{
				background: gradient,
			}}
			{...props}
		/>
	);
}
