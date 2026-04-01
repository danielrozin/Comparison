/**
 * Phase 1 Batch Generation — Top 100 High-Volume Comparisons
 * Generates comparisons from SCALING-PLAN.md Phase 1 across all categories.
 * Run: npx tsx scripts/gen-phase1-batch.ts
 * Optional: npx tsx scripts/gen-phase1-batch.ts --category sports --limit 5
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

interface ComparisonTarget {
  entityA: string;
  entityB: string;
  category: string;
  entityType: string;
  volume: number;
}

// Phase 1 targets sorted by volume (highest first)
const PHASE1_TARGETS: ComparisonTarget[] = [
  // Technology & Products (25)
  { entityA: "iPhone 16 Pro", entityB: "iPhone 16 Pro Max", category: "technology", entityType: "product", volume: 200000 },
  { entityA: "MacBook Air", entityB: "MacBook Pro", category: "technology", entityType: "product", volume: 180000 },
  { entityA: "Samsung S25", entityB: "S25 Ultra", category: "technology", entityType: "product", volume: 150000 },
  { entityA: "Ozempic", entityB: "Wegovy", category: "health", entityType: "medication", volume: 150000 },
  { entityA: "Kobe Bryant", entityB: "LeBron James", category: "sports", entityType: "athlete", volume: 135000 },
  { entityA: "iPad", entityB: "iPad Air", category: "technology", entityType: "product", volume: 120000 },
  { entityA: "AirPods Pro", entityB: "AirPods", category: "technology", entityType: "product", volume: 110000 },
  { entityA: "ChatGPT", entityB: "Gemini", category: "technology", entityType: "software", volume: 100000 },
  { entityA: "Nintendo Switch", entityB: "Steam Deck", category: "technology", entityType: "product", volume: 90000 },
  { entityA: "Mbappe", entityB: "Haaland", category: "sports", entityType: "athlete", volume: 90000 },
  { entityA: "Python", entityB: "JavaScript", category: "technology", entityType: "programming-language", volume: 90000 },
  { entityA: "Windows 11", entityB: "Windows 10", category: "technology", entityType: "software", volume: 85000 },
  { entityA: "Tylenol", entityB: "Advil", category: "health", entityType: "medication", volume: 80000 },
  { entityA: "Java", entityB: "Python", category: "technology", entityType: "programming-language", volume: 80000 },
  { entityA: "Pixel 9", entityB: "iPhone 16", category: "technology", entityType: "product", volume: 75000 },
  { entityA: "Djokovic", entityB: "Nadal", category: "sports", entityType: "athlete", volume: 74000 },
  { entityA: "WordPress", entityB: "Wix", category: "technology", entityType: "software", volume: 70000 },
  { entityA: "Real Madrid", entityB: "Barcelona", category: "sports", entityType: "sports-team", volume: 65000 },
  { entityA: "RTX 4090", entityB: "RTX 4080", category: "technology", entityType: "product", volume: 65000 },
  { entityA: "Shopify", entityB: "WooCommerce", category: "technology", entityType: "software", volume: 65000 },
  { entityA: "Renting", entityB: "Buying a Home", category: "education", entityType: "concept", volume: 60000 },
  { entityA: "North Korea", entityB: "South Korea", category: "countries", entityType: "country", volume: 60000 },
  { entityA: "Notion", entityB: "Obsidian", category: "technology", entityType: "software", volume: 60000 },
  { entityA: "Djokovic", entityB: "Federer", category: "sports", entityType: "athlete", volume: 60000 },
  { entityA: "Home Depot", entityB: "Lowes", category: "companies", entityType: "company", volume: 55000 },
  { entityA: "Canva", entityB: "Photoshop", category: "technology", entityType: "software", volume: 55000 },
  { entityA: "Mike Tyson", entityB: "Muhammad Ali", category: "sports", entityType: "athlete", volume: 55000 },
  { entityA: "Virat Kohli", entityB: "Sachin Tendulkar", category: "sports", entityType: "athlete", volume: 55000 },
  { entityA: "Slack", entityB: "Microsoft Teams", category: "technology", entityType: "software", volume: 55000 },
  { entityA: "Coinbase", entityB: "Binance", category: "companies", entityType: "company", volume: 55000 },
  { entityA: "DoorDash", entityB: "Uber Eats", category: "companies", entityType: "company", volume: 50000 },
  { entityA: "Zoom", entityB: "Google Meet", category: "technology", entityType: "software", volume: 50000 },
  { entityA: "Vanguard", entityB: "Fidelity", category: "companies", entityType: "company", volume: 50000 },
  { entityA: "California", entityB: "Texas", category: "countries", entityType: "state", volume: 50000 },
  { entityA: "Liverpool", entityB: "Manchester United", category: "sports", entityType: "sports-team", volume: 50000 },
  { entityA: "M3 chip", entityB: "M4 chip", category: "technology", entityType: "product", volume: 50000 },
  { entityA: "Curry", entityB: "LeBron", category: "sports", entityType: "athlete", volume: 49000 },
  { entityA: "Almond Milk", entityB: "Oat Milk", category: "health", entityType: "food", volume: 45000 },
  { entityA: "Israel", entityB: "Iran", category: "countries", entityType: "country", volume: 45000 },
  { entityA: "T-Mobile", entityB: "Verizon", category: "companies", entityType: "company", volume: 45000 },
  { entityA: "Costco", entityB: "Sams Club", category: "companies", entityType: "company", volume: 45000 },
  { entityA: "Ronaldo", entityB: "Neymar", category: "sports", entityType: "athlete", volume: 45000 },
  { entityA: "New York", entityB: "Los Angeles", category: "countries", entityType: "city", volume: 45000 },
  { entityA: "Midjourney", entityB: "DALL-E", category: "technology", entityType: "software", volume: 45000 },
  { entityA: "AWS", entityB: "Azure", category: "technology", entityType: "software", volume: 45000 },
  { entityA: "LLC", entityB: "S Corp", category: "education", entityType: "concept", volume: 45000 },
  { entityA: "Vegan", entityB: "Vegetarian", category: "health", entityType: "diet", volume: 45000 },
  { entityA: "Keto", entityB: "Paleo", category: "health", entityType: "diet", volume: 40000 },
  { entityA: "Mexico", entityB: "USA", category: "countries", entityType: "country", volume: 40000 },
  { entityA: "Messi", entityB: "Maradona", category: "sports", entityType: "athlete", volume: 40000 },
  { entityA: "React", entityB: "Vue", category: "technology", entityType: "framework", volume: 40000 },
  { entityA: "Target", entityB: "Walmart", category: "companies", entityType: "company", volume: 40000 },
  { entityA: "MBA", entityB: "Masters Degree", category: "education", entityType: "degree", volume: 40000 },
  { entityA: "AT&T", entityB: "Verizon", category: "companies", entityType: "company", volume: 40000 },
  { entityA: "London", entityB: "Paris", category: "countries", entityType: "city", volume: 40000 },
  { entityA: "Robinhood", entityB: "Fidelity", category: "companies", entityType: "company", volume: 40000 },
  { entityA: "Yoga", entityB: "Pilates", category: "health", entityType: "fitness", volume: 35000 },
  { entityA: "Harvard", entityB: "Stanford", category: "education", entityType: "university", volume: 35000 },
  { entityA: "Running", entityB: "Walking", category: "health", entityType: "exercise", volume: 35000 },
  { entityA: "MySQL", entityB: "PostgreSQL", category: "technology", entityType: "software", volume: 35000 },
  { entityA: "Chase", entityB: "Bank of America", category: "companies", entityType: "company", volume: 35000 },
  { entityA: "FedEx", entityB: "UPS", category: "companies", entityType: "company", volume: 35000 },
  { entityA: "China", entityB: "Taiwan", category: "countries", entityType: "country", volume: 35000 },
  { entityA: "Dubai", entityB: "Singapore", category: "countries", entityType: "city", volume: 35000 },
  { entityA: "Starbucks", entityB: "Dunkin", category: "companies", entityType: "company", volume: 35000 },
  { entityA: "Shaq", entityB: "Kobe", category: "sports", entityType: "athlete", volume: 35000 },
  { entityA: "NFL", entityB: "NBA", category: "sports", entityType: "sports-league", volume: 35000 },
  // Missing Sports
  { entityA: "Gretzky", entityB: "Lemieux", category: "sports", entityType: "athlete", volume: 30000 },
  { entityA: "Mahomes", entityB: "Brady", category: "sports", entityType: "athlete", volume: 28000 },
  { entityA: "UFC", entityB: "Boxing", category: "sports", entityType: "sports-league", volume: 28000 },
  { entityA: "Lakers", entityB: "Celtics", category: "sports", entityType: "sports-team", volume: 25000 },
  { entityA: "Babe Ruth", entityB: "Mike Trout", category: "sports", entityType: "athlete", volume: 22000 },
  { entityA: "Yankees", entityB: "Red Sox", category: "sports", entityType: "sports-team", volume: 30000 },
  // Missing Technology
  { entityA: "Docker", entityB: "Kubernetes", category: "technology", entityType: "software", volume: 30000 },
  { entityA: "GitHub Copilot", entityB: "Cursor", category: "technology", entityType: "software", volume: 30000 },
  // Missing Countries
  { entityA: "Australia", entityB: "New Zealand", category: "countries", entityType: "country", volume: 30000 },
  { entityA: "Spain", entityB: "Italy", category: "countries", entityType: "country", volume: 28000 },
  { entityA: "Tokyo", entityB: "Seoul", category: "countries", entityType: "city", volume: 25000 },
  { entityA: "Sweden", entityB: "Norway", category: "countries", entityType: "country", volume: 22000 },
  { entityA: "Portugal", entityB: "Spain", category: "countries", entityType: "country", volume: 22000 },
  { entityA: "Thailand", entityB: "Vietnam", category: "countries", entityType: "country", volume: 30000 },
  { entityA: "Turkey", entityB: "Greece", category: "countries", entityType: "country", volume: 20000 },
  // Missing Companies
  { entityA: "Delta", entityB: "United Airlines", category: "companies", entityType: "company", volume: 30000 },
  { entityA: "Visa", entityB: "Mastercard", category: "companies", entityType: "company", volume: 30000 },
  { entityA: "Hilton", entityB: "Marriott", category: "companies", entityType: "company", volume: 25000 },
  // Missing Health
  { entityA: "Peloton", entityB: "NordicTrack", category: "health", entityType: "fitness", volume: 30000 },
  { entityA: "CrossFit", entityB: "Gym", category: "health", entityType: "fitness", volume: 25000 },
  { entityA: "Whey Protein", entityB: "Casein Protein", category: "health", entityType: "supplement", volume: 25000 },
  { entityA: "Vitamix", entityB: "Blendtec", category: "health", entityType: "product", volume: 22000 },
  { entityA: "Contact Lenses", entityB: "Glasses", category: "health", entityType: "eyewear", volume: 20000 },
  { entityA: "Meditation", entityB: "Yoga", category: "health", entityType: "wellness", volume: 20000 },
  { entityA: "Organic Food", entityB: "Non-organic Food", category: "health", entityType: "food", volume: 30000 },
  { entityA: "LASIK", entityB: "PRK", category: "health", entityType: "surgery", volume: 18000 },
  // Missing Education
  { entityA: "MIT", entityB: "Stanford", category: "education", entityType: "university", volume: 30000 },
  { entityA: "Software Engineer", entityB: "Data Scientist", category: "education", entityType: "career", volume: 30000 },
  { entityA: "Online Degree", entityB: "Traditional Degree", category: "education", entityType: "concept", volume: 25000 },
  { entityA: "Doctor", entityB: "Lawyer", category: "education", entityType: "career", volume: 25000 },
  { entityA: "Community College", entityB: "University", category: "education", entityType: "concept", volume: 20000 },
  { entityA: "Freelance", entityB: "Full-time Employment", category: "education", entityType: "career", volume: 20000 },
];

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

async function generateOne(target: ComparisonTarget): Promise<boolean> {
  const { entityA, entityB, category, entityType } = target;
  const slug = makeSlug(entityA, entityB);

  const existing = await prisma.comparison.findUnique({ where: { slug } });
  if (existing) {
    console.log(`  ⏭ Already exists: ${slug}`);
    return true;
  }

  // Also check reverse slug
  const reverseSlug = makeSlug(entityB, entityA);
  const existingReverse = await prisma.comparison.findUnique({ where: { slug: reverseSlug } });
  if (existingReverse) {
    console.log(`  ⏭ Already exists (reverse): ${reverseSlug}`);
    return true;
  }

  const [compData, aData, bData] = await Promise.all([
    tavilySearch(`${entityA} vs ${entityB} comparison 2026`),
    tavilySearch(`${entityA} ${entityType} latest specs features 2026`),
    tavilySearch(`${entityB} ${entityType} latest specs features 2026`),
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
    {"name": "${entityA}", "shortDesc": "One-liner description", "entityType": "${entityType}", "pros": ["p1","p2","p3"], "cons": ["c1","c2"], "bestFor": "Who should choose this"},
    {"name": "${entityB}", "shortDesc": "One-liner description", "entityType": "${entityType}", "pros": ["p1","p2","p3"], "cons": ["c1","c2"], "bestFor": "Who should choose this"}
  ],
  "attributes": [
    {"name": "Attr", "unit": "unit/null", "category": "Group", "dataType": "number/text", "higherIsBetter": true/false/null, "entityAValue": "val", "entityANumber": num/null, "entityBValue": "val", "entityBNumber": num/null, "winner": "a"/"b"/"tie"/null}
  ],
  "faqs": [{"question": "?", "answer": "..."}],
  "metaTitle": "SEO title <60 chars with 2026",
  "metaDescription": "SEO desc <155 chars"
}

Include: 6-8 key differences, 8-12 attributes with relevant metrics for this ${entityType} type, 4-6 FAQs, 3-5 pros / 2-3 cons per entity. Be factual and current for 2026.

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
    } catch { /* skip attr errors */ }
  }

  return true;
}

