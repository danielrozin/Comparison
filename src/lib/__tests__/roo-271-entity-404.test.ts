import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { shouldEntityPage404 } from "@/lib/seo/entity-page-indexable";

describe("ROO-271 (D): /entity/[slug] soft 404", () => {
  it("404s an unknown slug and an unpublished entity after a successful lookup", () => {
    expect(shouldEntityPage404({ lookupFailed: false, status: null })).toBe(true);
    expect(shouldEntityPage404({ lookupFailed: false, status: "draft" })).toBe(true);
    expect(shouldEntityPage404({ lookupFailed: false, status: "archived" })).toBe(true);
  });

  it("keeps published entities at 200 and never 404s on a failed lookup", () => {
    expect(shouldEntityPage404({ lookupFailed: false, status: "published" })).toBe(false);
    expect(shouldEntityPage404({ lookupFailed: true, status: null })).toBe(false);
  });

  it("does not call notFound() inside a try block that would swallow it", () => {
    const src = readFileSync(path.resolve(process.cwd(), "src/app/entity/[slug]/page.tsx"), "utf8");
    const page = src.slice(src.indexOf("export default async function EntityPage"));
    // Every notFound() in the page component sits after its try/catch, guarded by shouldEntityPage404.
    for (const m of page.matchAll(/\) notFound\(\);/g)) {
      const before = page.slice(Math.max(0, (m.index ?? 0) - 120), m.index);
      expect(before).toContain("shouldEntityPage404(");
    }
    expect(src).toMatch(/if \(shouldEntityPage404\(\{ lookupFailed, status: rawStatus \}\)\) notFound\(\);/);
  });
});
