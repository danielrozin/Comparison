import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

/**
 * GET /api/cron/dan2160-wave3
 *
 * DAN-2160 Wave 3 — Idempotent replay for the 9 untouched striking-distance pages.
 * DB changes were first applied 2026-07-15 via node scripts/dan2160-wave3-untouched-pages.mjs.
 *
 * Pages targeted:
 *   - youtube-music-vs-soundcloud (pos 11): NULL→80 content_score, +5 FAQs
 *   - macbook-air-m3-vs-macbook-air-m4 (pos 13): 0→7 inbound links (critical fix)
 *   - amazon-vs-best-buy (pos 18): +4 FAQs
 *   - expedia-vs-kayak (pos 16): +4 FAQs
 *   - virat-kohli-vs-sachin-tendulkar (pos 15): NULL→80 content_score, +3 links
 *   - ps5-pro-vs-xbox-series-x-performance-comparison-2026 (pos 20): NULL→80, +2 links
 *   - paramount-plus-vs-peacock (pos 20): NULL→80, +3 links, +2 FAQs
 *   - f-16-vs-f-15 (pos 18): NULL→80 content_score, +2 links
 *   - samsung-galaxy-vs-motorola (pos 18): NULL→80 content_score, +3 links
 */

const NULL_SCORE_PAGES = [
  "youtube-music-vs-soundcloud",
  "virat-kohli-vs-sachin-tendulkar",
  "ps5-pro-vs-xbox-series-x-performance-comparison-2026",
  "paramount-plus-vs-peacock",
  "f-16-vs-f-15",
  "samsung-galaxy-vs-motorola",
];

const LINK_ADDITIONS: Array<{ fromSlug: string; toPath: string; anchorText: string; score?: number }> = [
  // macbook-air-m3 (was 0 inbound — critical fix)
  { fromSlug: "macbook-air-vs-macbook-pro", toPath: "/compare/macbook-air-m3-vs-macbook-air-m4", anchorText: "MacBook Air M3 vs MacBook Air M4 comparison", score: 1.6 },
  { fromSlug: "apple-m3-vs-apple-m4", toPath: "/compare/macbook-air-m3-vs-macbook-air-m4", anchorText: "MacBook Air M4 vs MacBook Air M3 real-world performance", score: 1.3 },
  { fromSlug: "m3-chip-vs-m4-chip", toPath: "/compare/macbook-air-m3-vs-macbook-air-m4", anchorText: "MacBook Air M3 vs MacBook Air M4 comparison", score: 1.5 },
  { fromSlug: "macbook-air-vs-surface-laptop", toPath: "/compare/macbook-air-m3-vs-macbook-air-m4", anchorText: "MacBook Air M3 vs M4: which chip should you choose?", score: 1.3 },
  { fromSlug: "macbook-air-vs-pro", toPath: "/compare/macbook-air-m3-vs-macbook-air-m4", anchorText: "MacBook Air M3 vs MacBook Air M4: is it worth upgrading?", score: 1.3 },
  { fromSlug: "macbook-vs-surface", toPath: "/compare/macbook-air-m3-vs-macbook-air-m4", anchorText: "MacBook Air M4 vs MacBook Air M3 full comparison", score: 1.1 },
  { fromSlug: "macbook-pro-14-vs-16-inch", toPath: "/compare/macbook-air-m3-vs-macbook-air-m4", anchorText: "Should you buy the MacBook Air M3 or upgrade to M4?", score: 1.0 },
  // virat-kohli (pos 15)
  { fromSlug: "messi-vs-ronaldo", toPath: "/compare/virat-kohli-vs-sachin-tendulkar", anchorText: "Virat Kohli vs Sachin Tendulkar — cricket GOAT debate", score: 1.3 },
  { fromSlug: "messi-vs-maradona", toPath: "/compare/virat-kohli-vs-sachin-tendulkar", anchorText: "Kohli vs Tendulkar: comparing cricket legends across eras", score: 1.2 },
  { fromSlug: "ronaldo-vs-neymar", toPath: "/compare/virat-kohli-vs-sachin-tendulkar", anchorText: "Is Kohli better than Tendulkar? Career comparison", score: 1.0 },
  // ps5-pro (pos 20)
  { fromSlug: "ps5-pro-vs-xbox-series-x", toPath: "/compare/ps5-pro-vs-xbox-series-x-performance-comparison-2026", anchorText: "PS5 Pro vs Xbox Series X: detailed performance benchmarks", score: 1.3 },
  { fromSlug: "android-vs-ios", toPath: "/compare/ps5-pro-vs-xbox-series-x-performance-comparison-2026", anchorText: "PS5 Pro vs Xbox Series X: which console wins in 2026?", score: 0.9 },
  // paramount-plus-vs-peacock (pos 20)
  { fromSlug: "hulu-vs-peacock", toPath: "/compare/paramount-plus-vs-peacock", anchorText: "Paramount Plus vs Peacock: which streaming service wins?", score: 1.3 },
  { fromSlug: "disney-plus-vs-paramount-plus", toPath: "/compare/paramount-plus-vs-peacock", anchorText: "Is Paramount Plus or Peacock better?", score: 1.1 },
  { fromSlug: "netflix-vs-max", toPath: "/compare/paramount-plus-vs-peacock", anchorText: "Peacock vs Paramount+ streaming showdown 2026", score: 1.0 },
  // f-16-vs-f-15 (pos 18)
  { fromSlug: "f-35-vs-f-22", toPath: "/compare/f-16-vs-f-15", anchorText: "F-16 vs F-15: performance, cost and mission comparison", score: 1.2 },
  { fromSlug: "air-force-vs-navy", toPath: "/compare/f-16-vs-f-15", anchorText: "F-15 vs F-16: air superiority fighter comparison", score: 1.1 },
  // samsung-galaxy-vs-motorola (pos 18)
  { fromSlug: "iphone-17-vs-samsung-s26", toPath: "/compare/samsung-galaxy-vs-motorola", anchorText: "Samsung Galaxy vs Motorola comparison", score: 1.6 },
  { fromSlug: "oneplus-vs-samsung", toPath: "/compare/samsung-galaxy-vs-motorola", anchorText: "Samsung Galaxy vs Motorola: which budget Android wins?", score: 1.3 },
  { fromSlug: "oneplus-vs-samsung-galaxy", toPath: "/compare/samsung-galaxy-vs-motorola", anchorText: "Motorola vs Samsung Galaxy camera and price comparison", score: 1.2 },
];

