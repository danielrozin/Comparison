import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-393 — RTX 5070 Ti vs RX 9070 XT when the Ti costs more.
 * Opened 7 November 2026 (Asia/Jerusalem). Draft for human fact-check.
 * isHumanReviewed stays false. HUMAN_REVIEWED_SLUGS stays empty.
 * winnerName stays null. Every key difference is a tie.
 *
 * NVIDIA family HTML, opened the same day (nv-update-date 2026-09-03):
 * RTX 5070 Ti is 8960 CUDA cores, 16 GB GDDR7, 256-bit, boost 2.45 GHz,
 * base 2.3 GHz, 300 W total graphics power, 750 W required system power,
 * CUDA Capability 12.0, 2x Ninth Generation NVENC, AV1 encode.
 * The GeForce RTX 5070 column on that same table is a different card:
 * 6144 CUDA cores, 12 GB GDDR7, 192-bit, boost 2.51 GHz, base 2.33 GHz,
 * 250 W, 650 W, 1x Ninth Generation NVENC. That 12 GB figure was read
 * from the table, not copied from the non-Ti compare.
 * The specifications table labels DLSS 4 and lists its feature names.
 * Marketing copy says DLSS 5 introduces 3D-Guided Neural Rendering.
 * The family specifications table has no memory-bandwidth row. A converted
 * view of the same URL showed a summary bandwidth row and a DLSS 5 spec
 * row that are not in the HTML, so those rows are not used.
 * Shop markup on that HTML was an unfilled price token. No price is copied.
 *
 * Bandwidth is the May 12, 2025 RTX Blackwell architecture whitepaper
 * (PDF creation date 2025-05-12): Table 5 lists 896 GB/sec, 28 Gbps, and
 * a 2452 MHz boost for the RTX 5070 Ti, and Table 6 lists 672 GB/sec for
 * the GeForce RTX 5070. The whitepaper names DLSS 4. Table 5 lists
 * 703/1406 FP4 AI TOPS, with the higher figure using sparsity, and
 * 133.2 RT TFLOPS. The family specifications list 1406 AI TOPS and
 * 133 TFLOPS. Those peaks are not a result against the RX 9070 XT.
 *
 * RX 9070 XT specifications, opened the same day (og:updated_time
 * 2026-10-19): 64 compute units, 4096 stream processors, 16 GB GDDR6,
 * 256-bit, up to 640 GB/s, up to 20 Gbps, 64 MB Infinity Cache, game
 * 2400 MHz, boost up to 2970 MHz, 304 W typical board power, 750 W
 * minimum power supply, FSR "Redstone". The product specifications do
 * not say RDNA 4 or FSR 4, and they do not list CUDA or NVENC.
 * RDNA 4, FSR 4, Fluid Motion Frames 2.1, a 2.4 GHz game clock, and a
 * boost clock up to 3.0 GHz come from AMD's February 28, 2025 release.
 * The suggested price in that release is not copied.
 *
 * No frame-rate, ray-tracing, latency, or encode head-to-head is included.
 * r/buildapc threads returned HTTP 403, so there is no community block.
 * The shared Analysis heading and "Drafted with AI from web research."
 * come from ExpertAnalysis.
 */

const A = "rtx-5070-ti";
const B = "rx-9070-xt";

const NV_FAMILY = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/";
const NV_ARCH =
  "https://images.nvidia.com/aem-dam/Solutions/geforce/blackwell/nvidia-rtx-blackwell-gpu-architecture.pdf";
const NV_SHOP = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/#shop-all";
const AMD_XT =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070xt.html";
const AMD_PR =
  "https://www.amd.com/en/newsroom/press-releases/2025-2-28-amd-unveils-next-generation-amd-rdna-4-architectu.html";
const AMD_BUY = "https://www.amd.com/en/where-to-buy/graphics/radeon.html";

const SOURCE_DATE = "2026-11-07";
const PUBLISHED = "2026-11-07T00:00:00Z";
const SPEC = "Specs";

const SHORT_ANSWER =
  "Pay the GeForce RTX 5070 Ti premium only when software you use needs CUDA Capability 12.0, two ninth-generation NVENC encoders, or the DLSS features NVIDIA lists, and the price gap you see today is worth that to you. Both the RTX 5070 Ti and the Radeon RX 9070 XT list 16 GB of memory, so this is not the 12 GB GeForce RTX 5070 choice, and neither card is the right one for every buyer.";

