import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { constructMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { PAGE_SEO } from "@/constant/seo";
import { profile } from "@/constant";

export const metadata: Metadata = constructMetadata(PAGE_SEO.privacy);

const LAST_UPDATED = "2026-08-23";

export default function PrivacyPage() {
  const jsonLd = generateBreadcrumbJsonLd([
    { name: "Privacy", url: "/privacy" },
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
          {"// Privacy"}
        </p>
        <h1 className="mt-3 font-heading text-4xl font-bold text-primary sm:text-5xl">
          Privacy policy
        </h1>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          Last updated {LAST_UPDATED}
        </p>

        <div className="mt-8 flex flex-col gap-8">
          <section>
            <h2 className="font-heading text-lg font-bold text-primary">
              What this site is
            </h2>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-foreground/80">
              abhijeetkadam.in is the personal portfolio of {profile.name.full},
              a Next.js application deployed on Vercel. It has no user
              accounts, no e-commerce, and no third-party advertising or
              analytics scripts. This policy covers the one place the site
              collects anything from you: the contact form.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary">
              What the contact form collects
            </h2>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-foreground/80">
              Submitting the contact form on the homepage sends your name,
              email address, stated reason for contacting, and message
              directly to {profile.email} via an outbound SMTP email — the
              same as sending a regular email. Nothing you submit is written
              to a database, stored in a file, or shared with any third
              party. If email delivery fails, the submission is discarded and
              not retried or logged anywhere beyond a server error log used
              only for debugging delivery failures.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary">
              Cookies & tracking
            </h2>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-foreground/80">
              This site does not set cookies, does not use any analytics or
              advertising pixels, and does not fingerprint or track visitors
              across sessions. Your choice of desktop wallpaper in the site&apos;s
              interactive OS shell is stored only in your browser&apos;s local
              storage, on your device, and is never transmitted anywhere.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary">
              Hosting & infrastructure
            </h2>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-foreground/80">
              The site is hosted on Vercel, which processes standard request
              metadata (IP address, user agent) as part of serving any web
              request — see{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Vercel&apos;s privacy policy
              </a>{" "}
              for how that&apos;s handled at the infrastructure level. This site
              does not read, log, or act on that data itself.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary">
              Contact & data requests
            </h2>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-foreground/80">
              Since nothing is stored beyond the initial email delivery,
              there&apos;s nothing to export or delete on this end. If you have
              questions about this policy, reach out at{" "}
              <a
                href={`mailto:${profile.email}`}
                className="text-accent hover:underline"
              >
                {profile.email}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
