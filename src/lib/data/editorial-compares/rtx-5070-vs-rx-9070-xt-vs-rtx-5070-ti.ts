import { buildEditorialComparison, textAttrN } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-225 — RTX 5070 vs RX 9070 XT vs RTX 5070 Ti, for a 1440p build.
 * Figures read on 18 October 2026 from NVIDIA's RTX 5070 family specs,
 * NVIDIA's January 2025 RTX 50 Series announcement (launch prices),
 * AMD's RX 9070 XT product specs, and AMD's February 28, 2025 RDNA 4
 * press release (launch price). No fps numbers, no percent-faster claims,
 * no benchmark aggregates, no street prices, no page-level winner.
 */

const R5070 = "rtx-5070";
const XT = "rx-9070-xt";
const TI = "rtx-5070-ti";

const NV_5070 = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/";
const NV_NEWS =
  "https://nvidianews.nvidia.com/news/nvidia-blackwell-geforce-rtx-50-series-opens-new-world-of-ai-computer-graphics";
const AMD_XT =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070xt.html";
const AMD_PR =
  "https://www.amd.com/en/newsroom/press-releases/2025-2-28-amd-unveils-next-generation-amd-rdna-4-architectu.html";

const AMD_FSR = "https://www.amd.com/en/products/graphics/technologies/fidelityfx/super-resolution.html";

const SOURCE_DATE = "2026-10-18";
const PUBLISHED = "2026-10-18T00:00:00Z";

const cell = (entityId: string, text: string, winner?: boolean) => ({ entityId, text, winner });

const SHORT_ANSWER =
  "Choose the Radeon RX 9070 XT for 16 GB of memory at the lowest launch price of the two 16 GB cards: AMD launched it at $599 with 16 GB of GDDR6, against $749 for the GeForce RTX 5070 Ti with 16 GB of GDDR7. Choose the RTX 5070 Ti if you want NVIDIA's DLSS 4 features and its two ninth-generation NVENC encoders for streaming, and the RTX 5070 at $549 only if 12 GB of GDDR7 is enough for your games. Neither is better for everyone; it depends on how much NVIDIA's features are worth over AMD's lower price.";

const FAQS = [
  {
    question: "Should I buy the RTX 5070, RX 9070 XT or RTX 5070 Ti for 1440p?",
    answer:
      "Start with memory and price. NVIDIA launched the RTX 5070 at $549 with 12 GB of GDDR7 and the RTX 5070 Ti at $749 with 16 GB of GDDR7. AMD launched the RX 9070 XT at $599 with 16 GB of GDDR6. The RX 9070 XT is the lower-priced 16 GB card. The RTX 5070 Ti adds DLSS 4 and two NVENC encoders for $150 more at launch prices. Street prices change, so compare current prices for the exact models.",
  },
  {
    question: "Is the RTX 5070 Ti worth it over the RX 9070 XT?",
    answer:
      "It is if NVIDIA's feature set matters to you and the price gap in your market is small. NVIDIA lists DLSS 4 with Super Resolution, DLAA, Ray Reconstruction, Frame Generation and Multi Frame Generation, plus two ninth-generation NVENC encoders, on the RTX 5070 Ti. Both cards have 16 GB of memory on a 256-bit interface. At launch prices, the RTX 5070 Ti cost $749 and the RX 9070 XT $599.",
  },
  {
    question: "How much VRAM do the RTX 5070, RX 9070 XT and RTX 5070 Ti have?",
    answer:
      "NVIDIA lists 12 GB of GDDR7 on a 192-bit interface for the RTX 5070 and 16 GB of GDDR7 on a 256-bit interface for the RTX 5070 Ti. AMD lists 16 GB of GDDR6 on a 256-bit interface, with 64 MB of Infinity Cache, for the RX 9070 XT.",
  },
  {
    question: "Is a 750 W power supply enough for these cards?",
    answer:
      "It meets each maker's figure. AMD recommends a 750 W minimum power supply for the RX 9070 XT, rated at 304 W typical board power. NVIDIA lists 750 W required system power for the RTX 5070 Ti, at 300 W total graphics power, and 650 W for the RTX 5070, at 250 W. NVIDIA says its minimum is based on a PC with a Ryzen 9 9950X processor and that requirements depend on the system. Partner cards can differ, so check the exact model.",
  },
  {
    question: "Which is better for streaming, the RX 9070 XT or the RTX 5070 Ti?",
    answer:
      "NVIDIA lists two ninth-generation NVENC encoders on the RTX 5070 Ti and one on the RTX 5070, with AV1 encoding on both. AMD lists H.264, HEVC and AV1 encoding on the RX 9070 XT. All three can encode AV1. Choose the RTX 5070 Ti if your streaming or editing software is built around NVENC.",
  },
  {
    question: "What were the launch prices of the RTX 5070, RTX 5070 Ti and RX 9070 XT?",
    answer:
      "NVIDIA announced the RTX 5070 Ti at $749 and the RTX 5070 at $549 in January 2025. AMD's February 28, 2025 press release lists the RX 9070 XT at a $599 suggested price. Those are launch prices, not today's store prices.",
  },
];

