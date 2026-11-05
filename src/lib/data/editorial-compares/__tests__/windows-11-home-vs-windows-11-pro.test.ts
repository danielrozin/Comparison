import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { mergeEditorialCategoryComparisons } from "@/lib/categories/hub-comparisons";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { isDegenerateComparisonSlug, sortComparisonSlug } from "@/lib/utils/slugify";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "windows-11-home-vs-windows-11-pro";

const SPECS = "https://www.microsoft.com/en-us/windows/windows-11-specifications";
const COMPARE = "https://www.microsoft.com/en-us/windows/business/compare-windows-11";
const DEVICE_ENCRYPTION =
  "https://support.microsoft.com/en-us/windows/device-encryption-in-windows-cf7e2b6f-3e70-4882-9532-18633605b7df";
const REMOTE_DESKTOP =
  "https://support.microsoft.com/en-us/windows/how-to-use-remote-desktop-5fe128d5-8fb1-7a23-3b8a-41e636865e8c";
const HYPER_V =
  "https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v";
const SANDBOX =
  "https://learn.microsoft.com/en-us/windows/security/application-security/application-isolation/windows-sandbox/";
const SANDBOX_INSTALL =
  "https://learn.microsoft.com/en-us/windows/security/application-security/application-isolation/windows-sandbox/windows-sandbox-install";
const MEMORY =
  "https://learn.microsoft.com/en-us/windows/win32/memory/memory-limits-for-windows-releases";
const UPGRADE =
  "https://support.microsoft.com/en-us/windows/upgrade-windows-home-to-windows-pro-ef34d520-e73f-3198-c525-d1a218cc2818";

const FAQ_ANSWERS = [
  "No. Games run the same on both editions. Pro adds business and power-user features such as BitLocker, Remote Desktop hosting, Hyper-V and Windows Sandbox, none of which raise frame rates.",
  "Microsoft lists the same minimum hardware requirements for both editions. Pro-only features like Hyper-V and Windows Sandbox are optional features that you have to turn on.",
  "Not for personal use. Microsoft says Windows 11 Home and Windows 11 Pro for personal use both need an internet connection and a Microsoft account during initial setup.",
  "Yes, on supported hardware. Home has Device Encryption, which uses BitLocker to encrypt your drives automatically when you sign in with a Microsoft account. Full BitLocker Drive Encryption is available on Pro, Enterprise and Education.",
  "Yes. You can buy the upgrade in the Microsoft Store or enter a Pro product key in Settings > System > Activation. Microsoft's steps apply to an activated copy of Home.",
  "You can connect from a Home PC to another computer, but a Home PC can't be the remote PC you connect to. That requires Pro.",
];

// Reader copy credits Microsoft. It must not narrate the research, name a
// winner, or carry prices, frame rates, or a community block.
const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|this article|article says|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison shows|this page|we checked|reddit|human review|byline|reviewed by|\bwinner\b|Drafted with AI|\$\d|\bfps\b|%\s*faster/i;

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

describe("Windows 11 Home vs Windows 11 Pro", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner, ties only, and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBe(false);
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().faqs).toHaveLength(6);
    expect(page().expertAnalysis).not.toMatch(/\bFAQ\b|Frequently asked|Drafted with AI|human-reviewed/i);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    expect(sortComparisonSlug(SLUG)).toBe(SLUG);
    expect(isDegenerateComparisonSlug(SLUG)).toBe(false);
    const title = buildPageTitle(page().metadata.metaTitle);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toMatch(/A Versus B$/);
    const description = clampDescription(page().metadata.metaDescription);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-11-05T00:00:00Z");
    expect(page().category).toBe("software");
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).not.toBe(true);
    }
    expect(page().shortAnswer).toMatch(/same minimum hardware requirements/);
    expect(findSelfContradictions(page())).toEqual([]);
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

  it("states Microsoft edition facts and links the live Home and Pro pages", () => {
    const text = readerText(page());
    for (const fact of [
      "4 GB of RAM",
      "64 GB",
      "TPM 2.0",
      "128 GB",
      "2 TB",
      "Device encryption",
      "BitLocker",
      "Remote Desktop",
      "Hyper-V",
      "Windows Sandbox",
      "Group Policy",
      "Microsoft Entra ID",
      "Microsoft account",
      "authorized retailer",
      "Mac vs Windows",
      "/compare/mac-vs-windows",
      "/compare/mac-mini-m6-vs-windows-pc",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/Pro for Workstations is better|LTSC|grey market|G2A|Kinguin/i);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([
      SPECS,
      COMPARE,
      DEVICE_ENCRYPTION,
      REMOTE_DESKTOP,
      HYPER_V,
      SANDBOX,
      SANDBOX_INSTALL,
      MEMORY,
      UPGRADE,
    ]);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "mac-vs-windows",
      "mac-mini-m6-vs-windows-pc",
    ]);
    expect(isRedirectedCompareSlug("mac-vs-windows")).toBe(false);
    expect(isRedirectedCompareSlug("mac-mini-m6-vs-windows-pc")).toBe(false);
    expect(getEditorialComparison("mac-mini-m6-vs-windows-pc")).not.toBeNull();
  });

  it("shows up on the software hub and keeps the shared Analysis disclosure", () => {
    const cards = mergeEditorialCategoryComparisons("software", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const component = readFileSync("src/components/comparison/ExpertAnalysis.tsx", "utf8");
    expect(component).toContain('Analysis: ${entityAName} vs ${entityBName}');
    expect(component).toContain("Drafted with AI from web research.");
    expect(page().metadata.isHumanReviewed).toBe(false);
  });
});
