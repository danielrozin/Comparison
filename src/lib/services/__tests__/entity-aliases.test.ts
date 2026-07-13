import { describe, it, expect } from "vitest";
import {
  canonicalSlug,
  canonicalName,
  canonicalMembers,
  rivalryKey,
  ENTITY_ALIASES,
  CONSUMER_MEDIA_SLUGS,
} from "../entity-aliases";

/**
 * These encode the defect from DAN-2047: the studies counted comparison PAGES
 * per entity and published the result as a rivalry count, which crowned a
 * "most-compared brand" that did not exist. The cases below are the exact rows
 * from the live corpus that produced the wrong number.
 */
describe("rivalry normalisation", () => {
  it("collapses a matchup published in both directions", () => {
    expect(rivalryKey(["slack", "microsoft-teams"])).toBe(
      rivalryKey(["microsoft-teams", "slack"])
    );
  });

  it("collapses alias entities onto their canonical entity", () => {
    // 'Netflix, Inc.' and 'Netflix' are one company.
    expect(canonicalSlug("netflix-inc")).toBe("netflix");
    // 'Max (HBO Max)' is a third row for HBO Max.
    expect(canonicalSlug("max-hbo-max")).toBe("hbo-max");
    // 'Disney Plus' and 'Disney+' are one service.
    expect(canonicalSlug("disney-plus")).toBe("disney");
  });

  it("gives one rivalry key across every published spelling of Netflix vs Disney+", () => {
    // Four live pages, one rivalry: netflix-vs-disney-plus, disney-plus-vs-netflix,
    // netflix-vs-disney, disney-vs-netflix.
    const keys = new Set([
      rivalryKey(["netflix", "disney-plus"]),
      rivalryKey(["disney-plus", "netflix"]),
      rivalryKey(["netflix-inc", "disney-plus-the-walt-disney-company-streaming-division"]),
      rivalryKey(["the-walt-disney-company", "netflix"]),
      rivalryKey(["disney", "netflix"]),
    ]);
    expect(keys.size).toBe(1);
  });

  it("gives one rivalry key for Netflix vs HBO Max under both spellings", () => {
    expect(rivalryKey(["netflix", "max-hbo-max"])).toBe(rivalryKey(["hbo-max", "netflix"]));
  });

  it("keeps distinct products distinct — SKUs are not aliases", () => {
    // Merging these would be a claim about the market, not about the catalog.
    expect(canonicalSlug("playstation-5-pro")).toBe("playstation-5-pro");
    expect(canonicalSlug("iphone-16-pro")).toBe("iphone-16-pro");
    expect(rivalryKey(["xbox-series-x", "playstation-5"])).not.toBe(
      rivalryKey(["xbox-series-x", "playstation-5-pro"])
    );
  });

  it("does not treat a parent brand as an alias of its products", () => {
    expect(canonicalSlug("bmw-x5")).toBe("bmw-x5");
    expect(canonicalSlug("amazon-haul")).toBe("amazon-haul");
  });

  it("dedupes members so a 2-way page never looks like a 3-way one", () => {
    // Both entity rows on one page resolve to the same canonical entity.
    expect(canonicalMembers(["netflix", "netflix-inc", "hulu"])).toEqual(["netflix", "hulu"]);
  });

  it("overrides display names where the stored name is wrong", () => {
    // The `disney` row is stored with the name "Disney+"; `ford-motor-company`
    // with the full legal name.
    expect(canonicalName("ford-motor-company", "Ford Motor Company")).toBe("Ford");
    expect(canonicalName("spotify", "Spotify")).toBe("Spotify");
  });

  it("never maps an alias to another alias", () => {
    // A one-hop resolve has to be enough, or canonicalSlug would need a fixpoint.
    for (const canonical of Object.values(ENTITY_ALIASES)) {
      expect(ENTITY_ALIASES[canonical]).toBeUndefined();
    }
  });

  it("keeps consumer streaming services out of the B2B SaaS ranking", () => {
    // `disney` is typed `software` in the entity table, which is how Disney+ was
    // published as a most-compared B2B SaaS tool alongside Notion and Zoom.
    expect(CONSUMER_MEDIA_SLUGS.has("disney")).toBe(true);
    expect(CONSUMER_MEDIA_SLUGS.has("netflix")).toBe(true);
    expect(CONSUMER_MEDIA_SLUGS.has("notion")).toBe(false);
  });
});
