import type { Metadata } from "next";
import { SITE_SEO, type ConstructMetadataOptions } from "@/constant/seo";
import { selected_works, works } from "@/constant/projects";

/**
 * Constructs a fully compliant Next.js Metadata object with centralized SEO fallbacks.
 */
export function constructMetadata({
  title,
  useTitleTemplate = false,
  description,
  keywords,
  image,
  path = "/",
  type = "website",
  publishedTime,
  authors,
  noIndex = false,
}: ConstructMetadataOptions = {}): Metadata {
  const metaTitle = title ? title : SITE_SEO.siteTitle;
  const metaDescription = description || SITE_SEO.defaultDescription;
  const metaKeywords = keywords?.length
    ? keywords
    : Array.from(SITE_SEO.defaultKeywords);
  const metaImage = image || SITE_SEO.defaultOgImage;
  const canonicalUrl = `${SITE_SEO.siteUrl}${path}`;

  return {
    title: useTitleTemplate
      ? {
          default: metaTitle,
          template: SITE_SEO.titleTemplate,
        }
      : metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: authors || [{ name: SITE_SEO.author.name, url: SITE_SEO.author.url }],
    creator: SITE_SEO.creator,
    publisher: SITE_SEO.publisher,
    metadataBase: new URL(SITE_SEO.siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: SITE_SEO.siteName,
      locale: SITE_SEO.locale,
      type: type,
      ...(publishedTime && { publishedTime }),
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: metaImage ? "summary_large_image" : "summary",
      title: metaTitle,
      description: metaDescription,
      creator: SITE_SEO.twitterHandle,
      images: [metaImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : SITE_SEO.robotsDefault,
  };
}

/**
 * JSON-LD Schema Generator for Person / Profile
 */
export function generatePersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_SEO.author.name,
    url: SITE_SEO.siteUrl,
    email: SITE_SEO.author.email,
    jobTitle: "Full Stack AI Engineer",
    sameAs: Array.from(SITE_SEO.socialLinks),
  };
}

/**
 * JSON-LD Schema Generator for WebSite
 */
export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_SEO.siteName,
    url: SITE_SEO.siteUrl,
    description: SITE_SEO.defaultDescription,
    author: {
      "@type": "Person",
      name: SITE_SEO.author.name,
    },
    hasPart: [
      {
        "@type": "WebPage",
        name: "Projects & Selected Works",
        url: `${SITE_SEO.siteUrl}/projects`,
      },
      {
        "@type": "WebPage",
        name: "Resume & Curriculum Vitae",
        url: `${SITE_SEO.siteUrl}/resume`,
      },
    ],
  };
}

/**
 * JSON-LD Schema Generator for Site Navigation
 */
export function generateSiteNavigationJsonLd() {
  const pages = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Resume", path: "/resume" },
  ];

  return pages.map((page) => ({
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: page.name,
    url: `${SITE_SEO.siteUrl}${page.path}`,
  }));
}

/**
 * JSON-LD Schema Generator for Organization (Homepage)
 */
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_SEO.siteName,
    url: SITE_SEO.siteUrl,
    logo: `${SITE_SEO.siteUrl}/images/thumbnail.png`,
    sameAs: Array.from(SITE_SEO.socialLinks),
  };
}

/**
 * JSON-LD Schema Generator for BreadcrumbList (Nested Pages)
 */
export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${SITE_SEO.siteUrl}${item.url}`,
    })),
  };
}

/**
 * JSON-LD Schema Generator for ProfilePage (Resume)
 */
export function generateProfilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `Resume & CV of ${SITE_SEO.author.name}`,
    url: `${SITE_SEO.siteUrl}/resume`,
    mainEntity: generatePersonJsonLd(),
  };
}

/**
 * JSON-LD Schema Generator for Projects ItemList
 */
export function generateProjectsItemListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects & Selected Works",
    description:
      "AI systems and full-stack applications — voice agents, RAG pipelines, agent SDKs, and developer tooling.",
    url: `${SITE_SEO.siteUrl}/projects`,
    mainEntity: {
      "@type": "ItemList",
      name: "Portfolio Projects",
      itemListElement: [...selected_works, ...works].map((project, index) => ({
        "@type": "SoftwareApplication",
        position: index + 1,
        name: project.name,
        description: project.description,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
      })),
    },
  };
}