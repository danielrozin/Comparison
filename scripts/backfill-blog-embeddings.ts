/**
 * Backfill title embeddings for existing BlogArticle rows (DAN-520 gate #2).
 *
 * Embeds the title of every published article that does not yet have a
 * `titleEmbedding`, in provider-sized batches, and writes the vectors back.
 * Idempotent — re-running only touches rows that are still empty, so it is
 * safe to run after a partial failure.
 *
 * Requires OPENAI_API_KEY (or EMBEDDING_API_KEY) and DATABASE_URL in
 * .env.local. Cost for the current ~252-row corpus is well under $0.01.
 *
 * Usage: npx tsx scripts/backfill-blog-embeddings.ts
 *        npm run backfill:blog-embeddings
 */

import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { PrismaClient } from "@prisma/client";
import { embedTexts, embeddingsEnabled, getEmbeddingModel } from "../src/lib/services/embeddings";

const BATCH = 128;

async function main() {
  if (!embeddingsEnabled()) {
    console.error(
      "No embeddings provider configured. Set OPENAI_API_KEY (or EMBEDDING_API_KEY) in .env.local."
    );
    process.exit(1);
  }

  const prisma = new PrismaClient();
  try {
    const rows = await prisma.blogArticle.findMany({
      where: { status: "published" },
      select: { id: true, slug: true, title: true, titleEmbedding: true },
    });

    const pending = rows.filter(
      (r) => !r.titleEmbedding || (r.titleEmbedding as number[]).length === 0
    );

    console.log(
      `Model: ${getEmbeddingModel()}  |  published: ${rows.length}  |  need embedding: ${pending.length}`
    );
    if (pending.length === 0) {
      console.log("Nothing to backfill. ✓");
      return;
    }

    let updated = 0;
    let failed = 0;
    for (let i = 0; i < pending.length; i += BATCH) {
      const chunk = pending.slice(i, i + BATCH);
      const embeddings = await embedTexts(chunk.map((r) => r.title));
      if (!embeddings) {
        console.error(`Batch ${i / BATCH} returned no embeddings (provider error). Aborting.`);
        break;
      }
      for (let j = 0; j < chunk.length; j++) {
        const vec = embeddings[j];
        if (!vec || vec.length === 0) {
          failed++;
          console.warn(`  skip (no vector): ${chunk[j].slug}`);
          continue;
        }
        await prisma.blogArticle.update({
          where: { id: chunk[j].id },
          data: { titleEmbedding: vec },
        });
        updated++;
      }
      console.log(`  progress: ${Math.min(i + BATCH, pending.length)}/${pending.length}`);
    }

    console.log(`\nDone. Updated ${updated}, failed ${failed}.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
