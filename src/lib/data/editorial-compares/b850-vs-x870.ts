import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-354 — B850 vs X870 for an AM5 gaming build (Ryzen 7 9800X3D).
 * Read on 31 October 2026 (Asia/Jerusalem) from AMD's Socket AM5 chipset
 * table and the Ryzen 7 9800X3D spec page. TechSpot's 6 February 2025 AM5
 * chipset guide was opened the same day as a cross-check; it matches AMD on
 * B850 and X870 and is the source for the B650 / B650E paragraph only.
 * Dropped: TechPowerUp 323052 (pre-launch slide; B850 reversed), street
 * prices, fps and percentage claims, Wi-Fi generation, Promontory chip
 * names, and named motherboard models. The r/PcBuild thread returned 403,
 * so the page has no community-opinion block and does not cite it. No winner.
 */

const A = "b850";
const B = "x870";

const AMD_AM5 = "https://www.amd.com/en/products/processors/chipsets/am5.html";
const AMD_9800X3D =
  "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9800x3d.html";
const TECHSPOT =
  "https://www.techspot.com/guides/2901-amd-ryzen-x870-b850-b840-x670-b650-a620-motherboards/";

const SOURCE_DATE = "2026-10-31";
const PUBLISHED = "2026-10-31T00:00:00Z";

const SHORT_ANSWER =
  "For most gaming builds, including a Ryzen 7 9800X3D, a B850 board is enough. AMD enables Ryzen CPU overclocking and DDR5 overclocking with EXPO on both B850 and X870, and lists a PCIe 5.0 x4 slot for the main NVMe SSD on both. Choose X870 when you want PCIe 5.0 graphics, USB 4.0 as a standard feature, or up to 24 usable PCIe 5.0 lanes. AMD lists B850 graphics as PCIe 4.0, USB 4.0 as optional, and usable PCIe 5.0 lanes as up to 4. Neither chipset is right for everyone.";

const FAQS = [
  {
    question: "Is X870 worth it over B850 for a Ryzen 7 9800X3D?",
    answer:
      "Usually not for a gaming-only build. AMD lists both B850 and X870 as supporting chipsets for the Ryzen 7 9800X3D, with Ryzen processor overclocking and DDR5 memory overclocking (AMD EXPO) enabled on both. X870 is worth it when you want the PCIe 5.0 graphics slot AMD lists for X870, USB 4.0 as standard, or up to 24 usable PCIe 5.0 lanes instead of up to 4.",
  },
  {
    question: "Does B850 support PCIe 5.0?",
    answer:
      "Yes for the main SSD. AMD lists a PCIe 5.0 x4 NVMe slot on B850. The graphics slot is listed as 1x16 or 2x8 PCIe 4.0. Read the exact board's spec sheet for the graphics slot, because a board can be wired beyond that chipset floor.",
  },
  {
    question: "Does B850 have USB4?",
    answer:
      "USB 4.0 is optional on B850 and standard on X870 and X870E, per AMD. Read the spec sheet of the board you are buying.",
  },
  {
    question: "Can you overclock on B850?",
    answer:
      "Yes. AMD lists Ryzen processor overclocking and DDR5 memory overclocking with AMD EXPO as enabled on both B850 and X870.",
  },
  {
    question: "What is the difference between X870 and X870E?",
    answer:
      "AMD lists PCIe 5.0 graphics and standard USB 4.0 on both. X870E has 44 usable PCIe lanes with up to 24 at PCIe 5.0, up to 2 / 12 / 2 SuperSpeed USB ports at 5 / 10 / 20 Gbps, and up to 8 SATA ports or PCIe 3.0 in their place. X870 has 36 usable lanes with up to 24 at PCIe 5.0, up to 1 / 6 / 1 SuperSpeed USB ports, and up to 4 SATA ports or PCIe 3.0 in their place.",
  },
  {
    question: "Will a B850 or X870 board run a Ryzen 7 9800X3D?",
    answer:
      "AMD lists B850 and X870 among the supporting chipsets for the Ryzen 7 9800X3D. The chip uses Socket AM5 and DDR5. AMD also says a BIOS update may be required for Ryzen 9000 series processors on 600-series boards, so read the motherboard maker's CPU support list for your exact board.",
  },
];

