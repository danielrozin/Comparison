import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import {
  appendEditorialRelatedLinks,
  getEditorialComparison,
  listEditorialCompareSitemapEntries,
} from "../index";
import type { ComparisonPageData } from "@/types";

const SLUG = "qd-oled-vs-woled";

const BANNED =
  /this page|page lists|list shows|table lists|page says|on that page|the page|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|\babove\b|\bshown\b|human review|byline|Drafted with AI|\bwinner\b|reddit/i;

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
        if (key === "winner") continue;
        visit(item);
      }
    }
  };
  visit(value);
  return parts.join("\n");
}

describe("QD-OLED vs WOLED (ROO-371)", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBe(false);
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().faqs).toHaveLength(5);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toMatch(/A Versus B$/);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-11-03T00:00:00Z");
    expect(page().category).toBe("technology");
    expect(findSelfContradictions(page())).toEqual([]);
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).not.toBe(true);
    }
    expect(page().citationStats?.sourceCount).toBe(4);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([
      "https://www.techspot.com/article/2824-qd-oled-vs-woled/",
      "https://tftcentral.co.uk/articles/exploring-the-grey-banding-issue-affecting-some-tandem-woled-panels",
      "https://tftcentral.co.uk/articles/oled-rgb-stripe-panels-explained-should-you-wait",
      "https://rog.asus.com/articles/gaming-monitors/qd-oled-vs-tandem-oled-vs-rgb-stripe-oled-the-complete-gaming-monitor-panel-guide/",
    ]);
    expect(page().resources?.slice(0, 4).map((resource) => resource.url)).toEqual(
      page().citationStats?.sources.map((source) => source.url),
    );
    expect(page().resources?.at(-1)?.url).toBe(
      "https://www.aversusb.net/entity/oled-organic-light-emitting-diode",
    );
  });

  it("writes the verdict as choose-if and keeps FAQ schema identical to the visible answers", () => {
    expect(page().shortAnswer).toMatch(/^Choose QD-OLED if /);
    expect(page().shortAnswer).toMatch(/Choose WOLED if /);
    expect(page().verdict).toMatch(/^Choose QD-OLED if /);
    expect(page().verdict).toMatch(/Choose WOLED if /);
    expect(page().expertAnalysis).toMatch(/^Choose QD-OLED if /);
    expect(page().expertAnalysis).toContain("Key takeaways");
    expect(page().expertAnalysis).toContain("Generation decoder");
    expect(page().expertAnalysis).not.toMatch(/Drafted with AI|human-reviewed|FAQ/i);

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

  it("keeps dated panel facts and skips source-talk and a burn-in winner", () => {
    const text = readerText(page());
    for (const fact of [
      "0.3 ms",
      "250 nits",
      "73 percent",
      "34 percent",
      "105 nits",
      "241 nits",
      "296 nits",
      "686 nits",
      "34 nits",
      "69 nits",
      "897 nits",
      "603 nits",
      "480 Hz",
      "35 to 40 percent",
      "47 watts",
      "32 watts",
      "13 April 2024",
      "13 February 2026",
      "7 August 2026",
      "25 August 2026",
      "1.25 percent",
      "31 percent",
      "166 PPI",
      "110 PPI",
      "True Black 500",
      "True Black 400",
      "no evidence",
      "RGWB",
      "RWBG",
      "V-Stripe",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).toContain("no evidence that one type is more resilient than the other");
    expect(text).not.toMatch(/resists burn-in better|less burn-in|QD-OLED is more resilient|WOLED is more resilient/i);
    expect(text).not.toMatch(/\$\d/);
    expect(page().expertAnalysis).toContain("/entity/oled-organic-light-emitting-diode");
  });

  it("cross-links the live OLED compares without copying their pages", () => {
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "oled-vs-mini-led-gaming-monitor",
      "oled-vs-qled",
      "lg-oled-vs-sony-oled",
    ]);
    expect(page().relatedBlogPosts.map((post) => post.slug)).toEqual(["samsung-vs-lg-oled-tv-2026"]);
    for (const slug of ["oled-vs-mini-led-gaming-monitor", "oled-vs-qled", "lg-oled-vs-sony-oled"]) {
      expect(isRedirectedCompareSlug(slug)).toBe(false);
    }
    expect(getEditorialComparison("oled-vs-qled")).toBeNull();
    expect(getEditorialComparison("lg-oled-vs-sony-oled")).toBeNull();

    for (const slug of ["oled-vs-mini-led-gaming-monitor", "oled-vs-qled", "lg-oled-vs-sony-oled"]) {
      const linked = appendEditorialRelatedLinks({
        slug,
        relatedComparisons: [],
      } as unknown as ComparisonPageData);
      expect(linked.relatedComparisons.map((item) => item.slug)).toEqual([SLUG]);
    }

    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const gaming = CATEGORY_SUBCATEGORIES.technology.find((sub) => sub.slug === "gaming-tech");
    expect(comparisonsForSubcategory(cards, gaming!).map((card) => card.slug)).toContain(SLUG);
  });

  it("does not reuse long sentences from the OLED vs Mini-LED page", () => {
    const own = page().expertAnalysis ?? "";
    const other = readFileSync("src/lib/data/editorial-compares/oled-vs-mini-led-gaming-monitor.ts", "utf8");
    const sentences = own.split(/(?<=[.!?])\s+/).filter((sentence) => sentence.length > 80);
    for (const sentence of sentences) expect(other.includes(sentence), sentence).toBe(false);
  });

  it("keeps the Analysis disclosure in the shared component, not a human byline", () => {
    const component = readFileSync("src/components/comparison/ExpertAnalysis.tsx", "utf8");
    expect(component).toContain("Analysis:");
    expect(component).toContain("Drafted with AI from web research.");
    expect(page().metadata.isHumanReviewed).toBe(false);
  });
});
