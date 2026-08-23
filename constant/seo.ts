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
    process.env.NEXT_PUBLIC_SITE_URL || "https://abhijeetkadam.in",
  titleTemplate: "%s | Abhijeet Kadam",
  defaultDescription:
    "Portfolio of Abhijeet Kadam — Full Stack AI Engineer building voice agents, RAG pipelines, and agent tooling with Next.js, TypeScript, and Node.js. Presented as abhi os, a macOS-inspired desktop experience.",
  defaultKeywords: [
    // Identity & brand
    "Abhijeet Kadam",
    "Abhijeet Kadam Portfolio",
    "Abhijeet Kadam Developer",
    "Abhijeet Kadam Software Engineer",
    "Abhijeet Kadam AI Engineer",
    "abhijeet8080",
    "abhi os",
    "abhijeetkadam",
    // Roles
    "Full Stack AI Engineer",
    "AI Engineer",
    "Software Engineer",
    "Full Stack Developer",
    "Full Stack Engineer",
    "Backend Engineer",
    "Frontend Developer",
    "Web Developer",
    "Software Developer",
    "LLM Engineer",
    "Machine Learning Engineer",
    "Software Engineer Portfolio",
    "Developer Portfolio",
    // AI, voice & LLM domains
    "Voice AI",
    "Voice Agents",
    "AI Voice Agents",
    "Speech-to-Text",
    "Text-to-Speech",
    "RAG",
    "RAG Pipelines",
    "Retrieval Augmented Generation",
    "LLM Applications",
    "Large Language Models",
    "AI Agents",
    "Agent SDK",
    "AI Workflows",
    "AI Automation",
    "Prompt Engineering",
    "Vector Database",
    "Embeddings",
    "Semantic Search",
    "Conversational AI",
    "Multilingual AI",
    "OpenAI",
    "Gemini",
    "DeepSeek",
    "Deepgram",
    "Twilio",
    "Vercel AI SDK",
    // Languages & frameworks
    "TypeScript",
    "TypeScript Developer",
    "JavaScript",
    "Java",
    "Node.js",
    "Node.js Developer",
    "Express.js",
    "Hono",
    "Next.js",
    "Next.js Developer",
    "React",
    "React Developer",
    "Tailwind CSS",
    "Zod",
    "Redux Toolkit",
    "TanStack Query",
    // Data & infrastructure
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Qdrant",
    "Supabase",
    "Prisma",
    "BullMQ",
    "Docker",
    "GitHub Actions",
    "Azure",
    "Azure Container Apps",
    "Git",
    "GitHub",
    "CI/CD",
    "REST API",
    "GraphQL",
    "Microservices",
    "WebSockets",
    "Real-time Systems",
    "Background Workers",
    "Microsoft Graph API",
    // Location
    "Software Engineer Bangalore",
    "Software Engineer India",
    "AI Engineer India",
    "AI Engineer Bangalore",
    "Full Stack Developer Bangalore",
    "Full Stack Developer India",
    // Intent / hiring
    "Hire AI Engineer",
    "Hire Full Stack Developer",
    "Software Engineer for Hire",
    "Remote Software Engineer",
    "Freelance Software Developer",
    // Affiliations
    "AEOS Labs",
    "Vishwakarma Institute of Information Technology",
    "VIIT Pune",
  ],
  author: {
    name: "Abhijeet Kadam",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://abhijeetkadam.vercel.app",
    email: "abhijeetkadam.dev@gmail.com",
    handle: `@${githubSocial?.handle || "abhijeet8080"}`,
  },
  creator: "Abhijeet Kadam",
  publisher: "Abhijeet Kadam",
  defaultOgImage: "/images/me.jpg",
  twitterHandle: `@${githubSocial?.handle || "abhijeet8080"}`,
  socialLinks: socials
    .map((s) => s.url)
    .filter((url): url is string => Boolean(url)),
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
  "home" | "projects" | "resume" | "blog" | "about" | "contact" | "privacy",
  PageSeoConfig
> = {
  home: {
    title: "Abhijeet Kadam — Full Stack AI Engineer",
    description:
      "Welcome to abhi os — the portfolio of Abhijeet Kadam. Explore production AI systems: voice agents, RAG pipelines, agent SDKs, and full-stack applications.",
    keywords: [
      "Abhijeet Kadam",
      "Full Stack AI Engineer",
      "Software Engineer Bangalore",
      "Voice Agents",
      "RAG Pipelines",
      "AI Agents",
      "LLM Applications",
      "Next.js Portfolio",
      "TypeScript Portfolio",
      "macOS Portfolio",
      "Hire AI Engineer",
      "abhi os",
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
      "RAG Pipeline Project",
      "Voice AI Project",
      "AI Meeting Notetaker",
      "PR Review Bot",
      "Open Source",
      "TypeScript Projects",
      "Next.js Projects",
      "Node.js Projects",
      "AI Portfolio Projects",
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
      "Software Engineer Resume",
      "LLM Engineer Resume",
      "Voice AI Engineer CV",
      "Hire Abhijeet Kadam",
    ],
    path: "/resume",
    type: "profile",
  },
  blog: {
    title: "Blog & Writing",
    description:
      "Notes and deep-dives by Abhijeet Kadam on building production AI systems — voice agents, RAG pipelines, agent tooling, and full-stack engineering with Next.js and TypeScript.",
    keywords: [
      "Abhijeet Kadam Blog",
      "AI Engineering Blog",
      "Voice AI Blog",
      "RAG Tutorial",
      "LLM Engineering",
      "Next.js Blog",
      "TypeScript Blog",
      "Software Engineering Blog",
    ],
    path: "/blog",
    type: "website",
  },
  about: {
    title: "About",
    description:
      "About Abhijeet Kadam — a Full Stack AI Engineer based in Bangalore, India, building voice agents, RAG pipelines, and agent tooling. Background, education, and current role at AEOS Labs.",
    keywords: [
      "About Abhijeet Kadam",
      "Abhijeet Kadam Background",
      "Abhijeet Kadam Bio",
      "Full Stack AI Engineer Bangalore",
    ],
    path: "/about",
    type: "profile",
  },
  contact: {
    title: "Contact",
    description:
      "Get in touch with Abhijeet Kadam — email, GitHub, LinkedIn, and a contact form for project inquiries, collaboration, or hiring.",
    keywords: [
      "Contact Abhijeet Kadam",
      "Hire Abhijeet Kadam",
      "Abhijeet Kadam Email",
    ],
    path: "/contact",
    type: "website",
  },
  privacy: {
    title: "Privacy Policy",
    description:
      "Privacy policy for abhijeetkadam.in — what data is collected through the contact form, how it's used, and how to request deletion.",
    keywords: ["Privacy Policy", "Abhijeet Kadam Privacy"],
    path: "/privacy",
    type: "website",
  },
};