export const TOOL_LABELS: Record<string, { active: string; done: string }> = {
  searchPortfolio: {
    active: "Searching portfolio",
    done: "Searched portfolio",
  },
  listProjects: {
    active: "Browsing projects",
    done: "Found projects",
  },
  getProjectDetails: {
    active: "Reading project details",
    done: "Loaded project details",
  },
  getWorkExperience: {
    active: "Looking up work history",
    done: "Got work history",
  },
  getBlogPosts: {
    active: "Checking blog posts",
    done: "Found blog posts",
  },
  getCurrentTime: {
    active: "Checking the time",
    done: "Got the time",
  },
};

export function getToolLabel(toolName: string): {
  active: string;
  done: string;
} {
  return (
    TOOL_LABELS[toolName] ?? {
      active: `Running ${toolName}`,
      done: `Ran ${toolName}`,
    }
  );
}

export function extractToolName(part: {
  type?: string;
  toolName?: string;
}): string | null {
  if (part.type === "dynamic-tool") {
    return part.toolName ?? null;
  }
  if (typeof part.type === "string" && part.type.startsWith("tool-")) {
    return part.toolName ?? part.type.replace("tool-", "");
  }
  return null;
}
