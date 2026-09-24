import { describe, expect, it } from "vitest";
import { entitiesFromCompareSlug } from "../compare-slug-sides";

describe("entitiesFromCompareSlug", () => {
  it("splits a compare slug into two names", () => {
    expect(entitiesFromCompareSlug("notion-vs-obsidian")).toEqual({
      a: "Notion",
      b: "Obsidian",
    });
  });

  it("rejects slugs that are not a matchup", () => {
    expect(entitiesFromCompareSlug("pricing")).toBeNull();
    expect(entitiesFromCompareSlug("../etc")).toBeNull();
  });
});