const FAQS = [
  {
    question: "When should I pay more for the RTX 5070 Ti than for the RX 9070 XT?",
    answer:
      "Pay more only when you will use CUDA Capability 12.0, two ninth-generation NVENC encoders, or the DLSS features NVIDIA lists, and the price gap you see today is worth that use to you. If you will not use those features, price the RX 9070 XT first. Both list 16 GB. Neither card is the right one for every buyer. No store price is copied here.",
  },
  {
    question: "Do the RTX 5070 Ti and the RX 9070 XT both have 16 GB?",
    answer:
      "Yes. NVIDIA's GeForce RTX 5070 family specifications list 16 GB of GDDR7 on a 256-bit interface for the RTX 5070 Ti. AMD lists 16 GB of GDDR6 on a 256-bit interface, with 64 MB of Infinity Cache and memory bandwidth up to 640 GB/s, for the RX 9070 XT. The GeForce RTX 5070, which is not the Ti, lists 12 GB of GDDR7 on a 192-bit interface.",
  },
  {
    question: "How is the RTX 5070 Ti different from the RTX 5070?",
    answer:
      "They are different NVIDIA cards. The RTX 5070 Ti lists 8960 CUDA cores, 16 GB of GDDR7, a 2.45 GHz boost clock, a 2.3 GHz base clock, 300 W total graphics power, 750 W required system power, and two ninth-generation NVENC encoders. The GeForce RTX 5070 lists 6144 CUDA cores, 12 GB of GDDR7, a 2.51 GHz boost clock, a 2.33 GHz base clock, 250 W total graphics power, 650 W required system power, and one ninth-generation NVENC encoder. NVIDIA's May 12, 2025 architecture whitepaper lists 896 GB/sec for the RTX 5070 Ti in Table 5 and 672 GB/sec for the GeForce RTX 5070 in Table 6. RTX 5070 vs RX 9070 XT is the non-Ti comparison.",
  },
  {
    question: "Which power number should I use for the RTX 5070 Ti and the RX 9070 XT?",
    answer:
      "Use both, and do not treat them as the same measurement. NVIDIA lists 300 W total graphics power and a separate 750 W required system power for the RTX 5070 Ti. AMD lists 304 W typical board power and a separate 750 W minimum power supply for the RX 9070 XT. None of these is measured wall power. NVIDIA's 750 W figure is based on a PC with a Ryzen 9 9950X and can change with the rest of the PC.",
  },
  {
    question: "Do NVIDIA and AMD use one upscaling name for these cards?",
    answer:
      "No. NVIDIA's family marketing copy says DLSS 5 introduces 3D-Guided Neural Rendering. The specifications table labels DLSS 4 and lists Super Resolution, DLAA, Ray Reconstruction, Frame Generation, and Multi Frame Generation. The May 12, 2025 architecture whitepaper names DLSS 4. AMD's current RX 9070 XT specifications list FSR \"Redstone\". AMD's February 28, 2025 release names FSR 4. Keep each name with its date. No upscaling percentage is included.",
  },
  {
    question: "Does the RTX 5070 Ti list CUDA and two video encoders?",
    answer:
      "Yes. NVIDIA lists CUDA Capability 12.0 and two ninth-generation NVENC encoders, with AV1 encode, on the RTX 5070 Ti. AMD lists H.264, HEVC, and AV1 encode on the RX 9070 XT and does not list CUDA or NVENC. Choose the RTX 5070 Ti when software you use requires CUDA or two NVENC encoders. No encode-quality result and no local-AI speed result are included.",
  },
];

