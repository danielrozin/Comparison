/**
 * Internal Linking Engine
 *
 * Multi-signal scoring system that auto-suggests related comparisons.
 * Signals (in priority order):
 *   1. Entity overlap — comparisons sharing an entity with the current one
 *   2. Explicit InternalLink records — manually curated or AI-generated
 *   3. Same category — weighted by viewCount (engagement proxy)
 *   4. Related category — via RELATED_CATEGORIES mapping
 *
 * Falls back to mock-data matching when DB is unavailable.
 */

import type { RelatedComparison } from "@/types";
import { getRedis } from "./redis";
import {
  getMockComparison,
  getAllMockSlugs,
} from "./mock-data";

// Category affinity map (same as InternalLinks component)
const RELATED_CATEGORIES: Record<string, string[]> = {
  sports: ["celebrities"],
  countries: ["military", "economy"],
  technology: ["products", "companies"],
  products: ["technology", "brands"],
  celebrities: ["sports"],
  history: ["military", "countries"],
  military: ["countries", "history"],
  economy: ["countries", "companies"],
  companies: ["brands", "technology", "economy"],
  brands: ["products", "companies"],
  health: ["products"],
  entertainment: ["celebrities"],
  automotive: ["products", "technology"],
  software: ["technology", "companies"],
  finance: ["economy", "companies"],
  education: [],
  travel: ["countries"],
};

// Signal weights
const WEIGHT_ENTITY_OVERLAP = 50;
const WEIGHT_EXPLICIT_LINK = 40;
const WEIGHT_SAME_CATEGORY = 20;
const WEIGHT_RELATED_CATEGORY = 10;
const WEIGHT_VIEW_BOOST_MAX = 15; // log-scaled viewCount bonus

const CACHE_TTL = 600; // 10 min

export interface ScoredLink extends RelatedComparison {
  score: number;
  signals: string[];
}

export interface LinkingEngineInput {
  comparisonId: string;
  slug: string;
  category: string | null;
  entitySlugs: string[]; // slugs of entities in this comparison
}

// ---------------------------------------------------------------------------
// Lazy prisma import
// ---------------------------------------------------------------------------
function getPrismaClient() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getPrisma } = require("@/lib/db/prisma");
    return getPrisma();
  } catch {
    return null;
  }
}

async function getFromCache<T>(key: string): Promise<T | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    return await redis.get<T>(key);
  } catch {
    return null;
  }
}

async function setCache(key: string, value: unknown, ttl: number): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.set(key, value, { ex: ttl });
  } catch {
    // cache is optional
  }
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export async function getLinkedComparisons(
  input: LinkingEngineInput,
  limit: number = 12
): Promise<ScoredLink[]> {
  const cacheKey = `linking:${input.slug}:${limit}`;
  const cached = await getFromCache<ScoredLink[]>(cacheKey);
  if (cached) return cached;

  const prisma = getPrismaClient();
  let results: ScoredLink[];

  if (prisma) {
    results = await getLinksFromDb(prisma, input, limit);
  } else {
    results = getLinksFromMock(input, limit);
  }

  if (results.length > 0) {
    await setCache(cacheKey, results, CACHE_TTL);
  }
  return results;
}

// ---------------------------------------------------------------------------
// DB-backed linking
// ---------------------------------------------------------------------------

