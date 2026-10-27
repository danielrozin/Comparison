import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-325 — RTX 5060 (8 GB) vs RX 9060 XT 16GB at the same price.
 * Read on 27 October 2026 from NVIDIA's RTX 5060 family specs, NVIDIA's
 * RTX 50 Series desktop compare table (memory bandwidth), NVIDIA's
 * 19 May 2025 "GeForce RTX 5060 Out Now" article (starting at $299),
 * AMD's RX 9060 XT product specs and AMD's 20 May 2025 press release
 * ($349 SEP for the 16GB model). AMD calls $349 a suggested price (SEP).
 * Dropped from the brief: NVENC "wider app support" (no vendor source),
 * Android emulator / Flutter claims, ROCm vs CUDA software-support claims,
 * AM4 / PCIe 4.0 lane claims for the RTX 5060 (NVIDIA lists PCIe Gen 5
 * only, no lane count), the thread's YouTube percentage and all vendor fps
 * marketing figures. No fps numbers, no percentages, no street prices,
 * no winner.
 */

const A = "rtx-5060";
const B = "rx-9060-xt";

const NV_SPEC = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5060-family/";
const NV_COMPARE = "https://www.nvidia.com/en-us/geforce/graphics-cards/compare/";
const NV_NEWS = "https://www.nvidia.com/en-us/geforce/news/rtx-5060-out-now/";
const AMD_SPEC = "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9060xt.html";
const AMD_PR =
  "https://www.amd.com/en/newsroom/press-releases/2025-5-20-amd-introduces-new-radeon-graphics-cards-and-ryzen.html";

const NV_SHOP = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5060-family/#shop";
const AMD_BUY = "https://www.amd.com/en/where-to-buy/graphics/radeon.html";

const SOURCE_DATE = "2026-10-27";
const PUBLISHED = "2026-10-27T00:00:00Z";

const NV_PRICE = "$299 launch price (MSRP), per NVIDIA, May 2025";
const AMD_PRICE = "$349 launch suggested price (SEP), per AMD, May 2025";

const SHORT_ANSWER =
  "If both cost the same, the Radeon RX 9060 XT 16GB is the better pick for most gamers: AMD lists 16 GB of GDDR6, twice the 8 GB of GDDR7 NVIDIA lists for the GeForce RTX 5060, and graphics card memory cannot be upgraded later. Pick the RTX 5060 if you need NVIDIA software such as CUDA apps or DLSS Multi Frame Generation, or if you want its faster memory: NVIDIA lists 448 GB/sec against up to 320 GB/s for the RX 9060 XT. Neither card is right for everyone; it comes down to memory size against NVIDIA's software.";

const FAQS = [
  {
    question: "Is the RX 9060 XT 16GB better than the RTX 5060?",
    answer:
      "At the same price it suits most gamers better, because AMD lists 16 GB of GDDR6 against 8 GB of GDDR7 for the RTX 5060 per NVIDIA. The RTX 5060 is the better pick if you rely on NVIDIA software such as CUDA apps or DLSS Multi Frame Generation. For in-game results, use independent reviews that state their test system and settings.",
  },
  {
    question: "Is 8 GB of VRAM enough for 1080p gaming?",
    answer:
      "For many games it is, but newer games at high texture settings can need more than 8 GB. When a game runs out of graphics memory, data spills into slower system memory, which can cause stutter. Graphics card memory cannot be upgraded, so 16 GB leaves more room over the life of the card.",
  },
  {
    question: "Does the RTX 5060 have faster memory than the RX 9060 XT?",
    answer:
      "Yes. NVIDIA lists 448 GB/sec of memory bandwidth for the RTX 5060's 8 GB of GDDR7. AMD lists up to 320 GB/s for the RX 9060 XT's 16 GB of GDDR6, plus 32 MB of AMD Infinity Cache. Both use a 128-bit memory interface. Faster memory does not make up for running out of memory.",
  },
  {
    question: "Which uses less power, the RTX 5060 or the RX 9060 XT?",
    answer:
      "NVIDIA lists 145 W total graphics power and 550 W required system power for the RTX 5060. AMD lists 160 W typical board power and a 450W minimum PSU recommendation for the RX 9060 XT 16GB. The two vendors rate power differently, so treat each figure as that vendor's own rating.",
  },
  {
    question: "Which is better for streaming, the RTX 5060 or the RX 9060 XT?",
    answer:
      "Both support AV1 hardware encoding. NVIDIA lists one ninth-generation NVENC encoder with AV1 encode on the RTX 5060, and AMD lists AV1, H.265/HEVC and H.264 encode on the RX 9060 XT. Check which encoders your streaming app supports before you choose.",
  },
  {
    question: "Which is better for local AI tools?",
    answer:
      "More memory lets you load larger models, which favours the 16 GB RX 9060 XT. Many AI tools are built for NVIDIA CUDA first, and NVIDIA lists CUDA Capability 12.0 for the RTX 5060, while AMD does not list CUDA for the RX 9060 XT. Check which graphics cards your AI tool supports before you buy.",
  },
];

