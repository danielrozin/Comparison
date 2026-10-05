import type { CitationStats, ComparisonResource } from "@/types";
import type { NamedAttribute, NamedCell, NamedFact } from "@/lib/data/nba-2026-season-overlays";

/**
 * Official scorecard cells for compare pages whose stored tables still
 * disagree with a primary source. Each figure below was read from the linked
 * source. Cells that could not be verified are not in this file.
 *
 * IMF World Economic Outlook, April 2026 (current-dollar billions, dollars
 * per person, and real growth percent for 2026):
 * https://www.imf.org/external/datamapper/api/v1/NGDPD/USA/CHN/JPN
 * https://www.imf.org/external/datamapper/api/v1/NGDPDPC/USA/CHN/JPN
 * https://www.imf.org/external/datamapper/api/v1/NGDP_RPCH/USA/CHN/JPN
 * https://www.imf.org/-/media/files/publications/weo/2026/april/english/text.pdf
 *
 * SIPRI military expenditure, 2024 (fact sheet, 28 April 2025):
 * https://www.sipri.org/sites/default/files/2025-04/2504_fs_milex_2024.pdf
 *
 * World Bank life expectancy, 2024, SP.DYN.LE00.IN:
 * https://data.worldbank.org/indicator/SP.DYN.LE00.IN
 *
 * UNDP Human Development Report 2025, Table 2 (2023 values):
 * https://hdr.undp.org/sites/default/files/2025_HDR/HDR25_Statistical_Annex_HDI_Trends_Table.pdf
 */

export interface OfficialFact extends NamedFact {
  /** Which stored metric this row replaces. See metricHit. */
  metric: string;
  slug: string;
  category: string;
}

export interface OfficialPack {
  facts: OfficialFact[];
  rows: NamedAttribute[];
  citationStats: CitationStats;
  resources: ComparisonResource[];
  metricMerge: true;
}

const CHECKED = "2026-10-05";

const IMF_NGDPD = "https://www.imf.org/external/datamapper/api/v1/NGDPD/USA/CHN/JPN";
const IMF_NGDPDPC = "https://www.imf.org/external/datamapper/api/v1/NGDPDPC/USA/CHN/JPN";
const IMF_GROWTH = "https://www.imf.org/external/datamapper/api/v1/NGDP_RPCH/USA/CHN/JPN";
const IMF_WEO = "https://www.imf.org/-/media/files/publications/weo/2026/april/english/text.pdf";
const SIPRI_PDF = "https://www.sipri.org/sites/default/files/2025-04/2504_fs_milex_2024.pdf";
const SIPRI_RELEASE =
  "https://www.sipri.org/media/press-release/2025/unprecedented-rise-global-military-expenditure-european-and-middle-east-spending-surges";
const WORLD_BANK_LE = "https://data.worldbank.org/indicator/SP.DYN.LE00.IN";
const UNDP_HDI =
  "https://hdr.undp.org/sites/default/files/2025_HDR/HDR25_Statistical_Annex_HDI_Trends_Table.pdf";
const UBER_10K = "https://www.sec.gov/Archives/edgar/data/1543151/000154315125000008/uber-20241231.htm";
const UBER_RELEASE =
  "https://investor.uber.com/news-events/news/press-release-details/2025/Uber-Announces-Results-for-Fourth-Quarter-and-Full-Year-2024/";
const LYFT_10K = "https://www.sec.gov/Archives/edgar/data/1759509/000175950925000025/lyft-20241231.htm";
const SONY_PS5 =
  "https://blog.playstation.com/archive/2020/03/18/unveiling-new-details-of-playstation-5-hardware-technical-specs";
const XBOX_SPECS = "https://www.xbox.com/en-US/consoles/xbox-series-x";
const GAME_PASS = "https://www.xbox.com/en-US/xbox-game-pass";
const FIGMA_PRICING = "https://www.figma.com/pricing/";
const SKETCH_PRICING = "https://www.sketch.com/pricing/";
const CURSOR_PRICING = "https://cursor.com/pricing";
const COPILOT_PLANS = "https://github.com/features/copilot/plans";
const STATCOUNTER = "https://gs.statcounter.com/os-market-share/mobile/worldwide";
const NVIDIA_CAP = "https://companiesmarketcap.com/nvidia/marketcap/";
const AMD_CAP = "https://companiesmarketcap.com/amd/marketcap/";

const IMF = "IMF WEO April 2026";

