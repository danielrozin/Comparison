import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-384 — RX 9060 XT 16GB vs RX 9070 XT for 1440p, by price gap.
 * Opened 5 November 2026 (Asia/Jerusalem).
 * RX 9060 XT specs and SEPs: AMD Newsroom, 20 May 2025.
 * RX 9070 XT specs and SEPs: AMD investor release, 28 February 2025.
 * Dated 1440p framing only: TechSpot RX 9070 XT review, 5 March 2025
 * (119 fps average across 18 games, 6% slower than the RTX 5070 Ti).
 * That review does not measure the RX 9060 XT, so there is no percentage
 * gap between these two cards. No street prices. No minimum-PSU wattage
 * (neither AMD release lists one). No board-partner ranking.
 * r/buildapc returned HTTP 403, so there is no community block and no
 * close-the-loop. The shared Analysis heading and
 * "Drafted with AI from web research." come from ExpertAnalysis.
 */

const A = "rx-9060-xt";
const B = "rx-9070-xt";

const AMD_9060 =
  "https://newsroom.amd.com/news/amd-introduces-new-radeon-graphics-cards-and-ryzen.html";
const AMD_9070 =
  "https://ir.amd.com/news-events/press-releases/detail/1238/amd-unveils-next-generation-amd-rdna-4-architecture-with-the-launch-of-amd-radeon-rx-9000-series-graphics-cards";
const TECHSPOT = "https://www.techspot.com/review/2961-amd-radeon-9070-xt/";

const SOURCE_DATE = "2026-11-05";
const PUBLISHED = "2026-11-05T00:00:00Z";
const SPEC = "Specs";

const SHORT_ANSWER =
  "Buy the 16GB Radeon RX 9060 XT when the RX 9070 XT costs about twice as much. AMD lists a $349 SEP for the 16GB RX 9060 XT and a $599 SEP for the RX 9070 XT, and the RX 9070 XT is a higher tier: 64 compute units, a 256-bit memory interface and 304 W total board power, against 32 compute units, a 128-bit interface and a starting 160 W on the 16GB card. Consider the RX 9070 XT when its street price is close to that $599 SEP and you want the higher tier AMD describes for high-resolution play. Neither card is right for everyone, and store prices change.";

const FAQS = [
  {
    question: "Is the RX 9070 XT much faster than the RX 9060 XT?",
    answer:
      "It is a higher tier. AMD lists 64 compute units, a 256-bit memory interface and 304 W total board power on the RX 9070 XT, against 32 compute units, a 128-bit interface and a starting 160 W total board power on the 16GB RX 9060 XT. AMD's releases do not give a frame-rate gap between the two cards. TechSpot's March 5, 2025 review measured the RX 9070 XT at 119 fps on average across 18 games at 1440p, 6% slower than the GeForce RTX 5070 Ti in that test. That review does not measure the RX 9060 XT.",
  },
  {
    question: "At double the price, is the RX 9070 XT worth it over the 9060 XT?",
    answer:
      "Usually no. AMD lists a $349 SEP for the 16GB RX 9060 XT and a $599 SEP for the RX 9070 XT. If the RX 9070 XT costs about twice the 16GB RX 9060 XT where you shop, buy the 16GB RX 9060 XT and put the difference toward a 1440p monitor or keep it. If the RX 9070 XT is close to AMD's $599 SEP, or about 1.5 times the 16GB RX 9060 XT, compare the larger GPU before you decide.",
  },
  {
    question: "Should I buy the 8GB or 16GB RX 9060 XT?",
    answer:
      "Choose the 16GB model for 1440p and for this matchup. AMD lists a $349 SEP and a starting 160 W total board power for the 16GB RX 9060 XT, and a $299 SEP and a starting 150 W total board power for the 8GB model. Both list 32 compute units, a 2.53 GHz game clock, a boost clock up to 3.13 GHz, a 128-bit memory interface and 32 MB of Infinity Cache.",
  },
  {
    question: "Should I consider the RX 9070 instead of the 9070 XT?",
    answer:
      "Often, when its street price sits between the 16GB RX 9060 XT and the RX 9070 XT. AMD lists a $549 SEP, 56 compute units, a 256-bit memory interface and 220 W total board power for the RX 9070, against a $599 SEP, 64 compute units and 304 W for the RX 9070 XT. The RX 9060 XT vs RX 9070 and RX 9070 vs RX 9070 XT comparisons cover those steps.",
  },
  {
    question: "I have an RX 6600 XT. Is the RX 9060 XT enough for 1440p?",
    answer:
      "AMD's May 20, 2025 release presents the RX 9060 XT for 1440p gaming, with 32 compute units and up to 16 GB of GDDR6. That is the card to choose from an older Radeon when the RX 9070 XT costs about twice as much. Choose the RX 9070 XT when its street price is close to the $599 SEP and you want 64 compute units and a 256-bit memory bus.",
  },
  {
    question: "Do the RX 9060 XT and RX 9070 XT both have 16GB of VRAM?",
    answer:
      "The RX 9070 XT has 16 GB of GDDR6 only. The RX 9060 XT is sold in 8 GB and 16 GB versions. Prefer the 16 GB RX 9060 XT in this matchup.",
  },
];

