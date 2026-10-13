import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-182 — RX 9060 XT 16GB vs RTX 5060 Ti 16GB.
 * Figures read on 12 October 2026 from AMD's 20 May 2025 Computex press
 * release and RX 9060 XT product specs, and NVIDIA's 15 April 2025 RTX 5060
 * family announcement and RTX 5060 family specs. Launch prices only.
 * No fps numbers, no percent-faster claims, no street prices, no winner.
 * ROCm / CUDA software claims are omitted: neither product spec states them.
 */

const AMD = "rx-9060-xt";
const NV = "rtx-5060-ti";

const AMD_PR =
  "https://www.amd.com/en/newsroom/press-releases/2025-5-20-amd-introduces-new-radeon-graphics-cards-and-ryzen.html";
const AMD_SPEC =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9060xt.html";
const NV_PR =
  "https://nvidianews.nvidia.com/news/nvidia-blackwell-geforce-rtx-arrives-for-every-gamer-starting-at-299";
const NV_SPEC = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5060-family/";

const SOURCE_DATE = "2026-10-12";
const PUBLISHED = "2026-10-12T00:00:00Z";

const SHORT_ANSWER =
  "For raster value, choose the Radeon RX 9060 XT 16GB: AMD launched it at a $349 launch MSRP with 16 GB of GDDR6, while NVIDIA launched the GeForce RTX 5060 Ti 16GB at $429 with 16 GB of GDDR7, so both have 16 GB on a 128-bit bus and the launch prices are $80 apart. Choose the RTX 5060 Ti if you want NVIDIA DLSS 4, including Multi Frame Generation and Ray Reconstruction. Neither is better for everyone; street prices change, so check current prices.";

const FAQS = [
  {
    question: "Is the RTX 5060 Ti 16GB worth it over the RX 9060 XT 16GB?",
    answer:
      "It depends on the features you want. AMD launched the RX 9060 XT 16GB at $349 and NVIDIA launched the RTX 5060 Ti 16GB at $429. Both have 16 GB on a 128-bit interface. The RTX 5060 Ti adds NVIDIA DLSS 4 with Super Resolution, DLAA, Ray Reconstruction, Frame Generation, and Multi Frame Generation. If those features are not a priority, the RX 9060 XT has the lower launch price. Street prices change, so check current prices.",
  },
  {
    question: "What were the launch prices of the RX 9060 XT and RTX 5060 Ti?",
    answer:
      "AMD's May 20, 2025 press release gives the RX 9060 XT 16GB a $349 suggested price and the 8GB model $299. NVIDIA's April 15, 2025 announcement gives the RTX 5060 Ti 16GB $429 and the 8GB model $379. These are launch prices, not today's store prices.",
  },
  {
    question: "Do the RX 9060 XT and RTX 5060 Ti have the same VRAM?",
    answer:
      "The 16GB models have the same amount on a 128-bit interface. AMD lists GDDR6 at up to 20 Gbps with 32 MB of Infinity Cache on the RX 9060 XT. NVIDIA lists GDDR7 on the RTX 5060 Ti. Both cards also come in 8GB versions.",
  },
  {
    question: "Which uses more power, the RX 9060 XT or the RTX 5060 Ti?",
    answer:
      "AMD rates the RX 9060 XT 16GB at 160 W typical board power with a 450 W minimum power supply and one 8-pin connector. NVIDIA rates the RTX 5060 Ti at 180 W total graphics power with 600 W required system power, and one PCIe 8-pin cable or one 300 W or greater PCIe Gen 5 cable. Partner cards can differ.",
  },
  {
    question: "Does the RX 9060 XT support FSR 4?",
    answer:
      "Yes. AMD's launch release says the RX 9060 XT's second-generation AI accelerators power FSR 4, its machine-learning upscaler. AMD's product spec lists AMD FSR \"Redstone\" among supported technologies.",
  },
  {
    question: "Do both cards support PCIe 5.0?",
    answer:
      "Yes. AMD lists PCIe 5.0 x16 as the bus type for the RX 9060 XT. NVIDIA lists PCI Express Gen 5 support for the RTX 5060 Ti.",
  },
];

