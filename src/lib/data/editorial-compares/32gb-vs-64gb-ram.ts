import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-401 — 32GB vs 64GB of system memory, with 2-module vs 4-module
 * population kept as a separate decision.
 * Opened 9 November 2026 (Asia/Jerusalem).
 *
 * Capacity ceilings and Max Memory Speed rows: AMD Ryzen 7 7800X3D and
 * Ryzen 9 9950X specifications only. Those rows are not copied onto any
 * other Ryzen or Intel processor.
 * Commit charge and the page file: Microsoft's Windows 10 page-file article.
 * Kit validation: Corsair's own statement about Corsair kits.
 * Data-rate unit: Micron's Rev. C 08/2023 16GB DDR5 UDIMM addendum, which
 * pairs DDR5-5600 with 5600 MT/s. AMD does not print MT/s or MHz on the
 * Max Memory Speed rows. The copy of that addendum was opened at Farnell.
 *
 * dataPointCount stays 0. These are specifications and a measurement
 * method, not a measured memory-use dataset. sourceCount counts documents.
 * winnerName stays null. Every key difference is a tie.
 * isHumanReviewed stays false. The Analysis disclosure is the shared
 * "Drafted with AI from web research." line.
 *
 * Not used: the brief's universal lines that 32GB is enough for most
 * gaming, that 64GB pays off for editing, streaming, or local AI, and
 * that two sticks are safer or easier to run at full speed. No prices,
 * no frame rates, no electrical-drive explanation, no BIOS steps, and
 * no community block. The source thread returned HTTP 403.
 */

const A = "32gb-ram";
const B = "64gb-ram";

const AMD_7800 =
  "https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-7-7800x3d.html";
const AMD_9950 =
  "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9950x.html";
const MS_PAGEFILE =
  "https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/introduction-to-the-page-file";
const CORSAIR_KITS =
  "https://www.corsair.com/us/en/explorer/diy-builder/memory/can-i-mix-corsair-memory-kits/";
const MICRON_UDIMM = "https://www.farnell.com/datasheets/4555704.pdf";

const SOURCE_DATE = "2026-11-09";
const PUBLISHED = "2026-11-09T00:00:00Z";
const SPEC = "Memory";

const SHORT_ANSWER =
  "Whether 32GB or 64GB of system memory is enough depends on the work you run: Microsoft's Windows 10 page-file article says to compare committed bytes with the commit limit, because reaching that limit can keep the system from getting committed memory. How many modules you install is a separate choice, because the Ryzen 7 7800X3D and the Ryzen 9 9950X list different DDR5 maximum speeds for two modules than for four.";

const TAKEAWAYS = [
  "32GB and 64GB are totals of system memory. AMD lists a 128 GB maximum on the Ryzen 7 7800X3D and a 256 GB maximum on the Ryzen 9 9950X, so both totals sit inside those two ceilings. A listed ceiling is not a recommendation to install that much memory.",
  "On Windows 10, the check Microsoft names is committed bytes against the commit limit while you run your own programs. The commit limit is physical memory plus all page files. Reaching that limit can cause freezing, crashing, and other malfunctions. Percent of committed bytes in use is that ratio. It is not, by itself, proof that the physical-memory graph is the bottleneck.",
  "A kit labeled 2x32GB and a kit labeled 4x16GB can both total 64GB. On the Ryzen 7 7800X3D, AMD lists DDR5-5200 for the 2x1R and 2x2R rows and DDR5-3600 for the 4x1R and 4x2R rows. On the Ryzen 9 9950X, AMD lists DDR5-5600 for the 2x1R and 2x2R rows and DDR5-3600 for the 4x1R and 4x2R rows. Those rows belong to those two processors and still depend on the rank label. They are not the rows for every Ryzen or Intel processor.",
  "Both processors list 2 memory channels, including on the four-module rows. Four modules on these processors are not a four-channel layout. AMD lists AMD EXPO Memory Overclocking Technology on a separate line from Max Memory Speed. A kit profile, a motherboard support list, a BIOS setting, and a speed that holds on a running PC are different checks from that listed maximum. These CPU pages do not include a motherboard list or a measured running speed.",
  "Corsair says its kits are validated for their rated performance only with the modules in that specific kit, and it tells you not to combine Corsair kits even when the kits are rated at the same speed. Combining those kits risks stability problems, EXPO or XMP not enabling, or the system being unable to boot. That is Corsair's statement about Corsair kits. It states no probability that combining kits will work, and it is not a rule for another brand.",
  "System memory is not graphics memory. Both CPU specifications list 2 graphics cores and a 2200 MHz graphics frequency, and they do not list a graphics-memory size. Neither 32GB nor 64GB of system memory says a local model will run. Compare the current price of one kit for the total you measured, and compare one 2x32GB kit with one 4x16GB kit if those are the populations you are choosing. This page lists no price.",
];