const VERDICT = `Choose the 16GB RX 9060 XT when the RX 9070 XT costs about twice as much. AMD lists a $349 SEP, 32 compute units, a 128-bit memory interface and a starting 160 W total board power.

Choose the RX 9070 XT when its street price is close to AMD's $599 SEP. AMD lists 64 compute units, a 256-bit memory interface, 64 MB of Infinity Cache and 304 W total board power.

Neither card is right for everyone. Store prices change, so compare the models you can buy today.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

AMD's own prices are a $349 SEP for the 16GB RX 9060 XT and a $599 SEP for the RX 9070 XT. Store prices move away from those figures, so the gap you see today decides the buy.

If the RX 9070 XT costs about 1.5 times the 16GB RX 9060 XT, or sits near the $599 SEP, compare the RX 9070 XT for its larger GPU.

If the RX 9070 XT costs about twice the 16GB RX 9060 XT, buy the 16GB RX 9060 XT. Put the difference into the 1440p monitor, or keep it.

Prefer the 16GB RX 9060 XT over the 8GB model. AMD lists a $349 SEP for 16 GB and a $299 SEP for 8 GB.

The RX 9060 XT and the RX 9070 XT are both RDNA 4 cards. AMD's May 20, 2025 newsroom release lists the 16GB RX 9060 XT at 32 compute units, 16 GB of memory, a 2.53 GHz game clock, a boost clock up to 3.13 GHz, a 128-bit memory interface, 32 MB of Infinity Cache and a total board power starting at 160 W. The 8GB model shares the compute units, clocks, bus and cache, with a total board power starting at 150 W.

AMD's February 28, 2025 investor release lists the RX 9070 XT at 64 compute units, 16 GB of GDDR6, a 2.4 GHz game clock, a boost clock up to 3.0 GHz, a 256-bit memory interface, 64 MB of Infinity Cache, 304 W total board power and a $599 SEP. AMD's boost-clock note says that figure is the maximum on a bursty workload and that it varies with thermal conditions and the workload.

The RX 9060 XT's listed clocks are higher. The RX 9070 XT has twice the compute units and a wider memory bus. That is a specification difference, not a measured frame-rate gap between the two cards.

AMD describes the RX 9060 XT as built for smooth, responsive 1440p gaming. AMD describes the RX 9070 XT as part of an enthusiast-class series for high-resolution gaming, and says the RX 9070 series' 16 GB of GDDR6 is there so games can be rendered at max settings.

TechSpot's March 5, 2025 review measured the RX 9070 XT at an average of 119 fps across 18 games at 1440p, 6% slower than the GeForce RTX 5070 Ti in that test. That review does not measure the RX 9060 XT, so it does not supply a percentage gap between these two Radeon cards.

The 16GB RX 9060 XT starts at 160 W total board power. The RX 9070 XT is rated at 304 W. Moving from an older, lower-power card to the RX 9070 XT means checking the power supply and the board partner's power connectors. AMD's two releases do not list a minimum power-supply wattage for either card.

A wide price gap and a new 1440p monitor pull in different directions. When the GPU costs about twice as much, a stronger 1440p display is the usual place for the difference. When the RX 9070 XT is close to its $599 SEP, the extra compute units and the wider memory bus are the reason to spend more on the card.

The RX 9070 sits between them on AMD's February 28, 2025 release: 56 compute units, the same 16 GB and 256-bit memory system as the RX 9070 XT, 220 W and a $549 SEP. RX 9060 XT vs RX 9070 and RX 9070 vs RX 9070 XT cover that step. RTX 5060 vs RX 9060 XT covers the NVIDIA card beside the RX 9060 XT.`;

