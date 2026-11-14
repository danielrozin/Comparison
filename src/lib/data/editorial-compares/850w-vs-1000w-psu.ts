import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-434 — 850W vs 1000W PSU for a new gaming PC.
 * Opened 14 November 2026 (Asia/Jerusalem):
 * NVIDIA GeForce RTX 5070 family, RTX 5080, and RTX 5090 specification tables;
 * AMD Ryzen 7 9800X3D specifications;
 * Seasonic, "GPU Power Spikes Explained", 8 September 2026;
 * Cybenetics Labs homepage and PSU performance database;
 * Hardware Busters power-supply picks article, 12 November 2026.
 * dataPointCount stays 0. No winner. No prices. No model ranks.
 * The Reddit thread returned HTTP 403, so no comment text is copied.
 */

const PUBLISHED = "2026-11-14T00:00:00Z";
const SOURCE_DATE = "2026-11-14";

const W850 = "850w-psu";
const W1000 = "1000w-psu";

const NV_5070 = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/";
const NV_5080 = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5080/";
const NV_5090 = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090/";
const AMD_9800 =
  "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9800x3d.html";
const SEASONIC = "https://seasonic.com/insights/gpu-power-spikes-explained/";
const CYBENETICS = "https://www.cybenetics.com/";
const CYB_DB = "https://www.cybenetics.com/index.php?option=psu-performance-database";
const HWB =
  "https://hwbusters.com/best_picks/best-atxv3-pcie5-ready-psus-picks-hardware-busters/";

const FOOTNOTE =
  "Minimum is based on a PC configured with a Ryzen 9 9950X processor. Recommend PCIe CEM 5.1 compliant PSU. Power requirements can be different depending on system configuration.";

const SHORT_ANSWER = `Choose an 850W power supply if NVIDIA lists 650 W required system power for the GeForce RTX 5070 or 750 W for the GeForce RTX 5070 Ti, on a PC configured with a Ryzen 9 9950X, and you would rather spend the money on a better-rated 850W unit, one you can look up in the Cybenetics PSU performance database, than on a higher wattage label. Choose a 1000W power supply if you expect a card NVIDIA lists at 1000 W required system power, such as the GeForce RTX 5090, or if you want a rating higher than the 850 W figure NVIDIA lists for the GeForce RTX 5080.`;

const CHOOSE_TABLE = [
  "Choose-if rows using NVIDIA required system power, opened 14 November 2026. No row is a ranked result.",
  "| Situation | Choose 850W if | Choose 1000W if |",
  "| --- | --- | --- |",
  "| GeForce RTX 5070 Ti | You are matching the 750 W required system power | You want a label higher than that 750 W figure for a later card |",
  "| GeForce RTX 5080 later | You are matching the 850 W required system power | You want a label higher than that 850 W figure |",
  "| GeForce RTX 5090 later | You are not matching the 1000 W required system power | You are matching the 1000 W required system power |",
  "| Ryzen 7 9800X3D | The CPU figure is the 120W default TDP and the graphics-card row is 650 W or 750 W | The CPU figure is still the 120W default TDP and the graphics-card row you expect is 1000 W |",
].join("\n");

const NUMBER_TABLE = [
  "NVIDIA specification tables opened 14 November 2026. Footnote 5 is the same sentence on the RTX 5070 family table, the RTX 5080 table, and the RTX 5090 table. No row is a measured wall draw.",
  "| Card | Total graphics power | Required system power | Supplementary power connectors |",
  "| --- | --- | --- | --- |",
  "| GeForce RTX 5070 | 250 W | 650 W | 2x PCIe 8-pin cables (adapter in box) OR 300 W or greater PCIe Gen 5 cable |",
  "| GeForce RTX 5070 Ti | 300 W | 750 W | 2x PCIe 8-pin cables (adapter in box) OR 300 W or greater PCIe Gen 5 cable |",
  "| GeForce RTX 5080 | 360 W | 850 W | 3x PCIe 8-pin cables (adapter in box) OR 1x 450 W or greater PCIe Gen 5 cable |",
  "| GeForce RTX 5090 | 575 W | 1000 W | 4x PCIe 8-pin cables (adapter in box) OR 1x 600 W PCIe Gen 5 cable |",
].join("\n");

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways.

