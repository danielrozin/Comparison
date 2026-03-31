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

/**
 * Check if an entity is eligible for affiliate links.
 */
function isAffiliateEligible(
  entity: ComparisonEntityData,
  category: string | null,
): boolean {
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
