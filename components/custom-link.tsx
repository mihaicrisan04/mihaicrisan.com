import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { type ReactNode, useState } from "react";

interface CustomLinkProps {
	href: string;
	children: ReactNode;
	underlineOnHover?: boolean;
	external?: boolean;
	className?: string;
}

export function CustomLink({
	href,
	children,
	underlineOnHover = false,
	external = false,
	className = "",
}: CustomLinkProps) {
	const [isHovered, setIsHovered] = useState(false);

	const baseClasses = "text-sm inline-flex items-center gap-1";
	const hoverClasses = underlineOnHover ? "hover:underline" : "";

	const combinedClasses = `${baseClasses} ${hoverClasses} ${className}`;

	if (external) {
		return (
			<motion.a
				animate={{ x: isHovered ? 4 : 0 }}
				className={combinedClasses}
				href={href}
				onHoverEnd={() => setIsHovered(false)}
				onHoverStart={() => setIsHovered(true)}
				rel="noopener noreferrer"
				target="_blank"
				transition={{ duration: 0.2 }}
			>
				<motion.span
					animate={{ scale: isHovered ? 1.05 : 1 }}
					transition={{ duration: 0.2 }}
				>
					{children}
				</motion.span>
				<motion.span
					animate={{
						opacity: isHovered ? 1 : 0,
						scale: isHovered ? 1 : 0.8,
					}}
					className="inline-flex"
					transition={{ duration: 0.2 }}
				>
					<ArrowUpRight className="h-4 w-4" />
				</motion.span>
			</motion.a>
		);
	}

	return (
		<motion.div
			animate={{ x: isHovered ? 4 : 0 }}
			className={combinedClasses}
			onHoverEnd={() => setIsHovered(false)}
			onHoverStart={() => setIsHovered(true)}
			transition={{ duration: 0.2 }}
		>
			<Link className="inline-flex items-center gap-1" href={href}>
				<motion.span
					animate={{ scale: isHovered ? 1.05 : 1 }}
					transition={{ duration: 0.2 }}
				>
					{children}
				</motion.span>
				<motion.span
					animate={{
						opacity: isHovered ? 1 : 0,
						scale: isHovered ? 1 : 0.8,
					}}
					className="inline-flex"
					transition={{ duration: 0.2 }}
				>
					<ArrowUpRight className="h-4 w-4" />
				</motion.span>
			</Link>
		</motion.div>
	);
}
