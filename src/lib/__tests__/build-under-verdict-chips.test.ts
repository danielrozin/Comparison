// ROO-264 follow-up — the row under the verdict only shows entity-matched picks.
import { describe, it, expect, vi, beforeEach } from "vitest";

const filterLiveCompareSlugs = vi.fn();
const getComparisonsForEntity = vi.fn();
vi.mock("@/lib/seo/resolve-internal-links", () => ({
  filterLiveCompareSlugs: (s: string[]) => filterLiveCompareSlugs(s),
}));
vi.mock("@/lib/services/comparison-service", () => ({
  getComparisonsForEntity: (s: string) => getComparisonsForEntity(s),
}));

import {
  buildUnderVerdictChips,
  matchupKey,
  pickUnderVerdictCandidates,
} from "@/lib/data/build-under-verdict-chips";

const amex = [
  { slug: "amex", name: "Amex" },
  { slug: "master-card", name: "Mastercard" },
];

beforeEach(() => {
  vi.clearAllMocks();
  filterLiveCompareSlugs.mockImplementation(async (s: string[]) => s);
});

describe("pickUnderVerdictCandidates", () => {
  it("drops unrelated fillers (Amex vs Mastercard → Bitcoin vs Ethereum)", () => {
    const out = pickUnderVerdictCandidates("amex-vs-master-card", amex, [
      [
        { slug: "bitcoin-vs-ethereum", title: "Bitcoin vs Ethereum" },
        { slug: "visa-vs-master-card", title: "Visa vs Mastercard" },
      ],
      [{ slug: "amex-vs-visa", title: "Amex vs Visa: which card" }],
    ]);
    expect(out.map((c) => c.slug)).toEqual(["amex-vs-visa", "visa-vs-master-card"]);
    expect(out[0]!.title).toBe("Amex vs Visa");
  });

  it("drops the reversed pair of the page and duplicate labels", () => {
    const ents = [
      { slug: "vietnam-war", name: "Vietnam War" },
      { slug: "korean-war", name: "Korean War" },
    ];
    const out = pickUnderVerdictCandidates("vietnam-war-vs-korean-war", ents, [
      [
        { slug: "korean-war-vs-vietnam-war", title: "Korean War vs Vietnam War" },
        { slug: "vietnam-war-vs-ww2", title: "Vietnam War vs WW2" },
        { slug: "vietnam-war-vs-world-war-2", title: "Vietnam War vs WW2" },
        { slug: "korean-war-vs-ww1", title: "Korean War vs WW1" },
      ],
    ]);
    expect(out.map((c) => c.slug)).toEqual(["vietnam-war-vs-ww2", "korean-war-vs-ww1"]);
  });

  it("matchupKey ignores order", () => {
    expect(matchupKey("a-vs-b")).toBe(matchupKey("b-vs-a"));
  });
});

describe("buildUnderVerdictChips", () => {
  it("returns [] (row hidden) with fewer than two entity matches", async () => {
    getComparisonsForEntity.mockResolvedValue([]);
    const out = await buildUnderVerdictChips("amex-vs-master-card", amex, [
      { slug: "bitcoin-vs-ethereum", title: "Bitcoin vs Ethereum" },
      { slug: "amex-vs-visa", title: "Amex vs Visa" },
    ]);
    expect(out).toEqual([]);
  });

  it("uses per-entity compares, live-filtered, max 3", async () => {
    getComparisonsForEntity.mockImplementation(async (s: string) =>
      s === "amex"
        ? [
            { slug: "amex-vs-master-card", title: "self", category: null },
            { slug: "amex-vs-visa", title: "Amex vs Visa", category: null },
            { slug: "amex-gold-vs-platinum", title: "Amex Gold vs Platinum", category: null },
          ]
        : [
            { slug: "visa-vs-master-card", title: "Visa vs Mastercard", category: null },
            { slug: "master-card-vs-discover", title: "Mastercard vs Discover", category: null },
          ]
    );
    filterLiveCompareSlugs.mockImplementation(async (s: string[]) =>
      s.filter((x) => x !== "master-card-vs-discover")
    );
    const out = await buildUnderVerdictChips("amex-vs-master-card", amex, []);
    expect(out).toEqual([
      { slug: "visa-vs-master-card", label: "Visa vs Mastercard" },
      { slug: "amex-vs-visa", label: "Amex vs Visa" },
      { slug: "amex-gold-vs-platinum", label: "Amex Gold vs Platinum" },
    ]);
  });
});