const VERDICT = `Pay for the RTX 5070 Ti only when you will use CUDA Capability 12.0, two ninth-generation NVENC encoders, or NVIDIA's listed DLSS features, and only when today's price gap is worth that use. Otherwise price the RX 9070 XT first.

Both list 16 GB. NVIDIA lists 16 GB of GDDR7 on the RTX 5070 Ti. AMD lists 16 GB of GDDR6 on the RX 9070 XT. The GeForce RTX 5070, without Ti, lists 12 GB of GDDR7.

Board power and the power-supply figure are different. NVIDIA lists 300 W total graphics power and 750 W required system power. AMD lists 304 W typical board power and a 750 W minimum power supply. Neither rating is measured wall power.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Write down the price of the exact RTX 5070 Ti and the exact RX 9070 XT you can buy today. No store price is copied here. Pay the difference only for a feature the RTX 5070 Ti lists and the RX 9070 XT specifications do not: CUDA Capability 12.0, two ninth-generation NVENC encoders, or NVIDIA's listed DLSS features. If you will not use that feature, do not pay the difference. The sourced-figure count is not a frame-rate sample.

NVIDIA's GeForce RTX 5070 family specifications list 16 GB of GDDR7 and a 256-bit memory interface on the RTX 5070 Ti, and 12 GB of GDDR7 and a 192-bit interface on the GeForce RTX 5070. AMD lists 16 GB of GDDR6, a 256-bit interface, memory bandwidth up to 640 GB/s, a memory speed up to 20 Gbps, and 64 MB of Infinity Cache on the RX 9070 XT. The family specifications table does not list memory bandwidth. NVIDIA's May 12, 2025 RTX Blackwell GPU architecture whitepaper, Table 5, lists 896 GB/sec and 28 Gbps for the RTX 5070 Ti, and Table 6 lists 672 GB/sec for the GeForce RTX 5070. More memory does not by itself make a card faster, and these bandwidth figures are not a frame-rate result.

NVIDIA's family marketing copy says DLSS 5 introduces 3D-Guided Neural Rendering on GeForce RTX 50 Series GPUs. The specifications table labels DLSS 4 and lists Super Resolution, DLAA, Ray Reconstruction, Frame Generation, and Multi Frame Generation. It also lists Reflex 2, a low-latency mode, and Frame Warp, marked Coming Soon. The May 12, 2025 architecture whitepaper names DLSS 4. AMD's current RX 9070 XT specifications list FSR "Redstone", Fluid Motion Frames, and Radeon Anti-Lag. AMD's February 28, 2025 release names FSR 4 for Radeon RX 9000 Series cards and names Fluid Motion Frames 2.1. Keep those names with their dates. No upscaling percentage is included.

NVIDIA lists CUDA Capability 12.0, 8960 CUDA cores, and 2x Ninth Generation NVENC, with AV1 encode, on the RTX 5070 Ti. The GeForce RTX 5070 lists one ninth-generation NVENC encoder. AMD lists H.264, HEVC, and AV1 encode on the RX 9070 XT and does not list CUDA or NVENC. Consider the RTX 5070 Ti when software you use requires CUDA or two NVENC encoders. No encode-quality result and no local-AI speed result are included.

NVIDIA lists 300 W total graphics power for the RTX 5070 Ti and, as a separate row, 750 W required system power. The 750 W figure is based on a PC configured with a Ryzen 9 9950X processor. NVIDIA recommends a PCIe CEM 5.1 power supply and says the requirement can change with the rest of the PC. The RTX 5070 Ti power connector is two PCIe 8-pin cables, with an adapter in the box, or one 300 W or greater PCIe Gen 5 cable. AMD lists 304 W typical board power and a separate 750 W minimum power supply, with two 8-pin connectors. AMD's game-clock note uses the words typical TGP for that clock. That note is not the 304 W row. None of these ratings is measured electricity use. The GeForce RTX 5070 lists 250 W total graphics power and 650 W required system power.

NVIDIA lists Blackwell, a 2.3 GHz base clock, and a 2.45 GHz boost clock for the RTX 5070 Ti. Whitepaper Table 5 lists a 2452 MHz boost clock. NVIDIA says clock specifications apply while gaming with medium to full GPU utilization, and that add-in-card specifications can vary. Length, width, and slot count for the RTX 5070 Ti vary by manufacturer. The GeForce RTX 5070 lists a 2.51 GHz boost clock and a 2.33 GHz base clock. AMD's February 28, 2025 release calls the RX 9070 XT an RDNA 4 card with up to 64 compute units. Current specifications list 64 compute units, 4096 stream processors, 64 ray accelerators, a 2400 MHz game clock, and a boost clock up to 2970 MHz. The February 28, 2025 release lists a 2.4 GHz game clock and a boost clock up to 3.0 GHz, and says boost clock is the maximum on a bursty workload and can vary. CUDA cores and stream processors are different architectures, so the counts are not a one-to-one speed comparison.

Rated tensor and ray-tracing peaks are left out of the buy decision. NVIDIA's family specifications list 1406 AI TOPS and 133 TFLOPS. Whitepaper Table 5 lists 703/1406 FP4 AI TOPS, with the higher figure using sparsity, and 133.2 RT TFLOPS. AMD lists separate peak rates, including 64 ray accelerators. Those figures are not a result against the other card. No frame-rate, latency, or encode test is included.

NVIDIA lists PCI Express Gen 5, three DisplayPort connectors, and one HDMI connector. Footnotes identify DisplayPort 2.1b and HDMI 2.1b. AMD lists PCIe 5.0 x16, DisplayPort 2.1a, and HDMI 2.1b. RTX 5070 vs RX 9070 XT compares the non-Ti GeForce RTX 5070 with this RX 9070 XT. RTX 5070 vs RX 9070 XT vs RTX 5070 Ti is the three-card matchup. RX 9070 vs RX 9070 XT compares the non-XT Radeon RX 9070 with the RX 9070 XT.`;

