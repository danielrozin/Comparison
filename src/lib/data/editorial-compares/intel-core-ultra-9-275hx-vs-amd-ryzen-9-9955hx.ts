import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-370 — Intel Core Ultra 9 275HX vs AMD Ryzen 9 9955HX (gaming laptops).
 * Read on 3 November 2026 (Asia/Jerusalem).
 * Intel's specification URL returned HTTP 403, so Intel core count, the
 * no-hyperthreading note, the 55 W figure, and the short 150 W+ draw come
 * from Notebookcheck only. AMD clocks, cache, and TDP come from AMD.
 * No winner. No street prices. No battery ranking (Notebookcheck withheld
 * that measurement). No Thunderbolt claim. No Reddit quotes.
 */

const A = "intel-core-ultra-9-275hx";
const B = "amd-ryzen-9-9955hx";

const NOTEBOOKCHECK =
  "https://www.notebookcheck.net/AMD-Ryzen-9-9955HX-vs-Intel-Core-Ultra-9-275HX-Analysis-The-battle-for-the-fastest-gaming-CPU.989996.0.html";
const AMD_9955HX =
  "https://www.amd.com/en/products/processors/laptop/ryzen/9000-series/amd-ryzen-9-9955hx.html";
const AMD_9955HX3D =
  "https://www.amd.com/en/products/processors/laptop/ryzen/9000-series/amd-ryzen-9-9955hx3d.html";

const SOURCE_DATE = "2026-11-03";
const PUBLISHED = "2026-11-03T00:00:00Z";

const SHORT_ANSWER =
  "Choose the Ryzen 9 9955HX when the laptop GPU matches and gaming frame rate is the priority. Notebookcheck reports an average advantage of 5 percent at 1080p, and around 5 percent at 1440p, with the same GeForce RTX 5090 Laptop GPU. Choose the Core Ultra 9 275HX when Cinebench 2024 multi-core matters more: Notebookcheck lists 2,223 points for it and 2,058 for the Ryzen 9 9955HX. Neither CPU is right for every gaming laptop. Compare the GPU and its wattage first, then the price of the two laptop versions.";

const FAQS = [
  {
    question: "Is the Ryzen 9 9955HX or Core Ultra 9 275HX better for gaming?",
    answer:
      "Notebookcheck tested both with a GeForce RTX 5090 Laptop GPU that can draw up to 175 W, on driver 572.84. It reports an average advantage of 5 percent for the Ryzen 9 9955HX at 1080p. Its 1080p rating is 99.7 points for the Ryzen and 95.4 for the Core Ultra 9. Call of Duty Black Ops 6 was tied at 1080p, at 147 fps. At 1440p Notebookcheck reports the Ryzen ahead in every game in that set, with the difference again around 5 percent (rating 100 points against 94.5). At 4K the gap is smaller (100 points against 96.3), and Notebookcheck reports a slight lead for the Ryzen in each listed game. The two laptops were not identical: the Intel system had 64 GB of memory and the AMD system was an engineering sample with 32 GB.",
  },
  {
    question: "Which is better for productivity, the Core Ultra 9 275HX or Ryzen 9 9955HX?",
    answer:
      "It depends on the test. In Cinebench 2024 multi-core, Notebookcheck lists 2,223 points for the Core Ultra 9 275HX and 2,058 for the Ryzen 9 9955HX, marked +8 percent for the Intel chip. Cinebench 2024 single-core is 138 points against 129, marked +7 percent for the Core Ultra 9. Geekbench 6.7 single-core lists 3,230 points for the Ryzen and 3,158 for the Core Ultra 9, marked -2 percent. Geekbench 6.7 multi-core lists 21,668 points for the Core Ultra 9, marked +11 percent, and 19,563 for the Ryzen. PCMark 10's overall score favors the Ryzen, 9,402 against 8,623. CrossMark overall is close, 2,259 against 2,221. 3DMark Time Spy CPU favors the Core Ultra 9, 17,285 against 13,188.",
  },
  {
    question: "How many cores do the 275HX and 9955HX have?",
    answer:
      "Notebookcheck describes the Core Ultra 9 275HX as 24 cores, 8 performance and 16 efficiency, without hyperthreading. AMD lists 16 cores and 32 threads for the Ryzen 9 9955HX, with SMT, a boost of up to 5.4 GHz, a 2.5 GHz base clock, and 64 MB of L3 cache.",
  },
  {
    question: "Does the CPU matter much in a gaming laptop?",
    answer:
      "Less than the GPU in Notebookcheck's test. The gaming gap it reports is about 5 percent at 1080p and around 5 percent at 1440p when both laptops use a GeForce RTX 5090 Laptop GPU. GPU tier, GPU wattage, cooling, memory, and the price of the full laptop usually matter more than picking between these two CPUs.",
  },
  {
    question: "Should I get the Ryzen 9 9955HX3D instead?",
    answer:
      "AMD lists the Ryzen 9 9955HX3D with 16 cores, 32 threads, a boost of up to 5.4 GHz, a 55 W default TDP, and 128 MB of L3 cache, against 64 MB of L3 on the Ryzen 9 9955HX. Notebookcheck's comparison of the 9955HX and the Core Ultra 9 275HX did not include a 9955HX3D system. If gaming is the main use, compare the price of the full laptop before paying extra for the 3D V-Cache chip.",
  },
  {
    question: "Which chip is ahead when the power limit is 55 W?",
    answer:
      "In Notebookcheck's Cinebench 2024 multi test at 55 W, the Core Ultra 9 275HX scored 1,633 points and the Ryzen 9 9955HX scored 1,489. In Cinebench R23 at 55 W, Notebookcheck lists 27,283 points for the Core Ultra 9 and 23,849 for the Ryzen. At 100 W in Cinebench R23 the order flips: 35,500 for the Ryzen and 33,670 for the Core Ultra 9.",
  },
];

