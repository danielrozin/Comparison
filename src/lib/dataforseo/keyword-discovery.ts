/**
 * Keyword Discovery Engine
 * Systematically discovers comparison opportunities using DataForSEO
 */

import {
  getKeywordSuggestions,
  getKeywordIdeas,
  getRelatedKeywords,
  getCompetitorDomains,
  getDomainKeywords,
  type KeywordSuggestion,
} from "./client";

// Comparison query patterns to search
const SEED_PATTERNS = [
  "{entity} vs",
  "{entity} versus",
  "{entity} compared to",
  "compare {entity}",
  "{entity} or",
  "difference between {entity}",
  "{entity} alternative",
  "alternatives to {entity}",
  "best alternative to {entity}",
];

const CATEGORY_SEEDS: Record<string, string[]> = {
  sports: [
    "messi vs ronaldo", "lebron vs jordan", "brady vs manning",
    "mcgregor vs khabib", "federer vs nadal", "ali vs tyson",
    "curry vs durant", "mahomes vs allen", "djokovic vs nadal",
    "nba player comparison", "nfl quarterback comparison",
  ],
  countries: [
    "usa vs china", "japan vs china", "india vs china",
    "germany vs france", "uk vs usa", "canada vs australia",
    "south korea vs japan", "brazil vs argentina", "india vs pakistan",
    "country comparison", "cost of living comparison",
  ],
  technology: [
    "iphone vs samsung", "mac vs windows", "android vs ios",
    "ps5 vs xbox", "nvidia vs amd", "chrome vs firefox",
    "chatgpt vs claude", "chatgpt vs gemini", "claude vs gemini",
    "midjourney vs stable diffusion", "cursor vs copilot",
    "ipad vs samsung tablet", "ring vs nest doorbell",
    "pixel vs iphone", "macbook air vs macbook pro",
    "sonos vs bose", "alexa vs google home", "fitbit vs apple watch",
    "thunderbolt vs usb c", "wifi 6 vs wifi 7", "oled vs qled",
    "m4 vs m3 chip", "copilot vs chatgpt", "perplexity vs google",
    "arc browser vs chrome", "notion ai vs chatgpt",
    "usb c vs lightning", "4k vs 8k tv", "led vs oled",
    "fiber vs cable internet", "starlink vs fiber",
    "raspberry pi vs arduino", "linux vs windows",
  ],
  products: [
    "nike vs adidas", "coca cola vs pepsi", "uber vs lyft",
    "airpods vs galaxy buds", "macbook vs dell xps",
    "dyson vs shark vacuum", "peloton vs nordictrack",
    "roomba vs roborock", "yeti vs hydroflask",
    "temu vs shein", "kindle vs kobo", "oura vs whoop",
    "sony wh1000xm5 vs airpods max", "bose qc45 vs sony wh1000xm5",
    "instant pot vs ninja foodi", "vitamix vs blendtec",
    "weber vs traeger grill", "breville vs delonghi espresso",
    "samsung frame tv vs lg gallery", "lg c4 vs samsung s95d",
    "garmin vs apple watch", "casper vs purple mattress",
    "tempur pedic vs casper", "brooklinen vs parachute",
    "allbirds vs on cloud", "hoka vs brooks", "new balance vs asics",
    "osprey vs deuter backpack", "stanley vs yeti tumbler",
    "ember mug vs yeti rambler", "sous vide vs air fryer",
    "nespresso vs keurig", "aeropress vs french press",
  ],
  health: [
    "keto vs paleo", "keto vs carnivore diet", "ozempic vs wegovy",
    "whey vs plant protein", "creatine vs pre workout",
    "peloton vs treadmill", "yoga vs pilates",
    "ozempic vs mounjaro", "vitamin d2 vs d3",
    "tylenol vs advil", "ibuprofen vs acetaminophen",
    "invisalign vs braces", "contacts vs glasses",
    "zoloft vs lexapro", "adderall vs vyvanse",
    "cbd vs thc", "meditation vs therapy",
    "running vs walking", "crossfit vs gym",
    "intermittent fasting vs calorie counting",
    "weight watchers vs noom", "hims vs keeps",
    "ashwagandha vs rhodiola", "magnesium glycinate vs citrate",
    "turmeric vs curcumin", "probiotics vs prebiotics",
    "collagen vs biotin", "melatonin vs valerian",
    "physical therapy vs chiropractor", "dermatologist vs esthetician",
    "cold plunge vs sauna", "pilates vs barre",
    "treadmill vs elliptical", "rowing machine vs bike",
    "whoop vs garmin", "myfitnesspal vs loseit",
  ],
  history: [
    "ww1 vs ww2", "roman empire vs ottoman empire",
    "cold war vs world war", "ancient greece vs ancient rome",
    "capitalism vs communism", "democracy vs republic",
  ],
  companies: [
    "google vs microsoft", "amazon vs walmart", "tesla vs ford",
    "apple vs samsung", "netflix vs disney plus",
    "openai vs anthropic", "tesla vs rivian", "rivian vs lucid",
    "zoom vs teams", "notion vs obsidian",
    "uber vs lyft", "stripe vs paypal",
  ],
  entertainment: [
    "netflix vs max", "spotify vs apple music", "marvel vs dc",
    "ps5 vs xbox", "nintendo switch vs steam deck",
    "disney plus vs hulu", "youtube tv vs hulu live",
    "tiktok vs instagram reels", "twitch vs youtube",
  ],
  brands: [
    "gucci vs louis vuitton", "toyota vs honda",
    "costco vs sams club", "target vs walmart",
    "home depot vs lowes", "starbucks vs dunkin",
    "lululemon vs athleta", "north face vs patagonia",
  ],
  automotive: [
    "tesla vs rivian", "bmw vs mercedes", "toyota vs honda",
    "ford vs chevy", "tesla model y vs model 3",
    "honda civic vs toyota corolla", "rav4 vs crv",
    "byd vs tesla", "toyota camry vs honda accord",
  ],
  finance: [
    "robinhood vs webull", "vanguard vs fidelity", "roth ira vs traditional ira",
    "etf vs mutual fund", "bitcoin vs ethereum", "coinbase vs binance",
    "visa vs mastercard", "venmo vs zelle", "schwab vs fidelity",
  ],
  software: [
    "notion vs obsidian", "slack vs teams", "figma vs sketch",
    "vscode vs intellij", "aws vs azure", "vercel vs netlify",
    "github vs gitlab", "jira vs linear", "1password vs bitwarden",
    "nordvpn vs expressvpn", "wix vs squarespace",
    "clickup vs asana", "monday vs asana", "trello vs notion",
    "zoom vs google meet", "canva vs figma", "airtable vs notion",
    "supabase vs firebase", "prisma vs drizzle", "next.js vs remix",
    "tailwind vs bootstrap", "react vs vue", "svelte vs react",
    "docker vs kubernetes", "terraform vs pulumi", "datadog vs grafana",
    "postman vs insomnia", "cursor vs windsurf", "replit vs codespaces",
    "claude vs gpt4", "llama vs mistral", "openai vs anthropic api",
    "stripe vs square", "shopify vs woocommerce", "webflow vs framer",
  ],
  education: [
    "online vs in person learning", "community college vs university",
    "sat vs act", "coursera vs udemy", "khan academy vs coursera",
    "mba vs masters", "ivy league comparison",
    "harvard vs stanford", "mit vs caltech",
    "bachelor vs associate degree", "phd vs masters",
    "public vs private school", "charter vs public school",
    "ged vs diploma", "ap vs ib", "duolingo vs rosetta stone",
    "skillshare vs masterclass", "bootcamp vs degree",
  ],
  military: [
    "us military vs china military", "army vs marines",
    "navy vs air force", "f-35 vs f-22", "nato vs russia",
    "aircraft carrier comparison", "nuclear submarine comparison",
  ],
  economy: [
    "gdp vs gnp", "inflation vs deflation", "recession vs depression",
    "stocks vs bonds", "s&p 500 vs nasdaq", "us economy vs china economy",
    "socialism vs capitalism", "free trade vs protectionism",
  ],
  celebrities: [
    "taylor swift vs beyonce", "drake vs kendrick lamar",
    "elon musk vs jeff bezos", "mark zuckerberg vs elon musk",
    "joe rogan vs lex fridman", "mr beast vs pewdiepie",
  ],
  travel: [
    "bali vs thailand", "paris vs london", "tokyo vs seoul",
    "hawaii vs caribbean", "airbnb vs hotel", "europe vs asia travel",
    "new york vs los angeles", "dubai vs singapore",
    "delta vs united", "southwest vs spirit", "american airlines vs delta",
    "cancun vs punta cana", "costa rica vs mexico",
    "greece vs italy", "spain vs portugal", "japan vs korea travel",
    "all inclusive vs resort", "cruise vs resort",
    "global entry vs tsa precheck", "carry on vs checked bag",
  ],
  food_and_drink: [
    "chipotle vs qdoba", "mcdonalds vs burger king", "chick fil a vs popeyes",
    "starbucks vs dunkin", "dominos vs pizza hut",
    "coke vs pepsi", "almond milk vs oat milk",
    "white rice vs brown rice", "butter vs margarine",
    "olive oil vs avocado oil", "whey protein vs casein",
    "instant pot vs crock pot", "air fryer vs oven",
    "whole foods vs trader joes", "aldi vs lidl",
    "keto vs mediterranean diet", "vegan vs vegetarian",
    "wine vs beer", "bourbon vs whiskey", "latte vs cappuccino",
  ],
  gaming: [
    "ps5 vs xbox series x", "nintendo switch vs steam deck",
    "pc gaming vs console", "xbox game pass vs ps plus",
    "fortnite vs apex legends", "minecraft vs roblox",
    "call of duty vs battlefield", "gta vs saints row",
    "elden ring vs dark souls", "zelda vs genshin impact",
    "amd vs nvidia gpu", "gaming laptop vs desktop",
    "oculus quest vs psvr", "twitch vs youtube gaming",
    "mechanical keyboard vs membrane", "wired vs wireless mouse",
    "4k vs 1440p gaming", "144hz vs 240hz monitor",
    "steam vs epic games", "discord vs teamspeak",
  ],
};

