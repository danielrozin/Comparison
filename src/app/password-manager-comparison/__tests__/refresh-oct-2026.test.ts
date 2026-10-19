/**
 * ROO-269 — Oct 19, 2026 refresh of /password-manager-comparison.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { LAST_UPDATED } from "@/app/password-manager-comparison/last-updated";

const src = readFileSync(path.resolve(process.cwd(), "src/app/password-manager-comparison/page.tsx"), "utf8");

describe("password manager hub, Oct 19 refresh", () => {
  it("carries the new date and the corrected Bitwarden license", () => {
    expect(LAST_UPDATED).toBe("2026-10-19");
    expect(src).toContain("GPL v3.0");
    expect(src).not.toMatch(/MIT-licensed|Cure53 audited|EU-FOSSA/);
  });

  it("states prices only with vendor, month and a current-price link", () => {
    expect(src).not.toContain("priceValidUntil");
    const priceTexts = [...src.matchAll(/text: "([^"]+)"/g)].map((m) => m[1]);
    expect(priceTexts.length).toBeGreaterThanOrEqual(5);
    for (const t of priceTexts) expect(t).toMatch(/\$[\d.]+\/month.*per .+ pricing page, October 2026/);
    expect(src).toContain("See vendor page for current price");
  });

  it("drops the unverified 2FA column and superlatives", () => {
    expect(src).not.toMatch(/twoFA|2FA Methods|strongest audit record|citation-backed|All data cited/);
  });

  it("links one live compare page in the body", () => {
    expect(src).toContain('href="/compare/1password-vs-bitwarden"');
    expect(isRedirectedCompareSlug("1password-vs-bitwarden")).toBe(false);
  });

  it("emits no ClaimReview or review flags and keeps template disclosure", () => {
    expect(src).not.toMatch(/ClaimReview|isHumanReviewed|reviewedBy/);
    expect(src).toContain("{AI_DISCLOSURE}");
    expect(src).not.toMatch(/this (page|guide|article)/i);
  });
});