const FAQ_ADDITIONS: Array<{
  comparisonSlug: string;
  faqs: Array<{ question: string; answer: string; sortOrder: number }>;
}> = [
  {
    comparisonSlug: "youtube-music-vs-soundcloud",
    faqs: [
      { question: "Is SoundCloud or YouTube Music cheaper?", answer: "SoundCloud Go+ costs $9.99/month ($4.99/month for students), while YouTube Music Premium costs $10.99/month ($5.49 for students). Both have free ad-supported tiers. SoundCloud's free tier is more generous — it allows full desktop streaming; YouTube Music's free tier restricts background playback on mobile. Annual plans: SoundCloud Go+ at ~$99/year vs YouTube Music Premium at $109/year. SoundCloud wins on price.", sortOrder: 10 },
      { question: "Which has better audio quality: SoundCloud or YouTube Music?", answer: "YouTube Music streams at up to 256 kbps AAC (Premium) or 128 kbps (free), with lossless audio not available. SoundCloud streams at up to 256 kbps MP3 (Go+) or 128 kbps (free). In practice, audio quality is similar between platforms at their highest tiers. Neither offers lossless (unlike Tidal or Apple Music). YouTube Music's edge is consistency: its audio bitrate is stable across devices. SoundCloud's quality varies by upload — some user-uploaded tracks are lower quality.", sortOrder: 11 },
      { question: "Can I listen to SoundCloud or YouTube Music offline?", answer: "Both platforms require a paid subscription for offline listening. YouTube Music Premium allows offline downloads on mobile for up to 500 songs. SoundCloud Go+ allows offline listening on iOS and Android (up to 500 tracks per playlist). Neither free tier supports offline playback. Verdict: offline feature is equivalent on both paid tiers.", sortOrder: 12 },
      { question: "Which is better for indie and underground music: SoundCloud or YouTube Music?", answer: "SoundCloud is significantly better for indie and underground music. Its 350+ million track catalog includes DJ mixes, demos, unreleased tracks, and self-distributed releases that major streaming platforms don't have. Many emerging artists debut exclusively on SoundCloud before signing to labels. YouTube Music's 100M track catalog focuses on major-label releases and officially licensed content. If discovering new artists before they go mainstream is your priority, SoundCloud has no rival.", sortOrder: 13 },
      { question: "Is SoundCloud still relevant in 2026?", answer: "Yes. SoundCloud remains the go-to platform for electronic music, hip-hop mixtapes, DJ sets, and emerging artists who self-distribute. In 2025–2026, SoundCloud launched Premiere monetization, allowing creators to earn per-stream without a label. It has 40+ million creators and 350+ million tracks — categories that grow every year. While Spotify and YouTube Music lead in mainstream catalog, SoundCloud's niche dominance in independent and underground music keeps it highly relevant.", sortOrder: 14 },
    ],
  },
  {
    comparisonSlug: "amazon-vs-best-buy",
    faqs: [
      { question: "Can you return Amazon items to Best Buy?", answer: "No — Amazon and Best Buy are separate retailers and do not share return infrastructure. Amazon items must be returned via Amazon's own return network (UPS drop-off, Whole Foods, Amazon Hub Locker, or by mail). Best Buy only accepts returns of items purchased from Best Buy stores or BestBuy.com. The one exception: if you bought an Amazon device (Echo, Kindle, Fire TV) through Best Buy, you can return it to Best Buy under Best Buy's standard 15-day return window.", sortOrder: 10 },
      { question: "Is Best Buy or Amazon better for same-day electronics pickup?", answer: "Best Buy is better for same-day pickup. Best Buy's 1,000+ US stores offer same-day in-store pickup on most in-stock items — often within 1 hour. Amazon's same-day delivery exists in select metro areas but requires a Prime membership and isn't universally available. For urgent electronics purchases (cables, adapters, a last-minute gaming accessory), Best Buy's physical store advantage is unmatched.", sortOrder: 11 },
      { question: "Which is cheaper for gaming hardware — Amazon or Best Buy?", answer: "Prices for consoles, GPUs, and gaming peripherals are generally equal between Amazon and Best Buy — both follow manufacturer suggested retail pricing (MSRP). Best Buy's advantage: its price-match guarantee and physical availability let you pick up a console the day it releases. Amazon's advantage: frequently offers third-party sellers with competitive pricing on accessories. During Black Friday/Cyber Monday, the two retailers match each other's deals closely.", sortOrder: 12 },
      { question: "Is Best Buy's Geek Squad worth it vs Amazon tech support?", answer: "Best Buy's Geek Squad offers in-person tech support, installation services, and in-home appointments — something Amazon cannot match. Geek Squad Protection plans cover accidental damage and extend warranties, starting at ~$6.99/month. Amazon's equivalent is the Amazon Protection Plan (for Amazon-purchased devices) and its live chat support for Amazon devices only. For general electronics repair, setup, or troubleshooting services, Geek Squad is the clear winner.", sortOrder: 13 },
    ],
  },
  {
    comparisonSlug: "expedia-vs-kayak",
    faqs: [
      { question: "Does Expedia or Kayak charge booking fees?", answer: "Kayak does NOT charge booking fees — it redirects you to the airline, hotel, or car rental provider's own site to book. Any fees are set by those third parties, not Kayak. Expedia charges no booking fee on most hotel reservations, but some flights and packages include a service fee ($7–$35) depending on the booking type. For the lowest total cost, compare prices on Kayak (which aggregates without marking up) and then book directly with the airline or hotel.", sortOrder: 10 },
      { question: "Is Expedia or Kayak better for booking hotels?", answer: "Expedia is better for booking hotels directly. Expedia has negotiated rates with 1M+ hotels, loyalty points via One Key rewards, and bundled hotel+flight discounts. Kayak is better for comparing hotel prices — it aggregates rates from Expedia, Booking.com, Hotels.com, and direct hotel sites in one search. Strategy: search on Kayak to find the lowest price, then book directly on Expedia or the hotel's own site if Expedia's rate is competitive.", sortOrder: 11 },
      { question: "Is Expedia or Kayak better for international flights?", answer: "For international flights, Kayak's search breadth is its strength: it compares prices across 700+ booking sites simultaneously, including budget international carriers that Expedia doesn't always surface. Expedia's strength is its all-in-one booking with bundled pricing for international packages (flight + hotel). Important: for international travel, always check if the price shown on Kayak includes all taxes and fees — Kayak sometimes shows base fares that look cheaper until fees are added.", sortOrder: 12 },
      { question: "Which travel site is more reliable when something goes wrong — Expedia or Kayak?", answer: "Expedia is significantly more reliable when problems arise. Because Expedia is the actual booking platform, its customer service can directly modify reservations, issue refunds, and intervene with airlines/hotels. Kayak's customer support is limited — since Kayak only redirects to other booking sites, problems must be resolved with whichever site you booked through. If your flight is cancelled or a hotel overbooks, having booked through Expedia (or any OTA) gives you one point of contact.", sortOrder: 13 },
    ],
  },
  {
    comparisonSlug: "paramount-plus-vs-peacock",
    faqs: [
      { question: "Is Paramount Plus and Peacock the same service?", answer: "No — Paramount Plus and Peacock are completely separate streaming services owned by different companies. Paramount+ is owned by Paramount Global (CBS, MTV, Nickelodeon, Comedy Central). Peacock is owned by NBCUniversal (NBC, USA Network, Bravo, E!). They do not share content libraries, pricing, or ownership. The confusion is understandable because both are mid-tier streamers competing in the same price range ($7.99–$13.99/month), but subscribing to one gives you no access to the other's content.", sortOrder: 10 },
      { question: "Can I get Paramount Plus and Peacock bundled together?", answer: "There is no official Paramount+ and Peacock bundle as of 2026. However, each has its own bundle deal: Paramount+ is bundled with Showtime ($13.99/month together), and Walmart+ subscribers get Paramount+ Essential at no extra cost. Peacock is included free with certain Xfinity, Cox, and Sky TV plans. If you want both, you must subscribe separately — combined cost is $15.98/month at the base tier ($7.99 each).", sortOrder: 11 },
    ],
  },
];

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { getPrisma } = await import("@/lib/db/prisma");
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "No database connection" }, { status: 503 });
  }

  const results: string[] = [];
  let contentScoresFixed = 0;
  let linksAdded = 0;
  let faqsAdded = 0;

  // 1. Fix NULL content_scores
  for (const slug of NULL_SCORE_PAGES) {
    const row = await prisma.comparison.findUnique({ where: { slug }, select: { id: true, contentScore: true } });
    if (!row) { results.push(`! not found: ${slug}`); continue; }
    if (row.contentScore === 80) { results.push(`= already 80: ${slug}`); continue; }
    await prisma.comparison.update({ where: { slug }, data: { contentScore: 80 } });
    contentScoresFixed++;
    results.push(`✓ content_score→80: ${slug}`);
  }

  // 2. Internal links
  for (const { fromSlug, toPath, anchorText, score } of LINK_ADDITIONS) {
    const fromPath = `/compare/${fromSlug}`;
    const existing = await prisma.internalLink.findFirst({ where: { fromPath, toPath } });
    if (existing) { results.push(`= link exists: ${fromPath} → ${toPath}`); continue; }
    const fromComp = await prisma.comparison.findFirst({ where: { slug: fromSlug, status: "published" }, select: { id: true } });
    if (!fromComp) { results.push(`· source missing: ${fromPath}`); continue; }
    await prisma.internalLink.create({ data: { fromPath, toPath, anchorText, linkType: "related", position: "inline", score: score ?? 1.0 } });
    linksAdded++;
    results.push(`✓ link: ${fromPath} → ${toPath}`);
  }

  // 3. FAQs
  for (const { comparisonSlug, faqs } of FAQ_ADDITIONS) {
    const comparison = await prisma.comparison.findUnique({ where: { slug: comparisonSlug }, select: { id: true } });
    if (!comparison) { results.push(`! comparison not found: ${comparisonSlug}`); continue; }
    const existingFaqs = await prisma.fAQ.findMany({ where: { comparisonId: comparison.id }, select: { question: true } });
    const existingQs = new Set(existingFaqs.map((f) => f.question.toLowerCase().trim()));
    for (const faq of faqs) {
      if (existingQs.has(faq.question.toLowerCase().trim())) {
        results.push(`= faq exists: ${comparisonSlug} — ${faq.question.slice(0, 50)}`);
        continue;
      }
      await prisma.fAQ.create({ data: { question: faq.question, answer: faq.answer, comparisonId: comparison.id, sortOrder: faq.sortOrder } });
      faqsAdded++;
      results.push(`✓ faq: ${comparisonSlug} — ${faq.question.slice(0, 50)}`);
    }
  }

  return NextResponse.json({ ok: true, wave: 3, contentScoresFixed, linksAdded, faqsAdded, details: results });
}
