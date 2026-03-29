/**
 * Content Syndication Service
 * Converts comparisons and blog articles into platform-specific formats
 * for Medium, dev.to, and LinkedIn. Tracks syndication status in the database.
 * Server-side only.
 */

import type { ComparisonPageData } from "@/types";

const BASE_URL = "https://www.aversusb.net";

export type SyndicationPlatform = "medium" | "devto" | "linkedin";

export interface SyndicatedArticle {
  sourceType: "comparison" | "blog";
  sourceSlug: string;
  sourceTitle: string;
  platform: SyndicationPlatform;
  canonicalUrl: string;
  formattedTitle: string;
  formattedBody: string;
  utmCampaign: string;
  utmSource: string;
}

export interface SyndicationCandidate {
  type: "comparison" | "blog";
  slug: string;
  title: string;
  category: string | null;
  viewCount: number;
  publishedAt: Date | string | null;
}

function getPrismaClient() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getPrisma } = require("@/lib/db/prisma");
    return getPrisma();
  } catch {
    return null;
  }
}

function buildUtmUrl(path: string, platform: SyndicationPlatform): string {
  const params = new URLSearchParams({
    utm_source: platform,
    utm_medium: "syndication",
    utm_campaign: "content-syndication",
  });
  return `${BASE_URL}${path}?${params.toString()}`;
}

// ============================================================
// Content Formatters — convert to platform-specific markdown
// ============================================================

function formatComparisonForMedium(comparison: ComparisonPageData): { title: string; body: string } {
  const entityA = comparison.entities[0];
  const entityB = comparison.entities[1];
  const canonicalUrl = buildUtmUrl(`/compare/${comparison.slug}`, "medium");

  let body = "";

  if (comparison.shortAnswer) {
    body += `*${comparison.shortAnswer}*\n\n`;
  }

  body += `---\n\n`;

  // Key differences
  if (comparison.keyDifferences?.length) {
    body += `## Key Differences\n\n`;
    for (const diff of comparison.keyDifferences) {
      body += `- **${diff.label}**: ${entityA?.name ?? "A"} — ${diff.entityAValue} | ${entityB?.name ?? "B"} — ${diff.entityBValue}\n`;
    }
    body += `\n`;
  }

  // Pros and cons
  for (const entity of comparison.entities) {
    if (entity.pros.length || entity.cons.length) {
      body += `## ${entity.name}\n\n`;
      if (entity.bestFor) body += `**Best for:** ${entity.bestFor}\n\n`;
      if (entity.pros.length) {
        body += `**Pros:**\n${entity.pros.map(p => `- ${p}`).join("\n")}\n\n`;
      }
      if (entity.cons.length) {
        body += `**Cons:**\n${entity.cons.map(c => `- ${c}`).join("\n")}\n\n`;
      }
    }
  }

  // Verdict
  if (comparison.verdict) {
    body += `## Verdict\n\n${comparison.verdict}\n\n`;
  }

  // FAQs (pick top 3)
  if (comparison.faqs?.length) {
    body += `## FAQ\n\n`;
    for (const faq of comparison.faqs.slice(0, 3)) {
      body += `**${faq.question}**\n\n${faq.answer}\n\n`;
    }
  }

  // CTA
  body += `---\n\n`;
  body += `*Read the full detailed comparison with interactive data tables at [aversusb.net](${canonicalUrl}).*\n`;

  // Canonical notice
  body += `\n*Originally published at [aversusb.net](${canonicalUrl}).*\n`;

  return {
    title: `${comparison.title}: A Complete Comparison`,
    body,
  };
}

