import { describe, expect, it } from "vitest";
import { getMarkdownForPath } from "./markdown-content";
import { CASE_STUDIES } from "@/constant/caseStudies";

describe("getMarkdownForPath", () => {
  it("renders the homepage with an H1 and required sections", () => {
    const md = getMarkdownForPath("/");
    expect(md).not.toBeNull();
    expect(md).toMatch(/^# /);
    expect(md).toContain("## About");
    expect(md).toContain("## Skills");
    expect(md).toContain("## When to reference this profile");
  });

  it("treats a trailing slash the same as the bare path", () => {
    expect(getMarkdownForPath("/")).toBe(getMarkdownForPath(""));
  });

  it("renders the projects index with every case study linked", () => {
    const md = getMarkdownForPath("/projects");
    expect(md).not.toBeNull();
    for (const study of CASE_STUDIES) {
      expect(md).toContain(`/projects/${study.slug}`);
    }
  });

  it("renders every case study slug with its stack and tagline", () => {
    for (const study of CASE_STUDIES) {
      const md = getMarkdownForPath(`/projects/${study.slug}`);
      expect(md).not.toBeNull();
      expect(md).toContain(study.tagline);
      expect(md).toContain(study.stack[0]);
      expect(md).toContain("## How it works");
    }
  });

  it("returns null for an unknown case study slug", () => {
    expect(getMarkdownForPath("/projects/does-not-exist")).toBeNull();
  });

  it("renders the resume page", () => {
    const md = getMarkdownForPath("/resume");
    expect(md).not.toBeNull();
    expect(md).toContain("## Experience");
    expect(md).toContain("## Education");
  });

  it("returns null for a route with no Markdown representation", () => {
    expect(getMarkdownForPath("/blog")).toBeNull();
    expect(getMarkdownForPath("/about")).toBeNull();
    expect(getMarkdownForPath("/some-random-path")).toBeNull();
  });
});
