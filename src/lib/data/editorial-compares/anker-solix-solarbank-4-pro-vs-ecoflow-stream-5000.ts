import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-129 — Anker SOLIX Solarbank 4 Pro vs EcoFlow STREAM 5000.
 * Output, IP rating, weight, and warranty are from Anker's datasheet
 * (linked on ankersolix.com) and EcoFlow's EU specs page, fetched 2026-09-30.
 * No page-level winner. No claim that either system is legal to plug in,
 * and no German feed-in watt cap.
 */

const ANKER = "anker-solix-solarbank-4-pro";
const ECO = "ecoflow-stream-5000";

const ANKER_PAGE = "https://www.ankersolix.com/de/products/ae103";
const ANKER_DATASHEET =
  "https://cdn.shopify.com/s/files/1/0901/2612/3357/files/Datasheet_20260610_AE103_DE.pdf";
const ECO_SPECS = "https://www.ecoflow.com/eu/stream-series-plug-and-play-solar-battery/specs";
const ECO_SUPPORT = "https://www.ecoflow.com/eu/stream-series-plug-and-play-solar-battery/support";
const ECO_PRODUCT = "https://eu.ecoflow.com/products/stream-series-solar-battery";
const ANKER_HA = "https://github.com/anker-charging/ha-anker-solix-official/blob/main/README.md";

const FETCHED = "2026-09-30";
const PUBLISHED = "2026-09-30T00:00:00Z";

const SHORT_ANSWER =
  "Choose the EcoFlow STREAM 5000 if you want the higher published output: up to 3,000 W on-grid and off-grid, at 45.4 kg. Choose the Anker SOLIX Solarbank 4 Pro if IP66 and Anker's Home Assistant integration matter more. Its on-grid settings top out at 2,500 W and it weighs 50 kg. Both are 5,024 Wh LiFePO4 packs with 5,000 W of PV input across four MPPTs. This page does not say either system is legal to plug in. Check current local rules and VDE requirements. This page does not crown a winner.";

const FAQS = [
  {
    question: "Does the Solarbank 4 Pro or the STREAM 5000 have more storage?",
    answer:
      "The published pack size is the same: 5,024 Wh. Anker's datasheet lists LiFePO4 and 5,024 Wh. EcoFlow's specs page lists 5,024 Wh, and EcoFlow's product FAQ says the cells are lithium iron phosphate (LiFePO4). Storage size alone does not separate them.",
  },
  {
    question: "Which system can feed more power into the home?",
    answer:
      "The EcoFlow STREAM 5000, on the published upper settings. EcoFlow's specs page lists on-grid output of 800 W/3,000 W and off-grid output of 3,000 W. Anker's datasheet lists on-grid output settings of 600, 790, 800, and 2,500 W, and off-grid output of 2,500 W. Whether you may use the upper setting depends on current local rules. This page does not state a feed-in watt cap.",
  },
  {
    question: "Which is better for outdoor mounting?",
    answer:
      "Anker's datasheet lists IP66. EcoFlow's specs page lists IP65. Those are the published codes. This page does not add a hose test of its own. EcoFlow's support page says the STREAM 5000 can be used indoors or outdoors and recommends a ventilated, cool, shaded place.",
  },
  {
    question: "Do they accept the same solar input?",
    answer:
      "Both publish 5,000 W of PV across four MPPTs, 1,250 W per tracker, and a maximum PV voltage of 60 V. Anker's datasheet also lists an MPPT voltage range of 16 to 50 V. EcoFlow's specs page lists the PV input voltage as a 60 V maximum and does not print that 16 to 50 V range.",
  },
  {
    question: "Which works with Home Assistant?",
    answer:
      "Anker's official Home Assistant README lists the Solarbank 4 E5000 Pro, over local Modbus TCP. EcoFlow's STREAM specs page and support page, fetched on 30 September 2026, do not document a Home Assistant integration or an open local API. Check the current docs before you buy, because that can change.",
  },
  {
    question: "Are these simple 800 W plug-in balcony kits?",
    answer:
      "No. Both are about 5 kWh storage systems with multi-kilowatt inverter settings. 800 W is one published on-grid setting on each sheet, not the whole product. EcoFlow's support page says the STREAM 5000 limits grid output to whatever local rules allow, and that in Germany a system inside the simplified connection limits must be registered in the Marktstammdatenregister, with the distribution operator notified. EcoFlow does not print a watt cap in that answer. This page does not say either system is legal to plug in. Check current local rules and VDE requirements, and use a qualified electrician where those rules require one.",
  },
];

