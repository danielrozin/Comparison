/**
 * Affiliate Link Service
 *
 * Generates affiliate URLs for entities based on their type and category.
 * Supports Amazon Associates, and is extensible for Impact, ShareASale, etc.
 *
 * Configuration:
 *   NEXT_PUBLIC_AMAZON_AFFILIATE_TAG - Amazon Associates tag (e.g. "aversusb-20")
 *   NEXT_PUBLIC_AFFILIATE_ENABLED    - Set to "true" to enable affiliate links
 */

import type { ComparisonEntityData, AffiliateLink } from "@/types";
import { getPrisma } from "@/lib/db/prisma";

const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || "";
const AFFILIATE_ENABLED = process.env.NEXT_PUBLIC_AFFILIATE_ENABLED === "true";

// Entity types that are eligible for affiliate links (products people can buy)
const AFFILIATE_ELIGIBLE_TYPES = new Set([
  "product",
  "technology",
  "software",
  "brand",
  "device",
  "gadget",
  "appliance",
  "vehicle",
  "supplement",
  "service",
]);

// Categories where affiliate links make commercial sense
const AFFILIATE_ELIGIBLE_CATEGORIES = new Set([
  "technology",
  "products",
  "software",
  "automotive",
  "health",
  "entertainment",
  "brands",
  "gaming",
  "electronics",
  "appliances",
  "fitness",
]);

// Entity types that are inherently digital / non-physical and cannot be
// purchased on Amazon as a "/dp/" product. Emitting an Amazon /s?k= search
// link for these points at irrelevant junk (~0% conversion) and risks the
// Amazon Associates relevance policy. See DAN-1053.
const DIGITAL_ENTITY_TYPES = new Set([
  "streaming",
  "streaming_service",
  "browser",
  "os",
  "operating_system",
  "saas",
  "web_service",
  "website",
  "app",
  "social_media",
  "search_engine",
  "vpn",
]);

// Name patterns for well-known digital/non-physical entities that live inside
// the technology/products/entertainment categories and would otherwise slip
// through category-gating. These are services, browsers, operating systems,
// free/OSS tools, streaming platforms and web apps — none buyable on Amazon as
// a product. Patterns are kept specific to avoid catching physical hardware
// that shares a brand name (e.g. "Apple Music" the service vs an iPhone).
const DIGITAL_ENTITY_PATTERNS: RegExp = new RegExp(
  [
    // Streaming video
    "netflix",
    "\\bhulu\\b",
    // "Max" only as the streaming service — NOT "iPhone 15 Pro Max" etc.
    "^max$|hbo\\s*max|\\bmax\\b\\s*\\(formerly",
    "hbo",
    "disney\\s*\\+|disney\\s*plus",
    "peacock",
    "paramount\\s*\\+|paramount\\s*plus",
    "prime\\s*video",
    "crunchyroll",
    "sling\\s*tv",
    "fubo",
    "youtube\\s*tv",
    "apple\\s*tv\\s*\\+|apple\\s*tv\\s*plus",
    // Streaming music
    "spotify",
    "apple\\s*music",
    "\\btidal\\b",
    "deezer",
    "soundcloud",
    "pandora",
    "youtube\\s*music",
    "amazon\\s*music",
    // Browsers
    "google\\s*chrome|\\bchrome\\b",
    "firefox",
    "\\bsafari\\b",
    "microsoft\\s*edge|\\bedge\\b",
    "brave\\s*browser|\\bbrave\\b",
    "\\bopera\\b",
    "vivaldi",
    "tor\\s*browser",
    // Operating systems
    "windows\\s*\\d|microsoft\\s*windows|\\bwindows\\b",
    "macos|mac\\s*os",
    "\\blinux\\b",
    "ubuntu",
    "fedora",
    "debian",
    "chrome\\s*os|chromeos",
    "\\bandroid\\b",
    "\\bios\\b",
    // SaaS / productivity / web apps / free & OSS software
    "notion",
    "obsidian",
    "\\bslack\\b",
    "microsoft\\s*teams",
    "\\bzoom\\b",
    "figma",
    "sketch\\b",
    "canva",
    "photoshop",
    "wordpress",
    "\\bwix\\b",
    "squarespace",
    "webflow",
    "dropbox",
    "google\\s*drive",
    "onedrive",
    "vs\\s*code|vscode|visual\\s*studio\\s*code",
    "\\bcursor\\b",
    "gmail",
    "outlook",
    "\\bchatgpt\\b",
    "\\bgemini\\b",
    "perplexity",
    "midjourney",
    // VPNs / web services
    "nordvpn|surfshark|expressvpn",
    "\\b1password\\b|lastpass|bitwarden",
  ].join("|"),
  "i",
);

