import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { mergeEditorialCategoryComparisons } from "@/lib/categories/hub-comparisons";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { isDegenerateComparisonSlug, sortComparisonSlug } from "@/lib/utils/slugify";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "nextcloud-vs-opencloud";

const NC_SERVER = "https://github.com/nextcloud/server";
const OC_SERVER = "https://github.com/opencloud-eu/opencloud";
const OC_COMMUNITY = "https://opencloud.eu/en/opencloud-community";
const NC_REQUIREMENTS =
  "https://docs.nextcloud.com/server/latest/admin_manual/installation/system_requirements.html";
const OC_REQUIREMENTS = "https://docs.opencloud.eu/docs/admin/getting-started/requirements/";
const OC_FEATURES = "https://docs.opencloud.eu/docs/admin/features/";
const OC_RADICALE = "https://docs.opencloud.eu/docs/admin/configuration/radicale-integration/";
const OC_DOCKER = "https://docs.opencloud.eu/docs/admin/getting-started/container/docker/";
const OC_COMPOSE = "https://docs.opencloud.eu/docs/admin/getting-started/container/docker-compose/";
const NC_INSTALL = "https://nextcloud.com/install/";
const NC_AIO = "https://github.com/nextcloud/all-in-one";
const NC_OFFICE = "https://nextcloud.com/office/";
const NC_NOTES = "https://github.com/nextcloud/notes";
const NC_PRICING = "https://nextcloud.com/pricing/";
const NC_ENTERPRISE = "https://nextcloud.com/enterprise/";
const OC_PRICING = "https://opencloud.eu/en/subscription-support";

const FAQ_ANSWERS = [
  "No single score says that. OpenCloud's server repository is a Go codebase for file management, sharing, and collaboration. Nextcloud's server README lists files, contacts, calendars, and more, and names an app store plus Mail and Video Chat. Use OpenCloud for that file server. Use Nextcloud when those apps are part of the same server project.",
  "No. OpenCloud states that the basis of the project is a fork of ownCloud Infinite Scale (OCIS). The nextcloud/server repository was created on 2 June 2016. Its README copyright line names ownCloud, Inc. for 2013-2016 and Nextcloud GmbH and contributors from 2016.",
  "OpenCloud's requirements say the server has no database and stores files on storage. Nextcloud's admin manual documents PHP 8.3, 8.4, or 8.5, Apache or nginx, and a database such as MariaDB or PostgreSQL, plus apps. OpenCloud's documented server stack is narrower. That is not a measured maintenance score.",
  "Yes, when the NAS can run Docker. Nextcloud's install documentation points to the All-in-One Docker image that Nextcloud GmbH maintains. OpenCloud's container documentation shows a Docker setup and a Docker Compose setup. Follow those guides for the image, volumes, and URL. They do not add steps for a specific NAS brand.",
  "You can self-host both from public source code. OpenCloud states that you can download and use the source code free of charge and without obligation, and that OpenCloud GmbH also offers paid builds when you want support. Nextcloud server is under AGPL-3.0-or-later, and Nextcloud GmbH offers Nextcloud Enterprise. Plan names are on the Nextcloud pricing site and the OpenCloud subscription site. Amounts are not copied here.",
  "Both document file sync, sharing, and desktop and mobile clients, so either can be the family's file drive. Nextcloud's README also lists contacts and calendars, and it names Mail and Video Chat. OpenCloud documents CalDAV and CardDAV calendars and contacts for external clients, and its Radicale guide says OpenCloud does not currently provide a UI for them. Google Drive vs OneDrive is a separate comparison.",
];

// Reader copy credits Nextcloud and OpenCloud. It must not narrate the
// research, name a winner, or carry prices or a community block.
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

describe("Nextcloud vs OpenCloud", () => {
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
    expect(page().shortAnswer).toMatch(/Go file server/);
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

  it("states product facts from Nextcloud and OpenCloud and skips reader-copy narration", () => {
    const text = readerText(page());
    for (const fact of [
      "AGPL-3.0",
      "Apache-2.0",
      "2 June 2016",
      "10 January 2025",
      "ownCloud Infinite Scale",
      "128 MB",
      "512 MB",
      "PHP 8.3",
      "Collabora",
      "Radicale",
      "All-in-One",
      "Google Drive vs OneDrive",
      "/compare/google-drive-vs-onedrive",
      "/alternatives/google-drive",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/€|\$\d|blazing fast|Ugreen/);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([
      NC_SERVER,
      OC_SERVER,
      OC_COMMUNITY,
      NC_REQUIREMENTS,
      OC_REQUIREMENTS,
      OC_FEATURES,
      OC_RADICALE,
      OC_DOCKER,
      OC_COMPOSE,
      NC_INSTALL,
      NC_AIO,
      NC_OFFICE,
      NC_NOTES,
      NC_PRICING,
      NC_ENTERPRISE,
      OC_PRICING,
    ]);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual(["google-drive-vs-onedrive"]);
    expect(isRedirectedCompareSlug("google-drive-vs-onedrive")).toBe(false);
  });

  it("shows up on the software hub and keeps the shared Analysis disclosure", () => {
    const cards = mergeEditorialCategoryComparisons("software", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const component = readFileSync("src/components/comparison/ExpertAnalysis.tsx", "utf8");
    expect(component).toContain("Analysis: ${entityAName} vs ${entityBName}");
    expect(component).toContain("Drafted with AI from web research.");
    expect(page().metadata.isHumanReviewed).toBe(false);
  });
});
