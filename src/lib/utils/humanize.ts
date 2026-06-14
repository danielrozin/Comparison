import { ENTITY_CONTENT } from "@/lib/data/entity-content";

/**
 * Human-readable entity names from slugs, for use in `<title>`, H1, OG/Twitter
 * titles, meta descriptions, and breadcrumbs on /entity, /alternatives, and
 * /reviews pages.
 *
 * The naive caser these pages previously used —
 *   slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
 * — mangled every acronym and brand in the SERP billboard:
 *   ios → "Ios", proton-vpn → "Proton Vpn", iphone-17-pro → "Iphone 17 Pro".
 *
 * Fix (DAN-1141): prefer a curated display name when we have one, otherwise
 * fall back to an acronym/brand/particle-aware caser.
 */

// Tokens that should render with fixed, non-titlecase spelling.
const ACRONYMS: Record<string, string> = {
  // Apple OSes / Apple-style lowercase-i casing
  ios: "iOS",
  ipados: "iPadOS",
  macos: "macOS",
  tvos: "tvOS",
  watchos: "watchOS",
  imac: "iMac",
  // geos
  us: "US",
  usa: "USA",
  uk: "UK",
  eu: "EU",
  uae: "UAE",
  // economics / general
  gdp: "GDP",
  ceo: "CEO",
  // hardware
  gpu: "GPU",
  cpu: "CPU",
  usb: "USB",
  ssd: "SSD",
  hdd: "HDD",
  ram: "RAM",
  oled: "OLED",
  lcd: "LCD",
  "4k": "4K",
  "8k": "8K",
  ps5: "PS5",
  ps4: "PS4",
  // domains / tech
  vpn: "VPN",
  tv: "TV",
  ai: "AI",
  ar: "AR",
  vr: "VR",
  ev: "EV",
  suv: "SUV",
  llm: "LLM",
  api: "API",
  seo: "SEO",
  saas: "SaaS",
  crm: "CRM",
  erp: "ERP",
  cms: "CMS",
  // orgs / media
  hbo: "HBO",
  nasa: "NASA",
  fbi: "FBI",
  cia: "CIA",
  nba: "NBA",
  nfl: "NFL",
  mlb: "MLB",
  // companies / brands that are themselves acronyms
  amd: "AMD",
  ibm: "IBM",
  hp: "HP",
  lg: "LG",
  bmw: "BMW",
  gmc: "GMC",
  kfc: "KFC",
};

// Full-token brand spellings (camel/Pascal/lowercase-prefix casing).
const BRANDS: Record<string, string> = {
  iphone: "iPhone",
  ipad: "iPad",
  ipod: "iPod",
  airpods: "AirPods",
  airtag: "AirTag",
  macbook: "MacBook",
  homepod: "HomePod",
  carplay: "CarPlay",
  icloud: "iCloud",
  youtube: "YouTube",
  nordvpn: "NordVPN",
  expressvpn: "ExpressVPN",
  protonvpn: "ProtonVPN",
  surfshark: "Surfshark",
  chatgpt: "ChatGPT",
  openai: "OpenAI",
  deepseek: "DeepSeek",
  github: "GitHub",
  gitlab: "GitLab",
  paypal: "PayPal",
  wordpress: "WordPress",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  whatsapp: "WhatsApp",
  snapchat: "Snapchat",
  playstation: "PlayStation",
  powerpoint: "PowerPoint",
  onedrive: "OneDrive",
  dropbox: "Dropbox",
  coinbase: "Coinbase",
  ebay: "eBay",
};

// Lowercased when not the first word (English minor words / particles).
const PARTICLES = new Set([
  "with",
  "vs",
  "to",
  "of",
  "and",
  "the",
  "for",
  "a",
  "an",
  "or",
  "in",
  "on",
  "at",
  "by",
  "per",
]);

function caseToken(token: string, index: number): string {
  const lower = token.toLowerCase();
  if (ACRONYMS[lower]) return ACRONYMS[lower];
  if (BRANDS[lower]) return BRANDS[lower];
  // Model numbers / version tokens: i4, 330i, 17, s26, a19 — keep verbatim.
  if (/\d/.test(token)) return token;
  if (index > 0 && PARTICLES.has(lower)) return lower;
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/**
 * Acronym/brand/particle-aware title caser for a hyphenated slug.
 * Exported for direct testing; prefer {@link humanizeEntityName} in app code.
 */
export function caseSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((t, i) => caseToken(t, i))
    .join(" ");
}

// Built once from the curated alternatives lists already in ENTITY_CONTENT
// (e.g. { slug: "samsung-galaxy-s26", name: "Samsung Galaxy S26" }). This is the
// same human-authored source /compare pages resolve display names from.
let curatedCache: Record<string, string> | null = null;
function curatedNames(): Record<string, string> {
  if (curatedCache) return curatedCache;
  const map: Record<string, string> = {};
  for (const content of Object.values(ENTITY_CONTENT)) {
    for (const alt of content.alternatives) {
      if (alt.slug && alt.name && !map[alt.slug]) {
        map[alt.slug] = alt.name;
      }
    }
  }
  curatedCache = map;
  return map;
}

/**
 * Resolve a slug to a display name for SEO titles/H1/breadcrumbs.
 * Prefers a curated name; falls back to the acronym/brand-aware caser.
 */
export function humanizeEntityName(slug: string): string {
  const curated = curatedNames()[slug];
  if (curated) return curated;
  return caseSlug(slug);
}
