/**
 * Publish: USA vs China vs India GDP 2026 (DAN-1173 / DAN-871 Track B)
 *
 * Replaces the thin auto-generated <DynamicComparison> placeholder at
 * `/compare/usa-vs-china-vs-india-gdp-2026` (HTTP 200 but ~141 words, no real
 * figures, no multi-way @graph — the exact thin-content failure DAN-871/DAN-347
 * P1 rescues) with the CMO-signed-off DAN-871 multi-way draft (doc
 * `multiway-draft`, rev 3 `c841f77f-46e0-4d2f-a416-fa01a4475e1f`, 2,879 words).
 * Content sign-off carries from rev 2 (`#9d2c26b0`); rev 3 is a mechanical route
 * fix only (`/vs/` → `/compare/`, canonical host → `www`).
 *
 * Multi-way (3 entities) — renders via MultiEntityLayout (DAN-387 Phase 1) and
 * emits the multi-way @graph (DAN-841 §1.1 + DAN-874 sign-off):
 *   Article (mainEntity → #comparison) + BreadcrumbList + ItemList
 *   (numberOfItems:3, members USA/China/India as schema.org/Country) + FAQPage (7 Qs).
 *
 * NOTE — NO Product / Offer / SoftwareApplication nodes. Countries are not
 * commercial offerings. This intentionally DIFFERS from the SaaS multi-way pages
 * (spotify/chatgpt/aws) which use 3×SoftwareApplication + Offer. Confirmed by
 * SEO Specialist sign-off via DAN-874 (done, 2026-05-30): schema.org/Country is
 * the correct ItemList member type for the country cluster.
 *
 * Entities: `usa` / `china` / `india` (existing entityType=country rows verified
 * — scripts/dan-871-check-entities.ts). saveComparison upserts entities +
 * entityType by slug, so this reuses the existing rows idempotently.
 *
 * HARD GATES (do NOT run this script outside them):
 *   1. Publish window LOCKED to Week-4 of DAN-860: June 27 – July 5, 2026
 *      (CMO endorsement 2026-05-30; no auto-slide into earlier weeks).
 *   2. 24h pre-publish reverify (CMO >2% rule): re-check IMF WEO (April 2026
 *      update if landed) for USA/China/India nominal, PPP, growth. If any of the
 *      three moved >2% on any metric vs the figures below, ping CML to rev the
 *      body BEFORE publish — do not patch silently. Spot-check World Bank ICP PPP
 *      and RMB/INR FX (>5% move → flag). Then bump DATE_MODIFIED to publish date.
 *
 * Run (inside the window, via the editorial CI lane — prod creds never touch a
 * workspace; DATABASE_URL is a repo Actions secret):
 *   gh workflow run publish-editorial.yml \
 *     -f script=scripts/publish-usa-vs-china-vs-india-gdp-2026.ts
 * Local dry-validate (no DB needed — validate() runs before any write):
 *   npx tsx scripts/publish-usa-vs-china-vs-india-gdp-2026.ts
 *
 * Idempotent — saveComparison upserts; FAQs/attribute values are cleared and
 * rewritten each run. datePublished is frozen on the first publish (DAN-608 §4).
 *
 * Figures: IMF World Economic Outlook (October 2025), World Bank ICP (2024
 * update) PPP factors, OECD Economic Outlook 117 (December 2025). All 2026
 * calendar-year projections; no figure departs >2% from the median of those
 * three sources as of draft date 2026-05-30.
 */

import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { saveComparison } from "../src/lib/services/comparison-service";
import { getPrisma } from "../src/lib/db/prisma";
import type { ComparisonPageData } from "../src/types";

const SLUG = "usa-vs-china-vs-india-gdp-2026";
const SITE = "https://www.aversusb.net";

// Figures locked to IMF WEO Oct-2025 (draft date 2026-05-30). The 24h
// pre-publish reverify step bumps DATE_MODIFIED to the publish date once the
// IMF April-2026 update is checked against the >2% rule.
const DATE_PUBLISHED = new Date().toISOString(); // frozen on first publish only
const DATE_MODIFIED = "2026-05-30T00:00:00Z";

const USA = "usa";
const CHINA = "china";
const INDIA = "india";

