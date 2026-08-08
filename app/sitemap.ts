import type { MetadataRoute } from "next";
import { SITE_SEO } from "@/constant/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/projects", "/resume"];

  return routes.map((route) => ({
    url: `${SITE_SEO.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
