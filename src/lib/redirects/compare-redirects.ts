/**
 * /compare/* → /compare/* canonical-consolidation 301 redirects.
 *
 * Source of truth for compare-to-compare 301s used when two comparison pages
 * target the same search intent (cannibalization). The losing slug is archived
 * in the DB and 301'd here at the edge via next.config.ts redirects(), so the
 * redirect survives even if the archived row is later deleted.
 *
 * Origin: DAN-1169 — the PS5 Pro vs Xbox Series X intent was split across two
 * live pages (`xbox-series-x-vs-ps5-pro` and the keyword-targeted
 * `ps5-pro-vs-xbox-series-x-performance-comparison-2026`), both stuck in
 * positions 14–20. We keep the keyword-aligned page as canonical (it is the one
 * Semrush/DataForSEO show ranking) and fold the short duplicate into it.
 *
 * DAN dual-ordering consolidation (Semrush audit 2026-06-21): a sitemap sweep of
 * 2,069 live /compare/* URLs found 162 reversed dual-ordering pairs — the SAME
 * comparison served at both `a-vs-b` AND `b-vs-a`, splitting link equity across
 * the whole footprint. Each pair is folded to a single canonical survivor:
 *   - Default: the ALPHABETICAL ordering (matches `comparisonSlug()` in
 *     utils/slugify.ts, so the generator and these redirects agree by
 *     construction).
 *   - `// footprint`: the non-alphabetical ordering is kept because Semrush
 *     shows it holding a materially larger keyword footprint (≥4 keywords and a
 *     ≥3-keyword lead) that we don't want to force Google to re-associate.
 *   - `// health`: the alphabetical ordering currently returns HTTP 500 (empty
 *     DB record, separate root cause tracked in the 25-page 500 issue), so we
 *     point at the healthy reverse instead of redirecting live traffic into a
 *     500. All 162 survivors were verified to return 200 before merge.
 *
 * Every survivor here was confirmed live (200) on prod. All entries were checked
 * to be non-chaining (no survivor is also a loser).
 *
 * Add new entries as more compare-route cannibalization clusters are found:
 * map each retired slug to the canonical slug it should consolidate into.
 */

import type { BlogRedirect } from "./blog-redirects";

