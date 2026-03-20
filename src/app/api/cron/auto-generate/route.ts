import { NextRequest, NextResponse } from "next/server";
import { runDiscovery, runGeneration, recordPipelineRun } from "@/lib/services/pipeline-service";
import { sendNotificationEmail } from "@/lib/services/email";

export const maxDuration = 300; // 5 minutes — enough for discovery + generation

/**
 * GET /api/cron/auto-generate
 *
 * Automated cron job that runs the full content velocity pipeline:
 * 1. Discovers new comparison keywords via DataForSEO
 * 2. Picks the top opportunities (highest search volume, lowest difficulty)
 * 3. Generates comparisons via Claude AI (with Tavily real-time data enrichment)
 * 4. Saves new pages to PostgreSQL database
 * 5. Sends an email report
 *
 * Triggered by Vercel Cron (vercel.json) twice daily at 6am and 6pm UTC.
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const runId = `auto-${Date.now()}`;

  // Rotate through categories each run for variety
  const categories = [
    "sports", "countries", "technology", "products",
    "companies", "history", "entertainment", "brands",
  ];
  const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const hourOfDay = new Date().getUTCHours();
  const categoryIndex = (dayOfYear * 2 + (hourOfDay >= 12 ? 1 : 0)) % categories.length;
  const category = categories[categoryIndex];

  let discoveredCount = 0;
  const allErrors: string[] = [];

  // Step 1: Discover new keyword opportunities
  try {
    const discovered = await runDiscovery(category);
    discoveredCount = discovered.length;
  } catch (err) {
    allErrors.push(`Discovery failed: ${err instanceof Error ? err.message : "Unknown"}`);
  }

  // Step 2: Generate top 10 comparisons from discovered opportunities
  let generatedCount = 0;
  let generatedSlugs: string[] = [];
  try {
    const genResult = await runGeneration(10);
    generatedCount = genResult.generated;
    generatedSlugs = genResult.slugs;
    allErrors.push(...genResult.errors);
  } catch (err) {
    allErrors.push(`Generation failed: ${err instanceof Error ? err.message : "Unknown"}`);
  }

  const duration = Date.now() - startTime;

  // Step 3: Record the pipeline run
  await recordPipelineRun({
    id: runId,
    mode: "full",
    startedAt: new Date(startTime).toISOString(),
    completedAt: new Date().toISOString(),
    discovered: discoveredCount,
    generated: generatedCount,
    errors: allErrors,
  });

  // Step 4: Send email report
  const newPages = generatedSlugs.map(
    (slug) => `  - https://www.aversusb.net/compare/${slug}`
  );

  const report = `Auto-Generation Pipeline Report
========================================
Date: ${new Date().toISOString().split("T")[0]}
Time: ${new Date().toISOString().split("T")[1].split(".")[0]} UTC
Duration: ${(duration / 1000).toFixed(1)}s
Category focus: ${category}

Discovery:
  Keywords found: ${discoveredCount}

Generation:
  New pages created: ${generatedCount}
${newPages.length > 0 ? `\nNew Pages:\n${newPages.join("\n")}` : ""}
${allErrors.length > 0 ? `\nErrors (${allErrors.length}):\n${allErrors.map((e) => `  - ${e}`).join("\n")}` : "\nNo errors!"}

Total comparisons on site: growing daily
Next run: ${hourOfDay < 12 ? "6pm" : "6am"} UTC
`;

  try {
    await sendNotificationEmail({
      subject: `Auto-Gen: ${generatedCount} new pages created (${category})`,
      type: "cron-report",
      message: report,
      pageUrl: "https://www.aversusb.net/admin",
    });
  } catch {
    // Email is non-critical
  }

  return NextResponse.json({
    success: true,
    runId,
    category,
    duration: `${(duration / 1000).toFixed(1)}s`,
    discovered: discoveredCount,
    generated: generatedCount,
    newPages: generatedSlugs,
    errors: allErrors,
    timestamp: new Date().toISOString(),
  });
}
