import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-208: Canada vs United States.
 * World Bank indicators (2025 GDP and population, 2024 life expectancy),
 * Statistics Canada / Natural Resources Canada geography, U.S. Census Bureau
 * state areas and trade with Canada, Health Canada, U.S. Census health
 * insurance 2024, House of Commons, USAGov, Official Languages Act, EO 14224.
 * Facts read 18 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-18T00:00:00Z";
const SOURCE_DATE = "2026-10-18";

const WB_GDP = "https://data.worldbank.org/indicator/NY.GDP.MKTP.CD?locations=CA-US";
const WB_GDP_PC = "https://data.worldbank.org/indicator/NY.GDP.PCAP.CD?locations=CA-US";
const WB_PPP_PC = "https://data.worldbank.org/indicator/NY.GDP.PCAP.PP.CD?locations=CA-US";
const WB_POP = "https://data.worldbank.org/indicator/SP.POP.TOTL?locations=CA-US";
const WB_LIFE = "https://data.worldbank.org/indicator/SP.DYN.LE00.IN?locations=CA-US";
const STATCAN_GEO = "https://www150.statcan.gc.ca/n1/pub/11-402-x/2012000/chap/geo/geo-eng.htm";
const STATCAN_AREA = "https://www150.statcan.gc.ca/n1/pub/11-402-x/2012000/chap/geo/tbl/tbl06-eng.htm";
const CENSUS_AREA = "https://www.census.gov/geographies/reference-files/2010/geo/state-area.html";
const CENSUS_TRADE = "https://www.census.gov/foreign-trade/balance/c1220.html";
const HEALTH_CANADA = "https://www.canada.ca/en/health-canada/services/canada-health-care-system.html";
const CENSUS_HEALTH = "https://www.census.gov/library/publications/2025/demo/p60-288.html";
const COMMONS = "https://www.ourcommons.ca/procedure/our-procedure/parliamentaryFramework/c_g_parliamentaryframework-e.html";
const USAGOV = "https://www.usa.gov/branches-of-government";
const OLA = "https://laws-lois.justice.gc.ca/eng/acts/o-3.01/page-1.html";
const EO_14224 = "https://www.whitehouse.gov/presidential-actions/2025/03/designating-english-as-the-official-language-of-the-united-states/";

const SHORT_ANSWER =
  "Canada is larger by total area (9,984,670 km² against 9,833,517 km²), while the United States has about 8.2 times as many people (341.8 million against 41.7 million in 2025) and an economy about 13 times as large ($30.77 trillion against $2.32 trillion in 2025, World Bank). GDP per person was $90,027 in the U.S. and $55,698 in Canada, or $66,746 for Canada at purchasing power parity. Life expectancy at birth was 82.1 years in Canada and 78.9 in the U.S. in 2024. Neither is better for everyone: the right pick depends on what you are comparing.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Area: Canada 9,984,670 km² in total, the second-largest country in the world; the United States 9,833,517 km². On land alone the U.S. is slightly larger, 9,147,593 km² against 9,093,507 km².
- People: 341,784,857 in the U.S. and 41,651,653 in Canada (World Bank, 2025).
- Economy: U.S. GDP $30.77 trillion and Canada $2.32 trillion (current US dollars, 2025).
- Per person: $90,027 in the U.S. and $55,698 in Canada; at purchasing power parity Canada rises to $66,746 (current international dollars).
- Health: 82.1 years of life expectancy at birth in Canada and 78.9 in the U.S. (2024).

Economy: total size against size per person

The U.S. economy was about 13 times Canada's in 2025, close to its 8.2 times larger population, so the gap per person is smaller than the gap in totals. In current US dollars, GDP per person was $90,027 in the U.S. and $55,698 in Canada. Purchasing power parity adjusts for price levels: on that basis Canada's figure rises to $66,746, while the U.S. figure stays at $90,027 because the international dollar is set to the US dollar.

Government and political system

Canada is a constitutional monarchy and parliamentary democracy in the Westminster tradition, with three parts to Parliament: the Crown, the Senate and the House of Commons. The U.S. Constitution splits the federal government into legislative, executive and judicial branches, and the president is head of state, leader of the executive branch and commander in chief of the armed forces. Both are federations: Canada has provinces and territories, the U.S. has 50 states and the District of Columbia.

