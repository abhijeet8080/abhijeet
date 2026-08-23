import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { appendVaryAccept, preferredType } from "@/lib/accept-negotiation";

/**
 * Markdown content negotiation (acceptmarkdown.com protocol).
 *
 * Implements the reference algorithm from acceptmarkdown.com/recipes/nextjs
 * (see lib/accept-negotiation.ts), adapted to this Next.js version's
 * `proxy` file convention — the renamed successor to `middleware` (see
 * node_modules/next/dist/docs/.../proxy.md).
 *
 * - `Accept: text/markdown` (or a `.md` URL) is rewritten to the Markdown
 *   route handler at /api/markdown/[[...slug]].
 * - Every response — negotiated or not — gets `Accept` appended to `Vary`,
 *   so CDNs cache the HTML and Markdown representations independently.
 * - An `Accept` header that explicitly rejects everything we produce
 *   (e.g. `text/html;q=0, text/markdown;q=0`) gets a spec-correct 406.
 */

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Explicit .md URL: always Markdown, regardless of Accept. This is the
  // path a `<link rel="alternate" type="text/markdown">` would point at —
  // crawlers that follow it may not send an Accept header at all. Rewrite
  // to the route handler with the `.md` stripped so one handler covers
  // both the canonical URL and its sibling.
  if (pathname.endsWith(".md")) {
    const url = request.nextUrl.clone();
    url.pathname = `/api/markdown${pathname.slice(0, -3)}`;
    const rewritten = NextResponse.rewrite(url);
    appendVaryAccept(rewritten.headers);
    return rewritten;
  }

  const acceptHeader = request.headers.get("accept");
  const chosen = preferredType(acceptHeader);

  if (chosen === "text/markdown") {
    const url = request.nextUrl.clone();
    url.pathname = `/api/markdown${pathname}`;
    const rewritten = NextResponse.rewrite(url);
    appendVaryAccept(rewritten.headers);
    return rewritten;
  }

  if (chosen === null && acceptHeader) {
    return new Response(
      "Not Acceptable\n\nAvailable: text/html, text/markdown\n",
      {
        status: 406,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          Vary: "Accept",
        },
      }
    );
  }

  const response = NextResponse.next();
  appendVaryAccept(response.headers);
  return response;
}

export const config = {
  // Run on page routes only — skip API routes, Next internals, Vercel
  // internals, and any request for a static file (favicon, images,
  // fonts, resume.pdf, sitemap.xml, robots.txt, llms.txt, …). Those all
  // serve one representation and don't need negotiation; more
  // importantly, narrow Accept headers on asset requests (e.g. font or
  // XHR fetches without a `*/*` fallback) would otherwise risk a false
  // 406 for a request that was never asking for HTML or Markdown.
  matcher: ["/((?!api/|_next/|_vercel/|.*\\..*).*)"],
};
