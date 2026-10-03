import { describe, expect, it } from "vitest";
import { NBA_SEASON_OVERLAYS } from "@/lib/data/nba-2026-season-overlays";
import { getEditorialComparison, listEditorialCompareSlugs } from "../index";

const CRAWL = /Index, follow|returned 404/;
const SOURCE_PROCESS = /date of death|page lists|list shows/i;

/** The only death mention allowed on the Kobe vs Curry page. */
const ALLOWED_DEATH_MENTION =
  "Bryant retired after the 2015-16 season and died on January 26, 2020.";

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

function sourceProcessHits(slug: string, value: unknown): boolean {
  const text = readerText(value);
  if (CRAWL.test(text)) return true;
  if (slug !== "kobe-bryant-vs-steph-curry") return SOURCE_PROCESS.test(text);

  const mentions = text.split(ALLOWED_DEATH_MENTION).length - 1;
  if (mentions !== 1) return true;
  const rest = text.split(ALLOWED_DEATH_MENTION).join("");
  return SOURCE_PROCESS.test(rest) || /died|death|January 26, 2020/i.test(rest);
}

describe("editorial reader copy", () => {
  it("fails when a published editorial page contains crawl metadata, 404 history, or source-process wording", () => {
    const hits = listEditorialCompareSlugs().filter((slug) =>
      sourceProcessHits(slug, getEditorialComparison(slug)),
    );
    expect(hits).toEqual([]);
  });

  it("fails when a season overlay contains crawl metadata, 404 history, or source-process wording", () => {
    const hits = Object.keys(NBA_SEASON_OVERLAYS).filter((slug) =>
      sourceProcessHits(slug, NBA_SEASON_OVERLAYS[slug]),
    );
    expect(hits).toEqual([]);
  });
});
