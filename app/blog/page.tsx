import Link from "next/link";
import { PageBack } from "@/components/page-back";
import { Reveal } from "@/components/reveal";
import { formatBlogDate, getAllBlogPosts } from "@/lib/blog";

export const metadata = {
  title: "blog — mihai crisan",
  description: "notes, things i find, occasional rants.",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="mx-auto max-w-xl px-6 pt-12 pb-24">
      <Reveal className="mb-12 flex items-center justify-between">
        <PageBack />
        <span className="font-mono text-muted-foreground/50 text-xs tabular-nums">
          {String(posts.length).padStart(2, "0")}
        </span>
      </Reveal>

      <Reveal as="header" className="mb-10" delay={0.05}>
        <h1 className="mb-3 font-medium text-foreground text-lg tracking-tight">
          blog
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          notes, things i find, occasional rants.
        </p>
      </Reveal>

      {posts.length > 0 ? (
        <div className="border-border/40 border-t">
          {posts.map((post, index) => (
            <Reveal delay={0.1 + index * 0.04} key={post.slug}>
              <Link
                className="group flex items-baseline justify-between border-border/40 border-b py-4 transition-[translate] duration-200 hover:translate-x-1"
                href={`/blog/${post.slug}`}
              >
                <span className="flex items-baseline gap-4">
                  <time className="font-mono text-muted-foreground text-sm tabular-nums">
                    {formatBlogDate(post.date)}
                  </time>
                  <span className="text-base text-foreground">
                    {post.title}
                  </span>
                </span>
                <span className="font-mono text-muted-foreground text-sm opacity-50 transition-opacity duration-200 group-hover:opacity-100">
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal delay={0.1}>
          <p className="font-mono text-muted-foreground/60 text-sm">empty.</p>
        </Reveal>
      )}
    </div>
  );
}
