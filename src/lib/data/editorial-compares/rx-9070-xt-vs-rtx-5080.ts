import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-167 — RX 9070 XT vs RTX 5080, for 1440p value.
 * Figures read on 6 October 2026 from AMD's 28 February 2025 RDNA 4
 * press release, the RX 9070 XT and RX 9070 product specs, AMD's FSR
 * and supported-games notes, and NVIDIA's RTX 5080 and RTX 5070 family
 * specs. No fps numbers. No percent-faster claims. No game counts.
 * No street prices. No page-level winner.
 * A 9800X3D pairing is omitted: neither company states that recommendation.
 */

const XT = "rx-9070-xt";
const RTX = "rtx-5080";

const AMD_PR =
  "https://www.amd.com/en/newsroom/press-releases/2025-2-28-amd-unveils-next-generation-amd-rdna-4-architectu.html";
const AMD_XT =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070xt.html";
const AMD_9070 =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070.html";
const AMD_FSR = "https://www.amd.com/en/products/graphics/technologies/fidelityfx/super-resolution.html";
const AMD_GAMES =
  "https://www.amd.com/en/products/graphics/technologies/fidelityfx/supported-games.html";
const NV_5080 = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5080/";
const NV_5070 = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/";

const SOURCE_DATE = "2026-10-06";
const PUBLISHED = "2026-10-06T00:00:00Z";

const SHORT_ANSWER =
  "For 1440p value, choose the Radeon RX 9070 XT: AMD launched it at a $599 suggested price with 16 GB of GDDR6, while NVIDIA lists the GeForce RTX 5080 from $999 with 16 GB of GDDR7, so both have 16 GB and those prices are $400 apart. Choose the RTX 5080 if you want the ray tracing NVIDIA lists and the DLSS 4 features NVIDIA lists, including Multi Frame Generation and Ray Reconstruction. Neither is better for everyone; it depends on whether those features are worth the higher launch price, and street prices change, so check current prices.";

const FAQS = [
  {
    question: "Is the RTX 5080 worth it over the RX 9070 XT for 1440p?",
    answer:
      "For 1440p value, usually not. AMD launched the RX 9070 XT at a $599 suggested price with 16 GB of GDDR6, and NVIDIA lists the RTX 5080 from $999 with 16 GB of GDDR7. Those prices are $400 apart, and the memory amount is the same. Choose the RTX 5080 if you want the ray tracing NVIDIA lists and DLSS 4 features such as Multi Frame Generation and Ray Reconstruction, and the price gap is acceptable. Street prices change, so check current prices.",
  },
  {
    question: "Do the RX 9070 XT and RTX 5080 have the same amount of VRAM?",
    answer:
      "Yes. Both have 16 GB on a 256-bit interface. AMD lists GDDR6 and 64 MB of Infinity Cache on the RX 9070 XT. NVIDIA lists GDDR7 on the RTX 5080. The amount matches. The memory type does not.",
  },
  {
    question: "Which uses more power, the RX 9070 XT or the RTX 5080?",
    answer:
      "AMD rates the RX 9070 XT at 304 W typical board power and recommends a 750 W minimum power supply, with a 2x 8-pin connector. NVIDIA rates the RTX 5080 at 360 W total graphics power and lists 850 W required system power. NVIDIA says that 850 W minimum is based on a PC configured with a Ryzen 9 9950X processor, and that power requirements can differ by system. NVIDIA also says graphics card specifications may vary by add-in-card manufacturer.",
  },
  {
    question: "What were the launch prices of the RX 9070 XT and RTX 5080?",
    answer:
      "AMD's February 28, 2025 press release gives the RX 9070 XT a $599 suggested price and the RX 9070 a $549 suggested price. NVIDIA lists the RTX 5080 from $999 and the RTX 5070 from $549. Those are suggested and starting prices, not today's store prices. Street prices change, so check current prices.",
  },
  {
    question: "Does the RX 9070 XT support FSR 4?",
    answer:
      "Yes, under the current name. AMD says FSR Upscaling was formerly FidelityFX Super Resolution 4, and that this machine-learning upscaling is available on Radeon RX 7000 Series and RX 9000 Series graphics cards, with RX 6000 Series support launching in 2027. The RX 9070 XT is an RX 9000 Series card. Some games have native integration, and the menu may still say FSR 4. Other games that already have FSR 3.1 or higher can be upgraded in AMD Software, which swaps DLLs. AMD publishes the supported games.",
  },
  {
    question: "Should I get the RTX 5070 or the RX 9070 XT for 1440p?",
    answer:
      "NVIDIA lists the RTX 5070 with 12 GB of GDDR7 on a 192-bit interface, 250 W total graphics power, and a starting price of $549. AMD lists the RX 9070 XT with 16 GB of GDDR6, 64 compute units, and 304 W typical board power, at a $599 suggested price. The RTX 5070 has less memory than the RX 9070 XT. Choose the RTX 5070 mainly for DLSS 4 and ray tracing if the prices are close. Choose the RX 9070 XT for 16 GB.",
  },
];