const TLDR =
  "There is no single winner — it depends on how you measure. By nominal GDP the order is the United States ($30.3T), China ($19.5T), then a distant India ($4.6T). By purchasing-power-parity GDP the order flips: China is #1 at ~$40.7T, ahead of the US ($30.3T) and India ($17.0T). By per-capita GDP the US is on a different tier entirely — ~$89,400 versus China's $28,800 and India's $11,700 PPP. India is the fastest-growing of the three by a wide margin (6.7% in 2026 vs China's 4.6% and the US's 2.1%) and is on track to pass Japan and Germany in nominal terms this decade — but not China. Aggregate size and individual living standard are not the same story.";

// One text attribute row → one value per entity, in entity order (USA/China/India).
function attr(
  slug: string,
  name: string,
  category: string,
  usa: string,
  china: string,
  india: string,
): ComparisonPageData["attributes"][number] {
  return {
    id: slug,
    slug,
    name,
    unit: null,
    category,
    dataType: "text",
    higherIsBetter: null,
    values: [
      { entityId: USA, valueText: usa, valueNumber: null, valueBoolean: null },
      { entityId: CHINA, valueText: china, valueNumber: null, valueBoolean: null },
      { entityId: INDIA, valueText: india, valueNumber: null, valueBoolean: null },
    ],
  };
}

