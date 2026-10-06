import { describe, expect, it } from "vitest";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { mergeEditorialCategoryComparisons } from "@/lib/categories/hub-comparisons";
import { entitySchemaType } from "@/lib/seo/schema";
import { assembleCompareJsonLd } from "@/lib/seo/compare-jsonld";
import { isHumanReviewedSlug } from "@/lib/editorial/human-reviewed";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const MONEY = "cashiers-check-vs-money-order";
const CERTIFIED = "cashiers-check-vs-certified-check";

const BANNED =
  /date of death|page lists|list shows|info box lists|table lists|on that table|no published|not described as|page says|on that page|the page|about page|article says|is described there|does not print|doesn't print|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|Index, follow|returned 404|\babove\b|\bshown\b|\bquoted\b|\bprints\b|\bincluded\b|\brows\b|\bcolumns\b|\btable\b/i;

const OFFICIAL =
  /^https:\/\/(www\.usps\.com|pe\.usps\.com|www\.ecfr\.gov|files\.consumerfinance\.gov|www\.consumerfinance\.gov|www\.chase\.com|www\.bankofamerica\.com|www\.wellsfargo\.com|www\.walmart\.com)\//;

function readerText(value: unknown): string {
  const parts: string[] = [];
  const visit = (node: unknown) => {
    if (typeof node === "string") {
      parts.push(node);
      return;
    }
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    if (node && typeof node === "object") {
      for (const item of Object.values(node)) visit(item);
    }
  };
  visit(value);
  return parts.join("\n");
}

function faqPageCount(document: unknown): number {
  let count = 0;
  const visit = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    const record = node as Record<string, unknown>;
    const type = record["@type"];
    if (type === "FAQPage" || (Array.isArray(type) && type.includes("FAQPage"))) count += 1;
    if (type === "ClaimReview" || (Array.isArray(type) && type.includes("ClaimReview"))) {
      throw new Error("ClaimReview");
    }
    for (const child of Object.values(record)) visit(child);
  };
  visit(document);
  return count;
}

