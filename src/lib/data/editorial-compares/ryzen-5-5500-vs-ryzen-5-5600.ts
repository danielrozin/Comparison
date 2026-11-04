import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-373 — Ryzen 5 5500 vs Ryzen 5 5600.
 * Opened 4 November 2026 (Asia/Jerusalem).
 * Specs: AMD's 15 March 2022 launch notes, plus the spec blocks on AMD's
 * Ryzen 5 5500 and Ryzen 5 5600 driver pages (the /products/.../5500 and
 * /5600 URLs returned 404). 5500F, 5600X, and 5600G from their AMD pages.
 * Gaming: TechSpot, 6 July 2022 (21-game average, RX 6950 XT and RX 6600 XT)
 * and Tom's Hardware, 26 June 2022 (RTX 3090, 1080p index).
 * Productivity and SSD note: Ars Technica, 4 April 2022.
 * No winner. Launch SEP only ($159 / $199, March 2022), not street prices.
 * No GPU frame-rate loss claimed for PCIe 3.0. No 5500F game results.
 * Reddit returned 403, so there is no community block and no $90 / $150.
 */

const A = "ryzen-5-5500";
const B = "ryzen-5-5600";

const AMD_LAUNCH =
  "https://www.amd.com/en/newsroom/press-releases/2022-3-15-amd-launches-the-ultimate-gaming-processor-brings.html";
const AMD_5500 =
  "https://www.amd.com/en/support/downloads/drivers.html/processors/ryzen/ryzen-5000-series/amd-ryzen-5-5500.html";
const AMD_5600 =
  "https://www.amd.com/en/support/downloads/drivers.html/processors/ryzen/ryzen-5000-series/amd-ryzen-5-5600.html";
const AMD_5500F =
  "https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-5-5500f.html";
const AMD_5600X =
  "https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-5-5600x.html";
const AMD_5600G =
  "https://www.amd.com/en/support/downloads/drivers.html/processors/ryzen/ryzen-5000-series/amd-ryzen-5-5600g.html";
const TECHSPOT = "https://www.techspot.com/review/2494-amd-ryzen-5500/";
const TOMS =
  "https://www.tomshardware.com/reviews/amd-ryzen-5-5600-and-ryzen-5-5500-review/3";
const ARS =
  "https://arstechnica.com/gadgets/2022/04/review-ryzen-5-5500-and-5600-can-breathe-new-life-into-older-amd-pcs/";

const SOURCE_DATE = "2026-11-04";
const PUBLISHED = "2026-11-04T00:00:00Z";
const SPEC = "Specs";

const SHORT_ANSWER =
  "Choose the Ryzen 5 5600 for an AM4 gaming upgrade when cache and PCIe 4.0 matter. AMD lists 32 MB of L3 cache and PCIe 4.0 on the 5600, and 16 MB of L3 cache and PCIe 3.0 on the 5500. TechSpot measured the 5600 17 percent faster on average across 21 games at 1080p with a Radeon RX 6950 XT in July 2022. With a Radeon RX 6600 XT in that same review, TechSpot measured the 5500 7 percent slower on average. Choose the 5500 when the graphics card is the limit and the savings go toward that card. Neither chip is the right pick for every build.";

