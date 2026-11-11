import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-413 — Ryzen 7 5700X3D vs Ryzen 7 5800X3D.
 * Sources opened 11 November 2026 (Asia/Jerusalem).
 *
 * Specs: AMD Ryzen 7 5800X3D product specifications, and the specifications
 * block on AMD's Ryzen 7 5700X3D drivers page. The English product URL for
 * the 5700X3D was not used: it did not resolve. AMD newsroom, 8 January 2024,
 * is the launch SEP.
 *
 * Game charts opened the same day:
 * TechSpot 2801 (Steven Walton, 8 February 2024), RTX 4090 at 1080p;
 * TechSpot 2808 (Steven Walton, 24 February 2024), RTX 4090 at 1080p;
 * TechSpot 3077 (Steven Walton, 14 January 2026), RTX 5090 at 1080p;
 * GamersNexus (Steve Burke, written 1 March 2024 from a 3 February 2024 video).
 *
 * Not copied: TechPowerUp's $250 and $360 street line, GamersNexus's $250
 * "original MSRP" and Newegg prices, TechSpot street prices, any current
 * price, and any page-level value crown. dataPointCount stays 0. The percents
 * are cited review results or arithmetic on cited chart bars, not a
 * measurement dataset of ours. winnerName stays null. isHumanReviewed stays
 * false. No EDITORIAL_INBOUND_RELATED edit.
 */

const A = "ryzen-7-5700x3d";
const B = "ryzen-7-5800x3d";

const AMD_5700 =
  "https://www.amd.com/en/support/downloads/drivers.html/processors/ryzen/ryzen-5000-series/amd-ryzen-7-5700x3d.html";
const AMD_5800 =
  "https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-7-5800x3d.html";
const AMD_NEWS =
  "https://www.amd.com/en/newsroom/press-releases/2024-1-8-amd-reveals-next-gen-desktop-processors-for-extrem.html";
const TECHSPOT_2801 = "https://www.techspot.com/review/2801-amd-ryzen-5700x3d/";
const TECHSPOT_2808 = "https://www.techspot.com/review/2808-amd-ryzen-x3d-versus/";
const TECHSPOT_3077 = "https://www.techspot.com/review/3077-amd-ryzen-am4-5800x3d-5700x3d/";
const GAMERS_NEXUS =
  "https://gamersnexus.net/cpus/new-amd-ryzen-7-5700x3d-cpu-review-benchmarks-vs-5800x3d-more";

const SOURCE_DATE = "2026-11-11";
const PUBLISHED = "2026-11-11T00:00:00Z";
const SPEC = "Specs";

const CHIPSETS = "X570, X470, B550, B450, A520";
const MEMORY_SPEED =
  "2x1R DDR4-3200, 2x2R DDR4-3200, 4x1R DDR4-2933, 4x2R DDR4-2667";

const SHORT_ANSWER =
  "Choose the Ryzen 7 5700X3D if you want the 3 GHz base clock and a boost of up to 4.1 GHz, and choose the Ryzen 7 5800X3D if you want the 3.4 GHz base clock and a boost of up to 4.5 GHz. Both are 8-core, 16-thread Zen 3 processors with 96 MB of L3 cache, a 105W default TDP, and socket AM4, and neither chip is right for every build.";

