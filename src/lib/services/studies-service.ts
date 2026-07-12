/**
 * Studies Service
 * Powers data-study / "link-bait" pages built from the comparison database.
 * Aggregates which brands and matchups get compared most across the site.
 *
 * Uses Prisma when DATABASE_URL is set; falls back to a baked-in snapshot
 * (last refreshed manually) so the public study page is never empty — this
 * matters because the page exists to earn citations and inbound links.
 */

import { SOFTWARE_SUBCATEGORIES } from "@/lib/utils/constants";
import {
  canonicalSlug,
  canonicalName,
  canonicalMembers,
  rivalryKey,
  CONSUMER_MEDIA_SLUGS,
} from "@/lib/services/entity-aliases";

// Lazy-import prisma to avoid crashing when DATABASE_URL is not set.
function getPrismaClient() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getPrisma } = require("@/lib/db/prisma");
    return getPrisma();
  } catch {
    return null;
  }
}

export interface StudyBrand {
  /**
   * Competition rank — tied entities share a rank (1, 1, 1, 4, …). The corpus
   * has no stable outright leader, and a dense 1,2,3 ranking would invent one
   * (DAN-2047/DAN-2059).
   */
  rank: number;
  name: string;
  slug: string;
  type: string;
  /**
   * Number of DISTINCT RIVALS — how many other entities this one is matched
   * against, after reverse-duplicate pages and alias entities are collapsed.
   *
   * This is not a page count. Netflix appears on 9 published pages but has 5
   * distinct rivals, because `disney-plus-vs-netflix` / `netflix-vs-disney` are
   * one rivalry and `netflix-inc` is the same entity as `netflix`. Publishing
   * the page count as a rivalry count is what put a false "#1 most-compared
   * brand" on the study (DAN-2047).
   */
  count: number;
}

/** How many entities have exactly N distinct rivals — the shape of the corpus. */
export interface RivalBucket {
  rivals: number;
  entities: number;
}

export interface StudyMatchup {
  rank: number;
  title: string;
  slug: string;
  category: string;
  /**
   * Comparison centrality — the combined number of published comparisons the
   * matchup's two entities appear in. A high score means the pair sits at the
   * centre of a wide web of buyer research.
   *
   * This deliberately replaces `viewCount`. `comparisons.view_count` is NOT a
   * page-view analytic: static /compare/ pages never increment it (only the
   * /api/v1 JSON endpoint does), and the handful of non-zero values are seed
   * data from the initial 2026-03-19 import. Publishing it as "reads" put
   * invented traffic figures on a page titled "Data Study" (DAN-2037).
   */
  centrality: number;
}

export interface StudyCategory {
  category: string;
  label: string;
  count: number;
}

export interface MostComparedStudy {
  /** Published comparison PAGES. Not the number of distinct matchups. */
  totalComparisons: number;
  /** Head-to-head pages, after the multi-way pages are set aside. */
  headToHeadPages: number;
  /** Pages comparing 3+ entities. Counted separately — they are not head-to-head. */
  multiWayPages: number;
  /** Distinct head-to-head matchups, after reverse-duplicate + alias collapse. */
  distinctRivalries: number;
  /** Distinct canonical entities, after alias collapse. */
  distinctBrands: number;
  /** Entity rows before alias collapse — the difference is the alias inflation. */
  rawEntityRows: number;
  topBrands: StudyBrand[];
  topSaaS: StudyBrand[];
  topMatchups: StudyMatchup[];
  categories: StudyCategory[];
  /** Distribution of distinct-rival counts across brand entities. */
  rivalSpread: RivalBucket[];
  /** ISO timestamp of when the underlying data was read. */
  updatedAt: string;
  /** true when served from the baked-in snapshot rather than a live query. */
  fromSnapshot: boolean;
}

// Entity types that count as a "brand" for the headline ranking.
// Country economies, people, and historical entities are intentionally excluded.
// The taxonomy carries both singular and plural forms of the same type
// ("product" 85 entities / "products" 137), and streaming services are split
// across `streaming`, `entertainment` and `software` — so all of these have to
// be listed or whole classes of brand silently miss the leaderboard (DAN-2047).
const BRAND_TYPES = [
  "company", "brand", "product", "products", "software", "technology",
  "platform", "streaming", "entertainment", "team",
];

const CATEGORY_LABELS: Record<string, string> = {
  software: "B2B SaaS & Software",
  technology: "Consumer Technology",
  products: "Consumer Products",
  economy: "Economy & Finance",
  sports: "Sports",
  automotive: "Automotive",
  companies: "Companies",
  entertainment: "Entertainment",
  finance: "Finance",
  health: "Health",
  gaming: "Gaming",
  countries: "Countries",
  education: "Education",
  military: "Military",
  history: "History",
  brands: "Brands",
};

