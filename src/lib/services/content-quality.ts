/**
 * Content Quality Scorer
 *
 * Evaluates comparison pages on multiple dimensions to identify thin,
 * incomplete, or low-quality content that needs improvement.
 *
 * Scoring dimensions (0-100 total):
 * - Completeness: entities, attributes, FAQs, verdict, short answer (40pts)
 * - Depth: attribute count, pros/cons, key differences (30pts)
 * - SEO readiness: title length, meta signals, structured data potential (15pts)
 * - Freshness: age since last update (15pts)
 */

import type { ComparisonPageData } from "@/types";

export interface ContentQualityScore {
  slug: string;
  title: string;
  category: string | null;
  totalScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  completeness: number;
  depth: number;
  seoReadiness: number;
  freshness: number;
  issues: string[];
}

function scoreCompleteness(comp: ComparisonPageData): { score: number; issues: string[] } {
  let score = 0;
  const issues: string[] = [];

  // Has 2 entities (required)
  if (comp.entities.length >= 2) {
    score += 8;
  } else {
    issues.push("Missing entity data — needs at least 2 entities");
  }

  // Has verdict
  if (comp.verdict && comp.verdict.length > 20) {
    score += 8;
  } else {
    issues.push("Missing or too-short verdict");
  }

  // Has short answer
  if (comp.shortAnswer && comp.shortAnswer.length > 30) {
    score += 6;
  } else {
    issues.push("Missing or too-short quick answer");
  }

  // Has FAQs
  if (comp.faqs.length >= 3) {
    score += 6;
  } else if (comp.faqs.length >= 1) {
    score += 3;
    issues.push(`Only ${comp.faqs.length} FAQ(s) — aim for 3+`);
  } else {
    issues.push("No FAQs — add at least 3 for rich snippet eligibility");
  }

  // Has key differences
  if (comp.keyDifferences.length >= 3) {
    score += 6;
  } else if (comp.keyDifferences.length >= 1) {
    score += 3;
    issues.push(`Only ${comp.keyDifferences.length} key difference(s) — aim for 3+`);
  } else {
    issues.push("No key differences listed");
  }

  // Has attributes
  if (comp.attributes.length >= 5) {
    score += 6;
  } else if (comp.attributes.length >= 1) {
    score += 3;
    issues.push(`Only ${comp.attributes.length} attribute(s) — aim for 5+`);
  } else {
    issues.push("No comparison attributes — critical gap");
  }

  return { score: Math.min(score, 40), issues };
}

function scoreDepth(comp: ComparisonPageData): { score: number; issues: string[] } {
  let score = 0;
  const issues: string[] = [];

  // Attribute count depth
  if (comp.attributes.length >= 10) {
    score += 10;
  } else if (comp.attributes.length >= 5) {
    score += 6;
  } else {
    score += Math.min(comp.attributes.length * 1.5, 5);
  }

  // Pros/cons per entity
  const totalPros = comp.entities.reduce((s, e) => s + e.pros.length, 0);
  const totalCons = comp.entities.reduce((s, e) => s + e.cons.length, 0);

  if (totalPros >= 4 && totalCons >= 4) {
    score += 10;
  } else if (totalPros >= 2 && totalCons >= 2) {
    score += 5;
    issues.push("Thin pros/cons — aim for 2+ per entity");
  } else {
    issues.push("Missing pros/cons for entities");
  }

  // Best-for recommendations
  const bestForCount = comp.entities.filter((e) => e.bestFor && e.bestFor.length > 5).length;
  if (bestForCount >= 2) {
    score += 5;
  } else {
    issues.push("Missing 'best for' recommendations on entities");
  }

  // Entity descriptions
  const descCount = comp.entities.filter((e) => e.shortDesc && e.shortDesc.length > 20).length;
  if (descCount >= 2) {
    score += 5;
  } else {
    issues.push("Entity descriptions are thin or missing");
  }

  return { score: Math.min(score, 30), issues };
}

