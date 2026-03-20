import { NextRequest, NextResponse } from "next/server";
import { runGeneration, recordPipelineRun, mergeOpportunities } from "@/lib/services/pipeline-service";
import { sendNotificationEmail } from "@/lib/services/email";
import { discoverTopics } from "@/lib/services/content-discovery";
import { generateBlogArticle, saveBlogArticle } from "@/lib/services/blog-generator";
import type { DiscoveredOpportunity } from "@/lib/dataforseo/keyword-discovery";

export const maxDuration = 300; // 5 minutes — enough for discovery + generation

/**
 * GET /api/cron/auto-generate
 *
 * Automated cron job that runs the full content velocity pipeline:
 * 1. Discovers new topics from Reddit, Quora, Tavily, and DataForSEO
 * 2. Separates into comparisons and blog topics
 * 3. Generates comparisons via Claude AI (with Tavily real-time data enrichment)
 * 4. Generates blog articles for blog-type topics
 * 5. Saves new pages to PostgreSQL database
 * 6. Sends an email report
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

  // Step 1: Discover topics from all sources (Reddit, Quora, Tavily, DataForSEO)
  let comparisonTopics: typeof topics = [];
  let blogTopics: typeof topics = [];
  let topics: Awaited<ReturnType<typeof discoverTopics>> = [];

  try {
    topics = await discoverTopics({ categories: [category], limit: 50 });
    discoveredCount = topics.length;

    // Separate into comparisons and blog topics
    comparisonTopics = topics.filter(t => t.type === "comparison" && t.entityA && t.entityB);
    blogTopics = topics.filter(t => t.type === "blog");
  } catch (err) {
    allErrors.push(`Discovery failed: ${err instanceof Error ? err.message : "Unknown"}`);
  }

  // Step 2: Feed comparison topics into the pipeline (merge with existing opportunities)
  try {
    if (comparisonTopics.length > 0) {
      const asOpportunities: DiscoveredOpportunity[] = comparisonTopics.map(t => ({
        keyword: t.topic,
        searchVolume: t.searchVolume || 0,
        cpc: 0,
        competition: 0,
        difficulty: 0,
        intent: "informational",
        entityA: t.entityA,
        entityB: t.entityB,
        queryPattern: "vs",
        category,
        opportunityScore: t.opportunityScore,
        source: `content-discovery:${t.source}`,
      }));
      await mergeOpportunities(asOpportunities);
    }
  } catch (err) {
    allErrors.push(`Merge opportunities failed: ${err instanceof Error ? err.message : "Unknown"}`);
  }

  // Step 3: Generate top 10 comparisons from discovered opportunities
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

  // Step 4: Generate blog articles from blog topics (up to 3 per run)
  let blogArticlesCreated = 0;
  const blogSlugs: string[] = [];
  const blogLimit = 3;

  for (const blogTopic of blogTopics.slice(0, blogLimit)) {
    try {
      const article = await generateBlogArticle(blogTopic.topic);
      const saved = await saveBlogArticle(article);
      if (saved) {
        blogArticlesCreated++;
        blogSlugs.push(article.slug);
      }
    } catch (err) {
      allErrors.push(`Blog "${blogTopic.topic}": ${err instanceof Error ? err.message : "Unknown"}`);
    }
  }

  const duration = Date.now() - startTime;

  // Step 5: Record the pipeline run
  await recordPipelineRun({
    id: runId,
    mode: "full",
    startedAt: new Date(startTime).toISOString(),
    completedAt: new Date().toISOString(),
    discovered: discoveredCount,
    generated: generatedCount + blogArticlesCreated,
    errors: allErrors,
  });

  // Step 6: Send email report
  const newCompPages = generatedSlugs.map(
    (slug) => `  - https://www.aversusb.net/compare/${slug}`
  );
  const newBlogPages = blogSlugs.map(
    (slug) => `  - https://www.aversusb.net/blog/${slug}`
  );

  const sourceBreakdown = topics.reduce((acc, t) => {
    acc[t.source] = (acc[t.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const report = `Auto-Generation Pipeline Report
========================================
Date: ${new Date().toISOString().split("T")[0]}
Time: ${new Date().toISOString().split("T")[1].split(".")[0]} UTC
Duration: ${(duration / 1000).toFixed(1)}s
Category focus: ${category}

Discovery (multi-source):
  Total topics found: ${discoveredCount}
  Sources: ${Object.entries(sourceBreakdown).map(([k, v]) => `${k}=${v}`).join(", ") || "none"}
  Comparison topics: ${comparisonTopics.length}
  Blog topics: ${blogTopics.length}

Generation:
  New comparison pages: ${generatedCount}
  New blog articles: ${blogArticlesCreated}
${newCompPages.length > 0 ? `\nNew Comparison Pages:\n${newCompPages.join("\n")}` : ""}
${newBlogPages.length > 0 ? `\nNew Blog Articles:\n${newBlogPages.join("\n")}` : ""}
${allErrors.length > 0 ? `\nErrors (${allErrors.length}):\n${allErrors.map((e) => `  - ${e}`).join("\n")}` : "\nNo errors!"}

Total comparisons on site: growing daily
Next run: ${hourOfDay < 12 ? "6pm" : "6am"} UTC
`;

  try {
    await sendNotificationEmail({
      subject: `Auto-Gen: ${generatedCount} comparisons + ${blogArticlesCreated} blogs (${category})`,
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
    discoveryBySource: sourceBreakdown,
    generated: generatedCount,
    blogArticlesCreated,
    newPages: generatedSlugs,
    newBlogArticles: blogSlugs,
    errors: allErrors,
    timestamp: new Date().toISOString(),
  });
}
