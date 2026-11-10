import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-408 — RTX 5070 vs RTX 5070 Ti.
 * Sources opened 10 November 2026 (Asia/Jerusalem):
 * NVIDIA GeForce RTX 5070 family specifications;
 * NVIDIA Newsroom, 6 January 2025 (announcement prices, not a ship date);
 * NVIDIA GeForce news, 5 March 2025 (RTX 5070 is out now);
 * Tom's Hardware GPU benchmarks hierarchy, article:modified_time 2026-06-24.
 *
 * $749.99 and $549.99 are not copied. The January 2025 announcement prints
 * $749 and $549 and does not use the word MSRP. Tom's MSRP column is unused.
 * "Available starting in February" is only the announcement's wording.
 * The 5 March 2025 post is the RTX 5070 availability date. No dollars-per-frame
 * figure. dataPointCount stays 0: the percents are arithmetic on cited inputs,
 * not a measurement dataset. PR 523 owns the shared "0 data points" wording.
 * winnerName stays null. isHumanReviewed stays false.
 */

const A = "rtx-5070";
const B = "rtx-5070-ti";

const NV_FAMILY = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/";
const NV_NEWS =
  "https://nvidianews.nvidia.com/news/nvidia-blackwell-geforce-rtx-50-series-opens-new-world-of-ai-computer-graphics";
const NV_OUT = "https://www.nvidia.com/en-us/geforce/news/rtx-5070-out-now/";
const TOMS = "https://www.tomshardware.com/reviews/gpu-hierarchy,4388.html";

const SOURCE_DATE = "2026-11-10";
const PUBLISHED = "2026-11-10T00:00:00Z";
const SPEC = "Specs";

const SHORT_ANSWER =
  "Choose the GeForce RTX 5070 Ti if you want the 16 GB GDDR7 card NVIDIA lists, with 8,960 CUDA cores, 300 W total graphics power, and 750 W required system power, and choose the GeForce RTX 5070 if you want the 12 GB GDDR7 card, with 6,144 CUDA cores, 250 W, and 650 W required system power. Neither card is right for everyone: Tom's Hardware's rasterization rankings, in the column headed 1440p Ultra, give 116.8 fps for the RTX 5070 Ti and 96.4 fps for the RTX 5070, and that pair of averages is that suite only.";

