/**
 * Seed Images Script
 * Fetches Wikipedia images for all entities in the database and updates their records.
 *
 * Run with: npx tsx scripts/seed-images.ts
 */

import { PrismaClient } from "@prisma/client";

const WIKI_API = "https://en.wikipedia.org/api/rest_v1/page/summary";

async function fetchWikipediaImage(entityName: string): Promise<string | null> {
  try {
    const url = `${WIKI_API}/${encodeURIComponent(entityName)}`;
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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const prisma = new PrismaClient();

  try {
    const entities = await prisma.entity.findMany({
      orderBy: { createdAt: "desc" },
    });

    console.log(`Found ${entities.length} entities to process.`);

    let updated = 0;
    let skipped = 0;
    let failed = 0;

    for (const entity of entities) {
      // Skip entities that already have a non-placeholder image
      if (entity.imageUrl && !entity.imageUrl.includes("ui-avatars.com")) {
        console.log(`  [SKIP] ${entity.name} — already has image`);
        skipped++;
        continue;
      }

      const imageUrl = await fetchWikipediaImage(entity.name);

      if (imageUrl) {
        await prisma.entity.update({
          where: { id: entity.id },
          data: { imageUrl },
        });
        console.log(`  [OK]   ${entity.name} — ${imageUrl.substring(0, 80)}...`);
        updated++;
      } else {
        console.log(`  [MISS] ${entity.name} — no Wikipedia image found`);
        failed++;
      }

      // Rate limit: 200ms delay between requests to be nice to Wikipedia
      await sleep(200);
    }

    console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}, No image: ${failed}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