export const US_NOMINAL = `$32.38 trillion, ${IMF}`;
export const CN_NOMINAL = `$20.85 trillion, ${IMF}`;
export const JP_NOMINAL = `$4.38 trillion, ${IMF}`;
export const US_PER_CAPITA = `$94,430, ${IMF}`;
export const CN_PER_CAPITA = `$14,874, ${IMF}`;
export const JP_PER_CAPITA = `$35,703, ${IMF}`;
export const US_GROWTH = `2.3%, ${IMF}`;
export const CN_GROWTH = `4.4%, ${IMF}`;
export const JP_GROWTH = `0.7%, ${IMF}`;
export const US_MILITARY = "$997 billion, SIPRI 2024";
export const CN_MILITARY = "$314 billion estimated, SIPRI 2024";
export const JP_MILITARY = "$55.3 billion, SIPRI 2024";
export const JP_LIFE = "84.04 years, World Bank 2024";
export const CN_LIFE = "78.02 years, World Bank 2024";
export const JP_HDI = "0.925, Very high, rank 23, UNDP HDR 2025 (2023)";
export const CN_HDI = "0.797, High, rank 78, UNDP HDR 2025 (2023)";
export const UBER_REVENUE = "$43.978 billion, FY2024";
export const LYFT_REVENUE = "$5.786 billion, FY2024";
export const PS5_GPU = "10.3 TFLOPS, Sony";
export const XBOX_GPU = "12 TFLOPS, Xbox";
export const PS5_DRIVE = "825GB SSD (drive size, not usable space), Sony";
export const XBOX_DRIVE = "1TB custom NVMe SSD (drive size), Xbox";
export const PS_PLUS = "PS Plus";
export const GAME_PASS_TIERS =
  "Essential, Premium, Ultimate, and PC. Ultimate lists 500+ games. No dollar price on the current US plan list.";
export const FIGMA_PRICE = "Professional full seat $16/mo";
export const SKETCH_PRICE = "No $9/mo or $99/yr price is listed on sketch.com/pricing";
export const CURSOR_PRICE = "Pro $20/mo; Teams $40/user/mo";
export const COPILOT_PRICE = "Free $0; Pro $10/mo; Pro+ $39/mo; Max $100/mo";
export const ANDROID_SHARE = "67.61%, StatCounter August 2026";
export const IOS_SHARE = "32.36%, StatCounter August 2026";
export const NVIDIA_CAP_TEXT = "$5.563 trillion as of October 1, 2026";
export const AMD_CAP_TEXT = "$1.034 trillion as of October 2, 2026";

const US_MATCH = {
  match: "united states",
  also: ["usa", "us economy", "us-economy", "united-states"],
};
const CN_MATCH = { match: "china" };
const JP_MATCH = { match: "japan" };

function side(
  who: { match: string; also?: string[] },
  text: string,
  winner?: boolean,
): NamedCell {
  return { ...who, text, ...(winner ? { winner: true } : {}) };
}

function fact(
  metric: string,
  label: string,
  slug: string,
  category: string,
  a: NamedCell,
  b: NamedCell,
): OfficialFact {
  return { metric, label, slug, category, cells: [a, b] };
}

function pack(
  facts: OfficialFact[],
  sources: { name: string; url: string }[],
): OfficialPack {
  return {
    facts,
    rows: facts.map((item) => ({
      slug: item.slug,
      name: item.label,
      category: item.category,
      cells: item.cells,
    })),
    metricMerge: true,
    citationStats: {
      sourceCount: sources.length,
      dataPointCount: facts.length * 2,
      reviewsAnalyzed: null,
      preferencePercent: null,
      preferenceEntity: null,
      lastResearched: CHECKED,
      sources,
    },
    resources: sources.map((source) => ({
      type: "external" as const,
      label: source.name,
      url: source.url,
    })),
  };
}

const IMF_SOURCES = [
  { name: "IMF datamapper, nominal GDP (NGDPD), April 2026 WEO", url: IMF_NGDPD },
  { name: "IMF datamapper, GDP per capita (NGDPDPC), April 2026 WEO", url: IMF_NGDPDPC },
  { name: "IMF datamapper, real GDP growth (NGDP_RPCH), April 2026 WEO", url: IMF_GROWTH },
  { name: "IMF World Economic Outlook, April 2026", url: IMF_WEO },
];

const SIPRI_SOURCES = [
  { name: "SIPRI military expenditure fact sheet, 2024", url: SIPRI_PDF },
  { name: "SIPRI press release, 28 April 2025", url: SIPRI_RELEASE },
];

