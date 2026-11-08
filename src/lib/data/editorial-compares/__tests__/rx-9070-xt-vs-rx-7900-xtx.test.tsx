import { beforeAll, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { comparisonPageSchema, datasetCitationDescription } from "@/lib/seo/schema";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { HUMAN_REVIEWED_SLUGS } from "@/lib/editorial/human-reviewed";
import { ExpertAnalysis } from "@/components/comparison/ExpertAnalysis";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "rx-9070-xt-vs-rx-7900-xtx";
const REVERSE = "rx-7900-xtx-vs-rx-9070-xt";
const UNLIVE = "rtx-5070-ti-vs-rx-9070-xt";

beforeAll(() => {
  const view = window as Window & {
    matchMedia: typeof window.matchMedia;
    IntersectionObserver: typeof IntersectionObserver;
  };
  if (!view.matchMedia) {
    view.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
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

const BANNED =
  /page lists|list shows|table lists|page says|on that page|the page|this article|article says|checked against|Source note|(?:^|\n)Sources:|official page|this page|\babove the\b|according to|human review|reviewed by|byline|\bfps\b|benchmark|\d+(?:\.\d+)?\s?%|faster than|usually the better|most games|better buy|only buy|\$\d|€/i;

function readerText(value: unknown): string {
  const parts: string[] = [];
  const visit = (node: unknown) => {
    if (typeof node === "string") {
      if (!/^https?:\/\//.test(node)) parts.push(node);
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

function schemaTypes(page: NonNullable<ReturnType<typeof getEditorialComparison>>) {
  return (comparisonPageSchema(page) as Array<{ "@type"?: string }>).flatMap((node) => {
    const graph = (node as { "@graph"?: Array<{ "@type"?: string }> })["@graph"];
    return graph ? graph.map((child) => child["@type"]) : [node["@type"]];
  });
}

describe("RX 9070 XT vs RX 7900 XTX", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes a tied draft with six FAQs and no human-review claim", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBeFalsy();
    expect(HUMAN_REVIEWED_SLUGS).not.toContain(SLUG);
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().keyDifferences.every((row) => row.winner === "tie")).toBe(true);
    expect(page().attributes.every((attr) => attr.values.every((value) => value.winner !== true))).toBe(true);
    expect(page().faqs).toHaveLength(6);
    expect(page().expertAnalysis).not.toMatch(/\bFAQ\b|Frequently asked/i);
    expect(page().metadata.updatedAt).toBe("2026-11-08T00:00:00Z");
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    expect(getEditorialComparison(REVERSE)).toBeNull();
    expect(page().relatedComparisons.map((item) => item.slug)).not.toContain(UNLIVE);
    expect(buildPageTitle(page().metadata.metaTitle).length).toBeLessThanOrEqual(60);
    const description = clampDescription(page().metadata.metaDescription);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    for (const related of page().relatedComparisons) {
      expect(getEditorialComparison(related.slug)?.metadata.status).toBe("published");
    }
    expect(findSelfContradictions(page())).toEqual([]);
    expect(schemaTypes(page()).filter((type) => type === "FAQPage")).toHaveLength(1);
    expect(schemaTypes(page()).filter((type) => type === "ClaimReview")).toHaveLength(0);
  });

  it("keeps FAQ schema text identical to the visible answers", () => {
    const schemas = comparisonPageSchema(page()) as Array<{
      "@type"?: string;
      "@graph"?: Array<{ "@type"?: string; mainEntity?: { name: string; acceptedAnswer?: { text: string } }[] }>;
      mainEntity?: { name: string; acceptedAnswer?: { text: string } }[];
    }>;
    const faqNodes = schemas.flatMap((node) => {
      if (node["@type"] === "FAQPage") return [node];
      return (node["@graph"] ?? []).filter((child) => child["@type"] === "FAQPage");
    });
    expect(faqNodes).toHaveLength(1);
    const entities = faqNodes[0].mainEntity ?? [];
    expect(entities.map((item) => item.name)).toEqual(page().faqs.map((faq) => faq.question));
    expect(entities.map((item) => item.acceptedAnswer?.text)).toEqual(page().faqs.map((faq) => faq.answer));
  });

  it("counts substantive sources and does not invent a zero data-point claim", () => {
    const stats = page().citationStats!;
    expect(stats.dataPointCount).toBe(0);
    expect(stats.sourceCount).toBe(stats.sources.length);
    expect(stats.sources.map((source) => source.url)).toEqual(page().resources?.map((resource) => resource.url));
    expect(stats.lastResearched).toBe("2026-11-08");
    const description = datasetCitationDescription(stats, "AMD Radeon RX 9070 XT vs AMD Radeon RX 7900 XTX", true);
    expect(description).toContain(`${stats.sourceCount} sources`);
    expect(description).not.toContain("0 data points");
    const dataset = (comparisonPageSchema(page()) as Array<{ "@type"?: string; description?: string }>).find(
      (node) => node["@type"] === "Dataset",
    );
    expect(dataset?.description).not.toContain("0 data points");
    expect(dataset?.description).toContain("7 sources");
  });

  it("keeps the cards distinct and states FSR limits without a spec-sheet winner", () => {
    const text = readerText(page());
    for (const fact of [
      "16 GB GDDR6",
      "24 GB GDDR6",
      "64",
      "96",
      "4096",
      "6144",
      "2970 MHz",
      "2500 MHz",
      "304 W",
      "355 W",
      "750 W",
      "800 W",
      "December 13, 2022",
      "March 6, 2025",
      "up to 3.0 GHz",
      "GD-151",
      "GD-223",
      "Shader Model 6.6",
      "4.1.1",
      "June 24, 2026",
      "56 compute units",
      "84 compute units",
      "20 GB",
    ]) {
      expect(text).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).toMatch(/previously exclusive/);
    expect(text).toMatch(/not the support list in the later documents/);
    expect(text).toMatch(/does not treat RX 6000 support as settled/);
    expect(text).toMatch(/Upscaling support is not frame generation/);
    expect(text).not.toMatch(/RX 6000 series on the 4\.1\.1 line[\s\S]{0,80}available on RX 6000/i);
    expect(text).not.toMatch(/community opinion|reddit/i);
    const current = page();
    expect(current.expertAnalysis?.startsWith(current.shortAnswer ?? "")).toBe(true);
  });

  it("renders answer headings and a captioned specification table", () => {
    const current = page();
    render(
      <ExpertAnalysis
        analysis={current.expertAnalysis ?? ""}
        slug={SLUG}
        entityAName="AMD Radeon RX 9070 XT"
        entityBName="AMD Radeon RX 7900 XTX"
        updatedAt={current.metadata.updatedAt}
      />,
    );
    expect(screen.getByRole("heading", { name: "Analysis: AMD Radeon RX 9070 XT vs AMD Radeon RX 7900 XTX" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The current specifications list 16 GB and 24 GB" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "FSR upscaling is a different list from the Redstone suite" })).toBeInTheDocument();
    const table = screen.getByRole("table");
    expect(table.querySelector("caption")?.textContent).toMatch(/opened 8 November 2026/);
    expect(table.querySelectorAll("th[scope='col']").length).toBeGreaterThanOrEqual(3);
    expect(table.querySelectorAll("th[scope='row']").length).toBe(current.attributes.length);
    expect(screen.getByText(/Drafted with AI from web research/)).toBeInTheDocument();
    expect(screen.queryByText(/Daniel Rozin/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Human reviewed/)).not.toBeInTheDocument();
  });

  it("shows up on the technology gaming hub", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const gaming = CATEGORY_SUBCATEGORIES.technology.find((sub) => sub.slug === "gaming-tech");
    expect(comparisonsForSubcategory(cards, gaming!).map((card) => card.slug)).toContain(SLUG);
  });
});
