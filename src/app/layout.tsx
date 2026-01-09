import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "The Claude Coder - AI-Assisted Development Blog",
    template: "%s | The Claude Coder",
  },
  description:
    "Weekly insights on AI-assisted development, practical tutorials, and tips for shipping better code faster with Claude.",
  keywords: [
    "Claude Code",
    "AI coding",
    "AI development",
    "Claude AI",
    "programming",
    "software development",
  ],
  authors: [{ name: "The Claude Coder" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "The Claude Coder",
    title: "The Claude Coder - AI-Assisted Development Blog",
    description:
      "Weekly insights on AI-assisted development, practical tutorials, and tips for shipping better code faster with Claude.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Claude Coder - AI-Assisted Development Blog",
    description:
      "Weekly insights on AI-assisted development, practical tutorials, and tips for shipping better code faster with Claude.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
