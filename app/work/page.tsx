import { PageBack } from "@/components/page-back";
import { ProjectThumbnail } from "@/components/project-thumbnail";
import { getProjectsGroupedByYear } from "@/lib/projects";

export const metadata = {
  title: "work — mihai crisan",
};

export default function ProjectsPage() {
  const groups = getProjectsGroupedByYear();
  const total = groups.reduce((sum, g) => sum + g.projects.length, 0);

  return (
    <div className="pb-32">
      <div className="mx-auto max-w-2xl px-6 pt-12">
        <div className="mb-16 flex items-center justify-between">
          <PageBack />
          <span className="font-mono text-muted-foreground/50 text-xs tabular-nums">
            {String(total).padStart(2, "0")}
          </span>
        </div>

        <h1 className="font-medium text-foreground text-lg tracking-tight">
          work
        </h1>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">
          have a project in mind, or just want to talk shop? grab a{" "}
          <a
            className="font-medium text-foreground transition-opacity hover:opacity-70"
            href="https://cal.com/mihai-crisan/30min"
            rel="noopener noreferrer"
            target="_blank"
          >
            30 min intro call
          </a>
          .
        </p>
      </div>

      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-6 hidden w-px bg-border/40 sm:block"
        />

        {groups.map((group, gi) => (
          <section className="relative mt-20" key={group.year}>
            <div className="pointer-events-none absolute inset-y-0 left-6 hidden -translate-x-1/2 select-none sm:block">
              <div className="sticky top-3">
                <span className="block whitespace-nowrap bg-background px-2 py-3 font-pixel text-muted-foreground/70 text-xs uppercase tracking-[0.15em]">
                  {group.year}
                </span>
              </div>
            </div>

            <div className="mx-auto max-w-2xl px-6">
              {gi === 0 ? (
                <div className="mb-6 font-pixel text-muted-foreground/70 text-[10px] uppercase tracking-[0.15em] sm:hidden">
                  {group.year}
                </div>
              ) : (
                <div className="-mt-8 mb-10 flex items-center gap-3 sm:hidden">
                  <span className="font-pixel text-muted-foreground/70 text-[10px] uppercase tracking-[0.15em]">
                    {group.year}
                  </span>
                  <div className="h-px flex-1 bg-border/40" />
                </div>
              )}

              <ul className="grid grid-cols-1 gap-0">
                {group.projects.map((project, index) => (
                  <ProjectThumbnail
                    index={index}
                    key={project.slug}
                    project={project}
                  />
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
