import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-438 — RTX 5070 vs RTX 5060 Ti, including the 8 GB and 16 GB configs.
 * Sources opened 15 November 2026 (Asia/Jerusalem):
 * NVIDIA GeForce RTX 5070 family specifications;
 * NVIDIA GeForce RTX 5060 family specifications;
 * NVIDIA GeForce RTX 3060 family specifications;
 * Digital Foundry, RTX 5060 Ti 16GB review, 16 April 2025;
 * Tom's Hardware, RTX 5070 vs RTX 5060 Ti 16GB, 21 April 2025;
 * XDA Developers, RTX 5060 Ti vs RTX 5070, 25 April 2025.
 *
 * No prices. winnerName stays null. Every key difference is a tie.
 * dataPointCount stays 0: the one-third CUDA gap is arithmetic on NVIDIA's
 * core counts, and the review percents are those articles' own labels.
 * The RTX 5070 family specification table has no memory-bandwidth row, so
 * 672 GB/s stays a Digital Foundry and Tom's Hardware cell. NVIDIA lists
 * 600 W required system power for the RTX 5060 Ti. Digital Foundry's spec
 * table puts 450 W in a PSU Recommendation cell. isHumanReviewed stays false.
 */

const A = "rtx-5070";
const B = "rtx-5060-ti";

const NV_5070 = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/";
const NV_5060 = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5060-family/";
const NV_3060 = "https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3060-3060ti/";
const DF =
  "https://www.digitalfoundry.net/articles/digitalfoundry-2025-nvidia-geforce-rtx-5060-ti-16gb-review";
const TOMS = "https://www.tomshardware.com/pc-components/gpus/rtx-5070-vs-rtx-5060-ti-16gb";
const XDA =
  "https://www.xda-developers.com/i-tested-the-rtx-5060-ti-against-the-rtx-5070-and-its-a-disaster/";

const SOURCE_DATE = "2026-11-15";
const PUBLISHED = "2026-11-15T00:00:00Z";
const SPEC = "Specs";

const FOOTNOTE =
  "Minimum is based on a PC configured with a Ryzen 9 9950X processor. Recommend PCIe CEM 5.1 compliant PSU. Power requirements can be different depending on system configuration.";

const SHORT_ANSWER =
  'Choose the GeForce RTX 5070 if you want the 12 GB GDDR7 card NVIDIA lists, with 6,144 CUDA cores, 250 W total graphics power, and 650 W required system power. Choose the GeForce RTX 5060 Ti 16 GB config if you want 16 GB of GDDR7, with 4,608 CUDA cores, 180 W total graphics power, and 600 W required system power, and treat the 8 GB config with caution because Digital Foundry\'s 16 April 2025 review says "don\'t consider buying the 8GB model."';

const VERDICT = `Choose the RTX 5070 if you want 6,144 CUDA cores, 12 GB of GDDR7, 250 W total graphics power, and 650 W required system power.

Choose the RTX 5060 Ti 16 GB config if you want 16 GB of GDDR7, 4,608 CUDA cores, 180 W total graphics power, and 600 W required system power.

For the 8 GB config, Digital Foundry's 16 April 2025 review says not to consider buying the 8GB model. Neither card is right for everyone.`;

const CHOOSE_TABLE = [
  "Choose-if rows opened 15 November 2026. No row is a ranked result.",
  "| Situation | Choose the RTX 5070 if | Choose the RTX 5060 Ti if |",
  "| --- | --- | --- |",
  "| 1440p in Tom's 21-game suite | You want the card Tom's Hardware put 31 percent ahead overall at 1440p | You want the 16 GB config and accept that gap in that suite |",
  "| More than 12 GB of graphics memory | You do not need more than the 12 GB NVIDIA lists | You want the 16 GB GDDR7 config |",
  "| 8 GB config | You would pass on the 8 GB config | Digital Foundry says not to consider buying the 8GB model |",
  "| Power supply | The PC meets 650 W required system power | The PC meets 600 W required system power |",
  "| Price, with no number stated here | The 16 GB card costs close to the RTX 5070 and 12 GB is enough | The work needs more than 12 GB of graphics memory |",
].join("\n");

