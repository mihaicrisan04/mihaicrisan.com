"use client";

import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export type StepsItemProps = React.ComponentProps<"div">;

export const StepsItem = ({
  children,
  className,
  ...props
}: StepsItemProps) => (
  <div className={cn("text-muted-foreground text-sm", className)} {...props}>
    {children}
  </div>
);

export type StepsTriggerProps = React.ComponentProps<
  typeof CollapsibleTrigger
> & {
  leftIcon?: React.ReactNode;
};

export const StepsTrigger = ({
  children,
  className,
  leftIcon,
  ...props
}: StepsTriggerProps) => (
  <CollapsibleTrigger
    className={cn(
      "group/step flex w-full cursor-pointer items-center justify-start gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground",
      className
    )}
    {...props}
  >
    {leftIcon ? (
      <span className="inline-flex size-4 shrink-0 items-center justify-center">
        {leftIcon}
      </span>
    ) : null}
    <span>{children}</span>
    <ChevronDown className="size-3.5 shrink-0 opacity-0 transition-all duration-150 group-hover/step:opacity-100 group-data-[state=open]/step:rotate-180" />
  </CollapsibleTrigger>
);

export type StepsContentProps = React.ComponentProps<
  typeof CollapsibleContent
> & {
  bar?: React.ReactNode;
};

export const StepsContent = ({
  children,
  className,
  bar,
  ...props
}: StepsContentProps) => {
  return (
    <CollapsibleContent
      className={cn(
        "overflow-hidden text-popover-foreground data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
        className
      )}
      {...props}
    >
      <div className="mt-3 ml-[7px] grid min-w-0 max-w-full grid-cols-[min-content_minmax(0,1fr)] items-start gap-x-3">
        <div className="min-w-0 self-stretch">{bar ?? <StepsBar />}</div>
        <div className="min-w-0 space-y-2">{children}</div>
      </div>
    </CollapsibleContent>
  );
};

export type StepsBarProps = React.HTMLAttributes<HTMLDivElement>;

export const StepsBar = ({ className, ...props }: StepsBarProps) => (
  <div
    aria-hidden
    className={cn("h-full w-[2px] bg-muted", className)}
    {...props}
  />
);

export type StepsProps = React.ComponentProps<typeof Collapsible>;

export function Steps({ defaultOpen = true, className, ...props }: StepsProps) {
  return (
    <Collapsible
      className={cn(className)}
      defaultOpen={defaultOpen}
      {...props}
    />
  );
}
