/**
 * ROO-29 — client-safe compare → next-compare CTA constants.
 *
 * Keep free of server-only imports. Client components (`CompareNextStepCTA`)
 * import from here so the Next.js client bundle never pulls Node-only graphs.
 */

/** PostHog source_page for mid-page next-step chips on /compare/* landers. */
export const COMPARE_NEXT_SOURCE = "compare-next";

/** Soft explore when no live next-step chips remain. */
export const COMPARE_NEXT_SOFT_HREF = "/trending";

export type CompareNextChipCandidate = {
  slug: string;
  label: string;
};

/**
 * Curated cluster fallbacks for high-bounce GDP / geo / rideshare landers
 * (PostHog ROO-29). Runtime live-filter (DAN-2581) drops anything that 404s.
 *
 * Cover both common orderings where redirects may not have folded them yet.
 */
export const COMPARE_NEXT_CLUSTER_FALLBACKS: Readonly<
  Record<string, ReadonlyArray<CompareNextChipCandidate>>
> = {
  "japan-vs-china": [
    { slug: "us-vs-china-gdp", label: "US vs China GDP" },
    { slug: "china-gdp-vs-us", label: "China GDP vs US" },
    { slug: "usa-vs-china", label: "USA vs China" },
    {
      slug: "china-vs-us-gdp-military-tech-comparison-2026",
      label: "China vs US GDP & military",
    },
    { slug: "us-military-vs-china-military", label: "US vs China military" },
    { slug: "india-vs-china", label: "India vs China" },
  ],
  "china-vs-japan": [
    { slug: "us-vs-china-gdp", label: "US vs China GDP" },
    { slug: "usa-vs-china", label: "USA vs China" },
    { slug: "india-vs-china", label: "India vs China" },
  ],
  "china-vs-us-gdp-military-tech-comparison-2026": [
    { slug: "us-vs-china-gdp", label: "US vs China GDP" },
    { slug: "japan-vs-china", label: "Japan vs China" },
    { slug: "usa-vs-china", label: "USA vs China" },
    { slug: "us-military-vs-china-military", label: "US vs China military" },
    { slug: "us-economy-vs-china-economy", label: "US vs China economy" },
  ],
  "us-vs-china-gdp": [
    { slug: "japan-vs-china", label: "Japan vs China" },
    {
      slug: "china-vs-us-gdp-military-tech-comparison-2026",
      label: "China vs US GDP & military",
    },
    { slug: "usa-vs-china", label: "USA vs China" },
    { slug: "us-economy-vs-china-economy", label: "US vs China economy" },
    { slug: "us-military-vs-china-military", label: "US vs China military" },
  ],
  "china-gdp-vs-us": [
    { slug: "japan-vs-china", label: "Japan vs China" },
    { slug: "usa-vs-china", label: "USA vs China" },
    {
      slug: "china-vs-us-gdp-military-tech-comparison-2026",
      label: "China vs US GDP & military",
    },
  ],
  "lyft-vs-uber": [
    { slug: "uber-vs-lyft", label: "Uber vs Lyft" },
    { slug: "uber-vs-taxi", label: "Uber vs taxi" },
    { slug: "lyft-vs-taxi", label: "Lyft vs taxi" },
    { slug: "doordash-vs-uber-eats", label: "DoorDash vs Uber Eats" },
    { slug: "uber-eats-vs-doordash", label: "Uber Eats vs DoorDash" },
  ],
  "uber-vs-lyft": [
    { slug: "lyft-vs-uber", label: "Lyft vs Uber" },
    { slug: "uber-vs-taxi", label: "Uber vs taxi" },
    { slug: "doordash-vs-uber-eats", label: "DoorDash vs Uber Eats" },
  ],
  "signal-vs-whatsapp": [
    { slug: "signal-vs-telegram", label: "Signal vs Telegram" },
    { slug: "whatsapp-vs-telegram", label: "WhatsApp vs Telegram" },
  ],
  "signal-vs-telegram": [
    { slug: "signal-vs-whatsapp", label: "Signal vs WhatsApp" },
    { slug: "whatsapp-vs-telegram", label: "WhatsApp vs Telegram" },
  ],
  "whatsapp-vs-telegram": [
    { slug: "signal-vs-whatsapp", label: "Signal vs WhatsApp" },
    { slug: "signal-vs-telegram", label: "Signal vs Telegram" },
  ],
};

/**
 * Default filler when related + cluster are thin — GDP/geo + rideshare
 * cluster plus a few popular live compares. Live-filtered at render (DAN-2581).
 */
export const COMPARE_NEXT_DEFAULT_CANDIDATES: ReadonlyArray<CompareNextChipCandidate> =
  [
    { slug: "japan-vs-china", label: "Japan vs China" },
    { slug: "us-vs-china-gdp", label: "US vs China GDP" },
    {
      slug: "china-vs-us-gdp-military-tech-comparison-2026",
      label: "China vs US GDP & military",
    },
    { slug: "lyft-vs-uber", label: "Lyft vs Uber" },
    { slug: "usa-vs-china", label: "USA vs China" },
    { slug: "messi-vs-ronaldo", label: "Messi vs Ronaldo" },
    { slug: "iphone-17-vs-samsung-s26", label: "iPhone vs Samsung" },
  ];

/** Max chips shown in the mid-page next-step strip. */
export const COMPARE_NEXT_MAX_CHIPS = 4;
