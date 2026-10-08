import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx";
import { PageBack } from "@/components/page-back";
import { ProjectHero } from "@/components/project-hero";
import { PromoVideoPlayerLazy } from "@/components/promo-video-player-lazy";
import { Reveal } from "@/components/reveal";
import { getAllProjectSlugs, getProjectBySlug } from "@/lib/projects";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
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

function formatMonth(date: string) {
  return new Date(date)
    .toLocaleDateString("en-US", { year: "numeric", month: "short" })
    .toLowerCase();
}

function formatDateRange(
  startDate: string,
  endDate: string | undefined,
  ongoing: boolean | undefined
) {
  const start = formatMonth(startDate);
  if (endDate) {
    return `${start} → ${formatMonth(endDate)}`;
  }
  if (ongoing) {
    return `${start} → present`;
  }
  return start;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pt-12 pb-24">
      <Reveal className="mb-12">
        <PageBack href="/work" label="work" />
      </Reveal>

      <Reveal
        as="header"
        className="mb-12 border-border/40 border-b pb-8"
        delay={0.05}
      >
        <h1 className="mb-2 font-medium text-foreground text-lg tracking-tight">
          {project.website ? (
            <a
              className="group inline-flex items-center gap-1 transition-opacity hover:opacity-70"
              href={project.website}
              rel="noopener noreferrer"
              target="_blank"
            >
              {project.name}
              <span className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                ↗
              </span>
            </a>
          ) : (
            project.name
          )}
        </h1>

        <p className="mb-6 font-mono text-muted-foreground text-sm">
          {formatDateRange(project.startDate, project.endDate, project.ongoing)}
        </p>

        <p className="text-base text-foreground/85 leading-relaxed">
          {project.shortDescription}
        </p>

        <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1">
          {project.techStack.map((tech) => (
            <span
              className="font-mono text-muted-foreground/70 text-sm"
              key={tech.name}
            >
              {tech.name.toLowerCase()}
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        {project.preview?.promoVideo ? (
          <div className="mb-12">
            <PromoVideoPlayerLazy
              poster={project.preview.image}
              src={project.preview.promoVideo}
            />
          </div>
        ) : (
          <ProjectHero project={project} />
        )}
      </Reveal>

      <Reveal className="prose max-w-none" delay={0.15}>
        <MDXRemote components={mdxComponents} source={project.content} />
      </Reveal>
    </div>
  );
}
