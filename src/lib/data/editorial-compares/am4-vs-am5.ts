import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-389 — Socket AM4 vs Socket AM5 as a general platform decision.
 * Opened 6 November 2026 (Asia/Jerusalem).
 * AMD Socket AM4 and Socket AM5 chipset specifications, Ryzen 5 5600T,
 * Ryzen 5 7600 and Ryzen 5 8600G specifications, AMD's 31 May 2026 Computex
 * post, AMD's Computex 2022 Socket AM5 partner article, and Noctua's AM5
 * cooler FAQ.
 * Distinct from ryzen-7-5800x3d-vs-am5: this page does not repeat that
 * processor's cache, clocks, launch price, or upgrade story.
 * Dropped: the Socket AM5 quick-reference PDF (404 on 6 November 2026),
 * Reddit (comments not used; no community block), thread prices, any
 * frame-rate or FPS-per-pound claim, a 2–4 year upgrade window of our own,
 * and any line that every AM5 board or CPU supplies PCIe 5.0 graphics and
 * storage or that every AM4 cooler fits AM5.
 * No winner. Every key difference is a tie.
 */

const A = "socket-am4";
const B = "socket-am5";

const AMD_AM4 = "https://www.amd.com/en/products/processors/chipsets/am4.html";
const AMD_AM5 = "https://www.amd.com/en/products/processors/chipsets/am5.html";
const AMD_5600T =
  "https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-5-5600t.html";
const AMD_7600 =
  "https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-5-7600.html";
const AMD_8600G =
  "https://www.amd.com/en/products/processors/desktops/ryzen/8000-series/amd-ryzen-5-8600g.html";
const AMD_COMPUTEX =
  "https://www.amd.com/en/blogs/2026/amd-computex-2026-10-years-of-am4-am5-support-through.html";
const AMD_PARTNER = "https://www.amd.com/en/partner/articles/socket-am5-change-game.html";
const NOCTUA =
  "https://www.noctua.at/en/support/faqs/which-noctua-cpu-coolers-are-compatible-with-amd-am5";

const SOURCE_DATE = "2026-11-06";
const PUBLISHED = "2026-11-06T00:00:00Z";

const SHORT_ANSWER =
  "Choose Socket AM5 when you are buying the motherboard and the memory: AMD lists Ryzen 7000, 8000 and 9000 desktop processors and DDR5 for that socket, and PCIe 5.0 only on some of those processors and chipsets. Choose Socket AM4 when a compatible board and DDR4 are already in the PC, or when a used AM4 processor plus DDR4 is the smaller parts basket: AMD lists DDR4 for Socket AM4, and the two sockets do not share a processor list.";

const FAQS = [
  {
    question: "Can an AM4 processor go on an AM5 motherboard?",
    answer:
      "No. AMD uses a separate processor list for each socket. Socket AM5 boards are for Socket AM5 processors: Ryzen 7000, 8000 and 9000 desktop processors, and a BIOS update may be required for Ryzen 8000 and 9000 on 600-series boards. Socket AM4 lists other families, including Ryzen 1000 through 5000, Athlon processors with Radeon Graphics, and 7th Gen A-Series, and not every AM4 chipset accepts every family.",
  },
  {
    question: "Does Socket AM5 require DDR5?",
    answer:
      "Yes. AMD's Socket AM5 chipset specifications are a DDR5 platform, and the Ryzen 5 7600 and Ryzen 5 8600G specifications list DDR5. AMD's Socket AM4 chipset specifications feature DDR4, and the Ryzen 5 5600T specification lists DDR4. A kit built for one of those types is not the memory type listed for the other socket.",
  },
  {
    question: "Does every AM5 board and processor provide PCIe 5.0 graphics and storage?",
    answer:
      "No. AMD's current Socket AM5 chipset specifications give usable PCIe 5.0 lanes of up to 24 on X870E, X870 and X670E, up to 8 on X670, up to 4 on B850, and up to 0 on B840, A620, A620A, PRO 665 and PRO 600. Graphics are PCIe 5.0 on X870E, X870 and X670E, and PCIe 4.0 on B850, X670, B840 and A620. The Ryzen 5 7600 lists PCIe 5.0, with 28 total lanes and 24 usable. The Ryzen 5 8600G lists PCIe 4.0, with 20 total lanes and 16 usable. Read the processor specification and the board SKU.",
  },
  {
    question: "Will an AM4 cooler fit Socket AM5?",
    answer:
      "Do not assume it will. For the Computex 2022 Socket AM5 launch, AMD says existing AM4 cooling solutions will continue to be supported, and it names no model. Noctua says its AM4 mountings that use the standard AMD backplate also fit AM5, and it excepts the NH-L9a-AM4 and the NM-AM4-L9aL9i because they replace that backplate, which Noctua says is not possible on AM5. Read the cooler maker's list for the model you own.",
  },
  {
    question: "How do you compare the cost of an AM4 build and an AM5 build?",
    answer:
      "Price the parts you still have to buy: the processor, a motherboard if you need one, memory if the kit you own is the wrong type, and a cooler if its maker does not list the socket. Subtract anything you can sell. Use the store price on the day you buy. These specifications do not print a parts price.",
  },
  {
    question: "Is a Ryzen 7 5800X3D on AM4 the same decision as AM4 vs AM5?",
    answer:
      "No. Ryzen 7 5800X3D vs AM5 is the comparison for someone who already has Socket AM4 and is weighing that processor. AM4 vs AM5 is the socket decision: which parts you can keep, which memory type AMD lists, and when PCIe 5.0 is actually on the processor and the chipset.",
  },
];

