import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { PAGE_SEO } from "@/constant/seo";

export const metadata: Metadata = constructMetadata({
  ...PAGE_SEO.blog,
  // Empty placeholder page — indexing it now would put a near-content
  // page under the domain and dilute topical authority. Drop this once
  // real posts exist.
  noIndex: true,
});

export default function BlogPage() {
  return (
    <main className="relative z-10 min-h-screen">
      {/* Readability scrim — keeps text legible over any wallpaper */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-md" aria-hidden />

      <div className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {"// Blog"}
        </p>
        <h1 className="mt-4 font-heading text-4xl font-bold text-primary sm:text-5xl">
          Nothing here yet.
        </h1>
        <p className="mt-4 max-w-md font-mono text-sm leading-relaxed text-foreground/70">
          I&apos;m writing about building production AI systems — voice agents,
          cited RAG pipelines, agent SDKs, and the reliability work in between.
          Check back soon.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-accent" />
          Back to abhi os
        </Link>
      </div>
    </main>
  );
}
