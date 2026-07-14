/**
 * Entity alias map + rivalry normalisation (DAN-2047).
 *
 * The comparison catalog publishes the same real-world rivalry more than once:
 *
 *   1. Reverse-duplicate pages — `slack-vs-microsoft-teams` and
 *      `microsoft-teams-vs-slack` are two pages about one matchup. 22 pairs in
 *      the live corpus are published 2–5 times (`china-economy|united-states-economy`
 *      has five pages).
 *   2. Alias entities — the same product exists under two entity rows
 *      (`netflix` + `netflix-inc`, `disney` + `disney-plus`, `paramount` +
 *      `paramount-plus`, and a long tail of `-inc` / `-corporation` variants).
 *
 * Counting comparison PAGES per entity therefore over-states how many rivals an
 * entity actually has, which is what the "most-compared brands" study published.
 * Everything a study reports as a rivalry count must go through `canonicalSlug`
 * and `rivalryKey` first.
 *
 * The map is curated, not inferred. A prefix/suffix heuristic cannot be trusted
 * here — `iphone-16` and `iphone-16-pro` share a prefix and are different
 * products. Entries below were confirmed against the live corpus on 2026-07-12
 * by two signals only: an identical display name under two slugs, or a legal /
 * corporate suffix (`Netflix, Inc.` → `Netflix`). `scripts/lint-entity-aliases.ts`
 * re-runs those signals and reports new candidates for review.
 *
 * Canonical slug = the variant with the most published comparisons, so the study
 * links to the richer /entity/ page. Display names are overridden where the
 * canonical row's own `name` is wrong (`disney` is stored with name "Disney+").
 */

/**
 * What this map deliberately does NOT collapse: product SKUs and model years.
 * `ps5-pro`, `playstation-5` and `playstation-6-ps6` stay three entities, as do
 * `iphone-16` and `iphone-16-pro`. They are different products, and merging them
 * would be a claim about the market rather than about our catalog.
 *
 * That choice has a consequence worth stating plainly, because it decides what
 * the study is allowed to publish: Xbox Series X's rival count is made up of
 * three PlayStation SKUs, its own sibling console, and the `pc-gaming` category,
 * while Netflix's is five distinct services. The two numbers are not measuring
 * the same thing, so whichever is larger is an artifact of how finely each
 * vertical happens to be modelled — not a finding. This is why the study ranks
 * with ties visible and publishes no "#1 most-compared brand" (DAN-2059).
 */