const SPEC_TABLE = [
  "NVIDIA specification tables opened 15 November 2026. The 448 GB/sec cell is the RTX 5060 family comparison table. The RTX 5070 family specification table has no memory-bandwidth row.",
  "| Row | GeForce RTX 5070 | GeForce RTX 5060 Ti |",
  "| --- | --- | --- |",
  "| CUDA cores | 6,144 | 4,608 |",
  "| Standard memory config | 12 GB GDDR7 | 16 GB / 8 GB GDDR7 |",
  "| Memory interface width | 192-bit | 128-bit |",
  "| Memory bandwidth | No bandwidth row on this family specification table | 448 GB/sec on the family comparison table |",
  "| Boost clock | 2.51 GHz | 2.57 GHz |",
  "| Base clock | 2.33 GHz | 2.41 GHz |",
  "| Tensor cores | 5th generation, 988 AI TOPS | 5th generation, 759 AI TOPS |",
  "| Ray tracing cores | 4th generation, 94 TFLOPS | 4th generation, 72 TFLOPS |",
  "| Total graphics power | 250 W | 180 W |",
  "| Required system power | 650 W, Ryzen 9 9950X footnote | 600 W, Ryzen 9 9950X footnote |",
  "| Supplementary power connectors | 2x PCIe 8-pin cables (adapter in box) OR 300 W or greater PCIe Gen 5 cable | 1x PCIe 8-pin cables OR 300 W or greater PCIe Gen 5 cable (adapter in box) |",
].join("\n");

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways.

- Choose the RTX 5070 if you want 6,144 CUDA cores, 12 GB of GDDR7, 250 W total graphics power, and 650 W required system power.
- Choose the RTX 5060 Ti 16 GB config if you want 16 GB of GDDR7, 4,608 CUDA cores, 180 W total graphics power, and 600 W required system power.
- Digital Foundry's 16 April 2025 review says not to consider buying the 8GB model.
- 6,144 minus 4,608 is 1,536, and 1,536 / 4,608 = 1/3.
- Tom's Hardware, on 21 April 2025, says the RTX 5070 leads by 31 percent overall at 1440p and by 32 percent on average at 4K, in a geometric mean of 21 games.
- NVIDIA's RTX 5070 family specification table has no memory-bandwidth row. The RTX 5060 family comparison table has 448 GB/sec for the RTX 5060 Ti.

## Which card to choose

Choose the RTX 5070 if you want the 12 GB GDDR7 configuration and the 6,144 CUDA cores. Choose the RTX 5060 Ti 16 GB config if you want 16 GB of GDDR7. For the 8 GB config, use Digital Foundry's 16 April 2025 sentence: don't consider buying the 8GB model. Neither card is right for everyone.

${CHOOSE_TABLE}

These documents do not state a current store price. If the 16 GB card costs close to the RTX 5070, weigh the CUDA-core gap and whether the work needs more than 12 GB. Check the current price before you buy.

## What NVIDIA lists

NVIDIA lists 6,144 CUDA cores, 12 GB of GDDR7, and a 192-bit memory interface for the RTX 5070. NVIDIA lists 4,608 CUDA cores, 16 GB / 8 GB of GDDR7, and a 128-bit memory interface for the RTX 5060 Ti. Boost clock is 2.51 GHz on the RTX 5070 and 2.57 GHz on the RTX 5060 Ti. Base clock is 2.33 GHz and 2.41 GHz. The card with fewer CUDA cores has the higher boost clock in the table. A higher boost clock is not, by itself, a frame-rate result.

${SPEC_TABLE}

Footnote 5 on both family tables says: ${FOOTNOTE} Total graphics power is 250 W on the RTX 5070 and 180 W on the RTX 5060 Ti. Required system power is 650 W and 600 W. Both cards are Blackwell, with 5th-generation Tensor cores and 4th-generation ray tracing cores. The RTX 5070 row is 988 AI TOPS and 94 TFLOPS. The RTX 5060 Ti row is 759 AI TOPS and 72 TFLOPS.

NVIDIA's RTX 5060 family specs comparison table has a memory-bandwidth cell of 448 GB/sec for the RTX 5060 Ti, and the same 448 GB/sec cell for the RTX 5060. NVIDIA's RTX 5070 family specification table has no memory-bandwidth row, so no bandwidth ratio is computed from an NVIDIA pair. Digital Foundry's spec table puts 672GB/s in the RTX 5070 bandwidth cell and 448GB/s in the RTX 5060 Ti cell, and the introduction calls that a straight 50 percent increase. Tom's Hardware's spec table uses 672 GB/s and 448 GB/s and says the RTX 5070 has 50 percent more memory bandwidth. Those review cells stay with Digital Foundry and Tom's Hardware.

