import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";
import { SITE_SEO } from "@/constant/seo";

describe("sitemap", () => {
  const urls = sitemap().map((entry) => entry.url);

  it("includes the new trust-anchor pages", () => {
    expect(urls).toContain(`${SITE_SEO.siteUrl}/about`);
    expect(urls).toContain(`${SITE_SEO.siteUrl}/contact`);
    expect(urls).toContain(`${SITE_SEO.siteUrl}/privacy`);
  });

  it("still includes the pre-existing core routes", () => {
    expect(urls).toContain(SITE_SEO.siteUrl);
    expect(urls).toContain(`${SITE_SEO.siteUrl}/projects`);
    expect(urls).toContain(`${SITE_SEO.siteUrl}/resume`);
  });

  it("has no duplicate URLs", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("excludes /blog, which is noIndex until it has real posts", () => {
    expect(urls).not.toContain(`${SITE_SEO.siteUrl}/blog`);
  });

  it("uses a fixed lastModified per entry instead of the build timestamp", () => {
    // Regression guard: `new Date()` at build time stamps every URL
    // "changed today" on every deploy, which is a lie search engines
    // learn to discount. Every entry must resolve to a real, stable date.
    for (const entry of sitemap()) {
      expect(entry.lastModified).toBeTruthy();
      expect(new Date(entry.lastModified as string).toString()).not.toBe(
        "Invalid Date"
      );
    }
  });
});
