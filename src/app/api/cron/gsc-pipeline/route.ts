import { NextRequest, NextResponse } from "next/server";
import { analyzeGSCOpportunities } from "@/lib/services/gsc-service";
import { generateComparison } from "@/lib/services/ai-comparison-generator";
import { saveComparison } from "@/lib/services/comparison-service";
import { sendNotificationEmail } from "@/lib/services/email";

export const maxDuration = 300;

/**
 * GET /api/cron/gsc-pipeline
 *
 * Daily cron: fetches GSC data, creates comparison pages + blog articles,
 * and sends a summary email report.
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const MAX_COMPARISONS = 5;
  const MAX_BLOG_ARTICLES = 5;

  const report = {
    comparisonsCreated: [] as string[],
    blogArticlesCreated: [] as string[],
    errors: [] as string[],
    totalOpportunities: 0,
    comparisonOpportunities: 0,
    blogOpportunities: 0,
  };

  try {
    const opportunities = await analyzeGSCOpportunities();
    report.totalOpportunities = opportunities.length;

    if (opportunities.length === 0) {
      // No GSC data (credentials likely not configured)
      return NextResponse.json({
        success: true,
        message:
          "No GSC data available. Ensure GOOGLE_SERVICE_ACCOUNT_KEY is configured.",
        durationMs: Date.now() - startTime,
      });
    }

    // Separate by type
    const comparisonOpps = opportunities.filter(
      (o) =>
        o.type === "comparison" &&
        !o.hasExistingPage &&
        o.entityA &&
        o.entityB
    );
    const blogOpps = opportunities.filter(
      (o) => o.type === "blog" && !o.hasExistingPage
    );

    report.comparisonOpportunities = comparisonOpps.length;
    report.blogOpportunities = blogOpps.length;

    // --- Generate comparison pages ---
    for (const opp of comparisonOpps.slice(0, MAX_COMPARISONS)) {
      try {
        const slug = `${slugify(opp.entityA!)}-vs-${slugify(opp.entityB!)}`;
        const result = await generateComparison(
          opp.entityA!,
          opp.entityB!,
          slug
        );
        if (result.success && result.comparison) {
          await saveComparison(result.comparison);
          report.comparisonsCreated.push(slug);
        } else {
          report.errors.push(
            `Comparison gen failed: ${opp.query} — ${result.error || "unknown"}`
          );
        }
      } catch (err) {
        report.errors.push(
          `Comparison error: ${opp.query} — ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }

    // --- Generate blog articles ---
    for (const opp of blogOpps.slice(0, MAX_BLOG_ARTICLES)) {
      try {
        const { generateBlogArticle } = await import(
          "@/lib/services/blog-generator"
        );
        const article = await generateBlogArticle(opp.query, {
          query: opp.query,
          impressions: opp.impressions,
        });
        if (article) {
          report.blogArticlesCreated.push(opp.query);
        }
      } catch (err) {
        report.errors.push(
          `Blog skipped: "${opp.query}" — ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }

    // --- Send email report ---
    const durationMs = Date.now() - startTime;
    try {
      await sendNotificationEmail({
        subject: "GSC Pipeline Report",
        type: "gsc-pipeline",
        message: [
          `GSC Pipeline completed in ${(durationMs / 1000).toFixed(1)}s`,
          `Total opportunities: ${report.totalOpportunities}`,
          `Comparison opportunities: ${report.comparisonOpportunities}`,
          `Blog opportunities: ${report.blogOpportunities}`,
          `Comparisons created: ${report.comparisonsCreated.length} — ${report.comparisonsCreated.join(", ") || "none"}`,
          `Blog articles created: ${report.blogArticlesCreated.length} — ${report.blogArticlesCreated.join(", ") || "none"}`,
          report.errors.length > 0
            ? `Errors (${report.errors.length}): ${report.errors.join("; ")}`
            : "No errors",
        ].join("\n"),
      });
    } catch (emailErr) {
      console.warn("GSC Pipeline: Failed to send email report:", emailErr);
    }

    return NextResponse.json({
      success: true,
      report,
      durationMs,
    });
  } catch (err) {
    console.error("GSC Pipeline cron error:", err);
    return NextResponse.json(
      {
        error: "GSC Pipeline failed",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
