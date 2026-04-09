import { NextResponse } from "next/server";
import { getRedis } from "@/lib/services/redis";
import { getPrisma } from "@/lib/db/prisma";

/**
 * Weekly Metrics Report API for AversusB
 *
 * GET /api/analytics/weekly-report — generates a structured weekly report
 *
 * Returns JSON with markdown report + raw metrics for dashboard rendering.
 */

interface AdminEvent {
  id: string;
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
}

async function getRedisEvents(daysBack: number): Promise<AdminEvent[]> {
  const redis = getRedis();
  if (!redis) return [];
  try {
    const raw = await redis.lrange("admin:events", 0, 999);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysBack);
    return raw
      .map((item) => (typeof item === "string" ? JSON.parse(item) : item) as AdminEvent)
      .filter((e) => new Date(e.timestamp) >= cutoff);
  } catch {
    return [];
  }
}

function wowChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "+new" : "flat";
  const pct = Math.round(((current - previous) / previous) * 100);
  return pct >= 0 ? `+${pct}%` : `${pct}%`;
}

function trend(current: number, previous: number): "up" | "down" | "flat" {
  if (current > previous) return "up";
  if (current < previous) return "down";
  return "flat";
}

export async function GET() {
  const prisma = getPrisma();
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const weekNum = Math.ceil(((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7);
  const periodStart = weekAgo.toISOString().split("T")[0];
  const periodEnd = now.toISOString().split("T")[0];

  // Redis events
  const [events7d, events14d] = await Promise.all([
    getRedisEvents(7),
    getRedisEvents(14),
  ]);

  const countEvents = (events: AdminEvent[], type: string) => events.filter((e) => e.type === type).length;
  const eventsPrevWeek = events14d.filter((e) => {
    const t = new Date(e.timestamp);
    return t >= twoWeeksAgo && t < weekAgo;
  });

  const searches7d = countEvents(events7d, "search");
  const searchesPrev = countEvents(eventsPrevWeek, "search");
  const views7d = countEvents(events7d, "generation") + countEvents(events7d, "comparison_view");
  const viewsPrev = countEvents(eventsPrevWeek, "generation") + countEvents(eventsPrevWeek, "comparison_view");
  const engagements7d = countEvents(events7d, "vote") + countEvents(events7d, "feedback");
  const engagementsPrev = countEvents(eventsPrevWeek, "vote") + countEvents(eventsPrevWeek, "feedback");
  const affiliateClicks7d = countEvents(events7d, "affiliate_click");
  const affiliateClicksPrev = countEvents(eventsPrevWeek, "affiliate_click");
  const shares7d = countEvents(events7d, "share");
  const signups7d = countEvents(events7d, "newsletter_signup");

  // Daily breakdown for sparkline
  const dailyData: Record<string, { searches: number; views: number; engagements: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dailyData[d.toISOString().split("T")[0]] = { searches: 0, views: 0, engagements: 0 };
  }
  for (const e of events7d) {
    const day = e.timestamp.split("T")[0];
    if (!dailyData[day]) continue;
    if (e.type === "search") dailyData[day].searches++;
    if (e.type === "generation" || e.type === "comparison_view") dailyData[day].views++;
    if (["feedback", "vote", "comment"].includes(e.type)) dailyData[day].engagements++;
  }
  const dailyBreakdown = Object.entries(dailyData).map(([date, counts]) => ({
    date,
    day: new Date(date + "T00:00:00Z").toLocaleDateString("en-US", { weekday: "short" }),
    ...counts,
  }));

  // DB metrics
  let db = {
    totalComparisons: 0, publishedComparisons: 0, totalEntities: 0, totalBlogArticles: 0,
    totalVotes: 0, votesThisWeek: 0, votesPrevWeek: 0,
    totalSubscribers: 0, subscribersThisWeek: 0, subscribersPrevWeek: 0,
    totalAffiliateClicks: 0, affiliateClicksThisWeek: 0, affiliateClicksPrevWeek: 0,
    totalApiKeys: 0, activeApiKeys: 0, totalEmbedPartners: 0, activeEmbedPartners: 0,
    totalApiRequests: 0, apiRequestsThisWeek: 0,
    totalSurveys: 0, surveysThisWeek: 0, avgSurveyRating: 0,
    npsScore: 0, comparisonRequests: 0, comparisonRequestsThisWeek: 0,
    comparisonsThisWeek: 0, comparisonsPrevWeek: 0, totalViewCount: 0,
    topComparisons: [] as Array<{ slug: string; title: string; viewCount: number }>,
    topCategories: [] as Array<{ category: string; count: number }>,
  };

  if (prisma) {
    try {
      const [
        totalComparisons, publishedComparisons, totalEntities, totalBlogArticles,
        totalVotes, votesThisWeek, votesPrevWeek,
        totalSubscribers, subscribersThisWeek, subscribersPrevWeek,
        totalAffiliateClicks, affiliateClicksThisWeek, affiliateClicksPrevWeek,
        totalApiKeys, activeApiKeys, totalEmbedPartners, activeEmbedPartners,
        totalApiRequests, apiRequestsThisWeek,
        totalSurveys, surveysThisWeek,
        comparisonRequests, comparisonRequestsThisWeek,
        comparisonsThisWeek, comparisonsPrevWeek,
        topComparisons, topCategories,
        viewCountAgg, surveyRatings,
      ] = await Promise.all([
        prisma.comparison.count(),
        prisma.comparison.count({ where: { status: "published" } }),
        prisma.entity.count(),
        prisma.blogArticle.count(),
        prisma.comparisonVote.count(),
        prisma.comparisonVote.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.comparisonVote.count({ where: { createdAt: { gte: twoWeeksAgo, lt: weekAgo } } }),
        prisma.newsletterSubscriber.count(),
        prisma.newsletterSubscriber.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.newsletterSubscriber.count({ where: { createdAt: { gte: twoWeeksAgo, lt: weekAgo } } }),
        prisma.affiliateClick.count(),
        prisma.affiliateClick.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.affiliateClick.count({ where: { createdAt: { gte: twoWeeksAgo, lt: weekAgo } } }),
        prisma.apiKey.count(),
        prisma.apiKey.count({ where: { status: "active" } }),
        prisma.embedPartner.count(),
        prisma.embedPartner.count({ where: { status: "active" } }),
        prisma.apiUsageLog.count(),
        prisma.apiUsageLog.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.interceptSurvey.count(),
        prisma.interceptSurvey.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.comparisonRequest.count(),
        prisma.comparisonRequest.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.comparison.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.comparison.count({ where: { createdAt: { gte: twoWeeksAgo, lt: weekAgo } } }),
        prisma.comparison.findMany({
          where: { status: "published" },
          orderBy: { viewCount: "desc" },
          take: 10,
          select: { slug: true, title: true, viewCount: true },
        }),
        prisma.comparison.groupBy({
          by: ["category"],
          _count: true,
          where: { status: "published" },
          orderBy: { _count: { category: "desc" } },
          take: 10,
        }),
        prisma.comparison.aggregate({ _sum: { viewCount: true } }),
        prisma.interceptSurvey.aggregate({ _avg: { q3Rating: true }, where: { q3Rating: { not: null } } }),
      ]);

      let npsScore = 0;
      if (totalSurveys > 0) {
        const [promoters, detractors] = await Promise.all([
          prisma.interceptSurvey.count({ where: { q3Rating: { gte: 4 } } }),
          prisma.interceptSurvey.count({ where: { q3Rating: { lte: 2 }, NOT: { q3Rating: null } } }),
        ]);
        const npsTotal = totalSurveys;
        npsScore = npsTotal > 0 ? Math.round(((promoters - detractors) / npsTotal) * 100) : 0;
      }

      db = {
        totalComparisons, publishedComparisons, totalEntities, totalBlogArticles,
        totalVotes, votesThisWeek, votesPrevWeek,
        totalSubscribers, subscribersThisWeek, subscribersPrevWeek,
        totalAffiliateClicks, affiliateClicksThisWeek, affiliateClicksPrevWeek,
        totalApiKeys, activeApiKeys, totalEmbedPartners, activeEmbedPartners,
        totalApiRequests, apiRequestsThisWeek,
        totalSurveys, surveysThisWeek,
        avgSurveyRating: Math.round((surveyRatings._avg.q3Rating || 0) * 10) / 10,
        npsScore, comparisonRequests, comparisonRequestsThisWeek,
        comparisonsThisWeek, comparisonsPrevWeek,
        totalViewCount: viewCountAgg._sum.viewCount || 0,
        topComparisons,
        topCategories: topCategories.map((c) => ({ category: c.category || "uncategorized", count: c._count })),
      };
    } catch (err) {
      console.error("Weekly report DB error:", err);
    }
  }

  // Conversion funnel
  const searchToViewRate = searches7d > 0 ? Math.round((views7d / searches7d) * 100) : 0;
  const viewToEngageRate = views7d > 0 ? Math.round((engagements7d / views7d) * 100) : 0;
  const engageToConvertRate = engagements7d > 0 ? Math.round((affiliateClicks7d / engagements7d) * 100) : 0;

  const funnel = [
    { stage: "Searches", value: searches7d, rate: 100 },
    { stage: "Views", value: views7d, rate: searchToViewRate },
    { stage: "Engagements", value: engagements7d, rate: viewToEngageRate },
    { stage: "Affiliate Clicks", value: affiliateClicks7d, rate: engageToConvertRate },
    { stage: "Signups", value: signups7d, rate: searches7d > 0 ? Math.round((signups7d / searches7d) * 100) : 0 },
  ];

  // Generate markdown report
  const markdown = `# AversusB Weekly Metrics Report — W${weekNum} 2026
**Period:** ${periodStart} to ${periodEnd}
**Generated:** ${now.toISOString().split("T")[0]}

---

## Executive Summary

| Metric | This Week | Prev Week | WoW Change |
|--------|-----------|-----------|------------|
| Searches | ${searches7d} | ${searchesPrev} | ${wowChange(searches7d, searchesPrev)} |
| Page Views | ${views7d} | ${viewsPrev} | ${wowChange(views7d, viewsPrev)} |
| Engagements (votes/feedback) | ${engagements7d} | ${engagementsPrev} | ${wowChange(engagements7d, engagementsPrev)} |
| Affiliate Clicks | ${affiliateClicks7d} | ${affiliateClicksPrev} | ${wowChange(affiliateClicks7d, affiliateClicksPrev)} |
| New Subscribers | ${db.subscribersThisWeek} | ${db.subscribersPrevWeek} | ${wowChange(db.subscribersThisWeek, db.subscribersPrevWeek)} |
| New Comparisons | ${db.comparisonsThisWeek} | ${db.comparisonsPrevWeek} | ${wowChange(db.comparisonsThisWeek, db.comparisonsPrevWeek)} |

---

## Content Inventory

| Asset | Count |
|-------|-------|
| Published Comparisons | ${db.publishedComparisons} |
| Total Comparisons | ${db.totalComparisons} |
| Entities | ${db.totalEntities} |
| Blog Articles | ${db.totalBlogArticles} |
| Total Page Views (all-time) | ${db.totalViewCount.toLocaleString()} |

---

## Conversion Funnel

| Stage | Volume | Drop-off Rate |
|-------|--------|---------------|
| Searches | ${searches7d} | — |
| Views | ${views7d} | ${searchToViewRate}% of searches |
| Engagements | ${engagements7d} | ${viewToEngageRate}% of views |
| Affiliate Clicks | ${affiliateClicks7d} | ${engageToConvertRate}% of engagements |
| Signups | ${signups7d} | — |

---

## Top 10 Pages by Views

| # | Comparison | Views |
|---|-----------|-------|
${db.topComparisons.map((c, i) => `| ${i + 1} | ${c.title || c.slug} | ${c.viewCount} |`).join("\n")}

---

## Top Categories

| Category | Comparisons |
|----------|-------------|
${db.topCategories.map((c) => `| ${c.category} | ${c.count} |`).join("\n")}

---

## Revenue & Monetization

| Metric | Value |
|--------|-------|
| Total Affiliate Clicks (all-time) | ${db.totalAffiliateClicks} |
| Affiliate Clicks (this week) | ${db.affiliateClicksThisWeek} |
| API Keys (active/total) | ${db.activeApiKeys}/${db.totalApiKeys} |
| API Requests (this week) | ${db.apiRequestsThisWeek} |
| Embed Partners (active/total) | ${db.activeEmbedPartners}/${db.totalEmbedPartners} |

---

## Engagement & Satisfaction

| Metric | Value |
|--------|-------|
| Total Votes | ${db.totalVotes} |
| Votes This Week | ${db.votesThisWeek} (${wowChange(db.votesThisWeek, db.votesPrevWeek)} WoW) |
| Total Subscribers | ${db.totalSubscribers} |
| Surveys Completed | ${db.totalSurveys} (${db.surveysThisWeek} this week) |
| Avg Survey Rating | ${db.avgSurveyRating}/5 |
| NPS Score | ${db.npsScore} |
| Comparison Requests | ${db.comparisonRequestsThisWeek} this week |

---

## Key Callouts

${searches7d === 0 && views7d === 0 ? "- **Low traffic alert:** No searches or views recorded this week in Redis events. GA4 data may show different numbers — check GA4 directly.\n" : ""}${db.comparisonsThisWeek > db.comparisonsPrevWeek ? `- **Content growth:** ${db.comparisonsThisWeek} new comparisons this week (${wowChange(db.comparisonsThisWeek, db.comparisonsPrevWeek)} WoW)\n` : ""}${db.votesThisWeek > db.votesPrevWeek ? `- **Engagement up:** Votes increased ${wowChange(db.votesThisWeek, db.votesPrevWeek)} WoW\n` : ""}${db.npsScore < 30 ? `- **NPS needs attention:** Score is ${db.npsScore}. Target: 50+\n` : ""}${db.subscribersThisWeek > 0 ? `- **Subscriber growth:** ${db.subscribersThisWeek} new subscribers\n` : ""}
---

## Next Actions

1. Continue GA4 data accumulation — cross-reference with these DB metrics once 14+ days available
2. Identify high-bounce pages via GA4 for optimization
3. Run first A/B test on highest-traffic comparison page
4. Expand content in top-performing categories

---

*Report generated automatically from AversusB database and event stream.*
`;

  return NextResponse.json({
    weekNumber: weekNum,
    year: 2026,
    period: { start: periodStart, end: periodEnd },
    generatedAt: now.toISOString(),
    summary: {
      searches: { current: searches7d, previous: searchesPrev, change: wowChange(searches7d, searchesPrev), trend: trend(searches7d, searchesPrev) },
      views: { current: views7d, previous: viewsPrev, change: wowChange(views7d, viewsPrev), trend: trend(views7d, viewsPrev) },
      engagements: { current: engagements7d, previous: engagementsPrev, change: wowChange(engagements7d, engagementsPrev), trend: trend(engagements7d, engagementsPrev) },
      affiliateClicks: { current: affiliateClicks7d, previous: affiliateClicksPrev, change: wowChange(affiliateClicks7d, affiliateClicksPrev), trend: trend(affiliateClicks7d, affiliateClicksPrev) },
      subscribers: { current: db.subscribersThisWeek, previous: db.subscribersPrevWeek, change: wowChange(db.subscribersThisWeek, db.subscribersPrevWeek), trend: trend(db.subscribersThisWeek, db.subscribersPrevWeek) },
      newComparisons: { current: db.comparisonsThisWeek, previous: db.comparisonsPrevWeek, change: wowChange(db.comparisonsThisWeek, db.comparisonsPrevWeek), trend: trend(db.comparisonsThisWeek, db.comparisonsPrevWeek) },
    },
    content: {
      publishedComparisons: db.publishedComparisons,
      totalComparisons: db.totalComparisons,
      entities: db.totalEntities,
      blogArticles: db.totalBlogArticles,
      totalViewCount: db.totalViewCount,
    },
    funnel,
    dailyBreakdown,
    topComparisons: db.topComparisons,
    topCategories: db.topCategories,
    revenue: {
      totalAffiliateClicks: db.totalAffiliateClicks,
      affiliateClicksThisWeek: db.affiliateClicksThisWeek,
      apiKeys: { active: db.activeApiKeys, total: db.totalApiKeys },
      apiRequestsThisWeek: db.apiRequestsThisWeek,
      embedPartners: { active: db.activeEmbedPartners, total: db.totalEmbedPartners },
    },
    engagement: {
      totalVotes: db.totalVotes,
      votesThisWeek: db.votesThisWeek,
      totalSubscribers: db.totalSubscribers,
      surveys: { total: db.totalSurveys, thisWeek: db.surveysThisWeek, avgRating: db.avgSurveyRating },
      npsScore: db.npsScore,
      comparisonRequestsThisWeek: db.comparisonRequestsThisWeek,
    },
    markdown,
  });
}
