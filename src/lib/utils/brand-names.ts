/**
 * Brand-name normalization for slug→title fallback display.
 *
 * Used by:
 *   - DynamicComparison.tsx (client placeholder while a DB-miss slug generates)
 *   - app/compare/[slug]/page.tsx generateMetadata fallback for DB-miss slugs
 *
 * Inputs come from `slug.split("-vs-")[i].replace(/-/g, " ")`, so values are
 * lowercased and space-separated. The map covers the ~30 brands we consistently
 * see in incoming traffic where naive title-case ("Chatgpt") is wrong.
 *
 * For unknown names we fall back to per-word title-case, which is correct for
 * the long tail (e.g., "tesla model 3" → "Tesla Model 3").
 */

const BRAND_NAMES: Record<string, string> = {
  // AI / models
  chatgpt: "ChatGPT",
  copilot: "Microsoft Copilot",
  "github copilot": "GitHub Copilot",
  "gpt 3": "GPT-3",
  "gpt 4": "GPT-4",
  "gpt 4o": "GPT-4o",
  "gpt 5": "GPT-5",
  llama: "Llama",
  llama2: "Llama 2",
  llama3: "Llama 3",
  midjourney: "Midjourney",
  dalle: "DALL-E",
  "dall e": "DALL-E",
  "stable diffusion": "Stable Diffusion",
  perplexity: "Perplexity",
  // OS / Apple
  iphone: "iPhone",
  ipad: "iPad",
  imac: "iMac",
  macbook: "MacBook",
  airpods: "AirPods",
  airpod: "AirPod",
  ipod: "iPod",
  appletv: "Apple TV",
  "apple tv": "Apple TV",
  macos: "macOS",
  ios: "iOS",
  ipados: "iPadOS",
  watchos: "watchOS",
  tvos: "tvOS",
  // Microsoft
  powershell: "PowerShell",
  outlook: "Outlook",
  onedrive: "OneDrive",
  onenote: "OneNote",
  sharepoint: "SharePoint",
  windows10: "Windows 10",
  windows11: "Windows 11",
  // Dev / tools
  javascript: "JavaScript",
  typescript: "TypeScript",
  nodejs: "Node.js",
  "node js": "Node.js",
  github: "GitHub",
  gitlab: "GitLab",
  bitbucket: "Bitbucket",
  vscode: "VS Code",
  "vs code": "VS Code",
  webstorm: "WebStorm",
  jetbrains: "JetBrains",
  intellij: "IntelliJ",
  // Social / consumer
  youtube: "YouTube",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
  facebook: "Facebook",
  instagram: "Instagram",
  snapchat: "Snapchat",
  pinterest: "Pinterest",
  // Gaming
  playstation: "PlayStation",
  xbox: "Xbox",
  nintendo: "Nintendo",
  // Cloud / infra
  aws: "AWS",
  gcp: "GCP",
  azure: "Azure",
  cloudflare: "Cloudflare",
  vercel: "Vercel",
  netlify: "Netlify",
  // Other
  paypal: "PayPal",
  ebay: "eBay",
  ikea: "IKEA",
  ibm: "IBM",
  hp: "HP",
  amd: "AMD",
};

function titleCaseWord(token: string): string {
  if (!token) return token;
  return token.charAt(0).toUpperCase() + token.slice(1);
}

/**
 * Normalize a single entity name (already dash-replaced and lowercased)
 * to its canonical brand-cased display form.
 *
 * Tries the full string against the brand map first (so multi-word brands
 * like "github copilot" → "GitHub Copilot" are preserved), then falls back
 * to per-token lookup so unknown names still get sensible title-casing.
 */
export function normalizeBrandName(raw: string): string {
  const lower = raw.toLowerCase().trim();
  if (!lower) return raw;
  if (BRAND_NAMES[lower]) return BRAND_NAMES[lower];

  return lower
    .split(/\s+/)
    .map((tok) => BRAND_NAMES[tok] ?? titleCaseWord(tok))
    .join(" ");
}

/**
 * Format a comparison slug like "copilot-vs-chatgpt" into a human title
 * "Microsoft Copilot vs ChatGPT". Used as fallback when no DB row exists.
 */
export function formatSlugToTitle(slug: string): string {
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return normalizeBrandName(slug.replace(/-/g, " "));
  const a = normalizeBrandName(parts[0].replace(/-/g, " "));
  const b = normalizeBrandName(parts[1].replace(/-/g, " "));
  return `${a} vs ${b}`;
}
