import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-218 — RX 9060 XT 16GB vs RX 9070.
 * Figures read on 13 October 2026 from AMD's RX 9060 XT and RX 9070 product
 * specs, AMD's 20 May 2025 Computex press release (RX 9060 XT prices) and
 * AMD's 28 February 2025 RDNA 4 launch release (RX 9070 / 9070 XT prices).
 * Launch prices only. No fps numbers, no percent gaps, no street prices,
 * no board-partner ranking, no winner. TechSpot figures from the brief dropped
 * (house rule: official sources only, no benchmarks).
 */

const A = "rx-9060-xt";
const B = "rx-9070";

const AMD_9060_PR =
  "https://www.amd.com/en/newsroom/press-releases/2025-5-20-amd-introduces-new-radeon-graphics-cards-and-ryzen.html";
const AMD_9070_PR =
  "https://www.amd.com/en/newsroom/press-releases/2025-2-28-amd-unveils-next-generation-amd-rdna-4-architectu.html";
const AMD_9060_SPEC =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9060xt.html";
const AMD_9070_SPEC =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070.html";

const SOURCE_DATE = "2026-10-13";
const PUBLISHED = "2026-10-13T00:00:00Z";

const SHORT_ANSWER =
  "Choose the Radeon RX 9070 if you can pay more for a bigger GPU: AMD lists 56 compute units, a 256-bit memory interface, 64 MB of Infinity Cache and up to 640 GB/s of bandwidth, against 32 compute units, 128-bit, 32 MB and up to 320 GB/s on the RX 9060 XT. Choose the RX 9060 XT 16GB if price matters most: AMD launched it at $349, against $549 for the RX 9070, and it needs 160 W instead of 220 W. Both have 16 GB of GDDR6. Neither is right for everyone, and street prices change, so compare current prices.";

const FAQS = [
  {
    question: "Is the RX 9070 worth it over the RX 9060 XT?",
    answer:
      "It is worth it if you want the larger GPU and can pay the difference. AMD lists 56 compute units and a 256-bit memory interface on the RX 9070, against 32 compute units and 128-bit on the RX 9060 XT. Launch prices were $549 and $349 (16GB). Street prices change, so the gap you pay today may be smaller or larger.",
  },
  {
    question: "What were the launch prices of the RX 9060 XT and RX 9070?",
    answer:
      "AMD's May 20, 2025 press release gives the RX 9060 XT 16GB a $349 suggested price and the 8GB model $299. AMD's February 28, 2025 release gives the RX 9070 $549 and the RX 9070 XT $599. These are launch prices, not today's store prices.",
  },
  {
    question: "Do the RX 9060 XT and RX 9070 have the same VRAM?",
    answer:
      "The RX 9060 XT 16GB and the RX 9070 both have 16 GB of GDDR6 at up to 20 Gbps. The RX 9070 uses a 256-bit interface with 64 MB of Infinity Cache and up to 640 GB/s of bandwidth. The RX 9060 XT uses 128-bit with 32 MB and up to 320 GB/s.",
  },
  {
    question: "Should I buy the 8GB or 16GB RX 9060 XT?",
    answer:
      "For a comparison with the 16 GB RX 9070, the 16GB RX 9060 XT is the like-for-like model. AMD launched the 8GB version at $299 and the 16GB version at $349.",
  },
  {
    question: "What power supply do I need for the RX 9060 XT or RX 9070?",
    answer:
      "AMD rates the RX 9060 XT at 160 W typical board power with a 450 W minimum power supply and one 8-pin connector. It rates the RX 9070 at 220 W with a 650 W minimum power supply and two 8-pin connectors. Partner cards can differ.",
  },
  {
    question: "Should I consider the RX 9070 XT instead?",
    answer:
      "AMD launched the RX 9070 XT at $599, $50 more than the RX 9070, with 64 compute units and 304 W typical board power against 56 compute units and 220 W. If the live price gap is small and your power supply can handle it, it is worth comparing.",
  },
];

