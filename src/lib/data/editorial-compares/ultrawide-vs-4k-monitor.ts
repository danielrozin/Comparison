import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-407 — 3440 by 1440 ultrawide vs 16:9 4K (3840 by 2160).
 * Sources opened 10 November 2026 (Asia/Jerusalem):
 * GamersNexus, "UltraWide GPU Gaming Benchmark", 15 February 2016;
 * KTC, "3440x1440 vs. Standard Monitor Resolutions", 17 May 2026 (maker);
 * KTC, "Why 21:9 Ultrawide Monitors Have Fewer Pixels", 5 June 2026 (maker);
 * RTINGS, monitor resolution-size test methodology.
 * Reddit returned HTTP 403, so there is no community block.
 * Pixel counts, ratios, and PPI are arithmetic on stated diagonals.
 * dataPointCount stays 0. PR 523 owns the shared "0 data points" wording.
 * No winner. No prices. No frame-rate figures from the 2016 bench.
 * "Widely supported" is omitted. KTC is the maker, not a lab.
 */

const PUBLISHED = "2026-11-10T00:00:00Z";
const SOURCE_DATE = "2026-11-10";

const UW = "ultrawide";
const UHD = "4k";

const GAMERSNEXUS =
  "https://gamersnexus.net/guides/2312-ultrawide-gpu-gaming-benchmark-fps-performance";
const KTC_RESOLUTIONS =
  "https://us.ktcplay.com/blogs/technology-hub/3440x1440-vs-standard-monitor-resolutions";
const KTC_PIXELS =
  "https://us.ktcplay.com/blogs/technology-hub/ultrawide-monitor-pixels-vs-resolution";
const RTINGS = "https://www.rtings.com/monitor/tests/inputs/resolution-size";

