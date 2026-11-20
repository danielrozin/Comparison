import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-478 — RX 9070 GRE vs RX 9060 XT 16GB.
 * Read on 20 November 2026 from AMD's product specifications:
 * RX 9070 GRE, RX 9060 XT (16GB), RX 9070, and RX 9070 XT.
 * No frame rates, no percent gaps, no prices. winnerName stays null.
 * isHumanReviewed stays false. dataPointCount stays 0.
 */

const A = "rx-9070-gre";
const B = "rx-9060-xt";

const AMD_GRE =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070-gre.html";
const AMD_9060 =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9060xt.html";
const AMD_9070 =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070.html";
const AMD_9070XT =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070xt.html";

const SOURCE_DATE = "2026-11-20";
const PUBLISHED = "2026-11-20T00:00:00Z";
const SPEC = "Specs";

const SHORT_ANSWER =
  "Choose the Radeon RX 9070 GRE if you want the configuration AMD lists with 48 compute units, 3,072 stream processors, a 192-bit memory bus, 48 MB of Infinity Cache, and up to 432 GB/s of bandwidth, at 220 W typical board power. Choose the Radeon RX 9060 XT 16GB if you want 16 GB of GDDR6, 32 compute units, 2,048 stream processors, a 128-bit bus, up to 320 GB/s, and 160 W typical board power with a 450 W minimum power supply.";

