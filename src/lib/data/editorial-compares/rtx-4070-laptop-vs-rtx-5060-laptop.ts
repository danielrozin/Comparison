import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-233 — RTX 4070 Laptop GPU vs RTX 5060 Laptop GPU (both 8 GB).
 * Figures read on 18 October 2026 from NVIDIA's laptop GPU compare table
 * and the GeForce RTX 50 Series and RTX 40 Series laptop pages.
 * No benchmark scores (the brief's PassMark and NanoReview figures are
 * left out), no fps, no percent-faster claims, no street prices,
 * no page-level winner.
 */

const L4070 = "rtx-4070-laptop";
const L5060 = "rtx-5060-laptop";

const NV_COMPARE = "https://www.nvidia.com/en-us/geforce/laptops/compare/";
const NV_50 = "https://www.nvidia.com/en-us/geforce/laptops/50-series/";
const NV_40 = "https://www.nvidia.com/en-us/geforce/laptops/40-series/";

const SOURCE_DATE = "2026-10-18";
const PUBLISHED = "2026-10-18T00:00:00Z";

const SHORT_ANSWER =
  "At the same price, pick the better laptop rather than the GPU name: NVIDIA lists 8 GB of memory on a 128-bit interface for both the RTX 4070 Laptop GPU and the RTX 5060 Laptop GPU, so neither has more VRAM. Choose the RTX 4070 laptop for more CUDA cores (4,608 against 3,328) and a GPU power range up to 115 W, or the RTX 5060 laptop for GDDR7 memory, newer Blackwell RT and Tensor cores, and the DLSS Multi Frame Generation features NVIDIA lists only for the 50 Series. Neither is better for everyone; it depends on the exact laptop's GPU power, cooling, CPU and screen.";

const FAQS = [
  {
    question: "Is the RTX 4070 laptop or the RTX 5060 laptop better at the same price?",
    answer:
      "Neither wins on paper alone. NVIDIA lists 8 GB on a 128-bit interface for both. The RTX 4070 Laptop GPU has 4,608 CUDA cores and a 35 to 115 W GPU subsystem power range. The RTX 5060 Laptop GPU has 3,328 CUDA cores, GDDR7 memory, a 45 to 100 W range and newer Blackwell RT and Tensor cores. CUDA cores from different generations are not directly comparable, so the laptop's actual GPU power setting, cooling, CPU and screen decide more than the GPU name.",
  },
  {
    question: "Do the RTX 4070 laptop and RTX 5060 laptop have the same VRAM?",
    answer:
      "Same amount, different type. NVIDIA lists 8 GB of GDDR6 on a 128-bit interface for the RTX 4070 Laptop GPU, and 8 GB of GDDR7 on a 128-bit interface for the RTX 5060 Laptop GPU.",
  },
  {
    question: "Does the RTX 5060 laptop support Multi Frame Generation?",
    answer:
      "Yes. NVIDIA lists DLSS Frame Generation, DLSS Dynamic Multi Frame Generation, Ray Reconstruction, Super Resolution and DLAA for the RTX 5060 Laptop GPU. For the RTX 4070 Laptop GPU it lists DLSS 3, with Super Resolution and Frame Generation. Multi Frame Generation only helps in games that support it.",
  },
  {
    question: "Why does GPU power matter when comparing gaming laptops?",
    answer:
      "Laptop makers set the GPU power for each model within NVIDIA's range. NVIDIA lists 35 to 115 W for the RTX 4070 Laptop GPU and 45 to 100 W for the RTX 5060 Laptop GPU. The same GPU name can run at very different power in a thin laptop and in a thicker one, so check the exact model's GPU power before buying.",
  },
  {
    question: "Which is better for streaming or recording, the RTX 4070 laptop or RTX 5060 laptop?",
    answer:
      "NVIDIA lists one eighth-generation NVENC encoder on the RTX 4070 Laptop GPU and one ninth-generation NVENC encoder on the RTX 5060 Laptop GPU. Both have one encoder, so the newer generation is the difference.",
  },
  {
    question: "What else should I compare between two gaming laptops?",
    answer:
      "Check the GPU power, the CPU, at least 16 GB of system memory, the screen's resolution and refresh rate, cooling, whether the laptop has a MUX switch or Advanced Optimus, and the warranty where you live. Two laptops with the same GPU can differ a lot on those.",
  },
];

const VERDICT = `More CUDA cores and a higher power ceiling: RTX 4070 Laptop GPU. 4,608 CUDA cores, 8 GB GDDR6 on 128-bit, 35 to 115 W, DLSS 3 with Frame Generation.

Newer generation and Multi Frame Generation: RTX 5060 Laptop GPU. 3,328 CUDA cores, 8 GB GDDR7 on 128-bit, 45 to 100 W, Blackwell RT and Tensor cores, DLSS Dynamic Multi Frame Generation.

Neither is better for everyone; it depends on the exact laptop's GPU power, cooling, CPU and screen.`;