const VERDICT = `Choose the Ryzen 9 9955HX if the laptop GPU matches and gaming frame rate is the priority. Notebookcheck reports an average advantage of 5 percent at 1080p and around 5 percent at 1440p with a GeForce RTX 5090 Laptop GPU.

Choose the Core Ultra 9 275HX if Cinebench 2024 multi-core matters more. Notebookcheck lists 2,223 points for the Core Ultra 9 and 2,058 for the Ryzen 9 9955HX, and the Core Ultra 9 stays ahead at each Cinebench 2024 limit from 55 W to 150 W.

Neither CPU is right for every gaming laptop. Compare the GPU and its wattage first, then the price of the two laptop versions, then the port list on that laptop's spec sheet.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Notebookcheck: 24 cores on the Core Ultra 9 275HX (8 performance and 16 efficiency), no hyperthreading. AMD: 16 cores and 32 threads on the Ryzen 9 9955HX.
- AMD lists a boost of up to 5.4 GHz, a 2.5 GHz base clock, 64 MB of L3 cache, a 55 W default TDP, and a 55-75 W configurable TDP for the 9955HX.
- Notebookcheck puts the theoretical TDP at 55 W for the Core Ultra 9 275HX and says both chips can briefly draw more than 150 W.
- Same GeForce RTX 5090 Laptop GPU in Notebookcheck's gaming test: about a 5 percent average advantage for the Ryzen at 1080p, and around 5 percent at 1440p. The 4K gap is smaller.
- Cinebench 2024 multi-core favors the Core Ultra 9 (2,223 points against 2,058). Geekbench 6.7 multi-core also favors the Core Ultra 9. PCMark 10's overall score favors the Ryzen.
- The Ryzen 9 9955HX3D is a different chip. AMD lists 128 MB of L3 cache on it. Notebookcheck did not test it against the 275HX.

Specs

Notebookcheck describes the Core Ultra 9 275HX as an Arrow Lake chip with 24 cores, 8 performance and 16 efficiency, and no hyperthreading. It puts the theoretical TDP at 55 W and says that under full load both this chip and the Ryzen 9 9955HX can briefly draw more than 150 W.

AMD lists the Ryzen 9 9955HX as a Zen 5 laptop processor: 16 cores, 32 threads, SMT, boost up to 5.4 GHz, 2.5 GHz base, 1280 KB of L1 cache, 16 MB of L2 cache, and 64 MB of L3 cache. Default TDP is 55 W, with a configurable TDP of 55-75 W. The socket is FL1. AMD also lists PCIe 5.0 with 28 native lanes, dual-channel DDR5 up to 96 GB (SO-DIMM, up to DDR5-5600), and Radeon 610M graphics with 2 cores at 2200 MHz. It is unlocked for overclocking.

Gaming with the same RTX 5090 Laptop GPU

Notebookcheck ran an Asus ROG Strix SCAR 18 G835LX (Core Ultra 9 275HX, 64 GB of memory) and an XMG Neo 16 A25 engineering sample (Ryzen 9 9955HX, 32 GB of memory). Both used a GeForce RTX 5090 Laptop GPU that can draw up to 175 W, and both used Nvidia Game Ready Driver 572.84. The laptops are not the same machine, and the memory sizes differ.

Notebookcheck reports that the Ryzen 9 9955HX is ahead and that the average advantage is 5 percent at 1080p. The 1080p performance rating is 99.7 points for the Ryzen and 95.4 for the Core Ultra 9. Call of Duty Black Ops 6 was tied at 1080p, at 147 fps, so that 5 percent is an average across the set, not a lead in every title. At 1440p, Notebookcheck reports the Ryzen ahead in every game in the set, with the difference again around 5 percent. The 1440p rating is 100 points against 94.5. At 4K, Notebookcheck says the processor matters less and the difference gets smaller, with a slight lead for the Ryzen in each listed game. The 4K rating is 100 points against 96.3.

Productivity and system tests

In Cinebench 2024 multi-core, Notebookcheck lists 2,223 points for the Core Ultra 9 275HX and 2,058 for the Ryzen 9 9955HX, marked +8 percent for the Intel chip. Cinebench 2024 single-core is 138 points for the Core Ultra 9 and 129 for the Ryzen, marked +7 percent. Geekbench 6.7 single-core goes the other way: 3,230 for the Ryzen and 3,158 for the Core Ultra 9, marked -2 percent. Geekbench 6.7 multi-core lists 21,668 for the Core Ultra 9, marked +11 percent, and 19,563 for the Ryzen.

On whole-system tests, Notebookcheck's PCMark 10 score is 9,402 for the Ryzen and 8,623 for the Core Ultra 9, marked -8 percent. CrossMark overall is 2,259 against 2,221, marked -2 percent. CrossMark Productivity is the other way, 2,025 for the Core Ultra 9 against 2,014, marked +1 percent. 3DMark Time Spy CPU is 17,285 against 13,188, marked +31 percent for the Core Ultra 9, and Fire Strike Physics is 48,219 against 42,890, marked +12 percent for the Core Ultra 9.

Lower power limits

Notebookcheck also capped both CPUs. In Cinebench 2024 multi, the Core Ultra 9 275HX is ahead at each listed limit from 55 W to 150 W. At 55 W the scores are 1,633 and 1,489. At 80 W they are 1,875 and 1,809. At 115 W they are 2,015 and 2,008. At 150 W they are 2,158 and 2,061. The first number in each pair is the Core Ultra 9.

Cinebench R23 does not follow the same pattern. At 55 W, Notebookcheck lists 27,283 for the Core Ultra 9 and 23,849 for the Ryzen. At 80 W it lists 31,880 and 31,641. At 100 W the Ryzen is ahead: 35,500 points for the Ryzen and 33,670 for the Core Ultra 9. At 150 W Notebookcheck lists 39,537 for the Ryzen and 38,108 for the Core Ultra 9.

Notebookcheck says it skipped a longer power-draw and efficiency comparison because the GeForce RTX 5090 in the XMG engineering sample stayed on an external monitor. There is no battery-life result in that test.

The Ryzen 9 9955HX3D

AMD lists the Ryzen 9 9955HX3D with the same 16 cores, 32 threads, boost of up to 5.4 GHz, and 55 W default TDP as the 9955HX, and with 128 MB of L3 cache instead of 64 MB. Notebookcheck's 275HX comparison did not have a 9955HX3D test system. Treat the 9955HX3D as a separate laptop configuration and compare the price of the whole laptop, including the GPU, before paying extra for the added cache.

How to choose a gaming laptop

Compare the GPU name and its wattage first. Then compare the price of the Intel and AMD versions of the same laptop. Use the Ryzen 9 9955HX when the rest of the laptop matches and you care about the gaming frame rates Notebookcheck measured. Use the Core Ultra 9 275HX when Cinebench 2024, including the 55 W to 80 W limits, matters more to you. Read that laptop's spec sheet for ports, memory, and cooling. Do not assume a port from the CPU name.

These are laptop HX chips. The Ryzen 9 9900X vs Core Ultra 9 comparison, and the blog on the Ryzen 9 9900X and Core Ultra 9, cover other processors. They do not compare the 275HX with the 9955HX.`;