const VERDICT = `Enough for most gaming builds: B850. AMD lists Ryzen CPU overclocking, DDR5 overclocking with EXPO, and a PCIe 5.0 x4 NVMe slot. Graphics are listed as PCIe 4.0, and USB 4.0 is optional.

Worth it for a higher connection floor: X870. AMD lists PCIe 5.0 graphics (1x16 or 2x8), USB 4.0 as standard, and up to 24 usable PCIe 5.0 lanes.

Neither chipset is right for everyone. Read the exact board for graphics-slot generation, PCIe 5.0 M.2 count, USB 4.0, LAN and rear USB.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- AMD enables Ryzen processor overclocking on both B850 and X870.
- AMD enables DDR5 memory overclocking with EXPO on both.
- Both list a PCIe 5.0 x4 NVMe slot. X870 also lists 4x PCIe GPP beside that slot.
- X870 lists graphics as 1x16 or 2x8 PCIe 5.0. B850 lists graphics as 1x16 or 2x8 PCIe 4.0.
- Usable PCIe lanes are 36 on both, with up to 24 at PCIe 5.0 on X870 and up to 4 at PCIe 5.0 on B850.
- Chipset SuperSpeed USB counts match: up to 1 port at 5 Gbps, 6 at 10 Gbps and 1 at 20 Gbps. SATA, or PCIe 3.0 in its place, is up to 4 on both.
- USB 4.0 is standard on X870 and optional on B850.
- The Ryzen 7 9800X3D uses Socket AM5 and DDR5, and AMD lists both B850 and X870 as supporting chipsets.

Specs side by side

These figures are AMD's chipset floors for the name on the box. A board can add more. It cannot claim less than the row and still be that chipset.

- Graphics (CPU lanes): 1x16 or 2x8 PCIe 5.0 on X870, and 1x16 or 2x8 PCIe 4.0 on B850.
- NVMe: 1x4 PCIe 5.0 plus 4x PCIe GPP on X870, and 1x4 PCIe 5.0 on B850.
- Usable PCIe lanes total / PCIe 5.0 (up to): 36 / 24 on X870, and 36 / 4 on B850.
- Ryzen CPU overclocking: yes on both.
- DDR5 overclocking with AMD EXPO: yes on both.
- SuperSpeed USB 5 / 10 / 20 Gbps (chipset, up to): 1 / 6 / 1 on both.
- SATA, or PCIe 3.0 in its place (up to): 4 on both.
- USB 4.0: standard on X870, optional on B850.

Gaming with a Ryzen 7 9800X3D

The processor stays the same when you change the chipset. AMD lists the Ryzen 7 9800X3D as an unlocked Socket AM5 chip with DDR5, AMD EXPO and PCIe 5.0, and lists B850 and X870 among its supporting chipsets. The chipset row decides slots and ports. It does not add CPU cores, and it does not change the graphics card.

AMD lists the B850 graphics slot as 1x16 or 2x8 at PCIe 4.0, and the X870 graphics slot as 1x16 or 2x8 at PCIe 5.0. How that link changes frame rate depends on the graphics card and the game. Frame rate is not a row in the chipset table.

Read the exact board before you assume the slot generation. AMD's B850 graphics cell is the floor for that chipset name. A board maker can wire the CPU's graphics lanes beyond that floor.

When B850 is the right board

B850 is the right buy when the shared floor covers the build.

- You are installing one graphics card, and you have read whether that board's slot is the PCIe 4.0 floor or a later PCIe generation the maker added.
- You need one PCIe 5.0 SSD. AMD lists that slot on B850.
- You do not need USB 4.0, or the B850 board you picked includes it anyway.
- You would rather put any price gap into the graphics card, memory or cooling. Compare the two boards at the store. Store prices move.

When X870 is worth it

X870 is worth it when you want the higher floor AMD lists for that name.

- You want graphics at PCIe 5.0 (1x16 or 2x8), which is the generation AMD lists for X870.
- You want USB 4.0 as a standard feature, for a dock or a fast external drive.
- You want up to 24 usable PCIe 5.0 lanes, against up to 4 on B850. AMD also lists 4x PCIe GPP beside X870's PCIe 5.0 x4 NVMe slot. The chipset table does not call those GPP lanes PCIe 5.0.
- You still read the board sheet for LAN, rear USB and how many PCIe 5.0 M.2 slots are actually wired.

X870E, B650 and B650E

X870E is the step up on AMD's chipset specification table. It keeps PCIe 5.0 graphics (1x16 or 2x8) and standard USB 4.0, and it lists 44 usable PCIe lanes with up to 24 at PCIe 5.0, up to 2 / 12 / 2 SuperSpeed USB ports at 5 / 10 / 20 Gbps, and up to 8 SATA ports or PCIe 3.0 in their place. X870 lists 36 usable lanes, up to 1 / 6 / 1 SuperSpeed USB ports and up to 4 SATA ports or PCIe 3.0 in their place, with the same PCIe 5.0 graphics cell and standard USB 4.0.

AMD's Ryzen 7 9800X3D specifications also name B650 and B650E as supporting chipsets, next to B850, X870 and X870E. B650 and B650E are not rows on the AMD chipset specification table used for the B850 and X870 figures. TechSpot's February 6, 2025 AM5 chipset guide describes B650E as PCIe 5.0 for the graphics slot and at least one M.2 slot, and describes X870 as that layout with USB 4.0 required. The same guide describes B650 graphics as PCIe 4.0, with a PCIe 5.0 M.2 slot optional. If you already own a B650 or B650E board, use that board's manual for the slot generations and for USB 4.0.

Chipset floor versus this board

AMD's row is the floor for the chipset name. The board in the cart can sit beyond that floor. Read these five lines on that board's spec sheet:

1. Graphics slot generation and width (x16 or x8), and whether it drops to x8 when another slot or an M.2 slot is filled.
2. How many M.2 slots are PCIe 5.0.
3. Whether USB 4.0 is fitted. AMD marks it standard on X870 and optional on B850.
4. The wired LAN port on that board. AMD's chipset table does not set LAN speed.
5. Rear USB count and the speed of each port.

Do this even when two boards share a chipset name. A B850 board can list a different M.2 layout or a different LAN port than a given X870 board. Compare the sheets.

BIOS and CPU support

AMD says motherboards with 600-series and 800-series chipsets are compatible with Socket AM5 processors, including Ryzen 7000, 8000 and 9000, and that a BIOS update may be required for Ryzen 8000 and 9000 series processors on 600-series boards. The Ryzen 7 9800X3D is a 9000-series chip. AMD lists B850, X870, X870E, B650 and B650E among its supporting chipsets. Look up your exact board on the motherboard maker's CPU support list and install a BIOS version that lists the 9800X3D.

Related choices

Ryzen 7 5800X3D or AM5 covers staying on an older board versus moving to AM5. DDR5 vs DDR4 covers the memory a Ryzen 7 9800X3D build uses. RX 9070 vs RX 9070 XT covers a graphics-card choice for 1440p gaming.`;

