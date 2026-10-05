import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-157 — Mac mini M6 vs a Windows PC, for video editing and music production.
 * Figures read on 5 October 2026 from apple.com/mac-mini/specs/,
 * the Apple Store Mac mini buy flow, and NVIDIA's GeForce RTX 50 Series
 * laptop specs. No benchmark scores. No page-level winner.
 * /entity/mac-mini and /entity/windows-pc were both noindex, nofollow,
 * so neither hub is linked.
 */

const MAC = "mac-mini";
const PC = "windows-pc";

const MAC_SPECS = "https://www.apple.com/mac-mini/specs/";
const MAC_BUY = "https://www.apple.com/shop/buy-mac/mac-mini";
const NVIDIA = "https://www.nvidia.com/en-us/geforce/laptops/50-series/";

const SOURCE_DATE = "2026-10-05";
const PUBLISHED = "2026-10-05T00:00:00Z";

const SHORT_ANSWER =
  "Choose the Mac mini with M6 for a small, quiet, predictable creator machine: Apple lists a 5.0-by-5.0-inch body that is 2.0 inches high and weighs 1.5 pounds (0.67 kg), an idle sound pressure level of 5 dBA, a Media Engine with hardware-accelerated H.264, HEVC, ProRes, and ProRes RAW, and memory that is configured at purchase. Choose a Windows PC or an RTX laptop if you want to add memory or storage later, need Windows-only plugins or apps, or want NVIDIA's ninth-gen NVENC encoder. Neither is better for everyone; it depends on upgrades, Windows-only software, and which encoder you want.";

const FAQS = [
  {
    question: "Is the Mac mini M6 good for video editing?",
    answer:
      "Apple lists a 12-core CPU with 2 super cores, 4 performance cores, and 6 efficiency cores, a 12-core GPU, and a Media Engine with hardware-accelerated H.264, HEVC, ProRes, and ProRes RAW, plus AV1 decode. It supports up to three external displays over Thunderbolt and HDMI. That fits editing when the memory and storage you configure are enough for the project. It is not a speed score for a particular app.",
  },
  {
    question: "Can I upgrade Mac mini RAM later?",
    answer:
      "Plan as if you cannot. Apple configures M6 unified memory at purchase: 16GB, or 24GB or 32GB. Apple pairs that 24GB or 32GB choice with 170GB/s memory bandwidth. Apple lists 153GB/s on one M6 configuration. The M6 CPU and GPU core counts are not a separate upgrade. Up to 64GB is the M5 Pro model, which Apple configures from 24GB to 48GB or 64GB. Choose the memory when you buy the Mac mini.",
  },
  {
    question: "Is 16GB enough on the Mac mini M6?",
    answer:
      "16GB is Apple's starting unified memory on the M6. For lighter edits it can be a starting point. For heavier timelines, 4K projects, or many plugins, configure 24GB or 32GB when you buy it. That is guidance, not a measurement.",
  },
  {
    question: "Is 256GB enough on the Mac mini M6?",
    answer:
      "Apple lists an M6 configuration with a 256GB SSD, configurable to 512GB, 1TB, or 2TB. Other M6 configurations start at 512GB. 256GB fills up once apps and video files sit on the internal SSD. An external SSD helps. 512GB or more is more comfortable for editing projects. That is guidance, not a measurement.",
  },
  {
    question: "Mac mini or an RTX 5050 or RTX 5060 laptop for OBS and editing?",
    answer:
      "Choose the Mac mini M6 for the small desktop and Apple's Media Engine. Choose an RTX 5050 or RTX 5060 laptop if you want NVIDIA's ninth-gen NVENC encoder and a computer you can carry. NVIDIA says that encoder is for video exports in DaVinci Resolve, Adobe Premiere, and more. NVIDIA says the GeForce RTX 5060 Laptop GPU has 3328 CUDA cores and 8 GB GDDR7, and the GeForce RTX 5050 Laptop GPU has 2560 CUDA cores and 8 GB GDDR7. A desktop Windows PC can take a later memory, SSD, or GPU upgrade. Check OBS and your editor for Apple silicon support before you rely on either machine.",
  },
  {
    question: "Should I switch from Windows for music production?",
    answer:
      "Check each vendor's Apple silicon support before you switch. Do not assume a Windows plugin or app runs natively on the Mac mini. A Windows PC keeps those Windows-only tools, and a desktop's memory, SSD, and GPU can be upgraded later. The Mac mini is the smaller machine, and Apple lists 5 dBA at idle. That idle figure is not a comparison with every Windows PC.",
  },
];

