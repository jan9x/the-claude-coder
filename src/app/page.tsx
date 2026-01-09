import { Container } from "@/components/layout/Container";
import { HeroSection } from "@/components/features/HeroSection";
import { PostGrid } from "@/components/features/PostGrid";
import { getPublishedPosts } from "@/lib/notion/queries";
import Link from "next/link";

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  const posts = await getPublishedPosts();
  const recentPosts = posts.slice(0, 6);

  return (
    <>
      <Container>
        <HeroSection />
      </Container>

      <section className="py-16 bg-neutral-50">
        <Container>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-neutral-900">
              Recent Articles
            </h2>
            <Link
              href="/blog"
              className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
            >
              View all articles →
            </Link>
          </div>

          <PostGrid posts={recentPosts} />
        </Container>
      </section>
    </>
  );
}