// Known competitor domains for comparison content
const COMPETITOR_DOMAINS = [
  "versus.com",
  "diffen.com",
  "comparably.com",
  "countryeconomy.com",
  "nationmaster.com",
  "similarweb.com",
  "g2.com",
  "capterra.com",
  "trustradius.com",
];

export interface DiscoveredOpportunity {
  keyword: string;
  searchVolume: number;
  cpc: number;
  competition: number;
  difficulty: number;
  intent: string;
  entityA: string | null;
  entityB: string | null;
  queryPattern: string | null;
  category: string | null;
  opportunityScore: number;
  source: string;
}

/**
 * Parse a comparison keyword into its components
 */
function parseComparisonKeyword(keyword: string): {
  entityA: string | null;
  entityB: string | null;
  queryPattern: string | null;
} {
  const lower = keyword.toLowerCase().trim();

  // "A vs B" or "A versus B"
  const vsMatch = lower.match(/^(.+?)\s+(?:vs\.?|versus)\s+(.+)$/);
  if (vsMatch) {
    return { entityA: vsMatch[1].trim(), entityB: vsMatch[2].trim(), queryPattern: "vs" };
  }

  // "A compared to B"
  const comparedMatch = lower.match(/^(.+?)\s+compared\s+to\s+(.+)$/);
  if (comparedMatch) {
    return { entityA: comparedMatch[1].trim(), entityB: comparedMatch[2].trim(), queryPattern: "compare" };
  }

  // "compare A to/and B"
  const compareMatch = lower.match(/^compare\s+(.+?)\s+(?:to|and|with)\s+(.+)$/);
  if (compareMatch) {
    return { entityA: compareMatch[1].trim(), entityB: compareMatch[2].trim(), queryPattern: "compare" };
  }

  // "difference between A and B"
  const diffMatch = lower.match(/^difference\s+between\s+(.+?)\s+and\s+(.+)$/);
  if (diffMatch) {
    return { entityA: diffMatch[1].trim(), entityB: diffMatch[2].trim(), queryPattern: "difference" };
  }

  // "A or B"
  const orMatch = lower.match(/^(.+?)\s+or\s+(.+)$/);
  if (orMatch) {
    return { entityA: orMatch[1].trim(), entityB: orMatch[2].trim(), queryPattern: "or" };
  }

  // "alternatives to A" or "A alternatives"
  const altMatch = lower.match(/^(?:alternatives?\s+to|best\s+alternatives?\s+to)\s+(.+)$/);
  if (altMatch) {
    return { entityA: altMatch[1].trim(), entityB: null, queryPattern: "alternative" };
  }
  const altMatch2 = lower.match(/^(.+?)\s+alternatives?$/);
  if (altMatch2) {
    return { entityA: altMatch2[1].trim(), entityB: null, queryPattern: "alternative" };
  }

  return { entityA: null, entityB: null, queryPattern: null };
}

