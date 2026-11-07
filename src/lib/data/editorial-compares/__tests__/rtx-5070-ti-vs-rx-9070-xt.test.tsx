import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { HUMAN_REVIEWED_SLUGS } from "@/lib/editorial/human-reviewed";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { isDegenerateComparisonSlug, sortComparisonSlug } from "@/lib/utils/slugify";
import { ComparisonTable } from "@/components/comparison/ComparisonTable";
import { ExpertAnalysis } from "@/components/comparison/ExpertAnalysis";
import { FAQBlock } from "@/components/comparison/FAQ";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "rtx-5070-ti-vs-rx-9070-xt";
const REVERSE = "rx-9070-xt-vs-rtx-5070-ti";

const NV_FAMILY = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/";
const NV_ARCH =
  "https://images.nvidia.com/aem-dam/Solutions/geforce/blackwell/nvidia-rtx-blackwell-gpu-architecture.pdf";
const NV_SHOP = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/#shop-all";
const AMD_XT =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070xt.html";
const AMD_PR =
  "https://www.amd.com/en/newsroom/press-releases/2025-2-28-amd-unveils-next-generation-amd-rdna-4-architectu.html";
const AMD_BUY = "https://www.amd.com/en/where-to-buy/graphics/radeon.html";

// Figures read from NVIDIA and AMD on 7 November 2026. Not a benchmark sample.
const PRIMARY_FACTS = [
  "8960",
  "6144",
  "4096",
  "16 GB",
  "12 GB",
  "GDDR7",
  "GDDR6",
  "256-bit",
  "192-bit",
  "896 GB/sec",
  "672 GB/sec",
  "640 GB/s",
  "64 MB",
  "2.45 GHz",
  "2.3 GHz",
  "2452 MHz",
  "2.51 GHz",
  "2.33 GHz",
  "2400 MHz",
  "2970 MHz",
  "3.0 GHz",
  "2.4 GHz",
  "300 W",
  "250 W",
  "304 W",
  "750 W",
  "650 W",
  "Blackwell",
  "RDNA 4",
  "DLSS 5",
  "DLSS 4",
  "FSR \"Redstone\"",
  "FSR 4",
  "CUDA Capability 12.0",
  "Reflex 2",
  "NVENC",
  "AV1",
  "May 12, 2025",
  "February 28, 2025",
  "1406 AI TOPS",
  "703/1406",
  "133 TFLOPS",
  "133.2",
  "DisplayPort 2.1b",
  "DisplayPort 2.1a",
  "HDMI 2.1b",
  "Fluid Motion Frames 2.1",
  "64 ray accelerators",
  "Ryzen 9 9950X",
  "Frame Warp",
  "28 Gbps",
  "20 Gbps",
];

const BANNED =
  /\bpage\b|\barticle\b|page says|article says|human review|byline|reviewed by|\bwinner\b|Drafted with AI|reddit|r\/buildapc|€|\$|MSRP|placeholder|TODO|future-proof|future proof|path tracing|ensures faster/i;

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
    view.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
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