const VERDICT = `Best for memory at the same price: RX 9060 XT 16GB. AMD lists 16 GB of GDDR6 with 32 MB of Infinity Cache, 160 W typical board power and a 450W minimum PSU.

Best for NVIDIA software: RTX 5060. NVIDIA lists 8 GB of GDDR7 at 448 GB/sec, DLSS 4 with Multi Frame Generation, CUDA and a ninth-generation NVENC encoder.

Neither is right for everyone. Street prices change daily, so compare current listings for the exact models.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- At the same price, memory size is the deciding spec: AMD lists 16 GB of GDDR6 on the RX 9060 XT 16GB, and NVIDIA lists 8 GB of GDDR7 on the RTX 5060.
- The RTX 5060 has faster memory: 448 GB/sec per NVIDIA, against up to 320 GB/s plus 32 MB of Infinity Cache per AMD.
- The RTX 5060 is the pick for NVIDIA software such as CUDA apps and DLSS Multi Frame Generation; AMD does not list DLSS or CUDA for the RX 9060 XT.
- Both cards support AV1 hardware encoding, so both suit streaming.
- Check your power supply: NVIDIA lists 550 W required system power for the RTX 5060, and AMD lists a 450W minimum PSU for the RX 9060 XT.
- Launch prices were ${NV_PRICE}, and ${AMD_PRICE}. Street prices today are different, so compare real listings.

Specs side by side

Both cards use a 128-bit memory interface and PCI Express 5.0; they differ most in memory size, memory type and software.

- Memory: 8 GB GDDR7 (NVIDIA) vs 16 GB GDDR6 (AMD).
- Memory bandwidth: 448 GB/sec (NVIDIA) vs up to 320 GB/s with 32 MB of Infinity Cache (AMD).
- Shader units: 3,840 CUDA cores (NVIDIA) vs 2,048 stream processors in 32 compute units (AMD). These are counted differently by each vendor and cannot be compared directly.
- Boost clock: 2.50 GHz (NVIDIA) vs up to 3130 MHz (AMD).
- Rated power: 145 W total graphics power (NVIDIA) vs 160 W typical board power (AMD).
- Power supply: 550 W required system power (NVIDIA) vs 450W minimum (AMD).
- Power connector: 1x PCIe 8-pin or one 300 W or greater PCIe Gen 5 cable (NVIDIA) vs 1x 8-pin (AMD).
- Bus: PCI Express Gen 5 (NVIDIA) vs PCIe 5.0 x16 (AMD).

Why memory size decides it at the same price

Memory size matters more than memory speed once a game needs more than the card has.

1. Textures and high settings are stored in graphics memory.
2. When a game needs more than 8 GB, the extra data spills into slower system memory over the PCI Express bus, which can cause stutter.
3. Faster GDDR7 helps while everything fits in 8 GB, but it cannot add capacity.
4. Graphics card memory cannot be upgraded, so the 16 GB card leaves more room for future games.
5. For in-game results, use independent reviews that state their test system and settings, and look at the games you actually play.

Upscaling and frame generation

NVIDIA's DLSS is the main gaming reason to choose the RTX 5060.

- NVIDIA lists DLSS 4 on the RTX 5060 with Super Resolution, DLAA, Ray Reconstruction, Frame Generation and Multi Frame Generation.
- AMD lists AMD FSR "Redstone", AMD Fluid Motion Frames and Radeon Super Resolution on the RX 9060 XT.
- Game support differs between the two, so check whether the games you play support DLSS or FSR.

Work, streaming and AI

For non-gaming work, check which hardware your apps support before you choose.

- CUDA: NVIDIA lists CUDA Capability 12.0 for the RTX 5060. AMD does not list CUDA for the RX 9060 XT. Some AI and creative tools are built for CUDA first.
- Streaming and video: NVIDIA lists one ninth-generation NVENC encoder with AV1 encode; AMD lists AV1, H.265/HEVC and H.264 encode.
- Local AI: more memory lets you load larger models, which favours the 16 GB card, but software support differs between vendors.
- Development tools and emulators: check each tool's own hardware requirements.

Power and platform

Both cards use a single power connector, and AMD's minimum PSU figure is lower.

- NVIDIA lists 145 W total graphics power and 550 W required system power, based on a PC with a Ryzen 9 9950X; your system may need a different size.
- AMD lists 160 W typical board power and a 450W minimum PSU recommendation.
- AMD lists the RX 9060 XT as PCIe 5.0 x16. NVIDIA lists PCI Express Gen 5 support for the RTX 5060. On an older motherboard, check the manual for the slot's PCIe generation.
- Card length and thickness vary by manufacturer, so check your case against the exact partner model.

Who should pick which

- Mostly gaming at 1080p or 1440p, keeping the card for years: RX 9060 XT 16GB.
- Need CUDA apps or want DLSS Multi Frame Generation: RTX 5060.
- Streaming: either; both encode AV1.
- Local AI: the 16 GB card fits larger models, but check that your tool supports AMD graphics cards.

Related guides: RX 9060 XT vs RTX 5060 Ti for the 16 GB NVIDIA option, RX 9060 XT vs RX 9070 for a bigger budget, and RTX 5070 vs RX 9070 XT vs RTX 5070 Ti for the next tier up.`;

