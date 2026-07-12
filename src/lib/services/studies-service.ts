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
  rank: number;
  name: string;
  slug: string;
  type: string;
  count: number;
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
  totalComparisons: number;
  distinctBrands: number;
  topBrands: StudyBrand[];
  topSaaS: StudyBrand[];
  topMatchups: StudyMatchup[];
  categories: StudyCategory[];
  /** ISO timestamp of when the underlying data was read. */
  updatedAt: string;
  /** true when served from the baked-in snapshot rather than a live query. */
  fromSnapshot: boolean;
}

// Entity types that count as a "brand" for the headline ranking.
// Country economies, people, and historical entities are intentionally excluded.
const BRAND_TYPES = ["company", "brand", "product", "software", "team"];

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
 * Baked-in snapshot — refreshed 2026-07-12 from the production Neon DB
 * (491 published comparisons across 704 entities).
 * Used only when a live query is unavailable so the page always renders.
 * Keep in sync with the live corpus: a stale snapshot here is what let the
 * /studies/ index overstate the dataset by up to 11x (DAN-2037). Regenerate
 * with `npx tsx --env-file=.env.local scripts/dan2037-snapshot.ts`.
 */
const SNAPSHOT: MostComparedStudy = {
  totalComparisons: 491,
  distinctBrands: 704,
  updatedAt: "2026-07-12T00:00:00.000Z",
  fromSnapshot: true,
  topBrands: [
    { rank: 1, name: "Netflix", slug: "netflix", type: "company", count: 8 },
    { rank: 2, name: "Xbox Series X", slug: "xbox-series-x", type: "product", count: 7 },
    { rank: 3, name: "Spotify", slug: "spotify", type: "software", count: 7 },
    { rank: 4, name: "Squarespace", slug: "squarespace", type: "software", count: 7 },
    { rank: 5, name: "Notion", slug: "notion", type: "software", count: 6 },
    { rank: 6, name: "Microsoft Teams", slug: "microsoft-teams", type: "software", count: 6 },
    { rank: 7, name: "Hulu", slug: "hulu", type: "company", count: 6 },
    { rank: 8, name: "Zoom", slug: "zoom", type: "software", count: 6 },
    { rank: 9, name: "Disney+", slug: "disney", type: "software", count: 5 },
    { rank: 10, name: "Mailchimp", slug: "mailchimp", type: "software", count: 5 },
    { rank: 11, name: "Peacock", slug: "peacock", type: "software", count: 5 },
    { rank: 12, name: "PlayStation 5", slug: "playstation-5", type: "product", count: 4 },
    { rank: 13, name: "ChatGPT", slug: "chatgpt", type: "software", count: 4 },
    { rank: 14, name: "Apple Music", slug: "apple-music", type: "software", count: 4 },
    { rank: 15, name: "Booking.com", slug: "booking-com", type: "company", count: 4 },
  ],
  topSaaS: [
    { rank: 1, name: "Spotify", slug: "spotify", type: "software", count: 7 },
    { rank: 2, name: "Squarespace", slug: "squarespace", type: "software", count: 7 },
    { rank: 3, name: "Notion", slug: "notion", type: "software", count: 6 },
    { rank: 4, name: "Microsoft Teams", slug: "microsoft-teams", type: "software", count: 6 },
    { rank: 5, name: "Zoom", slug: "zoom", type: "software", count: 6 },
    { rank: 6, name: "Disney+", slug: "disney", type: "software", count: 5 },
    { rank: 7, name: "Mailchimp", slug: "mailchimp", type: "software", count: 5 },
    { rank: 8, name: "Peacock", slug: "peacock", type: "software", count: 5 },
    { rank: 9, name: "ChatGPT", slug: "chatgpt", type: "software", count: 4 },
    { rank: 10, name: "Apple Music", slug: "apple-music", type: "software", count: 4 },
    { rank: 11, name: "ClickUp", slug: "clickup", type: "software", count: 4 },
    { rank: 12, name: "1Password", slug: "1password", type: "software", count: 4 },
  ],
  topMatchups: [
    { rank: 1, title: "Spotify vs Apple Music vs YouTube Music: Which Streaming Service Is Best in 2026?", slug: "spotify-vs-apple-music-vs-youtube-music", category: "technology", centrality: 17 },
    { rank: 2, title: "Zoom vs Google Meet vs Microsoft Teams (2026): Video Conferencing Compared", slug: "zoom-vs-google-meet-vs-teams", category: "software", centrality: 16 },
    { rank: 3, title: "Netflix vs Hulu", slug: "netflix-vs-hulu", category: "entertainment", centrality: 14 },
    { rank: 4, title: "Disney+ vs Netflix", slug: "disney-vs-netflix", category: "entertainment", centrality: 13 },
    { rank: 5, title: "Spotify vs YouTube Music", slug: "spotify-vs-youtube-music", category: "entertainment", centrality: 13 },
    { rank: 6, title: "United States Economy vs China Economy", slug: "china-economy-size-vs-us", category: "economy", centrality: 12 },
    { rank: 7, title: "Zoom vs Microsoft Teams", slug: "zoom-vs-microsoft-teams", category: "software", centrality: 12 },
    { rank: 8, title: "Apple Music vs Spotify", slug: "apple-music-vs-spotify", category: "entertainment", centrality: 11 },
    { rank: 9, title: "Disney+ vs Hulu", slug: "disney-plus-vs-hulu", category: "entertainment", centrality: 11 },
    { rank: 10, title: "HBO Max vs Netflix", slug: "hbo-max-vs-netflix", category: "entertainment", centrality: 11 },
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
};

/**
 * Stable key for the set of entities a comparison is about, so that pages
 * covering the same pairing under different slugs ("us-vs-china-gdp",
 * "chinese-vs-us-economy", …) collapse to a single row in a matchup ranking.
 * Without this the finance top-10 is five copies of one rivalry (DAN-2037).
 */
function matchupKey(members: string[]): string {
  return [...new Set(members)].sort().join("|");
}

/**
 * Collapses comparisons that cover the same entity pairing, keeping the most
 * central one. Ties break on slug so the ranking is stable between builds.
 */
function dedupeMatchups<T extends { slug: string; centrality: number; members: string[] }>(
  rows: T[]
): T[] {
  const best = new Map<string, T>();
  for (const r of rows) {
    const key = matchupKey(r.members);
    const cur = best.get(key);
    if (!cur || r.centrality > cur.centrality || (r.centrality === cur.centrality && r.slug < cur.slug)) {
      best.set(key, r);
    }
  }
  return [...best.values()].sort(
    (a, b) => b.centrality - a.centrality || a.slug.localeCompare(b.slug)
  );
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

    // How many published comparisons each entity appears in.
    const entities = new Map<string, { name: string; type: string | null; n: number }>();
    // The entities that make up each comparison, for the centrality score.
    const comps = new Map<string, { title: string; category: string | null; members: string[] }>();

    for (const r of rows) {
      const e = entities.get(r.eslug) || { name: r.name, type: r.type, n: 0 };
      e.n++;
      entities.set(r.eslug, e);

      const c = comps.get(r.cslug) || { title: r.ctitle, category: r.ccategory, members: [] };
      c.members.push(r.eslug);
      comps.set(r.cslug, c);
    }

    const ranked = [...entities.entries()].sort((a, b) => b[1].n - a[1].n);

    const topBrands: StudyBrand[] = ranked
      .filter(([, e]) => BRAND_TYPES.includes((e.type || "").toLowerCase()))
      .slice(0, 15)
      .map(([slug, e], i) => ({ rank: i + 1, name: e.name, slug, type: e.type || "brand", count: e.n }));

    const topSaaS: StudyBrand[] = ranked
      .filter(([, e]) => (e.type || "").toLowerCase() === "software")
      .slice(0, 12)
      .map(([slug, e], i) => ({ rank: i + 1, name: e.name, slug, type: "software", count: e.n }));

    // Centrality — how connected a matchup's entities are across the dataset.
    const scored = [...comps.entries()].map(([slug, c]) => ({
      slug,
      title: c.title,
      category: c.category || "general",
      members: c.members,
      centrality: c.members.reduce((sum, m) => sum + (entities.get(m)?.n ?? 0), 0),
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

    const catCount = new Map<string, number>();
    for (const c of comps.values()) {
      const key = c.category || "general";
      catCount.set(key, (catCount.get(key) || 0) + 1);
    }
    const categories: StudyCategory[] = [...catCount.entries()]
      .map(([category, count]) => ({ category, label: labelFor(category), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Guard against an empty DB returning a hollow study.
    if (topBrands.length === 0) return SNAPSHOT;

    return {
      totalComparisons,
      distinctBrands: entities.size,
      topBrands,
      topSaaS,
      topMatchups,
      categories,
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
  rank: number;
  name: string;
  slug: string;
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
  distinctTools: 99,
  updatedAt: "2026-07-12T00:00:00.000Z",
  fromSnapshot: true,
  topTools: [
    { rank: 1, name: "Squarespace", slug: "squarespace", count: 7 },
    { rank: 2, name: "Microsoft Teams", slug: "microsoft-teams", count: 6 },
    { rank: 3, name: "Mailchimp", slug: "mailchimp", count: 5 },
    { rank: 4, name: "Notion", slug: "notion", count: 5 },
    { rank: 5, name: "Zoom", slug: "zoom", count: 4 },
    { rank: 6, name: "1Password", slug: "1password", count: 4 },
    { rank: 7, name: "Google Meet", slug: "google-meet", count: 3 },
    { rank: 8, name: "Wix", slug: "wix", count: 3 },
    { rank: 9, name: "Klaviyo", slug: "klaviyo", count: 3 },
    { rank: 10, name: "QuickBooks Online", slug: "quickbooks-online", count: 3 },
    { rank: 11, name: "ClickUp", slug: "clickup", count: 3 },
    { rank: 12, name: "Firefox", slug: "firefox", count: 3 },
    { rank: 13, name: "MySQL", slug: "mysql", count: 2 },
    { rank: 14, name: "Stripe", slug: "stripe", count: 2 },
    { rank: 15, name: "Xero", slug: "xero", count: 2 },
  ],
  clusters: [
    { slug: "email-crm", label: "Email Marketing & CRM", icon: "\ud83d\udce7", count: 11, topMatchup: { title: "Mailchimp vs HubSpot", slug: "mailchimp-vs-hubspot" } },
    { slug: "communication", label: "Communication & Collaboration", icon: "\ud83d\udcac", count: 9, topMatchup: { title: "Zoom vs Google Meet vs Microsoft Teams (2026): Video Conferencing Compared", slug: "zoom-vs-google-meet-vs-teams" } },
    { slug: "website-builders", label: "Website Builders & eCommerce", icon: "\ud83c\udfea", count: 9, topMatchup: { title: "Squarespace vs Wix", slug: "squarespace-vs-wix" } },
    { slug: "finance-accounting", label: "Finance & Accounting", icon: "\ud83d\udcb3", count: 8, topMatchup: { title: "FreshBooks vs QuickBooks Online", slug: "freshbooks-vs-quickbooks" } },
    { slug: "password-privacy", label: "Password & Privacy", icon: "\ud83d\udd11", count: 7, topMatchup: { title: "1Password vs Bitwarden", slug: "1password-vs-bitwarden" } },
    { slug: "productivity", label: "Productivity & PM", icon: "\ud83d\udccb", count: 7, topMatchup: { title: "Notion vs ClickUp", slug: "clickup-vs-notion" } },
    { slug: "ai-tools", label: "AI Tools", icon: "\ud83e\udd16", count: 4, topMatchup: { title: "Microsoft Copilot vs ChatGPT", slug: "chatgpt-vs-copilot" } },
    { slug: "vpn-security", label: "VPN & Security", icon: "\ud83d\udd12", count: 3, topMatchup: { title: "Bitdefender vs Kaspersky", slug: "bitdefender-vs-kaspersky" } },
    { slug: "design-creative", label: "Design & Creative", icon: "\ud83c\udfa8", count: 3, topMatchup: { title: "Figma vs Sketch vs Adobe XD (2026): Design Tool 3-Way Comparison", slug: "figma-vs-sketch-vs-adobe-xd" } },
    { slug: "office-tools", label: "Office & Documents", icon: "\ud83d\udcc4", count: 2, topMatchup: { title: "Dropbox vs Google Drive", slug: "dropbox-vs-google-drive" } },
  ],
  challengers: [
    { challenger: "Notion", challengerSlug: "notion", challengerCount: 5, incumbent: "Confluence", incumbentSlug: "confluence", incumbentCount: 2, category: "Docs & wikis" },
    { challenger: "ClickUp", challengerSlug: "clickup", challengerCount: 3, incumbent: "Jira", incumbentSlug: "jira", incumbentCount: 1, category: "Project management" },
    { challenger: "Wix", challengerSlug: "wix", challengerCount: 3, incumbent: "WordPress", incumbentSlug: "wordpress", incumbentCount: 1, category: "Website builders" },
    { challenger: "HubSpot", challengerSlug: "hubspot", challengerCount: 2, incumbent: "Salesforce", incumbentSlug: "salesforce", incumbentCount: 1, category: "CRM" },
    { challenger: "Pipedrive", challengerSlug: "pipedrive", challengerCount: 1, incumbent: "Zoho CRM", incumbentSlug: "zoho", incumbentCount: 0, category: "CRM (SMB)" },
  ],
};

interface SaaSEntityRow {
  cslug: string;
  ctitle: string;
  name: string;
  eslug: string;
  type: string | null;
}

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

    const rows = (await prisma.$queryRaw<SaaSEntityRow[]>`
      SELECT c.slug AS cslug, c.title AS ctitle,
             e.name, e.slug AS eslug, et.slug AS type
      FROM comparison_entities ce
      JOIN comparisons c ON c.id = ce.comparison_id
        AND c.status = 'published' AND c.category = 'software'
      JOIN entities e ON e.id = ce.entity_id
      LEFT JOIN entity_types et ON et.id = e.entity_type_id`) as SaaSEntityRow[];

    if (rows.length === 0 || totalSaaSComparisons === 0) return SAAS_SNAPSHOT;

    // Tool leaderboard — software-typed entities, excluding languages/frameworks.
    const toolCounts = new Map<string, { name: string; slug: string; n: number }>();
    // Appearance count for every entity, used for the centrality score below.
    const entityCounts = new Map<string, number>();
    // Per-comparison aggregation for cluster classification.
    const comps = new Map<string, { title: string; text: string; members: string[] }>();

    for (const r of rows) {
      if ((r.type || "").toLowerCase() === "software" && !NON_SAAS_SLUGS.has(r.eslug)) {
        const t = toolCounts.get(r.eslug) || { name: r.name, slug: r.eslug, n: 0 };
        t.n++;
        toolCounts.set(r.eslug, t);
      }
      entityCounts.set(r.eslug, (entityCounts.get(r.eslug) || 0) + 1);

      const c = comps.get(r.cslug) || { title: r.ctitle, text: "", members: [] };
      c.text += ` ${r.name} ${r.eslug}`.toLowerCase();
      c.members.push(r.eslug);
      comps.set(r.cslug, c);
    }

    // Centrality — combined appearance count of a comparison's entities.
    const centrality = (members: string[]) =>
      members.reduce((sum, m) => sum + (entityCounts.get(m) || 0), 0);

    const sortedTools = [...toolCounts.values()].sort((a, b) => b.n - a.n);
    const topTools: SaaSTool[] = sortedTools.slice(0, 15).map((t, i) => ({
      rank: i + 1,
      name: t.name,
      slug: t.slug,
      count: t.n,
    }));
    const distinctTools = toolCounts.size;

    // Cluster classification + marquee matchup per cluster (by centrality).
    const subMeta = new Map(SOFTWARE_SUBCATEGORIES.map((s) => [s.slug, s]));
    const clusterCount = new Map<string, number>();
    const clusterTop = new Map<string, { title: string; slug: string; score: number }>();
    for (const [slug, c] of comps) {
      const cl = classifyCluster(c.text);
      if (!cl) continue;
      clusterCount.set(cl, (clusterCount.get(cl) || 0) + 1);
      const score = centrality(c.members);
      const cur = clusterTop.get(cl);
      if (!cur || score > cur.score || (score === cur.score && slug < cur.slug)) {
        clusterTop.set(cl, { title: c.title, slug, score });
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

    // Challenger vs incumbent — keep only data-backed upsets.
    const lookup = (slug: string) => toolCounts.get(slug)?.n ?? 0;
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
  distinctTopics: 33,
  updatedAt: "2026-07-12T00:00:00.000Z",
  fromSnapshot: true,
  topTopics: [
    { rank: 1, name: "China Economy", slug: "china-economy", count: 6, category: "Economy & Finance" },
    { rank: 2, name: "United States Economy", slug: "united-states-economy", count: 6, category: "Economy & Finance" },
    { rank: 3, name: "Vanguard", slug: "vanguard", count: 2, category: "Finance" },
    { rank: 4, name: "Fidelity", slug: "fidelity", count: 1, category: "Finance" },
    { rank: 5, name: "Credit Card", slug: "credit-card", count: 1, category: "Finance" },
    { rank: 6, name: "Debit Card", slug: "debit-card", count: 1, category: "Finance" },
    { rank: 7, name: "Checking Account", slug: "checking-account", count: 1, category: "Finance" },
    { rank: 8, name: "Savings Account", slug: "savings-account", count: 1, category: "Finance" },
    { rank: 9, name: "US Economy", slug: "us-economy", count: 1, category: "Economy & Finance" },
    { rank: 10, name: "JPMorgan Chase & Co.", slug: "jpmorgan-chase-co", count: 1, category: "Finance" },
    { rank: 11, name: "The Goldman Sachs Group, Inc.", slug: "the-goldman-sachs-group-inc", count: 1, category: "Finance" },
    { rank: 12, name: "China's Economy", slug: "china-s-economy", count: 1, category: "Economy & Finance" },
  ],
  clusters: [
    { label: "Brokerages & Trading Platforms", slug: "brokerages", count: 4, icon: "\ud83d\udcc8", topMatchup: { title: "Schwab vs Vanguard", slug: "schwab-vs-vanguard" } },
    { label: "Credit Cards", slug: "credit-cards", count: 3, icon: "\ud83d\udcb3", topMatchup: { title: "Chase vs Bank of America", slug: "bank-of-america-vs-chase" } },
    { label: "Mortgages & Real Estate", slug: "mortgages", count: 2, icon: "\ud83c\udfe0", topMatchup: { title: "State Farm vs Progressive", slug: "state-farm-vs-progressive" } },
    { label: "Banks & Savings", slug: "banking", count: 1, icon: "\ud83c\udfdb\ufe0f", topMatchup: { title: "Checking Account vs Savings Account", slug: "checking-account-vs-savings-account" } },
    { label: "Crypto & Digital Assets", slug: "crypto", count: 1, icon: "\u20bf", topMatchup: { title: "Bitcoin vs Ethereum", slug: "bitcoin-vs-ethereum" } },
  ],
  topMatchups: [
    { rank: 1, title: "United States Economy vs China Economy", slug: "china-economy-size-vs-us", centrality: 12, insight: "" },
    { rank: 2, title: "US Economy vs China Economy", slug: "america-vs-china-economy", centrality: 7, insight: "" },
    { rank: 3, title: "US Economy vs China Economy", slug: "us-economy-vs-china-economy", centrality: 7, insight: "" },
    { rank: 4, title: "Schwab vs Vanguard", slug: "schwab-vs-vanguard", centrality: 3, insight: "" },
    { rank: 5, title: "Vanguard vs Fidelity", slug: "vanguard-vs-fidelity", centrality: 3, insight: "" },
    { rank: 6, title: "Chase vs Bank of America", slug: "bank-of-america-vs-chase", centrality: 2, insight: "" },
    { rank: 7, title: "Bitcoin vs Ethereum", slug: "bitcoin-vs-ethereum", centrality: 2, insight: "" },
    { rank: 8, title: "Chime vs Cash App", slug: "cash-app-vs-chime", centrality: 2, insight: "" },
    { rank: 9, title: "Charles Schwab vs Fidelity Investments", slug: "charles-schwab-vs-fidelity", centrality: 2, insight: "" },
    { rank: 10, title: "Charles Schwab vs Robinhood", slug: "charles-schwab-vs-robinhood", centrality: 2, insight: "" },
  ],
};

interface FinanceEntityRow {
  name: string;
  eslug: string;
  cslug: string;
  ctitle: string;
  cat: string | null;
}

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

    const rows = (await prisma.$queryRaw<FinanceEntityRow[]>`
      SELECT e.name, e.slug AS eslug, c.slug AS cslug, c.title AS ctitle,
             c.category AS cat
      FROM comparison_entities ce
      JOIN comparisons c ON c.id = ce.comparison_id
        AND c.status = 'published' AND c.category IN ('finance','economy')
      JOIN entities e ON e.id = ce.entity_id`) as FinanceEntityRow[];

    if (rows.length === 0) return FINANCE_SNAPSHOT;

    const topicCounts = new Map<string, { name: string; count: number; category: string }>();
    const compMap = new Map<string, { title: string; text: string; members: string[] }>();

    for (const r of rows) {
      const t = topicCounts.get(r.eslug) || { name: r.name, count: 0, category: r.cat || "finance" };
      t.count++;
      topicCounts.set(r.eslug, t);
      const c = compMap.get(r.cslug) || { title: r.ctitle, text: "", members: [] };
      c.text += ` ${r.name} ${r.eslug}`.toLowerCase();
      c.members.push(r.eslug);
      compMap.set(r.cslug, c);
    }

    // Centrality — combined appearance count of a comparison's entities.
    const centrality = (members: string[]) =>
      members.reduce((sum, m) => sum + (topicCounts.get(m)?.count ?? 0), 0);

    const sortedTopics = [...topicCounts.entries()].sort((a, b) => b[1].count - a[1].count);
    const topTopics: FinanceTopic[] = sortedTopics.slice(0, 12).map(([slug, t], i) => ({
      rank: i + 1,
      name: t.name,
      slug,
      count: t.count,
      category: labelFor(t.category),
    }));

    const clusterCount = new Map<string, number>();
    const clusterTop = new Map<string, { title: string; slug: string; score: number }>();
    for (const [slug, c] of compMap) {
      const cl = classifyFinanceCluster(c.text);
      if (!cl) continue;
      clusterCount.set(cl, (clusterCount.get(cl) || 0) + 1);
      const score = centrality(c.members);
      const cur = clusterTop.get(cl);
      if (!cur || score > cur.score || (score === cur.score && slug < cur.slug)) {
        clusterTop.set(cl, { title: c.title, slug, score });
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

    const scored = [...compMap.entries()].map(([slug, c]) => ({
      slug,
      title: c.title,
      members: c.members,
      centrality: centrality(c.members),
    }));

    const topMatchups: FinanceMatchup[] = dedupeMatchups(scored)
      .slice(0, 10)
      .map((m, i) => ({ rank: i + 1, title: m.title, slug: m.slug, centrality: m.centrality, insight: "" }));

    if (topTopics.length === 0) return FINANCE_SNAPSHOT;

    return {
      totalFinanceComparisons,
      distinctTopics: topicCounts.size,
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