const comparison: ComparisonPageData = {
  id: SLUG,
  slug: SLUG,
  title:
    "USA vs China vs India GDP 2026: Nominal, PPP, Growth and the Per-Capita Gap",
  shortAnswer: TLDR,
  quickAnswer: {
    tldr: TLDR,
    winnerName: null,
    winnerReason:
      "It depends on the metric: largest nominal economy and highest living standards (USA), largest by purchasing power and real output (China), or fastest growth and long-run upside (India).",
    keyFact:
      "By nominal GDP the US leads ($30.3T vs China $19.5T vs India $4.6T); by PPP GDP China leads (~$40.7T vs US $30.3T vs India $17.0T); by per-capita PPP the US is far ahead (~$89,400 vs $28,800 vs $11,700).",
  },
  verdict:
    "There is no single winner — the right ranking depends on which question you are asking. By nominal GDP (market exchange rates) the United States is still #1 at about $30.3 trillion in 2026, roughly 1.55× China's $19.5 trillion and 6.6× India's $4.6 trillion; this is the right number for defense spending, international debt, and dollar-denominated share-of-global-economy framing. By purchasing-power-parity GDP the order flips: China has been the world's largest economy since 2014 and reaches about $40.7 trillion in 2026 — roughly 34% larger than the US — with India third at ~$17.0 trillion; PPP is the right metric for real output, consumption, and living-standard comparisons. By per-capita GDP the US is on a different tier from either: ~$89,400 versus China's $28,800 and India's $11,700 in PPP terms, so a top-3 aggregate economy can still have a median citizen whose material life resembles a mid-income country. On growth, India leads decisively — 6.7% in 2026 and ~6.5% through 2030, versus China's 4.6% (a long deceleration through its property correction, aging, and trade friction) and the US's 2.1% at trend. India is on track to pass Japan and Germany in nominal terms this decade, but does not pass China nominally before ~2050 on any realistic projection. Anyone who tells you the US is 'still #1' or that China 'already passed the US' is choosing the metric that fits the headline; both are true and neither is the whole story.",
  category: "countries",
  entities: [
    {
      id: USA,
      slug: USA,
      name: "United States",
      shortDesc:
        "The world's largest nominal economy (~$30.3T in 2026) and highest per-capita output, a services-and-IP economy running at trend growth.",
      imageUrl: null,
      entityType: "country",
      position: 1,
      pros: [
        "Largest nominal GDP — ~$30.3T in 2026, about 26% of world output and ~1.55× China",
        "Highest per-capita GDP by a wide margin — ~$89,400 nominal and PPP (PPP = nominal since the international dollar is benchmarked to the US)",
        "At the global frontier in services, finance, software, healthcare, and tradable IP — the world's largest IP exporter",
        "Share of world GDP has held steady (~25% nominal, 15–16% PPP) for two decades despite China's rise",
        "Deep, liquid capital markets and reserve-currency status",
      ],
      cons: [
        "Slowest growth of the three — 2.1% in 2026, ~2.0% through 2030 (running at trend)",
        "No longer the largest by purchasing power — China's $40.7T PPP is ~34% larger",
        "Manufacturing is only ~11% of GDP, well below most peers",
        "The nominal lead over China is partly an exchange-rate story (sensitive to the RMB)",
      ],
      bestFor: "Best for living standards & largest nominal economy",
    },
    {
      id: CHINA,
      slug: CHINA,
      name: "China",
      shortDesc:
        "The world's largest economy by purchasing power (~$40.7T PPP) and largest manufacturer, now decelerating as services catch up.",
      imageUrl: null,
      entityType: "country",
      position: 2,
      pros: [
        "Largest economy by PPP — ~$40.7T in 2026, about 34% larger than the US in real-output terms",
        "World's largest manufacturer — ~29% of global manufacturing value-added, roughly the US and EU combined",
        "Second-largest nominal economy at ~$19.5T, and the largest exporter of physical goods",
        "Per-capita PPP (~$28,800) is more than double its nominal per-capita, reflecting lower local prices",
        "Mid-pace growth (4.6% in 2026) still well above the US, with services compounding faster than industry",
      ],
      cons: [
        "Per-capita nominal GDP (~$13,800) is ~6.5× below the US — a top-3 economy with mid-income median living standards",
        "On a long, slow deceleration — ~3.7% average growth 2026–2030 amid property correction, aging, and trade friction",
        "Headline nominal size swings with the RMB (a 5% move shifts nominal GDP by ~$1T vs the US)",
        "Industrial share (~38%) is gradually shrinking toward saturation; less growth runway than India",
      ],
      bestFor: "Best for real output & consumer-market size (PPP)",
    },
    {
      id: INDIA,
      slug: INDIA,
      name: "India",
      shortDesc:
        "The fastest-growing major economy (6.7% in 2026), 4th-largest nominal and 3rd-largest PPP, services-led with a long agricultural tail.",
      imageUrl: null,
      entityType: "country",
      position: 3,
      pros: [
        "Fastest-growing major economy — 6.7% in 2026 and ~6.5% through 2030, the fastest G20 economy every year since 2022",
        "4th-largest nominal economy (~$4.6T) — passing Germany now, projected to pass Japan in 2027",
        "3rd-largest PPP economy (~$17.0T), already more than half the size of the US in PPP terms",
        "World's largest software-services exporter (TCS, Infosys, Wipro) and IT-BPM hub, with a fast-growing fintech sector",
        "Highest cumulative 5-yr real growth of the three — 39.8% over 2022–2026 — with decades of services-mix upside",
      ],
      cons: [
        "Lowest per-capita GDP — ~$3,200 nominal and ~$11,700 PPP, far below China and the US",
        "16% agriculture share of GDP with ~43% of the labor force still in farming",
        "Smallest of the three in nominal terms — ~6.6× behind the US and ~4.2× behind China",
        "Will not pass China nominally before ~2050 on any realistic projection",
      ],
      bestFor: "Best for fastest growth & long-run upside",
    },
  ],
  // Top differences — N-entity values[] position-indexed to entities[] (USA/China/India).
  keyDifferences: [
    {
      label: "Who is #1 depends on the metric",
      entityAValue: "Largest by nominal GDP (~$30.3T) and per-capita; 2nd by PPP",
      entityBValue: "Largest by PPP GDP (~$40.7T); 2nd by nominal (~$19.5T)",
      values: [
        "Largest by nominal GDP (~$30.3T) and per-capita; 2nd by PPP",
        "Largest by PPP GDP (~$40.7T); 2nd by nominal (~$19.5T)",
        "3rd by both nominal (~$4.6T) and PPP (~$17.0T), but fastest-growing",
      ],
      winnerIndex: "tie",
    },
    {
      label: "Growth trajectory",
      entityAValue: "At trend — 2.1% in 2026, ~2.0% to 2030",
      entityBValue: "Decelerating — 4.6% in 2026, ~3.7% to 2030",
      values: [
        "At trend — 2.1% in 2026, ~2.0% to 2030",
        "Decelerating — 4.6% in 2026, ~3.7% to 2030",
        "Fastest — 6.7% in 2026, ~6.5% to 2030",
      ],
      winnerIndex: 2,
    },
    {
      label: "Per-capita living standard (PPP)",
      entityAValue: "~$89,400 — a different tier from either",
      entityBValue: "~$28,800 — about 3.1× below the US",
      values: [
        "~$89,400 — a different tier from either",
        "~$28,800 — about 3.1× below the US",
        "~$11,700 — about 7.6× below the US",
      ],
      winnerIndex: 0,
    },
  ],
  // Full TL;DR + per-capita + growth + sector tables from the draft → attributes.
  attributes: [
    attr("nominal-gdp", "Nominal GDP (2026, USD)", "Scale", "$30.3T", "$19.5T", "$4.6T"),
    attr("ppp-gdp", "PPP GDP (2026, intl. $)", "Scale", "$30.3T", "$40.7T", "$17.0T"),
    attr("nominal-rank", "Nominal GDP world rank", "Scale", "#1", "#2", "#4"),
    attr("ppp-rank", "PPP GDP world rank", "Scale", "#2", "#1", "#3"),
    attr("real-growth", "Real GDP growth (2026, YoY)", "Growth", "2.1%", "4.6%", "6.7%"),
    attr("growth-2024", "Real GDP growth (2024)", "Growth", "2.8%", "5.0%", "7.0%"),
    attr("growth-2025", "Real GDP growth (2025)", "Growth", "2.4%", "4.7%", "7.0%"),
    attr("growth-2026-2030", "IMF avg growth (2026–2030)", "Growth", "2.0%", "3.7%", "6.5%"),
    attr("cumulative-growth", "Cumulative real GDP growth (2022–2026)", "Growth", "11.2%", "24.4%", "39.8%"),
    attr("proj-2030-nominal", "Projected 2030 nominal GDP", "Growth", "~$32.8T", "~$24.5T", "~$6.4T"),
    attr("population", "Population", "People", "336M", "1.41B", "1.45B"),
    attr("per-capita-nominal", "Per-capita nominal GDP", "People", "$89,400", "$13,800", "$3,200"),
    attr("per-capita-ppp", "Per-capita PPP GDP", "People", "$89,400", "$28,800", "$11,700"),
    attr("services-share", "Services share of GDP", "Composition", "~78%", "~55%", "~53%"),
    attr("industry-share", "Industry share of GDP", "Composition", "~19%", "~38%", "~26%"),
    attr("agriculture-share", "Agriculture share of GDP", "Composition", "~1%", "~7%", "~16%"),
    attr("economy-type", "Economy type", "Composition", "Services-and-IP economy", "World's factory (services rising)", "Services-led, large farm labor share"),
    attr("manufacturing", "Manufacturing scale", "Composition", "2nd-largest by output; largest value-per-worker", "Largest — ~29% of global value-added", "5th-largest globally"),
    attr("global-nominal-share", "Share of world nominal GDP (2026)", "Global", "~26%", "~17%", "~4%"),
    attr("global-ppp-share", "Share of world PPP GDP (2026)", "Global", "~15%", "~21%", "~9%"),
  ],
  // 7 FAQs verbatim from the draft → FAQPage schema (Aug-2023 eligibility caveat
  // applies — kept for schema validity + AI-overview citation, not SERP rich result).
  faqs: [
    {
      question: "Which country has the largest GDP in 2026?",
      answer:
        "By nominal GDP, the United States is the largest at ~$30.3 trillion, ahead of China at ~$19.5 trillion and India at ~$4.6 trillion. By PPP GDP, China is the largest at ~$40.7 trillion, ahead of the US ($30.3T) and India ($17.0T).",
    },
    {
      question: "Is China's economy bigger than the US in 2026?",
      answer:
        "By purchasing power parity, yes — China's $40.7T PPP GDP is about 34% larger than the US's $30.3T. By nominal GDP (market exchange rates), no — the US is about 1.55× larger than China.",
    },
    {
      question: "When will India pass China in GDP?",
      answer:
        "On consensus IMF projections through 2030, India does not pass China in nominal GDP this decade or the next. India would pass China nominally only if both (a) India sustained 7%+ real growth for several decades and (b) China grew below 3%. The realistic catch-up story for the 2020s is India passing Japan and Germany in nominal terms (on track for 2027–2028), not passing China.",
    },
    {
      question: "Why is per-capita GDP so much higher in the US?",
      answer:
        "The US has a small population (~336M) relative to a large economy ($30.3T), giving a per-capita GDP near $89,400. China (1.41B people) and India (1.45B people) divide their GDP across populations roughly 4× the size of the US, which is why per-capita GDP is $13,800 (China) and $3,200 (India) even though both are top-3 economies.",
    },
    {
      question: "What is the fastest-growing major economy?",
      answer:
        "India, by a substantial margin. The IMF projects 6.5–7% real GDP growth for India through 2030, versus 3.7% for China and 2.0% for the US. India has been the fastest-growing G20 economy every year since 2022 and is forecast to remain so through the decade.",
    },
    {
      question: "What share of the world economy do USA, China, and India represent?",
      answer:
        "By nominal GDP, the three combined are about 47% of world output in 2026 — roughly 26% (US), 17% (China), and 4% (India). By PPP GDP, they are about 45% of world output — roughly 15% (US), 21% (China), and 9% (India). Either way, the three account for almost half of global economic activity.",
    },
    {
      question: "Which has the strongest manufacturing sector?",
      answer:
        "China, decisively. China accounts for ~29% of global manufacturing value-added — roughly equal to the US and the entire EU combined. The US is the second-largest manufacturer by absolute output and the largest by value-per-worker, while India ranks 5th globally in manufacturing scale.",
    },
  ],
  relatedComparisons: [
    { slug: "us-vs-china-gdp-comparison-2026", title: "US vs China GDP — 2-way deep dive", category: "countries" },
    { slug: "us-vs-india-gdp", title: "US vs India GDP", category: "countries" },
    { slug: "china-vs-india-gdp", title: "China vs India GDP", category: "countries" },
    { slug: "usa-vs-germany-economy", title: "USA vs Germany Economy", category: "countries" },
    { slug: "us-vs-uk-economy", title: "US Economy vs UK Economy", category: "countries" },
  ],
  relatedBlogPosts: [],
  metadata: {
    metaTitle: "USA vs China vs India GDP 2026: Nominal, PPP & Growth",
    metaDescription:
      "USA vs China vs India GDP compared for 2026 — nominal ($30.3T/$19.5T/$4.6T), PPP, growth, per-capita, and sector mix. See which economy leads by each measure.",
    publishedAt: DATE_PUBLISHED,
    updatedAt: DATE_MODIFIED,
    isAutoGenerated: false,
    isHumanReviewed: true,
    viewCount: 0,
  },
};