const SPEC = "Specs";

const BUILT = buildEditorialComparison({
  slug: "rtx-5060-vs-rx-9060-xt",
  title: "RTX 5060 vs RX 9060 XT 16GB: Which GPU Should You Buy at the Same Price?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "NVIDIA GeForce RTX 5060",
      shortDesc: "NVIDIA Blackwell graphics card with 8 GB of GDDR7 on a 128-bit interface, per NVIDIA.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "448 GB/sec memory bandwidth (NVIDIA)",
        "DLSS 4 with Multi Frame Generation (NVIDIA)",
        "CUDA and a ninth-generation NVENC encoder with AV1 (NVIDIA)",
      ],
      cons: [
        "8 GB of memory (NVIDIA)",
        "550 W required system power (NVIDIA)",
      ],
      bestFor: "Buyers who need CUDA apps or NVIDIA's DLSS features",
    },
    {
      id: B,
      slug: B,
      name: "AMD Radeon RX 9060 XT 16GB",
      shortDesc: "AMD RDNA graphics card with 16 GB of GDDR6 and 32 MB of Infinity Cache, per AMD.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "16 GB of GDDR6 memory (AMD)",
        "450W minimum PSU recommendation (AMD)",
        "AV1, H.265/HEVC and H.264 encode (AMD)",
      ],
      cons: [
        "Up to 320 GB/s memory bandwidth (AMD)",
        "No DLSS or CUDA; uses AMD FSR instead",
      ],
      bestFor: "Gamers who want the most memory at this price",
    },
  ],
  keyDifferences: [
    { label: "Memory", entityAValue: "8 GB GDDR7", entityBValue: "16 GB GDDR6", winner: "b" },
    { label: "Memory bandwidth", entityAValue: "448 GB/sec", entityBValue: "Up to 320 GB/s + 32 MB Infinity Cache", winner: "a" },
    { label: "Minimum power supply", entityAValue: "550 W", entityBValue: "450W", winner: "b" },
    { label: "Upscaling", entityAValue: "DLSS 4 with Multi Frame Generation", entityBValue: "AMD FSR \"Redstone\"" },
  ],
  attributes: [
    textAttr("memory", "Memory", SPEC, A, B, "8 GB GDDR7", "16 GB GDDR6", "b"),
    textAttr("bus", "Memory interface", SPEC, A, B, "128-bit", "128-bit"),
    textAttr("bandwidth", "Memory bandwidth", SPEC, A, B, "448 GB/sec", "Up to 320 GB/s, plus 32 MB Infinity Cache", "a"),
    textAttr("shaders", "Shader units (not directly comparable)", SPEC, A, B, "3,840 CUDA cores", "2,048 stream processors (32 compute units)"),
    textAttr("boost", "Boost clock", SPEC, A, B, "2.50 GHz", "Up to 3130 MHz"),
    textAttr("power", "Board power", SPEC, A, B, "145 W total graphics power", "160 W typical board power"),
    textAttr("psu", "Power supply", SPEC, A, B, "550 W required system power", "450W minimum", "b"),
    textAttr("connectors", "Power connector", SPEC, A, B, "1x PCIe 8-pin or one 300 W or greater PCIe Gen 5 cable", "1x 8-pin"),
    textAttr("pcie", "Bus", SPEC, A, B, "PCI Express Gen 5", "PCIe 5.0 x16"),
    textAttr("upscaling", "Upscaling and frame generation", SPEC, A, B, "DLSS 4: Super Resolution, DLAA, Ray Reconstruction, Frame Generation, Multi Frame Generation", "AMD FSR \"Redstone\", AMD Fluid Motion Frames, Radeon Super Resolution"),
    textAttr("encode", "Video encode", SPEC, A, B, "1x ninth-generation NVENC with AV1", "AV1, H.265/HEVC, H.264"),
    textAttr("cuda", "CUDA", SPEC, A, B, "CUDA Capability 12.0", "Not listed by AMD"),
    textAttr("launch", "Launch price", SPEC, A, B, NV_PRICE, AMD_PRICE),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "rx-9060-xt-vs-rtx-5060-ti", title: "RX 9060 XT vs RTX 5060 Ti", category: "technology" },
    { slug: "rx-9060-xt-vs-rx-9070", title: "RX 9060 XT vs RX 9070", category: "technology" },
    { slug: "rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti", title: "RTX 5070 vs RX 9070 XT vs RTX 5070 Ti", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "RX 9060 XT 16GB for twice the memory. RTX 5060 for CUDA, DLSS 4 and faster GDDR7 memory.",
    keyFact:
      "AMD lists 16 GB of GDDR6 on the RX 9060 XT 16GB; NVIDIA lists 8 GB of GDDR7 at 448 GB/sec on the RTX 5060.",
  },
  citationStats: {
    sourceCount: 7,
    dataPointCount: 26,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "NVIDIA GeForce RTX 5060 family specifications", url: NV_SPEC },
      { name: "NVIDIA GeForce RTX 50 Series compare specs", url: NV_COMPARE },
      { name: "NVIDIA: GeForce RTX 5060 out now (May 2025)", url: NV_NEWS },
      { name: "AMD Radeon RX 9060 XT specifications", url: AMD_SPEC },
      { name: "AMD RX 9060 XT launch press release (May 2025)", url: AMD_PR },
      { name: "NVIDIA GeForce RTX 5060 family: shop", url: NV_SHOP },
      { name: "AMD: where to buy Radeon graphics cards", url: AMD_BUY },
    ],
  },
  resources: [
    { type: "external", label: "NVIDIA GeForce RTX 5060 family specifications", url: NV_SPEC, description: "RTX 5060: 3,840 CUDA cores, 2.50 GHz boost, 8 GB GDDR7, 128-bit, 145 W TGP, 550 W system power, DLSS 4, ninth-gen NVENC, AV1 encode, CUDA 12.0." },
    { type: "external", label: "NVIDIA GeForce RTX 50 Series compare specs", url: NV_COMPARE, description: "RTX 5060 memory bandwidth: 448 GB/sec." },
    { type: "external", label: "NVIDIA: GeForce RTX 5060 out now (May 2025)", url: NV_NEWS, description: "May 19, 2025: RTX 5060 starting at $299." },
    { type: "external", label: "AMD Radeon RX 9060 XT specifications", url: AMD_SPEC, description: "16GB: 32 CUs, 2,048 stream processors, up to 3130 MHz boost, 16 GB GDDR6, 128-bit, up to 320 GB/s, 32 MB Infinity Cache, 160 W TBP, 450W min PSU, PCIe 5.0 x16, AV1 encode, FSR \"Redstone\"." },
    { type: "external", label: "AMD RX 9060 XT launch press release (May 2025)", url: AMD_PR, description: "May 20, 2025: RX 9060 XT 16GB at $349 USD SEP." },
    { type: "external", label: "See vendor page for current price: RTX 5060 (NVIDIA)", url: NV_SHOP, description: "NVIDIA buying options for the GeForce RTX 5060 family." },
    { type: "external", label: "See vendor page for current price: RX 9060 XT (AMD)", url: AMD_BUY, description: "AMD where-to-buy listings for Radeon graphics cards." },
  ],
  metaTitle: "RTX 5060 vs RX 9060 XT 16GB | A Versus B",
});

BUILT.metadata.metaDescription =
  "RTX 5060 8GB vs RX 9060 XT 16GB at the same price: VRAM, memory bandwidth, power, DLSS vs FSR, CUDA and AV1 streaming, from NVIDIA and AMD specs.";

export const RTX_5060_VS_RX_9060_XT: EditorialComparison = BUILT;
