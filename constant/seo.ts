import { socials } from "./social";

export interface PageSeoConfig {
  title: string;
  description: string;
  keywords: string[];
  path: string;
  ogImage?: string;
  type?: "website" | "article" | "profile";
}

export interface ConstructMetadataOptions {
  title?: string;
  useTitleTemplate?: boolean;
  description?: string;
  keywords?: string[];
  image?: string | null;
  path?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  authors?: { name: string; url?: string }[];
  noIndex?: boolean;
}

const githubSocial = socials.find((s) => s.name === "GitHub");

export const SITE_SEO = {
  siteName: "Abhijeet Kadam",
  siteTitle: "Abhijeet Kadam — Full Stack AI Engineer",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL || "https://abhijeetkadam.vercel.app",
  titleTemplate: "%s | Abhijeet Kadam",
  defaultDescription:
    "Portfolio of Abhijeet Kadam — Full Stack AI Engineer building voice agents, RAG pipelines, and agent tooling with Next.js, TypeScript, and Node.js. Presented as abhi os, a macOS-inspired desktop experience.",
  defaultKeywords: [
    "Abhijeet Kadam",
    "Abhijeet Kadam Portfolio",
    "Full Stack AI Engineer",
    "AI Engineer",
    "Voice AI",
    "RAG",
    "Next.js Developer",
    "TypeScript Developer",
    "Software Engineer Portfolio",
    "abhi os",
  ],
  author: {
    name: "Abhijeet Kadam",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://abhijeetkadam.vercel.app",
    email: "abhijeetkadam.dev@gmail.com",
    handle: `@${githubSocial?.handle || "abhijeet8080"}`,
  },
  creator: "Abhijeet Kadam",
  publisher: "Abhijeet Kadam",
  defaultOgImage: "/images/thumbnail.png",
  twitterHandle: `@${githubSocial?.handle || "abhijeet8080"}`,
  socialLinks: socials.map((s) => s.url),
  locale: "en_US",
  themeColor: "#000000",
  robotsDefault: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
} as const;

export const PAGE_SEO: Record<
  "home" | "projects" | "resume",
  PageSeoConfig
> = {
  home: {
    title: "Abhijeet Kadam — Full Stack AI Engineer",
    description:
      "Welcome to abhi os — the portfolio of Abhijeet Kadam. Explore production AI systems: voice agents, RAG pipelines, agent SDKs, and full-stack applications.",
    keywords: [
      "Abhijeet Kadam",
      "Full Stack AI Engineer",
      "Voice Agents",
      "RAG Pipelines",
      "Next.js Portfolio",
      "macOS Portfolio",
    ],
    path: "/",
    type: "website",
  },
  projects: {
    title: "Projects & Works",
    description:
      "AI systems built by Abhijeet Kadam — Rika (AI meeting notetaker), ARIA (multilingual voice agent), redai (npm agent SDK), NotebookLM (cited RAG), and Bugbot (PR review bot).",
    keywords: [
      "Abhijeet Kadam Projects",
      "AI Voice Agent",
      "Agent SDK",
      "RAG Applications",
      "Open Source",
      "TypeScript Projects",
    ],
    path: "/projects",
    type: "website",
  },
  resume: {
    title: "Resume & CV",
    description:
      "Curriculum vitae of Abhijeet Kadam — Full Stack AI Engineer specializing in voice AI, RAG systems, Next.js, TypeScript, and cloud-native backends on Azure.",
    keywords: [
      "Abhijeet Kadam Resume",
      "Abhijeet Kadam CV",
      "AI Engineer Resume",
      "Full Stack Developer CV",
    ],
    path: "/resume",
    type: "profile",
  },
};