import { describe, expect, it } from "vitest";
import { citationSourcesFromResults, distinctSources } from "@/lib/generation/citation-sources";

describe("citationSourcesFromResults", () => {
  it("collapses www and bare hostnames into one source and drops empty urls", () => {
    const sources = citationSourcesFromResults([
      { url: "https://www.rei.com/learn/canoe", title: "REI canoe" },
      { url: "https://rei.com/learn/kayak", title: "REI kayak" },
      { url: "https://en.wikipedia.org/wiki/Kayak", title: "Kayak" },
      { title: "no url" },
    ]);
    expect(sources.map((source) => source.name)).toEqual(["rei.com", "en.wikipedia.org"]);
    expect(distinctSources(sources)).toHaveLength(2);
  });
});