const VERDICT = `Choose the RTX 5070 Ti if you want the 16 GB GDDR7, 8,960 CUDA cores, 2.45 GHz boost clock, 1,406 AI TOPS, and 300 W configuration NVIDIA lists, and the PC meets 750 W required system power.

Choose the RTX 5070 if you want the 12 GB GDDR7, 6,144 CUDA cores, 2.51 GHz boost clock, 988 AI TOPS, and 250 W configuration, and 650 W required system power fits the PC.

Neither card is right for everyone. The raster gap in Tom's Hardware's 24 June 2026 hierarchy is 20.4 / 96.4 = 0.2116 in the 1440p Ultra column and 14.3 / 54.3 = 0.2634 in the 4K Ultra column. NVIDIA's 6 January 2025 announcement prices are $749 and $549.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways. NVIDIA lists 8,960 CUDA cores, 16 GB of GDDR7 on a 256-bit interface, a 2.45 GHz boost clock, a 2.3 GHz base clock, 1,406 AI TOPS, 300 W total graphics power, and 750 W required system power for the RTX 5070 Ti. NVIDIA lists 6,144 CUDA cores, 12 GB of GDDR7 on a 192-bit interface, a 2.51 GHz boost clock, a 2.33 GHz base clock, 988 AI TOPS, 250 W total graphics power, and 650 W required system power for the RTX 5070. The specifications table labels DLSS 4 on both cards, and the family marketing copy names DLSS 5 for 3D-Guided Neural Rendering on GeForce RTX 50 Series GPUs. Tom's Hardware's rasterization table, a geometric mean of 11 games, shows 116.8 fps for the RTX 5070 Ti and 96.4 fps for the RTX 5070 in the column headed 1440p Ultra, and 68.6 fps and 54.3 fps in the column headed 4K Ultra. Tom's Hardware's ray-tracing rankings show 66.2 fps for the RTX 5070 Ti and 51.5 fps for the RTX 5070 in the column headed 1440p Ultra. NVIDIA's 6 January 2025 announcement says the RTX 5070 Ti and the RTX 5070 would be available starting in February at $749 and $549. NVIDIA's GeForce news post dated 5 March 2025 says the GeForce RTX 5070 is out now, with the Founders Edition later in March.

Choose the RTX 5070 Ti for the 16 GB configuration and the 300 W power figure. Choose the RTX 5070 for the 12 GB configuration and the 250 W power figure. Three checks, in order. 1. Memory capacity and bus: 16 GB GDDR7 on 256-bit, against 12 GB GDDR7 on 192-bit. 2. Required system power: 750 W against 650 W, with the Ryzen 9 9950X footnote. 3. One dated Tom's Hardware hierarchy, modified 24 June 2026, rather than a general speed claim. In that raster table, 116.8 minus 96.4 is 20.4, and 20.4 / 96.4 = 0.2116 to four decimals, which is 21.2 percent to one decimal. At 4K, 68.6 minus 54.3 is 14.3, and 14.3 / 54.3 = 0.2634 to four decimals, which is 26.3 percent to one decimal. In the ray-tracing table, 66.2 minus 51.5 is 14.7, and 14.7 / 51.5 = 0.2854 to four decimals, which is 28.5 percent to one decimal. Those three percents describe those three columns.

NVIDIA's family specifications, opened 10 November 2026, put both cards on Blackwell, with 5th-generation Tensor Cores and 4th-generation RT Cores. The RTX 5070 Ti row is 1,406 AI TOPS and 133 TFLOPS. The RTX 5070 row is 988 AI TOPS and 94 TFLOPS. The same announcement on 6 January 2025 prints 1,406 AI TOPS for the RTX 5070 Ti and 988 AI TOPS for the RTX 5070. Boost clock is 2.45 GHz on the RTX 5070 Ti and 2.51 GHz on the RTX 5070, so the card with fewer CUDA cores has the higher boost clock in the table. Base clock is 2.3 GHz and 2.33 GHz. A higher boost clock is not, by itself, a frame-rate result. NVIDIA lists two ninth-generation NVENC encoders on the RTX 5070 Ti and one ninth-generation NVENC encoder on the RTX 5070, one sixth-generation NVDEC on each, and AV1 encode on each. No encode-quality result is included. Both rows list PCI Express Gen 5, up to four displays, and 4K at 480Hz or 8K at 165Hz with DSC. The RTX 5070 reference card is 242 mm long, 112 mm wide, and two slots. RTX 5070 Ti length, width, and slot count vary by manufacturer.

The specifications table labels NVIDIA DLSS as DLSS 4 for both cards and lists Super Resolution, DLAA, Ray Reconstruction, Frame Generation, and Multi Frame Generation on both. The family marketing copy says DLSS 5 introduces 3D-Guided Neural Rendering on GeForce RTX 50 Series GPUs. Both labels are repeated here. Reflex 2 and a low-latency mode are listed for both, and Frame Warp is marked coming soon for both. The 6 January 2025 announcement headline also names DLSS 4.

Tom's Hardware's GPU benchmarks hierarchy was modified 24 June 2026 and opened 10 November 2026. Tom's says the results are collected at native resolution, without enabling DLSS, FSR, or XeSS upscaling or frame generation. The June 2026 update says the data covers 48 GPUs across 19 separate tests, including eight RT titles. The test-setup section names an AMD Ryzen 7 9800X3D, a Thermalright Phantom Spirit 120 SE cooler, 32 GB (2x16 GB) of DDR5-6000 CL30, an Asus TUF Gaming X670E-Plus Wifi motherboard, and an MSI MPG Ai1600TS 1600W power supply. Tom's says the rasterization FPS score is the geometric mean, with equal weighting, of all 11 raster games, and that cards are tested at a mix of high and ultra settings depending on the game. The column heading 1440p Ultra is the heading in the rankings table. It is not a claim that every game used one shared Ultra preset. In that rasterization table the RTX 5070 Ti row is 155.4 fps at 1080p Ultra, 116.8 fps at 1440p Ultra, and 68.6 fps at 4K Ultra. The RTX 5070 row is 132.6 fps, 96.4 fps, and 54.3 fps in those same columns.

The ray-tracing rankings use the same column headings. Tom's June 2026 update counts eight RT titles. The ray-tracing section does not call that score a geometric mean, so these cells are the figures in that table. The RTX 5070 Ti row is 90.4 fps at 1080p Ultra, 66.2 fps at 1440p Ultra, and 36.7 fps at 4K Ultra. The RTX 5070 row is 74.1 fps, 51.5 fps, and 22.7 fps. The 28.5 percent figure is 14.7 / 51.5 in the 1440p Ultra ray-tracing column. It is not a general ray-tracing claim outside that column.

The 6 January 2025 announcement says the RTX 5070 Ti and the RTX 5070 would be available starting in February at $749 and $549. 749 minus 549 is 200, and 200 / 549 = 0.3643 to four decimals, which is 36.4 percent to one decimal. That ratio compares the two announcement prices. NVIDIA's GeForce news post dated 5 March 2025 says the GeForce RTX 5070 is out now. Stock-clocked and factory-overclocked models are available, and the Founders Edition will be available later in March. No other retail pair is used.

Memory is the capacity NVIDIA lists: 16 GB of GDDR7 on a 256-bit interface, against 12 GB of GDDR7 on a 192-bit interface. More memory does not by itself make a card produce a higher frame rate. No source opened for this draft measures how long either capacity stays comfortable, so no lifespan is stated.

Power is the third check. Total graphics power is 300 W on the RTX 5070 Ti and 250 W on the RTX 5070. Required system power is 750 W and 650 W. Footnote 5 says the minimum is based on a PC configured with a Ryzen 9 9950X processor, recommends a PCIe CEM 5.1 compliant power supply, and says power requirements can be different depending on system configuration. Both cards list two PCIe 8-pin cables, with an adapter in the box, or one 300 W or greater PCIe Gen 5 cable. Add-in-card specifications can vary. Maximum GPU temperature in the table is 88 C for the RTX 5070 Ti and 85 C for the RTX 5070.

In the same Tom's Hardware rasterization table, the Radeon RX 9070 XT row is 156.6 fps at 1080p Ultra, 116.5 fps at 1440p Ultra, and 65.8 fps at 4K Ultra, next to 155.4, 116.8, and 68.6 for the RTX 5070 Ti. The 1440p pair differs by 0.3 fps. The 4K pair differs by 2.8 fps. In the ray-tracing table the RX 9070 XT row is 77.8 fps, 55.5 fps, and 30.1 fps, next to 90.4, 66.2, and 36.7 for the RTX 5070 Ti. Those are the cells in that hierarchy. They are not a store-price comparison, and no RX 9070 XT price is copied here. RTX 5070 vs RX 9070 XT vs RTX 5070 Ti is the three-card matchup. RTX 5070 vs RX 9070 XT is the two-card matchup with the Radeon.

An RTX 3070 is a different card. These Tom's Hardware rows do not include an RTX 3070 result, so no upgrade size is stated. The power figures are the check against the PC you already have. A 1440p or 4K monitor choice is separate from this GPU pair.`;

