import { NextResponse } from "next/server";
import { getRedis } from "@/lib/services/redis";
import { prisma } from "@/lib/db/prisma";
import { experiments, getActiveExperiments } from "@/lib/experiments/config";
import { fetchGSCQueries, getGSCStats, type GSCQuery } from "@/lib/services/gsc-service";

/**
 * Analytics Dashboard API
 *
 * GET /api/analytics — full config + live metrics
 * GET /api/analytics?section=funnel|kpis|events|reporting|live|report
 *
 * "live" returns real-time metrics from Redis event log + DB counts.
 * "report" returns a structured weekly metrics report.
 */

const GA4_PROPERTY = "G-0BWYZ5V9QK";
const CLARITY_PROJECT = "w2svnzrk4f";

const CUSTOM_EVENTS = [
  { name: "comparison_search", category: "discovery", description: "User searches for a comparison", params: ["search_term", "result_type"] },
  { name: "comparison_view", category: "consideration", description: "User views a comparison page", params: ["comparison_slug", "category"] },
  { name: "related_comparison_click", category: "exploration", description: "User clicks a related comparison", params: ["source_page", "target_page"] },
  { name: "affiliate_click", category: "conversion", description: "User clicks a product affiliate CTA", params: ["product", "position", "page"] },
  { name: "embed_cta_click", category: "partnership", description: "User clicks embed button", params: ["comparison_slug", "page"] },
  { name: "embed_key_registration", category: "partnership", description: "User registers for embed key", params: ["tier"] },
  { name: "embed_key_emailed", category: "partnership", description: "Embed key delivered via email", params: ["tier"] },
  { name: "api_key_generation", category: "partnership", description: "User generates an API key", params: ["key_name"] },
  { name: "share_click", category: "amplification", description: "User shares content", params: ["platform", "page"] },
  { name: "newsletter_signup", category: "lead_capture", description: "User signs up for newsletter", params: ["page", "placement"] },
  { name: "poll_email_capture", category: "lead_capture", description: "User provides email after poll", params: ["page", "placement"] },
  { name: "comment_submission", category: "engagement", description: "User submits a comment", params: ["comparison_id", "page"] },
  { name: "comparison_vote", category: "engagement", description: "User votes on a comparison", params: ["entity_a", "entity_b", "choice"] },
  { name: "experiment_view", category: "experimentation", description: "A/B test variant assigned", params: ["experiment_id", "experiment_name", "variant"] },
  { name: "conversion_funnel", category: "engagement", description: "User reaches a funnel milestone", params: ["funnel_step", "page"] },
];

const CONVERSION_FUNNEL = {
  name: "Comparison Conversion Funnel",
  steps: [
    { step: 1, name: "Landing", event: "page_view", description: "User arrives at aversusb.net" },
    { step: 2, name: "Search/Browse", event: "comparison_search", description: "User searches or browses categories" },
    { step: 3, name: "View Comparison", event: "comparison_view", description: "User views a comparison page" },
    { step: 4, name: "Scroll 25%", event: "conversion_funnel:scroll_depth_25", description: "User scrolls to 25% of comparison" },
    { step: 5, name: "Scroll 50%", event: "conversion_funnel:scroll_depth_50", description: "User scrolls to 50% of comparison" },
    { step: 6, name: "Deep Engagement", event: "conversion_funnel:engagement", description: "User spends 30+ seconds on page" },
    { step: 7, name: "Engage", event: "comparison_vote|share_click|newsletter_signup|comment_submission", description: "User actively engages" },
    { step: 8, name: "Convert", event: "affiliate_click|embed_cta_click|embed_key_registration", description: "User clicks affiliate CTA or registers for embed" },
  ],
};