const VERDICT = `Higher published output: EcoFlow STREAM 5000. On-grid and off-grid output are listed up to 3,000 W, and the specs page lists 45.4 kg.

Weather rating and Home Assistant: Anker SOLIX Solarbank 4 Pro. The datasheet lists IP66, 50 kg, and on-grid settings up to 2,500 W. Anker's Home Assistant README includes this model.

Same storage on the spec sheets: 5,024 Wh LiFePO4, 5,000 W PV, four MPPTs. This page does not say either system is legal to plug in, and it does not state a German feed-in limit. Check current local rules and VDE requirements.

There is no single winner on this page.`;

const EXPERT_ANALYSIS = `The EcoFlow STREAM 5000 is the pick when the higher published inverter output is the point. The Anker SOLIX Solarbank 4 Pro is the pick when IP66 and the documented Home Assistant integration matter more than that extra output. This page does not crown a winner.

Source note: output, ingress rating, weight, and warranty below come from Anker's datasheet linked on the German Solarbank 4 E5000 Pro product page, and from EcoFlow's EU specs page, both fetched on 30 September 2026. Cycle life and expansion for Anker come from that product page. EcoFlow chemistry, the 60% retention note, and expansion come from EcoFlow's product FAQ. The Germany registration sentence comes from EcoFlow's support page. Home Assistant support comes from Anker's official integration README. This page does not say either system is legal to plug in, and it does not state a German feed-in watt cap.

Battery and solar input

Anker's datasheet lists a LiFePO4 battery, 5,024 Wh, and a single-device rated power of 2,500 W. EcoFlow's specs page lists 5,024 Wh. EcoFlow's product FAQ says the cells are lithium iron phosphate (LiFePO4). Both publish 5,000 W of PV input, four MPPTs, and 1,250 W per tracker. Both list a maximum PV voltage of 60 V. Anker also lists an MPPT operating range of 16 to 50 V.

On-grid and off-grid output

Anker's datasheet lists on-grid AC output settings of 600 W, 790 W, 800 W, and 2,500 W, and off-grid output of 2,500 W. AC charge power is 2,500 W. EcoFlow's specs page lists grid-tied output of 800 W/3,000 W, off-grid output of 3,000 W, AC charging input of 3,000 W, and a maximum charge into the main-unit battery of 2,500 W. The product page says a higher output connection to the distribution board has to be done by a certified electrician or qualified professional.

Cycles, warranty, weather, and weight

Anker's product page lists 10,000 cycles. The datasheet lists a 10-year warranty and a 15-year product lifespan. It does not print a capacity-retention percentage next to the cycle count. EcoFlow's specs page lists 10,000 cycles and a 10-year warranty. EcoFlow's product FAQ says that cycle life is to 60% retention. Anker's datasheet lists IP66 and 50 kg. EcoFlow's specs page lists IP65 and 45.4 kg. The product FAQ also says 45.4 kg, plus or minus 0.5 kg, for the bare unit.

Expansion

Anker's product page says the main unit is 5,024 Wh and can take five BP5000 expansion batteries, up to 30 kWh total. EcoFlow's product FAQ says one host can stack up to two expansion batteries, to 15 kWh, and a system can include up to six hosts, to 90 kWh. Those are the published ceilings. They are different ecosystems, so a pack from one does not fit the other.

Home Assistant and local rules

Anker's official Home Assistant README lists the Solarbank 4 E5000 Pro for every firmware version it covers, using local Modbus TCP. EcoFlow's specs and support pages fetched on 30 September 2026 do not document that kind of integration.

EcoFlow's support page says that, on the grid, the STREAM 5000 limits output to the maximum local rules allow. In Germany, it says a system operating within the applicable simplified connection limits must be registered in the Marktstammdatenregister, and the local distribution operator must be notified. That answer does not give a watt number. Anker's product page describes the 2,500 W on-grid output as needing a circuit adaptation. This page does not treat either sentence as permission to plug in. Check the current local rules and the current VDE requirements before you install.

Who should buy which

Choose the STREAM 5000 if the published 3,000 W on-grid and off-grid ceiling, and the 45.4 kg weight, are what you are buying for.

Choose the Solarbank 4 Pro if IP66 and the Home Assistant integration matter more than the output gap, and 2,500 W on-grid is enough.

Choose neither from this page alone if the open question is whether your balcony circuit may use those upper settings. That answer is in the current local rules, not in a spec row.`;

const SPEC = "Specs · manufacturer pages, fetched 2026-09-30";