const BUILT = buildEditorialComparison({
  slug: "rtx-5070-ti-vs-rx-9070-xt",
  title: "RTX 5070 Ti vs RX 9070 XT: GPU Premium",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "RTX 5070 Ti",
      shortDesc: "Blackwell card with 16 GB of GDDR7, 8960 CUDA cores, and 300 W total graphics power.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "CUDA Capability 12.0 and 8960 CUDA cores (NVIDIA family specifications)",
        "2x Ninth Generation NVENC and AV1 encode (NVIDIA family specifications)",
        "16 GB GDDR7, 256-bit (NVIDIA). 896 GB/sec is in the May 12, 2025 whitepaper, Table 5",
      ],
      cons: [
        "300 W total graphics power and 750 W required system power (NVIDIA). Length varies by manufacturer",
        "Marketing copy says DLSS 5. The specifications table says DLSS 4",
      ],
      bestFor: "When you will use CUDA, two NVENC encoders, or NVIDIA's listed DLSS features and accept today's price gap",
    },
    {
      id: B,
      slug: B,
      name: "RX 9070 XT",
      shortDesc: "16 GB GDDR6 card with 64 compute units, 4096 stream processors, and 304 W typical board power.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "16 GB GDDR6, 256-bit, up to 640 GB/s, 64 MB Infinity Cache (AMD)",
        "H.264, HEVC, and AV1 encode (AMD)",
        "64 compute units and 4096 stream processors (AMD)",
      ],
      cons: [
        "304 W typical board power and a 750 W minimum power supply (AMD)",
        "No CUDA listing. Current specifications list FSR \"Redstone\". February 28, 2025 release names FSR 4",
      ],
      bestFor: "When you want 16 GB and will not use the NVIDIA-only listings above",
    },
  ],
  keyDifferences: [
    {
      label: "Premium software",
      entityAValue: "CUDA Capability 12.0. 2x Ninth Generation NVENC. Specifications table: DLSS 4. Marketing copy: DLSS 5",
      entityBValue: "No CUDA or NVENC listing. Current specifications: FSR \"Redstone\". February 28, 2025 release: FSR 4",
      winner: "tie",
    },
    {
      label: "Memory",
      entityAValue: "16 GB GDDR7, 256-bit. 896 GB/sec in the May 12, 2025 whitepaper, Table 5",
      entityBValue: "16 GB GDDR6, 256-bit, up to 640 GB/s, 64 MB Infinity Cache",
      winner: "tie",
    },
    {
      label: "System power supply",
      entityAValue: "750 W required system power, based on a Ryzen 9 9950X PC",
      entityBValue: "750 W minimum power supply",
      winner: "tie",
    },
    {
      label: "Board power",
      entityAValue: "300 W total graphics power",
      entityBValue: "304 W typical board power",
      winner: "tie",
    },
    {
      label: "Clocks",
      entityAValue: "Base 2.3 GHz. Boost 2.45 GHz. Whitepaper Table 5 boost 2452 MHz",
      entityBValue: "Game 2400 MHz. Boost up to 2970 MHz. February 28, 2025 release: game 2.4 GHz, boost up to 3.0 GHz",
      winner: "tie",
    },
    {
      label: "Video encode",
      entityAValue: "2x Ninth Generation NVENC. AV1 encode. No quality result",
      entityBValue: "H.264, HEVC, and AV1 encode. No quality result",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("arch", "Architecture", SPEC, A, B, "Blackwell (NVIDIA family specifications)", "RDNA 4 (AMD, February 28, 2025). Not named in the current specifications"),
    textAttr(
      "shaders",
      "Shaders (not one-to-one)",
      SPEC,
      A,
      B,
      "8960 CUDA cores (NVIDIA family specifications)",
      "4096 stream processors, 64 compute units, 64 ray accelerators (AMD)",
    ),
    textAttr("memory", "Memory", SPEC, A, B, "16 GB GDDR7 (NVIDIA family specifications)", "16 GB GDDR6 (AMD)"),
    textAttr("bus", "Memory interface", SPEC, A, B, "256-bit (NVIDIA family specifications)", "256-bit (AMD)"),
    textAttr(
      "bandwidth",
      "Memory bandwidth",
      SPEC,
      A,
      B,
      "896 GB/sec (NVIDIA, May 12, 2025 whitepaper, Table 5). Not in the family specifications table",
      "Up to 640 GB/s (AMD)",
    ),
    textAttr(
      "datarate",
      "Memory data rate",
      SPEC,
      A,
      B,
      "28 Gbps (NVIDIA, May 12, 2025 whitepaper, Table 5)",
      "Up to 20 Gbps (AMD)",
    ),
    textAttr("cache", "Cache", SPEC, A, B, "NVIDIA does not list Infinity Cache", "64 MB Infinity Cache (AMD)"),
    textAttr(
      "clocks",
      "Clocks",
      SPEC,
      A,
      B,
      "Base 2.3 GHz. Boost 2.45 GHz (NVIDIA family specifications). Whitepaper Table 5: 2452 MHz boost",
      "Game 2400 MHz. Boost up to 2970 MHz (AMD). February 28, 2025 release: game 2.4 GHz, boost up to 3.0 GHz",
    ),
    textAttr(
      "power",
      "Board power",
      SPEC,
      A,
      B,
      "300 W total graphics power (NVIDIA family specifications)",
      "304 W typical board power (AMD)",
    ),
    textAttr(
      "psu",
      "System power supply",
      SPEC,
      A,
      B,
      "750 W required system power, based on a Ryzen 9 9950X PC (NVIDIA family specifications)",
      "750 W minimum power supply (AMD)",
    ),
    textAttr(
      "connector",
      "Power connector",
      SPEC,
      A,
      B,
      "2x PCIe 8-pin cables (adapter in box) or one 300 W or greater PCIe Gen 5 cable (NVIDIA)",
      "2x 8-pin (AMD)",
    ),
    textAttr(
      "features",
      "Upscaling and latency features",
      SPEC,
      A,
      B,
      "Marketing copy: DLSS 5. Specifications table: DLSS 4 with Super Resolution, DLAA, Ray Reconstruction, Frame Generation, and Multi Frame Generation. Reflex 2. Frame Warp, Coming Soon (NVIDIA). Whitepaper names DLSS 4",
      "FSR \"Redstone\", Fluid Motion Frames, Radeon Anti-Lag (AMD). February 28, 2025 release names FSR 4 and Fluid Motion Frames 2.1",
    ),
    textAttr(
      "encode",
      "Video encode",
      SPEC,
      A,
      B,
      "2x Ninth Generation NVENC. AV1 encode (NVIDIA family specifications). No quality result",
      "H.264, HEVC, and AV1 encode (AMD). No quality result",
    ),
    textAttr(
      "cuda",
      "CUDA",
      SPEC,
      A,
      B,
      "CUDA Capability 12.0 (NVIDIA family specifications). No local-AI speed result",
      "AMD does not list CUDA",
    ),
    textAttr(
      "display",
      "Bus and display",
      SPEC,
      A,
      B,
      "PCI Express Gen 5. 3x DisplayPort, 1x HDMI. Footnotes: DisplayPort 2.1b, HDMI 2.1b (NVIDIA). Lane count is not listed",
      "PCIe 5.0 x16. DisplayPort 2.1a, HDMI 2.1b (AMD)",
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "rtx-5070-vs-rx-9070-xt",
      title: "RTX 5070 vs RX 9070 XT: Same-Price GPU",
      category: "technology",
    },
    {
      slug: "rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti",
      title: "RTX 5070 vs RX 9070 XT vs RTX 5070 Ti: Which GPU to Buy?",
      category: "technology",
    },
    {
      slug: "rx-9070-vs-rx-9070-xt",
      title: "RX 9070 vs RX 9070 XT: Is the XT GPU Worth It for 1440p?",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "RTX 5070 Ti when software you use needs CUDA Capability 12.0, two NVENC encoders, or NVIDIA's listed DLSS features and today's price gap is worth that. RX 9070 XT when you will not use those listings.",
    keyFact:
      "Both list 16 GB. The GeForce RTX 5070 lists 12 GB. NVIDIA lists 300 W total graphics power and 750 W required system power on the RTX 5070 Ti. AMD lists 304 W typical board power and a 750 W minimum power supply on the RX 9070 XT.",
  },
  citationStats: {
    sourceCount: 6,
    dataPointCount: 52,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "NVIDIA GeForce RTX 5070 family specifications", url: NV_FAMILY },
      { name: "NVIDIA RTX Blackwell GPU architecture whitepaper (May 12, 2025)", url: NV_ARCH },
      { name: "AMD Radeon RX 9070 XT specifications", url: AMD_XT },
      { name: "AMD newsroom: RDNA 4 and Radeon RX 9000 Series (February 28, 2025)", url: AMD_PR },
      { name: "NVIDIA GeForce RTX 5070 family shop", url: NV_SHOP },
      { name: "AMD Radeon where to buy", url: AMD_BUY },
    ],
  },
  resources: [
    {
      type: "external",
      label: "NVIDIA GeForce RTX 5070 family specifications",
      url: NV_FAMILY,
      description:
        "HTML opened 7 November 2026. nv-update-date 2026-09-03. RTX 5070 Ti: Blackwell, 8960 CUDA cores, 16 GB GDDR7, 256-bit, boost 2.45 GHz, base 2.3 GHz, 300 W total graphics power, 750 W required system power, CUDA Capability 12.0, 2x Ninth Generation NVENC, AV1 encode, 1406 AI TOPS, 133 TFLOPS. Specifications table: DLSS 4 features, Reflex 2, Frame Warp Coming Soon. Marketing copy: DLSS 5. GeForce RTX 5070 column: 6144 CUDA cores, 12 GB GDDR7, 192-bit, 2.51 GHz boost, 2.33 GHz base, 250 W, 650 W, 1x Ninth Generation NVENC. No memory-bandwidth row. No price copied.",
    },
    {
      type: "external",
      label: "NVIDIA RTX Blackwell GPU architecture whitepaper (May 12, 2025)",
      url: NV_ARCH,
      description:
        "PDF creation date 2025-05-12. Table 5: RTX 5070 Ti, 8960 CUDA cores, 16 GB GDDR7, 256-bit, 28 Gbps, 896 GB/sec, boost 2452 MHz, 300 W, 2x NVENC 9th Gen, 703/1406 FP4 AI TOPS with the higher figure using sparsity, 133.2 RT TFLOPS. Table 6: GeForce RTX 5070, 12 GB GDDR7, 672 GB/sec, 250 W. The whitepaper names DLSS 4.",
    },
    {
      type: "external",
      label: "AMD Radeon RX 9070 XT specifications",
      url: AMD_XT,
      description:
        "Opened 7 November 2026. og:updated_time 2026-10-19. 64 compute units, 4096 stream processors, 64 ray accelerators, 16 GB GDDR6, 256-bit, up to 640 GB/s, up to 20 Gbps, 64 MB Infinity Cache, game 2400 MHz, boost up to 2970 MHz, 304 W typical board power, 750 W minimum power supply, two 8-pin connectors, FSR \"Redstone\", Fluid Motion Frames, Radeon Anti-Lag, H.264, HEVC, and AV1 encode. Does not list CUDA, NVENC, RDNA 4, or FSR 4.",
    },
    {
      type: "external",
      label: "AMD newsroom: RDNA 4 and Radeon RX 9000 Series (February 28, 2025)",
      url: AMD_PR,
      description:
        "Names RDNA 4 and FSR 4, and Fluid Motion Frames 2.1. Lists the RX 9070 XT game clock at 2.4 GHz and boost up to 3.0 GHz. Boost clock is the maximum on a bursty workload and can vary. Suggested price in that release is not copied.",
    },
    {
      type: "external",
      label: "NVIDIA GeForce RTX 5070 family shop",
      url: NV_SHOP,
      description: "Where to read a current NVIDIA listing. No price is copied.",
    },
    {
      type: "external",
      label: "AMD Radeon where to buy",
      url: AMD_BUY,
      description: "Where to read a current Radeon board-partner listing. No price is copied.",
    },
  ],
  metaTitle: "RTX 5070 Ti vs RX 9070 XT GPU",
});

BUILT.metadata.metaDescription =
  "Pay the RTX 5070 Ti premium only for CUDA, two NVENC encoders, or NVIDIA's listed DLSS features. Both cards list 16 GB. Compare the price gap you see today.";

export const RTX_5070_TI_VS_RX_9070_XT: EditorialComparison = BUILT;
