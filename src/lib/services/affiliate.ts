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
 * Generate all affiliate links for an entity.
 * Product-eligible entities get affiliate links (e.g. Amazon).
 * All other entities get a generic "Learn More" CTA.
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

    // Future: add Impact, ShareASale, etc. based on entity metadata
    // if (entity.metadata?.impactUrl) links.push({ ... });
  }

  // If no affiliate links, add a generic "Learn More" CTA
  if (links.length === 0) {
    links.push(generateGenericLink(entity.name));
  }

  return links;
}

/**
 * Enrich entities with affiliate links.
 */
export function enrichEntitiesWithAffiliateLinks(
  entities: ComparisonEntityData[],
  category: string | null,
): ComparisonEntityData[] {
  if (!AFFILIATE_ENABLED) return entities;

  return entities.map((entity) => ({
    ...entity,
    affiliateLinks: generateAffiliateLinks(entity, category),
  }));
}
