/**
 * Audit existing BlogArticle rows for duplicate clusters (DAN-520).
 *
 * Groups published articles by year-stripped 5-token slug prefix and by
 * topic signature, then prints clusters with >= 3 members. Used by the SEO
 * specialist for ongoing consolidation work and to validate that the dedup
 * gate is preventing new dupes from accumulating.
 *
 * Usage: npx tsx scripts/audit-blog-dupes.ts
 *        npm run audit:blog-dupes
 */

import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { PrismaClient } from "@prisma/client";
import {
  slugPrefixKey,
  topicSignature,
  __TESTING__,
} from "../src/lib/services/dedup-gate";
import { cosineSimilarityVec } from "../src/lib/services/embeddings";

const CLUSTER_MIN_SIZE = 3;
const COSINE_THRESHOLD = __TESTING__.EMBEDDING_SIMILARITY_THRESHOLD; // 0.85

interface Row {
  slug: string;
  title: string;
  publishedAt: Date | null;
  viewCount: number;
}

interface EmbRow extends Row {
  embedding: number[];
}

function pickCanonical(rows: Row[]): Row {
  return [...rows].sort((a, b) => {
    if (b.viewCount !== a.viewCount) return b.viewCount - a.viewCount;
    const at = a.publishedAt ? a.publishedAt.getTime() : 0;
    const bt = b.publishedAt ? b.publishedAt.getTime() : 0;
    return at - bt; // oldest published first
  })[0];
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const articles = await prisma.blogArticle.findMany({
      where: { status: "published" },
      select: {
        slug: true,
        title: true,
        publishedAt: true,
        viewCount: true,
        titleEmbedding: true,
      },
    });

    console.log(`Loaded ${articles.length} published BlogArticle rows.\n`);

    const byPrefix = new Map<string, Row[]>();
    const bySignature = new Map<string, Row[]>();

    for (const a of articles) {
      const prefix = slugPrefixKey(a.slug);
      if (prefix) {
        if (!byPrefix.has(prefix)) byPrefix.set(prefix, []);
        byPrefix.get(prefix)!.push(a);
      }
      const sig = topicSignature(a.title);
      if (sig) {
        if (!bySignature.has(sig)) bySignature.set(sig, []);
        bySignature.get(sig)!.push(a);
      }
    }

    const prefixClusters = [...byPrefix.entries()]
      .filter(([, v]) => v.length >= CLUSTER_MIN_SIZE)
      .sort((a, b) => b[1].length - a[1].length);

    const sigClusters = [...bySignature.entries()]
      .filter(([, v]) => v.length >= CLUSTER_MIN_SIZE)
      .sort((a, b) => b[1].length - a[1].length);

    console.log(
      `=== Slug-prefix clusters (year-stripped, 5+ leading tokens, >=${CLUSTER_MIN_SIZE} members) ===\n`
    );
    if (prefixClusters.length === 0) {
      console.log("(none)\n");
    }
    for (const [prefix, rows] of prefixClusters) {
      const canonical = pickCanonical(rows);
      console.log(`Prefix: "${prefix}"  (${rows.length} articles)`);
      console.log(`  Canonical (highest viewCount, oldest tie-break): ${canonical.slug}`);
      for (const r of rows) {
        const tag = r.slug === canonical.slug ? "  ✓" : "  -";
        console.log(`${tag} ${r.slug}  [${r.viewCount} views]  "${r.title}"`);
      }
      console.log("");
    }

    console.log(
      `=== Topic-signature clusters (first 3 content tokens of title, >=${CLUSTER_MIN_SIZE} members) ===\n`
    );
    if (sigClusters.length === 0) {
      console.log("(none)\n");
    }
    for (const [sig, rows] of sigClusters) {
      const canonical = pickCanonical(rows);
      console.log(`Signature: "${sig}"  (${rows.length} articles)`);
      console.log(`  Canonical: ${canonical.slug}`);
      for (const r of rows) {
        const tag = r.slug === canonical.slug ? "  ✓" : "  -";
        console.log(`${tag} ${r.slug}  [${r.viewCount} views]  "${r.title}"`);
      }
      console.log("");
    }

    // === Embedding cosine clusters (DAN-520 gate #2) =========================
    // Connected components over the pairwise cosine >= threshold graph. O(n^2)
    // — fine for a few hundred rows; this is a one-off ad-hoc audit. Catches
    // semantic near-dups the deterministic gates above structurally miss.
    const embRows: EmbRow[] = articles
      .map((a) => ({ ...a, embedding: (a.titleEmbedding as number[]) ?? [] }))
      .filter((a) => a.embedding.length > 0);

    const missingEmbeddings = articles.length - embRows.length;

    // Union-Find for connected components.
    const parent = embRows.map((_, i) => i);
    const find = (i: number): number => {
      while (parent[i] !== i) {
        parent[i] = parent[parent[i]];
        i = parent[i];
      }
      return i;
    };
    const union = (a: number, b: number) => {
      const ra = find(a);
      const rb = find(b);
      if (ra !== rb) parent[ra] = rb;
    };

    for (let i = 0; i < embRows.length; i++) {
      for (let j = i + 1; j < embRows.length; j++) {
        const sim = cosineSimilarityVec(embRows[i].embedding, embRows[j].embedding);
        if (sim >= COSINE_THRESHOLD) union(i, j);
      }
    }

    const compMap = new Map<number, EmbRow[]>();
    for (let i = 0; i < embRows.length; i++) {
      const root = find(i);
      if (!compMap.has(root)) compMap.set(root, []);
      compMap.get(root)!.push(embRows[i]);
    }
    const cosineClusters = [...compMap.values()]
      .filter((v) => v.length >= 2) // 2+ = at least one near-dup pair
      .sort((a, b) => b.length - a.length);

    console.log(
      `=== Embedding cosine clusters (title similarity >=${COSINE_THRESHOLD}, >=2 members) ===\n`
    );
    if (missingEmbeddings > 0) {
      console.log(
        `(note: ${missingEmbeddings} published rows have no titleEmbedding yet — run npm run backfill:blog-embeddings)\n`
      );
    }
    if (cosineClusters.length === 0) {
      console.log("(none)\n");
    }
    for (const rows of cosineClusters) {
      const canonical = pickCanonical(rows);
      console.log(`Cosine cluster  (${rows.length} articles)`);
      console.log(`  Canonical: ${canonical.slug}`);
      for (const r of rows) {
        const tag = r.slug === canonical.slug ? "  ✓" : "  -";
        console.log(`${tag} ${r.slug}  [${r.viewCount} views]  "${r.title}"`);
      }
      console.log("");
    }

    const totalDupesPrefix = prefixClusters.reduce((s, [, v]) => s + v.length - 1, 0);
    const totalDupesSig = sigClusters.reduce((s, [, v]) => s + v.length - 1, 0);
    const totalDupesCosine = cosineClusters.reduce((s, v) => s + v.length - 1, 0);

    console.log("=== Summary ===");
    console.log(`Slug-prefix dup clusters: ${prefixClusters.length}  (${totalDupesPrefix} dupe rows that should be consolidated)`);
    console.log(`Topic-signature dup clusters: ${sigClusters.length}  (${totalDupesSig} dupe rows that should be consolidated)`);
    console.log(`Embedding cosine dup clusters: ${cosineClusters.length}  (${totalDupesCosine} dupe rows; ${missingEmbeddings} rows unembedded)`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