const FAQS = [
  {
    question: "Is the Ryzen 5 5600 better than the 5500 for gaming?",
    answer:
      "Yes, in the CPU-limited tests from 2022. AMD lists 32 MB of L3 cache and PCIe 4.0 on the Ryzen 5 5600, against 16 MB of L3 cache and PCIe 3.0 on the Ryzen 5 5500. TechSpot measured the 5600 17 percent faster on average across 21 games at 1080p with a Radeon RX 6950 XT in July 2022. With a Radeon RX 6600 XT in that same review, TechSpot measured the 5500 7 percent slower on average.",
  },
  {
    question: "Is the Ryzen 5 5500 worth it?",
    answer:
      "It can be a reasonable budget pick when the graphics card is the main limit and the price difference goes toward a stronger graphics card. TechSpot's July 2022 21-game average matched the Ryzen 5 5500 with the Ryzen 5 3600 in every configuration in that test. AMD's March 15, 2022 suggested etail price was $159 for the 5500 and $199 for the 5600. Those are launch prices, not current street prices.",
  },
  {
    question: "Does the Ryzen 5 5500 have integrated graphics?",
    answer:
      "No. AMD lists a discrete graphics card as required for the Ryzen 5 5500 and for the Ryzen 5 5600. The Ryzen 5 5600G is the 6-core model with graphics. AMD lists Radeon Graphics on the 5600G, with 7 graphics cores at 1900 MHz.",
  },
  {
    question: "Does PCIe 3.0 on the Ryzen 5 5500 matter?",
    answer:
      "AMD lists PCIe 3.0 on the Ryzen 5 5500 and PCIe 4.0 on the Ryzen 5 5600. Ars Technica reports that PCIe 3.0 limits speeds with newer PCIe 4.0 SSDs. For a graphics card, check how many PCIe lanes the card uses before you buy.",
  },
  {
    question: "What's the difference between the Ryzen 5 5500 and 5500F?",
    answer:
      "AMD lists the Ryzen 5 5500 as Cezanne, with 16 MB of L3 cache, PCIe 3.0, a 3.6 GHz base clock, and a boost of up to 4.2 GHz, launched April 4, 2022. AMD lists the Ryzen 5 5500F as Vermeer, with 16 MB of L3 cache, PCIe 4.0, a 3 GHz base clock, and a boost of up to 4.4 GHz, launched September 10, 2026. Both require a discrete graphics card.",
  },
];