const FAQS = [
  {
    question: "What does Tom's Hardware's rasterization table report for the RTX 5070 and RTX 5070 Ti?",
    answer:
      "In Tom's Hardware's rasterization rankings, modified 24 June 2026, the RTX 5070 Ti row is 155.4 fps, 116.8 fps, and 68.6 fps in the columns headed 1080p Ultra, 1440p Ultra, and 4K Ultra. The RTX 5070 row is 132.6 fps, 96.4 fps, and 54.3 fps. Tom's says that raster score is the geometric mean of 11 raster games at a mix of high and ultra settings depending on the game. 20.4 / 96.4 = 0.2116 in the 1440p Ultra column, and 14.3 / 54.3 = 0.2634 in the 4K Ultra column. Those ratios are those columns only.",
  },
  {
    question: "What does Tom's Hardware's ray-tracing table report for the RTX 5070 and RTX 5070 Ti?",
    answer:
      "In the ray-tracing rankings from the same 24 June 2026 hierarchy, the RTX 5070 Ti row is 90.4 fps, 66.2 fps, and 36.7 fps in the columns headed 1080p Ultra, 1440p Ultra, and 4K Ultra. The RTX 5070 row is 74.1 fps, 51.5 fps, and 22.7 fps. 14.7 / 51.5 = 0.2854 in the 1440p Ultra column, which is 28.5 percent to one decimal. Tom's ray-tracing section does not repeat the geometric-mean sentence used for the raster score.",
  },
  {
    question: "How much memory and how many CUDA cores does NVIDIA list?",
    answer:
      "NVIDIA's family specifications list 8,960 CUDA cores, 16 GB of GDDR7, and a 256-bit memory interface for the RTX 5070 Ti, and 6,144 CUDA cores, 12 GB of GDDR7, and a 192-bit interface for the RTX 5070. Boost clock is 2.45 GHz and 2.51 GHz. Base clock is 2.3 GHz and 2.33 GHz. More memory does not by itself make a card produce a higher frame rate, and no lifespan is stated.",
  },
  {
    question: "What power supply does NVIDIA list for the RTX 5070 and RTX 5070 Ti?",
    answer:
      "NVIDIA lists 300 W total graphics power and 750 W required system power for the RTX 5070 Ti, and 250 W and 650 W for the RTX 5070. Footnote 5 says the minimum is based on a PC configured with a Ryzen 9 9950X processor, recommends a PCIe CEM 5.1 compliant power supply, and says power requirements can be different depending on system configuration. Both cards list two PCIe 8-pin cables, with an adapter in the box, or one 300 W or greater PCIe Gen 5 cable.",
  },
  {
    question: "What prices did NVIDIA announce on January 6, 2025?",
    answer:
      "NVIDIA's 6 January 2025 announcement says the RTX 5070 Ti, with 1,406 AI TOPS, and the RTX 5070, with 988 AI TOPS, would be available starting in February at $749 and $549. 749 minus 549 is 200, and 200 / 549 = 0.3643 to four decimals, which is 36.4 percent to one decimal. NVIDIA's GeForce news post dated 5 March 2025 says the GeForce RTX 5070 is out now, and that the Founders Edition will be available later in March.",
  },
  {
    question: "How does the RX 9070 XT compare in those Tom's Hardware tables?",
    answer:
      "In the same rasterization table the RX 9070 XT row is 156.6 fps, 116.5 fps, and 65.8 fps, next to 155.4, 116.8, and 68.6 for the RTX 5070 Ti. The 1440p pair differs by 0.3 fps and the 4K pair by 2.8 fps. In the ray-tracing table the RX 9070 XT row is 77.8 fps, 55.5 fps, and 30.1 fps, next to 90.4, 66.2, and 36.7. No RX 9070 XT price is copied here. RTX 5070 vs RX 9070 XT vs RTX 5070 Ti is the three-card matchup, and RTX 5070 vs RX 9070 XT is the two-card matchup with the Radeon.",
  },
];

