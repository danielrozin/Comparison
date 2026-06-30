import { NextRequest, NextResponse } from "next/server";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

// oEmbed endpoint — https://oembed.com spec v1.0
// Slack, Discord, Twitter/X, LinkedIn, Notion, and AI assistants (Perplexity cards,
// ChatGPT browse) use oEmbed to render rich link previews when a user pastes an
// aversusb.net URL. The rich type returns an HTML snippet + full metadata so
// embedding platforms display a structured comparison card rather than a plain URL.

const SUPPORTED_PATTERNS = [
  /^https?:\/\/(www\.)?aversusb\.net\/compare\//,
  /^https?:\/\/(www\.)?aversusb\.net\/blog\//,
  /^https?:\/\/(www\.)?aversusb\.net\/entity\//,
  /^https?:\/\/(www\.)?aversusb\.net\/alternatives\//,
];

function isSupportedUrl(url: string): boolean {
  return SUPPORTED_PATTERNS.some((p) => p.test(url));
}

function slugFromUrl(url: string): { type: string; slug: string } | null {
  const u = new URL(url);
  const parts = u.pathname.split("/").filter(Boolean);
  if (parts.length >= 2) {
    return { type: parts[0], slug: parts.slice(1).join("/") };
  }
  return null;
}

function buildTitle(type: string, slug: string): string {
  const readable = slug
    .replace(/-vs-/g, " vs ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  switch (type) {
    case "compare":
      return `${readable} — Comparison | ${SITE_NAME}`;
    case "blog":
      return `${readable} | ${SITE_NAME} Blog`;
    case "entity":
      return `${readable} Profile | ${SITE_NAME}`;
    case "alternatives":
      return `${readable} Alternatives | ${SITE_NAME}`;
    default:
      return `${readable} | ${SITE_NAME}`;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const url = searchParams.get("url");
  const format = searchParams.get("format") ?? "json";
  const maxwidth = parseInt(searchParams.get("maxwidth") ?? "800", 10);
  const maxheight = parseInt(searchParams.get("maxheight") ?? "600", 10);

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  if (format === "xml") {
    return NextResponse.json(
      { error: "XML format not supported; use format=json" },
      { status: 501 }
    );
  }

  if (!isSupportedUrl(url)) {
    return NextResponse.json({ error: "URL not supported" }, { status: 404 });
  }

  const parsed = slugFromUrl(url);
  if (!parsed) {
    return NextResponse.json({ error: "Could not parse URL" }, { status: 400 });
  }

  const { type, slug } = parsed;
  const canonicalUrl = `${SITE_URL}/${type}/${slug}`;
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(slug.replace(/-/g, "+"))}&type=${type}`;
  const title = buildTitle(type, slug);
  const description =
    type === "compare"
      ? `Side-by-side comparison of ${slug.replace(/-vs-/g, " vs ").replace(/-/g, " ")} with key differences, verdict, and community vote.`
      : `Discover ${slug.replace(/-/g, " ")} on A Versus B — the internet's most comprehensive comparison platform.`;

  const width = Math.min(maxwidth, 800);
  const height = Math.min(maxheight, 450);

  const htmlEmbed = `<blockquote class="aversusb-embed" data-url="${canonicalUrl}" style="max-width:${width}px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;font-family:sans-serif;"><a href="${canonicalUrl}" target="_blank" rel="noopener noreferrer" style="display:block;text-decoration:none;color:inherit;"><img src="${ogImageUrl}" alt="${title}" style="width:100%;height:auto;display:block;" width="${width}" height="${Math.round(width * 0.525)}" loading="lazy" /><div style="padding:12px 16px;"><strong style="font-size:15px;color:#111;">${title}</strong><p style="font-size:13px;color:#555;margin:4px 0 0;">${description}</p><span style="font-size:11px;color:#888;">aversusb.net</span></div></a></blockquote>`;

  const response = {
    version: "1.0",
    type: "rich",
    provider_name: SITE_NAME,
    provider_url: SITE_URL,
    title,
    description,
    url: canonicalUrl,
    thumbnail_url: ogImageUrl,
    thumbnail_width: width,
    thumbnail_height: Math.round(width * 0.525),
    width,
    height,
    html: htmlEmbed,
    // author info for E-E-A-T signals in embedding platforms
    author_name: "A Versus B",
    author_url: `${SITE_URL}/about`,
    cache_age: 86400,
  };

  return NextResponse.json(response, {
    headers: {
      "Content-Type": "application/json+oembed",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
