/**
 * DAN-1176 — Add internal links to 0-inlink pos 11-20 pages (2026-07-03)
 *
 * Targets:
 *   1. youtube-music-vs-soundcloud (pos 11, 0 inlinks)
 *   2. macbook-air-vs-macbook-pro  (pos 19, 0 inlinks)
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });
const prisma = new PrismaClient();

const linksToAdd = [
  // ── youtube-music-vs-soundcloud (pos 11, 0 inlinks) ─────────────────────
  {
    fromPath: "/compare/spotify-vs-soundcloud",
    toPath: "/compare/youtube-music-vs-soundcloud",
    anchorText: "YouTube Music vs SoundCloud",
    linkType: "related",
    position: "inline",
    score: 1.5,
  },
  {
    fromPath: "/compare/soundcloud-vs-youtube-music",
    toPath: "/compare/youtube-music-vs-soundcloud",
    anchorText: "Compare YouTube Music and SoundCloud",
    linkType: "related",
    position: "inline",
    score: 1.8,
  },
  {
    fromPath: "/compare/spotify-vs-youtube-music",
    toPath: "/compare/youtube-music-vs-soundcloud",
    anchorText: "SoundCloud vs YouTube Music",
    linkType: "related",
    position: "inline",
    score: 1.5,
  },
  {
    fromPath: "/compare/youtube-music-vs-amazon-music",
    toPath: "/compare/youtube-music-vs-soundcloud",
    anchorText: "YouTube Music vs SoundCloud",
    linkType: "related",
    position: "inline",
    score: 1.5,
  },
  {
    fromPath: "/compare/spotify-vs-apple-music-vs-youtube-music",
    toPath: "/compare/youtube-music-vs-soundcloud",
    anchorText: "YouTube Music vs SoundCloud comparison",
    linkType: "related",
    position: "inline",
    score: 1.3,
  },
  {
    fromPath: "/compare/youtube-premium-vs-spotify-premium",
    toPath: "/compare/youtube-music-vs-soundcloud",
    anchorText: "YouTube Music vs SoundCloud",
    linkType: "related",
    position: "inline",
    score: 1.3,
  },
  {
    fromPath: "/compare/youtube-music-vs-deezer",
    toPath: "/compare/youtube-music-vs-soundcloud",
    anchorText: "YouTube Music vs SoundCloud",
    linkType: "related",
    position: "inline",
    score: 1.4,
  },

  // ── macbook-air-vs-macbook-pro (pos 19, 0 inlinks) ──────────────────────
  {
    fromPath: "/compare/macbook-air-vs-windows-laptop",
    toPath: "/compare/macbook-air-vs-macbook-pro",
    anchorText: "MacBook Air vs MacBook Pro",
    linkType: "related",
    position: "inline",
    score: 1.5,
  },
  {
    fromPath: "/compare/macbook-pro-vs-dell-xps",
    toPath: "/compare/macbook-air-vs-macbook-pro",
    anchorText: "MacBook Air vs MacBook Pro comparison",
    linkType: "related",
    position: "inline",
    score: 1.5,
  },
  {
    fromPath: "/compare/dell-xps-vs-macbook-air",
    toPath: "/compare/macbook-air-vs-macbook-pro",
    anchorText: "MacBook Air vs MacBook Pro",
    linkType: "related",
    position: "inline",
    score: 1.5,
  },
  {
    fromPath: "/compare/macbook-pro-14-vs-16-performance",
    toPath: "/compare/macbook-air-vs-macbook-pro",
    anchorText: "MacBook Air vs MacBook Pro",
    linkType: "related",
    position: "inline",
    score: 1.4,
  },
  {
    fromPath: "/compare/macbook-vs-windows-laptops",
    toPath: "/compare/macbook-air-vs-macbook-pro",
    anchorText: "MacBook Air vs MacBook Pro",
    linkType: "related",
    position: "inline",
    score: 1.4,
  },
  {
    fromPath: "/compare/apple-m5-vs-m4-macbook",
    toPath: "/compare/macbook-air-vs-macbook-pro",
    anchorText: "MacBook Air vs MacBook Pro",
    linkType: "related",
    position: "inline",
    score: 1.3,
  },
  {
    fromPath: "/compare/macbook-pro-m4-pro-vs-m5-pro",
    toPath: "/compare/macbook-air-vs-macbook-pro",
    anchorText: "MacBook Air vs MacBook Pro",
    linkType: "related",
    position: "inline",
    score: 1.3,
  },
];

console.log(`Adding ${linksToAdd.length} internal links...`);
let added = 0;
let skipped = 0;

for (const link of linksToAdd) {
  const existing = await prisma.internalLink.findFirst({
    where: { fromPath: link.fromPath, toPath: link.toPath },
  });
  if (existing) {
    console.log(`  SKIP (exists): ${link.fromPath} → ${link.toPath}`);
    skipped++;
    continue;
  }

  // Verify source page exists
  const sourceSlug = link.fromPath.replace("/compare/", "");
  const sourcePage = await prisma.comparison.findUnique({
    where: { slug: sourceSlug },
    select: { status: true },
  });
  if (!sourcePage || sourcePage.status !== "published") {
    console.log(`  SKIP (not published): ${link.fromPath}`);
    skipped++;
    continue;
  }

  await prisma.internalLink.create({ data: link });
  console.log(`  ADDED: ${link.fromPath} → ${link.toPath} (score=${link.score})`);
  added++;
}

console.log(`\nDone. Added: ${added}, Skipped: ${skipped}`);

// Verify final inlink counts
const targetSlugs = ["youtube-music-vs-soundcloud", "macbook-air-vs-macbook-pro"];
for (const slug of targetSlugs) {
  const count = await prisma.internalLink.count({
    where: { toPath: `/compare/${slug}` },
  });
  console.log(`Final inlinks for /compare/${slug}: ${count}`);
}

await prisma.$disconnect();
