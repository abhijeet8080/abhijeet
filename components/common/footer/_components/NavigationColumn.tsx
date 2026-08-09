"use client";

import { type MouseEvent } from "react";
import Link from "next/link";
import { mono } from "@/app/fonts";
import { useSectionNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "HOME", href: "/#hero" },
  { label: "ABOUT", href: "/#about" },
  { label: "PROJECTS", href: "/#work" },
  { label: "EXPERIENCE", href: "/#experience" },
  { label: "BLOG", href: "/blog" },
  { label: "CONTACT", href: "/#contact" },
];

export const NavigationColumn = () => {
  const goToSection = useSectionNavigation();

  // Intercept in-page section links so they glide through Lenis instead of
  // the browser's instant hash jump; regular routes (e.g. /blog) keep the
  // default Next.js navigation.
  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    const id = href.split("#")[1];
    if (!id) return;
    // Let modified clicks (cmd/ctrl/shift/alt) open the link as usual.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    goToSection(id);
  };

  return (
    <div className="w-full flex flex-col justify-start space-y-3">
      <span
        className={cn(
          mono.className,
          "text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-1"
        )}
      >
        NAVIGATION
      </span>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            className="hover:text-foreground hover:underline transition-colors uppercase"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