const VERDICT = `Best small, quiet creator desktop: Mac mini with M6. Media Engine for H.264, HEVC, ProRes, and ProRes RAW. Memory is configured at purchase. Apple lists it from $899.

Best if you want upgrades, Windows-only apps, or NVIDIA NVENC: a Windows PC or an RTX 5050 or RTX 5060 laptop.

Neither is better for everyone; it depends on upgrades, Windows-only software, and which encoder you want.`;

const EXPERT_ANALYSIS = `Choose the Mac mini with M6 for a small, quiet, predictable creator machine: Apple lists a 5.0-by-5.0-inch body that is 2.0 inches high and weighs 1.5 pounds (0.67 kg), an idle sound pressure level of 5 dBA, a Media Engine with hardware-accelerated H.264, HEVC, ProRes, and ProRes RAW, and memory that is configured at purchase. Choose a Windows PC or an RTX laptop if you want to add memory or storage later, need Windows-only plugins or apps, or want NVIDIA's ninth-gen NVENC encoder. Neither is better for everyone; it depends on upgrades, Windows-only software, and which encoder you want.

Chip, memory, and the Media Engine

Apple lists the M6 as a 12-core CPU with 2 super cores, 4 performance cores, and 6 efficiency cores, a 12-core GPU, and a Dual 16-core Neural Engine. Apple lists 153GB/s memory bandwidth on one M6 configuration and 170GB/s on another. The Media Engine is hardware-accelerated H.264, HEVC, ProRes, and ProRes RAW, with video decode, video encode, ProRes encode and decode, and AV1 decode. Apple does not offer a different CPU or GPU core count on the M6.

Unified memory on the M6 starts at 16GB and can be configured to 24GB or 32GB. Apple pairs that 24GB or 32GB choice with 170GB/s memory bandwidth. Plan as if you cannot add memory later. The M5 Pro is the model Apple configures from 24GB to 48GB or 64GB, with 307GB/s memory bandwidth. Apple lists that M5 Pro as a 15-core CPU and 16-core GPU, configurable to an 18-core CPU and 20-core GPU. It is a different chip from the M6.

Storage

Apple lists an M6 configuration with a 256GB SSD, configurable to 512GB, 1TB, or 2TB. Other M6 configurations start at 512GB, configurable to 1TB or 2TB. The M5 Pro starts at 512GB and can be configured to 1TB, 2TB, 4TB, or 8TB. 256GB is a tight start for video files. An external SSD helps, and 512GB or more is more comfortable. That is guidance, not a measurement.

Ports, displays, size, and price

On the M6, Apple lists two USB-C ports on the front with USB 3 up to 10Gb/s, a 3.5 mm headphone jack, and on the back a 2.5Gb Ethernet port configurable to 10Gb, an HDMI port, and three Thunderbolt 4 ports up to 40Gb/s. Genlock is not available on the M6. The M5 Pro uses Thunderbolt 5. Apple lists Wi-Fi 7 and Bluetooth 6.

The M6 supports up to three external displays over Thunderbolt and HDMI. With three, two can be up to 6K at 60Hz or 4K at 165Hz, plus a third up to 5K at 60Hz over Thunderbolt or 4K at 60Hz over HDMI. With two, one can be up to 8K at 60Hz or 5K at 120Hz or 4K at 240Hz.

Apple lists the body as 2.0 inches (5.0 cm) high and 5.0 inches (12.7 cm) wide and deep. M6 weight is 1.5 pounds (0.67 kg). The idle sound pressure level is 5 dBA at the operator position. Apple lists the M6 Mac mini from $899. Apple lists the M5 Pro 15-core CPU and 16-core GPU from $1,699, and the M5 Pro 18-core CPU and 20-core GPU from $1,899. Check the current price.

Windows PC or an RTX laptop

A desktop Windows PC can take more memory, a larger SSD, or a different GPU later. That is the upgrade path the Mac mini does not offer for its memory. NVIDIA says GeForce RTX 50 Series laptops use a ninth-gen NVIDIA Encoder (NVENC) for video exports in DaVinci Resolve, Adobe Premiere, and more. NVIDIA says the GeForce RTX 5060 Laptop GPU has 3328 CUDA cores and 8 GB GDDR7, and the GeForce RTX 5050 Laptop GPU has 2560 CUDA cores and 8 GB GDDR7. Those figures are for the laptop GPUs. A desktop GPU is a different part.

For music production, check each vendor's Apple silicon support before you switch. A Windows-only plugin or app is a reason to keep a Windows PC. MacBook Air vs iPad Air covers a different Apple pair, a laptop and a tablet.`;