const SPEC = "Specs";

const BUILT = buildEditorialComparison({
  slug: "b850-vs-x870",
  title: "B850 vs X870: Which AM5 Chipset for a Gaming PC?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "AMD B850",
      shortDesc:
        "AMD AM5 chipset with Ryzen and DDR5 (EXPO) overclocking, a PCIe 5.0 x4 NVMe slot, PCIe 4.0 graphics and optional USB 4.0.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Ryzen CPU overclocking enabled (AMD)",
        "DDR5 overclocking with AMD EXPO (AMD)",
        "PCIe 5.0 x4 NVMe slot (AMD)",
      ],
      cons: [
        "Graphics slot listed as PCIe 4.0 (AMD)",
        "USB 4.0 is optional (AMD)",
        "Up to 4 usable PCIe 5.0 lanes (AMD)",
      ],
      bestFor: "Gaming builds that need CPU and DDR5 overclocking plus one PCIe 5.0 SSD",
    },
    {
      id: B,
      slug: B,
      name: "AMD X870",
      shortDesc:
        "AMD AM5 chipset with Ryzen and DDR5 (EXPO) overclocking, PCIe 5.0 graphics, standard USB 4.0 and up to 24 PCIe 5.0 lanes.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "PCIe 5.0 graphics, 1x16 or 2x8 (AMD)",
        "USB 4.0 standard (AMD)",
        "Up to 24 usable PCIe 5.0 lanes (AMD)",
      ],
      cons: [
        "Same chipset USB ceiling as B850: up to 1 / 6 / 1 (AMD)",
        "Same SATA-or-PCIe-3.0 ceiling as B850: up to 4 (AMD)",
      ],
      bestFor: "Builds that need PCIe 5.0 graphics, standard USB 4.0, or more PCIe 5.0 lanes",
    },
  ],
  keyDifferences: [
    {
      label: "Graphics slot",
      entityAValue: "1x16 or 2x8 PCIe 4.0",
      entityBValue: "1x16 or 2x8 PCIe 5.0",
      winner: "b",
    },
    {
      label: "Primary NVMe",
      entityAValue: "1x4 PCIe 5.0",
      entityBValue: "1x4 PCIe 5.0 plus 4x PCIe GPP",
      winner: "b",
    },
    {
      label: "Usable PCIe 5.0 lanes",
      entityAValue: "Up to 4",
      entityBValue: "Up to 24",
      winner: "b",
    },
    {
      label: "USB 4.0",
      entityAValue: "Optional",
      entityBValue: "Standard",
      winner: "b",
    },
    {
      label: "CPU and DDR5 overclocking",
      entityAValue: "Yes",
      entityBValue: "Yes",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("graphics", "Graphics (CPU lanes)", SPEC, A, B, "1x16 or 2x8 PCIe 4.0", "1x16 or 2x8 PCIe 5.0", "b"),
    textAttr("nvme", "NVMe", SPEC, A, B, "1x4 PCIe 5.0", "1x4 PCIe 5.0 plus 4x PCIe GPP", "b"),
    textAttr("lanes", "Usable PCIe lanes total / PCIe 5.0 (up to)", SPEC, A, B, "36 / 4", "36 / 24"),
    textAttr("cpu-oc", "Ryzen CPU overclocking", SPEC, A, B, "Yes", "Yes"),
    textAttr("ddr5-oc", "DDR5 overclocking (AMD EXPO)", SPEC, A, B, "Yes", "Yes"),
    textAttr("usb", "SuperSpeed USB 5 / 10 / 20 Gbps (up to)", SPEC, A, B, "1 / 6 / 1", "1 / 6 / 1"),
    textAttr("sata", "SATA or PCIe 3.0 (up to)", SPEC, A, B, "4", "4"),
    textAttr("usb4", "USB 4.0", SPEC, A, B, "Optional", "Standard", "b"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "ryzen-7-5800x3d-vs-am5", title: "Ryzen 7 5800X3D or AM5", category: "technology" },
    { slug: "ddr5-vs-ddr4", title: "DDR5 vs DDR4", category: "technology" },
    { slug: "rx-9070-vs-rx-9070-xt", title: "RX 9070 vs RX 9070 XT", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "B850 when CPU overclocking, DDR5 EXPO and one PCIe 5.0 SSD are enough. X870 when you want PCIe 5.0 graphics, standard USB 4.0 and up to 24 PCIe 5.0 lanes.",
    keyFact:
      "AMD lists PCIe 5.0 graphics and standard USB 4.0 on X870, and PCIe 4.0 graphics with optional USB 4.0 on B850. Both overclock the CPU and DDR5.",
  },
  citationStats: {
    sourceCount: 3,
    // 16 B850/X870 spec cells, plus X870E 44 / 2 / 12 / 2 / 8 and three B650 layout points.
    dataPointCount: 24,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "AMD Socket AM5 chipset specifications", url: AMD_AM5 },
      { name: "AMD Ryzen 7 9800X3D specifications", url: AMD_9800X3D },
      { name: "TechSpot AM5 chipset guide (February 6, 2025)", url: TECHSPOT },
    ],
  },
  resources: [
    {
      type: "external",
      label: "AMD Socket AM5 chipset specifications",
      url: AMD_AM5,
      description:
        "B850 and X870: CPU overclocking yes, DDR5 EXPO yes, USB 1/6/1, SATA or PCIe 3.0 up to 4. X870 graphics 1x16 or 2x8 PCIe 5.0, NVMe 1x4 PCIe 5.0 plus 4x PCIe GPP, lanes 36/24, USB 4.0 standard. B850 graphics PCIe 4.0, NVMe 1x4 PCIe 5.0, lanes 36/4, USB 4.0 optional. X870E: 44/24, USB 2/12/2, SATA or PCIe 3.0 up to 8, USB 4.0 standard.",
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
        "Cross-check for B850 and X870. B650E described as PCIe 5.0 graphics and at least one PCIe 5.0 M.2. X870 described as that layout with USB 4.0 required. B650 graphics described as PCIe 4.0, with a PCIe 5.0 M.2 slot optional.",
    },
  ],
  metaTitle: "B850 vs X870 for a Gaming PC",
});

BUILT.metadata.metaDescription =
  "B850 vs X870 on AM5: AMD lists PCIe 5.0 graphics and standard USB 4.0 on X870, and PCIe 4.0 graphics with optional USB 4.0 on B850. Both overclock the CPU and DDR5.";

export const B850_VS_X870: EditorialComparison = BUILT;