const BUILT = buildEditorialComparison({
  slug: "rtx-5070-vs-rtx-5070-ti",
  title: "RTX 5070 vs RTX 5070 Ti",
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
      pros: [],
      cons: [],
      bestFor: null,
    },
    {
      id: B,
      slug: B,
      name: "RTX 5070 Ti",
      shortDesc: "Blackwell card with 16 GB of GDDR7, 8,960 CUDA cores, and 300 W total graphics power.",
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
      label: "Memory",
      entityAValue: "12 GB GDDR7, 192-bit",
      entityBValue: "16 GB GDDR7, 256-bit",
      winner: "tie",
    },
    {
      label: "CUDA cores",
      entityAValue: "6,144",
      entityBValue: "8,960",
      winner: "tie",
    },
    {
      label: "Total graphics power",
      entityAValue: "250 W",
      entityBValue: "300 W",
      winner: "tie",
    },
    {
      label: "Required system power",
      entityAValue: "650 W, Ryzen 9 9950X footnote",
      entityBValue: "750 W, Ryzen 9 9950X footnote",
      winner: "tie",
    },
    {
      label: "Raster 1440p Ultra column",
      entityAValue: "96.4 fps (Tom's Hardware, 24 June 2026)",
      entityBValue: "116.8 fps (Tom's Hardware, 24 June 2026)",
      winner: "tie",
    },
    {
      label: "6 January 2025 announcement price",
      entityAValue: "$549 in the 6 January 2025 announcement. Out now 5 March 2025; Founders Edition later in March",
      entityBValue: "$749 in the 6 January 2025 announcement",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("arch", "Architecture", SPEC, A, B, "Blackwell (NVIDIA)", "Blackwell (NVIDIA)"),
    textAttr("cuda", "CUDA cores", SPEC, A, B, "6,144 (NVIDIA)", "8,960 (NVIDIA)"),
    textAttr("memory", "Memory", SPEC, A, B, "12 GB GDDR7 (NVIDIA)", "16 GB GDDR7 (NVIDIA)"),
    textAttr("bus", "Memory interface", SPEC, A, B, "192-bit (NVIDIA)", "256-bit (NVIDIA)"),
    textAttr(
      "clocks",
      "Clocks",
      SPEC,
      A,
      B,
      "Base 2.33 GHz. Boost 2.51 GHz (NVIDIA)",
      "Base 2.3 GHz. Boost 2.45 GHz (NVIDIA)",
    ),
    textAttr(
      "tensor",
      "Tensor cores and AI TOPS",
      SPEC,
      A,
      B,
      "5th generation, 988 AI TOPS (NVIDIA)",
      "5th generation, 1,406 AI TOPS (NVIDIA)",
    ),
    textAttr(
      "rt",
      "RT cores",
      SPEC,
      A,
      B,
      "4th generation, 94 TFLOPS (NVIDIA)",
      "4th generation, 133 TFLOPS (NVIDIA)",
    ),
    textAttr("power", "Total graphics power", SPEC, A, B, "250 W (NVIDIA)", "300 W (NVIDIA)"),
    textAttr(
      "psu",
      "Required system power",
      SPEC,
      A,
      B,
      "650 W, based on a Ryzen 9 9950X PC (NVIDIA footnote 5)",
      "750 W, based on a Ryzen 9 9950X PC (NVIDIA footnote 5)",
    ),
    textAttr(
      "connector",
      "Power connector",
      SPEC,
      A,
      B,
      "2x PCIe 8-pin cables (adapter in box) or one 300 W or greater PCIe Gen 5 cable (NVIDIA)",
      "2x PCIe 8-pin cables (adapter in box) or one 300 W or greater PCIe Gen 5 cable (NVIDIA)",
    ),
    textAttr(
      "dlss",
      "DLSS label",
      SPEC,
      A,
      B,
      "Specifications table: DLSS 4. Marketing copy: DLSS 5 on GeForce RTX 50 Series (NVIDIA)",
      "Specifications table: DLSS 4. Marketing copy: DLSS 5 on GeForce RTX 50 Series (NVIDIA)",
    ),
    textAttr(
      "encode",
      "Video encode",
      SPEC,
      A,
      B,
      "1x ninth-generation NVENC. AV1 encode (NVIDIA). No quality result",
      "2x ninth-generation NVENC. AV1 encode (NVIDIA). No quality result",
    ),
    textAttr(
      "raster1440",
      "Raster column headed 1440p Ultra",
      SPEC,
      A,
      B,
      "96.4 fps. Geometric mean of 11 raster games (Tom's Hardware, modified 24 June 2026)",
      "116.8 fps. Geometric mean of 11 raster games (Tom's Hardware, modified 24 June 2026)",
    ),
    textAttr(
      "raster4k",
      "Raster column headed 4K Ultra",
      SPEC,
      A,
      B,
      "54.3 fps (Tom's Hardware, modified 24 June 2026)",
      "68.6 fps (Tom's Hardware, modified 24 June 2026)",
    ),
    textAttr(
      "rt1440",
      "Ray-tracing column headed 1440p Ultra",
      SPEC,
      A,
      B,
      "51.5 fps (Tom's Hardware, modified 24 June 2026)",
      "66.2 fps (Tom's Hardware, modified 24 June 2026)",
    ),
    textAttr(
      "price",
      "6 January 2025 announcement price",
      SPEC,
      A,
      B,
      "$549 in the 6 January 2025 announcement. 5 March 2025 GeForce news: out now; Founders Edition later in March",
      "$749 in the 6 January 2025 announcement",
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti",
      title: "RTX 5070 vs RX 9070 XT vs RTX 5070 Ti: Which GPU to Buy?",
      category: "technology",
    },
    {
      slug: "rtx-5070-vs-rx-9070-xt",
      title: "RTX 5070 vs RX 9070 XT: Same-Price GPU",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: null,
    keyFact:
      "NVIDIA lists 16 GB GDDR7 and 300 W on the RTX 5070 Ti, and 12 GB GDDR7 and 250 W on the RTX 5070. Tom's Hardware's 24 June 2026 raster column headed 1440p Ultra shows 116.8 fps for the RTX 5070 Ti and 96.4 fps for the RTX 5070.",
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 0,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "NVIDIA GeForce RTX 5070 family specifications", url: NV_FAMILY },
      { name: "NVIDIA Newsroom: GeForce RTX 50 Series (6 January 2025)", url: NV_NEWS },
      { name: "NVIDIA GeForce news: GeForce RTX 5070 out now (5 March 2025)", url: NV_OUT },
      { name: "Tom's Hardware GPU benchmarks hierarchy (modified 24 June 2026)", url: TOMS },
    ],
  },
  resources: [
    {
      type: "external",
      label: "NVIDIA GeForce RTX 5070 family specifications",
      url: NV_FAMILY,
      description:
        "Opened 10 November 2026. RTX 5070 Ti: 8,960 CUDA cores, 16 GB GDDR7, 256-bit, boost 2.45 GHz, base 2.3 GHz, 1,406 AI TOPS, 133 TFLOPS, 300 W, 750 W, two ninth-generation NVENC encoders. RTX 5070: 6,144 CUDA cores, 12 GB GDDR7, 192-bit, boost 2.51 GHz, base 2.33 GHz, 988 AI TOPS, 94 TFLOPS, 250 W, 650 W, one ninth-generation NVENC encoder. Specifications table: DLSS 4. Marketing copy: DLSS 5.",
    },
    {
      type: "external",
      label: "NVIDIA Newsroom: GeForce RTX 50 Series (6 January 2025)",
      url: NV_NEWS,
      description:
        "Opened 10 November 2026. The announcement says the RTX 5070 Ti, with 1,406 AI TOPS, and the RTX 5070, with 988 AI TOPS, would be available starting in February at $749 and $549. It does not use the word MSRP.",
    },
    {
      type: "external",
      label: "NVIDIA GeForce news: GeForce RTX 5070 out now (5 March 2025)",
      url: NV_OUT,
      description:
        "Andrew Burnes, 5 March 2025, opened 10 November 2026. The GeForce RTX 5070 is out now. Stock-clocked and factory-overclocked models are available. The Founders Edition will be available later in March.",
    },
    {
      type: "external",
      label: "Tom's Hardware GPU benchmarks hierarchy (modified 24 June 2026)",
      url: TOMS,
      description:
        "Opened 10 November 2026. Modified 24 June 2026. Results collected at native resolution, without DLSS, FSR, or XeSS upscaling or frame generation. June 2026 update: 48 GPUs across 19 separate tests, including eight RT titles. Raster geometric mean of 11 games at a mix of high and ultra settings: RTX 5070 Ti 155.4 / 116.8 / 68.6 fps and RTX 5070 132.6 / 96.4 / 54.3 fps. Ray-tracing table: 90.4 / 66.2 / 36.7 and 74.1 / 51.5 / 22.7. RX 9070 XT raster 156.6 / 116.5 / 65.8 and ray tracing 77.8 / 55.5 / 30.1. Test PC uses a Ryzen 7 9800X3D.",
    },
  ],
  metaTitle: "RTX 5070 vs RTX 5070 Ti",
});

BUILT.metadata.metaDescription =
  "NVIDIA lists 16 GB GDDR7 and 300 W on the RTX 5070 Ti, and 12 GB GDDR7 and 250 W on the RTX 5070. Tom's Hardware figures are one 24 June 2026 hierarchy.";

export const RTX_5070_VS_RTX_5070_TI: EditorialComparison = BUILT;
