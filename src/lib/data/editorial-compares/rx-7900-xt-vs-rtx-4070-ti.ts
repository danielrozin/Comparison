import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-307 — RX 7900 XT vs RTX 4070 Ti as a used upgrade from an RTX 3070.
 * Read on 21 October 2026 from AMD's RX 7900 XT product specs, AMD's
 * 3 November 2022 RDNA 3 press release (320-bit bus, launch SEP), NVIDIA's
 * RTX 4070 family specs, NVIDIA's 3 January 2023 RTX 4070 Ti announcement
 * (launch price) and NVIDIA's RTX 3070 family specs. AMD calls $899 the
 * RX 7900 XT's SEP (suggested price), not an MSRP.
 * Dropped from the brief: "7900 XT generally leads in raster" and "4070 Ti
 * leads in heavy ray tracing" (no vendor-published like-for-like data),
 * the ~$500 used price and all other thread prices, the Fractal Terra
 * clearance figures (not an AMD/NVIDIA source), FSR 4 "close to DLSS"
 * opinion, and the press release's 300W TBP (AMD's current spec lists 315 W).
 * No fps numbers, no percentages, no street prices, no winner.
 */

const A = "rx-7900-xt";
const B = "rtx-4070-ti";

const AMD_XT = "https://www.amd.com/en/products/graphics/desktops/radeon/7000-series/amd-radeon-rx-7900xt.html";
const AMD_PR =
  "https://www.amd.com/en/newsroom/press-releases/2022-11-3-amd-unveils-world-s-most-advanced-gaming-graphics-.html";
const NV_4070 = "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4070-family/";
const NV_NEWS = "https://www.nvidia.com/en-us/geforce/news/geforce-rtx-4070-ti/";
const NV_3070 = "https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3070-3070ti/";

const NV_SHOP = "https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4070-family/#shop";
const AMD_BUY = "https://www.amd.com/en/where-to-buy/graphics/radeon.html";

const SOURCE_DATE = "2026-10-21";
const PUBLISHED = "2026-10-21T00:00:00Z";

const XT_PRICE = "$899 launch suggested price (SEP), per AMD, November 2022";
const TI_PRICE = "$799 launch price (MSRP), per NVIDIA, January 2023";

const SHORT_ANSWER =
  "Pick the Radeon RX 7900 XT for memory: AMD lists 20 GB of GDDR6 with up to 800 GB/s of bandwidth, against 12 GB of GDDR6X on a 192-bit bus for the GeForce RTX 4070 Ti per NVIDIA. Pick the RTX 4070 Ti for NVIDIA's DLSS 3.5 features, including Frame Generation, two eighth-generation NVENC encoders and a lower power rating: NVIDIA lists 285 W total graphics power and a 700 W system, while AMD lists 315 W typical board power and a 750W minimum PSU. Both carry far more memory than the 8 GB RTX 3070 they would replace, so either is a large step up; which is better depends on whether memory or NVIDIA's features matter more to you.";

const FAQS = [
  {
    question: "Is the RX 7900 XT better than the RTX 4070 Ti?",
    answer:
      "It depends on what you value. The RX 7900 XT has more memory and bandwidth: 20 GB of GDDR6 at up to 800 GB/s per AMD, against 12 GB of GDDR6X on a 192-bit bus for the RTX 4070 Ti per NVIDIA. The RTX 4070 Ti has DLSS 3.5 with Frame Generation and Ray Reconstruction, two NVENC encoders and a lower power rating. Independent reviews with a stated test setup are the best guide to in-game results for the games you play.",
  },
  {
    question: "How much VRAM do the RX 7900 XT and RTX 4070 Ti have?",
    answer:
      "AMD lists 20 GB of GDDR6 on the RX 7900 XT, on a 320-bit interface per AMD's launch announcement. NVIDIA lists 12 GB of GDDR6X on a 192-bit interface for the RTX 4070 Ti, and 16 GB of GDDR6X on a 256-bit interface for the RTX 4070 Ti SUPER.",
  },
  {
    question: "Which uses less power, the RX 7900 XT or RTX 4070 Ti?",
    answer:
      "The RTX 4070 Ti is rated lower. NVIDIA lists 285 W total graphics power and a 700 W required system power. AMD lists 315 W typical board power for the RX 7900 XT and a minimum 750W power supply. AMD and NVIDIA measure board power differently, so treat these as each vendor's own rating.",
  },
  {
    question: "Is the RX 7900 XT or RTX 4070 Ti a good upgrade from an RTX 3070?",
    answer:
      "Yes, both are large upgrades. NVIDIA lists the RTX 3070 with 8 GB of GDDR6, so moving to 12 GB on the RTX 4070 Ti or 20 GB on the RX 7900 XT gives far more room for high texture settings in newer games. The RTX 4070 Ti also adds DLSS Frame Generation, which NVIDIA lists for RTX 40 Series cards.",
  },
  {
    question: "Does the RX 7900 XT support DLSS?",
    answer:
      "No. DLSS is NVIDIA's technology for GeForce RTX cards, and AMD does not list it for the RX 7900 XT. AMD lists FSR (FidelityFX Super Resolution) and Radeon Super Resolution among the card's supported technologies instead.",
  },
  {
    question: "Will the RX 7900 XT or RTX 4070 Ti fit in a small form factor case?",
    answer:
      "Check your case's maximum graphics card length and thickness against the exact model. AMD lists its RX 7900 XT at 276 mm long and 2.5 slots thick. NVIDIA lists RTX 4070 Ti length and slot width as varying by manufacturer, so look up the partner model you are buying.",
  },
];

