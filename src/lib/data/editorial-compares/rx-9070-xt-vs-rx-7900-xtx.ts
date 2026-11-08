import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-396 — RX 9070 XT (16 GB, RX 9000) vs RX 7900 XTX (24 GB, RX 7000).
 * Opened 8 November 2026 (Asia/Jerusalem). Official AMD sources only.
 *
 * Current product specifications, not the February 2025 launch table, supply
 * the side-by-side figures. The launch post is cited only for its own dated
 * clock, availability, and the Adrenalin FSR 4 Upgrade exclusivity sentence.
 *
 * Not this pair: RX 9070 (non-XT) and RX 7900 XT (non-XTX). Their current
 * AMD specifications are cited so the names stay distinct.
 *
 * FSR: the technologies listing (opened 8 November 2026) and the GPUOpen
 * SDK 2.3 post (originally posted 24 June 2026) do not draw the same line
 * for RX 6000. Both list RX 7000-series upscaling, with game and API limits.
 * Redstone frame generation, ray regeneration, and radiance
 * caching stay on the RX 9000 row in both documents. The devcommunity
 * mirror of the June 24 post was opened and does not add a support matrix.
 *
 * Dropped: prices, vendor 4K frame-rate marketing, press-release percentages
 * against the RX 7900 GRE, peak TFLOP rates, an unsourced memory-bus width
 * for the XTX, Reddit comments (HTTP 403), and any gaming winner inferred
 * from architecture, capacity, cores, bandwidth, or board power.
 * dataPointCount stays 0. A token tally is not a sourced data point.
 */

const A = "rx-9070-xt";
const B = "rx-7900-xtx";

const AMD_9070XT =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070xt.html";
const AMD_7900XTX =
  "https://www.amd.com/en/products/graphics/desktops/radeon/7000-series/amd-radeon-rx-7900xtx.html";
const AMD_FSR =
  "https://www.amd.com/en/products/graphics/technologies/fidelityfx/super-resolution.html";
const AMD_GPUOPEN = "https://gpuopen.com/learn/amd-fsr-sdk-2-3-blog/";
const AMD_9070 =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070.html";
const AMD_7900XT =
  "https://www.amd.com/en/products/graphics/desktops/radeon/7000-series/amd-radeon-rx-7900xt.html";
const AMD_LAUNCH =
  "https://newsroom.amd.com/news/amd-unveils-next-generation-amd-rdna-4-architectu/";

const SOURCE_DATE = "2026-11-08";
const PUBLISHED = "2026-11-08T00:00:00Z";
const SPEC = "Specs";

const SPEC_ROWS: { id: string; name: string; a: string; b: string }[] = [
  { id: "series", name: "Series", a: "Radeon RX 9000 Series", b: "Radeon RX 7000 Series" },
  { id: "board", name: "Board type", a: "Desktop", b: "Component" },
  { id: "launch", name: "Launch date on the current specification", a: "Not listed", b: "December 13, 2022" },
  { id: "cu", name: "Compute units", a: "64", b: "96" },
  { id: "sp", name: "Stream processors", a: "4096", b: "6144" },
  { id: "ray", name: "Ray accelerators (count)", a: "64", b: "96" },
  { id: "ai", name: "AI accelerators (count)", a: "128", b: "192" },
  { id: "game", name: "Game frequency", a: "2400 MHz", b: "2300 MHz" },
  { id: "boost", name: "Boost frequency", a: "Up to 2970 MHz", b: "Up to 2500 MHz" },
  { id: "memory", name: "Memory", a: "16 GB GDDR6", b: "24 GB GDDR6" },
  { id: "interface", name: "Memory interface", a: "256-bit", b: "Not listed" },
  { id: "memspeed", name: "Memory speed", a: "Up to 20 Gbps", b: "Up to 20 Gbps" },
  { id: "bandwidth", name: "Memory bandwidth", a: "Up to 640 GB/s", b: "Up to 960 GB/s" },
  { id: "effective", name: "Effective memory bandwidth", a: "Not listed", b: "Up to 3500 GB/s" },
  { id: "cache", name: "Infinity Cache", a: "64 MB", b: "96 MB" },
  { id: "tbp", name: "Typical board power", a: "304 W", b: "355 W" },
  { id: "psu", name: "Minimum PSU recommendation", a: "750 W", b: "800 W" },
  { id: "connector", name: "Extra power connector", a: "2x 8-pin", b: "2x 8-pin" },
  { id: "outputs", name: "Display outputs", a: "DisplayPort 2.1a, HDMI 2.1b", b: "DisplayPort 2.1, HDMI 2.1, USB-C" },
  { id: "pcie", name: "Bus", a: "PCIe 5.0 x16", b: "Not listed" },
  { id: "av1", name: "AV1 encode", a: "Yes", b: "Yes" },
  { id: "size", name: "Length and slots", a: "Not listed", b: "287 mm, 2.5 slots" },
  {
    id: "os",
    name: "OS support",
    a: "Windows 10 64-bit, Windows 11 64-bit, Linux x86 64-bit",
    b: "Windows 10 64-bit, Windows 11 64-bit, Ubuntu x86 64-bit, Linux x86 64-bit",
  },
  { id: "fsr-label", name: "FSR name on the product feature list", a: 'AMD FSR "Redstone"', b: "AMD FSR" },
];