Official languages

English and French are the official languages of Canada, with equal status in federal institutions under the Constitution and the Official Languages Act. In the United States, Executive Order 14224 of 1 March 2025 designated English as the official language; it does not require federal agencies to stop offering services in other languages.

Healthcare systems

Health Canada describes a universal system funded through taxes: each province and territory runs its own public health insurance plan, which covers medically necessary hospital and physician services under national standards set in the Canada Health Act. Drugs, dental, vision and home care are not fully covered for everyone, and people pay for them directly or through private insurance unless a provincial program covers them. In the U.S., 92.0% of people had health insurance for some or all of 2024; private coverage reached 66.1% and public coverage 35.5%, with employment-based insurance the most common type at 53.8%.

Geography

Canada's freshwater area is 891,163 km², and its coastline of 243,042 km on three oceans is the longest in the world. The two countries share an 8,890 km land border, the longest international border in the world. U.S. water area, including inland, coastal, Great Lakes and territorial waters, is 685,924 km².

Trade between the two

U.S. Census Bureau goods trade data for 2025: U.S. exports to Canada $333.6 billion and imports from Canada $381.9 billion, a U.S. goods deficit of $48.3 billion. In 2024 the figures were $350.6 billion, $411.8 billion and a $61.2 billion deficit.

Canada may suit you if

1. You are comparing a country with a smaller population across a larger total area.
2. Public health insurance run by the province or territory is the model you want to understand.
3. You work in both English and French.

The United States may suit you if

1. You are comparing the larger economy and population.
2. You want the higher GDP per person, both in current dollars and at purchasing power parity.
3. You are looking at a presidential system with separate branches.

How to compare