const VERDICT = `Choose the Ryzen 5 5600 when you want the 32 MB of L3 cache and PCIe 4.0 that AMD lists, and when a fast graphics card makes the 2022 CPU-limited results relevant. TechSpot measured the 5600 17 percent faster on average at 1080p with a Radeon RX 6950 XT in July 2022.

Choose the Ryzen 5 5500 when the graphics card is the limit. With a Radeon RX 6600 XT, TechSpot measured the 5500 7 percent slower on average in that same July 2022 review. AMD's March 15, 2022 suggested etail price was $159 for the 5500 and $199 for the 5600. Those are launch prices, not current street prices.

Neither chip has integrated graphics. Neither chip is the right pick for every build.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- AMD lists 6 cores and 12 threads, a 65 W TDP, and a Wraith Stealth cooler for both the Ryzen 5 5500 and the Ryzen 5 5600.
- The 5500 is Cezanne: 16 MB of L3 cache, PCIe 3.0, boost up to 4.2 GHz, base 3.6 GHz. The 5600 is Vermeer: 32 MB of L3 cache, PCIe 4.0, boost up to 4.4 GHz, base 3.5 GHz.
- AMD's March 15, 2022 launch notes give 19 MB total cache and a $159 suggested etail price for the 5500, and 35 MB total cache and a $199 suggested etail price for the 5600. Those SEP figures are 2022 launch prices, not current street prices.
- TechSpot, July 2022, 21 games: the 5600 was 17 percent faster at 1080p with a Radeon RX 6950 XT. The same 6950 XT data had the 5500 14 percent slower on average. With a Radeon RX 6600 XT the 5500 was 7 percent slower on average.
- Tom's Hardware, June 2022, GeForce RTX 3090, 1080p index against a Core i5-12400 at 100 percent: Ryzen 5 5600 at 98.1 percent, Ryzen 5 5500 at 83.2 percent.
- Ars Technica, April 2022: the 5500 landed between 90 and 95 percent of the 5600 in most tests, and the 5600 was about 13 percent faster in Handbrake.
- Neither chip has integrated graphics. The Ryzen 5 5600G does. The Ryzen 5 5500F is a different chip from the 5500.

Specs AMD lists

AMD's spec block for the Ryzen 5 5500 names the former codename Cezanne and Zen 3. It lists 6 cores, 12 threads, SMT, a boost of up to 4.2 GHz, a 3.6 GHz base clock, 384 KB of L1 cache, 3 MB of L2 cache, and 16 MB of L3 cache. Default TDP is 65 W. The boxed cooler is the Wraith Stealth. Launch date is April 4, 2022. The socket is AM4. The package is one die, with a 180 mm² compute die. Tjmax is 90°C. It is unlocked for overclocking. PCIe version is 3.0, with 24 native lanes and 20 usable. Memory is DDR4, two channels, up to 128 GB, up to 3200 MT/s. ECC support is No. Graphics: a discrete graphics card is required.

AMD's spec block for the Ryzen 5 5600 names the former codename Vermeer and Zen 3. It lists 6 cores, 12 threads, SMT, a boost of up to 4.4 GHz, a 3.5 GHz base clock, 384 KB of L1 cache, 3 MB of L2 cache, and 32 MB of L3 cache. Default TDP is 65 W. The boxed cooler is the Wraith Stealth. Launch date is April 4, 2022. The socket is AM4. The package is two dies: a 74 mm² compute die and a 125 mm² I/O die on 12 nm. Tjmax is 90°C. It is unlocked for overclocking. PCIe version is 4.0, with 24 native lanes and 20 usable. Memory is DDR4, two channels, up to 128 GB, up to 3200 MT/s. ECC support is Yes, and AMD notes that it requires motherboard support. Graphics: a discrete graphics card is required.

On both chips, AMD lists a maximum memory speed of DDR4-3200 for two single-rank or two dual-rank modules, DDR4-2933 for four single-rank modules, and DDR4-2667 for four dual-rank modules.

AMD's March 15, 2022 launch notes use the same core counts, clocks, 65 W TDP, and Wraith Stealth cooler. They give total cache as 19 MB on the 5500 and 35 MB on the 5600, PCIe as Gen 3 and Gen 4, and a suggested etail price of $159 and $199. Availability was expected beginning April 4, 2022.

Why the cache and PCIe differ

TechSpot describes the Ryzen 5 5600 as a Vermeer model and the Ryzen 5 5500 as the APU design codenamed Cezanne. TechSpot says the 5500 is a Ryzen 5 5600G with the integrated graphics removed, which leaves half the L3 cache of the 5600, at 16 MB, and PCIe 3.0 only. Ars Technica describes the same split: the 5600 is a barely-slower version of the Ryzen 5 5600X, with a chiplet design and 32 MB of L3 cache, and the 5500 is a Ryzen 5 5600G with the integrated graphics turned off, so it has 16 MB of L3 cache and PCIe 3.0. Tom's Hardware describes the 5500 as monolithic Cezanne silicon with the integrated Radeon Vega graphics disabled, and the same basic design as the 5600G, including PCIe 3.0. AMD's own codenames, cache, PCIe versions, and graphics lines match that split. AMD lists Radeon Graphics on the 5600G (7 graphics cores at 1900 MHz, Cezanne, 16 MB of L3 cache, PCIe 3.0) and lists a discrete graphics card as required on the 5500 and the 5600.

Ars Technica reports that PCIe 3.0 on the 5500 limits speeds with newer PCIe 4.0 SSDs. For a graphics card, read how many PCIe lanes the card uses on the card maker's spec sheet. The 2022 game averages below use a Radeon RX 6950 XT, a Radeon RX 6600 XT, or a GeForce RTX 3090. They compare the two CPUs. They are not a test of PCIe 3.0 against PCIe 4.0 on one graphics card.

Gaming in 2022 tests

Label every figure below with its source, graphics card, resolution, and year. These are 2022 measurements, not a new 2026 retest.

TechSpot (Steven Walton, July 6, 2022) ran a 21-game average at 1080p and 1440p with a Radeon RX 6950 XT and a Radeon RX 6600 XT, Smart Access Memory enabled, on an MSI B350 Tomahawk with AGESA 1.2.0.7 and 32 GB of DDR4-3200 CL14. In the most CPU-bound configuration, the RX 6950 XT at 1080p, TechSpot measured the Ryzen 5 5600 17 percent faster than the Ryzen 5 5500. On that same 6950 XT 1080p data, TechSpot also says the 5500 was 14 percent slower on average, with four games past a 20 percent gap and one as large as 32 percent. Some games barely moved: TechSpot names Dying Light 2 and Cyberpunk 2077 as heavily graphics-limited. With the RX 6600 XT, TechSpot measured the 5500 7 percent slower on average, and most games in that set were a single-digit gap. Across every configuration in that 21-game average, TechSpot says the 5500 matched the Ryzen 5 3600.

Tom's Hardware (Paul Alcorn, June 26, 2022) tested with a GeForce RTX 3090 so the graphics card would limit the result less. Its 1080p index sets a Core i5-12400 at 100 percent. The Ryzen 5 5600 is at 98.1 percent. The Ryzen 5 5500 is at 83.2 percent. The Ryzen 5 5600X is at 98.71 percent, and the Ryzen 5 5600G is at 84.5 percent. Tom's Hardware says the Core i5-12400 was 2 percent faster than the 5600 in that 1080p measurement, and that the 5500 falls within 2 percent of the 5600G. In that same RTX 3090 suite, Tom's Hardware reports the 5500 roughly 10 percent faster than the Ryzen 5 3600 and 3600X, and the 5600 about 30 percent faster than those Zen 2 chips. That 3600 result is not the same test as TechSpot's, which used different games and Radeon cards and matched the 5500 with the 3600.

Productivity

Ars Technica (Andrew Cunningham, April 4, 2022) reports the Ryzen 5 5500 at between 90 and 95 percent of the Ryzen 5 5600 in most of the tests in that review, in line with a 4.2 GHz peak against a 4.4 GHz peak. The outlier was Handbrake video encoding, where the 5600 was about 13 percent faster. Ars Technica ties that gap to the smaller L3 cache and the lower clocks.

Which chip for which graphics card

Use the Ryzen 5 5600 when the graphics card is already fast, or you plan to replace it with a faster one, and you play at settings where the CPU still shows up. TechSpot's 17 percent gap used a Radeon RX 6950 XT at 1080p in July 2022. Tom's Hardware's 98.1 percent versus 83.2 percent index used a GeForce RTX 3090 at 1080p in June 2022.

Use the Ryzen 5 5500 when the graphics card is mid-range or older and the money you do not spend on the CPU goes to the graphics card. TechSpot's gap with a Radeon RX 6600 XT was 7 percent on average in July 2022. The 5500 is still a discrete-graphics chip: AMD says a graphics card is required.

If the PC has no graphics card, neither the 5500 nor the 5600 will display a picture. AMD lists Radeon Graphics on the Ryzen 5 5600G.

5500, 5500F, 5600, and 5600X

The Ryzen 5 5500 and the Ryzen 5 5500F do not share a design. AMD lists the 5500 as Cezanne, PCIe 3.0, 16 MB of L3 cache, base 3.6 GHz, boost up to 4.2 GHz, launched April 4, 2022. AMD lists the 5500F as Vermeer, PCIe 4.0, 16 MB of L3 cache, 3 MB of L2 cache, base 3 GHz, boost up to 4.4 GHz, 65 W, Wraith Stealth, DDR4, AM4, a discrete graphics card required, launched September 10, 2026. There is no 5500F gaming figure in the 2022 reviews above.

The Ryzen 5 5600X is also Vermeer. AMD lists 6 cores, 12 threads, a boost of up to 4.6 GHz, a 3.7 GHz base, 3 MB of L2 cache, 32 MB of L3 cache, a 65 W TDP, PCIe 4.0, DDR4 up to 3200 MT/s, a discrete graphics card required, and a launch date of November 5, 2020. Tom's Hardware says the Ryzen 5 5600 loses 200 MHz on the base clock and 200 MHz on the boost next to that 5600X. Tom's Hardware's June 2022 1080p index puts the 5600X at 98.71 percent of a Core i5-12400, next to 98.1 percent for the 5600, both with an RTX 3090.

Upgrading an older AM4 PC

Both chips use DDR4. You do not need DDR5 to install either one. The DDR5 vs DDR4 comparison is the memory decision for a new socket. The Ryzen 7 5800X3D or AM5 comparison is the separate question of staying on a larger-cache AM4 chip or moving to AM5.

AMD's spec blocks list the same supporting chipsets for the Ryzen 5 5500 and the Ryzen 5 5600: X570, X470, X370, B550, B450, B350, and A520. AMD's March 15, 2022 announcement also said Ryzen 5000 Series processors, including the new desktop processors announced that day, would be supported on X370, B350, and A320 chipsets, with selective beta BIOS updates expected in April 2022. Tom's Hardware, writing on June 26, 2022, says the chips were already supported on 400-series boards, and that as of AGESA 1207 most 300-series motherboards support Ryzen 5000 after a BIOS update. Tom's Hardware also reports that AMD said support varies by vendor. A chipset name is not a promise that every board revision already boots the chip. Read the motherboard maker's CPU support list for a BIOS that names the Ryzen 5 5500 or the Ryzen 5 5600 before you buy.`;

