/**
 * Patch: DAN-1287 intent-match content edits — 6 pages
 *
 * Applies the exact-copy on-page intent-match edits from DAN-1287 to the prod
 * DB so the closest-to-page-1 pages (pos 11–18) serve copy that matches the
 * real search query. Surgical field patches to EXISTING rows — does NOT
 * re-ingest full comparisons.
 *
 *   A. ps5-pro-vs-xbox-series-x        → metaTitle + intro 1st sentence
 *   B. bloomberg-vs-the-wall-street-journal → H1 (title) + intro 1st sentence
 *   C. paramount-plus-vs-peacock       → intro 1st sentence
 *   D. bose-vs-jbl                     → intro phrase (optional) + internal links
 *   E. /blog/mercedes-benz-alternatives… → append "Audi Competitors" H2 section
 *   F. Internal links (exact-match anchors) → 4 compare→compare targets
 *
 * Self-probing: every target/source row is checked for existence before any
 * write; missing rows are logged and skipped (shell-slug gotcha). Idempotent:
 * re-running is a no-op (first-sentence/section/link guards). Safe to re-run.
 *
 * NOT covered here (need engine/template changes owned by Dev — see DAN-1287
 * notes): blog-target and /entity/* explicit internal links are not surfaced by
 * the linking engine (it only matches /compare/* explicit links), and the
 * /entity/cleveland-browns intro needs an entity-template field. Logged at end.
 *
 * Run (prod, via CI):
 *   gh workflow run publish-editorial.yml -f script=scripts/patch-dan1287-intent-match.ts
 * Local:
 *   npx tsx scripts/patch-dan1287-intent-match.ts
 */

import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { getPrisma } from "../src/lib/db/prisma";

const prisma = getPrisma();
if (!prisma) {
  console.error(
    "✗ DATABASE_URL not available — this script must run against a real prod DB."
  );
  process.exit(1);
}

const log: string[] = [];
function note(s: string) {
  console.log(s);
  log.push(s);
}

/** Replace the first sentence of `text` with `newFirst`. Idempotent. */
function setFirstSentence(text: string | null, newFirst: string): string {
  const nf = newFirst.trim();
  if (!text || !text.trim()) return nf;
  if (text.trim().startsWith(nf)) return text; // already applied
  const m = text.match(/^[\s\S]*?[.!?](\s+|$)/);
  if (!m) return `${nf} ${text.trim()}`;
  const rest = text.slice(m[0].length).trim();
  return rest ? `${nf} ${rest}` : nf;
}

async function patchCompareField(
  slug: string,
  edits: { metaTitle?: string; title?: string; introFirstSentence?: string },
  opts: { introIfMissingPhrase?: string } = {}
) {
  const row = await prisma!.comparison.findUnique({
    where: { slug },
    select: { id: true, title: true, metaTitle: true, shortAnswer: true, status: true },
  });
  if (!row) {
    note(`  ⚠ /compare/${slug} — NO DB ROW; skipped`);
    return;
  }
  const data: Record<string, string> = {};

  if (edits.metaTitle && row.metaTitle !== edits.metaTitle) {
    data.metaTitle = edits.metaTitle;
  }
  if (edits.title && row.title !== edits.title) {
    data.title = edits.title;
  }
  if (edits.introFirstSentence) {
    const next = setFirstSentence(row.shortAnswer, edits.introFirstSentence);
    if (next !== row.shortAnswer) data.shortAnswer = next;
  }
  if (opts.introIfMissingPhrase) {
    const phrase = opts.introIfMissingPhrase;
    const cur = row.shortAnswer || "";
    if (!cur.toLowerCase().includes(phrase.toLowerCase())) {
      const sentence = `JBL versus Bose is the classic audio showdown — here's how the two brands compare on sound, price, and lineup.`;
      data.shortAnswer = setFirstSentence(row.shortAnswer, sentence);
    }
  }

  if (Object.keys(data).length === 0) {
    note(`  ✓ /compare/${slug} — already up to date (no change)`);
    return;
  }
  await prisma!.comparison.update({ where: { slug }, data });
  note(`  ✓ /compare/${slug} — updated: ${Object.keys(data).join(", ")}`);
}

const AUDI_SECTION_MARKER = "Audi Competitors: Best Luxury Car Alternatives in 2026";
const AUDI_SECTION = `\n\n## ${AUDI_SECTION_MARKER}\n\nAudi's main competitors in the 2026 luxury car market are Mercedes-Benz, BMW, Genesis, Lexus, and Volvo. If you're cross-shopping Audi competitors among luxury cars in 2026, BMW is the closest performance rival, Genesis offers the best value, and Lexus leads on reliability. The segment-by-segment table above maps each Audi alternative to its direct match.\n`;

async function patchBlogAudiSection() {
  const slug = "mercedes-benz-alternatives-in-2026-best-luxury-cars-brands-to-consider";
  const row = await prisma!.blogArticle.findUnique({
    where: { slug },
    select: { id: true, content: true },
  });
  if (!row) {
    note(`  ⚠ /blog/${slug} — NO DB ROW; skipped`);
    return;
  }
  if (row.content.includes(AUDI_SECTION_MARKER)) {
    note(`  ✓ /blog/${slug} — Audi section already present (no change)`);
    return;
  }
  await prisma!.blogArticle.update({
    where: { slug },
    data: { content: `${row.content.trimEnd()}${AUDI_SECTION}` },
  });
  note(`  ✓ /blog/${slug} — appended Audi Competitors section`);
}

