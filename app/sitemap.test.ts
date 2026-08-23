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
});
