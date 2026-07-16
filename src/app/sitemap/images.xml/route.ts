/**
 * Image sitemap — /sitemap/images.xml
 *
 * Serves Google's image extension namespace for:
 *  - Every canonical comparison page (the same set sitemap/1.xml emits)
 *  - All published blog articles (~370 pages)
 *  - Top 1,000 entity profile pages
 *
 * DAN-2045: this route used to take the top 3,000 comparison rows by `viewCount`
 * with no status filter, so it submitted 2,707 URLs that 404 (90% of its
 * `/compare/` entries) while omitting 163 pages that are real — `viewCount` is
 * seed data, mostly 0, so the ordering was arbitrary and the 3,000 cut fell
 * across unpublished rows. It must derive its comparison set from
 * `canonicalComparisonWhere()` exactly like `sitemap.ts` shard 1 does; filtering
 * on `status: "published"` alone is not sufficient (see canonical-comparisons.ts).
 *
 * Each <url> entry contains an <image:image> block pointing to the OG image
 * for that page. Google Images and AI visual search (Lens, SGE) use this to
 * index the page's primary visual.
 *
 * AEO/GEO purpose: AI Overviews and visual LLM crawlers follow image sitemaps
 * independently of the text sitemap. Listing OG images here accelerates visual
 * indexing and increases the probability of image carousels appearing in AI answers.
 *
 * Format: Google Image Sitemap extension
 * https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
 */

import { getPrisma } from "@/lib/db/prisma";
import { canonicalComparisonWhere } from "@/lib/db/canonical-comparisons";
import { listBlogArticles } from "@/lib/services/blog-generator";
import { SITE_URL } from "@/lib/utils/constants";
import { isDegenerateComparisonSlug, isCleanSlug } from "@/lib/utils/slugify";

export const dynamic = "force-dynamic";
export const revalidate = 21600; // rebuild every 6 hours

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function ogImageUrl(title: string, entityA: string, entityB: string, category: string): string {
  return (
    `${SITE_URL}/api/og` +
    `?title=${encodeURIComponent(title)}` +
    `&a=${encodeURIComponent(entityA)}` +
    `&b=${encodeURIComponent(entityB)}` +
    `&cat=${encodeURIComponent(category)}` +
    `&type=comparison`
  );
}

export async function GET() {
  const prisma = getPrisma();

  let comparisons: {
    slug: string;
    title: string;
    category: string | null;
    entities: { position: number; entity: { name: string } }[];
  }[] = [];

  if (prisma) {
    comparisons = await prisma.comparison.findMany({
      where: canonicalComparisonWhere(),
      select: {
        slug: true,
        title: true,
        category: true,
        entities: {
          select: {
            position: true,
            entity: { select: { name: true } },
          },
          orderBy: { position: "asc" },
          take: 2,
        },
      },
      orderBy: { slug: "asc" },
    });
  }

  const comparisonEntries = comparisons
    // Mirrors sitemap.ts shard 1: degenerate (X-vs-X) slugs 404 by design and
    // corrupt slugs 301 away, so neither is a page we may submit to Google.
    .filter((c) => isCleanSlug(c.slug) && !isDegenerateComparisonSlug(c.slug))
    .map((c) => {
    const entityA = c.entities[0]?.entity.name ?? "";
    const entityB = c.entities[1]?.entity.name ?? c.entities[0]?.entity.name ?? "";
    const imageUrl = ogImageUrl(c.title, entityA, entityB, c.category ?? "");
    const pageLoc = `${SITE_URL}/compare/${c.slug}`;
    const title = escapeXml(c.title);
    const imgLoc = escapeXml(imageUrl);

    return [
      "  <url>",
      `    <loc>${escapeXml(pageLoc)}</loc>`,
      "    <image:image>",
      `      <image:loc>${imgLoc}</image:loc>`,
      `      <image:title>${title}</image:title>`,
      `      <image:caption>${title} — Side-by-side comparison on A Versus B</image:caption>`,
      "    </image:image>",
      "  </url>",
    ].join("\n");
  });

  // Blog article images — include all published blog articles in the image sitemap.
  // Blog OG images are generated via /api/og?title=...&type=blog and indexed by
  // Google Images to drive traffic on "best X" and "X vs Y" informational queries.
  let blogEntries: string[] = [];
  try {
    const { articles } = await listBlogArticles({ limit: 500, status: "published" });
    blogEntries = articles.map((article) => {
      const blogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(article.title)}&type=blog`;
      const pageLoc = `${SITE_URL}/blog/${article.slug}`;
      const title = escapeXml(article.title);
      const imgLoc = escapeXml(blogImageUrl);
      return [
        "  <url>",
        `    <loc>${escapeXml(pageLoc)}</loc>`,
        "    <image:image>",
        `      <image:loc>${imgLoc}</image:loc>`,
        `      <image:title>${title}</image:title>`,
        `      <image:caption>${title} — A Versus B Blog</image:caption>`,
        "    </image:image>",
        "  </url>",
      ].join("\n");
    });
  } catch {
    // Blog service unavailable — skip blog images
  }

  // Entity profile images — top 1,000 entities by ID (most established entities).
  // Entity OG images are generated via /api/og?title=...&type=entity and indexed by
  // Google Images to drive visual traffic on "X profile" and "about X" queries.
  // AI crawlers (Perplexity, ChatGPT) also follow entity images to build their
  // knowledge graph and link entity mentions to canonical entity pages.
  let entityEntries: string[] = [];
  if (prisma) {
    try {
      const entities = await prisma.entity.findMany({
        select: { slug: true, name: true },
        orderBy: { id: "asc" },
        take: 1000,
      });
      entityEntries = entities.map((entity) => {
        const entityImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(entity.name)}&type=entity`;
        const pageLoc = `${SITE_URL}/entity/${entity.slug}`;
        const title = escapeXml(`${entity.name} — Profile & Comparisons`);
        const imgLoc = escapeXml(entityImageUrl);
        return [
          "  <url>",
          `    <loc>${escapeXml(pageLoc)}</loc>`,
          "    <image:image>",
          `      <image:loc>${imgLoc}</image:loc>`,
          `      <image:title>${title}</image:title>`,
          `      <image:caption>${escapeXml(entity.name)} — Entity Profile on A Versus B</image:caption>`,
          "    </image:image>",
          "  </url>",
        ].join("\n");
      });
    } catch {
      // Entity query unavailable — skip entity images
    }
  }

  const entries = [...comparisonEntries, ...blogEntries, ...entityEntries];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    entries.join("\n") +
    `\n</urlset>\n`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=21600, stale-while-revalidate=86400",
    },
  });
}