const FAQS = [
  {
    question: "Is 64GB of RAM worth it over 32GB?",
    answer:
      "It depends on the committed memory of the work you run. Microsoft's Windows 10 page-file article says the commit limit is physical memory plus all page files, and that reaching the limit can keep the system and processes from getting committed memory. Measure committed bytes against that limit on the Performance tab in Task Manager, or with the Memory counters Committed Bytes and Commit Limit. With the same page files, 64GB of physical memory sets a higher commit limit than 32GB, and a larger page file can also raise the limit. The article does not name a gigabyte total for any one kind of work.",
  },
  {
    question: "Is 2x32GB a different decision from 4x16GB?",
    answer:
      "Yes. Both labels can total 64GB, and the module count is a separate choice from that total. On the Ryzen 7 7800X3D, AMD lists DDR5-5200 for 2x1R and 2x2R, and DDR5-3600 for 4x1R and 4x2R. On the Ryzen 9 9950X, AMD lists DDR5-5600 for 2x1R and 2x2R, and DDR5-3600 for 4x1R and 4x2R. Both processors list 2 memory channels. Match the module count and the rank label on the module to the row. These pages do not define the 1R and 2R tokens, and the rows are not a speed the PC is assured of holding. They are not the rows for every Ryzen or Intel processor.",
  },
  {
    question: "Can I add a second kit to reach 64GB?",
    answer:
      "Not as a Corsair-validated kit. Corsair says its kits are validated for their rated performance only with the modules included in that specific kit, and it recommends that you do not combine multiple Corsair kits, even when they are rated at the same speed. Combining them risks stability problems, EXPO or XMP being prevented from enabling, or the system being unable to boot. Two separate kits are not the same validation as one kit that already contains four modules. Corsair states no probability that combining kits will work. For another brand, use that manufacturer's kit statement.",
  },
  {
    question: "Why do the four-module rows list a lower DDR5 maximum on these two CPUs?",
    answer:
      "AMD's specification lists a lower Max Memory Speed for the four-module rows than for the two-module rows on the Ryzen 7 7800X3D and the Ryzen 9 9950X. Both processors still list 2 memory channels, so four modules are not a four-channel configuration. The specifications do not give an electrical reason for the lower row. DDR5-5200, DDR5-5600, and DDR5-3600 are the names AMD prints. Micron's Rev. C 08/2023 addendum for a 16GB single-rank UDIMM writes DDR5-5600 beside 5600 MT/s and a 0.357 ns memory clock. AMD's DDR5- names are data-rate names in that unit, not megahertz clocks.",
  },
  {
    question: "Does 64GB of system memory set graphics memory or local AI capacity?",
    answer:
      "No. On the Ryzen 7 7800X3D and the Ryzen 9 9950X, system memory is its own block: DDR5, 2 channels, UDIMM, and a maximum of 128 GB or 256 GB. Graphics Capabilities on those same pages list 2 graphics cores and a 2200 MHz graphics frequency, not a graphics-memory size. A graphics card's memory is a different specification. These pages do not say that a local model will run because the system has 32GB or 64GB.",
  },
  {
    question: "How should I compare 32GB and 64GB prices?",
    answer:
      "Write down the current price of one kit for the capacity your commit-charge measurement points to. If you are choosing how to reach 64GB, also write down the current price of one 2x32GB kit and one 4x16GB kit, then read the Max Memory Speed row for your exact processor, module count, and rank label. Prices change. This page does not list a price.",
  },
];

