import type { ComponentProps } from "react";
import { beforeAll, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ComparisonPage, { getStaticProps } from "@/pages/compare/[slug]";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { HUMAN_REVIEWED_SLUGS } from "@/lib/editorial/human-reviewed";
import { isDegenerateComparisonSlug, sortComparisonSlug } from "@/lib/utils/slugify";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "msi-mag-b850-tomahawk-max-wifi-vs-asus-tuf-gaming-b850-plus-wifi";
const QUESTION = "B850 Tomahawk Max vs TUF B850-Plus";

const MSI_SPEC = "https://www.msi.com/Motherboard/MAG-B850-TOMAHAWK-MAX-WIFI/Specification";
const MSI_OVERVIEW = "https://www.msi.com/Motherboard/MAG-B850-TOMAHAWK-MAX-WIFI/Overview";
const MSI_MANUAL = "https://download-2.msi.com/archive/mnu_exe/mb/MAGB850TOMAHAWKMAXWIFI_English.pdf";
const ASUS_PRODUCT =
  "https://www.asus.com/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b850-plus-wifi/";
const ASUS_TECH =
  "https://www.asus.com/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b850-plus-wifi/techspec/";
const ASUS_MANUAL =
  "https://dlcdnets.asus.com/pub/ASUS/mb/SocketAM5/TUF_GAMING_B850-PLUS_WIFI/E25809_TUF_GAMING_B850-PLUS_WIFI_UM_V2_WEB.pdf";
const AMD_9800X3D =
  "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9800x3d.html";

const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|article says|checked|Source note|(?:^|\n)Sources:|official page|\bfetch\b|this comparison|this page|returned 404|does not print|doesn't print|\bwinner\b|\bbest\b|better value|worth it|reddit|r\/buildapc|r\/PcBuild|\bfps\b|benchmark|\$\d|comfortably|better buy/i;

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
        if (key === "winner" || key === "winnerName" || key === "winnerReason") continue;
        visit(item);
      }
    }
  };
  visit(value);
  return parts.join("\n");
}

type JsonNode = {
  "@type"?: string | string[];
  "@graph"?: JsonNode[];
  headline?: string;
  author?: { name?: string };
  reviewedBy?: unknown;
  isHumanReviewed?: unknown;
  lastReviewed?: unknown;
  description?: string;
  mainEntity?: { name?: string; acceptedAnswer?: { text?: string } }[];
};

function nodesOf(document: JsonNode): JsonNode[] {
  const graph = document["@graph"] ?? [];
  return [document, ...graph.flatMap((node) => nodesOf(node))];
}

