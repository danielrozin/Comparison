import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExpertAnalysis } from "@/components/comparison/ExpertAnalysis";
import { ComparisonTable } from "@/components/comparison/ComparisonTable";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { isDegenerateComparisonSlug, sortComparisonSlug } from "@/lib/utils/slugify";
import { HUMAN_REVIEWED_SLUGS } from "@/lib/editorial/human-reviewed";
import {
  appendEditorialRelatedLinks,
  getEditorialComparison,
  listEditorialCompareSitemapEntries,
} from "../index";
import type { ComparisonPageData } from "@/types";

const SLUG = "am4-vs-am5";

const AMD_AM4 = "https://www.amd.com/en/products/processors/chipsets/am4.html";
const AMD_AM5 = "https://www.amd.com/en/products/processors/chipsets/am5.html";
const AMD_5600T =
  "https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-5-5600t.html";
const AMD_7600 =
  "https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-5-7600.html";
const AMD_8600G =
  "https://www.amd.com/en/products/processors/desktops/ryzen/8000-series/amd-ryzen-5-8600g.html";
const AMD_COMPUTEX =
  "https://www.amd.com/en/blogs/2026/amd-computex-2026-10-years-of-am4-am5-support-through.html";
const AMD_PARTNER = "https://www.amd.com/en/partner/articles/socket-am5-change-game.html";
const NOCTUA =
  "https://www.noctua.at/en/support/faqs/which-noctua-cpu-coolers-are-compatible-with-amd-am5";

const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|this article|article says|this page|checked against|Source note|(?:^|\n)Sources:|official page|\bfetch\b|human review|byline|reviewed by|reddit\.com|r\/buildapc|\bfps\b|£|6950|(?<!not )every AM4 cooler|all AM4 coolers/i;

function requiredString(value: string | null | undefined, label: string): string {
  if (typeof value !== "string") {
    throw new Error(`${label} is missing`);
  }
  return value;
}

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

