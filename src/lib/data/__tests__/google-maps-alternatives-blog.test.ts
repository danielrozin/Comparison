import { describe, expect, it } from "vitest";
import { findRepoBlogArticle } from "@/lib/data/nba-season-preview-blog";
import {
  GOOGLE_MAPS_ALTERNATIVES_ARTICLE,
  GOOGLE_MAPS_ALTERNATIVES_BLOG_SLUG,
} from "@/lib/data/google-maps-alternatives-blog";
import { ENTITY_CONTENT } from "@/lib/data/entity-content";

const BANNED =
  /this page|the page|according to|our sources|reviewed by|human review|checked|fetch|Source note|(?:^|\n)Sources:/i;

describe("Google Maps alternatives without Google blog", () => {
  it("is served from the repo blog registry", () => {
    expect(findRepoBlogArticle(GOOGLE_MAPS_ALTERNATIVES_BLOG_SLUG)).toBe(GOOGLE_MAPS_ALTERNATIVES_ARTICLE);
    expect(GOOGLE_MAPS_ALTERNATIVES_ARTICLE.status).toBe("published");
    expect(GOOGLE_MAPS_ALTERNATIVES_ARTICLE.metaDescription.length).toBeLessThanOrEqual(160);
  });

  it("covers each app, the Waze ownership, and the transit gap", () => {
    const text = GOOGLE_MAPS_ALTERNATIVES_ARTICLE.content;
    for (const name of ["Organic Maps", "CoMaps", "OsmAnd", "Magic Earth", "HERE WeGo", "Apple Maps"]) {
      expect(text).toContain(name);
    }
    expect(text).toMatch(/acquisition of Waze/);
    expect(text).toMatch(/intercity bus/);
    expect(text).toContain("Drafted with AI from web research.");
    expect(text).toContain("Updated October 12, 2026");
    expect(text).toContain("/compare/google-maps-vs-apple-maps");
    expect(text).toContain("/compare/google-maps-vs-waze");
    expect(text).toContain("/blog/best-navigation-apps-2026-google-maps-waze-and-apple-maps-compared");
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/source_page=/);
  });

  it("marks Waze as Google-owned on the alternatives data", () => {
    const waze = ENTITY_CONTENT["google-maps"].alternatives.find((alt) => alt.slug === "waze");
    expect(waze?.reason).toMatch(/Google-owned/);
  });
});