const VERDICT = `Use 32GB when the committed bytes of your work stay within the commit limit you get from 32GB of physical memory plus your page files. Use 64GB when that charge reaches the limit on 32GB and you still need headroom after you account for the page files. Microsoft's Windows 10 article says page files also extend the commit limit. Adding physical memory is not the only way to raise it.

Then choose two modules or four modules as a separate step. On the Ryzen 7 7800X3D and the Ryzen 9 9950X, the Max Memory Speed row changes with the module count and the 1R or 2R label. Both processors list 2 memory channels. Those two processors are not every CPU.

Compare the current price of one kit before you buy. This page lists no price.`;

const EXPERT_ANALYSIS = [
  SHORT_ANSWER,
  TAKEAWAYS[0],
  TAKEAWAYS[1],
  TAKEAWAYS[2],
  TAKEAWAYS[3],
  TAKEAWAYS[4],
  TAKEAWAYS[5],
  "Microsoft labels the page-file article for Windows 10. A page file is an optional hidden system file on a hard disk. Page files can move infrequently accessed modified pages out of physical memory, and they extend how much committed memory the system can support. You can read the committed charge and the commit limit on the Performance tab in Task Manager. The percent counter Microsoft names, Committed Bytes In Use, is committed bytes divided by the commit limit. When a lot of physical memory is installed, the article says a page file might not be required to back the commit charge during peak use, while a page file or a dedicated dump file might still be required for a crash dump. The article does not define how many gigabytes count as a lot, so that sentence is not a 64GB rule. This measurement is the Windows 10 article's method. It is not a Windows 11 procedure.",
  "AMD prints the maximums as DDR5-5200, DDR5-5600, and DDR5-3600. It does not print MHz on those Max Memory Speed rows. Micron's addendum, Rev. C 08/2023, part MTC8C1084S1UC56BG1, is one 16GB single-rank DDR5 UDIMM. Its timing table puts 0.357 ns and 5600 MT/s in the Memory Clock/Data Rate column beside the DDR5-5600 designation. The 2200 MHz number on the Ryzen pages is the graphics frequency, a different field. AMD's 1R and 2R tokens stay as printed. The Micron addendum calls that one module single-rank. It does not define AMD's tokens, and it does not say every 16GB or 32GB module is single-rank.",
  "ECC support on both processors is listed as yes, and it requires motherboard support. That line does not change between 32GB and 64GB. DDR5 vs DDR4 for Gaming: Is DDR5 Worth It? is the generation comparison. AM4 vs AM5: Which Desktop PC Socket? is the socket comparison. Ryzen 7 7800X3D vs Ryzen 7 9800X3D for Desktop Gaming compares those two processors. The speed rows above are only the Ryzen 7 7800X3D and the Ryzen 9 9950X.",
].join("\n\n");

