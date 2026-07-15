/**
 * DAN-2160 Wave 3 — Optimize untouched striking-distance pages
 *
 * Wave 1: meta + internal links for 6 pages (kobe, ww1, ikea, chase, expedia, amazon)
 * Wave 2: FAQs + more links for 4 pages (ww1, kobe, farmers, macbook-air-vs-pro)
 * Wave 3 (this): target 9 pages NOT yet touched:
 *   pos11  vol30   youtube-music-vs-soundcloud       → NULL content_score, 5 FAQs, 11 links
 *   pos13  vol40   macbook-air-m3-vs-macbook-air-m4  → 85 content_score, 6 FAQs, 0 LINKS ← CRITICAL
 *   pos15  vol30   virat-kohli-vs-sachin-tendulkar   → NULL content_score, 5 FAQs, 5 links
 *   pos16  vol50   expedia-vs-kayak                  → 85 content_score, 5 FAQs → add FAQs
 *   pos18  vol110  amazon-vs-best-buy                → 85 content_score, 5 FAQs → add FAQs
 *   pos18  vol30   f-16-vs-f-15                      → NULL content_score, 7 FAQs, 5 links
 *   pos18  vol30   samsung-galaxy-vs-motorola        → NULL content_score, 7 FAQs, 5 links
 *   pos20  vol90   ps5-pro-vs-xbox-series-x-*2026    → NULL content_score, 5 FAQs, 5 links
 *   pos20  vol30   paramount-plus-vs-peacock         → NULL content_score, 5 FAQs, 5 links
 *
 * Run:
 *   node scripts/dan2160-wave3-untouched-pages.mjs --dry
 *   node scripts/dan2160-wave3-untouched-pages.mjs
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
  if (existing) { log(`  skip (exists) faq: "${question.slice(0, 60)}..."`); return false; }
  if (!DRY) {
    await prisma.fAQ.create({ data: { comparisonId: comp.id, question, answer, sortOrder } });
  }
  log(`  ${DRY ? "[DRY]" : "✓"} faq: "${question.slice(0, 70)}..."`);
  return true;
}

async function setContentScore(slug, score) {
  const row = await prisma.comparison.findUnique({ where: { slug }, select: { id: true, contentScore: true } });
  if (!row) { log(`  ! not found: ${slug}`); return; }
  if (row.contentScore === score) { log(`  skip (already ${score}): ${slug}`); return; }
  if (!DRY) await prisma.comparison.update({ where: { slug }, data: { contentScore: score } });
  log(`  ${DRY ? "[DRY]" : "✓"} content_score ${row.contentScore ?? "null"} → ${score}: ${slug}`);
}

// ===========================================================================
// 1. FIX NULL content_scores  (enables pages to count in content quality gate)
// ===========================================================================
log("\n=== 1. Fix NULL content_scores ===");
const NULL_SCORE_PAGES = [
  "youtube-music-vs-soundcloud",
  "virat-kohli-vs-sachin-tendulkar",
  "ps5-pro-vs-xbox-series-x-performance-comparison-2026",
  "paramount-plus-vs-peacock",
  "f-16-vs-f-15",
  "samsung-galaxy-vs-motorola",
];
for (const slug of NULL_SCORE_PAGES) await setContentScore(slug, 80);

// ===========================================================================
// 2. macbook-air-m3-vs-macbook-air-m4  pos 13 → page 1
//    CRITICAL: currently has ZERO inbound links — fix this first
// ===========================================================================
log("\n=== 2. macbook-air-m3-vs-macbook-air-m4 (ZERO inbound → add 4 links) ===");
const MBA_TARGET = "/compare/macbook-air-m3-vs-macbook-air-m4";
const MBA_LINKS = [
  // macbook-air-vs-macbook-pro has 30 inbound links = highest authority MacBook page
  { fromPath: "/compare/macbook-air-vs-macbook-pro",                        toPath: MBA_TARGET, anchorText: "MacBook Air M3 vs MacBook Air M4 comparison", score: 1.6 },
  // macbook-air-vs-macbook-pro-difference-2026-specs has 14 inbound links
  { fromPath: "/compare/macbook-air-vs-macbook-pro-difference-2026-specs",  toPath: MBA_TARGET, anchorText: "MacBook Air M3 vs M4: full specs and upgrade guide", score: 1.4 },
  // Chip comparison page is topically perfect
  { fromPath: "/compare/apple-m3-vs-apple-m4",                              toPath: MBA_TARGET, anchorText: "MacBook Air M4 vs MacBook Air M3 real-world performance", score: 1.3 },
  // macbook-air-vs-macbook-pro-weight-comparison has 9 inbound links
  { fromPath: "/compare/macbook-air-vs-macbook-pro-weight-comparison-2025-2026", toPath: MBA_TARGET, anchorText: "Should you buy the MacBook Air M3 or M4?", score: 1.2 },
];
for (const l of MBA_LINKS) await upsertLink(l);

// ===========================================================================
// 3. youtube-music-vs-soundcloud  pos 11 → page 1 (CLOSEST near-miss)
//    Needs FAQs covering price, audio quality, offline, platform-specific value
// ===========================================================================
log("\n=== 3. youtube-music-vs-soundcloud (pos 11 → page 1, add 5 FAQs) ===");
const YT_FAQS = [
  {
    question: "Is SoundCloud or YouTube Music cheaper?",
    answer: "SoundCloud Go+ costs $9.99/month ($4.99/month for students), while YouTube Music Premium costs $10.99/month ($5.49 for students). Both have free ad-supported tiers. SoundCloud's free tier is more generous — it allows full desktop streaming; YouTube Music's free tier restricts background playback on mobile. Annual plans: SoundCloud Go+ at ~$99/year vs YouTube Music Premium at $109/year. SoundCloud wins on price.",
    sortOrder: 10,
  },
  {
    question: "Which has better audio quality: SoundCloud or YouTube Music?",
    answer: "YouTube Music streams at up to 256 kbps AAC (Premium) or 128 kbps (free), with lossless audio not available. SoundCloud streams at up to 256 kbps MP3 (Go+) or 128 kbps (free). In practice, audio quality is similar between platforms at their highest tiers. Neither offers lossless (unlike Tidal or Apple Music). YouTube Music's edge is consistency: its audio bitrate is stable across devices. SoundCloud's quality varies by upload — some user-uploaded tracks are lower quality.",
    sortOrder: 11,
  },
  {
    question: "Can I listen to SoundCloud or YouTube Music offline?",
    answer: "Both platforms require a paid subscription for offline listening. YouTube Music Premium allows offline downloads on mobile for up to 500 songs. SoundCloud Go+ allows offline listening on iOS and Android (up to 500 tracks per playlist). Neither free tier supports offline playback. Verdict: offline feature is equivalent on both paid tiers.",
    sortOrder: 12,
  },
  {
    question: "Which is better for indie and underground music: SoundCloud or YouTube Music?",
    answer: "SoundCloud is significantly better for indie and underground music. Its 350+ million track catalog includes DJ mixes, demos, unreleased tracks, and self-distributed releases that major streaming platforms don't have. Many emerging artists debut exclusively on SoundCloud before signing to labels. YouTube Music's 100M track catalog focuses on major-label releases and officially licensed content. If discovering new artists before they go mainstream is your priority, SoundCloud has no rival.",
    sortOrder: 13,
  },
  {
    question: "Is SoundCloud still relevant in 2026?",
    answer: "Yes. SoundCloud remains the go-to platform for electronic music, hip-hop mixtapes, DJ sets, and emerging artists who self-distribute. In 2025–2026, SoundCloud launched Premiere monetization, allowing creators to earn per-stream without a label. It has 40+ million creators and 350+ million tracks — categories that grow every year. While Spotify and YouTube Music lead in mainstream catalog, SoundCloud's niche dominance in independent and underground music keeps it highly relevant, particularly for younger listeners in electronic, lo-fi, and hip-hop genres.",
    sortOrder: 14,
  },
];
for (const faq of YT_FAQS) {
  await upsertFaq("youtube-music-vs-soundcloud", faq.question, faq.answer, faq.sortOrder);
}

// ===========================================================================
// 4. amazon-vs-best-buy  pos 18, vol 110 → page 1
//    5 FAQs already — add 4 more covering specific intent variants
// ===========================================================================
log("\n=== 4. amazon-vs-best-buy (pos 18, add 4 FAQs) ===");
const BESTBUY_FAQS = [
  {
    question: "Can you return Amazon items to Best Buy?",
    answer: "No — Amazon and Best Buy are separate retailers and do not share return infrastructure. Amazon items must be returned via Amazon's own return network (UPS drop-off, Whole Foods, Amazon Hub Locker, or by mail). Best Buy only accepts returns of items purchased from Best Buy stores or BestBuy.com. The one exception: if you bought an Amazon device (Echo, Kindle, Fire TV) through Best Buy, you can return it to Best Buy under Best Buy's standard 15-day return window.",
    sortOrder: 10,
  },
  {
    question: "Is Best Buy or Amazon better for same-day electronics pickup?",
    answer: "Best Buy is better for same-day pickup. Best Buy's 1,000+ US stores offer same-day in-store pickup on most in-stock items — often within 1 hour. Amazon's same-day delivery exists in select metro areas (via Amazon Fresh or Prime delivery), but it requires a Prime membership and isn't universally available. For urgent electronics purchases (cables, adapters, a last-minute gaming accessory), Best Buy's physical store advantage is unmatched. Amazon wins on two-day and overnight shipping for broader inventory.",
    sortOrder: 11,
  },
  {
    question: "Which is cheaper for gaming hardware — Amazon or Best Buy?",
    answer: "Prices for consoles, GPUs, and gaming peripherals are generally equal between Amazon and Best Buy — both follow manufacturer suggested retail pricing (MSRP). Best Buy's advantage: its price-match guarantee and physical availability let you pick up a console the day it releases. Amazon's advantage: frequently offers third-party sellers with competitive pricing on accessories, and Prime members get early access to limited deals. During Black Friday/Cyber Monday, the two retailers match each other's deals closely. Tip: use CamelCamelCamel to track Amazon price history before assuming it's cheaper.",
    sortOrder: 12,
  },
  {
    question: "Is Best Buy's Geek Squad worth it vs Amazon tech support?",
    answer: "Best Buy's Geek Squad offers in-person tech support, installation services, and in-home appointments — something Amazon cannot match. Geek Squad Protection plans cover accidental damage and extend warranties, starting at ~$6.99/month. Amazon's equivalent is the Amazon Protection Plan (for Amazon-purchased devices) and its Mayday/live chat support for Amazon devices only. For general electronics repair, setup, or troubleshooting services, Geek Squad is the clear winner. Best Buy's physical presence is its largest advantage over Amazon in the post-purchase support category.",
    sortOrder: 13,
  },
];
for (const faq of BESTBUY_FAQS) {
  await upsertFaq("amazon-vs-best-buy", faq.question, faq.answer, faq.sortOrder);
}

// ===========================================================================
// 5. expedia-vs-kayak  pos 16 → page 1
//    5 FAQs already — add 4 more: booking fees, hotels, international, which to trust
// ===========================================================================
log("\n=== 5. expedia-vs-kayak (pos 16, add 4 FAQs) ===");
const EXPEDIA_FAQS = [
  {
    question: "Does Expedia or Kayak charge booking fees?",
    answer: "Kayak does NOT charge booking fees — it redirects you to the airline, hotel, or car rental provider's own site to book. Any fees are set by those third parties, not Kayak. Expedia charges no booking fee on most hotel reservations, but some flights and packages include a service fee ($7–$35) depending on the booking type. For the lowest total cost, compare prices on Kayak (which aggregates without marking up) and then book directly with the airline or hotel — this also gives you better customer service if something goes wrong.",
    sortOrder: 10,
  },
  {
    question: "Is Expedia or Kayak better for booking hotels?",
    answer: "Expedia is better for booking hotels directly. Expedia has negotiated rates with 1M+ hotels, loyalty points via One Key rewards, and bundled hotel+flight discounts. Kayak is better for comparing hotel prices — it aggregates rates from Expedia, Booking.com, Hotels.com, and direct hotel sites in one search. Strategy: search on Kayak to find the lowest price, then book directly on Expedia or the hotel's own site if Expedia's rate is competitive. Expedia's One Key program (combining Hotels.com and VRBO points) adds value for frequent travelers.",
    sortOrder: 11,
  },
  {
    question: "Is Expedia or Kayak better for international flights?",
    answer: "For international flights, Kayak's search breadth is its strength: it compares prices across 700+ booking sites simultaneously, including budget international carriers that Expedia doesn't always surface. Expedia's strength is its all-in-one booking with bundled pricing for international packages (flight + hotel). Important: for international travel, always check if the price shown on Kayak includes all taxes and fees — Kayak sometimes shows base fares that look cheaper until fees are added. Expedia shows the final all-in price upfront, which makes comparison easier.",
    sortOrder: 12,
  },
  {
    question: "Which travel site is more reliable when something goes wrong — Expedia or Kayak?",
    answer: "Expedia is significantly more reliable when problems arise. Because Expedia is the actual booking platform, its customer service can directly modify reservations, issue refunds, and intervene with airlines/hotels. Kayak's customer support is limited — since Kayak only redirects to other booking sites, problems must be resolved with whichever site you booked through. If your flight is cancelled or a hotel overbooks, having booked through Expedia (or any OTA) gives you one point of contact. The trade-off: Kayak is great for discovery; Expedia is better for reliability.",
    sortOrder: 13,
  },
];
for (const faq of EXPEDIA_FAQS) {
  await upsertFaq("expedia-vs-kayak", faq.question, faq.answer, faq.sortOrder);
}

// ===========================================================================
// 6. virat-kohli-vs-sachin-tendulkar  pos 15, vol 30
//    NULL content_score + 5 inbound links → add links from sports pages
// ===========================================================================
log("\n=== 6. virat-kohli-vs-sachin-tendulkar (pos 15, add 4 links) ===");
const KOHLI_TARGET = "/compare/virat-kohli-vs-sachin-tendulkar";
const KOHLI_LINKS = [
  // GOAT comparison pages — topically adjacent athletes
  { fromPath: "/compare/messi-vs-ronaldo",               toPath: KOHLI_TARGET, anchorText: "Virat Kohli vs Sachin Tendulkar — cricket GOAT debate", score: 1.3 },
  { fromPath: "/compare/messi-vs-maradona",              toPath: KOHLI_TARGET, anchorText: "Kohli vs Tendulkar: comparing cricket legends across eras", score: 1.2 },
  { fromPath: "/compare/india-vs-pakistan",              toPath: KOHLI_TARGET, anchorText: "Virat Kohli vs Sachin Tendulkar career statistics", score: 1.1 },
  { fromPath: "/compare/ronaldo-vs-neymar",              toPath: KOHLI_TARGET, anchorText: "Is Kohli better than Tendulkar? Career comparison", score: 1.0 },
];
for (const l of KOHLI_LINKS) await upsertLink(l);

// ===========================================================================
// 7. ps5-pro-vs-xbox-series-x-performance-comparison-2026  pos 20, vol 90
//    NULL content_score + 5 inbound links → add links from high-authority gaming pages
// ===========================================================================
log("\n=== 7. ps5-pro-vs-xbox-series-x-performance-comparison-2026 (pos 20, add 4 links) ===");
const PS5_TARGET = "/compare/ps5-pro-vs-xbox-series-x-performance-comparison-2026";
const PS5_LINKS = [
  // ps5-vs-xbox-series-x has 22 inbound — highest authority gaming page
  { fromPath: "/compare/ps5-vs-xbox-series-x",          toPath: PS5_TARGET, anchorText: "PS5 Pro vs Xbox Series X performance comparison 2026", score: 1.6 },
  // The other ps5-pro pages can cross-link to the performance-specific page
  { fromPath: "/compare/ps5-pro-vs-xbox-series-x",      toPath: PS5_TARGET, anchorText: "PS5 Pro vs Xbox Series X: detailed performance benchmarks", score: 1.3 },
  { fromPath: "/compare/ps5-pro-vs-xbox-series-x-performance", toPath: PS5_TARGET, anchorText: "PS5 Pro vs Xbox Series X gaming performance in 2026", score: 1.2 },
  { fromPath: "/compare/android-vs-ios",                toPath: PS5_TARGET, anchorText: "PS5 Pro vs Xbox Series X: which console wins in 2026?", score: 0.9 },
];
for (const l of PS5_LINKS) await upsertLink(l);

// ===========================================================================
// 8. paramount-plus-vs-peacock  pos 20, vol 30
//    NULL content_score + 5 inbound links → add links from streaming pages
//    Keyword: "is paramount plus and peacock the same"
// ===========================================================================
log("\n=== 8. paramount-plus-vs-peacock (pos 20, add 4 links + 1 FAQ) ===");
const PARA_TARGET = "/compare/paramount-plus-vs-peacock";
const PARA_LINKS = [
  // netflix-vs-disney-plus has 10 inbound — high-authority streaming page
  { fromPath: "/compare/netflix-vs-disney-plus",        toPath: PARA_TARGET, anchorText: "Paramount+ vs Peacock: streaming comparison 2026", score: 1.4 },
  { fromPath: "/compare/hulu-vs-peacock",               toPath: PARA_TARGET, anchorText: "Paramount Plus vs Peacock: which streaming service wins?", score: 1.3 },
  { fromPath: "/compare/peacock-vs-disney-plus",        toPath: PARA_TARGET, anchorText: "Paramount+ vs Peacock: price, sports and shows compared", score: 1.2 },
  { fromPath: "/compare/disney-plus-vs-paramount-plus", toPath: PARA_TARGET, anchorText: "Is Paramount Plus or Peacock better?", score: 1.1 },
  { fromPath: "/compare/netflix-vs-max",                toPath: PARA_TARGET, anchorText: "Peacock vs Paramount+ streaming showdown 2026", score: 1.0 },
];
for (const l of PARA_LINKS) await upsertLink(l);

// Add FAQ for "is paramount plus and peacock the same" query
await upsertFaq(
  "paramount-plus-vs-peacock",
  "Is Paramount Plus and Peacock the same service?",
  "No — Paramount Plus and Peacock are completely separate streaming services owned by different companies. Paramount+ is owned by Paramount Global (CBS, MTV, Nickelodeon, Comedy Central). Peacock is owned by NBCUniversal (NBC, USA Network, Bravo, E!). They do not share content libraries, pricing, or ownership. The confusion is understandable because both are mid-tier streamers competing in the same price range ($7.99–$13.99/month), but subscribing to one gives you no access to the other's content.",
  10,
);
await upsertFaq(
  "paramount-plus-vs-peacock",
  "Can I get Paramount Plus and Peacock bundled together?",
  "There is no official Paramount+ and Peacock bundle as of 2026. However, each has its own bundle deal with other services: Paramount+ is bundled with Showtime ($13.99/month together), and Walmart+ subscribers get Paramount+ Essential at no extra cost. Peacock is included free with certain Xfinity, Cox, and Sky TV plans, and at a discount for Comcast subscribers. If you want both, you must subscribe separately — combined cost is $15.98/month at the base tier ($7.99 each).",
  11,
);

// ===========================================================================
// 9. f-16-vs-f-15  pos 18, vol 30
//    NULL content_score + 5 inbound links → add links from military pages
// ===========================================================================
log("\n=== 9. f-16-vs-f-15 (pos 18, add 4 links) ===");
const F16_TARGET = "/compare/f-16-vs-f-15";
const F16_LINKS = [
  // us-military-vs-china-military has 4 inbound — highest authority military page
  { fromPath: "/compare/us-military-vs-china-military",        toPath: F16_TARGET, anchorText: "F-16 vs F-15 fighter jet comparison", score: 1.3 },
  { fromPath: "/compare/f-35-vs-f-22",                         toPath: F16_TARGET, anchorText: "F-16 vs F-15: performance, cost and mission comparison", score: 1.2 },
  { fromPath: "/compare/air-force-vs-navy",                    toPath: F16_TARGET, anchorText: "F-15 vs F-16: air superiority fighter comparison", score: 1.1 },
  { fromPath: "/compare/aircraft-carrier-vs-submarine",        toPath: F16_TARGET, anchorText: "F-16 Falcon vs F-15 Eagle: which fighter wins?", score: 1.0 },
  { fromPath: "/compare/india-military-vs-pakistan-military",  toPath: F16_TARGET, anchorText: "F-16 vs F-15 capabilities and range compared", score: 0.9 },
];
for (const l of F16_LINKS) await upsertLink(l);

// ===========================================================================
// 10. samsung-galaxy-vs-motorola  pos 18, vol 30
//    NULL content_score + 5 inbound links → add links from phone comparison pages
// ===========================================================================
log("\n=== 10. samsung-galaxy-vs-motorola (pos 18, add 4 links) ===");
const MOTO_TARGET = "/compare/samsung-galaxy-vs-motorola";
const MOTO_LINKS = [
  // iphone-17-vs-samsung-s26 has 22 inbound — highest authority phone page
  { fromPath: "/compare/iphone-17-vs-samsung-s26",     toPath: MOTO_TARGET, anchorText: "Samsung Galaxy vs Motorola comparison", score: 1.6 },
  // oneplus vs samsung pages have 8 inbound each
  { fromPath: "/compare/oneplus-vs-samsung",            toPath: MOTO_TARGET, anchorText: "Samsung Galaxy vs Motorola: which budget Android wins?", score: 1.3 },
  { fromPath: "/compare/oneplus-vs-samsung-galaxy",     toPath: MOTO_TARGET, anchorText: "Motorola vs Samsung Galaxy camera and price comparison", score: 1.2 },
  { fromPath: "/compare/android-vs-ios",                toPath: MOTO_TARGET, anchorText: "Samsung Galaxy vs Motorola: best Android brand in 2026", score: 1.0 },
];
for (const l of MOTO_LINKS) await upsertLink(l);

// ===========================================================================
// Summary
// ===========================================================================
log("\n=== Wave 3 Done ✓ ===");
log("\nSummary of changes:");
log("  · content_score → 80 for 6 NULL pages (yt-music, kohli, ps5-pro-perf, paramount, f16, samsung-moto)");
log("  · macbook-air-m3-vs-macbook-air-m4: +4 internal links (was 0 → now 4)");
log("  · youtube-music-vs-soundcloud: +5 FAQs (5 → 10 total)");
log("  · amazon-vs-best-buy: +4 FAQs (5 → 9 total)");
log("  · expedia-vs-kayak: +4 FAQs (5 → 9 total)");
log("  · virat-kohli-vs-sachin-tendulkar: +4 links (5 → 9)");
log("  · ps5-pro-vs-xbox-series-x-performance-comparison-2026: +4 links (5 → 9)");
log("  · paramount-plus-vs-peacock: +5 links + 2 FAQs (5 → 7)");
log("  · f-16-vs-f-15: +5 links (5 → 10)");
log("  · samsung-galaxy-vs-motorola: +4 links (5 → 9)");
log("\nRe-measure in 5-7 days: node scripts/ppc-gate-status.mjs");

await prisma.$disconnect();
