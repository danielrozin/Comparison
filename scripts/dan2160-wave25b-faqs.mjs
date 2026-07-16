/**
 * DAN-2160 Wave 25b — Add statistics-specific FAQs to Kohli + SoundCloud pages
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const prisma = new PrismaClient();
const DRY = process.argv.includes("--dry");
const log = (...a) => console.log(...a);

async function addFaqs(slug, newFaqs) {
  const comp = await prisma.comparison.findUnique({
    where: { slug },
    select: { id: true, faqs: { select: { question: true } } },
  });
  if (!comp) { log(`  ! skip (not found): ${slug}`); return 0; }
  const existingQs = new Set(comp.faqs.map(f => f.question?.toLowerCase().trim()));
  const toAdd = newFaqs.filter(f => !existingQs.has(f.question?.toLowerCase().trim()));
  if (toAdd.length === 0) { log(`  skip (all FAQs exist): ${slug}`); return 0; }
  if (!DRY) {
    await prisma.fAQ.createMany({
      data: toAdd.map(f => ({ question: f.question, answer: f.answer, comparisonId: comp.id, sortOrder: 99 })),
    });
    await prisma.comparison.update({ where: { slug }, data: { lastRefreshedAt: new Date() } });
  }
  log(`  ${DRY ? "[DRY]" : "✅"} FAQs +${toAdd.length} (${comp.faqs.length}→${comp.faqs.length + toAdd.length}): ${slug}`);
  return toAdd.length;
}

log(`DAN-2160 Wave 25b — Statistics FAQs ${DRY ? "(DRY RUN)" : ""}`);

log("\n── Kohli: 3 statistics-specific FAQs ──");
await addFaqs("virat-kohli-vs-sachin-tendulkar", [
  {
    question: "What are the key statistics differences between Virat Kohli and Sachin Tendulkar?",
    answer: "Sachin has 100 international centuries vs Kohli's 81+; Sachin scored 34,357 international runs vs Kohli's 27,000+; Tendulkar averages 53.78 in Tests vs Kohli's ~48–50; Kohli has a higher ODI average (59.07) vs Sachin (44.83). Kohli leads in T20I stats; Tendulkar leads in Test and ODI volume.",
  },
  {
    question: "Whose Test statistics are better — Kohli or Tendulkar?",
    answer: "Sachin Tendulkar leads in raw Test numbers: 15,921 runs vs Kohli's 9,230 (Kohli still active), 51 centuries vs 29, in 200 Tests vs Kohli's 113. By average, they are close — Tendulkar 53.78, Kohli ~48–50. In volume, Tendulkar is unmatched; in consistency at home and away, Kohli's record is arguably superior.",
  },
  {
    question: "How do Kohli vs Tendulkar ODI statistics compare?",
    answer: "Kohli averages 59.07 in ODIs vs Tendulkar's 44.83 — a large gap. Kohli leads in ODI centuries (50+) vs Sachin's 49. Sachin has more ODI runs (18,426 in 463 matches) vs Kohli's 14,000+ (Kohli still active). Kohli's average in successful run chases is 90+, making him cricket's greatest ODI chaser by statistics.",
  },
]);

log("\n── SoundCloud: 2 free-tier / discovery FAQs ──");
await addFaqs("youtube-music-vs-soundcloud", [
  {
    question: "Is SoundCloud or YouTube Music better for free listeners in 2026?",
    answer: "SoundCloud is better for free listeners. SoundCloud's free tier allows unlimited ad-supported streaming. YouTube Music's free tier requires keeping the screen active — no background play on mobile without a paid plan. For free listening, SoundCloud wins; for paid subscribers, YouTube Music ($13.99/mo) offers better catalog depth and YouTube integration.",
  },
  {
    question: "Which music app is better for discovering underground music — SoundCloud or YouTube Music?",
    answer: "SoundCloud is far better for discovering underground and independent music. SoundCloud hosts over 300 million tracks — many from unsigned artists, DJs, and bedroom producers. YouTube Music's 100M+ licensed catalog skews toward commercial releases. If you want music before it's mainstream, SoundCloud is unmatched in 2026.",
  },
]);

log("\nDone.");
await prisma.$disconnect();
