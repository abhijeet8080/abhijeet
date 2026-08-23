"use client";

import { motion } from "motion/react";
import { socials } from "@/constant/social";

export const SocialLinks = () => {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {socials.map((social) =>
        social.url ? (
          <motion.a
            key={social.name}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs sm:text-sm text-neutral-300 transition-colors hover:text-white hover:underline underline-offset-4 cursor-pointer lowercase"
          >
            {social.name}
          </motion.a>
        ) : (
          <span
            key={social.name}
            title={social.handle}
            className="font-mono text-xs sm:text-sm text-neutral-500 lowercase"
          >
            {social.name}: {social.handle}
          </span>
        )
      )}
    </div>
  );
};


