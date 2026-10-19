import { NextRequest, NextResponse } from "next/server";
import { submitIndexNowGuarded, filterIndexableUrls, normalizeIndexNowUrl, INDEXNOW_KEY } from "@/lib/seo/indexnow";
import sitemap, { generateSitemaps } from "@/app/sitemap";

export const maxDuration = 60;

/**
 * sitemap() is a sharded index generator (one shard per id from
 * generateSitemaps()). Gather every shard's URLs into one flat list.
 */
async function collectAllSitemapUrls(): Promise<string[]> {
  const shards = await generateSitemaps();
  const perShard = await Promise.all(shards.map((s) => sitemap({ id: s.id })));
  return perShard.flat().map((e) => (typeof e.url === "string" ? e.url : String(e.url)));
}

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
      urls = await collectAllSitemapUrls();
    } catch (e) {
      return NextResponse.json(
        { error: "Failed to build sitemap URL list", detail: String(e) },
        { status: 500 }
      );
    }
  } else if (Array.isArray(body.urls)) {
    // Hand-picked URLs are checked first: only 200, canonical, indexable
    // pages are sent. Sitemap URLs (mode 2) are indexable by construction.
    const candidates = [
      ...new Set(
        body.urls
          .map((u) => (typeof u === "string" ? normalizeIndexNowUrl(u) : null))
          .filter((u): u is string => !!u)
      ),
    ].slice(0, 500);
    const checked = await filterIndexableUrls(candidates);
    if (checked.dropped.length > 0) {
      console.info(`[indexnow] /api/indexnow dropped ${checked.dropped.length} URLs: ${checked.dropped.map((d) => `${d.url}(${d.reason})`).join(" ")}`);
    }
    const result = await submitIndexNowGuarded(checked.indexable, "publish", "api:indexnow:urls");
    return NextResponse.json({ keyLocation: `/${INDEXNOW_KEY}.txt`, ...result, dropped: checked.dropped });
  } else {
    return NextResponse.json(
      { error: "Provide { urls: string[] } or { all: true }" },
      { status: 400 }
    );
  }

  const result = await submitIndexNowGuarded(urls, "sweep", "api:indexnow:all");
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
      const urls = await collectAllSitemapUrls();
      // Daily cron. The shared ledger skips URLs sent in the last 7 days and
      // caps the sweep, so this rotates through the sitemap instead of
      // re-sending every URL every day.
      const result = await submitIndexNowGuarded(urls, "sweep", "cron:indexnow-all");
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