export const ANKER_SOLARBANK_4_PRO_VS_ECOFLOW_STREAM_5000: EditorialComparison = buildEditorialComparison({
  slug: "anker-solix-solarbank-4-pro-vs-ecoflow-stream-5000",
  title: "Anker SOLIX Solarbank 4 Pro vs EcoFlow STREAM 5000",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "products",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: ANKER,
      slug: ANKER,
      name: "Anker SOLIX Solarbank 4 Pro",
      shortDesc:
        "5,024 Wh LiFePO4 balcony battery with 5,000 W PV input, on-grid settings up to 2,500 W, IP66, and a listed Home Assistant integration.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "IP66 and 50 kg (Anker datasheet)",
        "5,024 Wh LiFePO4, 5,000 W PV, four MPPTs (Anker datasheet)",
        "On-grid settings of 600, 790, 800, and 2,500 W",
        "10-year warranty and a 15-year product lifespan on the datasheet",
        "Listed in Anker's official Home Assistant integration",
      ],
      cons: [
        "On-grid and off-grid output top out at 2,500 W, against 3,000 W on the STREAM 5000",
        "50 kg, against 45.4 kg on EcoFlow's specs page",
        "The 10,000-cycle line is on the product page, not in the datasheet's retention note",
      ],
      bestFor: "Best if IP66 and Home Assistant matter more than output",
    },
    {
      id: ECO,
      slug: ECO,
      name: "EcoFlow STREAM 5000",
      shortDesc:
        "5,024 Wh LiFePO4 battery with 5,000 W PV input, up to 3,000 W on-grid and off-grid output, IP65, and a 45.4 kg weight.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "Up to 3,000 W on-grid and 3,000 W off-grid (EcoFlow specs)",
        "45.4 kg, IP65, 10-year warranty (EcoFlow specs)",
        "5,024 Wh and 10,000 cycles to 60% retention (EcoFlow specs and product FAQ)",
        "Up to two expansion batteries, 15 kWh on a host, and up to 90 kWh with six hosts",
      ],
      cons: [
        "IP65, against IP66 on the Solarbank 4 Pro",
        "EcoFlow's fetched specs and support pages do not document a Home Assistant integration",
        "The upper output still depends on local rules. This page does not call it legal to plug in",
      ],
      bestFor: "Best if you want the higher published output",
    },
  ],
  keyDifferences: [
    {
      label: "Who it is for",
      entityAValue: "IP66 and Home Assistant",
      entityBValue: "Higher published output",
      winner: "tie",
    },
    {
      label: "On-grid output",
      entityAValue: "600, 790, 800, or 2,500 W",
      entityBValue: "800 W or 3,000 W",
      winner: "b",
    },
    {
      label: "Off-grid output",
      entityAValue: "2,500 W",
      entityBValue: "3,000 W",
      winner: "b",
    },
    {
      label: "Ingress rating",
      entityAValue: "IP66",
      entityBValue: "IP65",
      winner: "a",
    },
    {
      label: "Weight",
      entityAValue: "50 kg",
      entityBValue: "45.4 kg",
      winner: "b",
    },
    {
      label: "Home Assistant",
      entityAValue: "Listed in Anker's official integration",
      entityBValue: "Not documented on the EcoFlow pages fetched",
      winner: "a",
    },
  ],
  attributes: [
    textAttr("capacity", "Battery", SPEC, ANKER, ECO, "5,024 Wh LiFePO4", "5,024 Wh LiFePO4"),
    textAttr(
      "pv",
      "PV input",
      SPEC,
      ANKER,
      ECO,
      "5,000 W, 4 MPPTs, 1,250 W each, 60 V max, MPPT range 16–50 V",
      "5,000 W, 4 MPPTs, 1,250 W each, 60 V max"
    ),
    textAttr(
      "ongrid",
      "On-grid output",
      SPEC,
      ANKER,
      ECO,
      "600, 790, 800, or 2,500 W",
      "800 W or 3,000 W",
      "b"
    ),
    textAttr("offgrid", "Off-grid output", SPEC, ANKER, ECO, "2,500 W", "3,000 W", "b"),
    textAttr(
      "ac-charge",
      "AC charging",
      SPEC,
      ANKER,
      ECO,
      "Up to 2,500 W",
      "Up to 3,000 W input, 2,500 W into the main battery",
      "b"
    ),
    textAttr(
      "cycles",
      "Cycles and warranty",
      "Cycles and warranty · Anker product page and datasheet, EcoFlow specs and FAQ, fetched 2026-09-30",
      ANKER,
      ECO,
      "10,000 cycles (product page); 10-year warranty and 15-year lifespan (datasheet)",
      "10,000 cycles to 60% retention; 10-year warranty"
    ),
    textAttr("ingress", "Ingress rating", SPEC, ANKER, ECO, "IP66", "IP65", "a"),
    textAttr("weight", "Weight", SPEC, ANKER, ECO, "50 kg", "45.4 kg", "b"),
    textAttr(
      "expansion",
      "Published expansion",
      "Expansion · manufacturer product pages, fetched 2026-09-30",
      ANKER,
      ECO,
      "Main unit plus 5 BP5000 packs, up to 30 kWh",
      "Up to 2 expansion batteries (15 kWh on a host); up to six hosts (90 kWh)"
    ),
    textAttr(
      "home-assistant",
      "Home Assistant",
      "Home Assistant · Anker README, fetched 2026-09-30",
      ANKER,
      ECO,
      "Solarbank 4 E5000 Pro is listed",
      "Not documented on the EcoFlow pages fetched",
      "a"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "EcoFlow STREAM 5000 for the higher published output. Anker SOLIX Solarbank 4 Pro for IP66 and Home Assistant.",
    keyFact:
      "Both list 5,024 Wh and 5,000 W of PV across four MPPTs. Anker's on-grid settings top out at 2,500 W and IP66. EcoFlow lists up to 3,000 W and IP65. Check local rules and VDE requirements before you install.",
  },
  citationStats: {
    sourceCount: 6,
    dataPointCount: 10,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: FETCHED,
    sources: [
      { name: "Anker SOLIX — Solarbank 4 E5000 Pro (fetched 2026-09-30)", url: ANKER_PAGE },
      { name: "Anker SOLIX — Solarbank 4 E5000 Pro datasheet (fetched 2026-09-30)", url: ANKER_DATASHEET },
      { name: "EcoFlow — STREAM series specs (fetched 2026-09-30)", url: ECO_SPECS },
      { name: "EcoFlow — STREAM series support (fetched 2026-09-30)", url: ECO_SUPPORT },
      { name: "EcoFlow — STREAM series product FAQ (fetched 2026-09-30)", url: ECO_PRODUCT },
      { name: "Anker — official Home Assistant README (fetched 2026-09-30)", url: ANKER_HA },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Anker SOLIX Solarbank 4 E5000 Pro",
      url: ANKER_PAGE,
      description:
        "Fetched 2026-09-30. German product page. 5,024 Wh, IP66, 50 kg, 10,000 cycles, and expansion up to 30 kWh with five BP5000 packs.",
    },
    {
      type: "external",
      label: "Anker datasheet (Datasheet_20260610_AE103_DE.pdf)",
      url: ANKER_DATASHEET,
      description:
        "Fetched 2026-09-30 from the product page. On-grid 600/790/800/2,500 W, off-grid 2,500 W, IP66, 50 kg, 10-year warranty, 15-year lifespan.",
    },
    {
      type: "external",
      label: "EcoFlow STREAM specs",
      url: ECO_SPECS,
      description:
        "Fetched 2026-09-30. 5,024 Wh, 800 W/3,000 W grid-tied, 3,000 W off-grid, IP65, 45.4 kg, 10-year warranty.",
    },
    {
      type: "external",
      label: "EcoFlow STREAM support",
      url: ECO_SUPPORT,
      description:
        "Fetched 2026-09-30. Output is limited to local rules. In Germany, simplified-connection systems must be registered. No watt cap is printed there.",
    },
    {
      type: "external",
      label: "EcoFlow STREAM product FAQ",
      url: ECO_PRODUCT,
      description:
        "Fetched 2026-09-30. LiFePO4, 10,000 cycles to 60% retention, 45.4 kg plus or minus 0.5 kg, expansion to 15 kWh and 90 kWh.",
    },
    {
      type: "external",
      label: "Anker Solix official Home Assistant integration",
      url: ANKER_HA,
      description:
        "Fetched 2026-09-30. README lists the Solarbank 4 E5000 Pro. Local Modbus TCP. Developed by Anker Innovations.",
    },
    {
      type: "blog",
      label: "Anker Solix hub",
      url: "/entity/anker-solix",
      description: "AversusB entity hub for the Anker Solix line.",
    },
    {
      type: "blog",
      label: "EcoFlow Stream hub",
      url: "/entity/ecoflow-stream",
      description: "AversusB entity hub for the EcoFlow Stream line.",
    },
  ],
  metaTitle: "Solarbank 4 Pro vs STREAM 5000 | A Versus B",
});
