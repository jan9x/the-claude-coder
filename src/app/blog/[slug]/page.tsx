import { Container } from "@/components/layout/Container";
import { Tag } from "@/components/ui/Tag";
import { NotionRenderer } from "@/lib/notion/renderer";
import { getPostBySlug, getPublishedPosts, getPageBlocks } from "@/lib/notion/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const revalidate = 3600; // Revalidate every hour

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedDate,
      tags: post.tags,
      images: post.coverImage ? [post.coverImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const blocks = await getPageBlocks(post.id);

  return (
    <article className="py-12">
      <Container size="md">
        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            <Tag>{post.category}</Tag>
            {post.tags.map((tag) => (
              <Tag key={tag} className="bg-neutral-100 text-neutral-600">
                {tag}
              </Tag>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-neutral-500">
            {post.author.avatar && (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div>
              <div className="font-medium text-neutral-900">
                {post.author.name}
              </div>
              <div className="text-sm">
                <time>{formatDate(post.publishedDate)}</time>
                <span className="mx-2">·</span>
                <span>{post.readingTime} min read</span>
              </div>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose max-w-none">
          <NotionRenderer blocks={blocks as BlockObjectResponse[]} />
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-neutral-200">
          <Link
            href="/blog"
            className="inline-flex items-center text-primary-500 hover:text-primary-600 font-medium transition-colors"
          >
            ← Back to all articles
          </Link>
        </footer>
      </Container>
    </article>
  );
}
