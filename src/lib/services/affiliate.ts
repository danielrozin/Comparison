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