// retired comparison slug -> canonical comparison slug
const COMPARE_CONSOLIDATIONS: Record<string, string> = {
  // DAN-1169 origin cluster
  "xbox-series-x-vs-ps5-pro":
    "ps5-pro-vs-xbox-series-x-performance-comparison-2026",

  // Dual-ordering consolidation (Semrush 2026-06-21): alphabetical-canonical survivors
  "azure-vs-aws": "aws-vs-azure",
  "bmw-7-series-vs-audi-a8": "audi-a8-vs-bmw-7-series",
  "bmw-vs-audi": "audi-vs-bmw",
  "calendly-vs-acuity-scheduling": "acuity-scheduling-vs-calendly",
  "chase-vs-capital-one": "capital-one-vs-chase",
  "claude-vs-chatgpt": "chatgpt-vs-claude",
  "clickup-vs-asana": "asana-vs-clickup",
  "coinbase-vs-binance": "binance-vs-coinbase",
  "copilot-vs-chatgpt": "chatgpt-vs-copilot",
  "dashlane-vs-1password": "1password-vs-dashlane",
  "disney-plus-vs-apple-tv-plus": "apple-tv-plus-vs-disney-plus",
  "druid-vs-clickhouse": "clickhouse-vs-druid",
  "duckdb-vs-clickhouse": "clickhouse-vs-duckdb",
  "f-16-vs-f-15": "f-15-vs-f-16",
  "f-35-vs-f-22": "f-22-vs-f-35",
  "fidelity-vs-charles-schwab": "charles-schwab-vs-fidelity",
  "figma-vs-adobe-xd": "adobe-xd-vs-figma",
  "ford-f-150-vs-chevy-silverado": "chevy-silverado-vs-ford-f-150",
  "gemini-vs-chatgpt": "chatgpt-vs-gemini",
  "gemini-vs-claude": "claude-vs-gemini",
  "google-vs-apple": "apple-vs-google",
  "greenhouse-vs-bamboohr": "bamboohr-vs-greenhouse",
  "grubhub-vs-doordash": "doordash-vs-grubhub",
  "hulu-vs-disney-plus": "disney-plus-vs-hulu",
  "india-vs-china": "china-vs-india",
  "instacart-vs-doordash": "doordash-vs-instacart",
  "iphone-vs-android": "android-vs-iphone",
  "java-vs-golang": "golang-vs-java",
  "kafka-vs-flink": "flink-vs-kafka",
  "khan-academy-vs-brilliant": "brilliant-vs-khan-academy",
  "klaviyo-vs-activecampaign": "activecampaign-vs-klaviyo",
  "kotlin-vs-java": "java-vs-kotlin",
  "lever-vs-ashby": "ashby-vs-lever",
  "linear-vs-jira": "jira-vs-linear",
  "lululemon-vs-athleta": "athleta-vs-lululemon",
  "macbook-air-vs-dell-xps-13": "dell-xps-13-vs-macbook-air",
  "macbook-air-vs-ipad-pro": "ipad-pro-vs-macbook-air",
  "mailchimp-vs-convertkit": "convertkit-vs-mailchimp",
  "mailchimp-vs-hubspot": "hubspot-vs-mailchimp",
  "matomo-vs-google-analytics": "google-analytics-vs-matomo",
  "mcafee-vs-bitdefender": "bitdefender-vs-mcafee",
  "mcdonalds-vs-chick-fil-a": "chick-fil-a-vs-mcdonalds",
  "mercedes-c-class-vs-bmw-3-series": "bmw-3-series-vs-mercedes-c-class",
  "mercedes-gle-vs-bmw-x5": "bmw-x5-vs-mercedes-gle",
  "mercedes-s-class-vs-bmw-7-series": "bmw-7-series-vs-mercedes-s-class",
  "mercedes-vs-bmw": "bmw-vs-mercedes",
  "mercedes-vs-lexus": "lexus-vs-mercedes",
  "microsoft-clarity-vs-fullstory": "fullstory-vs-microsoft-clarity",
  "microsoft-clarity-vs-hotjar": "hotjar-vs-microsoft-clarity",
  "microsoft-vs-apple": "apple-vs-microsoft",
  "midjourney-vs-dall-e": "dall-e-vs-midjourney",
  "mixpanel-vs-google-analytics": "google-analytics-vs-mixpanel",
  "mixpanel-vs-heap": "heap-vs-mixpanel",
  "monday-vs-asana": "asana-vs-monday",
  "monday-vs-clickup": "clickup-vs-monday",
  "mongodb-vs-firebase": "firebase-vs-mongodb",
  "netflix-vs-apple-tv-plus": "apple-tv-plus-vs-netflix",
  "netflix-vs-disney": "disney-vs-netflix",
  "netflix-vs-disney-plus": "disney-plus-vs-netflix",
  "netflix-vs-hbo-max": "hbo-max-vs-netflix",
  "netflix-vs-hulu": "hulu-vs-netflix",
  "nike-vs-adidas": "adidas-vs-nike",
  "nike-vs-new-balance": "new-balance-vs-nike",
  "nordvpn-vs-expressvpn": "expressvpn-vs-nordvpn",
  "norton-vs-bitdefender": "bitdefender-vs-norton",
  "norton-vs-mcafee": "mcafee-vs-norton",
  "notion-vs-asana": "asana-vs-notion",
  "notion-vs-clickup": "clickup-vs-notion",
  "notion-vs-coda": "coda-vs-notion",
  "notion-vs-evernote": "evernote-vs-notion",
  "oneplus-vs-iphone": "iphone-vs-oneplus",
  "openai-vs-anthropic": "anthropic-vs-openai",
  "pandadoc-vs-hellosign": "hellosign-vs-pandadoc",
  "peacock-vs-disney-plus": "disney-plus-vs-peacock",
  "peacock-vs-hulu": "hulu-vs-peacock",
  "peloton-vs-nordictrack": "nordictrack-vs-peloton",
  "perplexity-vs-chatgpt": "chatgpt-vs-perplexity",
  "perplexity-vs-claude": "claude-vs-perplexity",
  "pinot-vs-clickhouse": "clickhouse-vs-pinot",
  "pinot-vs-druid": "druid-vs-pinot",
  "pipedrive-vs-hubspot": "hubspot-vs-pipedrive",
  "plausible-vs-google-analytics": "google-analytics-vs-plausible",
  "popeyes-vs-kfc": "kfc-vs-popeyes",
  "prefect-vs-celery": "celery-vs-prefect",
  "prefect-vs-dagster": "dagster-vs-prefect",
  "prefect-vs-dbt": "dbt-vs-prefect",
  "prometheus-vs-grafana": "grafana-vs-prometheus",
  "python-vs-golang": "golang-vs-python",
  "quickbooks-vs-freshbooks": "freshbooks-vs-quickbooks",
  "robinhood-vs-fidelity": "fidelity-vs-robinhood",
  "rollbar-vs-bugsnag": "bugsnag-vs-rollbar",
  "roomba-vs-roborock": "roborock-vs-roomba",
  "rust-vs-python": "python-vs-rust",
  "safari-vs-edge": "edge-vs-safari",
  "safari-vs-firefox": "firefox-vs-safari",
  "salesforce-vs-hubspot": "hubspot-vs-salesforce",
  "salesforce-vs-pipedrive": "pipedrive-vs-salesforce",
  "samsung-galaxy-tab-vs-ipad": "ipad-vs-samsung-galaxy-tab",
  "sentry-vs-new-relic": "new-relic-vs-sentry",
  "shein-vs-amazon-haul": "amazon-haul-vs-shein",
  "shopify-vs-amazon": "amazon-vs-shopify",
  "shopify-vs-bigcommerce": "bigcommerce-vs-shopify",
  "shopify-vs-etsy": "etsy-vs-shopify",
  "slack-vs-discord": "discord-vs-slack",
  "slack-vs-microsoft-teams": "microsoft-teams-vs-slack",
  "south-korea-vs-japan": "japan-vs-south-korea",
  "spotify-vs-apple-music": "apple-music-vs-spotify",
  "sprout-social-vs-later": "later-vs-sprout-social",
  "squarespace-vs-framer": "framer-vs-squarespace",
  "starbucks-vs-dunkin": "dunkin-vs-starbucks",
  "steam-deck-vs-rog-ally": "rog-ally-vs-steam-deck",
  "supabase-vs-mongodb": "mongodb-vs-supabase",
  "surfshark-vs-nordvpn": "nordvpn-vs-surfshark",
  "svelte-vs-react": "react-vs-svelte",
  "temu-vs-amazon": "amazon-vs-temu",
  "temu-vs-shein": "shein-vs-temu",
  "tesla-model-3-vs-bmw-i4": "bmw-i4-vs-tesla-model-3",
  "tesla-vs-ford": "ford-vs-tesla",
  "tesla-vs-mercedes": "mercedes-vs-tesla",
  "tesla-vs-rivian": "rivian-vs-tesla",
  "toyota-camry-vs-honda-accord": "honda-accord-vs-toyota-camry",
  "toyota-vs-honda": "honda-vs-toyota",
  "trader-joes-vs-aldi": "aldi-vs-trader-joes",
  "typescript-vs-javascript": "javascript-vs-typescript",
  "typescript-vs-python": "python-vs-typescript",
  "uber-eats-vs-grubhub": "grubhub-vs-uber-eats",
  "uber-vs-lyft": "lyft-vs-uber",
  "us-economy-vs-chinese-economy": "chinese-economy-vs-us-economy",
  "us-vs-china-gdp": "china-gdp-vs-us",
  "vercel-vs-netlify": "netlify-vs-vercel",
  "vietnam-war-vs-korean-war": "korean-war-vs-vietnam-war",
  "visa-vs-mastercard": "mastercard-vs-visa",
  "vue-vs-angular": "angular-vs-vue",
  "vue-vs-svelte": "svelte-vs-vue",
  "walmart-vs-costco": "costco-vs-walmart",
  "walmart-vs-sams-club": "sams-club-vs-walmart",
  "wave-vs-freshbooks": "freshbooks-vs-wave",
  "wave-vs-quickbooks": "quickbooks-vs-wave",
  "webex-vs-google-meet": "google-meet-vs-webex",
  "wegovy-vs-ozempic": "ozempic-vs-wegovy",
  "weights-biases-vs-mlflow": "mlflow-vs-weights-biases",
  "whatsapp-vs-telegram": "telegram-vs-whatsapp",
  "whole-foods-vs-sprouts": "sprouts-vs-whole-foods",
  "whole-foods-vs-trader-joes": "trader-joes-vs-whole-foods",
  "windsurf-vs-cursor": "cursor-vs-windsurf",
  "wix-vs-squarespace": "squarespace-vs-wix",
  "wordpress-vs-squarespace": "squarespace-vs-wordpress",
  "wordpress-vs-wix": "wix-vs-wordpress",
  "xbox-series-x-vs-steam-deck": "steam-deck-vs-xbox-series-x",
  "xero-vs-quickbooks": "quickbooks-vs-xero",
  "youtube-music-vs-apple-music": "apple-music-vs-youtube-music",
  "youtube-tv-vs-hulu-live-tv": "hulu-live-tv-vs-youtube-tv",
  "youtube-tv-vs-sling-tv": "sling-tv-vs-youtube-tv",
  "zoom-vs-google-meet": "google-meet-vs-zoom",

  // Special-case survivors (non-alphabetical) — see header for `footprint` / `health`
  "bank-of-america-vs-chase": "chase-vs-bank-of-america",  // footprint
  "china-vs-usa": "usa-vs-china",  // footprint
  "cursor-vs-github-copilot": "github-copilot-vs-cursor",  // health
  "fidelity-vs-vanguard": "vanguard-vs-fidelity",  // footprint
  "honda-cr-v-vs-toyota-rav4": "toyota-rav4-vs-honda-cr-v",  // footprint
  "microsoft-teams-vs-zoom": "zoom-vs-microsoft-teams",  // footprint
  "mongodb-vs-postgresql": "postgresql-vs-mongodb",  // health
  "spotify-vs-tidal": "tidal-vs-spotify",  // footprint
};

