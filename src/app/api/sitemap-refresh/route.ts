import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const SITE_URL = "https://www.aversusb.net";

/**
 * On-demand sitemap regeneration + optional Google Search Console ping.
 *
 * POST /api/sitemap-refresh
 * Body: { secret?: string, pingGoogle?: boolean }
 *
 * Revalidates all sitemap routes so Next.js regenerates them on the next request.
 * Optionally pings Google to re-crawl the sitemap index.
 *
 * Call this after new comparisons, blog posts, or reviews are added.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, pingGoogle } = body as { secret?: string; pingGoogle?: boolean };

    const expectedSecret = process.env.REVALIDATION_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    // Revalidate all sitemap sub-routes (Next.js generates /sitemap/0.xml through /sitemap/4.xml)
    const sitemapPaths = [
      "/sitemap.xml",
      "/sitemap/0.xml",
      "/sitemap/1.xml",
      "/sitemap/2.xml",
      "/sitemap/3.xml",
      "/sitemap/4.xml",
    ];

    for (const path of sitemapPaths) {
      revalidatePath(path);
    }

    let googlePinged = false;
    if (pingGoogle) {
      try {
        const sitemapUrl = encodeURIComponent(`${SITE_URL}/sitemap.xml`);
        const pingUrl = `https://www.google.com/ping?sitemap=${sitemapUrl}`;
        const res = await fetch(pingUrl, { method: "GET" });
        googlePinged = res.ok;
      } catch {
        // Google ping failed — non-critical
      }
    }

    return NextResponse.json({
      revalidated: sitemapPaths,
      googlePinged,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sitemap refresh failed" },
      { status: 500 }
    );
  }
}
