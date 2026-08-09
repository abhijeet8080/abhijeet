"use client";

import { type MouseEvent } from "react";
import Link from "next/link";
import { mono } from "@/app/fonts";
import { useSectionNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export const ConnectColumn = () => {
  const goToSection = useSectionNavigation();

  // Glide through Lenis instead of the browser's instant hash jump.
  const handleContactClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (cmd/ctrl/shift/alt) open the link as usual.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    goToSection("contact");
  };

  return (
    <div className="w-full flex flex-col justify-between space-y-4">
      <div>
        <span
          className={cn(
            mono.className,
            "text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3 block",
          )}
        >
          LET&apos;S CONNECT ✦
        </span>
        <p className="text-xs text-muted-foreground leading-relaxed">
          I&apos;m always open to discussing new projects, creative ideas or
          opportunities to be part of your visions.
        </p>
      </div>
      <div>
        <Link
          href="/#contact"
          onClick={handleContactClick}
          className={cn(
            mono.className,
            "text-xs font-medium uppercase tracking-wider text-foreground hover:underline inline-block pt-2",
          )}
        >
          SAY HELLO
        </Link>
      </div>
    </div>
  );
};
