import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SectionHeader } from "@/components/common";
import { WorkCard } from "@/components/sections/work/_components/WorkCard";
import { constructMetadata } from "@/lib/seo";
import { PAGE_SEO } from "@/constant/seo";
import { selected_works, works } from "@/constant/projects";

export const metadata: Metadata = constructMetadata(PAGE_SEO.projects);

const ALL_PROJECTS = [...selected_works, ...works];

export default function ProjectsPage() {
  return (
    <main className="relative z-10 min-h-screen">
      {/* Readability scrim — keeps cards legible over any wallpaper */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-md" aria-hidden />

      <div className="relative mx-auto w-full max-w-5xl px-6 pb-28 pt-16 md:px-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5 text-accent" />
        Back to desktop
      </Link>

      <SectionHeader number="01" title="All Projects" align="left" />

      <div className="grid grid-cols-1 items-stretch gap-6 sm:gap-8 md:grid-cols-2">
        {ALL_PROJECTS.map((project, index) => (
          <WorkCard
            key={project.name}
            index={index}
            name={project.name}
            description={project.description}
            technologies={project.technologies}
            links={project.links}
            slug={project.slug}
          />
        ))}
      </div>
      </div>
    </main>
  );
}
