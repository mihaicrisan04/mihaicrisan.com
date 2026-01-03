import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

interface ContentSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ContentSection({
  title,
  children,
  className = "",
}: ContentSectionProps) {
  return (
    <section className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <h2 className="font-medium text-muted-foreground text-sm uppercase tracking-wider">
          {title}
        </h2>
        <Separator className="flex-1" />
      </div>
      <div>{children}</div>
    </section>
  );
}
