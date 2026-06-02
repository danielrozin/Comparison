// DAN-859 — Audit step. Pulls Apr 2026 cohort meta defects to stdout.
// Read-only: no DB mutations. Used to drive scripts/dan-859-fix.mjs.
//
// Output: JSON array of {slug, metaTitle, metaDescription, mtLen, mdLen,
//   titleBad, descBad}.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const T_MIN = 50, T_MAX = 60;
const D_MIN = 140, D_MAX = 165;

const rows = await prisma.blogArticle.findMany({
  where: {
    publishedAt: {
      gte: new Date("2026-04-01"),
      lt: new Date("2026-05-07"),
    },
    status: { not: "archived" },
  },
  select: {
    id: true,
    slug: true,
    title: true,
    metaTitle: true,
    metaDescription: true,
  },
  orderBy: { slug: "asc" },
});

const defects = [];
for (const r of rows) {
  const mtLen = (r.metaTitle ?? "").length;
  const mdLen = (r.metaDescription ?? "").length;
  const titleBad = mtLen < T_MIN || mtLen > T_MAX;
  const descBad = mdLen < D_MIN || mdLen > D_MAX;
  if (titleBad || descBad) {
    defects.push({
      id: r.id,
      slug: r.slug,
      title: r.title,
      metaTitle: r.metaTitle,
      metaDescription: r.metaDescription,
      mtLen,
      mdLen,
      titleBad,
      descBad,
    });
  }
}

console.log(JSON.stringify({ totalChecked: rows.length, defects }, null, 2));
await prisma.$disconnect();
