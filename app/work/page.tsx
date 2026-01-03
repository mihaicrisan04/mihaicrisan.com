import { getAllProjects } from "@/lib/projects";
import { ProjectListClient } from "./project-list-client";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="mx-auto max-w-xl px-6">
      <div className="flex min-h-[55vh] flex-col justify-start py-8">
        <ProjectListClient projects={projects} />
      </div>
    </div>
  );
}
