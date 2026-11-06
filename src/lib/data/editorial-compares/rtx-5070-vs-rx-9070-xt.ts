import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-388 — RTX 5070 vs RX 9070 XT when the two cards cost about the same.
 * Opened 6 November 2026 (Asia/Jerusalem).
 *
 * RTX 5070 and RTX 5070 Ti specs: NVIDIA GeForce RTX 5070 family page.
 * The summary table on that page labels DLSS as DLSS 5. The detailed
 * technology table labels DLSS 4 and lists its feature names. Both labels
 * are repeated here. That split is a naming difference, not a hardware con.
 * Bandwidth is also in the May 12, 2025 RTX Blackwell architecture
 * whitepaper: Table 6 (pages 54–55) lists 672 GB/sec for the RTX 5070, and
 * Table 5 (pages 51–52) lists 896 GB/sec for the RTX 5070 Ti. The whitepaper
 * names the feature DLSS 4. No price is copied from the shop module.
 *
 * RX 9070 XT and RX 9070 specs: AMD product specifications opened the same day.
 * RDNA 4, the February 2025 boost figure of up to 3.0 GHz, and the name FSR 4
 * come from AMD's February 28, 2025 newsroom release. The current XT product
 * specifications list a boost clock up to 2970 MHz and FSR "Redstone".
 *
 * Frame rate, one dated test only: TechSpot, 25 May 2025, 57 games, Ryzen 7
 * 9800X3D, GeForce driver 576.40, Adrenalin 25.5.1. Averages are 17% at 1440p
 * and 21% at 4K. Hunt: Showdown 1896 went the other way. No shelf prices from
 * that article. No raster or ray-tracing crown. More memory is not described
 * as a speed result. No latency number. No encode-quality claim.
 *
 * The citation bar's 46 data points are the primary facts locked by the page
 * test. They are not a benchmark sample size.
 * r/PcBuild comments returned HTTP 403, so there is no community block.
 * The shared Analysis heading and "Drafted with AI from web research." come
 * from ExpertAnalysis. winnerName stays null. isHumanReviewed stays false.
 */

const A = "rtx-5070";
const B = "rx-9070-xt";

const NV_FAMILY = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/";
const NV_ARCH =
  "https://images.nvidia.com/aem-dam/Solutions/geforce/blackwell/nvidia-rtx-blackwell-gpu-architecture.pdf";
const NV_SHOP = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/#shop-all";
const AMD_XT =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070xt.html";
const AMD_9070 =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070.html";
const AMD_PR =
  "https://www.amd.com/en/newsroom/press-releases/2025-2-28-amd-unveils-next-generation-amd-rdna-4-architectu.html";
const AMD_BUY = "https://www.amd.com/en/where-to-buy/graphics/radeon.html";
const TECHSPOT = "https://www.techspot.com/review/2991-amd-radeon-9070-xt-vs-nvidia-rtx-5070/";

const SOURCE_DATE = "2026-11-06";
const PUBLISHED = "2026-11-06T00:00:00Z";
const SPEC = "Specs";

const SHORT_ANSWER =
  "When the GeForce RTX 5070 and the Radeon RX 9070 XT cost about the same, choose the RX 9070 XT for 16 GB of GDDR6 and choose the RTX 5070 for NVIDIA's listed DLSS features, Reflex, and one ninth-generation NVENC encoder. Neither card is right for everyone: NVIDIA lists 12 GB of GDDR7 and 250 W total graphics power on the RTX 5070, and AMD lists 16 GB of GDDR6 and 304 W typical board power on the RX 9070 XT.";

