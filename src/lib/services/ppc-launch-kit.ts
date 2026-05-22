/**
 * PPC Launch Kit (DAN-79 — Option B parallel prep)
 *
 * Credential-free, spend-free assets that make a Google Ads + Meta launch a
 * copy-paste exercise the moment the four account IDs land in `.env`:
 *   NEXT_PUBLIC_GTM_ID, NEXT_PUBLIC_GA_ID, NEXT_PUBLIC_GOOGLE_ADS_ID, NEXT_PUBLIC_META_PIXEL_ID
 *
 * Contents:
 *   1. CONVERSION_TAXONOMY    — every high-intent action mapped to its GA4 event
 *                              (as fired today in src/lib/utils/analytics.ts),
 *                              Google Ads conversion action, and Meta event.
 *   2. NEGATIVE_KEYWORDS      — baseline negative list to pre-seed before any spend.
 *   3. REMARKETING_AUDIENCES  — audience definitions ready to create once pixels fire.
 *   4. RSA copy builder       — char-count-validated Responsive Search Ad assets.
 *
 * Nothing here calls an external service or reads a secret. It is pure data +
 * pure functions, surfaced via GET /api/ppc/launch-kit.
 */

// ---------------------------------------------------------------------------
// 1. Conversion taxonomy
// ---------------------------------------------------------------------------

export type ConversionPriority = "primary" | "secondary";
export type CountingType = "one" | "every";
export type WiringStatus = "wired" | "needs_wiring";

export interface ConversionAction {
  /** Stable id for this conversion. */
  id: string;
  /** Human-readable name to use in the Google Ads / Meta UIs. */
  label: string;
  /** GA4 event name as fired today in src/lib/utils/analytics.ts (or planned). */
  ga4Event: string;
  /** Secondary GA4 event also fired for this action, if any. */
  ga4SecondaryEvent?: string;
  /** Google Ads conversion action category to pick when creating the action. */
  googleAdsCategory: string;
  /** Meta Pixel standard event (or custom event name). */
  metaEvent: string;
  /** Whether this should be a primary (bidding) or secondary (observe) conversion. */
  priority: ConversionPriority;
  /** Count "one" (lead-style) or "every" (sales-style) conversion per interaction. */
  counting: CountingType;
  /** Default value (USD) for value-based bidding; 0 = no value yet. */
  defaultValueUsd: number;
  /** Click-through attribution window in days. */
  attributionWindowDays: number;
  /** Is the GA4/Meta event already firing in code, or does it need wiring? */
  status: WiringStatus;
  /** Where the event originates / what still needs doing. */
  notes: string;
}

