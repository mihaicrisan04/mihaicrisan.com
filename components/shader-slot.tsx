"use client";

import { usePathname } from "next/navigation";
import { ShaderBackground } from "@/components/shader-background";

export function ShaderSlot() {
  const pathname = usePathname();
  const isBlogPost = pathname?.startsWith("/blog/");
  if (isBlogPost) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <ShaderBackground />
    </div>
  );
}
