/**
 * Phase 2 Programmatic SEO — Fill underserved categories + high-value patterns
 * Run: npx tsx scripts/gen-phase2-programmatic.ts
 * Optional: npx tsx scripts/gen-phase2-programmatic.ts --category health --limit 10
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

interface Target {
  entityA: string;
  entityB: string;
  category: string;
  entityType: string;
}

// ── Health & Wellness (currently 8, target 30+) ──
const HEALTH: Target[] = [
  { entityA: "Ibuprofen", entityB: "Acetaminophen", category: "health", entityType: "medication" },
  { entityA: "Invisalign", entityB: "Braces", category: "health", entityType: "dental" },
  { entityA: "LASIK", entityB: "PRK", category: "health", entityType: "surgery" },
  { entityA: "Whey Protein", entityB: "Casein Protein", category: "health", entityType: "supplement" },
  { entityA: "Creatine", entityB: "Pre-Workout", category: "health", entityType: "supplement" },
  { entityA: "Peloton", entityB: "NordicTrack", category: "health", entityType: "fitness" },
  { entityA: "CrossFit", entityB: "Gym Training", category: "health", entityType: "fitness" },
  { entityA: "Meditation", entityB: "Yoga", category: "health", entityType: "wellness" },
  { entityA: "Organic Food", entityB: "Non-Organic Food", category: "health", entityType: "food" },
  { entityA: "Contact Lenses", entityB: "Glasses", category: "health", entityType: "vision" },
  { entityA: "Flu Shot", entityB: "COVID Vaccine", category: "health", entityType: "vaccine" },
  { entityA: "Physical Therapy", entityB: "Chiropractic", category: "health", entityType: "treatment" },
  { entityA: "Intermittent Fasting", entityB: "Calorie Counting", category: "health", entityType: "diet" },
  { entityA: "CBD", entityB: "THC", category: "health", entityType: "supplement" },
  { entityA: "Treadmill", entityB: "Elliptical", category: "health", entityType: "fitness" },
  { entityA: "Whole Milk", entityB: "Skim Milk", category: "health", entityType: "food" },
  { entityA: "Benadryl", entityB: "Zyrtec", category: "health", entityType: "medication" },
  { entityA: "Melatonin", entityB: "Ambien", category: "health", entityType: "sleep" },
  { entityA: "Therapy", entityB: "Medication", category: "health", entityType: "mental-health" },
  { entityA: "Sauna", entityB: "Cold Plunge", category: "health", entityType: "wellness" },
];

// ── Finance (currently 4, target 20+) ──
const FINANCE: Target[] = [
  { entityA: "Roth IRA", entityB: "Traditional IRA", category: "finance", entityType: "investment" },
  { entityA: "401k", entityB: "IRA", category: "finance", entityType: "retirement" },
  { entityA: "Stocks", entityB: "Bonds", category: "finance", entityType: "investment" },
  { entityA: "ETF", entityB: "Mutual Fund", category: "finance", entityType: "investment" },
  { entityA: "Index Fund", entityB: "Active Fund", category: "finance", entityType: "investment" },
  { entityA: "Term Life Insurance", entityB: "Whole Life Insurance", category: "finance", entityType: "insurance" },
  { entityA: "Credit Card", entityB: "Debit Card", category: "finance", entityType: "banking" },
  { entityA: "Checking Account", entityB: "Savings Account", category: "finance", entityType: "banking" },
  { entityA: "Fixed Rate Mortgage", entityB: "Adjustable Rate Mortgage", category: "finance", entityType: "mortgage" },
  { entityA: "Schwab", entityB: "Vanguard", category: "finance", entityType: "brokerage" },
  { entityA: "PayPal", entityB: "Venmo", category: "finance", entityType: "payment" },
  { entityA: "Cash App", entityB: "Zelle", category: "finance", entityType: "payment" },
  { entityA: "Bitcoin", entityB: "Gold", category: "finance", entityType: "asset" },
  { entityA: "S&P 500", entityB: "Total Stock Market", category: "finance", entityType: "index" },
  { entityA: "HYSA", entityB: "CD", category: "finance", entityType: "savings" },
];

// ── Entertainment (currently 4, target 20+) ──
const ENTERTAINMENT: Target[] = [
  { entityA: "Netflix", entityB: "Hulu", category: "entertainment", entityType: "streaming" },
  { entityA: "HBO Max", entityB: "Netflix", category: "entertainment", entityType: "streaming" },
  { entityA: "YouTube Premium", entityB: "Spotify Premium", category: "entertainment", entityType: "streaming" },
  { entityA: "Apple Music", entityB: "Spotify", category: "entertainment", entityType: "music" },
  { entityA: "Tidal", entityB: "Spotify", category: "entertainment", entityType: "music" },
  { entityA: "Kindle", entityB: "Physical Books", category: "entertainment", entityType: "reading" },
  { entityA: "Audible", entityB: "Libby", category: "entertainment", entityType: "audiobook" },
  { entityA: "Disney Plus", entityB: "Paramount Plus", category: "entertainment", entityType: "streaming" },
  { entityA: "Peacock", entityB: "Hulu", category: "entertainment", entityType: "streaming" },
  { entityA: "PlayStation Plus", entityB: "Xbox Game Pass", category: "entertainment", entityType: "gaming" },
  { entityA: "Crunchyroll", entityB: "Funimation", category: "entertainment", entityType: "anime" },
  { entityA: "IMAX", entityB: "Dolby Cinema", category: "entertainment", entityType: "cinema" },
  { entityA: "Podcasts", entityB: "Audiobooks", category: "entertainment", entityType: "audio" },
  { entityA: "Reddit", entityB: "Twitter", category: "entertainment", entityType: "social-media" },
  { entityA: "TikTok", entityB: "Instagram Reels", category: "entertainment", entityType: "social-media" },
];

// ── Education (currently 5, target 20+) ──
const EDUCATION: Target[] = [
  { entityA: "MIT", entityB: "Stanford", category: "education", entityType: "university" },
  { entityA: "Online Degree", entityB: "Traditional Degree", category: "education", entityType: "degree" },
  { entityA: "Community College", entityB: "University", category: "education", entityType: "institution" },
  { entityA: "Coursera", entityB: "Udemy", category: "education", entityType: "platform" },
  { entityA: "Khan Academy", entityB: "Brilliant", category: "education", entityType: "platform" },
  { entityA: "PhD", entityB: "Masters Degree", category: "education", entityType: "degree" },
  { entityA: "SAT", entityB: "ACT", category: "education", entityType: "test" },
  { entityA: "GRE", entityB: "GMAT", category: "education", entityType: "test" },
  { entityA: "Ivy League", entityB: "State School", category: "education", entityType: "institution" },
  { entityA: "Software Engineer", entityB: "Data Scientist", category: "education", entityType: "career" },
  { entityA: "Doctor", entityB: "Lawyer", category: "education", entityType: "career" },
  { entityA: "Bootcamp", entityB: "CS Degree", category: "education", entityType: "education" },
  { entityA: "Duolingo", entityB: "Rosetta Stone", category: "education", entityType: "language" },
  { entityA: "Public School", entityB: "Private School", category: "education", entityType: "school" },
  { entityA: "Homeschool", entityB: "Public School", category: "education", entityType: "school" },
];

// ── Travel (currently 1, target 15+) ──
const TRAVEL: Target[] = [
  { entityA: "Airbnb", entityB: "Hotel", category: "travel", entityType: "accommodation" },
  { entityA: "Booking.com", entityB: "Expedia", category: "travel", entityType: "platform" },
  { entityA: "Economy Class", entityB: "Business Class", category: "travel", entityType: "flight" },
  { entityA: "Bali", entityB: "Thailand", category: "travel", entityType: "destination" },
  { entityA: "Cancun", entityB: "Hawaii", category: "travel", entityType: "destination" },
  { entityA: "Cruise", entityB: "All-Inclusive Resort", category: "travel", entityType: "vacation" },
  { entityA: "Road Trip", entityB: "Flying", category: "travel", entityType: "transport" },
  { entityA: "TSA PreCheck", entityB: "Global Entry", category: "travel", entityType: "program" },
  { entityA: "Uber", entityB: "Lyft", category: "travel", entityType: "rideshare" },
  { entityA: "Japan", entityB: "South Korea", category: "travel", entityType: "destination" },
  { entityA: "Europe", entityB: "Southeast Asia", category: "travel", entityType: "destination" },
  { entityA: "Backpacking", entityB: "Luxury Travel", category: "travel", entityType: "style" },
  { entityA: "Southwest Airlines", entityB: "Delta Airlines", category: "travel", entityType: "airline" },
  { entityA: "American Airlines", entityB: "United Airlines", category: "travel", entityType: "airline" },
  { entityA: "Paris", entityB: "Rome", category: "travel", entityType: "destination" },
];

// ── Military (currently 3, target 10+) ──
const MILITARY: Target[] = [
  { entityA: "US Navy", entityB: "US Army", category: "military", entityType: "branch" },
  { entityA: "Marines", entityB: "Army", category: "military", entityType: "branch" },
  { entityA: "Air Force", entityB: "Navy", category: "military", entityType: "branch" },
  { entityA: "F-35", entityB: "F-22", category: "military", entityType: "aircraft" },
  { entityA: "NATO", entityB: "BRICS", category: "military", entityType: "alliance" },
  { entityA: "US Military", entityB: "Russia Military", category: "military", entityType: "military" },
  { entityA: "India Military", entityB: "Pakistan Military", category: "military", entityType: "military" },
  { entityA: "Aircraft Carrier", entityB: "Submarine", category: "military", entityType: "vessel" },
  { entityA: "National Guard", entityB: "Active Duty", category: "military", entityType: "service" },
  { entityA: "Officer", entityB: "Enlisted", category: "military", entityType: "rank" },
];

// ── Automotive (currently 9, target 20+) ──
const AUTOMOTIVE: Target[] = [
  { entityA: "Tesla Model 3", entityB: "Tesla Model Y", category: "automotive", entityType: "car" },
  { entityA: "Toyota Camry", entityB: "Honda Accord", category: "automotive", entityType: "car" },
  { entityA: "Toyota RAV4", entityB: "Honda CR-V", category: "automotive", entityType: "suv" },
  { entityA: "Ford F-150", entityB: "Chevrolet Silverado", category: "automotive", entityType: "truck" },
  { entityA: "BMW", entityB: "Mercedes-Benz", category: "automotive", entityType: "brand" },
  { entityA: "Audi", entityB: "BMW", category: "automotive", entityType: "brand" },
  { entityA: "Electric Car", entityB: "Hybrid Car", category: "automotive", entityType: "type" },
  { entityA: "SUV", entityB: "Sedan", category: "automotive", entityType: "type" },
  { entityA: "AWD", entityB: "4WD", category: "automotive", entityType: "drivetrain" },
  { entityA: "Mazda CX-5", entityB: "Toyota RAV4", category: "automotive", entityType: "suv" },
  { entityA: "Porsche 911", entityB: "Corvette", category: "automotive", entityType: "sports-car" },
];

const ALL_TARGETS: Record<string, Target[]> = {
  health: HEALTH,
  finance: FINANCE,
  entertainment: ENTERTAINMENT,
  education: EDUCATION,
  travel: TRAVEL,
  military: MILITARY,
  automotive: AUTOMOTIVE,
};

function makeSlug(a: string, b: string): string {
  const sa = a.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "").replace(/^-/, "");
  const sb = b.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "").replace(/^-/, "");
  return `${sa}-vs-${sb}`;
}

async function tavilySearch(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return "";
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, query, max_results: 3 }),
    });
    if (!res.ok) return "";
    const data: any = await res.json();
    return (data.results || []).map((r: any) => `- ${r.content?.slice(0, 300)} (${r.url})`).join("\n");
  } catch { return ""; }
}

async function generateOne(target: Target): Promise<boolean> {
  const { entityA, entityB, category, entityType } = target;
  const slug = makeSlug(entityA, entityB);
  const reverseSlug = makeSlug(entityB, entityA);

  const existing = await prisma.comparison.findFirst({
    where: { OR: [{ slug }, { slug: reverseSlug }] },
  });
  if (existing) {
    console.log(`  ⏭ Already exists: ${existing.slug}`);
    return true;
  }

  const [compData, aData, bData] = await Promise.all([
    tavilySearch(`${entityA} vs ${entityB} comparison 2026`),
    tavilySearch(`${entityA} ${entityType} latest info 2026`),
    tavilySearch(`${entityB} ${entityType} latest info 2026`),
  ]);
  const enrichment = [compData, aData, bData].filter(Boolean).join("\n");

  const prompt = `You are a comparison data expert. Generate a structured comparison between "${entityA}" and "${entityB}" in the "${category}" category.

Return ONLY valid JSON (no markdown, no code blocks) with this structure:
{
  "title": "${entityA} vs ${entityB}",
  "shortAnswer": "2-3 sentence factual summary answering which is better and why",
  "keyDifferences": [{"label": "Attribute Name", "entityAValue": "val", "entityBValue": "val", "winner": "a"/"b"/"tie"}],
  "verdict": "2-3 sentence balanced conclusion with 'choose X if...' recommendations",
  "category": "${category}",
  "entities": [
    {"name": "${entityA}", "shortDesc": "One-liner", "entityType": "${entityType}", "pros": ["p1","p2","p3"], "cons": ["c1","c2"], "bestFor": "Who should choose"},
    {"name": "${entityB}", "shortDesc": "One-liner", "entityType": "${entityType}", "pros": ["p1","p2","p3"], "cons": ["c1","c2"], "bestFor": "Who should choose"}
  ],
  "attributes": [
    {"name": "Attr", "unit": "unit/null", "category": "Group", "dataType": "number/text", "higherIsBetter": true/false/null, "entityAValue": "val", "entityANumber": num/null, "entityBValue": "val", "entityBNumber": num/null, "winner": "a"/"b"/"tie"/null}
  ],
  "faqs": [{"question": "?", "answer": "..."}],
  "metaTitle": "SEO title <60 chars with 2026",
  "metaDescription": "SEO desc <155 chars"
}

Include: 6-8 key differences, 8-12 attributes, 4-6 FAQs, 3-5 pros / 2-3 cons per entity. Be factual and current for 2026.

${enrichment ? `\nReal-world data:\n${enrichment}` : ""}`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = (message.content[0] as any).text || "";
  let jsonText = text.trim();
  const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonText = jsonMatch[1].trim();

  let data: any;
  try { data = JSON.parse(jsonText); } catch { console.error(`  ✗ JSON parse failed`); return false; }

  const entityASlug = entityA.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "").replace(/^-/, "");
  const entityBSlug = entityB.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "").replace(/^-/, "");

  const dbEntityType = await prisma.entityType.upsert({
    where: { slug: entityType },
    create: { slug: entityType, name: entityType.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) },
    update: {},
  });

  const entA = await prisma.entity.upsert({
    where: { slug: entityASlug },
    create: { slug: entityASlug, name: data.entities?.[0]?.name || entityA, shortDesc: data.entities?.[0]?.shortDesc || null, entityTypeId: dbEntityType.id },
    update: { shortDesc: data.entities?.[0]?.shortDesc || undefined },
  });
  const entB = await prisma.entity.upsert({
    where: { slug: entityBSlug },
    create: { slug: entityBSlug, name: data.entities?.[1]?.name || entityB, shortDesc: data.entities?.[1]?.shortDesc || null, entityTypeId: dbEntityType.id },
    update: { shortDesc: data.entities?.[1]?.shortDesc || undefined },
  });

  const comparison = await prisma.comparison.upsert({
    where: { slug },
    create: {
      slug, title: data.title || `${entityA} vs ${entityB}`,
      shortAnswer: data.shortAnswer || null, keyDifferences: data.keyDifferences || [],
      verdict: data.verdict || null, category,
      metaTitle: data.metaTitle, metaDescription: data.metaDescription,
      status: "published", isAutoGenerated: true, publishedAt: new Date(),
    },
    update: {
      title: data.title, shortAnswer: data.shortAnswer,
      keyDifferences: data.keyDifferences, verdict: data.verdict,
      category, metaTitle: data.metaTitle, metaDescription: data.metaDescription,
      status: "published", publishedAt: new Date(),
    },
  });

  await prisma.comparisonEntity.deleteMany({ where: { comparisonId: comparison.id } });
  await prisma.comparisonEntity.createMany({ data: [
    { comparisonId: comparison.id, entityId: entA.id, position: 0, pros: data.entities?.[0]?.pros || [], cons: data.entities?.[0]?.cons || [], bestFor: data.entities?.[0]?.bestFor || null },
    { comparisonId: comparison.id, entityId: entB.id, position: 1, pros: data.entities?.[1]?.pros || [], cons: data.entities?.[1]?.cons || [], bestFor: data.entities?.[1]?.bestFor || null },
  ]});

  await prisma.fAQ.deleteMany({ where: { comparisonId: comparison.id } });
  for (const faq of data.faqs || []) {
    await prisma.fAQ.create({ data: { question: faq.question, answer: faq.answer, comparisonId: comparison.id } });
  }

  for (const attr of data.attributes || []) {
    try {
      const attrSlug = (attr.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "") || `attr-${Date.now()}`;
      let dbAttr = await prisma.attribute.findFirst({ where: { slug: attrSlug, entityTypeId: dbEntityType.id } });
      if (!dbAttr) {
        dbAttr = await prisma.attribute.create({ data: {
          slug: attrSlug, name: attr.name || attrSlug, unit: attr.unit || null,
          dataType: attr.dataType || "text", category: attr.category || null,
          higherIsBetter: typeof attr.higherIsBetter === "boolean" ? attr.higherIsBetter : null,
          entityTypeId: dbEntityType.id,
        }});
      }
      await prisma.attributeValue.deleteMany({ where: { entityId: entA.id, attributeId: dbAttr.id } });
      await prisma.attributeValue.create({ data: { entityId: entA.id, attributeId: dbAttr.id, valueText: attr.entityAValue ? String(attr.entityAValue) : null, valueNumber: typeof attr.entityANumber === "number" ? attr.entityANumber : null } });
      await prisma.attributeValue.deleteMany({ where: { entityId: entB.id, attributeId: dbAttr.id } });
      await prisma.attributeValue.create({ data: { entityId: entB.id, attributeId: dbAttr.id, valueText: attr.entityBValue ? String(attr.entityBValue) : null, valueNumber: typeof attr.entityBNumber === "number" ? attr.entityBNumber : null } });
    } catch { /* skip */ }
  }

  return true;
}