export const CONVERSION_TAXONOMY: ConversionAction[] = [
  {
    id: "newsletter_signup",
    label: "Newsletter Signup",
    ga4Event: "newsletter_signup",
    ga4SecondaryEvent: "generate_lead",
    googleAdsCategory: "Sign-up",
    metaEvent: "Lead",
    priority: "primary",
    counting: "one",
    defaultValueUsd: 2,
    attributionWindowDays: 30,
    status: "wired",
    notes: "trackNewsletterSignup() — fires newsletter_signup + generate_lead + Meta Lead.",
  },
  {
    id: "poll_email_capture",
    label: "Poll Email Capture",
    ga4Event: "poll_email_capture",
    ga4SecondaryEvent: "generate_lead",
    googleAdsCategory: "Sign-up",
    metaEvent: "Lead",
    priority: "primary",
    counting: "one",
    defaultValueUsd: 2,
    attributionWindowDays: 30,
    status: "wired",
    notes: "trackPollEmailCapture() — post-poll lead capture; same GA4/Meta path as newsletter.",
  },
  {
    id: "affiliate_click",
    label: "Affiliate Outbound Click",
    ga4Event: "affiliate_click",
    googleAdsCategory: "Other (purchase intent)",
    metaEvent: "AffiliateClick",
    priority: "primary",
    counting: "every",
    defaultValueUsd: 0.5,
    attributionWindowDays: 7,
    status: "wired",
    notes: "trackAffiliateClick() — primary revenue proxy. Meta uses a custom event (trackMetaCustomEvent).",
  },
  {
    id: "embed_key_registration",
    label: "Embed Partner Registration",
    ga4Event: "embed_key_registration",
    ga4SecondaryEvent: "generate_lead",
    googleAdsCategory: "Sign-up",
    metaEvent: "CompleteRegistration",
    priority: "primary",
    counting: "one",
    defaultValueUsd: 5,
    attributionWindowDays: 30,
    status: "wired",
    notes: "trackEmbedKeyRegistration() — B2B widget partner signup; highest-value lead.",
  },
  {
    id: "contact_form_submit",
    label: "Contact Form Submission",
    ga4Event: "contact_form_submit",
    ga4SecondaryEvent: "generate_lead",
    googleAdsCategory: "Contact",
    metaEvent: "Contact",
    priority: "primary",
    counting: "one",
    defaultValueUsd: 3,
    attributionWindowDays: 30,
    status: "needs_wiring",
    notes: "GAP: no contact-form tracker exists yet. Add trackContactFormSubmit() and fire on the contact endpoint before launch.",
  },
  {
    id: "review_submission",
    label: "Review Submission",
    ga4Event: "review_submission",
    ga4SecondaryEvent: "generate_lead",
    googleAdsCategory: "Other",
    metaEvent: "SubmitApplication",
    priority: "secondary",
    counting: "one",
    defaultValueUsd: 0,
    attributionWindowDays: 30,
    status: "wired",
    notes: "trackReviewSubmission() — engagement signal; observe, do not bid.",
  },
  {
    id: "comparison_view",
    label: "Comparison Page View (engaged)",
    ga4Event: "comparison_view",
    googleAdsCategory: "Page view",
    metaEvent: "ViewContent",
    priority: "secondary",
    counting: "every",
    defaultValueUsd: 0,
    attributionWindowDays: 7,
    status: "wired",
    notes: "trackComparisonView() — Meta ViewContent feeds retargeting; secondary in Google Ads.",
  },
  {
    id: "comparison_search",
    label: "On-site Comparison Search",
    ga4Event: "comparison_search",
    googleAdsCategory: "Other",
    metaEvent: "Search",
    priority: "secondary",
    counting: "every",
    defaultValueUsd: 0,
    attributionWindowDays: 7,
    status: "wired",
    notes: "trackComparisonSearch() — intent signal; Meta Search event for audience building.",
  },
  {
    id: "comparison_vote",
    label: "Comparison Vote",
    ga4Event: "comparison_vote",
    googleAdsCategory: "Other",
    metaEvent: "CustomizeProduct",
    priority: "secondary",
    counting: "every",
    defaultValueUsd: 0,
    attributionWindowDays: 7,
    status: "wired",
    notes: "trackComparisonVote() — micro-engagement; observe only.",
  },
];

// ---------------------------------------------------------------------------
// 2. Negative keywords (pre-seed before any spend)
// ---------------------------------------------------------------------------

export interface NegativeKeywordSet {
  /** Applied as a shared/account-level negative list across all campaigns. */
  shared: string[];
  /** Category-scoped negatives, keyed by keyword category. */
  byCategory: Record<string, string[]>;
}

