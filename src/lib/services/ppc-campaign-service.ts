/**
 * PPC Campaign Service
 * Analyzes keyword opportunities for Google Ads targeting
 * and generates structured campaign plans.
 */

import { getPrisma } from "@/lib/db/prisma";
import { comparisonSlug } from "@/lib/utils/slugify";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aversusb.net";

export interface PPCKeyword {
  keyword: string;
  searchVolume: number;
  cpc: number;
  competition: number;
  difficulty: number;
  entityA: string | null;
  entityB: string | null;
  category: string | null;
  opportunityScore: number;
  landingPageSlug: string | null;
  landingPageUrl: string | null;
  hasLandingPage: boolean;
  estimatedCostPerClick: number;
  estimatedMonthlyClicks: number;
  matchType: "exact" | "phrase" | "broad";
}

export interface AdGroup {
  name: string;
  category: string;
  keywords: PPCKeyword[];
  headlines: string[];
  descriptions: string[];
  landingPageUrl: string;
}

export interface CampaignPlan {
  campaignName: string;
  dailyBudget: number;
  monthlyBudget: number;
  adGroups: AdGroup[];
  totalKeywords: number;
  estimatedMonthlyClicks: number;
  estimatedAvgCpc: number;
  topKeywordsByVolume: PPCKeyword[];
  topKeywordsByCpc: PPCKeyword[];
}

/**
 * Get top PPC-eligible keywords: high CPC comparison keywords that have landing pages.
 */
export async function getPPCKeywords(
  limit: number = 50,
  minCpc: number = 0.5,
  minVolume: number = 100
): Promise<PPCKeyword[]> {
  const prisma = getPrisma();
  if (!prisma) return [];

  // Get keyword opportunities with high CPC
  const keywords = await prisma.keywordOpportunity.findMany({
    where: {
      cpc: { gte: minCpc },
      searchVolume: { gte: minVolume },
      entityA: { not: null },
      entityB: { not: null },
    },
    orderBy: [
      { cpc: "desc" },
      { searchVolume: "desc" },
    ],
    take: limit * 2, // Fetch extra to filter after matching landing pages
  });

  // Check which keywords have existing comparison pages
  const results: PPCKeyword[] = [];

  for (const kw of keywords) {
    let slug: string | null = null;
    let hasPage = false;

    if (kw.entityA && kw.entityB) {
      slug = comparisonSlug(kw.entityA, kw.entityB);
      const existing = await prisma.comparison.findUnique({
        where: { slug },
        select: { id: true },
      });
      hasPage = !!existing;
    }

    results.push({
      keyword: kw.keyword,
      searchVolume: kw.searchVolume ?? 0,
      cpc: kw.cpc ?? 0,
      competition: kw.competition ?? 0,
      difficulty: kw.difficulty ?? 0,
      entityA: kw.entityA,
      entityB: kw.entityB,
      category: kw.category,
      opportunityScore: kw.opportunityScore ?? 0,
      landingPageSlug: slug,
      landingPageUrl: hasPage && slug ? `${SITE_URL}/compare/${slug}` : null,
      hasLandingPage: hasPage,
      estimatedCostPerClick: kw.cpc ?? 0,
      estimatedMonthlyClicks: estimateClicks(kw.searchVolume ?? 0, kw.competition ?? 0),
      matchType: selectMatchType(kw.searchVolume ?? 0, kw.cpc ?? 0),
    });
  }

  // Prioritize keywords with landing pages, then by CPC
  results.sort((a, b) => {
    if (a.hasLandingPage !== b.hasLandingPage) return a.hasLandingPage ? -1 : 1;
    return b.cpc - a.cpc;
  });

  return results.slice(0, limit);
}

/**
 * Generate a Google Ads campaign plan from top PPC keywords.
 */