const KPI_TARGETS = {
  northStar: {
    metric: "Weekly active comparisons viewed",
    description: "Unique comparison pages viewed per week",
    currentBaseline: null as string | null,
    target: "To be set after 2 weeks of data collection",
  },
  core: [
    { metric: "Sessions", source: "GA4 session_start", frequency: "weekly", target: null as string | null },
    { metric: "Unique Users", source: "GA4 active_users", frequency: "weekly", target: null as string | null },
    { metric: "Bounce Rate", source: "GA4 bounce_rate", frequency: "weekly", target: "<60%" },
    { metric: "Avg Session Duration", source: "GA4 average_session_duration", frequency: "weekly", target: ">2 min" },
    { metric: "Pages/Session", source: "GA4 screen_page_views_per_session", frequency: "weekly", target: ">2.5" },
    { metric: "Search Rate", source: "comparison_search / sessions", frequency: "weekly", target: ">15%" },
    { metric: "Funnel Completion", source: "embed_cta_click / page_view", frequency: "weekly", target: ">1%" },
  ],
  engagement: [
    { metric: "Vote Rate", formula: "comparison_vote / comparison_view", target: ">5%" },
    { metric: "Share Rate", formula: "share_click / comparison_view", target: ">2%" },
    { metric: "Search Success Rate", formula: "comparison_view / comparison_search", target: ">60%" },
    { metric: "Embed Adoption", formula: "embed_cta_click / comparison_view", target: ">0.5%" },
    { metric: "Newsletter Conversion", formula: "newsletter_signup / sessions", target: ">1%" },
  ],
};

const REPORTING_CADENCE = {
  weekly: {
    name: "Weekly Metrics Snapshot",
    audience: ["VP Product", "CTO"],
    sections: [
      "Headline numbers (sessions, users, bounce rate, duration)",
      "Funnel health (conversion rates per step)",
      "Top 10 pages by traffic",
      "Top 3 pages with highest bounce rate",
      "Notable trends or anomalies",
    ],
  },
  monthly: {
    name: "Monthly Deep Dive",
    audience: ["VP Product", "CEO"],
    sections: [
      "Full funnel analysis with drop-off rates",
      "Cohort retention analysis",
      "Content gap analysis (GSC vs GA4)",
      "A/B test results and recommendations",
      "Search query insights",
      "Competitive benchmarking",
    ],
  },
  quarterly: {
    name: "Quarterly Strategic Review",
    audience: ["Leadership"],
    sections: [
      "KPI trends and trajectory",
      "Growth analysis",
      "Product recommendations",
      "Resource allocation review",
    ],
  },
};

interface AdminEvent {
  id: string;
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
}

async function getLiveMetrics() {
  const redis = getRedis();
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  // Get last 7 days date range
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }

  // Pull admin events from Redis
  let events: AdminEvent[] = [];
  if (redis) {
    try {
      const raw = await redis.lrange("admin:events", 0, 499);
      events = raw.map((item) => {
        if (typeof item === "string") return JSON.parse(item);
        return item as AdminEvent;
      });
    } catch (err) {
      console.error("Redis analytics error:", err);
    }
  }

  // Pull recent searches from Redis
  let recentSearches: Array<{ slug: string; title: string; category: string; searchedAt: string; generated: boolean }> = [];
  if (redis) {
    try {
      const raw = await redis.lrange("recent:searches", 0, 99);
      recentSearches = raw.map((item) => {
        if (typeof item === "string") return JSON.parse(item);
        return item;
      });
    } catch (err) {
      console.error("Redis recent searches error:", err);
    }
  }

  // DB counts
  let dbStats = { comparisons: 0, entities: 0, blogArticles: 0, newsletterSubscribers: 0, embedPartners: 0, votes: 0, keywords: 0 };
  try {
    const [comparisons, entities, blogArticles, newsletterSubscribers, embedPartners, votes, keywords] = await Promise.all([
      prisma.comparison.count(),
      prisma.entity.count(),
      prisma.blogArticle.count(),
      prisma.newsletterSubscriber.count(),
      prisma.embedPartner.count(),
      prisma.comparisonVote.count(),
      prisma.keywordOpportunity.count(),
    ]);
    dbStats = { comparisons, entities, blogArticles, newsletterSubscribers, embedPartners, votes, keywords };
  } catch (err) {
    console.error("DB stats error:", err);
  }

  // Aggregate events by day
  const dailyBreakdown = days.map((day) => {
    const dayEvents = events.filter((e) => e.timestamp.startsWith(day));
    return {
      date: day,
      label: new Date(day + "T00:00:00Z").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      total: dayEvents.length,
      searches: dayEvents.filter((e) => e.type === "search").length,
      generations: dayEvents.filter((e) => e.type === "generation").length,
      feedbacks: dayEvents.filter((e) => e.type === "feedback").length,
    };
  });

  // Aggregate events by type
  const todayEvents = events.filter((e) => e.timestamp.startsWith(today));
  const eventsByType: Record<string, number> = {};
  events.forEach((e) => { eventsByType[e.type] = (eventsByType[e.type] || 0) + 1; });
  const todayByType: Record<string, number> = {};
  todayEvents.forEach((e) => { todayByType[e.type] = (todayByType[e.type] || 0) + 1; });

  // Top searched categories
  const categoryCount: Record<string, number> = {};
  recentSearches.forEach((s) => {
    categoryCount[s.category] = (categoryCount[s.category] || 0) + 1;
  });
  const topCategories = Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([category, count]) => ({ category, count }));

  // Top comparisons by search frequency
  const slugCount: Record<string, { title: string; count: number }> = {};
  recentSearches.forEach((s) => {
    if (!slugCount[s.slug]) slugCount[s.slug] = { title: s.title, count: 0 };
    slugCount[s.slug].count++;
  });
  const topComparisons = Object.entries(slugCount)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 10)
    .map(([slug, { title, count }]) => ({ slug, title, count }));

  // Generation vs organic ratio
  const generated = recentSearches.filter((s) => s.generated).length;
  const organic = recentSearches.filter((s) => !s.generated).length;

  return {
    period: { start: days[0], end: days[days.length - 1], days: days.length },
    summary: {
      totalEvents: events.length,
      todayEvents: todayEvents.length,
      eventsByType,
      todayByType,
    },
    dailyBreakdown,
    content: {
      ...dbStats,
      recentSearchCount: recentSearches.length,
      generatedCount: generated,
      organicCount: organic,
    },
    topCategories,
    topComparisons,
  };
}