const VERDICT = `Choose the RX 9070 GRE if you want 48 compute units, 12 GB of GDDR6 on a 192-bit bus, up to 432 GB/s, and the PC can meet 220 W typical board power and a 650 W minimum power supply.

Choose the RX 9060 XT 16GB if you want 16 GB of GDDR6, 32 compute units, up to 320 GB/s, and a 160 W typical board power figure with a 450 W minimum power supply.

Neither card is right for everyone. Check the current price before you buy. The RX 9070 and the RX 9070 XT are the 16 GB, 256-bit cards in the same family.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

## Key takeaways

AMD lists 48 compute units on the RX 9070 GRE and 32 compute units on the RX 9060 XT 16GB. Memory capacity, bus width, bandwidth, and board power are separate rows on the same specifications.

- The RX 9070 GRE lists 48 compute units, 3,072 stream processors, a boost frequency of up to 2790 MHz, and a game frequency of 2220 MHz.
- The RX 9060 XT lists 32 compute units, 2,048 stream processors, a boost frequency of up to 3130 MHz, and a game frequency of 2530 MHz.
- The RX 9070 GRE lists 12 GB of GDDR6 at up to 18 Gbps on a 192-bit bus, 48 MB of Infinity Cache, and up to 432 GB/s.
- The RX 9060 XT lists 16 GB of GDDR6 at up to 20 Gbps on a 128-bit bus, 32 MB of Infinity Cache, and up to 320 GB/s.
- Typical board power is 220 W with a 650 W minimum power supply and a 2x 8-pin connector on the GRE, and 160 W with a 450 W minimum power supply and a 1x 8-pin connector on the RX 9060 XT.
- The RX 9070 lists the same 220 W and 650 W figures as the GRE, with 16 GB on a 256-bit bus. The RX 9070 XT lists 304 W and a 750 W minimum power supply.

## Specification table

AMD Radeon specifications, read on 20 November 2026. No frame rate and no price.
| Specification | RX 9070 GRE | RX 9060 XT 16GB | RX 9070 | RX 9070 XT |
| --- | --- | --- | --- | --- |
| Compute units | 48 | 32 | 56 | 64 |
| Stream processors | 3,072 | 2,048 | 3,584 | 4,096 |
| Boost frequency | Up to 2790 MHz | Up to 3130 MHz | Up to 2520 MHz | Up to 2970 MHz |
| Game frequency | 2220 MHz | 2530 MHz | 2070 MHz | 2400 MHz |
| Ray accelerators | 48 | 32 | 56 | 64 |
| AI accelerators | 96 | 64 | 112 | 128 |
| ROPs | 96 | 64 | 128 | 128 |
| Transistor count | 53.9 B | 29.7 B | 53.9 B | 53.9 B |
| Peak FP32 vector | 34.3 TFLOPs | 25.6 TFLOPs | 36.1 TFLOPs | 48.7 TFLOPs |
| Memory | 12 GB GDDR6 | 16 GB GDDR6 | 16 GB GDDR6 | 16 GB GDDR6 |
| Memory interface | 192-bit | 128-bit | 256-bit | 256-bit |
| Memory speed | Up to 18 Gbps | Up to 20 Gbps | Up to 20 Gbps | Up to 20 Gbps |
| Infinity Cache | 48 MB | 32 MB | 64 MB | 64 MB |
| Memory bandwidth | Up to 432 GB/s | Up to 320 GB/s | Up to 640 GB/s | Up to 640 GB/s |
| Typical board power | 220 W | 160 W | 220 W | 304 W |
| Minimum power supply | 650 W | 450 W | 650 W | 750 W |
| Power connector | 2x 8-pin | 1x 8-pin | 2x 8-pin | 2x 8-pin |

## Compute units and clocks

AMD lists 48 compute units, 3,072 stream processors, 48 ray accelerators, 96 AI accelerators, and 96 ROPs on the RX 9070 GRE, and 32 compute units, 2,048 stream processors, 32 ray accelerators, 64 AI accelerators, and 64 ROPs on the RX 9060 XT. Transistor count is 53.9 B on the GRE and 29.7 B on the RX 9060 XT. Peak single-precision (FP32 vector) performance is 34.3 TFLOPs on the GRE and 25.6 TFLOPs on the RX 9060 XT. Those peak figures are the ones AMD prints. They are not a frame rate.

AMD lists a boost frequency of up to 2790 MHz and a game frequency of 2220 MHz on the RX 9070 GRE. AMD lists a boost frequency of up to 3130 MHz and a game frequency of 2530 MHz on the RX 9060 XT. The RX 9060 XT lists the higher boost frequency and the higher game frequency. The RX 9070 GRE lists more compute units. A higher boost frequency is not, by itself, a frame-rate result.

## 12 GB and 16 GB at 1440p

AMD lists 12 GB of GDDR6 on the RX 9070 GRE and 16 GB of GDDR6 on the RX 9060 XT. Memory capacity, memory interface, memory speed, and memory bandwidth are four separate specifications. The GRE lists a 192-bit interface, memory speed up to 18 Gbps, 48 MB of Infinity Cache, and bandwidth up to 432 GB/s. The RX 9060 XT lists a 128-bit interface, memory speed up to 20 Gbps, 32 MB of Infinity Cache, and bandwidth up to 320 GB/s.

Buyers compare memory capacity when a game offers a high texture setting. Capacity and compute units stay separate: the RX 9060 XT lists 16 GB and 32 compute units, and the RX 9070 GRE lists 12 GB and 48 compute units. No frame rate at 1440p is stated, and no lifespan is stated.

## Power and the power supply

AMD lists 220 W typical board power, a 650 W minimum power supply recommendation, and a 2x 8-pin connector for the RX 9070 GRE. AMD lists 160 W typical board power, a 450 W minimum power supply recommendation, and a 1x 8-pin connector for the RX 9060 XT. An upgrade on a PC that already has a smaller power supply can use those two recommendations as the check. The RX 9070 lists the same 220 W, 650 W, and 2x 8-pin figures as the GRE. The RX 9070 XT lists 304 W, a 750 W minimum power supply recommendation, and a 2x 8-pin connector.

## The RX 9070 and the RX 9070 XT

Choose the RX 9070 if you want 56 compute units, 3,584 stream processors, 16 GB of GDDR6 on a 256-bit bus, 64 MB of Infinity Cache, memory speed up to 20 Gbps, and bandwidth up to 640 GB/s, at the same 220 W and 650 W recommendation as the GRE. Its boost frequency is up to 2520 MHz and its game frequency is 2070 MHz. Peak FP32 vector performance is 36.1 TFLOPs. Ray accelerators are 56, AI accelerators are 112, and ROPs are 128.

Choose the RX 9070 XT if you want 64 compute units, 4,096 stream processors, a boost frequency of up to 2970 MHz, a game frequency of 2400 MHz, 16 GB of GDDR6 on a 256-bit bus, 64 MB of Infinity Cache, and bandwidth up to 640 GB/s, and the PC can meet 304 W typical board power and a 750 W minimum power supply. Peak FP32 vector performance is 48.7 TFLOPs. Ray accelerators are 64, AI accelerators are 128, and ROPs are 128. Transistor count is 53.9 B on both the RX 9070 and the RX 9070 XT, the same figure AMD lists on the GRE.

RX 9060 XT vs RX 9070, RX 9060 XT vs RX 9070 XT, and RX 9070 vs RX 9070 XT are the live comparisons for those pairs.

## Shared outputs

Both the RX 9070 GRE and the RX 9060 XT list DisplayPort 2.1a, HDMI 2.1b, and PCIe 5.0 x16. Both list AV1 encode and AV1 decode. Both list AMD FSR "Redstone" among supported technologies. The RX 9070 and the RX 9070 XT list the same DisplayPort, HDMI, and PCIe rows, and the same FSR name.

## Which card to choose

Choose the RX 9070 GRE for the 48-compute-unit configuration and the 192-bit memory row. Choose the RX 9060 XT 16GB for the 16 GB capacity and the 160 W power row. Choose the RX 9070 or the RX 9070 XT when you want 16 GB on a 256-bit bus.

- Choose the RX 9070 GRE if you want 48 compute units, 12 GB on a 192-bit bus, up to 432 GB/s, 220 W, and a 650 W minimum power supply.
- Choose the RX 9060 XT 16GB if you want 16 GB of GDDR6, 32 compute units, up to 320 GB/s, 160 W, and a 450 W minimum power supply.
- Choose the RX 9070 if you want 16 GB on a 256-bit bus at the same 220 W and 650 W figures as the GRE. RX 9060 XT vs RX 9070 and RX 9070 vs RX 9070 XT cover that step.
- Choose the RX 9070 XT if you want 64 compute units and 16 GB on a 256-bit bus, and the PC can meet 304 W and a 750 W minimum power supply. RX 9060 XT vs RX 9070 XT covers that pair.
- Check the current price before you buy. No price is copied here.`;

