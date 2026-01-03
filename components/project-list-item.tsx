"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Cursor } from "@/components/motion-primitives/cursor";
import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur";
import type { Project } from "@/lib/projects";

interface ProjectListItemProps {
	project: Project;
}

export function ProjectListItem({ project }: ProjectListItemProps) {
	return (
		<div className="relative">
			<Cursor
				attachToParent
				className="z-50"
				transition={{ duration: 0.15 }}
				variants={{
					initial: { scale: 0, opacity: 0 },
					animate: { scale: 1, opacity: 1 },
					exit: { scale: 0, opacity: 0 },
				}}
			>
				<motion.div
					animate={{ scale: 1, opacity: 1 }}
					className="relative aspect-square w-75 overflow-hidden rounded-lg shadow-lg"
					exit={{ scale: 0.8, opacity: 0 }}
					initial={{ scale: 0.8, opacity: 0 }}
					transition={{ duration: 0.2 }}
				>
					{/* Background Image or Gradient */}
					{project.images && project.images.length > 0 ? (
						<Image
							alt={project.images[0].alt}
							className="absolute inset-0 h-full w-full object-cover"
							height={300}
							src={project.images[0].src}
							width={300}
						/>
					) : (
						<div className="absolute inset-0 bg-linear-to-br from-primary/20 via-primary/10 to-muted" />
					)}

					<ProgressiveBlur
						blurIntensity={6}
						className="pointer-events-none absolute bottom-0 left-0 h-[50%] w-full"
					/>

					{/* Content Overlay */}
					<div className="absolute bottom-0 left-0">
						<div className="flex flex-col items-start gap-0 px-5 py-4">
							<p className="font-medium text-base text-white">{project.name}</p>
							<p className="text-base text-zinc-300">
								{project.shortDescription}
							</p>
						</div>
					</div>
				</motion.div>
			</Cursor>

			<Link href={`/work/${project.slug}`}>
				<motion.div
					className="group -mx-2 flex cursor-pointer items-center justify-between rounded px-2 py-1 transition-colors hover:bg-muted/50"
					transition={{ duration: 0.2 }}
					whileHover={{ x: 4 }}
				>
					<span className="text-sm transition-colors hover:text-foreground">
						{project.name}
					</span>
					<motion.svg
						className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground"
						fill="none"
						role="button"
						stroke="currentColor"
						transition={{ duration: 0.2 }}
						viewBox="0 0 24 24"
						whileHover={{ x: 4 }}
					>
						<path
							d="M9 5l7 7-7 7"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
						/>
					</motion.svg>
				</motion.div>
			</Link>
		</div>
	);
}
