/**
 * Repo posts that are not in the database used to be prepended only on page 1
 * after the database page was already sliced. The 12th-newest database post
 * then fell off page 1 and never showed up on page 2.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  NBA_SEASON_PREVIEW_BLOG_SLUG,
  listRepoBlogArticles,
  listRepoBlogOverrideSlugs,
} from "@/lib/data/nba-season-preview-blog";
import { GOOGLE_MAPS_ALTERNATIVES_BLOG_SLUG } from "@/lib/data/google-maps-alternatives-blog";

const mocks = vi.hoisted(() => ({
  findMany: vi.fn(),
  count: vi.fn(),
  queryRaw: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  getPrisma: () => ({
    blogArticle: {
      findMany: mocks.findMany,
      count: mocks.count,
    },
    $queryRaw: mocks.queryRaw,
  }),
}));

import { blogReadMinutes, listBlogArticles } from "../blog-generator";

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

/** Repo-only posts (not overrides of a DB row) merged with the DB rows, newest first. */
function expectedOrder(): string[] {
  const overrides = new Set(listRepoBlogOverrideSlugs());
  const repoOnly = listRepoBlogArticles()
    .filter((article) => !overrides.has(article.slug) && article.status === "published")
    .map((article) => ({ slug: article.slug, at: new Date(article.publishedAt!).getTime() }));
  const db = DB_POSTS.map((post) => ({ slug: post.slug, at: post.publishedAt.getTime() }));
  return [...repoOnly, ...db].sort((a, b) => b.at - a.at).map((entry) => entry.slug);
}