const FAQS = [
  {
    question: "How do the RX 9070 GRE and the RX 9060 XT 16GB differ on AMD's specifications?",
    answer:
      "AMD lists 48 compute units, 3,072 stream processors, 12 GB of GDDR6 on a 192-bit bus, and up to 432 GB/s on the RX 9070 GRE. AMD lists 32 compute units, 2,048 stream processors, 16 GB of GDDR6 on a 128-bit bus, and up to 320 GB/s on the RX 9060 XT. Typical board power is 220 W on the GRE and 160 W on the RX 9060 XT.",
  },
  {
    question: "Is 12 GB of VRAM enough for 1440p?",
    answer:
      "AMD lists 12 GB of GDDR6 on the RX 9070 GRE and 16 GB of GDDR6 on the RX 9060 XT. Capacity, bus width, and bandwidth are separate specifications: 192-bit and up to 432 GB/s on the GRE, and 128-bit and up to 320 GB/s on the RX 9060 XT. No frame rate at 1440p is stated, and no lifespan is stated. Memory capacity and the compute-unit count stay separate.",
  },
  {
    question: "What power supply does the RX 9070 GRE need?",
    answer:
      "AMD lists 220 W typical board power, a 650 W minimum power supply recommendation, and a 2x 8-pin connector for the RX 9070 GRE. AMD lists 160 W, a 450 W minimum power supply recommendation, and a 1x 8-pin connector for the RX 9060 XT.",
  },
  {
    question: "How does the RX 9070 GRE compare with the RX 9070?",
    answer:
      "AMD lists 56 compute units, 3,584 stream processors, 16 GB of GDDR6 on a 256-bit bus, 64 MB of Infinity Cache, memory speed up to 20 Gbps, and bandwidth up to 640 GB/s on the RX 9070. The GRE lists 48 compute units, 12 GB on a 192-bit bus, memory speed up to 18 Gbps, and bandwidth up to 432 GB/s. Both list 220 W typical board power and a 650 W minimum power supply. RX 9060 XT vs RX 9070 and RX 9070 vs RX 9070 XT are the live comparisons.",
  },
  {
    question: "How does the RX 9070 GRE compare with the RX 9070 XT?",
    answer:
      "AMD lists 64 compute units, 4,096 stream processors, 16 GB of GDDR6 on a 256-bit bus, and bandwidth up to 640 GB/s on the RX 9070 XT, with a boost frequency of up to 2970 MHz. Typical board power is 304 W and the minimum power supply recommendation is 750 W. The GRE lists 48 compute units, 12 GB on a 192-bit bus, up to 432 GB/s, 220 W, and a 650 W minimum power supply. RX 9060 XT vs RX 9070 XT and RX 9070 vs RX 9070 XT are the live comparisons.",
  },
  {
    question: "Which boost frequency does AMD list for the RX 9070 GRE and the RX 9060 XT?",
    answer:
      "AMD lists a boost frequency of up to 2790 MHz and a game frequency of 2220 MHz on the RX 9070 GRE. AMD lists a boost frequency of up to 3130 MHz and a game frequency of 2530 MHz on the RX 9060 XT. The RX 9060 XT lists the higher pair of clocks. The RX 9070 GRE lists more compute units. A higher boost frequency is not a frame-rate result.",
  },
];