const SHORT_ANSWER = `A 3440 by 1440 grid has 4,953,600 pixels and a 3840 by 2160 grid has 8,294,400, so the 4K grid has exactly 72/43 times as many pixels. Choose 3440 by 1440 when you want that 43:18 grid, and choose 3840 by 2160 when you want the 16:9 4K grid.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways. A 3440 by 1440 grid contains 4,953,600 pixels, and a 3840 by 2160 grid contains 8,294,400. Dividing those counts gives exactly 72/43, because both counts divide by 115,200. A 3440 by 1440 grid has exactly 43/32 times the pixels of a 2560 by 1440 grid, which is 1.34375. On a 34-inch diagonal, 3440 by 1440 rounds to 109.68 pixels per inch, on a 32-inch 3840 by 2160 diagonal it rounds to 137.68, and on a 27-inch 3840 by 2160 diagonal it rounds to 163.18. Those figures count pixels on a stated diagonal, and they are not a frame-rate measurement. Choose 3440 by 1440 for the 43:18 grid, and choose 3840 by 2160 for the 16:9 grid.

Names and the exact ratio. 3440 times 1440 is 4,953,600. 3840 times 2160 is 8,294,400. Both products divide by 115,200: 4,953,600 becomes 43, and 8,294,400 becomes 72, so the ratio is exactly 72/43. 3440 and 1440 divide by 80 into 43 and 18, so that grid is exactly 43:18. A 16:9 grid such as 3840 by 2160 divides to 16:9. A 21:9 label with the height held at 1440 would be 3360 by 1440, because 21/9 times 1440 is 3360, and 3440 is not 3360. 43/18 is 2.3888..., while 21/9 is 2.333... KTC, the monitor maker, wrote on 17 May 2026 that 3440 by 1440 sits in the consumer 21:9 class and that its exact ratio is 43:18. KTC wrote on 5 June 2026 that the 21:9 label is a marketing shortcut rather than one exact ratio. RTINGS groups 3440 by 1440 with 3840 by 1600 and 5120 by 2160 under a 21:9 (2.33:1) label, and writes that not every ultrawide is exactly 2.33:1. A 3440 by 1440 screen, RTINGS writes, has a ratio of 2.38:1. 43/18 is 2.3888..., the ratio RTINGS shortened to 2.38:1. The pixel grid itself is 43:18.

Where 3440 by 1440 sits against 2560 by 1440. 2560 times 1440 is 3,686,400. That product also divides by 115,200, into 32, so 4,953,600 is exactly 43/32 times 3,686,400. 43/32 is 1.34375, and 43/32 minus 1 is 11/32, which is 34.375 percent. The gap is 1,267,200 pixels. The gap from 4,953,600 up to 8,294,400 is 3,340,800 pixels. 4,953,600 is 43/72 of 8,294,400, so the ultrawide count is 29/72 lower than the 4K count. 29/72 is 40.2777... percent. KTC wrote on 17 May 2026 that the count is about 35 percent more pixels than 2560 by 1440, and about 40 percent fewer than 4K. Those are the maker's roundings of 34.375 percent and of 29/72. The pixel-count gap to 2560 by 1440 is smaller than the gap to 3840 by 2160. That comparison is a count of pixels.

How the density is rounded. Square each side, add, take the square root, and divide by the stated diagonal. RTINGS calculates pixel density the same way: diagonal resolution divided by the advertised screen size. For 3440 and 1440, 3440 squared is 11,833,600 and 1440 squared is 2,073,600. The square root of 13,907,200 is 3,729.24 to two decimals. Dividing the full square root by 34 gives 109.6834..., which rounds to 109.68 pixels per inch. The nearest whole number is 110. For 3840 and 2160, 3840 squared is 14,745,600 and 2160 squared is 4,665,600. The square root of 19,411,200 is 4,405.81 to two decimals. RTINGS states the 4K diagonal resolution as 4,405.814 pixels. Dividing the full square root by 32 gives 137.6816..., which rounds to 137.68, and the nearest whole number is 138. Dividing it by 27 gives 163.1783..., which rounds to 163.18, and the nearest whole number is 163. RTINGS' size rows give 138 for a 32-inch 4K row and 163 for a 27-inch 4K row. The sentence with the 4,405.814 example calls that 27-inch case about 164 PPI. 4,405.814 divided by 27 is the 163.178... figure, so 163.18 and the whole number 163 are the rounding used here. KTC's 5 June 2026 table, from the monitor maker, gives 110 for a 34-inch 3440 by 1440 row, 138 for a 32-inch 3840 by 2160 row, and 109 for a 27-inch 2560 by 1440 row. 109 is 108.79 rounded to a whole number, from the same formula on a 27-inch 2560 by 1440 diagonal. Rounding happens after the division. A different diagonal changes the result. The formula assumes square pixels and uses the diagonal stated with it. It is not a measurement of one shipping panel.

What 72/43 does not say. 72/43 counts pixels. It is not a measured change in frame rate, and it is not a measured change in graphics-card load. GamersNexus, on 15 February 2016, put 3440 by 1440 at about 4.9 million pixels, 2560 by 1440 at about 3.7 million, and 3840 by 2160 at about 8.3 million, and wrote that the 4K count makes 3840 by 2160 more intensive than 3440 by 1440 because of pixel throughput. The charts in that article belong to that 15 February 2016 bench and the cards named there. They are not a result for a current graphics card. No frame-rate figure from that suite is repeated here.

Width and height on the stated diagonals. Width in inches is the diagonal times the horizontal pixel count, divided by the diagonal pixel count. Height uses the vertical pixel count in that same division. On a 34-inch 3440 by 1440 diagonal, 34 times 3440 divided by the full square root gives 31.3629..., which rounds to 31.36 inches, and 34 times 1440 divided by that square root gives 13.1286..., which rounds to 13.13 inches. On a 32-inch 3840 by 2160 diagonal, the same steps round to 27.89 inches wide and 15.69 inches high. On a 27-inch 16:9 diagonal, 2560 by 1440 and 3840 by 2160 share the shape, and the same steps round to 23.53 inches wide and 13.24 inches high. The 34-inch ultrawide panel is wider than the 32-inch 4K panel in that calculation, and 13.13 is not the same height figure as 13.24.

Games and the 3440 by 1440 grid. GamersNexus wrote on 15 February 2016 that some games were not supported at ultrawide. In that article, older titles and indie titles were the common cases, and some competitive games forbid the resolution. The article names Dirty Bomb's beta, which did not seem to support 3440 by 1440 in that test, HUD issues in CSGO, and a slight stretch in Shadow of Mordor. That is a 2016 test note, not a 2026 support rate. KTC, the monitor maker, wrote on 17 May 2026 that support is better than it used to be, but not universal, and that a title which does not cooperate may fall back to 16:9 with black side bars, which KTC calls usually tolerable on OLED because those pixels switch fully off. KTC is the maker, not a lab. A current support rate is not in these documents.

Consoles. KTC wrote on 17 May 2026 that consoles do not properly support an ultrawide aspect ratio. A PlayStation or Xbox output specification is not among these documents. Confirm the console maker's current video settings before you buy a 3440 by 1440 monitor for a console.

Rows, width, and price. The 4K grid has 2160 rows and the ultrawide grid has 1440 rows. The calculated width at the 34-inch ultrawide diagonal is 31.36 inches, against 27.89 inches at the 32-inch 4K diagonal. Choose 3440 by 1440 when you want that wider calculated shape. Choose 3840 by 2160 when you want 2160 rows. Price is not in these documents. Compare the current listing of the two models in front of you.

Panel type and the graphics card are separate questions. QD-OLED vs WOLED compares two OLED stacks. OLED vs Mini-LED compares an OLED gaming monitor with a Mini-LED LCD. RTX 5070 vs RX 9070 XT vs RTX 5070 Ti compares those graphics cards. None of those three questions is this pixel grid, and the pixel counts do not change with the card name.

Neither grid is the one for every desk. Choose 3440 by 1440 when you want the 43:18 count of 4,953,600 pixels. Choose 3840 by 2160 when you want the 16:9 count of 8,294,400 pixels. Refresh rate stays on each model's spec.`;

