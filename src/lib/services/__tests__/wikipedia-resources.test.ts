import { describe, expect, it } from "vitest";
import type { ComparisonEntityData } from "@/types";
import { generateResources } from "../resources";
import { getAllMockSlugs, getMockComparison } from "../mock-data";
import {
  guessedWikipediaTitle,
  resolveEntityWikipediaUrl,
  stripParentheticalQualifiers,
} from "../wikipedia-url";

const BAD_ARTICLE_URLS = [
  "https://en.wikipedia.org/wiki/China_Economy",
  "https://en.wikipedia.org/wiki/Mac_macOS",
];

function entity(name: string, slug: string, position = 0): ComparisonEntityData {
  return {
    id: slug,
    slug,
    name,
    shortDesc: null,
    imageUrl: null,
    entityType: "concept",
    position,
    pros: [],
    cons: [],
    bestFor: null,
  };
}

function wikipediaUrls(slug: string, entities: ComparisonEntityData[]): string[] {
  return generateResources(slug, entities)
    .filter((resource) => resource.type === "wikipedia")
    .map((resource) => resource.url);
}

describe("Wikipedia resource links (ROO-101)", () => {
  it("does not guess China_Economy for the stored China Economy entity", () => {
    const urls = wikipediaUrls("us-economy-vs-china-economy", [
      entity("US Economy", "us-economy", 0),
      entity("China Economy", "china-economy", 1),
    ]);

    for (const bad of BAD_ARTICLE_URLS) {
      expect(urls).not.toContain(bad);
    }
    expect(urls).toContain("https://en.wikipedia.org/wiki/Economy_of_China");
    expect(urls).toContain(
      "https://en.wikipedia.org/wiki/Economy_of_the_United_States",
    );
  });

  it("does not guess Mac_macOS for Mac (macOS) or macOS (Mac)", () => {
    const fromExtra = wikipediaUrls("mac-vs-windows", [
      entity("Mac (macOS)", "mac-macos", 0),
      entity("Windows", "windows", 1),
    ]);
    const fromBase = wikipediaUrls("mac-vs-windows", [
      entity("macOS (Mac)", "macos", 0),
      entity("Windows", "windows", 1),
    ]);
    const fromPlainName = resolveEntityWikipediaUrl({
      name: "Mac macOS",
      slug: "unknown-slug",
    });

    for (const urls of [fromExtra, fromBase]) {
      expect(urls.some((url) => url.includes("/wiki/Mac_macOS"))).toBe(false);
      expect(urls.some((url) => url.includes("/wiki/macOS_Mac"))).toBe(false);
      expect(urls).toContain("https://en.wikipedia.org/wiki/MacOS");
      expect(urls).toContain("https://en.wikipedia.org/wiki/Windows");
    }
    expect(fromPlainName).toBe("https://en.wikipedia.org/wiki/MacOS");
  });

  it("uses the stored comparison rows, not a hand-built fixture only", () => {
    const economy = getMockComparison("us-economy-vs-china-economy");
    const mac = getMockComparison("mac-vs-windows");
    expect(economy).not.toBeNull();
    expect(mac).not.toBeNull();

    const economyUrls = wikipediaUrls(economy!.slug, economy!.entities);
    const macUrls = wikipediaUrls(mac!.slug, mac!.entities);

    expect(economyUrls).toContain("https://en.wikipedia.org/wiki/Economy_of_China");
    expect(macUrls).toContain("https://en.wikipedia.org/wiki/MacOS");
    for (const url of [...economyUrls, ...macUrls]) {
      expect(BAD_ARTICLE_URLS).not.toContain(url);
    }
  });

  it("does not glue a parenthetical qualifier into a fake article title", () => {
    expect(guessedWikipediaTitle("Mac (macOS)")).toBe("Mac");
    expect(guessedWikipediaTitle("World War I (1914-1918)")).toBe("World_War_I");
    expect(guessedWikipediaTitle("Bitcoin (BTC)")).toBe("Bitcoin");
    expect(guessedWikipediaTitle("401(k)")).toBe("401(k)");

    expect(resolveEntityWikipediaUrl({ name: "World War I (1914-1918)", slug: "world-war-1" }))
      .toBe("https://en.wikipedia.org/wiki/World_War_I");
    expect(
      resolveEntityWikipediaUrl({ name: "Totally Unknown (Widget)", slug: "no-such-entity" }),
    ).toBe("https://en.wikipedia.org/wiki/Totally_Unknown");
  });

  it("strips a parenthetical in the middle of a name, not only at the end", () => {
    // Unmapped slugs: the keto-diet map must not be what makes this pass.
    expect(stripParentheticalQualifiers("Ketogenic (Keto) Diet")).toBe("Ketogenic Diet");
    expect(stripParentheticalQualifiers("Foo (Bar) Baz")).toBe("Foo Baz");
    expect(stripParentheticalQualifiers("A (B) C (D)")).toBe("A C");
    expect(stripParentheticalQualifiers("(Early) Jazz Age")).toBe("Jazz Age");
    expect(stripParentheticalQualifiers("401(k)")).toBe("401(k)");

    expect(guessedWikipediaTitle("Ketogenic (Keto) Diet")).toBe("Ketogenic_Diet");
    expect(guessedWikipediaTitle("Foo (Bar) Baz")).toBe("Foo_Baz");

    expect(
      resolveEntityWikipediaUrl({
        name: "Ketogenic (Keto) Diet",
        slug: "ketogenic-keto-diet",
      }),
    ).toBe("https://en.wikipedia.org/wiki/Ketogenic_Diet");
    expect(
      resolveEntityWikipediaUrl({
        name: "Ketogenic (Keto) Diet",
        slug: "ketogenic-keto-diet",
      }),
    ).not.toContain("Ketogenic_(Keto)_Diet");

    // The stripped name still hits an existing map. No new map entry required.
    expect(
      resolveEntityWikipediaUrl({
        name: "China (PRC) Economy",
        slug: "unmapped-china-economy",
      }),
    ).toBe("https://en.wikipedia.org/wiki/Economy_of_China");
  });

  it("sends product lines and insurance plans to Wikipedia search", () => {
    const searchCases: Array<[string, string, string]> = [
      ["Delta Dental PPO", "delta-dental-ppo", "Delta+Dental+PPO"],
      ["Delta Dental Premier", "delta-dental-premier", "Delta+Dental+Premier"],
      ["Dyson Cordless Vacuums", "dyson-cordless-vacuums", "Dyson+Cordless+Vacuums"],
      ["Shark Cordless Vacuums", "shark-cordless-vacuums", "Shark+Cordless+Vacuums"],
      ["Aetna HMO", "aetna-hmo", "Aetna+HMO"],
      ["iRobot Robot Vacuums", "irobot-robot-vacuums", "iRobot+Robot+Vacuums"],
    ];

    for (const [name, slug, query] of searchCases) {
      expect(guessedWikipediaTitle(name), name).toBeNull();
      expect(resolveEntityWikipediaUrl({ name, slug }), name).toBe(
        `https://en.wikipedia.org/w/index.php?search=${query}`,
      );
    }

    const live404s = wikipediaUrls("delta-dental-ppo-vs-delta-dental-premier", [
      entity("Delta Dental PPO", "delta-dental-ppo", 0),
      entity("Delta Dental Premier", "delta-dental-premier", 1),
    ]).concat(
      wikipediaUrls("dyson-vs-shark-vacuum", [
        entity("Dyson Cordless Vacuums", "dyson-cordless-vacuums", 0),
        entity("Shark Cordless Vacuums", "shark-cordless-vacuums", 1),
      ]),
      wikipediaUrls("keto-vs-paleo", [
        entity("Ketogenic (Keto) Diet", "ketogenic-keto-diet", 0),
        entity("Paleo Diet", "paleo-diet", 1),
      ]),
    );

    for (const bad of [
      "/wiki/Delta_Dental_PPO",
      "/wiki/Delta_Dental_Premier",
      "/wiki/Dyson_Cordless_Vacuums",
      "/wiki/Shark_Cordless_Vacuums",
      "/wiki/Ketogenic_(Keto)_Diet",
    ]) {
      expect(live404s.some((url) => url.includes(bad))).toBe(false);
    }
    expect(live404s).toContain("https://en.wikipedia.org/wiki/Ketogenic_Diet");
    expect(live404s).toContain("https://en.wikipedia.org/wiki/Paleo_Diet");

    // A tier word or "Plus" without a benefit domain is still an article guess.
    expect(resolveEntityWikipediaUrl({ name: "Premier League", slug: "premier-league" })).toBe(
      "https://en.wikipedia.org/wiki/Premier_League",
    );
    expect(resolveEntityWikipediaUrl({ name: "Disney Plus", slug: "disney-plus" })).toBe(
      "https://en.wikipedia.org/wiki/Disney_Plus",
    );
    // A plan code by itself can be an article ("HMO"). A longer plan name is not.
    expect(guessedWikipediaTitle("HMO")).toBe("HMO");
  });

  it("falls back to a Wikipedia search URL instead of a known-missing article", () => {
    expect(guessedWikipediaTitle("China Economy")).toBeNull();
    expect(resolveEntityWikipediaUrl({ name: "China_Economy", slug: "not-mapped" })).toBe(
      "https://en.wikipedia.org/w/index.php?search=China_Economy",
    );
    expect(resolveEntityWikipediaUrl({ name: "Mac_macOS", slug: "not-mapped" })).toBe(
      "https://en.wikipedia.org/w/index.php?search=Mac_macOS",
    );
    expect(resolveEntityWikipediaUrl({ name: "Dyson Airwrap", slug: "dyson-airwrap" })).toBe(
      "https://en.wikipedia.org/w/index.php?search=Dyson+Airwrap",
    );
    expect(resolveEntityWikipediaUrl({ name: "Keto Diet", slug: "keto-diet" })).toBe(
      "https://en.wikipedia.org/wiki/Ketogenic_diet",
    );
  });

  it("never emits the known-missing articles for any stored comparison", () => {
    for (const slug of getAllMockSlugs()) {
      const comp = getMockComparison(slug);
      if (!comp) continue;
      for (const url of wikipediaUrls(comp.slug, comp.entities)) {
        expect(url, slug).not.toContain("/wiki/China_Economy");
        expect(url, slug).not.toContain("/wiki/Mac_macOS");
      }
    }
  });

  it("still links a real article when the display name already is the title", () => {
    const urls = wikipediaUrls("messi-vs-ronaldo", [
      entity("Lionel Messi", "lionel-messi", 0),
      entity("Cristiano Ronaldo", "cristiano-ronaldo", 1),
    ]);
    expect(urls).toContain("https://en.wikipedia.org/wiki/Lionel_Messi");
    expect(urls).toContain("https://en.wikipedia.org/wiki/Cristiano_Ronaldo");
  });
});
