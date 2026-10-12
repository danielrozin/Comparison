/**
 * Side-by-side with main's parser for the terms named in the 30 Sep 2026
 * site-search report. Output must match main except the four intended fixes:
 * messi x ronaldo, hbo vs netflix, the vrbo/airbnb hosts query, and
 * japan vs china in economic terms.
 */
import { describe, expect, it } from "vitest";
import { parseComparisonQuery } from "@/lib/parse-comparison-query";

const HISTORY: Array<[string, boolean, string | null]> = [
  ["claude", false, null],
  ["messi vs ronaldo", true, "messi-vs-ronaldo"],
  ["chatgpt", false, null],
  ["osticket", false, null],
  ["chien vs chat", true, "chat-vs-chien"],
  ["porn star", false, null],
  ["shein", false, null],
  ["croutonillion vs rayo's number", true, "croutonillion-vs-rayos-number"],
  ["tecno vs iphone", true, "iphone-vs-tecno"],
  ["vrbo vs airbnb: for hosts, which is more profitable?", true, "airbnb-vs-vrbo"],
  ["flexclip", false, null],
  ["lexon max vs lexon functional", true, "lexon-functional-vs-lexon-max"],
  ["being born in 2011 vs 2015", true, "2015-vs-being-born-in-2011"],
  ["tor browser", false, null],
  ["bowers&wilkins px7 s2", false, null],
  ["roland vs angela", true, "angela-vs-roland"],
  ["usa vs france", true, "france-vs-united-states"],
  ["amerika vs messi", true, "amerika-vs-messi"],
  ["lion vs crow", true, "crow-vs-lion"],
  ["japan vs china in economic terms", true, "japan-vs-china"],
  ["messi x ronaldo", true, "messi-vs-ronaldo"],
  ["srilanka vs india", true, "india-vs-srilanka"],
  ["cleaner vs kudu", true, "cleaner-vs-kudu"],
  ["تندر", false, null],
  ["https://employeeinfo.spac.gov.jo/", false, null],
  ["kia vs hyundai", true, "hyundai-vs-kia"],
  ["kia telluride vs hyundai pre owned", true, "hyundai-pre-owned-vs-kia-telluride"],
  ["hbo vs netflix", true, "hbo-max-vs-netflix"],
  ["bacteria vs virus", true, "bacteria-vs-virus"],
  ["japan vs india", true, "india-vs-japan"],
  ["majesty cruise vs genesis cruise vs awua luxury of the seas halong bay", false, null],
  ["tesla model 3 grande autonomie 2026 vs byd seal", false, null],
  ["audi vs toyota", true, "audi-vs-toyota"],
  ["ui vs ux", true, "ui-vs-ux"],
  ["galaxy a54 vs galaxy a34", true, "galaxy-a34-vs-galaxy-a54"],
  ["usa vs kenya", true, "kenya-vs-united-states"],
  ["nas", false, null],
  ["orange v lemons", true, "lemons-vs-orange"],
  ["ronaldo vs messi", true, "messi-vs-ronaldo"],
  ["messi or ronaldo", true, "messi-vs-ronaldo"],
  ["messi v ronaldo", true, "messi-vs-ronaldo"],
  ["erling", false, null],
  ["haaland", false, null],
  ["iphone", false, null],
  ["iphone 16", false, null],
];

describe("historical search terms", () => {
  it("matches main except the four intended compare fixes", () => {
    for (const [query, parsed, slug] of HISTORY) {
      const result = parseComparisonQuery(query);
      expect(result.parsed, query).toBe(parsed);
      expect(result.slug, query).toBe(slug);
    }
  });
});
