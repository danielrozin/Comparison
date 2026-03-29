/**
 * Keyword Service
 * Manages keyword opportunities and content brief generation
 */

import type { DiscoveredOpportunity } from "@/lib/dataforseo/keyword-discovery";
import { getPrisma } from "@/lib/db/prisma";
import { comparisonSlug } from "@/lib/utils/slugify";

/**
 * Store discovered keyword opportunities in the database
 * Deduplicates by keyword, updates if existing
 */
export async function storeKeywordOpportunities(
  opportunities: DiscoveredOpportunity[]
): Promise<{ created: number; updated: number }> {
  const prisma = getPrisma();
  if (!prisma) {
    console.warn("storeKeywordOpportunities: database not available, skipping");
    return { created: 0, updated: 0 };
  }

  let created = 0;
  let updated = 0;

  for (const opp of opportunities) {
    const result = await prisma.keywordOpportunity.upsert({
      where: { keyword: opp.keyword },
      update: {
        searchVolume: opp.searchVolume,
        cpc: opp.cpc,
        competition: opp.competition,
        difficulty: opp.difficulty,
        intent: opp.intent,
        entityA: opp.entityA,
        entityB: opp.entityB,
        queryPattern: opp.queryPattern,
        category: opp.category,
        opportunityScore: opp.opportunityScore,
        source: opp.source,
      },
      create: {
        keyword: opp.keyword,
        searchVolume: opp.searchVolume,
        cpc: opp.cpc,
        competition: opp.competition,
        difficulty: opp.difficulty,
        intent: opp.intent,
        entityA: opp.entityA,
        entityB: opp.entityB,
        queryPattern: opp.queryPattern,
        category: opp.category,
        opportunityScore: opp.opportunityScore,
        source: opp.source,
        status: "discovered",
      },
    });

    if (result.createdAt.getTime() === result.updatedAt.getTime()) {
      created++;
    } else {
      updated++;
    }
  }

  return { created, updated };
}

/**
 * Get top keyword opportunities that don't have existing pages
 */
export async function getTopUnbuiltOpportunities(
  limit: number = 50,
  category?: string
): Promise<DiscoveredOpportunity[]> {
  const prisma = getPrisma();
  if (!prisma) return [];

  const rows = await prisma.keywordOpportunity.findMany({
    where: {
      hasExistingPage: false,
      status: "discovered",
      ...(category ? { category } : {}),
    },
    orderBy: { opportunityScore: "desc" },
    take: limit,
  });

  return rows.map((r) => ({
    keyword: r.keyword,
    searchVolume: r.searchVolume ?? 0,
    cpc: r.cpc ?? 0,
    competition: r.competition ?? 0,
    difficulty: r.difficulty ?? 0,
    intent: r.intent ?? "informational",
    entityA: r.entityA,
    entityB: r.entityB,
    queryPattern: r.queryPattern,
    category: r.category,
    opportunityScore: r.opportunityScore ?? 0,
    source: r.source ?? "unknown",
  }));
}

/**
 * Generate a content brief from a keyword opportunity
 */
export function generateContentBrief(opportunity: DiscoveredOpportunity) {
  const slug = opportunity.entityA && opportunity.entityB
    ? comparisonSlug(opportunity.entityA, opportunity.entityB)
    : null;

  return {
    title: opportunity.entityA && opportunity.entityB
      ? `${capitalize(opportunity.entityA)} vs ${capitalize(opportunity.entityB)}`
      : opportunity.keyword,
    slug,
    category: opportunity.category,
    entityA: opportunity.entityA,
    entityB: opportunity.entityB,
    keyword: opportunity.keyword,
    searchVolume: opportunity.searchVolume,
    brief: {
      targetKeyword: opportunity.keyword,
      relatedKeywords: [], // TODO: populate from cluster
      sections: [
        "Short Answer",
        "Key Differences",
        "Comparison Table",
        "Pros & Cons",
        "Verdict",
        "FAQ",
      ],
      notes: `Opportunity score: ${opportunity.opportunityScore}. Source: ${opportunity.source}.`,
    },
  };
}

function capitalize(s: string): string {
  return s.replace(/\b\w/g, (l) => l.toUpperCase());
}