const VERDICT = `Choose the Ryzen 7 5700X3D if you want the 3 GHz base clock and a boost of up to 4.1 GHz on a motherboard whose CPU support list names it.

Choose the Ryzen 7 5800X3D if you want the 3.4 GHz base clock and a boost of up to 4.5 GHz. AMD's 5800X3D specification block recommends a liquid cooler for optimal performance. The 5700X3D specification block has no recommended-cooler line. Neither processor includes a cooler.

Neither chip is right for every build. AMD's 8 January 2024 newsroom names a US $249 suggested etail price (SEP) for the Ryzen 7 5700X3D. That is a launch SEP, not a current price. No 5800X3D price is stated here. Check current price.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- AMD lists 8 cores, 16 threads, 512 KB of L1 cache, 4 MB of L2 cache, 96 MB of L3 cache, a 105W default TDP, a 90°C Tjmax, socket AM4, and DDR4 for both the Ryzen 7 5700X3D and the Ryzen 7 5800X3D.
- The 5700X3D specification block lists a 3 GHz base clock and a boost of up to 4.1 GHz. The 5800X3D specification block lists a 3.4 GHz base clock and a boost of up to 4.5 GHz. Launch dates on those blocks are 01/08/2024 and 4/20/2022.
- AMD's 8 January 2024 newsroom lists a US $249 suggested etail price (SEP) for the 5700X3D, with expected DIY and system-integrator availability starting 31 January 2024. That SEP is a launch figure. Check current price. No 5800X3D price is stated here.
- TechSpot's 8 February 2024 10-game average chart is labelled RTX 4090 at 1080p and prints 132 fps for the 5700X3D and 138 fps for the 5800X3D. 6 / 138 = 0.0435 to four decimals.
- GamersNexus, in the 1 March 2024 article, says its gaming charts generally sit around 6 to 10 percent, and then names separate results at 1080p and at 1440p. Those are that outlet's tests, not a blend with TechSpot.
- Choose the 5700X3D for the lower clocks on a supported AM4 board. Choose the 5800X3D for the higher clocks. Neither chip is right for every build.

What AMD lists for both

Both specification blocks name the former codename Vermeer and the architecture Zen 3. Both list 8 CPU cores, simultaneous multithreading, 16 threads, 512 KB of L1 cache, 4 MB of L2 cache, and 96 MB of L3 cache. Default TDP is 105W. CPU cores are TSMC 7nm FinFET. The I/O die is 12nm (Globalfoundries). The CPU compute die is 74mm² and the I/O die is 125mm². Package die count is 2. The socket is AM4. Supporting chipsets are ${CHIPSETS}. CPU boost technology is Precision Boost 2. Max operating temperature (Tjmax) is 90°C. The thermal solution (PIB) is not included. System memory is DDR4, two channels, UDIMM, up to 128 GB, at ${MEMORY_SPEED}. ECC support is Yes, and AMD notes that it requires motherboard support. PCI Express version is PCIe 4.0, with 24 native lanes and 20 usable. Graphics are listed as discrete graphics card required. The 5800X3D block's launch date is 4/20/2022. The 5700X3D block's launch date is 01/08/2024.

The clocks are not the only lines that differ. The 5800X3D block says "Liquid cooler recommended for optimal performance." The 5700X3D block has no recommended-cooler line. Boxed and tray product IDs differ: 100-100001503WOF and 100-100001503, tray 100-000001503, against boxed 100-100000651POF and tray 100-000000651. The 5800X3D key-features line names AMD 3D V-Cache technology. The 5700X3D key-features line names AMD StoreMI technology, AMD Zen 3 core architecture, the AMD Ryzen Master utility, and AMD Ryzen VR-Ready Premium, and it does not name 3D V-Cache there.

AMD's newsroom post dated 8 January 2024 still names 3D V-Cache for the 5700X3D. The post says the processor leverages AMD 3D V-Cache technology to deliver 100MB of on-chip memory. The same table prints 8 cores and 16 threads, up to 4.1GHz / 3.0GHz, 100MB total cache, 105W, and a US $249 SEP. 4 MB of L2 cache plus 96 MB of L3 cache is 100 MB. The post says the new Ryzen 5000 series desktop processors were expected to be available to DIY customers and system integrators starting 31 January 2024. Footnote 6 on that post says max boost for AMD Ryzen processors is the maximum frequency achievable by a single core on a bursty single-threaded workload, and that max boost varies with cooling, motherboard, BIOS, drivers, and OS updates. The 3 GHz base on the specification block and the 3.0GHz base in that table are the same base clock.

Launch price, labelled

The US $249 figure is the suggested etail price (SEP) in AMD's 8 January 2024 newsroom table for the Ryzen 7 5700X3D. It is a launch SEP, not a price you can assume today. This draft does not state a 5800X3D launch price or any current price for either chip. Check current price before you buy.

TechSpot, 8 February 2024, RTX 4090 at 1080p

Steven Walton's TechSpot review is dated 8 February 2024. Its 10-game average chart is labelled "RTX 4090 [1080p]". The bars print 138 fps average and 109 fps 1% lows for the 5800X3D, and 132 fps average and 104 fps 1% lows for the 5700X3D. 138 minus 132 is 6, and 6 / 138 = 0.0435 to four decimals, which is 4.3 percent to one decimal. The review text calls that average just 4 percent slower. The same chart prints 111 fps average for the Ryzen 7 5700X. 132 minus 111 is 21, and 21 / 111 = 0.1892 to four decimals, which is 18.9 percent to one decimal. The review text calls the 5700X3D nearly 20 percent faster than the standard 5700X on that 10-game average.

The same review's game charts name the setting in the header. A Plague Tale: Requiem, labelled RTX 4090 at 1080p Ultra Quality, prints 135 fps for the 5800X3D and 124 fps for the 5700X3D. 11 / 135 = 0.0815 to four decimals, which is 8.1 percent to one decimal. The review text calls that margin 8 percent. Hitman 3, labelled RTX 4090 at 1080p Ultra, prints 211 fps and 195 fps. 16 / 211 = 0.0758 to four decimals, which is 7.6 percent to one decimal. The review text calls that margin 8 percent and names 195 fps. Watch Dogs: Legion, labelled RTX 4090 at 1080p Ultra, prints 155 fps and 153 fps. 2 / 155 = 0.0129 to four decimals, which is 1.3 percent to one decimal. The review text calls that result 1 percent slower, with 153 fps. Cyberpunk 2077: Phantom Liberty, labelled RTX 4090 at 1080p Ultra, prints 142 fps and 137 fps, and 112 fps for the 5700X. 5 / 142 = 0.0352 to four decimals. 25 / 112 = 0.2232 to four decimals, which is 22.3 percent to one decimal. The review text calls Cyberpunk merely 4 percent slower than the 5800X3D and a 22 percent improvement over the standard 5700X.

In that review's Cinebench multi-core test, TechSpot says the 5700X3D was 9 percent slower than the 5700X and 7 percent slower than the 5800X3D, and that the 96 MB L3 cache does not help that test. The single-core result in the same review is described as 9 percent slower than the 5800X3D. In Baldur's Gate 3, the review says the 5700X3D configuration used about 7 percent less total system power than the 5800X3D configuration, at roughly 350 watts. Both chips still carry a 105W default TDP on AMD's blocks. Those power watts are system power in that one game, not a second TDP.

TechSpot, 24 February 2024, three AM4 X3D chips

Steven Walton's 24 February 2024 TechSpot feature compares the 5800X3D, the 5700X3D, and the 5600X3D. Its 12-game average chart is labelled "RTX 4090 [1080p]". The bars print 181 fps for the Ryzen 7 7800X3D, 138 fps for the 5800X3D, 134 fps for the Ryzen 5 5600X3D, and 132 fps for the 5700X3D. 181 minus 138 is 43, and 43 / 138 = 0.3116 to four decimals, which is 31.2 percent to one decimal. The feature text says the 7800X3D was, on average, 31 percent faster than the 5800X3D. 134 minus 132 is 2, and 2 / 132 = 0.0152 to four decimals, which is 1.5 percent to one decimal. 138 minus 134 is 4, and 4 / 138 = 0.0290 to four decimals, which is 2.9 percent to one decimal. The feature text calls the 5600X3D 2 percent faster on average than the 5700X3D and 3 percent slower than the 5800X3D. Those sentences are that article's rounding of that average.

The same feature, on 24 February 2024, describes the Ryzen 5 5600X3D as a Micro Center exclusive. That is that article's description on that date. It is not a current stock claim, and no 5600X3D price is stated here.

TechSpot, 14 January 2026, RTX 5090 at 1080p

Steven Walton's 14 January 2026 TechSpot revisit tests the 5800X3D and the 5700X3D again. The test-system table names an MSI MPG X570S Carbon MAX WiFi motherboard at BIOS 7D52v1D1, 32 GB of G.Skill Ripjaws V DDR4-3600 CL14-15-15-35, an Asus ROG Astral RTX 5090 OC Edition, Windows 11, and Nvidia driver 591.74 WHQL. The 14-game average chart is labelled RTX 5090 and splits 1080p Medium from 1080p Ultra.

At 1080p Medium the bars print 188 fps for the 5800X3D and 179 fps for the 5700X3D. 9 / 188 = 0.0479 to four decimals, which is 4.8 percent to one decimal. The review text, for the Medium settings, calls the 5700X3D only 5 percent slower than the 5800X3D. At 1080p Ultra the bars print 151 fps and 145 fps. 6 / 151 = 0.0397 to four decimals, which is 4.0 percent to one decimal. The 5 percent sentence is the Medium average, not the Ultra row.

On the same chart, the Ryzen 7 9800X3D bar is 253 fps at 1080p Medium and 194 fps at 1080p Ultra, next to 188 fps and 151 fps for the 5800X3D. 65 / 188 = 0.3457 to four decimals, which is 34.6 percent to one decimal. 43 / 151 = 0.2848 to four decimals, which is 28.5 percent to one decimal. The review text says the 9800X3D was on average 35 percent faster than the 5800X3D at Medium settings, and 28 percent faster at the Ultra preset. That pair is a later AM5 chip in this one TechSpot chart. Ryzen 7 7800X3D vs Ryzen 7 9800X3D is the separate AM5 comparison.

GamersNexus, 1 March 2024

GamersNexus published the written review on 1 March 2024. An editor's note says it was originally a video on 3 February 2024 and that the written text is unchanged from that video. Steve Burke is the test lead. GamersNexus says both chips are 8-core, 16-thread parts with 96 MB of L3 cache and a 105W TDP, and that the clock is where they differ: 4.1 GHz boost and 3.0 GHz base, against 4.5 GHz and 3.4 GHz. It says most of the differences will show up in frequency, and that the shared cache can still matter in some games. That is GamersNexus's explanation. It is not a claim that cache always matters more than clocks.

GamersNexus summarizes its own gaming charts as generally hovering around the 6 to 10 percent range, and says to call it about 6 to 8 percent on average. That sentence is a summary across those charts, not one resolution. The resolution-specific lines are separate. In Final Fantasy at 1080p, the 5800X3D ran at 218 fps average and led the 5700X3D by 11 percent. In F1 2023 at 1080p, the 5700X3D ran at 410 fps average, with about a 40 fps gap, and the 5800X3D led by 10 percent. In F1 2023 at 1440p, GamersNexus says the gap closes to 3 percent because other parts of the platform and the GPU workload limit the result. In Shadow of the Tomb Raider at 1080p, the 5700X3D landed at 301 fps average and the 5800X3D led by about 9 percent. In Baldur's Gate 3 at 1080p Medium, GamersNexus prints 105 fps average for the 5700X3D and 115 fps for the 5800X3D, about a 9 percent lead. In Starfield at 1080p Low, the lead is 3 percent. In Starfield at 1080p High, the lead is about 3 percent, and GamersNexus names an RTX 4090 as the card that still constrains the Core i9-14900K and the 7800X3D in that test.

In an all-core Blender workload, GamersNexus measured the 5700X3D holding 4 GHz and the 5800X3D at 4300 MHz, and calls that 300 MHz. In a single-threaded workload, the maximum it measured on any core was commonly 4150 MHz for the 5700X3D and about 4450 MHz for the 5800X3D. Those measured clocks sit next to AMD's "up to" boost figures. They are not a replacement for the specification block.

Cooler, chipset, and the support list

Neither specification block includes a thermal solution. Only the 5800X3D block recommends a liquid cooler for optimal performance. AMD lists the same supporting chipsets for both: ${CHIPSETS}. A chipset name is not a promise that every board revision already boots the chip. Confirm the motherboard maker's CPU support list names the processor before you buy. TechSpot's 14 January 2026 test system used BIOS 7D52v1D1 on one MSI MPG X570S Carbon MAX WiFi board. That BIOS string is the BIOS in that test, not a BIOS requirement for every AM4 board.

Where the other comparisons start

Ryzen 7 5800X3D or AM5 is the separate question of keeping an AM4 board or moving. AM4 vs AM5 is the socket comparison. DDR5 vs DDR4 is the memory comparison: both of these processors list DDR4, not DDR5. A new desktop that does not already have an AM4 board is a different purchase from a drop-in on a board you own.

Community opinion

Community opinion, not a measurement: in a 10 November 2026 discussion, some replies prefer the 5700X3D when the 5800X3D costs more, and some say they would wait for a sale, including a seasonal sale. That is opinion. It is not a frame-rate result, and it is not a price.

Choose the Ryzen 7 5700X3D if

1. You want the 3 GHz base clock and the boost of up to 4.1 GHz.
2. Your motherboard maker's CPU support list names the 5700X3D.
3. You would rather compare current prices yourself than assume the 8 January 2024 SEP still applies.

Choose the Ryzen 7 5800X3D if

1. You want the 3.4 GHz base clock and the boost of up to 4.5 GHz.
2. Your motherboard maker's CPU support list names the 5800X3D.
3. A liquid cooler, which AMD recommends for this chip for optimal performance, fits the PC.`;