const VERDICT = `Best for memory and bandwidth: RX 7900 XT. AMD lists 20 GB of GDDR6 at up to 800 GB/s, which suits high texture settings and long-term use.

Best for NVIDIA features and lower power: RTX 4070 Ti. NVIDIA lists DLSS 3.5 with Frame Generation and Ray Reconstruction, two eighth-generation NVENC encoders and 285 W total graphics power.

The middle option: RTX 4070 Ti SUPER, which NVIDIA lists with 16 GB of GDDR6X on a 256-bit interface.

Neither is right for everyone. Used prices change daily, so compare the actual listings for the exact models.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- AMD lists the RX 7900 XT with 20 GB of GDDR6 and up to 800 GB/s of memory bandwidth, on a 320-bit interface.
- NVIDIA lists the RTX 4070 Ti with 12 GB of GDDR6X on a 192-bit interface, and the RTX 4070 Ti SUPER with 16 GB on a 256-bit interface.
- NVIDIA lists the RTX 3070 with 8 GB of GDDR6, so both cards are a big jump in memory.
- The RTX 4070 Ti is rated lower on power: 285 W total graphics power and a 700 W system per NVIDIA, against 315 W typical board power and a 750W minimum PSU for the RX 7900 XT per AMD.
- DLSS is NVIDIA's; the RX 7900 XT uses AMD FSR instead.
- Launch prices were ${XT_PRICE}, and ${TI_PRICE}. Used prices today are different, so compare real listings.

Specs side by side

The RX 7900 XT has more memory, a wider bus and higher rated power; the RTX 4070 Ti has the smaller power budget.

- Memory: 20 GB GDDR6 (AMD) vs 12 GB GDDR6X (NVIDIA).
- Memory interface: 320-bit (AMD launch announcement) vs 192-bit (NVIDIA).
- Board power: 315 W typical board power (AMD) vs 285 W total graphics power (NVIDIA).
- Power supply: minimum 750W (AMD) vs 700 W required system power (NVIDIA).
- Power connectors: 2x 8-pin on AMD's card; NVIDIA lists 2x PCIe 8-pin cables with an adapter or one 300 W or greater PCIe Gen 5 cable.
- Size: 276 mm long and 2.5 slots for AMD's card; NVIDIA lists RTX 4070 Ti length and slots as varying by manufacturer.

Upgrading from an RTX 3070

Both cards are large upgrades, mainly because both carry much more memory than the RTX 3070's 8 GB, which matters most at high texture settings.

- NVIDIA lists the RTX 3070 with 8 GB of GDDR6 on a 256-bit interface.
- The RTX 4070 Ti raises that to 12 GB and adds DLSS Frame Generation, which NVIDIA lists for RTX 40 Series cards.
- The RX 7900 XT raises it to 20 GB.
- For in-game results, use independent reviews that state their test system and settings, and look at the games you actually play.

Features: DLSS vs FSR, ray tracing, encoders and drivers

NVIDIA's feature set is the main reason to choose the RTX 4070 Ti; the RX 7900 XT's case rests on memory.

1. Upscaling: NVIDIA lists DLSS 3.5 on the RTX 4070 Ti with Super Resolution, DLAA, Ray Reconstruction and Frame Generation. AMD lists FSR and Radeon Super Resolution on the RX 7900 XT.
2. Ray tracing: NVIDIA lists third-generation RT Cores on the RTX 4070 Ti. AMD lists 84 Ray Accelerators on the RX 7900 XT. If path tracing in titles such as Cyberpunk 2077 matters to you, look for independent reviews that test it.
3. Encoders: NVIDIA lists two eighth-generation NVENC encoders with AV1 encode on the RTX 4070 Ti. AMD lists AV1, H.265/HEVC and H.264 encode on the RX 7900 XT.
4. Drivers: owner reports on stability are mixed in both directions, and there is no vendor data that settles it. If a used card crashes, a clean driver reinstall is the usual first step before blaming the hardware.

Buying used

Treat a used card as the specific board in front of you, not the reference specs.

- Ask for the exact partner model so you can look up its length, thickness and power connectors.
- Ask whether the warranty transfers; that is set by the card maker, not by AMD or NVIDIA.
- Ask how the card was used, and test it under load before paying if you can.
- Check your power supply: AMD recommends at least 750W for the RX 7900 XT, and NVIDIA lists 700 W for the RTX 4070 Ti. Both note that your own system may need more.

Small form factor build notes

In a small case, length, thickness and heat matter as much as the specs.

- AMD lists its RX 7900 XT at 276 mm long and 2.5 slots thick; partner cards can be larger.
- NVIDIA lists RTX 4070 Ti dimensions as varying by manufacturer, so look up the partner card.
- The RTX 4070 Ti's lower power rating means less heat to remove in a tight case.
- Check the case's maximum graphics card length and slot clearance, and leave room for the power cables.

Related guides: RTX 5070 vs RX 9070 XT vs RTX 5070 Ti and RX 9060 XT vs RTX 5060 Ti for the current generation, and RX 9070 XT vs RTX 5080 for a higher budget.`;