const BUILT = buildEditorialComparison({
  slug: "rx-9060-xt-vs-rx-9070-xt",
  title: "RX 9060 XT vs RX 9070 XT: Which GPU for 1440p",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "RX 9060 XT",
      shortDesc: "16GB RDNA 4 card AMD launched at a $349 SEP, with 32 compute units and a 128-bit bus.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "$349 SEP for the 16GB model (AMD, May 20, 2025)",
        "Starting total board power of 160 W on the 16GB model (AMD)",
        "16 GB GDDR6 option, plus an 8 GB model at a $299 SEP (AMD)",
      ],
      cons: [
        "32 compute units against 64 on the RX 9070 XT (AMD)",
        "128-bit memory interface and 32 MB Infinity Cache (AMD)",
      ],
      bestFor: "1440p when the RX 9070 XT costs about twice as much",
    },
    {
      id: B,
      slug: B,
      name: "RX 9070 XT",
      shortDesc: "RDNA 4 card AMD launched at a $599 SEP, with 64 compute units, a 256-bit bus and 304 W.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "64 compute units and a 256-bit memory interface (AMD)",
        "16 GB GDDR6 and 64 MB Infinity Cache (AMD)",
        "119 fps average at 1440p across 18 games (TechSpot, March 5, 2025)",
      ],
      cons: [
        "A weak buy when the street price is about double the 16GB RX 9060 XT",
        "304 W total board power (AMD)",
      ],
      bestFor: "Higher-tier 1440p when the street price is close to the $599 SEP",
    },
  ],
  keyDifferences: [
    {
      label: "Suggested price (SEP)",
      entityAValue: "$349 (16GB). $299 (8GB)",
      entityBValue: "$599",
      winner: "tie",
    },
    {
      label: "Compute units",
      entityAValue: "32",
      entityBValue: "64",
      winner: "tie",
    },
    {
      label: "Memory",
      entityAValue: "16 GB GDDR6, 128-bit, 32 MB Infinity Cache",
      entityBValue: "16 GB GDDR6, 256-bit, 64 MB Infinity Cache",
      winner: "tie",
    },
    {
      label: "Clocks",
      entityAValue: "Game 2.53 GHz, boost up to 3.13 GHz",
      entityBValue: "Game 2.4 GHz, boost up to 3.0 GHz",
      winner: "tie",
    },
    {
      label: "Total board power",
      entityAValue: "Starting at 160 W (16GB)",
      entityBValue: "304 W",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("sep", "Suggested price (SEP)", SPEC, A, B, "16GB: $349. 8GB: $299 (AMD). Street prices change", "$599 (AMD). Street prices change"),
    textAttr("arch", "Architecture", SPEC, A, B, "RDNA 4", "RDNA 4"),
    textAttr("cu", "Compute units", SPEC, A, B, "32", "64"),
    textAttr("clocks", "Clocks", SPEC, A, B, "Game 2.53 GHz. Boost up to 3.13 GHz", "Game 2.4 GHz. Boost up to 3.0 GHz"),
    textAttr("memory", "Memory", SPEC, A, B, "16 GB GDDR6 (8 GB model also sold). 128-bit. 32 MB Infinity Cache", "16 GB GDDR6. 256-bit. 64 MB Infinity Cache"),
    textAttr("power", "Total board power", SPEC, A, B, "Starting at 160 W (16GB). Starting at 150 W (8GB)", "304 W"),
    textAttr("role", "AMD positioning", SPEC, A, B, "1440p gaming (AMD, May 20, 2025)", "Enthusiast-class, high-resolution gaming (AMD, February 28, 2025)"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "rx-9060-xt-vs-rx-9070", title: "RX 9060 XT vs RX 9070", category: "technology" },
    { slug: "rx-9070-vs-rx-9070-xt", title: "RX 9070 vs RX 9070 XT", category: "technology" },
    { slug: "rtx-5060-vs-rx-9060-xt", title: "RTX 5060 vs RX 9060 XT", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "16GB RX 9060 XT when the RX 9070 XT costs about twice as much. RX 9070 XT when the street price is close to AMD's $599 SEP.",
    keyFact:
      "AMD lists 32 compute units and a 128-bit bus on the RX 9060 XT, and 64 compute units and a 256-bit bus on the RX 9070 XT. Both RDNA 4 cards offer a 16 GB model.",
  },
  citationStats: {
    sourceCount: 3,
    dataPointCount: 22,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "AMD Newsroom: Radeon RX 9060 XT (May 20, 2025)", url: AMD_9060 },
      { name: "AMD investor release: Radeon RX 9070 XT (February 28, 2025)", url: AMD_9070 },
      { name: "TechSpot: AMD Radeon RX 9070 XT review (March 5, 2025)", url: TECHSPOT },
    ],
  },
  resources: [
    {
      type: "external",
      label: "AMD Newsroom: Radeon RX 9060 XT (May 20, 2025)",
      url: AMD_9060,
      description:
        "16GB: 32 compute units, 16 GB, game clock 2.53 GHz, boost up to 3.13 GHz, 128-bit, 32 MB Infinity Cache, total board power starting at 160 W, $349 SEP. 8GB: $299 SEP, total board power starting at 150 W.",
    },
    {
      type: "external",
      label: "AMD investor release: Radeon RX 9070 XT (February 28, 2025)",
      url: AMD_9070,
      description:
        "RX 9070 XT: 64 compute units, 16 GB GDDR6, game clock 2.4 GHz, boost up to 3.0 GHz, 256-bit, 64 MB Infinity Cache, 304 W, $599 SEP. RX 9070: 56 compute units, 220 W, $549 SEP.",
    },
    {
      type: "external",
      label: "TechSpot: AMD Radeon RX 9070 XT review (March 5, 2025)",
      url: TECHSPOT,
      description:
        "1440p framing only: the RX 9070 XT averaged 119 fps across 18 games, 6% slower than the GeForce RTX 5070 Ti in that test. The review does not measure the RX 9060 XT.",
    },
  ],
  metaTitle: "RX 9060 XT vs RX 9070 XT 1440p GPU",
});

BUILT.metadata.metaDescription =
  "RX 9060 XT 16GB ($349 SEP) vs RX 9070 XT ($599 SEP) for 1440p: compute units, memory bus, power, and when the price gap is too wide.";

export const RX_9060_XT_VS_RX_9070_XT: EditorialComparison = BUILT;