const FAQS = [
  {
    question: "At the same price, which should I buy, the RTX 5070 or the RX 9070 XT?",
    answer:
      "It depends. Choose the RX 9070 XT when you want 16 GB of GDDR6 and your power supply meets AMD's 750 W minimum. Choose the RTX 5070 when you want NVIDIA's listed DLSS features, Reflex, and one ninth-generation NVENC encoder, and 12 GB of GDDR7 is enough for what you run. Neither card is right for everyone. Compare the models on sale today, because store prices change.",
  },
  {
    question: "Does the RX 9070 XT have more memory than the RTX 5070?",
    answer:
      "Yes. AMD lists 16 GB of GDDR6 on a 256-bit interface, with 64 MB of Infinity Cache, for the RX 9070 XT. NVIDIA lists 12 GB of GDDR7 on a 192-bit interface, with 672 GB/sec of memory bandwidth, for the RTX 5070. AMD lists memory bandwidth up to 640 GB/s. That is a capacity and bus difference. It is not a frame-rate result, and more memory does not by itself make a card faster.",
  },
  {
    question: "Which card uses more power, the RTX 5070 or the RX 9070 XT?",
    answer:
      "The RX 9070 XT. AMD lists 304 W typical board power, a 750 W minimum power supply, and two 8-pin connectors. NVIDIA lists 250 W total graphics power and 650 W required system power for the RTX 5070, with two PCIe 8-pin cables or one 300 W or greater PCIe Gen 5 cable. NVIDIA says that 650 W figure is based on a PC with a Ryzen 9 9950X processor and that the requirement can change with the rest of the PC. Add-in-card specifications can vary.",
  },
  {
    question: "Is the RTX 5070 Ti the same card as the RTX 5070?",
    answer:
      "No. On NVIDIA's RTX 5070 family specifications, the RTX 5070 Ti has 8,960 CUDA cores, 16 GB of GDDR7 on a 256-bit interface, 896 GB/sec of memory bandwidth, a 2.45 GHz boost clock, 300 W total graphics power, 750 W required system power, and two ninth-generation NVENC encoders. The RTX 5070 has 6,144 CUDA cores, 12 GB of GDDR7, 672 GB/sec, a 2.51 GHz boost clock, 250 W, 650 W, and one ninth-generation NVENC encoder. RTX 5070 vs RX 9070 XT vs RTX 5070 Ti covers all three.",
  },
  {
    question: "Is the RX 9070 the same card as the RX 9070 XT?",
    answer:
      "No. AMD's product specifications list 56 compute units, 3,584 stream processors, a 2070 MHz game clock, a boost clock up to 2520 MHz, 220 W typical board power, and a 650 W minimum power supply for the RX 9070. The RX 9070 XT lists 64 compute units, 4,096 stream processors, a 2400 MHz game clock, a boost clock up to 2970 MHz, 304 W, and a 750 W minimum. Both list 16 GB of GDDR6. RX 9070 vs RX 9070 XT compares those two AMD cards.",
  },
  {
    question: "How do these cards compare in a published frame-rate test?",
    answer:
      "TechSpot's May 25, 2025 test, on a Ryzen 7 9800X3D with GeForce Game Ready driver 576.40 and Adrenalin 25.5.1, measured the RX 9070 XT 17% faster on average than the RTX 5070 at 1440p and 21% faster on average at 4K across 57 games. TechSpot did not publish one shared preset for that average. In Hunt: Showdown 1896, at maximum settings and native resolution, TechSpot measured the RX 9070 XT 12% slower at 1440p. That spread is not a speed guarantee from the extra memory, and the shelf prices TechSpot reported in May 2025 are not today's prices.",
  },
];

