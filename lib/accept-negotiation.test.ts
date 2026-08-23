import { describe, expect, it } from "vitest";
import { appendVaryAccept, preferredType } from "./accept-negotiation";

describe("preferredType", () => {
  it("defaults to text/html when there is no Accept header", () => {
    expect(preferredType(null)).toBe("text/html");
  });

  it("picks text/markdown for an explicit request", () => {
    expect(preferredType("text/markdown")).toBe("text/markdown");
  });

  it("picks text/markdown when it has higher q than text/html", () => {
    expect(preferredType("text/html;q=0.5, text/markdown;q=0.9")).toBe(
      "text/markdown"
    );
  });

  it("falls back to a wildcard match for a typical browser Accept header", () => {
    expect(
      preferredType(
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      )
    ).toBe("text/html");
  });

  it("respects RFC 9110 specificity over q-value ordering", () => {
    // A specific text/html;q=0 rejection must win over a wildcard */*;q=1 —
    // specificity trumps q per §12.5.1, so this must NOT resolve to html.
    expect(preferredType("text/html;q=0, */*;q=1")).toBe("text/markdown");
  });

  it("tie-breaks on client order when q-values are equal", () => {
    expect(preferredType("text/markdown, text/html, */*")).toBe(
      "text/markdown"
    );
    expect(preferredType("text/html, text/markdown, */*")).toBe("text/html");
  });

  it("returns null when the client explicitly rejects everything we produce", () => {
    expect(preferredType("text/html;q=0, text/markdown;q=0")).toBeNull();
  });

  it("returns null for a narrow Accept header matching neither representation", () => {
    expect(preferredType("image/avif")).toBeNull();
  });

  it("returns null when the only matching entry is explicitly rejected and nothing else matches", () => {
    // No entry matches text/html at all here, and the one entry that
    // matches text/markdown is q=0 — neither candidate clears the bar.
    expect(preferredType("text/markdown;q=0")).toBeNull();
  });
});

describe("appendVaryAccept", () => {
  it("sets Vary: Accept when there is no existing Vary header", () => {
    const headers = new Headers();
    appendVaryAccept(headers);
    expect(headers.get("Vary")).toBe("Accept");
  });

  it("appends Accept to an existing Vary header instead of replacing it", () => {
    const headers = new Headers({ Vary: "Accept-Encoding" });
    appendVaryAccept(headers);
    expect(headers.get("Vary")).toBe("Accept-Encoding, Accept");
  });

  it("does not duplicate Accept if it is already present", () => {
    const headers = new Headers({ Vary: "Accept, Accept-Encoding" });
    appendVaryAccept(headers);
    expect(headers.get("Vary")).toBe("Accept, Accept-Encoding");
  });

  it("is case-insensitive when checking for an existing Accept token", () => {
    const headers = new Headers({ Vary: "accept" });
    appendVaryAccept(headers);
    expect(headers.get("Vary")).toBe("accept");
  });
});
