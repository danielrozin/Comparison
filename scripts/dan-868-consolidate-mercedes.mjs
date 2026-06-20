// DAN-868 — Consolidate Mercedes-Benz alternatives/competitors blog cluster.
//
// Audit (DAN-347 P1 #7) called out 7 dupes; the actual cluster has grown to
// 75 published rows that all target the same intent ("alternatives to
// Mercedes-Benz" / "Mercedes-Benz competitors"). Same cron-cannibalization
// pattern as DAN-451 (macbook-pro-weight).
//
// Idempotent script:
//   1) Enhances the canonical post (metaTitle, metaDescription, TL;DR table,
//      FAQ block).
//   2) Archives every non-canonical row whose slug contains "mercedes" by
//      setting status='archived'.
//
// Companion redirects live in src/lib/redirects/blog-redirects.ts and are
// applied via next.config.ts redirects() at the edge — independent of this DB
// state, so 301s work even if the archived rows are later deleted.

import { PrismaClient } from "@prisma/client";

const CANONICAL_SLUG =
  "mercedes-benz-alternatives-in-2026-best-luxury-cars-brands-to-consider";

const NEW_META_TITLE =
  "Mercedes-Benz Alternatives 2026: BMW, Audi, Genesis, Lexus & More";

const NEW_META_DESCRIPTION =
  "The best Mercedes-Benz alternatives in 2026: BMW (direct rival), Audi (German engineering), Genesis (best value), Lexus (reliability), Volvo (safety), Porsche (performance). Side-by-side comparison table, segment-by-segment matches, and a buyer's FAQ.";

const TLDR_BLOCK = `## TL;DR — Best Mercedes-Benz Alternatives at a Glance

| Brand | Best Direct Match | Why Consider It |
|---|---|---|
| BMW | 5-Series → E-Class, 7-Series → S-Class, X5 → GLE | Sharper driving dynamics, iDrive infotainment, M performance variants |
| Audi | A6 → E-Class, A8 → S-Class, Q7 → GLE | Quattro AWD, minimalist interiors, often lower transaction price |
| Genesis | G80 → E-Class, G90 → S-Class, GV80 → GLE | Best value in segment, 10-yr/100k powertrain warranty, top resale |
| Lexus | ES → C/E-Class, LS → S-Class, RX → GLC/GLE | Best-in-class reliability, hybrid-first lineup, lowest ownership cost |
| Volvo | S60/S90 → C/E-Class, XC90 → GLE/GLS | Scandinavian design, segment-leading safety, T8 plug-in hybrids |
| Porsche | Panamera → CLS/S-Class, Cayenne → GLE | Performance-first, sportiest cabin, strongest brand cachet |
| Tesla | Model S → S-Class, Model X → GLE | EV-native, OTA updates, lowest fuel/maintenance running cost |

**Quick decision:** If you want a Mercedes with sportier dynamics, choose **BMW**. If you want a Mercedes that costs less and holds value better, choose **Genesis**. If you want the lowest 10-year cost of ownership, choose **Lexus**. If you're going electric, **Tesla** or the EQ-rivaling Lucid Air is the closest analog.

`;

const FAQ_BLOCK = `

## Frequently Asked Questions

### What is the best alternative to Mercedes-Benz in 2026?
There isn't a single best alternative — it depends on what you value most. **BMW** is the closest match for driving feel and prestige; **Audi** for German engineering at a lower price; **Genesis** for the strongest value and warranty; **Lexus** for long-term reliability; **Volvo** for safety; **Porsche** for performance.

### Which brand is most similar to Mercedes-Benz?
**BMW** is Mercedes' closest direct competitor — the 5-Series rivals the E-Class and the 7-Series rivals the S-Class, with comparable pricing, equipment levels, and brand cachet. **Audi** is the second-closest match and often runs slightly below BMW/Mercedes on transaction price.

### What luxury car is cheaper than Mercedes-Benz but feels just as nice?
**Genesis** consistently undercuts comparable Mercedes models by $5,000–$15,000 while matching interior quality, technology, and ride comfort. The Genesis G80 vs. E-Class and GV80 vs. GLE are the strongest value comparisons in the segment.

### Which Mercedes-Benz competitor has the best reliability?
**Lexus** leads every major reliability study (J.D. Power, Consumer Reports) in the luxury segment, typically by a wide margin over Mercedes-Benz. If you plan to keep the car 10+ years or care about resale, Lexus is the lowest-risk choice.

### Is BMW or Audi the better Mercedes alternative?
**BMW** if you prioritize driving dynamics and rear-wheel-drive feel. **Audi** if you prioritize all-weather Quattro grip, interior minimalism, and a slightly lower starting price. Both offer comparable luxury equipment and a similar prestige tier.

### What's the best electric alternative to a Mercedes EQS or EQE?
**Tesla Model S** (longest range, supercharger network), **Lucid Air** (best-in-class luxury and 500+ mile range), and **BMW i7** (most traditional luxury experience) are the three strongest EV alternatives to the Mercedes EQ lineup.

### Do Mercedes alternatives hold their value better than Mercedes?
Several do. **Lexus**, **Porsche**, and **Genesis** typically depreciate slower than Mercedes-Benz over a 5-year window. BMW and Audi depreciate at roughly the same rate as Mercedes.
`;

const prisma = new PrismaClient();

async function main() {
  const canonical = await prisma.blogArticle.findUnique({
    where: { slug: CANONICAL_SLUG },
  });
  if (!canonical) {
    throw new Error(`Canonical not found: ${CANONICAL_SLUG}`);
  }

  let content = canonical.content;

  if (!content.includes("## TL;DR — Best Mercedes-Benz Alternatives at a Glance")) {
    // Insert TL;DR after the H1 + first intro paragraph (before the first ## ).
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
      insertAt = lines.findIndex((l) => l.startsWith("# ")) + 1;
    }
    lines.splice(insertAt, 0, "", TLDR_BLOCK.trim(), "");
    content = lines.join("\n");
  }

  if (!content.includes("## Frequently Asked Questions")) {
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
          "mercedes-benz",
          "luxury-cars",
          "alternatives",
          "bmw",
          "audi",
          "genesis",
          "lexus",
          "2026",
        ])
      ),
    },
  });
  console.log(`canonical updated: ${CANONICAL_SLUG}`);

  // Archive every non-canonical row whose slug contains "mercedes".
  const dupes = await prisma.blogArticle.findMany({
    where: {
      AND: [
        { slug: { not: CANONICAL_SLUG } },
        { slug: { contains: "mercedes", mode: "insensitive" } },
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

  const publishedAfter = await prisma.blogArticle.count({
    where: {
      status: "published",
      slug: { contains: "mercedes", mode: "insensitive" },
    },
  });
  console.log(`published mercedes articles remaining: ${publishedAfter}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
