import { Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * @author: @dorian_baffier
 * @description: Command Button
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

export default function CommandButton({
	className,
	children,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
	children?: React.ReactNode;
}) {
	return (
		<Button
			{...props}
			className={cn(
				"relative p-2",
				"overflow-hidden rounded-sm",
				"bg-gradient-to-b from-zinc-50 to-zinc-100",
				"dark:from-zinc-800 dark:to-zinc-900",
				"transition-all duration-300 ease-out",
				"group",
				"inline-flex items-center justify-center",
				"gap-1",
				className,
			)}
		>
			<Command
				className={cn(
					"h-4 w-4",
					"text-zinc-600 dark:text-zinc-400",
					"transition-all duration-300",
					"group-hover:scale-110",
					"group-hover:rotate-[-4deg]",
					"group-active:scale-95",
				)}
			/>
			<span className="text-sm text-zinc-600 dark:text-zinc-400">
				{children || "+ I"}
			</span>
			<span
				className={cn(
					"absolute inset-0",
					"bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0",
					"translate-x-[-100%]",
					"group-hover:translate-x-[100%]",
					"transition-transform duration-500",
					"ease-out",
				)}
			/>
		</Button>
	);
}