async function main() {
  const args = process.argv.slice(2);
  const categoryFilter = args.includes("--category") ? args[args.indexOf("--category") + 1] : null;
  const limitArg = args.includes("--limit") ? parseInt(args[args.indexOf("--limit") + 1]) : null;

  let targets = PHASE1_TARGETS;
  if (categoryFilter) {
    targets = targets.filter(t => t.category === categoryFilter);
    console.log(`Filtered to category: ${categoryFilter}`);
  }
  if (limitArg) {
    targets = targets.slice(0, limitArg);
    console.log(`Limited to: ${limitArg} comparisons`);
  }

  console.log(`\nPhase 1 Batch Generation — ${targets.length} comparisons\n`);
  const stats = { success: 0, skipped: 0, failed: 0 };

  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];
    console.log(`[${i + 1}/${targets.length}] ${t.entityA} vs ${t.entityB} (${t.category}, ~${(t.volume / 1000).toFixed(0)}K/mo)`);
    const start = Date.now();
    try {
      const ok = await generateOne(t);
      const s = ((Date.now() - start) / 1000).toFixed(1);
      if (ok) {
        const existed = s < "1"; // quick skip = already existed
        if (parseFloat(s) < 1) { stats.skipped++; } else { stats.success++; }
        console.log(`  ✓ ${s}s`);
      } else {
        console.log(`  ✗ Failed ${((Date.now() - start) / 1000).toFixed(1)}s`);
        stats.failed++;
      }
    } catch (err: any) {
      console.log(`  ✗ Error: ${err.message?.slice(0, 100)}`);
      stats.failed++;
    }
    // Rate limit: 500ms between API calls
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
