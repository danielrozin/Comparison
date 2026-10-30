import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-348 — RX 9070 vs RX 9070 XT for 1440p gaming.
 * Read on 30 October 2026 from AMD's RX 9070 and RX 9070 XT product specs
 * and AMD's 28 February 2025 RDNA 4 launch press release (USD SEP $549 /
 * $599, availability from March 6, 2025). Official AMD sources only.
 * Dropped from the brief: AMD's percentage claims against the RX 7900 GRE,
 * the thread's "15%" figure, Digital Foundry benchmarks (house rule: no fps
 * or percentage claims), the press-release clock table (product-page
 * figures used instead) and all street prices. No winner.
 */

const A = "rx-9070";
const B = "rx-9070-xt";

const AMD_9070_SPEC =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070.html";
const AMD_9070XT_SPEC =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070xt.html";
const AMD_PR =
  "https://www.amd.com/en/newsroom/press-releases/2025-2-28-amd-unveils-next-generation-amd-rdna-4-architectu.html";
const AMD_BUY = "https://www.amd.com/en/where-to-buy/graphics/radeon.html";

const SOURCE_DATE = "2026-10-30";
const PUBLISHED = "2026-10-30T00:00:00Z";

const PRICE_9070 = "$549 launch suggested price (SEP), per AMD, February 2025";
const PRICE_9070XT = "$599 launch suggested price (SEP), per AMD, February 2025";

const SHORT_ANSWER =
  "For 1440p gaming the Radeon RX 9070 is usually the better value when the RX 9070 XT costs much more: AMD lists the same 16 GB of GDDR6 on a 256-bit interface with 64 MB of Infinity Cache on both, and the XT adds 64 compute units against 56, higher clocks and 304 W typical board power against 220 W. The RX 9070 XT is worth it when the price gap is close to AMD's launch gap of $50, when you want extra headroom in demanding games, or when you may move to a 4K monitor later. Neither card is right for everyone; today's price gap decides it.";

const FAQS = [
  {
    question: "Is the RX 9070 XT worth it over the RX 9070 at 1440p?",
    answer:
      "Only if the price gap is small or you want extra headroom for demanding games or a future 4K monitor. AMD launched the two cards $50 apart. If the gap you see today is much larger, the RX 9070 is usually the better value for 1440p.",
  },
  {
    question: "Do the RX 9070 and RX 9070 XT have the same VRAM?",
    answer:
      "Yes. AMD lists 16 GB of GDDR6 on a 256-bit interface, 64 MB of Infinity Cache and up to 640 GB/s of memory bandwidth for both cards.",
  },
  {
    question: "How much more power does the RX 9070 XT use than the RX 9070?",
    answer:
      "AMD rates the RX 9070 XT at 304 W typical board power and the RX 9070 at 220 W. Factory-overclocked partner cards can draw more, so check the exact model.",
  },
  {
    question: "What power supply do I need for the RX 9070 or RX 9070 XT?",
    answer:
      "AMD's minimum PSU recommendation is 750 W for the RX 9070 XT and 650 W for the RX 9070. Partner cards can list different figures, so check the card maker's page too.",
  },
  {
    question: "What were the launch prices of the RX 9070 and RX 9070 XT?",
    answer:
      "AMD's February 28, 2025 release gives the RX 9070 XT a $599 USD suggested price (SEP) and the RX 9070 $549 USD SEP, with board-partner cards from March 6, 2025. These are launch prices, not today's store prices.",
  },
  {
    question: "Should I spend the difference on a better monitor instead?",
    answer:
      "It can make sense if you are buying a 1440p high-refresh monitor anyway and the XT costs much more where you live. Compare the extra cost of the XT with the monitor upgrade you could buy, and decide which you would notice more in the games you play.",
  },
];