const VERDICT = `Lower-priced 16 GB card: RX 9070 XT. AMD launched it at $599 with 16 GB of GDDR6, 64 compute units and 304 W typical board power.

NVIDIA features with 16 GB: RTX 5070 Ti. NVIDIA launched it at $749 with 16 GB of GDDR7, 8,960 CUDA cores, DLSS 4 and two ninth-generation NVENC encoders.

Lowest launch price: RTX 5070. $549 with 12 GB of GDDR7 and DLSS 4.

Neither is better for everyone; it depends on how much NVIDIA's features are worth over AMD's lower price.`;

const EXPERT_ANALYSIS = `Choose the Radeon RX 9070 XT for 16 GB of memory at the lowest launch price of the two 16 GB cards: AMD launched it at $599 with 16 GB of GDDR6, against $749 for the GeForce RTX 5070 Ti with 16 GB of GDDR7. Choose the RTX 5070 Ti if you want NVIDIA's DLSS 4 features and its two ninth-generation NVENC encoders for streaming, and the RTX 5070 at $549 only if 12 GB of GDDR7 is enough for your games. Neither is better for everyone; it depends on how much NVIDIA's features are worth over AMD's lower price.

Memory

NVIDIA lists the RTX 5070 with 12 GB of GDDR7 on a 192-bit interface and the RTX 5070 Ti with 16 GB of GDDR7 on a 256-bit interface. AMD lists the RX 9070 XT with 16 GB of GDDR6 on a 256-bit interface, plus 64 MB of Infinity Cache. Two of the three cards have 16 GB. The RTX 5070 has 12 GB, which is the main thing its lower price gives up.

Shaders and clocks

NVIDIA lists 6,144 CUDA cores on the RTX 5070, with a 2.51 GHz boost clock, and 8,960 CUDA cores on the RTX 5070 Ti, with a 2.45 GHz boost clock. AMD lists 64 compute units on the RX 9070 XT, with a boost frequency of up to 2970 MHz. Core counts from different architectures are not comparable one to one.

Ray tracing and upscaling

NVIDIA lists DLSS 4 on both RTX cards, with Super Resolution, DLAA, Ray Reconstruction, Frame Generation and Multi Frame Generation, and fourth-generation RT cores. AMD lists 64 ray accelerators on the RX 9070 XT and AMD's FSR upscaling for RX 9000 Series cards. If DLSS 4 support in the games you play is the deciding factor, that points to the RTX 5070 Ti or RTX 5070.

Streaming and encoding

NVIDIA lists two ninth-generation NVENC encoders on the RTX 5070 Ti and one on the RTX 5070, with AV1 encode and decode on both. AMD lists H.264, HEVC and AV1 encode and decode on the RX 9070 XT. All three can stream in AV1 where the platform supports it. The RTX 5070 Ti's second encoder matters most for recording and streaming at the same time in NVENC-based software.

Power supply

AMD rates the RX 9070 XT at 304 W typical board power and recommends a 750 W minimum power supply, with two 8-pin connectors. NVIDIA rates the RTX 5070 Ti at 300 W total graphics power with 750 W required system power, and the RTX 5070 at 250 W with 650 W required system power. Both RTX cards take two PCIe 8-pin cables with the adapter in the box, or one 300 W or greater PCIe Gen 5 cable. NVIDIA says its minimum is based on a PC with a Ryzen 9 9950X processor, and that partner cards can differ. A quality 750 W unit meets all three makers' figures.

Price

NVIDIA announced the RTX 5070 Ti at $749 and the RTX 5070 at $549. AMD launched the RX 9070 XT at a $599 suggested price. At those launch prices, the RTX 5070 Ti costs $150 more than the RX 9070 XT, and the RX 9070 XT costs $50 more than the RTX 5070. Street prices move, so compare the exact models you can buy today.

Who should buy which

Buy the RX 9070 XT if 16 GB of memory at the lower price matters most. Buy the RTX 5070 Ti if DLSS 4 and two NVENC encoders are worth paying more for in your market. Buy the RTX 5070 if it is clearly the cheapest and 12 GB fits your games. RX 9070 XT vs RTX 5080 covers the next step up, and RX 9060 XT vs RX 9070 covers the step down.`;

