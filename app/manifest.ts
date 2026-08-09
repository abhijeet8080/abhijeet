import type { MetadataRoute } from "next";
import { SITE_SEO } from "@/constant/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: SITE_SEO.siteTitle,
    short_name: "abhi os",
    description: SITE_SEO.defaultDescription,
    lang: "en-US",
    dir: "ltr",
    categories: ["portfolio", "productivity", "utilities"],
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#000000",
    theme_color: SITE_SEO.themeColor,
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
