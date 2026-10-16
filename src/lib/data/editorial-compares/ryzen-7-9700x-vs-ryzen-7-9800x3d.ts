import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-243 — Ryzen 7 9700X vs Ryzen 7 9800X3D.
 * Figures read on 16 October 2026 from AMD's Ryzen 7 9700X and Ryzen 7
 * 9800X3D product spec pages and AMD's 31 October 2024 9800X3D press release
 * (total cache). No fps numbers, no percent gaps, no synthetic scores, no
 * street or launch prices, no winner. NanoReview / TechSpot figures and the
 * thread's euro prices from the brief were dropped (house rule: official
 * sources only, no benchmarks, no street prices). The 9700X launch price has
 * no AMD-hosted source, so prices were left out for both chips.
 */

const A = "ryzen-7-9700x";
const B = "ryzen-7-9800x3d";

const AMD_9700X_SPEC =
  "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9700x.html";
const AMD_9800X3D_SPEC =
  "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9800x3d.html";
const AMD_9800X3D_PR =
  "https://www.amd.com/en/newsroom/press-releases/2024-10-31-the-gaming-legend-continues--amd-introduces-next-.html";

const SOURCE_DATE = "2026-10-16";
const PUBLISHED = "2026-10-16T00:00:00Z";

const SHORT_ANSWER =
  "Choose the Ryzen 7 9800X3D for a gaming-first PC that often runs into CPU limits: AMD gives it 96 MB of L3 cache with 2nd gen 3D V-Cache, against 32 MB on the Ryzen 7 9700X. Choose the Ryzen 7 9700X if your games are mostly limited by the graphics card, for example at native 4K, and you would rather spend the difference on the GPU: it has a 65W default TDP against 120W, and AMD recommends a premium air cooler instead of a liquid cooler. Both are 8-core, 16-thread Zen 5 chips on AM5, so either drops into the same motherboards. Neither is right for everyone, and prices change, so compare current prices.";

const FAQS = [
  {
    question: "Is the Ryzen 7 9800X3D better than the 9700X for gaming?",
    answer:
      "For games that are limited by the CPU, the 9800X3D is the gaming pick. AMD gives it 96 MB of L3 cache with 2nd gen 3D V-Cache, three times the 32 MB on the 9700X, and extra cache helps most in games that wait on the CPU and memory. When the graphics card is the limit, for example at native 4K, the gap between the two gets smaller.",
  },
  {
    question: "Should I buy the 9700X or 9800X3D with a Radeon RX 9070 XT at 1440p or 4K?",
    answer:
      "If your games are mostly limited by the graphics card at native 4K, the 9700X is often enough and leaves budget for other parts. Lean to the 9800X3D if you play CPU-heavy or competitive games, chase high frame rates at 1440p, or rely on upscaling such as FSR, which renders below the output resolution and puts more load on the CPU.",
  },
  {
    question: "What is the TDP difference between the 9700X and 9800X3D?",
    answer:
      "AMD lists a 65W default TDP for the Ryzen 7 9700X and 120W for the Ryzen 7 9800X3D. AMD recommends a premium air cooler for the 9700X and a liquid cooler for the 9800X3D for optimal performance. Neither comes with a cooler in the box.",
  },
  {
    question: "Is the 9800X3D worth the extra money over the 9700X?",
    answer:
      "It depends on the price gap and on where your games are limited. If the gap is large and you play at high resolution with a graphics card that sets the limit, the 9700X plus a better GPU is often the better use of money. If the gap is modest and you care about CPU-bound frame rates, the 9800X3D is the gaming pick.",
  },
  {
    question: "Do the 9700X and 9800X3D use the same socket?",
    answer:
      "Yes. AMD lists both on socket AM5 with the same supporting chipsets: A620, B650, B650E, B840, B850, X670, X670E, X870 and X870E. Both support DDR5 and PCIe 5.0, so you can swap one for the other without changing platform.",
  },
  {
    question: "Which is better for productivity, the 9700X or 9800X3D?",
    answer:
      "Both have 8 Zen 5 cores and 16 threads. The 9700X has the higher maximum boost clock, up to 5.5 GHz against up to 5.2 GHz, while the 9800X3D has the higher base clock, 4.7 GHz against 3.8 GHz, and much more L3 cache. For work that does not benefit from the extra cache, the two are close in core count and the 9700X runs at a lower TDP.",
  },
];

