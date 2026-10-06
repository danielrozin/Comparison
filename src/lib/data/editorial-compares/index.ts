import type { ComparisonPageData } from "@/types";
import { SIGNAL_VS_WHATSAPP } from "./signal-vs-whatsapp";
import { SIGNAL_VS_TELEGRAM } from "./signal-vs-telegram";
import { WHATSAPP_VS_TELEGRAM } from "./whatsapp-vs-telegram";
import { IPHONE_17_VS_17_PRO_VS_16_PRO } from "./iphone-17-vs-iphone-17-pro-vs-iphone-16-pro";
import { CARHARTT_VS_DICKIES } from "./carhartt-vs-dickies";
import { SAMSUNG_GALAXY_S24_ULTRA_VS_S25_ULTRA } from "./samsung-galaxy-s24-ultra-vs-samsung-galaxy-s25-ultra";
import { IPHONE_16E_VS_IPHONE_17E } from "./iphone-16e-vs-iphone-17e";
import { POLAROID_GO_GEN_2_VS_INSTAX_MINI } from "./polaroid-go-gen-2-vs-fujifilm-instax-mini";
import { GALAXY_Z_FOLD_7_VS_S26_ULTRA } from "./galaxy-z-fold-7-vs-samsung-galaxy-s26-ultra";
import { GOOGLE_MAPS_VS_APPLE_MAPS } from "./google-maps-vs-apple-maps";
import { GOOGLE_MAPS_VS_WAZE } from "./google-maps-vs-waze";
import { BRAVE_VS_CHROME } from "./brave-vs-chrome";
import { IPHONE_17_VS_IPHONE_AIR } from "./iphone-17-vs-iphone-air";
import { CHROME_VS_SAFARI } from "./chrome-vs-safari";
import { IPHONE_17_PRO_VS_S25_ULTRA_VS_S26_ULTRA } from "./iphone-17-pro-vs-samsung-galaxy-s25-ultra-vs-samsung-galaxy-s26-ultra";
import { ANKER_SOLARBANK_4_PRO_VS_ECOFLOW_STREAM_5000 } from "./anker-solix-solarbank-4-pro-vs-ecoflow-stream-5000";
import { IPHONE_17_PRO_VS_IPHONE_18_PRO } from "./iphone-17-pro-vs-iphone-18-pro";
import { KNICKS_VS_76ERS } from "./knicks-vs-76ers";
import { SGA_VS_WEMBANYAMA } from "./shai-gilgeous-alexander-vs-victor-wembanyama";
import { OKLAHOMA_CITY_THUNDER_VS_SPURS } from "./oklahoma-city-thunder-vs-spurs";
import { KNICKS_VS_SPURS } from "./knicks-vs-spurs";
import { FLAGG_VS_WEMBANYAMA } from "./flagg-vs-wembanyama";
import { APPLE_WATCH_SERIES_12_VS_FITBIT_AIR } from "./apple-watch-series-12-vs-fitbit-air";
import { DAMIAN_LILLARD_VS_JA_MORANT } from "./damian-lillard-vs-ja-morant";
import { LEBRON_JAMES_VS_STEPHEN_CURRY } from "./lebron-james-vs-stephen-curry";
import { JORDAN_VS_KOBE } from "./jordan-vs-kobe";
import { COOPER_FLAGG_VS_KON_KNUEPPEL } from "./cooper-flagg-vs-kon-knueppel";
import { LAKERS_VS_CELTICS } from "./lakers-vs-celtics";
import { DURANT_VS_LEBRON } from "./durant-vs-lebron";
import { EMBIID_VS_JOKIC } from "./embiid-vs-jokic";
import { KOBE_BRYANT_VS_STEPH_CURRY } from "./kobe-bryant-vs-steph-curry";
import { JAVA_VS_TYPESCRIPT } from "./java-vs-typescript";
import { HONDA_VS_FORD } from "./honda-vs-ford";
import { MICROSOFT_WORD_VS_LIBREOFFICE } from "./microsoft-word-vs-libreoffice";
import { COINBASE_VS_BINANCE } from "./coinbase-vs-binance";
import { VENMO_VS_ZELLE } from "./venmo-vs-zelle";
import { KINDLE_VS_KOBO } from "./kindle-vs-kobo";
import { MACBOOK_AIR_VS_IPAD_AIR } from "./macbook-air-vs-ipad-air";
import { GALAXY_Z_FLIP_8_VS_S26_ULTRA } from "./galaxy-z-flip-8-vs-galaxy-s26-ultra";
import { GALAXY_S25_VS_GALAXY_S25_FE } from "./galaxy-s25-vs-galaxy-s25-fe";
import { GALAXY_S25_VS_GALAXY_S25_PLUS } from "./galaxy-s25-vs-galaxy-s25-plus";
import { MAC_MINI_M6_VS_WINDOWS_PC } from "./mac-mini-m6-vs-windows-pc";
import { CASHIERS_CHECK_VS_MONEY_ORDER } from "./cashiers-check-vs-money-order";
import { CASHIERS_CHECK_VS_CERTIFIED_CHECK } from "./cashiers-check-vs-certified-check";
import { RX_9070_XT_VS_RTX_5080 } from "./rx-9070-xt-vs-rtx-5080";
import type { EditorialComparison } from "./types";