const VERDICT = `Best raster value at launch price: RX 9060 XT 16GB. AMD launched it at $349 with 16 GB of GDDR6, 32 compute units, and 160 W typical board power.

Best if you want NVIDIA DLSS 4: RTX 5060 Ti 16GB. NVIDIA launched it at $429 with 16 GB of GDDR7, 4,608 CUDA cores, 180 W total graphics power, and DLSS 4 features including Multi Frame Generation and Ray Reconstruction.

Neither is better for everyone. Street prices change, so check current prices.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Launch MSRP: $349 for the RX 9060 XT 16GB, $429 for the RTX 5060 Ti 16GB.
- Both have 16 GB on a 128-bit bus. GDDR6 on AMD, GDDR7 on NVIDIA.
- Board power: 160 W for AMD, 180 W for NVIDIA.
- Upscaling: FSR 4 on AMD, DLSS 4 with Multi Frame Generation on NVIDIA.

Memory, cores, and clocks

AMD lists 32 compute units, 32 ray accelerators, and 64 AI accelerators on the RX 9060 XT, with a boost frequency of up to 3130 MHz and a game frequency of 2530 MHz. Memory is 16 GB of GDDR6 at up to 20 Gbps on a 128-bit interface, with 32 MB of Infinity Cache and up to 320 GB/s of bandwidth.

NVIDIA lists 4,608 CUDA cores on the RTX 5060 Ti, fifth-generation Tensor cores, fourth-generation ray tracing cores, a 2.57 GHz boost clock, and a 2.41 GHz base clock. Memory is 16 GB or 8 GB of GDDR7 on a 128-bit interface.

Power and connectors

AMD rates the RX 9060 XT 16GB at 160 W typical board power, recommends a 450 W minimum power supply, and lists one 8-pin power connector. NVIDIA rates the RTX 5060 Ti at 180 W total graphics power and 600 W required system power, with one PCIe 8-pin cable or one 300 W or greater PCIe Gen 5 cable, adapter in the box.

Display outputs and PCIe

AMD lists DisplayPort 2.1a and HDMI 2.1b on the RX 9060 XT, and a PCIe 5.0 x16 bus. NVIDIA lists three DisplayPort outputs and one HDMI output on the RTX 5060 Ti reference spec, with PCI Express Gen 5. Partner cards can differ.

Ray tracing and upscaling

NVIDIA lists DLSS 4 on the RTX 5060 Ti with Super Resolution, DLAA, Ray Reconstruction, Frame Generation, and Multi Frame Generation, plus ray tracing support. AMD says the RX 9060 XT's AI accelerators power FSR 4 machine-learning upscaling, and lists AMD FSR "Redstone" among supported technologies. These are feature lists, not frame-rate results.

8GB versions

Both cards also come in 8GB versions: $299 for the RX 9060 XT 8GB and $379 for the RTX 5060 Ti 8GB at launch. Unless noted, specs are for the 16GB models.

Who should buy which

Choose the RX 9060 XT 16GB when 16 GB at the lower launch price matters most. Choose the RTX 5060 Ti 16GB when you want DLSS 4 with Multi Frame Generation and Ray Reconstruction and the $80 launch-price gap is acceptable. RX 9070 XT vs RTX 5080 covers the higher tier. Check current prices before you buy.`;

const SPEC = "Specs";

