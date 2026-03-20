/**
 * Blog Article Generator Service
 * Uses Claude AI + Tavily enrichment to generate SEO-focused blog articles.
 * Server-side only.
 */

import Anthropic from "@anthropic-ai/sdk";
import { searchTavily } from "./tavily-service";

export interface BlogArticle {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // markdown
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  relatedComparisonSlugs: string[];
  sourceQuery?: string;
  sourceImpressions?: number;
  status?: string;
  publishedAt?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  viewCount?: number;
}

function getPrismaClient() {
  try {
    const { getPrisma } = require("@/lib/db/prisma");
    return getPrisma();
  } catch {
    return null;
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function generateBlogArticle(
  topic: string,
  gscData?: { query: string; impressions: number }
): Promise<BlogArticle> {
  // Enrich with Tavily data
  let enrichmentContext = "";
  try {
    const tavilyResults = await searchTavily(topic, 5);
    if (tavilyResults.length > 0) {
      enrichmentContext = `\n\nHere is some recent web research on this topic for context and accuracy:\n${tavilyResults
        .map((r) => `- ${r.title}: ${r.content.slice(0, 300)}`)
        .join("\n")}`;
    }
  } catch {
    // Tavily enrichment is optional
  }

  const anthropic = new Anthropic();

  const systemPrompt = `You are a professional content writer for "A Versus B" (aversusb.net), a comparison platform.
You write SEO-optimized blog articles about comparisons, buyer's guides, "best of" lists, and informational content.

Your articles should be:
- Well-researched and factually accurate
- SEO-optimized with natural keyword usage
- Engaging and easy to read
- 1000-1500 words
- Include internal links to comparison pages using the format [text](/compare/slug-a-vs-slug-b)

You MUST respond with valid JSON only, no other text. The JSON must have this exact structure:
{
  "title": "SEO-optimized title",
  "excerpt": "2-3 sentence compelling excerpt",
  "content": "Full markdown article with ## and ### headings, bullet points, comparison tables using | syntax, bold text, and a ## Conclusion section. Include internal links like [iPhone vs Samsung](/compare/iphone-vs-samsung). Use proper markdown formatting.",
  "category": "one of: technology, sports, entertainment, lifestyle, science, business, education, health, travel, food",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "metaTitle": "SEO meta title (50-60 chars)",
  "metaDescription": "SEO meta description (150-160 chars)",
  "relatedComparisonSlugs": ["slug-a-vs-slug-b", "slug-c-vs-slug-d"]
}`;

  const userPrompt = `Write a comprehensive blog article about: "${topic}"
${gscData ? `\nThis topic was discovered from search data with ${gscData.impressions} impressions for the query "${gscData.query}".` : ""}
${enrichmentContext}

Remember to respond with ONLY valid JSON in the exact format specified.`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4000,
    messages: [{ role: "user", content: userPrompt }],
    system: systemPrompt,
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Parse the JSON response
  let parsed;
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    parsed = JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error(`Failed to parse AI response: ${e}`);
  }

  const slug = slugify(parsed.title || topic);

  return {
    slug,
    title: parsed.title || topic,
    excerpt: parsed.excerpt || "",
    content: parsed.content || "",
    category: parsed.category || "technology",
    tags: parsed.tags || [],
    metaTitle: parsed.metaTitle || parsed.title || topic,
    metaDescription: parsed.metaDescription || parsed.excerpt || "",
    relatedComparisonSlugs: parsed.relatedComparisonSlugs || [],
    sourceQuery: gscData?.query,
    sourceImpressions: gscData?.impressions,
  };
}

export async function saveBlogArticle(
  article: BlogArticle
): Promise<{ id: string } | null> {
  const prisma = getPrismaClient();
  if (!prisma) return null;

  try {
    const result = await prisma.blogArticle.upsert({
      where: { slug: article.slug },
      create: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        tags: article.tags,
        metaTitle: article.metaTitle,
        metaDescription: article.metaDescription,
        relatedComparisonSlugs: article.relatedComparisonSlugs,
        sourceQuery: article.sourceQuery,
        sourceImpressions: article.sourceImpressions,
        status: "published",
        isAutoGenerated: true,
        publishedAt: new Date(),
      },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        tags: article.tags,
        metaTitle: article.metaTitle,
        metaDescription: article.metaDescription,
        relatedComparisonSlugs: article.relatedComparisonSlugs,
        sourceQuery: article.sourceQuery,
        sourceImpressions: article.sourceImpressions,
      },
    });
    return { id: result.id };
  } catch (e) {
    console.error("Failed to save blog article:", e);
    return null;
  }
}

export async function getBlogBySlug(
  slug: string
): Promise<BlogArticle | null> {
  const prisma = getPrismaClient();
  if (!prisma) return null;

  try {
    const article = await prisma.blogArticle.findUnique({
      where: { slug },
    });
    if (!article) return null;

    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt || "",
      content: article.content,
      category: article.category || "",
      tags: article.tags || [],
      metaTitle: article.metaTitle || article.title,
      metaDescription: article.metaDescription || "",
      relatedComparisonSlugs: article.relatedComparisonSlugs || [],
      sourceQuery: article.sourceQuery || undefined,
      sourceImpressions: article.sourceImpressions || undefined,
      status: article.status,
      publishedAt: article.publishedAt,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      viewCount: article.viewCount,
    };
  } catch (e) {
    console.error("Failed to get blog article:", e);
    return null;
  }
}

export async function listBlogArticles(params: {
  category?: string;
  limit?: number;
  offset?: number;
  status?: string;
}): Promise<{ articles: BlogArticle[]; total: number }> {
  const prisma = getPrismaClient();
  if (!prisma) return { articles: [], total: 0 };

  const { category, limit = 12, offset = 0, status = "published" } = params;

  try {
    const where: Record<string, unknown> = { status };
    if (category) where.category = category;

    const [articles, total] = await Promise.all([
      prisma.blogArticle.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.blogArticle.count({ where }),
    ]);

    return {
      articles: articles.map(
        (a: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string;
          category: string | null;
          tags: string[];
          metaTitle: string | null;
          metaDescription: string | null;
          relatedComparisonSlugs: string[];
          sourceQuery: string | null;
          sourceImpressions: number | null;
          status: string;
          publishedAt: Date | null;
          createdAt: Date;
          updatedAt: Date;
          viewCount: number;
        }) => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt || "",
          content: a.content,
          category: a.category || "",
          tags: a.tags || [],
          metaTitle: a.metaTitle || a.title,
          metaDescription: a.metaDescription || "",
          relatedComparisonSlugs: a.relatedComparisonSlugs || [],
          status: a.status,
          publishedAt: a.publishedAt,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
          viewCount: a.viewCount,
        })
      ),
      total,
    };
  } catch (e) {
    console.error("Failed to list blog articles:", e);
    return { articles: [], total: 0 };
  }
}
