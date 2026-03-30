import { NextResponse } from "next/server";

/**
 * Analytics Dashboard API
 *
 * Returns the GA4 custom events configuration, funnel definitions,
 * and KPI targets for the Comparison product.
 *
 * This serves as the source of truth for:
 * - Looker Studio dashboard configuration
 * - Weekly metrics report structure
 * - Funnel analysis queries
 *
 * GET /api/analytics — returns full configuration
 * GET /api/analytics?section=funnel — returns only funnel config
 * GET /api/analytics?section=kpis — returns only KPI targets
 */

const GA4_PROPERTY = "G-0BWYZ5V9QK";
const CLARITY_PROJECT = "w2svnzrk4f";

const CUSTOM_EVENTS = [
  { name: "comparison_search", category: "discovery", description: "User searches for a comparison", params: ["search_term", "result_type"] },
  { name: "comparison_view", category: "consideration", description: "User views a comparison page", params: ["comparison_slug", "category"] },
  { name: "related_comparison_click", category: "exploration", description: "User clicks a related comparison", params: ["source_page", "target_page"] },
  { name: "affiliate_click", category: "conversion", description: "User clicks a product affiliate CTA", params: ["product", "position", "page"] },
  { name: "embed_cta_click", category: "partnership", description: "User clicks embed button", params: ["comparison_slug", "page"] },
  { name: "share_click", category: "amplification", description: "User shares content", params: ["platform", "page"] },
  { name: "newsletter_signup", category: "lead_capture", description: "User signs up for newsletter", params: ["page", "placement"] },
  { name: "comparison_vote", category: "engagement", description: "User votes on a comparison", params: ["entity_a", "entity_b", "choice"] },
  { name: "exit_intent_shown", category: "retention", description: "Exit intent popup shown", params: ["page"] },
  { name: "exit_intent_dismissed", category: "retention", description: "Exit intent popup dismissed", params: ["page"] },
  { name: "experiment_view", category: "experimentation", description: "A/B test variant assigned", params: ["experiment_id", "experiment_name", "variant"] },
  { name: "funnel_step", category: "engagement", description: "User reaches a funnel milestone", params: ["step", "page", "value"] },
];

const CONVERSION_FUNNEL = {
  name: "Comparison Conversion Funnel",
  steps: [
    { step: 1, name: "Landing", event: "page_view", description: "User arrives at aversusb.net" },
    { step: 2, name: "Search/Browse", event: "comparison_search", description: "User searches or browses categories" },
    { step: 3, name: "View Comparison", event: "comparison_view", description: "User views a comparison page" },
    { step: 4, name: "Engage", event: "comparison_vote|share_click|newsletter_signup", description: "User engages with content" },
    { step: 5, name: "Embed CTA", event: "embed_cta_click", description: "User clicks embed or affiliate CTA" },
  ],
};

const KPI_TARGETS = {
  northStar: {
    metric: "Weekly active comparisons viewed",
    description: "Unique comparison pages viewed per week",
    currentBaseline: null,
    target: "To be set after 2 weeks of data collection",
  },
  core: [
    { metric: "Sessions", source: "GA4 session_start", frequency: "weekly", target: null },
    { metric: "Unique Users", source: "GA4 active_users", frequency: "weekly", target: null },
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

  return NextResponse.json({
    product: "Comparison (aversusb.net)",
    ga4Property: GA4_PROPERTY,
    clarityProject: CLARITY_PROJECT,
    events: CUSTOM_EVENTS,
    funnel: CONVERSION_FUNNEL,
    kpis: KPI_TARGETS,
    reporting: REPORTING_CADENCE,
  });
}