async function generateWeeklyReport() {
  const live = await getLiveMetrics();
  const now = new Date();

  const totalSearches = live.summary.eventsByType["search"] || 0;
  const totalGenerations = live.summary.eventsByType["generation"] || 0;
  const totalFeedbacks = live.summary.eventsByType["feedback"] || 0;

  const report = {
    title: `Weekly Metrics Report — ${live.period.start} to ${live.period.end}`,
    generatedAt: now.toISOString(),
    headline: {
      totalEvents: live.summary.totalEvents,
      searches: totalSearches,
      generations: totalGenerations,
      feedbacks: totalFeedbacks,
      contentInDB: live.content.comparisons,
      newsletterSubscribers: live.content.newsletterSubscribers,
    },
    dailyTrend: live.dailyBreakdown,
    topComparisons: live.topComparisons,
    topCategories: live.topCategories,
    contentHealth: {
      totalComparisons: live.content.comparisons,
      totalEntities: live.content.entities,
      totalBlogArticles: live.content.blogArticles,
      embedPartners: live.content.embedPartners,
      totalVotes: live.content.votes,
      keywordsTracked: live.content.keywords,
      generationRatio: live.content.recentSearchCount > 0
        ? `${Math.round((live.content.generatedCount / live.content.recentSearchCount) * 100)}% AI-generated`
        : "No data",
    },
    callouts: [] as string[],
  };

  // Generate callouts
  if (live.summary.todayEvents === 0) {
    report.callouts.push("No events recorded today — verify tracking is active.");
  }
  if (totalGenerations > totalSearches * 2) {
    report.callouts.push("High generation-to-search ratio — most content is AI-generated, not user-driven.");
  }
  if (live.content.newsletterSubscribers > 0) {
    report.callouts.push(`${live.content.newsletterSubscribers} newsletter subscribers captured.`);
  }
  const peakDay = live.dailyBreakdown.reduce((max, d) => d.total > max.total ? d : max, live.dailyBreakdown[0]);
  if (peakDay && peakDay.total > 0) {
    report.callouts.push(`Peak activity day: ${peakDay.label} with ${peakDay.total} events.`);
  }

  return report;
}

interface GSCCrossRefInsight {
  type: "high_impressions_low_ctr" | "striking_distance" | "quick_win" | "top_performer";
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  action: string;
}

