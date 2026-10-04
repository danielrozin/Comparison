/**
 * DAN-1435: On-page content upgrade — /compare/paramount-plus-vs-peacock
 *
 * Adds: tier comparison table (Peacock Free/Premium vs Paramount+ Essential/with Showtime),
 * shows/sports sections, cost comparison with Walmart+ bundle, and 5 new FAQs.
 *
 * Run with:
 *   npx tsx scripts/update-dan1435-paramount-plus-vs-peacock.ts
 *
 * Idempotent — saveComparison uses prisma.comparison.upsert.
 */

import { saveComparison } from "../src/lib/services/comparison-service";
import { getPrisma } from "../src/lib/db/prisma";
import type { ComparisonPageData } from "../src/types";

const SLUG = "paramount-plus-vs-peacock";
const DATE_MODIFIED = "2026-06-26T10:00:00Z";
const DATE_PUBLISHED = "2026-04-25T06:42:25.179Z"; // frozen — first publish

const ENTITY_A_ID = "peacock";       // pos=0
const ENTITY_B_ID = "paramount-plus"; // pos=1

const comparison: ComparisonPageData = {
  id: SLUG,
  slug: SLUG,
  title: "Peacock vs Paramount+: Streaming Comparison 2026",
  shortAnswer:
    "Peacock wins for live sports (NBA, NFL Sunday Night, Olympics) and costs the same as Paramount+ — both start at $7.99/month with ads. Paramount+ wins on movie depth and prestige originals (Yellowstone, Star Trek). For cost-cutters: Walmart+ subscribers get Paramount+ Essential at no extra charge, and Peacock is included with select Xfinity/Cox plans.\n\n**Tier breakdown:** Peacock Free (free, ads, limited content) → Peacock Premium $7.99/month (ads, full library) → Peacock Premium Plus $13.99/month (ad-free). Paramount+ Essential $7.99/month (ads, no live CBS) → Paramount+ with Showtime $13.99/month (ad-free, live CBS, Showtime movies).\n\n**Exclusive shows you can't get anywhere else:** Peacock has The Office, Parks & Rec, WWE, Olympics, and NBA exclusives. Paramount+ has Yellowstone universe (1883, 1923, 6666), Star Trek franchise, Tulsa King, Criminal Minds Evolution, and Halo.",
  verdict:
    "Both platforms are priced identically at $7.99/$13.99 per month, so the choice is purely about content. **Pick Peacock** if you watch live sports — it's the only streamer with NBA exclusives, NFL Sunday Night Football, and Premier League. The vertical video format for mobile sports viewing is a genuine differentiator. **Pick Paramount+** if you want the Yellowstone universe, Star Trek, and a deeper movie library. Walmart+ subscribers should strongly consider Paramount+ Essential since it's already included in their $12.95/month membership, effectively making it free. For most households, neither service replaces Netflix or Disney+ — they're best as a second subscription when the content lineup matches your taste.",
  category: "entertainment",
  entities: [
    {
      id: ENTITY_A_ID,
      slug: ENTITY_A_ID,
      name: "Peacock",
      shortDesc: "NBC Universal's streaming service with premium content, live sports, and originals.",
      imageUrl: undefined,
      entityType: "product",
      position: 0,
      pros: [
        "Exclusive NBA games and Winter Olympics coverage",
        "First to offer vertical video for live sports",
        "Strong NBC library including The Office and Parks and Recreation",
        "Integrated casual gaming features",
        "Growing subscriber base with 46 million paying members",
        "NFL Sunday Night Football and Premier League soccer exclusive",
        "Included free with some Xfinity and Cox cable plans",
      ],
      cons: [
        "Smaller overall content library compared to competitors",
        "Less developed original movie content",
        "No Walmart+ bundle (unlike Paramount+)",
      ],
      bestFor: "Sports fans, NBC content lovers, and viewers wanting live event coverage",
    },
    {
      id: ENTITY_B_ID,
      slug: ENTITY_B_ID,
      name: "Paramount+",
      shortDesc: "CBS/Paramount's streaming service with extensive movie library, Star Trek universe, and Yellowstone spin-offs.",
      imageUrl: undefined,
      entityType: "product",
      position: 1,
      pros: [
        "Massive movie library with premium theatrical releases",
        "Flagship original series like Star Trek and Yellowstone universe (1883, 1923, 6666)",
        "Strong content pipeline with new releases monthly",
        "Included free with Walmart+ membership ($12.95/month)",
        "Showtime movies and shows on top tier",
        "Live CBS sports (NFL, March Madness) on Showtime tier",
      ],
      cons: [
        "Limited live sports programming on Essential tier",
        "Smaller subscriber base than Peacock as of 2026",
        "No NFL Sunday Night Football or NBA exclusives",
      ],
      bestFor: "Movie enthusiasts, premium drama series fans, Walmart+ subscribers, and viewers wanting prestige content",
    },
  ],
  keyDifferences: [
    {
      label: "Live Sports Coverage",
      winner: "a",
      entityAValue: "NBA exclusives, NFL Sunday Night Football, Olympics, Premier League",
      entityBValue: "NFL on CBS (Showtime tier only), March Madness — limited vs Peacock",
    },
    {
      label: "Ad-Supported Tier Price",
      winner: "tie",
      entityAValue: "Peacock Premium: $7.99/month",
      entityBValue: "Paramount+ Essential: $7.99/month",
    },
    {
      label: "Ad-Free Tier Price",
      winner: "tie",
      entityAValue: "Peacock Premium Plus: $13.99/month",
      entityBValue: "Paramount+ with Showtime: $13.99/month",
    },
    {
      label: "Walmart+ Bundle",
      winner: "b",
      entityAValue: "Not included in Walmart+",
      entityBValue: "Paramount+ Essential included free with Walmart+ ($12.95/month)",
    },
    {
      label: "Exclusive Originals",
      winner: "b",
      entityAValue: "The Office, Parks & Rec, Bel-Air, Rutherford Falls",
      entityBValue: "Yellowstone universe, Star Trek franchise, Tulsa King, Halo, 1883",
    },
    {
      label: "Paying Subscribers (2026)",
      winner: "a",
      entityAValue: "46 million",
      entityBValue: "44+ million",
    },
    {
      label: "Movie Library Depth",
      winner: "b",
      entityAValue: "~5,000+ titles (strong in NBC TV)",
      entityBValue: "~7,000+ titles (strong in movies and prestige TV)",
    },
    {
      label: "Vertical Video for Sports",
      winner: "a",
      entityAValue: "Yes — first U.S. streamer to launch mobile vertical sports format",
      entityBValue: "No",
    },
    {
      label: "Free Tier Available",
      winner: "a",
      entityAValue: "Yes — Peacock Free with ads and limited content",
      entityBValue: "No free tier (7-day trial only)",
    },
    {
      label: "Movie Release Strategy",
      winner: "b",
      entityAValue: "Same-day theatrical releases (select titles)",
      entityBValue: "Theatrical window strategy with premium catalog depth",
    },
  ],
  attributes: [
    {
      id: "monthly-price-ads",
      slug: "monthly-price-ads",
      name: "Monthly Price (Ad-Supported)",
      unit: "USD/month",
      category: "pricing",
      dataType: "number",
      higherIsBetter: false,
      values: [
        { entityId: ENTITY_A_ID, valueNumber: 7.99, valueText: "$7.99/month (Peacock Premium)", valueBoolean: null },
        { entityId: ENTITY_B_ID, valueNumber: 7.99, valueText: "$7.99/month (Paramount+ Essential)", valueBoolean: null },
      ],
    },
    {
      id: "monthly-price-no-ads",
      slug: "monthly-price-no-ads",
      name: "Monthly Price (Ad-Free)",
      unit: "USD/month",
      category: "pricing",
      dataType: "number",
      higherIsBetter: false,
      values: [
        { entityId: ENTITY_A_ID, valueNumber: 13.99, valueText: "$13.99/month (Peacock Premium Plus)", valueBoolean: null },
        { entityId: ENTITY_B_ID, valueNumber: 13.99, valueText: "$13.99/month (Paramount+ with Showtime)", valueBoolean: null },
      ],
    },
    {
      id: "free-tier",
      slug: "free-tier",
      name: "Free Tier Available",
      unit: null,
      category: "pricing",
      dataType: "boolean",
      higherIsBetter: true,
      values: [
        { entityId: ENTITY_A_ID, valueBoolean: true, valueText: "Yes — Peacock Free (ads, limited)", valueNumber: null, winner: true },
        { entityId: ENTITY_B_ID, valueBoolean: false, valueText: "No (7-day free trial only)", valueNumber: null },
      ],
    },
    {
      id: "walmart-plus-bundle",
      slug: "walmart-plus-bundle",
      name: "Walmart+ Bundle",
      unit: null,
      category: "pricing",
      dataType: "boolean",
      higherIsBetter: true,
      values: [
        { entityId: ENTITY_A_ID, valueBoolean: false, valueText: "Not included", valueNumber: null },
        { entityId: ENTITY_B_ID, valueBoolean: true, valueText: "Paramount+ Essential included free", valueNumber: null, winner: true },
      ],
    },
    {
      id: "subscribers",
      slug: "subscribers",
      name: "Paying Subscribers (2026)",
      unit: "millions",
      category: "reach",
      dataType: "number",
      higherIsBetter: true,
      values: [
        { entityId: ENTITY_A_ID, valueNumber: 46, valueText: "46 million", valueBoolean: null, winner: true },
        { entityId: ENTITY_B_ID, valueNumber: 44, valueText: "44+ million", valueBoolean: null },
      ],
    },
    {
      id: "content-library-size",
      slug: "content-library-size",
      name: "Content Library Size",
      unit: "titles",
      category: "content",
      dataType: "number",
      higherIsBetter: true,
      values: [
        { entityId: ENTITY_A_ID, valueNumber: 5000, valueText: "~5,000+ titles", valueBoolean: null },
        { entityId: ENTITY_B_ID, valueNumber: 7000, valueText: "~7,000+ titles", valueBoolean: null, winner: true },
      ],
    },
    {
      id: "nba-exclusive",
      slug: "nba-exclusive",
      name: "NBA Exclusive Games",
      unit: null,
      category: "sports",
      dataType: "boolean",
      higherIsBetter: true,
      values: [
        { entityId: ENTITY_A_ID, valueBoolean: true, valueText: "Yes — exclusive NBA streaming rights", valueNumber: null, winner: true },
        { entityId: ENTITY_B_ID, valueBoolean: false, valueText: "No NBA coverage", valueNumber: null },
      ],
    },
    {
      id: "live-nfl",
      slug: "live-nfl",
      name: "Live NFL Coverage",
      unit: null,
      category: "sports",
      dataType: "text",
      higherIsBetter: null,
      values: [
        { entityId: ENTITY_A_ID, valueText: "NFL Sunday Night Football (exclusive)", valueNumber: null, valueBoolean: null },
        { entityId: ENTITY_B_ID, valueText: "NFL on CBS (Showtime tier only)", valueNumber: null, valueBoolean: null },
      ],
    },
  ],
  faqs: [
    // Existing FAQs preserved
    {
      question: "Which streaming service has better live sports?",
      answer:
        "Peacock offers significantly more live sports content, including exclusive NBA games, NFL Sunday Night Football, Premier League soccer, and Olympic coverage. Paramount+ has NFL on CBS (Showtime tier only) and March Madness, but lacks the depth and exclusivity of Peacock's sports portfolio. For sports fans, Peacock is the clear winner.",
    },
    {
      question: "How many subscribers does each service have in 2026?",
      answer:
        "As of early 2026, Peacock has 46 million paying subscribers, while Paramount+ has 44+ million subscribers. Peacock's growth was boosted by NBA exclusives and Winter Olympics coverage, while Paramount+ benefited from Yellowstone spinoffs and the Walmart+ bundle.",
    },
    {
      question: "Which platform has a larger content library?",
      answer:
        "Paramount+ has an extensive library with 7,000+ titles, while Peacock has approximately 5,000+ titles. However, Peacock specializes in premium TV content from NBC (The Office, Parks & Rec), while Paramount+ excels in movies and prestige series like the Yellowstone universe and Star Trek.",
    },
    {
      question: "Are subscription prices the same?",
      answer:
        "Yes, both platforms have identical pricing: $7.99/month for ad-supported plans (Peacock Premium / Paramount+ Essential) and $13.99/month for ad-free options (Peacock Premium Plus / Paramount+ with Showtime). Peacock also has a free tier with ads and limited content. The key differentiator is content, not cost.",
    },
    {
      question: "What makes Peacock's vertical video technology unique?",
      answer:
        "Peacock launched the first vertical video format for live sports in the U.S., providing a mobile-optimized viewing experience for live NBA and NFL games on smartphones. This innovation is not yet available on Paramount+ or other major streamers.",
    },
    // New FAQs from DAN-1435
    {
      question: "Which is cheaper: Peacock or Paramount+?",
      answer:
        "They are identically priced. Both cost $7.99/month with ads and $13.99/month ad-free. However, if you're a Walmart+ member ($12.95/month), you get Paramount+ Essential included at no extra charge — making Paramount+ effectively free. Peacock has a genuinely free tier (Peacock Free) with ads and limited content, so if free access is the goal, Peacock wins.",
    },
    {
      question: "Does Peacock or Paramount+ have better sports?",
      answer:
        "Peacock has substantially better sports coverage. It holds exclusive NBA streaming rights, NFL Sunday Night Football, Premier League soccer, and every Summer and Winter Olympics. Paramount+ carries NFL on CBS (on the Showtime tier) and NCAA March Madness, but the breadth and exclusivity of Peacock's sports lineup is unmatched at this price point.",
    },
    {
      question: "Can you get Peacock and Paramount+ for free with Walmart+?",
      answer:
        "Walmart+ ($12.95/month) includes Paramount+ Essential at no extra cost — that's a genuine freebie. Peacock is not included in Walmart+. Peacock does have a free tier (Peacock Free) that requires no subscription, so technically you can access both without paying extra if you already have Walmart+ and use Peacock's free tier. The free tier has ads and limited content, while Paramount+ Essential via Walmart+ has ads but the full library.",
    },
    {
      question: "Which has more movies: Peacock or Paramount+?",
      answer:
        "Paramount+ has a significantly deeper movie library (~7,000+ titles vs Peacock's ~5,000+), with a strong slate of Paramount theatrical releases, classic Paramount films, and Showtime movies on the top tier. Peacock focuses more on TV content from NBCUniversal's library. For movie lovers, Paramount+ is the better choice.",
    },
    {
      question: "Is Peacock Premium worth it over Paramount+ Essential?",
      answer:
        "It depends entirely on your priorities. Peacock Premium ($7.99/month) is worth it if you watch live sports — NBA, NFL Sunday Night Football, or Olympics — or if you want The Office, Parks & Rec, or other NBC originals. Paramount+ Essential ($7.99/month) is better for movie fans and viewers of Yellowstone, Star Trek, or Tulsa King. Both cost the same, so the answer is: pick the one whose content library you'll actually watch. If you have Walmart+, Paramount+ Essential is included free, making the decision easy.",
    },
  ],
  relatedComparisons: [
    { slug: "netflix-vs-hulu", title: "Netflix vs Hulu", category: "entertainment" },
    { slug: "disney-plus-vs-hbo-max", title: "Disney+ vs HBO Max", category: "entertainment" },
    { slug: "amazon-prime-vs-netflix", title: "Amazon Prime vs Netflix", category: "entertainment" },
  ],
  relatedBlogPosts: [],
  metadata: {
    metaTitle: "Peacock vs Paramount+: Price, Sports & Shows Compared (2026)",
    metaDescription:
      "Peacock vs Paramount+: same price ($7.99/month), different strengths. Peacock wins on live sports (NBA, NFL, Olympics); Paramount+ wins on movies and Yellowstone. See tier breakdown, Walmart+ bundle details, and which is right for you.",
    publishedAt: DATE_PUBLISHED,
    updatedAt: DATE_MODIFIED,
    isAutoGenerated: false,
    isHumanReviewed: true,
    viewCount: 0,
  },
};

async function main() {
  console.log(`Updating comparison slug="${SLUG}"...`);

  const result = await saveComparison(comparison);
  if (!result) {
    console.error("FAIL: saveComparison returned null. Check DATABASE_URL.");
    process.exit(1);
  }

  console.log(`Comparison saved: id=${result.id}`);

  // Freeze datePublished and store schema markup
  const prisma = getPrisma();
  if (!prisma) {
    console.error("FAIL: no DB connection for post-save update.");
    process.exit(1);
  }

  await prisma.comparison.update({
    where: { slug: SLUG },
    data: {
      publishedAt: new Date(DATE_PUBLISHED),
      updatedAt: new Date(DATE_MODIFIED),
    },
  });

  console.log(`Updated publishedAt=${DATE_PUBLISHED}, updatedAt=${DATE_MODIFIED}`);
  console.log(`Live URL: https://aversusb.net/compare/${SLUG}`);
}

main().catch((err) => {
  console.error("Update error:", err);
  process.exit(1);
});