The specification table labels NVIDIA DLSS as DLSS 4 on both cards, with Super Resolution, DLAA, Ray Reconstruction, Frame Generation, and Multi Frame Generation. The family marketing copy says DLSS 5 introduces 3D-Guided Neural Rendering on GeForce RTX 50 Series GPUs. Both labels are repeated here. Each card has one ninth-generation NVENC, one sixth-generation NVDEC, and AV1 encode. NVIDIA lists the RTX 5070 reference card at 242 mm long, 112 mm wide, and two slots. RTX 5060 Ti length, width, and slot count vary by manufacturer. Maximum GPU temperature in the tables is 85 C for the RTX 5070 and 87 C for the RTX 5060 Ti. Graphics card specifications may vary by add-in-card manufacturer.

NVIDIA's RTX 5060 family shop section says Available April 16 for the GeForce RTX 5060 Ti. Digital Foundry's spec table gives a release date of March 5th for the RTX 5070 and April 16th for the RTX 5060 Ti. The price cells in those review tables are not repeated here.

## The CUDA-core gap

NVIDIA lists 6,144 CUDA cores on the RTX 5070 and 4,608 CUDA cores on the RTX 5060 Ti. 6,144 minus 4,608 is 1,536. 1,536 / 4,608 = 1/3. Digital Foundry's introduction calls that core-count gap a 33 per cent increase, which is that one-third gap rounded to a whole percent.

## Memory, the 8 GB config, and the 16 GB config

The RTX 5060 Ti standard memory config is 16 GB / 8 GB of GDDR7 on one 128-bit interface. The RTX 5070 standard memory config is 12 GB of GDDR7 on a 192-bit interface. 16 GB is more than 12 GB. 8 GB is less than 12 GB. More memory does not by itself make a card produce a higher frame rate.

Digital Foundry's 16 April 2025 review says: don't consider buying the 8GB model. The same introduction says reporting has made it increasingly clear that 8GB isn't sufficient for anything other than the most entry-level cards. That is Digital Foundry's judgment in that review. XDA's 25 April 2025 test says that at 4K, Horizon Zero Dawn Remastered and Forza Motorsport can saturate an 8GB frame buffer. That sentence is about 4K. It is not a 1440p measurement. XDA also says that, based on that test, 12 GB was enough to push to 4K. That is XDA's judgment, not a result from Tom's Hardware.

Tom's Hardware's 21 April 2025 comparison says 12 GB remained sufficient in all games in its suite at 1440p, and in all but one game at 4K. The tested RTX 5060 Ti in that article is the 16 GB model, a PNY OC card, not the 8 GB config. These documents do not name a graphics-memory cutoff for architecture work or local AI. Choose the 16 GB config if the project needs more than 12 GB. Choose the RTX 5070 if 12 GB is enough and you want the 6,144 CUDA cores.

Digital Foundry reviewed a Palit Infinity 3 RTX 5060 Ti 16GB. Digital Foundry says the RTX 5060 Ti typically draws between 150 and 170 W during play, in that card section, and says the sample's PCIe x16 slot is electrically x8, so a PCIe 4.0 board or a newer bus is what that review recommends for that sample. NVIDIA's specification table marks PCI Express Gen 5 as Yes and does not give a lane count.

## Power supply figures

Choose a power supply against the required-system-power row, not against a single wattage slogan. NVIDIA lists 250 W total graphics power and 650 W required system power for the RTX 5070, and 180 W and 600 W for the RTX 5060 Ti. Footnote 5 says: ${FOOTNOTE}

Digital Foundry's spec table puts 450 W in the PSU Recommendation cell for the RTX 5060 Ti. NVIDIA's label for that card is 600 W required system power. The connector row is separate from the footnote. The RTX 5070 row is two PCIe 8-pin cables, with an adapter in the box, or one 300 W or greater PCIe Gen 5 cable. The RTX 5060 Ti row is one PCIe 8-pin cable or one 300 W or greater PCIe Gen 5 cable, with an adapter in the box.

## What Tom's Hardware measured

