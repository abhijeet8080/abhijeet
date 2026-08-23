import { describe, expect, it } from "vitest";
import {
  generateOrganizationJsonLd,
  generateWebSiteJsonLd,
  generateSiteNavigationJsonLd,
  constructMetadata,
} from "./seo";
import { SITE_SEO } from "@/constant/seo";

describe("generateOrganizationJsonLd", () => {
  const org = generateOrganizationJsonLd();

  it("includes a contactPoint with email and contactType", () => {
    expect(org.contactPoint).toBeDefined();
    expect(org.contactPoint["@type"]).toBe("ContactPoint");
    expect(org.contactPoint.email).toMatch(/@/);
    expect(org.contactPoint.contactType).toBeTruthy();
  });

  it("includes a PostalAddress", () => {
    expect(org.address).toBeDefined();
    expect(org.address["@type"]).toBe("PostalAddress");
    expect(org.address.addressCountry).toBe("IN");
  });
});

describe("generateWebSiteJsonLd", () => {
  it("lists the new trust-anchor pages", () => {
    const site = generateWebSiteJsonLd();
    const urls = site.hasPart.map((p) => p.url);
    expect(urls).toContain(`${SITE_SEO.siteUrl}/about`);
    expect(urls).toContain(`${SITE_SEO.siteUrl}/contact`);
  });
});

describe("generateSiteNavigationJsonLd", () => {
  it("includes About and Contact", () => {
    const names = generateSiteNavigationJsonLd().map((n) => n.name);
    expect(names).toContain("About");
    expect(names).toContain("Contact");
  });
});

describe("constructMetadata", () => {
  it("resolves the site URL to the apex domain, not a *.vercel.app fallback", () => {
    // Regression guard: the old fallback pointed at abhijeetkadam.vercel.app,
    // which conflicts with the canonical apex domain for brand-name search.
    expect(SITE_SEO.siteUrl).not.toMatch(/vercel\.app/);
  });

  it("advertises a per-page text/markdown alternate", () => {
    const metadata = constructMetadata({ path: "/projects" });
    expect(metadata.alternates?.types?.["text/markdown"]).toBe(
      `${SITE_SEO.siteUrl}/projects.md`
    );
  });
});
