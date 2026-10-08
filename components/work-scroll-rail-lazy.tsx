"use client";

import dynamic from "next/dynamic";
import type { WorkRailItem } from "./work-scroll-rail";

// Desktop-only decorative rail with spring physics (motion). Loaded after
// hydration so it never sits on the critical path.
const WorkScrollRail = dynamic(
  () => import("./work-scroll-rail").then((m) => m.WorkScrollRail),
  { ssr: false }
);

export function WorkScrollRailLazy({ items }: { items: WorkRailItem[] }) {
  return <WorkScrollRail items={items} />;
}
