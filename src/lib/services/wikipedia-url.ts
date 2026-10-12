/**
 * Wikipedia URLs for comparison entities.
 *
 * Resource cards and schema citations used to build an article path by
 * turning the display name into a title: spaces became underscores, and
 * parentheses were deleted. That is a guess, not a lookup.
 *
 *   "China Economy"  -> /wiki/China_Economy   (404; real article is Economy of China)
 *   "Mac (macOS)"    -> /wiki/Mac_macOS       (404; real article is macOS)
 *
 * Confirmed titles are mapped below. A parenthetical qualifier is removed
 * wherever it sits in the name, not only at the end:
 *
 *   "Ketogenic (Keto) Diet" -> Ketogenic_Diet   (real article)
 *   "Mac (macOS)"           -> still MacOS via the name map, not /wiki/Mac
 *
 * "401(k)" is left alone: the parenthesis is part of the name, not a
 * separate qualifier, because there is no space before it.
 *
 * Product lines and insurance plans are not encyclopedia articles. Guessing
 * /wiki/Delta_Dental_PPO or /wiki/Dyson_Cordless_Vacuums 404s. Those names
 * fall back to a Wikipedia search URL, which returns 200. The same rules
 * cover any similar name; they are not a list of five titles.
 *
 * Anything that would still be one of the known-missing articles also falls
 * back to search.
 */

export interface WikipediaEntityRef {
  name: string;
  slug?: string | null;
}

const WIKI_ORIGIN = "https://en.wikipedia.org";

/**
 * Article titles Wikipedia does not have. The generator must not emit these,
 * even if a new display name would guess them.
 */
const REJECTED_ARTICLE_TITLES = new Set([
  "China_Economy",
  "Mac_macOS",
  // Stored display names with no English article. Search instead of a 404.
  "Buying_a_Home",
  "Dyson_Airwrap",
  "Shark_FlexStyle",
]);

/**
 * Entity slug -> confirmed English Wikipedia title (underscore form).
 * Includes titles that do not match the display name.
 */
const TITLE_BY_SLUG: Record<string, string> = {
  // Military
  "israel-idf": "Israel_Defense_Forces",
  "iran-military": "Armed_Forces_of_the_Islamic_Republic_of_Iran",
  "iran-armed-forces": "Armed_Forces_of_the_Islamic_Republic_of_Iran",
  "us-military": "United_States_Armed_Forces",
  "china-military": "People's_Liberation_Army",
  "f-35": "Lockheed_Martin_F-35_Lightning_II",
  "f-35-lightning": "Lockheed_Martin_F-35_Lightning_II",
  "j-20-mighty-dragon": "Chengdu_J-20",
  "su-57": "Sukhoi_Su-57",
  "f-22-raptor": "Lockheed_Martin_F-22_Raptor",
  "b-2-spirit": "Northrop_Grumman_B-2_Spirit",
  "b-52": "Boeing_B-52_Stratofortress",
  "m1-abrams": "M1_Abrams",
  "t-90m": "T-90",
  "iron-dome": "Iron_Dome",
  "s-400": "S-400_missile_system",
  "f-15-eagle": "McDonnell_Douglas_F-15_Eagle",
  "f-16": "General_Dynamics_F-16_Fighting_Falcon",
  "patriot-missile": "MIM-104_Patriot",
  "s-300": "S-300_missile_system",
  "ah-64-apache": "Boeing_AH-64_Apache",
  "ka-52": "Kamov_Ka-52",
  "barrett-m82": "Barrett_M82",
  "dragunov-svd": "Dragunov_sniper_rifle",
  // Sports
  "lionel-messi": "Lionel_Messi",
  "cristiano-ronaldo": "Cristiano_Ronaldo",
  "lebron-james": "LeBron_James",
  "michael-jordan": "Michael_Jordan",
  // Technology
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  chatgpt: "ChatGPT",
  macos: "MacOS",
  "mac-macos": "MacOS",
  "keto-diet": "Ketogenic_diet",
  "s-corp": "S_corporation",
  "renting-home": "Renting",
  "airpods-pro-3": "AirPods_Pro",
  "galaxy-buds-3-pro": "Samsung_Galaxy_Buds",
  "oura-ring-4": "Oura_Ring",
  "whoop-4": "Whoop_(company)",
  // Countries and economies
  usa: "United_States",
  china: "China",
  "china-economy": "Economy_of_China",
  "us-economy": "Economy_of_the_United_States",
  // Brands
  "mercedes-benz": "Mercedes-Benz",
  bmw: "BMW",
};

/**
 * Normalized display name -> confirmed title.
 * Covers rows whose slug is not in TITLE_BY_SLUG (database copies, renames).
 */