export const NEGATIVE_KEYWORDS: NegativeKeywordSet = {
  shared: [
    // Free / pirate / no-purchase-intent
    "free",
    "freeware",
    "crack",
    "cracked",
    "torrent",
    "keygen",
    "nulled",
    "warez",
    // Jobs / careers
    "jobs",
    "job",
    "career",
    "careers",
    "salary",
    "hiring",
    "internship",
    "resume",
    // DIY / education only
    "tutorial",
    "course",
    "courses",
    "how to make",
    "diy",
    "wiki",
    "wikipedia",
    "meaning",
    "definition",
    // Support / login / account (existing-customer intent)
    "login",
    "log in",
    "sign in",
    "support",
    "customer service",
    "phone number",
    "refund",
    "cancel",
    "complaint",
    // Adult / unrelated
    "porn",
    "nude",
    "lyrics",
  ],
  byCategory: {
    software: ["open source", "github", "api docs", "self hosted", "alternative reddit"],
    technology: ["used", "repair", "manual", "driver", "firmware"],
    automotive: ["used", "junkyard", "salvage", "rental", "lease calculator"],
    products: ["recall", "lawsuit", "second hand", "wholesale", "bulk"],
    health: ["side effects", "lawsuit", "recall", "prescription", "dosage"],
    companies: ["stock", "share price", "earnings", "layoffs", "scandal"],
  },
};

// ---------------------------------------------------------------------------
// 3. Remarketing audience definitions
// ---------------------------------------------------------------------------

export type AudiencePlatform = "google_ads" | "meta";

export interface RemarketingAudience {
  id: string;
  name: string;
  platforms: AudiencePlatform[];
  /** Plain-language membership rule to recreate in the platform UI. */
  definition: string;
  /** Membership duration in days. */
  membershipDays: number;
  /** Recommended use for this segment. */
  use: string;
  /** GA4/Meta signals this audience is built from (events already firing). */
  sourceSignals: string[];
}

export const REMARKETING_AUDIENCES: RemarketingAudience[] = [
  {
    id: "comparison_viewers_no_click",
    name: "Comparison Viewers — No Affiliate Click",
    platforms: ["google_ads", "meta"],
    definition:
      "Viewed >=1 comparison page (comparison_view / ViewContent) AND did NOT fire affiliate_click in the last 30 days.",
    membershipDays: 30,
    use: "Highest-priority retargeting: warm intent, no conversion. Push best-match comparison + verdict.",
    sourceSignals: ["comparison_view", "ViewContent", "affiliate_click"],
  },
  {
    id: "newsletter_non_subscribers",
    name: "Engaged Readers — Not Subscribed",
    platforms: ["meta"],
    definition:
      "2+ comparison_view in 14 days AND no newsletter_signup / poll_email_capture (no Meta Lead) in last 30 days.",
    membershipDays: 30,
    use: "Lead-gen retargeting: drive newsletter/poll email capture with a value hook.",
    sourceSignals: ["comparison_view", "newsletter_signup", "poll_email_capture"],
  },
  {
    id: "category_deep_readers",
    name: "Category Deep Readers",
    platforms: ["google_ads", "meta"],
    definition:
      "3+ comparison_view within the same category in 30 days (use category param on comparison_view).",
    membershipDays: 45,
    use: "Cross-sell adjacent comparisons in the same category; strong for RLSA bid boosts on Search.",
    sourceSignals: ["comparison_view"],
  },
  {
    id: "searchers_no_result_engagement",
    name: "On-site Searchers — Low Engagement",
    platforms: ["meta"],
    definition:
      "Fired comparison_search (Meta Search) but <2 comparison_view in same session, last 14 days.",
    membershipDays: 14,
    use: "Re-engage searchers who didn't find a match; surface popular comparisons + request.",
    sourceSignals: ["comparison_search", "comparison_view"],
  },
  {
    id: "affiliate_clickers_lookalike_seed",
    name: "Affiliate Clickers (Lookalike Seed)",
    platforms: ["meta"],
    definition: "Fired affiliate_click in last 180 days. Use as the seed for a 1-3% Lookalike audience.",
    membershipDays: 180,
    use: "Prospecting: build Lookalikes from highest-intent (revenue-proxy) users.",
    sourceSignals: ["affiliate_click"],
  },
  {
    id: "all_visitors_180",
    name: "All Visitors (180d)",
    platforms: ["google_ads", "meta"],
    definition: "Any page_view in last 180 days. Broad catch-all for exclusions and reach campaigns.",
    membershipDays: 180,
    use: "Exclusion list for prospecting; broad reach base. Do not bid aggressively.",
    sourceSignals: ["page_view"],
  },
];

