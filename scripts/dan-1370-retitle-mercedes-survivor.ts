// DAN-1370 (child of DAN-1365 §B) — Retitle the Mercedes-Benz alternatives
// survivor to also cover "competitors".
//
// Context: "audi competitors luxury cars 2026" (320 vol) was splitting
// authority across 3+ near-duplicate Mercedes-alternatives blog URLs (pos
// 15/21/24). All of those near-dups were ALREADY 308-folded into the survivor
// by DAN-868 (verified live 2026-06-22 — see src/lib/redirects/blog-redirects.ts),
// so the redirect consolidation needs no change. The remaining gap is the
// survivor's copy: its title/H1 said only "Alternatives", leaving the
// "competitors" intent (and the `mercedes-benz-competitors-*` variants that
// fold in) without an on-page match. This retitles the survivor to cover both.
//
// Same ship path as §C / DAN-1369: idempotent DB update run against prod via
// .github/workflows/publish-editorial.yml. Body copy is left untouched (the
// page already enumerates BMW/Audi/Genesis/Lexus/etc., which query-matches the
// competitor intent — only the title/H1/meta needed the "competitors" term).
//
// Field mapping (src/app/blog/[slug]/page.tsx):
//   - article.title           -> H1 (line 337) + breadcrumb + schema headline
//   - article.metaTitle       -> <title> tag (falls back to title)
//   - article.metaDescription -> meta description (falls back to excerpt)
//
// Idempotent: re-running only re-applies the copy if it has drifted.

import { PrismaClient } from "@prisma/client";

const CANONICAL_SLUG =
  "mercedes-benz-alternatives-in-2026-best-luxury-cars-brands-to-consider";

// Issue-mandated H1/title string (covers both "alternatives" and "competitors").
const NEW_TITLE =
  "Best Mercedes-Benz Alternatives & Competitors (2026 Luxury Cars)";

// <title> tag: keep the rich entity list (matches "audi competitors …") and
// the "competitors" term. Root layout appends "| A Versus B" via template so
// metaTitle must NOT include the brand suffix (avoids double "| A Versus B").
const NEW_META_TITLE =
  "Mercedes-Benz Alternatives & Competitors 2026: BMW, Audi & More";

const NEW_META_DESCRIPTION =
  "The best Mercedes-Benz alternatives and competitors in 2026: BMW (direct rival), Audi (German engineering), Genesis (best value), Lexus (reliability), Volvo (safety), Porsche (performance). Side-by-side comparison table, segment-by-segment matches, and a buyer's FAQ.";

const prisma = new PrismaClient();

async function main() {
  const survivor = await prisma.blogArticle.findUnique({
    where: { slug: CANONICAL_SLUG },
  });
  if (!survivor) {
    throw new Error(`Mercedes survivor not found: ${CANONICAL_SLUG}`);
  }
  if (survivor.status !== "published") {
    throw new Error(
      `Mercedes survivor is not published (status=${survivor.status}); aborting retitle`
    );
  }

  const needsUpdate =
    survivor.title !== NEW_TITLE ||
    survivor.metaTitle !== NEW_META_TITLE ||
    survivor.metaDescription !== NEW_META_DESCRIPTION;

  if (!needsUpdate) {
    console.log(`Mercedes survivor already retitled (no-op): ${CANONICAL_SLUG}`);
    return;
  }

  await prisma.blogArticle.update({
    where: { slug: CANONICAL_SLUG },
    data: {
      title: NEW_TITLE,
      metaTitle: NEW_META_TITLE,
      metaDescription: NEW_META_DESCRIPTION,
    },
  });

  console.log(`retitled Mercedes survivor: ${CANONICAL_SLUG}`);
  console.log(`  title (H1) -> ${NEW_TITLE}`);
  console.log(`  metaTitle  -> ${NEW_META_TITLE}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