const VERDICT = `Best if price matters most: RX 9060 XT 16GB. AMD launched it at $349 with 16 GB of GDDR6, 32 compute units, and 160 W typical board power.

Best if you want the bigger GPU: RX 9070. AMD launched it at $549 with 16 GB of GDDR6 on a 256-bit interface, 56 compute units, and 220 W typical board power.

Neither is right for everyone. Street prices change, so compare current prices.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Launch MSRP: $349 for the RX 9060 XT 16GB, $549 for the RX 9070.
- Both have 16 GB of GDDR6. The RX 9070 has a 256-bit interface; the RX 9060 XT has 128-bit.
- Compute units: 56 on the RX 9070, 32 on the RX 9060 XT.
- Board power: 220 W and a 650 W minimum supply for the RX 9070, 160 W and 450 W for the RX 9060 XT.

GPU size and clocks

AMD lists 56 compute units, 56 ray accelerators, 112 AI accelerators and 3584 stream processors on the RX 9070, with a boost frequency of up to 2520 MHz and a game frequency of 2070 MHz. The RX 9060 XT has 32 compute units, 32 ray accelerators, 64 AI accelerators and 2048 stream processors, with a boost of up to 3130 MHz and a game frequency of 2530 MHz. The RX 9060 XT clocks higher, but the RX 9070 has 75% more compute units.

Memory

Both cards use 16 GB of GDDR6 at up to 20 Gbps. The RX 9070 pairs it with a 256-bit interface, 64 MB of Infinity Cache and up to 640 GB/s of bandwidth. The RX 9060 XT uses a 128-bit interface, 32 MB of Infinity Cache and up to 320 GB/s.

Power and connectors

AMD rates the RX 9070 at 220 W typical board power, recommends a 650 W minimum power supply and lists two 8-pin connectors. The RX 9060 XT is rated at 160 W with a 450 W minimum supply and one 8-pin connector. Check your power supply before choosing the RX 9070.

Outputs and features

Both list DisplayPort 2.1a, HDMI 2.1b, PCIe 5.0 x16, AV1 encode and decode, and AMD FSR "Redstone" among supported technologies.

Price gap

At launch the gap was $200 ($349 against $549). Store prices move, and a smaller gap makes the RX 9070 easier to justify. Board partner cards differ in cooler, size, noise and warranty, so compare those along with price.

Who should buy which

Choose the RX 9060 XT 16GB when the lower price and 160 W power draw matter most. Choose the RX 9070 when you want the larger GPU and wider memory bus and the price difference is acceptable. RX 9060 XT vs RTX 5060 Ti and RX 9070 XT vs RTX 5080 cover the NVIDIA alternatives.`;

const SPEC = "Specs";

