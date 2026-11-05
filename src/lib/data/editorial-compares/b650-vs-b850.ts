import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-385 — B650 vs B850 for an AM5 gaming build (Ryzen 7 9800X3D + RX 9070 XT).
 * Opened 5 November 2026 (Asia/Jerusalem).
 * AMD Socket AM5 chipset table: B850 row (B650 and B650E are not rows).
 * AMD Ryzen 7 9800X3D spec: socket, DDR5, PCIe 5.0, supporting chipsets.
 * TechSpot AM5 chipset guide, 6 February 2025: B650, B650E, and the B850 cross-check.
 * TechPowerUp RTX 5090 PCIe scaling, 24 January 2025: Gen4 x16 loss on that GPU only.
 * Dropped: Reddit (r/buildapc JSON and old.reddit returned 403, so no community
 * block and no close-the-loop), street prices, Wi-Fi generation, Promontory
 * names, TechSpot's "until 2027" clause, and any RX 9070 XT frame-rate percent.
 * No winner. Every key difference is a tie. Check the SKU.
 */

const A = "b650";
const B = "b850";

const AMD_AM5 = "https://www.amd.com/en/products/processors/chipsets/am5.html";
const AMD_9800X3D =
  "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9800x3d.html";
const TECHSPOT =
  "https://www.techspot.com/guides/2901-amd-ryzen-x870-b850-b840-x670-b650-a620-motherboards/";
const TECHPOWERUP =
  "https://www.techpowerup.com/review/nvidia-geforce-rtx-5090-pci-express-scaling/";

const SOURCE_DATE = "2026-11-05";
const PUBLISHED = "2026-11-05T00:00:00Z";

const SHORT_ANSWER =
  "For gaming with a Ryzen 7 9800X3D and an RX 9070 XT, keep a B650 board you already own: frame rate comes from the CPU, the graphics card and memory, not from the chipset letter. Choose B850 when you are buying a new board and want the PCIe 5.0 x4 primary NVMe slot AMD requires on B850. AMD lists B850 graphics as 1x16 or 2x8 PCIe 4.0. TechSpot's February 6, 2025 AM5 chipset guide describes B650 graphics as PCIe 4.0, with a PCIe 5.0 M.2 slot optional. Check the SKU before you assume either slot generation. Neither chipset is right for everyone.";

const FAQS = [
  {
    question: "Does B650 vs B850 change gaming FPS with a Ryzen 7 9800X3D?",
    answer:
      "No meaningful frame-rate difference for a normal single-GPU gaming PC. Frame rate comes from the CPU, the graphics card and memory, not from the B650 or B850 name. TechPowerUp's January 24, 2025 GeForce RTX 5090 PCI-Express scaling review, run on a Ryzen 7 9800X3D and an MSI X870E Carbon Wi-Fi, reports about a 1 percent loss at PCIe 4.0 x16 across 1080p, 1440p and 4K. That figure is for the RTX 5090 in that setup, not an RX 9070 XT result. Check the SKU for how the graphics slot is wired.",
  },
  {
    question: "Should I upgrade from a B650 board to B850?",
    answer:
      "Only if you need a feature the board you own does not have, such as a primary NVMe slot at PCIe 5.0 x4, USB 4.0 on that SKU, or a VRM the spec sheet shows you need. AMD requires the PCIe 5.0 x4 primary NVMe on B850. If you already own a working B650 board, keep it. Check the SKU.",
  },
  {
    question: "Does B850 support PCIe 5.0?",
    answer:
      "Yes for the primary SSD. AMD lists a PCIe 5.0 x4 NVMe slot on B850, and lists B850 graphics as 1x16 or 2x8 PCIe 4.0. USB 4.0 is optional. A board can wire the graphics slot beyond that floor, so check the SKU.",
  },
  {
    question: "Is a B650 motherboard enough for an RX 9070 XT?",
    answer:
      "Yes for gaming. TechSpot's February 6, 2025 AM5 chipset guide describes B650 graphics as PCIe 4.0, in a 1x16 or 2x8 layout, with a PCIe 5.0 M.2 slot optional. TechPowerUp's January 24, 2025 RTX 5090 scaling review reports about a 1 percent loss at PCIe 4.0 x16 across 1080p, 1440p and 4K on a Ryzen 7 9800X3D. That is not an RX 9070 XT measurement. Check the SKU.",
  },
  {
    question: "What is the difference between B650 and B650E?",
    answer:
      "TechSpot's February 6, 2025 guide describes B650E as PCIe 5.0 for the graphics slot and at least one M.2 slot. The same guide describes B650 graphics as PCIe 4.0, with a PCIe 5.0 M.2 slot optional. B650 and B650E are not rows on AMD's current chipset specification table. Compare the two boards' spec sheets rather than the letter alone.",
  },
  {
    question: "Should you pick B850 or X870?",
    answer:
      "Pick X870 when you want the higher floor AMD lists for that name: graphics at 1x16 or 2x8 PCIe 5.0, USB 4.0 as standard, and up to 24 usable PCIe 5.0 lanes. B850 lists graphics as PCIe 4.0, USB 4.0 as optional, and up to 4 usable PCIe 5.0 lanes. B850 vs X870 covers that choice. Check the SKU either way.",
  },
];

