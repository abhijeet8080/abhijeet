"use client";

import Link from "next/link";
import { mono } from "@/app/fonts";
import { profile } from "@/constant";
import { cn } from "@/lib/utils";

const LEGAL_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
];

export const CopyrightBar = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-md border border-border/60 bg-card/30 px-4 py-3 text-center sm:flex-row sm:justify-between sm:px-6">
      <span className={cn(mono.className, "text-[11px] sm:text-xs text-muted-foreground")}>
        © {currentYear} {profile.name.full}.
      </span>
      <div className={cn(mono.className, "flex items-center gap-4 text-[11px] sm:text-xs text-muted-foreground")}>
        {LEGAL_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="uppercase tracking-wide transition-colors hover:text-foreground hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
