import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROUTES = ["src/app/llms.txt/route.ts", "src/app/api/llms/route.ts", "src/app/api/llms-full/route.ts"];

function source(rel: string): string {
  return readFileSync(path.resolve(process.cwd(), rel), "utf8");
}

describe("ROO-288: llms outputs link only to pages that resolve", () => {
  for (const rel of ROUTES) {
    it(`${rel}: every entity query uses sitemapEntityWhere and compares use canonicalComparisonWhere`, () => {
      const src = source(rel);
      const entityQueries = src.split("prisma.entity.findMany({").slice(1);
      expect(entityQueries.length).toBeGreaterThan(0);
      for (const q of entityQueries) expect(q.slice(0, 200)).toContain("where: sitemapEntityWhere()");
      const compareQueries = src.split("prisma.comparison.findMany({").slice(1);
      for (const q of compareQueries) expect(q.slice(0, 250)).toContain("canonicalComparisonWhere(");
      expect(src).toContain("isDegenerateComparisonSlug(c.slug)");
      // POST-only endpoints are documented as text, not as clickable URLs.
      expect(src).not.toMatch(/\$\{SITE_URL\}\/api\/v1\/batch/);
      expect(src).not.toMatch(/\$\{SITE_URL\}\/api\/pingback/);
    });
  }

  it("image sitemap still uses the same entity rule", () => {
    expect(source("src/app/sitemap/images.xml/route.ts")).toContain("where: sitemapEntityWhere()");
  });
});