const VERDICT = `Keep it if you already own it: B650. TechSpot's February 6, 2025 guide describes B650 graphics as PCIe 4.0 (1x16 or 2x8), with a PCIe 5.0 M.2 slot optional. AMD lists B650 among the supporting chipsets for the Ryzen 7 9800X3D.

Worth it on a new buy when you want the storage floor: B850. AMD lists a PCIe 5.0 x4 NVMe slot, Ryzen CPU overclocking, and DDR5 overclocking with EXPO. Graphics are listed as 1x16 or 2x8 PCIe 4.0, and USB 4.0 is optional.

Neither chipset is right for everyone. Check the SKU for graphics-slot generation, how many M.2 slots are PCIe 5.0, USB 4.0, the VRM and rear I/O.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Keep a B650 board you already own for a normal single-GPU gaming PC.
- Buy B850 when the new board should include the PCIe 5.0 x4 primary NVMe slot AMD requires on that chipset.
- AMD lists B850 graphics as 1x16 or 2x8 PCIe 4.0. A board can wire that slot at PCIe 5.0. Check the SKU.
- TechSpot's February 6, 2025 guide describes B650 graphics as PCIe 4.0 (1x16 or 2x8). It describes a PCIe 5.0 M.2 slot as optional on B650 and required on B850.
- TechSpot gives B650 a maximum of 0 usable PCIe 5.0 lanes. AMD lists B850 as 36 usable lanes with up to 4 at PCIe 5.0.
- USB 4.0 is optional on B850 in AMD's table and optional on B650 in TechSpot's guide. SuperSpeed USB counts on both rows are up to 1 / 6 / 1 at 5 / 10 / 20 Gbps. SATA, or PCIe 3.0 in its place, is up to 4.
- The Ryzen 7 9800X3D uses Socket AM5 and DDR5. AMD lists B650, B650E and B850 among its supporting chipsets.

Specs side by side

These figures are chipset floors. AMD's current chipset specification table is the source for every B850 cell below. B650 and B650E are not rows on it. TechSpot's February 6, 2025 guide is the source for B650 and B650E, and that guide matches AMD on the B850 row. A board can add more than the floor. Check the SKU.

- Graphics: 1x16 or 2x8 PCIe 4.0 on B650 (TechSpot) and on B850 (AMD).
- Primary NVMe: 1x4 PCIe 4.0, with PCIe 5.0 optional, on B650 (TechSpot). 1x4 PCIe 5.0 on B850 (AMD).
- Usable PCIe lanes total / PCIe 5.0 (up to): 36 / 0 on B650 (TechSpot). 36 / 4 on B850 (AMD).
- Ryzen CPU overclocking: AMD lists it as enabled on B850. TechSpot's February 6, 2025 guide says B650, B650E, B850 and X870 boards do not limit the CPU.
- DDR5 overclocking with AMD EXPO: Yes on B850 (AMD). The Ryzen 7 9800X3D supports AMD EXPO. AMD's current chipset specification table has no B650 row, so read that board's memory support list.
- SuperSpeed USB 5 / 10 / 20 Gbps (up to): 1 / 6 / 1 on B650 (TechSpot) and on B850 (AMD).
- SATA, or PCIe 3.0 in its place (up to): 4 on both.
- USB 4.0: optional on B650 (TechSpot) and optional on B850 (AMD).

Gaming with a Ryzen 7 9800X3D and an RX 9070 XT

The processor and the graphics card stay the same when you change the chipset. AMD lists the Ryzen 7 9800X3D as an unlocked Socket AM5 chip with DDR5, AMD EXPO and PCIe 5.0, and lists B650, B650E and B850 among its supporting chipsets. The chipset row decides slots and ports. It does not add CPU cores, and it does not change the graphics card.

For PCIe 4.0 x16 versus PCIe 5.0 x16, use a named test instead of a guessed gap. TechPowerUp's January 24, 2025 GeForce RTX 5090 PCI-Express scaling review tested that card on a Ryzen 7 9800X3D and an MSI X870E Carbon Wi-Fi, with 2x 16 GB of DDR5-6200, at 1080p, 1440p and 4K. TechPowerUp reports the loss at PCIe 4.0 x16 as well contained, about 1 percent across those three resolutions, and reports no loss in that review's ray-tracing tests at PCIe 4.0 x16. Those figures are for the RTX 5090 in that setup. They are not an RX 9070 XT measurement. A PCIe 4.0 x16 slot is the graphics floor TechSpot describes for B650 and the graphics floor AMD lists for B850. Check the SKU.

When to keep B650

Keep the B650 board when it already runs the build.

- You already own it, and the maker's CPU support list includes the Ryzen 7 9800X3D on a BIOS you can install. AMD says a BIOS update may be required for Ryzen 9000 series processors on 600-series boards.
- Your SSD is PCIe 4.0. TechSpot describes a PCIe 5.0 M.2 slot as optional on B650, so a PCIe 4.0 SSD does not need a new chipset to run.
- You have read the graphics slot on that SKU. The floor TechSpot describes is PCIe 4.0, 1x16 or 2x8.
- You would rather put any price gap into the graphics card, memory or cooling. Compare the two boards at the store. Store prices move.

When B850 is the new buy

B850 is the buy when you are choosing a board now and you want the floor AMD lists for that name.

- You want the PCIe 5.0 x4 primary NVMe slot AMD requires on B850.
- You want Ryzen CPU overclocking and DDR5 overclocking with EXPO, which AMD lists as enabled on B850.
- You do not need USB 4.0 as a standard feature. AMD lists it as optional on B850. Check the SKU.
- You still read the graphics slot. AMD's B850 cell is 1x16 or 2x8 PCIe 4.0. A board can be wired beyond that floor.

B650E

TechSpot's February 6, 2025 guide describes B650E as PCIe 5.0 for the graphics slot and at least one M.2 slot. The guide's B650E row is graphics at 1x16 or 2x8 PCIe 5.0, NVMe at 1x4 PCIe 5.0 plus 4x PCIe GPP, 36 usable lanes with up to 24 at PCIe 5.0, SuperSpeed USB up to 1 / 6 / 1, USB 4.0 optional, and up to 4 SATA ports or PCIe 3.0 in their place. The same guide describes X870 as that B650E layout with USB 4.0 required. AMD's current chipset specification table has no B650E row. AMD lists X870 graphics as 1x16 or 2x8 PCIe 5.0, USB 4.0 as standard, and usable PCIe 5.0 lanes as up to 24. Compare a B650E board with a B850 board on the spec sheet, not on the letter.

B850 vs X870

Read B850 vs X870 when you also want USB 4.0 as a standard feature, or up to 24 usable PCIe 5.0 lanes. AMD lists those on X870. AMD lists B850 USB 4.0 as optional, with up to 4 usable PCIe 5.0 lanes. Both list a PCIe 5.0 x4 NVMe slot, and AMD enables Ryzen CPU overclocking and DDR5 EXPO on both.

Chipset floor versus this board

The chipset row is the floor for the name on the box. The board in the cart can sit beyond that floor. Check the SKU on these five lines:

1. Graphics slot generation and width (x16 or x8), and whether it drops when another slot or an M.2 slot is filled.
2. Whether the primary M.2 slot is PCIe 5.0 x4, and how many other M.2 slots are PCIe 5.0.
3. Whether USB 4.0 is fitted. AMD marks it optional on B850. TechSpot marks it optional on B650.
4. The VRM and its heatsink. AMD's B850 row and TechSpot's B650 row do not set the power stages.
5. Wired LAN and rear USB. Neither row sets LAN speed.

BIOS and CPU support

AMD says motherboards with 600-series and 800-series chipsets are compatible with Socket AM5 processors, including Ryzen 7000, 8000 and 9000, and that a BIOS update may be required for Ryzen 8000 and 9000 series processors on 600-series boards. The Ryzen 7 9800X3D is a 9000-series chip. AMD lists B650, B650E, B850, X870 and X870E among its supporting chipsets. Look up the exact board on the motherboard maker's CPU support list and install a BIOS version that lists the 9800X3D.

Related choices

Ryzen 7 9700X vs Ryzen 7 9800X3D covers the CPU choice on this socket. RX 9070 vs RX 9070 XT covers a graphics-card choice for this kind of build. B850 vs X870 covers the step up from B850 when standard USB 4.0 or more PCIe 5.0 lanes is the feature you are missing.`;