- Choose 850W if you are matching NVIDIA's 650 W figure for the GeForce RTX 5070 or the 750 W figure for the GeForce RTX 5070 Ti, and you would rather spend the money on a better-rated 850W unit.
- Choose 1000W if you are matching NVIDIA's 1000 W figure for the GeForce RTX 5090, or if you want a rating higher than the 850 W figure for the GeForce RTX 5080.
- Footnote 5 says the minimum is based on a PC configured with a Ryzen 9 9950X processor, and it says: Recommend PCIe CEM 5.1 compliant PSU.
- AMD lists a default TDP of 120W for the Ryzen 7 9800X3D. 300 plus 120 is 420, and that sum is not a required system power.
- Seasonic's 8 September 2026 explainer gives an excursion ladder for some high-power PSUs, as a percentage of the PSU rating, and says a GPU does not necessarily spike to 200% of its own rating.
- Cybenetics names an efficiency program, ETA, and publishes a PSU performance database. No model name, price, or rank is copied from the Hardware Busters article dated 12 November 2026.

## Which wattage to choose

Choose 850W when the graphics card you are buying is one NVIDIA lists at 650 W or 750 W required system power and you would rather spend the money on a better-rated 850W unit. Choose 1000W when the card you expect is one NVIDIA lists at 1000 W required system power, or when you want a rating higher than the 850 W figure listed for the GeForce RTX 5080.

${CHOOSE_TABLE}

A better-rated 850W unit, in this choice, means a unit you can look up in the Cybenetics PSU performance database. It is not a rank assigned here, and it is not a price.

## NVIDIA required system power

NVIDIA lists 250 W total graphics power and 650 W required system power for the GeForce RTX 5070, and 300 W total graphics power and 750 W required system power for the GeForce RTX 5070 Ti. NVIDIA lists 360 W total graphics power and 850 W required system power for the GeForce RTX 5080, and 575 W total graphics power and 1000 W required system power for the GeForce RTX 5090.

${NUMBER_TABLE}

Footnote 5 on each of those three tables says: ${FOOTNOTE} The RTX 5070 and RTX 5070 Ti share one table, so that footnote covers both of those rows. The 850 W label matches the RTX 5080 required-system-power figure. The 1000 W label matches the RTX 5090 required-system-power figure. 850 minus 750 is 100, which is the gap between the 850 W label and the RTX 5070 Ti figure. 1000 minus 850 is 150, which is the gap between the 1000 W label and the RTX 5080 figure. Those two gaps are subtraction of published ratings. They are not a measured spare draw.

## Adding the two ratings is not a system total

AMD lists a default TDP of 120W for the Ryzen 7 9800X3D. NVIDIA lists 300 W total graphics power for the GeForce RTX 5070 Ti. 300 plus 120 is 420. That 420 adds those two published ratings and leaves out the motherboard, memory, storage, and fans. It is not NVIDIA's 750 W required system power for the RTX 5070 Ti, and the footnote PC for that 750 W figure is a Ryzen 9 9950X, which is a different processor. These documents do not give a required system power for a Ryzen 7 9800X3D paired with an RTX 5070 Ti.

The Ryzen 7 9800X3D specification lists Unlocked for Overclocking as Yes. The note beside that row says the product warranty does not cover damages caused by overclocking, even when overclocking is enabled via AMD hardware and/or software, and the note ends with GD-26. These documents do not give an extra wattage for an overclock. The supporting-chipset list names A620, X670E, X670, B650E, B650, X870E, X870, B840, and B850. B650 and B850 are both on that list. The chipset names do not change the wattage figures above.

## Transient loads on some high-power units

