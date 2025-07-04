import { Separator } from "@/components/ui/separator"
import { ReactNode } from "react"

interface ContentSectionProps {
  title: string
  children: ReactNode
  className?: string
}

export function ContentSection({ title, children, className = "" }: ContentSectionProps) {
  return (
    <section className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </h2>
        <Separator className="flex-1" />
      </div>
      <div>
        {children}
      </div>
    </section>
  )
} 