const TABLE = [
  "AMD specification figures for the Radeon RX 9070 XT and the Radeon RX 7900 XTX, opened 8 November 2026. Counts and ratings are not a matched game test. Effective memory bandwidth is AMD's separate label and is not the GDDR memory-bandwidth figure. Not listed is the label when AMD's current specification for that card has no such figure.",
  "| Specification | Radeon RX 9070 XT | Radeon RX 7900 XTX |",
  "| --- | --- | --- |",
  ...SPEC_ROWS.map((row) => `| ${row.name} | ${row.a} | ${row.b} |`),
].join("\n");

const SHORT_ANSWER =
  "AMD's current specifications list the Radeon RX 9070 XT at 16 GB of GDDR6 and 304 W typical board power, and the Radeon RX 7900 XTX at 24 GB of GDDR6, 355 W typical board power, and a December 13, 2022 launch date. Those figures do not decide a gaming winner: a newer series, more memory, more compute units, more bandwidth, or a lower board-power rating is not a measured result.";

const FAQS = [
  {
    question: "Is the RX 7900 XTX better than the RX 9070 XT?",
    answer:
      "AMD's current specifications list more memory (24 GB vs 16 GB), more compute units (96 vs 64), and more memory bandwidth (up to 960 GB/s vs up to 640 GB/s) for the RX 7900 XTX. The RX 9070 XT is the card whose feature list names FSR \"Redstone\", and AMD's FSR hardware table puts that suite on Radeon RX 9000 Series graphics and above. None of those differences is a matched game test, so this matchup does not call either card the gaming winner.",
  },
  {
    question: "Does FSR 4 work on the RX 7900 XTX?",
    answer:
      "For upscaling, AMD's current documents list the RX 7000 series, with limits. AMD's FSR technologies listing, opened 8 November 2026, says FSR 4 has been renamed FSR Upscaling, and that FSR Upscaling with ML technologies is available on Radeon RX 6000, RX 7000 Series, and RX 9000 Series graphics cards. The same listing's FSR Upscaling 4.1 section includes Radeon RX 6000 Series desktop graphics and higher. AMD's GPUOpen post of June 24, 2026 lists FSR Upscaling 4.1.1 for Radeon RX 9000 and RX 7000 series discrete GPUs and requires Shader Model 6.6. That post does not list the RX 6000 series on the 4.1.1 line. Support still depends on the game and the graphics API. It is upscaling support, not frame generation, ray regeneration, or radiance caching.",
  },
  {
    question: "Which card does AMD rate for more board power?",
    answer:
      "The RX 7900 XTX. AMD lists 355 W typical board power and an 800 W minimum PSU recommendation, against 304 W and 750 W for the RX 9070 XT. These are ratings and recommendations, not a measured wall-power test. AMD's note for the RX 7900 XTX bases the 800 W figure on a PC with a Ryzen 9 5900X and says other systems can differ.",
  },
  {
    question: "Do I need 24 GB of VRAM for gaming?",
    answer:
      "AMD lists 24 GB of GDDR6 on the RX 7900 XTX and 16 GB of GDDR6 on the RX 9070 XT. Memory capacity does not say which games will run, and it does not say that a creative application or a local model will run. Check the application's own requirements and whether that application supports the card.",
  },
  {
    question: "Which card is on AMD's FSR Redstone hardware row?",
    answer:
      "The RX 9070 XT. AMD's FSR hardware table names FSR \"Redstone\" for Radeon RX 9000 Series graphics and above, and names upscaling only for Radeon RX 6000 and RX 7000 series graphics. The RX 7900 XTX is an RX 7000 series card. AMD's June 24, 2026 GPUOpen requirements list Frame Generation 4.0.1, Ray Regeneration 1.2.0, and Radiance Caching 0.9.0, called a technical preview, for RX 9000 series GPUs and above. An older Frame Generation 3.1.6 line lists RX 5000 series graphics and above. Upscaling support is not the rest of the suite, and it is not every game.",
  },
  {
    question: "Should I buy a used RX 7900 XTX instead of a new RX 9070 XT?",
    answer:
      "AMD lists a December 13, 2022 launch date for the RX 7900 XTX. The current RX 9070 XT specification does not list a launch date. AMD's February 28, 2025 newsroom post said board-partner RX 9000 series cards were expected beginning March 6, 2025. Warranty, condition, and price are not on these specification sheets. A lower price or a longer warranty can change the decision. That is a conditional judgment, not a rule that one card is the purchase.",
  },
];

