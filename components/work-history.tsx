import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string | null
  description: string
  current: boolean
}

interface WorkHistoryProps {
  workHistory: WorkExperience[]
}

export function WorkHistory({ workHistory }: WorkHistoryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  const formatDateRange = (startDate: string, endDate: string | null) => {
    const start = formatDate(startDate)
    const end = endDate ? formatDate(endDate) : 'Present'
    return `${start} - ${end}`
  }

  // Filter out current role
  const previousJobs = workHistory.filter(job => !job.current)

  if (previousJobs.length === 0) {
    return null
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="work-history">
        <AccordionTrigger className="text-sm hover:bg-muted/50 -mx-2 px-2 py-1 rounded transition-colors">
          Previous Work Experience ({previousJobs.length})
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 py-2">
            {previousJobs.map((job) => (
              <div key={job.id} className="border-l-2 border-muted pl-4 space-y-2">
                <div className="space-y-1">
                  <h4 className="font-medium text-foreground text-sm">{job.company}</h4>
                  <p className="text-sm text-muted-foreground">{job.position}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateRange(job.startDate, job.endDate)}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {job.description}
                </p>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
} 