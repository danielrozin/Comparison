import { describe, expect, it } from "vitest";
import {
  entityIdentityClearlyDiffers,
  resolveGeneratedEntitySlug,
  type EntityIdentity,
  type GeneratedEntityIdentity,
} from "@/lib/generation/entity-slug";

function identity(overrides: Partial<EntityIdentity> & Pick<EntityIdentity, "slug" | "shortDesc" | "entityTypeSlug">): EntityIdentity {
  return {
    name: overrides.name ?? overrides.slug,
    categories: overrides.categories ?? [],
    attributeSlugs: overrides.attributeSlugs ?? [],
    ...overrides,
  };
}

const travelKayak: EntityIdentity = identity({
  slug: "kayak",
  name: "Kayak",
  shortDesc: "Travel search engine for flights and hotels",
  entityTypeSlug: "products",
  categories: ["travel", "products"],
  attributeSlugs: Array.from({ length: 71 }, (_, index) => `flight-metric-${index}`),
});

const boatKayak: GeneratedEntityIdentity = {
  desiredSlug: "kayak",
  name: "Kayak",
  shortDesc: "Covered boat",
  entityTypeSlug: "product",
  comparisonCategory: "general",
  attributeSlugs: ["length", "cargo", "speed", "seats"],
};

const iphoneStored: EntityIdentity = identity({
  slug: "iphone-17",
  name: "iPhone 17",
  shortDesc: "Apple's 2025 flagship phone with an A19 chip",
  entityTypeSlug: "products",
  categories: ["technology"],
  attributeSlugs: ["display", "price", "battery", "storage"],
});

const iphoneGenerated: GeneratedEntityIdentity = {
  desiredSlug: "iphone-17",
  name: "iPhone 17",
  shortDesc: "Apple flagship phone",
  entityTypeSlug: "product",
  comparisonCategory: "technology",
  attributeSlugs: ["display", "chip"],
};

describe("entity slug collision", () => {
  it("does not reuse Kayak.com for a boat, and names the new row kayak-boat", () => {
    expect(entityIdentityClearlyDiffers(travelKayak, boatKayak)).toBe(true);

    const decision = resolveGeneratedEntitySlug(boatKayak, new Map([["kayak", travelKayak]]));
    expect(decision).toEqual({ slug: "kayak-boat", reuse: false });
  });

  it("still splits the boat when the page category is the broad products bucket", () => {
    const decision = resolveGeneratedEntitySlug(
      { ...boatKayak, comparisonCategory: "products" },
      new Map([["kayak", travelKayak]]),
    );
    expect(decision.slug).toBe("kayak-boat");
    expect(decision.reuse).toBe(false);
  });

  it("reuses iphone-17 when the type only differs by plural and the phone matches", () => {
    expect(entityIdentityClearlyDiffers(iphoneStored, iphoneGenerated)).toBe(false);
    const decision = resolveGeneratedEntitySlug(
      iphoneGenerated,
      new Map([["iphone-17", iphoneStored]]),
    );
    expect(decision).toEqual({ slug: "iphone-17", reuse: true });
  });

  it("reuses a stored boat when a later generation is also a boat", () => {
    const storedBoat = identity({
      slug: "kayak-boat",
      name: "Kayak",
      shortDesc: "Covered boat for one paddler",
      entityTypeSlug: "product",
      categories: ["general"],
      attributeSlugs: ["length", "seats"],
    });
    const decision = resolveGeneratedEntitySlug(
      boatKayak,
      new Map([
        ["kayak", travelKayak],
        ["kayak-boat", storedBoat],
      ]),
    );
    expect(decision).toEqual({ slug: "kayak-boat", reuse: true });
  });

  it("reuses Kayak.com when the new page is also the travel site", () => {
    const decision = resolveGeneratedEntitySlug(
      {
        desiredSlug: "kayak",
        name: "Kayak",
        shortDesc: "Booking Holdings flight finder",
        entityTypeSlug: "product",
        comparisonCategory: "travel",
        attributeSlugs: ["airfare", "hotels"],
      },
      new Map([["kayak", travelKayak]]),
    );
    expect(decision).toEqual({ slug: "kayak", reuse: true });
  });

  it("creates the desired slug when nothing is stored yet", () => {
    expect(resolveGeneratedEntitySlug(boatKayak, new Map())).toEqual({
      slug: "kayak",
      reuse: false,
    });
  });
});
