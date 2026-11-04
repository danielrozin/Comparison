import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-374 — Lenovo Legion 5 vs ASUS ROG Strix G16.
 * Opened 4 November 2026 (Asia/Jerusalem):
 * Lenovo PSREF Legion 5 15AHP11 configuration 83Q7005FKR;
 * Lenovo PSREF Legion 5 15AHP10 spec PDF (footer dated 22 October 2026);
 * Lenovo PSREF Legion 5 15IAX10 spec PDF (footer dated 26 October 2026);
 * Lenovo PSREF Legion Pro 5 16AFR10 product specs;
 * ASUS ROG Strix G16 (2025) G615 spec rows;
 * ASUS GPU power list, 26 July 2025;
 * ASUS ROG Product Guide Q1 2025, Strix G16/G18 (G615/G815) section.
 * Reddit returned HTTP 403, so there is no community-opinion block.
 * No winner, no street prices, no frame rates, no noise or reliability ranking.
 * Three G615 rows that pair DDR4-3200 with an RTX 50 GPU were left out.
 */

const PUBLISHED = "2026-11-04T00:00:00Z";
const SOURCE_DATE = "2026-11-04";

const A = "lenovo-legion-5";
const B = "asus-rog-strix-g16";

const PSREF_15AHP11 = "https://psref.lenovo.com/Detail/Legion_5_15AHP11?M=83Q7005FKR";
const PSREF_15AHP10 =
  "https://psref.lenovo.com/syspool/Sys/PDF/Legion/Legion_5_15AHP10/Legion_5_15AHP10_Spec.PDF";
const PSREF_15IAX10 =
  "https://psref.lenovo.com/syspool/Sys/PDF/Legion/Legion_5_15IAX10/Legion_5_15IAX10_Spec.pdf";
const PSREF_PRO_16AFR10 = "https://psref.lenovo.com/Product/Legion/Legion_Pro_5_16AFR10";
const ASUS_G615 = "https://rog.asus.com/laptops/rog-strix/rog-strix-g16-2025/spec/";
const ASUS_TGP =
  "https://rog.asus.com/articles/rog-gaming-laptops/the-complete-list-of-geforce-gpu-power-specifications-for-2025-rog-and-tuf-gaming-laptops/";
const ASUS_GUIDE =
  "https://dlcdnwebimgs.asus.com/files/media/0de32796-13f7-4be1-aabf-8ef3c5bc7830/product-guide/NP_ProductGuide_ROG_Q12025.pdf";

const SHORT_ANSWER = `Match the configuration before the brand. Choose a Strix G16 when that SKU is a G615LR, G614FR, or G614PR, because ASUS lists an RTX 5070 Ti at 140 W maximum on those models, or a G615LW, because ASUS lists an RTX 5080 at 175 W maximum. Choose a Legion 5 when the Strix beside it is a 1920x1200 IPS model, because Lenovo PSREF lists a 2560x1600, 165 Hz OLED on Legion 5 15AHP10, Legion 5 15AHP11 configuration 83Q7005FKR, and Legion 5i 15IAX10. When the GPU tier matches, compare the panel and the RAM. Every figure varies by configuration.`;