Seasonic's explainer dated 8 September 2026, written by Spike Chang, Manager of Product Design Department, says ATX 3.0 introduced PSU power excursion requirements that ATX 3.1 retained. For some high-power PSUs, Seasonic says those requirements include handling short-term loads of up to 200% of the PSU's rated output power for 100 microseconds, as well as 180% for 1 millisecond, 160% for 10 milliseconds, and 120% for 100 milliseconds, under specified test conditions. Seasonic says these values appear in both the ATX 3.0 and ATX 3.1 design guides. Seasonic says they describe PSU requirements and do not mean that a GPU necessarily spikes to 200% of its own rated power.

Seasonic defines power-supply headroom as the margin between the PSU's rated continuous output and the expected sustained power consumption of the whole system. These documents do not give that sustained total. Seasonic also says additional wattage margin is useful, but it does not by itself guarantee the PSU's ability to handle these load changes. The percentages are of the unit's own rating, so the same stated percentage is not a reason to treat 850W and 1000W as the same transient wattage, and it is not a measurement of either label. NVIDIA's footnote says: Recommend PCIe CEM 5.1 compliant PSU. That sentence is separate from the connector row. A PCIe Gen 5 cable on the connector row is not the same sentence as the PCIe CEM 5.1 footnote.

## Where to read a test result

Cybenetics Labs says it offers the ETA, LAMBDA, and DELTA efficiency, noise, and noise damping certifications, and it calls ETA its efficiency measurements program. The Cybenetics PSU performance database can be filtered by power, form factor, capacity, input voltage, and the ATX specification a unit complies with. Look up the unit you are buying there. No efficiency percent for a named unit is copied here.

Hardware Busters published a power-supply picks article dated 12 November 2026. No model name, price, or rank from that article is repeated here. No warranty length for a power supply is in these documents. Read the warranty sold with the unit. No street price is stated here.

## A later graphics card

Choose 1000W if the later card is the GeForce RTX 5090, because NVIDIA lists 1000 W required system power for that card, with 575 W total graphics power, on the same Ryzen 9 9950X footnote. Choose 850W if the later card is the GeForce RTX 5080 and you are matching the 850 W required system power, with 360 W total graphics power. Choose 850W for a GeForce RTX 5070 Ti you are building now if you are matching the 750 W figure and you would rather spend the money on a better-rated 850W unit.

