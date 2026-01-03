import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";

interface BlogPost {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	publishedAt: string;
	updatedAt: string;
	status: string;
	featured: boolean;
	readTime: number;
	category: string;
	tags: string[];
	coverImage: {
		url: string;
		alt: string;
	};
	author: {
		name: string;
		avatar: string;
	};
}

interface BlogPostLinkProps {
	post: BlogPost;
}

export function BlogPostLink({ post }: BlogPostLinkProps) {
	const getCategoryColor = (category: string) => {
		switch (category) {
			case "development":
				return "bg-blue-500/10 text-blue-600 border-blue-500/20";
			case "ai":
				return "bg-purple-500/10 text-purple-600 border-purple-500/20";
			case "design":
				return "bg-pink-500/10 text-pink-600 border-pink-500/20";
			case "machine-learning":
				return "bg-green-500/10 text-green-600 border-green-500/20";
			case "developer-tools":
				return "bg-orange-500/10 text-orange-600 border-orange-500/20";
			default:
				return "bg-gray-500/10 text-gray-600 border-gray-500/20";
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<Link href={`/blog/${post.slug}`}>
					<div className="group -mx-2 flex cursor-pointer items-center justify-between rounded px-2 py-1 transition-colors hover:bg-muted/50">
						<span className="text-sm transition-colors hover:text-foreground">
							{post.title}
						</span>
						<ArrowRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
					</div>
				</Link>
			</HoverCardTrigger>
			<HoverCardContent align="start" className="w-80 p-4" side="right">
				<div className="space-y-3">
					{/* Header */}
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<h4 className="line-clamp-2 font-semibold text-foreground">
								{post.title}
							</h4>
							<div className="mt-2 flex items-center gap-2">
								<Badge
									className={`text-xs ${getCategoryColor(post.category)}`}
									variant="outline"
								>
									{post.category}
								</Badge>
								{post.featured && (
									<Badge className="text-xs" variant="secondary">
										Featured
									</Badge>
								)}
							</div>
						</div>
					</div>

					{/* Excerpt */}
					<p className="line-clamp-3 text-muted-foreground text-sm leading-relaxed">
						{post.excerpt}
					</p>

					{/* Tags */}
					<div className="space-y-2">
						<h5 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
							Tags
						</h5>
						<div className="flex flex-wrap gap-1">
							{post.tags.slice(0, 4).map((tag) => (
								<Badge className="text-xs" key={tag} variant="secondary">
									{tag}
								</Badge>
							))}
							{post.tags.length > 4 && (
								<Badge className="text-xs" variant="secondary">
									+{post.tags.length - 4} more
								</Badge>
							)}
						</div>
					</div>

					{/* Meta Information */}
					<div className="space-y-2 border-t pt-2">
						<div className="flex items-center gap-2 text-muted-foreground text-xs">
							<Calendar className="h-3 w-3" />
							<span>{formatDate(post.publishedAt)}</span>
						</div>
						<div className="flex items-center gap-2 text-muted-foreground text-xs">
							<Clock className="h-3 w-3" />
							<span>{post.readTime} min read</span>
						</div>
						<div className="flex items-center gap-2 text-muted-foreground text-xs">
							<User className="h-3 w-3" />
							<span>{post.author.name}</span>
						</div>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
