/**
 * Comprehensive Software Vertical Research Script
 * Uses DataForSEO, Tavily, and Apify to discover high-value software comparison opportunities
 *
 * Run: npx tsx scripts/software-research.ts
 */

import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load env from project root
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// ============================================================
// API Clients (inline to avoid Next.js import issues)
// ============================================================

const DATAFORSEO_BASE = "https://api.dataforseo.com/v3";
const TAVILY_URL = "https://api.tavily.com/search";
const APIFY_BASE = "https://api.apify.com/v2";

function getDataForSEOAuth(): string {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) throw new Error("DataForSEO credentials missing");
  return "Basic " + Buffer.from(`${login}:${password}`).toString("base64");
}

async function dataforseoRequest<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${DATAFORSEO_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: getDataForSEOAuth(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DataForSEO ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

async function tavilySearch(query: string, maxResults = 5): Promise<{ url: string; title: string; content: string }[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) { console.warn("No TAVILY_API_KEY"); return []; }
  try {
    const res = await fetch(TAVILY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, query, max_results: maxResults }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data as any).results || [];
  } catch { return []; }
}

// ============================================================
// Software Vertical Seed Keywords
// ============================================================

// Subcategories within software that have high commercial intent
const SOFTWARE_SUBCATEGORIES: Record<string, string[]> = {
  // VPN & Security — highest CPC in software
  vpn_security: [
    "best vpn vs", "nordvpn vs expressvpn", "surfshark vs nordvpn",
    "norton vs mcafee", "bitdefender vs kaspersky", "malwarebytes vs norton",
    "protonvpn vs mullvad", "avast vs avg", "norton vs bitdefender",
    "vpn comparison", "antivirus comparison 2026",
  ],
  // Hosting & Domains — high affiliate payouts
  hosting: [
    "bluehost vs godaddy", "hostinger vs bluehost", "siteground vs bluehost",
    "cloudflare vs cloudfront", "aws vs azure", "digitalocean vs linode",
    "wix vs squarespace", "wordpress vs wix", "shopify vs woocommerce",
    "namecheap vs godaddy", "webflow vs wordpress",
  ],
  // Project Management & Productivity
  productivity: [
    "notion vs obsidian", "monday vs asana", "clickup vs monday",
    "trello vs asana", "jira vs monday", "todoist vs ticktick",
    "evernote vs notion", "airtable vs smartsheet", "basecamp vs asana",
    "microsoft teams vs slack", "zoom vs teams",
  ],
  // Design & Creative
  design: [
    "figma vs sketch", "canva vs photoshop", "illustrator vs affinity designer",
    "premiere pro vs davinci resolve", "lightroom vs capture one",
    "procreate vs photoshop", "canva vs figma", "midjourney vs dall e",
    "adobe vs affinity", "capcut vs premiere pro",
  ],
  // Cloud & DevTools
  cloud_devtools: [
    "github vs gitlab", "aws vs google cloud", "docker vs kubernetes",
    "vscode vs intellij", "vercel vs netlify", "supabase vs firebase",
    "mongodb vs postgresql", "redis vs memcached", "terraform vs pulumi",
    "datadog vs new relic", "grafana vs datadog",
  ],
  // AI Tools — trending, fast growth
  ai_tools: [
    "chatgpt vs claude", "gemini vs chatgpt", "copilot vs chatgpt",
    "midjourney vs stable diffusion", "jasper vs chatgpt", "grammarly vs chatgpt",
    "perplexity vs chatgpt", "claude vs gemini", "chatgpt vs deepseek",
    "cursor vs copilot", "notion ai vs chatgpt", "otter ai vs fireflies",
  ],
  // Email Marketing & CRM
  email_crm: [
    "mailchimp vs constant contact", "hubspot vs salesforce", "klaviyo vs mailchimp",
    "activecampaign vs mailchimp", "convertkit vs mailchimp", "pipedrive vs hubspot",
    "zoho vs salesforce", "brevo vs mailchimp", "freshdesk vs zendesk",
    "intercom vs zendesk",
  ],
  // Accounting & Finance Software
  finance_software: [
    "quickbooks vs xero", "freshbooks vs quickbooks", "wave vs quickbooks",
    "stripe vs paypal", "square vs stripe", "sage vs quickbooks",
    "turbotax vs h&r block", "robinhood vs webull", "coinbase vs binance",
    "mint vs ynab",
  ],
  // Website Builders & eCommerce
  ecommerce: [
    "shopify vs etsy", "shopify vs amazon", "bigcommerce vs shopify",
    "woocommerce vs magento", "squarespace vs shopify", "printful vs printify",
    "gumroad vs lemonsqueezy", "teachable vs thinkific", "kajabi vs teachable",
    "podia vs teachable",
  ],
  // Video & Streaming
  video_streaming: [
    "youtube tv vs hulu live", "obs vs streamlabs", "loom vs zoom",
    "vimeo vs youtube", "twitch vs youtube gaming", "descript vs premiere",
    "filmora vs imovie", "plex vs emby", "roku vs fire stick",
    "peacock vs paramount plus",
  ],
  // Password Managers & Privacy
  password_privacy: [
    "1password vs lastpass", "bitwarden vs 1password", "dashlane vs 1password",
    "protonmail vs gmail", "signal vs telegram", "brave vs firefox",
    "duckduckgo vs google", "tor vs vpn", "keeper vs 1password",
    "nordpass vs 1password",
  ],
  // PDF & Office Tools
  office_tools: [
    "google docs vs word", "google sheets vs excel", "libreoffice vs office",
    "adobe acrobat vs foxit", "pdf editor comparison", "google workspace vs microsoft 365",
    "dropbox vs google drive", "onedrive vs google drive", "icloud vs google drive",
    "grammarly vs hemingway",
  ],
};

