interface LinkShimmerProps {
  href: string;
  children: React.ReactNode;
}

export function LinkShimmer({ href, children }: LinkShimmerProps) {
  return (
    <a
      className="link-shimmer whitespace-nowrap font-medium"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}