const VERDICT = `Best value for most 1440p builds when the gap is large: RX 9070. AMD lists 56 compute units, 16 GB of GDDR6, 220 W typical board power and a 650W minimum PSU.

Best when the gap is small or you want headroom: RX 9070 XT. AMD lists 64 compute units, up to 2970 MHz boost, 304 W typical board power and a 750W minimum PSU.

Neither is right for everyone. Street prices change daily, so compare current listings for the exact models.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Both cards have 16 GB of GDDR6 on a 256-bit interface with 64 MB of Infinity Cache, per AMD.
- The RX 9070 XT has 64 compute units and 4096 stream processors; the RX 9070 has 56 and 3584, per AMD.
- AMD rates the RX 9070 XT at 304 W typical board power and the RX 9070 at 220 W.
- AMD's minimum PSU recommendation is 750W for the RX 9070 XT and 650W for the RX 9070.
- Launch prices were ${PRICE_9070XT}, and ${PRICE_9070}.
- At 1440p, the current price gap between the exact models you can buy decides which is better value.

Specs side by side

The two cards share the same memory system; the XT has more compute units, higher clocks and a higher power rating.

- Compute units: 56 (RX 9070) vs 64 (RX 9070 XT).
- Stream processors: 3584 vs 4096.
- Game frequency: 2070 MHz vs 2400 MHz.
- Boost frequency: up to 2520 MHz vs up to 2970 MHz.
- Memory: 16 GB GDDR6, 256-bit, up to 640 GB/s, 64 MB Infinity Cache on both.
- Typical board power: 220 W vs 304 W.
- Minimum PSU recommendation: 650W vs 750W.
- Bus: PCIe 5.0 x16 on both.

Partner cards often ship with higher clocks and higher power limits than AMD's reference figures, so check the exact model.

When the RX 9070 is the better buy

The RX 9070 is the better buy when the XT costs a lot more and you are gaming at 1440p.

- The price gap where you live is much larger than AMD's $50 launch gap.
- You target 1440p and are happy to lower a setting or two in the most demanding games.
- Your power supply is between 650W and 750W.
- You want a cooler, quieter build from the lower 220 W rating.

When the RX 9070 XT is worth it

The RX 9070 XT is worth it when the gap is small or you want extra headroom.

- The price gap is close to AMD's launch gap.
- You want high refresh rates at 1440p in demanding games.
- You expect to move to a 4K monitor during the card's life.
- You plan to keep the card for several years.

Power, PSU and cooling

The XT's extra performance comes with an 84 W higher board power rating.

1. AMD rates the RX 9070 at 220 W and the RX 9070 XT at 304 W typical board power.
2. AMD recommends at least a 650W power supply for the RX 9070 and 750W for the RX 9070 XT.
3. More power means more heat for the cooler and case fans to move, so check reviews of the exact partner model for noise.
4. Check card length and the number of power connectors on the partner model against your case and power supply.

The price-gap rule

You can decide from today's two prices with a cost-per-frame check.

1. Pick one independent review that tests both cards at 1440p in games you play and states its test system and settings.
2. Take each card's average frame rate at 1440p from that review.
3. Divide each card's current price by its average frame rate.
4. Buy the card with the lower cost per frame, unless you need the XT's headroom for a 4K monitor or high-refresh play.

Alternatives

If you are also considering NVIDIA, RTX 5070 vs RX 9070 XT vs RTX 5070 Ti compares the cards around this price, and RX 9060 XT vs RX 9070 covers the cheaper step down.

Community opinion

In r/buildapc discussions in October 2026, a common view was that the plain RX 9070 is the better 1440p buy when it costs well below the XT, and that buyers should compare cost per frame in the games they play. Some suggested putting the saved money toward a better monitor, while others preferred the XT for a future 4K monitor or longer use. This is community opinion, not measured results.`;

const SPEC = "Specs";