RTX 5070 vs RTX 5070 Ti compares the 650 W card with the 750 W card. RTX 5070 vs RX 9070 XT is a separate graphics-card comparison, and no Radeon power figure is copied here. B650 vs B850 compares two chipsets that both appear on the Ryzen 7 9800X3D supporting-chipset list.`;

const FAQS = [
  {
    question: "Is 850W enough for an RTX 5070 Ti?",
    answer:
      "Choose 850W for a GeForce RTX 5070 Ti when you are matching NVIDIA's 750 W required system power. Footnote 5 says the minimum is based on a PC configured with a Ryzen 9 9950X processor, and that power requirements can be different depending on system configuration. 850 minus 750 is 100, which is the gap between those two ratings, not a measured spare draw. The same footnote says: Recommend PCIe CEM 5.1 compliant PSU.",
  },
  {
    question: "Do I need a 1000W PSU for a 9800X3D?",
    answer:
      "Choose 1000W for a graphics-card reason, not because of this processor. AMD lists a default TDP of 120W for the Ryzen 7 9800X3D. NVIDIA's required system power figures are the graphics-card rows, and the footnote PC is a Ryzen 9 9950X, which is a different processor. 300 plus 120 is 420, and that sum is not the 750 W required system power NVIDIA lists for the RTX 5070 Ti.",
  },
  {
    question: "Is it worth buying 1000W for future proofing?",
    answer:
      "Choose 1000W if the later card is one NVIDIA lists at 1000 W required system power, such as the GeForce RTX 5090. Choose 850W if the later card is the GeForce RTX 5080 and you are matching the 850 W required system power NVIDIA lists for that card. These documents do not give a wattage for an unnamed future card.",
  },
  {
    question: "Does a bigger PSU protect against power spikes?",
    answer:
      "Seasonic's 8 September 2026 explainer says ATX 3.0 introduced PSU power excursion requirements that ATX 3.1 retained. For some high-power PSUs, those requirements include up to 200% of the PSU's rated output power for 100 microseconds, 180% for 1 millisecond, 160% for 10 milliseconds, and 120% for 100 milliseconds, under specified test conditions. Seasonic says those values describe PSU requirements and do not mean that a GPU necessarily spikes to 200% of its own rated power, and that additional wattage margin does not by itself guarantee the unit can handle the load changes.",
  },
  {
    question: "What required system power does NVIDIA list for the RTX 5080 and RTX 5090?",
    answer:
      "NVIDIA lists 360 W total graphics power and 850 W required system power for the GeForce RTX 5080, and 575 W total graphics power and 1000 W required system power for the GeForce RTX 5090. Both footnotes say the minimum is based on a PC configured with a Ryzen 9 9950X processor. Both say: Recommend PCIe CEM 5.1 compliant PSU. The RTX 5080 connector row is 3x PCIe 8-pin cables (adapter in box) OR 1x 450 W or greater PCIe Gen 5 cable. The RTX 5090 connector row is 4x PCIe 8-pin cables (adapter in box) OR 1x 600 W PCIe Gen 5 cable.",
  },
  {
    question: "How do I add a 5070 Ti and a 9800X3D without treating the sum as the PSU size?",
    answer:
      "Use the two published ratings as a method, then stop. NVIDIA lists 300 W total graphics power for the RTX 5070 Ti, and AMD lists a 120W default TDP for the Ryzen 7 9800X3D. 300 plus 120 is 420. That sum leaves out the rest of the PC. The graphics-card guidance to match is NVIDIA's 750 W required system power, on a Ryzen 9 9950X footnote, which can differ with the system configuration.",
  },
];

const VERDICT = `Choose an 850W power supply if you are matching NVIDIA's 650 W or 750 W required system power and you would rather spend the money on a better-rated 850W unit you can look up in the Cybenetics PSU performance database. Choose a 1000W power supply if you are matching NVIDIA's 1000 W required system power for the GeForce RTX 5090, or if you want a rating higher than the 850 W figure listed for the GeForce RTX 5080.