const EXPERT_ANALYSIS = `At the same price, pick the better laptop rather than the GPU name: NVIDIA lists 8 GB of memory on a 128-bit interface for both the RTX 4070 Laptop GPU and the RTX 5060 Laptop GPU, so neither has more VRAM. Choose the RTX 4070 laptop for more CUDA cores (4,608 against 3,328) and a GPU power range up to 115 W, or the RTX 5060 laptop for GDDR7 memory, newer Blackwell RT and Tensor cores, and the DLSS Multi Frame Generation features NVIDIA lists only for the 50 Series. Neither is better for everyone; it depends on the exact laptop's GPU power, cooling, CPU and screen.

Memory: 8 GB on both

NVIDIA lists 8 GB of GDDR6 on a 128-bit interface for the RTX 4070 Laptop GPU and 8 GB of GDDR7 on a 128-bit interface for the RTX 5060 Laptop GPU. The amount is identical, so neither card fixes an 8 GB limit in games that want more. GDDR7 is the newer memory type; NVIDIA lists 384 GB/s of memory bandwidth for the RTX 5060 Laptop GPU.

Cores, clocks and architecture

The RTX 4070 Laptop GPU is an Ada Lovelace part with 4,608 CUDA cores, a 1230 to 2175 MHz boost clock range, third-generation RT cores and fourth-generation Tensor cores. The RTX 5060 Laptop GPU is a Blackwell part with 3,328 CUDA cores, a 1455 to 2497 MHz boost clock range, fourth-generation RT cores and fifth-generation Tensor cores. NVIDIA lists 321 AI TOPS for the RTX 4070 Laptop GPU and 572 AI TOPS for the RTX 5060 Laptop GPU. Core counts across two generations are not a like-for-like measure of gaming speed.

GPU power is set by the laptop maker

NVIDIA lists a GPU subsystem power range of 35 to 115 W for the RTX 4070 Laptop GPU and 45 to 100 W for the RTX 5060 Laptop GPU. Each laptop maker chooses where its model sits in that range, and cooling decides how long it can hold that power. A high-power RTX 5060 laptop and a low-power RTX 4070 laptop can trade places, so compare the exact models' GPU power figures.

DLSS and frame generation

NVIDIA lists DLSS 3, with Super Resolution and Frame Generation, for the RTX 4070 Laptop GPU. For the RTX 5060 Laptop GPU it lists DLSS Super Resolution, DLAA, Ray Reconstruction, Frame Generation and Dynamic Multi Frame Generation. Multi Frame Generation is the 50 Series feature the RTX 4070 laptop does not get, and it only applies in games that support it.

Video encoding

NVIDIA lists one eighth-generation NVENC encoder on the RTX 4070 Laptop GPU and one ninth-generation NVENC encoder on the RTX 5060 Laptop GPU.

How to choose between two same-price laptops

Look past the GPU name. Check each model's GPU power, the CPU, at least 16 GB of system memory, the screen's resolution and refresh rate, the cooling design, whether it has a MUX switch or Advanced Optimus, and the warranty in your country. If the two laptops are otherwise equal, choose the RTX 4070 laptop for its larger core count and higher power ceiling, or the RTX 5060 laptop for GDDR7 and Multi Frame Generation support.`;

const SPEC = "Specs";