const SPEC = "Specs";

const BUILT = buildEditorialComparison({
  slug: "b650-vs-b850",
  title: "B650 vs B850: Which AM5 Chipset for a Gaming PC?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "AMD B650",
      shortDesc:
        "Earlier AMD AM5 chipset. TechSpot describes PCIe 4.0 graphics and an optional PCIe 5.0 M.2 slot. AMD lists it for the Ryzen 7 9800X3D.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "AMD lists it as a supporting chipset for the Ryzen 7 9800X3D",
        "Graphics floor is PCIe 4.0, 1x16 or 2x8 (TechSpot)",
        "A board you already own keeps the rest of the PC",
      ],
      cons: [
        "Primary NVMe floor is PCIe 4.0 x4, Gen5 optional (TechSpot)",
        "Usable PCIe 5.0 lane floor is 0 (TechSpot)",
        "No B650 row on AMD's current chipset specification table",
      ],
      bestFor: "A gaming PC that already has a working B650 board",
    },
    {
      id: B,
      slug: B,
      name: "AMD B850",
      shortDesc:
        "AMD AM5 chipset with Ryzen and DDR5 (EXPO) overclocking, a required PCIe 5.0 x4 NVMe slot, PCIe 4.0 graphics and optional USB 4.0.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "PCIe 5.0 x4 NVMe slot required (AMD)",
        "Ryzen CPU overclocking enabled (AMD)",
        "DDR5 overclocking with AMD EXPO (AMD)",
      ],
      cons: [
        "Graphics slot listed as PCIe 4.0 (AMD)",
        "USB 4.0 is optional (AMD)",
        "Up to 4 usable PCIe 5.0 lanes (AMD)",
      ],
      bestFor: "A new AM5 gaming build that wants a required PCIe 5.0 SSD slot",
    },
  ],
  keyDifferences: [
    {
      label: "Graphics slot floor",
      entityAValue: "1x16 or 2x8 PCIe 4.0",
      entityBValue: "1x16 or 2x8 PCIe 4.0",
      winner: "tie",
    },
    {
      label: "Primary NVMe floor",
      entityAValue: "1x4 PCIe 4.0, PCIe 5.0 optional",
      entityBValue: "1x4 PCIe 5.0",
      winner: "tie",
    },
    {
      label: "Usable PCIe 5.0 lanes (floor)",
      entityAValue: "Up to 0",
      entityBValue: "Up to 4",
      winner: "tie",
    },
    {
      label: "USB 4.0",
      entityAValue: "Optional",
      entityBValue: "Optional",
      winner: "tie",
    },
    {
      label: "CPU overclocking",
      entityAValue: "Not limited (TechSpot)",
      entityBValue: "Enabled (AMD)",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("graphics", "Graphics (CPU lanes)", SPEC, A, B, "1x16 or 2x8 PCIe 4.0", "1x16 or 2x8 PCIe 4.0"),
    textAttr("nvme", "Primary NVMe", SPEC, A, B, "1x4 PCIe 4.0, PCIe 5.0 optional", "1x4 PCIe 5.0"),
    textAttr("lanes", "Usable PCIe lanes total / PCIe 5.0 (up to)", SPEC, A, B, "36 / 0", "36 / 4"),
    textAttr("cpu-oc", "Ryzen CPU overclocking", SPEC, A, B, "Not limited (TechSpot)", "Enabled (AMD)"),
    textAttr("ddr5-oc", "DDR5 overclocking (AMD EXPO)", SPEC, A, B, "Read the board memory list", "Yes"),
    textAttr("usb", "SuperSpeed USB 5 / 10 / 20 Gbps (up to)", SPEC, A, B, "1 / 6 / 1", "1 / 6 / 1"),
    textAttr("sata", "SATA or PCIe 3.0 (up to)", SPEC, A, B, "4", "4"),
    textAttr("usb4", "USB 4.0", SPEC, A, B, "Optional", "Optional"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "b850-vs-x870", title: "B850 vs X870", category: "technology" },
    { slug: "ryzen-7-9700x-vs-ryzen-7-9800x3d", title: "Ryzen 7 9700X vs Ryzen 7 9800X3D", category: "technology" },
    { slug: "rx-9070-vs-rx-9070-xt", title: "RX 9070 vs RX 9070 XT", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Keep B650 when you already own a working board. Buy B850 when you want AMD's required PCIe 5.0 x4 primary NVMe. Check the SKU either way.",
    keyFact:
      "AMD requires a PCIe 5.0 x4 primary NVMe on B850 and lists B850 graphics as PCIe 4.0. TechSpot describes B650 graphics as PCIe 4.0, with a PCIe 5.0 M.2 slot optional.",
  },
  citationStats: {
    sourceCount: 4,
    // B850 AMD cells, B650 and B650E TechSpot cells, 9800X3D platform points, one RTX 5090 percent.
    dataPointCount: 34,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "AMD Socket AM5 chipset specifications", url: AMD_AM5 },
      { name: "AMD Ryzen 7 9800X3D specifications", url: AMD_9800X3D },
      { name: "TechSpot AM5 chipset guide (February 6, 2025)", url: TECHSPOT },
      { name: "TechPowerUp GeForce RTX 5090 PCI-Express scaling (January 24, 2025)", url: TECHPOWERUP },
    ],
  },
  resources: [
    {
      type: "external",
      label: "AMD Socket AM5 chipset specifications",
      url: AMD_AM5,
      description:
        "B850: graphics 1x16 or 2x8 PCIe 4.0, NVMe 1x4 PCIe 5.0, lanes 36/4, CPU overclocking yes, DDR5 EXPO yes, USB 1/6/1, SATA or PCIe 3.0 up to 4, USB 4.0 optional. X870: graphics PCIe 5.0, lanes 36/24, USB 4.0 standard. 600-series and 800-series boards support Ryzen 7000, 8000 and 9000. A BIOS update may be required for Ryzen 8000 and 9000 on 600-series boards. No B650 or B650E row.",
    },
    {
      type: "external",
      label: "AMD Ryzen 7 9800X3D specifications",
      url: AMD_9800X3D,
      description:
        "Socket AM5, DDR5, unlocked, AMD EXPO, PCIe 5.0. Supporting chipsets include B650, B650E, B850, X870 and X870E.",
    },
    {
      type: "external",
      label: "TechSpot AM5 chipset guide (February 6, 2025)",
      url: TECHSPOT,
      description:
        "B650: graphics PCIe 4.0 (1x16 or 2x8), NVMe 1x4 PCIe 4.0 with PCIe 5.0 optional, lanes 36/0, USB 1/6/1, USB 4.0 optional, SATA 4. B650E: graphics PCIe 5.0, NVMe 1x4 PCIe 5.0 plus 4x PCIe GPP, lanes 36/24, USB 1/6/1, USB 4.0 optional, SATA 4. B850 row matches AMD. B650, B650E, B850 and X870 do not limit the CPU.",
    },
    {
      type: "external",
      label: "TechPowerUp GeForce RTX 5090 PCI-Express scaling (January 24, 2025)",
      url: TECHPOWERUP,
      description:
        "Test system: Ryzen 7 9800X3D, MSI X870E Carbon Wi-Fi, 2x 16 GB DDR5-6200, 1080p, 1440p and 4K. About 1 percent loss at PCIe 4.0 x16 across those resolutions. No loss in the ray-tracing tests at PCIe 4.0 x16. RTX 5090 result only, not an RX 9070 XT measurement.",
    },
  ],
  metaTitle: "B650 vs B850 for AM5 Gaming",
});

BUILT.metadata.metaDescription =
  "B650 vs B850 for AM5 gaming: keep B650 if you own it. AMD requires a PCIe 5.0 x4 NVMe slot on B850 and lists B850 graphics as PCIe 4.0. Check the SKU.";

export const B650_VS_B850: EditorialComparison = BUILT;