describe("cashier's check compares", () => {
  const money = () => getEditorialComparison(MONEY)!;
  const certified = () => getEditorialComparison(CERTIFIED)!;

  it("publishes both slugs with no winner, concept sides, and a sitemap row", () => {
    for (const slug of [MONEY, CERTIFIED]) {
      const page = getEditorialComparison(slug)!;
      expect(page.metadata.status).toBe("published");
      expect(page.schemaMarkup).toBeUndefined();
      expect(page.quickAnswer?.winnerName).toBeNull();
      expect(page.quickAnswer?.winnerReason).toBe("Neither is named the winner.");
      expect(page.quickAnswer?.tldr).toBe(page.shortAnswer);
      expect(page.category).toBe("finance");
      expect(page.faqs.length).toBeGreaterThanOrEqual(5);
      expect(page.faqs.length).toBeLessThanOrEqual(7);
      expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(slug);
      const title = buildPageTitle(page.metadata.metaTitle);
      const description = clampDescription(page.metadata.metaDescription);
      expect(title.length).toBeLessThanOrEqual(60);
      expect(description.length).toBeGreaterThanOrEqual(70);
      expect(description.length).toBeLessThanOrEqual(160);
      expect(page.metadata.updatedAt).toBe("2026-10-06T00:00:00Z");
      expect(findSelfContradictions(page)).toEqual([]);
      expect(isHumanReviewedSlug(slug)).toBe(false);
      expect(readerText(page)).not.toMatch(BANNED);
      expect(readerText(page)).not.toMatch(/\/entity\//);
      expect(readerText(page)).not.toMatch(/\bexpert\b|human review|byline/i);
      for (const entity of page.entities) {
        expect(entity.entityType).toBe("concept");
        expect(entitySchemaType(entity.entityType)).toBe("Thing");
      }
      expect(page.citationStats?.sources.map((source) => source.url)).toEqual(
        page.resources?.map((resource) => resource.url),
      );
      expect(page.citationStats?.sourceCount).toBe(page.resources?.length);
      for (const source of page.citationStats?.sources ?? []) {
        expect(source.url).toMatch(OFFICIAL);
      }
    }

    const moneySentences = (money().shortAnswer ?? "").split(/(?<=\.)\s+/);
    expect(moneySentences[0]).toMatch(/money order/i);
    expect(moneySentences[1]).toMatch(/cashier's check/i);
    expect(money().shortAnswer).toMatch(/Neither is named the winner/);
    expect(money().entities.map((entity) => entity.slug)).toEqual([
      "cashiers-check",
      "money-order",
    ]);

    const certifiedSentences = (certified().shortAnswer ?? "").split(/(?<=\.)\s+/);
    expect(certifiedSentences[0]).toMatch(/cashier's check/i);
    expect(certifiedSentences[1]).toMatch(/certified check/i);
    expect(certified().shortAnswer).toMatch(/Neither is named the winner/);
    expect(certified().entities.map((entity) => entity.slug)).toEqual([
      "cashiers-check",
      "certified-check",
    ]);

    expect(money().relatedComparisons.map((item) => item.slug)).toEqual([CERTIFIED]);
    expect(certified().relatedComparisons.map((item) => item.slug)).toEqual([MONEY]);
  });

  it("keeps the US figures that official sources state, and leaves out the dropped claims", () => {
    const moneyText = readerText(money());
    expect(moneyText).toContain("$1,000");
    expect(moneyText).toContain("$2.65");
    expect(moneyText).toContain("$3.75");
    expect(moneyText).toContain("$0.85");
    expect(moneyText).toContain("$23");
    expect(moneyText).toContain("$10");
    expect(moneyText).toContain("$15");
    expect(moneyText).toContain("$5");
    expect(moneyText).toContain("$6,000");
    expect(moneyText).toContain("$2,000");
    expect(moneyText).toContain("$8");
    expect(moneyText).toContain("$6,725");
    expect(moneyText).not.toMatch(/\$225|\$5,525|\$275/);
    expect(moneyText).not.toMatch(/no longer offer certified|rent deposit|closing/i);
    expect(moneyText).not.toMatch(/Walmart[^.\n]{0,60}\$1(?:\.00)?(?![0-9,])/);

    const certifiedText = readerText(certified());
    expect(certifiedText).toContain("direct obligation of the bank");
    expect(certifiedText).toContain("set aside");
    expect(certifiedText).toContain("on presentment");
    expect(certifiedText).toContain("$10");
    expect(certifiedText).toContain("$15");
    expect(certifiedText).toContain("90 days");
    expect(certifiedText).toContain("Wisconsin");
    expect(certifiedText).toContain("New York");
    expect(certifiedText).not.toMatch(/no longer offer certified/i);
    expect(certifiedText).toMatch(/does not state a certified-check fee/);
  });

  it("renders exactly one FAQPage and no ClaimReview", () => {
    for (const slug of [MONEY, CERTIFIED]) {
      const page = getEditorialComparison(slug)!;
      const assembled = assembleCompareJsonLd({
        comparison: page,
        voteData: null,
        videoNode: null,
        fallbackDescription: page.metadata.metaDescription,
      });
      expect(assembled.claimReview).toBeNull();
      expect(faqPageCount(assembled.document)).toBe(1);
      const faq = JSON.stringify(assembled.document);
      expect(faq).not.toContain("ClaimReview");
      for (const item of page.faqs) {
        expect(faq).toContain(item.question);
      }
    }
  });

  it("shows up on the finance hub", () => {
    const cards = mergeEditorialCategoryComparisons("finance", []);
    expect(cards.map((card) => card.slug)).toEqual(expect.arrayContaining([MONEY, CERTIFIED]));
  });
});
