import type { Metadata } from "next";
import { Fragment } from "react";
import { Footer } from "@/components/common";
import {
  HeroSection,
  AboutSection,
  SkillsSection,
  ExperienceSection,
  WorkSection,
  ContactSection,
} from "@/components/sections";
import { constructMetadata } from "@/lib/seo";
import { PAGE_SEO } from "@/constant/seo";

export const metadata: Metadata = constructMetadata(PAGE_SEO.home);

export default function Home() {
  return (
    <Fragment>
      <div className="relative flex min-h-screen flex-col">
        <main>
          <HeroSection />
          <div className="relative z-10 bg-black/30 backdrop-blur-sm">
            <AboutSection />
            <SkillsSection />
            <ExperienceSection />
            <WorkSection />
            <ContactSection />
          </div>
        </main>
        <Footer />
      </div>
      {/* Spacer so the always-visible mobile dock never covers the footer */}
      <div className="h-14 md:hidden" />
    </Fragment>
  );
}
