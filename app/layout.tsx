import type { Metadata, Viewport } from "next";
import "./globals.css";

import { cn } from "@/lib/utils";
import { main, heading, signature, mono, serif } from "@/app/fonts";
import { PreLoader } from "@/components/mics";
import { SmoothScrollProvider } from "@/components/common";
import { Toaster } from "@/components/ui/sonner";
import { DesktopWallpaper } from "@/components/os/DesktopWallpaper";
import { MenuBar } from "@/components/os/MenuBar";
import { Dock } from "@/components/os/Dock";
import { WindowManager } from "@/components/os/WindowManager";
import {
  constructMetadata,
  generatePersonJsonLd,
  generateWebSiteJsonLd,
  generateSiteNavigationJsonLd,
  generateOrganizationJsonLd,
} from "@/lib/seo";
import { SITE_SEO } from "@/constant/seo";

export const metadata: Metadata = constructMetadata({
  useTitleTemplate: true,
});

export const viewport: Viewport = {
  themeColor: SITE_SEO.themeColor,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = generatePersonJsonLd();
  const websiteJsonLd = generateWebSiteJsonLd();
  const orgJsonLd = generateOrganizationJsonLd();
  const siteNavJsonLd = generateSiteNavigationJsonLd();

  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        main.variable,
        heading.variable,
        signature.variable,
        mono.variable,
        serif.variable
      )}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              personJsonLd,
              websiteJsonLd,
              orgJsonLd,
              ...siteNavJsonLd,
            ]),
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <SmoothScrollProvider>
          <PreLoader />
          <DesktopWallpaper />
          <MenuBar />
          <div
            id="app-content"
            className="relative z-10 flex min-h-full flex-1 flex-col"
          >
            {children}
          </div>
          <WindowManager />
          <Dock />
          <Toaster />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