const SPEC = "Specs";

export const RTX_5070_VS_RX_9070_XT_VS_RTX_5070_TI: EditorialComparison = buildEditorialComparison({
  slug: "rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti",
  title: "RTX 5070 vs RX 9070 XT vs RTX 5070 Ti: Which GPU to Buy?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: R5070,
      slug: R5070,
      name: "RTX 5070",
      shortDesc: "12 GB GDDR7 card NVIDIA launched at $549, with DLSS 4.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Lowest launch price of the three: $549 (NVIDIA)",
        "DLSS 4 with Multi Frame Generation (NVIDIA)",
        "250 W total graphics power, 650 W required system power (NVIDIA)",
      ],
      cons: [
        "12 GB of GDDR7 on a 192-bit interface, against 16 GB on the other two",
        "One NVENC encoder, against two on the RTX 5070 Ti",
      ],
      bestFor: "Best when it is clearly the cheapest and 12 GB is enough",
    },
    {
      id: XT,
      slug: XT,
      name: "RX 9070 XT",
      shortDesc: "16 GB GDDR6 card AMD launched at a $599 suggested price, with 64 compute units.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "16 GB GDDR6, 256-bit, 64 MB Infinity Cache (AMD)",
        "$599 suggested launch price, $150 under the RTX 5070 Ti (AMD, NVIDIA)",
        "H.264, HEVC and AV1 encode (AMD)",
      ],
      cons: [
        "No DLSS; AMD FSR instead",
        "304 W typical board power, 750 W minimum power supply (AMD)",
      ],
      bestFor: "Best for 16 GB at the lower price",
    },
    {
      id: TI,
      slug: TI,
      name: "RTX 5070 Ti",
      shortDesc: "16 GB GDDR7 card NVIDIA launched at $749, with DLSS 4 and two NVENC encoders.",
      imageUrl: null,
      entityType: "product",
      position: 2,
      pros: [
        "16 GB GDDR7, 256-bit, 8,960 CUDA cores (NVIDIA)",
        "DLSS 4 with Multi Frame Generation and Ray Reconstruction (NVIDIA)",
        "Two ninth-generation NVENC encoders (NVIDIA)",
      ],
      cons: [
        "Highest launch price of the three: $749 (NVIDIA)",
        "300 W total graphics power, 750 W required system power (NVIDIA)",
      ],
      bestFor: "Best if DLSS 4 and NVENC are worth the higher price",
    },
  ],
  keyDifferences: [
    {
      label: "Memory",
      entityAValue: "12 GB GDDR7, 192-bit",
      entityBValue: "16 GB GDDR6, 256-bit",
      values: ["12 GB GDDR7, 192-bit", "16 GB GDDR6, 256-bit", "16 GB GDDR7, 256-bit"],
      winnerIndex: "tie",
    },
    {
      label: "Launch price",
      entityAValue: "$549",
      entityBValue: "$599",
      values: ["$549", "$599", "$749"],
      winnerIndex: "tie",
    },
    {
      label: "Upscaling",
      entityAValue: "DLSS 4",
      entityBValue: "AMD FSR",
      values: ["DLSS 4", "AMD FSR", "DLSS 4"],
      winnerIndex: "tie",
    },
    {
      label: "Video encoders",
      entityAValue: "1x ninth-gen NVENC, AV1",
      entityBValue: "H.264, HEVC, AV1 encode",
      values: ["1x ninth-gen NVENC, AV1", "H.264, HEVC, AV1 encode", "2x ninth-gen NVENC, AV1"],
      winnerIndex: "tie",
    },
  ],
  attributes: [
    textAttrN("memory", "Memory", SPEC, [
      cell(R5070, "12 GB GDDR7, 192-bit"),
      cell(XT, "16 GB GDDR6, 256-bit, 64 MB Infinity Cache"),
      cell(TI, "16 GB GDDR7, 256-bit"),
    ]),
    textAttrN("shaders", "Shaders and boost clock", SPEC, [
      cell(R5070, "6,144 CUDA cores, 2.51 GHz boost"),
      cell(XT, "64 compute units, up to 2970 MHz boost"),
      cell(TI, "8,960 CUDA cores, 2.45 GHz boost"),
    ]),
    textAttrN("upscaling", "Upscaling and ray tracing", SPEC, [
      cell(R5070, "DLSS 4 (Super Resolution, DLAA, Ray Reconstruction, Frame Generation, Multi Frame Generation). 4th-gen RT cores"),
      cell(XT, "AMD FSR upscaling. 64 ray accelerators"),
      cell(TI, "DLSS 4 (Super Resolution, DLAA, Ray Reconstruction, Frame Generation, Multi Frame Generation). 4th-gen RT cores"),
    ]),
    textAttrN("encode", "Video encode", SPEC, [
      cell(R5070, "1x ninth-generation NVENC. AV1 encode"),
      cell(XT, "H.264, HEVC and AV1 encode"),
      cell(TI, "2x ninth-generation NVENC. AV1 encode"),
    ]),
    textAttrN("power", "Power", SPEC, [
      cell(R5070, "250 W total graphics power. 650 W required system power"),
      cell(XT, "304 W typical board power. 750 W minimum power supply. 2x 8-pin"),
      cell(TI, "300 W total graphics power. 750 W required system power"),
    ]),
    textAttrN("price", "Launch price", SPEC, [
      cell(R5070, "$549 (NVIDIA, January 2025)"),
      cell(XT, "$599 suggested (AMD, February 28, 2025)"),
      cell(TI, "$749 (NVIDIA, January 2025)"),
    ]),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "rx-9070-xt-vs-rtx-5080",
      title: "RX 9070 XT vs RTX 5080: 1440p Gaming Value",
      category: "technology",
    },
    {
      slug: "rx-9060-xt-vs-rx-9070",
      title: "RX 9060 XT vs RX 9070: Which AMD GPU to Buy",
      category: "technology",
    },
    {
      slug: "rx-9060-xt-vs-rtx-5060-ti",
      title: "RX 9060 XT vs RTX 5060 Ti: 16GB GPU Value",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "RX 9070 XT for 16 GB at a $599 launch price. RTX 5070 Ti for DLSS 4 and two NVENC encoders at $749. RTX 5070 at $549 when 12 GB is enough.",
    keyFact:
      "Launch prices: RTX 5070 $549 with 12 GB GDDR7, RX 9070 XT $599 with 16 GB GDDR6, RTX 5070 Ti $749 with 16 GB GDDR7.",
  },
  citationStats: {
    sourceCount: 5,
    dataPointCount: 24,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "NVIDIA GeForce RTX 5070 family", url: NV_5070 },
      { name: "NVIDIA RTX 50 Series announcement", url: NV_NEWS },
      { name: "AMD Radeon RX 9070 XT", url: AMD_XT },
      { name: "AMD RDNA 4 press release", url: AMD_PR },
      { name: "AMD FSR technologies", url: AMD_FSR },
    ],
  },
  resources: [
    {
      type: "external",
      label: "NVIDIA GeForce RTX 5070 family",
      url: NV_5070,
      description:
        "RTX 5070 Ti: 8,960 CUDA cores, 2.45 GHz boost, 16 GB GDDR7, 256-bit, 300 W, 750 W required system power, 2x ninth-gen NVENC. RTX 5070: 6,144 CUDA cores, 2.51 GHz boost, 12 GB GDDR7, 192-bit, 250 W, 650 W, 1x ninth-gen NVENC. DLSS 4 and AV1 encode on both. Minimum power based on a Ryzen 9 9950X PC.",
    },
    {
      type: "external",
      label: "NVIDIA RTX 50 Series announcement",
      url: NV_NEWS,
      description: "January 2025. RTX 5070 Ti and RTX 5070 available starting in February at $749 and $549.",
    },
    {
      type: "external",
      label: "AMD Radeon RX 9070 XT",
      url: AMD_XT,
      description:
        "64 compute units, boost up to 2970 MHz, 64 ray accelerators, 16 GB GDDR6, 256-bit, 64 MB Infinity Cache, 304 W typical board power, 750 W minimum power supply, 2x 8-pin. H.264, HEVC and AV1 encode and decode.",
    },
    {
      type: "external",
      label: "AMD RDNA 4 press release",
      url: AMD_PR,
      description: "February 28, 2025. RX 9070 XT suggested price $599.",
    },
    {
      type: "external",
      label: "AMD FSR technologies",
      url: AMD_FSR,
      description:
        "FSR Upscaling, formerly FidelityFX Super Resolution 4, is available on Radeon RX 7000 Series and RX 9000 Series graphics cards.",
    },
  ],
  metaTitle: "RTX 5070 vs RX 9070 XT vs RTX 5070 Ti | A Versus B",
});
