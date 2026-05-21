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

export interface ProjectPreview {
  video?: string;
  gif?: string;
  image?: string;
  promoVideo?: string;
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
  ongoing?: boolean;
  techStack: TechStackItem[];
  links: ProjectLink[];
  images: ProjectImage[];
  preview?: ProjectPreview;
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

export interface ProjectYearGroup {
  year: number;
  projects: Project[];
}

// Groups projects by start-year, with featured first then by date desc within each year.
// Year groups themselves are sorted newest-first for the work timeline.
export function getProjectsGroupedByYear(): ProjectYearGroup[] {
  const buckets = new Map<number, Project[]>();

  for (const project of getAllProjects()) {
    const year = new Date(project.startDate).getFullYear();
    const arr = buckets.get(year) ?? [];
    arr.push(project);
    buckets.set(year, arr);
  }

  return Array.from(buckets.entries())
    .map(([year, items]) => ({
      year,
      projects: items.sort((a, b) => {
        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1;
        }
        return (
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      }),
    }))
    .sort((a, b) => b.year - a.year);
}
