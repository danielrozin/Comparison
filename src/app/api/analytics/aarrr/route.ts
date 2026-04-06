import { NextResponse } from "next/server";
import { getRedis } from "@/lib/services/redis";
import { getPrisma } from "@/lib/db/prisma";

/**
 * AARRR Pirate Metrics API for AversusB
 *
 * GET /api/analytics/aarrr — full AARRR dashboard data
 *
 * Metrics sourced from:
 * - PostgreSQL (Prisma): affiliate clicks, votes, subscribers, surveys, API keys, embed partners
 * - Redis: real-time events (searches, views, engagements)
 */

interface AdminEvent {
  id: string;
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
}

interface RecentSearch {
  slug: string;
  title: string;
  category: string;
  searchedAt: string;
  generated: boolean;
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

async function getRecentSearches(): Promise<RecentSearch[]> {
  const redis = getRedis();
  if (!redis) return [];
  try {
    const raw = await redis.lrange("recent:searches", 0, 499);
    return raw.map((item) => (typeof item === "string" ? JSON.parse(item) : item) as RecentSearch);
  } catch {
    return [];
  }
}

export async function GET() {
  const prisma = getPrisma();
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date(now);
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  // Fetch Redis data
  const [events7d, events30d, recentSearches] = await Promise.all([
    getRedisEvents(7),
    getRedisEvents(30),
    getRecentSearches(),
  ]);

  // Daily breakdown for charts (last 30 days)
  const dailyData: Record<string, { searches: number; views: number; engagements: number; affiliateClicks: number; shares: number; signups: number }> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dailyData[d.toISOString().split("T")[0]] = { searches: 0, views: 0, engagements: 0, affiliateClicks: 0, shares: 0, signups: 0 };
  }
  for (const e of events30d) {
    const day = e.timestamp.split("T")[0];
    if (!dailyData[day]) continue;
    if (e.type === "search") dailyData[day].searches++;
    if (e.type === "generation" || e.type === "comparison_view") dailyData[day].views++;
    if (["feedback", "vote", "comment"].includes(e.type)) dailyData[day].engagements++;
    if (e.type === "affiliate_click") dailyData[day].affiliateClicks++;
    if (e.type === "share") dailyData[day].shares++;
    if (e.type === "newsletter_signup") dailyData[day].signups++;
  }