async function getGSCCrossReference(): Promise<{
  stats: { totalQueries: number; totalClicks: number; totalImpressions: number; avgPosition: number };
  insights: GSCCrossRefInsight[];
  topQueries: GSCQuery[];
  strikingDistance: GSCQuery[];
  highImpressionLowCTR: GSCQuery[];
}> {
  const [queries, stats] = await Promise.all([fetchGSCQueries(), getGSCStats()]);

  const insights: GSCCrossRefInsight[] = [];
  const strikingDistance: GSCQuery[] = [];
  const highImpressionLowCTR: GSCQuery[] = [];

  for (const q of queries) {
    // High impressions, low CTR — meta title/description optimization
    if (q.impressions >= 10 && q.ctr < 0.03 && q.position <= 10) {
      highImpressionLowCTR.push(q);
      insights.push({
        type: "high_impressions_low_ctr",
        ...q,
        action: `Rewrite meta title/description for "${q.query}" — position ${q.position.toFixed(1)} but only ${(q.ctr * 100).toFixed(1)}% CTR`,
      });
    }

    // Striking distance (position 5-15) — content optimization to push into top 5
    if (q.position >= 5 && q.position <= 15 && q.impressions >= 5) {
      strikingDistance.push(q);
      insights.push({
        type: "striking_distance",
        ...q,
        action: `Optimize content for "${q.query}" — position ${q.position.toFixed(1)}, could reach top 5 with targeted improvements`,
      });
    }

    // Quick wins — already ranking well with decent CTR, double down
    if (q.position <= 3 && q.ctr >= 0.05 && q.impressions >= 10) {
      insights.push({
        type: "quick_win",
        ...q,
        action: `"${q.query}" is performing well — position ${q.position.toFixed(1)}, ${(q.ctr * 100).toFixed(1)}% CTR. Consider expanding content depth.`,
      });
    }
  }

  // Sort insights by impressions descending
  insights.sort((a, b) => b.impressions - a.impressions);

  // Top queries by clicks
  const topQueries = [...queries].sort((a, b) => b.clicks - a.clicks).slice(0, 20);

  return {
    stats,
    insights: insights.slice(0, 30),
    topQueries,
    strikingDistance: strikingDistance.sort((a, b) => b.impressions - a.impressions).slice(0, 20),
    highImpressionLowCTR: highImpressionLowCTR.sort((a, b) => b.impressions - a.impressions).slice(0, 20),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");

  if (section === "funnel") {
    return NextResponse.json({ funnel: CONVERSION_FUNNEL });
  }
  if (section === "kpis") {
    return NextResponse.json({ kpis: KPI_TARGETS });
  }
  if (section === "events") {
    return NextResponse.json({ events: CUSTOM_EVENTS });
  }
  if (section === "reporting") {
    return NextResponse.json({ reporting: REPORTING_CADENCE });
  }
  if (section === "experiments") {
    const now = new Date();
    const active = getActiveExperiments();
    const experimentData = experiments.map((exp) => {
      const start = new Date(exp.startDate);
      const end = new Date(exp.endDate);
      const isActive = now >= start && now <= end;
      const daysRunning = isActive ? Math.floor((now.getTime() - start.getTime()) / 86400000) : 0;
      const daysRemaining = isActive ? Math.floor((end.getTime() - now.getTime()) / 86400000) : 0;
      return { ...exp, isActive, daysRunning, daysRemaining };
    });
    return NextResponse.json({
      experiments: experimentData,
      activeCount: active.length,
      analysisNotes: [
        "verdict-first-layout: 50% traffic split testing bounce_rate. Ensure GA4 bounce_rate custom dimension is configured in explore reports to compare variants.",
        "cta-button-style: 100% traffic, testing affiliate_click rate. Filter GA4 events by experiment_view variant to measure treatment vs control.",
        "social-proof-elements: Scheduled for May 15. Not yet active.",
        "Minimum sample size: ~1,000 sessions per variant for 95% confidence on bounce_rate changes >5pp.",
        "Recommended: Wait 2+ weeks before drawing conclusions to account for day-of-week effects.",
      ],
    });
  }
  if (section === "gsc-crossref") {
    const crossref = await getGSCCrossReference();
    return NextResponse.json(crossref);
  }
  if (section === "live") {
    const live = await getLiveMetrics();
    return NextResponse.json(live);
  }
  if (section === "report") {
    const report = await generateWeeklyReport();
    return NextResponse.json(report);
  }

  // Default: config + live metrics
  const live = await getLiveMetrics();
  const activeExperiments = getActiveExperiments();
  return NextResponse.json({
    product: "Comparison (aversusb.net)",
    ga4Property: GA4_PROPERTY,
    clarityProject: CLARITY_PROJECT,
    events: CUSTOM_EVENTS,
    funnel: CONVERSION_FUNNEL,
    kpis: KPI_TARGETS,
    reporting: REPORTING_CADENCE,
    experiments: experiments.map((exp) => {
      const start = new Date(exp.startDate);
      const end = new Date(exp.endDate);
      const now = new Date();
      return { ...exp, isActive: now >= start && now <= end };
    }),
    activeExperimentCount: activeExperiments.length,
    live,
  });
}