export const COMPARE_REDIRECTS: BlogRedirect[] = Object.entries(
  COMPARE_CONSOLIDATIONS,
).map(([from, to]) => ({
  source: `/compare/${from}`,
  destination: `/compare/${to}`,
  permanent: true as const,
}));

/**
 * Retired (non-canonical) compare slugs that 301 to a survivor. Used to drop
 * these URLs from the sitemap so crawlers are not pointed at redirecting pages.
 */
export const RETIRED_COMPARE_SLUGS: ReadonlySet<string> = new Set(
  Object.keys(COMPARE_CONSOLIDATIONS),
);

const CANONICAL_COMPARE_SLUGS: ReadonlySet<string> = new Set(
  Object.values(COMPARE_CONSOLIDATIONS),
);

/**
 * Resolve a /compare slug to its canonical survivor.
 *
 * Precedence:
 *   1. Known retired ordering → its mapped survivor (handles the footprint /
 *      health exceptions where the survivor is intentionally non-alphabetical).
 *   2. Known survivor → returned unchanged (never re-alphabetize a survivor).
 *   3. Otherwise the input is returned unchanged; callers that want to enforce
 *      alphabetical ordering for brand-new pairs should use `comparisonSlugN`.
 *
 * This is used by the generate route so a retired ordering is never persisted
 * as a fresh duplicate at the source.
 */
export function resolveCanonicalCompareSlug(slug: string): string {
  const mapped = COMPARE_CONSOLIDATIONS[slug];
  if (mapped) return mapped;
  return slug;
}

export function isCanonicalCompareSurvivor(slug: string): boolean {
  return CANONICAL_COMPARE_SLUGS.has(slug);
}
