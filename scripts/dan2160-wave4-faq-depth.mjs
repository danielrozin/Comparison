/**
 * DAN-2160 Wave 4 — FAQ depth + cross-category links
 *
 * Prior waves:
 *   Wave 1: meta titles + internal links for 6 pages
 *   Wave 2: FAQs + links for ww1, kobe, farmers, macbook-air-vs-pro
 *   Wave 3: 9 untouched pages — content_score fixes + FAQ expansion + links
 *
 * Wave 4 (this): push pos-13 pages over the page-1 line via content depth.
 *   Pages still at 6 FAQs after Wave 3 are the primary target.
 *   Strategy:
 *     A) capital-one-vs-chase  (pos13 vol40): 6 FAQs → 10 FAQs; target query "are chase and capital one affiliated"
 *     B) ikea-vs-wayfair       (pos13 vol40): 6 FAQs → 10 FAQs; target query "wayfair vs ikea reddit"
 *     C) macbook-air-m3-vs-macbook-air-m4  (pos13 vol20): 6 FAQs → 10 FAQs
 *     D) Internal links FROM finance blog + comparison pages to capital-one-vs-chase
 *     E) Internal links FROM tech pages to macbook-air-m3-vs-macbook-air-m4
 *     F) Internal links from sports blog to kobe-bryant-vs-lebron-james
 *     G) Add more inbound links to youtube-music-vs-soundcloud (pos11 — closest to page 1)
 *
 * Run:
 *   node scripts/dan2160-wave4-faq-depth.mjs --dry
 *   node scripts/dan2160-wave4-faq-depth.mjs
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function upsertLink({ fromPath, toPath, anchorText, linkType = "related", position = "inline", score = 1.0 }) {
  const existing = await prisma.internalLink.findFirst({ where: { fromPath, toPath } });
  if (existing) { log(`  skip (exists): ${fromPath} → ${toPath}`); return false; }
  const fromSlug = fromPath.replace("/compare/", "").replace("/blog/", "");
  const fromComp = await prisma.comparison.findFirst({ where: { slug: fromSlug, status: "published" }, select: { id: true } });
  const fromBlog = fromComp ? null : await prisma.blogArticle.findFirst({ where: { slug: fromSlug, status: "published" }, select: { id: true } });
  if (!fromComp && !fromBlog) { log(`  · skip (source missing or not published): ${fromPath}`); return false; }
  if (!DRY) {
    await prisma.internalLink.create({ data: { fromPath, toPath, anchorText, linkType, position, score } });
  }
  log(`  ${DRY ? "[DRY]" : "✓"} link: ${fromPath} → ${toPath}  anchor="${anchorText}"`);
  return true;
}

async function upsertFaq(slug, question, answer, sortOrder) {
  const comp = await prisma.comparison.findUnique({ where: { slug }, select: { id: true } });
  if (!comp) { log(`  ! faq skip: comparison not found: ${slug}`); return false; }
  const existing = await prisma.fAQ.findFirst({ where: { comparisonId: comp.id, question } });
  if (existing) { log(`  skip (exists) faq: "${question.slice(0, 60)}"`); return false; }
  if (!DRY) {
    await prisma.fAQ.create({ data: { comparisonId: comp.id, question, answer, sortOrder } });
  }
  log(`  ${DRY ? "[DRY]" : "✓"} faq[${sortOrder}]: "${question.slice(0, 70)}"`);
  return true;
}

// ===========================================================================
// A. capital-one-vs-chase — 4 new FAQs targeting "are chase and capital one affiliated"
// ===========================================================================
log("\n=== A. capital-one-vs-chase FAQs (6 → 10) ===");

await upsertFaq("capital-one-vs-chase",
  "Is Capital One part of Chase Bank?",
  "No. Capital One and Chase (JPMorgan Chase) are completely separate, independent banks with no ownership or affiliation. Capital One Financial Corporation is headquartered in McLean, Virginia, while JPMorgan Chase is headquartered in New York. They are competitors, not related entities.",
  7);

await upsertFaq("capital-one-vs-chase",
  "Capital One vs Chase: which is better for everyday banking?",
  "Chase wins for everyday banking if you want an extensive branch and ATM network with over 4,700 branches nationwide. Capital One is better if you prefer a nearly fee-free online banking experience — its 360 Checking has no monthly fees and earns interest, while Chase's basic checking charges $12/month unless you meet balance or direct-deposit requirements.",
  8);

await upsertFaq("capital-one-vs-chase",
  "Which bank has higher savings rates — Capital One or Chase?",
  "Capital One offers significantly higher savings rates. Its 360 Performance Savings consistently earns well above the national average, often 4%+ APY. Chase Savings pays a very low rate (typically under 0.5% APY). If maximizing savings interest is the goal, Capital One wins clearly.",
  9);

await upsertFaq("capital-one-vs-chase",
  "Can you use Capital One cards at Chase ATMs?",
  "Yes. Capital One debit and credit cards run on the Mastercard or Visa network and can be used at any ATM that accepts those networks, including Chase ATMs. However, non-Chase cards used at Chase ATMs typically incur a $3–5 Chase out-of-network fee unless your card's bank reimburses ATM fees (Capital One 360 Checking does reimburse ATM fees).",
  10);

// ===========================================================================
// B. ikea-vs-wayfair — 4 new FAQs, lean into Reddit-style community answers
// ===========================================================================
log("\n=== B. ikea-vs-wayfair FAQs (6 → 10) ===");

await upsertFaq("ikea-vs-wayfair",
  "IKEA vs Wayfair: which has the better return policy?",
  "IKEA has the edge. IKEA allows returns within 365 days for most items (unused and in original packaging) with no restocking fee. Wayfair's return window is 30 days, and large or assembled items often require you to pay the return shipping, which can be expensive for furniture.",
  7);

await upsertFaq("ikea-vs-wayfair",
  "Is IKEA or Wayfair better for sofas and couches?",
  "Wayfair offers far more styles, brands, and price points for sofas, making it better for variety and one-stop shopping. IKEA sofas (like the KIVIK and SÖDERHAMN) are popular on Reddit for their modular configurability and lower price, but quality is comparable only in the budget segment. For premium upholstery or non-modular designs, Wayfair wins.",
  8);

await upsertFaq("ikea-vs-wayfair",
  "Which is better for a home office — IKEA or Wayfair?",
  "IKEA dominates home office furniture. The ALEX drawer units, BILLY bookshelves, and LINNMON/KARLBY desk tops have cult followings for good reason — they are sturdy, modular, and priced well. Wayfair has a wider range of pre-assembled desks and chairs, making it better if you want something delivered fully assembled. For customizable, budget-friendly setups, IKEA wins.",
  9);

await upsertFaq("ikea-vs-wayfair",
  "IKEA vs Wayfair for bedroom furniture: which is better?",
  "IKEA leads on system furniture (PAX wardrobes, MALM beds, HEMNES dressers) that you can configure to your exact space. Wayfair is better if you want a wider range of aesthetics — mid-century modern, farmhouse, industrial — without the flat-pack assembly. Reddit consensus: IKEA for wardrobes and storage; Wayfair for statement pieces like headboards and bedside tables.",
  10);

// ===========================================================================
// C. macbook-air-m3-vs-macbook-air-m4 — 4 new FAQs
// ===========================================================================
log("\n=== C. macbook-air-m3-vs-macbook-air-m4 FAQs (6 → 10) ===");

await upsertFaq("macbook-air-m3-vs-macbook-air-m4",
  "How much faster is the MacBook Air M4 vs M3 in real-world use?",
  "Apple claims 25–30% faster CPU performance and up to 35% faster GPU in the M4 vs M3. In practice, tasks like exporting a 4K video in Final Cut Pro and running large AI models are noticeably faster on the M4. For web browsing, document editing, or email, the difference is imperceptible. The M4 gains matter most for creative professionals and developers who stress the chip regularly.",
  7);

await upsertFaq("macbook-air-m3-vs-macbook-air-m4",
  "Is the MacBook Air M4 worth the premium over the M3 in 2026?",
  "Yes, if you're buying new — the M4 Air starts at the same MSRP as the M3 did at launch, so there is no real premium for new buyers. If you're deciding between buying a new M4 or a discounted used/refurbished M3, the M3 can be an excellent value at $100–200 below MSRP; it will remain fully supported by macOS for several more years and handles all everyday tasks without compromise.",
  8);

await upsertFaq("macbook-air-m3-vs-macbook-air-m4",
  "Does the MacBook Air M4 have more RAM than the M3?",
  "Both the M3 and M4 MacBook Air start at 8 GB unified memory with options to configure 16 GB or 24 GB. The difference is speed: M4's memory bandwidth is higher (up to 120 GB/s vs 100 GB/s on the M3), making the 8 GB M4 feel more capable under load than the 8 GB M3. If your work involves large datasets or simultaneous heavy apps, prioritize configuring 16 GB on whichever chip you choose.",
  9);

await upsertFaq("macbook-air-m3-vs-macbook-air-m4",
  "Will Apple support the MacBook Air M3 as long as the M4?",
  "Apple typically supports Macs with macOS updates for about 7 years after release. The M3 MacBook Air launched in early 2024, so expect support through approximately 2030–2031. The M4 Air (2025) extends that window to around 2032. If you plan to keep your Mac for 4–5 years, both chips will be fully supported with no difference in practice.",
  10);

// ===========================================================================
// D. Internal links to capital-one-vs-chase from finance-adjacent pages
// ===========================================================================
log("\n=== D. Internal links → capital-one-vs-chase ===");

await upsertLink({
  fromPath: "/blog/visa-vs-mastercard-2026-which-card-network-is-better",
  toPath: "/compare/capital-one-vs-chase",
  anchorText: "Capital One vs Chase: which bank offers better credit card rewards?",
  linkType: "related",
  score: 0.9
});

await upsertLink({
  fromPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs",
  toPath: "/compare/capital-one-vs-chase",
  anchorText: "Capital One vs Chase: a broader bank comparison",
  linkType: "related",
  score: 0.9
});

await upsertLink({
  fromPath: "/compare/farmers-insurance-vs-state-farm",
  toPath: "/compare/capital-one-vs-chase",
  anchorText: "Capital One vs Chase banking",
  linkType: "related",
  score: 0.8
});

await upsertLink({
  fromPath: "/blog/best-accounting-software-for-small-business-2026-quickbooks-vs-xero-vs-wave",
  toPath: "/compare/capital-one-vs-chase",
  anchorText: "Capital One vs Chase for small business banking",
  linkType: "related",
  score: 0.8
});

// ===========================================================================
// E. Internal links to macbook-air-m3-vs-macbook-air-m4 from tech pages
// ===========================================================================
log("\n=== E. Internal links → macbook-air-m3-vs-macbook-air-m4 ===");

await upsertLink({
  fromPath: "/blog/ipad-vs-android-tablet-which-should-you-buy-in-2026",
  toPath: "/compare/macbook-air-m3-vs-macbook-air-m4",
  anchorText: "MacBook Air M3 vs M4: which chip to choose",
  linkType: "related",
  score: 0.85
});

await upsertLink({
  fromPath: "/compare/macbook-air-vs-macbook-pro-difference-2026-specs",
  toPath: "/compare/macbook-air-m3-vs-macbook-air-m4",
  anchorText: "MacBook Air M3 vs M4: is it worth upgrading the chip?",
  linkType: "related",
  score: 0.9
});

await upsertLink({
  fromPath: "/blog/best-ai-assistants-2026-chatgpt-vs-claude-vs-gemini-vs-perplexity",
  toPath: "/compare/macbook-air-m3-vs-macbook-air-m4",
  anchorText: "MacBook Air M4 vs M3 for running local AI models",
  linkType: "related",
  score: 0.75
});

// ===========================================================================
// F. Internal links → kobe-bryant-vs-lebron-james (4 keywords at pos 16–19)
// ===========================================================================
log("\n=== F. Internal links → kobe-bryant-vs-lebron-james ===");

await upsertLink({
  fromPath: "/compare/ww1-vs-ww2",
  toPath: "/compare/kobe-bryant-vs-lebron-james",
  anchorText: "Kobe Bryant vs LeBron James: career stats and accolades compared",
  linkType: "related",
  score: 0.6
});

await upsertLink({
  fromPath: "/compare/virat-kohli-vs-sachin-tendulkar",
  toPath: "/compare/kobe-bryant-vs-lebron-james",
  anchorText: "Kobe Bryant vs LeBron James career comparison",
  linkType: "related",
  score: 0.8
});

// ===========================================================================
// G. Internal links → youtube-music-vs-soundcloud (pos11 — closest to page 1)
// ===========================================================================
log("\n=== G. Internal links → youtube-music-vs-soundcloud ===");

await upsertLink({
  fromPath: "/blog/best-streaming-services-in-2026-top-picks-for-every-budget-interest",
  toPath: "/compare/youtube-music-vs-soundcloud",
  anchorText: "YouTube Music vs SoundCloud: which is better for music streaming?",
  linkType: "related",
  score: 0.85
});

await upsertLink({
  fromPath: "/compare/hulu-vs-peacock",
  toPath: "/compare/youtube-music-vs-soundcloud",
  anchorText: "YouTube Music vs SoundCloud for music streaming",
  linkType: "related",
  score: 0.8
});

await upsertLink({
  fromPath: "/blog/the-best-streaming-services-in-2026-your-complete-guide-to-cutting-cable",
  toPath: "/compare/youtube-music-vs-soundcloud",
  anchorText: "SoundCloud vs YouTube Music: audio streaming compared",
  linkType: "related",
  score: 0.8
});

// ===========================================================================
// H. Bump content scores for pages that now qualify
// ===========================================================================
log("\n=== H. Update content scores to 90 for pages at 10 FAQs ===");

async function setContentScore(slug, score) {
  const row = await prisma.comparison.findUnique({ where: { slug }, select: { id: true, contentScore: true } });
  if (!row) { log(`  ! not found: ${slug}`); return; }
  if (row.contentScore === score) { log(`  skip (already ${score}): ${slug}`); return; }
  if (!DRY) await prisma.comparison.update({ where: { slug }, data: { contentScore: score } });
  log(`  ${DRY ? "[DRY]" : "✓"} contentScore ${row.contentScore ?? "null"} → ${score}: ${slug}`);
}

// These pages now have 10 FAQs after Wave 4
await setContentScore("capital-one-vs-chase", 90);
await setContentScore("ikea-vs-wayfair", 90);
await setContentScore("macbook-air-m3-vs-macbook-air-m4", 90);

// ===========================================================================
log("\n✅ Wave 4 complete.");
await prisma.$disconnect();