const BUILT = buildEditorialComparison({
  slug: "rx-9070-gre-vs-rx-9060-xt",
  title: "RX 9070 GRE vs RX 9060 XT GPU",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "RX 9070 GRE",
      shortDesc: "Desktop card AMD lists with 48 compute units, 12 GB of GDDR6, and 220 W typical board power.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [],
      cons: [],
      bestFor: null,
    },
    {
      id: B,
      slug: B,
      name: "RX 9060 XT",
      shortDesc: "Desktop card AMD lists in a 16 GB configuration, with 32 compute units and 160 W typical board power.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [],
      cons: [],
      bestFor: null,
    },
  ],
  keyDifferences: [
    {
      label: "Compute units",
      entityAValue: "48. 3,072 stream processors",
      entityBValue: "32. 2,048 stream processors",
      winner: "tie",
    },
    {
      label: "Memory",
      entityAValue: "12 GB GDDR6, 192-bit, up to 18 Gbps, 48 MB Infinity Cache",
      entityBValue: "16 GB GDDR6, 128-bit, up to 20 Gbps, 32 MB Infinity Cache",
      winner: "tie",
    },
    {
      label: "Bandwidth",
      entityAValue: "Up to 432 GB/s",
      entityBValue: "Up to 320 GB/s",
      winner: "tie",
    },
    {
      label: "Board power",
      entityAValue: "220 W typical, 650 W minimum supply, 2x 8-pin",
      entityBValue: "160 W typical, 450 W minimum supply, 1x 8-pin",
      winner: "tie",
    },
    {
      label: "Boost frequency",
      entityAValue: "Up to 2790 MHz. Game frequency 2220 MHz",
      entityBValue: "Up to 3130 MHz. Game frequency 2530 MHz",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("cu", "Compute units", SPEC, A, B, "48 (AMD)", "32 (AMD)"),
    textAttr("shaders", "Stream processors", SPEC, A, B, "3,072 (AMD)", "2,048 (AMD)"),
    textAttr(
      "clocks",
      "Clocks",
      SPEC,
      A,
      B,
      "Boost up to 2790 MHz. Game frequency 2220 MHz (AMD)",
      "Boost up to 3130 MHz. Game frequency 2530 MHz (AMD)",
    ),
    textAttr("ray", "Ray accelerators", SPEC, A, B, "48 (AMD)", "32 (AMD)"),
    textAttr("ai", "AI accelerators", SPEC, A, B, "96 (AMD)", "64 (AMD)"),
    textAttr("rops", "ROPs", SPEC, A, B, "96 (AMD)", "64 (AMD)"),
    textAttr("transistors", "Transistor count", SPEC, A, B, "53.9 B (AMD)", "29.7 B (AMD)"),
    textAttr("fp32", "Peak FP32 vector", SPEC, A, B, "34.3 TFLOPs (AMD)", "25.6 TFLOPs (AMD)"),
    textAttr(
      "memory",
      "Memory",
      SPEC,
      A,
      B,
      "12 GB GDDR6, 192-bit, up to 18 Gbps, 48 MB Infinity Cache, up to 432 GB/s (AMD)",
      "16 GB GDDR6, 128-bit, up to 20 Gbps, 32 MB Infinity Cache, up to 320 GB/s (AMD)",
    ),
    textAttr(
      "power",
      "Power",
      SPEC,
      A,
      B,
      "220 W typical board power. 650 W minimum power supply. 2x 8-pin (AMD)",
      "160 W typical board power. 450 W minimum power supply. 1x 8-pin (AMD)",
    ),
    textAttr(
      "io",
      "Outputs and bus",
      SPEC,
      A,
      B,
      "DisplayPort 2.1a, HDMI 2.1b. PCIe 5.0 x16. AV1 encode and decode (AMD)",
      "DisplayPort 2.1a, HDMI 2.1b. PCIe 5.0 x16. AV1 encode and decode (AMD)",
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "rx-9060-xt-vs-rx-9070", title: "RX 9060 XT vs RX 9070", category: "technology" },
    { slug: "rx-9060-xt-vs-rx-9070-xt", title: "RX 9060 XT vs RX 9070 XT", category: "technology" },
    { slug: "rx-9070-vs-rx-9070-xt", title: "RX 9070 vs RX 9070 XT", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: null,
    keyFact:
      "AMD lists 12 GB of GDDR6 at up to 18 Gbps on a 192-bit bus for the RX 9070 GRE, and 16 GB of GDDR6 at up to 20 Gbps on a 128-bit bus for the RX 9060 XT.",
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 0,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "AMD Radeon RX 9070 GRE", url: AMD_GRE },
      { name: "AMD Radeon RX 9060 XT", url: AMD_9060 },
      { name: "AMD Radeon RX 9070", url: AMD_9070 },
      { name: "AMD Radeon RX 9070 XT", url: AMD_9070XT },
    ],
  },
  resources: [
    {
      type: "external",
      label: "AMD Radeon RX 9070 GRE",
      url: AMD_GRE,
      description:
        "Read on 20 November 2026. 48 compute units, 3,072 stream processors, boost up to 2790 MHz, game frequency 2220 MHz, 48 ray accelerators, 96 AI accelerators, 96 ROPs, transistor count 53.9 B, 34.3 TFLOPs peak FP32, 12 GB GDDR6, 192-bit, up to 18 Gbps, 48 MB Infinity Cache, up to 432 GB/s, 220 W, 650 W minimum power supply, 2x 8-pin, DisplayPort 2.1a, HDMI 2.1b, PCIe 5.0 x16.",
    },
    {
      type: "external",
      label: "AMD Radeon RX 9060 XT",
      url: AMD_9060,
      description:
        "Read on 20 November 2026. The product name on the specification is the 16 GB configuration. 32 compute units, 2,048 stream processors, boost up to 3130 MHz, game frequency 2530 MHz, 32 ray accelerators, 64 AI accelerators, 64 ROPs, transistor count 29.7 B, 25.6 TFLOPs peak FP32, 16 GB GDDR6, 128-bit, up to 20 Gbps, 32 MB Infinity Cache, up to 320 GB/s, 160 W, 450 W minimum power supply, 1x 8-pin, DisplayPort 2.1a, HDMI 2.1b, PCIe 5.0 x16.",
    },
    {
      type: "external",
      label: "AMD Radeon RX 9070",
      url: AMD_9070,
      description:
        "Read on 20 November 2026. 56 compute units, 3,584 stream processors, boost up to 2520 MHz, game frequency 2070 MHz, 56 ray accelerators, 112 AI accelerators, 128 ROPs, transistor count 53.9 B, 36.1 TFLOPs peak FP32, 16 GB GDDR6, 256-bit, up to 20 Gbps, 64 MB Infinity Cache, up to 640 GB/s, 220 W, 650 W minimum power supply, 2x 8-pin.",
    },
    {
      type: "external",
      label: "AMD Radeon RX 9070 XT",
      url: AMD_9070XT,
      description:
        "Read on 20 November 2026. 64 compute units, 4,096 stream processors, boost up to 2970 MHz, game frequency 2400 MHz, 64 ray accelerators, 128 AI accelerators, 128 ROPs, transistor count 53.9 B, 48.7 TFLOPs peak FP32, 16 GB GDDR6, 256-bit, up to 20 Gbps, 64 MB Infinity Cache, up to 640 GB/s, 304 W, 750 W minimum power supply, 2x 8-pin.",
    },
  ],
  metaTitle: "RX 9070 GRE vs RX 9060 XT GPU",
});

BUILT.metadata.metaDescription =
  "AMD lists 48 compute units, 12 GB, and 220 W on the RX 9070 GRE, and 32 compute units, 16 GB, and 160 W on the RX 9060 XT.";

export const RX_9070_GRE_VS_RX_9060_XT: EditorialComparison = BUILT;