const VERDICT = `Consider the RX 9070 XT when a game you run uses an FSR "Redstone" feature that AMD's hardware table limits to Radeon RX 9000 Series graphics and above. AMD lists 16 GB of GDDR6, 64 compute units, 304 W typical board power, and a 750 W minimum PSU recommendation.

Consider the RX 7900 XTX when you need the 24 GB of GDDR6 AMD lists. AMD also lists 96 compute units, 355 W typical board power, an 800 W minimum PSU recommendation, and a launch date of December 13, 2022.

Neither card is right for everyone. These are specification and feature-list judgments, not a matched game test, and they are not a complete buying rule.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

- AMD lists 16 GB of GDDR6 on the RX 9070 XT and 24 GB of GDDR6 on the RX 7900 XTX. Capacity is not a promise that a game, a creative application, or a local model will run.
- AMD lists 64 compute units and a boost frequency up to 2970 MHz for the RX 9070 XT, and 96 compute units and a boost frequency up to 2500 MHz for the RX 7900 XTX. Ray-accelerator and AI-accelerator figures are counts, not a speed.
- AMD lists 304 W typical board power and a 750 W minimum PSU recommendation for the RX 9070 XT, and 355 W and 800 W for the RX 7900 XTX. Those are ratings and recommendations, not measured wall power.
- AMD's FSR hardware table puts FSR "Redstone" on Radeon RX 9000 Series graphics and above, and puts RX 6000 and RX 7000 series graphics on an upscaling-only line. Upscaling support is not frame generation, ray regeneration, or radiance caching support.
- No matched public game test of this pair is included. A newer series name is not a result.

Editorial judgment, not a test result: consider the RX 9070 XT when a game you run uses an FSR "Redstone" feature that AMD's hardware table limits to Radeon RX 9000 Series graphics and above. Consider the RX 7900 XTX when you need the 24 GB memory capacity AMD lists. Either choice still depends on whether the application supports the card, on the power supply, on the case, and on the exact card you can buy. This is not a complete buying rule.

## The current specifications list 16 GB and 24 GB

${TABLE}

Partner cards can use different clocks, lengths, and power limits than these AMD figures. Check the exact model against the case and the power supply.

## FSR upscaling is a different list from the Redstone suite

AMD's FSR technologies listing, opened 8 November 2026, says FSR 4 has been renamed FSR Upscaling, to separate it from the other features in FSR "Redstone". Redstone is a suite: FSR Upscaling, FSR Frame Generation, FSR Ray Regeneration, and FSR Radiance Caching.

The listing's FSR Upscaling 4.1 section says it is now available on Radeon RX 6000 Series Desktop graphics and higher, on Ryzen AI Max laptop processors, on Ryzen AI 9 laptop processors, and on Ryzen Z2A and Z2 Extreme handhelds. A later answer on the same listing says FSR Upscaling with ML technologies is available on Radeon RX 6000, RX 7000 Series, and RX 9000 Series graphics cards. The hardware table on that listing puts FSR "Redstone" on Radeon RX 9000 Series graphics and above, and puts "Upscaling Only" on Radeon RX 6000 and RX 7000 series graphics, Ryzen AI Max and AI 9 processors, and Ryzen Z2A and Z2 Extreme handhelds. A separate FSR 3 row lists frame generation for Radeon RX 5000 series graphics and above. That older row is not the Redstone frame-generation feature.

The same listing describes ML upscaling in over 400 supported games. That count is not every game, and it is not a promise that every Redstone feature runs on every listed card. AMD says these FSR versions are on select games, need game-developer integration, and are supported on select AMD products. Some games enable ML upscaling in the game menu, where the setting may still use the older name FSR 4. Other games that integrate FSR 3.1 or higher can be switched with AMD Software. AMD also describes an ML frame-generation upgrade for a game that already has FSR 3.1.4 frame generation. That enablement note does not move RX 7000 series cards onto the Redstone frame-generation row. A footnote dated from testing as of November 2025 says FSR "Redstone" is available on Radeon RX 9000 Series graphics, in select games, when the game has FSR 3.1 for upscaling and FSR 3.1.4 for frame generation.

AMD's GPUOpen post, originally posted June 24, 2026, is the developer requirements list. It says ML-based FSR Upscaling 4.1 was previously exclusive to RDNA 4 graphics cards, and that FSR Upscaling 4.1.1 makes that upscaler available on Radeon RX 7000 Series discrete GPUs. The supported-GPU list is narrower than the marketing introduction in the same post, so the introduction is not used as a support rule. The requirements say: FSR Upscaling 4.1.1 on Radeon RX 9000 and RX 7000 series discrete GPUs, requiring Shader Model 6.6; Frame Generation 4.0.1, Ray Regeneration 1.2.0, and Radiance Caching 0.9.0 (a technical preview) on Radeon RX 9000 Series GPUs and above, also requiring Shader Model 6.6; FSR 2.3.4 and 3.1.5 on Radeon RX 500 series GPUs and above, requiring Shader Model 6.2; Frame Generation 3.1.6 and the 3.1.7 swapchain on Radeon RX 5000 series graphics and above, requiring Shader Model 6.2. Shader Model 6.6 requires DirectX 12 Agility SDK 1.4.9 or later. The graphics API list is DirectX 12, plus an Unreal Engine 5 plugin that the post says still uses FSR Upscaling 4.0.3 and will move to 4.1.1 later. Windows 10 and Windows 11 are the listed operating systems, and Windows 11 is required for Frame Generation 4.0.0 and Ray Regeneration 1.1.0 and higher. The same post says analytical fallback modes for upscaling and frame generation support RDNA 3.5, RDNA 2, and older GPUs. It does not put the RX 6000 series on the 4.1.1 line.

The two AMD documents agree that an RX 7000 series discrete card such as the RX 7900 XTX is in the upscaling list, and that Frame Generation 4.0.1, Ray Regeneration 1.2.0, and Radiance Caching 0.9.0 are in the RX 9000 list. They do not use the same sentence for RX 6000 series ML upscaling. The November 8, 2026 listing includes RX 6000 Series desktop graphics in the 4.1 section. The June 24, 2026 requirements do not. This matchup does not treat RX 6000 support as settled.

AMD's February 28, 2025 newsroom post said the FSR 4 Upgrade feature in AMD Software: Adrenalin Edition was available exclusively on Radeon RX 9000 Series graphics cards, and that this feature covered over 30 games at launch. That exclusivity is for the Adrenalin Upgrade feature. It is not a rule for every form of FSR upscaling, and it is not the support list in the later documents.

The RX 9070 XT product feature list includes AMD FSR "Redstone". The RX 7900 XTX product feature list includes AMD FSR and does not use the Redstone name. A feature-list label is not the hardware table.

## Board-power and PSU figures are ratings

AMD lists 304 W typical board power for the RX 9070 XT and 355 W for the RX 7900 XTX. AMD lists a 750 W minimum PSU recommendation for the RX 9070 XT. For the RX 7900 XTX, AMD recommends a minimum 800 W power supply with 12 V output greater than 65 A, based on a PC configured with a Ryzen 9 5900X plus typical other parts, and says your system can differ (GD-223). The RX 9070 XT specification has no Ryzen 9 5900X system example beside its 750 W recommendation. Neither figure is measured wall power, and neither figure is an efficiency result. Both specifications list a 2x 8-pin extra power connector. The RX 7900 XTX specification lists a 287 mm length and 2.5 slots. The RX 9070 XT specification does not list a length or a slot count.

## This pair is the RX 9070 XT and the RX 7900 XTX

The RX 9070 XT is not the RX 9070. AMD's current RX 9070 specification lists 56 compute units, 16 GB of GDDR6, and 220 W typical board power. The RX 7900 XTX is not the RX 7900 XT. AMD's current RX 7900 XT specification lists 84 compute units, 20 GB of GDDR6, 315 W typical board power, and a launch date of December 13, 2022. RX 9070 vs RX 9070 XT, RX 7900 XT vs RTX 4070 Ti, and RTX 5070 vs RX 9070 XT are separate matchups.

## The current boost figure is not the February 2025 boost figure

The current RX 9070 XT specification lists a game frequency of 2400 MHz and a boost frequency of up to 2970 MHz. AMD's February 28, 2025 newsroom post listed a 2.4 GHz game clock and a boost clock of up to 3.0 GHz for the RX 9070 XT. Footnote 6 on that post (GD-151) says boost clock is the maximum frequency on a bursty workload and that achievability, frequency, and sustainability vary with thermals and the workload. Those are two dated AMD statements, not one number. The same post said board-partner RX 9000 series cards were expected beginning March 6, 2025. The current RX 7900 XTX specification lists a game frequency of 2300 MHz, a boost frequency of up to 2500 MHz, and a launch date of December 13, 2022.

## Memory capacity is not application support

24 GB is the memory capacity AMD lists for the RX 7900 XTX. 16 GB is the capacity AMD lists for the RX 9070 XT. A larger capacity does not, by itself, mean a game, a creative application, or a local model will run. The application has to support the card, and the application publisher is the source for its own memory requirement. AMD lists a 256-bit memory interface for the RX 9070 XT and does not list a bus width for the RX 7900 XTX. AMD lists memory bandwidth up to 640 GB/s and up to 960 GB/s. The 3500 GB/s figure is AMD's effective-memory-bandwidth label on the RX 7900 XTX only.`;

