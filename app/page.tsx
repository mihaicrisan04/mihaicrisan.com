import workExperienceData from "@/data/work-experience.json";
import { getFeaturedProjects } from "@/lib/projects";
import { HomeClient } from "./home-client";

export default function Home() {
	const currentRole = workExperienceData.find((job) => job.current);
	const featuredProjects = getFeaturedProjects();

	return (
		<HomeClient
			currentRole={currentRole}
			featuredProjects={featuredProjects}
			workExperience={workExperienceData}
		/>
	);
}