const VERDICT = `Best for CPU-limited gaming: Ryzen 7 9800X3D. AMD gives it 96 MB of L3 cache with 2nd gen 3D V-Cache and a 120W default TDP.

Best for a GPU-limited build and lower power: Ryzen 7 9700X. AMD lists 32 MB of L3 cache, a 65W default TDP and a boost clock of up to 5.5 GHz.

Neither is right for everyone. Prices change, so compare current prices.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Both chips have 8 Zen 5 cores and 16 threads on socket AM5.
- L3 cache: 96 MB on the Ryzen 7 9800X3D, 32 MB on the Ryzen 7 9700X. AMD gives the 9800X3D 104 MB of total cache.
- Default TDP: 120W on the 9800X3D, 65W on the 9700X.
- Clocks: the 9700X boosts up to 5.5 GHz from a 3.8 GHz base; the 9800X3D boosts up to 5.2 GHz from a 4.7 GHz base.
- AMD recommends a liquid cooler for the 9800X3D and a premium air cooler for the 9700X. Neither includes a cooler.

Cache is the main difference

The Ryzen 7 9800X3D stacks extra cache on the CPU die with AMD's 2nd gen 3D V-Cache, for 96 MB of L3 cache against 32 MB on the Ryzen 7 9700X. Both have 8 MB of L2 cache. Games often reuse large amounts of data, and a bigger cache means the CPU waits on system memory less often. That matters most in games where the CPU, not the graphics card, sets the frame rate.

When the graphics card is the limit

At native 4K with a mid-range or high-end graphics card, many games are limited by the GPU. In that case a CPU upgrade changes less, and the money can do more in the graphics card, case, cooling or storage. Upscaling such as FSR renders the game below the output resolution, which lowers the GPU load and can make the CPU matter again, even on a 4K TV. Competitive games aimed at very high frame rates also lean harder on the CPU.

Clocks, power and cooling

The 9700X has the higher boost clock, up to 5.5 GHz against up to 5.2 GHz. The 9800X3D has the higher base clock, 4.7 GHz against 3.8 GHz. AMD rates the 9700X at a 65W default TDP and the 9800X3D at 120W, and recommends a premium air cooler for the 9700X and a liquid cooler for the 9800X3D for optimal performance. For a small living-room PC, the lower TDP of the 9700X makes cooling and noise easier to manage. Both are unlocked and support Precision Boost Overdrive.

Same platform

Both use socket AM5 with the same chipset list, dual-channel DDR5 up to DDR5-5600 with two modules, PCIe 5.0 with 24 usable lanes, and basic integrated Radeon graphics with 2 graphics cores. You can start with one and move to the other later on the same motherboard, usually after a BIOS update.

Who should buy which

Choose the Ryzen 7 9800X3D for a gaming-first build where CPU limits show up: high-refresh 1080p or 1440p, CPU-heavy simulation or strategy games, or frequent upscaling. Choose the Ryzen 7 9700X for a build where the graphics card sets the limit, where a lower TDP and simpler cooling matter, or where the price difference is better spent elsewhere. RX 9070 XT vs RTX 5080 and Nvidia vs AMD cover the graphics side of the same build.`;

const SPEC = "Specs";

