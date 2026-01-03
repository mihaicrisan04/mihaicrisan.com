"use client";

import { Calendar, ExternalLink, Star } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface Project {
	id: string;
	name: string;
	shortDescription: string;
	fullDescription: string;
	status: string;
	category: string;
	featured: boolean;
	startDate: string;
	endDate: string | null;
	techStack: Array<{
		name: string;
		category: string;
	}>;
	links: Array<{
		name: string;
		url: string;
		type: string;
	}>;
	images: Array<{
		url: string;
		alt: string;
		caption?: string;
	}>;
}

interface ProjectCardProps {
	project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
			case "in-progress":
				return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
			default:
				return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
		});
	};

	return (
		<Card className="group h-full overflow-hidden border-border/50 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0 flex-1">
						<div className="mb-2 flex items-center gap-2">
							<CardTitle className="line-clamp-1 font-semibold text-lg transition-colors group-hover:text-primary">
								{project.name}
							</CardTitle>
							{project.featured && (
								<motion.div
									animate={{ opacity: 1, scale: 1 }}
									className="flex-shrink-0"
									initial={{ opacity: 0, scale: 0 }}
									transition={{ duration: 0.3, delay: 0.2 }}
								>
									<Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
								</motion.div>
							)}
						</div>
						<CardDescription className="line-clamp-2 text-sm leading-relaxed">
							{project.shortDescription}
						</CardDescription>
					</div>
					<div className="flex-shrink-0">
						<Badge className={getStatusColor(project.status)} variant="outline">
							<span className="truncate">
								{project.status.replace("-", " ")}
							</span>
						</Badge>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Tech Stack Preview */}
				<div className="space-y-2">
					<div className="flex flex-wrap gap-1.5">
						{project.techStack.slice(0, 3).map((tech) => (
							<Badge
								className="max-w-[80px] truncate px-2 py-0.5 text-xs"
								key={tech.name}
								title={tech.name}
								variant="secondary"
							>
								{tech.name}
							</Badge>
						))}
						{project.techStack.length > 3 && (
							<Badge
								className="flex-shrink-0 px-2 py-0.5 text-xs"
								variant="secondary"
							>
								+{project.techStack.length - 3}
							</Badge>
						)}
					</div>
				</div>

				{/* Timeline */}
				<div className="flex items-center gap-2 text-muted-foreground text-sm">
					<Calendar className="h-3.5 w-3.5 flex-shrink-0" />
					<span className="truncate">
						{formatDate(project.startDate)} -{" "}
						{project.endDate ? formatDate(project.endDate) : "Present"}
					</span>
				</div>

				{/* Category and Links */}
				<div className="flex items-center justify-between border-border/50 border-t pt-2">
					<span className="truncate text-muted-foreground text-sm capitalize">
						{project.category.replace("-", " ")}
					</span>
					<motion.div
						className="flex-shrink-0"
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
					>
						<Button
							className="h-8 w-8 p-2 opacity-70 transition-opacity group-hover:opacity-100"
							size="sm"
							variant="ghost"
						>
							<ExternalLink className="h-3.5 w-3.5" />
						</Button>
					</motion.div>
				</div>
			</CardContent>
		</Card>
	);
}