function usChinaEconomyFacts(): OfficialFact[] {
  return [
    fact(
      "nominal gdp",
      "Nominal GDP",
      "nominal-gdp",
      "Economy",
      side(US_MATCH, US_NOMINAL, true),
      side(CN_MATCH, CN_NOMINAL),
    ),
    fact(
      "gdp per capita",
      "GDP per capita",
      "gdp-per-capita",
      "Economy",
      side(US_MATCH, US_PER_CAPITA, true),
      side(CN_MATCH, CN_PER_CAPITA),
    ),
    fact(
      "gdp growth",
      "2026 real GDP growth",
      "gdp-growth",
      "Economy",
      side(US_MATCH, US_GROWTH),
      side(CN_MATCH, CN_GROWTH, true),
    ),
  ];
}

function usChinaMilitaryFact(): OfficialFact {
  return fact(
    "defense spending",
    "Defense spending",
    "defense-spending",
    "Military",
    side(US_MATCH, US_MILITARY, true),
    side(CN_MATCH, CN_MILITARY),
  );
}

export const US_CHINA_GDP_SCORECARD = pack(
  [...usChinaEconomyFacts(), usChinaMilitaryFact()],
  [...IMF_SOURCES, ...SIPRI_SOURCES],
);

export const US_ECONOMY_CHINA_SCORECARD = pack(usChinaEconomyFacts(), IMF_SOURCES);

export const USA_CHINA_SCORECARD = US_CHINA_GDP_SCORECARD;

export const JAPAN_CHINA_SCORECARD = pack(
  [
    fact(
      "nominal gdp",
      "Nominal GDP",
      "nominal-gdp",
      "Economy",
      side(JP_MATCH, JP_NOMINAL),
      side(CN_MATCH, CN_NOMINAL, true),
    ),
    fact(
      "gdp per capita",
      "GDP per capita",
      "gdp-per-capita",
      "Economy",
      side(JP_MATCH, JP_PER_CAPITA, true),
      side(CN_MATCH, CN_PER_CAPITA),
    ),
    fact(
      "gdp growth",
      "2026 real GDP growth",
      "gdp-growth",
      "Economy",
      side(JP_MATCH, JP_GROWTH),
      side(CN_MATCH, CN_GROWTH, true),
    ),
    fact(
      "defense spending",
      "Defense spending",
      "defense-spending",
      "Military",
      side(JP_MATCH, JP_MILITARY),
      side(CN_MATCH, CN_MILITARY, true),
    ),
    fact(
      "life expectancy",
      "Life expectancy",
      "life-expectancy",
      "Quality of Life",
      side(JP_MATCH, JP_LIFE, true),
      side(CN_MATCH, CN_LIFE),
    ),
    fact(
      "hdi",
      "HDI",
      "hdi",
      "Quality of Life",
      side(JP_MATCH, JP_HDI, true),
      side(CN_MATCH, CN_HDI),
    ),
  ],
  [
    ...IMF_SOURCES,
    ...SIPRI_SOURCES,
    { name: "World Bank, life expectancy at birth (SP.DYN.LE00.IN)", url: WORLD_BANK_LE },
    { name: "UNDP Human Development Report 2025, Table 2", url: UNDP_HDI },
  ],
);

export const LYFT_UBER_SCORECARD = pack(
  [
    fact(
      "annual revenue",
      "Annual Revenue",
      "annual-revenue",
      "Business",
      side({ match: "uber" }, UBER_REVENUE, true),
      side({ match: "lyft" }, LYFT_REVENUE),
    ),
  ],
  [
    { name: "Uber FY2024 Form 10-K", url: UBER_10K },
    { name: "Uber FY2024 results press release", url: UBER_RELEASE },
    { name: "Lyft FY2024 Form 10-K", url: LYFT_10K },
  ],
);

export const PS5_SCORECARD = pack(
  [
    fact(
      "gpu",
      "GPU",
      "gpu",
      "Hardware",
      side({ match: "playstation", also: ["ps5"] }, PS5_GPU),
      side({ match: "xbox" }, XBOX_GPU, true),
    ),
    fact(
      "console storage",
      "SSD capacity",
      "ssd-capacity",
      "Hardware",
      side({ match: "playstation", also: ["ps5"] }, PS5_DRIVE),
      side({ match: "xbox" }, XBOX_DRIVE),
    ),
    fact(
      "subscription",
      "Subscription",
      "subscription",
      "Services",
      side({ match: "playstation", also: ["ps5"] }, PS_PLUS),
      side({ match: "xbox" }, GAME_PASS_TIERS),
    ),
  ],
  [
    { name: "PlayStation.Blog, PS5 hardware specs", url: SONY_PS5 },
    { name: "Xbox Series X console page", url: XBOX_SPECS },
    { name: "Xbox Game Pass", url: GAME_PASS },
  ],
);