// Competitor domains specializing in software comparisons
const SOFTWARE_COMPETITORS = [
  "g2.com",
  "capterra.com",
  "trustradius.com",
  "getapp.com",
  "softwareadvice.com",
  "pcmag.com",
  "techradar.com",
  "tomsguide.com",
];

// ============================================================
// Research Functions
// ============================================================

interface KeywordResult {
  keyword: string;
  search_volume: number;
  cpc: number;
  competition: number;
  keyword_difficulty: number;
  search_intent: string;
  opportunityScore: number;
  subcategory: string;
  source: string;
}

function scoreKeyword(kw: any): number {
  const vol = kw.search_volume || kw.keyword_info?.search_volume || 0;
  const diff = kw.keyword_difficulty || kw.keyword_properties?.keyword_difficulty || 0;
  const cpc = kw.cpc || kw.keyword_info?.cpc || 0;
  const comp = kw.competition || kw.keyword_info?.competition || 0;

  let score = 0;
  score += Math.log10(Math.max(vol, 1)) * 20;
  score += Math.max(0, 100 - diff) * 0.3;
  score += Math.min(cpc * 5, 25);
  score += (1 - comp) * 15;
  return Math.round(score * 100) / 100;
}

// 1. DataForSEO: Keyword Ideas from seed groups
async function discoverKeywordIdeas(subcategory: string, seeds: string[]): Promise<KeywordResult[]> {
  console.log(`  [DataForSEO] Keyword Ideas for: ${subcategory} (${seeds.length} seeds)`);
  try {
    const data: any = await dataforseoRequest(
      "/dataforseo_labs/google/keyword_ideas/live",
      [{
        keywords: seeds,
        location_code: 2840,
        language_code: "en",
        limit: 300,
        include_serp_info: false,
        filters: [["keyword_info.search_volume", ">", 50]],
        order_by: ["keyword_info.search_volume,desc"],
      }]
    );

    const items = data.tasks?.[0]?.result?.[0]?.items || [];
    console.log(`    → Found ${items.length} keywords`);

    return items.map((item: any) => ({
      keyword: item.keyword,
      search_volume: item.keyword_info?.search_volume || 0,
      cpc: item.keyword_info?.cpc || 0,
      competition: item.keyword_info?.competition || 0,
      keyword_difficulty: item.keyword_properties?.keyword_difficulty || 0,
      search_intent: item.search_intent_info?.main_intent || "informational",
      opportunityScore: scoreKeyword({
        search_volume: item.keyword_info?.search_volume || 0,
        keyword_difficulty: item.keyword_properties?.keyword_difficulty || 0,
        cpc: item.keyword_info?.cpc || 0,
        competition: item.keyword_info?.competition || 0,
      }),
      subcategory,
      source: "dataforseo_ideas",
    }));
  } catch (err: any) {
    console.error(`    ✗ Error: ${err.message}`);
    return [];
  }
}