const VERDICT = `Socket AM4: keep a compatible board and DDR4 when the motherboard maker lists the processor.

Socket AM5: buy the board and DDR5 when you want the socket AMD lists for Ryzen 7000, 8000 and 9000 desktop processors. PCIe 5.0 still depends on the processor and the chipset row.

Neither socket is right for everyone. Shopping judgment, not a measured result: price the parts you still have to buy.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways. Socket AM4 and Socket AM5 do not share a processor list. AMD's AM4 matrix covers select Ryzen 1000 through 5000 desktop processors, Athlon processors with Radeon Graphics, and 7th Gen A-Series, and not every chipset accepts every family. Socket AM5 lists Ryzen 7000, 8000 and 9000 desktop processors, and a BIOS update may be required for Ryzen 8000 and 9000 on 600-series boards. AM4 is DDR4. AM5 is DDR5. PCIe 5.0 is not on every AM5 processor or chipset: a Ryzen 5 7600 lists PCIe 5.0, a Ryzen 5 8600G lists PCIe 4.0, and several AM5 chipsets list up to 0 usable PCIe 5.0 lanes. On 31 May 2026 AMD said it is extending Socket AM5 support through 2029 and named no future processor. An AM4 cooler fits AM5 only when that cooler maker says so. Price the parts you still have to buy. Neither socket is right for everyone.

Parts basket. List the motherboard, memory and cooler you already own. Keep the Socket AM4 board only when AMD's matrix includes that processor family on that chipset and the motherboard maker lists a BIOS for that exact processor, and keep the memory only when it is DDR4. A Socket AM5 build buys a Socket AM5 board and DDR5, and it keeps the cooler only when that cooler maker lists AM5 for that model. Add the store price, on the day you buy, for every line you still have to purchase, and subtract anything you can sell. Shopping judgment, not a measured result: these specifications print no parts price.

Platform table. The rows under Full Comparison are the socket facts, with the source in the cell. Opened 6 November 2026: AMD's Socket AM4 chipset specifications, AMD's Socket AM5 chipset specifications, the Ryzen 5 5600T, Ryzen 5 7600 and Ryzen 5 8600G specifications, AMD's 31 May 2026 Computex post, AMD's Computex 2022 Socket AM5 partner material, and Noctua's AM5 cooler compatibility note. A chipset row is the specification for that chipset name. Read the motherboard spec for how that SKU wires each slot.

Memory. Socket AM4 motherboards feature DDR4. Socket AM5 is a DDR5 platform. The Ryzen 5 5600T lists DDR4, two channels, 128 GB, and a 2x1R rating of DDR4-3200 (four modules are rated slower: 4x1R DDR4-2933 and 4x2R DDR4-2667). The Ryzen 5 7600 lists DDR5, two channels, 128 GB, and a 2x1R rating of DDR5-5200 (4x1R DDR5-3600 and 4x2R DDR5-3600). The Ryzen 5 8600G also lists DDR5 and a 2x1R rating of DDR5-5200, with a 256 GB maximum, so one AM5 maximum does not fit every AM5 processor. The Ryzen 5 5600T and Ryzen 5 7600 list ECC as yes and both say it requires motherboard support. AMD EXPO is the DDR5 overclocking column on the AM5 table: yes on X870E, X870, B850, B840, X670E, X670 and A620/A620A, and no on PRO 665 and PRO 600. The Ryzen 5 7600 and Ryzen 5 8600G each list AMD EXPO as yes. The chipset row can still say no. The AM4 chipset specifications do not list EXPO.

Processors and BIOS. The sockets are different lists, so an AM4 processor is not a Socket AM5 processor and a Ryzen 7000, 8000 or 9000 desktop processor is not on the AM4 matrix. AMD says that with 600-series and 800-series chipsets, Socket AM5 motherboards are compatible with Socket AM5 processors, meaning Ryzen 7000, 8000 and 9000, and that a BIOS update may be required for Ryzen 8000 and 9000 series processors on 600-series boards. PRO 600 and PRO 665 are sold through system suppliers. AMD's AM5 introduction also says “plus whatever comes next.” That phrase names no processor. On AM4, B550 and A520 are marked for Ryzen 3000 series processors without Radeon Graphics, Ryzen 4000 and Ryzen 5000. They are not marked for Athlon processors with Radeon Graphics, Ryzen 1000, Ryzen 2000, Ryzen 2000 with Radeon Graphics, or Ryzen 3000 with Radeon Graphics. X570 is not marked for Athlon processors with Radeon Graphics, Ryzen 1000, Ryzen 2000, or Ryzen 2000 with Radeon Graphics. X370 and B350 say a selective beta BIOS update is needed for Ryzen 3000, 4000 and 5000. A320 is not marked for Ryzen 3000 series processors without Radeon Graphics, and it says a selective beta BIOS update is needed for Ryzen 4000 and 5000. X470 is marked for every family in that matrix. AMD says further combinations may be available through system suppliers, and that not every processor is supported on every chipset. Support may require a BIOS upgrade from the motherboard maker. The Ryzen 5 5600T lists X570, X470, X370, B550, B450, B350 and A520. It does not list A320. X370 and B350 are on its list and are the rows AMD marks as a selective beta BIOS for Ryzen 5000.

PCIe. The generation depends on the processor and the chipset, not on the socket name. On AM4, AMD lists PCIe 4.0 for X570, and PCIe 4.0 for graphics and NVMe only on B550. A520, X470, B450, X370, B350 and A320 are listed as PCIe 3.0. AMD's footnote says PCIe 4.0 requires a 3rd Gen Ryzen or newer processor. The same footnotes limit A-Series and Ryzen processors with Radeon Graphics on Socket AM4 to 1x8 PCIe Gen3 for the graphics card, and limit A-Series processors to 1x2 NVMe. The Ryzen 5 5600T lists PCIe 4.0, 24 total lanes and 20 usable, with additional usable lanes of 16x Gen 4 from X570 and 2x Gen 3 plus 8x Gen 2 from X470. On AM5, usable PCIe 5.0 lanes are up to 24 on X870E, X870 and X670E, up to 8 on X670, up to 4 on B850, and up to 0 on B840, A620, A620A, PRO 665 and PRO 600. Graphics are 1x16 or 2x8 PCIe 5.0 on X870E, X870 and X670E. They are PCIe 4.0 on B850, X670, B840 and A620. Primary NVMe is PCIe 5.0 x4 on X870E, X870, B850, X670E and X670, and PCIe 4.0 x4 on B840 and A620. PRO 665 lists PCIe 4.0 NVMe with PCIe 5.0 optional. The Ryzen 5 7600 lists PCIe 5.0, 28 total lanes and 24 usable. The Ryzen 5 8600G lists PCIe 4.0, 20 total lanes and 16 usable, so that processor is not a PCIe 5.0 part even in a Socket AM5 board. B650 and B650E are on the Ryzen 5 7600 and Ryzen 5 8600G supporting-chipset lists and are not rows on AMD's current Socket AM5 specification table. B650 vs B850 covers that chipset choice.

Cooler. For the Computex 2022 Socket AM5 launch, AMD says existing AM4 cooling solutions will continue to be supported. The sentence names no cooler. Noctua describes AM5 as LGA 1718 and says its AM4 mountings that attach to the standard AMD backplate also support AM5, because those backplate threads and their pattern are identical. Noctua excepts the NH-L9a-AM4 and the NM-AM4-L9aL9i, which replace that backplate, and says the replacement is not possible on AM5. Noctua offers the NM-AM5-L9aL9i kit for the NH-L9a, NH-L9a-AM4 and NH-L9i. Noctua says multi-socket coolers bought before 2019 that were never upgraded to AM4 need an NM-AM5/4-MP83 or NM-AM5/4-MP78 kit. That is one cooler maker. The Ryzen 5 5600T and the Ryzen 5 7600 each list an AMD Wraith Stealth in the box. Any other cooler counts only when its maker lists the socket for that model.

Support window. AMD's AM4 chipset specifications mark ten years of Socket AM4 and the return of the Ryzen 7 5800X3D. That is history on the socket. It does not name a future AM4 processor. AMD's 31 May 2026 Computex post says AMD is extending support for the Socket AM5 platform through 2029. The post names no future processor model, and it does not say every current Socket AM5 board will run a later processor without a BIOS update. The chipset specifications still say a BIOS update may be required for Ryzen 8000 and 9000 on 600-series boards.

Shopping judgment, not a measured result. Keep Socket AM4 when the motherboard and DDR4 are already in the PC and the motherboard maker lists the processor. Buy Socket AM5 when you are buying both the motherboard and the memory and you want the desktop socket AMD lists for Ryzen 7000, 8000 and 9000. Neither socket is right for everyone.

Ryzen 7 5800X3D vs AM5 is the separate choice for someone who already has Socket AM4 and is weighing that processor. DDR5 vs DDR4 is the memory choice. B650 vs B850 is the chipset choice once the socket is AM5.`;

