import { NextRequest, NextResponse } from "next/server";
import { fetchGSCPageData } from "@/lib/services/gsc-service";
import { sendNotificationEmail } from "@/lib/services/email";
import {
  formatRefreshEmail,
  rankRefreshCandidates,
  trafficByPath,
  type RefreshPage,
} from "@/lib/seo/refresh-candidates";
import { SITE_URL } from "@/lib/utils/constants";

export const maxDuration = 120;

/**
 * GET /api/cron/refresh-candidates — weekly (Mon 9:30 UTC).
 *
 * Emails the founders the 10 blog and comparison pages that most need a
 * refresh, ranked from Search Console (last 28 days vs the 28 before) plus
 * page age and past-year mentions.
 *
 * READ-ONLY. It never writes content or updatedAt: since PR #351 no job
 * rewrites live pages unreviewed. Refreshes are drafted and approved by a
 * founder, then shipped like PR #564.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { getPrisma } = await import("@/lib/db/prisma");
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "No database connection" }, { status: 503 });
  }

  const now = new Date();
  const pastYear = String(now.getUTCFullYear() - 1);

  const [blogs, blogsPastYear, comparisons, comparisonsPastYear, curRows, prevRows] = await Promise.all([
    prisma.blogArticle.findMany({
      where: { status: "published" },
      select: { slug: true, title: true, updatedAt: true },
    }),
    prisma.blogArticle.findMany({
      where: {
        status: "published",
        OR: [{ title: { contains: pastYear } }, { content: { contains: pastYear } }],
      },
      select: { slug: true },
    }),
    prisma.comparison.findMany({
      where: { status: "published" },
      select: { slug: true, title: true, updatedAt: true },
    }),
    prisma.comparison.findMany({
      where: {
        status: "published",
        OR: [{ title: { contains: pastYear } }, { shortAnswer: { contains: pastYear } }],
      },
      select: { slug: true },
    }),
    fetchGSCPageData(28, 3),
    fetchGSCPageData(28, 31),
  ]);

  if (!curRows.length) {
    return NextResponse.json({ status: "skipped", reason: "No Search Console data" }, { status: 503 });
  }

  const staleBlog = new Set(blogsPastYear.map((b) => b.slug));
  const staleCompare = new Set(comparisonsPastYear.map((c) => c.slug));
  const pages: RefreshPage[] = [
    ...blogs.map((b) => ({
      path: `/blog/${b.slug}`,
      title: b.title,
      updatedAt: b.updatedAt,
      mentionsPastYear: staleBlog.has(b.slug),
    })),
    ...comparisons.map((c) => ({
      path: `/compare/${c.slug}`,
      title: c.title,
      updatedAt: c.updatedAt,
      mentionsPastYear: staleCompare.has(c.slug),
    })),
  ];

  // Static blog pages live in code, not the DB. Queue them by traffic with an
  // unknown age so they are not invisible to the refresh loop.
  const current = trafficByPath(curRows);
  const previous = trafficByPath(prevRows);
  const known = new Set(pages.map((p) => p.path));
  for (const path of current.keys()) {
    if (/^\/blog\/[^/]+$/.test(path) && !known.has(path)) {
      pages.push({ path, title: path.replace("/blog/", ""), updatedAt: null });
    }
  }

  const candidates = rankRefreshCandidates(pages, current, previous, now);
  const email = await sendNotificationEmail({
    subject: `Weekly refresh queue: ${candidates.length} pages`,
    type: "refresh-candidates",
    message: formatRefreshEmail(candidates, SITE_URL),
  });

  return NextResponse.json({
    pagesConsidered: pages.length,
    candidates,
    emailed: email.success,
  });
}
