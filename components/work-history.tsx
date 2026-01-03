import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import type { WorkExperience } from "@/lib/work";

interface WorkHistoryProps {
	workHistory: WorkExperience[];
}

export function WorkHistory({ workHistory }: WorkHistoryProps) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
		});
	};

	const formatDateRange = (startDate: string, endDate: string | null) => {
		const start = formatDate(startDate);
		const end = endDate ? formatDate(endDate) : "Present";
		return `${start} - ${end}`;
	};

	// Filter out current role
	const previousJobs = workHistory.filter((job) => !job.current);

	if (previousJobs.length === 0) {
		return null;
	}

	return (
		<Accordion className="w-full" collapsible type="single">
			<AccordionItem value="work-history">
				<AccordionTrigger className="-mx-2 rounded px-2 py-1 text-sm transition-colors hover:bg-muted/50 hover:no-underline">
					Previous Work Experience ({previousJobs.length})
				</AccordionTrigger>
				<AccordionContent>
					<div className="space-y-4 py-2">
						{previousJobs.map((job) => (
							<div
								className="space-y-2 border-muted border-l-2 pl-4"
								key={job.id}
							>
								<div className="space-y-1">
									<h4 className="font-medium text-foreground text-sm">
										{job.company}
									</h4>
									<p className="text-muted-foreground text-sm">
										{job.position}
									</p>
									<p className="text-muted-foreground text-xs">
										{formatDateRange(job.startDate, job.endDate)}
									</p>
								</div>
								<p className="text-muted-foreground text-sm leading-relaxed">
									{job.description}
								</p>
							</div>
						))}
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