const VERDICT = `Best 1440p value at the suggested price: RX 9070 XT. AMD launched it at $599 with 16 GB of GDDR6, 64 compute units, and 304 W typical board power.

Best if you want NVIDIA DLSS 4: RTX 5080. NVIDIA lists it from $999 with 16 GB of GDDR7, 10,752 CUDA cores, 360 W total graphics power, and DLSS 4 features that include Multi Frame Generation and Ray Reconstruction.

Neither is better for everyone; it depends on whether those features are worth the higher price. Street prices change, so check current prices.`;

const EXPERT_ANALYSIS = `For 1440p value, choose the Radeon RX 9070 XT: AMD launched it at a $599 suggested price with 16 GB of GDDR6, while NVIDIA lists the GeForce RTX 5080 from $999 with 16 GB of GDDR7, so both have 16 GB and those prices are $400 apart. Choose the RTX 5080 if you want the ray tracing NVIDIA lists and the DLSS 4 features NVIDIA lists, including Multi Frame Generation and Ray Reconstruction. Neither is better for everyone; it depends on whether those features are worth the higher launch price, and street prices change, so check current prices.

Memory, cores, and clocks

AMD's RX 9070 XT product specs list 64 compute units, a boost frequency of up to 2970 MHz, and a game frequency of 2400 MHz. AMD's February 28, 2025 press release lists a boost clock of up to 3.0 GHz and a game clock of 2.4 GHz for the same card, with 16 GB of GDDR6, a 256-bit interface, and 64 MB of Infinity Cache. AMD also lists 64 ray accelerators on that product spec.

NVIDIA lists 10,752 CUDA cores on the RTX 5080, a 2.62 GHz boost clock, a 2.30 GHz base clock, 16 GB of GDDR7, and a 256-bit memory interface. NVIDIA marks ray tracing as supported, and names DLSS 4 with Super Resolution, DLAA, Ray Reconstruction, Frame Generation, and Multi Frame Generation. The memory amount is the same 16 GB. GDDR6 and GDDR7 are not the same memory type.

Power and the power supply

AMD rates the RX 9070 XT at 304 W typical board power, recommends a 750 W minimum power supply, and lists a 2x 8-pin power connector. NVIDIA rates the RTX 5080 at 360 W total graphics power and lists 850 W required system power. NVIDIA says that minimum is based on a PC configured with a Ryzen 9 9950X processor, and that power requirements can differ by system. NVIDIA says a higher power rating may be required depending on the system. Supplementary power on the RTX 5080 is three PCIe 8-pin cables, with an adapter in the box, or one 450 W or greater PCIe Gen 5 cable. NVIDIA says graphics card specifications may vary by add-in-card manufacturer.

Ray tracing and upscaling

NVIDIA lists ray tracing on the RTX 5080, plus DLSS 4 with Super Resolution, DLAA, Ray Reconstruction, Frame Generation, and Multi Frame Generation. That feature set is the reason to pay the higher starting price. It is not a frame-rate result.

AMD calls the machine-learning upscaler FSR Upscaling, formerly FidelityFX Super Resolution 4. AMD says FSR 4 was renamed so it sits apart from the other features in FSR "Redstone": FSR Upscaling, FSR Frame Generation, FSR Ray Regeneration, and FSR Radiance Caching. AMD says ML upscaling is available on Radeon RX 7000 Series and RX 9000 Series graphics cards, with RX 6000 Series support launching in 2027. The RX 9070 XT is an RX 9000 Series card, so it is in that set. Some games have native integration, and the in-game menu may still say FSR 4. Other games that already have FSR 3.1 or higher can be upgraded in AMD Software, which swaps DLLs. AMD publishes the supported games. AMD's supported-games note says Redstone support on RX 9000 Series cards uses AMD Software Adrenalin Edition 25.12.1 or newer.

RTX 5070 vs RX 9070 vs RX 9070 XT

NVIDIA lists the GeForce RTX 5070 with 12 GB of GDDR7 on a 192-bit interface, 250 W total graphics power, 650 W required system power, and a starting price of $549. NVIDIA lists the same DLSS 4 feature names on the RTX 5070 as on the RTX 5080. AMD's press release lists the Radeon RX 9070 at 56 compute units, 16 GB of GDDR6, a 256-bit interface, 64 MB of Infinity Cache, 220 W typical board power, and a $549 suggested price, with a boost clock of up to 2.5 GHz. AMD's RX 9070 product specs list a boost frequency of up to 2520 MHz, a game frequency of 2070 MHz, a 2x 8-pin connector, and a 650 W minimum power supply.

The RTX 5070 has 12 GB. The RX 9070 and the RX 9070 XT each have 16 GB. If later games are the worry, that memory amount is the difference, not a promise about how long either card stays useful. The RX 9070 XT adds 64 compute units and 304 W against 56 compute units and 220 W on the RX 9070, at a $599 suggested price against $549.

Who should buy which

Choose the RX 9070 XT when 16 GB and the $599 suggested price matter more than NVIDIA's DLSS 4 features. Choose the RTX 5080 when you want those features, including Multi Frame Generation and Ray Reconstruction, and the gap from $999 is acceptable. Choose the RTX 5070 over the RX 9070 XT only when you want DLSS 4 and ray tracing and you can accept 12 GB instead of 16 GB. Nvidia vs AMD covers the broader brand choice. Check current prices before you buy, and size the power supply from the recommendation for the card you pick.`;

