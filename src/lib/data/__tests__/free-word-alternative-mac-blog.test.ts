import { describe, expect, it } from "vitest";
import { findRepoBlogArticle, findRepoBlogOverride } from "@/lib/data/nba-season-preview-blog";
import {
  FREE_WORD_ALTERNATIVE_MAC_ARTICLE,
  FREE_WORD_ALTERNATIVE_MAC_BLOG_SLUG,
  FREE_WORD_ALTERNATIVE_MAC_FAQS,
  FREE_WORD_ALTERNATIVE_MAC_OPENING,
} from "@/lib/data/free-word-alternative-mac-blog";
import { getBlogSchemaExtras } from "@/lib/data/blog-schema-extras";
import { isHumanReviewedBlogSlug } from "@/lib/editorial/blog-authorship";
import { HUMAN_REVIEWED_SLUGS } from "@/lib/editorial/human-reviewed";

const BANNED =
  /the page|this page|this article|page says|page lists|article says|according to|our sources|reviewed by|human review|checked|fetch|Source note|(?:^|\n)Sources:|\bwinner\b|better pick|better value|better buy|the best|best free|\bWPS\b|reddit|\bRAM\b|lightweight|benchmark|\$\d|File > Export|exact Word engine|requires a Microsoft 365/i;

const SOURCE_URLS = [
  "https://support.apple.com/guide/pages/open-or-close-a-document-tancdeedb11c/mac",
  "https://support.apple.com/en-us/105050",
  "https://support.apple.com/guide/pages/welcome/mac",
  "https://support.microsoft.com/en-us/accounts-billing/subscriptions/what-s-the-difference-between-a-microsoft-365-subscription-and-free-web-apps",
  "https://www.microsoft.com/en-us/microsoft-365/free-office-online-for-the-web",
  "https://www.onlyoffice.com/desktop",
  "https://www.onlyoffice.com/download-desktop",
  "https://www.libreoffice.org/download/",
  "https://help.libreoffice.org/latest/en-US/text/shared/guide/ms_import_export_limitations.html",
  "https://www.libreoffice.org/",
];

describe("free Word alternative for Mac blog (ROO-430)", () => {
  it("is a new repo post, not a database override, and is not human-reviewed", () => {
    expect(FREE_WORD_ALTERNATIVE_MAC_BLOG_SLUG).toBe("best-free-microsoft-word-alternative-for-mac");
    expect(findRepoBlogArticle(FREE_WORD_ALTERNATIVE_MAC_BLOG_SLUG)).toBe(FREE_WORD_ALTERNATIVE_MAC_ARTICLE);
    expect(findRepoBlogOverride(FREE_WORD_ALTERNATIVE_MAC_BLOG_SLUG)).toBeNull();
    expect(FREE_WORD_ALTERNATIVE_MAC_ARTICLE.status).toBe("published");
    expect(isHumanReviewedBlogSlug(FREE_WORD_ALTERNATIVE_MAC_BLOG_SLUG)).toBe(false);
    expect(HUMAN_REVIEWED_SLUGS).not.toContain(FREE_WORD_ALTERNATIVE_MAC_BLOG_SLUG);
    expect(FREE_WORD_ALTERNATIVE_MAC_ARTICLE.metaTitle!.length).toBeLessThanOrEqual(47);
    expect(`Free Word Alternatives for Mac | A Versus B`.length).toBeLessThanOrEqual(60);
    expect(FREE_WORD_ALTERNATIVE_MAC_ARTICLE.metaDescription.length).toBeGreaterThanOrEqual(70);
    expect(FREE_WORD_ALTERNATIVE_MAC_ARTICLE.metaDescription.length).toBeLessThanOrEqual(160);
    expect(new Date(FREE_WORD_ALTERNATIVE_MAC_ARTICLE.publishedAt!).getTime()).toBeLessThanOrEqual(Date.now());
  });

  it("opens with two conditional sentences and no page-level winner", () => {
    const text = FREE_WORD_ALTERNATIVE_MAC_ARTICLE.content;
    const sentences = FREE_WORD_ALTERNATIVE_MAC_OPENING.split(/(?<=\.)\s+(?=[A-Z])/);
    expect(sentences).toHaveLength(2);
    expect(sentences[0].startsWith("Choose Apple Pages if")).toBe(true);
    expect(sentences[1].startsWith("Choose ONLYOFFICE Desktop Editors if")).toBe(true);
    expect(text.startsWith(FREE_WORD_ALTERNATIVE_MAC_OPENING)).toBe(true);
    expect(FREE_WORD_ALTERNATIVE_MAC_ARTICLE.excerpt).toBe(FREE_WORD_ALTERNATIVE_MAC_OPENING);
    expect(text).toContain("**Updated November 13, 2026.**");
    expect(text).toContain("## Key takeaways");
    expect(text).toContain("*Table:");
    expect(text.trimEnd().endsWith("Drafted with AI from web research.")).toBe(true);
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/^# /m);
  });

  it("links only the live compare and blog targets from the brief", () => {
    const text = FREE_WORD_ALTERNATIVE_MAC_ARTICLE.content;
    expect(text).toContain("(/compare/microsoft-word-vs-libreoffice)");
    expect(text).toContain("(/compare/google-docs-vs-microsoft-word)");
    expect(text).toContain("(/blog/google-docs-vs-notion-2026-best-productivity-tool-for-teams)");
    expect(text).not.toContain("/compare/google-docs-vs-notion)");
    expect(text).not.toContain("/alternatives/");
    expect(FREE_WORD_ALTERNATIVE_MAC_ARTICLE.relatedComparisonSlugs).toEqual([
      "microsoft-word-vs-libreoffice",
      "google-docs-vs-microsoft-word",
    ]);
  });

  it("keeps FAQ schema identical to the visible FAQ", () => {
    expect(FREE_WORD_ALTERNATIVE_MAC_FAQS.length).toBe(6);
    expect(getBlogSchemaExtras(FREE_WORD_ALTERNATIVE_MAC_BLOG_SLUG)?.faqs).toBe(FREE_WORD_ALTERNATIVE_MAC_FAQS);
    for (const faq of FREE_WORD_ALTERNATIVE_MAC_FAQS) {
      expect(FREE_WORD_ALTERNATIVE_MAC_ARTICLE.content).toContain(`### ${faq.question}`);
      expect(FREE_WORD_ALTERNATIVE_MAC_ARTICLE.content).toContain(faq.answer);
    }
  });

  it("cites the opened vendor documents and no one else", () => {
    const sources = FREE_WORD_ALTERNATIVE_MAC_ARTICLE.content.split("## Sources")[1];
    const urls = [...sources.matchAll(/\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]);
    expect(urls).toEqual(SOURCE_URLS);
    expect(FREE_WORD_ALTERNATIVE_MAC_ARTICLE.content).toContain("Security updates, but no new features");
    expect(FREE_WORD_ALTERNATIVE_MAC_ARTICLE.content).toContain("5 GB");
    expect(FREE_WORD_ALTERNATIVE_MAC_ARTICLE.content).toContain("AGPLv3");
    expect(FREE_WORD_ALTERNATIVE_MAC_ARTICLE.content).toContain("native support for DOCX, XLSX, and PPTX");
    expect(FREE_WORD_ALTERNATIVE_MAC_ARTICLE.content).toContain("manual reformatting");
    expect(FREE_WORD_ALTERNATIVE_MAC_ARTICLE.content).toContain("Export and Send");
  });
});
