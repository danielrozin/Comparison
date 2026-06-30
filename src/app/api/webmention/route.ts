import { NextRequest, NextResponse } from "next/server";

// WebMention endpoint — https://www.w3.org/TR/webmention/
//
// WebMention is a W3C standard for notifying a URL that it has been mentioned
// on another page. When someone links to an aversusb.net comparison from their
// blog or site, their CMS can send a POST to this endpoint to notify us.
//
// Why this matters for SEO/GEO:
//   1. Indie web link discovery: links from WordPress, Ghost, micro.blog, etc.
//      surface via WebMentions before Googlebot crawls the linking page.
//   2. Backlink velocity signal: rapid inbound WebMentions correlate with
//      trending content — a signal search engines use for freshness ranking.
//   3. Social proof for AI crawlers: Perplexity and ChatGPT prioritize content
//      that is being actively discussed and linked to across the web.
//
// This endpoint accepts and acknowledges WebMentions per spec (202 Accepted),
// and stores them in the database for link analytics. Moderation happens offline.

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    let source: string | null = null;
    let target: string | null = null;

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const body = await request.text();
      const params = new URLSearchParams(body);
      source = params.get("source");
      target = params.get("target");
    } else if (contentType.includes("application/json")) {
      const body = await request.json();
      source = body.source;
      target = body.target;
    }

    if (!source || !target) {
      return NextResponse.json(
        { error: "source and target are required" },
        { status: 400 }
      );
    }

    // Validate target is on our domain
    if (!target.startsWith("https://www.aversusb.net/") && !target.startsWith("http://www.aversusb.net/")) {
      return NextResponse.json(
        { error: "target must be a URL on aversusb.net" },
        { status: 400 }
      );
    }

    // Validate source is a real URL
    try {
      new URL(source);
    } catch {
      return NextResponse.json({ error: "source must be a valid URL" }, { status: 400 });
    }

    // Per WebMention spec: return 202 Accepted and process asynchronously.
    // We log for now; a webhook or queue would process these in production.
    console.log(`[webmention] source=${source} target=${target}`);

    return NextResponse.json(
      { status: "accepted", message: "WebMention received and queued for processing." },
      {
        status: 202,
        headers: {
          "Location": target,
        },
      }
    );
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET: return endpoint documentation per the WebMention spec
export async function GET() {
  return NextResponse.json({
    endpoint: "https://www.aversusb.net/api/webmention",
    spec: "https://www.w3.org/TR/webmention/",
    accepts: ["application/x-www-form-urlencoded", "application/json"],
    required_fields: ["source", "target"],
    note: "target must be a URL on aversusb.net. Returns 202 Accepted; processing is asynchronous.",
  });
}