describe("merged blog list paging", () => {
  beforeEach(() => {
    mocks.count.mockReset();
    mocks.findMany.mockReset();
    mocks.queryRaw.mockReset();
    mocks.queryRaw.mockResolvedValue([]);
    mocks.findMany.mockImplementation(async (args: { select?: { slug?: boolean; title?: boolean; content?: boolean } }) => {
      // Refreshed repo overrides replace an existing DB row for the same slug.
      if (args.select?.slug && !args.select.title) return listRepoBlogOverrideSlugs().map((slug) => ({ slug }));
      if (args.select && !args.select.content) {
        return DB_POSTS.map((row) => {
          const { content, ...rest } = row;
          void content;
          return rest;
        });
      }
      return DB_POSTS;
    });
  });

  it("keeps every post on exactly one page when a repo post is newer than the database rows", async () => {
    const page1 = await listBlogArticles({ limit: 12, offset: 0, status: "published" });
    const page2 = await listBlogArticles({ limit: 12, offset: 12, status: "published" });

    const order = expectedOrder();
    expect(order).toContain(GOOGLE_MAPS_ALTERNATIVES_BLOG_SLUG);
    expect(order).toContain(NBA_SEASON_PREVIEW_BLOG_SLUG);
    expect(order.length).toBeGreaterThan(12);
    expect(page1.total).toBe(order.length);
    expect(page2.total).toBe(order.length);
    expect(page1.articles.map((article) => article.slug)).toEqual(order.slice(0, 12));
    expect(page2.articles.map((article) => article.slug)).toEqual(order.slice(12, 24));
    expect(page2.articles.map((article) => article.slug)).toContain("db-post-12");

    const seen = [...page1.articles, ...page2.articles].map((article) => article.slug);
    expect(new Set(seen).size).toBe(seen.length);
    expect(seen).toContain("db-post-11");

    const listingSelects = mocks.findMany.mock.calls
      .map((call) => call[0]?.select)
      .filter((select) => select?.title);
    expect(listingSelects.length).toBeGreaterThan(0);
    for (const select of listingSelects) {
      expect(select.content).toBeUndefined();
      expect(select.titleEmbedding).toBeUndefined();
      expect(select.slug).toBe(true);
      expect(select.title).toBe(true);
      expect(select.excerpt).toBe(true);
      expect(select.publishedAt).toBe(true);
      expect(select.category).toBe(true);
      expect(select.relatedComparisonSlugs).toBe(true);
    }
  });

  it("counts words for the current page only, and skips that query when the body is loaded", async () => {
    mocks.queryRaw.mockImplementation(async (query: { values: unknown[] }) =>
      sqlValues(query).map((slug) => ({ slug, words: 400 })),
    );

    const page1 = await listBlogArticles({
      limit: 12,
      offset: 0,
      status: "published",
      includeReadTime: true,
    });
    const sql = String(mocks.queryRaw.mock.calls[0][0].text ?? mocks.queryRaw.mock.calls[0][0].sql);
    expect(sql).toContain("[[:space:]]+");
    expect(sql).not.toMatch(/E'\\s/);
    expect(sql).not.toMatch(/\\s/);
    const counted = sqlValues(mocks.queryRaw.mock.calls[0][0]);
    const dbSlugs = new Set(DB_POSTS.map((post) => post.slug));
    const firstPageDb = expectedOrder().slice(0, 12).filter((slug) => dbSlugs.has(slug));
    expect(counted).toEqual(firstPageDb);
    expect(counted).not.toContain(NBA_SEASON_PREVIEW_BLOG_SLUG);
    expect(counted).not.toContain(GOOGLE_MAPS_ALTERNATIVES_BLOG_SLUG);
    expect(counted).not.toContain("db-post-12");
    const dbCard = page1.articles.find((article) => article.slug === "db-post-0");
    expect(dbCard?.content).toBe("");
    expect(dbCard?.contentWordCount).toBe(400);
    expect(blogReadMinutes(dbCard!)).toBe(2);

    mocks.queryRaw.mockClear();
    await listBlogArticles({
      limit: 12,
      offset: 0,
      status: "published",
      includeContent: true,
    });
    expect(mocks.queryRaw).not.toHaveBeenCalled();
    const withBody = mocks.findMany.mock.calls.at(-1)?.[0]?.select;
    expect(withBody.content).toBe(true);
    expect(withBody.titleEmbedding).toBeUndefined();
  });

  it("does not count words for sitemap and feed listings", async () => {
    await listBlogArticles({ limit: 500, status: "published" });
    await listBlogArticles({ status: "published", limit: 200, offset: 0 });
    await listBlogArticles({ limit: 50, status: "published" });
    await listBlogArticles({ limit: 30, status: "published" });
    expect(mocks.queryRaw).not.toHaveBeenCalled();

    const { readFileSync } = await import("node:fs");
    const paths = [
      "src/app/sitemap.ts",
      "src/app/sitemap/images.xml/route.ts",
      "src/app/sitemap/news.xml/route.ts",
      "src/app/feed/route.ts",
      "src/app/feed/atom/route.ts",
      "src/app/feed/json/route.ts",
    ];
    for (const path of paths) {
      const source = readFileSync(path, "utf8");
      expect(source, path).not.toMatch(/includeReadTime/);
      expect(source, path).toMatch(/listBlogArticles\(/);
    }
    expect(readFileSync("src/app/blog/page.tsx", "utf8")).toMatch(/includeReadTime:\s*true/);
    expect(readFileSync("src/app/page.tsx", "utf8")).toMatch(/includeReadTime:\s*true/);
  });

  it("uses the body when it is already in memory and the stored count otherwise", () => {
    expect(blogReadMinutes({ content: "one two three four", contentWordCount: 400 })).toBe(1);
    expect(blogReadMinutes({ content: "", contentWordCount: 400 })).toBe(2);
    expect(blogReadMinutes({ content: "" })).toBe(1);
  });
});

function sqlValues(query: { values?: unknown[] }): unknown[] {
  const out: unknown[] = [];
  for (const value of query.values ?? []) {
    if (value && typeof value === "object" && "values" in value) {
      out.push(...sqlValues(value as { values?: unknown[] }));
    } else {
      out.push(value);
    }
  }
  return out;
}