const BUILT = buildEditorialComparison({
  slug: "rx-9060-xt-vs-rx-9070",
  title: "RX 9060 XT vs RX 9070: Which AMD GPU to Buy",
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
      shortDesc: "16 GB GDDR6 card AMD launched at a $349 suggested price, with 32 compute units.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "$349 launch MSRP for the 16GB model (AMD, May 20, 2025)",
        "160 W typical board power, 450 W minimum power supply, 1x 8-pin (AMD)",
        "16 GB GDDR6 at up to 20 Gbps (AMD)",
      ],
      cons: [
        "32 compute units against 56 on the RX 9070",
        "128-bit interface and up to 320 GB/s bandwidth",
      ],
      bestFor: "16 GB at the lower launch price and power draw",
    },
    {
      id: B,
      slug: B,
      name: "RX 9070",
      shortDesc: "16 GB GDDR6 card AMD launched at $549, with 56 compute units and a 256-bit bus.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "56 compute units, 3584 stream processors (AMD)",
        "256-bit interface, 64 MB Infinity Cache, up to 640 GB/s (AMD)",
        "16 GB GDDR6 at up to 20 Gbps (AMD)",
      ],
      cons: [
        "$549 launch MSRP, $200 more than the RX 9060 XT 16GB",
        "220 W typical board power, 650 W minimum power supply, 2x 8-pin (AMD)",
      ],
      bestFor: "The bigger GPU and wider memory bus at a higher launch price",
    },
  ],
  keyDifferences: [
    {
      label: "Launch MSRP",
      entityAValue: "$349 (16GB, AMD, May 20, 2025)",
      entityBValue: "$549 (AMD, February 28, 2025)",
      winner: "a",
    },
    {
      label: "Compute units",
      entityAValue: "32",
      entityBValue: "56",
      winner: "b",
    },
    {
      label: "Memory",
      entityAValue: "16 GB GDDR6, 128-bit, 32 MB Infinity Cache, up to 320 GB/s",
      entityBValue: "16 GB GDDR6, 256-bit, 64 MB Infinity Cache, up to 640 GB/s",
      winner: "b",
    },
    {
      label: "Board power",
      entityAValue: "160 W typical, 450 W minimum supply",
      entityBValue: "220 W typical, 650 W minimum supply",
      winner: "a",
    },
  ],
  attributes: [
    textAttr("price", "Launch MSRP", SPEC, A, B, "16GB: $349. 8GB: $299 (AMD). Street prices change", "$549 (AMD). Street prices change", "a"),
    textAttr("cu", "Compute units and shaders", SPEC, A, B, "32 compute units, 2048 stream processors", "56 compute units, 3584 stream processors", "b"),
    textAttr("clocks", "Clocks", SPEC, A, B, "Boost up to 3130 MHz, game frequency 2530 MHz", "Boost up to 2520 MHz, game frequency 2070 MHz"),
    textAttr("ray", "Ray tracing and AI", SPEC, A, B, "32 ray accelerators, 64 AI accelerators", "56 ray accelerators, 112 AI accelerators", "b"),
    textAttr("memory", "Memory", SPEC, A, B, "16 GB GDDR6 up to 20 Gbps, 128-bit, 32 MB Infinity Cache, up to 320 GB/s", "16 GB GDDR6 up to 20 Gbps, 256-bit, 64 MB Infinity Cache, up to 640 GB/s", "b"),
    textAttr("power", "Power", SPEC, A, B, "160 W typical board power. 450 W minimum power supply. 1x 8-pin", "220 W typical board power. 650 W minimum power supply. 2x 8-pin", "a"),
    textAttr("io", "Outputs and bus", SPEC, A, B, "DisplayPort 2.1a, HDMI 2.1b. PCIe 5.0 x16", "DisplayPort 2.1a, HDMI 2.1b. PCIe 5.0 x16"),
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
      "RX 9060 XT 16GB for the $349 launch MSRP and 160 W board power. RX 9070 for 56 compute units and a 256-bit bus at a $549 launch MSRP.",
    keyFact:
      "Both have 16 GB of GDDR6. AMD lists a 128-bit interface on the RX 9060 XT and 256-bit on the RX 9070.",
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 20,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "AMD Computex 2025 press release", url: AMD_9060_PR },
      { name: "AMD RDNA 4 launch press release", url: AMD_9070_PR },
      { name: "AMD Radeon RX 9060 XT", url: AMD_9060_SPEC },
      { name: "AMD Radeon RX 9070", url: AMD_9070_SPEC },
    ],
  },
  resources: [
    {
      type: "external",
      label: "AMD Computex 2025 press release",
      url: AMD_9060_PR,
      description: "May 20, 2025. RX 9060 XT 16GB at a $349 suggested price, 8GB at $299.",
    },
    {
      type: "external",
      label: "AMD RDNA 4 launch press release",
      url: AMD_9070_PR,
      description: "February 28, 2025. RX 9070: 56 compute units, 16 GB GDDR6, 256-bit, 64 MB Infinity Cache, 220 W, $549. RX 9070 XT: 64 compute units, 304 W, $599.",
    },
    {
      type: "external",
      label: "AMD Radeon RX 9060 XT",
      url: AMD_9060_SPEC,
      description: "32 compute units, 2048 stream processors, boost up to 3130 MHz, game 2530 MHz, 16 GB GDDR6, 128-bit, up to 320 GB/s, 160 W, 450 W minimum PSU, 1x 8-pin, PCIe 5.0 x16.",
    },
    {
      type: "external",
      label: "AMD Radeon RX 9070",
      url: AMD_9070_SPEC,
      description: "56 compute units, 3584 stream processors, boost up to 2520 MHz, game 2070 MHz, 16 GB GDDR6, 256-bit, up to 640 GB/s, 220 W, 650 W minimum PSU, 2x 8-pin, PCIe 5.0 x16.",
    },
  ],
  metaTitle: "RX 9060 XT vs RX 9070 | A Versus B",
});

BUILT.metadata.metaDescription =
  "RX 9060 XT 16GB ($349 launch MSRP) vs RX 9070 ($549): compute units, 128-bit vs 256-bit memory, power and PSU needs for a 16GB AMD graphics card.";

export const RX_9060_XT_VS_RX_9070: EditorialComparison = BUILT;