/**
 * Detect digital / non-physical entities (streaming services, browsers, OSes,
 * SaaS, free/OSS software, web services) that cannot be bought on Amazon as a
 * product. These must NOT receive an Amazon /s?k= search CTA. See DAN-1053.
 */
export function isDigitalEntity(entity: ComparisonEntityData): boolean {
  const type = entity.entityType?.toLowerCase?.() ?? "";
  if (DIGITAL_ENTITY_TYPES.has(type)) return true;
  if (DIGITAL_ENTITY_PATTERNS.test(entity.name)) return true;
  return false;
}

/**
 * Check if an entity is eligible for affiliate links.
 */
function isAffiliateEligible(
  entity: ComparisonEntityData,
  category: string | null,
): boolean {
  // Digital/non-physical entities are never Amazon-eligible — suppress the
  // dead search link and let the generic "Learn more" CTA take over. (DAN-1053)
  if (isDigitalEntity(entity)) return false;
  if (AFFILIATE_ELIGIBLE_TYPES.has(entity.entityType)) return true;
  if (category && AFFILIATE_ELIGIBLE_CATEGORIES.has(category.toLowerCase()))
    return true;
  return false;
}

/**
 * Generate an Amazon search affiliate URL for an entity.
 */
function generateAmazonLink(entityName: string): AffiliateLink | null {
  if (!AMAZON_TAG) return null;
  const query = encodeURIComponent(entityName);
  return {
    url: `https://www.amazon.com/s?k=${query}&tag=${AMAZON_TAG}`,
    partner: "amazon",
    label: `Shop ${entityName} on Amazon`,
  };
}