const FAQS = [
  {
    question: "How many pixels are in 3440 by 1440 and in 4K?",
    answer:
      "3440 by 1440 is 4,953,600 pixels. 4K here is 3840 by 2160, which is 8,294,400 pixels. Dividing 8,294,400 by 4,953,600 gives exactly 72/43. Both counts divide by 115,200.",
  },
  {
    question: "Is 3440 by 1440 closer to 1440p or to 4K in pixel count?",
    answer:
      "Closer to 2560 by 1440, as a count of pixels. 3440 by 1440 has 4,953,600 pixels, which is exactly 43/32 times 3,686,400, a gap of 1,267,200 pixels. The gap from 4,953,600 up to 8,294,400 is 3,340,800 pixels. That is not a frame-rate measurement.",
  },
  {
    question: "What is the pixel density of a 34-inch ultrawide and a 32-inch 4K monitor?",
    answer:
      "For square pixels, divide the square root of width squared plus height squared by the stated diagonal. That rounds to 109.68 pixels per inch for 3440 by 1440 at 34 inches, and to 137.68 for 3840 by 2160 at 32 inches. The nearest whole numbers are 110 and 138. A 27-inch 3840 by 2160 diagonal rounds to 163.18. A different diagonal changes the result.",
  },
  {
    question: "Does 72/43 times the pixels mean a frame-rate result?",
    answer:
      "No. 72/43 is 8,294,400 divided by 4,953,600. It counts pixels. GamersNexus, on 15 February 2016, wrote that 3840 by 2160 is more intensive than 3440 by 1440 because of pixel throughput, on the cards in that bench. Those charts stay in that 2016 suite. They are not a result for a current graphics card.",
  },
  {
    question: "Do all games use a 3440 by 1440 grid?",
    answer:
      "GamersNexus wrote on 15 February 2016 that some games were not supported at ultrawide, including older titles, indie titles, and some competitive games, and named Dirty Bomb's beta, CSGO HUD issues, and a slight stretch in Shadow of Mordor. KTC, the monitor maker, wrote on 17 May 2026 that support is better than it used to be, but not universal, and that a title which does not cooperate may fall back to 16:9 with black side bars. A 2026 support rate is not in these documents.",
  },
  {
    question: "Should you choose 3440 by 1440 or 3840 by 2160?",
    answer:
      "Choose 3440 by 1440 when you want the 43:18 grid of 4,953,600 pixels. Choose 3840 by 2160 when you want the 16:9 grid of 8,294,400 pixels. The counts do not pick a monitor. Refresh rate, panel type, and price stay on each model's current listing.",
  },
];

const VERDICT = `Choose 3440 by 1440 when you want the 43:18 grid. It has 4,953,600 pixels. Choose 3840 by 2160 when you want the 16:9 grid. It has 8,294,400 pixels, exactly 72/43 times the ultrawide count.

On a 34-inch diagonal, 3440 by 1440 rounds to 109.68 pixels per inch. On a 32-inch 3840 by 2160 diagonal it rounds to 137.68, and on a 27-inch 3840 by 2160 diagonal it rounds to 163.18. Those figures count pixels. They are not a frame-rate result.`;

