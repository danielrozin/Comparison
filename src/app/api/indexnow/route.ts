import { NextRequest, NextResponse } from "next/server";
import { submitToIndexNow, INDEXNOW_KEY } from "@/lib/seo/indexnow";
import sitemap from "@/app/sitemap";

export const maxDuration = 60;

/**
 * POST /api/indexnow
 *
 * Bulk-submit URLs to IndexNow (Bing / Yandex / Naver / Seznam). Two modes:
 *
 *  1. { "urls": ["https://www.aversusb.net/compare/a-vs-b", ...] }
 *     → submits exactly those URLs.
 *
 *  2. { "all": true }
 *     → submits every URL currently in the sitemap. Use this after an outage
 *       (e.g. the 2026-05 HTTP 402 window) to ask engines to re-crawl the
 *       whole site without waiting for Google Search Console access.
 *
 * Protected by CRON_SECRET when set (Authorization: Bearer <secret>).
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { urls?: string[]; all?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    // empty / invalid body — treat as no-op below
  }

  let urls: string[] = [];

  if (body.all) {
    try {
      const entries = await sitemap();
      urls = entries.map((e) => (typeof e.url === "string" ? e.url : String(e.url)));
    } catch (e) {
      return NextResponse.json(
        { error: "Failed to build sitemap URL list", detail: String(e) },
        { status: 500 }
      );
    }
  } else if (Array.isArray(body.urls)) {
    urls = body.urls;
  } else {
    return NextResponse.json(
      { error: "Provide { urls: string[] } or { all: true }" },
      { status: 400 }
    );
  }

  const result = await submitToIndexNow(urls);
  return NextResponse.json({ keyLocation: `/${INDEXNOW_KEY}.txt`, ...result });
}

/**
 * GET /api/indexnow
 *  - `?all=1` (with Bearer CRON_SECRET) → submit the full sitemap. This is the
 *    form Vercel Cron invokes, giving a periodic whole-site re-crawl signal.
 *  - otherwise → health/info probe (no submission).
 */
export async function GET(request: NextRequest) {
  const all = request.nextUrl.searchParams.get("all");
  if (all === "1" || all === "true") {
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      const entries = await sitemap();
      const urls = entries.map((e) => (typeof e.url === "string" ? e.url : String(e.url)));
      const result = await submitToIndexNow(urls);
      return NextResponse.json({ keyLocation: `/${INDEXNOW_KEY}.txt`, ...result });
    } catch (e) {
      return NextResponse.json(
        { error: "Failed to submit sitemap", detail: String(e) },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    service: "IndexNow",
    keyLocation: `/${INDEXNOW_KEY}.txt`,
    usage: "POST { urls: string[] } or { all: true } with Bearer CRON_SECRET; GET ?all=1 for full sitemap",
  });
}