  const dailyBreakdown = Object.entries(dailyData).map(([date, counts]) => ({
    date,
    label: new Date(date + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    ...counts,
  }));

  // Event counts
  const countEvents = (events: AdminEvent[], type: string) => events.filter((e) => e.type === type).length;
  const searches7d = countEvents(events7d, "search");
  const views7d = countEvents(events7d, "generation") + countEvents(events7d, "comparison_view");
  const votes7d = countEvents(events7d, "vote") + countEvents(events7d, "feedback");
  const shares7d = countEvents(events7d, "share");
  const affiliateClicks7d = countEvents(events7d, "affiliate_click");
  const signups7d = countEvents(events7d, "newsletter_signup");

  const searches30d = countEvents(events30d, "search");
  const views30d = countEvents(events30d, "generation") + countEvents(events30d, "comparison_view");

  // Unique sessions from events (approximate DAU/MAU)
  const getUniqueSessions = (events: AdminEvent[]) => {
    const sessions = new Set<string>();
    for (const e of events) {
      const sid = (e.data?.sessionId || e.data?.session_id || e.id) as string;
      sessions.add(sid);
    }
    return sessions.size;
  };

  // DB metrics (guard against missing DB)
  let dbMetrics = {
    totalComparisons: 0,
    publishedComparisons: 0,
    totalEntities: 0,
    totalBlogArticles: 0,
    totalVotes: 0,
    votesThisWeek: 0,
    votesPrevWeek: 0,
    totalSubscribers: 0,
    subscribersThisWeek: 0,
    subscribersPrevWeek: 0,
    subscribersBySource: [] as Array<{ source: string; count: number }>,
    totalAffiliateClicks: 0,
    affiliateClicksThisWeek: 0,
    affiliateClicksPrevWeek: 0,
    affiliateClicksByNetwork: [] as Array<{ network: string; count: number }>,
    totalApiKeys: 0,
    activeApiKeys: 0,
    apiKeysByTier: [] as Array<{ tier: string; count: number }>,
    totalEmbedPartners: 0,
    activeEmbedPartners: 0,
    embedPartnersByTier: [] as Array<{ tier: string; count: number }>,
    totalApiRequests: 0,
    apiRequestsThisWeek: 0,
    totalSurveys: 0,
    surveysThisWeek: 0,
    avgSurveyRating: 0,
    npsScore: 0,
    npsPromoters: 0,
    npsPassives: 0,
    npsDetractors: 0,
    syndicatedContent: 0,
    syndicatedReferralClicks: 0,
    comparisonRequests: 0,
    comparisonRequestsThisWeek: 0,
    comparisonsThisWeek: 0,
    comparisonsPrevWeek: 0,
    totalViewCount: 0,
    uniqueVoteSessions: 0,
    uniqueVoteSessionsThisWeek: 0,
  };

  if (prisma) {
    try {
      const [
        totalComparisons,
        publishedComparisons,
        totalEntities,
        totalBlogArticles,
        totalVotes,
        votesThisWeek,
        votesPrevWeek,
        totalSubscribers,
        subscribersThisWeek,
        subscribersPrevWeek,
        totalAffiliateClicks,
        affiliateClicksThisWeek,
        affiliateClicksPrevWeek,
        totalApiKeys,
        activeApiKeys,
        totalEmbedPartners,
        activeEmbedPartners,
        totalApiRequests,
        apiRequestsThisWeek,
        totalSurveys,
        surveysThisWeek,
        syndicatedContent,
        comparisonRequests,
        comparisonRequestsThisWeek,
        comparisonsThisWeek,
        comparisonsPrevWeek,
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
        prisma.syndicatedContent.count({ where: { status: "published" } }),
        prisma.comparisonRequest.count(),
        prisma.comparisonRequest.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.comparison.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.comparison.count({ where: { createdAt: { gte: twoWeeksAgo, lt: weekAgo } } }),
      ]);

      // Grouped queries
      const [
        subscribersBySource,
        affiliateClicksByNetwork,
        apiKeysByTier,
        embedPartnersByTier,
        surveyRatings,
        viewCountAgg,
        syndicatedReferralAgg,
        uniqueVoteSessions,
        uniqueVoteSessionsThisWeek,
      ] = await Promise.all([
        prisma.newsletterSubscriber.groupBy({ by: ["source"], _count: true, orderBy: { _count: { source: "desc" } } }),
        prisma.affiliateClick.groupBy({ by: ["affiliateNetwork"], _count: true, orderBy: { _count: { affiliateNetwork: "desc" } } }),
        prisma.apiKey.groupBy({ by: ["tier"], _count: true }),
        prisma.embedPartner.groupBy({ by: ["tier"], _count: true }),
        prisma.interceptSurvey.aggregate({ _avg: { q3Rating: true }, where: { q3Rating: { not: null } } }),
        prisma.comparison.aggregate({ _sum: { viewCount: true } }),
        prisma.syndicatedContent.aggregate({ _sum: { referralClicks: true }, where: { status: "published" } }),
        prisma.comparisonVote.findMany({ select: { sessionId: true }, distinct: ["sessionId"] }).then((r) => r.length),
        prisma.comparisonVote.findMany({ select: { sessionId: true }, distinct: ["sessionId"], where: { createdAt: { gte: weekAgo } } }).then((r) => r.length),
      ]);

      // NPS calculation from survey ratings (1-5 scale: 4-5 = promoter, 3 = passive, 1-2 = detractor)
      let npsPromoters = 0, npsPassives = 0, npsDetractors = 0;
      if (totalSurveys > 0) {
        const [promoters, passives, detractors] = await Promise.all([
          prisma.interceptSurvey.count({ where: { q3Rating: { gte: 4 } } }),
          prisma.interceptSurvey.count({ where: { q3Rating: 3 } }),
          prisma.interceptSurvey.count({ where: { q3Rating: { lte: 2 }, NOT: { q3Rating: null } } }),
        ]);
        npsPromoters = promoters;
        npsPassives = passives;
        npsDetractors = detractors;
      }
      const npsTotal = npsPromoters + npsPassives + npsDetractors;
      const npsScore = npsTotal > 0 ? Math.round(((npsPromoters - npsDetractors) / npsTotal) * 100) : 0;

      dbMetrics = {
        totalComparisons,
        publishedComparisons,
        totalEntities,
        totalBlogArticles,
        totalVotes,
        votesThisWeek,
        votesPrevWeek,
        totalSubscribers,
        subscribersThisWeek,
        subscribersPrevWeek,
        subscribersBySource: subscribersBySource.map((s) => ({ source: s.source || "unknown", count: s._count })),
        totalAffiliateClicks,
        affiliateClicksThisWeek,
        affiliateClicksPrevWeek,
        affiliateClicksByNetwork: affiliateClicksByNetwork.map((a) => ({ network: a.affiliateNetwork, count: a._count })),
        totalApiKeys,
        activeApiKeys,
        apiKeysByTier: apiKeysByTier.map((k) => ({ tier: k.tier, count: k._count })),
        totalEmbedPartners,
        activeEmbedPartners,
        embedPartnersByTier: embedPartnersByTier.map((e) => ({ tier: e.tier, count: e._count })),
        totalApiRequests,
        apiRequestsThisWeek,
        totalSurveys,
        surveysThisWeek,
        avgSurveyRating: surveyRatings._avg.q3Rating || 0,
        npsScore,
        npsPromoters,
        npsPassives,
        npsDetractors,
        syndicatedContent,
        syndicatedReferralClicks: syndicatedReferralAgg._sum.referralClicks || 0,
        comparisonRequests,
        comparisonRequestsThisWeek,
        comparisonsThisWeek,
        comparisonsPrevWeek,
        totalViewCount: viewCountAgg._sum.viewCount || 0,
        uniqueVoteSessions,
        uniqueVoteSessionsThisWeek,
      };
    } catch (err) {
      console.error("AARRR DB metrics error:", err);
    }
  }