/**
 * Score an opportunity based on multiple factors
 */
function scoreOpportunity(kw: KeywordSuggestion): number {
  let score = 0;

  // Volume is king (log scale to not over-weight massive keywords)
  score += Math.log10(Math.max(kw.search_volume, 1)) * 20;

  // Lower difficulty = higher opportunity (increased weight from 0.3 to 0.6)
  score += Math.max(0, 100 - kw.keyword_difficulty) * 0.6;

  // Penalize very high difficulty keywords (>70) — hard to rank for newer sites
  if (kw.keyword_difficulty > 70) {
    score -= (kw.keyword_difficulty - 70) * 0.5;
  }

  // CPC indicates commercial value
  score += Math.min(kw.cpc * 5, 25);

  // Lower competition = easier to rank
  score += (1 - kw.competition) * 15;

  return Math.round(score * 100) / 100;
}

/**
 * Discover keywords by category
 */
export async function discoverByCategory(
  category: string
): Promise<DiscoveredOpportunity[]> {
  const seeds = CATEGORY_SEEDS[category];
  if (!seeds) return [];

  const results: DiscoveredOpportunity[] = [];

  // Get keyword ideas from all seeds
  const ideas = await getKeywordIdeas(seeds);

  for (const kw of ideas) {
    const parsed = parseComparisonKeyword(kw.keyword);
    results.push({
      keyword: kw.keyword,
      searchVolume: kw.search_volume,
      cpc: kw.cpc,
      competition: kw.competition,
      difficulty: kw.keyword_difficulty,
      intent: kw.search_intent,
      entityA: parsed.entityA,
      entityB: parsed.entityB,
      queryPattern: parsed.queryPattern,
      category,
      opportunityScore: scoreOpportunity(kw),
      source: "dataforseo_ideas",
    });
  }

  return results.sort((a, b) => b.opportunityScore - a.opportunityScore);
}

