import { Container } from "./Container";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-100 py-12 mt-20">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-neutral-500 text-sm">
            &copy; {currentYear} The Claude Coder. All rights reserved.
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/blog"
              className="text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Blog
            </Link>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Twitter
            </a>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
