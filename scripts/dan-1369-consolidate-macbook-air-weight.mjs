// DAN-1369 (child of DAN-1365 §C) — Split the MacBook *Air* weight blog
// cluster out of the MacBook *Pro* hub it was cannibalizing.
//
// Context: "macbook air weight" (2,400 vol, pos 24) and "macbook pro weight"
// (1,600, pos 23) are DISTINCT queries that must keep DISTINCT survivors. The
// Pro hub's title was generic ("MacBook Weight 2026: Air, Pro 14 and Pro 16
// Compared"), so it competed for the Air query. The fix is cannibalization
// consolidation, NOT copy (per SEO recs doc `dan1365-intent-match-recs`):
//   1) Retitle the Pro survivor's metaTitle/metaDescription to be Pro-specific
//      so it stops cannibalizing the Air hub. Body copy is left untouched
//      (recs: "Confirmed copy already query-matches").
//   2) Archive the six Air/generic dupe rows that fold into the Air survivor.
//
// Canonical decisions (recs caveats):
//   #1  Pro survivor = the ESTABLISHED MACBOOK_PRO_WEIGHT_CANONICAL
//       (macbook-pro-weight-2025-2026-complete-specs-comparison-guide), NOT the
//       recs' proposed "-all-models-analyzed" (already a 308 dupe). Keeping the
//       established canonical avoids a redirect chain.
//   #2  Each archived slug's primary entity was verified via live <title>
//       before listing (Air-primary vs generic), mirroring the redirect map.
//
// Idempotent: re-running only re-applies the title/description if drifted and
// re-archives any dupe that somehow returned to a non-archived status. The
// edge 301s live independently in src/lib/redirects/blog-redirects.ts, so the
// redirects work even if these rows are later hard-deleted.

import { PrismaClient } from "@prisma/client";

// ---- Pro survivor: retitle only (no body-copy changes) --------------------
const PRO_CANONICAL_SLUG =
  "macbook-pro-weight-2025-2026-complete-specs-comparison-guide";

const PRO_NEW_META_TITLE = 'MacBook Pro Weight 2026: 14" & 16" Specs | A Versus B';

const PRO_NEW_META_DESCRIPTION =
  'MacBook Pro weight in 2026: exact figures for the 14" and 16" models (M5, M5 Pro, M5 Max) in pounds and kg, plus how they compare across generations. Looking for the lighter line? See our MacBook Air weight guide.';

// ---- Air survivor: target of the folded dupes -----------------------------
const AIR_CANONICAL_SLUG =
  "macbook-air-weight-comparison-2025-2026-which-model-is-right-for-you";

// Six dupes folded into the Air survivor. Must match MACBOOK_AIR_WEIGHT_DUPES
// in src/lib/redirects/blog-redirects.ts exactly.
const AIR_DUPE_SLUGS = [
  "macbook-air-weight-2025-2026-complete-specs-for-all-current-models",
  "macbook-air-weight-comparison-2025-2026-all-current-models",
  "macbook-air-weight-comparison-2025-2026-all-current-models-explained",
  "macbook-air-weight-comparison-2025-2026-which-model-should-you-choose",
  "apple-macbook-models-weight-comparison-2025-2026-which-is-lightest",
  "apple-macbook-weight-comparison-2025-2026-all-models-ranked",
];

const prisma = new PrismaClient();

async function main() {
  // --- Guardrail: never archive a survivor -------------------------------
  for (const survivor of [PRO_CANONICAL_SLUG, AIR_CANONICAL_SLUG]) {
    if (AIR_DUPE_SLUGS.includes(survivor)) {
      throw new Error(`Refusing to run: survivor ${survivor} is in the dupe list`);
    }
  }

  // --- 1) Retitle the Pro survivor ---------------------------------------
  const pro = await prisma.blogArticle.findUnique({
    where: { slug: PRO_CANONICAL_SLUG },
  });
  if (!pro) {
    throw new Error(`Pro survivor not found: ${PRO_CANONICAL_SLUG}`);
  }
  if (pro.status !== "published") {
    throw new Error(
      `Pro survivor is not published (status=${pro.status}); aborting retitle`
    );
  }

  if (
    pro.metaTitle !== PRO_NEW_META_TITLE ||
    pro.metaDescription !== PRO_NEW_META_DESCRIPTION
  ) {
    await prisma.blogArticle.update({
      where: { slug: PRO_CANONICAL_SLUG },
      data: {
        metaTitle: PRO_NEW_META_TITLE,
        metaDescription: PRO_NEW_META_DESCRIPTION,
      },
    });
    console.log(`retitled Pro survivor: ${PRO_CANONICAL_SLUG}`);
    console.log(`  metaTitle -> ${PRO_NEW_META_TITLE}`);
  } else {
    console.log(`Pro survivor already retitled (no-op): ${PRO_CANONICAL_SLUG}`);
  }

  // --- 2) Confirm Air survivor exists & is published ---------------------
  const air = await prisma.blogArticle.findUnique({
    where: { slug: AIR_CANONICAL_SLUG },
  });
  if (!air || air.status !== "published") {
    throw new Error(
      `Air survivor missing or not published: ${AIR_CANONICAL_SLUG} (status=${air?.status})`
    );
  }
  console.log(`Air survivor confirmed published: ${AIR_CANONICAL_SLUG}`);

  // --- 3) Archive the six Air/generic dupes (surgical, explicit list) ----
  const dupes = await prisma.blogArticle.findMany({
    where: {
      slug: { in: AIR_DUPE_SLUGS },
      status: { not: "archived" },
    },
    select: { id: true, slug: true, status: true },
  });

  const foundSlugs = new Set(dupes.map((d) => d.slug));
  for (const slug of AIR_DUPE_SLUGS) {
    if (!foundSlugs.has(slug)) {
      console.log(`  (already archived or absent): ${slug}`);
    }
  }

  console.log(`archiving ${dupes.length} dupe(s)…`);
  if (dupes.length > 0) {
    const result = await prisma.blogArticle.updateMany({
      where: { id: { in: dupes.map((d) => d.id) } },
      data: { status: "archived" },
    });
    console.log(`archived: ${result.count}`);
    dupes.forEach((d) => console.log(`  archived: ${d.slug}`));
  }

  // --- 4) Report ----------------------------------------------------------
  const remaining = await prisma.blogArticle.count({
    where: { status: "published", slug: { in: AIR_DUPE_SLUGS } },
  });
  console.log(`published Air dupes remaining (expect 0): ${remaining}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
