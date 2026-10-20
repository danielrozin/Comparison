import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { sitemapEntityWhere } from "@/lib/seo/sitemap-entity-where";
import { isEntityPageIndexable } from "@/lib/seo/entity-page-indexable";

function source(rel: string): string {
  return readFileSync(path.resolve(process.cwd(), rel), "utf8");
}

describe("ROO-271 QA P2: image sitemap only lists entity pages that resolve", () => {
  it("requires a published entity (the only status /entity/[slug] serves) with a canonical comparison", () => {
    const where = sitemapEntityWhere();
    expect(isEntityPageIndexable(where.status)).toBe(true);
    expect(where.comparisonsA.some.comparison.status).toBe("published");
    expect(Array.isArray(where.comparisonsA.some.comparison.slug.notIn)).toBe(true);
  });

  it("is used by both the main sitemap entity shard and /sitemap/images.xml", () => {
    const images = source("src/app/sitemap/images.xml/route.ts");
    const entityQuery = images.slice(images.indexOf("prisma.entity.findMany"));
    expect(entityQuery.slice(0, 200)).toContain("where: sitemapEntityWhere()");
    expect(source("src/app/sitemap.ts")).toContain("where: sitemapEntityWhere()");
  });
});
