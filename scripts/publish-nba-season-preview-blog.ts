/**
 * Publish the 2026-27 NBA season preview.
 * Run: npx tsx scripts/publish-nba-season-preview-blog.ts
 *
 * The blog route also serves this post from repo data when the slug is
 * missing in the database. This upsert is what puts the row in production
 * so the database copy wins on the next read.
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { PrismaClient } from "@prisma/client";
import { NBA_SEASON_PREVIEW_ARTICLE } from "../src/lib/data/nba-season-preview-blog";

const prisma = new PrismaClient();

async function main() {
  const article = NBA_SEASON_PREVIEW_ARTICLE;
  await prisma.blogArticle.upsert({
    where: { slug: article.slug },
    update: {
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      tags: article.tags,
      metaTitle: article.metaTitle,
      metaDescription: article.metaDescription,
      relatedComparisonSlugs: article.relatedComparisonSlugs,
      status: "published",
      publishedAt: new Date(String(article.publishedAt)),
      updatedAt: new Date(String(article.updatedAt)),
    },
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
      status: "published",
      publishedAt: new Date(String(article.publishedAt)),
    },
  });
  console.log(`Upserted /blog/${article.slug}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
