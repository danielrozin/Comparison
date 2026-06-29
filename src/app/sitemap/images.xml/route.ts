/**
 * Image sitemap — /sitemap/images.xml
 *
 * Serves Google's image extension namespace for the top 3,000 comparison pages
 * and all published blog articles. Each <url> entry contains an <image:image>
 * block pointing to the OG image for that page, which Google Images and AI visual
 * search (Lens, SGE) use to index the page's primary visual.
 *
 * AEO/GEO purpose: AI Overviews and visual LLM crawlers follow image sitemaps
 * independently of the text sitemap. Listing OG images here accelerates visual
 * indexing and increases the probability of image carousels appearing in AI answers.
 *
 * Format: Google Image Sitemap extension
 * https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
 */

import { getPrisma } from "@/lib/db/prisma";
import { listBlogArticles } from "@/lib/services/blog-generator";
import { SITE_URL } from "@/lib/utils/constants";

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
      orderBy: { viewCount: "desc" },
      take: 3000,
    });
  }

  const comparisonEntries = comparisons.map((c) => {
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

  const entries = [...comparisonEntries, ...blogEntries];

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
