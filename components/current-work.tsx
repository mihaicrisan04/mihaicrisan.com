"use client";

import { CustomLink } from "@/components/custom-link";
import type { WorkExperience } from "@/lib/work";

interface CurrentWorkProps {
  workData: WorkExperience;
}

export function CurrentWork({ workData }: CurrentWorkProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            {workData.companyUrl ? (
              <CustomLink
                className="font-medium text-foreground"
                external
                href={workData.companyUrl}
              >
                {workData.company}
              </CustomLink>
            ) : (
              <h3 className="font-medium text-foreground">
                {workData.company}
              </h3>
            )}
          </div>
          <p className="mb-1 text-muted-foreground text-sm">
            {workData.position}
          </p>
          <p className="text-muted-foreground text-xs">
            {formatDate(workData.startDate)} - Present
          </p>
        </div>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {workData.description}
      </p>
    </div>
  );
}
