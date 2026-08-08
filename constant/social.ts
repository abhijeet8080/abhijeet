import type { IconType } from "react-icons";

import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa6";

interface Social {
  name: string;
  handle: string;
  url: string;
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
    name: "Email",
    handle: "abhijeetkadam.dev@gmail.com",
    url: "mailto:abhijeetkadam.dev@gmail.com",
    icon: FaEnvelope,
  },
] satisfies Social[];