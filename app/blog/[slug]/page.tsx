import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { PageBack } from "@/components/page-back";
import { Reveal } from "@/components/reveal";
import { formatBlogDate, getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog";

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} — mihai crisan`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pt-12 pb-24">
      <Reveal className="mb-12">
        <PageBack href="/blog" label="blog" />
      </Reveal>

      <Reveal
        as="header"
        className="mb-12 border-border/40 border-b pb-8"
        delay={0.05}
      >
        <time className="block font-mono text-muted-foreground text-sm">
          {formatBlogDate(post.date)}
        </time>
        <h1 className="mt-3 mb-3 font-medium text-foreground text-lg tracking-tight">
          {post.title}
        </h1>
        {post.description && (
          <p className="text-base text-foreground/85 leading-relaxed">
            {post.description}
          </p>
        )}
      </Reveal>

      <Reveal as="article" className="prose max-w-none" delay={0.1}>
        <MDXRemote source={post.content} />
      </Reveal>
    </div>
  );
}
