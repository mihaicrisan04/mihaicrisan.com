import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const projectsContentDirectory = path.join(process.cwd(), "content/projects");
const blogContentDirectory = path.join(process.cwd(), "content/blog");
const MD_EXTENSION_REGEX = /\.md$/;

export function getProjectMarkdown(slug: string) {
	try {
		const filePath = path.join(projectsContentDirectory, `${slug}.md`);

		if (!fs.existsSync(filePath)) {
			return null;
		}

		const fileContents = fs.readFileSync(filePath, "utf8");
		const { data, content } = matter(fileContents);

		return {
			frontmatter: data,
			content,
		};
	} catch (error) {
		console.error(`Error reading project markdown for ${slug}:`, error);
		return null;
	}
}

export function getBlogMarkdown(slug: string) {
	try {
		const filePath = path.join(blogContentDirectory, `${slug}.md`);

		if (!fs.existsSync(filePath)) {
			return null;
		}

		const fileContents = fs.readFileSync(filePath, "utf8");
		const { data, content } = matter(fileContents);

		return {
			frontmatter: data,
			content,
		};
	} catch (error) {
		console.error(`Error reading blog markdown for ${slug}:`, error);
		return null;
	}
}

export function getAllProjectMarkdownSlugs() {
	try {
		if (!fs.existsSync(projectsContentDirectory)) {
			return [];
		}

		const files = fs.readdirSync(projectsContentDirectory);
		return files
			.filter((file) => file.endsWith(".md"))
			.map((file) => file.replace(MD_EXTENSION_REGEX, ""));
	} catch (error) {
		console.error("Error reading project markdown files:", error);
		return [];
	}
}

export function getAllBlogMarkdownSlugs() {
	try {
		if (!fs.existsSync(blogContentDirectory)) {
			return [];
		}

		const files = fs.readdirSync(blogContentDirectory);
		return files
			.filter((file) => file.endsWith(".md"))
			.map((file) => file.replace(MD_EXTENSION_REGEX, ""));
	} catch (error) {
		console.error("Error reading blog markdown files:", error);
		return [];
	}
}

export function getAllBlogPosts() {
	try {
		const slugs = getAllBlogMarkdownSlugs();

		const posts = slugs.map((slug) => {
			const filePath = path.join(blogContentDirectory, `${slug}.md`);
			const fileContents = fs.readFileSync(filePath, "utf8");
			const { data } = matter(fileContents);

			return {
				slug,
				title: data.title || "Untitled",
				description: data.description || "",
				date: data.date || "",
				...data,
			};
		});

		// Sort by date (newest first)
		return posts.sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
		);
	} catch (error) {
		console.error("Error reading blog posts:", error);
		return [];
	}
}