const BUILT = buildEditorialComparison({
  slug: "rx-9070-vs-rx-9070-xt",
  title: "RX 9070 vs RX 9070 XT: Is the XT GPU Worth It for 1440p?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "AMD Radeon RX 9070",
      shortDesc: "AMD RDNA 4 graphics card with 56 compute units and 16 GB of GDDR6 on a 256-bit interface, per AMD.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "16 GB of GDDR6 on a 256-bit interface (AMD)",
        "220 W typical board power (AMD)",
        "650W minimum PSU recommendation (AMD)",
      ],
      cons: ["56 compute units against 64 on the XT (AMD)", "Lower boost clock: up to 2520 MHz (AMD)"],
      bestFor: "1440p gamers when the XT costs much more",
    },
    {
      id: B,
      slug: B,
      name: "AMD Radeon RX 9070 XT",
      shortDesc: "AMD RDNA 4 graphics card with 64 compute units and 16 GB of GDDR6 on a 256-bit interface, per AMD.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: ["64 compute units (AMD)", "Up to 2970 MHz boost clock (AMD)", "Same 16 GB memory system as the RX 9070 (AMD)"],
      cons: ["304 W typical board power (AMD)", "750W minimum PSU recommendation (AMD)"],
      bestFor: "High-refresh 1440p or a future 4K monitor when the price gap is small",
    },
  ],
  keyDifferences: [
    { label: "Compute units", entityAValue: "56", entityBValue: "64", winner: "b" },
    { label: "Memory", entityAValue: "16 GB GDDR6, 256-bit", entityBValue: "16 GB GDDR6, 256-bit", winner: "tie" },
    { label: "Typical board power", entityAValue: "220 W", entityBValue: "304 W", winner: "a" },
    { label: "Minimum PSU", entityAValue: "650W", entityBValue: "750W", winner: "a" },
  ],
  attributes: [
    textAttr("cu", "Compute units", SPEC, A, B, "56", "64", "b"),
    textAttr("sp", "Stream processors", SPEC, A, B, "3584", "4096", "b"),
    textAttr("game", "Game frequency", SPEC, A, B, "2070 MHz", "2400 MHz", "b"),
    textAttr("boost", "Boost frequency", SPEC, A, B, "Up to 2520 MHz", "Up to 2970 MHz", "b"),
    textAttr("memory", "Memory", SPEC, A, B, "16 GB GDDR6, 256-bit", "16 GB GDDR6, 256-bit"),
    textAttr("bandwidth", "Memory bandwidth", SPEC, A, B, "Up to 640 GB/s", "Up to 640 GB/s"),
    textAttr("cache", "Infinity Cache", SPEC, A, B, "64 MB", "64 MB"),
    textAttr("power", "Typical board power", SPEC, A, B, "220 W", "304 W", "a"),
    textAttr("psu", "Minimum PSU recommendation", SPEC, A, B, "650W", "750W", "a"),
    textAttr("bus", "Bus", SPEC, A, B, "PCIe 5.0 x16", "PCIe 5.0 x16"),
    textAttr("launch", "Launch price", SPEC, A, B, PRICE_9070, PRICE_9070XT),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "rx-9060-xt-vs-rx-9070", title: "RX 9060 XT vs RX 9070", category: "technology" },
    { slug: "rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti", title: "RTX 5070 vs RX 9070 XT vs RTX 5070 Ti", category: "technology" },
    { slug: "rx-9070-xt-vs-rtx-5080", title: "RX 9070 XT vs RTX 5080", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "RX 9070 for value at 1440p when the gap is large. RX 9070 XT for 64 compute units and headroom when the gap is small.",
    keyFact: "AMD lists 16 GB of GDDR6 on a 256-bit interface for both cards; the XT has 64 compute units against 56.",
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 24,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "AMD Radeon RX 9070 specifications", url: AMD_9070_SPEC },
      { name: "AMD Radeon RX 9070 XT specifications", url: AMD_9070XT_SPEC },
      { name: "AMD RDNA 4 launch press release (February 2025)", url: AMD_PR },
      { name: "AMD: where to buy Radeon graphics cards", url: AMD_BUY },
    ],
  },
  resources: [
    { type: "external", label: "AMD Radeon RX 9070 specifications", url: AMD_9070_SPEC, description: "56 CUs, 3584 stream processors, 2070 MHz game / up to 2520 MHz boost, 16 GB GDDR6, 256-bit, up to 640 GB/s, 64 MB Infinity Cache, 220 W, 650W min PSU, PCIe 5.0 x16." },
    { type: "external", label: "AMD Radeon RX 9070 XT specifications", url: AMD_9070XT_SPEC, description: "64 CUs, 4096 stream processors, 2400 MHz game / up to 2970 MHz boost, 16 GB GDDR6, 256-bit, up to 640 GB/s, 64 MB Infinity Cache, 304 W, 750W min PSU, PCIe 5.0 x16." },
    { type: "external", label: "AMD RDNA 4 launch press release (February 2025)", url: AMD_PR, description: "February 28, 2025: RX 9070 XT $599 USD SEP, RX 9070 $549 USD SEP, board-partner cards from March 6, 2025." },
    { type: "external", label: "See vendor page for current price: RX 9070 and RX 9070 XT (AMD)", url: AMD_BUY, description: "AMD where-to-buy listings for Radeon graphics cards." },
  ],
  metaTitle: "RX 9070 vs RX 9070 XT for 1440p",
});

BUILT.metadata.metaDescription =
  "RX 9070 vs RX 9070 XT for 1440p: AMD specs, power and PSU needs, launch SEP prices, and a simple price-gap rule for deciding if the XT is worth it.";

export const RX_9070_VS_RX_9070_XT: EditorialComparison = BUILT;
