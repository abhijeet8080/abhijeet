import { NextResponse } from "next/server";
import { getMarkdownForPath } from "@/lib/markdown-content";

/**
 * Serves the Markdown representation of a page. Reached via proxy.ts,
 * which rewrites requests carrying `Accept: text/markdown` here (see
 * that file for the negotiation logic and the required `Vary` header).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug = [] } = await params;
  const pathname = `/${slug.join("/")}`;

  const body = getMarkdownForPath(pathname);

  if (body === null) {
    return new NextResponse("Not found\n", {
      status: 404,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        Vary: "Accept",
      },
    });
  }

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "Cache-Control": "s-maxage=60, stale-while-revalidate=86400",
    },
  });
}