describe("RTX 5070 Ti vs RX 9070 XT", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes one canonical slug with no winner, ties only, and an empty review allowlist", () => {
    expect(getEditorialComparison(REVERSE)).toBeNull();
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBe(false);
    expect(HUMAN_REVIEWED_SLUGS).toEqual([]);
    expect(HUMAN_REVIEWED_SLUGS).not.toContain(SLUG);
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().faqs).toHaveLength(6);
    expect(page().expertAnalysis).not.toMatch(/\bFAQ\b|Frequently asked|Drafted with AI|human-reviewed/i);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    expect(sortComparisonSlug(SLUG)).toBe(SLUG);
    expect(sortComparisonSlug(REVERSE)).toBe(SLUG);
    expect(isDegenerateComparisonSlug(SLUG)).toBe(false);
    const title = buildPageTitle(page().metadata.metaTitle);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toMatch(/A Versus B$/);
    expect(page().title.length).toBeLessThanOrEqual(60);
    expect(page().title).toMatch(/GPU/);
    const description = clampDescription(page().metadata.metaDescription);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(description).toBe(page().metadata.metaDescription);
    expect(page().metadata.updatedAt).toBe("2026-11-07T00:00:00Z");
    expect(page().metadata.publishedAt).toBe("2026-11-07T00:00:00Z");
    expect(page().category).toBe("technology");
    expect(page().keyDifferences.length).toBeGreaterThan(0);
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).not.toBe(true);
    }
    expect(page().entities.map((entity) => entity.imageUrl)).toEqual([null, null]);
    expect((page().shortAnswer ?? "").split(/(?<=[.!?])\s+/)).toHaveLength(2);
    expect(page().shortAnswer).toMatch(/neither card is the right one for every buyer/i);
    expect(findSelfContradictions(page())).toEqual([]);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.reviewsAnalyzed).toBeNull();
    expect(page().citationStats?.preferencePercent).toBeNull();
    expect(page().citationStats?.dataPointCount).toBe(PRIMARY_FACTS.length);
    expect(PRIMARY_FACTS).toHaveLength(52);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "rtx-5070-vs-rx-9070-xt",
      "rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti",
      "rx-9070-vs-rx-9070-xt",
    ]);
    for (const related of page().relatedComparisons) {
      expect(getEditorialComparison(related.slug), related.slug).not.toBeNull();
      expect(related.slug).not.toBe(SLUG);
    }
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
    const serialized = JSON.stringify(schemas);
    expect(serialized).not.toMatch(/Daniel Rozin/);
    expect(serialized).not.toMatch(/"isHumanReviewed":\s*true/);
  });

  it("uses dated vendor specs and leaves out prices, community posts, and performance crowns", () => {
    const text = readerText(page());
    for (const fact of PRIMARY_FACTS) {
      expect(text, fact).toContain(fact);
    }
    expect(text).toMatch(/Marketing copy: DLSS 5/);
    expect(text).toMatch(/Specifications table: DLSS 4/);
    expect(text).toMatch(/FSR "Redstone"/);
    expect(text).toMatch(/FSR 4/);
    expect(text).toMatch(/not a frame-rate result/);
    expect(text).toMatch(/not measured wall power|None of these is measured wall power|Neither rating is measured wall power/);
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/page says|article says/i);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([
      NV_FAMILY,
      NV_ARCH,
      AMD_XT,
      AMD_PR,
      NV_SHOP,
      AMD_BUY,
    ]);
  });

  it("renders the Analysis disclosure, FAQ answers, and a captioned source-noted table", () => {
    const data = page();
    const analysis = render(
      <ExpertAnalysis
        analysis={data.expertAnalysis ?? ""}
        entityAName={data.entities[0].name}
        entityBName={data.entities[1].name}
        slug={data.slug}
        updatedAt={data.metadata.updatedAt}
      />,
    );
    expect(screen.getByRole("heading", { name: "Analysis: RTX 5070 Ti vs RX 9070 XT" })).toBeTruthy();
    expect(analysis.container).toHaveTextContent("Drafted with AI from web research.");
    expect(analysis.container).not.toHaveTextContent("Daniel Rozin");
    expect(analysis.container).not.toHaveTextContent("Human reviewed");
    expect(analysis.container).toHaveTextContent("November 7, 2026");
    analysis.unmount();

    const faqs = render(<FAQBlock faqs={data.faqs} />);
    const visible = Array.from(faqs.container.querySelectorAll(".faq-answer")).map((node) =>
      (node.textContent ?? "").replace(/\s+/g, " ").trim(),
    );
    expect(visible).toEqual(data.faqs.map((faq) => faq.answer));
    faqs.unmount();

    const table = render(
      <ComparisonTable
        attributes={data.attributes}
        entityA={data.entities[0]}
        entityB={data.entities[1]}
      />,
    );
    const caption = table.container.querySelector("caption");
    expect(caption?.textContent).toBe("RTX 5070 Ti vs RX 9070 XT — attribute comparison table");
    const rendered = table.container.textContent ?? "";
    for (const attr of data.attributes) {
      for (const value of attr.values) {
        expect(rendered).toContain(value.valueText ?? "");
        expect(value.valueText ?? "").toMatch(/NVIDIA|AMD/);
      }
    }
    table.unmount();

    const component = readFileSync("src/components/comparison/ExpertAnalysis.tsx", "utf8");
    expect(component).toContain("Analysis:");
    expect(component).toContain("Drafted with AI from web research.");
    expect(data.metadata.isHumanReviewed).toBe(false);
  });

  it("shows up on the gaming hub and stays distinct from the non-Ti and three-card slugs", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const gaming = CATEGORY_SUBCATEGORIES.technology.find((item) => item.slug === "gaming-tech");
    expect(comparisonsForSubcategory(cards, gaming!).map((card) => card.slug)).toContain(SLUG);
    expect(SLUG).not.toBe("rtx-5070-vs-rx-9070-xt");
    expect(SLUG).not.toBe("rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti");
    expect(getEditorialComparison("rtx-5070-vs-rx-9070-xt")?.slug).toBe("rtx-5070-vs-rx-9070-xt");
    expect(getEditorialComparison("rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti")?.entities).toHaveLength(3);
  });
});