export type { EditorialComparison } from "./types";
export { EDITORIAL_COMPARE_PUBLISHED_AT, EDITORIAL_COMPARE_UPDATED_AT } from "./types";

/**
 * ROO-27 / ROO-28 — human-reviewed messaging compares shipped in-repo.
 *
 * These are not the bundled mock fixtures. They carry `metadata.status =
 * "published"` so `/compare/[slug]`, FAQ/answer APIs, sitemap, and entity
 * discovery treat them as catalog pages even before a prod-DB publish
 * workflow runs. `saveComparison` via
 * `scripts/publish-messaging-compares-roo27.ts` can still upsert the same
 * payload into Postgres after merge.
 */
const EDITORIAL_COMPARES: Record<string, EditorialComparison> = {
  [SIGNAL_VS_WHATSAPP.slug]: SIGNAL_VS_WHATSAPP,
  [SIGNAL_VS_TELEGRAM.slug]: SIGNAL_VS_TELEGRAM,
  [WHATSAPP_VS_TELEGRAM.slug]: WHATSAPP_VS_TELEGRAM,
  [IPHONE_17_VS_17_PRO_VS_16_PRO.slug]: IPHONE_17_VS_17_PRO_VS_16_PRO,
  [CARHARTT_VS_DICKIES.slug]: CARHARTT_VS_DICKIES,
  [SAMSUNG_GALAXY_S24_ULTRA_VS_S25_ULTRA.slug]: SAMSUNG_GALAXY_S24_ULTRA_VS_S25_ULTRA,
  [IPHONE_16E_VS_IPHONE_17E.slug]: IPHONE_16E_VS_IPHONE_17E,
  [POLAROID_GO_GEN_2_VS_INSTAX_MINI.slug]: POLAROID_GO_GEN_2_VS_INSTAX_MINI,
  [GALAXY_Z_FOLD_7_VS_S26_ULTRA.slug]: GALAXY_Z_FOLD_7_VS_S26_ULTRA,
  [GOOGLE_MAPS_VS_APPLE_MAPS.slug]: GOOGLE_MAPS_VS_APPLE_MAPS,
  [GOOGLE_MAPS_VS_WAZE.slug]: GOOGLE_MAPS_VS_WAZE,
  [BRAVE_VS_CHROME.slug]: BRAVE_VS_CHROME,
  [IPHONE_17_VS_IPHONE_AIR.slug]: IPHONE_17_VS_IPHONE_AIR,
  [CHROME_VS_SAFARI.slug]: CHROME_VS_SAFARI,
  [IPHONE_17_PRO_VS_S25_ULTRA_VS_S26_ULTRA.slug]: IPHONE_17_PRO_VS_S25_ULTRA_VS_S26_ULTRA,
  [ANKER_SOLARBANK_4_PRO_VS_ECOFLOW_STREAM_5000.slug]: ANKER_SOLARBANK_4_PRO_VS_ECOFLOW_STREAM_5000,
  [IPHONE_17_PRO_VS_IPHONE_18_PRO.slug]: IPHONE_17_PRO_VS_IPHONE_18_PRO,
  [KNICKS_VS_76ERS.slug]: KNICKS_VS_76ERS,
  [SGA_VS_WEMBANYAMA.slug]: SGA_VS_WEMBANYAMA,
  [OKLAHOMA_CITY_THUNDER_VS_SPURS.slug]: OKLAHOMA_CITY_THUNDER_VS_SPURS,
  [KNICKS_VS_SPURS.slug]: KNICKS_VS_SPURS,
  [FLAGG_VS_WEMBANYAMA.slug]: FLAGG_VS_WEMBANYAMA,
  [APPLE_WATCH_SERIES_12_VS_FITBIT_AIR.slug]: APPLE_WATCH_SERIES_12_VS_FITBIT_AIR,
  [DAMIAN_LILLARD_VS_JA_MORANT.slug]: DAMIAN_LILLARD_VS_JA_MORANT,
  [LEBRON_JAMES_VS_STEPHEN_CURRY.slug]: LEBRON_JAMES_VS_STEPHEN_CURRY,
  [JORDAN_VS_KOBE.slug]: JORDAN_VS_KOBE,
  [COOPER_FLAGG_VS_KON_KNUEPPEL.slug]: COOPER_FLAGG_VS_KON_KNUEPPEL,
  [LAKERS_VS_CELTICS.slug]: LAKERS_VS_CELTICS,
  [DURANT_VS_LEBRON.slug]: DURANT_VS_LEBRON,
  [EMBIID_VS_JOKIC.slug]: EMBIID_VS_JOKIC,
  [KOBE_BRYANT_VS_STEPH_CURRY.slug]: KOBE_BRYANT_VS_STEPH_CURRY,
  [JAVA_VS_TYPESCRIPT.slug]: JAVA_VS_TYPESCRIPT,
  [HONDA_VS_FORD.slug]: HONDA_VS_FORD,
  [MICROSOFT_WORD_VS_LIBREOFFICE.slug]: MICROSOFT_WORD_VS_LIBREOFFICE,
  [COINBASE_VS_BINANCE.slug]: COINBASE_VS_BINANCE,
  [VENMO_VS_ZELLE.slug]: VENMO_VS_ZELLE,
  [KINDLE_VS_KOBO.slug]: KINDLE_VS_KOBO,
  [MACBOOK_AIR_VS_IPAD_AIR.slug]: MACBOOK_AIR_VS_IPAD_AIR,
  [GALAXY_Z_FLIP_8_VS_S26_ULTRA.slug]: GALAXY_Z_FLIP_8_VS_S26_ULTRA,
  [GALAXY_S25_VS_GALAXY_S25_FE.slug]: GALAXY_S25_VS_GALAXY_S25_FE,
  [GALAXY_S25_VS_GALAXY_S25_PLUS.slug]: GALAXY_S25_VS_GALAXY_S25_PLUS,
  [MAC_MINI_M6_VS_WINDOWS_PC.slug]: MAC_MINI_M6_VS_WINDOWS_PC,
  [CASHIERS_CHECK_VS_MONEY_ORDER.slug]: CASHIERS_CHECK_VS_MONEY_ORDER,
  [CASHIERS_CHECK_VS_CERTIFIED_CHECK.slug]: CASHIERS_CHECK_VS_CERTIFIED_CHECK,
  [RX_9070_XT_VS_RTX_5080.slug]: RX_9070_XT_VS_RTX_5080,
};