const SPEC = "Specs";

const BUILT = buildEditorialComparison({
  slug: "rx-7900-xt-vs-rtx-4070-ti",
  title: "RX 7900 XT vs RTX 4070 Ti: Which Used GPU Is the Better Upgrade?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "AMD Radeon RX 7900 XT",
      shortDesc: "AMD RDNA 3 graphics card with 20 GB of GDDR6 and up to 800 GB/s of memory bandwidth, per AMD.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "20 GB of GDDR6 memory (AMD)",
        "Up to 800 GB/s memory bandwidth on a 320-bit interface (AMD)",
        "AV1 encode and decode (AMD)",
      ],
      cons: [
        "315 W typical board power and a 750W minimum PSU (AMD)",
        "No DLSS; uses AMD FSR instead",
        "276 mm long and 2.5 slots on AMD's card",
      ],
      bestFor: "Buyers who want the most memory for high texture settings",
    },
    {
      id: B,
      slug: B,
      name: "NVIDIA GeForce RTX 4070 Ti",
      shortDesc: "NVIDIA Ada Lovelace graphics card with 12 GB of GDDR6X on a 192-bit interface, per NVIDIA.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "DLSS 3.5 with Frame Generation and Ray Reconstruction (NVIDIA)",
        "Two eighth-generation NVENC encoders with AV1 (NVIDIA)",
        "285 W total graphics power and a 700 W system (NVIDIA)",
      ],
      cons: [
        "12 GB of memory on a 192-bit interface (NVIDIA)",
        "Card length and thickness vary by manufacturer (NVIDIA)",
      ],
      bestFor: "Buyers who want NVIDIA's DLSS, ray tracing features and encoders",
    },
  ],
  keyDifferences: [
    { label: "Memory", entityAValue: "20 GB GDDR6", entityBValue: "12 GB GDDR6X", winner: "a" },
    { label: "Memory interface", entityAValue: "320-bit", entityBValue: "192-bit", winner: "a" },
    { label: "Rated power", entityAValue: "315 W typical board power", entityBValue: "285 W total graphics power", winner: "b" },
    { label: "Upscaling", entityAValue: "AMD FSR", entityBValue: "DLSS 3.5 with Frame Generation" },
  ],
  attributes: [
    textAttr("memory", "Memory", SPEC, A, B, "20 GB GDDR6", "12 GB GDDR6X", "a"),
    textAttr("bus", "Memory interface", SPEC, A, B, "320-bit", "192-bit", "a"),
    textAttr("bandwidth", "Memory bandwidth", SPEC, A, B, "Up to 800 GB/s", "Not listed by NVIDIA"),
    textAttr("power", "Board power", SPEC, A, B, "315 W typical board power", "285 W total graphics power", "b"),
    textAttr("psu", "Power supply", SPEC, A, B, "Minimum 750W", "700 W required system power", "b"),
    textAttr("connectors", "Power connectors", SPEC, A, B, "2x 8-pin", "2x PCIe 8-pin (adapter in box) or one 300 W or greater PCIe Gen 5 cable"),
    textAttr("size", "Card size", SPEC, A, B, "276 mm, 2.5 slots (AMD's card)", "Varies by manufacturer"),
    textAttr("upscaling", "Upscaling", SPEC, A, B, "AMD FSR, Radeon Super Resolution", "DLSS 3.5: Super Resolution, DLAA, Ray Reconstruction, Frame Generation"),
    textAttr("encode", "Video encode", SPEC, A, B, "AV1, H.265/HEVC, H.264", "2x eighth-generation NVENC with AV1"),
    textAttr("launch", "Launch price", SPEC, A, B, XT_PRICE, TI_PRICE),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti", title: "RTX 5070 vs RX 9070 XT vs RTX 5070 Ti", category: "technology" },
    { slug: "rx-9060-xt-vs-rtx-5060-ti", title: "RX 9060 XT vs RTX 5060 Ti", category: "technology" },
    { slug: "rx-9070-xt-vs-rtx-5080", title: "RX 9070 XT vs RTX 5080", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "RX 7900 XT for 20 GB of memory and more bandwidth. RTX 4070 Ti for DLSS 3.5, NVENC and a lower power rating.",
    keyFact:
      "AMD lists 20 GB of GDDR6 at up to 800 GB/s on the RX 7900 XT; NVIDIA lists 12 GB of GDDR6X on a 192-bit interface on the RTX 4070 Ti.",
  },
  citationStats: {
    sourceCount: 7,
    dataPointCount: 22,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "AMD Radeon RX 7900 XT specifications", url: AMD_XT },
      { name: "AMD RDNA 3 launch press release (November 2022)", url: AMD_PR },
      { name: "NVIDIA GeForce RTX 4070 family specifications", url: NV_4070 },
      { name: "NVIDIA GeForce RTX 4070 Ti announcement (January 2023)", url: NV_NEWS },
      { name: "NVIDIA GeForce RTX 3070 family specifications", url: NV_3070 },
      { name: "AMD: where to buy Radeon graphics cards", url: AMD_BUY },
      { name: "NVIDIA GeForce RTX 4070 family: shop", url: NV_SHOP },
    ],
  },
  resources: [
    { type: "external", label: "AMD Radeon RX 7900 XT specifications", url: AMD_XT, description: "20 GB GDDR6, up to 800 GB/s, 315 W typical board power, 750W minimum PSU, 2x 8-pin, 276 mm, 2.5 slots, AV1 encode, FSR." },
    { type: "external", label: "AMD RDNA 3 launch press release (November 2022)", url: AMD_PR, description: "320-bit memory interface; $899 USD SEP for the RX 7900 XT." },
    { type: "external", label: "NVIDIA GeForce RTX 4070 family specifications", url: NV_4070, description: "RTX 4070 Ti: 12 GB GDDR6X, 192-bit, 285 W TGP, 700 W system, DLSS 3.5, 2x NVENC. RTX 4070 Ti SUPER: 16 GB, 256-bit." },
    { type: "external", label: "NVIDIA GeForce RTX 4070 Ti announcement (January 2023)", url: NV_NEWS, description: "Available January 5, 2023, starting at $799." },
    { type: "external", label: "NVIDIA GeForce RTX 3070 family specifications", url: NV_3070, description: "RTX 3070: 8 GB GDDR6, 256-bit." },
    { type: "external", label: "See vendor page for current price: RX 7900 XT (AMD)", url: AMD_BUY, description: "AMD where-to-buy listings for Radeon graphics cards." },
    { type: "external", label: "See vendor page for current price: RTX 4070 Ti (NVIDIA)", url: NV_SHOP, description: "NVIDIA shop section for the GeForce RTX 4070 family." },
  ],
  metaTitle: "RX 7900 XT vs RTX 4070 Ti | A Versus B",
});

BUILT.metadata.metaDescription =
  "RX 7900 XT vs RTX 4070 Ti as a used upgrade from an RTX 3070: VRAM, power, DLSS vs FSR, encoders and small-case fit, from AMD and NVIDIA specs.";

export const RX_7900_XT_VS_RTX_4070_TI: EditorialComparison = BUILT;
