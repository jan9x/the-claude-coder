"use client";

import Link from "next/link";
import { Container } from "./Container";
import { Button } from "@/components/ui/Button";

export function Header() {
  const scrollToNewsletter = () => {
    const element = document.getElementById("newsletter");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <Container>
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-neutral-900">
              The Claude Coder
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/blog"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Blog
            </Link>
            <Button size="sm" onClick={scrollToNewsletter}>
              Subscribe
            </Button>
          </nav>
        </div>
      </Container>
    </header>
  );
}