const FAQS = [
  {
    question: "Is the Legion 5 or ROG Strix G16 better for gaming?",
    answer:
      "It depends on the configuration. Compare the GPU model and its maximum power first. ASUS lists an RTX 5070 Ti at 140 W maximum on Strix G16 models G615LR, G614FR, and G614PR, and an RTX 5080 at 175 W maximum on G615LW. Lenovo PSREF lists an RTX 5070 at a 115 W TGP on Legion 5 15AHP11 configuration 83Q7005FKR and on the Legion 5i 15IAX10 graphics table. Legion 5 15AHP10 lists an RTX 5050 or RTX 5060 at a 115 W TGP. Configurations vary.",
  },
  {
    question: "Which has the better screen, Legion 5 or Strix G16?",
    answer:
      "Lenovo PSREF lists a 2560x1600, 165 Hz OLED on Legion 5 15AHP10 (15.1 inch, DisplayHDR True Black 600), on Legion 5 15AHP11 configuration 83Q7005FKR (15.3 inch, 500 nits typical and 1000 nits peak, DisplayHDR True Black 1000), and on Legion 5i 15IAX10 (15.1 inch, DisplayHDR True Black 600). Legion 5 15AHP10 also lists a 15.3 inch 1920x1200 IPS at 300 nits. ASUS lists Strix G16 (2025) G615 panels as a 16 inch 1920x1200, 165 Hz IPS at 100% sRGB, or a 16 inch 2560x1600 Nebula IPS at 240 Hz or 300 Hz and 100% DCI-P3. The panel varies by configuration.",
  },
  {
    question: "Should I get a faster GPU or a better screen in a gaming laptop?",
    answer:
      "If the faster GPU is a full tier up at a higher power limit and you play demanding games, that GPU can matter more. If you mostly play at the laptop's native resolution and care about the panel, an OLED Legion 5 configuration can matter more day to day. Compare the two SKUs. These sources do not include frame rates.",
  },
  {
    question: "Is 16 GB of RAM enough in a gaming laptop?",
    answer:
      "Listings ship with different amounts. Lenovo PSREF lists two DDR5 SODIMM slots on Legion 5 15AHP10, Legion 5 15AHP11, and Legion 5i 15IAX10, and a maximum offering of 32 GB DDR5-5600. ASUS lists two SO-DIMM slots on Strix G16 G615, and a 64 GB maximum on the DDR5 rows. A 16 GB configuration in either line may be upgradable. 32 GB leaves more room for other programs beside the game. Configurations vary.",
  },
  {
    question: "Should I wait for Black Friday to buy a Legion 5 or Strix G16?",
    answer:
      "Sale prices change, and these sources do not set a street price. Compare the exact SKU. A lower price can be a lower GPU power limit, or a 1920x1200 IPS panel instead of an OLED or a 2560x1600 Nebula. Configurations vary.",
  },
];

