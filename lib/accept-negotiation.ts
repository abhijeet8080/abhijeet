/**
 * Pure Accept-header content negotiation, per the acceptmarkdown.com
 * protocol (RFC 9110 §12.5.1 specificity + q-value rules). Extracted
 * from proxy.ts so the negotiation logic itself is unit-testable without
 * spinning up a Next.js request/response cycle.
 */

export const PRODUCES = ["text/html", "text/markdown"] as const;
export type Produced = (typeof PRODUCES)[number];

export interface AcceptEntry {
  type: string;
  q: number;
  specificity: number;
}

export function parseAccept(header: string): AcceptEntry[] {
  return header.split(",").map((raw) => {
    const parts = raw
      .trim()
      .split(";")
      .map((s) => s.trim());
    const type = parts[0].toLowerCase();
    let q = 1;
    for (const param of parts.slice(1)) {
      const [name, value] = param.split("=").map((s) => s.trim());
      if (name === "q") {
        const parsed = Number(value);
        if (!Number.isNaN(parsed)) q = Math.max(0, Math.min(1, parsed));
      }
    }
    const specificity = type === "*/*" ? 0 : type.endsWith("/*") ? 1 : 2;
    return { type, q, specificity };
  });
}

export function matches(entry: AcceptEntry, candidate: string): boolean {
  if (entry.type === "*/*") return true;
  if (entry.type.endsWith("/*"))
    return candidate.startsWith(entry.type.slice(0, -1));
  return entry.type === candidate;
}

/**
 * Picks the best PRODUCES candidate for a given Accept header, or null if
 * the client's Accept header explicitly rejects everything we produce
 * (in which case the caller should respond 406).
 *
 * No header at all defaults to the first PRODUCES entry (text/html) — an
 * absent Accept header is not a rejection.
 */
export function preferredType(header: string | null): Produced | null {
  if (!header) return PRODUCES[0];
  const entries = parseAccept(header);
  if (entries.length === 0) return PRODUCES[0];

  let bestType: Produced | null = null;
  let bestQ = -1;
  let bestPosition = Infinity;

  for (const candidate of PRODUCES) {
    // For each candidate, find the *most specific* matching range.
    // RFC 9110 §12.5.1: specific ranges override less specific ones
    // regardless of q — so `text/html;q=0, */*;q=1` correctly rejects
    // text/html instead of letting the wildcard override.
    let matched: AcceptEntry | null = null;
    let matchedPosition = Infinity;
    for (let idx = 0; idx < entries.length; idx++) {
      const e = entries[idx];
      if (!matches(e, candidate)) continue;
      if (
        matched === null ||
        e.specificity > matched.specificity ||
        (e.specificity === matched.specificity && idx < matchedPosition)
      ) {
        matched = e;
        matchedPosition = idx;
      }
    }
    if (matched === null) continue;
    const matchedQ: number = matched.q;
    if (matchedQ <= 0) continue; // explicit rejection

    // Across candidates: highest q wins; tie-break on client order
    // so `Accept: text/markdown, text/html, */*` picks text/markdown.
    if (
      matchedQ > bestQ ||
      (matchedQ === bestQ && matchedPosition < bestPosition)
    ) {
      bestQ = matchedQ;
      bestPosition = matchedPosition;
      bestType = candidate;
    }
  }

  return bestType;
}

/** Appends "Accept" to an existing Vary header without clobbering it. */
export function appendVaryAccept(headers: Headers): void {
  const existing = headers.get("Vary");
  if (!existing) {
    headers.set("Vary", "Accept");
    return;
  }
  const tokens = existing.split(",").map((s) => s.trim().toLowerCase());
  if (!tokens.includes("accept")) {
    headers.set("Vary", `${existing}, Accept`);
  }
}
