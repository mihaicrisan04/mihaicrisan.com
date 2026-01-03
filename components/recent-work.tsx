"use client";

import { motion } from "motion/react";
import { ProjectListItem } from "@/components/project-list-item";
import type { Project } from "@/lib/projects";

interface RecentWorkProps {
	projects: Project[];
}

export function RecentWork({ projects }: RecentWorkProps) {
	return (
		<div className="space-y-3">
			{projects.map((project, index) => (
				<motion.div
					animate={{ opacity: 1, y: 0 }}
					initial={{ opacity: 0, y: 20 }}
					key={project.slug}
					transition={{ duration: 0.3, delay: index * 0.1 }}
				>
					<ProjectListItem project={project} />
				</motion.div>
			))}
		</div>
	);
}
