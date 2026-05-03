// DAN-452 — Consolidate macbook-pro-weight blog cluster.
//
// Idempotent script:
//   1) Enhances the canonical post (metaTitle, metaDescription, content top + FAQ).
//   2) Archives all other macbook-pro-weight / macbook-pro-14 / macbook-pro-2024
//      near-duplicates by setting status='archived'.
//
// Companion redirects live in src/lib/redirects/blog-redirects.ts and are
// applied via next.config.ts redirects() at the edge — independent of this DB
// state, so 301s work even if the archived rows are later deleted.

import { PrismaClient } from "@prisma/client";

const CANONICAL_SLUG =
  "macbook-pro-weight-2025-2026-complete-specs-comparison-guide";

const NEW_META_TITLE =
  "MacBook Pro Weight 2025-2026: All Models Compared (lbs & kg)";

const NEW_META_DESCRIPTION =
  "MacBook Pro 14-inch weighs 3.5 lbs (1.60 kg); 16-inch is 4.7 lbs (2.13 kg). Full weight table for M5 / M5 Pro / M5 Max, plus a 14 vs 16 buyer's guide and FAQ.";

const TLDR_BLOCK = `## TL;DR — MacBook Pro Weight at a Glance

| Model | Weight (lbs) | Weight (kg) | Best For |
|---|---|---|---|
| MacBook Pro 14" (M5) | 3.4 | 1.55 | Daily mobile professionals |
| MacBook Pro 14" (M5 Pro) | 3.5 | 1.60 | Developers, designers |
| MacBook Pro 14" (M5 Max) | 3.6 | 1.63 | High-end portable workstation |
| MacBook Pro 16" (M5 Pro) | 4.7 | 2.13 | Desk-anchored creative pros |
| MacBook Pro 16" (M5 Max) | 4.7 | 2.13 | Video editors, 3D, ML workloads |

**Quick decision:** If you carry your laptop daily, choose the 14-inch (3.5 lbs). If you mostly desk-work and value screen real estate, the 16-inch (4.7 lbs) is one of the lightest 16-inch workstations on the market.

`;

const FAQ_BLOCK = `

## Frequently Asked Questions

### How much does the 2026 MacBook Pro 14-inch weigh?
The 14-inch MacBook Pro weighs between 3.4 and 3.6 pounds (1.55–1.63 kg) depending on chip configuration. The base M5 is the lightest at 3.4 lbs; the M5 Pro is 3.5 lbs; the M5 Max is 3.6 lbs.

### How much does the 2026 MacBook Pro 16-inch weigh?
The 16-inch MacBook Pro weighs 4.7 pounds (2.13 kg) for both M5 Pro and M5 Max configurations. The chip choice does not change the chassis weight.

### Is the 14-inch or 16-inch MacBook Pro better for travel?
The 14-inch at 3.5 lbs is the better travel laptop. The 1.2-pound difference adds up over an 8-hour workday or in a backpack on a long flight. Choose the 16-inch only if you mostly work from a fixed desk.

### Did the MacBook Pro get heavier in 2024?
Yes, slightly. The shift to the redesigned chassis added a small amount of weight versus the prior generation, but Apple kept it within tenths of a pound — well within the range of competing pro laptops, and offset by significantly improved cooling and battery life.

### What is the lightest MacBook Pro you can buy in 2026?
The 14-inch MacBook Pro with the base M5 chip is the lightest at 3.4 pounds (1.55 kg). If you want to go lighter, consider the [MacBook Air](/compare/macbook-air-vs-macbook-pro), which starts at 2.7 lbs (1.24 kg).

### Are the M5 Pro and M5 Max chip versions the same weight?
On the 16-inch, yes — both configurations are 4.7 lbs. On the 14-inch, the M5 Max is roughly 0.1 lbs heavier than the M5 Pro due to additional thermal mass for the larger GPU.
`;

const prisma = new PrismaClient();

async function main() {
  // 1) Enhance canonical
  const canonical = await prisma.blogArticle.findUnique({
    where: { slug: CANONICAL_SLUG },
  });
  if (!canonical) {
    throw new Error(`Canonical not found: ${CANONICAL_SLUG}`);
  }

  let content = canonical.content;
  // Idempotency: only prepend TL;DR if not already there
  if (!content.includes("## TL;DR — MacBook Pro Weight at a Glance")) {
    // Insert TL;DR after the H1 + first intro paragraph. The H1 starts with "# ".
    const lines = content.split("\n");
    let insertAt = 0;
    let seenH1 = false;
    for (let i = 0; i < lines.length; i++) {
      if (!seenH1 && lines[i].startsWith("# ")) {
        seenH1 = true;
        continue;
      }
      if (seenH1 && lines[i].startsWith("## ")) {
        insertAt = i;
        break;
      }
    }
    if (insertAt === 0) {
      // Fallback: prepend after first H1
      insertAt = lines.findIndex((l) => l.startsWith("# ")) + 1;
    }
    lines.splice(insertAt, 0, "", TLDR_BLOCK.trim(), "");
    content = lines.join("\n");
  }
  if (!content.includes("## Frequently Asked Questions")) {
    // Append FAQ before the final "## Conclusion" section if present, else end.
    const idx = content.indexOf("## Conclusion");
    if (idx >= 0) {
      content = content.slice(0, idx) + FAQ_BLOCK.trim() + "\n\n" + content.slice(idx);
    } else {
      content = content + FAQ_BLOCK;
    }
  }

  await prisma.blogArticle.update({
    where: { slug: CANONICAL_SLUG },
    data: {
      content,
      metaTitle: NEW_META_TITLE,
      metaDescription: NEW_META_DESCRIPTION,
      tags: Array.from(
        new Set([
          ...(canonical.tags || []),
          "macbook-pro",
          "apple",
          "laptop",
          "weight",
          "comparison",
          "2026",
        ])
      ),
    },
  });
  console.log(`canonical updated: ${CANONICAL_SLUG}`);

  // 2) Archive 91 dupes — match by slug prefix patterns that all collapse to
  //    macbook-pro weight / 14-vs-16 / 2024-weight intent.
  const dupes = await prisma.blogArticle.findMany({
    where: {
      AND: [
        { slug: { not: CANONICAL_SLUG } },
        {
          OR: [
            { slug: { startsWith: "macbook-pro-weight" } },
            { slug: { startsWith: "macbook-pro-14" } },
            { slug: { startsWith: "macbook-pro-2024" } },
            { slug: { startsWith: "macbook-pro-models-weight" } },
          ],
        },
        { status: { not: "archived" } },
      ],
    },
    select: { id: true, slug: true, status: true },
  });

  console.log(`archiving ${dupes.length} dupe(s)…`);
  if (dupes.length > 0) {
    const ids = dupes.map((d) => d.id);
    const result = await prisma.blogArticle.updateMany({
      where: { id: { in: ids } },
      data: { status: "archived" },
    });
    console.log(`archived: ${result.count}`);
  }

  // 3) Sanity check
  const publishedAfter = await prisma.blogArticle.count({
    where: {
      status: "published",
      OR: [
        { slug: { startsWith: "macbook-pro-weight" } },
        { slug: { startsWith: "macbook-pro-14" } },
      ],
    },
  });
  console.log(`published macbook-pro weight/14 articles remaining: ${publishedAfter}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