const SPEC = "Platform";

const BUILT = buildEditorialComparison({
  slug: "am4-vs-am5",
  title: "AM4 vs AM5: Which Desktop PC Socket?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Socket AM4",
      shortDesc:
        "AMD desktop socket with DDR4. Processor support depends on the chipset and the BIOS. PCIe 4.0 is not on every chipset or every AM4 processor.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "DDR4 stays with a board you already have, when that board supports the processor",
        "Ryzen 5 5600T lists PCIe 4.0, 24 total lanes and 20 usable",
        "Ryzen 5 5600T includes an AMD Wraith Stealth",
      ],
      cons: [
        "Not every chipset accepts every AM4 processor family",
        "Several chipset rows are PCIe 3.0, and PCIe 4.0 needs a 3rd Gen Ryzen or newer",
        "DDR5 is not the memory type on AMD's AM4 chipset specifications",
      ],
      bestFor: "A desktop PC that already has a compatible AM4 board and DDR4",
    },
    {
      id: B,
      slug: B,
      name: "Socket AM5",
      shortDesc:
        "AMD desktop socket with DDR5 for Ryzen 7000, 8000 and 9000. PCIe 5.0 depends on the processor and the chipset. A BIOS update may be required.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "DDR5, with AMD EXPO on the chipset rows that enable it",
        "Ryzen 7000, 8000 and 9000 on 600-series and 800-series boards, BIOS permitting",
        "AMD's 31 May 2026 post extends Socket AM5 support through 2029",
      ],
      cons: [
        "Needs a Socket AM5 board and DDR5",
        "PCIe 5.0 is not on every AM5 processor or chipset",
        "Not every AM4 cooler fits",
      ],
      bestFor: "A new desktop build that is buying the motherboard and DDR5",
    },
  ],
  keyDifferences: [
    {
      label: "Memory type",
      entityAValue: "DDR4",
      entityBValue: "DDR5",
      winner: "tie",
    },
    {
      label: "Desktop processors",
      entityAValue: "Ryzen 1000–5000 and others, by chipset",
      entityBValue: "Ryzen 7000, 8000, 9000; BIOS may be required",
      winner: "tie",
    },
    {
      label: "Usable PCIe 5.0 lanes",
      entityAValue: "Not a PCIe 5.0 platform",
      entityBValue: "Up to 24, 8, 4, or 0 by chipset",
      winner: "tie",
    },
    {
      label: "Example CPU PCIe",
      entityAValue: "5600T: PCIe 4.0, 24/20",
      entityBValue: "7600: PCIe 5.0, 28/24. 8600G: PCIe 4.0, 20/16",
      winner: "tie",
    },
    {
      label: "AM4 cooler on this socket",
      entityAValue: "Maker must list AM4",
      entityBValue: "Not every AM4 cooler",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("memory-type", "Memory type", SPEC, A, B, "DDR4 (AMD AM4 chipset specifications)", "DDR5 (AMD AM5 chipset specifications)"),
    textAttr(
      "example-memory",
      "Example processor memory",
      SPEC,
      A,
      B,
      "Ryzen 5 5600T: 2 channels, 128 GB, 2x1R DDR4-3200",
      "Ryzen 5 7600: 2 channels, 128 GB, 2x1R DDR5-5200. Ryzen 5 8600G: 256 GB, 2x1R DDR5-5200"
    ),
    textAttr(
      "processors",
      "Processors AMD lists",
      SPEC,
      A,
      B,
      "Select Ryzen 1000–5000, Athlon with Radeon Graphics, 7th Gen A-Series. Not every chipset.",
      "Ryzen 7000, 8000 and 9000 desktop. BIOS may be required on 600-series boards for 8000 and 9000."
    ),
    textAttr("other-socket", "Processor on the other socket", SPEC, A, B, "Not on the AM5 processor list", "Not on the AM4 matrix"),
    textAttr(
      "example-pcie",
      "Example CPU PCIe",
      SPEC,
      A,
      B,
      "Ryzen 5 5600T: PCIe 4.0, 24 total / 20 usable",
      "Ryzen 5 7600: PCIe 5.0, 28/24. Ryzen 5 8600G: PCIe 4.0, 20/16"
    ),
    textAttr(
      "pcie5",
      "Usable PCIe 5.0 lanes (up to)",
      SPEC,
      A,
      B,
      "No PCIe 5.0 row on the AM4 table",
      "24 on X870E, X870, X670E; 8 on X670; 4 on B850; 0 on B840, A620/A620A, PRO 665, PRO 600"
    ),
    textAttr(
      "graphics",
      "Graphics slot examples",
      SPEC,
      A,
      B,
      "X570 and B550: PCIe 4.0 when the CPU qualifies. A520, X470, B450 and 300-series: PCIe 3.0. APUs: 1x8 Gen3",
      "PCIe 5.0 on X870E, X870, X670E. PCIe 4.0 on B850, X670, B840, A620"
    ),
    textAttr(
      "nvme",
      "Primary NVMe examples",
      SPEC,
      A,
      B,
      "B550: PCIe 4.0 for graphics and NVMe only. A520: PCIe 3.0",
      "PCIe 5.0 x4 on X870E, X870, B850, X670E, X670. PCIe 4.0 x4 on B840 and A620"
    ),
    textAttr(
      "cooler",
      "Cooler",
      SPEC,
      A,
      B,
      "Boxed cooler when the CPU spec includes one. Ryzen 5 5600T: Wraith Stealth",
      "Computex 2022 partner article names no model. Noctua excepts NH-L9a-AM4 and NM-AM4-L9aL9i"
    ),
    textAttr(
      "support-window",
      "Stated support",
      SPEC,
      A,
      B,
      "Ten years, stated as history. No future processor named",
      "Through 2029 (AMD, 31 May 2026). No future processor named"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "ryzen-7-5800x3d-vs-am5", title: "Ryzen 7 5800X3D vs AM5", category: "technology" },
    { slug: "ddr5-vs-ddr4", title: "DDR5 vs DDR4", category: "technology" },
    { slug: "b650-vs-b850", title: "B650 vs B850", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Keep Socket AM4 when the board and DDR4 are already compatible. Buy Socket AM5 when you are buying the board and DDR5. PCIe 5.0 still depends on the processor and the chipset.",
    keyFact:
      "AMD lists DDR4 for Socket AM4 and DDR5 for Socket AM5. Usable PCIe 5.0 lanes on the current AM5 chipset table run from up to 24 to up to 0.",
  },
  citationStats: {
    sourceCount: 8,
    dataPointCount: 36,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "AMD Socket AM4 chipset specifications", url: AMD_AM4 },
      { name: "AMD Socket AM5 chipset specifications", url: AMD_AM5 },
      { name: "AMD Ryzen 5 5600T specifications", url: AMD_5600T },
      { name: "AMD Ryzen 5 7600 specifications", url: AMD_7600 },
      { name: "AMD Ryzen 5 8600G specifications", url: AMD_8600G },
      { name: "AMD Computex 2026: AM5 support through 2029 (31 May 2026)", url: AMD_COMPUTEX },
      { name: "AMD Socket AM5 partner article (Computex 2022 launch)", url: AMD_PARTNER },
      { name: "Noctua: which coolers are compatible with AM5", url: NOCTUA },
    ],
  },
  resources: [
    {
      type: "external",
      label: "AMD Socket AM4 chipset specifications",
      url: AMD_AM4,
      description:
        "DDR4. Matrix for Athlon with Radeon Graphics, Ryzen 1000, 2000 with Radeon Graphics, 2000, 3000 with Radeon Graphics, 3000, 4000 and 5000. B550 and A520 omit several early families. X370 and B350 need a selective beta BIOS for Ryzen 3000, 4000 and 5000. A320 is not marked for Ryzen 3000 without Radeon Graphics. PCIe 4.0 on X570, and on B550 for graphics and NVMe only. PCIe 4.0 requires a 3rd Gen Ryzen or newer. A-Series and Ryzen processors with Radeon Graphics: 1x8 PCIe Gen3 for graphics. A-Series: 1x2 NVMe. Ten years of Socket AM4, with the return of the Ryzen 7 5800X3D.",
    },
    {
      type: "external",
      label: "AMD Socket AM5 chipset specifications",
      url: AMD_AM5,
      description:
        "DDR5 and PCIe 5.0 on select motherboards. Ryzen 7000, 8000 and 9000 on 600-series and 800-series boards. A BIOS update may be required for Ryzen 8000 and 9000 on 600-series boards. Usable PCIe 5.0 lanes up to 24, 8, 4 or 0 by chipset. Graphics PCIe 5.0 on X870E, X870 and X670E; PCIe 4.0 on B850, X670, B840 and A620. EXPO yes on the consumer rows named in the table, no on PRO 665 and PRO 600. “Plus whatever comes next” names no processor.",
    },
    {
      type: "external",
      label: "AMD Ryzen 5 5600T specifications",
      url: AMD_5600T,
      description:
        "Socket AM4. DDR4, 2 channels, 128 GB, up to 3200 MT/s, 2x1R DDR4-3200, 4x1R DDR4-2933, 4x2R DDR4-2667. PCIe 4.0, 24 total / 20 usable. Additional lanes: X570 16x Gen 4; X470 2x Gen 3 and 8x Gen 2. Chipsets: X570, X470, X370, B550, B450, B350, A520. ECC requires motherboard support. Boxed cooler: AMD Wraith Stealth. Discrete graphics required.",
    },
    {
      type: "external",
      label: "AMD Ryzen 5 7600 specifications",
      url: AMD_7600,
      description:
        "Socket AM5. DDR5, 2 channels, 128 GB, 2x1R DDR5-5200, 4x1R DDR5-3600. PCIe 5.0, 28 total / 24 usable. AMD EXPO yes. Supporting chipsets include A620, X670E, X670, B650E, B650, X870E, X870, B840 and B850. ECC requires motherboard support. Boxed cooler: AMD Wraith Stealth.",
    },
    {
      type: "external",
      label: "AMD Ryzen 5 8600G specifications",
      url: AMD_8600G,
      description:
        "Socket AM5. DDR5, 2 channels, 256 GB, 2x1R DDR5-5200. PCIe 4.0, 20 total / 16 usable. AMD EXPO yes. Same supporting-chipset list shape as the Ryzen 5 7600, including B650, B650E, B840 and B850. Radeon 760M graphics.",
    },
    {
      type: "external",
      label: "AMD Computex 2026 post (31 May 2026)",
      url: AMD_COMPUTEX,
      description:
        "AMD is extending support for the Socket AM5 platform through 2029. The post names no future processor model. It also marks ten years of Socket AM4 and the Ryzen 7 5800X3D 10th Anniversary Edition.",
    },
    {
      type: "external",
      label: "AMD Socket AM5 partner article (Computex 2022 launch)",
      url: AMD_PARTNER,
      description:
        "Says existing AM4 cooling solutions will continue to be supported. Names no cooler model.",
    },
    {
      type: "external",
      label: "Noctua AM5 cooler compatibility",
      url: NOCTUA,
      description:
        "AM5 (LGA 1718). AM4 mountings that use the standard AMD backplate also support AM5. NH-L9a-AM4 and NM-AM4-L9aL9i are excepted because they replace that backplate, which is not possible on AM5. NM-AM5-L9aL9i kit for NH-L9a, NH-L9a-AM4 and NH-L9i. Pre-2019 multi-socket coolers that were never upgraded to AM4 need NM-AM5/4-MP83 or NM-AM5/4-MP78.",
    },
  ],
  metaTitle: "AM4 vs AM5: Which Desktop PC Socket?",
});

BUILT.metadata.metaDescription =
  "AM4 keeps a compatible board and DDR4. AM5 is DDR5 for Ryzen 7000, 8000 and 9000. PCIe 5.0 depends on the CPU and chipset. Price the whole basket.";

export const AM4_VS_AM5: EditorialComparison = BUILT;
