export const TOOL_LABELS: Record<string, { active: string; done: string }> = {
  searchPortfolio: {
    active: "searching portfolio",
    done: "searched portfolio",
  },
  listProjects: {
    active: "browsing projects",
    done: "found projects",
  },
  getProjectDetails: {
    active: "reading project details",
    done: "loaded project details",
  },
  getWorkExperience: {
    active: "looking up work history",
    done: "got work history",
  },
  getAboutMihai: {
    active: "reading about mihai",
    done: "read about mihai",
  },
  getBlogPosts: {
    active: "checking blog posts",
    done: "found blog posts",
  },
  getCurrentTime: {
    active: "checking the time",
    done: "got the time",
  },
};

export function getToolLabel(toolName: string): {
  active: string;
  done: string;
} {
  return (
    TOOL_LABELS[toolName] ?? {
      active: `running ${toolName}`,
      done: `ran ${toolName}`,
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