export const RTX_4070_LAPTOP_VS_RTX_5060_LAPTOP: EditorialComparison = buildEditorialComparison({
  slug: "rtx-4070-laptop-vs-rtx-5060-laptop",
  title: "RTX 4070 Laptop vs RTX 5060 Laptop (8GB): Which to Buy?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: L4070,
      slug: L4070,
      name: "RTX 4070 Laptop GPU",
      shortDesc: "Ada Lovelace laptop GPU with 4,608 CUDA cores and 8 GB GDDR6, 35 to 115 W.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "4,608 CUDA cores (NVIDIA)",
        "GPU subsystem power up to 115 W (NVIDIA)",
        "DLSS 3 with Frame Generation (NVIDIA)",
      ],
      cons: [
        "8 GB GDDR6 on 128-bit, the same amount as the RTX 5060 Laptop GPU",
        "No DLSS Multi Frame Generation listed",
        "Eighth-generation NVENC",
      ],
      bestFor: "Best when the laptop runs it at high GPU power",
    },
    {
      id: L5060,
      slug: L5060,
      name: "RTX 5060 Laptop GPU",
      shortDesc: "Blackwell laptop GPU with 3,328 CUDA cores and 8 GB GDDR7, 45 to 100 W.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "8 GB GDDR7, 384 GB/s (NVIDIA)",
        "DLSS Dynamic Multi Frame Generation and Ray Reconstruction (NVIDIA)",
        "Fourth-gen RT cores, fifth-gen Tensor cores, ninth-gen NVENC (NVIDIA)",
      ],
      cons: [
        "3,328 CUDA cores, against 4,608 on the RTX 4070 Laptop GPU",
        "GPU subsystem power tops out at 100 W (NVIDIA)",
      ],
      bestFor: "Best for 50 Series DLSS features in a newer laptop",
    },
  ],
  keyDifferences: [
    {
      label: "Memory",
      entityAValue: "8 GB GDDR6, 128-bit",
      entityBValue: "8 GB GDDR7, 128-bit",
      winner: "tie",
    },
    {
      label: "CUDA cores",
      entityAValue: "4,608",
      entityBValue: "3,328",
      winner: "tie",
    },
    {
      label: "GPU power range",
      entityAValue: "35 to 115 W",
      entityBValue: "45 to 100 W",
      winner: "tie",
    },
    {
      label: "Frame generation",
      entityAValue: "DLSS 3 Frame Generation",
      entityBValue: "DLSS Dynamic Multi Frame Generation",
      winner: "b",
    },
  ],
  attributes: [
    textAttr(
      "arch",
      "Architecture",
      SPEC,
      L4070,
      L5060,
      "Ada Lovelace. 3rd-gen RT cores, 4th-gen Tensor cores",
      "Blackwell. 4th-gen RT cores, 5th-gen Tensor cores"
    ),
    textAttr("cores", "CUDA cores", SPEC, L4070, L5060, "4,608", "3,328"),
    textAttr("clock", "Boost clock", SPEC, L4070, L5060, "1230 to 2175 MHz", "1455 to 2497 MHz"),
    textAttr("power", "GPU subsystem power", SPEC, L4070, L5060, "35 to 115 W", "45 to 100 W"),
    textAttr(
      "memory",
      "Memory",
      SPEC,
      L4070,
      L5060,
      "8 GB GDDR6, 128-bit",
      "8 GB GDDR7, 128-bit, 384 GB/s"
    ),
    textAttr("tops", "AI TOPS", SPEC, L4070, L5060, "321", "572"),
    textAttr(
      "dlss",
      "DLSS",
      SPEC,
      L4070,
      L5060,
      "DLSS 3 (Super Resolution and Frame Generation)",
      "Super Resolution, DLAA, Ray Reconstruction, Frame Generation, Dynamic Multi Frame Generation",
      "b"
    ),
    textAttr("encoder", "NVENC", SPEC, L4070, L5060, "1x eighth generation", "1x ninth generation"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "rx-9060-xt-vs-rtx-5060-ti",
      title: "RX 9060 XT vs RTX 5060 Ti: 16GB GPU Value",
      category: "technology",
    },
    {
      slug: "rtx-4090-vs-rtx-5080",
      title: "RTX 4090 vs RTX 5080: Specs and Launch Prices",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "RTX 4070 laptop for more CUDA cores and a power range up to 115 W. RTX 5060 laptop for GDDR7, Blackwell cores and DLSS Multi Frame Generation. Both have 8 GB.",
    keyFact:
      "NVIDIA lists 8 GB on a 128-bit interface for both: GDDR6 on the RTX 4070 Laptop GPU and GDDR7 on the RTX 5060 Laptop GPU.",
  },
  citationStats: {
    sourceCount: 3,
    dataPointCount: 18,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "NVIDIA laptop GPU compare", url: NV_COMPARE },
      { name: "NVIDIA GeForce RTX 50 Series laptops", url: NV_50 },
      { name: "NVIDIA GeForce RTX 40 Series laptops", url: NV_40 },
    ],
  },
  resources: [
    {
      type: "external",
      label: "NVIDIA laptop GPU compare",
      url: NV_COMPARE,
      description:
        "RTX 5060 Laptop GPU: 572 AI TOPS, 3,328 CUDA cores, 1455-2497 MHz, 45-100 W, 8 GB GDDR7, 128-bit, Blackwell, DLSS Frame Generation and Dynamic Multi Frame Generation, 1x ninth-gen NVENC. RTX 4070 Laptop GPU: 321 AI TOPS, 4,608 CUDA cores, 1230-2175 MHz, 35-115 W, 8 GB GDDR6, 128-bit, Ada Lovelace, DLSS 3 (Super Resolution + Frame Generation), 8th-gen NVENC.",
    },
    {
      type: "external",
      label: "NVIDIA GeForce RTX 50 Series laptops",
      url: NV_50,
      description: "RTX 5060 Laptop GPU: 3,328 CUDA cores, 8 GB GDDR7, 384 GB/s memory bandwidth.",
    },
    {
      type: "external",
      label: "NVIDIA GeForce RTX 40 Series laptops",
      url: NV_40,
      description: "RTX 4070 Laptop GPU: 4,608 CUDA cores, 1230-2175 MHz boost, 8 GB GDDR6.",
    },
  ],
  metaTitle: "RTX 4070 Laptop vs RTX 5060 Laptop | A Versus B",
});
