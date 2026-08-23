import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { constructMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { PAGE_SEO } from "@/constant/seo";
import { profile, experience } from "@/constant";

export const metadata: Metadata = constructMetadata(PAGE_SEO.about);

export default function AboutPage() {
  const jsonLd = generateBreadcrumbJsonLd([{ name: "About", url: "/about" }]);
  const current = experience.find((e) => e.current) ?? experience[0];

  return (
    <main className="relative z-10 min-h-screen">
      {/* Readability scrim — keeps text legible over any wallpaper */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-md" aria-hidden />

      <div className="relative mx-auto w-full max-w-3xl px-6 pb-28 pt-16 md:px-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-accent" />
          Back to abhi os
        </Link>

        <p className="mt-8 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {"// About"}
        </p>
        <h1 className="mt-3 font-heading text-4xl font-bold text-primary sm:text-5xl">
          {profile.name.full}
        </h1>
        <p className="mt-2 font-mono text-sm text-muted-foreground">
          {profile.work.title} at {profile.work.company} · {profile.curr_location.city}, {profile.curr_location.state}
        </p>

        <div className="mt-8 flex flex-col gap-4">
          {profile.about.map((paragraph, i) => (
            <p
              key={i}
              className="max-w-2xl text-base leading-relaxed text-foreground/80"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {"// Current role"}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/80">
            Since {current.startDate.mm} {current.startDate.yyyy}, Abhijeet has
            been {current.role} at {current.company}, where he owns backend
            infrastructure and parts of the frontend for a B2B procurement
            platform — RFQ automation, vendor management, and a bidirectional
            sync with Microsoft Business Central.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {"// Education"}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/80">
            {profile.education.degree}, {profile.education.major} —{" "}
            {profile.education.uni}, {profile.education.location.city},{" "}
            {profile.education.location.state} ({profile.education.batch}).
          </p>
        </section>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/60 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:border-card-border-hover hover:bg-card-hover"
          >
            See projects
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/60 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:border-card-border-hover hover:bg-card-hover"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </main>
  );
}
