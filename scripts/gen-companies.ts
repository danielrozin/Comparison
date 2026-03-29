/**
 * Generate company comparisons for empty subcategories.
 * Run: npx tsx scripts/gen-companies.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const COMPARISONS = [
  // Startups & SaaS
  ["OpenAI", "Anthropic"],
  ["Notion", "Coda"],
  ["Stripe", "Adyen"],
  ["Canva", "Figma"],
  ["Shopify", "BigCommerce"],
  ["Slack", "Discord"],
  ["Zoom", "Microsoft Teams"],
  ["Vercel", "Netlify"],

  // Finance & Fintech
  ["Visa", "Mastercard"],
  ["PayPal", "Stripe"],
  ["Robinhood", "Webull"],
  ["Coinbase", "Binance"],
  ["Revolut", "Wise"],
  ["JPMorgan", "Goldman Sachs"],
  ["Charles Schwab", "Fidelity"],
  ["Venmo", "Cash App"],

  // Food & Beverage
  ["Coca-Cola", "Pepsi"],
  ["Starbucks", "Dunkin"],
  ["McDonald's", "Burger King"],
  ["Chipotle", "Taco Bell"],
  ["Subway", "Jimmy John's"],
  ["Chick-fil-A", "Popeyes"],
  ["Domino's", "Pizza Hut"],
  ["KFC", "Popeyes"],

  // Extra Big Tech / general companies
  ["Apple", "Samsung"],
  ["Netflix", "Disney Plus"],
  ["Uber", "Lyft"],
  ["Airbnb", "VRBO"],
  ["SpaceX", "Blue Origin"],
  ["OpenAI", "Google DeepMind"],
];

function makeSlug(a: string, b: string): string {
  const sa = a.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "").replace(/^-/, "");
  const sb = b.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "").replace(/^-/, "");
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
    return (data.results || []).map((r: any) => `- ${r.content?.slice(0, 300)} (${r.url})`).join("\n");
  } catch { return ""; }
}

async function generateOne(entityA: string, entityB: string): Promise<boolean> {
  const slug = makeSlug(entityA, entityB);

  const existing = await prisma.comparison.findUnique({ where: { slug } });
  if (existing) {
    console.log(`  ⏭ Already exists: ${slug}`);
    return true;
  }

  const [compData, aData, bData] = await Promise.all([
    tavilySearch(`${entityA} vs ${entityB} comparison 2026`),
    tavilySearch(`${entityA} company revenue market cap 2026`),
    tavilySearch(`${entityB} company revenue market cap 2026`),
  ]);
  const enrichment = [compData, aData, bData].filter(Boolean).join("\n");

  const prompt = `You are a comparison data expert. Generate a structured comparison between "${entityA}" and "${entityB}" as companies/organizations.

Return ONLY valid JSON (no markdown, no code blocks) with this structure:
{
  "title": "${entityA} vs ${entityB}",
  "shortAnswer": "2-3 sentence factual summary",
  "keyDifferences": [{"label": "Attr", "entityAValue": "val", "entityBValue": "val", "winner": "a"/"b"/"tie"}],
  "verdict": "2-3 sentence balanced conclusion",
  "category": "companies",
  "entities": [
    {"name": "Full Name", "shortDesc": "One-liner", "entityType": "company", "pros": ["p1","p2","p3"], "cons": ["c1","c2"], "bestFor": "Who should choose"}
  ],
  "attributes": [
    {"name": "Attr", "unit": "unit/null", "category": "Group", "dataType": "number/text", "higherIsBetter": true/false/null, "entityAValue": "val", "entityANumber": num/null, "entityBValue": "val", "entityBNumber": num/null, "winner": "a"/"b"/"tie"/null}
  ],
  "faqs": [{"question": "?", "answer": "..."}],
  "metaTitle": "SEO title <60 chars with 2026",
  "metaDescription": "SEO desc <155 chars"
}

Include: 5-7 key differences, 5-8 attributes (revenue, employees, market cap, founding year, etc.), 3-5 FAQs, 3-5 pros / 2-3 cons per entity. Be factual. Year is 2026.

${enrichment ? `\nReal-world data:\n${enrichment}` : ""}`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 3000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = (message.content[0] as any).text || "";
  let jsonText = text.trim();
  const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonText = jsonMatch[1].trim();

  let data: any;
  try { data = JSON.parse(jsonText); } catch { console.error(`  ✗ JSON parse failed`); return false; }

  const category = "companies";
  const entityASlug = (data.entities?.[0]?.name || entityA).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "").replace(/^-/, "");
  const entityBSlug = (data.entities?.[1]?.name || entityB).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "").replace(/^-/, "");

  const entityType = await prisma.entityType.upsert({
    where: { slug: "company" }, create: { slug: "company", name: "Company" }, update: {},
  });

  const entA = await prisma.entity.upsert({
    where: { slug: entityASlug },
    create: { slug: entityASlug, name: data.entities?.[0]?.name || entityA, shortDesc: data.entities?.[0]?.shortDesc || null, entityTypeId: entityType.id },
    update: { shortDesc: data.entities?.[0]?.shortDesc || undefined },
  });
  const entB = await prisma.entity.upsert({
    where: { slug: entityBSlug },
    create: { slug: entityBSlug, name: data.entities?.[1]?.name || entityB, shortDesc: data.entities?.[1]?.shortDesc || null, entityTypeId: entityType.id },
    update: { shortDesc: data.entities?.[1]?.shortDesc || undefined },
  });

  const comparison = await prisma.comparison.upsert({
    where: { slug },
    create: { slug, title: data.title || `${entityA} vs ${entityB}`, shortAnswer: data.shortAnswer || null, keyDifferences: data.keyDifferences || [], verdict: data.verdict || null, category, metaTitle: data.metaTitle, metaDescription: data.metaDescription, status: "published", isAutoGenerated: true, publishedAt: new Date() },
    update: { title: data.title, shortAnswer: data.shortAnswer, keyDifferences: data.keyDifferences, verdict: data.verdict, category, metaTitle: data.metaTitle, metaDescription: data.metaDescription, status: "published", publishedAt: new Date() },
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
      let dbAttr = await prisma.attribute.findFirst({ where: { slug: attrSlug, entityTypeId: entityType.id } });
      if (!dbAttr) {
        dbAttr = await prisma.attribute.create({ data: { slug: attrSlug, name: attr.name || attrSlug, unit: attr.unit || null, dataType: attr.dataType || "text", category: attr.category || null, higherIsBetter: typeof attr.higherIsBetter === "boolean" ? attr.higherIsBetter : null, entityTypeId: entityType.id } });
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
  console.log(`Generating ${COMPARISONS.length} company comparisons...\n`);
  let success = 0, failed = 0;

  for (let i = 0; i < COMPARISONS.length; i++) {
    const [a, b] = COMPARISONS[i];
    console.log(`[${i + 1}/${COMPARISONS.length}] ${a} vs ${b}`);
    const start = Date.now();
    try {
      const ok = await generateOne(a, b);
      const s = ((Date.now() - start) / 1000).toFixed(1);
      if (ok) { console.log(`  ✓ ${s}s`); success++; }
      else { console.log(`  ✗ Failed ${s}s`); failed++; }
    } catch (err: any) {
      console.log(`  ✗ Error: ${err.message?.slice(0, 80)}`);
      failed++;
    }
    if (i < COMPARISONS.length - 1) await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\nDone: ${success} success, ${failed} failed`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
