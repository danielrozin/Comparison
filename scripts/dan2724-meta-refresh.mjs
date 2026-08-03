import * as dotenv from "dotenv";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: "/Users/danielrozin/Comparison/.env.local" });

const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const updates = [
  {
    order: 1,
    slug: "khan-academy-vs-brilliant",
    metaTitle: "Brilliant vs Khan Academy: Which Teaches Better? [2026] | aversusb",
    metaDescription: "Choosing between Brilliant and Khan Academy? Compare curriculum, cost, difficulty, and learning styles. Free vs paid — see which fits your goals best.",
  },
  {
    order: 2,
    slug: "chick-fil-a-vs-popeyes",
    metaTitle: "Chick-fil-A vs Popeyes: Chicken, Menu & Price Compared | aversusb",
    metaDescription: "Chick-fil-A or Popeyes? Compare chicken quality, prices, menu options, and nutrition facts. Find out which chain wins the great chicken sandwich debate.",
  },
  {
    order: 3,
    slug: "youtube-music-vs-amazon-music",
    metaTitle: "Amazon Music vs YouTube Music: Full 2026 Comparison | aversusb",
    metaDescription: "Can't decide between Amazon Music and YouTube Music? See the exact price, library size, and audio quality differences. Pick the right one in 60 seconds.",
  },
  {
    order: 4,
    slug: "kobe-bryant-vs-lebron-james",
    metaTitle: "Kobe vs LeBron: Stats, Rings & Legacy Compared [2026] | aversusb",
    metaDescription: "Kobe Bryant or LeBron James — who is the GOAT? Compare career stats, championships, awards, and legacy to settle the debate once and for all.",
  },
  {
    order: 5,
    slug: "tidal-vs-youtube-music",
    metaTitle: "YouTube Music vs Tidal: Audio Quality & Price Compared | aversusb",
    metaDescription: "Tidal or YouTube Music? Compare lossless audio, price, playlists, and offline features side-by-side. See which streaming service wins in 2026.",
  },
  {
    order: 6,
    slug: "paramount-plus-vs-peacock",
    metaTitle: "Peacock vs Paramount+: Price, Content & Streaming Compared | aversusb",
    metaDescription: "Peacock or Paramount+? Compare price, content library, original shows, and streaming quality. Find out which streaming service is worth it in 2026.",
  },
  {
    order: 7,
    slug: "netflix-vs-peacock-comparison-2026",
    metaTitle: "Peacock vs Netflix: Cost, Content & Quality Compared | aversusb",
    metaDescription: "Is Peacock worth it vs Netflix? Compare price, content library, originals, and streaming features. Find the best streaming deal for 2026.",
  },
];

async function updateMetaTags() {
  console.log("Starting meta refresh for DAN-2724...\n");

  for (const update of updates) {
    try {
      console.log(`[${update.order}] Updating ${update.slug}...`);

      const comparison = await prisma.comparison.update({
        where: { slug: update.slug },
        data: {
          metaTitle: update.metaTitle,
          metaDescription: update.metaDescription,
        },
      });

      console.log(`✓ Updated: ${update.slug}`);
      console.log(`  Title: ${update.metaTitle.slice(0, 60)}...`);
      console.log(`  Desc: ${update.metaDescription.slice(0, 60)}...\n`);

    } catch (error) {
      console.error(`✗ Failed to update ${update.slug}:`, error.message);
    }
  }

  console.log("Meta refresh complete!");
  await prisma.$disconnect();
}

updateMetaTags().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
