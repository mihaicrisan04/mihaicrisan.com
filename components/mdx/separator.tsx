import { Separator as BaseSeparator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface MDXSeparatorProps {
	className?: string;
	orientation?: "horizontal" | "vertical";
	spacing?: "sm" | "md" | "lg" | "xl";
}

const spacingClasses = {
	sm: "my-4",
	md: "my-8",
	lg: "my-12",
	xl: "my-16",
};

export function Separator({
	className,
	orientation = "horizontal",
	spacing = "md",
}: MDXSeparatorProps) {
	return (
		<div className={cn(spacingClasses[spacing], className)}>
			<BaseSeparator orientation={orientation} />
		</div>
	);
}