/**
 * Related links a live DB row does not already carry. Applied at read time so
 * /compare/patagonia-vs-rei can point at Carhartt vs Dickies without rewriting
 * that page's FAQs or scorecard.
 */
const EDITORIAL_INBOUND_RELATED: Record<string, ComparisonPageData["relatedComparisons"]> = {
  "patagonia-vs-rei": [
    {
      slug: "carhartt-vs-dickies",
      title: "Carhartt vs Dickies",
      category: "brands",
    },
  ],
};

export function appendEditorialRelatedLinks(page: ComparisonPageData): ComparisonPageData {
  const extra = EDITORIAL_INBOUND_RELATED[page.slug];
  if (!extra?.length) return page;
  const seen = new Set(page.relatedComparisons.map((item) => item.slug));
  const additions = extra.filter((item) => item.slug !== page.slug && !seen.has(item.slug));
  if (additions.length === 0) return page;
  return { ...page, relatedComparisons: [...page.relatedComparisons, ...additions] };
}

export function getEditorialComparison(slug: string): EditorialComparison | null {
  return EDITORIAL_COMPARES[slug] ?? null;
}

export function isEditorialCompareSlug(slug: string): boolean {
  return slug in EDITORIAL_COMPARES;
}

export function listEditorialComparisons(): EditorialComparison[] {
  return Object.values(EDITORIAL_COMPARES);
}

export function listEditorialCompareSlugs(): string[] {
  return Object.keys(EDITORIAL_COMPARES);
}

/** Sitemap / entity-discovery rows for editorial slugs not yet in the DB. */
export function listEditorialCompareSitemapEntries(): {
  slug: string;
  title: string;
  category: string;
  lastModified: string;
  entityA: string;
  entityB: string;
}[] {
  return listEditorialComparisons().map((c) => ({
    slug: c.slug,
    title: c.title,
    category: c.category ?? "technology",
    lastModified: c.metadata.updatedAt,
    entityA: c.entities[0]?.name ?? "",
    entityB: c.entities[1]?.name ?? c.entities[0]?.name ?? "",
  }));
}

/**
 * The in-repo editorial pack is the whole page. A legacy DB row for the same
 * slug must not contribute attributes, scores, ratings, a verdict, a winner,
 * FAQs, or related links. The row's status stays a linkability signal in
 * `filterLiveCompareSlugs` / `getUnlinkableCompareSlugs` and is not copied here.
 *
 * The database id and view count are kept when the caller already loaded them,
 * so likes, comments, and votes stay attached to that row.
 */
export function mergeEditorialEnrichment(
  published: ComparisonPageData,
  editorial: EditorialComparison | null
): ComparisonPageData {
  if (!editorial) return published;
  return {
    ...editorial,
    id: published.id || editorial.id,
    metadata: {
      ...editorial.metadata,
      viewCount: published.metadata?.viewCount ?? editorial.metadata.viewCount,
    },
  };
}
