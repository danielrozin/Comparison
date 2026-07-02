/**
 * DAN-1665 — Tier 1 internal link sprint: kobe-bryant-vs-lebron-james + expedia-vs-kayak
 *
 * Both pages are at pos 16-19, Tier 1 (closest to page 1). Strategy:
 *   1. Add 5+ internal links FROM topically-related /compare/ pages
 *   2. Add targeted FAQ entries (PAA coverage)
 *   3. Publish companion blog post for kobe vs lebron (none exists)
 *
 * Run:
 *   node scripts/dan1665-tier1-internal-links.mjs
 *   node scripts/dan1665-tier1-internal-links.mjs --dry
 *
 * Idempotent: check-before-insert on FAQs; findFirst guard on InternalLink.
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const prisma = new PrismaClient();
const DRY = process.argv.includes("--dry");
const log = (...a) => console.log(...a);

// ---------------------------------------------------------------------------
// Helper: insert FAQ if question not already present (idempotent)
// ---------------------------------------------------------------------------
async function insertFaqIfMissing(comparisonId, { question, answer, sortOrder }) {
  const existing = await prisma.fAQ.findFirst({ where: { comparisonId, question } });
  if (existing) { log(`  skip (exists): "${question}"`); return false; }
  if (!DRY) {
    await prisma.fAQ.create({ data: { comparisonId, question, answer, sortOrder } });
    log(`  ✓ FAQ created: "${question}"`);
  } else {
    log(`  [DRY] would create FAQ: "${question}"`);
  }
  return true;
}

// ---------------------------------------------------------------------------
// Helper: insert internal link if (fromPath → toPath) not already present
// ---------------------------------------------------------------------------
async function insertLinkIfMissing({ fromPath, toPath, anchorText, linkType = "related", position = "inline", score = 1.0 }) {
  const existing = await prisma.internalLink.findFirst({ where: { fromPath, toPath } });
  if (existing) { log(`  skip (exists): ${fromPath} → ${toPath}`); return false; }
  if (!DRY) {
    await prisma.internalLink.create({ data: { fromPath, toPath, anchorText, linkType, position, score } });
    log(`  ✓ Link: ${fromPath} → ${toPath}  anchor="${anchorText}"`);
  } else {
    log(`  [DRY] would link: ${fromPath} → ${toPath}`);
  }
  return true;
}

// ===========================================================================
// SECTION 1: kobe-bryant-vs-lebron-james
// ===========================================================================
log("\n=== 1. kobe-bryant-vs-lebron-james ===");

const KOBE_SLUG = "kobe-bryant-vs-lebron-james";
const KOBE_PATH = `/compare/${KOBE_SLUG}`;

const kobeComp = await prisma.comparison.findUnique({
  where: { slug: KOBE_SLUG },
  select: { id: true, title: true, status: true, faqs: { select: { question: true } } },
});
if (!kobeComp) {
  log("!! MISSING comparison:", KOBE_SLUG);
  await prisma.$disconnect();
  process.exit(1);
}
log(`Found: "${kobeComp.title}" [${kobeComp.status}], ${kobeComp.faqs.length} existing FAQs`);

// ---- 1a. New FAQs (targeting PAA variants not already covered) -----------
// Existing 9 FAQs cover: stats, championships, retirement, playmaking, peak, legacy,
// accolades, statistics, and championships (duplicate phrasing). Adding PAA angles:
// - LeBron broke Kobe's scoring record (Feb 2023 — high-search event)
// - All-Star appearances count
// - MVP award count
const KOBE_FAQS = [
  {
    question: "Did LeBron James break Kobe Bryant's scoring record?",
    answer:
      "Yes. On February 7, 2023, LeBron James surpassed Kobe Bryant's 33,643 career NBA points to become the all-time leading scorer in NBA history — overtaking Kobe's record with a mid-range jumper in the third quarter against the Oklahoma City Thunder. LeBron passed the record in his 20th NBA season. Kareem Abdul-Jabbar previously held the record at 38,387 points, which LeBron also eclipsed in the same 2022–23 season. As of the 2025–26 season, LeBron holds the all-time record with over 40,000 career points.",
    sortOrder: 10,
  },
  {
    question: "Who has more All-Star appearances, Kobe Bryant or LeBron James?",
    answer:
      "LeBron James has more All-Star appearances than Kobe Bryant. LeBron has been selected to 21 NBA All-Star Games (through 2026), while Kobe Bryant was selected 18 times across his 20-season career. Both players rank among the most decorated All-Stars in NBA history. LeBron is the all-time leader in All-Star appearances, while Kobe's 18 selections rank second all-time.",
    sortOrder: 11,
  },
  {
    question: "Who won more MVP awards — Kobe Bryant or LeBron James?",
    answer:
      "LeBron James has won significantly more MVP awards than Kobe Bryant. LeBron has won 4 NBA Most Valuable Player awards (2009, 2010, 2012, 2013), while Kobe Bryant won just 1 MVP award (2008). LeBron also has 4 NBA Finals MVP awards (2012, 2013, 2016, 2020) compared to Kobe's 2 Finals MVPs (2009, 2010). By traditional award metrics, LeBron's MVP résumé is much stronger — a key argument in his favor in the GOAT debate.",
    sortOrder: 12,
  },
];

log(`\n[1a] Adding ${KOBE_FAQS.length} new FAQs to ${KOBE_SLUG}`);
let kobeAddedFaqs = 0;
for (const faq of KOBE_FAQS) {
  const added = await insertFaqIfMissing(kobeComp.id, faq);
  if (added) kobeAddedFaqs++;
}
log(`  ${kobeAddedFaqs} new FAQs added`);

// ---- 1b. Internal links FROM sports/NBA pages TO kobe-bryant-vs-lebron ----
// Targeting: pages with strong sports/athlete topical relevance
const KOBE_INBOUND_LINKS = [
  {
    fromPath: "/compare/lebron-vs-jordan",
    anchorText: "Kobe Bryant vs LeBron James",
    score: 1.5,
  },
  {
    fromPath: "/compare/curry-vs-lebron",
    anchorText: "Kobe vs LeBron comparison",
    score: 1.4,
  },
  {
    fromPath: "/compare/ali-vs-tyson",
    anchorText: "Kobe Bryant vs LeBron James GOAT debate",
    score: 1.1,
  },
  {
    fromPath: "/compare/brady-vs-manning",
    anchorText: "Kobe Bryant vs LeBron James",
    score: 1.1,
  },
  {
    fromPath: "/compare/nfl-vs-nba",
    anchorText: "Kobe vs LeBron",
    score: 1.0,
  },
  {
    fromPath: "/compare/messi-vs-ronaldo",
    anchorText: "Kobe Bryant vs LeBron James stats",
    score: 1.0,
  },
];

log(`\n[1b] Adding ${KOBE_INBOUND_LINKS.length} internal links → ${KOBE_PATH}`);
let kobeAddedLinks = 0;
for (const link of KOBE_INBOUND_LINKS) {
  const added = await insertLinkIfMissing({ ...link, toPath: KOBE_PATH });
  if (added) kobeAddedLinks++;
}
log(`  ${kobeAddedLinks} new internal links added`);

// ===========================================================================
// SECTION 2: expedia-vs-kayak
// ===========================================================================
log("\n=== 2. expedia-vs-kayak ===");

const EXPEDIA_SLUG = "expedia-vs-kayak";
const EXPEDIA_PATH = `/compare/${EXPEDIA_SLUG}`;

const expediaComp = await prisma.comparison.findUnique({
  where: { slug: EXPEDIA_SLUG },
  select: { id: true, title: true, status: true, faqs: { select: { question: true } } },
});
if (!expediaComp) {
  log("!! MISSING comparison:", EXPEDIA_SLUG);
  await prisma.$disconnect();
  process.exit(1);
}
log(`Found: "${expediaComp.title}" [${expediaComp.status}], ${expediaComp.faqs.length} existing FAQs`);

// ---- 2a. New FAQs for expedia-vs-kayak ------------------------------------
// Existing 7 FAQs cover: better for flights, price, mobile apps, booking on Kayak,
// when to book, traffic. Adding: customer service, last-minute deals, hotel deals,
// using both together — extending PAA coverage.
const EXPEDIA_FAQS = [
  {
    question: "Does Expedia or Kayak have better customer service?",
    answer:
      "Expedia generally has better customer service than Kayak because Expedia is an OTA (Online Travel Agency) that processes bookings directly — so when something goes wrong, Expedia's support team can modify or cancel your reservation. Kayak is primarily a metasearch engine that redirects you to third-party airlines or OTAs to complete the booking, which means customer service for changes or cancellations typically falls on those third parties, not Kayak. If you value having a single point of contact for support, Expedia is the safer choice.",
    sortOrder: 8,
  },
  {
    question: "Which is better for last-minute flight deals, Expedia or Kayak?",
    answer:
      "Kayak is generally better for last-minute flight deals because its Explore tool and price-tracking features let you quickly scan multiple airlines and OTAs simultaneously, surfacing the cheapest available options. Expedia shows its own inventory and a limited number of partner deals, which may not cover the full market of last-minute availability. For 24–72 hour bookings, use Kayak to compare broadly, then book directly on the airline's site or via Expedia if Expedia's bundled price is competitive.",
    sortOrder: 9,
  },
  {
    question: "Which finds better hotel deals, Expedia or Kayak?",
    answer:
      "Expedia typically finds better hotel deals than Kayak for package bookings because Expedia negotiates bulk rates with hotels and offers flight + hotel bundles that can save 10–30% compared to booking separately. Kayak compares hotel rates across multiple OTAs (including Expedia, Hotels.com, Booking.com), making it useful for price-checking, but it doesn't offer the same bundled discounts. For standalone hotel nights, compare Kayak's search results against Expedia directly — Expedia's Rewards loyalty discounts often tip the balance in its favor.",
    sortOrder: 10,
  },
];

log(`\n[2a] Adding ${EXPEDIA_FAQS.length} new FAQs to ${EXPEDIA_SLUG}`);
let expediaAddedFaqs = 0;
for (const faq of EXPEDIA_FAQS) {
  const added = await insertFaqIfMissing(expediaComp.id, faq);
  if (added) expediaAddedFaqs++;
}
log(`  ${expediaAddedFaqs} new FAQs added`);

// ---- 2b. Internal links FROM travel pages TO expedia-vs-kayak -------------
// The 5 existing inbound links are all from tech pages (iphone-17, ps5, mac, apple,
// android) — completely off-topic. Adding 6 topically relevant travel sources.
const EXPEDIA_INBOUND_LINKS = [
  {
    fromPath: "/compare/booking-com-vs-expedia",
    anchorText: "Expedia vs Kayak comparison",
    score: 1.5,
  },
  {
    fromPath: "/compare/airbnb-vs-booking",
    anchorText: "Expedia vs Kayak",
    score: 1.3,
  },
  {
    fromPath: "/compare/airbnb-vs-vrbo",
    anchorText: "Expedia vs Kayak for travel search",
    score: 1.2,
  },
  {
    fromPath: "/compare/airbnb-vs-hotel",
    anchorText: "Expedia vs Kayak",
    score: 1.2,
  },
  {
    fromPath: "/compare/delta-vs-united",
    anchorText: "Expedia vs Kayak for flights",
    score: 1.1,
  },
  {
    fromPath: "/compare/economy-class-vs-business-class",
    anchorText: "Expedia vs Kayak price comparison",
    score: 1.0,
  },
];

log(`\n[2b] Adding ${EXPEDIA_INBOUND_LINKS.length} internal links → ${EXPEDIA_PATH}`);
let expediaAddedLinks = 0;
for (const link of EXPEDIA_INBOUND_LINKS) {
  const added = await insertLinkIfMissing({ ...link, toPath: EXPEDIA_PATH });
  if (added) expediaAddedLinks++;
}
log(`  ${expediaAddedLinks} new internal links added`);

// ===========================================================================
// SECTION 3: Blog companion post — Kobe vs LeBron: 5 Stats That Settle the GOAT Debate
// ===========================================================================
log("\n=== 3. Blog companion post: kobe-vs-lebron-5-stats-goat-debate ===");

const BLOG_SLUG = "kobe-vs-lebron-5-stats-goat-debate";
const BLOG_TITLE = "Kobe vs LeBron: 5 Stats That Settle the GOAT Debate";

const blogContent = `# Kobe vs LeBron: 5 Stats That Settle the GOAT Debate

The Kobe Bryant vs LeBron James debate has divided basketball fans for two decades. Kobe disciples point to his killer instinct, 5 rings, and late-game heroics. LeBron loyalists counter with superior volume, longevity, and the February 2023 night he erased Kobe from the all-time scoring record books.

Rather than relitigating highlight reels, these 5 statistics cut through the noise.

## 1. All-Time Scoring: LeBron Passed Kobe in 2023

Kobe Bryant retired in 2016 as the NBA's #3 all-time scorer with 33,643 points — a mark he held for years as a shorthand for offensive greatness.

On February 7, 2023, **LeBron James surpassed Kobe's record** with a mid-range jumper in the third quarter against the Oklahoma City Thunder. LeBron went on to pass Kareem Abdul-Jabbar's 38,387-point mark in the same season, becoming the all-time scoring leader.

| Stat | Kobe Bryant | LeBron James |
|------|------------|-------------|
| Career Points | 33,643 | 40,000+ (active) |
| Points Per Game | 25.0 | 27.1 |
| All-Time Rank | #3 (retired) | #1 (active) |
| Scoring titles | 2 (2006, 2007) | 1 (2008) |

**Verdict:** LeBron wins on volume and efficiency. Kobe won more scoring titles (2 vs 1), suggesting he was the more prolific scorer in his prime era.

## 2. Championships: Kobe's 5 Rings vs LeBron's 4

Ring count is where the Kobe camp draws its sharpest contrast.

| Stat | Kobe Bryant | LeBron James |
|------|------------|-------------|
| NBA Championships | **5** (2000, 01, 02, 09, 10) | **4** (2012, 13, 16, 20) |
| Finals MVP | 2 (2009, 2010) | 4 (2012, 13, 16, 20) |
| Finals Appearances | 7 | 10 |
| Finals Record | 5-2 | 4-6 |

Kobe's 5 rings vs LeBron's 4 is a common argument, but context matters: LeBron's 10 Finals appearances and 4 Finals MVPs across 4 different teams — two of them rebuilding franchises (Cleveland 2016, Miami 2012) — represent a different kind of championship achievement. Kobe won his first 3 rings alongside Shaquille O'Neal.

**Verdict:** Kobe wins on ring count (5 vs 4). LeBron wins on Finals MVP and Finals appearances, and arguably on team context.

## 3. MVP Awards: LeBron 4, Kobe 1

Regular-season MVP voting is the clearest measure of sustained dominance peer-reviewed by the NBA's media and player community.

| Stat | Kobe Bryant | LeBron James |
|------|------------|-------------|
| Regular Season MVPs | **1** (2008) | **4** (2009, 10, 12, 13) |
| All-Star Game MVPs | 4 | 3 |
| All-NBA First Team selections | 11 | 14+ |

Kobe received All-NBA First Team honors 11 times — a testament to his consistent peak. But LeBron's 4 regular-season MVPs are the statistical record of who the basketball world viewed as the best player in the world during their respective eras.

**Verdict:** LeBron wins decisively on MVP hardware (4 vs 1).

## 4. Longevity: LeBron's Age-40 Dominance

The most underrated argument in LeBron's favor isn't a statistic — it's that he's still producing one at 40 years old.

| Stat | Kobe Bryant | LeBron James |
|------|------------|-------------|
| Career seasons | 20 | 22+ (still active) |
| Age of retirement | 37 | Still active at 41 |
| 25+ PPG seasons | 9 | 13 |
| 30+ minute seasons | 15 | 19 |

Kobe's physical decline after his 2013 Achilles tear was steep — he retired at 37 after two injury-shortened seasons. LeBron at 40 is averaging near his career norms, playing 30+ minutes per night. Athletic longevity at this level is unprecedented.

**Verdict:** LeBron wins. This is not close — Kobe's decline post-injury was dramatic; LeBron's longevity has no NBA parallel.

## 5. Playmaking: LeBron Operates at a Different Level

Kobe was a scorer who passed when needed. LeBron is a playmaker who scores at will — the distinction matters.

| Stat | Kobe Bryant | LeBron James |
|------|------------|-------------|
| Career Assists | 6,306 | 11,000+ |
| Assists Per Game | 4.7 | 7.3 |
| Triple-doubles | 21 | 115+ |
| Career Assist Rank | Not top 20 | Top 5 all-time |

LeBron's assist totals put him in rarefied company for a player who also leads in career points. Kobe was a 4.7 APG career assist player — above average for a shooting guard, but not the engine of a team offense. LeBron has orchestrated title-winning offenses from the point guard position for three different franchises.

**Verdict:** LeBron wins significantly on playmaking.

## The Scorecard

| Category | Winner |
|----------|--------|
| All-time scoring | LeBron |
| Championships | Kobe (5 vs 4) |
| Finals MVP | LeBron (4 vs 2) |
| Regular-season MVP | LeBron (4 vs 1) |
| Longevity | LeBron |
| Playmaking | LeBron |
| Scoring title peak | Kobe |

By the statistics that matter most to comprehensive basketball evaluation — efficiency, playoff impact, team value, and longevity — LeBron James edges Kobe Bryant. The ring argument favors Kobe by one, and Kobe's scorer-first identity means he'll always have the peak-performance argument.

But 5 stats, 4 categories favor LeBron. That's the closest the numbers can come to settling it.

## Where Kobe Still Wins

Statistics miss two things:

1. **Cultural impact**: Kobe's influence on international basketball, particularly in Europe and Asia, may have exceeded LeBron's even if LeBron's broader cultural footprint (business, activism) is larger.
2. **Mentality and shot creation**: Kobe's post-up game, isolation skill, and ability to score from anywhere on the floor represented a type of self-generated offense that LeBron, despite his advantages, has never fully replicated.

These aren't statistics. They're the reason the debate is still alive.

## Bottom Line

5 stats, 5 verdicts, and LeBron wins 4 of them. If your criteria is career scoring records, MVP hardware, longevity, and playmaking — the numbers lean LeBron. If your criteria is rings and peak-era efficiency — Kobe's argument holds.

For a full side-by-side statistical breakdown of every major career metric — championships, scoring, assists, efficiency, awards, and legacy — see our complete [Kobe Bryant vs LeBron James comparison](/compare/kobe-bryant-vs-lebron-james).

### Related Comparisons
- [Kobe Bryant vs LeBron James: Full Statistical Comparison](/compare/kobe-bryant-vs-lebron-james)
- [LeBron James vs Michael Jordan: The GOAT Debate](/compare/lebron-vs-jordan)
- [Stephen Curry vs LeBron James](/compare/curry-vs-lebron)
`;

const blogPost = {
  slug: BLOG_SLUG,
  title: BLOG_TITLE,
  excerpt:
    "The Kobe vs LeBron debate has raged for 20 years. These 5 statistics — scoring records, championships, MVP awards, longevity, and playmaking — cut through the noise and give the clearest picture of who wins each category.",
  content: blogContent,
  category: "sports",
  tags: ["kobe bryant", "lebron james", "nba", "goat debate", "basketball stats", "sports comparison"],
  metaTitle: "Kobe vs LeBron: 5 Stats That Settle the GOAT Debate (2026)",
  metaDescription:
    "Kobe Bryant vs LeBron James by the numbers: scoring records, rings, MVP awards, longevity, and assists. 5 stats, 5 verdicts — which legend wins each category?",
  relatedComparisonSlugs: ["kobe-bryant-vs-lebron-james", "lebron-vs-jordan", "curry-vs-lebron"],
};

const existingBlog = await prisma.blogArticle.findUnique({ where: { slug: BLOG_SLUG } });
if (existingBlog) {
  log(`Blog post already exists: /blog/${BLOG_SLUG} — skipping`);
} else if (!DRY) {
  await prisma.blogArticle.create({
    data: {
      ...blogPost,
      status: "published",
      isAutoGenerated: false,
      publishedAt: new Date(),
    },
  });
  log(`✓ Blog post published: /blog/${BLOG_SLUG}`);
} else {
  log(`[DRY] would publish blog post: /blog/${BLOG_SLUG}`);
}

// ---------------------------------------------------------------------------
// Final state verification
// ---------------------------------------------------------------------------
log("\n=== FINAL STATE ===");

const kobeState = await prisma.comparison.findUnique({
  where: { slug: KOBE_SLUG },
  select: { faqs: { select: { question: true }, orderBy: { sortOrder: "asc" } } },
});
const kobeLinks = await prisma.internalLink.findMany({ where: { toPath: KOBE_PATH }, select: { fromPath: true } });
log(`${KOBE_SLUG}: ${kobeState?.faqs?.length ?? 0} FAQs, ${kobeLinks.length} inbound internal links`);

const expediaState = await prisma.comparison.findUnique({
  where: { slug: EXPEDIA_SLUG },
  select: { faqs: { select: { question: true }, orderBy: { sortOrder: "asc" } } },
});
const expediaLinks = await prisma.internalLink.findMany({ where: { toPath: EXPEDIA_PATH }, select: { fromPath: true } });
log(`${EXPEDIA_SLUG}: ${expediaState?.faqs?.length ?? 0} FAQs, ${expediaLinks.length} inbound internal links`);

const blog = await prisma.blogArticle.findUnique({ where: { slug: BLOG_SLUG }, select: { status: true } });
log(`Blog /blog/${BLOG_SLUG}: ${blog?.status ?? "NOT FOUND"}`);

await prisma.$disconnect();
log(`\nDone ✓${DRY ? " (DRY RUN — no changes written)" : ""}`);
