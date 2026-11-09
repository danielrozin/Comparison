import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { assembleCompareJsonLd } from "@/lib/seo/compare-jsonld";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { mergeEditorialCategoryComparisons } from "@/lib/categories/hub-comparisons";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { isDegenerateComparisonSlug, sortComparisonSlug } from "@/lib/utils/slugify";
import { HUMAN_REVIEWED_SLUGS } from "@/lib/editorial/human-reviewed";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "32gb-vs-64gb-ram";
const QUESTION = "Which RAM Capacity, 32GB or 64GB?";

const FAQ_ANSWERS = [
  "It depends on the committed memory of the work you run. Microsoft's Windows 10 page-file article says the commit limit is physical memory plus all page files, and that reaching the limit can keep the system and processes from getting committed memory. Measure committed bytes against that limit on the Performance tab in Task Manager, or with the Memory counters Committed Bytes and Commit Limit. With the same page files, 64GB of physical memory sets a higher commit limit than 32GB, and a larger page file can also raise the limit. The article does not name a gigabyte total for any one kind of work.",
  "Yes. Both labels can total 64GB, and the module count is a separate choice from that total. On the Ryzen 7 7800X3D, AMD lists DDR5-5200 for 2x1R and 2x2R, and DDR5-3600 for 4x1R and 4x2R. On the Ryzen 9 9950X, AMD lists DDR5-5600 for 2x1R and 2x2R, and DDR5-3600 for 4x1R and 4x2R. Both processors list 2 memory channels. Match the module count and the rank label on the module to the row. These pages do not define the 1R and 2R tokens, and the rows are not a speed the PC is assured of holding. They are not the rows for every Ryzen or Intel processor.",
  "Not as a Corsair-validated kit. Corsair says its kits are validated for their rated performance only with the modules included in that specific kit, and it recommends that you do not combine multiple Corsair kits, even when they are rated at the same speed. Combining them risks stability problems, EXPO or XMP being prevented from enabling, or the system being unable to boot. Two separate kits are not the same validation as one kit that already contains four modules. Corsair states no probability that combining kits will work. For another brand, use that manufacturer's kit statement.",
  "AMD's specification lists a lower Max Memory Speed for the four-module rows than for the two-module rows on the Ryzen 7 7800X3D and the Ryzen 9 9950X. Both processors still list 2 memory channels, so four modules are not a four-channel configuration. The specifications do not give an electrical reason for the lower row. DDR5-5200, DDR5-5600, and DDR5-3600 are the names AMD prints. Micron's Rev. C 08/2023 addendum for a 16GB single-rank UDIMM writes DDR5-5600 beside 5600 MT/s and a 0.357 ns memory clock. AMD's DDR5- names are data-rate names in that unit, not megahertz clocks.",
  "No. On the Ryzen 7 7800X3D and the Ryzen 9 9950X, system memory is its own block: DDR5, 2 channels, UDIMM, and a maximum of 128 GB or 256 GB. Graphics Capabilities on those same pages list 2 graphics cores and a 2200 MHz graphics frequency, not a graphics-memory size. A graphics card's memory is a different specification. These pages do not say that a local model will run because the system has 32GB or 64GB.",
  "Write down the current price of one kit for the capacity your commit-charge measurement points to. If you are choosing how to reach 64GB, also write down the current price of one 2x32GB kit and one 4x16GB kit, then read the Max Memory Speed row for your exact processor, module count, and rank label. Prices change. This page does not list a price.",
];

const BANNED =
  /enough for most|most gaming|pays off|more stable|safer|often works|full speed|5200 MHz|5600 MHz|3600 MHz|memory controller|signal integrity|enter BIOS|reddit|returned 404|human-reviewed|reviewed by|Daniel Rozin|independent studies|\$\d|\bfps\b|quad-channel|\bguarantee\b/i;

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

function faqNodes(page: NonNullable<ReturnType<typeof getEditorialComparison>>) {
  const schemas = comparisonPageSchema(page) as Array<{
    "@type"?: string;
    "@graph"?: Array<{ "@type"?: string; mainEntity?: { name: string; acceptedAnswer?: { text: string } }[] }>;
    mainEntity?: { name: string; acceptedAnswer?: { text: string } }[];
    headline?: string;
    description?: string;
  }>;
  return schemas;
}

