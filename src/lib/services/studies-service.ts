/**
 * Studies Service
 * Powers data-study / "link-bait" pages built from the comparison database.
 * Aggregates which brands and matchups get compared most across the site.
 *
 * Uses Prisma when DATABASE_URL is set; falls back to a baked-in snapshot
 * (last refreshed manually) so the public study page is never empty — this
 * matters because the page exists to earn citations and inbound links.
 */

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
