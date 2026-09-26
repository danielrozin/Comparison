/**
 * ROO-55 — the next-step row shares the above-fold card with SoftPricingLine.
 * The pricing line element itself is not retargeted.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(rel: string): string {
  return readFileSync(path.resolve(process.cwd(), rel), "utf8");
}

describe("compare under-verdict wiring", () => {
  it("keeps SoftPricingLine on compare-{slug} with placement left to the component", () => {
    const page = source("src/pages/compare/[slug].tsx");
    const pricing = source("src/components/monetization/SoftPricingLine.tsx");
    const needle = '<SoftPricingLine src={`compare-${slug}`} className="text-center" />';
    const first = page.indexOf(needle);
    const second = page.indexOf(needle, first + needle.length);

    expect(first).toBeGreaterThan(page.indexOf("<Breadcrumbs"));
    expect(page.indexOf("<AuthorByline")).toBeGreaterThan(first);
    expect(page.indexOf("<ComparisonHero")).toBeGreaterThan(first);
    expect(second).toBeGreaterThan(page.indexOf("function MultiEntityLayout"));
    expect(page.indexOf('id="compare-hero-heading"')).toBeGreaterThan(second);
    expect(page.indexOf(needle, second + needle.length)).toBe(-1);

    // Both copies sit in the same card as the next-step row.
    expect(page.slice(0, first)).toContain('id="compare-under-verdict"');
    expect(page.slice(first - 400, first)).toContain("<CompareUnderVerdictNextStep");
    expect(page.slice(second - 400, second)).toContain("<CompareUnderVerdictNextStep");

    expect(pricing).toContain('placement="soft-line"');
    expect(pricing).not.toContain("under-verdict");
  });
});
