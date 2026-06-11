// Work experience — single source of truth in the repo, ingested into
// Convex (documents table + RAG) by scripts/ingest.ts, like project MDX.

export interface WorkExperienceEntry {
  id: string;
  company: string;
  companyUrl?: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string;
  current: boolean;
}

export const workExperience: WorkExperienceEntry[] = [
  {
    id: "wolfpack-digital",
    company: "WolfPack Digital",
    companyUrl: "https://wolfpack-digital.com",
    position: "Fullstack Software Developer",
    startDate: "2025-07-01",
    endDate: null,
    description:
      "Building scalable web applications with deep focus on design and user experience.",
    current: true,
  },
  {
    id: "fullstack-developer",
    company: "Freelance",
    position: "Fullstack Software Developer",
    startDate: "2024-12-01",
    endDate: null,
    description:
      "Developed web applications for various clients, focusing on building scalable and efficient solutions.",
    current: false,
  },
];