function typeOf(node: JsonNode): string[] {
  const value = node["@type"];
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
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

describe("MSI MAG B850 Tomahawk Max WiFi vs ASUS TUF Gaming B850-Plus WiFi (ROO-435)", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the brief slug with no winner and a tied table", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBe(false);
    expect(HUMAN_REVIEWED_SLUGS).toEqual([]);
    expect(HUMAN_REVIEWED_SLUGS).not.toContain(SLUG);
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.winnerReason).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().title).toBe(QUESTION);
    expect(page().metadata.metaTitle).toBe(QUESTION);
    expect(page().faqs).toHaveLength(6);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    expect(isDegenerateComparisonSlug(SLUG)).toBe(false);
    // The brief URL keeps MSI first. Alphabetical sort would put ASUS first,
    // and this page does not register that second slug.
    expect(sortComparisonSlug(SLUG)).toBe(
      "asus-tuf-gaming-b850-plus-wifi-vs-msi-mag-b850-tomahawk-max-wifi",
    );
    expect(page().metadata.updatedAt).toBe("2026-11-14T00:00:00Z");
    expect(page().category).toBe("technology");
    expect(findSelfContradictions(page())).toEqual([]);
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).not.toBe(true);
    }
    expect(page().citationStats?.dataPointCount).toBe(0);
    expect(page().citationStats?.sourceCount).toBe(7);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([
      MSI_SPEC,
      MSI_OVERVIEW,
      MSI_MANUAL,
      ASUS_PRODUCT,
      ASUS_TECH,
      ASUS_MANUAL,
      AMD_9800X3D,
    ]);
    expect(page().resources?.map((resource) => resource.url)).toEqual([
      MSI_SPEC,
      MSI_OVERVIEW,
      MSI_MANUAL,
      ASUS_PRODUCT,
      ASUS_TECH,
      ASUS_MANUAL,
      AMD_9800X3D,
    ]);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual(["b650-vs-b850", "b850-vs-x870"]);
    for (const slug of page().relatedComparisons.map((item) => item.slug)) {
      expect(isRedirectedCompareSlug(slug)).toBe(false);
      expect(getEditorialComparison(slug)?.metadata.status).toBe("published");
    }
    const sentences = (page().shortAnswer ?? "").split(/(?<=[.!?])\s+/).filter(Boolean);
    expect(sentences).toHaveLength(2);
    expect(page().shortAnswer).toMatch(/Choose the MSI MAG B850 Tomahawk Max WiFi if/);
    expect(page().shortAnswer).toMatch(/Choose the ASUS TUF Gaming B850-Plus WiFi if/);
    expect(page().shortAnswer).toMatch(/neither board is right for everyone/);
    const title = buildPageTitle(page().metadata.metaTitle);
    expect(title).toBe(`${QUESTION} | A Versus B`);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(page().title.length).toBeLessThanOrEqual(60);
    const description = clampDescription(page().metadata.metaDescription);
    expect(description).toBe(page().metadata.metaDescription);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it("keeps FAQ schema text identical to the visible answers", () => {
    const schemas = comparisonPageSchema(page()) as JsonNode[];
    const flat = schemas.flatMap((node) => nodesOf(node));
    const faqs = flat.filter((node) => typeOf(node).includes("FAQPage"));
    expect(faqs).toHaveLength(1);
    const main = faqs[0].mainEntity ?? [];
    expect(main.map((item) => item.name)).toEqual(page().faqs.map((faq) => faq.question));
    expect(main.map((item) => item.acceptedAnswer?.text)).toEqual(page().faqs.map((faq) => faq.answer));
    expect(flat.filter((node) => typeOf(node).includes("ClaimReview"))).toHaveLength(0);
    expect(flat.find((node) => typeOf(node).includes("Dataset"))).toBeDefined();
    expect(JSON.stringify(schemas)).not.toMatch(/Daniel Rozin/);
    expect(JSON.stringify(schemas)).not.toMatch(/0 data points/);
  });

  it("runs the compare page path for the H1, disclosure, and live internal links", async () => {
    const result = await getStaticProps({ params: { slug: SLUG } } as never);
    expect(result).toHaveProperty("props");
    if (!("props" in result)) return;
    const props = result.props as {
      comparison: ReturnType<typeof page>;
      meta: { title: string; description: string };
      jsonLd: string;
    };
    expect(props.meta.title).toBe(`${QUESTION} | A Versus B`);
    expect(props.meta.description.length).toBeGreaterThanOrEqual(70);
    expect(props.meta.description.length).toBeLessThanOrEqual(160);

    const viewProps = result.props as ComponentProps<typeof ComparisonPage>;
    render(<ComparisonPage {...viewProps} />);
    expect(screen.getByRole("heading", { level: 1, name: QUESTION })).toBeInTheDocument();
    expect(screen.queryByText(/Daniel Rozin/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Human reviewed/)).not.toBeInTheDocument();
    expect(screen.getByText(/Drafted with AI from web research/)).toBeInTheDocument();

    const visibleFaqs = screen.getAllByText((_, node) => node?.classList?.contains("faq-answer") ?? false);
    expect(visibleFaqs.map((node) => node.textContent)).toEqual(page().faqs.map((faq) => faq.answer));

    const document = JSON.parse(props.jsonLd) as JsonNode;
    const flat = nodesOf(document);
    const articles = flat.filter((node) => typeOf(node).includes("Article"));
    expect(articles.map((node) => node.headline)).toContain(QUESTION);
    for (const article of articles) {
      expect(article.author?.name ?? article.author).not.toBe("Daniel Rozin");
      expect(article.reviewedBy).toBeUndefined();
      expect(article.isHumanReviewed).toBeUndefined();
      expect(article.lastReviewed).toBeUndefined();
    }
    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href") ?? "");
    expect(hrefs.some((href) => href.startsWith("/compare/b650-vs-b850"))).toBe(true);
    expect(hrefs.some((href) => href.startsWith("/compare/b850-vs-x870"))).toBe(true);
  }, 30000);

  it("cites MSI and ASUS listings without a price or a value crown", () => {
    const text = readerText(page());
    for (const fact of [
      "14+2+1",
      "SPS 80A",
      "14(80A)+2(80A)+1(80A)",
      "Realtek 8126VB 5G",
      "Realtek 2.5Gb",
      "320 MHz",
      "5.8 Gbps",
      "160 MHz",
      "2.9 Gbps",
      "PCIe 5.0 x16",
      "PCI_E3",
      "PCIEX16(G4)",
      "120 W",
      "DDR5-5600",
      "8400+",
      "8000+",
      "Flash BIOS Button",
      "BIOS FlashBack",
      "neither board is right for everyone",
    ]) {
      expect(text).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/Community opinion|community opinion/i);
    expect(page().expertAnalysis).not.toMatch(/\bFAQ\b|Frequently asked|Drafted with AI|human-reviewed/i);
    expect(page().citationStats?.sources.map((source) => source.url).join("\n")).not.toMatch(/reddit\.com|tweaktown|thefpsreview/i);
  });
});
