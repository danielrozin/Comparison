import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { mergeEditorialCategoryComparisons } from "@/lib/categories/hub-comparisons";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { isDegenerateComparisonSlug } from "@/lib/utils/slugify";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "hysa-vs-cd";

const FDIC_INSURANCE = "https://www.fdic.gov/resources/deposit-insurance/";
const FDIC_UNDERSTANDING =
  "https://www.fdic.gov/resources/deposit-insurance/understanding-deposit-insurance";
const FDIC_ACCOUNTS = "https://www.fdic.gov/consumer-resource-center/deposit-accounts";
const FDIC_CD_SHOPPING =
  "https://www.fdic.gov/consumer-resource-center/2023-11/shopping-certificate-deposit";
const FDIC_TISA = "https://www.fdic.gov/consumer-compliance-examination-manual/vi-3-truth-savings";
const CFPB_CD = "https://www.consumerfinance.gov/ask-cfpb/what-is-a-certificate-of-deposit-cd-en-917/";
const CFPB_ROLLOVER =
  "https://www.consumerfinance.gov/ask-cfpb/what-is-a-certificate-of-deposit-cd-rollover-or-renewal-en-923/";
const CFPB_SAVINGS_FEES =
  "https://www.consumerfinance.gov/ask-cfpb/why-am-i-being-charged-for-transactions-in-my-savings-account-en-2150/";
const NCUA_SHARE = "https://ncua.gov/consumers/share-insurance-coverage";

const FAQ_ANSWERS = [
  "A high-yield savings account is a savings deposit that typically stays accessible, while a certificate of deposit holds funds for a fixed term. Both can be insured deposits at banks or credit unions; the tradeoff is liquidity versus a rate locked for the CD\u2019s term.",
  "An emergency fund usually belongs in a HYSA (or similarly liquid insured deposit) so you can withdraw without waiting for a maturity date or paying an early-withdrawal penalty.",
  "Deposit accounts at FDIC-insured banks can be covered up to the FDIC\u2019s standard insurance amount per depositor, per insured bank, for each account ownership category. Credit union deposits can be NCUA-insured instead. Confirm the institution\u2019s insurance status on the official FDIC or NCUA tools.",
  "Many CDs charge an early-withdrawal penalty if you take funds before maturity. The penalty and any exceptions are set by the bank\u2019s account agreement \u2014 read that disclosure before you open the CD.",
  "A HYSA APY can change when the bank updates its rate. A CD typically locks the rate for the stated term if you keep the money until maturity; after maturity, renewal terms and rates can differ.",
  "Yes. Some savers keep liquid cash in a HYSA and put money they will not need until a known date into one or more CDs (including a simple ladder of staggered maturities).",
];

// Reader copy credits FDIC, CFPB, and NCUA. It must not narrate the research,
// name a winner, or state an APY or a dollar return.
const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|this article|article says|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|human review|byline|reviewed by|\bwinner\b|Drafted with AI|\d+(?:\.\d+)?\s*%|APY of|ranks? #|best bank/i;

function readerText(value: unknown): string {
  const parts: string[] = [];
  const visit = (node: unknown) => {
    if (typeof node === "string") {
      if (!/^https?:\/\//.test(node) && !node.startsWith("/")) parts.push(node);
      return;
    }
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    if (node && typeof node === "object") {
      for (const [key, item] of Object.entries(node)) {
        if (key === "winner" || key === "winnerName") continue;
        visit(item);
      }
    }
  };
  visit(value);
  return parts.join("\n");
}

describe("HYSA vs CD (ROO-381)", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the demand slug with no winner, ties only, and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBe(false);
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().faqs).toHaveLength(6);
    expect(page().expertAnalysis).not.toMatch(/\bFAQ\b|Frequently asked|Drafted with AI|human-reviewed/i);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    expect(isDegenerateComparisonSlug(SLUG)).toBe(false);
    const title = buildPageTitle(page().metadata.metaTitle);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toMatch(/A Versus B$/);
    const description = clampDescription(page().metadata.metaDescription);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-11-05T00:00:00Z");
    expect(page().category).toBe("finance");
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).not.toBe(true);
    }
    expect(page().shortAnswer).toMatch(/check the bank's current APY/);
    expect(findSelfContradictions(page())).toEqual([]);
    expect(page().citationStats?.sourceCount).toBe(9);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
  });

  it("keeps FAQ schema text identical to the visible answers", () => {
    expect(page().faqs.map((faq) => faq.answer)).toEqual(FAQ_ANSWERS);
    const schemas = comparisonPageSchema(page()) as Array<{
      "@type"?: string;
      "@graph"?: Array<{ "@type"?: string; mainEntity?: { name: string; acceptedAnswer?: { text: string } }[] }>;
      mainEntity?: { name: string; acceptedAnswer?: { text: string } }[];
    }>;
    const faqNodes = schemas.flatMap((node) => {
      const graph = node["@graph"] ?? [];
      return [node, ...graph].filter((item) => item["@type"] === "FAQPage");
    });
    expect(faqNodes).toHaveLength(1);
    const main = faqNodes[0].mainEntity ?? [];
    expect(main.map((item) => item.name)).toEqual(page().faqs.map((faq) => faq.question));
    expect(main.map((item) => item.acceptedAnswer?.text)).toEqual(page().faqs.map((faq) => faq.answer));
    const types = schemas.flatMap((node) => {
      const graph = (node as { "@graph"?: Array<{ "@type"?: string }> })["@graph"];
      return graph ? graph.map((child) => child["@type"]) : [node["@type"]];
    });
    expect(types.filter((type) => type === "ClaimReview")).toHaveLength(0);
  });

  it("states agency facts, skips invented yields, and links the live Ally vs Marcus page", () => {
    const text = readerText(page());
    for (const fact of [
      "$250,000",
      "per depositor, per insured bank, for each account ownership category",
      "per depositor, per FDIC-insured bank, for each account ownership category",
      "added together",
      "principal and accrued interest",
      "early-withdrawal penalty",
      "three months to five years",
      "variable-rate",
      "market-linked",
      "grace period",
      "BankFind",
      "Credit Union Locator",
      "full faith and credit",
      "private insurance",
      "current APY",
      "/compare/ally-bank-vs-marcus-by-goldman-sachs",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/\b\d+(?:\.\d+)?%\s*APY|earn \$\d|return of \$\d/i);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([
      FDIC_INSURANCE,
      FDIC_UNDERSTANDING,
      FDIC_ACCOUNTS,
      FDIC_CD_SHOPPING,
      FDIC_TISA,
      CFPB_CD,
      CFPB_ROLLOVER,
      CFPB_SAVINGS_FEES,
      NCUA_SHARE,
    ]);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "ally-bank-vs-marcus-by-goldman-sachs",
    ]);
    expect(isRedirectedCompareSlug("ally-bank-vs-marcus-by-goldman-sachs")).toBe(false);
  });

  it("shows up on the finance hub and keeps the shared Analysis disclosure", () => {
    const cards = mergeEditorialCategoryComparisons("finance", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const component = readFileSync("src/components/comparison/ExpertAnalysis.tsx", "utf8");
    expect(component).toContain("Drafted with AI from web research.");
    expect(page().metadata.isHumanReviewed).toBe(false);
  });
});
