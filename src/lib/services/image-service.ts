/**
 * Image Service — fetches entity images from free APIs
 * Sources: Wikipedia API → Clearbit (brands) → null fallback (shows initials)
 */

import { getRedis } from "@/lib/services/redis";

const CACHE_TTL = 60 * 60 * 24 * 7; // 7 days in seconds
const CACHE_PREFIX = "image:v2:";
const NEG_CACHE_VALUE = "__none__";

/**
 * Fetch logo from Clearbit Logo API (best for brands/companies).
 * Returns URL or null.
 */
async function fetchFromClearbit(entityName: string): Promise<string | null> {
  // Try common TLD patterns: name.com, nameshort.com
  const cleanName = entityName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 20);

  if (!cleanName) return null;

  const url = `https://logo.clearbit.com/${cleanName}.com`;
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) return url;
  } catch {
    // non-critical
  }
  return null;
}

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
 * Tries Wikipedia → Clearbit (for brands/companies) → null (shows initials).
 * Caches hits AND misses in Redis.
 */
export async function fetchEntityImage(
  entityName: string,
  entityType: string,
  slug?: string
): Promise<string | null> {
  const cacheKey = `${CACHE_PREFIX}${slug || entityName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  // Check cache first (includes negative results)
  const redis = getRedis();
  if (redis) {
    try {
      const cached = await redis.get<string>(cacheKey);
      if (cached === NEG_CACHE_VALUE) return null;
      if (cached) return cached;
    } catch {
      // Redis errors are non-critical
    }
  }

  let resolvedImage: string | null = null;

  // Try Wikipedia first (works for people, countries, most products)
  resolvedImage = await fetchFromWikipedia(entityName);

  // For brands/companies/software, also try Clearbit if Wikipedia failed
  if (!resolvedImage) {
    const type = entityType?.toLowerCase() || "";
    if (["brand", "company", "software", "product", "technology"].includes(type)) {
      resolvedImage = await fetchFromClearbit(entityName);
    }
  }

  // Cache the result (including null as negative cache)
  if (redis) {
    try {
      await redis.set(cacheKey, resolvedImage || NEG_CACHE_VALUE, { ex: CACHE_TTL });
    } catch {
      // Redis errors are non-critical
    }
  }

  return resolvedImage;
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

/**
 * Enrich a comparison's entities array with imageUrl values.
 * Only fetches for entities that don't already have a valid image.
 * Falls back to null (shows initials) if nothing is found.
 */
export async function enrichEntitiesWithImages<
  T extends {
    name: string;
    slug: string;
    entityType: string;
    imageUrl: string | null;
  },
>(entities: T[]): Promise<T[]> {
  const needImages = entities.filter(
    (e) => !e.imageUrl || e.imageUrl.includes("ui-avatars.com")
  );

  if (needImages.length === 0) return entities;

  const imageMap = await fetchEntityImages(
    needImages.map((e) => ({ name: e.name, type: e.entityType, slug: e.slug }))
  );

  return entities.map((entity) => {
    if (entity.imageUrl && !entity.imageUrl.includes("ui-avatars.com")) {
      return entity;
    }
    const fetched = imageMap.get(entity.slug);
    return fetched ? { ...entity, imageUrl: fetched } : { ...entity, imageUrl: null };
  });
}
