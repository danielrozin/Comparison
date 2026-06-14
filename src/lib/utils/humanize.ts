/**
 * humanizeEntityName — turn an entity/alternatives slug into a correctly-cased
 * display name for <title>, H1, OG/twitter titles, meta descriptions and
 * breadcrumbs.
 *
 * DAN-1141: the naive `slug.replace(/-/g," ").replace(/\b\w/g, l => l.toUpperCase())`
 * caser mangled every acronym and brand on /entity/* and /alternatives/* pages
 * (Ios→"Ios" should be iOS; "Proton Vpn" should be Proton VPN; "Iphone 17 Pro"
 * should be iPhone 17 Pro). /compare/* pages were unaffected because they resolve
 * curated display names from the DB.
 *
 * This is a single shared utility used by entity + alternatives titles/H1/meta/
 * breadcrumbs and the /compare no-DB fallback. It is dependency-free (no DB, no
 * large data imports) so it is safe to use in both server and client components.
 *
 * Token rules, in order:
 *  1. Brand / acronym override map (iphone→iPhone, vpn→VPN, 4k→4K, ...).
 *  2. Lowercase particles (with, vs, to, of, and, the, ...) except the first word.
 *  3. Model-number / alphanumeric preservation (i4, 330i, 17, a19) kept verbatim.
 *  4. Default: capitalize the first letter.
 */

/**
 * Brand + acronym casing overrides, keyed by the lowercase slug token.
 * Value is the exact desired rendering of that single token.
 */
const TOKEN_OVERRIDES: Record<string, string> = {
  // Apple ecosystem (intercaps)
  ios: "iOS",
  ipados: "iPadOS",
  macos: "macOS",
  watchos: "watchOS",
  tvos: "tvOS",
  iphone: "iPhone",
  ipad: "iPad",
  ipod: "iPod",
  imac: "iMac",
  imessage: "iMessage",
  icloud: "iCloud",
  itunes: "iTunes",
  airpods: "AirPods",
  airtag: "AirTag",
  airtags: "AirTags",
  macbook: "MacBook",
  mac: "Mac",
  // Common acronyms
  us: "US",
  usa: "USA",
  uk: "UK",
  eu: "EU",
  uae: "UAE",
  un: "UN",
  gdp: "GDP",
  gpu: "GPU",
  cpu: "CPU",
  ram: "RAM",
  rom: "ROM",
  ssd: "SSD",
  hdd: "HDD",
  usb: "USB",
  vpn: "VPN",
  tv: "TV",
  ai: "AI",
  ml: "ML",
  llm: "LLM",
  api: "API",
  seo: "SEO",
  sem: "SEM",
  suv: "SUV",
  suvs: "SUVs",
  ev: "EV",
  evs: "EVs",
  os: "OS",
  pc: "PC",
  ui: "UI",
  ux: "UX",
  oled: "OLED",
  lcd: "LCD",
  led: "LED",
  hdr: "HDR",
  "4k": "4K",
  "8k": "8K",
  "5g": "5G",
  "4g": "4G",
  "3d": "3D",
  "2d": "2D",
  nft: "NFT",
  crm: "CRM",
  erp: "ERP",
  saas: "SaaS",
  b2b: "B2B",
  b2c: "B2C",
  roi: "ROI",
  kpi: "KPI",
  faq: "FAQ",
  hbo: "HBO",
  nasa: "NASA",
  fbi: "FBI",
  cia: "CIA",
  amd: "AMD",
  ps5: "PS5",
  ps4: "PS4",
  nfl: "NFL",
  nba: "NBA",
  mlb: "MLB",
  nhl: "NHL",
  ufc: "UFC",
  espn: "ESPN",
  bbc: "BBC",
  cnn: "CNN",
  // Brands / intercaps
  bmw: "BMW",
  youtube: "YouTube",
  github: "GitHub",
  gitlab: "GitLab",
  paypal: "PayPal",
  wordpress: "WordPress",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
  powerpoint: "PowerPoint",
  onedrive: "OneDrive",
  onenote: "OneNote",
  playstation: "PlayStation",
  xbox: "Xbox",
  nintendo: "Nintendo",
  chatgpt: "ChatGPT",
  openai: "OpenAI",
  deepseek: "DeepSeek",
  nordvpn: "NordVPN",
  expressvpn: "ExpressVPN",
  protonvpn: "ProtonVPN",
  surfshark: "Surfshark",
  airbnb: "Airbnb",
  dropbox: "Dropbox",
  netflix: "Netflix",
  spotify: "Spotify",
  hubspot: "HubSpot",
  salesforce: "Salesforce",
  shopify: "Shopify",
  woocommerce: "WooCommerce",
  bigquery: "BigQuery",
  myspace: "MySpace",
  semrush: "Semrush",
  ahrefs: "Ahrefs",
};

/**
 * Particles that stay lowercase unless they are the first word of the name.
 */
const PARTICLES = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "in",
  "nor",
  "of",
  "on",
  "or",
  "per",
  "the",
  "to",
  "via",
  "vs",
  "with",
]);

function capitalizeWord(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Case a single slug token. `isFirst` controls particle handling.
 */
function caseToken(token: string, isFirst: boolean): string {
  const lower = token.toLowerCase();

  // 1. Brand / acronym override (handles 4k, ps5, 5g before the digit rule).
  if (TOKEN_OVERRIDES[lower]) return TOKEN_OVERRIDES[lower];

  // 2. Lowercase particles, except when leading the name.
  if (!isFirst && PARTICLES.has(lower)) return lower;

  // 3. Preserve model numbers / alphanumerics verbatim (i4, 330i, 17, a19).
  if (/\d/.test(token)) return token;

  // 4. Default: capitalize first letter.
  return capitalizeWord(lower);
}

/**
 * Convert an entity slug into a correctly-cased human display name.
 *
 * @example
 * humanizeEntityName("ios")                    // "iOS"
 * humanizeEntityName("proton-vpn")             // "Proton VPN"
 * humanizeEntityName("iphone-17-pro")          // "iPhone 17 Pro"
 * humanizeEntityName("united-states-gdp-2026") // "United States GDP 2026"
 * humanizeEntityName("2026-bmw-330i")          // "2026 BMW 330i"
 */
export function humanizeEntityName(slug: string): string {
  if (!slug) return "";
  const tokens = slug.trim().toLowerCase().split("-").filter(Boolean);
  return tokens.map((t, i) => caseToken(t, i === 0)).join(" ");
}
