import type { IconType } from "react-icons";

import {
  FaDocker,
  FaGitAlt,
  FaGithub,
  FaJava,
  FaNodeJs,
  FaReact,
  FaSquareJs,
} from "react-icons/fa6";

import {
  SiExpress,
  SiGithubactions,
  SiGooglegemini,
  SiHono,
  SiMongodb,
  SiNextdotjs,
  SiPrisma,
  SiRedis,
  SiRedux,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiZod,
} from "react-icons/si";

import { BiLogoPostgresql } from "react-icons/bi";
import {
  TbBrain,
  TbBrandOpenai,
  TbBrandTwilio,
  TbLayoutList,
  TbVector,
  TbVectorTriangle,
  TbWaveSine,
} from "react-icons/tb";
import { VscAzure } from "react-icons/vsc";

interface LogoProps {
  title: string;
  logoComponent: IconType;
  color?: string;
}

interface SkillsDataProps {
  title: string;
  data: LogoProps[];
}

export const skillsData: SkillsDataProps[] = [
  {
    title: "Languages & Frameworks",
    data: [
      { title: "TypeScript", logoComponent: SiTypescript, color: "#3178C6" },
      { title: "JavaScript", logoComponent: FaSquareJs, color: "#F7DF1E" },
      { title: "Java", logoComponent: FaJava, color: "#ED8B00" },
      { title: "Node.js", logoComponent: FaNodeJs, color: "#339933" },
      { title: "Express.js", logoComponent: SiExpress, color: "#FFFFFF" },
      { title: "Hono", logoComponent: SiHono, color: "#FF3600" },
      { title: "Next.js", logoComponent: SiNextdotjs, color: "#FFFFFF" },
      { title: "React", logoComponent: FaReact, color: "#61DAFB" },
      { title: "Tailwind CSS", logoComponent: SiTailwindcss, color: "#06B6D4" },
    ],
  },
  {
    title: "AI, Voice & LLMs",
    data: [
      { title: "OpenAI", logoComponent: TbBrandOpenai, color: "#FFFFFF" },
      { title: "Gemini", logoComponent: SiGooglegemini, color: "#8AB4F8" },
      { title: "DeepSeek", logoComponent: TbBrain, color: "#4D6BFE" },
      { title: "Deepgram", logoComponent: TbWaveSine, color: "#13EF93" },
      { title: "Twilio", logoComponent: TbBrandTwilio, color: "#F22F46" },
      { title: "Vercel AI SDK", logoComponent: SiVercel, color: "#FFFFFF" },
      { title: "RAG Pipelines", logoComponent: TbVectorTriangle, color: "#FF6B6B" },
      { title: "Zod", logoComponent: SiZod, color: "#3E67B1" },
    ],
  },
  {
    title: "Databases & State",
    data: [
      { title: "PostgreSQL", logoComponent: BiLogoPostgresql, color: "#58A6FF" },
      { title: "MongoDB", logoComponent: SiMongodb, color: "#47A248" },
      { title: "Redis", logoComponent: SiRedis, color: "#FF4438" },
      { title: "Qdrant", logoComponent: TbVector, color: "#DC244C" },
      { title: "Supabase", logoComponent: SiSupabase, color: "#3ECF8E" },
      { title: "Prisma", logoComponent: SiPrisma, color: "#38BDF8" },
      { title: "BullMQ", logoComponent: TbLayoutList, color: "#E11D48" },
      { title: "Redux Toolkit", logoComponent: SiRedux, color: "#764ABC" },
    ],
  },
  {
    title: "Infrastructure & DevOps",
    data: [
      { title: "Docker", logoComponent: FaDocker, color: "#2496ED" },
      { title: "GitHub Actions", logoComponent: SiGithubactions, color: "#2088FF" },
      { title: "Azure", logoComponent: VscAzure, color: "#0078D4" },
      { title: "Git", logoComponent: FaGitAlt, color: "#F05032" },
      { title: "GitHub", logoComponent: FaGithub, color: "#FFFFFF" },
    ],
  },
];