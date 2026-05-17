import { PageBack } from "@/components/page-back";
import { getAllProjects } from "@/lib/projects";
import { ProjectListClient } from "./project-list-client";

export const metadata = {
  title: "work — mihai crisan",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="mx-auto max-w-xl px-6 pt-12 pb-24">
      <div className="mb-12 flex items-center justify-between">
        <PageBack />
        <span className="font-mono text-muted-foreground/60 text-xs">
          {String(projects.length).padStart(2, "0")} projects
        </span>
      </div>
      <h1 className="mb-10 font-medium text-foreground text-lg tracking-tight">
        work
      </h1>
      <ProjectListClient projects={projects} />
    </div>
  );
}