const TITLE_BY_NAME: Record<string, string> = {
  "china economy": "Economy_of_China",
  "chinese economy": "Economy_of_China",
  "us economy": "Economy_of_the_United_States",
  "u.s. economy": "Economy_of_the_United_States",
  "united states economy": "Economy_of_the_United_States",
  "mac (macos)": "MacOS",
  "macos (mac)": "MacOS",
  "mac macos": "MacOS",
  macos: "MacOS",
  "china military": "People's_Liberation_Army",
  "china military (pla)": "People's_Liberation_Army",
  "iran military": "Armed_Forces_of_the_Islamic_Republic_of_Iran",
  "us military": "United_States_Armed_Forces",
  "keto diet": "Ketogenic_diet",
  "s-corp": "S_corporation",
  "renting a home": "Renting",
  "j-20 mighty dragon": "Chengdu_J-20",
  "airpods pro 3": "AirPods_Pro",
  "galaxy buds 3 pro": "Samsung_Galaxy_Buds",
  "oura ring 4": "Oura_Ring",
  "whoop 4.0": "Whoop_(company)",
};

function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Remove qualifier groups like " (Keto)" anywhere in the name.
 * A parenthesis glued to a word, as in "401(k)", is kept.
 */
export function stripParentheticalQualifiers(name: string): string {
  return name
    .replace(/(^|\s)\([^)]*\)(?=\s|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Insurance plan codes. Matched as whole words so "HMO" is a plan code
 * and "Thermometer" is not.
 */
const PLAN_CODE = /\b(?:PPO|HMO|EPO|POS|DHMO|HDHP|HSA|FSA)\b/i;

/**
 * A tier word only counts as a plan when the name is also about a benefit.
 * "Premier League" and "Disney Plus" do not match. "Delta Dental Premier" does.
 */
const PLAN_TIER =
  /\b(?:Premier|Preferred|Select|Advantage|Basic|Standard|Premium|Plus)\b/i;
const BENEFIT_DOMAIN =
  /\b(?:dental|medical|vision|health|insurance|medicare|medicaid)\b/i;

/**
 * A brand plus a product line ("Dyson Cordless Vacuums") is a shopping
 * phrase, not an article title. The brand alone ("Dyson") still is.
 */
const PRODUCT_LINE =
  /\b(?:cordless|robot|robotic|stick|upright|canister|handheld)\s+(?:vacuums?|cleaners?|mops?)\b/i;

export function isProductOrPlanName(name: string): boolean {
  const text = name.trim();
  if (!text) return false;

  const wordCount = text.split(/\s+/).length;
  if (wordCount >= 2 && PLAN_CODE.test(text)) return true;
  if (PLAN_TIER.test(text) && BENEFIT_DOMAIN.test(text)) return true;
  if (PRODUCT_LINE.test(text)) return true;
  return false;
}

/** Titles we authored may already contain percent-encoding (apostrophes). */
function articleUrl(title: string): string {
  const segment = title.includes("%") ? title : encodeURIComponent(title);
  return `${WIKI_ORIGIN}/wiki/${segment}`;
}

export function wikipediaSearchUrl(query: string): string {
  const params = new URLSearchParams({ search: query.trim() });
  return `${WIKI_ORIGIN}/w/index.php?${params.toString()}`;
}

/**
 * Turn a display name into an article title without inventing one.
 *
 * "World War I (1914-1918)" keeps "World War I". The old code deleted the
 * parentheses and produced "World_War_I_1914-1918", which 404s.
 * "Ketogenic (Keto) Diet" keeps "Ketogenic Diet" (the qualifier is in the
 * middle, so a trailing-only strip used to leave the parentheses in place).
 * "401(k)" has no space before the parenthesis, so the whole name is the title.
 *
 * Returns null for product and plan names, and for titles we already know
 * do not exist. The caller then uses a search URL.
 */
export function guessedWikipediaTitle(name: string): string | null {
  const trimmed = name.trim().replace(/\s+/g, " ");
  if (!trimmed) return null;
  if (isProductOrPlanName(trimmed)) return null;

  const base = stripParentheticalQualifiers(trimmed);
  if (!base) return null;

  const title = base.replace(/\s+/g, "_");
  if (REJECTED_ARTICLE_TITLES.has(title)) return null;
  return title;
}

export function resolveEntityWikipediaUrl(entity: WikipediaEntityRef): string {
  const slug = entity.slug?.trim();
  if (slug && TITLE_BY_SLUG[slug]) {
    return articleUrl(TITLE_BY_SLUG[slug]);
  }

  const byName = TITLE_BY_NAME[normalizeName(entity.name)];
  if (byName) return articleUrl(byName);

  // "China (PRC) Economy" is not in the name map, but "China Economy" is.
  const stripped = stripParentheticalQualifiers(entity.name);
  if (stripped && stripped !== entity.name.trim()) {
    const byStripped = TITLE_BY_NAME[normalizeName(stripped)];
    if (byStripped) return articleUrl(byStripped);
  }

  const guessed = guessedWikipediaTitle(entity.name);
  if (!guessed) return wikipediaSearchUrl(entity.name || slug || "Wikipedia");
  return articleUrl(guessed);
}