const BUILT = buildEditorialComparison({
  slug: "rx-9070-xt-vs-rx-7900-xtx",
  title: "RX 9070 XT vs RX 7900 XTX: Which GPU?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "AMD Radeon RX 9070 XT",
      shortDesc: "Radeon RX 9000 Series desktop card. AMD lists 64 compute units, 16 GB of GDDR6, and 304 W typical board power.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "16 GB GDDR6 on a 256-bit interface (AMD specification)",
        "64 compute units and 4096 stream processors (AMD specification)",
        'Feature list names AMD FSR "Redstone" (AMD specification)',
      ],
      cons: [
        "304 W typical board power and a 750 W minimum PSU recommendation (AMD ratings)",
        "16 GB is the memory capacity AMD lists, against 24 GB on the RX 7900 XTX",
      ],
      bestFor: "A card to weigh when you need an FSR Redstone feature AMD limits to the RX 9000 series row",
    },
    {
      id: B,
      slug: B,
      name: "AMD Radeon RX 7900 XTX",
      shortDesc: "Radeon RX 7000 Series card. AMD lists 96 compute units, 24 GB of GDDR6, 355 W typical board power, and a December 13, 2022 launch date.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "24 GB GDDR6 and memory bandwidth up to 960 GB/s (AMD specification)",
        "96 compute units and 6144 stream processors (AMD specification)",
        "Launch date listed as December 13, 2022 (AMD specification)",
      ],
      cons: [
        "355 W typical board power and an 800 W minimum PSU recommendation (AMD ratings)",
        "AMD's FSR hardware table puts RX 7000 series graphics on the upscaling-only line for FSR Redstone",
      ],
      bestFor: "A card to weigh when you need the 24 GB memory capacity AMD lists",
    },
  ],
  keyDifferences: [
    { label: "Memory", entityAValue: "16 GB GDDR6", entityBValue: "24 GB GDDR6", winner: "tie" },
    { label: "Compute units", entityAValue: "64", entityBValue: "96", winner: "tie" },
    { label: "Typical board power", entityAValue: "304 W", entityBValue: "355 W", winner: "tie" },
    { label: "Minimum PSU recommendation", entityAValue: "750 W", entityBValue: "800 W", winner: "tie" },
    { label: "Launch date on the current specification", entityAValue: "Not listed", entityBValue: "December 13, 2022", winner: "tie" },
    {
      label: "FSR Redstone hardware table",
      entityAValue: "RX 9000 Series row",
      entityBValue: "RX 7000 upscaling-only row",
      winner: "tie",
    },
  ],
  attributes: SPEC_ROWS.map((row) => textAttr(row.id, row.name, SPEC, A, B, row.a, row.b)),
  faqs: FAQS,
  relatedComparisons: [
    { slug: "rx-9070-vs-rx-9070-xt", title: "RX 9070 vs RX 9070 XT", category: "technology" },
    { slug: "rx-7900-xt-vs-rtx-4070-ti", title: "RX 7900 XT vs RTX 4070 Ti", category: "technology" },
    { slug: "rtx-5070-vs-rx-9070-xt", title: "RTX 5070 vs RX 9070 XT", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "No gaming winner from these specifications. Weigh the RX 9070 XT for an FSR Redstone feature AMD limits to the RX 9000 series row. Weigh the RX 7900 XTX for the 24 GB capacity AMD lists.",
    keyFact:
      "AMD lists 16 GB GDDR6 and 304 W for the RX 9070 XT, and 24 GB GDDR6 and 355 W for the RX 7900 XTX. Those are specifications, not a frame-rate result.",
  },
  citationStats: {
    sourceCount: 7,
    dataPointCount: 0,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "AMD Radeon RX 9070 XT specification, opened 8 November 2026", url: AMD_9070XT },
      { name: "AMD Radeon RX 7900 XTX specification, opened 8 November 2026", url: AMD_7900XTX },
      { name: "AMD FSR technologies listing, opened 8 November 2026", url: AMD_FSR },
      { name: "AMD GPUOpen: FSR SDK 2.3, originally posted 24 June 2026", url: AMD_GPUOPEN },
      { name: "AMD Radeon RX 9070 specification, opened 8 November 2026", url: AMD_9070 },
      { name: "AMD Radeon RX 7900 XT specification, opened 8 November 2026", url: AMD_7900XT },
      { name: "AMD Newsroom: RDNA 4 launch, 28 February 2025", url: AMD_LAUNCH },
    ],
  },
  resources: [
    {
      type: "external",
      label: "AMD Radeon RX 9070 XT specification, opened 8 November 2026",
      url: AMD_9070XT,
      description:
        "RX 9000 Series desktop card: 64 compute units, 4096 stream processors, 64 ray accelerators, 128 AI accelerators, game frequency 2400 MHz, boost up to 2970 MHz, 16 GB GDDR6, 256-bit, up to 640 GB/s, 64 MB Infinity Cache, 304 W, 750 W minimum PSU, 2x 8-pin, DisplayPort 2.1a, HDMI 2.1b, PCIe 5.0 x16, AV1 encode, FSR Redstone on the feature list. No launch date on this specification.",
    },
    {
      type: "external",
      label: "AMD Radeon RX 7900 XTX specification, opened 8 November 2026",
      url: AMD_7900XTX,
      description:
        "RX 7000 Series card, launch date 12/13/2022: 96 compute units, 6144 stream processors, 96 ray accelerators, 192 AI accelerators, game frequency 2300 MHz, boost up to 2500 MHz, 24 GB GDDR6, up to 960 GB/s, effective memory bandwidth up to 3500 GB/s, 96 MB Infinity Cache, 355 W, 800 W minimum PSU with the Ryzen 9 5900X note GD-223, 2x 8-pin, DisplayPort 2.1, HDMI 2.1, USB-C, 287 mm, 2.5 slots, AV1 encode. No memory-interface width and no bus type on this specification.",
    },
    {
      type: "external",
      label: "AMD FSR technologies listing, opened 8 November 2026",
      url: AMD_FSR,
      description:
        "FSR 4 renamed FSR Upscaling. FSR Upscaling 4.1 section includes RX 6000 Series desktop graphics and higher. ML upscaling answer names RX 6000, RX 7000, and RX 9000. Redstone hardware row is RX 9000 Series and above. Upscaling only on RX 6000 and RX 7000. Select games and developer integration. Not a frame-rate comparison.",
    },
    {
      type: "external",
      label: "AMD GPUOpen: FSR SDK 2.3, originally posted 24 June 2026",
      url: AMD_GPUOPEN,
      description:
        "FSR Upscaling 4.1.1 for RX 9000 and RX 7000 series discrete GPUs, Shader Model 6.6. Frame Generation 4.0.1, Ray Regeneration 1.2.0, and Radiance Caching 0.9.0 technical preview for RX 9000 Series and above. DirectX 12. Unreal Engine 5 plugin still on Upscaling 4.0.3. Windows 11 required for Frame Generation 4.0.0 and Ray Regeneration 1.1.0 and higher.",
    },
    {
      type: "external",
      label: "AMD Radeon RX 9070 specification, opened 8 November 2026",
      url: AMD_9070,
      description:
        "The non-XT card: 56 compute units, 16 GB GDDR6, 220 W typical board power. Not the RX 9070 XT in this matchup.",
    },
    {
      type: "external",
      label: "AMD Radeon RX 7900 XT specification, opened 8 November 2026",
      url: AMD_7900XT,
      description:
        "The non-XTX card: 84 compute units, 20 GB GDDR6, 315 W typical board power, launch date 12/13/2022. Not the RX 7900 XTX in this matchup.",
    },
    {
      type: "external",
      label: "AMD Newsroom: RDNA 4 launch, 28 February 2025",
      url: AMD_LAUNCH,
      description:
        "Dated launch statement only: RX 9070 XT game clock 2.4 GHz and boost clock up to 3.0 GHz, with GD-151. Board-partner cards expected beginning March 6, 2025. The FSR 4 Upgrade feature in AMD Software: Adrenalin Edition was described then as available exclusively on RX 9000 Series cards. That is the Upgrade feature, not every form of upscaling, and not the current boost figure or the current support list.",
    },
  ],
  metaTitle: "RX 9070 XT vs RX 7900 XTX: Which GPU?",
});

BUILT.metadata.metaDescription =
  "RX 9070 XT vs RX 7900 XTX: AMD lists 16 GB and 24 GB, power ratings, and FSR limits. No matched game test, so the specs are not a winner.";

export const RX_9070_XT_VS_RX_7900_XTX: EditorialComparison = BUILT;