Tom's Hardware's 21 April 2025 article uses a geometric mean of 21 games, with equal weighting: 15 rasterization benchmarks and six ray tracing benchmarks. The RTX 5070 in that test is a Founders Edition. The RTX 5060 Ti is a PNY 16GB OC card. At 4K, Tom's Hardware says the RTX 5070 leads by 32 percent on average, with a range of -5 percent in Indiana Jones and the Great Circle to +43 percent in A Plague Tale: Requiem. At 1440p, Tom's Hardware says the lead is 31 percent overall, with no performance deficits. At 1080p, Tom's Hardware says the gap is 28 percent at ultra settings and 24 percent at medium settings. The negative 4K figure is the game in that range where the RTX 5070 is behind.

The same article's content-creation table labels a Blender overall geomean of 2004.9 for the RTX 5070 and 1387.7 for the RTX 5060 Ti 16GB, at plus 44.5 percent. The scene rows are Monster 2996.2 and 2086.9 (plus 43.6 percent), Junkshop 1695.8 and 1132.6 (plus 49.7 percent), and Classroom 1586.1 and 1130.6 (plus 40.3 percent). The paragraph calls the RTX 5070 45 percent faster in the Blender benchmarks, which is that plus 44.5 percent geomean rounded to a whole number.

SPEC Workstation 4.0 viewport rows in that table are not a measurement of a named architecture file. SolidWorks is 455.9 and 331.3 (plus 37.6 percent). Maya is 443.5 and 412.1 (plus 7.6 percent). 3ds Max is 208.3 and 157.0 (plus 32.7 percent). Catia is 93.9 and 72.5 (plus 29.4 percent). Creo is 129.6 and 132.6 (minus 2.3 percent), so the RTX 5060 Ti 16GB score is the higher one in that row. The GPU Handbrake row is 239.9 and 232.6 (plus 3.1 percent). Tom's Hardware says the fixed-function encode and decode hardware is the same, which matches the one ninth-generation NVENC on each NVIDIA row.

## Moving up from an RTX 3060 12 GB config

NVIDIA lists the RTX 3060 standard memory config as 12 GB GDDR6 / 8 GB GDDR6, and the memory interface width as 192-bit / 128-bit. The 12 GB figure is the config in this upgrade note. The RTX 5060 Ti 8 GB config is a smaller capacity than that 12 GB config (8 GB vs 12 GB). The RTX 5070 matches that 12 GB capacity and uses GDDR7. The RTX 5060 Ti 16 GB config is 16 GB. These NVIDIA tables do not give a frame rate for the swap.

NVIDIA lists graphics card power of 170 W and required system power of 550 W for the RTX 3060. Footnote 4 says: Requirement is made based on PC configured with an Intel Core i9-10900K processor. That footnote CPU is not the Ryzen 9 9950X used for the RTX 5070 and RTX 5060 Ti. A lower power rating may work depending on system configuration, which is the rest of that footnote.

## If the 16 GB card costs about the same

No current store price is stated here. Choose the RTX 5070 if the 16 GB card costs close to it and you do not need more than 12 GB. Choose the RTX 5060 Ti 16 GB config if the work needs more than 12 GB. If the 8 GB card is the lower-priced one on the shelf, Digital Foundry's review still says not to consider buying the 8GB model. Check the current price.

## Related comparisons

