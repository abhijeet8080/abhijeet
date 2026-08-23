import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ArrowRight } from "lucide-react";
import { SectionGradiendBg } from "@/components/mics/bg/SectionGradiendBg";
import { TechBadge } from "@/components/common";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { constructMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { CASE_STUDIES, getCaseStudy } from "@/constant/caseStudies";
import { SITE_SEO } from "@/constant/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = () =>
  CASE_STUDIES.map((study) => ({ slug: study.slug }));

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) {
    return constructMetadata({ title: "Project not found", noIndex: true });
  }
  return constructMetadata({
    title: `${study.name} — Case Study`,
    description: study.tagline,
    path: `/projects/${study.slug}`,
    keywords: [
      study.name,
      "Abhijeet Kadam",
      "case study",
      ...study.stack.slice(0, 6),
    ],
  });
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-6 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
    {"// "}
    {children}
  </div>
);

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const index = CASE_STUDIES.findIndex((s) => s.slug === study.slug);
  const prev = CASE_STUDIES[(index - 1 + CASE_STUDIES.length) % CASE_STUDIES.length];
  const next = CASE_STUDIES[(index + 1) % CASE_STUDIES.length];
  const number = String(index + 1).padStart(3, "0");

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: study.name,
      description: study.tagline,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      author: { "@type": "Person", name: SITE_SEO.author.name },
      url: `${SITE_SEO.siteUrl}/projects/${study.slug}`,
    },
    generateBreadcrumbJsonLd([
      { name: "Projects", url: "/projects" },
      { name: study.name, url: `/projects/${study.slug}` },
    ]),
  ];

  return (
    <main className="relative z-10 min-h-screen">
      {/* Readability scrim — keeps text legible over any wallpaper */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-md" aria-hidden />

      <div className="relative mx-auto w-full max-w-5xl px-6 pb-28 pt-16 md:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/projects"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5 text-accent" />
        All projects
      </Link>

      {/* ── Hero band ── */}
      <header className="mt-6 overflow-hidden rounded-[28px] border border-border bg-card shadow-2xl">
        <div className="relative h-44 sm:h-56">
          <SectionGradiendBg colors={study.gradient} shape="truchet" />
          <div className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent" />
          <div className="absolute inset-x-6 bottom-4 flex items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-white/60">
                Case Study — {number}
              </div>
              <h1 className="font-heading text-4xl font-bold text-white drop-shadow-md sm:text-5xl">
                {study.name}
              </h1>
            </div>
            <span className="shrink-0 rounded-full border border-white/15 bg-black/50 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/80 backdrop-blur">
              {study.status}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <p className="max-w-3xl font-mono text-sm leading-relaxed text-primary/85 sm:text-base">
            {study.tagline}
          </p>

          {/* Links */}
          <div className="mt-5 flex flex-wrap items-center gap-4">
            {study.links.live && (
              <a
                href={study.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:border-card-border-hover hover:bg-card-hover"
              >
                Live <ArrowUpRight className="h-3.5 w-3.5 text-accent" />
              </a>
            )}
            {study.links.github && (
              <a
                href={study.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:border-card-border-hover hover:bg-card-hover"
              >
                GitHub <ArrowUpRight className="h-3.5 w-3.5 text-accent" />
              </a>
            )}
          </div>

          {/* Metrics */}
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {study.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-border bg-background/70 p-3.5"
              >
                <div className="font-mono text-lg font-extrabold tracking-tight text-primary sm:text-xl">
                  {m.value}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Overview ── */}
      <section className="mt-14">
        <SectionLabel>Overview</SectionLabel>
        <div className="flex flex-col gap-4">
          {study.overview.map((paragraph, i) => (
            <p
              key={i}
              className="max-w-3xl text-base leading-relaxed text-foreground/75"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* ── Key features ── */}
      <section className="mt-14">
        <SectionLabel>Key Features</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {study.features.map((feature, i) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-sm transition-colors duration-300 hover:border-card-border-hover hover:bg-card"
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="font-mono text-[11px] font-bold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-base font-bold text-primary">
                  {feature.title}
                </h3>
              </div>
              <p className="font-mono text-xs leading-relaxed text-foreground/70 sm:text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>


      {/* ── Architecture flow ── */}
      <section className="mt-14">
        <SectionLabel>How It Works</SectionLabel>
        <TracingBeam className="pl-6 md:pl-20">
          <ol className="flex flex-col gap-6">
            {study.architecture.map((step, i) => (
              <li key={i} className="relative flex items-start gap-3">
                <span className="mt-0.5 shrink-0 font-mono text-[11px] font-bold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="max-w-3xl font-mono text-xs leading-relaxed text-foreground/75 sm:text-sm">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </TracingBeam>
      </section>

      {/* ── Stack ── */}
      <section className="mt-14">
        <SectionLabel>Stack</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {study.stack.map((tech) => (
            <TechBadge key={tech} name={tech} />
          ))}
        </div>
      </section>

      {/* ── Prev / Next ── */}
      <nav className="mt-16 flex items-stretch justify-between gap-4 border-t border-border pt-8">
        <Link
          href={`/projects/${prev.slug}`}
          className="group flex max-w-[45%] flex-col gap-1"
        >
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <ArrowLeft className="h-3 w-3" /> Prev
          </span>
          <span className="font-heading text-lg font-bold text-primary transition-colors group-hover:text-accent sm:text-xl">
            {prev.name}
          </span>
        </Link>
        <Link
          href={`/projects/${next.slug}`}
          className="group flex max-w-[45%] flex-col items-end gap-1 text-right"
        >
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Next <ArrowRight className="h-3 w-3" />
          </span>
          <span className="font-heading text-lg font-bold text-primary transition-colors group-hover:text-accent sm:text-xl">
            {next.name}
          </span>
        </Link>
      </nav>
      </div>
    </main>
  );
}

