/**
 * Consumer Tech Comparison Generator — H73
 * Targets the highest-traffic product comparison queries:
 * phones, laptops, tablets, audio, chips, cameras, smart home.
 *
 * Run: npx tsx scripts/gen-consumer-tech.ts [--dry-run] [--limit=N]
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// ── Pairs sorted by estimated monthly search volume ───────────────────────────
const TECH_PAIRS: [string, string, number][] = [
  // Phones — highest search volume consumer comparisons
  ["iPhone 16 Pro", "iPhone 16 Pro Max", 200000],
  ["Samsung Galaxy S25", "iPhone 16", 150000],
  ["Samsung Galaxy S25", "Samsung Galaxy S25 Ultra", 150000],
  ["iPhone 16", "iPhone 15", 100000],
  ["iPhone 16 Pro", "iPhone 15 Pro", 90000],
  ["Google Pixel 9 Pro", "iPhone 16 Pro", 75000],
  ["iPhone 16 Pro Max", "Samsung Galaxy S25 Ultra", 65000],

  // Laptops — very high buyer intent
  ["MacBook Air", "MacBook Pro", 180000],
  ["MacBook Air M3", "MacBook Air M4", 100000],
  ["MacBook Pro 14", "MacBook Pro 16", 60000],
  ["MacBook Pro", "Dell XPS 15", 50000],
  ["MacBook Air", "Dell XPS 13", 45000],
  ["Surface Laptop", "MacBook Air", 35000],

  // Tablets
  ["iPad", "iPad Air", 120000],
  ["iPad Pro", "iPad Air", 110000],
  ["iPad Pro", "MacBook Air", 60000],
  ["Samsung Galaxy Tab S10", "iPad Pro", 45000],

  // Audio
  ["AirPods Pro", "AirPods 4", 110000],
  ["AirPods Pro 2", "Sony WH-1000XM5", 60000],
  ["AirPods Max", "Sony WH-1000XM5", 55000],
  ["Sony WH-1000XM5", "Bose QuietComfort 45", 50000],

  // Chips & performance
  ["Apple M4", "Apple M3", 50000],
  ["RTX 4090", "RTX 4080 Super", 65000],
  ["RTX 4070 Ti", "RX 7900 XTX", 45000],
  ["Intel Core Ultra 9", "AMD Ryzen 9 9900X", 35000],

  // Smart home & wearables
  ["Apple Watch Series 10", "Apple Watch Ultra 2", 55000],
  ["Apple Watch Ultra 2", "Garmin Fenix 8", 40000],
  ["Ring Video Doorbell", "Nest Doorbell", 40000],
  ["Amazon Echo", "Google Nest Hub", 35000],

  // Cameras
  ["Sony A7 IV", "Canon EOS R6 Mark II", 35000],
  ["GoPro HERO 13", "DJI Osmo Action 4", 25000],
];

function makeSlug(a: string, b: string): string {
  const sa = a.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "");
  const sb = b.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "");
  return [sa, sb].sort().join("-vs-");
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
    return (data.results || []).map((r: any) => `- ${r.content?.slice(0, 300)}`).join("\n");
  } catch { return ""; }
}

async function generateOne(entityA: string, entityB: string): Promise<boolean> {
  const slug = makeSlug(entityA, entityB);
  const existing = await prisma.comparison.findUnique({ where: { slug } });
  if (existing) { console.log(`  ⏭  exists: ${slug}`); return true; }

  const [compData, aData, bData] = await Promise.all([
    tavilySearch(`${entityA} vs ${entityB} comparison 2026 specs price`),
    tavilySearch(`${entityA} specs price review 2025 2026`),
    tavilySearch(`${entityB} specs price review 2025 2026`),
  ]);
  const enrichment = [compData, aData, bData].filter(Boolean).join("\n");

  const prompt = `Generate a structured comparison between "${entityA}" and "${entityB}". Return ONLY valid JSON:
{
  "title": "${entityA} vs ${entityB}",
  "shortAnswer": "2-3 sentence summary with clear recommendation",
  "keyDifferences": [{"label": "Attribute", "entityAValue": "val", "entityBValue": "val", "winner": "a"|"b"|"tie"}],
  "verdict": "2-3 sentence conclusion",
  "entities": [
    {"name": "${entityA}", "shortDesc": "one line", "entityType": "product", "pros": ["p1","p2","p3"], "cons": ["c1","c2"], "bestFor": "who is this for"},
    {"name": "${entityB}", "shortDesc": "one line", "entityType": "product", "pros": ["p1","p2","p3"], "cons": ["c1","c2"], "bestFor": "who is this for"}
  ],
  "faqs": [
    {"question": "Specific Q about ${entityA} vs ${entityB}?", "answer": "Detailed 2-3 sentence answer."},
    {"question": "Another specific Q?", "answer": "Detailed answer."},
    {"question": "Who should choose ${entityA} over ${entityB}?", "answer": "Detailed answer."}
  ],
  "metaTitle": "${entityA} vs ${entityB}: Which Is Better? (2026)",
  "metaDescription": "Compare ${entityA} vs ${entityB} — specs, price, performance. Find out which is right for you in 2026."
}
Include 6-8 keyDifferences covering: price, performance, display/sound quality, battery/camera, design, value. Use real 2025/2026 data.
${enrichment ? `\nContext:\n${enrichment}` : ""}`;

  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2500,
    messages: [{ role: "user", content: prompt }],
  });

  let jsonText = ((msg.content[0] as any).text || "").trim();
  const m = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (m) jsonText = m[1].trim();
  const obj = jsonText.match(/\{[\s\S]*\}/);
  if (!obj) { console.error(`  ✗ no JSON for ${slug}`); return false; }

  let data: any;
  try { data = JSON.parse(obj[0]); } catch { console.error(`  ✗ parse fail ${slug}`); return false; }

  const category = "products";
  const entityASlug = (data.entities?.[0]?.name || entityA).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "");
  const entityBSlug = (data.entities?.[1]?.name || entityB).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "");

  const et = await prisma.entityType.upsert({
    where: { slug: category }, create: { slug: category, name: category }, update: {},
  });
  const entA = await prisma.entity.upsert({
    where: { slug: entityASlug },
    create: { slug: entityASlug, name: data.entities?.[0]?.name || entityA, shortDesc: data.entities?.[0]?.shortDesc || null, entityTypeId: et.id },
    update: { shortDesc: data.entities?.[0]?.shortDesc || undefined },
  });
  const entB = await prisma.entity.upsert({
    where: { slug: entityBSlug },
    create: { slug: entityBSlug, name: data.entities?.[1]?.name || entityB, shortDesc: data.entities?.[1]?.shortDesc || null, entityTypeId: et.id },
    update: { shortDesc: data.entities?.[1]?.shortDesc || undefined },
  });
  const comp = await prisma.comparison.upsert({
    where: { slug },
    create: {
      slug, title: data.title || `${entityA} vs ${entityB}`,
      shortAnswer: data.shortAnswer || null, keyDifferences: data.keyDifferences || [],
      verdict: data.verdict || null, category,
      metaTitle: data.metaTitle || `${entityA} vs ${entityB} | Comparison 2026`,
      metaDescription: data.metaDescription || `Compare ${entityA} and ${entityB}.`,
      status: "published", isAutoGenerated: true, publishedAt: new Date(),
    },
    update: {
      title: data.title, shortAnswer: data.shortAnswer, keyDifferences: data.keyDifferences,
      verdict: data.verdict, category, metaTitle: data.metaTitle, metaDescription: data.metaDescription,
      status: "published", publishedAt: new Date(),
    },
  });
  await prisma.comparisonEntity.deleteMany({ where: { comparisonId: comp.id } });
  await prisma.comparisonEntity.createMany({ data: [
    { comparisonId: comp.id, entityId: entA.id, position: 0, pros: data.entities?.[0]?.pros || [], cons: data.entities?.[0]?.cons || [], bestFor: data.entities?.[0]?.bestFor || null },
    { comparisonId: comp.id, entityId: entB.id, position: 1, pros: data.entities?.[1]?.pros || [], cons: data.entities?.[1]?.cons || [], bestFor: data.entities?.[1]?.bestFor || null },
  ]});
  await prisma.fAQ.deleteMany({ where: { comparisonId: comp.id } });
  for (const faq of (data.faqs || [])) {
    if (faq.question && faq.answer) {
      await prisma.fAQ.create({ data: { comparisonId: comp.id, question: faq.question, answer: faq.answer } });
    }
  }

  console.log(`  ✓  Generated: ${slug}`);
  return true;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const limit = parseInt(process.argv.find(a => a.startsWith("--limit="))?.split("=")[1] || "20");

  console.log(`\n🖥  Consumer Tech Comparison Generator (H73)`);
  console.log(`   Mode: ${dryRun ? "DRY RUN" : "LIVE"} | Limit: ${limit}\n`);

  const pairs = TECH_PAIRS.slice(0, limit);

  if (dryRun) {
    for (const [a, b, vol] of pairs) {
      console.log(`  ${makeSlug(a, b).padEnd(55)} ${vol.toLocaleString()} searches/mo`);
    }
    await prisma.$disconnect();
    return;
  }

  let generated = 0, skipped = 0, failed = 0;
  for (const [a, b] of pairs) {
    process.stdout.write(`  ${a} vs ${b} ... `);
    try {
      const ok = await generateOne(a, b);
      if (ok) { if (await prisma.comparison.findUnique({ where: { slug: makeSlug(a, b) } })) skipped++; else generated++; }
    } catch (e: any) { console.error(`FAIL: ${e.message}`); failed++; }
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`\n✅ Done: ${generated} generated, ${skipped} skipped (exists), ${failed} failed`);
  await prisma.$disconnect();
}

main().catch(console.error);