const SPEC = "Specs";

const BUILT = buildEditorialComparison({
  slug: "intel-core-ultra-9-275hx-vs-amd-ryzen-9-9955hx",
  title: "Intel Core Ultra 9 275HX vs AMD Ryzen 9 9955HX for a Gaming Laptop",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Core Ultra 9 275HX",
      shortDesc: "Arrow Lake laptop CPU with 24 cores (8 performance and 16 efficiency) and no hyperthreading.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "24 cores, 8 performance and 16 efficiency, no hyperthreading (Notebookcheck)",
        "Cinebench 2024 multi-core: 2,223 points, marked +8 percent (Notebookcheck)",
        "Ahead at each Cinebench 2024 limit from 55 W to 150 W (Notebookcheck)",
      ],
      cons: [
        "1080p gaming rating 95.4 points against 99.7 with the same RTX 5090 Laptop GPU (Notebookcheck)",
        "Geekbench 6.7 single-core 3,158 against 3,230 (Notebookcheck)",
        "PCMark 10 score 8,623 against 9,402 (Notebookcheck)",
      ],
      bestFor: "Cinebench 2024 multi-core, including the 55 W and 80 W limits",
    },
    {
      id: B,
      slug: B,
      name: "Ryzen 9 9955HX",
      shortDesc: "Zen 5 laptop CPU with 16 cores, 32 threads, up to 5.4 GHz, and 64 MB of L3 cache.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "16 cores, 32 threads, boost up to 5.4 GHz, 64 MB L3, 55 W default TDP (AMD)",
        "About a 5 percent average gaming advantage at 1080p with an RTX 5090 Laptop GPU (Notebookcheck)",
        "PCMark 10 score 9,402 against 8,623 (Notebookcheck)",
      ],
      cons: [
        "Cinebench 2024 multi-core 2,058 points against 2,223 (Notebookcheck)",
        "Cinebench 2024 at 55 W: 1,489 points against 1,633 (Notebookcheck)",
        "Geekbench 6.7 multi-core 19,563 against 21,668 (Notebookcheck)",
      ],
      bestFor: "Gaming frame rate when the laptop GPU matches",
    },
  ],
  keyDifferences: [
    {
      label: "Cores and threads",
      entityAValue: "24 cores (8P + 16E), no hyperthreading",
      entityBValue: "16 cores, 32 threads",
      winner: "tie",
    },
    {
      label: "Architecture",
      entityAValue: "Arrow Lake",
      entityBValue: "Zen 5",
      winner: "tie",
    },
    {
      label: "Boost and cache",
      entityAValue: "Not stated by Notebookcheck",
      entityBValue: "Up to 5.4 GHz, 64 MB L3",
      winner: "tie",
    },
    {
      label: "Default TDP",
      entityAValue: "55 W (Notebookcheck)",
      entityBValue: "55 W, cTDP 55-75 W (AMD)",
      winner: "tie",
    },
    {
      label: "1080p gaming rating",
      entityAValue: "95.4 points",
      entityBValue: "99.7 points",
      winner: "tie",
    },
    {
      label: "Cinebench 2024 multi",
      entityAValue: "2,223 points",
      entityBValue: "2,058 points",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("arch", "Architecture", SPEC, A, B, "Arrow Lake (Notebookcheck)", "Zen 5 (AMD)"),
    textAttr(
      "cores",
      "Cores and threads",
      SPEC,
      A,
      B,
      "24 cores (8 performance + 16 efficiency), no hyperthreading",
      "16 cores, 32 threads, SMT"
    ),
    textAttr("boost", "Max boost", SPEC, A, B, "Not stated by Notebookcheck", "Up to 5.4 GHz"),
    textAttr("base", "Base clock", SPEC, A, B, "Not stated by Notebookcheck", "2.5 GHz"),
    textAttr("l3", "L3 cache", SPEC, A, B, "Not stated by Notebookcheck", "64 MB"),
    textAttr("tdp", "Default TDP", SPEC, A, B, "55 W", "55 W (cTDP 55-75 W)"),
    textAttr(
      "short-power",
      "Short full-load draw",
      SPEC,
      A,
      B,
      "Can briefly draw more than 150 W",
      "Can briefly draw more than 150 W"
    ),
    textAttr("cb2024", "Cinebench 2024 multi", SPEC, A, B, "2,223 points", "2,058 points"),
    textAttr("gb6", "Geekbench 6.7 multi", SPEC, A, B, "21,668 points", "19,563 points"),
    textAttr("game1080", "1080p gaming rating", SPEC, A, B, "95.4 points", "99.7 points"),
    textAttr("game1440", "1440p gaming rating", SPEC, A, B, "94.5 points", "100 points"),
    textAttr("game4k", "4K gaming rating", SPEC, A, B, "96.3 points", "100 points"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "amd-ryzen-9-9900x-vs-intel-core-ultra-9",
      title: "Ryzen 9 9900X vs Core Ultra 9",
      category: "products",
    },
    {
      slug: "rtx-4070-laptop-vs-rtx-5060-laptop",
      title: "RTX 4070 Laptop vs RTX 5060 Laptop",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Ryzen 9 9955HX for the gaming frame rates Notebookcheck measured with a matched RTX 5090 Laptop GPU. Core Ultra 9 275HX for Cinebench 2024 multi-core. Neither CPU is right for every gaming laptop.",
    keyFact:
      "AMD lists 16 cores, 32 threads, up to 5.4 GHz, and 64 MB of L3 cache on the Ryzen 9 9955HX. Notebookcheck describes the Core Ultra 9 275HX as 24 cores without hyperthreading.",
  },
  citationStats: {
    sourceCount: 3,
    dataPointCount: 42,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Notebookcheck: Ryzen 9 9955HX vs Core Ultra 9 275HX", url: NOTEBOOKCHECK },
      { name: "AMD Ryzen 9 9955HX", url: AMD_9955HX },
      { name: "AMD Ryzen 9 9955HX3D", url: AMD_9955HX3D },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Notebookcheck: Ryzen 9 9955HX vs Core Ultra 9 275HX",
      url: NOTEBOOKCHECK,
      description:
        "Andreas Osthoff, published 6 April 2025, updated 5 October 2026. 24 cores (8P+16E) and no hyperthreading on the 275HX; 16 cores and 32 threads on the 9955HX; 55 W theoretical TDP for the Intel chip; both can briefly draw more than 150 W. Cinebench 2024 multi 2,223 vs 2,058. Gaming average advantage 5 percent at 1080p and around 5 percent at 1440p with an RTX 5090 Laptop GPU up to 175 W.",
    },
    {
      type: "external",
      label: "AMD Ryzen 9 9955HX",
      url: AMD_9955HX,
      description:
        "16 cores, 32 threads, SMT, Zen 5, boost up to 5.4 GHz, 2.5 GHz base, 1280 KB L1, 16 MB L2, 64 MB L3, 55 W default TDP, cTDP 55-75 W, socket FL1, PCIe 5.0 with 28 lanes, DDR5 up to 96 GB, Radeon 610M.",
    },
    {
      type: "external",
      label: "AMD Ryzen 9 9955HX3D",
      url: AMD_9955HX3D,
      description:
        "16 cores, 32 threads, boost up to 5.4 GHz, 55 W default TDP, 128 MB L3 cache, cTDP 55-75 W. Separate from the 9955HX's 64 MB L3.",
    },
  ],
  metaTitle: "275HX vs 9955HX Gaming Laptop CPUs",
});

export const INTEL_CORE_ULTRA_9_275HX_VS_RYZEN_9_9955HX: EditorialComparison = {
  ...BUILT,
  relatedBlogPosts: [
    {
      slug: "amd-ryzen-9-9900x-vs-intel-core-ultra-9-2026-which-cpu-wins",
      title: "AMD Ryzen 9 9900X vs Intel Core Ultra 9 2026: Which CPU Wins?",
      excerpt: "Desktop Ryzen 9 9900X and Core Ultra 9. Not a comparison of the 275HX and the 9955HX.",
      category: "technology",
    },
  ],
};
