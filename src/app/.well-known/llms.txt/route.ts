import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/utils/constants";

// /.well-known/llms.txt — dynamic proxy to /llms.txt
// Some AI crawlers specifically look for LLM manifest at /.well-known/llms.txt
// (Perplexity, Anthropic-ai, some Gemini crawlers).
// We serve the same DB-fresh content from the /llms.txt route by forwarding the request.

export const dynamic = "force-dynamic";

export async function GET() {
  const response = await fetch(`${SITE_URL}/llms.txt`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return new NextResponse("# A Versus B\n> Service temporarily unavailable.\n", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const body = await response.text();

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "all",
      "Access-Control-Allow-Origin": "*",
      "X-Source": "well-known-proxy",
    },
  });
}