const FAQS = [
  {
    question: "What is the difference between the Ryzen 7 5700X3D and the 5800X3D?",
    answer:
      "The clocks differ, and so do the launch dates and the cooler line. Both specification blocks list 8 cores, 16 threads, 96 MB of L3 cache, 4 MB of L2 cache, a 105W default TDP, a 90°C Tjmax, socket AM4, PCIe 4.0, and DDR4 up to 128 GB. The 5700X3D block lists a 3 GHz base clock, a boost of up to 4.1 GHz, and launch date 01/08/2024. The 5800X3D block lists a 3.4 GHz base clock, a boost of up to 4.5 GHz, and launch date 4/20/2022. The 5800X3D block recommends a liquid cooler. The 5700X3D block has no recommended-cooler line. Neither includes a cooler. AMD's 8 January 2024 newsroom says the 5700X3D uses 3D V-Cache and lists 100MB total cache, which matches the 4 MB L2 plus 96 MB L3 on the specification block.",
  },
  {
    question: "How far behind is the 5700X3D in games?",
    answer:
      "It depends on the test. TechSpot's 8 February 2024 10-game average chart, labelled RTX 4090 at 1080p, prints 132 fps for the 5700X3D and 138 fps for the 5800X3D. 6 / 138 = 0.0435 to four decimals, and the review text calls that average just 4 percent slower. On the same review's charts, A Plague Tale: Requiem at 1080p Ultra Quality prints 124 fps and 135 fps, Hitman 3 at 1080p Ultra prints 195 fps and 211 fps, and Watch Dogs: Legion at 1080p Ultra prints 153 fps and 155 fps. GamersNexus, on 1 March 2024, says its gaming charts generally hover around 6 to 10 percent. In that article, Final Fantasy at 1080p is an 11 percent lead for the 5800X3D at 218 fps average, F1 2023 at 1080p is a 10 percent lead, and F1 2023 at 1440p closes to 3 percent. Those are separate tests. They are not one blended margin.",
  },
  {
    question: "When should I choose the 5800X3D?",
    answer:
      "Choose the 5800X3D if you want the 3.4 GHz base clock and the boost of up to 4.5 GHz, your motherboard maker's CPU support list names it, and a liquid cooler fits the PC. Choose the 5700X3D if you want the 3 GHz base clock and the boost of up to 4.1 GHz on a board whose support list names it. AMD's 8 January 2024 newsroom lists a US $249 SEP for the 5700X3D. That is a launch SEP, not a current price. No 5800X3D price is stated here. Check current price. Neither chip is right for every build.",
  },
  {
    question: "How does a 5700X3D compare with a Ryzen 7 5700X for gaming?",
    answer:
      "In TechSpot's 8 February 2024 10-game average, labelled RTX 4090 at 1080p, the 5700X3D bar is 132 fps and the 5700X bar is 111 fps. 21 / 111 = 0.1892 to four decimals, which is 18.9 percent to one decimal. The review text calls that average nearly 20 percent faster than the standard 5700X. The same review's Cyberpunk 2077 chart at 1080p Ultra prints 137 fps and 112 fps, and the text calls that a 22 percent improvement over the 5700X. In Cinebench multi-core, TechSpot says the 5700X3D was 9 percent slower than the 5700X, and that the extra L3 cache does not help that test. A drop-in still depends on the motherboard maker's CPU support list.",
  },
  {
    question: "Where does the Ryzen 5 5600X3D sit next to these two?",
    answer:
      "TechSpot's 24 February 2024 12-game average chart, labelled RTX 4090 at 1080p, prints 134 fps for the 5600X3D, 132 fps for the 5700X3D, and 138 fps for the 5800X3D. 2 / 132 = 0.0152 to four decimals, and 4 / 138 = 0.0290 to four decimals. The feature text calls the 5600X3D 2 percent faster on average than the 5700X3D and 3 percent slower than the 5800X3D. The same feature describes the 5600X3D as a Micro Center exclusive on that date. That is not a current stock claim, and no price for it is stated here.",
  },
  {
    question: "Do the 5700X3D and 5800X3D include a cooler, and which boards can run them?",
    answer:
      "Neither includes a thermal solution. AMD's 5800X3D specification block recommends a liquid cooler for optimal performance. The 5700X3D specification block has no recommended-cooler line. Both blocks list chipsets X570, X470, B550, B450, and A520. Confirm the motherboard maker's CPU support list names the processor before you buy. TechSpot's 14 January 2026 test used BIOS 7D52v1D1 on an MSI MPG X570S Carbon MAX WiFi board. That string describes that test system, not every AM4 board.",
  },
];

