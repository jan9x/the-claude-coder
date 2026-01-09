import { Container } from "@/components/layout/Container";
import { PostGrid } from "@/components/features/PostGrid";
import { getPublishedPosts } from "@/lib/notion/queries";
import type { Metadata } from "next";

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: "Blog",
  description:
    "All articles about AI-assisted development, Claude Code tutorials, and tips for shipping better code faster.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <section className="py-16">
      <Container>
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            All Articles
          </h1>
          <p className="text-xl text-neutral-600">
            Insights on AI-assisted development, practical tutorials, and tips
            for shipping better code faster.
          </p>
        </div>

        <PostGrid posts={posts} />
      </Container>
    </section>
  );
}
