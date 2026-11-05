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
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "lenovo-legion-5-vs-asus-rog-strix-g16";

const PSREF_15AHP11 = "https://psref.lenovo.com/Detail/Legion_5_15AHP11?M=83Q7005FKR";
const PSREF_15AHP10 =
  "https://psref.lenovo.com/syspool/Sys/PDF/Legion/Legion_5_15AHP10/Legion_5_15AHP10_Spec.PDF";
const PSREF_15IAX10 =
  "https://psref.lenovo.com/syspool/Sys/PDF/Legion/Legion_5_15IAX10/Legion_5_15IAX10_Spec.pdf";
const PSREF_PRO = "https://psref.lenovo.com/Product/Legion/Legion_Pro_5_16AFR10";
const ASUS_G615 = "https://rog.asus.com/laptops/rog-strix/rog-strix-g16-2025/spec/";
const ASUS_TGP =
  "https://rog.asus.com/articles/rog-gaming-laptops/the-complete-list-of-geforce-gpu-power-specifications-for-2025-rog-and-tuf-gaming-laptops/";
const ASUS_GUIDE =
  "https://dlcdnwebimgs.asus.com/files/media/0de32796-13f7-4be1-aabf-8ef3c5bc7830/product-guide/NP_ProductGuide_ROG_Q12025.pdf";

// Reader copy credits Lenovo PSREF and ASUS. It must not narrate the research,
// name a winner, or carry prices, frame rates, or the dropped DDR4 rows.
const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|this article|article says|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|\bshown\b|\babove\b|reddit|human review|byline|reviewed by|\bwinner\b|\bbest\b|Drafted with AI|\$\d|400 nits|DDR4|fps/i;

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

describe("Lenovo Legion 5 vs ASUS ROG Strix G16 (ROO-374)", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner, ties only, and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBe(false);
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().faqs).toHaveLength(5);
    expect(page().expertAnalysis).not.toMatch(/\bFAQ\b|Frequently asked|Drafted with AI|human-reviewed/i);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    const title = buildPageTitle(page().metadata.metaTitle);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toMatch(/A Versus B$/);
    const description = clampDescription(page().metadata.metaDescription);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-11-04T00:00:00Z");
    expect(page().category).toBe("technology");
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).not.toBe(true);
    }
    expect(page().shortAnswer).toMatch(/Every figure varies by configuration/);
    expect(findSelfContradictions(page())).toEqual([]);
    expect(page().citationStats?.sourceCount).toBe(7);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
  });

  it("keeps FAQ schema text identical to the visible answers", () => {
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

  it("states sourced laptop facts and links the live related compares", () => {
    const text = readerText(page());
    for (const fact of [
      "15AHP10",
      "15AHP11",
      "15IAX10",
      "16AFR10",
      "83Q7005FKR",
      "G615",
      "G614",
      "G615LW",
      "G615LR",
      "140 W",
      "175 W",
      "115 W",
      "2560x1600",
      "1920x1200",
      "165 Hz",
      "240 Hz",
      "300 Hz",
      "True Black 1000",
      "True Black 600",
      "500 nits",
      "1000 nits",
      "1100 nits",
      "300 nits",
      "90 Wh",
      "80 Wh",
      "60 Wh",
      "32 GB",
      "64 GB",
      "RTX 5070 Ti",
      "RTX 5080",
      "8 GB",
      "12 GB",
      "16 GB",
      "Ryzen 7 250",
      "Ryzen 7 260",
      "275HX",
      "1-year",
      "varies by configuration",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([
      PSREF_15AHP11,
      PSREF_15AHP10,
      PSREF_15IAX10,
      PSREF_PRO,
      ASUS_G615,
      ASUS_TGP,
      ASUS_GUIDE,
    ]);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "intel-core-ultra-9-275hx-vs-amd-ryzen-9-9955hx",
      "rtx-5070-ti-laptop-vs-rtx-5080-laptop",
      "oled-vs-mini-led-gaming-monitor",
      "qd-oled-vs-woled",
    ]);
    for (const slug of page().relatedComparisons.map((item) => item.slug)) {
      expect(isRedirectedCompareSlug(slug)).toBe(false);
      expect(getEditorialComparison(slug)).not.toBeNull();
    }
    expect(page().expertAnalysis).toContain("/compare/qd-oled-vs-woled");
  });

  it("shows up on the laptops hub and keeps the shared Analysis disclosure", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const sub = CATEGORY_SUBCATEGORIES.technology.find((item) => item.slug === "laptops-computers");
    expect(comparisonsForSubcategory(cards, sub!).map((card) => card.slug)).toContain(SLUG);
    const component = readFileSync("src/components/comparison/ExpertAnalysis.tsx", "utf8");
    expect(component).toContain("Drafted with AI from web research.");
    expect(page().metadata.isHumanReviewed).toBe(false);
  });
});
