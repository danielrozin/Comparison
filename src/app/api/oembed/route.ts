import { NextRequest, NextResponse } from "next/server";

const SITE_URL = "https://www.aversusb.net";
const SITE_NAME = "A Versus B";
const PROVIDER_URL = SITE_URL;

// oEmbed 1.0 endpoint — https://oembed.com/
//
// Allows Slack, Discord, Twitter/X, Notion, Ghost, and AI crawlers
// to fetch rich preview metadata when a user pastes an aversusb.net URL.
// Perplexity, ChatGPT browsing, and similar AEO tools also call this to get
// structured summaries without scraping full HTML.

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const url = searchParams.get("url") ?? "";
  const format = searchParams.get("format") ?? "json";

  if (!url) {
    return NextResponse.json({ error: "url parameter is required" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const allowedHosts = ["www.aversusb.net", "aversusb.net"];
  if (!allowedHosts.includes(parsed.hostname)) {
    return NextResponse.json({ error: "URL not supported" }, { status: 404 });
  }

  const path = parsed.pathname;

  let title = SITE_NAME;
  let description = "Compare anything — get clear, data-driven verdicts.";
  let thumbnailUrl = `${SITE_URL}/images/og-default.jpg`;

  const compareMatch = path.match(/^\/compare\/([^/?#]+)/);
  const blogMatch = path.match(/^\/blog\/([^/?#]+)/);
  const entityMatch = path.match(/^\/entity\/([^/?#]+)/);

  const toTitle = (s: string) =>
    s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  if (compareMatch) {
    const slug = compareMatch[1];
    const parts = slug.split("-vs-");
    if (parts.length >= 2) {
      const a = toTitle(parts[0]);
      const b = toTitle(parts.slice(1).join("-vs-"));
      title = `${a} vs ${b} — Which Is Better? | ${SITE_NAME}`;
      description = `In-depth comparison of ${a} and ${b}. Key differences, verdict, and FAQs.`;
    } else {
      title = `${toTitle(slug)} | ${SITE_NAME}`;
    }
    thumbnailUrl = `${SITE_URL}/api/og?slug=${encodeURIComponent(slug)}&type=compare`;
  } else if (blogMatch) {
    const slug = blogMatch[1];
    title = `${toTitle(slug)} | ${SITE_NAME}`;
    description = `Read this article on ${SITE_NAME} — comparison guides, data studies, and deep dives.`;
    thumbnailUrl = `${SITE_URL}/api/og?slug=${encodeURIComponent(slug)}&type=blog`;
  } else if (entityMatch) {
    const slug = entityMatch[1];
    const name = toTitle(slug);
    title = `${name} — Overview & Comparisons | ${SITE_NAME}`;
    description = `Everything about ${name}: key facts, comparisons, and community verdicts on ${SITE_NAME}.`;
    thumbnailUrl = `${SITE_URL}/api/og?slug=${encodeURIComponent(slug)}&type=entity`;
  }

  const oembedJson = {
    version: "1.0",
    type: "link",
    title,
    description,
    provider_name: SITE_NAME,
    provider_url: PROVIDER_URL,
    author_name: SITE_NAME,
    author_url: SITE_URL,
    thumbnail_url: thumbnailUrl,
    thumbnail_width: 1200,
    thumbnail_height: 630,
    url: parsed.href,
    cache_age: 86400,
  };

  const headers: HeadersInit = {
    "Cache-Control": "public, max-age=3600, s-maxage=86400",
    "Access-Control-Allow-Origin": "*",
    "X-Robots-Tag": "all",
  };

  if (format === "xml") {
    const xml = `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<oembed>
  <version>1.0</version>
  <type>link</type>
  <title>${escXml(title)}</title>
  <description>${escXml(description)}</description>
  <provider_name>${escXml(SITE_NAME)}</provider_name>
  <provider_url>${escXml(PROVIDER_URL)}</provider_url>
  <author_name>${escXml(SITE_NAME)}</author_name>
  <author_url>${escXml(SITE_URL)}</author_url>
  <thumbnail_url>${escXml(thumbnailUrl)}</thumbnail_url>
  <thumbnail_width>1200</thumbnail_width>
  <thumbnail_height>630</thumbnail_height>
  <cache_age>86400</cache_age>
</oembed>`;
    return new NextResponse(xml, {
      headers: { ...headers, "Content-Type": "text/xml; charset=utf-8" },
    });
  }

  return NextResponse.json(oembedJson, { headers });
}

function escXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
