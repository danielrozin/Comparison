/**
 * DAN-1435: On-page content upgrade — /compare/bose-vs-jbl
 *
 * Adds: soundbar sub-section, earbuds sub-section, 3-way comparison with Marshall
 * (as keyDifferences), new attributes for product categories, and 4 new FAQs.
 *
 * Run with:
 *   npx tsx scripts/update-dan1435-bose-vs-jbl.ts
 *
 * Idempotent — saveComparison uses prisma.comparison.upsert.
 */

import { saveComparison } from "../src/lib/services/comparison-service";
import { getPrisma } from "../src/lib/db/prisma";
import type { ComparisonPageData } from "../src/types";

const SLUG = "bose-vs-jbl";
const DATE_MODIFIED = "2026-06-26T10:00:00Z";
const DATE_PUBLISHED = "2026-04-26T07:01:47.777Z"; // frozen — first publish

const ENTITY_A_ID = "jbl";   // pos=0
const ENTITY_B_ID = "bose";  // pos=1

const comparison: ComparisonPageData = {
  id: SLUG,
  slug: SLUG,
  title: "JBL vs Bose 2026: Sound Quality, Soundbars, Earbuds & Price Compared",
  shortAnswer:
    "JBL and Bose are two of the biggest names in audio, but they target different buyers. JBL is the bass-first, budget-forward brand — the JBL Charge 5 ($149), Flip 6 ($129), and Boombox 3 ($449) dominate the outdoor speaker market. Bose is the balanced-sound, premium-ANC brand — the Bose SoundLink Max ($399), QuietComfort Earbuds II ($199), and Smart Soundbar 900 ($899) appeal to audiophiles and commuters.\n\n**Soundbars:** Bose dominates the premium soundbar segment. The Bose Smart Soundbar 900 ($899) with Dolby Atmos and spatial audio is considered one of the best soundbars under $1,000. JBL's Bar 800 ($499) offers competitive 5.1.2-channel sound at a lower price. For soundbars under $500, JBL wins on value; above $700, Bose wins on audio refinement.\n\n**Earbuds:** The Bose QuietComfort Earbuds II have the best ANC of any true wireless earbuds in their class. JBL Live Pro 2 ($149) offers solid ANC at a fraction of Bose's $199. If ANC is your priority, Bose earbuds are worth the premium. For budget-conscious buyers or pure bass, JBL wins.\n\n**vs Marshall:** Marshall splits the difference — more personality than Bose, more guitar-friendly EQ than JBL, mid-range pricing ($99–$299). Marshall is best for rock/blues listeners who want vintage aesthetics; JBL for bass-heavy EDM/hip-hop; Bose for acoustic/classical/commuting.",
  verdict:
    "JBL dominates the budget and bass-focused segment with diverse options like the Charge 5, Flip 6, and Go 4, making it ideal for casual listeners and outdoor enthusiasts. Bose commands the premium market with superior sound balance, industry-leading noise cancellation, and refined engineering, appealing to audiophiles and professionals.\n\n**Soundbars verdict:** Bose Smart Soundbar 900 is the better soundbar for home theater audio quality; JBL Bar 800 is better value under $500. **Earbuds verdict:** Bose QuietComfort Earbuds II lead on ANC; JBL Live Pro 2 leads on value. **3-way with Marshall:** JBL for bass/outdoors, Bose for refinement/ANC, Marshall for aesthetics/guitar EQ.\n\nChoose JBL for value and bass; choose Bose for quality and features.",
  category: "products",
  entities: [
    {
      id: ENTITY_A_ID,
      slug: ENTITY_A_ID,
      name: "JBL",
      shortDesc: "Versatile Bluetooth speakers balancing powerful bass, rugged durability, and extended battery life for active users.",
      imageUrl: undefined,
      entityType: "product",
      position: 0,
      pros: [
        "Exceptional bass quality and dynamic sound",
        "Affordable pricing across product lines ($50–$500)",
        "Wide range from compact (Go 4) to powerful (Boombox 3)",
        "Good waterproofing for outdoor use (IP67)",
        "Latest Bluetooth 6.0 on select models",
        "JBL Bar 800 soundbar delivers 5.1.2-channel Dolby Atmos for $499",
        "JBL Live Pro 2 earbuds offer ANC at $149",
        "PartyBoost connects multiple JBL speakers together",
      ],
      cons: [
        "Bass-heavy sound may not suit all preferences",
        "Limited noise cancellation vs Bose in earbuds/headphones",
        "Larger models are bulkier to carry",
        "Call quality not as refined as Bose beamforming mics",
      ],
      bestFor: "Budget-conscious buyers, bass enthusiasts, outdoor adventures, and party speakers",
    },
    {
      id: ENTITY_B_ID,
      slug: ENTITY_B_ID,
      name: "Bose",
      shortDesc: "Premium audio brand known for balanced sound and advanced noise cancellation.",
      imageUrl: undefined,
      entityType: "product",
      position: 1,
      pros: [
        "Perfectly balanced sound at all listening levels",
        "Best-in-class Active Noise Cancellation in earbuds and headphones",
        "Bose Smart Soundbar 900: Dolby Atmos + spatial audio, widely regarded as best-in-class under $1,000",
        "Compact, lightweight, portable designs",
        "Superior call clarity with beamforming dual microphones",
        "Premium build quality and materials",
        "Smart features and app integration (Bose Music app)",
      ],
      cons: [
        "Higher price point ($200–$900 range)",
        "Limited budget options — entry point ~$199",
        "Smaller product portfolio than JBL",
        "May lack bass appeal for some listeners",
        "No PartyBoost-equivalent for chaining speakers",
      ],
      bestFor: "Audiophiles, professionals, commuters, noise-sensitive environments, and home theater soundbars",
    },
  ],
  keyDifferences: [
    {
      label: "Sound Profile",
      winner: "b",
      entityAValue: "Bass-heavy, dynamic — ideal for EDM, hip-hop, outdoor",
      entityBValue: "Balanced, refined — ideal for acoustic, classical, commuting",
    },
    {
      label: "Price Range",
      winner: "a",
      entityAValue: "$50–$500 (Go 4 to Boombox 3)",
      entityBValue: "$199–$899 (earbuds to Smart Soundbar 900)",
    },
    {
      label: "Noise Cancellation (Earbuds)",
      winner: "b",
      entityAValue: "JBL Live Pro 2: good ANC at $149",
      entityBValue: "Bose QuietComfort Earbuds II: best-in-class ANC at $199",
    },
    {
      label: "Best Soundbar",
      winner: "b",
      entityAValue: "JBL Bar 800: 5.1.2-ch Dolby Atmos, $499 — best value soundbar",
      entityBValue: "Bose Smart Soundbar 900: Dolby Atmos + spatial audio, $899 — best quality",
    },
    {
      label: "Best Earbuds",
      winner: "b",
      entityAValue: "JBL Live Pro 2: ANC, 10h battery, $149",
      entityBValue: "Bose QuietComfort Earbuds II: best ANC, 6h battery, $199",
    },
    {
      label: "Bass Performance",
      winner: "a",
      entityAValue: "Strong — punchy, emphasized low-end across all products",
      entityBValue: "Balanced — bass present but not dominant",
    },
    {
      label: "vs Marshall (3-way)",
      winner: "tie",
      entityAValue: "JBL: best for EDM/hip-hop bass, outdoor, budget",
      entityBValue: "Bose: best ANC, home audio, and balanced sound; Marshall: best for rock/guitar EQ, vintage aesthetics ($99–$299)",
    },
    {
      label: "Product Variety",
      winner: "a",
      entityAValue: "Extensive: Go, Clip, Flip, Charge, Xtreme, Boombox + soundbars + earbuds + headphones",
      entityBValue: "Focused: SoundLink series, Smart Soundbars, QC earbuds/headphones",
    },
    {
      label: "Call Quality",
      winner: "b",
      entityAValue: "Standard microphones",
      entityBValue: "Beamforming dual mics — superior in noisy environments",
    },
    {
      label: "Durability / Waterproofing",
      winner: "tie",
      entityAValue: "IP67 waterproof on flagship models (Charge 5, Flip 6)",
      entityBValue: "IP55–IP67 on select models (SoundLink Flex: IP67)",
    },
    {
      label: "Battery Life (Portable Speakers)",
      winner: "a",
      entityAValue: "Charge 5: 20 hrs; Boombox 3: 24 hrs",
      entityBValue: "SoundLink Max: 20 hrs; SoundLink Flex: 12 hrs",
    },
    {
      label: "Ownership",
      winner: "tie",
      entityAValue: "Subsidiary of Samsung Electronics (acquired 2005)",
      entityBValue: "Privately held — Bose Corporation (Amar Bose founded 1964)",
    },
  ],
  attributes: [
    {
      id: "price-entry",
      slug: "price-entry",
      name: "Entry Price",
      unit: "USD",
      category: "pricing",
      dataType: "number",
      higherIsBetter: false,
      values: [
        { entityId: ENTITY_A_ID, valueNumber: 50, valueText: "From $50 (JBL Go 4)", valueBoolean: null, winner: true },
        { entityId: ENTITY_B_ID, valueNumber: 199, valueText: "From $199 (SoundLink Flex)", valueBoolean: null },
      ],
    },
    {
      id: "price-premium",
      slug: "price-premium",
      name: "Premium / Flagship Price",
      unit: "USD",
      category: "pricing",
      dataType: "number",
      higherIsBetter: false,
      values: [
        { entityId: ENTITY_A_ID, valueNumber: 499, valueText: "Up to $499 (Boombox 3)", valueBoolean: null, winner: true },
        { entityId: ENTITY_B_ID, valueNumber: 899, valueText: "Up to $899 (Smart Soundbar 900)", valueBoolean: null },
      ],
    },
    {
      id: "best-soundbar",
      slug: "best-soundbar",
      name: "Best Soundbar",
      unit: null,
      category: "soundbars",
      dataType: "text",
      higherIsBetter: null,
      values: [
        { entityId: ENTITY_A_ID, valueText: "JBL Bar 800 — 5.1.2 Dolby Atmos, $499", valueNumber: null, valueBoolean: null },
        { entityId: ENTITY_B_ID, valueText: "Bose Smart Soundbar 900 — Dolby Atmos + spatial audio, $899", valueNumber: null, valueBoolean: null },
      ],
    },
    {
      id: "best-earbuds",
      slug: "best-earbuds",
      name: "Best Earbuds",
      unit: null,
      category: "earbuds",
      dataType: "text",
      higherIsBetter: null,
      values: [
        { entityId: ENTITY_A_ID, valueText: "JBL Live Pro 2 — ANC, 10h, $149", valueNumber: null, valueBoolean: null },
        { entityId: ENTITY_B_ID, valueText: "Bose QuietComfort Earbuds II — best ANC, 6h, $199", valueNumber: null, valueBoolean: null },
      ],
    },
    {
      id: "best-portable-speaker",
      slug: "best-portable-speaker",
      name: "Best Portable Speaker",
      unit: null,
      category: "speakers",
      dataType: "text",
      higherIsBetter: null,
      values: [
        { entityId: ENTITY_A_ID, valueText: "JBL Charge 5 — $149, 20hr battery, IP67", valueNumber: null, valueBoolean: null },
        { entityId: ENTITY_B_ID, valueText: "Bose SoundLink Flex — $149, 12hr, IP67", valueNumber: null, valueBoolean: null },
      ],
    },
    {
      id: "noise-cancellation",
      slug: "noise-cancellation",
      name: "Noise Cancellation (ANC)",
      unit: null,
      category: "features",
      dataType: "text",
      higherIsBetter: null,
      values: [
        { entityId: ENTITY_A_ID, valueText: "Available on select earbuds/headphones (Live Pro 2, Tune 760)", valueNumber: null, valueBoolean: null },
        { entityId: ENTITY_B_ID, valueText: "Industry-leading ANC on earbuds (QC Earbuds II) and headphones", valueNumber: null, valueBoolean: null },
      ],
    },
    {
      id: "battery-flagship",
      slug: "battery-flagship",
      name: "Battery Life (Flagship Speaker)",
      unit: "hours",
      category: "battery",
      dataType: "number",
      higherIsBetter: true,
      values: [
        { entityId: ENTITY_A_ID, valueNumber: 24, valueText: "Boombox 3: 24 hours", valueBoolean: null, winner: true },
        { entityId: ENTITY_B_ID, valueNumber: 20, valueText: "SoundLink Max: 20 hours", valueBoolean: null },
      ],
    },
    {
      id: "ownership-parent",
      slug: "ownership-parent",
      name: "Parent Company",
      unit: null,
      category: "brand",
      dataType: "text",
      higherIsBetter: null,
      values: [
        { entityId: ENTITY_A_ID, valueText: "Samsung Electronics (subsidiary since 2005)", valueNumber: null, valueBoolean: null },
        { entityId: ENTITY_B_ID, valueText: "Privately held — Bose Corporation (founded 1964)", valueNumber: null, valueBoolean: null },
      ],
    },
  ],
  faqs: [
    // Existing FAQs preserved
    {
      question: "Which brand has better bass quality?",
      answer:
        "JBL is renowned for superior bass quality with dynamic, punchy output ideal for music genres like hip-hop and electronic. The JBL Charge 5 and Boombox 3 are particularly well-regarded for outdoor bass. Bose offers balanced bass that integrates well with mids and highs — preferred by audiophiles seeking overall clarity rather than emphasized low-end.",
    },
    {
      question: "Is Bose worth the premium price in 2026?",
      answer:
        "Yes, for specific use cases. Bose's premium pricing reflects advanced noise cancellation (best-in-class on the QuietComfort Earbuds II), refined acoustics (Smart Soundbar 900 is widely considered a top soundbar under $1,000), superior build quality, and smart features. It's worth it for professionals, commuters, and audiophiles. JBL remains better value for casual listeners and outdoor use.",
    },
    {
      question: "Which is better for outdoor activities?",
      answer:
        "JBL edges ahead with broader portability options (Go 4 at $50, Flip 6 at $129, Clip 4 at $79) and rugged IP67 designs built for camping and travel. JBL's PartyBoost feature lets you connect multiple speakers. Bose SoundLink Flex (IP67, $149) offers premium compact outdoor sound but at higher prices and without multi-speaker linking.",
    },
    {
      question: "Do Bose speakers have noise cancellation?",
      answer:
        "Bose headphones and earbuds (like the QuietComfort Earbuds II and QuietComfort 45 headphones) feature the best Active Noise Cancellation in their class. Bose passive portable speakers (SoundLink series) do not have ANC — ANC is only relevant for headphones and earbuds. Most JBL portable speaker models also lack ANC; it's available in JBL's earbuds and headphones (Live Pro 2, Tune 760) at a lower price than Bose.",
    },
    {
      question: "What's the best budget option in 2026?",
      answer:
        "JBL Go 4 ($50–80) offers excellent value for portability and sound quality. JBL Flip 6 ($130–150) provides better audio quality and waterproofing for the next tier. Bose's entry point starts around $149–199, making JBL the budget leader by a significant margin.",
    },
    // New FAQs from DAN-1435
    {
      question: "Is JBL owned by Bose?",
      answer:
        "No — JBL and Bose are completely separate companies and direct competitors. JBL is owned by Samsung Electronics, which acquired Harman International (JBL's parent company) in 2017. Bose Corporation is privately held, founded by Amar Bose in 1964, and has never been acquired. The two brands compete across portable speakers, soundbars, earbuds, and headphones.",
    },
    {
      question: "Which is better for bass — JBL or Bose?",
      answer:
        "JBL is better for bass. JBL speakers use a bass-first sound signature with dedicated woofers and passive radiators that emphasize low frequencies — the Charge 5, Flip 6, and Boombox 3 are particularly well-regarded for their punchy, powerful bass response. Bose takes a more balanced approach: bass is present and controlled, but not dominant. If deep, impactful bass is your priority (EDM, hip-hop, rap), JBL wins clearly. If you want bass that blends accurately with mids and highs, Bose is more refined.",
    },
    {
      question: "Why is Bose more expensive than JBL?",
      answer:
        "Bose charges a premium for three main reasons: (1) advanced ANC technology — Bose's noise cancellation R&D is industry-leading and built into nearly every product, (2) acoustic engineering — Bose's balanced sound profile requires more precise driver tuning and materials, and (3) brand positioning — Bose deliberately targets the premium segment (similar to Apple vs Android). JBL (owned by Samsung/Harman) leverages large-scale manufacturing to offer more units at lower prices. The price difference doesn't mean Bose sounds better for every listener — many prefer JBL's bass-heavy output — but Bose's ANC and soundbar quality genuinely justify the premium for the right buyer.",
    },
    {
      question: "Which lasts longer — JBL or Bose?",
      answer:
        "JBL speakers generally have better battery life. The JBL Boombox 3 lasts up to 24 hours; the JBL Charge 5 lasts 20 hours. Bose SoundLink Max lasts 20 hours; Bose SoundLink Flex lasts 12 hours. For earbuds, JBL Live Pro 2 offers 10 hours per charge vs Bose QuietComfort Earbuds II's 6 hours (though the Bose case provides more total charge cycles). Both brands use similarly durable build materials — Bose tends to use premium plastics and textiles, JBL uses more ruggedized housing. Neither brand has a clear durability advantage long-term; both typically last 3–5 years with normal use.",
    },
  ],
  relatedComparisons: [
    { slug: "bose-vs-sony", title: "Bose vs Sony", category: "products" },
    { slug: "jbl-vs-sony", title: "JBL vs Sony", category: "products" },
    { slug: "bose-vs-marshall", title: "Bose vs Marshall", category: "products" },
  ],
  relatedBlogPosts: [],
  metadata: {
    metaTitle: "JBL vs Bose 2026: Soundbars, Earbuds, Bass & Price Compared",
    metaDescription:
      "JBL vs Bose in 2026: who wins on soundbars, earbuds, bass, and price? JBL starts at $50, Bose at $199. See the full breakdown including Marshall 3-way comparison.",
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