function scoreSEOReadiness(comp: ComparisonPageData): { score: number; issues: string[] } {
  let score = 0;
  const issues: string[] = [];

  // Title quality
  if (comp.title.length >= 30 && comp.title.length <= 60) {
    score += 5;
  } else if (comp.title.length > 60) {
    score += 3;
    issues.push(`Title too long (${comp.title.length} chars) — may be truncated in SERPs`);
  } else {
    score += 2;
    issues.push("Title too short for optimal SERP display");
  }

  // Has category (helps internal linking)
  if (comp.category) {
    score += 3;
  } else {
    issues.push("No category assigned — hurts internal linking");
  }

  // Related comparisons (internal links)
  if (comp.relatedComparisons.length >= 3) {
    score += 4;
  } else if (comp.relatedComparisons.length >= 1) {
    score += 2;
    issues.push("Fewer than 3 related comparisons — weak internal linking");
  } else {
    issues.push("No related comparisons — page is an SEO dead end");
  }

  // Entity images
  const imageCount = comp.entities.filter((e) => e.imageUrl).length;
  if (imageCount >= 2) {
    score += 3;
  } else {
    issues.push("Missing entity images — reduces visual SERP appeal");
  }

  return { score: Math.min(score, 15), issues };
}

function scoreFreshness(comp: ComparisonPageData): { score: number; issues: string[] } {
  const issues: string[] = [];
  const updatedAt = comp.metadata?.updatedAt;

  if (!updatedAt) {
    issues.push("No updatedAt timestamp — freshness unknown");
    return { score: 5, issues };
  }

  const daysSinceUpdate = (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24);

  if (daysSinceUpdate <= 7) return { score: 15, issues };
  if (daysSinceUpdate <= 30) return { score: 12, issues };
  if (daysSinceUpdate <= 90) {
    issues.push(`Content last updated ${Math.round(daysSinceUpdate)} days ago`);
    return { score: 8, issues };
  }

  issues.push(`Stale content — ${Math.round(daysSinceUpdate)} days since last update`);
  return { score: Math.max(15 - Math.floor(daysSinceUpdate / 30) * 2, 0), issues };
}

function gradeFromScore(score: number): ContentQualityScore["grade"] {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 50) return "C";
  if (score >= 30) return "D";
  return "F";
}

/**
 * Score a single comparison page for content quality.
 */
export function scoreComparison(comp: ComparisonPageData): ContentQualityScore {
  const completenessResult = scoreCompleteness(comp);
  const depthResult = scoreDepth(comp);
  const seoResult = scoreSEOReadiness(comp);
  const freshnessResult = scoreFreshness(comp);

  const totalScore =
    completenessResult.score +
    depthResult.score +
    seoResult.score +
    freshnessResult.score;

  return {
    slug: comp.slug,
    title: comp.title,
    category: comp.category,
    totalScore,
    grade: gradeFromScore(totalScore),
    completeness: completenessResult.score,
    depth: depthResult.score,
    seoReadiness: seoResult.score,
    freshness: freshnessResult.score,
    issues: [
      ...completenessResult.issues,
      ...depthResult.issues,
      ...seoResult.issues,
      ...freshnessResult.issues,
    ],
  };
}

/**
 * Score all comparison pages and return sorted by quality (lowest first).
 */
export async function scoreAllComparisons(): Promise<{
  scores: ContentQualityScore[];
  summary: {
    total: number;
    avgScore: number;
    gradeDistribution: Record<string, number>;
    topIssues: { issue: string; count: number }[];
  };
}> {
  // Lazy import to avoid circular dependency
  const { getAllMockSlugs, getMockComparison } = await import("./mock-data");

  const slugs = getAllMockSlugs();
  const scores: ContentQualityScore[] = [];

  for (const slug of slugs) {
    const comp = getMockComparison(slug);
    if (!comp) continue;
    scores.push(scoreComparison(comp));
  }

  // Sort lowest score first (worst content at top)
  scores.sort((a, b) => a.totalScore - b.totalScore);

  // Aggregate stats
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((s, c) => s + c.totalScore, 0) / scores.length)
    : 0;

  const gradeDistribution: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  for (const s of scores) gradeDistribution[s.grade]++;

  // Most common issues
  const issueCounts = new Map<string, number>();
  for (const s of scores) {
    for (const issue of s.issues) {
      issueCounts.set(issue, (issueCounts.get(issue) || 0) + 1);
    }
  }
  const topIssues = Array.from(issueCounts.entries())
    .map(([issue, count]) => ({ issue, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    scores,
    summary: {
      total: scores.length,
      avgScore,
      gradeDistribution,
      topIssues,
    },
  };
}