const BUILT = buildEditorialComparison({
  slug: "32gb-vs-64gb-ram",
  title: "Which RAM Capacity, 32GB or 64GB?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "32GB RAM",
      shortDesc: "32GB of system memory. Whether it is enough is the commit charge of your work, not a rule for every program.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Inside the 128 GB maximum on the Ryzen 7 7800X3D and the 256 GB maximum on the Ryzen 9 9950X (AMD)",
        "A smaller physical total when your measured commit charge fits this limit plus your page files (Microsoft, Windows 10)",
      ],
      cons: [
        "With the same page files, less physical memory sets a lower commit limit than 64GB (Microsoft, Windows 10)",
        "The gigabyte total does not choose the two-module or four-module speed row (AMD)",
      ],
      bestFor: "A measured commit charge that stays within this physical total plus your page files",
    },
    {
      id: B,
      slug: B,
      name: "64GB RAM",
      shortDesc: "64GB of system memory. A 2x32GB kit and a 4x16GB kit can both reach this total, and they are different populations.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "With the same page files, more physical memory sets a higher commit limit than 32GB (Microsoft, Windows 10)",
        "Inside the same 128 GB and 256 GB maximums on the two opened processors (AMD)",
      ],
      cons: [
        "Not a graphics-memory size, and not a statement that a local model will run (AMD)",
        "A 4x16GB population uses the four-module speed row on these two CPUs; combining Corsair kits is not one validated kit (AMD, Corsair)",
      ],
      bestFor: "A measured commit charge that needs a higher limit from more physical memory",
    },
  ],
  keyDifferences: [
    {
      label: "Capacity total",
      entityAValue: "32GB of system memory",
      entityBValue: "64GB of system memory",
      winner: "tie",
    },
    {
      label: "Commit limit, same page files",
      entityAValue: "Lower physical-memory portion of the limit",
      entityBValue: "Higher physical-memory portion of the limit",
      winner: "tie",
    },
    {
      label: "Opened CPU ceilings",
      entityAValue: "Inside 128 GB on the 7800X3D and 256 GB on the 9950X",
      entityBValue: "Inside 128 GB on the 7800X3D and 256 GB on the 9950X",
      winner: "tie",
    },
    {
      label: "Module population",
      entityAValue: "Not fixed by the 32GB label",
      entityBValue: "Not fixed by the 64GB label. 2x32GB and 4x16GB both total 64GB",
      winner: "tie",
    },
    {
      label: "Graphics memory",
      entityAValue: "Not set by this system-memory total",
      entityBValue: "Not set by this system-memory total",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("capacity", "Capacity total", SPEC, A, B, "32GB of system memory", "64GB of system memory"),
    textAttr(
      "max-7800",
      "Ryzen 7 7800X3D maximum system memory",
      SPEC,
      A,
      B,
      "128 GB listed maximum. 32GB is inside it",
      "128 GB listed maximum. 64GB is inside it",
    ),
    textAttr(
      "max-9950",
      "Ryzen 9 9950X maximum system memory",
      SPEC,
      A,
      B,
      "256 GB listed maximum. 32GB is inside it",
      "256 GB listed maximum. 64GB is inside it",
    ),
    textAttr("channels", "Memory channels on both CPUs", SPEC, A, B, "2. Four modules do not add channels", "2. Four modules do not add channels"),
    textAttr(
      "speed-7800-2",
      "Ryzen 7 7800X3D, two-module rows",
      SPEC,
      A,
      B,
      "DDR5-5200 for 2x1R and 2x2R, if the build uses two modules",
      "DDR5-5200 for 2x1R and 2x2R, if the build uses two modules",
    ),
    textAttr(
      "speed-7800-4",
      "Ryzen 7 7800X3D, four-module rows",
      SPEC,
      A,
      B,
      "DDR5-3600 for 4x1R and 4x2R, if the build uses four modules",
      "DDR5-3600 for 4x1R and 4x2R, if the build uses four modules",
    ),
    textAttr(
      "speed-9950-2",
      "Ryzen 9 9950X, two-module rows",
      SPEC,
      A,
      B,
      "DDR5-5600 for 2x1R and 2x2R, if the build uses two modules",
      "DDR5-5600 for 2x1R and 2x2R, if the build uses two modules",
    ),
    textAttr(
      "speed-9950-4",
      "Ryzen 9 9950X, four-module rows",
      SPEC,
      A,
      B,
      "DDR5-3600 for 4x1R and 4x2R, if the build uses four modules",
      "DDR5-3600 for 4x1R and 4x2R, if the build uses four modules",
    ),
    textAttr(
      "expo",
      "EXPO on both CPUs",
      SPEC,
      A,
      B,
      "Listed separately as memory overclocking technology, not as the Max Memory Speed row",
      "Listed separately as memory overclocking technology, not as the Max Memory Speed row",
    ),
    textAttr(
      "windows-check",
      "Windows 10 capacity check",
      SPEC,
      A,
      B,
      "Committed bytes against the commit limit during your work",
      "Committed bytes against the commit limit during your work",
    ),
    textAttr(
      "kit",
      "Corsair kit validation",
      SPEC,
      A,
      B,
      "Rated performance is for the modules in that one kit",
      "Rated performance is for the modules in that one kit. A second kit is not that validation",
    ),
    textAttr(
      "graphics",
      "Graphics block on both CPUs",
      SPEC,
      A,
      B,
      "2 graphics cores, 2200 MHz graphics frequency, no graphics-memory size",
      "2 graphics cores, 2200 MHz graphics frequency, no graphics-memory size",
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "ddr5-vs-ddr4", title: "DDR5 vs DDR4 for Gaming: Is DDR5 Worth It?", category: "technology" },
    { slug: "am4-vs-am5", title: "AM4 vs AM5: Which Desktop PC Socket?", category: "technology" },
    {
      slug: "ryzen-7-7800x3d-vs-ryzen-7-9800x3d",
      title: "Ryzen 7 7800X3D vs Ryzen 7 9800X3D for Desktop Gaming",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Measure committed bytes against the commit limit, then match module count and rank to the opened processor's Max Memory Speed row.",
    keyFact:
      "The Ryzen 7 7800X3D lists DDR5-5200 on its two-module rows and DDR5-3600 on its four-module rows. The Ryzen 9 9950X lists DDR5-5600 on its two-module rows and DDR5-3600 on its four-module rows. Both list 2 memory channels.",
  },
  citationStats: {
    sourceCount: 5,
    dataPointCount: 0,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "AMD Ryzen 7 7800X3D", url: AMD_7800 },
      { name: "AMD Ryzen 9 9950X", url: AMD_9950 },
      { name: "Microsoft page file (Windows 10)", url: MS_PAGEFILE },
      { name: "Corsair: mixing memory kits", url: CORSAIR_KITS },
      { name: "Micron 16GB DDR5 UDIMM addendum", url: MICRON_UDIMM },
    ],
  },
  resources: [
    {
      type: "external",
      label: "AMD Ryzen 7 7800X3D",
      url: AMD_7800,
      description:
        "DDR5, 2 memory channels, 128 GB maximum, UDIMM. Max Memory Speed: 2x1R and 2x2R DDR5-5200, 4x1R and 4x2R DDR5-3600. EXPO is listed as memory overclocking technology. Graphics: 2 cores, 2200 MHz.",
    },
    {
      type: "external",
      label: "AMD Ryzen 9 9950X",
      url: AMD_9950,
      description:
        "DDR5, 2 memory channels, 256 GB maximum, UDIMM. Max Memory Speed: 2x1R and 2x2R DDR5-5600, 4x1R and 4x2R DDR5-3600. EXPO is listed as memory overclocking technology. Graphics: 2 cores, 2200 MHz.",
    },
    {
      type: "external",
      label: "Microsoft page file (Windows 10)",
      url: MS_PAGEFILE,
      description:
        "Commit limit is physical memory plus all page files. Reaching the limit can stop the system from getting committed memory. Measure committed bytes and the commit limit on the Performance tab in Task Manager.",
    },
    {
      type: "external",
      label: "Corsair: mixing memory kits",
      url: CORSAIR_KITS,
      description:
        "Corsair kits are validated only with the modules in that kit. Combining Corsair kits risks stability problems, EXPO or XMP not enabling, or a failure to boot.",
    },
    {
      type: "external",
      label: "Micron 16GB DDR5 UDIMM addendum",
      url: MICRON_UDIMM,
      description:
        "Rev. C 08/2023, part MTC8C1084S1UC56BG1, one 16GB single-rank module. DDR5-5600 is paired with 5600 MT/s and a 0.357 ns memory clock.",
    },
  ],
  metaTitle: "Which RAM Capacity, 32GB or 64GB?",
});

BUILT.metadata.metaDescription =
  "32GB or 64GB of system memory depends on your measured commit charge. On the Ryzen 7 7800X3D and Ryzen 9 9950X, two-module and four-module DDR5 maximums differ.";

export const RAM_32GB_VS_64GB: EditorialComparison = BUILT;