// ---------------------------------------------------------------------------
// 4. Responsive Search Ad (RSA) copy — char-count validated
// ---------------------------------------------------------------------------

/** Google Ads RSA hard limits. */
export const RSA_LIMITS = {
  headlineMax: 30,
  descriptionMax: 90,
  pathMax: 15,
  maxHeadlines: 15,
  minHeadlines: 3,
  maxDescriptions: 4,
  minDescriptions: 2,
} as const;

export interface RsaAsset {
  /** Ad group / category this asset targets. */
  adGroup: string;
  /** 3-15 headlines, each <= 30 chars. */
  headlines: string[];
  /** 2-4 descriptions, each <= 90 chars. */
  descriptions: string[];
  /** Optional display URL paths, each <= 15 chars. */
  paths: [string?, string?];
}

/** Generic comparison copy used as fallback for any category. */
const GENERIC_HEADLINES = [
  "Compare Side by Side",
  "Unbiased Comparisons",
  "Which Is Better in 2026?",
  "Data-Driven Verdict",
  "Free Comparison Tool",
  "See Key Differences",
  "Pros, Cons & Pricing",
  "Expert Comparison Guide",
  "Make a Smarter Choice",
  "Compare Specs & Prices",
  "Real Data, No Hype",
  "Trusted by Readers",
  "Updated for 2026",
  "Find Your Best Match",
  "Decide in Minutes",
];

const GENERIC_DESCRIPTIONS = [
  "Compare features, pricing and specs side by side. Get a data-driven verdict fast.",
  "Unbiased, data-backed comparisons. See the key differences and decide with confidence.",
  "Stop guessing. Get the facts on features, pricing and performance. Free and fast.",
  "The clearest comparison tool on the web. Real specs, real prices, expert verdicts.",
];

/** Category-specific headline flavor, merged ahead of generic headlines. */
const CATEGORY_HEADLINES: Record<string, string[]> = {
  software: ["Compare Software Tools", "Best Software for You", "Features & Pricing 2026"],
  technology: ["Compare Tech Side by Side", "Specs, Price & Verdict", "Best Tech in 2026"],
  automotive: ["Compare Cars Side by Side", "Specs, MPG & Price", "Which Car Wins?"],
  products: ["Compare Products Fast", "Best Product for You", "Specs & Price Compared"],
  health: ["Compare Health Options", "Pros, Cons & Facts", "Make an Informed Choice"],
  companies: ["Compare Companies", "Side-by-Side Breakdown", "Which Company Wins?"],
};

/**
 * Build a validated RSA asset for an ad group / category. Optionally injects an
 * entity-pair headline ("A vs B") when it fits the 30-char limit.
 */
export function buildRsaAsset(
  category: string,
  entityA?: string | null,
  entityB?: string | null
): RsaAsset {
  const cat = (category || "general").toLowerCase();
  const headlines: string[] = [];

  // Entity-specific headline first if it fits.
  if (entityA && entityB) {
    const vs = `${cap(entityA)} vs ${cap(entityB)}`;
    if (vs.length <= RSA_LIMITS.headlineMax) headlines.push(vs);
  }

  for (const h of CATEGORY_HEADLINES[cat] ?? []) {
    if (h.length <= RSA_LIMITS.headlineMax) headlines.push(h);
  }
  for (const h of GENERIC_HEADLINES) {
    if (headlines.length >= RSA_LIMITS.maxHeadlines) break;
    if (h.length <= RSA_LIMITS.headlineMax && !headlines.includes(h)) headlines.push(h);
  }

  const descriptions = GENERIC_DESCRIPTIONS.filter(
    (d) => d.length <= RSA_LIMITS.descriptionMax
  ).slice(0, RSA_LIMITS.maxDescriptions);

  const path1 = cat.slice(0, RSA_LIMITS.pathMax);

  return {
    adGroup: `${cap(cat)} Comparisons`,
    headlines: headlines.slice(0, RSA_LIMITS.maxHeadlines),
    descriptions,
    paths: [path1, "compare"],
  };
}

