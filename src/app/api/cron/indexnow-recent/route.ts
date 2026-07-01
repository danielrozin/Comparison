import { NextRequest, NextResponse } from "next/server";
import { submitToIndexNow } from "@/lib/seo/indexnow";
import { SITE_URL } from "@/lib/utils/constants";

export const maxDuration = 60;

/**
 * GET /api/cron/indexnow-recent
 *
 * Daily cron that submits only comparisons and blog articles updated in the
 * last 30 days to IndexNow. Complements the full-sitemap push at
 * /api/indexnow?all=1 by giving engines a targeted freshness signal
 * without the overhead of resubmitting 6,000+ unchanged URLs.
 *
 * Configured in vercel.json:
 *   { "path": "/api/cron/indexnow-recent", "schedule": "0 9 * * *" }
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const urls: string[] = [];

  try {
    // Lazy-import prisma so this route doesn't crash when DATABASE_URL is absent
    // (consistent with comparison-service.ts pattern).
    const { getPrisma } = await import("@/lib/db/prisma");
    const prisma = getPrisma();
    if (!prisma) {
      return NextResponse.json({ error: "No database connection", submitted: 0 }, { status: 503 });
    }

    const [comparisons, blogs] = await Promise.all([
      prisma.comparison.findMany({
        where: { updatedAt: { gte: cutoff } },
        select: { slug: true },
        orderBy: { updatedAt: "desc" },
        take: 5000,
      }),
      prisma.blogArticle.findMany({
        where: { updatedAt: { gte: cutoff } },
        select: { slug: true },
        orderBy: { updatedAt: "desc" },
        take: 1000,
      }).catch(() => [] as { slug: string }[]),
    ]);

    for (const c of comparisons) urls.push(`${SITE_URL}/compare/${c.slug}`);
    for (const b of blogs) urls.push(`${SITE_URL}/blog/${b.slug}`);
  } catch (e) {
    return NextResponse.json(
      { error: "DB query failed", detail: String(e), submitted: 0 },
      { status: 500 }
    );
  }

  if (urls.length === 0) {
    return NextResponse.json({ message: "No recently-updated URLs found", submitted: 0 });
  }

  const result = await submitToIndexNow(urls);
  return NextResponse.json({ cutoff: cutoff.toISOString(), ...result });
}