/** Insert exact-anchor internal links from topically-related published source
 *  comparisons into a target compare page. Self-probing + idempotent. */
async function linkToTarget(
  targetSlug: string,
  anchor: string,
  sourceTokens: string[],
  max = 5
) {
  const toPath = `/compare/${targetSlug}`;
  const target = await prisma!.comparison.findUnique({
    where: { slug: targetSlug },
    select: { id: true },
  });
  if (!target) {
    note(`  ⚠ link target ${toPath} — NO DB ROW; skipped`);
    return;
  }
  const sources = await prisma!.comparison.findMany({
    where: {
      status: "published",
      slug: { not: targetSlug },
      OR: sourceTokens.map((t) => ({ slug: { contains: t } })),
    },
    select: { slug: true, viewCount: true },
    orderBy: { viewCount: "desc" },
    take: max * 3,
  });
  if (sources.length === 0) {
    note(`  ⚠ ${toPath} — no published source pages matched ${sourceTokens.join("/")}`);
    return;
  }
  let added = 0;
  for (const src of sources) {
    if (added >= max) break;
    const fromPath = `/compare/${src.slug}`;
    if (fromPath === toPath) continue;
    const existing = await prisma!.internalLink.findFirst({
      where: { fromPath, toPath },
      select: { id: true },
    });
    if (existing) {
      note(`    · ${fromPath} → ${toPath} — link exists`);
      added++;
      continue;
    }
    await prisma!.internalLink.create({
      data: {
        fromPath,
        toPath,
        anchorText: anchor,
        linkType: "related",
        position: "module",
        score: 1.3,
      },
    });
    note(`    ✓ ${fromPath} → ${toPath}  anchor="${anchor}"`);
    added++;
  }
  if (added === 0) note(`  ⚠ ${toPath} — matched sources but none linkable`);
}

async function main() {
  note("== DAN-1287 intent-match content edits ==");

  note("\n[A] /compare/ps5-pro-vs-xbox-series-x");
  await patchCompareField("ps5-pro-vs-xbox-series-x", {
    metaTitle: "PS5 Pro vs Xbox Series X: FPS, Specs & Price 2026",
    introFirstSentence:
      "PS5 Pro vs Xbox Series X — frame rate (FPS) and specs compared: the PS5 Pro's 2× GPU and AI upscaling vs the Xbox Series X's 12 TFLOPS, and which console actually hits higher FPS in real games.",
  });

  note("\n[B] /compare/bloomberg-vs-the-wall-street-journal");
  await patchCompareField("bloomberg-vs-the-wall-street-journal", {
    title: "Bloomberg vs WSJ (The Wall Street Journal)",
    introFirstSentence:
      "Bloomberg vs WSJ (The Wall Street Journal) in 2026: which is better for investors — terminal-grade data vs newspaper depth, and what each subscription costs.",
  });

  note("\n[C] /compare/paramount-plus-vs-peacock");
  await patchCompareField("paramount-plus-vs-peacock", {
    introFirstSentence:
      "Peacock vs Paramount+ (Paramount Plus) in 2026: here's the head-to-head on live sports, movie libraries, and price to settle which streaming service wins.",
  });

  note("\n[D] /compare/bose-vs-jbl (optional intro phrase; primary lever = internal links)");
  await patchCompareField("bose-vs-jbl", {}, { introIfMissingPhrase: "JBL versus Bose" });

  note("\n[E] blog — Audi Competitors section");
  await patchBlogAudiSection();

  note("\n[F] Internal links (exact-match anchors)");
  await linkToTarget("bose-vs-jbl", "jbl versus bose", [
    "bose", "jbl", "sony", "sonos", "beats", "sennheiser", "airpods",
  ]);
  await linkToTarget("paramount-plus-vs-peacock", "peacock versus paramount", [
    "netflix", "hulu", "disney-plus", "hbo", "max", "apple-tv", "peacock", "paramount",
  ]);
  await linkToTarget("ps5-pro-vs-xbox-series-x", "ps5 pro vs xbox series x fps", [
    "ps5", "xbox", "playstation", "nintendo", "switch",
  ]);
  await linkToTarget("bloomberg-vs-the-wall-street-journal", "bloomberg vs wsj", [
    "reuters", "financial-times", "cnbc", "economist", "wsj", "wall-street", "bloomberg",
  ]);

  note("\n[!] Deferred (need Dev engine/template change — DAN-1287 §note):");
  note("    · /blog audi-section inbound links + /entity/cleveland-browns links: the linking");
  note("      engine only renders explicit /compare/* targets, so these were NOT inserted.");
  note("    · /entity/cleveland-browns intro needs the entity-template field (sibling Dev2 issue).");

  note("\n== Done ==");
}

main()
  .then(async () => {
    await prisma!.$disconnect();
    console.log("\nSummary:\n" + log.join("\n"));
  })
  .catch(async (e) => {
    console.error("✗ patch failed:", e);
    await prisma!.$disconnect();
    process.exit(1);
  });