// Official brand homepages for well-known digital / non-physical entities
// (VPNs, SaaS, streaming, browsers, OSes, AI tools). These are the highest
// affiliate-value category on the site. Without a row here the fallback CTA
// used to point at `google.com/search?q=...`, which leaks the click (and the
// purchase intent) straight to Google for $0. Sending the user to the brand's
// own site instead captures the intent and is the drop-in target for a real
// affiliate/tracked link once the network programs are approved (DAN-276).
//
// Ordered most-specific-first: multi-word/brand-specific patterns must win over
// the broader vendor patterns below them (e.g. "YouTube Music" before a bare
// "youtube", "Apple Music"/"Apple TV" before Apple's OS/browser entries).
// Patterns mirror DIGITAL_ENTITY_PATTERNS so every suppressed-Amazon entity has
// a real destination. See DAN-1140.
const BRAND_HOMEPAGES: ReadonlyArray<{ re: RegExp; url: string }> = [
  // VPNs (highest payout — $30–100/sale)
  { re: /nordvpn/i, url: "https://nordvpn.com" },
  { re: /surfshark/i, url: "https://surfshark.com" },
  { re: /expressvpn/i, url: "https://www.expressvpn.com" },
  // Password managers
  { re: /\b1password\b/i, url: "https://1password.com" },
  { re: /lastpass/i, url: "https://www.lastpass.com" },
  { re: /bitwarden/i, url: "https://bitwarden.com" },
  // Streaming music (specific before browsers/OS share brand names)
  { re: /youtube\s*music/i, url: "https://music.youtube.com" },
  { re: /amazon\s*music/i, url: "https://music.amazon.com" },
  { re: /apple\s*music/i, url: "https://music.apple.com" },
  { re: /spotify/i, url: "https://www.spotify.com" },
  { re: /\btidal\b/i, url: "https://tidal.com" },
  { re: /deezer/i, url: "https://www.deezer.com" },
  { re: /soundcloud/i, url: "https://soundcloud.com" },
  { re: /pandora/i, url: "https://www.pandora.com" },
  // Streaming video
  { re: /youtube\s*tv/i, url: "https://tv.youtube.com" },
  { re: /apple\s*tv\s*(\+|plus)/i, url: "https://tv.apple.com" },
  { re: /prime\s*video/i, url: "https://www.primevideo.com" },
  { re: /disney\s*(\+|plus)/i, url: "https://www.disneyplus.com" },
  { re: /paramount\s*(\+|plus)/i, url: "https://www.paramountplus.com" },
  { re: /peacock/i, url: "https://www.peacocktv.com" },
  { re: /crunchyroll/i, url: "https://www.crunchyroll.com" },
  { re: /sling\s*tv/i, url: "https://www.sling.com" },
  { re: /fubo/i, url: "https://www.fubo.tv" },
  { re: /netflix/i, url: "https://www.netflix.com" },
  { re: /\bhulu\b/i, url: "https://www.hulu.com" },
  { re: /hbo\s*max|^max$|\bmax\b\s*\(formerly/i, url: "https://www.max.com" },
  // Browsers
  { re: /google\s*chrome|\bchrome\b/i, url: "https://www.google.com/chrome" },
  { re: /firefox/i, url: "https://www.mozilla.org/firefox" },
  { re: /\bsafari\b/i, url: "https://www.apple.com/safari" },
  { re: /microsoft\s*edge|\bedge\b/i, url: "https://www.microsoft.com/edge" },
  { re: /brave\s*browser|\bbrave\b/i, url: "https://brave.com" },
  { re: /\bopera\b/i, url: "https://www.opera.com" },
  { re: /vivaldi/i, url: "https://vivaldi.com" },
  { re: /tor\s*browser/i, url: "https://www.torproject.org" },
  // Operating systems
  { re: /windows\s*\d|microsoft\s*windows|\bwindows\b/i, url: "https://www.microsoft.com/windows" },
  { re: /macos|mac\s*os/i, url: "https://www.apple.com/macos" },
  { re: /ubuntu/i, url: "https://ubuntu.com" },
  { re: /fedora/i, url: "https://fedoraproject.org" },
  { re: /debian/i, url: "https://www.debian.org" },
  { re: /chrome\s*os|chromeos/i, url: "https://www.google.com/chromebook" },
  { re: /\blinux\b/i, url: "https://www.linux.org" },
  { re: /\bandroid\b/i, url: "https://www.android.com" },
  { re: /\bios\b/i, url: "https://www.apple.com/ios" },
  // AI tools
  { re: /\bchatgpt\b/i, url: "https://chatgpt.com" },
  { re: /\bclaude\b/i, url: "https://claude.ai" },
  { re: /\bgemini\b/i, url: "https://gemini.google.com" },
  { re: /perplexity/i, url: "https://www.perplexity.ai" },
  { re: /midjourney/i, url: "https://www.midjourney.com" },
  // SaaS / productivity / web apps
  { re: /notion/i, url: "https://www.notion.so" },
  { re: /evernote/i, url: "https://evernote.com" },
  { re: /obsidian/i, url: "https://obsidian.md" },
  { re: /\bslack\b/i, url: "https://slack.com" },
  { re: /microsoft\s*teams/i, url: "https://www.microsoft.com/microsoft-teams" },
  { re: /\bzoom\b/i, url: "https://zoom.us" },
  { re: /figma/i, url: "https://www.figma.com" },
  { re: /sketch\b/i, url: "https://www.sketch.com" },
  { re: /canva/i, url: "https://www.canva.com" },
  { re: /photoshop/i, url: "https://www.adobe.com/products/photoshop.html" },
  { re: /wordpress/i, url: "https://wordpress.org" },
  { re: /\bwix\b/i, url: "https://www.wix.com" },
  { re: /squarespace/i, url: "https://www.squarespace.com" },
  { re: /webflow/i, url: "https://webflow.com" },
  { re: /dropbox/i, url: "https://www.dropbox.com" },
  { re: /google\s*drive/i, url: "https://drive.google.com" },
  { re: /onedrive/i, url: "https://www.microsoft.com/microsoft-365/onedrive/online-cloud-storage" },
  { re: /vs\s*code|vscode|visual\s*studio\s*code/i, url: "https://code.visualstudio.com" },
  { re: /\bcursor\b/i, url: "https://www.cursor.com" },
  { re: /gmail/i, url: "https://www.google.com/gmail/about" },
  { re: /outlook/i, url: "https://outlook.com" },
];

/**
 * Resolve the official homepage for a well-known digital/SaaS/VPN brand.
 * Returns null for entities we don't have a canonical destination for. (DAN-1140)
 */
export function resolveBrandHomepage(entityName: string): string | null {
  for (const { re, url } of BRAND_HOMEPAGES) {
    if (re.test(entityName)) return url;
  }
  return null;
}

/**
 * Generate a fallback "Learn More" link for non-Amazon entities.
 *
 * For recognized digital brands (VPNs, SaaS, streaming, AI tools) this points
 * at the brand's official homepage so the click — and the purchase intent —
 * stays with the brand instead of leaking to a Google SERP for $0 (DAN-1140).
 * Truly unknown entities still fall back to a Google search as a last resort.
 *
 * NOTE: these are informational links (partner "generic"), NOT paid affiliate
 * links — they intentionally do not carry a commission disclosure or the
 * `sponsored` rel. Once a tracked affiliate program is approved the DB-stored
 * link (getDbAffiliateLinks) overrides this and renders as a real sponsored CTA.
 */
function generateGenericLink(entityName: string): AffiliateLink {
  const homepage = resolveBrandHomepage(entityName);
  if (homepage) {
    return {
      url: homepage,
      partner: "generic",
      label: `Visit ${entityName} official site`,
    };
  }

  const query = encodeURIComponent(entityName);
  return {
    url: `https://www.google.com/search?q=${query}`,
    partner: "generic",
    label: `Learn more about ${entityName}`,
  };
}

/**
 * Fetch DB-stored affiliate links for an entity.
 * Returns null if DB is unavailable or no links found.
 */
async function getDbAffiliateLinks(entityId: string): Promise<AffiliateLink[] | null> {
  const prisma = getPrisma();
  if (!prisma) return null;

  try {
    const dbLinks = await prisma.affiliateLink.findMany({
      where: {
        entityId,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: { priority: "desc" },
    });

    if (dbLinks.length === 0) return null;

    return dbLinks.map((link) => ({
      url: link.url,
      partner: link.partner,
      label: link.label,
    }));
  } catch {
    return null;
  }
}

/**
 * Generate all affiliate links for an entity.
 * Prefers DB-stored links when available, falls back to auto-generated.
 * Returns empty array if affiliate links are disabled.
 */
export function generateAffiliateLinks(
  entity: ComparisonEntityData,
  category: string | null,
): AffiliateLink[] {
  if (!AFFILIATE_ENABLED) return [];

  const links: AffiliateLink[] = [];

  if (isAffiliateEligible(entity, category)) {
    const amazon = generateAmazonLink(entity.name);
    if (amazon) links.push(amazon);
  }

  // If no affiliate links, add a generic "Learn More" CTA
  if (links.length === 0) {
    links.push(generateGenericLink(entity.name));
  }

  return links;
}

/**
 * Enrich entities with affiliate links.
 * Uses DB-stored links when available, otherwise auto-generates them.
 */
export async function enrichEntitiesWithAffiliateLinks(
  entities: ComparisonEntityData[],
  category: string | null,
): Promise<ComparisonEntityData[]> {
  if (!AFFILIATE_ENABLED) return entities;

  const enriched = await Promise.all(
    entities.map(async (entity) => {
      // Try DB links first (by entity slug lookup)
      const dbLinks = entity.id ? await getDbAffiliateLinks(entity.id) : null;

      return {
        ...entity,
        affiliateLinks: dbLinks || generateAffiliateLinks(entity, category),
      };
    }),
  );

  return enriched;
}