// 2. DataForSEO: Keyword Suggestions (expand single seeds)
async function discoverKeywordSuggestions(seed: string, subcategory: string): Promise<KeywordResult[]> {
  console.log(`  [DataForSEO] Suggestions for: "${seed}"`);
  try {
    const data: any = await dataforseoRequest(
      "/dataforseo_labs/google/keyword_suggestions/live",
      [{
        keyword: seed,
        location_code: 2840,
        language_code: "en",
        include_seed_keyword: true,
        limit: 100,
      }]
    );

    const items = data.tasks?.[0]?.result?.[0]?.items || [];
    console.log(`    → Found ${items.length} suggestions`);

    return items
      .filter((item: any) => (item.keyword_info?.search_volume || 0) > 50)
      .map((item: any) => ({
        keyword: item.keyword,
        search_volume: item.keyword_info?.search_volume || 0,
        cpc: item.keyword_info?.cpc || 0,
        competition: item.keyword_info?.competition || 0,
        keyword_difficulty: item.keyword_properties?.keyword_difficulty || 0,
        search_intent: item.search_intent_info?.main_intent || "informational",
        opportunityScore: scoreKeyword({
          search_volume: item.keyword_info?.search_volume || 0,
          keyword_difficulty: item.keyword_properties?.keyword_difficulty || 0,
          cpc: item.keyword_info?.cpc || 0,
          competition: item.keyword_info?.competition || 0,
        }),
        subcategory,
        source: "dataforseo_suggestions",
      }));
  } catch (err: any) {
    console.error(`    ✗ Error: ${err.message}`);
    return [];
  }
}

// 3. DataForSEO: Competitor domain reverse engineering
async function discoverFromCompetitor(domain: string): Promise<KeywordResult[]> {
  console.log(`  [DataForSEO] Scanning competitor: ${domain}`);
  try {
    const data: any = await dataforseoRequest(
      "/dataforseo_labs/google/ranked_keywords/live",
      [{
        target: domain,
        location_code: 2840,
        language_code: "en",
        limit: 200,
        filters: [
          ["keyword_data.keyword", "like", "%vs%"],
          "and",
          ["keyword_data.keyword_info.search_volume", ">", 200],
        ],
        order_by: ["keyword_data.keyword_info.search_volume,desc"],
      }]
    );

    const items = data.tasks?.[0]?.result?.[0]?.items || [];
    console.log(`    → Found ${items.length} comparison keywords from ${domain}`);

    // Filter only software-related keywords
    const softwareSignals = [
      "vpn", "antivirus", "hosting", "crm", "erp", "saas", "app", "software",
      "tool", "platform", "ai", "cloud", "email", "marketing", "project management",
      "accounting", "pdf", "editor", "builder", "wordpress", "shopify", "slack",
      "zoom", "notion", "figma", "canva", "adobe", "office", "google", "microsoft",
      "aws", "github", "docker", "vpn", "password", "mailchimp", "hubspot",
      "salesforce", "quickbooks", "stripe", "paypal",
      // Common software brands
      "nordvpn", "expressvpn", "surfshark", "norton", "mcafee", "bitdefender",
      "bluehost", "godaddy", "hostinger", "siteground", "wix", "squarespace",
      "asana", "trello", "monday", "jira", "clickup", "todoist",
      "chatgpt", "claude", "gemini", "copilot", "midjourney", "grammarly",
      "mailchimp", "klaviyo", "hubspot", "freshbooks", "xero",
      "1password", "lastpass", "bitwarden", "dashlane",
      "obs", "loom", "vimeo", "twitch", "streamlabs",
    ];

    return items
      .filter((item: any) => {
        const kw = (item.keyword_data?.keyword || "").toLowerCase();
        return softwareSignals.some(s => kw.includes(s));
      })
      .map((item: any) => ({
        keyword: item.keyword_data?.keyword || "",
        search_volume: item.keyword_data?.keyword_info?.search_volume || 0,
        cpc: item.keyword_data?.keyword_info?.cpc || 0,
        competition: item.keyword_data?.keyword_info?.competition || 0,
        keyword_difficulty: 0,
        search_intent: "informational",
        opportunityScore: scoreKeyword({
          search_volume: item.keyword_data?.keyword_info?.search_volume || 0,
          cpc: item.keyword_data?.keyword_info?.cpc || 0,
          competition: item.keyword_data?.keyword_info?.competition || 0,
          keyword_difficulty: 0,
        }),
        subcategory: "competitor_discovery",
        source: `competitor_${domain}`,
      }));
  } catch (err: any) {
    console.error(`    ✗ Error: ${err.message}`);
    return [];
  }
}