const BUILT = buildEditorialComparison({
  slug: "ultrawide-vs-4k-monitor",
  title: "Ultrawide vs 4K Monitor?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: UW,
      slug: UW,
      name: "3440 by 1440",
      shortDesc: "A 3440 by 1440 grid, exactly 43:18, on a 34-inch diagonal in the density formula.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [],
      cons: [],
      bestFor: "Choose this grid for 3440 by 1440 at 43:18",
    },
    {
      id: UHD,
      slug: UHD,
      name: "3840 by 2160",
      shortDesc: "A 3840 by 2160 grid, 16:9, on a 32-inch or 27-inch diagonal in the density formula.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [],
      cons: [],
      bestFor: "Choose this grid for 3840 by 2160 at 16:9",
    },
  ],
  keyDifferences: [
    {
      label: "Pixel grid",
      entityAValue: "3440 by 1440",
      entityBValue: "3840 by 2160",
      winner: "tie",
    },
    {
      label: "Pixel count",
      entityAValue: "4,953,600",
      entityBValue: "8,294,400, exactly 72/43 times the 3440 by 1440 count",
      winner: "tie",
    },
    {
      label: "Aspect ratio of the grid",
      entityAValue: "Exactly 43:18. 21:9 would be 3360 by 1440 at this height",
      entityBValue: "16:9",
      winner: "tie",
    },
    {
      label: "Square-pixel density",
      entityAValue: "109.68 pixels per inch for 3440 by 1440 at a 34-inch diagonal, rounded after the division",
      entityBValue: "137.68 at 32 inches, and 163.18 at 27 inches, for 3840 by 2160",
      winner: "tie",
    },
    {
      label: "Calculated size at the stated diagonal",
      entityAValue: "31.36 inches wide and 13.13 inches high at 34 inches",
      entityBValue: "27.89 inches wide and 15.69 inches high at 32 inches",
      winner: "tie",
    },
    {
      label: "Vertical pixels",
      entityAValue: "1440 rows",
      entityBValue: "2160 rows",
      winner: "tie",
    },
    {
      label: "Against 2560 by 1440",
      entityAValue: "Exactly 43/32 times 3,686,400, a gap of 1,267,200 pixels",
      entityBValue: "Exactly 2.25 times 3,686,400",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "grid",
      "Pixel grid",
      "Resolution",
      UW,
      UHD,
      "3440 by 1440. 3440 times 1440 is 4,953,600",
      "3840 by 2160. 3840 times 2160 is 8,294,400",
    ),
    textAttr(
      "ratio",
      "Pixel-count ratio",
      "Resolution",
      UW,
      UHD,
      "4,953,600 is exactly 43/32 times a 2560 by 1440 count of 3,686,400",
      "8,294,400 divided by 4,953,600 is exactly 72/43",
    ),
    textAttr(
      "aspect",
      "Aspect ratio",
      "Shape",
      UW,
      UHD,
      "Exactly 43:18. KTC, on 17 May 2026, calls 21:9 the class name",
      "16:9. 3840 divided by 2160 is 16/9",
    ),
    textAttr(
      "ppi-34-32",
      "Square-pixel density",
      "Density",
      UW,
      UHD,
      "109.68 pixels per inch for 3440 by 1440 at 34 inches. sqrt(13,907,200) / 34, then rounded to two decimals",
      "137.68 pixels per inch at 32 inches. sqrt(19,411,200) / 32, then rounded to two decimals",
    ),
    textAttr(
      "ppi-27",
      "27-inch 3840 by 2160 density",
      "Density",
      UW,
      UHD,
      "The 34-inch formula is a different diagonal, so it is not this 27-inch figure",
      "163.18 pixels per inch. sqrt(19,411,200) / 27, then rounded to two decimals",
    ),
    textAttr(
      "inches",
      "Calculated width and height",
      "Size",
      UW,
      UHD,
      "31.36 by 13.13 inches at a 34-inch diagonal, rounded after the division",
      "27.89 by 15.69 inches at a 32-inch diagonal, rounded after the division",
    ),
    textAttr(
      "support",
      "3440 by 1440 in games",
      "Games",
      UW,
      UHD,
      "GamersNexus, 15 February 2016: some games were not supported. KTC, 17 May 2026: support is better than it used to be, but not universal",
      "3840 by 2160 is the 16:9 grid. The support notes are about 3440 by 1440, and a 2026 support rate is not in these documents",
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "qd-oled-vs-woled",
      title: "QD-OLED vs WOLED Gaming Monitor",
      category: "technology",
    },
    {
      slug: "oled-vs-mini-led-gaming-monitor",
      title: "OLED vs Mini-LED Gaming Monitor",
      category: "technology",
    },
    {
      slug: "rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti",
      title: "RTX 5070 vs RX 9070 XT vs RTX 5070 Ti",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: null,
    keyFact:
      "3440 by 1440 has 4,953,600 pixels and 3840 by 2160 has 8,294,400, exactly 72/43 times as many. At 34 inches, 3440 by 1440 rounds to 109.68 pixels per inch.",
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 0,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "GamersNexus: UltraWide GPU benchmark (15 February 2016)", url: GAMERSNEXUS },
      { name: "KTC: 3440x1440 vs standard resolutions (17 May 2026, maker)", url: KTC_RESOLUTIONS },
      { name: "KTC: ultrawide pixels and PPI (5 June 2026, maker)", url: KTC_PIXELS },
      { name: "RTINGS: monitor resolution and size test", url: RTINGS },
    ],
  },
  resources: [
    {
      type: "external",
      label: "GamersNexus: UltraWide GPU benchmark (15 February 2016)",
      url: GAMERSNEXUS,
      description:
        "Steve Burke, 15 February 2016. About 4.9 million pixels at 3440 by 1440, about 3.7 million at 2560 by 1440, and about 8.3 million at 3840 by 2160. The 4K count is described as more intensive because of pixel throughput. Some games were not supported. Named cases include Dirty Bomb's beta, CSGO HUD issues, and a slight stretch in Shadow of Mordor.",
    },
    {
      type: "external",
      label: "KTC: 3440x1440 vs standard resolutions (17 May 2026, maker)",
      url: KTC_RESOLUTIONS,
      description:
        "KTC, 17 May 2026. Maker article. Exact ratio 43:18 inside the consumer 21:9 class. About 4.95 million pixels, about 35 percent more than 2560 by 1440, and about 40 percent fewer than 4K. Support is better than it used to be, but not universal. A title that does not cooperate may fall back to 16:9 with black side bars. Consoles, in this maker article, do not properly support an ultrawide aspect ratio.",
    },
    {
      type: "external",
      label: "KTC: ultrawide pixels and PPI (5 June 2026, maker)",
      url: KTC_PIXELS,
      description:
        "KTC, 5 June 2026. Maker table of approximate PPI: 110 for 34-inch 3440 by 1440, 109 for 27-inch 2560 by 1440, and 138 for 32-inch 3840 by 2160. About 4.95 million and about 8.29 million pixels. The 21:9 label is called a marketing shortcut rather than one exact ratio.",
    },
    {
      type: "external",
      label: "RTINGS: monitor resolution and size test",
      url: RTINGS,
      description:
        "Pixel density is the diagonal resolution divided by the advertised screen size. The 4K example uses a diagonal resolution of 4,405.814 pixels. Size rows give 163 for 27-inch 4K, 138 for 32-inch 4K, and 109 for 27-inch 1440p. The worked sentence calls the 27-inch 4K example about 164 PPI. A 3440 by 1440 screen is given a ratio of 2.38:1, with the note that not every ultrawide is exactly 2.33:1.",
    },
    {
      type: "blog",
      label: "QD-OLED vs WOLED Gaming Monitor",
      url: "/compare/qd-oled-vs-woled",
      description: "A separate monitor question: two OLED stacks, not this pixel-grid comparison.",
    },
    {
      type: "blog",
      label: "OLED vs Mini-LED Gaming Monitor",
      url: "/compare/oled-vs-mini-led-gaming-monitor",
      description: "A separate monitor question: OLED against Mini-LED, not 3440 by 1440 against 4K.",
    },
    {
      type: "blog",
      label: "RTX 5070 vs RX 9070 XT vs RTX 5070 Ti",
      url: "/compare/rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti",
      description: "A separate question: those graphics cards, not this pixel grid.",
    },
  ],
  metaTitle: "Ultrawide vs 4K Monitor?",
});

BUILT.metadata.metaDescription =
  "3440 by 1440 is 4,953,600 pixels. 4K (3840 by 2160) is 8,294,400, exactly 72/43 times as many. At 34 inches, 3440 by 1440 rounds to 109.68 PPI.";

export const ULTRAWIDE_VS_4K_MONITOR: EditorialComparison = BUILT;
