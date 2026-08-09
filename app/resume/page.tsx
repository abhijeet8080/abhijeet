import type { Metadata } from "next";
import { Download } from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { PAGE_SEO } from "@/constant/seo";
import { profile } from "@/constant";

export const metadata: Metadata = constructMetadata(PAGE_SEO.resume);

export default function ResumePage() {
  return (
    <main className="relative z-10 min-h-screen">
      {/* Readability scrim — keeps content legible over any wallpaper */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-md" aria-hidden />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col px-6 pb-28 pt-16 md:px-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-wide text-primary sm:text-4xl">
            Resume
          </h1>
          <p className="mt-2 font-mono text-xs text-muted-foreground sm:text-sm">
            {profile.work.title} · {profile.work.company}
          </p>
        </div>

        <a
          href="/resume.pdf"
          download="Abhijeet_Kadam_Resume.pdf"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:border-card-border-hover hover:bg-card-hover"
        >
          <Download className="h-3.5 w-3.5 text-accent" />
          Download PDF
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <iframe
          src="/resume.pdf#toolbar=0"
          title={`Resume — ${profile.name.full}`}
          className="h-[78vh] w-full"
        />
      </div>
      </div>
    </main>
  );
}