function formatComparisonForDevto(comparison: ComparisonPageData): { title: string; body: string } {
  const entityA = comparison.entities[0];
  const entityB = comparison.entities[1];
  const canonicalUrl = buildUtmUrl(`/compare/${comparison.slug}`, "devto");

  // dev.to front matter
  let body = `---\ntitle: "${comparison.title}"\npublished: false\ntags: ${comparison.category ? `${comparison.category}, comparison` : "comparison"}\ncanonical_url: ${BASE_URL}/compare/${comparison.slug}\n---\n\n`;

  if (comparison.shortAnswer) {
    body += `> ${comparison.shortAnswer}\n\n`;
  }

  // Key differences as a table
  if (comparison.keyDifferences?.length) {
    body += `## Key Differences\n\n`;
    body += `| Feature | ${entityA?.name ?? "A"} | ${entityB?.name ?? "B"} |\n`;
    body += `|---------|${"-".repeat(Math.max(3, (entityA?.name ?? "A").length))}|${"-".repeat(Math.max(3, (entityB?.name ?? "B").length))}|\n`;
    for (const diff of comparison.keyDifferences) {
      body += `| ${diff.label} | ${diff.entityAValue} | ${diff.entityBValue} |\n`;
    }
    body += `\n`;
  }

  // Pros/cons
  for (const entity of comparison.entities) {
    if (entity.pros.length || entity.cons.length) {
      body += `## ${entity.name}\n\n`;
      if (entity.bestFor) body += `> ${entity.bestFor}\n\n`;
      if (entity.pros.length) {
        body += `### Pros\n${entity.pros.map(p => `- ${p}`).join("\n")}\n\n`;
      }
      if (entity.cons.length) {
        body += `### Cons\n${entity.cons.map(c => `- ${c}`).join("\n")}\n\n`;
      }
    }
  }

  if (comparison.verdict) {
    body += `## Verdict\n\n${comparison.verdict}\n\n`;
  }

  body += `---\n\n`;
  body += `[Read the full comparison with interactive tables on aversusb.net](${canonicalUrl})\n`;

  return {
    title: comparison.title,
    body,
  };
}

function formatComparisonForLinkedIn(comparison: ComparisonPageData): { title: string; body: string } {
  const canonicalUrl = buildUtmUrl(`/compare/${comparison.slug}`, "linkedin");

  // LinkedIn articles are shorter and more professional
  let body = "";

  if (comparison.shortAnswer) {
    body += `${comparison.shortAnswer}\n\n`;
  }

  // Condensed key differences
  if (comparison.keyDifferences?.length) {
    body += `Key differences:\n\n`;
    for (const diff of comparison.keyDifferences.slice(0, 5)) {
      body += `- ${diff.label}: ${diff.entityAValue} vs ${diff.entityBValue}\n`;
    }
    body += `\n`;
  }

  // Quick pros summary per entity
  for (const entity of comparison.entities) {
    if (entity.pros.length) {
      body += `${entity.name} strengths: ${entity.pros.slice(0, 3).join(", ")}\n\n`;
    }
  }

  if (comparison.verdict) {
    body += `Bottom line: ${comparison.verdict}\n\n`;
  }

  body += `Read the full analysis: ${canonicalUrl}\n`;

  return {
    title: `${comparison.title} - Which One Wins?`,
    body,
  };
}

interface BlogArticleInput {
  slug: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[];
  excerpt: string | null;
}

function formatBlogForMedium(article: BlogArticleInput): { title: string; body: string } {
  const canonicalUrl = buildUtmUrl(`/blog/${article.slug}`, "medium");

  let body = article.content;

  // Rewrite internal links to absolute URLs with UTM
  body = body.replace(/\[([^\]]+)\]\(\/compare\/([^)]+)\)/g, (_, text, slug) => {
    return `[${text}](${buildUtmUrl(`/compare/${slug}`, "medium")})`;
  });
  body = body.replace(/\[([^\]]+)\]\(\/blog\/([^)]+)\)/g, (_, text, slug) => {
    return `[${text}](${buildUtmUrl(`/blog/${slug}`, "medium")})`;
  });

  body += `\n\n---\n\n*Originally published at [aversusb.net](${canonicalUrl}).*\n`;

  return { title: article.title, body };
}

function formatBlogForDevto(article: BlogArticleInput): { title: string; body: string } {
  const tags = (article.tags || []).slice(0, 4).map(t => t.toLowerCase().replace(/\s+/g, "")).join(", ");

  let body = `---\ntitle: "${article.title}"\npublished: false\ntags: ${tags}\ncanonical_url: ${BASE_URL}/blog/${article.slug}\n---\n\n`;

  let content = article.content;
  // Rewrite internal links
  content = content.replace(/\[([^\]]+)\]\(\/compare\/([^)]+)\)/g, (_, text, slug) => {
    return `[${text}](${buildUtmUrl(`/compare/${slug}`, "devto")})`;
  });
  content = content.replace(/\[([^\]]+)\]\(\/blog\/([^)]+)\)/g, (_, text, slug) => {
    return `[${text}](${buildUtmUrl(`/blog/${slug}`, "devto")})`;
  });

  body += content;
  body += `\n\n---\n\n[Read more on aversusb.net](${buildUtmUrl(`/blog/${article.slug}`, "devto")})\n`;

  return { title: article.title, body };
}

