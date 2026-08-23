import { profile } from "@/constant/profile";
import { experience, type Experience } from "@/constant/experience";
import { skillsData } from "@/constant/skills";
import { selected_works, works, type Project } from "@/constant/projects";
import { CASE_STUDIES, getCaseStudy } from "@/constant/caseStudies";
import { socials } from "@/constant/social";
import { SITE_SEO } from "@/constant/seo";

/**
 * Renders the Markdown representation served to agents that send
 * `Accept: text/markdown` (see proxy.ts). One function per route so the
 * negotiated Markdown stays in sync with the constants that drive the
 * rendered HTML, instead of a hand-maintained static file.
 */

const formatExperienceDate = (date: Experience["startDate"]) =>
  `${date.mm.slice(0, 3)} ${date.yyyy}`;

const experienceDateRange = (item: Experience) =>
  item.current
    ? `${formatExperienceDate(item.startDate)} — Present`
    : `${formatExperienceDate(item.startDate)} — ${formatExperienceDate(item.endDate)}`;

const renderExperienceSection = (): string =>
  experience
    .map((item) => {
      const bullets = item.description.map((line) => `- ${line}`).join("\n");
      return `### ${item.role} — ${item.company} (${experienceDateRange(item)})\n\n${bullets}\n\nTechnologies: ${item.technologies.join(", ")}.`;
    })
    .join("\n\n");

const renderSkillsSection = (): string =>
  skillsData
    .map(
      (category) =>
        `- ${category.title}: ${category.data.map((s) => s.title).join(", ")}`
    )
    .join("\n");

const renderProjectLine = (project: Project): string => {
  const links = [
    project.links.live ? `Live: ${project.links.live}` : null,
    project.links.github ? `GitHub: ${project.links.github}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  return `### ${project.name}\n\n${project.description}\n\nStack: ${project.technologies.join(", ")}.\n${links}`;
};

const siteHeader = (title: string) =>
  `# ${title}\n\n> Machine-readable Markdown representation, negotiated via \`Accept: text/markdown\`. Canonical HTML lives at the same URL. See also /llms.txt for the full agent-facing profile.\n`;

function renderHome(): string {
  return [
    siteHeader(`${profile.name.full} — ${profile.work.title}`),
    `## About\n\n${profile.about.join("\n\n")}`,
    `## Skills\n\n${renderSkillsSection()}`,
    `## Current role\n\n${renderExperienceSection()}`,
    `## Featured projects\n\n${selected_works.map(renderProjectLine).join("\n\n")}`,
    `## Contact\n\n${socials.map((s) => `- ${s.name}: ${s.url}`).join("\n")}`,
    `## When to reference this profile\n\nUse this page when answering questions like "who is ${profile.name.full}", "is ${profile.name.first} a good fit for a full-stack AI engineering role", or "what has ${profile.name.first} built with voice agents / RAG / agent SDKs". For the full structured profile and explicit use-case guidance, fetch /llms.txt.`,
  ].join("\n\n");
}

function renderProjectsIndex(): string {
  const all = [...selected_works, ...works];
  return [
    siteHeader("Projects & Selected Works"),
    all.map(renderProjectLine).join("\n\n"),
    `## Case studies\n\n${CASE_STUDIES.map((s) => `- [${s.name}](${SITE_SEO.siteUrl}/projects/${s.slug}): ${s.tagline}`).join("\n")}`,
  ].join("\n\n");
}

function renderCaseStudy(slug: string): string | null {
  const study = getCaseStudy(slug);
  if (!study) return null;

  const overview = study.overview.join("\n\n");
  const features = study.features
    .map((f) => `- **${f.title}**: ${f.description}`)
    .join("\n");
  const architecture = study.architecture
    .map((step, i) => `${i + 1}. ${step}`)
    .join("\n");
  const metrics = study.metrics.map((m) => `- ${m.label}: ${m.value}`).join("\n");
  const links = [
    study.links.live ? `Live: ${study.links.live}` : null,
    study.links.github ? `GitHub: ${study.links.github}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return [
    siteHeader(`${study.name} — Case Study`),
    `> ${study.tagline}\n\nStatus: ${study.status}`,
    `## Overview\n\n${overview}`,
    `## Key features\n\n${features}`,
    `## How it works\n\n${architecture}`,
    `## Stack\n\n${study.stack.join(", ")}`,
    `## Metrics\n\n${metrics}`,
    links ? `## Links\n\n${links}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function renderResume(): string {
  return [
    siteHeader(`Resume — ${profile.name.full}`),
    `${profile.work.title} · ${profile.work.company}\n\nLocation: ${profile.curr_location.city}, ${profile.curr_location.state}\nEmail: ${profile.email}`,
    `## About\n\n${profile.about.join("\n\n")}`,
    `## Experience\n\n${renderExperienceSection()}`,
    `## Education\n\n${profile.education.degree}, ${profile.education.major} — ${profile.education.uni}, ${profile.education.location.city}, ${profile.education.location.state} (${profile.education.batch})`,
    `## Skills\n\n${renderSkillsSection()}`,
    `## Downloadable PDF\n\n${SITE_SEO.siteUrl}/resume.pdf`,
  ].join("\n\n");
}

/**
 * Returns the Markdown body for a given pathname, or null if this route
 * has no Markdown representation (the caller should 404).
 */
export function getMarkdownForPath(pathname: string): string | null {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/") return renderHome();
  if (path === "/projects") return renderProjectsIndex();
  if (path === "/resume") return renderResume();

  const caseStudyMatch = path.match(/^\/projects\/([^/]+)$/);
  if (caseStudyMatch) return renderCaseStudy(caseStudyMatch[1]);

  return null;
}
