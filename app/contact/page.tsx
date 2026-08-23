import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { constructMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { PAGE_SEO } from "@/constant/seo";
import { profile, socials } from "@/constant";

export const metadata: Metadata = constructMetadata(PAGE_SEO.contact);

export default function ContactPage() {
  const jsonLd = generateBreadcrumbJsonLd([
    { name: "Contact", url: "/contact" },
  ]);

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
          {"// Contact"}
        </p>
        <h1 className="mt-3 font-heading text-4xl font-bold text-primary sm:text-5xl">
          Get in touch
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/80">
          {profile.name.first} is always open to discussing new projects,
          creative ideas, or opportunities to be part of your vision — whether
          that&apos;s a full-time role, a contract engagement, or a quick
          technical question about one of the projects on this site. The
          fastest way to reach him is email; for a quicker back-and-forth,
          LinkedIn works too. He&apos;s based in {profile.curr_location.city},{" "}
          {profile.curr_location.state}, India, and works with teams across
          time zones.
        </p>

        <section className="mt-10 flex flex-col gap-3">
          {socials.map((s) =>
            s.url ? (
              <a
                key={s.name}
                href={s.url}
                target={s.name === "Email" ? undefined : "_blank"}
                rel={s.name === "Email" ? undefined : "noopener noreferrer"}
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-background/60 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:border-card-border-hover hover:bg-card-hover"
              >
                {s.name}: {s.handle}
                <ArrowUpRight className="h-3.5 w-3.5 text-accent" />
              </a>
            ) : (
              <span
                key={s.name}
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-background/60 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {s.name}: {s.handle}
              </span>
            )
          )}
        </section>

        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Prefer a form? The interactive contact form on the{" "}
          <Link href="/#contact" className="text-accent hover:underline">
            homepage
          </Link>{" "}
          sends straight to {profile.email} — see the{" "}
          <Link href="/privacy" className="text-accent hover:underline">
            privacy policy
          </Link>{" "}
          for what happens to what you submit there.
        </p>
      </div>
    </main>
  );
}
