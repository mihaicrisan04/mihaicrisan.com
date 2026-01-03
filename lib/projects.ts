import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const projectsDirectory = path.join(process.cwd(), "content/projects");

// Top-level regex pattern for performance
const MDX_EXTENSION_PATTERN = /\.mdx$/;

export interface TechStackItem {
	name: string;
	category: string;
}

export interface ProjectLink {
	name: string;
	url: string;
	type: "github" | "live" | "demo" | "download";
}

export interface ProjectImage {
	src: string;
	alt: string;
}

export interface ProjectFrontmatter {
	name: string;
	slug: string;
	website?: string;
	shortDescription: string;
	fullDescription?: string;
	status?: "completed" | "in-progress" | "planning";
	category: string;
	featured: boolean;
	startDate: string;
	endDate?: string;
	techStack: TechStackItem[];
	links: ProjectLink[];
	images: ProjectImage[];
	highlights?: string[];
}

export interface Project extends ProjectFrontmatter {
	content: string;
}

export function getAllProjectSlugs(): string[] {
	if (!fs.existsSync(projectsDirectory)) {
		return [];
	}
	const fileNames = fs.readdirSync(projectsDirectory);
	return fileNames
		.filter((fileName) => fileName.endsWith(".mdx"))
		.map((fileName) => fileName.replace(MDX_EXTENSION_PATTERN, ""));
}

export function getProjectBySlug(slug: string): Project | null {
	const fullPath = path.join(projectsDirectory, `${slug}.mdx`);

	if (!fs.existsSync(fullPath)) {
		return null;
	}

	const fileContents = fs.readFileSync(fullPath, "utf8");
	const { data, content } = matter(fileContents);

	return {
		...(data as ProjectFrontmatter),
		content,
	};
}

export function getAllProjects(): Project[] {
	const slugs = getAllProjectSlugs();
	const projects = slugs
		.map((slug) => getProjectBySlug(slug))
		.filter((project): project is Project => project !== null)
		.sort((a, b) => {
			// Sort by startDate descending (newest first)
			return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
		});

	return projects;
}

export function getFeaturedProjects(): Project[] {
	return getAllProjects().filter((project) => project.featured);
}

export function getProjectsByCategory(category: string): Project[] {
	return getAllProjects().filter((project) => project.category === category);
}
