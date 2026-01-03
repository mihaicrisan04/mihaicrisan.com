// MDX components configuration
// Note: Import components directly from their source files for better tree-shaking
// e.g., import { ProjectImage } from "@/components/mdx/project-image"

import { ProjectImage } from "./project-image";
import { ProjectLinkButton, ProjectLinks } from "./project-links";
import { Separator } from "./separator";

/**
 * MDX components registry for use in MDX configuration.
 * For individual component imports, import directly from the source file.
 */
export const mdxComponents = {
	ProjectImage,
	ProjectLinks,
	ProjectLinkButton,
	Separator,
};