const BUILT = buildEditorialComparison({
  slug: "ryzen-5-5500-vs-ryzen-5-5600",
  title: "Ryzen 5 5500 vs Ryzen 5 5600 for Desktop Gaming",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Ryzen 5 5500",
      shortDesc:
        "Cezanne desktop CPU with 6 cores, 12 threads, 16 MB of L3 cache, and PCIe 3.0.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "6 cores, 12 threads, boost up to 4.2 GHz, 65 W, Wraith Stealth (AMD)",
        "TechSpot, July 2022: matched a Ryzen 5 3600 in the 21-game average",
        "TechSpot, RX 6600 XT: 7 percent slower than the 5600 on average",
      ],
      cons: [
        "16 MB L3 and PCIe 3.0, against 32 MB L3 and PCIe 4.0 on the 5600 (AMD)",
        "TechSpot, July 2022, RX 6950 XT at 1080p: 14 percent slower than the 5600 on average",
        "Discrete graphics card required (AMD). ECC support: No (AMD)",
      ],
      bestFor: "A mid-range graphics card, with the savings put toward that card",
    },
    {
      id: B,
      slug: B,
      name: "Ryzen 5 5600",
      shortDesc:
        "Vermeer desktop CPU with 6 cores, 12 threads, 32 MB of L3 cache, and PCIe 4.0.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "6 cores, 12 threads, boost up to 4.4 GHz, 32 MB L3, PCIe 4.0, 65 W (AMD)",
        "TechSpot, July 2022, RX 6950 XT at 1080p: 17 percent faster on average across 21 games",
        "Tom's Hardware, June 2022, RTX 3090: 98.1 percent of a Core i5-12400 at 1080p",
      ],
      cons: [
        "Discrete graphics card required (AMD)",
        "March 15, 2022 SEP was $199, against $159 for the 5500 (AMD launch price, not a street price)",
        "TechSpot, RX 6600 XT: the 5500 was only 7 percent slower on average",
      ],
      bestFor: "CPU-limited 1080p gaming and a faster graphics card",
    },
  ],
  keyDifferences: [
    {
      label: "Codename",
      entityAValue: "Cezanne",
      entityBValue: "Vermeer",
      winner: "tie",
    },
    {
      label: "Cores and threads",
      entityAValue: "6 cores, 12 threads",
      entityBValue: "6 cores, 12 threads",
      winner: "tie",
    },
    {
      label: "Boost and base",
      entityAValue: "Up to 4.2 GHz / 3.6 GHz",
      entityBValue: "Up to 4.4 GHz / 3.5 GHz",
      winner: "tie",
    },
    {
      label: "L3 cache",
      entityAValue: "16 MB",
      entityBValue: "32 MB",
      winner: "tie",
    },
    {
      label: "Total cache at launch",
      entityAValue: "19 MB (March 2022)",
      entityBValue: "35 MB (March 2022)",
      winner: "tie",
    },
    {
      label: "PCIe",
      entityAValue: "PCIe 3.0",
      entityBValue: "PCIe 4.0",
      winner: "tie",
    },
    {
      label: "Memory",
      entityAValue: "DDR4, up to 3200 MT/s, 128 GB",
      entityBValue: "DDR4, up to 3200 MT/s, 128 GB",
      winner: "tie",
    },
    {
      label: "Default TDP",
      entityAValue: "65 W",
      entityBValue: "65 W",
      winner: "tie",
    },
    {
      label: "Graphics",
      entityAValue: "Discrete graphics card required",
      entityBValue: "Discrete graphics card required",
      winner: "tie",
    },
    {
      label: "Launch SEP (March 15, 2022)",
      entityAValue: "$159",
      entityBValue: "$199",
      winner: "tie",
    },
    {
      label: "TechSpot 1080p, RX 6950 XT (July 2022)",
      entityAValue: "14% slower than the 5600",
      entityBValue: "17% faster than the 5500",
      winner: "tie",
    },
    {
      label: "Tom's Hardware 1080p index, RTX 3090 (June 2022)",
      entityAValue: "83.2% of a Core i5-12400",
      entityBValue: "98.1% of a Core i5-12400",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("codename", "Former codename", SPEC, A, B, "Cezanne", "Vermeer"),
    textAttr("arch", "Architecture", SPEC, A, B, "Zen 3", "Zen 3"),
    textAttr("cores", "Cores and threads", SPEC, A, B, "6 / 12, SMT", "6 / 12, SMT"),
    textAttr("boost", "Max boost", SPEC, A, B, "Up to 4.2 GHz", "Up to 4.4 GHz"),
    textAttr("base", "Base clock", SPEC, A, B, "3.6 GHz", "3.5 GHz"),
    textAttr("l3", "L3 cache", SPEC, A, B, "16 MB", "32 MB"),
    textAttr("l2", "L2 cache", SPEC, A, B, "3 MB", "3 MB"),
    textAttr("total-cache", "Total cache (March 15, 2022 launch)", SPEC, A, B, "19 MB", "35 MB"),
    textAttr("pcie", "PCIe version", SPEC, A, B, "PCIe 3.0 (24 total / 20 usable)", "PCIe 4.0 (24 total / 20 usable)"),
    textAttr("memory", "Memory", SPEC, A, B, "DDR4, 2 channels, up to 128 GB, up to 3200 MT/s", "DDR4, 2 channels, up to 128 GB, up to 3200 MT/s"),
    textAttr("ecc", "ECC", SPEC, A, B, "No", "Yes (requires motherboard support)"),
    textAttr("tdp", "Default TDP", SPEC, A, B, "65 W", "65 W"),
    textAttr("cooler", "Boxed cooler", SPEC, A, B, "Wraith Stealth", "Wraith Stealth"),
    textAttr("graphics", "Graphics", SPEC, A, B, "Discrete graphics card required", "Discrete graphics card required"),
    textAttr("socket", "Socket", SPEC, A, B, "AM4", "AM4"),
    textAttr("launch", "Launch date", SPEC, A, B, "April 4, 2022", "April 4, 2022"),
    textAttr("sep", "Suggested etail price (March 15, 2022)", SPEC, A, B, "$159 launch SEP", "$199 launch SEP"),
    textAttr(
      "techspot-6950",
      "TechSpot 21-game average, 1080p, RX 6950 XT (July 2022)",
      SPEC,
      A,
      B,
      "14 percent slower than the 5600",
      "17 percent faster than the 5500"
    ),
    textAttr(
      "techspot-6600",
      "TechSpot 21-game average, RX 6600 XT (July 2022)",
      SPEC,
      A,
      B,
      "7 percent slower than the 5600",
      "Mid-range gap in that test"
    ),
    textAttr(
      "toms-1080",
      "Tom's Hardware 1080p index vs Core i5-12400, RTX 3090 (June 2022)",
      SPEC,
      A,
      B,
      "83.2 percent",
      "98.1 percent"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "ryzen-7-5800x3d-vs-am5",
      title: "Ryzen 7 5800X3D or AM5",
      category: "technology",
    },
    {
      slug: "ddr5-vs-ddr4",
      title: "DDR5 vs DDR4",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Ryzen 5 5600 when cache, PCIe 4.0, and the 2022 CPU-limited game tests matter. Ryzen 5 5500 when the graphics card is the limit. Neither chip is the right pick for every build.",
    keyFact:
      "AMD lists 6 cores and 12 threads for both, 16 MB of L3 cache and PCIe 3.0 on the Ryzen 5 5500, and 32 MB of L3 cache and PCIe 4.0 on the Ryzen 5 5600.",
  },
  citationStats: {
    sourceCount: 9,
    dataPointCount: 48,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "AMD launch notes, March 15, 2022", url: AMD_LAUNCH },
      { name: "AMD Ryzen 5 5500 specifications", url: AMD_5500 },
      { name: "AMD Ryzen 5 5600 specifications", url: AMD_5600 },
      { name: "AMD Ryzen 5 5500F", url: AMD_5500F },
      { name: "AMD Ryzen 5 5600X", url: AMD_5600X },
      { name: "AMD Ryzen 5 5600G specifications", url: AMD_5600G },
      { name: "TechSpot: Ryzen 5 5500 review", url: TECHSPOT },
      { name: "Tom's Hardware: Ryzen 5 5600 and 5500 gaming benchmarks", url: TOMS },
      { name: "Ars Technica: Ryzen 5 5500 and 5600 review", url: ARS },
    ],
  },
  resources: [
    {
      type: "external",
      label: "AMD launch notes, March 15, 2022",
      url: AMD_LAUNCH,
      description:
        "Suggested etail price $159 for the Ryzen 5 5500 and $199 for the Ryzen 5 5600. Total cache 19 MB and 35 MB. PCIe Gen 3 and Gen 4. Boost up to 4.2 / 3.6 GHz and up to 4.4 / 3.5 GHz. 6 cores / 12 threads, 65 W, Wraith Stealth. Expected availability April 4, 2022. Ryzen 5000 support named for X370, B350, and A320, with selective beta BIOS updates expected in April 2022.",
    },
    {
      type: "external",
      label: "AMD Ryzen 5 5500 specifications",
      url: AMD_5500,
      description:
        "Cezanne, Zen 3, 6 cores, 12 threads, boost up to 4.2 GHz, 3.6 GHz base, 384 KB L1, 3 MB L2, 16 MB L3, 65 W, Wraith Stealth, April 4, 2022, AM4, one 180 mm² die, PCIe 3.0 with 24 / 20 lanes, DDR4 up to 128 GB and 3200 MT/s, ECC No, discrete graphics card required.",
    },
    {
      type: "external",
      label: "AMD Ryzen 5 5600 specifications",
      url: AMD_5600,
      description:
        "Vermeer, Zen 3, 6 cores, 12 threads, boost up to 4.4 GHz, 3.5 GHz base, 384 KB L1, 3 MB L2, 32 MB L3, 65 W, Wraith Stealth, April 4, 2022, AM4, 74 mm² compute die plus 125 mm² I/O die, PCIe 4.0 with 24 / 20 lanes, DDR4 up to 128 GB and 3200 MT/s, ECC Yes with motherboard support, discrete graphics card required.",
    },
    {
      type: "external",
      label: "AMD Ryzen 5 5500F",
      url: AMD_5500F,
      description:
        "Vermeer, 6 cores, 12 threads, boost up to 4.4 GHz, 3 GHz base, 3 MB L2, 16 MB L3, 65 W, PCIe 4.0, DDR4, discrete graphics card required, Wraith Stealth, launched September 10, 2026.",
    },
    {
      type: "external",
      label: "AMD Ryzen 5 5600X",
      url: AMD_5600X,
      description:
        "Vermeer, 6 cores, 12 threads, boost up to 4.6 GHz, 3.7 GHz base, 3 MB L2, 32 MB L3, 65 W, PCIe 4.0, DDR4 up to 3200 MT/s, discrete graphics card required, launched November 5, 2020.",
    },
    {
      type: "external",
      label: "AMD Ryzen 5 5600G specifications",
      url: AMD_5600G,
      description:
        "Cezanne, 6 cores, 12 threads, boost up to 4.4 GHz, 3.9 GHz base, 16 MB L3, PCIe 3.0, Radeon Graphics with 7 cores at 1900 MHz, launched April 13, 2021.",
    },
    {
      type: "external",
      label: "TechSpot: Ryzen 5 5500 review",
      url: TECHSPOT,
      description:
        "Steven Walton, July 6, 2022. 21-game average. RX 6950 XT at 1080p: the 5600 was 17 percent faster, and the 5500 was 14 percent slower on average. RX 6600 XT: the 5500 was 7 percent slower on average. The 5500 matched the Ryzen 5 3600 in every configuration of that average. Cezanne versus Vermeer, 16 MB versus 32 MB L3, PCIe 3.0.",
    },
    {
      type: "external",
      label: "Tom's Hardware: Ryzen 5 5600 and 5500 gaming benchmarks",
      url: TOMS,
      description:
        "Paul Alcorn, June 26, 2022. GeForce RTX 3090. 1080p index versus a Core i5-12400 at 100 percent: 5600 at 98.1 percent, 5500 at 83.2 percent, 5600X at 98.71 percent, 5600G at 84.5 percent.",
    },
    {
      type: "external",
      label: "Ars Technica: Ryzen 5 5500 and 5600 review",
      url: ARS,
      description:
        "Andrew Cunningham, April 4, 2022. The 5500 at 90 to 95 percent of the 5600 in most tests. Handbrake: the 5600 about 13 percent faster. PCIe 3.0 limits speeds with newer PCIe 4.0 SSDs. The 5500 is a 5600G with integrated graphics turned off.",
    },
  ],
  metaTitle: "Ryzen 5 5500 vs Ryzen 5 5600",
});

export const RYZEN_5_5500_VS_RYZEN_5_5600: EditorialComparison = BUILT;