export interface RsaViolation {
  adGroup: string;
  field: "headline" | "description" | "path" | "count";
  value: string;
  reason: string;
}

/** Validate one RSA asset against Google Ads limits. Returns [] when clean. */
export function validateRsaAsset(asset: RsaAsset): RsaViolation[] {
  const v: RsaViolation[] = [];
  const { headlineMax, descriptionMax, pathMax, minHeadlines, maxHeadlines, minDescriptions, maxDescriptions } =
    RSA_LIMITS;

  if (asset.headlines.length < minHeadlines || asset.headlines.length > maxHeadlines) {
    v.push({
      adGroup: asset.adGroup,
      field: "count",
      value: String(asset.headlines.length),
      reason: `headlines must be ${minHeadlines}-${maxHeadlines}`,
    });
  }
  if (asset.descriptions.length < minDescriptions || asset.descriptions.length > maxDescriptions) {
    v.push({
      adGroup: asset.adGroup,
      field: "count",
      value: String(asset.descriptions.length),
      reason: `descriptions must be ${minDescriptions}-${maxDescriptions}`,
    });
  }
  for (const h of asset.headlines) {
    if (h.length > headlineMax)
      v.push({ adGroup: asset.adGroup, field: "headline", value: h, reason: `>${headlineMax} chars (${h.length})` });
  }
  for (const d of asset.descriptions) {
    if (d.length > descriptionMax)
      v.push({ adGroup: asset.adGroup, field: "description", value: d, reason: `>${descriptionMax} chars (${d.length})` });
  }
  for (const p of asset.paths) {
    if (p && p.length > pathMax)
      v.push({ adGroup: asset.adGroup, field: "path", value: p, reason: `>${pathMax} chars (${p.length})` });
  }
  return v;
}

/** Default ad-group archetypes to ship on day one. */
export const DEFAULT_AD_GROUPS = [
  "technology",
  "software",
  "automotive",
  "products",
  "health",
  "companies",
  "general",
];

/** Build the full, validated copy deck for the default archetypes. */
export function buildCopyDeck(): { assets: RsaAsset[]; violations: RsaViolation[] } {
  const assets = DEFAULT_AD_GROUPS.map((c) => buildRsaAsset(c));
  const violations = assets.flatMap(validateRsaAsset);
  return { assets, violations };
}

function cap(s: string): string {
  return s.replace(/\b\w/g, (l) => l.toUpperCase());
}

// ---------------------------------------------------------------------------
// Assembled launch kit
// ---------------------------------------------------------------------------

export interface LaunchKit {
  generatedAt: string;
  requiredEnvVars: { name: string; source: string }[];
  conversionTaxonomy: ConversionAction[];
  negativeKeywords: NegativeKeywordSet;
  remarketingAudiences: RemarketingAudience[];
  copyDeck: { assets: RsaAsset[]; violations: RsaViolation[] };
}

export function buildLaunchKit(): LaunchKit {
  return {
    generatedAt: new Date().toISOString(),
    requiredEnvVars: [
      { name: "NEXT_PUBLIC_GTM_ID", source: "tagmanager.google.com -> New Container -> Web" },
      { name: "NEXT_PUBLIC_GA_ID", source: "Google Analytics -> Admin -> Data Streams" },
      { name: "NEXT_PUBLIC_GOOGLE_ADS_ID", source: "ads.google.com -> format AW-XXXXXXXXX" },
      { name: "NEXT_PUBLIC_META_PIXEL_ID", source: "Meta Business Suite -> Events Manager -> Create Pixel" },
    ],
    conversionTaxonomy: CONVERSION_TAXONOMY,
    negativeKeywords: NEGATIVE_KEYWORDS,
    remarketingAudiences: REMARKETING_AUDIENCES,
    copyDeck: buildCopyDeck(),
  };
}