  // Calculate AARRR metrics
  const wowChange = (current: number, previous: number): string => {
    if (previous === 0) return current > 0 ? "+inf" : "0%";
    const pct = Math.round(((current - previous) / previous) * 100);
    return pct >= 0 ? `+${pct}%` : `${pct}%`;
  };

  // Search-to-view conversion rate
  const searchToViewRate = searches7d > 0 ? Math.round((views7d / searches7d) * 100) : 0;
  // View-to-engagement rate
  const viewToEngageRate = views7d > 0 ? Math.round((votes7d / views7d) * 100) : 0;
  // Engagement-to-conversion rate
  const engageToConvertRate = votes7d > 0 ? Math.round((affiliateClicks7d / votes7d) * 100) : 0;

  // Traffic source distribution from recent searches
  const sourceDistribution: Record<string, number> = {};
  for (const s of recentSearches) {
    const src = s.generated ? "Auto-generated" : "Organic search";
    sourceDistribution[src] = (sourceDistribution[src] || 0) + 1;
  }

  // Category distribution from searches
  const categoryDistribution: Record<string, number> = {};
  for (const s of recentSearches) {
    categoryDistribution[s.category || "uncategorized"] = (categoryDistribution[s.category || "uncategorized"] || 0) + 1;
  }

  const response = {
    generatedAt: now.toISOString(),
    period: { start: thirtyDaysAgo.toISOString().split("T")[0], end: now.toISOString().split("T")[0] },

    // North Star Metric
    northStar: {
      metric: "Weekly comparison views by returning users",
      value: dbMetrics.uniqueVoteSessionsThisWeek,
      totalWeeklyViews: views7d,
      returningUserProxy: dbMetrics.uniqueVoteSessionsThisWeek,
      trend: wowChange(views7d, views30d > 0 ? Math.round((views30d / 30) * 7) : 0),
    },

    // ACQUISITION
    acquisition: {
      totalSearches7d: searches7d,
      totalViews7d: views7d,
      searchToViewRate,
      totalComparisons: dbMetrics.totalComparisons,
      publishedComparisons: dbMetrics.publishedComparisons,
      totalViewCount: dbMetrics.totalViewCount,
      comparisonsThisWeek: dbMetrics.comparisonsThisWeek,
      comparisonsPrevWeek: dbMetrics.comparisonsPrevWeek,
      contentGrowth: wowChange(dbMetrics.comparisonsThisWeek, dbMetrics.comparisonsPrevWeek),
      sourceDistribution: Object.entries(sourceDistribution).map(([source, count]) => ({ source, count })),
      categoryDistribution: Object.entries(categoryDistribution)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([category, count]) => ({ category, count })),
    },

