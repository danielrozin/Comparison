import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/services/email";
import { mergeOpportunities } from "@/lib/services/pipeline-service";
import { parseComparisonKeyword, scoreOpportunity } from "@/lib/dataforseo/keyword-discovery";
import type { DiscoveredOpportunity } from "@/lib/dataforseo/keyword-discovery";

export const maxDuration = 60;

/**
 * GET /api/cron/daily-discovery
 *
 * Daily cron job: discovers comparison keyword opportunities via DataForSEO,
 * saves them to the Redis pipeline, and sends a report email.
 *
 * Triggered by Vercel Cron (vercel.json) once daily at 8am UTC.
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;

  if (!login || !password) {
    return NextResponse.json({ error: "DataForSEO credentials not configured" }, { status: 500 });
  }

  const auth = "Basic " + btoa(`${login}:${password}`);
  const allOpportunities: { keyword: string; volume: number; cpc: number; difficulty: number }[] = [];

  // Seed keywords to expand
  const seeds = [
    "vs", "comparison", "alternative to", "difference between",
    "iphone vs", "samsung vs", "tesla vs", "nike vs",
    "country comparison", "player comparison", "chatgpt vs",
    "best alternative", "which is better",
    "claude vs", "notion vs", "aws vs", "bitcoin vs",
    "ozempic vs", "toyota vs", "netflix vs",
    "ps5 vs", "fortnite vs", "gaming laptop vs",
    "chipotle vs", "oat milk vs", "air fryer vs",
    "harvard vs", "coursera vs", "online vs",
    "delta vs", "airbnb vs", "bali vs",
    "robinhood vs", "credit card vs", "etf vs",
  ];

  // Query DataForSEO for each seed
  for (const seed of seeds) {
    try {
      const res = await fetch("https://api.dataforseo.com/v3/dataforseo_labs/google/keyword_suggestions/live", {
        method: "POST",
        headers: { "Authorization": auth, "Content-Type": "application/json" },
        body: JSON.stringify([{
          keyword: seed,
          location_code: 2840,
          language_code: "en",
          limit: 50,
          filters: [["keyword_info.search_volume", ">", 500]],
          order_by: ["keyword_info.search_volume,desc"],
        }]),
      });

      const data = await res.json();
      const items = data.tasks?.[0]?.result?.[0]?.items || [];

      for (const item of items) {
        const kw = item.keyword?.toLowerCase() || "";
        // Only keep comparison-type keywords
        if (kw.match(/\bvs\b|versus|compar|alternative|difference between|\bor\b/i)) {
          const difficulty = item.keyword_properties?.keyword_difficulty || 0;
          // Skip keywords with extreme difficulty (>80) — not worth targeting
          if (difficulty > 80) continue;
          allOpportunities.push({
            keyword: kw,
            volume: item.keyword_info?.search_volume || 0,
            cpc: item.keyword_info?.cpc || 0,
            difficulty,
          });
        }
      }
    } catch (err) {
      console.error(`Seed "${seed}" failed:`, err);
    }
  }

  // Deduplicate
  const unique = new Map<string, typeof allOpportunities[0]>();
  for (const opp of allOpportunities) {
    if (!unique.has(opp.keyword) || opp.volume > (unique.get(opp.keyword)?.volume || 0)) {
      unique.set(opp.keyword, opp);
    }
  }

  // Sort by volume
  const sorted = Array.from(unique.values()).sort((a, b) => b.volume - a.volume);
  const duration = Date.now() - startTime;

  // Save to Redis pipeline (convert to DiscoveredOpportunity format)
  const pipelineOpps: DiscoveredOpportunity[] = sorted.map((opp) => {
    const parsed = parseComparisonKeyword(opp.keyword);

    return {
      keyword: opp.keyword,
      searchVolume: opp.volume,
      cpc: opp.cpc,
      competition: 0,
      difficulty: opp.difficulty,
      intent: "informational",
      entityA: parsed.entityA,
      entityB: parsed.entityB,
      queryPattern: parsed.queryPattern,
      category: null,
      opportunityScore: scoreOpportunity({
        keyword: opp.keyword,
        search_volume: opp.volume,
        cpc: opp.cpc,
        competition: 0,
        keyword_difficulty: opp.difficulty,
        search_intent: "informational",
      }),
      source: "daily_cron",
    };
  });

  await mergeOpportunities(pipelineOpps);

  // Build email report
  const top20 = sorted.slice(0, 20);
  const reportLines = top20.map((k, i) =>
    `${i + 1}. [${k.volume.toLocaleString()}/mo] ${k.keyword} — $${k.cpc} CPC, Diff: ${k.difficulty}`
  );

  const report = `Daily DataForSEO Discovery Report
========================================
Date: ${new Date().toISOString().split("T")[0]}
Duration: ${duration}ms
Total keywords found: ${sorted.length}
Seeds queried: ${seeds.length}
Saved to pipeline: ${pipelineOpps.length} opportunities

Top 20 Opportunities:
${reportLines.join("\n")}

Total estimated search volume (top 20): ${top20.reduce((s, k) => s + k.volume, 0).toLocaleString()}/mo

Full results available via API: /api/pipeline/opportunities
`;

  // Send email notification
  await sendNotificationEmail({
    subject: `Daily Report: ${sorted.length} keywords found`,
    type: "cron-report",
    message: report,
    pageUrl: "https://www.aversusb.net/api/cron/daily-discovery",
  });

  return NextResponse.json({
    success: true,
    duration: `${duration}ms`,
    totalKeywords: sorted.length,
    savedToPipeline: pipelineOpps.length,
    top20: top20,
    timestamp: new Date().toISOString(),
  });
}