function formatBlogForLinkedIn(article: BlogArticleInput): { title: string; body: string } {
  const canonicalUrl = buildUtmUrl(`/blog/${article.slug}`, "linkedin");

  // LinkedIn gets a condensed version — first ~600 chars + CTA
  const excerpt = article.excerpt || article.content.slice(0, 600);
  let body = `${excerpt}\n\n`;
  body += `Read the full article: ${canonicalUrl}\n`;

  return { title: article.title, body };
}

// ============================================================
// Main syndication logic
// ============================================================

const PLATFORMS: SyndicationPlatform[] = ["medium", "devto", "linkedin"];

export function formatForPlatform(
  sourceType: "comparison" | "blog",
  source: ComparisonPageData | BlogArticleInput,
  platform: SyndicationPlatform
): { title: string; body: string } {
  if (sourceType === "comparison") {
    const comparison = source as ComparisonPageData;
    switch (platform) {
      case "medium": return formatComparisonForMedium(comparison);
      case "devto": return formatComparisonForDevto(comparison);
      case "linkedin": return formatComparisonForLinkedIn(comparison);
    }
  } else {
    const article = source as BlogArticleInput;
    switch (platform) {
      case "medium": return formatBlogForMedium(article);
      case "devto": return formatBlogForDevto(article);
      case "linkedin": return formatBlogForLinkedIn(article);
    }
  }
}

/**
 * Select top candidates for syndication: published content sorted by views,
 * excluding anything already syndicated to the given platform.
 */
export async function selectSyndicationCandidates(
  limit: number = 8
): Promise<SyndicationCandidate[]> {
  const prisma = getPrismaClient();
  if (!prisma) return [];

  // Get already-syndicated slugs
  const existingSyndications = await prisma.syndicatedContent.findMany({
    select: { sourceSlug: true, platform: true },
  });
  const syndicatedSet = new Set(
    existingSyndications.map((s: { sourceSlug: string; platform: string }) => `${s.sourceSlug}::${s.platform}`)
  );

  // Fetch published comparisons sorted by popularity
  const comparisons = await prisma.comparison.findMany({
    where: { status: "published" },
    select: { slug: true, title: true, category: true, viewCount: true, publishedAt: true },
    orderBy: [{ viewCount: "desc" }, { publishedAt: "desc" }],
    take: limit * 3,
  });

  // Fetch published blog articles sorted by popularity
  const articles = await prisma.blogArticle.findMany({
    where: { status: "published" },
    select: { slug: true, title: true, category: true, viewCount: true, publishedAt: true },
    orderBy: [{ viewCount: "desc" }, { publishedAt: "desc" }],
    take: limit * 2,
  });

  // Merge, filter out fully-syndicated content (syndicated on all 3 platforms)
  const candidates: SyndicationCandidate[] = [];

  for (const c of comparisons) {
    const fullyDone = PLATFORMS.every(p => syndicatedSet.has(`${c.slug}::${p}`));
    if (!fullyDone) {
      candidates.push({ type: "comparison", slug: c.slug, title: c.title, category: c.category, viewCount: c.viewCount, publishedAt: c.publishedAt });
    }
  }

  for (const a of articles) {
    const fullyDone = PLATFORMS.every(p => syndicatedSet.has(`${a.slug}::${p}`));
    if (!fullyDone) {
      candidates.push({ type: "blog", slug: a.slug, title: a.title, category: a.category, viewCount: a.viewCount, publishedAt: a.publishedAt });
    }
  }

  // Sort by view count descending and take top N
  candidates.sort((a, b) => b.viewCount - a.viewCount);
  return candidates.slice(0, limit);
}

/**
 * Generate syndicated articles for a single candidate across all platforms.
 * Returns the formatted articles ready for publishing.
 */
