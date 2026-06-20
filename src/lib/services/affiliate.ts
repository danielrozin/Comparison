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
    "evernote",
    "\\bchatgpt\\b",
    "\\bclaude\\b",
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

/**
 * Generate a generic "Learn More" link for non-product entities.
 * Uses a Google search to help users find more information.
 */
function generateGenericLink(entityName: string): AffiliateLink {
  const query = encodeURIComponent(entityName);
  return {
    url: `https://www.google.com/search?q=${query}`,
    partner: "generic",
    label: `Learn more about ${entityName}`,
  };
}

/**
 * Official brand homepages for digital / SaaS / VPN / software entities that
 * cannot be bought on Amazon. When no tracked affiliate URL is configured yet
 * (network approvals tracked in DAN-638/639/654), the CTA points at the brand's
 * real homepage instead of a Google SERP — which leaks high-intent, sponsored
 * clicks to competitors' ads — or an irrelevant Amazon search (the "Claude on
 * Amazon" class of bug). Swapping in a tracked affiliate URL later is a pure
 * data change with zero template edits. See DAN-1140.
 *
 * Patterns are matched in order against the entity name; first match wins, so
 * keep more-specific patterns above broader ones. Aligned with
 * DIGITAL_ENTITY_PATTERNS above.
 */
const BRAND_HOMEPAGES: ReadonlyArray<readonly [RegExp, string]> = [
  // VPNs — highest affiliate value ($30–100/sale)
  [/nordvpn/i, "https://nordvpn.com"],
  [/surfshark/i, "https://surfshark.com"],
  [/expressvpn/i, "https://www.expressvpn.com"],
  // AI assistants / tools
  [/\bchatgpt\b/i, "https://chatgpt.com"],
  [/\bclaude\b/i, "https://claude.ai"],
  [/\bgemini\b/i, "https://gemini.google.com"],
  [/perplexity/i, "https://www.perplexity.ai"],
  [/midjourney/i, "https://www.midjourney.com"],
  // Productivity / SaaS / web apps
  [/notion/i, "https://www.notion.so"],
  [/evernote/i, "https://evernote.com"],
  [/obsidian/i, "https://obsidian.md"],
  [/\bslack\b/i, "https://slack.com"],
  [/microsoft\s*teams|^teams$/i, "https://www.microsoft.com/microsoft-teams"],
  [/\bzoom\b/i, "https://zoom.us"],
  [/figma/i, "https://www.figma.com"],
  [/sketch\b/i, "https://www.sketch.com"],
  [/canva/i, "https://www.canva.com"],
  [/photoshop/i, "https://www.adobe.com/products/photoshop.html"],
  [/wordpress/i, "https://wordpress.org"],
  [/\bwix\b/i, "https://www.wix.com"],
  [/squarespace/i, "https://www.squarespace.com"],
  [/webflow/i, "https://webflow.com"],
  [/vs\s*code|vscode|visual\s*studio\s*code/i, "https://code.visualstudio.com"],
  [/\bcursor\b/i, "https://cursor.com"],
  [/dropbox/i, "https://www.dropbox.com"],
  [/google\s*drive/i, "https://drive.google.com"],
  [/onedrive/i, "https://onedrive.live.com"],
  [/gmail/i, "https://www.google.com/gmail/about/"],
  [/outlook/i, "https://outlook.com"],
  // Password managers
  [/\b1password\b/i, "https://1password.com"],
  [/lastpass/i, "https://www.lastpass.com"],
  [/bitwarden/i, "https://bitwarden.com"],
  // Streaming video
  [/netflix/i, "https://www.netflix.com"],
  [/\bhulu\b/i, "https://www.hulu.com"],
  [/disney\s*\+|disney\s*plus/i, "https://www.disneyplus.com"],
  [/hbo\s*max|^max$|\bmax\b\s*\(formerly/i, "https://www.max.com"],
  [/peacock/i, "https://www.peacocktv.com"],
  [/paramount\s*\+|paramount\s*plus/i, "https://www.paramountplus.com"],
  [/prime\s*video/i, "https://www.primevideo.com"],
  [/crunchyroll/i, "https://www.crunchyroll.com"],
  [/youtube\s*tv/i, "https://tv.youtube.com"],
  [/apple\s*tv\s*\+|apple\s*tv\s*plus/i, "https://tv.apple.com"],
  // Streaming music
  [/spotify/i, "https://www.spotify.com"],
  [/apple\s*music/i, "https://music.apple.com"],
  [/\btidal\b/i, "https://tidal.com"],
  [/deezer/i, "https://www.deezer.com"],
  [/soundcloud/i, "https://soundcloud.com"],
  [/pandora/i, "https://www.pandora.com"],
  [/youtube\s*music/i, "https://music.youtube.com"],
  // Browsers
  [/google\s*chrome|\bchrome\b/i, "https://www.google.com/chrome/"],
  [/firefox/i, "https://www.mozilla.org/firefox/"],
  [/\bsafari\b/i, "https://www.apple.com/safari/"],
  [/microsoft\s*edge|\bedge\b/i, "https://www.microsoft.com/edge"],
  [/brave\s*browser|\bbrave\b/i, "https://brave.com"],
  [/\bopera\b/i, "https://www.opera.com"],
  [/vivaldi/i, "https://vivaldi.com"],
  [/tor\s*browser/i, "https://www.torproject.org"],
  // Operating systems
  [/windows\s*\d|microsoft\s*windows|\bwindows\b/i, "https://www.microsoft.com/windows"],
  [/macos|mac\s*os/i, "https://www.apple.com/macos/"],
  [/ubuntu/i, "https://ubuntu.com"],
  [/fedora/i, "https://fedoraproject.org"],
  [/debian/i, "https://www.debian.org"],
  [/chrome\s*os|chromeos/i, "https://www.google.com/chromebook/chrome-os/"],
  [/\blinux\b/i, "https://www.linux.org"],
  [/\bandroid\b/i, "https://www.android.com"],
  [/\bios\b/i, "https://www.apple.com/ios/"],
];

/**
 * Resolve an entity name to its official brand homepage. Returns a curated URL
 * for known digital brands, otherwise a best-effort {brand}.com guess for the
 * long tail — still strictly better than a Google SERP (captures direct-referral
 * intent, no competitor ads) and trivially swappable for a tracked affiliate
 * URL once approved. See DAN-1140.
 */
export function resolveBrandHomepage(entityName: string): string {
  for (const [pattern, url] of BRAND_HOMEPAGES) {
    if (pattern.test(entityName)) return url;
  }
  const slug = entityName.toLowerCase().replace(/[^a-z0-9]/g, "");
  return slug ? `https://www.${slug}.com` : "";
}

/**
 * Generate a brand-homepage CTA for a digital / SaaS / VPN / software entity
 * that has no configured affiliate URL. Tagged partner "brand" so the UI renders
 * it as a sponsored, real-destination CTA (not a Google "Learn more"). DAN-1140.
 */
function generateBrandHomepageLink(entityName: string): AffiliateLink | null {
  const url = resolveBrandHomepage(entityName);
  if (!url) return null;
  return {
    url,
    partner: "brand",
    label: `Get ${entityName}`,
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

  if (isDigitalEntity(entity)) {
    // Software / SaaS / VPN / streaming: not buyable on Amazon. Point at the
    // brand's official homepage instead of leaking a sponsored click to a
    // Google SERP or emitting an irrelevant Amazon search. DAN-1140.
    const brand = generateBrandHomepageLink(entity.name);
    if (brand) links.push(brand);
  } else if (isAffiliateEligible(entity, category)) {
    const amazon = generateAmazonLink(entity.name);
    if (amazon) links.push(amazon);
  }

  // Non-product, non-digital entities (countries, people, concepts) fall back
  // to a plain "Learn More" Google search — informational, never sponsored.
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