const BUILT = buildEditorialComparison({
  slug: "rx-9060-xt-vs-rtx-5060-ti",
  title: "RX 9060 XT vs RTX 5060 Ti: 16GB GPU Value",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: AMD,
      slug: AMD,
      name: "RX 9060 XT",
      shortDesc: "16 GB GDDR6 card AMD launched at a $349 suggested price, with 32 compute units.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "$349 launch MSRP for the 16GB model (AMD, May 20, 2025)",
        "16 GB GDDR6, 128-bit, 32 MB Infinity Cache (AMD)",
        "160 W typical board power, 450 W minimum power supply, 1x 8-pin (AMD)",
        "FSR 4 machine-learning upscaling (AMD)",
      ],
      cons: [
        "GDDR6 rather than GDDR7",
        "No NVIDIA DLSS 4 features",
      ],
      bestFor: "Raster value at the lower launch price, with 16 GB",
    },
    {
      id: NV,
      slug: NV,
      name: "RTX 5060 Ti",
      shortDesc: "16 GB GDDR7 card NVIDIA launched at $429, with DLSS 4 and 4,608 CUDA cores.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "16 GB GDDR7, 128-bit, 4,608 CUDA cores, 2.57 GHz boost (NVIDIA)",
        "DLSS 4: Super Resolution, DLAA, Ray Reconstruction, Frame Generation, Multi Frame Generation (NVIDIA)",
        "Ray tracing supported (NVIDIA)",
      ],
      cons: [
        "$429 launch MSRP, $80 more than AMD's $349",
        "180 W total graphics power and 600 W required system power (NVIDIA)",
      ],
      bestFor: "DLSS 4 and ray tracing features at a higher launch price",
    },
  ],
  keyDifferences: [
    {
      label: "Launch MSRP (16GB)",
      entityAValue: "$349 (AMD, May 20, 2025)",
      entityBValue: "$429 (NVIDIA, April 15, 2025)",
      winner: "a",
    },
    {
      label: "VRAM",
      entityAValue: "16 GB GDDR6, 128-bit, 32 MB Infinity Cache",
      entityBValue: "16 GB GDDR7, 128-bit",
      winner: "tie",
    },
    {
      label: "Board power",
      entityAValue: "160 W typical, 450 W minimum supply",
      entityBValue: "180 W total graphics power, 600 W required system power",
      winner: "tie",
    },
    {
      label: "Upscaler",
      entityAValue: "FSR 4 machine-learning upscaling",
      entityBValue: "DLSS 4, including Multi Frame Generation and Ray Reconstruction",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("price", "Launch MSRP", SPEC, AMD, NV, "16GB: $349. 8GB: $299 (AMD). Street prices change", "16GB: $429. 8GB: $379 (NVIDIA). Street prices change", "a"),
    textAttr("memory", "Memory", SPEC, AMD, NV, "16 GB GDDR6 up to 20 Gbps, 128-bit, 32 MB Infinity Cache (AMD)", "16 GB GDDR7, 128-bit (NVIDIA)"),
    textAttr("shaders", "Shaders and clocks", SPEC, AMD, NV, "32 compute units. Boost up to 3130 MHz, game frequency 2530 MHz", "4,608 CUDA cores. Boost 2.57 GHz. Base 2.41 GHz"),
    textAttr("ray", "Ray tracing and AI", SPEC, AMD, NV, "32 ray accelerators, 64 AI accelerators (AMD)", "4th-gen ray tracing cores, 5th-gen Tensor cores (NVIDIA)"),
    textAttr("power", "Power", SPEC, AMD, NV, "160 W typical board power. 450 W minimum power supply. 1x 8-pin (AMD)", "180 W total graphics power. 600 W required system power. 1x PCIe 8-pin or one 300 W+ PCIe Gen 5 cable (NVIDIA)"),
    textAttr("io", "Outputs and bus", SPEC, AMD, NV, "DisplayPort 2.1a, HDMI 2.1b. PCIe 5.0 x16", "3x DisplayPort, 1x HDMI. PCI Express Gen 5"),
    textAttr("upscaler", "Upscaling", SPEC, AMD, NV, "FSR 4 machine-learning upscaling. FSR \"Redstone\" listed", "DLSS 4: Super Resolution, DLAA, Ray Reconstruction, Frame Generation, Multi Frame Generation"),
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
      "RX 9060 XT 16GB for 16 GB at AMD's $349 launch MSRP. RTX 5060 Ti 16GB if you want DLSS 4 with Multi Frame Generation at NVIDIA's $429 launch MSRP.",
    keyFact:
      "Both 16GB models use a 128-bit interface. AMD lists GDDR6 and $349. NVIDIA lists GDDR7 and $429.",
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 18,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "AMD Computex 2025 press release", url: AMD_PR },
      { name: "AMD Radeon RX 9060 XT", url: AMD_SPEC },
      { name: "NVIDIA RTX 5060 family announcement", url: NV_PR },
      { name: "NVIDIA GeForce RTX 5060 family", url: NV_SPEC },
    ],
  },
  resources: [
    {
      type: "external",
      label: "AMD Computex 2025 press release",
      url: AMD_PR,
      description: "May 20, 2025. RX 9060 XT 16GB: 32 compute units, game clock 2.53 GHz, boost up to 3.13 GHz, 128-bit, 32 MB Infinity Cache, from 160 W, $349 suggested price. 8GB: $299.",
    },
    {
      type: "external",
      label: "AMD Radeon RX 9060 XT",
      url: AMD_SPEC,
      description: "32 compute units, 32 ray accelerators, 64 AI accelerators, boost up to 3130 MHz, game 2530 MHz, 16 GB GDDR6, 128-bit, 160 W, 450 W minimum PSU, 1x 8-pin, PCIe 5.0 x16, DisplayPort 2.1a, HDMI 2.1b.",
    },
    {
      type: "external",
      label: "NVIDIA RTX 5060 family announcement",
      url: NV_PR,
      description: "April 15, 2025. RTX 5060 Ti 16GB at $429 and 8GB at $379, available April 16.",
    },
    {
      type: "external",
      label: "NVIDIA GeForce RTX 5060 family",
      url: NV_SPEC,
      description: "RTX 5060 Ti: 4,608 CUDA cores, 2.57 GHz boost, 2.41 GHz base, 16 GB or 8 GB GDDR7, 128-bit, DLSS 4, 180 W, 600 W system power, 3x DisplayPort, 1x HDMI, PCIe Gen 5.",
    },
  ],
  metaTitle: "RX 9060 XT vs RTX 5060 Ti | A Versus B",
});

BUILT.metadata.metaDescription =
  "RX 9060 XT 16GB ($349 launch MSRP) vs RTX 5060 Ti 16GB ($429): VRAM, power, outputs, FSR 4 vs DLSS 4 for a 16GB graphics card.";

export const RX_9060_XT_VS_RTX_5060_TI: EditorialComparison = BUILT;
