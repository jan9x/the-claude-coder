import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import type { PostMeta } from "@/lib/notion/types";

interface PostCardProps {
  post: PostMeta;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card hoverable className="group h-full flex flex-col">
      <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
        {post.coverImage && (
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4 -mx-6 -mt-6">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          <Tag>{post.category}</Tag>
        </div>

        <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-neutral-600 mb-4 line-clamp-2 flex-grow">
          {post.excerpt}
        </p>

        <div className="flex items-center text-sm text-neutral-500 mt-auto pt-4 border-t border-neutral-100">
          <time>{formatDate(post.publishedDate)}</time>
          <span className="mx-2">·</span>
          <span>{post.readingTime} min read</span>
        </div>
      </Link>
    </Card>
  );
}