beforeAll(() => {
  const view = window as Window & {
    matchMedia: typeof window.matchMedia;
    IntersectionObserver: typeof IntersectionObserver;
  };
  if (!view.matchMedia) {
    view.matchMedia = (() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  }
  if (!view.IntersectionObserver) {
    class Observer {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    view.IntersectionObserver = Observer as unknown as typeof IntersectionObserver;
  }
});

describe("AM4 vs AM5", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the socket decision with no winner, ties only, and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBe(false);
    expect(HUMAN_REVIEWED_SLUGS).toEqual([]);
    expect(page().quickAnswer?.winnerName).toBeNull();
    const shortAnswer = requiredString(page().shortAnswer, "shortAnswer");
    const analysis = requiredString(page().expertAnalysis, "expertAnalysis");
    expect(page().quickAnswer?.tldr).toBe(shortAnswer);
    expect(shortAnswer.split(/(?<=[.?!])\s+/)).toHaveLength(2);
    expect(shortAnswer).toMatch(/PCIe 5\.0 only on some/);
    expect(page().faqs).toHaveLength(6);
    expect(analysis).not.toMatch(/\bFAQ\b|Frequently asked|Drafted with AI|human-reviewed/i);
    expect(analysis.startsWith(shortAnswer)).toBe(true);
    expect(getEditorialComparison("rtx-5070-vs-rx-9070-xt"), "ROO-388 registry import").not.toBeNull();
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    expect(sortComparisonSlug(SLUG)).toBe(SLUG);
    expect(isDegenerateComparisonSlug(SLUG)).toBe(false);
    expect(buildPageTitle(page().metadata.metaTitle).length).toBeLessThanOrEqual(60);
    const description = clampDescription(page().metadata.metaDescription);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-11-06T00:00:00Z");
    expect(page().category).toBe("technology");
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attribute of page().attributes) {
      for (const value of attribute.values) expect(value.winner).not.toBe(true);
    }
    expect(findSelfContradictions(page())).toEqual([]);
    for (const related of page().relatedComparisons) {
      expect(getEditorialComparison(related.slug), related.slug).not.toBeNull();
    }
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "ryzen-7-5800x3d-vs-am5",
      "ddr5-vs-ddr4",
      "b650-vs-b850",
    ]);
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

  it("uses AMD and Noctua facts and does not narrate the research", () => {
    const text = readerText(page());
    for (const fact of [
      "DDR4",
      "DDR5",
      "Ryzen 5 5600T",
      "Ryzen 5 7600",
      "Ryzen 5 8600G",
      "PCIe 4.0",
      "PCIe 5.0",
      "28 total",
      "20 total",
      "up to 0",
      "NH-L9a-AM4",
      "NM-AM4-L9aL9i",
      "through 2029",
      "31 May 2026",
      "selective beta BIOS",
      "1x8 PCIe Gen3",
      "Wraith Stealth",
      "LGA 1718",
      "Shopping judgment",
      "Neither socket is right for everyone",
      "B650 and B650E",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).toMatch(/X570 is marked for Ryzen 2000 processors without Radeon Graphics/);
    expect(text).not.toMatch(/X570 is not marked for Athlon processors with Radeon Graphics, Ryzen 1000, Ryzen 2000,/);
    expect(text).toMatch(/specifications header names 7th Gen A-Series, and that name is not a matrix column/);
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/\d+(?:\.\d+)?\s?%/);
    expect(text).not.toMatch(/\$\d/);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([
      AMD_AM4,
      AMD_AM5,
      AMD_5600T,
      AMD_7600,
      AMD_8600G,
      AMD_COMPUTEX,
      AMD_PARTNER,
      NOCTUA,
    ]);
    expect(page().resources?.map((resource) => resource.url)).toEqual([
      AMD_AM4,
      AMD_AM5,
      AMD_5600T,
      AMD_7600,
      AMD_8600G,
      AMD_COMPUTEX,
      AMD_PARTNER,
      NOCTUA,
    ]);
    expect(page().citationStats?.sourceCount).toBe(8);
  });

  it("links the 5800X3D page back here and keeps the shared Analysis disclosure", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const pcs = CATEGORY_SUBCATEGORIES.technology.find((item) => item.slug === "laptops-computers");
    expect(comparisonsForSubcategory(cards, pcs!).map((card) => card.slug)).toContain(SLUG);
    const upgrade = appendEditorialRelatedLinks({
      slug: "ryzen-7-5800x3d-vs-am5",
      relatedComparisons: [],
    } as unknown as ComparisonPageData);
    expect(upgrade.relatedComparisons.map((item) => item.slug)).toContain(SLUG);
    const component = readFileSync("src/components/comparison/ExpertAnalysis.tsx", "utf8");
    expect(component).toContain("Analysis:");
    expect(component).toContain("Drafted with AI from web research.");
    expect(page().metadata.isHumanReviewed).toBe(false);
  });

  it("renders the Analysis disclosure, takeaways, and a captioned platform table", () => {
    const data = page();
    render(
      <>
        <ExpertAnalysis
          analysis={data.expertAnalysis ?? ""}
          entityAName={data.entities[0].name}
          entityBName={data.entities[1].name}
          updatedAt={data.metadata.updatedAt}
          slug={data.slug}
        />
        <ComparisonTable
          attributes={data.attributes}
          entityA={data.entities[0]}
          entityB={data.entities[1]}
        />
      </>
    );
    expect(screen.getByRole("heading", { name: /Analysis: Socket AM4 vs Socket AM5/ })).toBeTruthy();
    expect(screen.getByText(/Drafted with AI from web research\./)).toBeTruthy();
    expect(screen.queryByText(/Daniel Rozin/)).toBeNull();
    expect(screen.queryByText(/Human reviewed/)).toBeNull();
    expect(screen.getByText(/Key takeaways/)).toBeTruthy();
    expect(screen.getByText(/Parts basket/)).toBeTruthy();
    const caption = document.querySelector("caption");
    expect(caption?.textContent).toBe("Socket AM4 vs Socket AM5 — attribute comparison table");
    expect(screen.getByRole("row", { name: /Memory type/ })).toBeTruthy();
    expect(screen.getAllByText("DDR4 (AMD AM4 chipset specifications)").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Ryzen 5 8600G: PCIe 4\.0, 20\/16/).length).toBeGreaterThan(0);
  });
});
