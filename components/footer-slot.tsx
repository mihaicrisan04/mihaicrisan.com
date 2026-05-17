"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";

export function FooterSlot() {
  const pathname = usePathname();
  if (pathname === "/") {
    return null;
  }
  return <Footer />;
}