const SPEC = "Specs";

export const MAC_MINI_M6_VS_WINDOWS_PC: EditorialComparison = buildEditorialComparison({
  slug: "mac-mini-m6-vs-windows-pc",
  title: "Mac mini M6 vs Windows PC: Video and Music",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: MAC,
      slug: MAC,
      name: "Mac mini",
      shortDesc: "M6 desktop with a Media Engine, memory configured at purchase, from $899.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Media Engine: hardware-accelerated H.264, HEVC, ProRes, and ProRes RAW (Apple)",
        "12-core CPU and 12-core GPU, with 16GB configurable to 24GB or 32GB (Apple)",
        "5.0-by-5.0-inch body, 2.0 inches high, 1.5 pounds, 5 dBA at idle (Apple)",
        "From $899 (Apple)",
      ],
      cons: [
        "Plan as if memory cannot be added later",
        "256GB is the smallest M6 SSD",
        "Windows-only plugins and apps need a Windows PC",
      ],
      bestFor: "Best for a small, quiet creator desktop with the Media Engine",
    },
    {
      id: PC,
      slug: PC,
      name: "Windows PC",
      shortDesc: "A desktop you can upgrade later, or an RTX 5050 or RTX 5060 laptop with NVENC.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "A desktop's memory, SSD, and GPU can be upgraded later",
        "Ninth-gen NVENC on GeForce RTX 50 Series laptops, for DaVinci Resolve and Adobe Premiere (NVIDIA)",
        "RTX 5060 Laptop GPU: 3328 CUDA cores and 8 GB GDDR7 (NVIDIA)",
        "RTX 5050 Laptop GPU: 2560 CUDA cores and 8 GB GDDR7 (NVIDIA)",
      ],
      cons: [
        "Size, weight, and idle noise depend on the PC",
        "Laptop CUDA cores and memory are the laptop GPUs, not every desktop card",
        "Apple silicon support still has to be confirmed for each app if you also keep a Mac",
      ],
      bestFor: "Best if you want upgrades, Windows-only apps, or NVIDIA NVENC",
    },
  ],
  keyDifferences: [
    {
      label: "Video encoder",
      entityAValue: "Media Engine: H.264, HEVC, ProRes, ProRes RAW",
      entityBValue: "Ninth-gen NVENC on RTX 50 Series laptops",
      winner: "tie",
    },
    {
      label: "Memory",
      entityAValue: "16GB, configurable to 24GB or 32GB at purchase",
      entityBValue: "A desktop can take more memory later",
      winner: "tie",
    },
    {
      label: "Size",
      entityAValue: "2.0 x 5.0 x 5.0 inches, 1.5 pounds",
      entityBValue: "Depends on the PC",
      winner: "tie",
    },
    {
      label: "Starting price",
      entityAValue: "M6 from $899",
      entityBValue: "Depends on the PC",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "chip",
      "Chip",
      SPEC,
      MAC,
      PC,
      "M6: 12-core CPU (2 super, 4 performance, 6 efficiency), 12-core GPU, Dual 16-core Neural Engine. 153GB/s or 170GB/s. M5 Pro is a separate chip, up to 18-core CPU and 20-core GPU, 307GB/s",
      "Depends on the CPU. RTX 5050 and RTX 5060 laptops add NVIDIA's ninth-gen NVENC"
    ),
    textAttr(
      "memory",
      "Memory",
      SPEC,
      MAC,
      PC,
      "M6: 16GB unified memory, configurable to 24GB or 32GB (170GB/s). M5 Pro: 24GB, configurable to 48GB or 64GB",
      "A desktop's memory can be upgraded later"
    ),
    textAttr(
      "storage",
      "Storage",
      SPEC,
      MAC,
      PC,
      "One M6 configuration: 256GB SSD, configurable to 512GB, 1TB, or 2TB. Other M6 configurations start at 512GB. M5 Pro starts at 512GB, up to 8TB",
      "A desktop SSD can be upgraded later"
    ),
    textAttr(
      "encoder",
      "Video encoder",
      SPEC,
      MAC,
      PC,
      "Media Engine: hardware-accelerated H.264, HEVC, ProRes, and ProRes RAW. AV1 decode",
      "Ninth-gen NVENC for DaVinci Resolve, Adobe Premiere, and more. RTX 5060 Laptop GPU: 3328 CUDA cores, 8 GB GDDR7. RTX 5050 Laptop GPU: 2560 CUDA cores, 8 GB GDDR7"
    ),
    textAttr(
      "displays",
      "External displays",
      SPEC,
      MAC,
      PC,
      "M6: up to three over Thunderbolt and HDMI. Three: two up to 6K at 60Hz or 4K at 165Hz, plus a third up to 5K at 60Hz over Thunderbolt or 4K at 60Hz over HDMI",
      "Depends on the GPU"
    ),
    textAttr(
      "ports",
      "Ports",
      SPEC,
      MAC,
      PC,
      "M6 front: two USB-C (USB 3 up to 10Gb/s), 3.5 mm headphone jack. Back: 2.5Gb Ethernet configurable to 10Gb, HDMI, three Thunderbolt 4 up to 40Gb/s. Genlock is not available on the M6",
      "Depends on the PC"
    ),
    textAttr(
      "size",
      "Size and noise",
      SPEC,
      MAC,
      PC,
      "2.0 x 5.0 x 5.0 inches (5.0 x 12.7 x 12.7 cm). M6: 1.5 pounds (0.67 kg). 5 dBA at idle",
      "Depends on the PC"
    ),
    textAttr(
      "price",
      "Price",
      SPEC,
      MAC,
      PC,
      "M6 from $899. M5 Pro 15-core CPU and 16-core GPU from $1,699. M5 Pro 18-core CPU and 20-core GPU from $1,899",
      "Depends on the PC"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "macbook-air-vs-ipad-air",
      title: "MacBook Air vs iPad Air: Which Second Device?",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Mac mini M6 for a small creator desktop with the Media Engine and memory chosen at purchase. A Windows PC or RTX laptop for later upgrades, Windows-only apps, or NVIDIA NVENC.",
    keyFact:
      "Apple lists hardware-accelerated H.264, HEVC, ProRes, and ProRes RAW on the M6 Media Engine. NVIDIA says the RTX 5060 Laptop GPU has 3328 CUDA cores and 8 GB GDDR7, and the RTX 5050 Laptop GPU has 2560 CUDA cores and 8 GB GDDR7.",
  },
  citationStats: {
    sourceCount: 3,
    dataPointCount: 14,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Apple Mac mini specs", url: MAC_SPECS },
      { name: "Apple Store Mac mini", url: MAC_BUY },
      { name: "NVIDIA GeForce RTX 50 Series laptops", url: NVIDIA },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Apple Mac mini specs",
      url: MAC_SPECS,
      description:
        "M6 12-core CPU and 12-core GPU. Media Engine for H.264, HEVC, ProRes, and ProRes RAW, plus AV1 decode. 16GB configurable to 24GB or 32GB. 153GB/s and 170GB/s. 256GB configurable to 2TB. Up to three displays. Thunderbolt 4. 2.0 x 5.0 x 5.0 inches, 1.5 pounds, 5 dBA at idle. M5 Pro up to 64GB.",
    },
    {
      type: "external",
      label: "Apple Store Mac mini",
      url: MAC_BUY,
      description:
        "M6 from $899. M5 Pro 15-core CPU and 16-core GPU from $1,699. M5 Pro 18-core CPU and 20-core GPU from $1,899.",
    },
    {
      type: "external",
      label: "NVIDIA GeForce RTX 50 Series laptops",
      url: NVIDIA,
      description:
        "Ninth-gen NVENC for DaVinci Resolve, Adobe Premiere, and more. RTX 5060 Laptop GPU: 3328 CUDA cores and 8 GB GDDR7. RTX 5050 Laptop GPU: 2560 CUDA cores and 8 GB GDDR7.",
    },
  ],
  metaTitle: "Mac mini M6 vs Windows PC | A Versus B",
});
