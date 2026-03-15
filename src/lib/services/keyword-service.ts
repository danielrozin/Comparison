/**
 * Keyword Service
 * Manages keyword opportunities and content brief generation
 */

import type { DiscoveredOpportunity } from "@/lib/dataforseo/keyword-discovery";
import { comparisonSlug } from "@/lib/utils/slugify";

/**
 * Store discovered keyword opportunities in the database
 * Deduplicates by keyword, updates if existing
 */
export async function storeKeywordOpportunities(
  opportunities: DiscoveredOpportunity[]
): Promise<{ created: number; updated: number }> {
  let created = 0;
  let updated = 0;

  for (const opp of opportunities) {
    // TODO: Implement with Prisma upsert
    // const existing = await prisma.keywordOpportunity.findUnique({ where: { keyword: opp.keyword } });
    // if (existing) {
    //   await prisma.keywordOpportunity.update({ ... });
    //   updated++;
    // } else {
    //   await prisma.keywordOpportunity.create({ ... });
    //   created++;
    // }
    created++; // placeholder
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
  // TODO: Implement with Prisma
  // return prisma.keywordOpportunity.findMany({
  //   where: { hasExistingPage: false, status: "discovered", ...(category && { category }) },
  //   orderBy: { opportunityScore: "desc" },
  //   take: limit,
  // });
  return [];
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
