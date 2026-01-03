"use client";

import { Calendar, ExternalLink, Github, Tag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

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
	highlights?: string[];
}

interface ProjectModalProps {
	project: Project | null;
	isOpen: boolean;
	onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
	if (!project) {
		return null;
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
		});
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-500/10 text-green-700 dark:text-green-400";
			case "in-progress":
				return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
			default:
				return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
		}
	};

	const getLinkIcon = (type: string) => {
		switch (type) {
			case "source":
				return <Github className="h-4 w-4" />;
			default:
				return <ExternalLink className="h-4 w-4" />;
		}
	};

	return (
		<Dialog onOpenChange={onClose} open={isOpen}>
			<DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto lg:max-w-6xl">
				<DialogHeader>
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.3 }}
					>
						<div className="flex items-start justify-between gap-4">
							<div className="flex-1">
								<DialogTitle className="mb-2 font-bold text-2xl">
									{project.name}
								</DialogTitle>
								<DialogDescription className="text-base">
									{project.shortDescription}
								</DialogDescription>
							</div>
							<Badge className={getStatusColor(project.status)}>
								{project.status.replace("-", " ")}
							</Badge>
						</div>
					</motion.div>
				</DialogHeader>

				<motion.div
					animate={{ opacity: 1 }}
					className="space-y-6"
					initial={{ opacity: 0 }}
					transition={{ duration: 0.4, delay: 0.1 }}
				>
					{/* Project Timeline */}
					<Card>
						<CardContent className="pt-6">
							<div className="mb-2 flex items-center gap-2 text-muted-foreground text-sm">
								<Calendar className="h-4 w-4" />
								<span>Timeline</span>
							</div>
							<p>
								{formatDate(project.startDate)} -{" "}
								{project.endDate ? formatDate(project.endDate) : "Present"}
							</p>
						</CardContent>
					</Card>

					{/* Full Description */}
					<div>
						<h3 className="mb-3 font-semibold text-lg">About This Project</h3>
						<p className="text-muted-foreground leading-relaxed">
							{project.fullDescription}
						</p>
					</div>

					{/* Tech Stack */}
					<div>
						<div className="mb-3 flex items-center gap-2">
							<Tag className="h-4 w-4" />
							<h3 className="font-semibold text-lg">Tech Stack</h3>
						</div>
						<div className="flex flex-wrap gap-2">
							<AnimatePresence>
								{project.techStack.map((tech, index) => (
									<motion.div
										animate={{ opacity: 1, scale: 1 }}
										initial={{ opacity: 0, scale: 0.8 }}
										key={tech.name}
										transition={{ duration: 0.2, delay: index * 0.05 }}
									>
										<Badge variant="secondary">{tech.name}</Badge>
									</motion.div>
								))}
							</AnimatePresence>
						</div>
					</div>

					{/* Key Highlights */}
					{project.highlights && project.highlights.length > 0 && (
						<div>
							<h3 className="mb-3 font-semibold text-lg">Key Highlights</h3>
							<ul className="space-y-2">
								{project.highlights.map((highlight, index) => (
									<motion.li
										animate={{ opacity: 1, x: 0 }}
										className="flex items-start gap-2"
										initial={{ opacity: 0, x: -20 }}
										key={highlight}
										transition={{ duration: 0.3, delay: index * 0.1 }}
									>
										<div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
										<span className="text-muted-foreground">{highlight}</span>
									</motion.li>
								))}
							</ul>
						</div>
					)}

					<Separator />

					{/* Links */}
					<div>
						<h3 className="mb-3 font-semibold text-lg">Links</h3>
						<div className="flex flex-wrap gap-3">
							{project.links.map((link, index) => (
								<motion.div
									animate={{ opacity: 1, y: 0 }}
									initial={{ opacity: 0, y: 20 }}
									key={link.url}
									transition={{ duration: 0.3, delay: index * 0.1 }}
								>
									<Button asChild className="gap-2" size="sm" variant="outline">
										<a
											href={link.url}
											rel="noopener noreferrer"
											target="_blank"
										>
											{getLinkIcon(link.type)}
											{link.name}
										</a>
									</Button>
								</motion.div>
							))}
						</div>
					</div>
				</motion.div>
			</DialogContent>
		</Dialog>
	);
}