describe("32GB vs 64GB RAM (ROO-401)", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("aligns the question title, hero source, and Article headline, with the brand once", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBe(false);
    expect(HUMAN_REVIEWED_SLUGS).not.toContain(SLUG);
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().title).toBe(QUESTION);
    expect(page().metadata.metaTitle).toBe(QUESTION);
    expect(page().title.endsWith("?")).toBe(true);
    const branded = buildPageTitle(page().metadata.metaTitle);
    expect(branded).toBe(`${QUESTION} | A Versus B`);
    expect(branded.match(/A Versus B/g)).toHaveLength(1);
    expect(branded.length).toBeLessThanOrEqual(60);
    const description = clampDescription(page().metadata.metaDescription);
    expect(description).toBe(page().metadata.metaDescription);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    const answer = page().shortAnswer;
    expect(answer).toBeTruthy();
    expect(answer!.split(/(?<=[.!?])\s+/)).toHaveLength(2);
    const hero = readFileSync("src/pages/compare/[slug].tsx", "utf8");
    expect(hero).toContain('id="compare-hero-heading"');
    expect(hero).toMatch(/<h1 id="compare-hero-heading"[\s\S]*\{comparison\.title\}[\s\S]*<\/h1>/);
    const schemas = faqNodes(page());
    const articles = schemas.filter((node) => node["@type"] === "Article");
    expect(articles).toHaveLength(1);
    expect(articles[0].headline).toBe(page().title);
    const assembled = assembleCompareJsonLd({
      comparison: page(),
      voteData: null,
      videoNode: null,
      fallbackDescription: page().metadata.metaDescription,
    });
    const json = JSON.stringify(assembled.document);
    expect(json).toContain(`"headline":${JSON.stringify(QUESTION)}`);
    expect(json).not.toContain("reviewedBy");
    expect(json).not.toContain("lastReviewed");
    expect(json).not.toContain("isHumanReviewed");
    expect(json).not.toContain("Daniel Rozin");
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).not.toBe(true);
    }
    expect(findSelfContradictions(page())).toEqual([]);
    expect(isDegenerateComparisonSlug(SLUG)).toBe(false);
    expect(sortComparisonSlug(SLUG)).toBe(SLUG);
    expect(isRedirectedCompareSlug(SLUG)).toBe(false);
    expect(isRedirectedCompareSlug("64gb-vs-32gb-ram")).toBe(false);
    expect(getEditorialComparison("64gb-vs-32gb-ram")).toBeNull();
    expect(getEditorialComparison("ddr5-vs-ddr4")?.slug).toBe("ddr5-vs-ddr4");
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
  });

  it("keeps FAQ schema text identical to the visible answers", () => {
    expect(page().faqs).toHaveLength(6);
    expect(page().faqs.map((faq) => faq.answer)).toEqual(FAQ_ANSWERS);
    const schemas = faqNodes(page());
    const nodes = schemas.flatMap((node) => {
      const graph = node["@graph"] ?? [];
      return [node, ...graph].filter((item) => item["@type"] === "FAQPage");
    });
    expect(nodes).toHaveLength(1);
    const main = nodes[0].mainEntity ?? [];
    expect(main.map((item) => item.name)).toEqual(page().faqs.map((faq) => faq.question));
    expect(main.map((item) => item.acceptedAnswer?.text)).toEqual(page().faqs.map((faq) => faq.answer));
    const types = schemas.flatMap((node) => {
      const graph = (node as { "@graph"?: Array<{ "@type"?: string }> })["@graph"];
      return graph ? graph.map((child) => child["@type"]) : [node["@type"]];
    });
    expect(types.filter((type) => type === "ClaimReview")).toHaveLength(0);
  });

  it("states sourced limits and leaves unsupported universal claims off the page", () => {
    const text = readerText(page());
    for (const fact of [
      "128 GB",
      "256 GB",
      "DDR5-5200",
      "DDR5-5600",
      "DDR5-3600",
      "2x1R",
      "4x2R",
      "2 memory channels",
      "four-channel",
      "5600 MT/s",
      "0.357 ns",
      "2200 MHz",
      "Committed Bytes",
      "Commit Limit",
      "Windows 10",
      "MTC8C1084S1UC56BG1",
      "2x32GB",
      "4x16GB",
      "DDR5 vs DDR4 for Gaming: Is DDR5 Worth It?",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/human review|byline/i);
    const analysis = page().expertAnalysis ?? "";
    expect(analysis).not.toMatch(/Drafted with AI|human-reviewed|\bFAQ\b/i);
    expect(analysis.split(/\n\n+/).length).toBeGreaterThanOrEqual(8);
    expect(page().citationStats?.dataPointCount).toBe(0);
    expect(page().citationStats?.sourceCount).toBe(5);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(/^https:\/\/(www\.(amd|corsair)\.com|learn\.microsoft\.com|www\.farnell\.com)\//);
    }
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "ddr5-vs-ddr4",
      "am4-vs-am5",
      "ryzen-7-7800x3d-vs-ryzen-7-9800x3d",
    ]);
    for (const related of page().relatedComparisons) {
      expect(getEditorialComparison(related.slug)?.title).toBe(related.title);
      expect(isRedirectedCompareSlug(related.slug)).toBe(false);
    }
    const dataset = faqNodes(page()).find((node) => node["@type"] === "Dataset");
    expect(dataset?.description).toContain("5 sources and 0 data points");
  });

  it("shows up on the technology hub and keeps the shared Analysis disclosure", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const component = readFileSync("src/components/comparison/ExpertAnalysis.tsx", "utf8");
    expect(component).toContain("Drafted with AI from web research.");
    expect(page().metadata.isHumanReviewed).toBe(false);
  });
});
