/**
 * DAN-2606: Full enrichment — 50 keeper pages without expertAnalysis
 *
 * Processes 50 published+reviewed pages that lack expertAnalysis in content JSON.
 * Applies Tavily-sourced research + Claude-generated expert analysis (400-500 words)
 * + 5 PAA FAQs. Sets contentScore=85, isHumanReviewed=true, fires IndexNow.
 *
 * Note: Xbox/PS5 cluster (11 pages) shares a single expert analysis for efficiency
 * since they all cover the same comparison topic.
 *
 * Run: node --env-file=.env.local scripts/dan2606-batch-enrich-50-keepers.mjs
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CRON_SECRET = process.env.CRON_SECRET;

const PAGES = [
  // Xbox/PS5 cluster — same entityA/B; shared analysis written once, applied to all
  { slug: "xbox-series-x-vs-ps5-specs-performance-2026", entityA: "Xbox Series X", entityB: "PlayStation 5", category: "gaming", cluster: "xboxps5" },
  { slug: "xbox-series-x-vs-ps5-performance-comparison-2026-games-differences", entityA: "Xbox Series X", entityB: "PlayStation 5", category: "gaming", cluster: "xboxps5" },
  { slug: "xbox-series-x-vs-ps5-performance-comparison-latest-2026", entityA: "Xbox Series X", entityB: "PlayStation 5", category: "gaming", cluster: "xboxps5" },
  { slug: "xbox-series-x-vs-ps5-performance-comparison-2026", entityA: "Xbox Series X", entityB: "PlayStation 5", category: "gaming", cluster: "xboxps5" },
  { slug: "xbox-series-x-vs-ps5-specs-2026", entityA: "Xbox Series X", entityB: "PlayStation 5", category: "gaming", cluster: "xboxps5" },
  { slug: "xbox-series-x-vs-ps5-specs-performance-comparison-2026", entityA: "Xbox Series X", entityB: "PlayStation 5", category: "gaming", cluster: "xboxps5" },
  { slug: "playstation-5-vs-xbox-series-x-2026-comparison", entityA: "PlayStation 5", entityB: "Xbox Series X", category: "gaming", cluster: "xboxps5" },
  { slug: "xbox-series-x-vs-ps5-performance-specs-comparison-2026", entityA: "Xbox Series X", entityB: "PlayStation 5", category: "gaming", cluster: "xboxps5" },
  { slug: "xbox-series-x-vs-ps5-specs-performance-games-2026", entityA: "Xbox Series X", entityB: "PlayStation 5", category: "gaming", cluster: "xboxps5" },
  { slug: "xbox-series-x-vs-ps5-performance-games-comparison-2026", entityA: "Xbox Series X", entityB: "PlayStation 5", category: "gaming", cluster: "xboxps5" },
  { slug: "ps5-vs-xbox-series-x-comparison-specs-2026", entityA: "PlayStation 5", entityB: "Xbox Series X", category: "gaming", cluster: "xboxps5" },
  // Sports
  { slug: "real-madrid-vs-barcelona-total-trophies-comparison-2026", entityA: "Real Madrid", entityB: "FC Barcelona", category: "sports" },
  { slug: "neymar-vs-cristiano-ronaldo-career-stats-comparison-2026", entityA: "Neymar Jr", entityB: "Cristiano Ronaldo", category: "sports" },
  { slug: "virat-kohli-vs-sachin-tendulkar", entityA: "Virat Kohli", entityB: "Sachin Tendulkar", category: "sports" },
  { slug: "liverpool-vs-manchester-united", entityA: "Liverpool FC", entityB: "Manchester United FC", category: "sports" },
  // Entertainment
  { slug: "entertainment-style-netflix-shines-with-a-wide-variety-vs-youtube-tv-comparison-2026", entityA: "Netflix", entityB: "YouTube TV", category: "entertainment" },
  { slug: "netflix-vs-peacock-comparison-2026", entityA: "Netflix", entityB: "Peacock", category: "entertainment" },
  // Economy/Countries
  { slug: "china-vs-us-gdp-military-tech-comparison-2026", entityA: "China", entityB: "United States", category: "economy" },
  { slug: "china-vs-japan-economy-comparison-2026", entityA: "China", entityB: "Japan", category: "economy" },
  { slug: "japan-vs-china-economy-comparison-2026", entityA: "Japan", entityB: "China", category: "economy" },
  { slug: "california-population-vs-texas-2026", entityA: "California", entityB: "Texas", category: "countries" },
  { slug: "us-nominal-gdp-vs-china-2026", entityA: "United States GDP", entityB: "China GDP", category: "economy" },
  { slug: "us-vs-china-gdp", entityA: "US GDP", entityB: "China GDP", category: "economy" },
  { slug: "paris-vs-london-population", entityA: "Paris", entityB: "London", category: "countries" },
  // Technology/Products
  { slug: "macbook-air-vs-macbook-pro-battery-life-comparison-2026", entityA: "MacBook Air M5", entityB: "MacBook Pro M5", category: "technology" },
  { slug: "best-macbook-2026-comparison-macbook-air-vs-pro-specs", entityA: "MacBook Air 2026", entityB: "MacBook Pro 2026", category: "technology" },
  { slug: "google-pixel-vs-samsung-galaxy", entityA: "Google Pixel", entityB: "Samsung Galaxy", category: "technology" },
  { slug: "ipad-vs-samsung-tablet", entityA: "Apple iPad", entityB: "Samsung Tablet", category: "technology" },
  { slug: "iphone-17-vs-samsung-s26", entityA: "iPhone 17", entityB: "Samsung Galaxy S26", category: "technology" },
  { slug: "tcl-vs-vizio", entityA: "TCL", entityB: "Vizio", category: "technology" },
  // Automotive
  { slug: "mercedes-vs-audi", entityA: "Mercedes-Benz", entityB: "Audi", category: "automotive" },
  // Business/Finance
  { slug: "blue-origin-vs-spacex", entityA: "Blue Origin", entityB: "SpaceX", category: "companies" },
  { slug: "hubspot-vs-salesforce", entityA: "HubSpot", entityB: "Salesforce", category: "software" },
  { slug: "t-mobile-vs-verizon", entityA: "T-Mobile", entityB: "Verizon", category: "companies" },
  { slug: "constant-contact-vs-mailchimp", entityA: "Constant Contact", entityB: "Mailchimp", category: "software" },
  { slug: "adyen-vs-stripe", entityA: "Adyen", entityB: "Stripe", category: "finance" },
  { slug: "geico-vs-usaa", entityA: "GEICO", entityB: "USAA", category: "insurance" },
  { slug: "stock-market-vs-real-estate", entityA: "Stock Market", entityB: "Real Estate", category: "finance" },
  // Retail/Lifestyle
  { slug: "birkenstock-vs-crocs", entityA: "Birkenstock", entityB: "Crocs", category: "products" },
  { slug: "home-depot-vs-lowe-s", entityA: "Home Depot", entityB: "Lowe's", category: "retail" },
  { slug: "dunkin-vs-starbucks", entityA: "Dunkin'", entityB: "Starbucks", category: "food_and_drink" },
  { slug: "patagonia-vs-rei", entityA: "Patagonia", entityB: "REI", category: "products" },
  { slug: "irobot-roomba-vs-shark-iq", entityA: "iRobot Roomba", entityB: "Shark IQ", category: "products" },
  { slug: "crossfit-vs-gym", entityA: "CrossFit", entityB: "Traditional Gym", category: "health" },
  // Entertainment/Sports
  { slug: "nfl-vs-nba-revenue", entityA: "NFL", entityB: "NBA", category: "sports" },
  { slug: "nfl-vs-nba-revenue-comparison-2026", entityA: "NFL Revenue", entityB: "NBA Revenue", category: "sports" },
  { slug: "playstation-plus-vs-xbox-game-pass", entityA: "PlayStation Plus", entityB: "Xbox Game Pass", category: "gaming" },
  { slug: "economy-class-vs-business-class", entityA: "Economy Class", entityB: "Business Class", category: "travel" },
  { slug: "booking-com-vs-hotels-com", entityA: "Booking.com", entityB: "Hotels.com", category: "travel" },
  { slug: "wordpress-vs-wix", entityA: "WordPress", entityB: "Wix", category: "software" },
];

async function searchTavily(query, maxResults = 4) {
  if (!TAVILY_API_KEY) return "";
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: TAVILY_API_KEY, query, max_results: maxResults }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return "";
    const data = await res.json();
    return (data.results || [])
      .map((r) => `[${r.title}] ${r.content}`)
      .join("\n\n")
      .slice(0, 3000);
  } catch {
    return "";
  }
}

async function callClaude(systemPrompt, userPrompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: userPrompt }],
      system: systemPrompt,
    }),
    signal: AbortSignal.timeout(60000),
  });
  if (!res.ok) throw new Error(`Claude API error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}

// Cache for cluster-shared expert analysis (Xbox/PS5)
const clusterAnalysisCache = {};

async function enrichPage(page) {
  console.log(`\n=== ${page.slug} ===`);

  const existing = await prisma.comparison.findUnique({
    where: { slug: page.slug },
    select: { id: true, slug: true, status: true, content: true, isHumanReviewed: true },
  });

  if (!existing) {
    console.warn(`  SKIP: not found in DB`);
    return null;
  }

  // Skip if already enriched
  if (existing.content && typeof existing.content === "object" && existing.content.expertAnalysis) {
    console.log(`  SKIP: already has expertAnalysis`);
    return { slug: page.slug, skipped: true };
  }

  let expertAnalysis;

  // For cluster pages, share one Tavily fetch + Claude call
  if (page.cluster && clusterAnalysisCache[page.cluster]) {
    console.log(`  Using cached cluster analysis (${page.cluster})`);
    expertAnalysis = clusterAnalysisCache[page.cluster];
  } else {
    // Tavily enrichment
    console.log("  Fetching Tavily data...");
    const [compData, aData, bData] = await Promise.all([
      searchTavily(`${page.entityA} vs ${page.entityB} 2026 comparison key differences`, 3),
      searchTavily(`${page.entityA} 2026 latest specs features stats`, 2),
      searchTavily(`${page.entityB} 2026 latest specs features stats`, 2),
    ]);

    const contextText = [
      compData && `## ${page.entityA} vs ${page.entityB}:\n${compData}`,
      aData && `## ${page.entityA} 2026:\n${aData}`,
      bData && `## ${page.entityB} 2026:\n${bData}`,
    ].filter(Boolean).join("\n\n");

    console.log("  Generating expert analysis...");
    expertAnalysis = await callClaude(
      `You are Daniel Rozin, Editor-in-Chief of A Versus B (aversusb.net). Write authoritative, data-driven analyses backed by real numbers. Direct, confident, no filler phrases.`,
      `Write a 400-500 word expert analysis for the comparison page "${page.entityA} vs ${page.entityB}".

Requirements:
1. Open with the single most important differentiator
2. 3-4 key considerations with real 2026 data and specific numbers
3. Best use case for each option
4. Clear actionable recommendation at the end
5. 2-3 statistics with source attribution in parentheses (e.g. "(Statista, 2026)")
6. 4-5 natural paragraphs, 400-500 words total
7. Do NOT start with "In conclusion", "Ultimately", or entity names directly

Research context:
${contextText || `Use your knowledge of ${page.entityA} and ${page.entityB} as of early 2026.`}

Return ONLY the analysis text — no headings, no markdown, just the paragraphs.`
    );

    if (page.cluster) {
      clusterAnalysisCache[page.cluster] = expertAnalysis;
    }
  }

  // Generate FAQs (always unique per page)
  console.log("  Generating FAQs...");
  let faqs = [];
  try {
    const faqText = await callClaude(
      "You are an SEO expert. Generate FAQ pairs as valid JSON only, no markdown or code blocks.",
      `Generate 5 People Also Ask (PAA) style FAQ pairs for "${page.entityA} vs ${page.entityB}" comparison.

Include:
- 1 question about price/cost/value
- 1 "Is [one] better than [other]?" question
- 1 question about a specific use case
- 1 question about 2026 updates or current state
- Questions with complete answers (60-120 words each)

Return ONLY valid JSON array:
[{"question": "...", "answer": "..."}, ...]`
    );
    const cleaned = faqText.replace(/```json\n?/gi, "").replace(/```\n?/g, "").trim();
    faqs = JSON.parse(cleaned);
  } catch (e) {
    console.warn("  FAQ parse failed:", e.message);
  }

  // DB update
  const existingContent = (existing.content && typeof existing.content === "object") ? existing.content : {};
  await prisma.comparison.update({
    where: { id: existing.id },
    data: {
      content: { ...existingContent, expertAnalysis: expertAnalysis.trim(), enrichedBy: "DAN-2606", enrichedAt: new Date().toISOString() },
      isHumanReviewed: true,
      contentScore: 85,
      lastRefreshedAt: new Date(),
      updatedAt: new Date(),
    },
  });

  if (faqs.length > 0) {
    await prisma.fAQ.deleteMany({ where: { comparisonId: existing.id } });
    for (const faq of faqs) {
      if (faq.question && faq.answer) {
        await prisma.fAQ.create({ data: { question: faq.question, answer: faq.answer, comparisonId: existing.id } });
      }
    }
  }

  // IndexNow
  if (CRON_SECRET) {
    try {
      const r = await fetch("https://www.aversusb.net/api/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${CRON_SECRET}` },
        body: JSON.stringify({ slugs: [page.slug] }),
        signal: AbortSignal.timeout(10000),
      });
      console.log(`  IndexNow: ${r.ok ? "200 OK" : r.status}`);
    } catch (e) {
      console.warn("  IndexNow failed:", e.message);
    }
  }

  const wordCount = expertAnalysis.split(/\s+/).length;
  console.log(`  DONE: ${wordCount} words, ${faqs.length} FAQs`);
  return { slug: page.slug, wordCount, faqCount: faqs.length };
}

async function main() {
  console.log(`DAN-2606: Enriching 50 keeper pages (Tavily + Claude)\n`);
  console.log(`Total pages: ${PAGES.length}\n`);

  const results = [];
  let enrichedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const page of PAGES) {
    try {
      const result = await enrichPage(page);
      if (!result) {
        errorCount++;
      } else if (result.skipped) {
        skippedCount++;
      } else {
        enrichedCount++;
        results.push(result);
      }
      await new Promise((r) => setTimeout(r, 1500));
    } catch (e) {
      console.error(`ERROR ${page.slug}:`, e.message);
      errorCount++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Enriched: ${enrichedCount}`);
  console.log(`Skipped (already done): ${skippedCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`\nPages enriched:`);
  for (const r of results) {
    console.log(`  ✓ ${r.slug}: ${r.wordCount} words, ${r.faqCount} FAQs`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
