import type { Metadata } from "next";
import Link from "next/link";
import { NotFoundGame } from "@/components/mics";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Page not found",
  description:
    "This page doesn't exist. Find your way to the homepage, projects, resume, or the site's machine-readable index below.",
  path: "/404",
  noIndex: true,
});

const RECOVERY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
  { href: "/sitemap.xml", label: "Sitemap" },
  { href: "/llms.txt", label: "llms.txt" },
];

export default function NotFound() {
  return (
    <main className="relative z-10 min-h-screen">
      {/* Readability scrim — keeps the game legible over any wallpaper */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-md" aria-hidden />

      <div className="relative mx-auto w-full max-w-5xl px-6 pb-28 pt-16 md:px-12">
        <NotFoundGame />

        {/* Server-rendered recovery links — present in the raw HTML for
            crawlers and agents even without JavaScript. */}
        <section className="mx-auto mt-4 max-w-md text-center">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {"// where to look next"}
          </h2>
          <p className="mt-3 font-mono text-xs leading-relaxed text-muted-foreground sm:text-sm">
            The page at this address doesn&apos;t exist (HTTP 404). Try one of
            these instead:
          </p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {RECOVERY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-mono text-xs font-semibold uppercase tracking-wider text-primary underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent sm:text-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