// 4. Tavily: Trending software comparisons & market intelligence
async function discoverTrending(): Promise<{ topic: string; insights: string[] }[]> {
  console.log("\n[Tavily] Searching trending software comparisons...");

  const queries = [
    "best software comparisons 2026 trending",
    "most searched software vs 2026",
    "top affiliate software programs highest commission 2026",
    "best VPN affiliate programs 2026",
    "best hosting affiliate programs commission rates 2026",
    "best SaaS affiliate programs 2026",
    "software comparison website monetization strategy",
    "highest paying software affiliate niches 2026",
    "rising software tools 2026 alternatives",
    "best password manager comparison 2026",
    "best AI tools comparison 2026",
    "best project management software comparison 2026",
    "best CRM software comparison 2026",
    "best antivirus comparison 2026",
    "best website builder comparison 2026",
  ];

  const results: { topic: string; insights: string[] }[] = [];

  // Run in batches of 3 to avoid rate limits
  for (let i = 0; i < queries.length; i += 3) {
    const batch = queries.slice(i, i + 3);
    const batchResults = await Promise.all(
      batch.map(async (query) => {
        const res = await tavilySearch(query, 5);
        return {
          topic: query,
          insights: res.map(r => `[${r.title}] ${r.content.slice(0, 200)}`),
        };
      })
    );
    results.push(...batchResults.filter(r => r.insights.length > 0));
    console.log(`  → Batch ${Math.floor(i / 3) + 1}: ${batchResults.filter(r => r.insights.length > 0).length} results`);

    // Small delay between batches
    if (i + 3 < queries.length) await new Promise(r => setTimeout(r, 1000));
  }

  return results;
}

// 5. Tavily: Affiliate program research
async function researchAffiliatePrograms(): Promise<{ program: string; details: string }[]> {
  console.log("\n[Tavily] Researching affiliate programs...");

  const softwareCategories = [
    "VPN", "antivirus", "web hosting", "website builder",
    "email marketing", "CRM", "project management", "password manager",
    "cloud storage", "accounting software", "AI writing tools",
    "design tools", "video editing software", "ecommerce platform",
  ];

  const programs: { program: string; details: string }[] = [];

  for (let i = 0; i < softwareCategories.length; i += 3) {
    const batch = softwareCategories.slice(i, i + 3);
    const batchResults = await Promise.all(
      batch.map(async (cat) => {
        const res = await tavilySearch(`best ${cat} affiliate program commission rates 2026`, 3);
        return {
          program: cat,
          details: res.map(r => r.content.slice(0, 150)).join(" | "),
        };
      })
    );
    programs.push(...batchResults.filter(p => p.details.length > 0));
    if (i + 3 < softwareCategories.length) await new Promise(r => setTimeout(r, 1000));
  }

  return programs;
}

