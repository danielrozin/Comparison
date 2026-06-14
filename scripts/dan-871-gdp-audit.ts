/**
 * DAN-871: Audit existing GDP-related content on aversusb for thin-content rescue.
 *
 * Identifies thin GDP comparisons (BlogArticle + ComparisonPage), word counts,
 * traffic, and consolidation candidates per DAN-347 P1 #7 + #8.
 *
 * Usage: npx tsx scripts/dan-871-gdp-audit.ts
 */

import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    const blogs = await prisma.blogArticle.findMany({
      where: {
        OR: [
          { slug: { contains: "gdp", mode: "insensitive" } },
          { title: { contains: "gdp", mode: "insensitive" } },
          { slug: { contains: "economy", mode: "insensitive" } },
        ],
      },
      select: {
        slug: true,
        title: true,
        status: true,
        publishedAt: true,
        viewCount: true,
        content: true,
        category: true,
      },
      orderBy: { publishedAt: "asc" },
    });
    console.log(`=== BlogArticle GDP/economy hits: ${blogs.length} ===\n`);
    for (const b of blogs) {
      const wc = (b.content || "").split(/\s+/).filter(Boolean).length;
      console.log(`[${b.status}] ${b.slug}`);
      console.log(
        `  title: "${b.title}"\n  category: ${b.category}  | published: ${b.publishedAt?.toISOString().slice(0, 10) || "—"}  | views: ${b.viewCount}  | words: ${wc}`,
      );
      console.log("");
    }

    const comps = await prisma.comparison.findMany({
      where: {
        OR: [
          { slug: { contains: "gdp", mode: "insensitive" } },
          { title: { contains: "gdp", mode: "insensitive" } },
        ],
      },
      select: {
        slug: true,
        title: true,
        status: true,
        publishedAt: true,
        viewCount: true,
      },
      orderBy: { publishedAt: "asc" },
    });
    console.log(`\n=== Comparison GDP hits: ${comps.length} ===\n`);
    for (const c of comps) {
      console.log(`[${c.status}] ${c.slug}  | views: ${c.viewCount} | "${c.title}"`);
    }

    const countries = ["usa", "united-states", "china", "india", "japan", "germany", "uk", "russia"];
    const orClauses = countries.flatMap((c) => [
      { slug: { contains: `${c}-vs`, mode: "insensitive" as const } },
      { slug: { contains: `vs-${c}`, mode: "insensitive" as const } },
    ]);
    const countryComps = await prisma.comparison.findMany({
      where: { OR: orClauses },
      select: { slug: true, title: true, status: true, viewCount: true, publishedAt: true },
    });
    console.log(`\n=== Country-vs-country Comparisons: ${countryComps.length} ===\n`);
    for (const c of countryComps) {
      console.log(`[${c.status}] ${c.slug}  | views: ${c.viewCount} | pub: ${c.publishedAt?.toISOString().slice(0, 10) || "—"} | "${c.title}"`);
    }

    // Group blogs by category prefix to compute canonical candidates
    const groups: Record<string, typeof blogs> = {
      "us-vs-china-gdp": [],
      "us-vs-china-nominal-gdp": [],
      "china-vs-us-gdp": [],
      "other-gdp": [],
    };
    for (const b of blogs) {
      if (b.slug.startsWith("us-vs-china-nominal-gdp")) groups["us-vs-china-nominal-gdp"].push(b);
      else if (b.slug.startsWith("us-vs-china-gdp")) groups["us-vs-china-gdp"].push(b);
      else if (b.slug.startsWith("china-vs-us-gdp") || b.slug.startsWith("china-vs-usa-gdp")) groups["china-vs-us-gdp"].push(b);
      else groups["other-gdp"].push(b);
    }
    console.log(`\n=== Cluster summary ===\n`);
    for (const [k, rows] of Object.entries(groups)) {
      console.log(`${k}: ${rows.length} rows`);
      if (rows.length > 0) {
        const sorted = [...rows].sort((a, b) => {
          if (b.viewCount !== a.viewCount) return b.viewCount - a.viewCount;
          const at = a.publishedAt ? a.publishedAt.getTime() : 0;
          const bt = b.publishedAt ? b.publishedAt.getTime() : 0;
          return at - bt;
        });
        const wc = (s: string) => (s || "").split(/\s+/).filter(Boolean).length;
        const longestByWords = [...rows].sort((a, b) => wc(b.content || "") - wc(a.content || ""))[0];
        console.log(`  canonical (views, then oldest): ${sorted[0].slug} (${sorted[0].viewCount}v, ${wc(sorted[0].content || "")}w)`);
        console.log(`  longest by words: ${longestByWords.slug} (${wc(longestByWords.content || "")}w, ${longestByWords.viewCount}v)`);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