Use figures from the same year and the same source for both countries. Nominal GDP and GDP at purchasing power parity answer different questions: market size against living standards adjusted for prices.`;

const FAQS = [
  {
    question: "Is Canada bigger than the United States?",
    answer:
      "By total area, yes: Canada covers 9,984,670 km² and the U.S. 9,833,517 km². On land alone the U.S. is slightly larger, 9,147,593 km² against Canada's 9,093,507 km², because Canada has 891,163 km² of fresh water.",
  },
  {
    question: "Which has a higher GDP per capita, Canada or the US?",
    answer:
      "The United States. World Bank data for 2025 put U.S. GDP per person at $90,027 and Canada's at $55,698, or $66,746 for Canada at purchasing power parity.",
  },
  {
    question: "Which country has more people?",
    answer:
      "The United States, with 341,784,857 people in 2025 against Canada's 41,651,653, about 8.2 times as many.",
  },
  {
    question: "Is healthcare free in Canada?",
    answer:
      "Medically necessary hospital and physician services are covered by each province's or territory's public plan and funded through taxes, so there is no charge at the point of care for those services. Prescription drugs, dental, vision and home care are not fully covered for everyone.",
  },
  {
    question: "What languages are official in Canada and the US?",
    answer:
      "English and French are the official languages of Canada. In the U.S., Executive Order 14224 of 1 March 2025 designated English as the official language.",
  },
  {
    question: "How much trade is there between Canada and the US?",
    answer:
      "In 2025 the U.S. exported $333.6 billion of goods to Canada and imported $381.9 billion from Canada, according to the U.S. Census Bureau.",
  },
  {
    question: "Is Canada part of the United States?",
    answer:
      "No. Canada is a separate country with its own Parliament: the Crown, the Senate and the House of Commons.",
  },
];

const BUILT = buildEditorialComparison({
  slug: "canada-vs-united-states",
  title: "Canada vs United States: Size, Economy and Government",
  shortAnswer: SHORT_ANSWER,
  verdict:
    "Canada: larger total area (9,984,670 km²), 41.7 million people, life expectancy 82.1 years.\n\nUnited States: about 8.2 times the population, a $30.77 trillion economy and $90,027 GDP per person.",
  category: "countries",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: "canada",
      slug: "canada",
      name: "Canada",
      shortDesc: "Second-largest country by total area; 41.7 million people in 2025.",
      imageUrl: null,
      entityType: "place",
      position: 0,
      pros: [
        "Total area of 9,984,670 km²",
        "Life expectancy at birth of 82.1 years (2024)",
        "Universal, tax-funded public health insurance",
      ],
      cons: [
        "GDP per person of $55,698 (2025)",
        "Slightly less land area than the U.S.",
      ],
      bestFor: "Comparing area, public health insurance and a bilingual federal system",
    },
    {
      id: "united-states",
      slug: "united-states",
      name: "United States",
      shortDesc: "341.8 million people and a $30.77 trillion economy in 2025.",
      imageUrl: null,
      entityType: "place",
      position: 1,
      pros: [
        "GDP of $30.77 trillion (2025)",
        "GDP per person of $90,027 (2025)",
        "Land area of 9,147,593 km²",
      ],
      cons: [
        "Life expectancy at birth of 78.9 years (2024)",
        "8.0% without health insurance at any point in 2024",
      ],
      bestFor: "Comparing economic size, income per person and a presidential system",
    },
  ],
  keyDifferences: [
    { label: "Total area", entityAValue: "9,984,670 km²", entityBValue: "9,833,517 km²", winner: "tie" },
    { label: "Population (2025)", entityAValue: "41,651,653", entityBValue: "341,784,857", winner: "tie" },
    { label: "GDP (2025)", entityAValue: "$2.32 trillion", entityBValue: "$30.77 trillion", winner: "tie" },
    { label: "GDP per person (2025)", entityAValue: "$55,698", entityBValue: "$90,027", winner: "tie" },
    { label: "Life expectancy (2024)", entityAValue: "82.1 years", entityBValue: "78.9 years", winner: "tie" },
  ],
  attributes: [
    textAttr("a0", "Population (2025)", "People", "canada", "united-states", "41,651,653", "341,784,857"),
    textAttr("a1", "Life expectancy at birth (2024)", "People", "canada", "united-states", "82.1 years", "78.9 years"),
    textAttr("a2", "Total area", "Geography", "canada", "united-states", "9,984,670 km²", "9,833,517 km²"),
    textAttr("a3", "Land area", "Geography", "canada", "united-states", "9,093,507 km²", "9,147,593 km²"),
    textAttr("a4", "Water area", "Geography", "canada", "united-states", "891,163 km² fresh water", "685,924 km² (inland, coastal, Great Lakes, territorial)"),
    textAttr("a5", "GDP, current US$ (2025)", "Economy", "canada", "united-states", "$2,319.9 billion", "$30,769.7 billion"),
    textAttr("a6", "GDP per person, current US$ (2025)", "Economy", "canada", "united-states", "$55,698", "$90,027"),
    textAttr("a7", "GDP per person, PPP (2025)", "Economy", "canada", "united-states", "$66,746", "$90,027"),
    textAttr("a8", "Goods trade with the other (2025)", "Economy", "canada", "united-states", "$381.9 billion sold to the U.S.", "$333.6 billion sold to Canada"),
    textAttr("a9", "Government", "Government", "canada", "united-states", "Constitutional monarchy and parliamentary democracy; federal", "Federal government with legislative, executive and judicial branches; president as head of state"),
    textAttr("a10", "Official languages", "Government", "canada", "united-states", "English and French", "English (Executive Order 14224, 2025)"),
    textAttr("a11", "Health coverage", "Health", "canada", "united-states", "Provincial and territorial public plans under the Canada Health Act", "92.0% insured in 2024; 66.1% private, 35.5% public"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "mexico-vs-united-states",
      title: "Mexico vs United States: 2020 Census Facts",
      category: "countries",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Canada is larger by total area and has the longer life expectancy; the United States has the larger population, economy and GDP per person.",
    keyFact:
      "World Bank 2025: U.S. GDP $30.77 trillion and 341.8 million people; Canada $2.32 trillion and 41.7 million people.",
  },
  citationStats: {
    sourceCount: 15,
    dataPointCount: 30,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "World Bank: GDP (current US$)", url: WB_GDP },
      { name: "World Bank: GDP per capita (current US$)", url: WB_GDP_PC },
      { name: "World Bank: GDP per capita, PPP (current international $)", url: WB_PPP_PC },
      { name: "World Bank: Population, total", url: WB_POP },
      { name: "World Bank: Life expectancy at birth", url: WB_LIFE },
      { name: "Statistics Canada: Canada's geography", url: STATCAN_GEO },
      { name: "Statistics Canada: Land and freshwater area", url: STATCAN_AREA },
      { name: "U.S. Census Bureau: State area measurements", url: CENSUS_AREA },
      { name: "U.S. Census Bureau: Trade in goods with Canada", url: CENSUS_TRADE },
      { name: "Health Canada: Canada's health care system", url: HEALTH_CANADA },
      { name: "U.S. Census Bureau: Health Insurance Coverage in the United States: 2024", url: CENSUS_HEALTH },
      { name: "House of Commons: Parliamentary framework", url: COMMONS },
      { name: "USAGov: Branches of the U.S. government", url: USAGOV },
      { name: "Justice Laws: Official Languages Act", url: OLA },
      { name: "The White House: Executive Order 14224", url: EO_14224 },
    ],
  },
  resources: [
    { type: "external", label: "World Bank: GDP (current US$)", url: WB_GDP, description: "2025: Canada $2,319.9 billion; United States $30,769.7 billion." },
    { type: "external", label: "World Bank: GDP per capita (current US$)", url: WB_GDP_PC, description: "2025: Canada $55,698; United States $90,027." },
    { type: "external", label: "World Bank: GDP per capita, PPP (current international $)", url: WB_PPP_PC, description: "2025: Canada $66,746; United States $90,027." },
    { type: "external", label: "World Bank: Population, total", url: WB_POP, description: "2025: Canada 41,651,653; United States 341,784,857." },
    { type: "external", label: "World Bank: Life expectancy at birth", url: WB_LIFE, description: "2024: Canada 82.1 years; United States 78.9 years." },
    { type: "external", label: "Statistics Canada: Canada's geography", url: STATCAN_GEO, description: "Total area 9,984,670 km², second-largest country. 8,890 km land border with the United States. Coastline 243,042 km. Freshwater area 891,163 km²." },
    { type: "external", label: "Statistics Canada: Land and freshwater area", url: STATCAN_AREA, description: "Land 9,093,507 km²; freshwater 891,163 km²; total 9,984,670 km² (Natural Resources Canada)." },
    { type: "external", label: "U.S. Census Bureau: State area measurements", url: CENSUS_AREA, description: "United States total area 9,833,517 km² (3,796,742 sq mi); land 9,147,593 km²; water 685,924 km²." },
    { type: "external", label: "U.S. Census Bureau: Trade in goods with Canada", url: CENSUS_TRADE, description: "2025: exports $333,619.7 million, imports $381,922.1 million, balance -$48,302.3 million. 2024: $350,605.6 million, $411,771.6 million, -$61,166.0 million." },
    { type: "external", label: "Health Canada: Canada's health care system", url: HEALTH_CANADA, description: "Universal system funded through taxes; provincial and territorial health insurance plans; Canada Health Act standards." },
    { type: "external", label: "U.S. Census Bureau: Health Insurance Coverage in the United States: 2024", url: CENSUS_HEALTH, description: "92.0% insured for some or all of 2024; private 66.1%, public 35.5%; employment-based 53.8%." },
    { type: "external", label: "House of Commons: Parliamentary framework", url: COMMONS, description: "Canada is a constitutional monarchy and parliamentary democracy: the Crown, the Senate and the House of Commons." },
    { type: "external", label: "USAGov: Branches of the U.S. government", url: USAGOV, description: "Legislative, executive and judicial branches; the president is head of state." },
    { type: "external", label: "Justice Laws: Official Languages Act", url: OLA, description: "English and French are the official languages of Canada." },
    { type: "external", label: "The White House: Executive Order 14224", url: EO_14224, description: "1 March 2025: English is the official language of the United States." },
  ],
  metaTitle: "Canada vs United States | A Versus B",
});

BUILT.metadata.metaDescription =
  "Canada vs United States: area, population, GDP and GDP per person (nominal and PPP), life expectancy, government, languages, healthcare and trade.";

export const CANADA_VS_UNITED_STATES: EditorialComparison = BUILT;