// 6. Apify: Scrape G2 and Capterra for software comparison URLs
async function scrapeCompetitorSitemaps(): Promise<{ domain: string; comparisons: string[] }[]> {
  console.log("\n[Apify] Scraping competitor sitemaps for software comparisons...");

  const results: { domain: string; comparisons: string[] }[] = [];

  // Use simple sitemap fetch (no Apify credits needed)
  for (const domain of ["g2.com", "versus.com"]) {
    console.log(`  Fetching sitemap: ${domain}`);
    try {
      const sitemapUrls = [
        `https://www.${domain}/sitemap.xml`,
        `https://${domain}/sitemap.xml`,
      ];

      let xmlText = "";
      for (const url of sitemapUrls) {
        try {
          const res = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; AVersusB/1.0)" },
            signal: AbortSignal.timeout(15000),
          });
          if (res.ok) {
            xmlText = await res.text();
            break;
          }
        } catch {}
      }

      if (!xmlText) {
        console.log(`    ✗ Could not fetch sitemap for ${domain}`);
        continue;
      }

      // Extract comparison URLs
      const locRegex = /<loc>\s*(.*?)\s*<\/loc>/gi;
      const urls: string[] = [];
      let match: RegExpExecArray | null;
      while ((match = locRegex.exec(xmlText)) !== null) {
        const url = match[1];
        if (url.includes("-vs-") || url.includes("/compare/")) {
          urls.push(url);
        }
      }

      // Filter for software-related
      const softwareTerms = [
        "vpn", "antivirus", "hosting", "crm", "erp", "software", "app",
        "tool", "cloud", "email", "marketing", "editor", "builder",
        "wordpress", "shopify", "slack", "zoom", "notion", "figma",
        "canva", "adobe", "github", "docker", "mailchimp", "hubspot",
        "salesforce", "quickbooks", "stripe", "ai", "chatgpt",
        "nord", "express", "surfshark", "norton", "mcafee", "bitdefender",
        "bluehost", "godaddy", "hostinger", "siteground", "wix",
        "squarespace", "asana", "trello", "monday", "jira",
        "1password", "lastpass", "bitwarden", "grammarly",
      ];

      const softwareUrls = urls.filter(url => {
        const lower = url.toLowerCase();
        return softwareTerms.some(t => lower.includes(t));
      });

      results.push({
        domain,
        comparisons: softwareUrls.slice(0, 200),
      });

      console.log(`    → ${domain}: ${urls.length} total comparisons, ${softwareUrls.length} software-related`);
    } catch (err: any) {
      console.log(`    ✗ Error: ${err.message}`);
    }
  }

  return results;
}

// 7. DataForSEO: SERP analysis for People Also Ask
async function getSERPInsights(keywords: string[]): Promise<{ keyword: string; paa: string[] }[]> {
  console.log("\n[DataForSEO] SERP analysis for People Also Ask...");

  const results: { keyword: string; paa: string[] }[] = [];

  // Pick top 10 keywords for SERP analysis
  const topKeywords = keywords.slice(0, 10);

  for (const kw of topKeywords) {
    try {
      const data: any = await dataforseoRequest(
        "/serp/google/organic/live/advanced",
        [{
          keyword: kw,
          location_code: 2840,
          language_code: "en",
          device: "desktop",
        }]
      );

      const items = data.tasks?.[0]?.result?.[0]?.items || [];
      const paaItems = items.filter((i: any) => i.type === "people_also_ask");
      const paaQuestions: string[] = [];

      for (const paa of paaItems) {
        if (paa.items) {
          for (const q of paa.items) {
            if (q.title) paaQuestions.push(q.title);
          }
        }
      }

      if (paaQuestions.length > 0) {
        results.push({ keyword: kw, paa: paaQuestions });
        console.log(`  "${kw}" → ${paaQuestions.length} PAA questions`);
      }
    } catch (err: any) {
      console.error(`  ✗ SERP error for "${kw}": ${err.message}`);
    }

    // Small delay
    await new Promise(r => setTimeout(r, 500));
  }

  return results;
}

// ============================================================
// Main Execution
// ============================================================