Footnote 5 bases those minimums on a PC configured with a Ryzen 9 9950X and says: Recommend PCIe CEM 5.1 compliant PSU. AMD lists a 120W default TDP for the Ryzen 7 9800X3D. 300 plus 120 is 420, and that sum is not a required system power.`;

const META =
  "Choose 850W if NVIDIA lists 650 W or 750 W for your GPU. Choose 1000W if you expect a card NVIDIA lists at 1000 W, such as the RTX 5090.";

const BUILT = buildEditorialComparison({
  slug: "850w-vs-1000w-psu",
  title: "850W vs 1000W PSU?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: W850,
      slug: W850,
      name: "850W PSU",
      shortDesc:
        "An 850 W label. It matches the GeForce RTX 5080 required system power and sits 100 W over the RTX 5070 Ti figure, by subtraction of those ratings.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [],
      cons: [],
      bestFor: null,
    },
    {
      id: W1000,
      slug: W1000,
      name: "1000W PSU",
      shortDesc:
        "A 1000 W label. It matches the GeForce RTX 5090 required system power NVIDIA lists, on the same Ryzen 9 9950X footnote.",
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
      label: "Wattage label",
      entityAValue: "850 W",
      entityBValue: "1000 W",
      winner: "tie",
    },
    {
      label: "GeForce RTX 5070 Ti",
      entityAValue: "750 W required system power is under the 850 W label. Total graphics power is 300 W",
      entityBValue: "750 W required system power is also under the 1000 W label. Total graphics power is 300 W",
      winner: "tie",
    },
    {
      label: "GeForce RTX 5080",
      entityAValue: "850 W required system power matches the 850 W label. Total graphics power is 360 W",
      entityBValue: "850 W required system power is under the 1000 W label. Total graphics power is 360 W",
      winner: "tie",
    },
    {
      label: "GeForce RTX 5090",
      entityAValue: "1000 W required system power is over the 850 W label. Total graphics power is 575 W",
      entityBValue: "1000 W required system power matches the 1000 W label. Total graphics power is 575 W",
      winner: "tie",
    },
    {
      label: "Ryzen 7 9800X3D",
      entityAValue: "AMD default TDP 120W. The processor does not pick the label",
      entityBValue: "AMD default TDP 120W. The processor does not pick the label",
      winner: "tie",
    },
    {
      label: "Footnote 5",
      entityAValue: "Ryzen 9 9950X PC. Recommend PCIe CEM 5.1 compliant PSU",
      entityBValue: "Ryzen 9 9950X PC. Recommend PCIe CEM 5.1 compliant PSU",
      winner: "tie",
    },
    {
      label: "Excursion ladder, Seasonic 8 September 2026",
      entityAValue:
        "For some high-power PSUs, up to 200% of that unit's rated output for 100 microseconds, then 180%, 160%, and 120%",
      entityBValue:
        "For some high-power PSUs, up to 200% of that unit's rated output for 100 microseconds, then 180%, 160%, and 120%",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "label",
      "Wattage label",
      "Power",
      W850,
      W1000,
      "850 W",
      "1000 W",
    ),
    textAttr(
      "5070ti",
      "GeForce RTX 5070 Ti required system power",
      "NVIDIA",
      W850,
      W1000,
      "750 W, with 300 W total graphics power. 850 minus 750 is 100",
      "750 W, with 300 W total graphics power. The 1000 W label is higher than 750 W",
    ),
    textAttr(
      "5080",
      "GeForce RTX 5080 required system power",
      "NVIDIA",
      W850,
      W1000,
      "850 W, with 360 W total graphics power. The label matches that figure",
      "850 W, with 360 W total graphics power. 1000 minus 850 is 150",
    ),
    textAttr(
      "5090",
      "GeForce RTX 5090 required system power",
      "NVIDIA",
      W850,
      W1000,
      "1000 W, with 575 W total graphics power. The 850 W label is under that figure",
      "1000 W, with 575 W total graphics power. The label matches that figure",
    ),
    textAttr(
      "cpu",
      "Ryzen 7 9800X3D default TDP",
      "AMD",
      W850,
      W1000,
      "120W. 300 plus 120 is 420, and 420 is not a required system power",
      "120W. The same 120W figure. It does not pick 1000 W",
    ),
    textAttr(
      "footnote",
      "NVIDIA footnote 5",
      "NVIDIA",
      W850,
      W1000,
      FOOTNOTE,
      FOOTNOTE,
    ),
    textAttr(
      "excursion",
      "ATX 3.0 and 3.1 excursion, for some high-power PSUs",
      "Seasonic",
      W850,
      W1000,
      "Up to 200% of the unit's rated output for 100 microseconds, 180% for 1 millisecond, 160% for 10 milliseconds, and 120% for 100 milliseconds, under specified test conditions",
      "The same stated percentages of the 1000 W rating, under the same Seasonic qualifiers. Not a measured transient",
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "rtx-5070-vs-rtx-5070-ti",
      title: "RTX 5070 vs RTX 5070 Ti",
      category: "technology",
    },
    {
      slug: "rtx-5070-vs-rx-9070-xt",
      title: "RTX 5070 vs RX 9070 XT",
      category: "technology",
    },
    {
      slug: "b650-vs-b850",
      title: "B650 vs B850",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: null,
    keyFact:
      "NVIDIA lists 750 W required system power for the GeForce RTX 5070 Ti and 1000 W for the GeForce RTX 5090. Both footnotes use a Ryzen 9 9950X PC.",
  },
  citationStats: {
    sourceCount: 8,
    dataPointCount: 0,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "NVIDIA GeForce RTX 5070 family specifications", url: NV_5070 },
      { name: "NVIDIA GeForce RTX 5080 specifications", url: NV_5080 },
      { name: "NVIDIA GeForce RTX 5090 specifications", url: NV_5090 },
      { name: "AMD Ryzen 7 9800X3D specifications", url: AMD_9800 },
      { name: "Seasonic: GPU power spikes explained (8 September 2026)", url: SEASONIC },
      { name: "Cybenetics Labs", url: CYBENETICS },
      { name: "Cybenetics PSU performance database", url: CYB_DB },
      { name: "Hardware Busters power-supply picks (12 November 2026)", url: HWB },
    ],
  },
  resources: [
    {
      type: "external",
      label: "NVIDIA GeForce RTX 5070 family specifications",
      url: NV_5070,
      description:
        "RTX 5070 Ti column: 300 W total graphics power, 750 W required system power. RTX 5070 column: 250 W and 650 W. Both connector rows: 2x PCIe 8-pin cables (adapter in box) OR 300 W or greater PCIe Gen 5 cable. Footnote 5: a Ryzen 9 9950X PC, recommend a PCIe CEM 5.1 compliant PSU, and power requirements can differ with the configuration.",
    },
    {
      type: "external",
      label: "NVIDIA GeForce RTX 5080 specifications",
      url: NV_5080,
      description:
        "360 W total graphics power. 850 W required system power. 3x PCIe 8-pin cables (adapter in box) OR 1x 450 W or greater PCIe Gen 5 cable. The same footnote 5.",
    },
    {
      type: "external",
      label: "NVIDIA GeForce RTX 5090 specifications",
      url: NV_5090,
      description:
        "575 W total graphics power. 1000 W required system power. 4x PCIe 8-pin cables (adapter in box) OR 1x 600 W PCIe Gen 5 cable. The same footnote 5.",
    },
    {
      type: "external",
      label: "AMD Ryzen 7 9800X3D specifications",
      url: AMD_9800,
      description:
        "Default TDP 120W. Unlocked for Overclocking: Yes. The note says the product warranty does not cover damages caused by overclocking, even when overclocking is enabled via AMD hardware and/or software. GD-26. Supporting chipsets include B650 and B850.",
    },
    {
      type: "external",
      label: "Seasonic: GPU power spikes explained (8 September 2026)",
      url: SEASONIC,
      description:
        "8 September 2026. Spike Chang, Manager of Product Design Department. For some high-power PSUs: up to 200% of rated output for 100 microseconds, 180% for 1 millisecond, 160% for 10 milliseconds, and 120% for 100 milliseconds, under specified test conditions. The ladder is a PSU requirement. Additional wattage margin does not by itself guarantee transient handling.",
    },
    {
      type: "external",
      label: "Cybenetics Labs",
      url: CYBENETICS,
      description:
        "Offers the ETA, LAMBDA, and DELTA efficiency, noise, and noise damping certifications. ETA is the name of the efficiency measurements program.",
    },
    {
      type: "external",
      label: "Cybenetics PSU performance database",
      url: CYB_DB,
      description:
        "Filters include power, form factor, capacity, input voltage, and the ATX specification a unit complies with. No named-unit efficiency figure is copied here.",
    },
    {
      type: "external",
      label: "Hardware Busters power-supply picks (12 November 2026)",
      url: HWB,
      description:
        "A power-supply picks article dated 12 November 2026. No model name, price, or rank from it is repeated here.",
    },
    {
      type: "blog",
      label: "RTX 5070 vs RTX 5070 Ti",
      url: "/compare/rtx-5070-vs-rtx-5070-ti",
      description: "The 650 W card and the 750 W card. A separate graphics-card comparison.",
    },
    {
      type: "blog",
      label: "RTX 5070 vs RX 9070 XT",
      url: "/compare/rtx-5070-vs-rx-9070-xt",
      description: "A separate graphics-card comparison. No Radeon power figure is copied here.",
    },
    {
      type: "blog",
      label: "B650 vs B850",
      url: "/compare/b650-vs-b850",
      description: "Two chipsets that both appear on the Ryzen 7 9800X3D supporting-chipset list.",
    },
  ],
  metaTitle: "850W vs 1000W PSU?",
});

BUILT.metadata.metaDescription = META;

export const PSU_850W_VS_1000W: EditorialComparison = BUILT;
