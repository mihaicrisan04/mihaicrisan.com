import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PageBackProps {
  label?: string;
  href?: string;
  direction?: "back" | "forward";
  external?: boolean;
  className?: string;
}

export function PageBack({
  label = "mihai",
  href = "/",
  direction = "back",
  external = false,
  className: classNameOverride = "",
}: PageBackProps) {
  const isForward = direction === "forward";

  const className =
    `group inline-flex items-center gap-2 font-mono text-muted-foreground text-sm transition-colors hover:text-foreground ${classNameOverride}`.trim();

  const icon = (
    <span
      className={`inline-flex transition-[translate] duration-200 ${
        isForward
          ? "group-hover:translate-x-[3px]"
          : "group-hover:-translate-x-[3px]"
      }`}
    >
      {isForward ? (
        <ArrowRight className="h-3.5 w-3.5" />
      ) : (
        <ArrowLeft className="h-3.5 w-3.5" />
      )}
    </span>
  );

  const content = (
    <>
      {!isForward && icon}
      <span>{label}</span>
      {isForward && icon}
    </>
  );

  if (external) {
    return (
      <a
        className={className}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {content}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {content}
    </Link>
  );
}