async function main() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  SOFTWARE VERTICAL RESEARCH — aversusb.net");
  console.log("  Date:", new Date().toISOString());
  console.log("═══════════════════════════════════════════════════════════════\n");

  const allKeywords: KeywordResult[] = [];
  const startTime = Date.now();

  // ── PHASE 1: DataForSEO Keyword Discovery ──────────────────
  console.log("━━━ PHASE 1: DataForSEO Keyword Discovery ━━━\n");

  // 1a. Keyword Ideas from all subcategory seed groups
  const subcategories = Object.entries(SOFTWARE_SUBCATEGORIES);
  for (const [subcat, seeds] of subcategories) {
    const results = await discoverKeywordIdeas(subcat, seeds);
    allKeywords.push(...results);
    // Small delay between API calls
    await new Promise(r => setTimeout(r, 500));
  }

  // 1b. High-value single seed expansions
  console.log("\n  [DataForSEO] Expanding high-value seeds...");
  const highValueSeeds = [
    { seed: "best vpn", subcat: "vpn_security" },
    { seed: "best antivirus", subcat: "vpn_security" },
    { seed: "best web hosting", subcat: "hosting" },
    { seed: "best website builder", subcat: "ecommerce" },
    { seed: "best project management software", subcat: "productivity" },
    { seed: "best crm software", subcat: "email_crm" },
    { seed: "best ai tools", subcat: "ai_tools" },
    { seed: "best password manager", subcat: "password_privacy" },
    { seed: "best email marketing software", subcat: "email_crm" },
    { seed: "best accounting software", subcat: "finance_software" },
  ];

  for (const { seed, subcat } of highValueSeeds) {
    const results = await discoverKeywordSuggestions(seed, subcat);
    allKeywords.push(...results);
    await new Promise(r => setTimeout(r, 500));
  }

  // 1c. Competitor reverse engineering
  console.log("\n  [DataForSEO] Reverse-engineering competitors...");
  for (const domain of SOFTWARE_COMPETITORS.slice(0, 4)) {
    const results = await discoverFromCompetitor(domain);
    allKeywords.push(...results);
    await new Promise(r => setTimeout(r, 1000));
  }

  // ── PHASE 2: Tavily Trending & Affiliate Research ──────────
  console.log("\n━━━ PHASE 2: Tavily Market Intelligence ━━━");

  const [trendingResults, affiliatePrograms] = await Promise.all([
    discoverTrending(),
    researchAffiliatePrograms(),
  ]);

  // ── PHASE 3: Competitor Sitemap Analysis ───────────────────
  console.log("\n━━━ PHASE 3: Competitor Sitemap Scraping ━━━");
  const competitorSitemaps = await scrapeCompetitorSitemaps();

  // ── PHASE 4: Deduplicate & Rank ────────────────────────────
  console.log("\n━━━ PHASE 4: Deduplication & Ranking ━━━");

  // Deduplicate by keyword
  const seen = new Map<string, KeywordResult>();
  for (const kw of allKeywords) {
    const key = kw.keyword.toLowerCase().trim();
    if (!seen.has(key) || (seen.get(key)!.opportunityScore < kw.opportunityScore)) {
      seen.set(key, kw);
    }
  }
  const uniqueKeywords = Array.from(seen.values());
  console.log(`  Total raw keywords: ${allKeywords.length}`);
  console.log(`  After dedup: ${uniqueKeywords.length}`);

  // Sort by opportunity score
  uniqueKeywords.sort((a, b) => b.opportunityScore - a.opportunityScore);

  // Filter comparison keywords (contain vs, compare, alternative, etc.)
  const comparisonKeywords = uniqueKeywords.filter(kw => {
    const lower = kw.keyword.toLowerCase();
    return lower.includes(" vs ") || lower.includes(" versus ") ||
           lower.includes("compared") || lower.includes("comparison") ||
           lower.includes("alternative") || lower.includes("difference between");
  });

  // Non-comparison but valuable (best X, top X, reviews)
  const informationalKeywords = uniqueKeywords.filter(kw => {
    const lower = kw.keyword.toLowerCase();
    return !comparisonKeywords.includes(kw) && (
      lower.includes("best ") || lower.includes("top ") ||
      lower.includes("review") || lower.includes("free ") ||
      lower.includes("cheap ") || lower.includes("pricing")
    );
  });

  // ── PHASE 5: SERP People Also Ask for top keywords ────────
  console.log("\n━━━ PHASE 5: SERP / People Also Ask Analysis ━━━");
  const topComparisonKWs = comparisonKeywords.slice(0, 10).map(k => k.keyword);
  const serpInsights = await getSERPInsights(topComparisonKWs);

  // ── PHASE 6: Generate Report ───────────────────────────────
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n━━━ PHASE 6: Generating Report (${elapsed}s elapsed) ━━━\n`);

  // Build report
  let report = `# Software Vertical Research Report — aversusb.net
