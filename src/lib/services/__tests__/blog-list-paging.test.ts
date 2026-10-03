/**
 * Repo posts that are not in the database used to be prepended only on page 1
 * after the database page was already sliced. The 12th-newest database post
 * then fell off page 1 and never showed up on page 2.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NBA_SEASON_PREVIEW_BLOG_SLUG } from "@/lib/data/nba-season-preview-blog";

const mocks = vi.hoisted(() => ({
  findMany: vi.fn(),
  count: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  getPrisma: () => ({
    blogArticle: {
      findMany: mocks.findMany,
      count: mocks.count,
    },
  }),
}));

import { listBlogArticles } from "../blog-generator";

function dbPost(index: number) {
  return {
    id: `db-${index}`,
    slug: `db-post-${index}`,
    title: `DB post ${index}`,
    excerpt: "",
    content: "body",
    category: "sports",
    tags: [] as string[],
    metaTitle: null,
    metaDescription: null,
    relatedComparisonSlugs: [] as string[],
    sourceQuery: null,
    sourceImpressions: null,
    status: "published",
    publishedAt: new Date(Date.UTC(2026, 9, 2) - index * 24 * 60 * 60 * 1000),
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
    viewCount: 0,
  };
}

const DB_POSTS = Array.from({ length: 13 }, (_, index) => dbPost(index));

describe("merged blog list paging", () => {
  beforeEach(() => {
    mocks.count.mockReset();
    mocks.findMany.mockReset();
    mocks.findMany.mockImplementation(async (args: { select?: { slug?: boolean } }) => {
      if (args.select?.slug) return [];
      return DB_POSTS;
    });
  });

  it("keeps every post on exactly one page when a repo post is newer than the database rows", async () => {
    const page1 = await listBlogArticles({ limit: 12, offset: 0, status: "published" });
    const page2 = await listBlogArticles({ limit: 12, offset: 12, status: "published" });

    expect(page1.total).toBe(14);
    expect(page2.total).toBe(14);
    expect(page1.articles.map((article) => article.slug)).toEqual([
      NBA_SEASON_PREVIEW_BLOG_SLUG,
      ...DB_POSTS.slice(0, 11).map((post) => post.slug),
    ]);
    expect(page2.articles.map((article) => article.slug)).toEqual([
      "db-post-11",
      "db-post-12",
    ]);

    const seen = [...page1.articles, ...page2.articles].map((article) => article.slug);
    expect(new Set(seen).size).toBe(seen.length);
    expect(seen).toContain("db-post-11");
  });
});
