import type { Metadata } from "next";
import { SITE_SEO, type ConstructMetadataOptions } from "@/constant/seo";
import { selected_works, works } from "@/constant/projects";
import { skillsData } from "@/constant/skills";
import { profile } from "@/constant/profile";

/** Skills flattened from the skills matrix + AI/LLM domains — feeds JSON-LD knowsAbout. */
const KNOWS_ABOUT = [
  ...skillsData.flatMap((category) => category.data.map((s) => s.title)),
  "Voice AI",
  "Retrieval Augmented Generation (RAG)",
  "Large Language Models",
  "AI Agents",
  "Prompt Engineering",
  "Real-time Audio Pipelines",
  "Full Stack Development",
  "Software Engineering",
];

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
    applicationName: "abhi os",
    authors: authors || [{ name: SITE_SEO.author.name, url: SITE_SEO.author.url }],
    creator: SITE_SEO.creator,
    publisher: SITE_SEO.publisher,
    referrer: "origin-when-cross-origin",
    category: "technology",
    metadataBase: new URL(SITE_SEO.siteUrl),
    alternates: {
      canonical: canonicalUrl,
      types: {
        // Discovery hint for LLM agents (llms.txt convention)
        "text/plain": `${SITE_SEO.siteUrl}/llms.txt`,
      },
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: SITE_SEO.siteName,
      locale: SITE_SEO.locale,
      type: type,
      ...(publishedTime && { publishedTime }),
      // When no image is passed, the dynamic app/opengraph-image.tsx applies.
      ...(image && {
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: metaTitle,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      creator: SITE_SEO.twitterHandle,
      ...(image && { images: [image] }),
    },
    appleWebApp: {
      capable: true,
      title: "abhi os",
      statusBarStyle: "black-translucent",
    },
    verification: {
      ...(process.env.GOOGLE_SITE_VERIFICATION && {
        google: process.env.GOOGLE_SITE_VERIFICATION,
      }),
      ...(process.env.YANDEX_SITE_VERIFICATION && {
        yandex: process.env.YANDEX_SITE_VERIFICATION,
      }),
      ...(process.env.BING_SITE_VERIFICATION && {
        other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION },
      }),
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
    givenName: profile.name.first,
    familyName: profile.name.last,
    url: SITE_SEO.siteUrl,
    image: `${SITE_SEO.siteUrl}/images/me.jpg`,
    email: SITE_SEO.author.email,
    description: SITE_SEO.defaultDescription,
    jobTitle: profile.work.title,
    worksFor: {
      "@type": "Organization",
      name: profile.work.company,
      url: "https://labs.aeoscompany.com/",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: profile.education.uni,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.curr_location.city,
      addressRegion: profile.curr_location.state,
      addressCountry: "IN",
    },
    knowsAbout: KNOWS_ABOUT,
    knowsLanguage: ["en", "hi", "mr"],
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
    alternateName: "abhi os",
    url: SITE_SEO.siteUrl,
    description: SITE_SEO.defaultDescription,
    inLanguage: "en-US",
    keywords: Array.from(SITE_SEO.defaultKeywords).join(", "),
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
      {
        "@type": "WebPage",
        name: "Blog & Writing",
        url: `${SITE_SEO.siteUrl}/blog`,
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
    { name: "Blog", path: "/blog" },
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