const BUILT = buildEditorialComparison({
  slug: "ryzen-7-5700x3d-vs-ryzen-7-5800x3d",
  title: "Ryzen 7 5700X3D vs 5800X3D for Desktop Gaming",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Ryzen 7 5700X3D",
      shortDesc:
        "Zen 3 desktop CPU with 8 cores, 16 threads, 96 MB of L3 cache, a 3 GHz base clock, and a 105W default TDP.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "8 cores, 16 threads, 96 MB L3, 105W, socket AM4 (AMD)",
        "3 GHz base and boost up to 4.1 GHz (AMD)",
        "US $249 SEP in AMD's 8 January 2024 newsroom, a launch SEP",
      ],
      cons: [
        "Boost up to 4.1 GHz, against up to 4.5 GHz on the 5800X3D (AMD)",
        "No cooler in the box, and no recommended-cooler line on the spec block (AMD)",
        "Launch SEP is not a current price. Check current price",
      ],
      bestFor: "An AM4 board whose CPU support list names it, when you want the 3 GHz base clock",
    },
    {
      id: B,
      slug: B,
      name: "Ryzen 7 5800X3D",
      shortDesc:
        "Zen 3 desktop CPU with 8 cores, 16 threads, 96 MB of L3 cache, a 3.4 GHz base clock, and a 105W default TDP.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "8 cores, 16 threads, 96 MB L3, 105W, socket AM4 (AMD)",
        "3.4 GHz base and boost up to 4.5 GHz (AMD)",
        "AMD 3D V-Cache is named on the key-features line (AMD)",
      ],
      cons: [
        "No cooler in the box. Liquid cooler recommended (AMD)",
        "No price is stated here. Check current price",
        "Same 105W default TDP and 90°C Tjmax as the 5700X3D (AMD)",
      ],
      bestFor: "An AM4 board whose CPU support list names it, when you want the 3.4 GHz base clock",
    },
  ],
  keyDifferences: [
    { label: "Base clock", entityAValue: "3 GHz", entityBValue: "3.4 GHz", winner: "tie" },
    { label: "Max boost", entityAValue: "Up to 4.1 GHz", entityBValue: "Up to 4.5 GHz", winner: "tie" },
    { label: "Cores and threads", entityAValue: "8 cores, 16 threads", entityBValue: "8 cores, 16 threads", winner: "tie" },
    { label: "L3 cache", entityAValue: "96 MB", entityBValue: "96 MB", winner: "tie" },
    { label: "Default TDP", entityAValue: "105W", entityBValue: "105W", winner: "tie" },
    { label: "Tjmax", entityAValue: "90°C", entityBValue: "90°C", winner: "tie" },
    { label: "Socket", entityAValue: "AM4", entityBValue: "AM4", winner: "tie" },
    { label: "Memory", entityAValue: "DDR4, up to 128 GB", entityBValue: "DDR4, up to 128 GB", winner: "tie" },
    { label: "PCIe", entityAValue: "PCIe 4.0, 24 total / 20 usable", entityBValue: "PCIe 4.0, 24 total / 20 usable", winner: "tie" },
    { label: "Cooler in the box", entityAValue: "Not included", entityBValue: "Not included", winner: "tie" },
    {
      label: "Recommended cooler",
      entityAValue: "No recommended-cooler line on the spec block",
      entityBValue: "Liquid cooler recommended for optimal performance",
      winner: "tie",
    },
    { label: "Launch date on the spec block", entityAValue: "01/08/2024", entityBValue: "4/20/2022", winner: "tie" },
    {
      label: "Launch SEP",
      entityAValue: "US $249 SEP on 8 January 2024",
      entityBValue: "Not stated here. Check current price",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("codename", "Former codename", SPEC, A, B, "Vermeer", "Vermeer"),
    textAttr("arch", "Architecture", SPEC, A, B, "Zen 3", "Zen 3"),
    textAttr("cores", "Cores and threads", SPEC, A, B, "8 cores, 16 threads, SMT", "8 cores, 16 threads, SMT"),
    textAttr("base", "Base clock", SPEC, A, B, "3 GHz", "3.4 GHz"),
    textAttr("boost", "Max boost", SPEC, A, B, "Up to 4.1 GHz", "Up to 4.5 GHz"),
    textAttr("l1", "L1 cache", SPEC, A, B, "512 KB", "512 KB"),
    textAttr("l2", "L2 cache", SPEC, A, B, "4 MB", "4 MB"),
    textAttr("l3", "L3 cache", SPEC, A, B, "96 MB", "96 MB"),
    textAttr("tdp", "Default TDP", SPEC, A, B, "105W", "105W"),
    textAttr("tjmax", "Tjmax", SPEC, A, B, "90°C", "90°C"),
    textAttr("ccd", "CPU core process", SPEC, A, B, "TSMC 7nm FinFET", "TSMC 7nm FinFET"),
    textAttr("iod", "I/O die process", SPEC, A, B, "12nm (Globalfoundries)", "12nm (Globalfoundries)"),
    textAttr("socket", "Socket", SPEC, A, B, "AM4", "AM4"),
    textAttr("chipsets", "Supporting chipsets", SPEC, A, B, CHIPSETS, CHIPSETS),
    textAttr("memory", "Max memory", SPEC, A, B, "128 GB DDR4, 2 channels, UDIMM", "128 GB DDR4, 2 channels, UDIMM"),
    textAttr("memspeed", "Max memory speed", SPEC, A, B, MEMORY_SPEED, MEMORY_SPEED),
    textAttr("pcie", "PCIe", SPEC, A, B, "PCIe 4.0, 24 total / 20 usable", "PCIe 4.0, 24 total / 20 usable"),
    textAttr("graphics", "Graphics", SPEC, A, B, "Discrete graphics card required", "Discrete graphics card required"),
    textAttr(
      "cooler",
      "Cooler",
      SPEC,
      A,
      B,
      "Not included. No recommended-cooler line on the spec block",
      "Not included. Liquid cooler recommended for optimal performance"
    ),
    textAttr("launch", "Launch date", SPEC, A, B, "01/08/2024", "4/20/2022"),
    textAttr(
      "sep",
      "Launch SEP",
      SPEC,
      A,
      B,
      "US $249 suggested etail price (SEP), AMD newsroom, 8 January 2024",
      "Not stated here. Check current price"
    ),
    textAttr("boosttech", "CPU boost technology", SPEC, A, B, "Precision Boost 2", "Precision Boost 2"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "ryzen-7-5800x3d-vs-am5",
      title: "Ryzen 7 5800X3D or AM5",
      category: "technology",
    },
    {
      slug: "am4-vs-am5",
      title: "AM4 vs AM5: Which Desktop PC Socket?",
      category: "technology",
    },
    {
      slug: "ddr5-vs-ddr4",
      title: "DDR5 vs DDR4",
      category: "technology",
    },
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
    winnerReason: null,
    keyFact:
      "AMD lists 8 cores, 16 threads, 96 MB of L3 cache, and a 105W default TDP for both. The 5700X3D is 3 GHz base and up to 4.1 GHz. The 5800X3D is 3.4 GHz base and up to 4.5 GHz.",
  },
  citationStats: {
    sourceCount: 7,
    dataPointCount: 0,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "AMD Ryzen 7 5700X3D specifications", url: AMD_5700 },
      { name: "AMD Ryzen 7 5800X3D specifications", url: AMD_5800 },
      { name: "AMD newsroom, 8 January 2024", url: AMD_NEWS },
      { name: "TechSpot: Ryzen 7 5700X3D review, 8 February 2024", url: TECHSPOT_2801 },
      { name: "TechSpot: 5800X3D vs 5700X3D vs 5600X3D, 24 February 2024", url: TECHSPOT_2808 },
      { name: "TechSpot: Ryzen 7 5800X3D revisited, 14 January 2026", url: TECHSPOT_3077 },
      { name: "GamersNexus: Ryzen 7 5700X3D review, 1 March 2024", url: GAMERS_NEXUS },
    ],
  },
  resources: [
    {
      type: "external",
      label: "AMD Ryzen 7 5700X3D specifications",
      url: AMD_5700,
      description:
        "Vermeer, Zen 3, 8 cores, 16 threads, boost up to 4.1 GHz, 3 GHz base, 512 KB L1, 4 MB L2, 96 MB L3, 105W, TSMC 7nm FinFET, 90°C Tjmax, launch date 01/08/2024, AM4, chipsets X570, X470, B550, B450, A520, DDR4 up to 128 GB, PCIe 4.0 with 24 / 20 lanes, cooler not included, no recommended-cooler line.",
    },
    {
      type: "external",
      label: "AMD Ryzen 7 5800X3D specifications",
      url: AMD_5800,
      description:
        "Vermeer, Zen 3, 8 cores, 16 threads, boost up to 4.5 GHz, 3.4 GHz base, 512 KB L1, 4 MB L2, 96 MB L3, 105W, TSMC 7nm FinFET, 90°C Tjmax, launch date 4/20/2022, AM4, the same chipset and DDR4 lines, cooler not included, liquid cooler recommended for optimal performance.",
    },
    {
      type: "external",
      label: "AMD newsroom, 8 January 2024",
      url: AMD_NEWS,
      description:
        "Ryzen 7 5700X3D: 8 cores / 16 threads, up to 4.1GHz / 3.0GHz, 100MB total cache, 105W, US $249 SEP. 3D V-Cache and 100MB of on-chip memory. Expected DIY and system-integrator availability starting 31 January 2024. Footnote 6 on max boost.",
    },
    {
      type: "external",
      label: "TechSpot: Ryzen 7 5700X3D review, 8 February 2024",
      url: TECHSPOT_2801,
      description:
        "Steven Walton, 8 February 2024. 10-game average chart labelled RTX 4090 at 1080p: 132 fps and 138 fps. Named 1080p charts for A Plague Tale: Requiem, Hitman 3, Watch Dogs: Legion, and Cyberpunk 2077. Cinebench and Baldur's Gate 3 system power in the same review.",
    },
    {
      type: "external",
      label: "TechSpot: 5800X3D vs 5700X3D vs 5600X3D, 24 February 2024",
      url: TECHSPOT_2808,
      description:
        "Steven Walton, 24 February 2024. 12-game average chart labelled RTX 4090 at 1080p: 181 fps, 138 fps, 134 fps, and 132 fps. 5600X3D described as a Micro Center exclusive on that date. No price copied.",
    },
    {
      type: "external",
      label: "TechSpot: Ryzen 7 5800X3D revisited, 14 January 2026",
      url: TECHSPOT_3077,
      description:
        "Steven Walton, 14 January 2026. RTX 5090 chart, 1080p Medium 179 fps and 188 fps, 1080p Ultra 145 fps and 151 fps. 9800X3D bars 253 fps and 194 fps. Test system: MSI MPG X570S Carbon MAX WiFi BIOS 7D52v1D1, DDR4-3600, Asus ROG Astral RTX 5090 OC Edition, driver 591.74.",
    },
    {
      type: "external",
      label: "GamersNexus: Ryzen 7 5700X3D review, 1 March 2024",
      url: GAMERS_NEXUS,
      description:
        "Steve Burke. Written 1 March 2024 from a 3 February 2024 video. Gaming summary around 6 to 10 percent. Final Fantasy at 1080p, F1 2023 at 1080p and 1440p, Shadow of the Tomb Raider, Baldur's Gate 3, Starfield, and Blender clocks. Retail prices from that review are not repeated here.",
    },
  ],
  metaTitle: "Ryzen 7 5700X3D vs 5800X3D for Desktop Gaming",
});

BUILT.metadata.metaDescription =
  "Ryzen 7 5700X3D vs 5800X3D on AM4: clocks, 96 MB L3, 105W, a $249 launch SEP, and dated TechSpot and GamersNexus results. Check current price.";

export const RYZEN_7_5700X3D_VS_RYZEN_7_5800X3D: EditorialComparison = BUILT;
