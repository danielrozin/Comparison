/**
 * ROO-55 — the next-step row shares the above-fold card with a stronger
 * Pro line. Both compare layouts use SoftPricingLine with
 * placement=under-verdict-pro. Other landers still default to soft-line.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(rel: string): string {
  return readFileSync(path.resolve(process.cwd(), rel), "utf8");
}

const PRO_COPY =
  "Want a follow-up on price, country, or the tool you actually use? Pro builds it within 24 hours — $49/year.";

describe("compare under-verdict wiring", () => {
  it("uses one under-verdict-pro SoftPricingLine on both compare layouts", () => {
    const page = source("src/pages/compare/[slug].tsx");
    const pricing = source("src/components/monetization/SoftPricingLine.tsx");
    const needle = 'placement="under-verdict-pro"';
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
    expect(page.slice(first - 500, first)).toContain("<CompareUnderVerdictNextStep");
    expect(page.slice(second - 500, second)).toContain("<CompareUnderVerdictNextStep");

    expect(page).toContain(PRO_COPY);
    expect(page.split("label={UNDER_VERDICT_PRO_LABEL}").length - 1).toBe(2);
    expect(page.split("src={`compare-${slug}`}").length - 1).toBeGreaterThanOrEqual(2);

    // Default stays soft-line. The compare page opts in; the component does not hardcode it.
    expect(pricing).toContain('placement = "soft-line"');
    expect(pricing).toContain("placement === \"soft-line\"");
    expect(pricing).not.toContain("under-verdict-pro");
  });
});
