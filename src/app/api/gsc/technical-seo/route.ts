import { NextRequest, NextResponse } from "next/server";
import {
  analyzeGSCTechnicalIssues,
  getGSCStats,
} from "@/lib/services/gsc-service";

/**
 * GET /api/gsc/technical-seo?severity=critical|warning|info|all
 * Returns technical SEO issues detected from GSC data.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (
    authHeader !== `Bearer ${process.env.ADMIN_TOKEN}` &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const severityFilter = request.nextUrl.searchParams.get("severity") || "all";

  try {
    const [issues, stats] = await Promise.all([
      analyzeGSCTechnicalIssues(),
      getGSCStats(),
    ]);

    let filtered = issues;
    if (severityFilter !== "all") {
      filtered = issues.filter((i) => i.severity === severityFilter);
    }

    const summary = {
      critical: issues.filter((i) => i.severity === "critical").length,
      warning: issues.filter((i) => i.severity === "warning").length,
      info: issues.filter((i) => i.severity === "info").length,
    };

    return NextResponse.json({
      issues: filtered,
      summary,
      stats,
      filter: severityFilter,
      total: filtered.length,
    });
  } catch (err) {
    console.error("Technical SEO endpoint error:", err);
    return NextResponse.json(
      { error: "Failed to analyze technical SEO" },
      { status: 500 }
    );
  }
}
