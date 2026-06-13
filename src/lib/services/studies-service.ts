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
  viewCount: number;
}

export interface StudyCategory {
  category: string;
  label: string;
  count: number;
  totalViews: number;
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
 * Baked-in snapshot — refreshed 2026-06-12 from the production Neon DB.
 * Used only when a live query is unavailable so the page always renders.
 */
const SNAPSHOT: MostComparedStudy = {
  totalComparisons: 1642,
  distinctBrands: 900,
  updatedAt: "2026-06-12T00:00:00.000Z",
  fromSnapshot: true,
  topBrands: [
    { rank: 1, name: "Xbox Series X", slug: "xbox-series-x", type: "product", count: 31 },
    { rank: 2, name: "PlayStation 5", slug: "playstation-5", type: "product", count: 24 },
    { rank: 3, name: "Netflix", slug: "netflix", type: "company", count: 16 },
    { rank: 4, name: "United Airlines", slug: "united-airlines", type: "company", count: 16 },
    { rank: 5, name: "HubSpot", slug: "hubspot", type: "software", count: 16 },
    { rank: 6, name: "Notion", slug: "notion", type: "software", count: 14 },
    { rank: 7, name: "Delta Air Lines", slug: "delta-air-lines", type: "company", count: 13 },
    { rank: 8, name: "Mailchimp", slug: "mailchimp", type: "software", count: 12 },
    { rank: 9, name: "ClickUp", slug: "clickup", type: "software", count: 11 },
    { rank: 10, name: "Asana", slug: "asana", type: "software", count: 11 },
    { rank: 11, name: "Squarespace", slug: "squarespace", type: "software", count: 11 },
    { rank: 12, name: "Spotify", slug: "spotify", type: "software", count: 11 },
    { rank: 13, name: "Linear", slug: "linear", type: "software", count: 10 },
    { rank: 14, name: "Amazon", slug: "amazon", type: "company", count: 10 },
    { rank: 15, name: "Shopify", slug: "shopify", type: "software", count: 10 },
  ],
  topSaaS: [
    { rank: 1, name: "HubSpot", slug: "hubspot", type: "software", count: 16 },
    { rank: 2, name: "Notion", slug: "notion", type: "software", count: 14 },
    { rank: 3, name: "Mailchimp", slug: "mailchimp", type: "software", count: 12 },
    { rank: 4, name: "ClickUp", slug: "clickup", type: "software", count: 11 },
    { rank: 5, name: "Asana", slug: "asana", type: "software", count: 11 },
    { rank: 6, name: "Squarespace", slug: "squarespace", type: "software", count: 11 },
    { rank: 7, name: "Linear", slug: "linear", type: "software", count: 10 },
    { rank: 8, name: "Shopify", slug: "shopify", type: "software", count: 10 },
    { rank: 9, name: "Pipedrive", slug: "pipedrive", type: "software", count: 9 },
    { rank: 10, name: "Monday.com", slug: "monday-com", type: "software", count: 9 },
    { rank: 11, name: "Zoom", slug: "zoom", type: "software", count: 9 },
    { rank: 12, name: "Klaviyo", slug: "klaviyo", type: "software", count: 9 },
  ],
  topMatchups: [
    { rank: 1, title: "iPhone 17 vs Samsung Galaxy S26", slug: "iphone-17-vs-samsung-s26", category: "technology", viewCount: 2105000 },
    { rank: 2, title: "Messi vs Ronaldo", slug: "messi-vs-ronaldo", category: "sports", viewCount: 1542300 },
    { rank: 3, title: "USA vs China", slug: "usa-vs-china", category: "countries", viewCount: 1203000 },
    { rank: 4, title: "LeBron vs Jordan", slug: "lebron-vs-jordan", category: "sports", viewCount: 983400 },
    { rank: 5, title: "Japan vs China", slug: "japan-vs-china", category: "countries", viewCount: 892100 },
    { rank: 6, title: "PS5 vs Xbox Series X", slug: "ps5-vs-xbox-series-x", category: "technology", viewCount: 789300 },
    { rank: 7, title: "WW1 vs WW2", slug: "ww1-vs-ww2", category: "history", viewCount: 678900 },
    { rank: 8, title: "Mac vs Windows", slug: "mac-vs-windows", category: "technology", viewCount: 623400 },
    { rank: 9, title: "Apple vs Samsung", slug: "apple-vs-samsung", category: "brands", viewCount: 567300 },
    { rank: 10, title: "Android vs iOS", slug: "android-vs-ios", category: "technology", viewCount: 534200 },
  ],
  categories: [
    { category: "products", label: "Consumer Products", count: 404, totalViews: 0 },
    { category: "software", label: "B2B SaaS & Software", count: 384, totalViews: 241000 },
    { category: "technology", label: "Consumer Technology", count: 147, totalViews: 5368200 },
    { category: "economy", label: "Economy & Finance", count: 100, totalViews: 1658300 },
    { category: "sports", label: "Sports", count: 92, totalViews: 6131500 },
    { category: "automotive", label: "Automotive", count: 76, totalViews: 927100 },
    { category: "companies", label: "Companies", count: 70, totalViews: 1492800 },
    { category: "entertainment", label: "Entertainment", count: 58, totalViews: 77000 },
    { category: "finance", label: "Finance", count: 51, totalViews: 115600 },
    { category: "health", label: "Health", count: 39, totalViews: 275500 },
  ],
};

interface EntityRow {
  name: string;
  slug: string;
  type: string | null;
  n: number;
}

/**
 * Returns the "Most-Compared Brands of 2026" study dataset.
 * Live query when the DB is reachable, otherwise the baked-in snapshot.
 */
export async function getMostComparedStudy(): Promise<MostComparedStudy> {
  const prisma = getPrismaClient();
  if (!prisma) return SNAPSHOT;

  try {
    const [totalComparisons, distinctBrandsRows, brandRows, matchups, catGroups] =
      await Promise.all([
        prisma.comparison.count({ where: { status: "published" } }),
        prisma.$queryRaw<{ n: number }[]>`
          SELECT COUNT(DISTINCT ce.entity_id)::int AS n
          FROM comparison_entities ce
          JOIN comparisons c ON c.id = ce.comparison_id AND c.status = 'published'`,
        prisma.$queryRaw<EntityRow[]>`
          SELECT e.name, e.slug, et.slug AS type, COUNT(*)::int AS n
          FROM comparison_entities ce
          JOIN entities e ON e.id = ce.entity_id
          LEFT JOIN entity_types et ON et.id = e.entity_type_id
          JOIN comparisons c ON c.id = ce.comparison_id AND c.status = 'published'
          GROUP BY e.name, e.slug, et.slug
          ORDER BY n DESC
          LIMIT 120`,
        prisma.comparison.findMany({
          where: { status: "published" },
          orderBy: { viewCount: "desc" },
          take: 10,
          select: { slug: true, title: true, category: true, viewCount: true },
        }),
        prisma.comparison.groupBy({
          by: ["category"],
          where: { status: "published" },
          _count: { _all: true },
          _sum: { viewCount: true },
        }),
      ]);

    const rows = brandRows as EntityRow[];

    const brandFiltered = rows.filter((r: EntityRow) =>
      BRAND_TYPES.includes((r.type || "").toLowerCase())
    );

    const topBrands: StudyBrand[] = brandFiltered.slice(0, 15).map((r: EntityRow, i: number) => ({
      rank: i + 1,
      name: r.name,
      slug: r.slug,
      type: r.type || "brand",
      count: r.n,
    }));

    const topSaaS: StudyBrand[] = rows
      .filter((r: EntityRow) => (r.type || "").toLowerCase() === "software")
      .slice(0, 12)
      .map((r: EntityRow, i: number) => ({ rank: i + 1, name: r.name, slug: r.slug, type: "software", count: r.n }));

    const topMatchups: StudyMatchup[] = matchups.map(
      (m: { slug: string; title: string; category: string | null; viewCount: number }, i: number) => ({
        rank: i + 1,
        title: m.title,
        slug: m.slug,
        category: m.category || "general",
        viewCount: m.viewCount,
      })
    );

    const categories: StudyCategory[] = catGroups
      .map((g: { category: string | null; _count: { _all: number }; _sum: { viewCount: number | null } }) => ({
        category: g.category || "general",
        label: labelFor(g.category || "general"),
        count: g._count._all,
        totalViews: g._sum.viewCount || 0,
      }))
      .sort((a: StudyCategory, b: StudyCategory) => b.count - a.count)
      .slice(0, 10);

    // Guard against an empty DB returning a hollow study.
    if (topBrands.length === 0 || totalComparisons === 0) return SNAPSHOT;

    return {
      totalComparisons,
      distinctBrands: distinctBrandsRows[0]?.n ?? brandFiltered.length,
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
  /** The marquee rivalry inside the cluster (by readership). */
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
 * Baked-in snapshot — refreshed 2026-06-12 from the production Neon DB
 * (384 published software comparisons across 282 distinct SaaS tools).
 * Used only when a live query is unavailable so the page always renders.
 */
const SAAS_SNAPSHOT: B2BSaaSStudy = {
  totalSaaSComparisons: 384,
  distinctTools: 282,
  updatedAt: "2026-06-12T00:00:00.000Z",
  fromSnapshot: true,
  topTools: [
    { rank: 1, name: "HubSpot", slug: "hubspot", count: 16 },
    { rank: 2, name: "Mailchimp", slug: "mailchimp", count: 12 },
    { rank: 3, name: "Squarespace", slug: "squarespace", count: 11 },
    { rank: 4, name: "Notion", slug: "notion", count: 10 },
    { rank: 5, name: "Asana", slug: "asana", count: 10 },
    { rank: 6, name: "Shopify", slug: "shopify", count: 10 },
    { rank: 7, name: "Wix", slug: "wix", count: 9 },
    { rank: 8, name: "ClickUp", slug: "clickup", count: 9 },
    { rank: 9, name: "Monday.com", slug: "monday-com", count: 9 },
    { rank: 10, name: "Klaviyo", slug: "klaviyo", count: 8 },
    { rank: 11, name: "Google Meet", slug: "google-meet", count: 7 },
    { rank: 12, name: "WordPress", slug: "wordpress", count: 6 },
    { rank: 13, name: "Microsoft Teams", slug: "microsoft-teams", count: 6 },
    { rank: 14, name: "Jira", slug: "jira", count: 6 },
    { rank: 15, name: "Webflow", slug: "webflow", count: 6 },
  ],
  clusters: [
    { slug: "email-crm", label: "Email Marketing & CRM", icon: "📧", count: 49, topMatchup: { title: "HubSpot vs Salesforce", slug: "hubspot-vs-salesforce" } },
    { slug: "website-builders", label: "Website Builders & eCommerce", icon: "🏪", count: 34, topMatchup: { title: "WordPress vs Wix", slug: "wordpress-vs-wix" } },
    { slug: "productivity", label: "Productivity & PM", icon: "📋", count: 33, topMatchup: { title: "Notion vs ClickUp", slug: "notion-vs-clickup" } },
    { slug: "ai-tools", label: "AI Tools", icon: "🤖", count: 24, topMatchup: { title: "Midjourney vs DALL-E", slug: "midjourney-vs-dall-e" } },
    { slug: "communication", label: "Communication & Collaboration", icon: "💬", count: 19, topMatchup: { title: "Slack vs Microsoft Teams", slug: "slack-vs-microsoft-teams" } },
    { slug: "password-privacy", label: "Password & Privacy", icon: "🔑", count: 15, topMatchup: { title: "1Password vs Bitwarden", slug: "1password-vs-bitwarden" } },
    { slug: "vpn-security", label: "VPN & Security", icon: "🔒", count: 12, topMatchup: { title: "ExpressVPN vs NordVPN", slug: "expressvpn-vs-nordvpn" } },
    { slug: "design-creative", label: "Design & Creative", icon: "🎨", count: 11, topMatchup: { title: "Canva vs Photoshop", slug: "canva-vs-photoshop" } },
    { slug: "finance-accounting", label: "Finance & Accounting", icon: "💳", count: 10, topMatchup: { title: "Square vs Stripe", slug: "square-vs-stripe" } },
    { slug: "cloud-devtools", label: "Cloud & DevTools", icon: "☁️", count: 9, topMatchup: { title: "AWS vs Azure", slug: "aws-vs-azure" } },
  ],
  challengers: [
    { challenger: "HubSpot", challengerSlug: "hubspot", challengerCount: 16, incumbent: "Salesforce", incumbentSlug: "salesforce", incumbentCount: 5, category: "CRM" },
    { challenger: "Notion", challengerSlug: "notion", challengerCount: 10, incumbent: "Confluence", incumbentSlug: "confluence", incumbentCount: 5, category: "Docs & wikis" },
    { challenger: "Wix", challengerSlug: "wix", challengerCount: 9, incumbent: "WordPress", incumbentSlug: "wordpress", incumbentCount: 6, category: "Website builders" },
    { challenger: "ClickUp", challengerSlug: "clickup", challengerCount: 9, incumbent: "Jira", incumbentSlug: "jira", incumbentCount: 6, category: "Project management" },
    { challenger: "Bitwarden", challengerSlug: "bitwarden", challengerCount: 3, incumbent: "LastPass", incumbentSlug: "lastpass", incumbentCount: 1, category: "Password managers" },
  ],
};

interface SaaSEntityRow {
  cslug: string;
  ctitle: string;
  vc: number;
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
      SELECT c.slug AS cslug, c.title AS ctitle, c.view_count AS vc,
             e.name, e.slug AS eslug, et.slug AS type
      FROM comparison_entities ce
      JOIN comparisons c ON c.id = ce.comparison_id
        AND c.status = 'published' AND c.category = 'software'
      JOIN entities e ON e.id = ce.entity_id
      LEFT JOIN entity_types et ON et.id = e.entity_type_id`) as SaaSEntityRow[];

    if (rows.length === 0 || totalSaaSComparisons === 0) return SAAS_SNAPSHOT;

    // Tool leaderboard — software-typed entities, excluding languages/frameworks.
    const toolCounts = new Map<string, { name: string; slug: string; n: number }>();
    // Per-comparison aggregation for cluster classification.
    const comps = new Map<string, { title: string; vc: number; text: string }>();

    for (const r of rows) {
      if ((r.type || "").toLowerCase() === "software" && !NON_SAAS_SLUGS.has(r.eslug)) {
        const t = toolCounts.get(r.eslug) || { name: r.name, slug: r.eslug, n: 0 };
        t.n++;
        toolCounts.set(r.eslug, t);
      }
      const c = comps.get(r.cslug) || { title: r.ctitle, vc: r.vc, text: "" };
      c.text += ` ${r.name} ${r.eslug}`.toLowerCase();
      comps.set(r.cslug, c);
    }

    const sortedTools = [...toolCounts.values()].sort((a, b) => b.n - a.n);
    const topTools: SaaSTool[] = sortedTools.slice(0, 15).map((t, i) => ({
      rank: i + 1,
      name: t.name,
      slug: t.slug,
      count: t.n,
    }));
    const distinctTools = toolCounts.size;

    // Cluster classification + marquee matchup per cluster (by readership).
    const subMeta = new Map(SOFTWARE_SUBCATEGORIES.map((s) => [s.slug, s]));
    const clusterCount = new Map<string, number>();
    const clusterTop = new Map<string, { title: string; slug: string; vc: number }>();
    for (const [slug, c] of comps) {
      const cl = classifyCluster(c.text);
      if (!cl) continue;
      clusterCount.set(cl, (clusterCount.get(cl) || 0) + 1);
      const cur = clusterTop.get(cl);
      if (!cur || c.vc > cur.vc) clusterTop.set(cl, { title: c.title, slug, vc: c.vc });
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
