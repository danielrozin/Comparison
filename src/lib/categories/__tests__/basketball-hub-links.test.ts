import { describe, expect, it } from "vitest";
import {
  categoryHubCount,
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";

const BASKETBALL = CATEGORY_SUBCATEGORIES.sports.find((sub) => sub.slug === "basketball");

/** Canonical slugs for the live NBA cluster. Aliases 301 to these. */
const CLUSTER = [
  "lebron-vs-jordan",
  "kobe-bryant-vs-lebron-james",
  "knicks-vs-76ers",
  "shai-gilgeous-alexander-vs-victor-wembanyama",
  "oklahoma-city-thunder-vs-spurs",
  "knicks-vs-spurs",
  "flagg-vs-wembanyama",
  "damian-lillard-vs-ja-morant",
  "lebron-james-vs-stephen-curry",
  "jordan-vs-kobe",
  "cooper-flagg-vs-kon-knueppel",
  "lakers-vs-celtics",
  "durant-vs-lebron",
  "embiid-vs-jokic",
  "kobe-bryant-vs-steph-curry",
];

describe("basketball category hub links", () => {
  it("surfaces editorial cluster pages and folds redirect sources onto canonical slugs", () => {
    expect(BASKETBALL).toBeTruthy();

    const dbRows = [
      { slug: "lebron-vs-jordan", title: "LeBron vs Jordan", category: "sports" },
      { slug: "nfl-vs-nba-revenue", title: "NFL vs NBA", category: "sports" },
      { slug: "nfl-vs-nba-viewership", title: "NFL vs NBA", category: "sports" },
      { slug: "kobe-vs-lebron", title: "Kobe vs LeBron", category: "sports" },
      { slug: "celtics-vs-lakers", title: "Celtics vs Lakers", category: "sports" },
      { slug: "sga-vs-wembanyama", title: "SGA vs Wembanyama", category: "sports" },
      { slug: "curry-vs-lebron", title: "Curry vs LeBron", category: "sports" },
    ];

    const merged = mergeEditorialCategoryComparisons("sports", dbRows);
    const basketball = comparisonsForSubcategory(merged, BASKETBALL!);
    const slugs = basketball.map((item) => item.slug);

    for (const slug of CLUSTER) {
      expect(slugs, slug).toContain(slug);
    }
    expect(slugs).toContain("nfl-vs-nba-revenue");
    expect(slugs).toContain("nfl-vs-nba-viewership");
    expect(slugs).not.toContain("kobe-vs-lebron");
    expect(slugs).not.toContain("celtics-vs-lakers");
    expect(slugs).not.toContain("sga-vs-wembanyama");
    expect(slugs).not.toContain("curry-vs-lebron");
    expect(slugs.filter((slug) => slug === "kobe-bryant-vs-lebron-james")).toHaveLength(1);
    expect(slugs.filter((slug) => slug === "lakers-vs-celtics")).toHaveLength(1);
    expect(slugs.filter((slug) => slug === "lebron-james-vs-stephen-curry")).toHaveLength(1);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.some((slug) => isRedirectedCompareSlug(slug))).toBe(false);
    expect(merged.map((item) => item.slug)).not.toContain("brave-vs-chrome");
    expect(categoryHubCount(dbRows.length, dbRows, merged)).toBeGreaterThan(dbRows.length);
  });
});
