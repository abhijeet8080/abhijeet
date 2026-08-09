import type { MetadataRoute } from "next";
import { SITE_SEO } from "@/constant/seo";
import { CASE_STUDIES } from "@/constant/caseStudies";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/projects", "/resume"];
  const caseStudies = CASE_STUDIES.map((s) => `/projects/${s.slug}`);

  return [...routes, ...caseStudies].map((route) => ({
    url: `${SITE_SEO.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
