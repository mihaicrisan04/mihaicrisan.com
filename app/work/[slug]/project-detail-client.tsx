"use client";

import { X } from "lucide-react";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect, useState } from "react";
import { BackButton } from "@/components/back-button";
import { CustomLink } from "@/components/custom-link";
import { mdxComponents } from "@/components/mdx";
import {
	MorphingDialog,
	MorphingDialogClose,
	MorphingDialogContainer,
	MorphingDialogContent,
	MorphingDialogImage,
	MorphingDialogTrigger,
} from "@/components/motion-primitives/morphing-dialog";
import { Spotlight } from "@/components/motion-primitives/spotlight";
import type { Project } from "@/lib/projects";

interface ProjectDetailClientProps {
	project: Project;
}

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
	});
}

function formatDateRange(
	startDate: string,
	endDate: string | undefined,
): string {
	const start = formatDate(startDate);
	if (!endDate) {
		return `${start} – Present`;
	}
	const end = formatDate(endDate);
	return `${start} – ${end}`;
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
	const [mdxSource, setMdxSource] = useState<Awaited<
		ReturnType<typeof serialize>
	> | null>(null);

	useEffect(() => {
		serialize(project.content).then(setMdxSource);
	}, [project.content]);

	const heroImage = project.images?.[0];

	return (
		<div className="min-h-screen">
			<div className="mx-auto max-w-2xl px-6 py-8">
				<BackButton />

				{/* Project Header */}
				<header className="mb-10">
					{/* Title */}
					<h1 className="mb-1 font-semibold text-foreground text-sm">
						{project.website ? (
							<CustomLink
								className="font-semibold text-2xl text-foreground hover:text-foreground"
								external
								href={project.website}
							>
								{project.name}
							</CustomLink>
						) : (
							project.name
						)}
					</h1>

					{/* Date Range */}
					<p className="mb-4 text-muted-foreground text-sm">
						{formatDateRange(project.startDate, project.endDate)}
					</p>

					{/* Tech Stack Pills */}
					<div className="mb-6 flex flex-wrap gap-1.5">
						{project.techStack.map((tech) => (
							<span
								className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground text-xs"
								key={tech.name}
							>
								{tech.name}
							</span>
						))}
					</div>

					{/* Short Description */}
					<p className="text-foreground/80 leading-relaxed">
						{project.shortDescription}
					</p>
				</header>

				{/* Hero Image */}
				{heroImage && (
					<div className="mb-12">
						<MorphingDialog
							transition={{
								duration: 0.3,
								ease: "easeOut",
							}}
						>
							<MorphingDialogTrigger>
								<div className="relative">
									<Spotlight size={150} />
									<MorphingDialogImage
										alt={heroImage.alt}
										className="aspect-[3/2] w-full cursor-pointer rounded-sm object-cover"
										src={heroImage.src}
									/>
								</div>
							</MorphingDialogTrigger>
							<MorphingDialogContainer>
								<MorphingDialogContent className="relative">
									<MorphingDialogImage
										alt={heroImage.alt}
										className="h-auto w-full max-w-[90vw] rounded-sm object-cover lg:h-[90vh]"
										src={heroImage.src}
									/>
								</MorphingDialogContent>
								<MorphingDialogClose
									className="fixed top-6 right-6 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-border/20 bg-muted/20 text-muted-foreground/90 transition-colors hover:border-border hover:bg-muted/50 hover:text-foreground"
									transition={{
										opacity: {
											delay: 0.05,
											duration: 0.15,
											ease: [0.4, 0, 0.2, 1],
										},
										scale: { type: "spring", stiffness: 700, damping: 15 },
									}}
									variants={{
										initial: { opacity: 0, scale: 0.8 },
										animate: { opacity: 1, scale: 1 },
										exit: { opacity: 0, scale: 0.8 },
									}}
									whileHover={{ scale: 1.15 }}
								>
									<X className="h-4 w-4" />
								</MorphingDialogClose>
							</MorphingDialogContainer>
						</MorphingDialog>
					</div>
				)}

				<hr className="my-8 border-border/50" />

				{/* MDX Content */}
				{mdxSource && (
					<div className="prose prose-neutral dark:prose-invert max-w-none">
						<MDXRemote {...mdxSource} components={mdxComponents} />
					</div>
				)}

				<div className="mt-24" />
			</div>
		</div>
	);
}
