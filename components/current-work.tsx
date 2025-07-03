import { Badge } from "@/components/ui/badge"

interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string | null
  description: string
  current: boolean
}

interface CurrentWorkProps {
  workData: WorkExperience
}

export function CurrentWork({ workData }: CurrentWorkProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-foreground">{workData.company}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-1">{workData.position}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(workData.startDate)} - Present
          </p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {workData.description}
      </p>
    </div>
  )
} 