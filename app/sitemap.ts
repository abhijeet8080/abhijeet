import type { MetadataRoute } from "next";
import { SITE_SEO } from "@/constant/seo";
import { CASE_STUDIES } from "@/constant/caseStudies";

/**
 * lastModified is a real per-page date, not `new Date()` at build time.
 * Stamping every URL with "today" on every deploy teaches search engines
 * to distrust the signal — it starts looking like nothing is ever
 * genuinely current. Bump a route's date only when you actually change
 * that page's content.
 */
const routeConfig: Array<{
  path: string;
  lastModified: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}> = [
  { path: "", lastModified: "2026-08-23", changeFrequency: "weekly", priority: 1 },
  { path: "/projects", lastModified: "2026-08-23", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", lastModified: "2026-08-23", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", lastModified: "2026-08-23", changeFrequency: "monthly", priority: 0.6 },
  { path: "/resume", lastModified: "2026-08-23", changeFrequency: "yearly", priority: 0.6 },
  { path: "/privacy", lastModified: "2026-08-23", changeFrequency: "yearly", priority: 0.3 },
  // /blog is intentionally excluded: it's noIndex until it has real posts,
  // and a noindex'd URL has no business in the sitemap (contradictory
  // signal to crawlers).
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = routeConfig.map(
    ({ path, lastModified, changeFrequency, priority }) => ({
      url: `${SITE_SEO.siteUrl}${path}`,
      lastModified,
      changeFrequency,
      priority,
    })
  );

  const caseStudies: MetadataRoute.Sitemap = CASE_STUDIES.map((s) => ({
    url: `${SITE_SEO.siteUrl}/projects/${s.slug}`,
    lastModified: "2026-08-23",
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...caseStudies];
}