export const FIGMA_SCORECARD = pack(
  [
    fact(
      "figma price",
      "Price",
      "price",
      "Pricing",
      side({ match: "figma" }, FIGMA_PRICE),
      side({ match: "sketch" }, SKETCH_PRICE),
    ),
  ],
  [
    { name: "Figma pricing", url: FIGMA_PRICING },
    { name: "Sketch pricing", url: SKETCH_PRICING },
  ],
);

export const CURSOR_SCORECARD = pack(
  [
    fact(
      "cursor price",
      "Pricing",
      "pricing",
      "Pricing",
      side({ match: "cursor" }, CURSOR_PRICE),
      side({ match: "copilot" }, COPILOT_PRICE, true),
    ),
  ],
  [
    { name: "Cursor pricing", url: CURSOR_PRICING },
    { name: "GitHub Copilot plans", url: COPILOT_PLANS },
  ],
);

export const ANDROID_SCORECARD = pack(
  [
    fact(
      "market share",
      "Global market share",
      "global-market-share",
      "Adoption",
      side({ match: "android" }, ANDROID_SHARE, true),
      side({ match: "ios" }, IOS_SHARE),
    ),
  ],
  [{ name: "StatCounter, mobile OS market share worldwide", url: STATCOUNTER }],
);

export const NVIDIA_SCORECARD = pack(
  [
    fact(
      "market cap",
      "Market cap",
      "market-cap",
      "Business",
      side({ match: "nvidia" }, NVIDIA_CAP_TEXT, true),
      side({ match: "amd" }, AMD_CAP_TEXT),
    ),
  ],
  [
    { name: "CompaniesMarketCap, NVIDIA", url: NVIDIA_CAP },
    { name: "CompaniesMarketCap, AMD", url: AMD_CAP },
  ],
);

/**
 * True when a stored row is the same metric as an official replacement.
 * Matching is exact on the canonical name, plus a few labels the live tables
 * use for that same metric ("Total GDP", "Military Budget", "HDI Rank").
 */
export function metricHit(canonical: string, metric: string): boolean {
  if (!canonical) return false;
  if (metric === "nominal gdp") {
    if (canonical === "gdp" || canonical === "nominal gdp") return true;
    if (!canonical.includes("gdp") || !canonical.includes("nominal")) return false;
    return !/(capita|growth|ppp|debt|manufactur)/.test(canonical);
  }
  if (metric === "gdp per capita") return canonical === "gdp per capita";
  if (metric === "gdp growth") return canonical === "gdp growth";
  if (metric === "defense spending") {
    const military = canonical.includes("defense") || canonical.includes("military");
    const money =
      canonical.includes("spend") || canonical.includes("budget") || canonical.includes("expenditure");
    return military && money;
  }
  if (metric === "life expectancy") return canonical.includes("life") && canonical.includes("expectancy");
  if (metric === "hdi") {
    return canonical.includes("hdi") || (canonical.includes("human") && canonical.includes("development"));
  }
  if (metric === "annual revenue") {
    return canonical.includes("revenue") && !canonical.includes("diversification") && !canonical.includes("growth");
  }
  if (metric === "market share") {
    return canonical.includes("market") && canonical.includes("share") && !canonical.includes("rideshare");
  }
  if (metric === "market cap") {
    return canonical.includes("market") && (canonical.includes("cap") || canonical.includes("capitalization"));
  }
  if (metric === "gpu") return canonical.includes("gpu") || canonical.includes("tflop");
  if (metric === "subscription") return canonical.includes("subscription") || canonical.includes("game pass");
  if (metric === "figma price") return canonical === "price" || canonical.includes("pricing");
  if (metric === "cursor price") {
    return canonical.includes("pricing") || canonical.includes("price") || canonical === "business tier";
  }
  if (metric === "console storage") {
    if (canonical.includes("speed")) return false;
    return (
      canonical.includes("storage") ||
      canonical.includes("capacity") ||
      canonical.includes("drive") ||
      canonical.includes("usable")
    );
  }
  return canonical === metric;
}