const VERDICT = `Choose a Strix G16 configuration when its GPU is a higher tier at a higher listed maximum. ASUS lists an RTX 5070 Ti at 140 W maximum on G615LR, G614FR, and G614PR, and an RTX 5080 at 175 W maximum on G615LW.

Choose a Legion 5 OLED configuration when the Strix beside it is the 1920x1200, 165 Hz IPS. Lenovo PSREF lists a 2560x1600, 165 Hz OLED on Legion 5 15AHP10, on Legion 5 15AHP11 configuration 83Q7005FKR, and on Legion 5i 15IAX10.

Choose by the panel, the RAM, and the warranty when the GPU tier matches. Configurations vary. These sources do not include frame rates, fan noise, or a reliability ranking.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Read the machine type on the listing: Legion 5 15AHP10, Legion 5 15AHP11, Legion 5i 15IAX10, or Strix G16 G615 or G614. Specs vary by configuration.
- ASUS, on 26 July 2025, lists Strix G16 maximum GPU power of 175 W for an RTX 5080 (G615LW), 140 W for an RTX 5070 Ti (G615LR, G614FR, G614PR), and 115 W for an RTX 5070, RTX 5060, or RTX 5050.
- Lenovo PSREF lists a 115 W TGP on the Legion GPUs below. That single TGP figure is not the same label as ASUS's base TGP plus Dynamic Boost.
- Legion 5 OLED configs are 2560x1600 at 165 Hz. Strix G16 G615 panels are 16 inch IPS: 1920x1200 at 165 Hz, or 2560x1600 Nebula at 240 Hz or 300 Hz.
- Both lines list two memory slots on these configs. Lenovo's maximum offering on the Legion 5 models below is 32 GB. ASUS lists a 64 GB maximum on G615 DDR5 rows.
- There is no reliability ranking in these sources. Compare the warranty length for your country.

What to compare, in this order

1. GPU model and its maximum power. ASUS publishes maximum GPU power by Strix model number. Lenovo PSREF lists a TGP on each Legion GPU.
2. Screen: panel type, resolution, refresh rate, and the brightness figure that maker rates for that panel.
3. RAM amount, and whether the machine has two SODIMM slots.
4. CPU. A Legion 5i 15IAX10 and some Strix G615 rows both list a Core Ultra 9 275HX. Other rows do not.
5. Warranty terms in your country. Skip a street price until the SKU matches.

Legion 5 generations Lenovo PSREF lists

Legion 5 15AHP10, spec PDF dated 22 October 2026. Processor in that table: AMD Ryzen 7 260 (8 cores, 16 threads, 3.8 GHz base, up to 5.1 GHz). Graphics options: RTX 5050 or RTX 5060, each 8 GB GDDR7 at a 115 W TGP. Displays: a 15.1 inch 2560x1600 OLED, 1000 nits HDR peak and 500 nits SDR typical, 100% DCI-P3, 165 Hz, 1 ms response time, DisplayHDR True Black 600; or a 15.3 inch 1920x1200 IPS, 300 nits, 100% sRGB, 165 Hz variable refresh. Memory: two DDR5 SODIMM slots, DDR5-4800 or DDR5-5600, maximum offering 32 GB. Storage: two M.2 slots; Lenovo notes the first is PCIe 4.0 x4 and the second is PCIe 4.0 x2, with 2242 SSDs up to 1 TB each. Battery: 60 Wh or 80 Wh. Warranty options include 1-year, 2-year, and 3-year courier or carry-in service. Weight starts at 1.9 kg with the OLED panel and 2.1 kg with the IPS panel. Configurations vary.

Legion 5 15AHP11 configuration 83Q7005FKR (Lenovo Legion 5a 15 inch, generation 11, Korea). AMD Ryzen 7 250 (8 cores, 16 threads, 3.3 GHz base, up to 5.1 GHz). RTX 5070, 8 GB GDDR7, boost clock 2347 MHz, TGP 115 W. Memory: 2x 16 GB SODIMM DDR5-5600, two slots, maximum offering 32 GB DDR5-5600. Storage: 512 GB, two M.2 2280 PCIe 4.0 x4 slots, 2242 SSDs up to 2 TB each. Display: 15.3 inch 2560x1600 OLED, 1000 nits peak and 500 nits typical, glossy, 100% DCI-P3, 165 Hz, G-SYNC, DisplayHDR True Black 1000. Battery: 80 Wh. Weight starts at 1.87 kg. The warranty line on this configuration is 1-year courier or carry-in with a 2-year system board. Other 15AHP11 configurations can differ.

Legion 5i 15IAX10, spec PDF dated 26 October 2026. This is the Intel Legion 5i (15 inch, generation 10), not a guess. Processors: Core Ultra 7 255HX (20 cores, 20 threads, P-core up to 5.2 GHz) or Core Ultra 9 275HX (24 cores, 24 threads, P-core up to 5.4 GHz). Graphics: RTX 5050, RTX 5060, or RTX 5070, each 8 GB GDDR7 at a 115 W TGP. Display: 15.1 inch 2560x1600 OLED, 1000 nits HDR peak and 500 nits SDR typical, 100% DCI-P3, 165 Hz, DisplayHDR True Black 600. Memory: two DDR5 SODIMM slots, DDR5-4800 or DDR5-5600, maximum offering 32 GB. Storage: two M.2 2280 PCIe 4.0 x4 slots, 2242 SSDs up to 1 TB each. Battery: 80 Wh. Warranty options include 1-year, 2-year, and 3-year service, plus a Korea-only 2-year system board option, and a no-base-warranty option. Configurations vary.

Legion Pro 5 is a different 16 inch line. On Legion Pro 5 16AFR10, Lenovo PSREF lists a Ryzen 9 9955HX, an RTX 5060 8 GB at a 115 W TGP, and an RTX 5070 at a 115 W TGP in both 8 GB and 12 GB. Displays on that model list are 16 inch 2560x1600 OLED, 500 nits typical and 1100 nits peak, 100% DCI-P3, DisplayHDR True Black 1000, at 165 Hz or 240 Hz. Lenovo PSREF also lists Legion Pro 5 16IAX10 and Legion Pro 5 16ADR10. Read the machine type. A Pro 5 is not a Legion 5 15AHP10, 15AHP11, or 15IAX10.

Strix G16 2025, from ASUS

ASUS's 26 July 2025 GPU power list, Strix G16 rows, Turbo and Manual maximums:

- RTX 5080 on G615LW: 150 W TGP plus 25 W Dynamic Boost, 175 W maximum.
- RTX 5070 Ti on G615LR, G614FR, and G614PR: 115 W TGP plus 25 W Dynamic Boost, 140 W maximum.
- RTX 5070 on G615LP, G615JP, and G614FP: 100 W TGP plus 15 W Dynamic Boost, 115 W maximum.
- RTX 5060 on G615LM, G615JM, G614FM, and G614PM: 100 W plus 15 W, 115 W maximum.
- RTX 5050 on G615JH, G615LG, G614FH, and G614PH: 100 W plus 15 W, 115 W maximum.

The G615 spec rows match those power figures and add memory size: RTX 5050, RTX 5060, and RTX 5070 at 8 GB GDDR7 and 115 W; RTX 5070 Ti at 12 GB GDDR7 and 140 W; RTX 5080 at 16 GB GDDR7 and 175 W. Processors on those rows include Core Ultra 9 275HX, Core Ultra 7 255HX, Core i9-14900HX, Core i7-14650HX, and Core i5-13450HX. The CPU varies by configuration.

G615 panels, from the same spec rows: a 16 inch 1920x1200 IPS, 100% sRGB, 165 Hz, 3 ms, G-SYNC; a 16 inch ROG Nebula 2560x1600 IPS, 100% DCI-P3, 240 Hz, 3 ms on the rows that state a response time; or a 16 inch ROG Nebula 2560x1600 IPS with an anti-glare low-reflection surface, 100% DCI-P3, 300 Hz, 3 ms. ASUS's Q1 2025 product guide, in the Strix G16/G18 (G615/G815) description, calls the 2.5K 240 Hz Nebula a 16:10 panel with 500 nits, 100% DCI-P3, and a 3 ms response time. Battery on every G615 spec row: 90 Wh. The product guide spec box also lists 90 Wh, a 1-year global warranty with terms that may differ by country, and up to 32 GB DDR5-5600 in two SO-DIMM slots. The G615 DDR5 rows list two DDR5 SO-DIMM slots, a 64 GB maximum, and module descriptions that include 8 GB, 16 GB, and 32 GB. Storage rows list 1 TB or 2 TB PCIe 4.0 NVMe M.2, with two M.2 slots. The product guide lists a 16 inch weight of 2.7 kg for that spec box. Memory, storage, and the panel vary by configuration.

ASUS describes an end-to-end vapor chamber, a tri-fan layout, and liquid metal on the CPU and GPU in that product-guide section. That is a parts description. It is not a temperature or a noise measurement.

Three shopping matchups

Matchup A. Legion 5 15AHP11 configuration 83Q7005FKR against a Strix G16 RTX 5070 Ti. The Legion config is an RTX 5070, 8 GB, 115 W TGP, with a 15.3 inch 2560x1600 OLED at 165 Hz, 500 nits typical and 1000 nits peak, DisplayHDR True Black 1000, and 32 GB DDR5-5600. The Strix RTX 5070 Ti, on G615LR, G614FR, and G614PR, is 12 GB at 140 W maximum. If that Strix is the G615 1920x1200, 165 Hz, 100% sRGB IPS, the GPU power is higher and the panel is a lower-resolution IPS. If that Strix is the 2560x1600 Nebula, the pixel count matches and the panel type is still IPS rather than OLED.

Matchup B. Same GPU tier. An RTX 5070 at 115 W on Legion 5i 15IAX10, or the 115 W TGP on 15AHP11 configuration 83Q7005FKR, sits next to a Strix RTX 5070 at 115 W maximum (G615LP, G615JP, G614FP), both 8 GB GDDR7 on the rows cited here. Pick from the panel, the shipped RAM, and the price of those two SKUs. Legion 5 15AHP10 does not reach an RTX 5070. Its GPUs stop at an RTX 5060 at 115 W, which lines up with a Strix RTX 5060 at 115 W maximum.

Matchup C. Strix 2.5K Nebula against a Legion OLED. ASUS lists the G615 Nebula at 2560x1600, 100% DCI-P3, 240 Hz or 300 Hz. The Q1 2025 guide adds 500 nits for the 240 Hz Nebula description. That narrows the resolution gap against a Legion 2560x1600 OLED. It is still IPS against OLED. OLED versus Mini-LED is a separate panel choice, and QD-OLED versus WOLED is about monitor subpixels, not these laptop panels.

Buying tips

- Match the code in the title to a PSREF machine type or an ASUS model number before comparing prices.
- Compare maximum GPU power, not only the GPU name. A 115 W RTX 5070 and a 140 W RTX 5070 Ti are different configs.
- On a sale, a lower price can hide the 1920x1200 IPS, 16 GB of RAM, or a lower GPU.
- Warranty: ASUS's Q1 2025 guide lists a 1-year global warranty and says terms may differ by country. Lenovo PSREF lists 1-year, 2-year, and 3-year options on 15AHP10 and 15IAX10, and a 1-year warranty with a 2-year system board on 15AHP11 configuration 83Q7005FKR. Read the terms for your country.
- These sources do not rank brand reliability.

Related guides: Core Ultra 9 275HX vs Ryzen 9 9955HX for the CPUs in these laptops, RTX 5070 Ti Laptop vs RTX 5080 Laptop for those two laptop GPUs, OLED vs Mini-LED for panel basics, and QD-OLED vs WOLED for monitor subpixel types. Paths: /compare/intel-core-ultra-9-275hx-vs-amd-ryzen-9-9955hx, /compare/rtx-5070-ti-laptop-vs-rtx-5080-laptop, /compare/oled-vs-mini-led-gaming-monitor, /compare/qd-oled-vs-woled.`;