export async function generateCampaignPlan(
  monthlyBudget: number = 2000
): Promise<CampaignPlan> {
  const keywords = await getPPCKeywords(60, 0.5, 100);

  // Group by category into ad groups
  const categoryGroups = new Map<string, PPCKeyword[]>();
  for (const kw of keywords) {
    const cat = kw.category || "general";
    if (!categoryGroups.has(cat)) categoryGroups.set(cat, []);
    categoryGroups.get(cat)!.push(kw);
  }

  const adGroups: AdGroup[] = [];
  for (const [category, kws] of categoryGroups) {
    // Take top 10 per ad group
    const topKws = kws.slice(0, 10);
    const bestKw = topKws[0];

    adGroups.push({
      name: `${capitalize(category)} Comparisons`,
      category,
      keywords: topKws,
      headlines: generateHeadlines(category, topKws),
      descriptions: generateDescriptions(category),
      landingPageUrl: bestKw.landingPageUrl || `${SITE_URL}/category/${category}`,
    });
  }

  // Sort ad groups by total keyword volume
  adGroups.sort((a, b) => {
    const volA = a.keywords.reduce((s, k) => s + k.searchVolume, 0);
    const volB = b.keywords.reduce((s, k) => s + k.searchVolume, 0);
    return volB - volA;
  });

  const allKws = adGroups.flatMap((g) => g.keywords);
  const avgCpc = allKws.length > 0
    ? allKws.reduce((s, k) => s + k.cpc, 0) / allKws.length
    : 0;
  const estClicks = monthlyBudget > 0 && avgCpc > 0
    ? Math.round(monthlyBudget / avgCpc)
    : 0;

  return {
    campaignName: "AvsB - Search Comparisons",
    dailyBudget: Math.round((monthlyBudget / 30) * 100) / 100,
    monthlyBudget,
    adGroups: adGroups.slice(0, 10), // Max 10 ad groups
    totalKeywords: allKws.length,
    estimatedMonthlyClicks: estClicks,
    estimatedAvgCpc: Math.round(avgCpc * 100) / 100,
    topKeywordsByVolume: [...allKws].sort((a, b) => b.searchVolume - a.searchVolume).slice(0, 20),
    topKeywordsByCpc: [...allKws].sort((a, b) => b.cpc - a.cpc).slice(0, 20),
  };
}

function estimateClicks(volume: number, competition: number): number {
  // Estimate clicks assuming ~3% CTR for position 3-4, adjusted by competition
  const baseCtr = 0.03;
  const competitionFactor = 1 - (competition * 0.5);
  return Math.round(volume * baseCtr * competitionFactor);
}

function selectMatchType(volume: number, cpc: number): "exact" | "phrase" | "broad" {
  if (cpc > 3) return "exact";      // High CPC — tight control
  if (volume > 5000) return "phrase"; // High volume — moderate reach
  return "broad";                     // Low volume — maximize reach
}

function generateHeadlines(category: string, keywords: PPCKeyword[]): string[] {
  const cat = capitalize(category);
  const headlines = [
    `Compare ${cat} Side by Side`,
    `${cat} Comparison Guide`,
    `Which Is Better? Find Out`,
    `Unbiased ${cat} Comparisons`,
    `Data-Driven ${cat} Reviews`,
  ];

  // Add entity-specific headlines from top keywords
  for (const kw of keywords.slice(0, 3)) {
    if (kw.entityA && kw.entityB) {
      const h = `${capitalize(kw.entityA)} vs ${capitalize(kw.entityB)}`;
      if (h.length <= 30) headlines.push(h);
    }
  }

  return headlines.slice(0, 15); // Google Ads max 15 headlines
}

function generateDescriptions(category: string): string[] {
  const cat = capitalize(category);
  return [
    `Compare ${cat} with data-driven analysis. See key differences, pros & cons, and our expert verdict.`,
    `Make smarter choices with our detailed ${cat.toLowerCase()} comparisons. Free, fast, and unbiased.`,
    `The internet's best ${cat.toLowerCase()} comparison tool. Trusted by millions of readers.`,
    `Stop guessing. Our ${cat.toLowerCase()} comparisons give you the facts you need to decide.`,
  ];
}

function capitalize(s: string): string {
  return s.replace(/\b\w/g, (l) => l.toUpperCase());
}
