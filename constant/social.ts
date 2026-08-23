import type { IconType } from "react-icons";

import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaInstagram,
  FaDiscord,
} from "react-icons/fa6";

interface Social {
  name: string;
  handle: string;
  /** Omitted for handles with no public profile URL (e.g. Discord usernames). */
  url?: string;
  icon: IconType;
}

export const socials = [
  {
    name: "GitHub",
    handle: "abhijeet8080",
    url: "https://github.com/abhijeet8080",
    icon: FaGithub,
  },
  {
    name: "LinkedIn",
    handle: "abhijeetkadam21",
    url: "https://linkedin.com/in/abhijeetkadam21",
    icon: FaLinkedin,
  },
  {
    name: "X",
    handle: "abhijeetdevv",
    url: "https://x.com/abhijeetdevv",
    icon: FaXTwitter,
  },
  {
    name: "Instagram",
    handle: "abhijeeet.kadam",
    url: "https://www.instagram.com/abhijeeet.kadam/",
    icon: FaInstagram,
  },
  {
    name: "Discord",
    handle: "abhijeet2025",
    icon: FaDiscord,
  },
  {
    name: "Email",
    handle: "abhijeetkadam.dev@gmail.com",
    url: "mailto:abhijeetkadam.dev@gmail.com",
    icon: FaEnvelope,
  },
] satisfies Social[];