const VERDICT = `Choose the RX 9070 XT when the two cards cost about the same and you want 16 GB of GDDR6. AMD lists a 256-bit interface, 64 MB of Infinity Cache, 304 W typical board power, and a 750 W minimum power supply.

Choose the RTX 5070 when you want NVIDIA's listed DLSS features, Reflex, and one ninth-generation NVENC encoder. NVIDIA lists 12 GB of GDDR7, 250 W total graphics power, and 650 W required system power.

Neither card is right for everyone. The RTX 5070 Ti and the RX 9070 are different cards. Store prices change, so compare the models you can buy today.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Use three checks when the prices are close: memory capacity, the feature stack, and the power supply. Neither card is right for everyone. The RTX 5070 Ti and the non-XT RX 9070 are different products, covered below. Store prices move, so compare the exact models on sale today.

AMD lists 16 GB of GDDR6, a 256-bit interface, and 64 MB of Infinity Cache on the RX 9070 XT. NVIDIA lists 12 GB of GDDR7, a 192-bit interface, and 672 GB/sec of memory bandwidth on the RTX 5070. NVIDIA's May 12, 2025 RTX Blackwell GPU architecture whitepaper, Table 6, also lists 672 GB/sec for the RTX 5070, and Table 5 lists 896 GB/sec for the RTX 5070 Ti. AMD lists memory bandwidth up to 640 GB/s. Choose the RX 9070 XT when you want the larger memory configuration. Choose the RTX 5070 when 12 GB of GDDR7 is enough for the games and apps you run. More memory does not by itself make a card faster.

NVIDIA's family specifications label DLSS as DLSS 5 in the summary table. The detailed technology table labels DLSS 4 and lists Super Resolution, DLAA, Ray Reconstruction, Frame Generation, and Multi Frame Generation. Reflex 2 is listed, with a low-latency mode, and Frame Warp is marked coming soon. The RTX 5070 has one ninth-generation NVENC encoder and AV1 encode. AMD's current RX 9070 XT specifications list FSR "Redstone", Fluid Motion Frames, and Radeon Anti-Lag, plus H.264, HEVC, and AV1 encode. AMD's February 28, 2025 release names FSR 4. No latency number and no encode-quality result belong in this matchup.

Power is the third check. AMD lists 304 W typical board power, a 750 W minimum power supply, and two 8-pin connectors for the RX 9070 XT. NVIDIA lists 250 W total graphics power and 650 W required system power for the RTX 5070. The 650 W figure is based on a PC with a Ryzen 9 9950X, and NVIDIA says the requirement can change with the rest of the PC. The RTX 5070 uses two PCIe 8-pin cables, with an adapter in the box, or one 300 W or greater PCIe Gen 5 cable. NVIDIA's reference card is 242 mm long, 112 mm wide, and two slots. Add-in-card specifications can vary.

NVIDIA lists Blackwell, 6,144 CUDA cores, a 2.33 GHz base clock, and a 2.51 GHz boost clock for the RTX 5070. AMD's February 28, 2025 release calls the RX 9070 XT an RDNA 4 card. AMD's current product specifications list 64 compute units, 4,096 stream processors, a 2400 MHz game clock, and a boost clock up to 2970 MHz. The February 28, 2025 release lists a boost clock up to 3.0 GHz and says that figure is the maximum on a bursty workload and can vary with heat and the workload. CUDA cores and stream processors are different architectures, so the counts are not a one-to-one speed comparison. NVIDIA lists PCI Express Gen 5, three DisplayPort 2.1b connectors, and one HDMI 2.1b connector. AMD lists PCIe 5.0 x16, DisplayPort 2.1a, and HDMI 2.1b.

TechSpot's May 25, 2025 test used a Ryzen 7 9800X3D, GeForce Game Ready driver 576.40, and Adrenalin 25.5.1. Across 57 games, TechSpot measured the RX 9070 XT 17% faster on average than the RTX 5070 at 1440p and 21% faster on average at 4K. TechSpot did not publish one shared preset for that average. In Hunt: Showdown 1896, at maximum settings and native resolution, the RX 9070 XT was 12% slower at 1440p. Read those averages with that spread. They are not a raster crown, a ray-tracing crown, or a claim that 16 GB is why the average moved. Shelf prices in that May 2025 article are not today's prices.

The RTX 5070 Ti is a different NVIDIA card. The same family specifications list 8,960 CUDA cores, 16 GB of GDDR7 on a 256-bit interface, 896 GB/sec, a 2.45 GHz boost clock, 300 W total graphics power, 750 W required system power, and two ninth-generation NVENC encoders. RTX 5070 vs RX 9070 XT vs RTX 5070 Ti is the three-card matchup. The non-XT RX 9070 is a different AMD card: 56 compute units, 3,584 stream processors, a 2070 MHz game clock, a boost clock up to 2520 MHz, 220 W typical board power, and a 650 W minimum power supply, with 16 GB of GDDR6. RX 9070 vs RX 9070 XT compares those two. RX 9060 XT vs RX 9070 XT is the step down inside AMD's lineup.`;

