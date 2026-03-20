import { NextRequest, NextResponse } from "next/server";
import { analyzeGSCOpportunities } from "@/lib/services/gsc-service";
import { generateComparison } from "@/lib/services/ai-comparison-generator";
import { saveComparison } from "@/lib/services/comparison-service";

/**
 * POST /api/gsc/sync
 * Body: { mode: "comparisons" | "blog" | "all", limit?: number }
 *
 * Fetches GSC data, identifies opportunities, generates content, saves to DB.
 */
export async function POST(request: NextRequest) {
  // Auth check
  const authHeader = request.headers.get("authorization");
  if (
    authHeader !== `Bearer ${process.env.ADMIN_TOKEN}` &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { mode?: string; limit?: number } = {};
  try {
    body = await request.json();
  } catch {
    // default values will apply
  }

  const mode = body.mode || "all";
  const limit = body.limit || 5;

  try {
    const opportunities = await analyzeGSCOpportunities();

    const results: {
      comparisonsCreated: string[];
      blogArticlesCreated: string[];
      errors: string[];
    } = {
      comparisonsCreated: [],
      blogArticlesCreated: [],
      errors: [],
    };

    // --- Comparisons ---
    if (mode === "comparisons" || mode === "all") {
      const compOpps = opportunities
        .filter(
          (o) =>
            o.type === "comparison" &&
            !o.hasExistingPage &&
            o.entityA &&
            o.entityB
        )
        .slice(0, limit);

      for (const opp of compOpps) {
        try {
          const slug = `${slugify(opp.entityA!)}-vs-${slugify(opp.entityB!)}`;
          const result = await generateComparison(
            opp.entityA!,
            opp.entityB!,
            slug
          );
          if (result.success && result.comparison) {
            await saveComparison(result.comparison);
            results.comparisonsCreated.push(slug);
          } else {
            results.errors.push(
              `Failed to generate comparison: ${opp.query} — ${result.error || "unknown error"}`
            );
          }
        } catch (err) {
          results.errors.push(
            `Error generating ${opp.query}: ${err instanceof Error ? err.message : String(err)}`
          );
        }
      }
    }

    // --- Blog articles ---
    if (mode === "blog" || mode === "all") {
      const blogOpps = opportunities
        .filter((o) => o.type === "blog" && !o.hasExistingPage)
        .slice(0, limit);

      for (const opp of blogOpps) {
        try {
          // Dynamic import — blog-generator may not exist yet
          const { generateBlogArticle } = await import(
            "@/lib/services/blog-generator"
          );
          const article = await generateBlogArticle(opp.query, {
            query: opp.query,
            impressions: opp.impressions,
          });
          if (article) {
            results.blogArticlesCreated.push(opp.query);
          }
        } catch (err) {
          // Blog generator may not be implemented yet — log and skip
          results.errors.push(
            `Blog generation skipped for "${opp.query}": ${err instanceof Error ? err.message : String(err)}`
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      mode,
      limit,
      totalOpportunities: opportunities.length,
      results,
    });
  } catch (err) {
    console.error("GSC sync error:", err);
    return NextResponse.json(
      { error: "Sync failed", details: err instanceof Error ? err.message : String(err) },
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