const SPEC = "Specs";

const BUILT = buildEditorialComparison({
  slug: "lenovo-legion-5-vs-asus-rog-strix-g16",
  title: "Lenovo Legion 5 vs ASUS ROG Strix G16",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Lenovo Legion 5",
      shortDesc:
        "15 inch Legion 5 generations 15AHP10, 15AHP11, and Intel 15IAX10. Panels and GPUs vary by configuration.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "2560x1600, 165 Hz OLED on 15AHP10, on 15AHP11 configuration 83Q7005FKR, and on 15IAX10 (Lenovo PSREF)",
        "Two DDR5 SODIMM slots and a 32 GB DDR5-5600 maximum offering on those three models",
        "Legion 5i 15IAX10 lists a Core Ultra 9 275HX option (Lenovo PSREF, 26 October 2026)",
      ],
      cons: [
        "15AHP10 stops at an RTX 5060, 8 GB, 115 W TGP. 15AHP11 configuration 83Q7005FKR and 15IAX10 stop at an RTX 5070, 8 GB, 115 W TGP",
        "15AHP10 also offers a 15.3 inch 1920x1200 IPS at 300 nits",
        "Warranty length changes by model and country",
      ],
      bestFor: "An OLED panel at 2560x1600 when the other laptop is a 1920x1200 IPS Strix",
    },
    {
      id: B,
      slug: B,
      name: "ASUS ROG Strix G16",
      shortDesc:
        "2025 Strix G16 in G615 and G614. GPU power, panel, and RAM vary by configuration.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "RTX 5070 Ti at 140 W maximum (G615LR, G614FR, G614PR) and RTX 5080 at 175 W maximum (G615LW), per ASUS on 26 July 2025",
        "G615 Nebula option: 16 inch 2560x1600 IPS, 100% DCI-P3, 240 Hz or 300 Hz",
        "90 Wh battery on every G615 spec row, and two SO-DIMM slots",
      ],
      cons: [
        "Some G615 rows are a 1920x1200, 165 Hz IPS at 100% sRGB",
        "RTX 5050, RTX 5060, and RTX 5070 G615 rows top out at 115 W maximum",
        "Q1 2025 product guide lists a 1-year global warranty, and says terms may differ by country",
      ],
      bestFor: "A listing whose model number is an RTX 5070 Ti at 140 W or an RTX 5080 at 175 W",
    },
  ],
  keyDifferences: [
    {
      label: "Highest GPU power on the cited configs",
      entityAValue: "RTX 5070 at a 115 W TGP on 15AHP11 and 15IAX10. 15AHP10 stops at RTX 5060, 115 W",
      entityBValue: "RTX 5080 at 175 W max on G615LW. RTX 5070 Ti at 140 W max on G615LR, G614FR, G614PR",
      winner: "tie",
    },
    {
      label: "OLED option",
      entityAValue: "2560x1600, 165 Hz OLED on 15AHP10, 15AHP11 config 83Q7005FKR, and 15IAX10",
      entityBValue: "G615 rows are IPS, including 2560x1600 Nebula and 1920x1200",
      winner: "tie",
    },
    {
      label: "Refresh on the high-resolution panel",
      entityAValue: "165 Hz on the OLED configs cited",
      entityBValue: "240 Hz or 300 Hz on the G615 2560x1600 Nebula. 165 Hz on the 1920x1200 IPS",
      winner: "tie",
    },
    {
      label: "Memory slots and listed maximum",
      entityAValue: "Two DDR5 SODIMM slots. Maximum offering 32 GB DDR5-5600",
      entityBValue: "Two SO-DIMM slots. DDR5 rows list a 64 GB maximum. Guide box lists up to 32 GB",
      winner: "tie",
    },
    {
      label: "Battery capacity",
      entityAValue: "80 Wh on 15AHP11 config 83Q7005FKR and on 15IAX10. 60 Wh or 80 Wh on 15AHP10",
      entityBValue: "90 Wh on every G615 spec row",
      winner: "tie",
    },
    {
      label: "Warranty in the sources",
      entityAValue: "1-year, 2-year, or 3-year options, depending on the model and country",
      entityBValue: "1-year global warranty in the Q1 2025 guide. Terms may differ by country",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "models",
      "Model codes",
      SPEC,
      A,
      B,
      "Legion 5 15AHP10, Legion 5 15AHP11, Legion 5i 15IAX10. Legion Pro 5 16AFR10 is a separate 16 inch line",
      "Strix G16 (2025) G615 spec rows, plus G614 model numbers on the 26 July 2025 power list"
    ),
    textAttr(
      "gpu-power",
      "GPU and power",
      SPEC,
      A,
      B,
      "15AHP10: RTX 5050 or 5060, 8 GB, 115 W TGP. 15AHP11 config 83Q7005FKR: RTX 5070, 8 GB, 115 W TGP. 15IAX10: RTX 5050, 5060, or 5070, 8 GB, 115 W TGP",
      "G615: RTX 5050/5060/5070 8 GB at 115 W max. RTX 5070 Ti 12 GB at 140 W max. RTX 5080 16 GB at 175 W max. Varies by G614/G615 model number"
    ),
    textAttr(
      "display",
      "Display",
      SPEC,
      A,
      B,
      "15AHP10: 15.1 inch 2560x1600 OLED, True Black 600, or 15.3 inch 1920x1200 IPS at 300 nits. 15AHP11 config 83Q7005FKR: 15.3 inch 2560x1600 OLED, True Black 1000. 15IAX10: 15.1 inch 2560x1600 OLED, True Black 600",
      "G615: 16 inch 1920x1200 165 Hz IPS, 100% sRGB, or 16 inch 2560x1600 Nebula IPS, 100% DCI-P3, 240 Hz or 300 Hz"
    ),
    textAttr(
      "brightness",
      "Brightness as rated",
      SPEC,
      A,
      B,
      "OLED configs: 500 nits typical and 1000 nits peak (15AHP11) or 1000 nits HDR peak and 500 nits SDR typical (15AHP10 and 15IAX10). 15AHP10 IPS: 300 nits",
      "Q1 2025 guide: 500 nits on the 2.5K 240 Hz Nebula description (G615/G815). Other G615 panel rows state resolution, gamut, and refresh"
    ),
    textAttr(
      "refresh",
      "Refresh",
      SPEC,
      A,
      B,
      "165 Hz on the OLED configs. 165 Hz variable refresh on the 15AHP10 IPS",
      "165 Hz on 1920x1200. 240 Hz or 300 Hz on 2560x1600 Nebula. 3 ms on the rows that state a response time"
    ),
    textAttr(
      "memory",
      "Memory",
      SPEC,
      A,
      B,
      "Two DDR5 SODIMM slots. Up to 32 GB DDR5-5600 offering. 15AHP11 config 83Q7005FKR ships 2x 16 GB",
      "Two SO-DIMM slots. DDR5-5600 rows list a 64 GB maximum. Q1 2025 spec box lists up to 32 GB DDR5-5600. Varies by configuration"
    ),
    textAttr(
      "storage",
      "Storage",
      SPEC,
      A,
      B,
      "Two M.2 slots. 15AHP10: second slot PCIe 4.0 x2, 2242 up to 1 TB. 15AHP11 config: two PCIe 4.0 x4 slots, 2242 up to 2 TB, 512 GB shipped",
      "G615 rows: 1 TB or 2 TB PCIe 4.0 NVMe M.2, and two M.2 slots on the DDR5 expansion lines"
    ),
    textAttr(
      "battery",
      "Battery",
      SPEC,
      A,
      B,
      "80 Wh on 15AHP11 config 83Q7005FKR and on 15IAX10. 60 Wh or 80 Wh on 15AHP10",
      "90 Wh on every G615 spec row, and 90 Wh in the Q1 2025 spec box"
    ),
    textAttr(
      "cpu",
      "CPU examples",
      SPEC,
      A,
      B,
      "15AHP10: Ryzen 7 260. 15AHP11 config 83Q7005FKR: Ryzen 7 250. 15IAX10: Core Ultra 7 255HX or Core Ultra 9 275HX",
      "G615 rows include Core Ultra 9 275HX, Core Ultra 7 255HX, Core i9-14900HX, Core i7-14650HX, and Core i5-13450HX"
    ),
    textAttr(
      "warranty",
      "Warranty",
      SPEC,
      A,
      B,
      "15AHP10 and 15IAX10: 1-year, 2-year, or 3-year options. 15AHP11 config 83Q7005FKR: 1-year with a 2-year system board",
      "Q1 2025 guide: 1-year global warranty. Terms may differ by country"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "intel-core-ultra-9-275hx-vs-amd-ryzen-9-9955hx",
      title: "Core Ultra 9 275HX vs Ryzen 9 9955HX",
      category: "technology",
    },
    {
      slug: "rtx-5070-ti-laptop-vs-rtx-5080-laptop",
      title: "RTX 5070 Ti Laptop vs RTX 5080 Laptop",
      category: "technology",
    },
    {
      slug: "oled-vs-mini-led-gaming-monitor",
      title: "OLED vs Mini-LED Gaming Monitor",
      category: "technology",
    },
    {
      slug: "qd-oled-vs-woled",
      title: "QD-OLED vs WOLED",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Strix G16 when the SKU is an RTX 5070 Ti at 140 W maximum or an RTX 5080 at 175 W maximum. Legion 5 when the panel is the 2560x1600 OLED and the Strix is a 1920x1200 IPS. Neither line is the right laptop for every configuration.",
    keyFact:
      "ASUS lists Strix G16 maximum GPU power of 140 W for an RTX 5070 Ti on G615LR, G614FR, and G614PR, and 175 W for an RTX 5080 on G615LW. Lenovo PSREF lists an RTX 5070 at a 115 W TGP on Legion 5 15AHP11 configuration 83Q7005FKR.",
  },
  citationStats: {
    sourceCount: 7,
    dataPointCount: 52,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Lenovo PSREF: Legion 5 15AHP11 configuration 83Q7005FKR", url: PSREF_15AHP11 },
      { name: "Lenovo PSREF: Legion 5 15AHP10 spec PDF", url: PSREF_15AHP10 },
      { name: "Lenovo PSREF: Legion 5 15IAX10 spec PDF", url: PSREF_15IAX10 },
      { name: "Lenovo PSREF: Legion Pro 5 16AFR10", url: PSREF_PRO_16AFR10 },
      { name: "ASUS ROG: Strix G16 (2025) G615 specs", url: ASUS_G615 },
      { name: "ASUS ROG: 2025 GeForce GPU power list", url: ASUS_TGP },
      { name: "ASUS ROG Product Guide Q1 2025", url: ASUS_GUIDE },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Lenovo PSREF: Legion 5 15AHP11 configuration 83Q7005FKR",
      url: PSREF_15AHP11,
      description:
        "Ryzen 7 250, RTX 5070 8 GB GDDR7 at TGP 115 W, 2x 16 GB DDR5-5600, two SODIMM slots, maximum 32 GB, 15.3 inch 2560x1600 OLED at 1000 nits peak and 500 nits typical, 165 Hz, DisplayHDR True Black 1000, 80 Wh battery, 1-year warranty with a 2-year system board.",
    },
    {
      type: "external",
      label: "Lenovo PSREF: Legion 5 15AHP10 spec PDF",
      url: PSREF_15AHP10,
      description:
        "PDF footer 22 October 2026. Ryzen 7 260. RTX 5050 and RTX 5060, each 8 GB GDDR7 at 115 W TGP. 15.1 inch 2560x1600 OLED, True Black 600, or 15.3 inch 1920x1200 IPS at 300 nits. Two DDR5 SODIMM slots, up to 32 GB. Battery 60 Wh or 80 Wh.",
    },
    {
      type: "external",
      label: "Lenovo PSREF: Legion 5 15IAX10 spec PDF",
      url: PSREF_15IAX10,
      description:
        "PDF footer 26 October 2026. Legion 5i. Core Ultra 7 255HX or Core Ultra 9 275HX. RTX 5050, 5060, or 5070, each 8 GB GDDR7 at 115 W TGP. 15.1 inch 2560x1600 OLED, True Black 600, 165 Hz. Two DDR5 SODIMM slots, up to 32 GB. 80 Wh battery.",
    },
    {
      type: "external",
      label: "Lenovo PSREF: Legion Pro 5 16AFR10",
      url: PSREF_PRO_16AFR10,
      description:
        "Separate 16 inch Pro line. Ryzen 9 9955HX. RTX 5060 8 GB and RTX 5070 in 8 GB or 12 GB, each at a 115 W TGP. 16 inch 2560x1600 OLED, 500 nits typical and 1100 nits peak, True Black 1000, 165 Hz or 240 Hz.",
    },
    {
      type: "external",
      label: "ASUS ROG: Strix G16 (2025) G615 specs",
      url: ASUS_G615,
      description:
        "G615 rows: RTX 5050, 5060, and 5070 at 8 GB GDDR7 and 115 W; RTX 5070 Ti at 12 GB and 140 W; RTX 5080 at 16 GB and 175 W. Panels: 1920x1200 165 Hz IPS, or 2560x1600 Nebula at 240 Hz or 300 Hz. 90 Wh battery. DDR5 rows list a 64 GB maximum and two SO-DIMM slots.",
    },
    {
      type: "external",
      label: "ASUS ROG: 2025 GeForce GPU power list",
      url: ASUS_TGP,
      description:
        "26 July 2025. Strix G16: G615LW RTX 5080 at 175 W maximum. G615LR, G614FR, and G614PR RTX 5070 Ti at 140 W maximum. RTX 5070, 5060, and 5050 Strix G16 rows at 115 W maximum.",
    },
    {
      type: "external",
      label: "ASUS ROG Product Guide Q1 2025",
      url: ASUS_GUIDE,
      description:
        "Strix G16/G18 (G615/G815) section: 2.5K 240 Hz Nebula at 500 nits, 100% DCI-P3, 3 ms. Spec box: up to 32 GB DDR5-5600 in two SO-DIMM slots, 90 Wh, 1-year global warranty, terms may differ by country, 16 inch weight 2.7 kg.",
    },
  ],
  metaTitle: "Legion 5 vs ROG Strix G16",
});

BUILT.metadata.metaDescription =
  "Legion 5 vs ROG Strix G16 by GPU power, panel, and RAM. Specs vary across 15AHP10, 15AHP11, 15IAX10, G615, and G614.";

export const LENOVO_LEGION_5_VS_ASUS_ROG_STRIX_G16: EditorialComparison = BUILT;