    // ACTIVATION
    activation: {
      searchToViewRate,
      comparisonRequests: dbMetrics.comparisonRequests,
      comparisonRequestsThisWeek: dbMetrics.comparisonRequestsThisWeek,
      surveysCompleted: dbMetrics.totalSurveys,
      surveysThisWeek: dbMetrics.surveysThisWeek,
      avgSurveyRating: Math.round(dbMetrics.avgSurveyRating * 10) / 10,
    },

    // RETENTION
    retention: {
      uniqueVoteSessions: dbMetrics.uniqueVoteSessions,
      uniqueVoteSessionsThisWeek: dbMetrics.uniqueVoteSessionsThisWeek,
      totalVotes: dbMetrics.totalVotes,
      votesThisWeek: dbMetrics.votesThisWeek,
      votesPrevWeek: dbMetrics.votesPrevWeek,
      votesTrend: wowChange(dbMetrics.votesThisWeek, dbMetrics.votesPrevWeek),
      subscribersThisWeek: dbMetrics.subscribersThisWeek,
      subscribersPrevWeek: dbMetrics.subscribersPrevWeek,
      subscribersTrend: wowChange(dbMetrics.subscribersThisWeek, dbMetrics.subscribersPrevWeek),
      viewToEngageRate,
    },

    // REVENUE
    revenue: {
      totalAffiliateClicks: dbMetrics.totalAffiliateClicks,
      affiliateClicksThisWeek: dbMetrics.affiliateClicksThisWeek,
      affiliateClicksPrevWeek: dbMetrics.affiliateClicksPrevWeek,
      affiliateTrend: wowChange(dbMetrics.affiliateClicksThisWeek, dbMetrics.affiliateClicksPrevWeek),
      affiliateClicksByNetwork: dbMetrics.affiliateClicksByNetwork,
      totalApiKeys: dbMetrics.totalApiKeys,
      activeApiKeys: dbMetrics.activeApiKeys,
      apiKeysByTier: dbMetrics.apiKeysByTier,
      totalEmbedPartners: dbMetrics.totalEmbedPartners,
      activeEmbedPartners: dbMetrics.activeEmbedPartners,
      embedPartnersByTier: dbMetrics.embedPartnersByTier,
      totalApiRequests: dbMetrics.totalApiRequests,
      apiRequestsThisWeek: dbMetrics.apiRequestsThisWeek,
      engageToConvertRate,
    },

    // REFERRAL
    referral: {
      npsScore: dbMetrics.npsScore,
      npsPromoters: dbMetrics.npsPromoters,
      npsPassives: dbMetrics.npsPassives,
      npsDetractors: dbMetrics.npsDetractors,
      syndicatedContent: dbMetrics.syndicatedContent,
      syndicatedReferralClicks: dbMetrics.syndicatedReferralClicks,
      shares7d,
      totalSubscribers: dbMetrics.totalSubscribers,
      subscribersBySource: dbMetrics.subscribersBySource,
    },

    // ENGAGEMENT
    engagement: {
      totalVotes: dbMetrics.totalVotes,
      votesThisWeek: dbMetrics.votesThisWeek,
      totalSubscribers: dbMetrics.totalSubscribers,
      subscribersThisWeek: dbMetrics.subscribersThisWeek,
      totalBlogArticles: dbMetrics.totalBlogArticles,
      totalEntities: dbMetrics.totalEntities,
      viewToEngageRate,
      engageToConvertRate,
      searches7d,
      signups7d,
    },

    // Funnel visualization data
    funnel: [
      { stage: "Acquisition", label: "Searches", value: searches7d, color: "#6366f1" },
      { stage: "Activation", label: "Comparison Views", value: views7d, color: "#8b5cf6" },
      { stage: "Retention", label: "Engagements", value: votes7d, color: "#a78bfa" },
      { stage: "Revenue", label: "Affiliate Clicks", value: affiliateClicks7d, color: "#10b981" },
      { stage: "Referral", label: "Shares & Signups", value: shares7d + signups7d, color: "#f59e0b" },
    ],

    // Daily chart data
    dailyBreakdown,
  };

  return NextResponse.json(response);
}