/**
 * Discover keywords by expanding a seed entity
 */
export async function discoverByEntity(
  entity: string,
  category?: string
): Promise<DiscoveredOpportunity[]> {
  const seeds = SEED_PATTERNS.map((p) => p.replace("{entity}", entity));
  const results: DiscoveredOpportunity[] = [];

  // Get suggestions for each pattern
  const suggestions = await getKeywordSuggestions(`${entity} vs`, undefined, undefined, 50);
  const related = await getRelatedKeywords(`${entity} vs`, undefined, undefined, 50);

  const allKeywords = [...suggestions, ...related];

  for (const kw of allKeywords) {
    const parsed = parseComparisonKeyword(kw.keyword);
    results.push({
      keyword: kw.keyword,
      searchVolume: kw.search_volume,
      cpc: kw.cpc,
      competition: kw.competition,
      difficulty: kw.keyword_difficulty,
      intent: kw.search_intent,
      entityA: parsed.entityA,
      entityB: parsed.entityB,
      queryPattern: parsed.queryPattern,
      category: category || null,
      opportunityScore: scoreOpportunity(kw),
      source: "dataforseo_entity_expansion",
    });
  }

  return results.sort((a, b) => b.opportunityScore - a.opportunityScore);
}

/**
 * Discover keywords from competitor domains
 */
export async function discoverFromCompetitors(): Promise<DiscoveredOpportunity[]> {
  const results: DiscoveredOpportunity[] = [];

  for (const domain of COMPETITOR_DOMAINS) {
    try {
      const keywords = await getDomainKeywords(domain, undefined, undefined, undefined, 50);

      for (const kw of keywords) {
        const parsed = parseComparisonKeyword(kw.keyword);
        results.push({
          keyword: kw.keyword,
          searchVolume: kw.searchVolume,
          cpc: 0,
          competition: 0,
          difficulty: 0,
          intent: "informational",
          entityA: parsed.entityA,
          entityB: parsed.entityB,
          queryPattern: parsed.queryPattern,
          category: null,
          opportunityScore: kw.searchVolume > 0 ? Math.log10(kw.searchVolume) * 20 : 0,
          source: `competitor_${domain}`,
        });
      }
    } catch {
      console.error(`Failed to scan competitor: ${domain}`);
    }
  }

  return results.sort((a, b) => b.opportunityScore - a.opportunityScore);
}

/**
 * Find competing domains for our target keywords
 */
export async function findCompetitorDomains(
  category: string
): Promise<{
  domain: string;
  avgPosition: number;
  intersections: number;
  organicCount: number;
}[]> {
  const seeds = CATEGORY_SEEDS[category];
  if (!seeds) return [];

  return getCompetitorDomains(seeds);
}

export { parseComparisonKeyword, scoreOpportunity, CATEGORY_SEEDS, COMPETITOR_DOMAINS };