RTX 5070 vs RTX 5070 Ti compares the 12 GB card with the 16 GB Ti. RTX 5070 vs RX 9070 XT is the Radeon comparison for the RTX 5070, and no Radeon specification is copied here. RX 9060 XT vs RTX 5060 Ti is the Radeon comparison for the RTX 5060 Ti. 850W vs 1000W compares power-supply labels with NVIDIA required system power, including the 650 W figure for the RTX 5070.`;

const FAQS = [
  {
    question: "When should I choose the RTX 5070 over the RTX 5060 Ti?",
    answer:
      "Choose the RTX 5070 if you want 6,144 CUDA cores, 12 GB of GDDR7 on a 192-bit interface, 250 W total graphics power, and 650 W required system power. Tom's Hardware, on 21 April 2025, says that card leads the RTX 5060 Ti 16GB by 31 percent overall at 1440p and by 32 percent on average at 4K, in a geometric mean of 21 games with equal weighting. The tested RTX 5060 Ti was a PNY 16GB OC card, and the RTX 5070 was a Founders Edition.",
  },
  {
    question: "Is the RTX 5060 Ti 8GB enough for 1440p?",
    answer:
      'Digital Foundry\'s 16 April 2025 review says "don\'t consider buying the 8GB model." NVIDIA lists that config as 8 GB of GDDR7 on a 128-bit interface, with 448 GB/sec of memory bandwidth, the same bandwidth cell as the 16 GB config. XDA\'s 25 April 2025 test says that at 4K, Horizon Zero Dawn Remastered and Forza Motorsport can saturate an 8GB frame buffer. That sentence is about 4K, not a 1440p measurement.',
  },
  {
    question: "Should I get the RTX 5060 Ti 16GB or the RTX 5070?",
    answer:
      "Choose the RTX 5060 Ti 16 GB config if you need more than 12 GB of graphics memory. NVIDIA lists 16 GB of GDDR7 for that config and 12 GB of GDDR7 for the RTX 5070. Choose the RTX 5070 if 12 GB is enough and you want 6,144 CUDA cores rather than 4,608. Tom's Hardware says 12 GB remained sufficient at 1440p in every game in that 21-game suite, and in all but one game at 4K. The 16 GB card in that suite was a PNY OC card.",
  },
  {
    question: "What power supply do the RTX 5070 and RTX 5060 Ti need?",
    answer:
      "NVIDIA lists 250 W total graphics power and 650 W required system power for the RTX 5070, and 180 W and 600 W for the RTX 5060 Ti. Footnote 5 says the minimum is based on a PC configured with a Ryzen 9 9950X processor, recommends a PCIe CEM 5.1 compliant power supply, and says power requirements can be different depending on system configuration. Digital Foundry's spec table puts 450 W in the PSU Recommendation cell for the RTX 5060 Ti. NVIDIA's label for that card is 600 W required system power. 850W vs 1000W compares supply labels with the 650 W figure.",
  },
  {
    question: "I have an RTX 3060 12GB. Is the 8GB config smaller?",
    answer:
      "NVIDIA lists a 12 GB GDDR6 config on the RTX 3060 and an 8 GB GDDR7 config on the RTX 5060 Ti. The 8 GB config is a smaller capacity (8 GB vs 12 GB). The RTX 5070 matches that 12 GB capacity and uses GDDR7. The RTX 5060 Ti 16 GB config is 16 GB. These NVIDIA tables do not give a frame rate for the swap. The RTX 3060 required system power is 550 W on a Core i9-10900K footnote, which is a different footnote CPU from the Ryzen 9 9950X used for the newer cards.",
  },
  {
    question: "What if the 16GB card costs about the same as the RTX 5070?",
    answer:
      "Choose the RTX 5070 if the 16 GB card costs close to it and you do not need more than 12 GB of graphics memory. Choose the RTX 5060 Ti 16 GB config if the work needs more than 12 GB. These documents do not state a current store price. Check the current price. The 8 GB config is the one Digital Foundry says not to consider buying.",
  },
];

const BUILT = buildEditorialComparison({
  slug: "rtx-5070-vs-rtx-5060-ti",
  title: "RTX 5070 vs RTX 5060 Ti",
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
      name: "RTX 5060 Ti",
      shortDesc: "Blackwell card with 16 GB or 8 GB of GDDR7, 4,608 CUDA cores, and 180 W total graphics power.",
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
      entityBValue: "16 GB / 8 GB GDDR7, 128-bit",
      winner: "tie",
    },
    {
      label: "CUDA cores",
      entityAValue: "6,144",
      entityBValue: "4,608",
      winner: "tie",
    },
    {
      label: "Memory bandwidth",
      entityAValue: "No NVIDIA bandwidth row. Digital Foundry and Tom's Hardware cells: 672 GB/s",
      entityBValue: "448 GB/sec (NVIDIA). Digital Foundry and Tom's Hardware cells: 448 GB/s",
      winner: "tie",
    },
    {
      label: "Total graphics power",
      entityAValue: "250 W",
      entityBValue: "180 W",
      winner: "tie",
    },
    {
      label: "Required system power",
      entityAValue: "650 W, Ryzen 9 9950X footnote",
      entityBValue: "600 W, Ryzen 9 9950X footnote",
      winner: "tie",
    },
    {
      label: "Tom's 1440p overall",
      entityAValue: "31 percent ahead in the 21-game geometric mean (21 April 2025)",
      entityBValue: "PNY 16GB OC card, the baseline of that 1440p figure",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("arch", "Architecture", SPEC, A, B, "Blackwell (NVIDIA)", "Blackwell (NVIDIA)"),
    textAttr("cuda", "CUDA cores", SPEC, A, B, "6,144 (NVIDIA)", "4,608 (NVIDIA)"),
    textAttr("memory", "Memory", SPEC, A, B, "12 GB GDDR7 (NVIDIA)", "16 GB / 8 GB GDDR7 (NVIDIA)"),
    textAttr("bus", "Memory interface", SPEC, A, B, "192-bit (NVIDIA)", "128-bit (NVIDIA)"),
    textAttr(
      "bandwidth",
      "Memory bandwidth",
      SPEC,
      A,
      B,
      "No row on the RTX 5070 family specification table. Digital Foundry and Tom's Hardware cells: 672 GB/s",
      "448 GB/sec (NVIDIA RTX 5060 family comparison table)",
    ),
    textAttr(
      "clocks",
      "Clocks",
      SPEC,
      A,
      B,
      "Base 2.33 GHz. Boost 2.51 GHz (NVIDIA)",
      "Base 2.41 GHz. Boost 2.57 GHz (NVIDIA)",
    ),
    textAttr(
      "tensor",
      "Tensor cores and AI TOPS",
      SPEC,
      A,
      B,
      "5th generation, 988 AI TOPS (NVIDIA)",
      "5th generation, 759 AI TOPS (NVIDIA)",
    ),
    textAttr(
      "rt",
      "RT cores",
      SPEC,
      A,
      B,
      "4th generation, 94 TFLOPS (NVIDIA)",
      "4th generation, 72 TFLOPS (NVIDIA)",
    ),
    textAttr("power", "Total graphics power", SPEC, A, B, "250 W (NVIDIA)", "180 W (NVIDIA)"),
    textAttr(
      "psu",
      "Required system power",
      SPEC,
      A,
      B,
      "650 W, based on a Ryzen 9 9950X PC (NVIDIA footnote 5)",
      "600 W, based on a Ryzen 9 9950X PC (NVIDIA footnote 5)",
    ),
    textAttr(
      "connector",
      "Power connector",
      SPEC,
      A,
      B,
      "2x PCIe 8-pin cables (adapter in box) or one 300 W or greater PCIe Gen 5 cable (NVIDIA)",
      "1x PCIe 8-pin cable or one 300 W or greater PCIe Gen 5 cable, adapter in box (NVIDIA)",
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
      "1x ninth-generation NVENC. AV1 encode (NVIDIA)",
      "1x ninth-generation NVENC. AV1 encode (NVIDIA)",
    ),
    textAttr(
      "toms1440",
      "Tom's Hardware 1440p overall",
      SPEC,
      A,
      B,
      "31 percent ahead. Geometric mean of 21 games (Tom's Hardware, 21 April 2025). Founders Edition",
      "Baseline of that figure. PNY 16GB OC card (Tom's Hardware, 21 April 2025)",
    ),
    textAttr(
      "toms4k",
      "Tom's Hardware 4K average",
      SPEC,
      A,
      B,
      "32 percent on average, from -5 percent in Indiana Jones to +43 percent in A Plague Tale: Requiem (21 April 2025)",
      "16 GB PNY OC card, the baseline of that 4K average (21 April 2025)",
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "rtx-5070-vs-rtx-5070-ti", title: "RTX 5070 vs RTX 5070 Ti", category: "technology" },
    { slug: "rtx-5070-vs-rx-9070-xt", title: "RTX 5070 vs RX 9070 XT", category: "technology" },
    { slug: "rx-9060-xt-vs-rtx-5060-ti", title: "RX 9060 XT vs RTX 5060 Ti", category: "technology" },
    { slug: "850w-vs-1000w-psu", title: "850W vs 1000W PSU?", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: null,
    keyFact:
      "NVIDIA lists 6,144 CUDA cores and 12 GB GDDR7 on the RTX 5070, and 4,608 CUDA cores with 16 GB or 8 GB of GDDR7 on the RTX 5060 Ti. Required system power is 650 W and 600 W.",
  },
  citationStats: {
    sourceCount: 6,
    dataPointCount: 0,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "NVIDIA GeForce RTX 5070 family specifications", url: NV_5070 },
      { name: "NVIDIA GeForce RTX 5060 family specifications", url: NV_5060 },
      { name: "NVIDIA GeForce RTX 3060 family specifications", url: NV_3060 },
      { name: "Digital Foundry: RTX 5060 Ti 16GB review (16 April 2025)", url: DF },
      { name: "Tom's Hardware: RTX 5070 vs RTX 5060 Ti 16GB (21 April 2025)", url: TOMS },
      { name: "XDA Developers: RTX 5060 Ti vs RTX 5070 (25 April 2025)", url: XDA },
    ],
  },
  resources: [
    {
      type: "external",
      label: "NVIDIA GeForce RTX 5070 family specifications",
      url: NV_5070,
      description:
        "Opened 15 November 2026. RTX 5070: 6,144 CUDA cores, 12 GB GDDR7, 192-bit, boost 2.51 GHz, base 2.33 GHz, 988 AI TOPS, 94 TFLOPS, 250 W total graphics power, 650 W required system power, one ninth-generation NVENC. No memory-bandwidth row. Specifications table: DLSS 4. Marketing copy: DLSS 5. Footnote 5 uses a Ryzen 9 9950X PC.",
    },
    {
      type: "external",
      label: "NVIDIA GeForce RTX 5060 family specifications",
      url: NV_5060,
      description:
        "Opened 15 November 2026. RTX 5060 Ti: 4,608 CUDA cores, 16 GB / 8 GB GDDR7, 128-bit, 448 GB/sec, boost 2.57 GHz, base 2.41 GHz, 759 AI TOPS, 72 TFLOPS, 180 W total graphics power, 600 W required system power, one ninth-generation NVENC. Shop section: Available April 16. Specifications table: DLSS 4. Marketing copy: DLSS 5.",
    },
    {
      type: "external",
      label: "NVIDIA GeForce RTX 3060 family specifications",
      url: NV_3060,
      description:
        "Opened 15 November 2026. RTX 3060 standard memory config: 12 GB GDDR6 / 8 GB GDDR6. Memory interface width: 192-bit / 128-bit. Graphics card power 170 W. Required system power 550 W. Footnote 4 uses a Core i9-10900K PC.",
    },
    {
      type: "external",
      label: "Digital Foundry: RTX 5060 Ti 16GB review (16 April 2025)",
      url: DF,
      description:
        "Richard Leadbetter and William Judd, 16 April 2025, opened 15 November 2026. Says don't consider buying the 8GB model. Spec table: RTX 5070 bandwidth 672GB/s, RTX 5060 Ti 448GB/s, PSU Recommendation 450 W for the RTX 5060 Ti, release dates March 5th and April 16th. Calls the CUDA-core gap a 33 per cent increase and the bandwidth gap a straight 50 percent increase. Palit Infinity 3 sample: 150 to 170 W during play, electrically x8.",
    },
    {
      type: "external",
      label: "Tom's Hardware: RTX 5070 vs RTX 5060 Ti 16GB (21 April 2025)",
      url: TOMS,
      description:
        "Jarred Walton, 21 April 2025, opened 15 November 2026. Geometric mean of 21 games, equal weighting, 15 rasterization and six ray tracing. Founders Edition RTX 5070 and PNY RTX 5060 Ti 16GB OC. 32 percent on average at 4K, 31 percent overall at 1440p, 28 percent at 1080p ultra, 24 percent at 1080p medium. 12 GB sufficient at 1440p in that suite. Blender overall geomean plus 44.5 percent. Bandwidth cells 672 GB/s and 448 GB/s.",
    },
    {
      type: "external",
      label: "XDA Developers: RTX 5060 Ti vs RTX 5070 (25 April 2025)",
      url: XDA,
      description:
        "Jacob Roach, 25 April 2025, opened 15 November 2026. At 4K, Horizon Zero Dawn Remastered and Forza Motorsport can saturate an 8GB frame buffer. Says 12 GB was enough to push to 4K in that test. Price cells and the per-game fps table are not repeated here.",
    },
  ],
  metaTitle: "RTX 5070 vs RTX 5060 Ti",
});

BUILT.metadata.metaDescription =
  "Choose the RTX 5070 for 6,144 CUDA cores and 12 GB GDDR7, or the RTX 5060 Ti 16 GB config for 16 GB GDDR7. NVIDIA required system power is 650 W and 600 W.";

export const RTX_5070_VS_RTX_5060_TI: EditorialComparison = BUILT;
