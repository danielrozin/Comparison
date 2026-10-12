import { describe, expect, it } from "vitest";
import { suggestExistingComparison } from "@/lib/search/did-you-mean";

const LIVE = [
  { slug: "messi-vs-ronaldo", title: "Messi vs Ronaldo" },
  { slug: "hbo-max-vs-netflix", title: "HBO Max vs Netflix" },
  { slug: "airbnb-vs-vrbo", title: "Airbnb vs VRBO" },
  { slug: "japan-vs-china", title: "Japan vs China" },
  { slug: "iphone-17-vs-samsung-s26", title: "iPhone 17 vs Samsung Galaxy S26" },
];

describe("suggestExistingComparison", () => {
  it("offers the live page when the query is a close phrasing, not the title", () => {
    expect(suggestExistingComparison("messi x ronaldo", LIVE)).toEqual({
      slug: "messi-vs-ronaldo",
      title: "Messi vs Ronaldo",
    });
    expect(suggestExistingComparison("hbo vs netflix", LIVE)).toEqual({
      slug: "hbo-max-vs-netflix",
      title: "HBO Max vs Netflix",
    });
    expect(suggestExistingComparison("vrbo vs airbnb: for hosts", LIVE)).toEqual({
      slug: "airbnb-vs-vrbo",
      title: "Airbnb vs VRBO",
    });
    expect(suggestExistingComparison("japan vs china in economic terms", LIVE)).toEqual({
      slug: "japan-vs-china",
      title: "Japan vs China",
    });
  });

  it("stays quiet when the query already is the page title", () => {
    expect(suggestExistingComparison("Messi vs Ronaldo", LIVE)).toBeNull();
  });

  it("does not suggest a page that only shares one side", () => {
    expect(suggestExistingComparison("tecno vs iphone", LIVE)).toBeNull();
    expect(suggestExistingComparison("osticket", LIVE)).toBeNull();
  });
});
