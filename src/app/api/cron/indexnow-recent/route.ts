import { NextRequest, NextResponse } from "next/server";
import { submitIndexNowGuarded } from "@/lib/seo/indexnow";
import { recentSitemapUrls } from "@/lib/seo/indexnow-recent";
import sitemap, { generateSitemaps } from "@/app/sitemap";

export const maxDuration = 60;

const DEFAULT_WINDOW_DAYS = 30;

/**
 * GET /api/cron/indexnow-recent
 *
 * Daily cron that submits every sitemap URL modified in the last 30 days
 * (override with ?days=N, 1–90). Complements the publish-time
 * notifyIndexNow() hooks: it covers pages that change by deploy (hubs, repo
 * blog overrides) rather than by a DB write. Goes through the shared
 * IndexNow ledger, so URLs sent in the last 7 days are not re-sent and the
 * daily cap applies.
 *
 * Previously this read comparisons/blog rows by updatedAt with no status
 * filter, which included archived and provisional (noindex) pages.
 *
 * Configured in vercel.json:
 *   { "path": "/api/cron/indexnow-recent", "schedule": "0 9 * * *" }
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const daysParam = Number(request.nextUrl.searchParams.get("days"));
  const days = Number.isFinite(daysParam) && daysParam >= 1 && daysParam <= 90 ? daysParam : DEFAULT_WINDOW_DAYS;
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  let urls: string[];
  try {
    const shards = await generateSitemaps();
    const perShard = await Promise.all(shards.map((s) => sitemap({ id: s.id })));
    urls = recentSitemapUrls(perShard.flat(), cutoff);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to build sitemap URL list", detail: String(e), submitted: 0 },
      { status: 500 }
    );
  }

  if (urls.length === 0) {
    return NextResponse.json({ message: "No recently-updated URLs found", submitted: 0 });
  }

  // Shared ledger: skips URLs any path sent in the last 7 days and stays
  // inside the daily sweep cap (newest changes first).
  const result = await submitIndexNowGuarded(urls, "sweep", `cron:indexnow-recent:${days}d`);
  return NextResponse.json({ cutoff: cutoff.toISOString(), ...result });
}