async function getLinksFromDb(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any,
  input: LinkingEngineInput,
  limit: number
): Promise<ScoredLink[]> {
  const scored = new Map<string, ScoredLink>();

  const addCandidate = (
    slug: string,
    title: string,
    category: string | null,
    signal: string,
    weight: number,
    viewCount: number = 0
  ) => {
    if (slug === input.slug) return; // exclude self
    const existing = scored.get(slug);
    const viewBoost = viewCount > 0 ? Math.min(Math.log10(viewCount + 1) * 5, WEIGHT_VIEW_BOOST_MAX) : 0;
    if (existing) {
      existing.score += weight;
      if (!existing.signals.includes(signal)) existing.signals.push(signal);
    } else {
      scored.set(slug, {
        slug,
        title,
        category,
        score: weight + viewBoost,
        signals: [signal],
      });
    }
  };

  // --- Signal 1: Entity overlap ---
  // Find all comparisons that share at least one entity with the current comparison
  if (input.entitySlugs.length > 0) {
    try {
      const overlapping = await prisma.comparisonEntity.findMany({
        where: {
          entity: { slug: { in: input.entitySlugs } },
          comparison: {
            slug: { not: input.slug },
            status: "published",
          },
        },
        select: {
          comparison: {
            select: { slug: true, title: true, category: true, viewCount: true },
          },
        },
        take: 50,
      });
      for (const row of overlapping) {
        addCandidate(
          row.comparison.slug,
          row.comparison.title,
          row.comparison.category,
          "entity_overlap",
          WEIGHT_ENTITY_OVERLAP,
          row.comparison.viewCount
        );
      }
    } catch (e) {
      console.warn("Linking engine: entity overlap query failed:", e);
    }
  }

  // --- Signal 2: Explicit InternalLink records ---
  try {
    const fromPath = `/compare/${input.slug}`;
    const explicitLinks = await prisma.internalLink.findMany({
      where: { fromPath },
      select: { toPath: true, anchorText: true, score: true, linkType: true },
      take: 20,
    });
    for (const link of explicitLinks) {
      // Extract slug from toPath (e.g. "/compare/messi-vs-haaland" -> "messi-vs-haaland")
      const match = link.toPath.match(/^\/compare\/(.+)$/);
      if (match) {
        addCandidate(
          match[1],
          link.anchorText || match[1].replace(/-/g, " "),
          null,
          `explicit_${link.linkType}`,
          WEIGHT_EXPLICIT_LINK * (link.score || 1)
        );
      }
    }
  } catch (e) {
    console.warn("Linking engine: explicit links query failed:", e);
  }

  // --- Signal 3: Same category ---
  if (input.category) {
    try {
      const sameCat = await prisma.comparison.findMany({
        where: {
          category: input.category,
          slug: { not: input.slug },
          status: "published",
        },
        select: { slug: true, title: true, category: true, viewCount: true },
        orderBy: { viewCount: "desc" },
        take: 20,
      });
      for (const row of sameCat) {
        addCandidate(
          row.slug,
          row.title,
          row.category,
          "same_category",
          WEIGHT_SAME_CATEGORY,
          row.viewCount
        );
      }
    } catch (e) {
      console.warn("Linking engine: same category query failed:", e);
    }
  }

  // --- Signal 4: Related categories ---
  const relatedCats = input.category ? (RELATED_CATEGORIES[input.category] || []) : [];
  if (relatedCats.length > 0) {
    try {
      const relCat = await prisma.comparison.findMany({
        where: {
          category: { in: relatedCats },
          slug: { not: input.slug },
          status: "published",
        },
        select: { slug: true, title: true, category: true, viewCount: true },
        orderBy: { viewCount: "desc" },
        take: 15,
      });
      for (const row of relCat) {
        addCandidate(
          row.slug,
          row.title,
          row.category,
          "related_category",
          WEIGHT_RELATED_CATEGORY,
          row.viewCount
        );
      }
    } catch (e) {
      console.warn("Linking engine: related category query failed:", e);
    }
  }

  return rankAndLimit(scored, limit);
}

// ---------------------------------------------------------------------------
// Mock-data fallback
// ---------------------------------------------------------------------------

function getLinksFromMock(input: LinkingEngineInput, limit: number): ScoredLink[] {
  const scored = new Map<string, ScoredLink>();
  const allSlugs = getAllMockSlugs();

  for (const slug of allSlugs) {
    if (slug === input.slug) continue;
    const comp = getMockComparison(slug);
    if (!comp) continue;

    let score = 0;
    const signals: string[] = [];

    // Entity overlap: check if any entity slug appears in the other comparison's entity slugs
    const otherEntitySlugs = comp.entities.map((e) => e.slug);
    const overlap = input.entitySlugs.filter((s) => otherEntitySlugs.includes(s));
    if (overlap.length > 0) {
      score += WEIGHT_ENTITY_OVERLAP * overlap.length;
      signals.push("entity_overlap");
    }

    // Same category
    if (input.category && comp.category === input.category) {
      score += WEIGHT_SAME_CATEGORY;
      signals.push("same_category");
    }

    // Related category
    const relatedCats = input.category ? (RELATED_CATEGORIES[input.category] || []) : [];
    if (comp.category && relatedCats.includes(comp.category)) {
      score += WEIGHT_RELATED_CATEGORY;
      signals.push("related_category");
    }

    // View boost
    const viewBoost = comp.metadata.viewCount > 0
      ? Math.min(Math.log10(comp.metadata.viewCount + 1) * 5, WEIGHT_VIEW_BOOST_MAX)
      : 0;
    score += viewBoost;

    if (score > 0) {
      scored.set(slug, {
        slug: comp.slug,
        title: comp.title,
        category: comp.category,
        score,
        signals,
      });
    }
  }

  return rankAndLimit(scored, limit);
}

// ---------------------------------------------------------------------------
// Rank & limit
// ---------------------------------------------------------------------------

function rankAndLimit(scored: Map<string, ScoredLink>, limit: number): ScoredLink[] {
  return Array.from(scored.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
