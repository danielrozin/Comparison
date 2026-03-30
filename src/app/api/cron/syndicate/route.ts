import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import {
  selectSyndicationCandidates,
  syndicateCandidate,
  saveSyndicatedContent,
  getSyndicationStats,
} from "@/lib/services/content-syndication";
import { getComparisonBySlug } from "@/lib/services/comparison-service";
import { getBlogBySlug } from "@/lib/services/blog-generator";
import { sendNotificationEmail } from "@/lib/services/email";

export const maxDuration = 120; // 2 minutes

/**
 * GET /api/cron/syndicate
 *
 * Automated cron job that selects top-performing published content
 * and formats it for syndication to Medium, dev.to, and LinkedIn.
 *
 * Articles are saved as "pending" — manual publishing step follows.
 * Runs daily, targeting 4-8 pieces of content per run.
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const checkInId = Sentry.captureCheckIn({
    monitorSlug: "content-syndicate",
    status: "in_progress",
  }, {
    schedule: { type: "crontab", value: "0 10 * * *" },
    maxRuntime: 5,
    checkinMargin: 5,
  });

  const startTime = Date.now();
  const allErrors: string[] = [];
  let totalFormatted = 0;
  const formattedByPlatform: Record<string, number> = {};
  const formattedSlugs: string[] = [];

  try {
    // Step 1: Select candidates (top published content not yet syndicated)
    const candidates = await selectSyndicationCandidates(8);

    if (candidates.length === 0) {
      Sentry.captureCheckIn({
        checkInId,
        monitorSlug: "content-syndicate",
        status: "ok",
      });

      return NextResponse.json({
        success: true,
        message: "No new candidates for syndication",
        timestamp: new Date().toISOString(),
      });
    }

    // Step 2: Format and save each candidate for all platforms
    for (const candidate of candidates) {
      try {
        const articles = await syndicateCandidate(
          candidate,
          getComparisonBySlug,
          async (slug: string) => {
            const blog = await getBlogBySlug(slug);
            if (!blog) return null;
            return {
              slug: blog.slug,
              title: blog.title,
              content: blog.content,
              category: blog.category || null,
              tags: blog.tags || [],
              excerpt: blog.excerpt || null,
            };
          }
        );

        for (const article of articles) {
          try {
            await saveSyndicatedContent(article);
            totalFormatted++;
            formattedByPlatform[article.platform] = (formattedByPlatform[article.platform] || 0) + 1;
            if (!formattedSlugs.includes(article.sourceSlug)) {
              formattedSlugs.push(article.sourceSlug);
            }
          } catch (err) {
            allErrors.push(`Save ${article.sourceSlug}/${article.platform}: ${err instanceof Error ? err.message : "Unknown"}`);
          }
        }
      } catch (err) {
        allErrors.push(`Syndicate ${candidate.slug}: ${err instanceof Error ? err.message : "Unknown"}`);
      }
    }

    // Step 3: Get overall stats
    const stats = await getSyndicationStats();

    const duration = Date.now() - startTime;

    // Step 4: Send email report
    const report = `Content Syndication Pipeline Report
========================================
Date: ${new Date().toISOString().split("T")[0]}
Duration: ${(duration / 1000).toFixed(1)}s

This Run:
  Candidates evaluated: ${candidates.length}
  Articles formatted: ${totalFormatted}
  By platform: ${Object.entries(formattedByPlatform).map(([k, v]) => `${k}=${v}`).join(", ") || "none"}
  Content slugs: ${formattedSlugs.join(", ") || "none"}

Overall Stats:
  Total syndicated: ${stats.total}
  Pending publish: ${stats.pending}
  By platform: ${Object.entries(stats.byPlatform).map(([k, v]) => `${k}=${v}`).join(", ") || "none"}
${allErrors.length > 0 ? `\nErrors (${allErrors.length}):\n${allErrors.map((e) => `  - ${e}`).join("\n")}` : "\nNo errors!"}

Note: Pending articles are ready for manual publishing on each platform.
Review at: https://www.aversusb.net/admin/syndication
`;

    try {
      await sendNotificationEmail({
        subject: `Syndication: ${totalFormatted} articles formatted for ${Object.keys(formattedByPlatform).join("/")}`,
        type: "cron-report",
        message: report,
        pageUrl: "https://www.aversusb.net/admin/syndication",
      });
    } catch {
      // Email is non-critical
    }

    Sentry.captureCheckIn({
      checkInId,
      monitorSlug: "content-syndicate",
      status: allErrors.length > totalFormatted ? "error" : "ok",
    });

    return NextResponse.json({
      success: true,
      duration: `${(duration / 1000).toFixed(1)}s`,
      candidatesEvaluated: candidates.length,
      totalFormatted,
      formattedByPlatform,
      formattedSlugs,
      overallStats: stats,
      errors: allErrors,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    Sentry.captureCheckIn({
      checkInId,
      monitorSlug: "content-syndicate",
      status: "error",
    });

    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      errors: allErrors,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