## Generated: ${new Date().toISOString()}
## Research Duration: ${elapsed}s

---

## Executive Summary

- **Total unique keywords discovered:** ${uniqueKeywords.length}
- **Comparison keywords (vs/alternative):** ${comparisonKeywords.length}
- **Informational keywords (best/review):** ${informationalKeywords.length}
- **Competitor sitemaps analyzed:** ${competitorSitemaps.length}
- **Trending insights from Tavily:** ${trendingResults.length}
- **Affiliate programs researched:** ${affiliatePrograms.length}
- **SERP PAA questions found:** ${serpInsights.reduce((sum, s) => sum + s.paa.length, 0)}

---

## Top 100 Software Comparison Opportunities (by Opportunity Score)

| # | Keyword | Volume | CPC | Difficulty | Competition | Score | Subcategory | Intent |
|---|---------|--------|-----|------------|-------------|-------|-------------|--------|
`;

  for (let i = 0; i < Math.min(100, comparisonKeywords.length); i++) {
    const kw = comparisonKeywords[i];
    report += `| ${i + 1} | ${kw.keyword} | ${kw.search_volume.toLocaleString()} | $${kw.cpc.toFixed(2)} | ${kw.keyword_difficulty} | ${(kw.competition * 100).toFixed(0)}% | ${kw.opportunityScore} | ${kw.subcategory} | ${kw.search_intent} |\n`;
  }

  report += `\n---\n\n## Top 50 Informational Keywords (Blog Content Opportunities)\n\n`;
  report += `| # | Keyword | Volume | CPC | Difficulty | Score | Subcategory |\n`;
  report += `|---|---------|--------|-----|------------|-------|-------------|\n`;

  for (let i = 0; i < Math.min(50, informationalKeywords.length); i++) {
    const kw = informationalKeywords[i];
    report += `| ${i + 1} | ${kw.keyword} | ${kw.search_volume.toLocaleString()} | $${kw.cpc.toFixed(2)} | ${kw.keyword_difficulty} | ${kw.opportunityScore} | ${kw.subcategory} |\n`;
  }

  // Subcategory breakdown
  report += `\n---\n\n## Subcategory Breakdown\n\n`;
  const subcatStats = new Map<string, { count: number; totalVolume: number; avgCpc: number; avgScore: number }>();

  for (const kw of comparisonKeywords) {
    const stats = subcatStats.get(kw.subcategory) || { count: 0, totalVolume: 0, avgCpc: 0, avgScore: 0 };
    stats.count++;
    stats.totalVolume += kw.search_volume;
    stats.avgCpc += kw.cpc;
    stats.avgScore += kw.opportunityScore;
    subcatStats.set(kw.subcategory, stats);
  }

  report += `| Subcategory | # Keywords | Total Volume | Avg CPC | Avg Score | Priority |\n`;
  report += `|-------------|-----------|--------------|---------|-----------|----------|\n`;

  const sortedSubcats = Array.from(subcatStats.entries())
    .map(([name, stats]) => ({
      name,
      ...stats,
      avgCpc: stats.avgCpc / stats.count,
      avgScore: stats.avgScore / stats.count,
    }))
    .sort((a, b) => b.totalVolume - a.totalVolume);

  for (const subcat of sortedSubcats) {
    const priority = subcat.avgCpc > 3 ? "🔴 HIGH" : subcat.avgCpc > 1 ? "🟡 MEDIUM" : "🟢 ENTRY";
    report += `| ${subcat.name} | ${subcat.count} | ${subcat.totalVolume.toLocaleString()} | $${subcat.avgCpc.toFixed(2)} | ${subcat.avgScore.toFixed(1)} | ${priority} |\n`;
  }

  // People Also Ask
  if (serpInsights.length > 0) {
    report += `\n---\n\n## People Also Ask — FAQ & Content Ideas\n\n`;
    for (const serp of serpInsights) {
      report += `### "${serp.keyword}"\n`;
      for (const q of serp.paa) {
        report += `- ${q}\n`;
      }
      report += `\n`;
    }
  }

  // Competitor software comparisons
  report += `\n---\n\n## Competitor Software Comparisons Found\n\n`;
  for (const comp of competitorSitemaps) {
    report += `### ${comp.domain} (${comp.comparisons.length} software comparisons)\n\n`;
    for (const url of comp.comparisons.slice(0, 30)) {
      report += `- ${url}\n`;
    }
    if (comp.comparisons.length > 30) {
      report += `- ... and ${comp.comparisons.length - 30} more\n`;
    }
    report += `\n`;
  }

  // Affiliate programs
  report += `\n---\n\n## Affiliate Program Intelligence\n\n`;
  for (const prog of affiliatePrograms) {
    report += `### ${prog.program}\n${prog.details}\n\n`;
  }

  // Trending insights
  report += `\n---\n\n## Trending Software Comparisons (Tavily)\n\n`;
  for (const trend of trendingResults) {
    report += `### ${trend.topic}\n`;
    for (const insight of trend.insights.slice(0, 3)) {
      report += `- ${insight.slice(0, 250)}\n`;
    }
    report += `\n`;
  }

  // Recommended priority list for immediate content creation
  report += `\n---\n\n## RECOMMENDED: Top 30 Comparisons to Create First\n\n`;
  report += `These are selected based on: high volume + high CPC + medium-low difficulty + clear affiliate monetization path.\n\n`;

  const priorityComparisons = comparisonKeywords
    .filter(kw => kw.search_volume >= 500 && kw.cpc >= 0.5)
    .slice(0, 30);

  report += `| # | Comparison | Volume | CPC | Difficulty | Score | Monetization Path |\n`;
  report += `|---|-----------|--------|-----|------------|-------|-------------------|\n`;

  for (let i = 0; i < priorityComparisons.length; i++) {
    const kw = priorityComparisons[i];
    let monetization = "Display ads";
    if (kw.cpc >= 5) monetization = "High-value affiliate (direct partnerships)";
    else if (kw.cpc >= 2) monetization = "Premium affiliate programs";
    else if (kw.cpc >= 1) monetization = "Standard affiliate + display";
    else if (kw.cpc >= 0.5) monetization = "Affiliate links + AdSense";

    report += `| ${i + 1} | ${kw.keyword} | ${kw.search_volume.toLocaleString()} | $${kw.cpc.toFixed(2)} | ${kw.keyword_difficulty} | ${kw.opportunityScore} | ${monetization} |\n`;
  }

  // Save full JSON data
  report += `\n---\n\n## Raw Data\n\nFull keyword data saved to: \`scripts/software-research-data.json\`\n`;

  // Write report
  const reportPath = path.resolve(__dirname, "software-research-report.md");
  fs.writeFileSync(reportPath, report, "utf-8");
  console.log(`\n✓ Report saved to: ${reportPath}`);

  // Write raw data
  const dataPath = path.resolve(__dirname, "software-research-data.json");
  fs.writeFileSync(dataPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalKeywords: uniqueKeywords.length,
    comparisonKeywords: comparisonKeywords.slice(0, 500),
    informationalKeywords: informationalKeywords.slice(0, 200),
    serpInsights,
    competitorSitemaps,
    trendingResults,
    affiliatePrograms,
    subcategoryStats: sortedSubcats,
  }, null, 2), "utf-8");
  console.log(`✓ Raw data saved to: ${dataPath}`);

  // Summary
  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("  RESEARCH COMPLETE");
  console.log(`  Duration: ${elapsed}s`);
  console.log(`  Unique keywords: ${uniqueKeywords.length}`);
  console.log(`  Comparison opportunities: ${comparisonKeywords.length}`);
  console.log(`  Top CPC keyword: ${comparisonKeywords[0]?.keyword} ($${comparisonKeywords[0]?.cpc?.toFixed(2)})`);
  console.log(`  Top volume keyword: ${[...comparisonKeywords].sort((a, b) => b.search_volume - a.search_volume)[0]?.keyword} (${[...comparisonKeywords].sort((a, b) => b.search_volume - a.search_volume)[0]?.search_volume?.toLocaleString()})`);
  console.log("═══════════════════════════════════════════════════════════════");
}

main().catch(console.error);