/** alias entity slug -> canonical entity slug. */
export const ENTITY_ALIASES: Readonly<Record<string, string>> = {
  // --- streaming: the families the study got most wrong
  "netflix-inc": "netflix",
  "disney-plus": "disney", // "Disney Plus" (2 pages) === "Disney+" (5 pages)
  "disney-plus-the-walt-disney-company-streaming-division": "disney",
  paramount: "paramount-plus", // identical display name "Paramount+"
  "max-hbo-max": "hbo-max", // stored as 'Max (HBO Max)' — a third HBO Max row
  /**
   * Judgment call, not a naming variant: `the-walt-disney-company` is the
   * conglomerate, `disney` is Disney+. They are folded together because in this
   * corpus they are the same comparison published twice — `netflix-vs-disney`
   * is modelled on the conglomerate and `disney-vs-netflix` on the streaming
   * service, and both render as "Netflix vs Disney". Keeping them apart would
   * hand Netflix a 6th "rival" that is a second page about Disney+. Revisit if
   * we ever publish a genuine company-vs-company comparison.
   */
  "the-walt-disney-company": "disney",

  // --- same product, two rows
  "amazon-web-services-aws": "aws",
  /**
   * DAN-2068. Four more of these, found by asking why the SaaS study reported
   * "HubSpot 2 · Salesforce 1" when HubSpot is on four pages. The evidence is in
   * the comparison slugs, which all name one product while pointing at two rows:
   *
   *   hubspot-vs-pipedrive, mailchimp-vs-hubspot   -> entity `hubspot`
   *   hubspot-vs-salesforce, hubspot-vs-zoho-crm   -> entity `hubspot-crm`
   *   wordpress-vs-wix                             -> entity `wordpress`
   *   squarespace-vs-wordpress, wordpress-vs-squarespace -> `wordpress-self-hosted`
   *   chrome-vs-firefox                            -> entity `mozilla-firefox`
   *   firefox-vs-safari, firefox-vs-brave          -> entity `firefox`
   *
   * Split across two rows, each product's rivals are split too — which is how
   * Salesforce ended up with exactly one rival (a HubSpot row that no other
   * HubSpot page used), and how a Wix/WordPress tie stayed hidden long enough to
   * be published as an upset twice.
   */
  "hubspot-crm": "hubspot",
  "wordpress-self-hosted": "wordpress",
  "mozilla-firefox": "firefox",
  // The Zoho entity row is `zoho-crm`; CHALLENGER_CANDIDATES keys on `zoho`.
  "zoho-crm": "zoho",

  // --- identical display name under two slugs
  "delta-airlines": "delta-air-lines",
  chrome: "google-chrome",
  azure: "microsoft-azure",
  "kylian-mbappe": "kylian-mbapp",
  "kylian-mbapp-lottin": "kylian-mbapp",
  lacroix: "la-croix",
  "masters-degree": "master-s-degree",
  usa: "united-states",

  // --- legal / corporate suffix variants
  "adidas-ag": "adidas",
  "burger-king-restaurant-brands-international": "burger-king",
  "charles-schwab-corporation": "charles-schwab",
  "chick-fil-a-inc": "chick-fil-a",
  "chipotle-mexican-grill": "chipotle",
  "costco-wholesale": "costco",
  "fidelity-investments": "fidelity",
  ford: "ford-motor-company",
  "home-depot-inc": "home-depot",
  "honda-motor-company": "honda",
  "lowe-s-companies-inc": "lowe-s",
  "lyft-inc": "lyft",
  "mcdonald-s-corporation": "mcdonald-s",
  "monday-com": "monday",
  "real-madrid-cf": "real-madrid",
  samsung: "samsung-electronics",
  "target-corporation": "target",
  "neymar-da-silva-santos-j-nior": "neymar",

  // --- product/chip naming variants
  "apple-m3-chip": "apple-m3",
  "apple-m4-chip": "apple-m4",
  "brave-browser": "brave",

  // --- economy topics (finance study)
  "us-economy": "united-states-economy",
  "china-s-economy": "china-economy",
};

/**
 * Display names for canonical slugs whose stored `name` is wrong or ambiguous.
 * `disney` is stored as "Disney+", `ford-motor-company` as the long legal name.
 */
export const CANONICAL_NAMES: Readonly<Record<string, string>> = {
  disney: "Disney+",
  "paramount-plus": "Paramount+",
  "ford-motor-company": "Ford",
  "samsung-electronics": "Samsung",
  "master-s-degree": "Master's Degree",
  "kylian-mbapp": "Kylian Mbappé",
  "united-states-economy": "United States Economy",
};

/** Resolve an entity slug to its canonical form. Identity for non-aliases. */
export function canonicalSlug(slug: string): string {
  return ENTITY_ALIASES[slug] ?? slug;
}

/** Preferred display name for a canonical slug, falling back to the stored name. */
export function canonicalName(slug: string, storedName: string): string {
  return CANONICAL_NAMES[slug] ?? storedName;
}

/**
 * Order-insensitive key for the set of entities a comparison is about, after
 * alias resolution. `a-vs-b`, `b-vs-a` and `b-vs-a-inc` all produce one key, so
 * they collapse to a single rivalry.
 */
export function rivalryKey(members: string[]): string {
  return [...new Set(members.map(canonicalSlug))].sort().join("|");
}

/** The distinct canonical entities a comparison is about. */
export function canonicalMembers(members: string[]): string[] {
  return [...new Set(members.map(canonicalSlug))];
}

/**
 * Entity types that are consumer streaming / media services rather than B2B
 * software. `disney` is typed `software` in the entity table, which is why it
 * ranked as a "B2B SaaS tool" alongside Notion and Zoom on the SaaS study.
 * These are brands — they belong in the brands ranking, not the SaaS one.
 */
export const CONSUMER_MEDIA_SLUGS: ReadonlySet<string> = new Set([
  "netflix", "disney", "hulu", "hbo-max", "peacock", "paramount-plus",
  "apple-tv", "spotify", "apple-music", "youtube-music", "youtube-premium",
  "amazon-music-unlimited", "tidal", "pandora", "sling-tv", "fubotv",
  "amazon-prime-video", "prime-video", "starz", "showtime", "crunchyroll",
  "spotify-premium", "hulu-live-tv",
]);
