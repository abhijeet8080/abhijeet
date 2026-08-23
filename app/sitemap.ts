import type { MetadataRoute } from "next";
import { SITE_SEO } from "@/constant/seo";
import { CASE_STUDIES } from "@/constant/caseStudies";

export default function sitemap(): MetadataRoute.Sitemap {
  const routeConfig: Array<{
    path: string;
    changeFrequency: NonNullable<
      MetadataRoute.Sitemap[number]["changeFrequency"]
    >;
    priority: number;
  }> = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/projects", changeFrequency: "weekly", priority: 0.9 },
    { path: "/about", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
    { path: "/resume", changeFrequency: "yearly", priority: 0.6 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  ];

  const staticRoutes: MetadataRoute.Sitemap = routeConfig.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${SITE_SEO.siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    })
  );

  const caseStudies: MetadataRoute.Sitemap = CASE_STUDIES.map((s) => ({
    url: `${SITE_SEO.siteUrl}/projects/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...caseStudies];
}
