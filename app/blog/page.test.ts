import { describe, expect, it } from "vitest";
import { metadata } from "./page";

describe("blog page metadata", () => {
  it("is noIndex while the page has no real posts", () => {
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });
});