const BUILT = buildEditorialComparison({
  slug: "rtx-5070-vs-rx-9070-xt",
  title: "RTX 5070 vs RX 9070 XT: Same-Price GPU",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "RTX 5070",
      shortDesc: "Blackwell card with 12 GB of GDDR7, 6,144 CUDA cores, and 250 W total graphics power.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "DLSS features, Reflex 2, and one ninth-generation NVENC encoder with AV1 encode (NVIDIA)",
        "250 W total graphics power and 650 W required system power (NVIDIA)",
        "12 GB GDDR7, 192-bit, 672 GB/sec (NVIDIA)",
      ],
      cons: [
        "12 GB of memory, against 16 GB on the RX 9070 XT (NVIDIA, AMD)",
      ],
      bestFor: "Same-price buy when you want NVIDIA's listed features and a 250 W card",
    },
    {
      id: B,
      slug: B,
      name: "RX 9070 XT",
      shortDesc: "RDNA 4 card with 16 GB of GDDR6, 64 compute units, and 304 W typical board power.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "16 GB GDDR6, 256-bit, 64 MB Infinity Cache (AMD)",
        "H.264, HEVC, and AV1 encode (AMD)",
        "64 compute units and 4,096 stream processors (AMD)",
      ],
      cons: [
        "304 W typical board power and a 750 W minimum power supply (AMD)",
        "No DLSS. Current specifications list FSR \"Redstone\" (AMD)",
      ],
      bestFor: "Same-price buy when you want 16 GB and can power a 304 W card",
    },
  ],
  keyDifferences: [
    {
      label: "Memory",
      entityAValue: "12 GB GDDR7, 192-bit, 672 GB/sec",
      entityBValue: "16 GB GDDR6, 256-bit, up to 640 GB/s, 64 MB Infinity Cache",
      winner: "tie",
    },
    {
      label: "Board power",
      entityAValue: "250 W total graphics power",
      entityBValue: "304 W typical board power",
      winner: "tie",
    },
    {
      label: "Power supply",
      entityAValue: "650 W required system power",
      entityBValue: "750 W minimum",
      winner: "tie",
    },
    {
      label: "Upscaling features",
      entityAValue: "DLSS 5 in the summary table; DLSS 4 features in the detailed table",
      entityBValue: "FSR \"Redstone\" on current specifications; FSR 4 in the February 28, 2025 release",
      winner: "tie",
    },
    {
      label: "Video encode",
      entityAValue: "1x ninth-generation NVENC, AV1 encode",
      entityBValue: "H.264, HEVC, and AV1 encode",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("arch", "Architecture", SPEC, A, B, "Blackwell (NVIDIA)", "RDNA 4 (AMD, February 28, 2025)"),
    textAttr(
      "shaders",
      "Shaders (not one-to-one)",
      SPEC,
      A,
      B,
      "6,144 CUDA cores (NVIDIA)",
      "4,096 stream processors, 64 compute units (AMD)",
    ),
    textAttr("memory", "Memory", SPEC, A, B, "12 GB GDDR7 (NVIDIA)", "16 GB GDDR6 (AMD)"),
    textAttr("bus", "Memory interface", SPEC, A, B, "192-bit (NVIDIA)", "256-bit (AMD)"),
    textAttr("bandwidth", "Memory bandwidth", SPEC, A, B, "672 GB/sec (NVIDIA)", "Up to 640 GB/s (AMD)"),
    textAttr("cache", "Cache", SPEC, A, B, "NVIDIA does not list Infinity Cache", "64 MB Infinity Cache (AMD)"),
    textAttr(
      "clocks",
      "Clocks",
      SPEC,
      A,
      B,
      "Base 2.33 GHz. Boost 2.51 GHz (NVIDIA)",
      "Game 2400 MHz. Boost up to 2970 MHz (AMD product specifications). February 28, 2025 release: boost up to 3.0 GHz",
    ),
    textAttr("power", "Board power", SPEC, A, B, "250 W total graphics power (NVIDIA)", "304 W typical board power (AMD)"),
    textAttr(
      "psu",
      "Power supply",
      SPEC,
      A,
      B,
      "650 W required system power, based on a Ryzen 9 9950X PC (NVIDIA)",
      "750 W minimum (AMD)",
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
      "Summary table: DLSS 5. Detailed table: DLSS 4 with Super Resolution, DLAA, Ray Reconstruction, Frame Generation, and Multi Frame Generation. Reflex 2, low-latency mode, Frame Warp coming soon (NVIDIA)",
      "FSR \"Redstone\", Fluid Motion Frames, Radeon Anti-Lag (AMD product specifications). February 28, 2025 release names FSR 4",
    ),
    textAttr(
      "encode",
      "Video encode",
      SPEC,
      A,
      B,
      "1x ninth-generation NVENC. AV1 encode (NVIDIA). No quality result",
      "H.264, HEVC, and AV1 encode (AMD). No quality result",
    ),
    textAttr(
      "display",
      "Bus and display",
      SPEC,
      A,
      B,
      "PCI Express Gen 5. 3x DisplayPort 2.1b, 1x HDMI 2.1b (NVIDIA)",
      "PCIe 5.0 x16. DisplayPort 2.1a, HDMI 2.1b (AMD)",
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti",
      title: "RTX 5070 vs RX 9070 XT vs RTX 5070 Ti",
      category: "technology",
    },
    {
      slug: "rx-9070-vs-rx-9070-xt",
      title: "RX 9070 vs RX 9070 XT",
      category: "technology",
    },
    {
      slug: "rx-9060-xt-vs-rx-9070-xt",
      title: "RX 9060 XT vs RX 9070 XT",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "RX 9070 XT when you want 16 GB of GDDR6 and can meet a 750 W minimum. RTX 5070 when you want NVIDIA's listed DLSS features, Reflex, and a 250 W card.",
    keyFact:
      "NVIDIA lists 12 GB GDDR7 and 250 W on the RTX 5070. AMD lists 16 GB GDDR6 and 304 W on the RX 9070 XT. Neither card is right for everyone.",
  },
  citationStats: {
    sourceCount: 8,
    dataPointCount: 46,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "NVIDIA GeForce RTX 5070 family specifications", url: NV_FAMILY },
      { name: "NVIDIA RTX Blackwell GPU architecture whitepaper (May 12, 2025)", url: NV_ARCH },
      { name: "AMD Radeon RX 9070 XT specifications", url: AMD_XT },
      { name: "AMD Radeon RX 9070 specifications", url: AMD_9070 },
      { name: "AMD newsroom: RDNA 4 and Radeon RX 9000 Series (February 28, 2025)", url: AMD_PR },
      { name: "TechSpot: RX 9070 XT vs RTX 5070, 57 games (May 25, 2025)", url: TECHSPOT },
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
        "RTX 5070: Blackwell, 6,144 CUDA cores, 12 GB GDDR7, 192-bit, 672 GB/sec, boost 2.51 GHz, base 2.33 GHz, 250 W, 650 W, one ninth-generation NVENC, AV1 encode. Summary table labels DLSS 5. Detailed table labels DLSS 4 features and Reflex 2. RTX 5070 Ti is a separate row: 8,960 CUDA cores, 16 GB GDDR7, 300 W, two NVENC encoders.",
    },
    {
      type: "external",
      label: "NVIDIA RTX Blackwell GPU architecture whitepaper (May 12, 2025)",
      url: NV_ARCH,
      description:
        "Table 6, pages 54–55: RTX 5070, 672 GB/sec, 12 GB GDDR7, 192-bit, 6,144 CUDA cores, 250 W, one 9th-gen NVENC. Table 5, pages 51–52: RTX 5070 Ti, 896 GB/sec, 16 GB GDDR7, 8,960 CUDA cores, 300 W, two 9th-gen NVENC encoders. The whitepaper names the feature DLSS 4.",
    },
    {
      type: "external",
      label: "AMD Radeon RX 9070 XT specifications",
      url: AMD_XT,
      description:
        "64 compute units, 4,096 stream processors, 16 GB GDDR6, 256-bit, up to 640 GB/s, 64 MB Infinity Cache, game clock 2400 MHz, boost up to 2970 MHz, 304 W typical board power, 750 W minimum power supply, two 8-pin connectors, FSR \"Redstone\", Fluid Motion Frames, Radeon Anti-Lag, AV1 encode.",
    },
    {
      type: "external",
      label: "AMD Radeon RX 9070 specifications",
      url: AMD_9070,
      description:
        "Different card from the XT: 56 compute units, 3,584 stream processors, game clock 2070 MHz, boost up to 2520 MHz, 220 W typical board power, 650 W minimum power supply, 16 GB GDDR6.",
    },
    {
      type: "external",
      label: "AMD newsroom: RDNA 4 and Radeon RX 9000 Series (February 28, 2025)",
      url: AMD_PR,
      description:
        "Names RDNA 4 and FSR 4. Lists the RX 9070 XT boost clock up to 3.0 GHz and says boost clock is the maximum on a bursty workload and can vary. Game clock 2.4 GHz matches the current 2400 MHz listing.",
    },
    {
      type: "external",
      label: "TechSpot: RX 9070 XT vs RTX 5070, 57 games (May 25, 2025)",
      url: TECHSPOT,
      description:
        "Ryzen 7 9800X3D, GeForce driver 576.40, Adrenalin 25.5.1. Average: RX 9070 XT 17% faster at 1440p and 21% faster at 4K across 57 games. Hunt: Showdown 1896 at maximum native settings: RX 9070 XT 12% slower at 1440p. No single shared preset for the average.",
    },
    {
      type: "external",
      label: "NVIDIA GeForce RTX 5070 family shop",
      url: NV_SHOP,
      description: "Where to check a current NVIDIA listing. No price is copied.",
    },
    {
      type: "external",
      label: "AMD Radeon where to buy",
      url: AMD_BUY,
      description: "Where to check a current AMD board-partner listing. No price is copied.",
    },
  ],
  metaTitle: "RTX 5070 vs RX 9070 XT Same-Price GPU",
});

BUILT.metadata.metaDescription =
  "At a similar price, the RX 9070 XT lists 16 GB GDDR6 and 304 W, and the RTX 5070 lists 12 GB GDDR7 and 250 W. Compare VRAM, features, and power.";

export const RTX_5070_VS_RX_9070_XT: EditorialComparison = BUILT;