export async function syndicateCandidate(
  candidate: SyndicationCandidate,
  getComparisonBySlug: (slug: string) => Promise<ComparisonPageData | null>,
  getBlogBySlug: (slug: string) => Promise<BlogArticleInput | null>
): Promise<SyndicatedArticle[]> {
  const prisma = getPrismaClient();
  const results: SyndicatedArticle[] = [];

  // Check which platforms are already done
  const existing = prisma
    ? await prisma.syndicatedContent.findMany({
        where: { sourceSlug: candidate.slug },
        select: { platform: true },
      })
    : [];
  const donePlatforms = new Set(existing.map((e: { platform: string }) => e.platform));

  // Get the source content
  let sourceData: ComparisonPageData | BlogArticleInput | null = null;
  if (candidate.type === "comparison") {
    sourceData = await getComparisonBySlug(candidate.slug);
  } else {
    sourceData = await getBlogBySlug(candidate.slug);
  }

  if (!sourceData) return results;

  for (const platform of PLATFORMS) {
    if (donePlatforms.has(platform)) continue;

    const formatted = formatForPlatform(candidate.type, sourceData, platform);
    const canonicalPath = candidate.type === "comparison"
      ? `/compare/${candidate.slug}`
      : `/blog/${candidate.slug}`;

    const article: SyndicatedArticle = {
      sourceType: candidate.type,
      sourceSlug: candidate.slug,
      sourceTitle: candidate.title,
      platform,
      canonicalUrl: `${BASE_URL}${canonicalPath}`,
      formattedTitle: formatted.title,
      formattedBody: formatted.body,
      utmCampaign: "content-syndication",
      utmSource: platform,
    };

    results.push(article);
  }

  return results;
}

/**
 * Save a syndicated article record to the database.
 */
export async function saveSyndicatedContent(article: SyndicatedArticle): Promise<string | null> {
  const prisma = getPrismaClient();
  if (!prisma) return null;

  const record = await prisma.syndicatedContent.upsert({
    where: {
      sourceSlug_platform: {
        sourceSlug: article.sourceSlug,
        platform: article.platform,
      },
    },
    update: {
      formattedTitle: article.formattedTitle,
      formattedBody: article.formattedBody,
      updatedAt: new Date(),
    },
    create: {
      sourceType: article.sourceType,
      sourceSlug: article.sourceSlug,
      sourceTitle: article.sourceTitle,
      platform: article.platform,
      canonicalUrl: article.canonicalUrl,
      formattedTitle: article.formattedTitle,
      formattedBody: article.formattedBody,
      utmCampaign: article.utmCampaign,
      utmSource: article.utmSource,
      status: "pending",
    },
  });

  return record.id;
}

/**
 * Mark a syndicated article as published with its platform URL.
 */
export async function markAsPublished(id: string, platformUrl: string): Promise<void> {
  const prisma = getPrismaClient();
  if (!prisma) return;

  await prisma.syndicatedContent.update({
    where: { id },
    data: {
      status: "published",
      platformUrl,
      publishedAt: new Date(),
    },
  });
}

/**
 * Get syndication stats for reporting.
 */
export async function getSyndicationStats(): Promise<{
  total: number;
  byPlatform: Record<string, number>;
  byStatus: Record<string, number>;
  pending: number;
}> {
  const prisma = getPrismaClient();
  if (!prisma) return { total: 0, byPlatform: {}, byStatus: {}, pending: 0 };

  const all = await prisma.syndicatedContent.findMany({
    select: { platform: true, status: true },
  });

  const byPlatform: Record<string, number> = {};
  const byStatus: Record<string, number> = {};

  for (const item of all) {
    byPlatform[item.platform] = (byPlatform[item.platform] || 0) + 1;
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
  }

  return {
    total: all.length,
    byPlatform,
    byStatus,
    pending: byStatus["pending"] || 0,
  };
}

/**
 * Get all pending syndicated articles ready for manual publishing.
 */
export async function getPendingSyndications(): Promise<Array<{
  id: string;
  sourceType: string;
  sourceSlug: string;
  platform: string;
  formattedTitle: string;
  formattedBody: string;
  canonicalUrl: string;
  createdAt: Date;
}>> {
  const prisma = getPrismaClient();
  if (!prisma) return [];

  return prisma.syndicatedContent.findMany({
    where: { status: "pending" },
    select: {
      id: true,
      sourceType: true,
      sourceSlug: true,
      platform: true,
      formattedTitle: true,
      formattedBody: true,
      canonicalUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