async function main() {
  const args = process.argv.slice(2);
  const categoryFilter = args.includes("--category") ? args[args.indexOf("--category") + 1] : null;
  const limitArg = args.includes("--limit") ? parseInt(args[args.indexOf("--limit") + 1]) : null;

  let targets: Target[] = [];
  if (categoryFilter && ALL_TARGETS[categoryFilter]) {
    targets = ALL_TARGETS[categoryFilter];
    console.log(`Category: ${categoryFilter} (${targets.length} targets)`);
  } else {
    for (const [cat, t] of Object.entries(ALL_TARGETS)) {
      targets.push(...t);
    }
    console.log(`All categories: ${targets.length} targets across ${Object.keys(ALL_TARGETS).length} categories`);
  }

  if (limitArg) {
    targets = targets.slice(0, limitArg);
    console.log(`Limited to: ${limitArg}`);
  }

  console.log(`\nPhase 2 Programmatic Generation — ${targets.length} comparisons\n`);
  const stats = { success: 0, skipped: 0, failed: 0 };

  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];
    console.log(`[${i + 1}/${targets.length}] ${t.entityA} vs ${t.entityB} (${t.category})`);
    const start = Date.now();
    try {
      const ok = await generateOne(t);
      const elapsed = (Date.now() - start) / 1000;
      if (ok) {
        if (elapsed < 1) stats.skipped++; else stats.success++;
        console.log(`  ✓ ${elapsed.toFixed(1)}s`);
      } else {
        console.log(`  ✗ Failed ${elapsed.toFixed(1)}s`);
        stats.failed++;
      }
    } catch (err: any) {
      console.log(`  ✗ Error: ${err.message?.slice(0, 100)}`);
      stats.failed++;
    }
    if (i < targets.length - 1) await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n--- Results ---`);
  console.log(`Generated: ${stats.success}`);
  console.log(`Skipped (existing): ${stats.skipped}`);
  console.log(`Failed: ${stats.failed}`);
  console.log(`Total: ${targets.length}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
