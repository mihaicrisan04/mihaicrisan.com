import { notFound } from "next/navigation";
import { getAllProjectSlugs, getProjectBySlug } from "@/lib/projects";
import { ProjectDetailClient } from "./project-detail-client";

interface ProjectPageProps {
	params: Promise<{
		slug: string;
	}>;
}

export async function generateStaticParams() {
	const slugs = getAllProjectSlugs();
	return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
	const { slug } = await params;
	const project = getProjectBySlug(slug);

	if (!project) {
		return {
			title: "Project Not Found",
		};
	}

	return {
		title: project.name,
		description: project.shortDescription,
	};
}

export default async function ProjectPage({ params }: ProjectPageProps) {
	const { slug } = await params;
	const project = getProjectBySlug(slug);

	if (!project) {
		notFound();
	}

	return <ProjectDetailClient project={project} />;
}