const BUILT = buildEditorialComparison({
  slug: "ryzen-7-9700x-vs-ryzen-7-9800x3d",
  title: "Ryzen 7 9700X vs 9800X3D: Which Gaming CPU to Buy",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Ryzen 7 9700X",
      shortDesc: "8-core, 16-thread Zen 5 desktop CPU on AM5 with 32 MB of L3 cache and a 65W default TDP.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "65W default TDP (AMD)",
        "Boost clock up to 5.5 GHz (AMD)",
        "Premium air cooler recommended, not liquid (AMD)",
      ],
      cons: [
        "32 MB of L3 cache against 96 MB on the 9800X3D",
        "3.8 GHz base clock against 4.7 GHz",
      ],
      bestFor: "GPU-limited gaming builds and lower power",
    },
    {
      id: B,
      slug: B,
      name: "Ryzen 7 9800X3D",
      shortDesc: "8-core, 16-thread Zen 5 desktop CPU on AM5 with 96 MB of L3 cache from 2nd gen 3D V-Cache.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "96 MB of L3 cache, 104 MB total cache (AMD)",
        "2nd gen 3D V-Cache (AMD)",
        "4.7 GHz base clock (AMD)",
      ],
      cons: [
        "120W default TDP against 65W",
        "Liquid cooler recommended for optimal performance (AMD)",
      ],
      bestFor: "Gaming-first builds that hit CPU limits",
    },
  ],
  keyDifferences: [
    {
      label: "L3 cache",
      entityAValue: "32 MB",
      entityBValue: "96 MB (2nd gen 3D V-Cache)",
      winner: "b",
    },
    {
      label: "Default TDP",
      entityAValue: "65W",
      entityBValue: "120W",
      winner: "a",
    },
    {
      label: "Clocks",
      entityAValue: "Up to 5.5 GHz boost, 3.8 GHz base",
      entityBValue: "Up to 5.2 GHz boost, 4.7 GHz base",
    },
    {
      label: "Recommended cooler",
      entityAValue: "Premium air cooler",
      entityBValue: "Liquid cooler",
      winner: "a",
    },
  ],
  attributes: [
    textAttr("cores", "Cores and threads", SPEC, A, B, "8 cores, 16 threads, Zen 5", "8 cores, 16 threads, Zen 5"),
    textAttr("cache", "Cache", SPEC, A, B, "32 MB L3, 8 MB L2", "96 MB L3 (2nd gen 3D V-Cache), 8 MB L2", "b"),
    textAttr("clocks", "Clocks", SPEC, A, B, "Boost up to 5.5 GHz, base 3.8 GHz", "Boost up to 5.2 GHz, base 4.7 GHz"),
    textAttr("tdp", "Default TDP", SPEC, A, B, "65W", "120W", "a"),
    textAttr("cooler", "Cooling", SPEC, A, B, "No cooler included. Premium air cooler recommended", "No cooler included. Liquid cooler recommended", "a"),
    textAttr("platform", "Platform", SPEC, A, B, "AM5. DDR5 up to DDR5-5600 (2 modules). PCIe 5.0, 24 usable lanes", "AM5. DDR5 up to DDR5-5600 (2 modules). PCIe 5.0, 24 usable lanes"),
    textAttr("launch", "Launch date", SPEC, A, B, "August 8, 2024", "November 7, 2024"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "rx-9070-xt-vs-rtx-5080", title: "RX 9070 XT vs RTX 5080", category: "technology" },
    { slug: "nvidia-vs-amd", title: "Nvidia vs AMD", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Ryzen 7 9800X3D for 96 MB of L3 cache in CPU-limited gaming. Ryzen 7 9700X for a 65W default TDP in builds where the graphics card sets the limit.",
    keyFact:
      "Both have 8 Zen 5 cores and 16 threads on AM5. AMD lists 32 MB of L3 cache on the 9700X and 96 MB on the 9800X3D.",
  },
  citationStats: {
    sourceCount: 3,
    dataPointCount: 18,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "AMD Ryzen 7 9700X", url: AMD_9700X_SPEC },
      { name: "AMD Ryzen 7 9800X3D", url: AMD_9800X3D_SPEC },
      { name: "AMD Ryzen 7 9800X3D press release", url: AMD_9800X3D_PR },
    ],
  },
  resources: [
    {
      type: "external",
      label: "AMD Ryzen 7 9700X",
      url: AMD_9700X_SPEC,
      description: "8 cores, 16 threads, boost up to 5.5 GHz, base 3.8 GHz, 32 MB L3, 8 MB L2, 65W default TDP, AM5, premium air cooler recommended, launched August 8, 2024.",
    },
    {
      type: "external",
      label: "AMD Ryzen 7 9800X3D",
      url: AMD_9800X3D_SPEC,
      description: "8 cores, 16 threads, boost up to 5.2 GHz, base 4.7 GHz, 96 MB L3, 8 MB L2, 120W default TDP, AM5, liquid cooler recommended, launched November 7, 2024.",
    },
    {
      type: "external",
      label: "AMD Ryzen 7 9800X3D press release",
      url: AMD_9800X3D_PR,
      description: "October 31, 2024. 2nd gen 3D V-Cache, 104 MB total cache, 120W TDP.",
    },
  ],
  metaTitle: "Ryzen 7 9700X vs 9800X3D | A Versus B",
});

BUILT.metadata.metaDescription =
  "Ryzen 7 9700X vs 9800X3D for gaming: 32 MB vs 96 MB L3 cache, 65W vs 120W TDP, clocks and cooling on the same AM5 platform, and which build each one suits.";

export const RYZEN_7_9700X_VS_RYZEN_7_9800X3D: EditorialComparison = BUILT;
