import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { recordPipelineRun, mergeOpportunities } from "@/lib/services/pipeline-service";
import { sendNotificationEmail } from "@/lib/services/email";
import { discoverTopics } from "@/lib/services/content-discovery";
import { generateBlogArticle, saveBlogArticle } from "@/lib/services/blog-generator";
import { generateComparison } from "@/lib/services/ai-comparison-generator";
import { saveComparison, getComparisonBySlug } from "@/lib/services/comparison-service";
import { enqueueBatch, processQueue } from "@/lib/services/generation-queue";
import { scoreComparison } from "@/lib/services/content-quality";
import type { DiscoveredOpportunity } from "@/lib/dataforseo/keyword-discovery";

const QUALITY_THRESHOLD = 50; // Minimum quality score to save (grade C)

export const maxDuration = 300; // 5 minutes

/**
 * GET /api/cron/auto-generate
 *
 * Automated cron job that runs the full content velocity pipeline:
 * 1. Discovers new topics from Reddit, Quora, Tavily, and DataForSEO
 * 2. Generates comparisons directly from discovered topics via Claude AI
 * 3. Generates blog articles for blog-type topics
 * 4. Saves new pages to PostgreSQL database
 * 5. Sends an email report
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const checkInId = Sentry.captureCheckIn({
    monitorSlug: "auto-generate",
    status: "in_progress",
  }, {
    schedule: { type: "crontab", value: "0 6 * * *" },
    maxRuntime: 10,
    checkinMargin: 5,
  });

  const startTime = Date.now();
  const runId = `auto-${Date.now()}`;

  // Rotate through all categories each run for variety
  const categories = [
    "sports", "countries", "technology", "products",
    "companies", "history", "entertainment", "brands",
    "health", "automotive", "finance", "software",
    "education", "military", "economy", "celebrities", "travel",
    "food_and_drink", "gaming",
  ];
  const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const hourOfDay = new Date().getUTCHours();
  const categoryIndex = (dayOfYear * 2 + (hourOfDay >= 12 ? 1 : 0)) % categories.length;
  const category = categories[categoryIndex];

  let discoveredCount = 0;
  const allErrors: string[] = [];
  const sourceBreakdown: Record<string, number> = {};

  // Step 1: Discover topics from all sources — always include "products" alongside the rotated category
  let comparisonTopics: Awaited<ReturnType<typeof discoverTopics>> = [];
  let blogTopics: Awaited<ReturnType<typeof discoverTopics>> = [];

  try {
    // Always discover from the rotated category + products (for 20 daily product comparisons)
    const categoriesToDiscover = category === "products" ? [category] : [category, "products"];
    const topics = await discoverTopics({ categories: categoriesToDiscover, limit: 200 });
    discoveredCount = topics.length;

    // Track source breakdown
    for (const t of topics) {
      sourceBreakdown[t.source] = (sourceBreakdown[t.source] || 0) + 1;
    }

    // Separate into comparisons and blog topics
    comparisonTopics = topics.filter(t => t.type === "comparison" && t.entityA && t.entityB);
    blogTopics = topics.filter(t => t.type === "blog");
  } catch (err) {
    allErrors.push(`Discovery failed: ${err instanceof Error ? err.message : "Unknown"}`);
  }

  // Step 2: Also try to store in Redis if available (non-blocking)
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
  } catch {
    // Redis storage is optional — pipeline works without it
  }

  // Step 3: Enqueue comparisons into the generation queue, then process with parallel workers
  let generatedCount = 0;
  const generatedSlugs: string[] = [];
  const compLimit = 30;

  // Enqueue all discovered comparison topics
  const queueItems = comparisonTopics.slice(0, compLimit).map((topic) => ({
    entityA: topic.entityA!,
    entityB: topic.entityB!,
    category,
    source: `cron:${topic.source}`,
    priority: Math.round(topic.opportunityScore || 0),
  }));

  try {
    const { enqueued, skipped } = await enqueueBatch(queueItems);
    if (skipped > 0) {
      allErrors.push(`Queue: ${skipped} topics skipped (already exist or in queue)`);
    }

    // Process queue with 5 parallel workers
    if (enqueued > 0) {
      const queueResult = await processQueue(5, compLimit);
      generatedCount = queueResult.succeeded;
      generatedSlugs.push(...queueResult.slugs);
      allErrors.push(...queueResult.errors);
    }
  } catch (err) {
    // Fallback to sequential generation if queue fails
    allErrors.push(`Queue failed, falling back to sequential: ${err instanceof Error ? err.message : "Unknown"}`);
    for (const topic of comparisonTopics.slice(0, compLimit)) {
      try {
        const a = slugify(topic.entityA!);
        const b = slugify(topic.entityB!);
        const slug = a <= b ? `${a}-vs-${b}` : `${b}-vs-${a}`;
        const existing = await getComparisonBySlug(slug);
        if (existing) continue;
        const result = await generateComparison(topic.entityA!, topic.entityB!, slug);
        if (result.success && result.comparison) {
          // Quality gate: reject low-quality content
          const qualityResult = scoreComparison(result.comparison);
          if (qualityResult.totalScore < QUALITY_THRESHOLD) {
            allErrors.push(`Quality gate "${slug}": score ${qualityResult.totalScore}/100 (${qualityResult.grade})`);
            continue;
          }
          try {
            await saveComparison(result.comparison);
            generatedCount++;
            generatedSlugs.push(slug);
          } catch (dbErr) {
            allErrors.push(`DB save "${slug}": ${dbErr instanceof Error ? dbErr.message : "Unknown"}`);
          }
        } else {
          allErrors.push(`Generate "${slug}": ${result.error || "Failed"}`);
        }
      } catch (genErr) {
        allErrors.push(`"${topic.entityA} vs ${topic.entityB}": ${genErr instanceof Error ? genErr.message : "Unknown"}`);
      }
    }
  }

  // Step 4: Generate blog articles from blog topics (up to 10 per run)
  let blogArticlesCreated = 0;
  const blogSlugs: string[] = [];
  const blogLimit = 10;

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

  // Step 5: Record the pipeline run (if Redis is available)
  try {
    await recordPipelineRun({
      id: runId,
      mode: "full",
      startedAt: new Date(startTime).toISOString(),
      completedAt: new Date().toISOString(),
      discovered: discoveredCount,
      generated: generatedCount + blogArticlesCreated,
      errors: allErrors,
    });
  } catch {
    // Non-critical
  }

  // Step 6: Send email report
  const newCompPages = generatedSlugs.map(
    (slug) => `  - https://www.aversusb.net/compare/${slug}`
  );
  const newBlogPages = blogSlugs.map(
    (slug) => `  - https://www.aversusb.net/blog/${slug}`
  );

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

  Sentry.captureCheckIn({
    checkInId,
    monitorSlug: "auto-generate",
    status: allErrors.length > generatedCount ? "error" : "ok",
  });

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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}
