import { describe, expect, it } from "vitest";
import { NBA_SEASON_OVERLAYS } from "@/lib/data/nba-2026-season-overlays";
import { NBA_SEASON_PREVIEW_ARTICLE } from "@/lib/data/nba-season-preview-blog";
import { getEditorialComparison, listEditorialCompareSlugs } from "../index";

const BANNED = /Index, follow|returned 404/;

/** Reader copy Product asked the blog to pass, including the #333 review bans. */
const BLOG_BANNED =
  /Index, follow|returned 404|date of death|page lists|list shows|the page says|honors list shows/;

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

describe("editorial reader copy", () => {
  it("fails when a published editorial page contains crawl metadata or 404 history", () => {
    const hits = listEditorialCompareSlugs().filter((slug) =>
      BANNED.test(readerText(getEditorialComparison(slug))),
    );
    expect(hits).toEqual([]);
  });

  it("fails when a season overlay contains crawl metadata or 404 history", () => {
    const hits = Object.keys(NBA_SEASON_OVERLAYS).filter((slug) =>
      BANNED.test(readerText(NBA_SEASON_OVERLAYS[slug])),
    );
    expect(hits).toEqual([]);
  });

  it("fails when the NBA season preview blog contains crawl metadata, 404 history, or source-process wording", () => {
    expect(BLOG_BANNED.test(readerText(NBA_SEASON_PREVIEW_ARTICLE))).toBe(false);
  });
});
