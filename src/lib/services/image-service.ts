/**
 * Image Service — fetches entity images from free APIs
 * Sources: Wikipedia API (free, no key needed) + UI Avatars placeholder
 * Designed to easily add Unsplash or other providers later.
 */

import { getRedis } from "@/lib/services/redis";

const CACHE_TTL = 60 * 60 * 24 * 7; // 7 days in seconds
const CACHE_PREFIX = "image:";

/**
 * Fetch an image URL for an entity from Wikipedia.
 * Returns the thumbnail URL or null if not found.
 */
async function fetchFromWikipedia(entityName: string): Promise<string | null> {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(entityName)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "ComparisonApp/1.0 (contact@example.com)" },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.thumbnail?.source || null;
  } catch {
    return null;
  }
}

/**
 * Generate a deterministic placeholder URL using UI Avatars.
 */
export function generatePlaceholderUrl(entityName: string, entityType: string): string {
  // Pick color based on entity type for visual variety
  const typeColors: Record<string, string> = {
    person: "6366f1",
    country: "059669",
    product: "d97706",
    team: "dc2626",
    company: "7c3aed",
    brand: "db2777",
    technology: "0891b2",
    event: "ea580c",
    software: "4f46e5",
    place: "16a34a",
  };
  const bg = typeColors[entityType?.toLowerCase()] || "6366f1";

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(entityName)}&size=400&background=${bg}&color=fff&bold=true`;
}

/**
 * Fetch image for a single entity.
 * Tries Wikipedia first, falls back to placeholder.
 * Caches results in Redis if available.
 */
export async function fetchEntityImage(
  entityName: string,
  entityType: string,
  slug?: string
): Promise<string | null> {
  const cacheKey = `${CACHE_PREFIX}${slug || entityName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  // Check cache first
  const redis = getRedis();
  if (redis) {
    try {
      const cached = await redis.get<string>(cacheKey);
      if (cached) return cached;
    } catch {
      // Redis errors are non-critical
    }
  }

  // Try Wikipedia
  const wikiImage = await fetchFromWikipedia(entityName);
  if (wikiImage) {
    // Cache the result
    if (redis) {
      try {
        await redis.set(cacheKey, wikiImage, { ex: CACHE_TTL });
      } catch {
        // Redis errors are non-critical
      }
    }
    return wikiImage;
  }

  // Fallback to placeholder
  const placeholder = generatePlaceholderUrl(entityName, entityType);
  return placeholder;
}

/**
 * Fetch images for multiple entities in parallel.
 * Returns a Map of slug -> imageUrl.
 */
export async function fetchEntityImages(
  entities: { name: string; type: string; slug: string }[]
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  const promises = entities.map(async (entity) => {
    try {
      const imageUrl = await fetchEntityImage(entity.name, entity.type, entity.slug);
      if (imageUrl) {
        results.set(entity.slug, imageUrl);
      }
    } catch {
      // Non-critical — skip this entity
    }
  });

  await Promise.all(promises);
  return results;
}
