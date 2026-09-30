import { describe, expect, it } from "vitest";
import {
  canRequestComparisonSlug,
  canonicalRequestedComparisonSlug,
  parseComparisonQuery,
} from "@/lib/parse-comparison-query";

describe("parseComparisonQuery", () => {
  it("canonicalizes both orders of vs / vs. / versus / v", () => {
    for (const raw of [
      "Thailand vs Vietnam",
      "Vietnam vs. Thailand",
      "thailand versus vietnam",
      "Vietnam v Thailand",
      "Vietnam v. Thailand",
    ]) {
      const parsed = parseComparisonQuery(raw);
      expect(parsed.parsed).toBe(true);
      expect(parsed.slug).toBe("thailand-vs-vietnam");
    }
  });

  it("understands compared to, compared with, or, and the difference/compare patterns", () => {
    expect(parseComparisonQuery("Thailand compared to Vietnam").slug).toBe("thailand-vs-vietnam");
    expect(parseComparisonQuery("Thailand compared with Vietnam").slug).toBe("thailand-vs-vietnam");
    expect(parseComparisonQuery("Thailand or Vietnam").slug).toBe("thailand-vs-vietnam");
    expect(parseComparisonQuery("difference between Thailand and Vietnam").slug).toBe(
      "thailand-vs-vietnam",
    );
    expect(parseComparisonQuery("compare Thailand and Vietnam").slug).toBe("thailand-vs-vietnam");
  });

  it("treats a bare 'and' as two entities only when both sides look like names", () => {
    expect(parseComparisonQuery("Messi and Ronaldo").slug).toBe("messi-vs-ronaldo");
    expect(parseComparisonQuery("pros and cons").parsed).toBe(false);
    expect(parseComparisonQuery("fish and chips").parsed).toBe(false);
    expect(parseComparisonQuery("what is python and javascript").parsed).toBe(false);
  });

  it("splits a single comma into two entities and keeps multi-word names intact", () => {
    expect(parseComparisonQuery("Thailand, Vietnam").slug).toBe("thailand-vs-vietnam");
    expect(parseComparisonQuery("New York vs Los Angeles").slug).toBe("los-angeles-vs-new-york");
    expect(parseComparisonQuery("New York, USA vs Los Angeles").slug).toBe(
      "los-angeles-vs-new-york-usa",
    );
  });

  it("puts trailing qualifiers in intent, not the slug", () => {
    const parsed = parseComparisonQuery("Thailand vs Vietnam for travel?");
    expect(parsed.slug).toBe("thailand-vs-vietnam");
    expect(parsed.intent).toMatch(/for travel/i);
    expect(parsed.intent).toMatch(/\?/);
    expect(parsed.slug).not.toContain("travel");

    const better = parseComparisonQuery("Thailand vs Vietnam which is better");
    expect(better.slug).toBe("thailand-vs-vietnam");
    expect(better.intent).toMatch(/which is better/i);
  });

  it("applies entity aliases and the compare redirect map", () => {
    expect(parseComparisonQuery("Netflix Inc vs Disney Plus").slug).toBe("disney-vs-netflix");
    expect(parseComparisonQuery("kobe vs lebron").slug).toBe("kobe-bryant-vs-lebron-james");
  });

  it("refuses a self-comparison and a single topic", () => {
    expect(parseComparisonQuery("Thailand vs Thailand").parsed).toBe(false);
    expect(parseComparisonQuery("osticket").parsed).toBe(false);
    expect(parseComparisonQuery("").parsed).toBe(false);
  });

  it("does not build a 3-way slug when the query already contains vs", () => {
    expect(parseComparisonQuery("Thailand vs Vietnam vs Laos").parsed).toBe(false);
  });

  it("treats x and × as separators and keeps xbox as one name", () => {
    expect(parseComparisonQuery("messi x ronaldo").slug).toBe("messi-vs-ronaldo");
    expect(parseComparisonQuery("Messi × Ronaldo").slug).toBe("messi-vs-ronaldo");
    expect(parseComparisonQuery("iPhone X vs Samsung").parsed).toBe(true);
    expect(parseComparisonQuery("iPhone X vs Samsung").slug).not.toBe("iphone-vs-samsung");
  });

  it("maps hbo to the live hbo-max page", () => {
    expect(parseComparisonQuery("hbo vs netflix").slug).toBe("hbo-max-vs-netflix");
    expect(parseComparisonQuery("HBO Max vs Netflix").slug).toBe("hbo-max-vs-netflix");
  });

  it("drops a trailing colon or 'in … terms' qualifier so the live page matches", () => {
    expect(parseComparisonQuery("vrbo vs airbnb: for hosts").slug).toBe("airbnb-vs-vrbo");
    expect(parseComparisonQuery("vrbo vs airbnb: for hosts, which is more profitable?").slug).toBe(
      "airbnb-vs-vrbo",
    );
    expect(parseComparisonQuery("japan vs china in economic terms").slug).toBe("japan-vs-china");
  });

  it("parses a side longer than five words", () => {
    const parsed = parseComparisonQuery("tesla model 3 grande autonomie 2026 vs byd seal");
    expect(parsed.parsed).toBe(true);
    expect(parsed.slug).toContain("byd-seal");
    expect(parsed.slug).toContain("tesla");
  });
});

describe("canRequestComparisonSlug", () => {
  it("allows a canonical two-entity slug and rejects the reverse, self, and n-way forms", () => {
    expect(canRequestComparisonSlug("thailand-vs-vietnam")).toBe(true);
    expect(canRequestComparisonSlug("vietnam-vs-thailand")).toBe(false);
    expect(canRequestComparisonSlug("thailand-vs-thailand")).toBe(false);
    expect(canRequestComparisonSlug("a-vs-b-vs-c")).toBe(false);
    expect(canRequestComparisonSlug("not a slug")).toBe(false);
    expect(canRequestComparisonSlug("hulu-vs-netflix-inc")).toBe(false);
    // The live ordering map keeps Netflix vs Hulu, not the alphabetical slug.
    expect(canonicalRequestedComparisonSlug("hulu-vs-netflix-inc")).toBe("netflix-vs-hulu");
    expect(canRequestComparisonSlug("netflix-vs-hulu")).toBe(true);
    expect(canonicalRequestedComparisonSlug("vietnam-vs-thailand")).toBe("thailand-vs-vietnam");
  });
});