// ---------------------------------------------------------------------------
// Multi-way @graph (DAN-841 §1.1 + DAN-874 sign-off):
// Article (mainEntity → #comparison) + ItemList (3× schema.org/Country) +
// BreadcrumbList + FAQPage. NO Product / Offer / SoftwareApplication — countries
// are not commercial offerings.
// ---------------------------------------------------------------------------
const URL = `${SITE}/compare/${SLUG}`;
const ITEM_LIST_ID = `${URL}#comparison`;
const ITEM_A = `${URL}#item-a`; // USA
const ITEM_B = `${URL}#item-b`; // China
const ITEM_C = `${URL}#item-c`; // India

function buildSchemaGraph(datePublished: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: comparison.title,
        description: comparison.shortAnswer,
        url: URL,
        datePublished,
        dateModified: DATE_MODIFIED,
        author: { "@type": "Organization", name: "A Versus B", url: SITE },
        publisher: {
          "@type": "Organization",
          name: "A Versus B",
          url: SITE,
          logo: { "@type": "ImageObject", url: `${SITE}/images/logo.png` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": URL },
        mainEntity: { "@id": ITEM_LIST_ID },
      },
      {
        "@type": "ItemList",
        "@id": ITEM_LIST_ID,
        name: comparison.title,
        description: "Comparison between the United States, China, and India by GDP",
        numberOfItems: 3,
        itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: [
          { "@type": "ListItem", position: 1, item: { "@id": ITEM_A } },
          { "@type": "ListItem", position: 2, item: { "@id": ITEM_B } },
          { "@type": "ListItem", position: 3, item: { "@id": ITEM_C } },
        ],
      },
      {
        "@type": "Country",
        "@id": ITEM_A,
        name: "United States",
        url: `${SITE}/entity/usa`,
        description: comparison.entities[0].shortDesc,
      },
      {
        "@type": "Country",
        "@id": ITEM_B,
        name: "China",
        url: `${SITE}/entity/china`,
        description: comparison.entities[1].shortDesc,
      },
      {
        "@type": "Country",
        "@id": ITEM_C,
        name: "India",
        url: `${SITE}/entity/india`,
        description: comparison.entities[2].shortDesc,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "countries", item: `${SITE}/category/countries` },
          { "@type": "ListItem", position: 3, name: comparison.title, item: URL },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: comparison.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Pre-flight validation (DAN-993/DAN-827 precedent). Runs before any DB write so
// `npx tsx` locally is a safe dry-validate even without DATABASE_URL.
// ---------------------------------------------------------------------------
function validate() {
  const errors: string[] = [];
  if (comparison.entities.length !== 3) errors.push(`expected 3 entities, got ${comparison.entities.length}`);
  if (comparison.faqs.length !== 7) errors.push(`expected 7 FAQs, got ${comparison.faqs.length}`);
  if (comparison.attributes.length < 18) errors.push(`expected ~20 attributes, got ${comparison.attributes.length}`);
  if (comparison.relatedComparisons.length !== 5) errors.push(`expected 5 related comparisons, got ${comparison.relatedComparisons.length}`);
  if (!comparison.metadata.isHumanReviewed) errors.push("isHumanReviewed must be true");
  if (comparison.metadata.isAutoGenerated) errors.push("isAutoGenerated must be false");
  for (const e of comparison.entities) {
    if (e.entityType !== "country") errors.push(`entity ${e.slug} must be entityType=country, got ${e.entityType}`);
  }
  for (const a of comparison.attributes) {
    if (a.values.length !== 3) errors.push(`attribute ${a.slug} must have 3 values, got ${a.values.length}`);
  }
  // Schema invariant: Article + ItemList(3×Country) + BreadcrumbList + FAQPage;
  // explicitly NO SoftwareApplication / Product / Offer.
  const graph = buildSchemaGraph(DATE_PUBLISHED)["@graph"] as Array<Record<string, unknown>>;
  const countries = graph.filter((n) => n["@type"] === "Country");
  if (countries.length !== 3) errors.push(`expected 3 Country nodes, got ${countries.length}`);
  for (const t of ["Article", "ItemList", "FAQPage", "BreadcrumbList"]) {
    if (!graph.some((n) => n["@type"] === t)) errors.push(`schema missing ${t} node`);
  }
  for (const banned of ["SoftwareApplication", "Product", "Offer"]) {
    if (graph.some((n) => n["@type"] === banned || "offers" in n)) {
      errors.push(`schema must NOT contain ${banned} / Offer nodes (countries are not commercial offerings)`);
    }
  }
  const itemList = graph.find((n) => n["@type"] === "ItemList") as { numberOfItems?: number } | undefined;
  if (itemList?.numberOfItems !== 3) errors.push(`ItemList numberOfItems must be 3, got ${itemList?.numberOfItems}`);
  // Canonical hygiene (DAN-1033): clean www + /compare/, no trailing space / double-prepend.
  if (URL !== "https://www.aversusb.net/compare/usa-vs-china-vs-india-gdp-2026") {
    errors.push(`canonical URL malformed: ${URL}`);
  }
  if (errors.length) {
    console.error("VALIDATION FAILED:\n  - " + errors.join("\n  - "));
    process.exit(1);
  }
  console.log("✔ validation passed (3 country entities, 7 FAQs, 20 attributes, Article+ItemList(3×Country)+BreadcrumbList+FAQPage, no Offer)");
}

async function main() {
  console.log(`Publishing multi-way GDP comparison slug="${SLUG}"...`);
  validate();

  const result = await saveComparison(comparison);
  if (!result) {
    console.error("FAIL: saveComparison returned null. Check DATABASE_URL.");
    process.exit(1);
  }
  console.log(`Comparison saved: id=${result.id}`);

  const prisma = getPrisma();
  if (!prisma) {
    console.error("FAIL: no DB connection for schema_markup update.");
    process.exit(1);
  }

  // Freeze datePublished on first publish only (DAN-608 §4).
  const existing = await prisma.comparison.findUnique({
    where: { slug: SLUG },
    select: { publishedAt: true },
  });
  const frozenDatePublished = existing?.publishedAt
    ? existing.publishedAt.toISOString()
    : DATE_PUBLISHED;

  await prisma.comparison.update({
    where: { slug: SLUG },
    data: {
      schemaMarkup: buildSchemaGraph(frozenDatePublished) as object,
      publishedAt: existing?.publishedAt ?? new Date(frozenDatePublished),
    },
  });

  console.log(
    `Schema markup stored (Article + ItemList[3×Country] + BreadcrumbList + FAQPage). ` +
      `datePublished=${frozenDatePublished} dateModified=${DATE_MODIFIED}`,
  );
  console.log(`Live URL (after ISR): ${URL}`);
}

main().catch((err) => {
  console.error("Publish error:", err);
  process.exit(1);
});