const SPEC = "Specs";

export const RX_9070_XT_VS_RTX_5080: EditorialComparison = buildEditorialComparison({
  slug: "rx-9070-xt-vs-rtx-5080",
  title: "RX 9070 XT vs RTX 5080: 1440p Gaming Value",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: XT,
      slug: XT,
      name: "RX 9070 XT",
      shortDesc: "16 GB GDDR6 card AMD launched at a $599 suggested price, with 64 compute units.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "16 GB GDDR6, 256-bit, 64 MB Infinity Cache (AMD)",
        "64 compute units, boost up to 2970 MHz on the product spec (AMD)",
        "$599 suggested price on February 28, 2025 (AMD)",
        "304 W typical board power, 750 W minimum power supply, 2x 8-pin (AMD)",
      ],
      cons: [
        "ML FSR upscaling is AMD's feature set, not NVIDIA DLSS 4",
        "304 W is still a high board power, with a 750 W supply recommendation",
      ],
      bestFor: "Best 1440p value at AMD's $599 suggested price, with 16 GB",
    },
    {
      id: RTX,
      slug: RTX,
      name: "RTX 5080",
      shortDesc: "16 GB GDDR7 card NVIDIA lists from $999, with DLSS 4 and 10,752 CUDA cores.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "16 GB GDDR7, 256-bit, 10,752 CUDA cores, 2.62 GHz boost (NVIDIA)",
        "DLSS 4: Super Resolution, DLAA, Ray Reconstruction, Frame Generation, Multi Frame Generation (NVIDIA)",
        "Ray tracing supported (NVIDIA)",
      ],
      cons: [
        "From $999, which is $400 more than AMD's $599 suggested price",
        "360 W total graphics power and 850 W required system power (NVIDIA)",
      ],
      bestFor: "Best if you want NVIDIA DLSS 4 and can accept the higher starting price",
    },
  ],
  keyDifferences: [
    {
      label: "VRAM",
      entityAValue: "16 GB GDDR6, 256-bit, 64 MB Infinity Cache",
      entityBValue: "16 GB GDDR7, 256-bit",
      winner: "tie",
    },
    {
      label: "Suggested or starting price",
      entityAValue: "$599 suggested (AMD, February 28, 2025)",
      entityBValue: "From $999 (NVIDIA)",
      winner: "a",
    },
    {
      label: "Board power",
      entityAValue: "304 W typical, 750 W minimum supply",
      entityBValue: "360 W total graphics power, 850 W required system power",
      winner: "tie",
    },
    {
      label: "Upscaler",
      entityAValue: "ML FSR upscaling, formerly FSR 4",
      entityBValue: "DLSS 4, including Multi Frame Generation and Ray Reconstruction",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "memory",
      "Memory",
      SPEC,
      XT,
      RTX,
      "16 GB GDDR6, 256-bit, 64 MB Infinity Cache (AMD)",
      "16 GB GDDR7, 256-bit (NVIDIA)"
    ),
    textAttr(
      "shaders",
      "Shaders and clocks",
      SPEC,
      XT,
      RTX,
      "64 compute units. Product spec: boost up to 2970 MHz, game frequency 2400 MHz. Press release: boost up to 3.0 GHz, game clock 2.4 GHz",
      "10,752 CUDA cores. Boost 2.62 GHz. Base 2.30 GHz (NVIDIA)"
    ),
    textAttr(
      "power",
      "Power",
      SPEC,
      XT,
      RTX,
      "304 W typical board power. 750 W minimum power supply. 2x 8-pin (AMD)",
      "360 W total graphics power. 850 W required system power, based on a Ryzen 9 9950X PC. Three PCIe 8-pin cables or one 450 W or greater PCIe Gen 5 cable (NVIDIA)"
    ),
    textAttr(
      "price",
      "Price",
      SPEC,
      XT,
      RTX,
      "$599 suggested price, February 28, 2025 (AMD). Street prices change",
      "From $999 (NVIDIA). Street prices change",
      "a"
    ),
    textAttr(
      "upscaler",
      "Upscaling",
      SPEC,
      XT,
      RTX,
      "FSR Upscaling, formerly FSR 4, on RX 9000. Native in some games, or AMD Software for games with FSR 3.1 or higher",
      "DLSS 4: Super Resolution, DLAA, Ray Reconstruction, Frame Generation, Multi Frame Generation"
    ),
    textAttr(
      "ray",
      "Ray tracing",
      SPEC,
      XT,
      RTX,
      "64 ray accelerators on the product spec (AMD)",
      "Ray tracing supported (NVIDIA)"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "nvidia-vs-amd",
      title: "Nvidia vs AMD",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "RX 9070 XT for 16 GB at AMD's $599 suggested price. RTX 5080 if you want DLSS 4, including Multi Frame Generation and Ray Reconstruction, at NVIDIA's from-$999 price.",
    keyFact:
      "Both have 16 GB on a 256-bit interface. AMD lists GDDR6 and a $599 suggested price for the RX 9070 XT. NVIDIA lists GDDR7 and a from-$999 price for the RTX 5080.",
  },
  citationStats: {
    sourceCount: 7,
    dataPointCount: 16,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "AMD RDNA 4 press release", url: AMD_PR },
      { name: "AMD Radeon RX 9070 XT", url: AMD_XT },
      { name: "AMD Radeon RX 9070", url: AMD_9070 },
      { name: "AMD FSR technologies", url: AMD_FSR },
      { name: "AMD FSR supported games", url: AMD_GAMES },
      { name: "NVIDIA GeForce RTX 5080", url: NV_5080 },
      { name: "NVIDIA GeForce RTX 5070 family", url: NV_5070 },
    ],
  },
  resources: [
    {
      type: "external",
      label: "AMD RDNA 4 press release",
      url: AMD_PR,
      description:
        "February 28, 2025. RX 9070 XT: 64 compute units, 16 GB GDDR6, game clock 2.4 GHz, boost up to 3.0 GHz, 256-bit, 64 MB Infinity Cache, 304 W, $599 suggested price. RX 9070: 56 compute units, 16 GB GDDR6, game clock 2.1 GHz, boost up to 2.5 GHz, 256-bit, 64 MB Infinity Cache, 220 W, $549 suggested price.",
    },
    {
      type: "external",
      label: "AMD Radeon RX 9070 XT",
      url: AMD_XT,
      description:
        "64 compute units, boost up to 2970 MHz, game frequency 2400 MHz, 64 ray accelerators, 16 GB GDDR6, 256-bit, 64 MB Infinity Cache, 304 W typical board power, 750 W minimum power supply, 2x 8-pin.",
    },
    {
      type: "external",
      label: "AMD Radeon RX 9070",
      url: AMD_9070,
      description:
        "56 compute units, boost up to 2520 MHz, game frequency 2070 MHz, 16 GB GDDR6, 256-bit, 64 MB Infinity Cache, 220 W typical board power, 650 W minimum power supply, 2x 8-pin.",
    },
    {
      type: "external",
      label: "AMD FSR technologies",
      url: AMD_FSR,
      description:
        "FSR Upscaling was formerly FidelityFX Super Resolution 4. ML upscaling is on RX 7000 and RX 9000, with RX 6000 support launching in 2027. Some games have native integration. Games with FSR 3.1 or higher can be upgraded in AMD Software by swapping DLLs. The menu may still say FSR 4.",
    },
    {
      type: "external",
      label: "AMD FSR supported games",
      url: AMD_GAMES,
      description:
        "Redstone games on RX 9000 Series cards use AMD Software Adrenalin Edition 25.12.1 or newer. RX 7000 Series upscaling uses Adrenalin Edition 26.6.2 or newer.",
    },
    {
      type: "external",
      label: "NVIDIA GeForce RTX 5080",
      url: NV_5080,
      description:
        "10,752 CUDA cores, 2.62 GHz boost, 2.30 GHz base, 16 GB GDDR7, 256-bit, ray tracing, DLSS 4 with Super Resolution, DLAA, Ray Reconstruction, Frame Generation, and Multi Frame Generation. 360 W total graphics power. 850 W required system power, based on a Ryzen 9 9950X PC. Three PCIe 8-pin cables or one 450 W or greater PCIe Gen 5 cable. From $999. Specifications may vary by add-in-card manufacturer.",
    },
    {
      type: "external",
      label: "NVIDIA GeForce RTX 5070 family",
      url: NV_5070,
      description:
        "RTX 5070: 12 GB GDDR7, 192-bit, 250 W total graphics power, 650 W required system power, from $549. DLSS 4 with Super Resolution, DLAA, Ray Reconstruction, Frame Generation, and Multi Frame Generation.",
    },
  ],
  metaTitle: "RX 9070 XT vs RTX 5080 | A Versus B",
});
