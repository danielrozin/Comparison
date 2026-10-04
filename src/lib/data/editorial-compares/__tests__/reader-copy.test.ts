import { describe, expect, it } from "vitest";
import { NBA_SEASON_OVERLAYS } from "@/lib/data/nba-2026-season-overlays";
import { NBA_SEASON_PREVIEW_ARTICLE } from "@/lib/data/nba-season-preview-blog";
import { getEditorialComparison, listEditorialCompareSlugs } from "../index";

const CRAWL = /Index, follow|returned 404/;
// "is published", "is stated", and "described as" also mark source talk, but they
// already appear as product wording on galaxy-z-fold-7, knicks-vs-76ers, and the
// S24 Ultra vs S25 Ultra page. Kindle vs Kobo rejects those three on its own test.
const SOURCE_PROCESS =
  /date of death|page lists|list shows|info box lists|table lists|on that table|no published|not described as|page says|on that page|the page|about page|article says|is described there|does not print|doesn't print|checked|checked 3 October|checked the same day|Source note|(?:^|\n)Sources:|in the help example|announcement assigns|official page|fetch/i;

/** The only death mention allowed on the Kobe vs Curry page. */
const ALLOWED_DEATH_MENTION =
  "Bryant retired after the 2015-16 season and died on January 26, 2020.";

/** Reader copy Product asked the blog to pass, including the #333 review bans. */
const BLOG_BANNED =
  /Index, follow|returned 404|date of death|page lists|list shows|the page says|honors list shows|info box lists|table lists|on that table|no published|not described as|page says|on that page|the page|about page|article says|is described there|does not print|doesn't print|checked|checked 3 October|checked the same day|Source note|(?:^|\n)Sources:|in the help example|announcement assigns|official page|fetch/i;

function readerText(value: unknown): string {
  const parts: string[] = [];
  const visit = (node: unknown) => {
    if (typeof node === "string") {
      parts.push(node);
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

function sourceProcessHit(slug: string, value: unknown): string | null {
  const text = readerText(value);
  const crawl = text.match(CRAWL);
  if (crawl) return `${slug}: ${crawl[0]}`;
  if (slug === "kobe-bryant-vs-steph-curry") {
    const mentions = text.split(ALLOWED_DEATH_MENTION).length - 1;
    if (mentions !== 1) return `${slug}: death mention count ${mentions}`;
    const rest = text.split(ALLOWED_DEATH_MENTION).join("");
    const death = rest.match(/died|death|January 26, 2020/i);
    if (death) return `${slug}: ${death[0]}`;
    const hit = rest.match(SOURCE_PROCESS);
    return hit ? `${slug}: ${hit[0]}` : null;
  }
  const hit = text.match(SOURCE_PROCESS);
  return hit ? `${slug}: ${hit[0]}` : null;
}

describe("editorial reader copy", () => {
  it("fails when a published editorial page contains crawl metadata, 404 history, or source-process wording", () => {
    const hits = listEditorialCompareSlugs()
      .map((slug) => sourceProcessHit(slug, getEditorialComparison(slug)))
      .filter((hit): hit is string => hit !== null);
    expect(hits).toEqual([]);
  });

  it("fails when a season overlay contains crawl metadata, 404 history, or source-process wording", () => {
    const hits = Object.keys(NBA_SEASON_OVERLAYS)
      .map((slug) => sourceProcessHit(slug, NBA_SEASON_OVERLAYS[slug]))
      .filter((hit): hit is string => hit !== null);
    expect(hits).toEqual([]);
  });

  it("fails when the NBA season preview blog contains crawl metadata, 404 history, or source-process wording", () => {
    expect(BLOG_BANNED.test(readerText(NBA_SEASON_PREVIEW_ARTICLE))).toBe(false);
  });

  it("rejects a source note or a leading Sources line in expert analysis and other reader text", () => {
    const banned = /Source note|(?:^|\n)Sources:/;
    const hits = listEditorialCompareSlugs()
      .map((slug) => {
        const page = getEditorialComparison(slug);
        const text = [page?.expertAnalysis, page?.shortAnswer, page?.verdict, ...(page?.faqs ?? []).map((faq) => faq.answer)]
          .filter((part): part is string => typeof part === "string")
          .join("\n");
        const hit = text.match(banned);
        return hit ? `${slug}: ${hit[0].replace(/\n/g, "\\n")}` : null;
      })
      .filter((hit): hit is string => hit !== null);
    expect(hits).toEqual([]);
  });
});