function labelFor(category: string): string {
  return (
    CATEGORY_LABELS[category] ||
    category.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

/**
 * Baked-in snapshot — refreshed 2026-07-12 from the production Neon DB:
 * 491 published comparison pages (483 head-to-head + 8 three-way), which
 * collapse to 442 distinct rivalries across 666 canonical entities.
 * Used only when a live query is unavailable so the page always renders.
 * Keep in sync with the live corpus: a stale snapshot here is what let the
 * /studies/ index overstate the dataset by up to 11x (DAN-2037). Regenerate
 * with `npx tsx --env-file=.env.local scripts/dan2037-snapshot.ts`.
 */
const SNAPSHOT: MostComparedStudy = {
  totalComparisons: 491,
  headToHeadPages: 483,
  multiWayPages: 8,
  distinctRivalries: 442,
  distinctBrands: 666,
  rawEntityRows: 704,
  updatedAt: "2026-07-12T00:00:00.000Z",
  fromSnapshot: true,
  topBrands: [
    { rank: 1, name: "Xbox Series X", slug: "xbox-series-x", type: "product", count: 6 },
    { rank: 2, name: "Disney+", slug: "disney", type: "software", count: 5 },
    { rank: 2, name: "Mailchimp", slug: "mailchimp", type: "software", count: 5 },
    { rank: 2, name: "Netflix", slug: "netflix", type: "company", count: 5 },
    { rank: 2, name: "Samsung", slug: "samsung-electronics", type: "brand", count: 5 },
    { rank: 2, name: "Spotify", slug: "spotify", type: "software", count: 5 },
    { rank: 2, name: "Squarespace", slug: "squarespace", type: "software", count: 5 },
    { rank: 2, name: "YouTube Music", slug: "youtube-music", type: "entertainment", count: 5 },
    { rank: 9, name: "1Password", slug: "1password", type: "software", count: 4 },
    { rank: 9, name: "Amazon", slug: "amazon", type: "company", count: 4 },
    { rank: 9, name: "Booking.com", slug: "booking-com", type: "company", count: 4 },
    { rank: 9, name: "Expedia", slug: "expedia", type: "platform", count: 4 },
    { rank: 9, name: "Ford", slug: "ford-motor-company", type: "company", count: 4 },
    { rank: 9, name: "Geico", slug: "geico", type: "products", count: 4 },
    { rank: 9, name: "Hulu", slug: "hulu", type: "company", count: 4 },
  ],
  topSaaS: [
    { rank: 1, name: "Mailchimp", slug: "mailchimp", type: "software", count: 5 },
    { rank: 1, name: "Squarespace", slug: "squarespace", type: "software", count: 5 },
    { rank: 3, name: "1Password", slug: "1password", type: "software", count: 4 },
    { rank: 3, name: "Microsoft Teams", slug: "microsoft-teams", type: "software", count: 4 },
    { rank: 3, name: "Notion", slug: "notion", type: "software", count: 4 },
    { rank: 3, name: "Zoom", slug: "zoom", type: "software", count: 4 },
    { rank: 7, name: "ClickUp", slug: "clickup", type: "software", count: 3 },
    { rank: 7, name: "Google Drive", slug: "google-drive", type: "software", count: 3 },
    { rank: 7, name: "Jira", slug: "jira", type: "software", count: 3 },
    { rank: 7, name: "Klaviyo", slug: "klaviyo", type: "software", count: 3 },
    { rank: 7, name: "QuickBooks Online", slug: "quickbooks-online", type: "software", count: 3 },
    { rank: 12, name: "Brave", slug: "brave", type: "software", count: 2 },
  ],
  topMatchups: [
    { rank: 1, title: "Netflix vs Disney Plus", slug: "disney-plus-vs-netflix", category: "companies", centrality: 10 },
    { rank: 2, title: "Spotify vs YouTube Music", slug: "spotify-vs-youtube-music", category: "entertainment", centrality: 10 },
    { rank: 3, title: "Disney+ vs Hulu", slug: "disney-plus-vs-hulu", category: "entertainment", centrality: 9 },
    { rank: 4, title: "Netflix vs Hulu", slug: "netflix-vs-hulu", category: "entertainment", centrality: 9 },
    { rank: 5, title: "PlayStation 5 vs Xbox Series X", slug: "playstation-5-vs-xbox-series-x", category: "entertainment", centrality: 9 },
    { rank: 6, title: "Steam Deck vs Xbox Series X", slug: "steam-deck-vs-xbox-series-x", category: "gaming", centrality: 9 },
    { rank: 7, title: "Booking.com vs Expedia", slug: "booking-com-vs-expedia", category: "software", centrality: 8 },
    { rank: 8, title: "Disney+ vs HBO Max", slug: "disney-vs-hbo-max", category: "entertainment", centrality: 8 },
    { rank: 9, title: "State Farm vs Geico", slug: "geico-vs-state-farm", category: "insurance", centrality: 8 },
    { rank: 10, title: "HBO Max vs Netflix", slug: "hbo-max-vs-netflix", category: "entertainment", centrality: 8 },
  ],
  categories: [
    { category: "products", label: "Consumer Products", count: 109 },
    { category: "software", label: "B2B SaaS & Software", count: 96 },
    { category: "technology", label: "Consumer Technology", count: 46 },
    { category: "entertainment", label: "Entertainment", count: 40 },
    { category: "sports", label: "Sports", count: 32 },
    { category: "automotive", label: "Automotive", count: 32 },
    { category: "companies", label: "Companies", count: 19 },
    { category: "travel", label: "Travel", count: 15 },
    { category: "food_and_drink", label: "Food And Drink", count: 14 },
    { category: "finance", label: "Finance", count: 13 },
  ],
  rivalSpread: [
    { rivals: 1, entities: 379 },
    { rivals: 2, entities: 76 },
    { rivals: 3, entities: 24 },
    { rivals: 4, entities: 13 },
    { rivals: 5, entities: 7 },
    { rivals: 6, entities: 1 },
  ],
};

/**
 * Collapses comparisons that cover the same entity pairing, keeping the most
 * central one. Ties break on slug so the ranking is stable between builds.
 * Keyed on `rivalryKey`, so both reverse-duplicate slugs and alias entities
 * collapse ("us-vs-china-gdp" / "chinese-vs-us-economy" are one rivalry, and so
 * are "netflix-vs-hulu" and a page built on the `netflix-inc` entity row).
 */
function dedupeMatchups<T extends { slug: string; centrality: number; members: string[] }>(
  rows: T[]
): T[] {
  const best = new Map<string, T>();
  for (const r of rows) {
    const key = rivalryKey(r.members);
    const cur = best.get(key);
    if (!cur || r.centrality > cur.centrality || (r.centrality === cur.centrality && r.slug < cur.slug)) {
      best.set(key, r);
    }
  }
  return [...best.values()].sort(
    (a, b) => b.centrality - a.centrality || a.slug.localeCompare(b.slug)
  );
}

/**
 * Competition ranking: equal scores share a rank and the next rank skips
 * (1, 1, 1, 4). Dense 1-2-3 ranking would present a tie as an outright winner,
 * which is exactly how "Netflix — most-compared brand" got published.
 */
function competitionRank<T extends { count: number }>(rows: T[]): (T & { rank: number })[] {
  return rows.map((r, i) => {
    let rank = i + 1;
    for (let j = 0; j < i; j++) {
      if (rows[j].count === r.count) {
        rank = j + 1;
        break;
      }
    }
    return { ...r, rank };
  });
}

/** One (comparison, entity) pair for every published comparison. */
interface PairRow {
  cslug: string;
  ctitle: string;
  ccategory: string | null;
  name: string;
  eslug: string;
  type: string | null;
}

/** A comparison page, with its entities resolved to canonical slugs. */
interface CanonPage {
  slug: string;
  title: string;
  category: string;
  members: string[];
}

interface RivalryGraph {
  /** Canonical slug -> display name + type. */
  entities: Map<string, { name: string; type: string | null }>;
  pages: CanonPage[];
  headToHead: CanonPage[];
  multiWayPages: number;
  /** rivalryKey -> the two canonical entities. One entry per distinct matchup. */
  rivalries: Map<string, string[]>;
  /** Canonical slug -> the distinct entities it is matched against. */
  rivalsOf: Map<string, Set<string>>;
  /** Distinct entity slugs seen BEFORE alias collapse. */
  rawEntityRows: number;
}

/**
 * Builds the rivalry graph every study ranking is derived from.
 *
 * The three studies all used to count comparison PAGES per entity, which
 * double-counts a rivalry published under two slugs and triple-counts an entity
 * that exists under two rows. This collapses both before anything is counted,
 * so "how many rivals does X have" is answered from distinct matchups
 * (DAN-2047).
 */
function buildRivalryGraph(rows: PairRow[]): RivalryGraph {
  const entities = new Map<string, { name: string; type: string | null }>();
  const comps = new Map<string, { title: string; category: string | null; members: string[] }>();

  for (const r of rows) {
    const slug = canonicalSlug(r.eslug);
    const existing = entities.get(slug);
    // Prefer the canonical row's own metadata over an alias row's.
    if (!existing || slug === r.eslug) {
      entities.set(slug, { name: canonicalName(slug, r.name), type: r.type });
    }
    const c = comps.get(r.cslug) || { title: r.ctitle, category: r.ccategory, members: [] };
    c.members.push(slug);
    comps.set(r.cslug, c);
  }

  const pages: CanonPage[] = [...comps.entries()].map(([slug, c]) => ({
    slug,
    title: c.title,
    category: c.category || "general",
    members: canonicalMembers(c.members),
  }));

  // A 3-way page is not a head-to-head matchup and must not be counted as one.
  const headToHead = pages.filter((p) => p.members.length === 2);

  const rivalries = new Map<string, string[]>();
  for (const p of headToHead) rivalries.set(rivalryKey(p.members), p.members);

  const rivalsOf = new Map<string, Set<string>>();
  for (const members of rivalries.values()) {
    for (const m of members) {
      const set = rivalsOf.get(m) || new Set<string>();
      for (const other of members) if (other !== m) set.add(other);
      rivalsOf.set(m, set);
    }
  }

  return {
    entities,
    pages,
    headToHead,
    multiWayPages: pages.length - headToHead.length,
    rivalries,
    rivalsOf,
    rawEntityRows: new Set(rows.map((r) => r.eslug)).size,
  };
}

/** Entities ranked by distinct-rival count, highest first, stable on slug. */
function rankByRivals(g: RivalryGraph) {
  return [...g.rivalsOf.entries()]
    .map(([slug, rivals]) => ({
      slug,
      name: g.entities.get(slug)?.name ?? slug,
      type: g.entities.get(slug)?.type ?? "brand",
      count: rivals.size,
    }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

/**
 * Returns the "Most-Compared Brands of 2026" study dataset.
 * Live query when the DB is reachable, otherwise the baked-in snapshot.
 */
export async function getMostComparedStudy(): Promise<MostComparedStudy> {
  const prisma = getPrismaClient();
  if (!prisma) return SNAPSHOT;

  try {
    const [totalComparisons, pairs] = await Promise.all([
      prisma.comparison.count({ where: { status: "published" } }),
      prisma.$queryRaw<PairRow[]>`
        SELECT c.slug AS cslug, c.title AS ctitle, c.category AS ccategory,
               e.name, e.slug AS eslug, et.slug AS type
        FROM comparison_entities ce
        JOIN comparisons c ON c.id = ce.comparison_id AND c.status = 'published'
        JOIN entities e ON e.id = ce.entity_id
        LEFT JOIN entity_types et ON et.id = e.entity_type_id`,
    ]);

    const rows = pairs as PairRow[];
    if (rows.length === 0 || totalComparisons === 0) return SNAPSHOT;

    const g = buildRivalryGraph(rows);
    const { entities, headToHead, multiWayPages, rivalries, rivalsOf } = g;

    const isBrand = (slug: string) =>
      BRAND_TYPES.includes((entities.get(slug)?.type || "").toLowerCase());

    const scoredEntities = rankByRivals(g);

    const topBrands: StudyBrand[] = competitionRank(
      scoredEntities.filter((e) => isBrand(e.slug)).slice(0, 15)
    ).map((e) => ({ rank: e.rank, name: e.name, slug: e.slug, type: e.type || "brand", count: e.count }));

    // B2B SaaS list: software-typed, minus consumer streaming services. `disney`
    // is typed `software` in the entity table, which is why Disney+ was ranked
    // as a B2B SaaS tool next to Notion and Zoom (DAN-2047).
    const topSaaS: StudyBrand[] = competitionRank(
      scoredEntities
        .filter(
          (e) =>
            (e.type || "").toLowerCase() === "software" &&
            !CONSUMER_MEDIA_SLUGS.has(e.slug)
        )
        .slice(0, 12)
    ).map((e) => ({ rank: e.rank, name: e.name, slug: e.slug, type: "software", count: e.count }));

    // How many brands sit at each distinct-rival count. This is the claim that
    // survives every dedup rule — unlike a #1, which does not (DAN-2059).
    const spread = new Map<number, number>();
    for (const e of scoredEntities) {
      if (!isBrand(e.slug)) continue;
      spread.set(e.count, (spread.get(e.count) || 0) + 1);
    }
    const rivalSpread: RivalBucket[] = [...spread.entries()]
      .map(([rivals, count]) => ({ rivals, entities: count }))
      .sort((a, b) => a.rivals - b.rivals);

    // Centrality — how connected a matchup's two sides are across the dataset,
    // measured in distinct rivals, not pages.
    const scored = headToHead.map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
      members: p.members,
      centrality: p.members.reduce((sum, m) => sum + (rivalsOf.get(m)?.size ?? 0), 0),
    }));

    const topMatchups: StudyMatchup[] = dedupeMatchups(scored)
      .slice(0, 10)
      .map((m, i) => ({
        rank: i + 1,
        title: m.title,
        slug: m.slug,
        category: m.category,
        centrality: m.centrality,
      }));

    // Category counts are page counts — they describe the catalog, not rivalries.
    const catCount = new Map<string, number>();
    for (const p of g.pages) {
      catCount.set(p.category, (catCount.get(p.category) || 0) + 1);
    }
    const categories: StudyCategory[] = [...catCount.entries()]
      .map(([category, count]) => ({ category, label: labelFor(category), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Guard against an empty DB returning a hollow study.
    if (topBrands.length === 0) return SNAPSHOT;

    return {
      totalComparisons,
      headToHeadPages: headToHead.length,
      multiWayPages,
      distinctRivalries: rivalries.size,
      distinctBrands: entities.size,
      rawEntityRows: g.rawEntityRows,
      topBrands,
      topSaaS,
      topMatchups,
      categories,
      rivalSpread,
      updatedAt: new Date().toISOString(),
      fromSnapshot: false,
    };
  } catch (e) {
    console.warn("getMostComparedStudy: live query failed, using snapshot:", e);
    return SNAPSHOT;
  }
}

// ============================================================
// Study #2 — "The B2B SaaS Comparison Report 2026"
// A per-vertical cut of the software category (our deepest dataset).
// ============================================================

export interface SaaSTool {
  /** Competition rank — ties share a rank. See StudyBrand.rank. */
  rank: number;
  name: string;
  slug: string;
  /** Distinct rivals, not comparison pages. See StudyBrand.count. */
  count: number;
}

export interface SaaSCategoryCluster {
  /** Subcategory slug (matches /category/software/<slug>). */
  slug: string;
  label: string;
  icon: string;
  /** Number of software comparisons that fall in this cluster. */
  count: number;
  /** The marquee rivalry inside the cluster (by comparison centrality). */
  topMatchup: { title: string; slug: string } | null;
}

export interface ChallengerPair {
  challenger: string;
  challengerSlug: string;
  challengerCount: number;
  incumbent: string;
  incumbentSlug: string;
  incumbentCount: number;
  /** Human label for the category they compete in. */
  category: string;
}

export interface B2BSaaSStudy {
  /** Published comparisons in the software vertical. */
  totalSaaSComparisons: number;
  /** Distinct SaaS tools (software entities, excluding programming languages). */
  distinctTools: number;
  topTools: SaaSTool[];
  clusters: SaaSCategoryCluster[];
  challengers: ChallengerPair[];
  updatedAt: string;
  fromSnapshot: boolean;
}

// Software-typed entities that are programming languages / frameworks rather
// than B2B SaaS products — excluded from the "tools" leaderboard so the study
// reads as a software-buyer report, not a developer-language ranking.
const NON_SAAS_SLUGS = new Set([
  "typescript", "python", "next-js", "go-golang", "java", "javascript",
  "react", "rust", "kotlin", "node-js", "nodejs", "angular", "vue", "svelte",
  "php", "ruby", "swift", "scala", "c", "c-plus-plus", "cpp", "perl",
  "html", "css", "sql", "dart", "elixir", "haskell", "r",
]);

// Curated "challenger vs incumbent" candidates: a newer entrant paired with the
// established player it competes against. We only surface a pair when the
// challenger actually out-appears the incumbent in our comparison data, so the
// "challenger is winning the comparison battle" framing is data-backed.
interface ChallengerCandidate {
  challenger: { name: string; slug: string };
  incumbent: { name: string; slug: string };
  category: string;
}

const CHALLENGER_CANDIDATES: ChallengerCandidate[] = [
  { challenger: { name: "HubSpot", slug: "hubspot" }, incumbent: { name: "Salesforce", slug: "salesforce" }, category: "CRM" },
  { challenger: { name: "ClickUp", slug: "clickup" }, incumbent: { name: "Jira", slug: "jira" }, category: "Project management" },
  { challenger: { name: "Wix", slug: "wix" }, incumbent: { name: "WordPress", slug: "wordpress" }, category: "Website builders" },
  { challenger: { name: "Notion", slug: "notion" }, incumbent: { name: "Confluence", slug: "confluence" }, category: "Docs & wikis" },
  { challenger: { name: "Bitwarden", slug: "bitwarden" }, incumbent: { name: "LastPass", slug: "lastpass" }, category: "Password managers" },
  { challenger: { name: "Pipedrive", slug: "pipedrive" }, incumbent: { name: "Zoho CRM", slug: "zoho" }, category: "CRM (SMB)" },
];

/**
 * Baked-in snapshot — refreshed 2026-07-12 from the production Neon DB
 * (96 published software comparisons across 99 distinct SaaS tools).
 * Used only when a live query is unavailable so the page always renders.
 */
const SAAS_SNAPSHOT: B2BSaaSStudy = {
  totalSaaSComparisons: 96,
  distinctTools: 95,
  updatedAt: "2026-07-12T00:00:00.000Z",
  fromSnapshot: true,
  topTools: [
    { rank: 1, name: "Mailchimp", slug: "mailchimp", count: 5 },
    { rank: 1, name: "Squarespace", slug: "squarespace", count: 5 },
    { rank: 3, name: "1Password", slug: "1password", count: 4 },
    { rank: 3, name: "Microsoft Teams", slug: "microsoft-teams", count: 4 },
    { rank: 3, name: "Notion", slug: "notion", count: 4 },
    { rank: 6, name: "Klaviyo", slug: "klaviyo", count: 3 },
    { rank: 6, name: "QuickBooks Online", slug: "quickbooks-online", count: 3 },
    { rank: 6, name: "Zoom", slug: "zoom", count: 3 },
    { rank: 9, name: "Brave", slug: "brave", count: 2 },
    { rank: 9, name: "ClickUp", slug: "clickup", count: 2 },
    { rank: 9, name: "Confluence", slug: "confluence", count: 2 },
    { rank: 9, name: "Cursor", slug: "cursor", count: 2 },
    { rank: 9, name: "Firefox", slug: "firefox", count: 2 },
    { rank: 9, name: "FreshBooks", slug: "freshbooks", count: 2 },
    { rank: 9, name: "Google Meet", slug: "google-meet", count: 2 },
  ],
  clusters: [
    { slug: "email-crm", label: "Email Marketing & CRM", icon: "\ud83d\udce7", count: 11, topMatchup: { title: "Mailchimp vs HubSpot", slug: "mailchimp-vs-hubspot" } },
    { slug: "communication", label: "Communication & Collaboration", icon: "\ud83d\udcac", count: 9, topMatchup: { title: "Zoom vs Google Meet vs Microsoft Teams (2026): Video Conferencing Compared", slug: "zoom-vs-google-meet-vs-teams" } },
    { slug: "website-builders", label: "Website Builders & eCommerce", icon: "\ud83c\udfea", count: 9, topMatchup: { title: "Squarespace vs Shopify", slug: "shopify-vs-squarespace" } },
    { slug: "finance-accounting", label: "Finance & Accounting", icon: "\ud83d\udcb3", count: 8, topMatchup: { title: "FreshBooks vs QuickBooks Online", slug: "freshbooks-vs-quickbooks" } },
    { slug: "password-privacy", label: "Password & Privacy", icon: "\ud83d\udd11", count: 7, topMatchup: { title: "1Password vs Bitwarden", slug: "1password-vs-bitwarden" } },
    { slug: "productivity", label: "Productivity & PM", icon: "\ud83d\udccb", count: 7, topMatchup: { title: "Notion vs ClickUp", slug: "clickup-vs-notion" } },
    { slug: "ai-tools", label: "AI Tools", icon: "\ud83e\udd16", count: 4, topMatchup: { title: "Cursor vs Claude Code", slug: "cursor-vs-claude-code" } },
    { slug: "vpn-security", label: "VPN & Security", icon: "\ud83d\udd12", count: 3, topMatchup: { title: "Bitdefender vs Kaspersky", slug: "bitdefender-vs-kaspersky" } },
    { slug: "design-creative", label: "Design & Creative", icon: "\ud83c\udfa8", count: 3, topMatchup: { title: "Canva vs Photoshop", slug: "canva-vs-photoshop" } },
    { slug: "office-tools", label: "Office & Documents", icon: "\ud83d\udcc4", count: 2, topMatchup: { title: "Dropbox vs Google Drive", slug: "dropbox-vs-google-drive" } },
  ],
  challengers: [
    { challenger: "Notion", challengerSlug: "notion", challengerCount: 4, incumbent: "Confluence", incumbentSlug: "confluence", incumbentCount: 2, category: "Docs & wikis" },
    { challenger: "HubSpot", challengerSlug: "hubspot", challengerCount: 2, incumbent: "Salesforce", incumbentSlug: "salesforce", incumbentCount: 1, category: "CRM" },
    { challenger: "ClickUp", challengerSlug: "clickup", challengerCount: 2, incumbent: "Jira", incumbentSlug: "jira", incumbentCount: 1, category: "Project management" },
    { challenger: "Wix", challengerSlug: "wix", challengerCount: 2, incumbent: "WordPress", incumbentSlug: "wordpress", incumbentCount: 1, category: "Website builders" },
    { challenger: "Pipedrive", challengerSlug: "pipedrive", challengerCount: 1, incumbent: "Zoho CRM", incumbentSlug: "zoho", incumbentCount: 0, category: "CRM (SMB)" },
  ],
};

/** Classify a software comparison into a SaaS subcategory by keyword match. */
function classifyCluster(entityText: string): string | null {
  let bestSlug: string | null = null;
  let bestScore = 0;
  for (const sub of SOFTWARE_SUBCATEGORIES) {
    let score = 0;
    for (const kw of sub.keywords) {
      if (entityText.includes(kw.toLowerCase())) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestSlug = sub.slug;
    }
  }
  return bestSlug;
}

/**
 * Returns the "B2B SaaS Comparison Report 2026" study dataset.
 * Live query when the DB is reachable, otherwise the baked-in snapshot.
 */
export async function getB2BSaaSStudy(): Promise<B2BSaaSStudy> {
  const prisma = getPrismaClient();
  if (!prisma) return SAAS_SNAPSHOT;

  try {
    const totalSaaSComparisons = await prisma.comparison.count({
      where: { status: "published", category: "software" },
    });

    const rows = (await prisma.$queryRaw<PairRow[]>`
      SELECT c.slug AS cslug, c.title AS ctitle, c.category AS ccategory,
             e.name, e.slug AS eslug, et.slug AS type
      FROM comparison_entities ce
      JOIN comparisons c ON c.id = ce.comparison_id
        AND c.status = 'published' AND c.category = 'software'
      JOIN entities e ON e.id = ce.entity_id
      LEFT JOIN entity_types et ON et.id = e.entity_type_id`) as PairRow[];

    if (rows.length === 0 || totalSaaSComparisons === 0) return SAAS_SNAPSHOT;

    const g = buildRivalryGraph(rows);

    // Tool leaderboard — software-typed entities, ranked by distinct rivals.
    // Excludes programming languages, and consumer streaming services: `disney`
    // is typed `software` in the entity table, which is how Disney+ ended up
    // ranked as a B2B SaaS tool between Zoom and Mailchimp (DAN-2047).
    const isTool = (slug: string, type: string | null) =>
      (type || "").toLowerCase() === "software" &&
      !NON_SAAS_SLUGS.has(slug) &&
      !CONSUMER_MEDIA_SLUGS.has(slug);

    const rankedTools = rankByRivals(g).filter((t) => isTool(t.slug, t.type));

    const topTools: SaaSTool[] = competitionRank(rankedTools.slice(0, 15)).map((t) => ({
      rank: t.rank,
      name: t.name,
      slug: t.slug,
      count: t.count,
    }));
    const distinctTools = rankedTools.length;

    // Rival count for a canonical entity — the SaaS centrality score.
    const rivals = (slug: string) => g.rivalsOf.get(slug)?.size ?? 0;
    const centrality = (members: string[]) =>
      members.reduce((sum, m) => sum + rivals(m), 0);

    // Text blob per page, for cluster classification.
    const textOf = new Map<string, string>();
    for (const r of rows) {
      textOf.set(r.cslug, `${textOf.get(r.cslug) ?? ""} ${r.name} ${r.eslug}`.toLowerCase());
    }

    // Cluster classification + marquee matchup per cluster (by centrality).
    const subMeta = new Map(SOFTWARE_SUBCATEGORIES.map((s) => [s.slug, s]));
    const clusterCount = new Map<string, number>();
    const clusterTop = new Map<string, { title: string; slug: string; score: number }>();
    for (const p of g.pages) {
      const cl = classifyCluster(textOf.get(p.slug) ?? "");
      if (!cl) continue;
      clusterCount.set(cl, (clusterCount.get(cl) || 0) + 1);
      const score = centrality(p.members);
      const cur = clusterTop.get(cl);
      if (!cur || score > cur.score || (score === cur.score && p.slug < cur.slug)) {
        clusterTop.set(cl, { title: p.title, slug: p.slug, score });
      }
    }
    const clusters: SaaSCategoryCluster[] = [...clusterCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([slug, count]) => {
        const m = clusterTop.get(slug);
        return {
          slug,
          label: subMeta.get(slug)?.name || labelFor(slug),
          icon: subMeta.get(slug)?.icon || "🧩",
          count,
          topMatchup: m ? { title: m.title, slug: m.slug } : null,
        };
      });

    // Challenger vs incumbent — keep only data-backed upsets. Compared on
    // distinct rivals, so a challenger cannot "win" on a reverse-duplicate page.
    const lookup = (slug: string) => rivals(canonicalSlug(slug));
    const challengers: ChallengerPair[] = CHALLENGER_CANDIDATES.map((c) => ({
      challenger: c.challenger.name,
      challengerSlug: c.challenger.slug,
      challengerCount: lookup(c.challenger.slug),
      incumbent: c.incumbent.name,
      incumbentSlug: c.incumbent.slug,
      incumbentCount: lookup(c.incumbent.slug),
      category: c.category,
    }))
      .filter((c) => c.challengerCount > c.incumbentCount && c.challengerCount > 0)
      .sort((a, b) => b.challengerCount - a.challengerCount);

    // Guard against a hollow result.
    if (topTools.length === 0) return SAAS_SNAPSHOT;

    return {
      totalSaaSComparisons,
      distinctTools,
      topTools,
      clusters,
      challengers: challengers.length > 0 ? challengers : SAAS_SNAPSHOT.challengers,
      updatedAt: new Date().toISOString(),
      fromSnapshot: false,
    };
  } catch (e) {
    console.warn("getB2BSaaSStudy: live query failed, using snapshot:", e);
    return SAAS_SNAPSHOT;
  }
}

// ---------------------------------------------------------------------------
// Finance & Investing Comparison Report 2026
// ---------------------------------------------------------------------------

export interface FinanceTopic {
  rank: number;
  name: string;
  slug: string;
  count: number;
  category: string;
}

export interface FinanceMatchup {
  rank: number;
  title: string;
  slug: string;
  /** Comparison centrality — see StudyMatchup.centrality. Never a traffic figure. */
  centrality: number;
  insight: string;
}

export interface FinanceCluster {
  label: string;
  slug: string;
  count: number;
  icon: string;
  topMatchup: { title: string; slug: string } | null;
}

export interface FinanceStudy {
  totalFinanceComparisons: number;
  distinctTopics: number;
  topTopics: FinanceTopic[];
  clusters: FinanceCluster[];
  topMatchups: FinanceMatchup[];
  updatedAt: string;
  fromSnapshot: boolean;
}

const FINANCE_CLUSTERS: { slug: string; name: string; icon: string; keywords: string[] }[] = [
  { slug: "brokerages", name: "Brokerages & Trading Platforms", icon: "📈", keywords: ["robinhood", "fidelity", "vanguard", "schwab", "etrade", "webull", "td-ameritrade", "merrill", "ally", "interactive-brokers"] },
  { slug: "retirement", name: "Retirement Accounts", icon: "🏦", keywords: ["roth-ira", "traditional-ira", "401k", "403b", "sep-ira", "roth-401k", "pension", "annuity"] },
  { slug: "credit-cards", name: "Credit Cards", icon: "💳", keywords: ["chase", "amex", "american-express", "capital-one", "discover", "citi", "visa", "mastercard", "sapphire", "platinum"] },
  { slug: "banking", name: "Banks & Savings", icon: "🏛️", keywords: ["chase", "bank-of-america", "wells-fargo", "citibank", "ally", "marcus", "high-yield", "checking", "savings"] },
  { slug: "crypto", name: "Crypto & Digital Assets", icon: "₿", keywords: ["bitcoin", "ethereum", "coinbase", "binance", "crypto", "defi", "nft", "blockchain"] },
  { slug: "mortgages", name: "Mortgages & Real Estate", icon: "🏠", keywords: ["mortgage", "refinance", "heloc", "real-estate", "renting", "buying", "loan", "arm", "fixed-rate"] },
  { slug: "insurance", name: "Insurance Products", icon: "🛡️", keywords: ["life-insurance", "term-life", "whole-life", "health-insurance", "auto-insurance", "home-insurance"] },
  { slug: "robo-advisors", name: "Robo-Advisors & Wealthtech", icon: "🤖", keywords: ["betterment", "wealthfront", "sofi", "acorns", "stash", "m1-finance", "roboadvisor"] },
];

/**
 * Baked-in snapshot — refreshed 2026-07-12 from the production Neon DB
 * (22 published finance/economy comparisons across 33 distinct topics).
 */
const FINANCE_SNAPSHOT: FinanceStudy = {
  totalFinanceComparisons: 22,
  distinctTopics: 29,
  updatedAt: "2026-07-12T00:00:00.000Z",
  fromSnapshot: true,
  topTopics: [
    { rank: 1, name: "Charles Schwab", slug: "charles-schwab", count: 2, category: "Finance" },
    { rank: 1, name: "Fidelity", slug: "fidelity", count: 2, category: "Finance" },
    { rank: 1, name: "Vanguard", slug: "vanguard", count: 2, category: "Finance" },
    { rank: 4, name: "Bank of America", slug: "bank-of-america", count: 1, category: "Finance" },
    { rank: 4, name: "Bitcoin", slug: "bitcoin", count: 1, category: "Economy & Finance" },
    { rank: 4, name: "Cash App", slug: "cash-app", count: 1, category: "Finance" },
    { rank: 4, name: "Chase", slug: "chase", count: 1, category: "Finance" },
    { rank: 4, name: "Checking Account", slug: "checking-account", count: 1, category: "Finance" },
    { rank: 4, name: "Chime", slug: "chime", count: 1, category: "Finance" },
    { rank: 4, name: "China Economy", slug: "china-economy", count: 1, category: "Economy & Finance" },
    { rank: 4, name: "Credit Card", slug: "credit-card", count: 1, category: "Finance" },
    { rank: 4, name: "Debit Card", slug: "debit-card", count: 1, category: "Finance" },
  ],
  clusters: [
    { label: "Brokerages & Trading Platforms", slug: "brokerages", count: 4, icon: "\ud83d\udcc8", topMatchup: { title: "Charles Schwab vs Fidelity Investments", slug: "charles-schwab-vs-fidelity" } },
    { label: "Credit Cards", slug: "credit-cards", count: 3, icon: "\ud83d\udcb3", topMatchup: { title: "Chase vs Bank of America", slug: "bank-of-america-vs-chase" } },
    { label: "Mortgages & Real Estate", slug: "mortgages", count: 2, icon: "\ud83c\udfe0", topMatchup: { title: "State Farm vs Progressive", slug: "state-farm-vs-progressive" } },
    { label: "Banks & Savings", slug: "banking", count: 1, icon: "\ud83c\udfdb\ufe0f", topMatchup: { title: "Checking Account vs Savings Account", slug: "checking-account-vs-savings-account" } },
    { label: "Crypto & Digital Assets", slug: "crypto", count: 1, icon: "\u20bf", topMatchup: { title: "Bitcoin vs Ethereum", slug: "bitcoin-vs-ethereum" } },
  ],
  topMatchups: [
    { rank: 1, title: "Charles Schwab vs Fidelity Investments", slug: "charles-schwab-vs-fidelity", centrality: 4, insight: "" },
    { rank: 2, title: "Vanguard vs Fidelity", slug: "vanguard-vs-fidelity", centrality: 4, insight: "" },
    { rank: 3, title: "Charles Schwab vs Robinhood", slug: "charles-schwab-vs-robinhood", centrality: 3, insight: "" },
    { rank: 4, title: "Schwab vs Vanguard", slug: "schwab-vs-vanguard", centrality: 3, insight: "" },
    { rank: 5, title: "US Economy vs China Economy", slug: "america-vs-china-economy", centrality: 2, insight: "" },
    { rank: 6, title: "Chase vs Bank of America", slug: "bank-of-america-vs-chase", centrality: 2, insight: "" },
    { rank: 7, title: "Bitcoin vs Ethereum", slug: "bitcoin-vs-ethereum", centrality: 2, insight: "" },
    { rank: 8, title: "Chime vs Cash App", slug: "cash-app-vs-chime", centrality: 2, insight: "" },
    { rank: 9, title: "Checking Account vs Savings Account", slug: "checking-account-vs-savings-account", centrality: 2, insight: "" },
    { rank: 10, title: "Credit Card vs Debit Card", slug: "credit-card-vs-debit-card", centrality: 2, insight: "" },
  ],
};

function classifyFinanceCluster(text: string): string | null {
  for (const cl of FINANCE_CLUSTERS) {
    if (cl.keywords.some((k) => text.includes(k))) return cl.slug;
  }
  return null;
}

export async function getFinanceStudy(): Promise<FinanceStudy> {
  const prisma = getPrismaClient();
  if (!prisma) return FINANCE_SNAPSHOT;

  try {
    const totalFinanceComparisons = await prisma.comparison.count({
      where: { status: "published", category: { in: ["finance", "economy"] } },
    });

    if (totalFinanceComparisons === 0) return FINANCE_SNAPSHOT;

    const rows = (await prisma.$queryRaw<PairRow[]>`
      SELECT e.name, e.slug AS eslug, c.slug AS cslug, c.title AS ctitle,
             c.category AS ccategory, et.slug AS type
      FROM comparison_entities ce
      JOIN comparisons c ON c.id = ce.comparison_id
        AND c.status = 'published' AND c.category IN ('finance','economy')
      JOIN entities e ON e.id = ce.entity_id
      LEFT JOIN entity_types et ON et.id = e.entity_type_id`) as PairRow[];

    if (rows.length === 0) return FINANCE_SNAPSHOT;

    // The finance corpus is the worst-hit by duplicate slugs: the US-vs-China
    // economy rivalry alone is published as five separate pages, and appears as
    // two entities each (`us-economy`/`united-states-economy`). Counting pages
    // made one rivalry look like the whole category (DAN-2047).
    const g = buildRivalryGraph(rows);
    const rivals = (slug: string) => g.rivalsOf.get(slug)?.size ?? 0;
    const centrality = (members: string[]) =>
      members.reduce((sum, m) => sum + rivals(m), 0);

    const categoryOf = new Map<string, string>();
    const textOf = new Map<string, string>();
    for (const r of rows) {
      categoryOf.set(canonicalSlug(r.eslug), r.ccategory || "finance");
      textOf.set(r.cslug, `${textOf.get(r.cslug) ?? ""} ${r.name} ${r.eslug}`.toLowerCase());
    }

    const topTopics: FinanceTopic[] = competitionRank(
      rankByRivals(g).slice(0, 12)
    ).map((t) => ({
      rank: t.rank,
      name: t.name,
      slug: t.slug,
      count: t.count,
      category: labelFor(categoryOf.get(t.slug) || "finance"),
    }));

    const clusterCount = new Map<string, number>();
    const clusterTop = new Map<string, { title: string; slug: string; score: number }>();
    for (const p of g.pages) {
      const cl = classifyFinanceCluster(textOf.get(p.slug) ?? "");
      if (!cl) continue;
      clusterCount.set(cl, (clusterCount.get(cl) || 0) + 1);
      const score = centrality(p.members);
      const cur = clusterTop.get(cl);
      if (!cur || score > cur.score || (score === cur.score && p.slug < cur.slug)) {
        clusterTop.set(cl, { title: p.title, slug: p.slug, score });
      }
    }
    const clusters: FinanceCluster[] = FINANCE_CLUSTERS.map((fc) => ({
      label: fc.name,
      slug: fc.slug,
      count: clusterCount.get(fc.slug) || 0,
      icon: fc.icon,
      topMatchup: clusterTop.get(fc.slug)
        ? { title: clusterTop.get(fc.slug)!.title, slug: clusterTop.get(fc.slug)!.slug }
        : null,
    })).filter((c) => c.count > 0).sort((a, b) => b.count - a.count);

    // Head-to-head only, then deduped — otherwise the same US/China rivalry
    // fills the top three rows of the table.
    const scored = g.headToHead.map((p) => ({
      slug: p.slug,
      title: p.title,
      members: p.members,
      centrality: centrality(p.members),
    }));

    const topMatchups: FinanceMatchup[] = dedupeMatchups(scored)
      .slice(0, 10)
      .map((m, i) => ({ rank: i + 1, title: m.title, slug: m.slug, centrality: m.centrality, insight: "" }));

    if (topTopics.length === 0) return FINANCE_SNAPSHOT;

    return {
      totalFinanceComparisons,
      distinctTopics: g.entities.size,
      topTopics,
      clusters: clusters.length > 0 ? clusters : FINANCE_SNAPSHOT.clusters,
      topMatchups: topMatchups.length > 0 ? topMatchups : FINANCE_SNAPSHOT.topMatchups,
      updatedAt: new Date().toISOString(),
      fromSnapshot: false,
    };
  } catch (e) {
    console.warn("getFinanceStudy: live query failed, using snapshot:", e);
    return FINANCE_SNAPSHOT;
  }
}
