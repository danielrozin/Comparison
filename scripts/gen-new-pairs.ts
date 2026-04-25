/**
 * Generate only the newly added high-traffic comparison pairs.
 * Run: npx tsx scripts/gen-new-pairs.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const NEW_PAIRS: [string, string][] = [
  // E-commerce (very high volume)
  ["Amazon", "eBay"],
  ["Etsy", "eBay"],
  ["Amazon", "Target"],
  // Social Media
  ["Pinterest", "Instagram"],
  ["Snapchat", "Instagram"],
  ["Twitter", "Reddit"],
  // Travel
  ["Airbnb", "Hotels.com"],
  ["Expedia", "Booking.com"],
  ["Kayak", "Google Flights"],
  // Automotive
  ["Tesla", "BMW"],
  ["Tesla", "Ford"],
  ["Toyota", "Honda"],
  ["Toyota", "Ford"],
  // Consumer Tech
  ["iPhone 15", "Samsung Galaxy S24"],
  ["iPad", "Surface"],
  ["AirPods Pro", "Samsung Galaxy Buds"],
  // Streaming/Music
  ["Spotify", "YouTube Music"],
  ["Paramount Plus", "Disney Plus"],
  ["Apple TV Plus", "Amazon Prime Video"],
];

function makeSlug(a: string, b: string): string {
  const sa = a.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "");
  const sb = b.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "");
  return [sa, sb].sort().join("-vs-");
}

const CATEGORIES = [
  "sports", "countries", "technology", "software", "products", "companies",
  "brands", "history", "economy", "military", "science", "entertainment",
  "automotive", "general",
];

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
  if (existing) {
    console.log(`  ⏭  Already exists: ${slug}`);
    return true;
  }

  const [compData, aData, bData] = await Promise.all([
    tavilySearch(`${entityA} vs ${entityB} comparison 2026`),
    tavilySearch(`${entityA} latest features stats 2026`),
    tavilySearch(`${entityB} latest features stats 2026`),
  ]);
  const enrichment = [compData, aData, bData].filter(Boolean).join("\n");

  const categoryHint = (() => {
    const both = (entityA + entityB).toLowerCase();
    if (/facebook|instagram|twitter|tiktok|linkedin|reddit|youtube|netflix|pinterest|snapchat/.test(both)) return "entertainment";
    if (/iphone|samsung|macbook|windows|surface|chromebook|ipad|airpods/.test(both)) return "technology";
    if (/steam|epic|nintendo|switch|playstation|xbox/.test(both)) return "entertainment";
    if (/amazon|walmart|ebay|etsy|target|shopify/.test(both)) return "products";
    if (/airbnb|hotel|expedia|booking|kayak|vrbo|google.flights/.test(both)) return "products";
    if (/tesla|bmw|toyota|honda|ford|chevrolet|audi/.test(both)) return "automotive";
    if (/spotify|apple.music|tidal|youtube.music|paramount|disney|prime.video/.test(both)) return "entertainment";
    if (/cloudflare|fastly|cloudfront/.test(both)) return "software";
    return "software";
  })();

  const prompt = `You are a comparison data expert. Generate a structured comparison between "${entityA}" and "${entityB}".

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "title": "${entityA} vs ${entityB}",
  "shortAnswer": "2-3 sentence factual summary of the key difference",
  "keyDifferences": [
    {"label": "Attribute Name", "entityAValue": "value", "entityBValue": "value", "winner": "a" or "b" or "tie"}
  ],
  "verdict": "2-3 sentence balanced conclusion",
  "category": "${categoryHint}",
  "entities": [
    {
      "name": "${entityA}",
      "shortDesc": "One-line description",
      "entityType": "platform",
      "pros": ["pro1", "pro2", "pro3"],
      "cons": ["con1", "con2"],
      "bestFor": "Who should choose this"
    },
    {
      "name": "${entityB}",
      "shortDesc": "One-line description",
      "entityType": "platform",
      "pros": ["pro1", "pro2", "pro3"],
      "cons": ["con1", "con2"],
      "bestFor": "Who should choose this"
    }
  ],
  "attributes": [
    {
      "name": "Attribute",
      "unit": null,
      "category": "Category Group",
      "dataType": "text",
      "higherIsBetter": null,
      "entityAValue": "value",
      "entityANumber": null,
      "entityBValue": "value",
      "entityBNumber": null,
      "winner": "a" or "b" or "tie" or null
    }
  ],
  "faqs": [
    {"question": "Common question?", "answer": "Detailed answer."}
  ],
  "metaTitle": "SEO title under 60 chars",
  "metaDescription": "SEO description under 155 chars"
}

Requirements: 6-8 keyDifferences, 6-8 attributes with real data, 3-5 FAQs, 3-5 pros and 2-3 cons per entity. Be factual with real statistics. Year is 2026.

${enrichment ? `\nCurrent data:\n${enrichment}` : ""}`;

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
  try {
    data = JSON.parse(jsonText);
  } catch {
    // Try extracting JSON object
    const objMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!objMatch) { console.error(`  ✗ JSON parse failed for ${slug}`); return false; }
    try { data = JSON.parse(objMatch[0]); } catch { console.error(`  ✗ JSON parse failed for ${slug}`); return false; }
  }

  const entityASlug = (data.entities?.[0]?.name || entityA).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "");
  const entityBSlug = (data.entities?.[1]?.name || entityB).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "");

  const entityType = await prisma.entityType.upsert({
    where: { slug: categoryHint },
    create: { slug: categoryHint, name: categoryHint.charAt(0).toUpperCase() + categoryHint.slice(1) },
    update: {},
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
    create: {
      slug, title: data.title || `${entityA} vs ${entityB}`,
      shortAnswer: data.shortAnswer || null, keyDifferences: data.keyDifferences || [],
      verdict: data.verdict || null, category: data.category || categoryHint,
      metaTitle: data.metaTitle || `${entityA} vs ${entityB} | Comparison 2026`,
      metaDescription: data.metaDescription || `Compare ${entityA} and ${entityB} side by side.`,
      status: "published", isAutoGenerated: true, publishedAt: new Date(),
    },
    update: {
      title: data.title, shortAnswer: data.shortAnswer, keyDifferences: data.keyDifferences,
      verdict: data.verdict, category: data.category || categoryHint,
      metaTitle: data.metaTitle, metaDescription: data.metaDescription,
      status: "published", publishedAt: new Date(),
    },
  });

  await prisma.comparisonEntity.deleteMany({ where: { comparisonId: comparison.id } });
  await prisma.comparisonEntity.createMany({
    data: [
      { comparisonId: comparison.id, entityId: entA.id, position: 0, pros: data.entities?.[0]?.pros || [], cons: data.entities?.[0]?.cons || [], bestFor: data.entities?.[0]?.bestFor || null },
      { comparisonId: comparison.id, entityId: entB.id, position: 1, pros: data.entities?.[1]?.pros || [], cons: data.entities?.[1]?.cons || [], bestFor: data.entities?.[1]?.bestFor || null },
    ],
  });

  await prisma.fAQ.deleteMany({ where: { comparisonId: comparison.id } });
  for (const faq of data.faqs || []) {
    await prisma.fAQ.create({ data: { question: faq.question, answer: faq.answer, comparisonId: comparison.id } });
  }

  for (const attr of data.attributes || []) {
    try {
      const attrSlug = (attr.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "") || `attr-${Date.now()}`;
      let dbAttr = await prisma.attribute.findFirst({ where: { slug: attrSlug, entityTypeId: entityType.id } });
      if (!dbAttr) {
        dbAttr = await prisma.attribute.create({
          data: { slug: attrSlug, name: attr.name || attrSlug, unit: attr.unit || null, dataType: attr.dataType || "text", category: attr.category || null, higherIsBetter: typeof attr.higherIsBetter === "boolean" ? attr.higherIsBetter : null, entityTypeId: entityType.id },
        });
      }
      await prisma.attributeValue.deleteMany({ where: { entityId: entA.id, attributeId: dbAttr.id } });
      await prisma.attributeValue.create({ data: { entityId: entA.id, attributeId: dbAttr.id, valueText: attr.entityAValue ? String(attr.entityAValue) : null, valueNumber: typeof attr.entityANumber === "number" ? attr.entityANumber : null } });
      await prisma.attributeValue.deleteMany({ where: { entityId: entB.id, attributeId: dbAttr.id } });
      await prisma.attributeValue.create({ data: { entityId: entB.id, attributeId: dbAttr.id, valueText: attr.entityBValue ? String(attr.entityBValue) : null, valueNumber: typeof attr.entityBNumber === "number" ? attr.entityBNumber : null } });
    } catch { /* skip attribute errors */ }
  }

  return true;
}

async function main() {
  console.log(`Generating ${NEW_PAIRS.length} high-traffic pairs...\n`);
  let ok = 0, fail = 0;

  for (let i = 0; i < NEW_PAIRS.length; i++) {
    const [a, b] = NEW_PAIRS[i];
    console.log(`[${i + 1}/${NEW_PAIRS.length}] ${a} vs ${b}`);
    try {
      const result = await generateOne(a, b);
      if (result) { console.log(`  ✓ Done`); ok++; }
      else { console.log(`  ✗ Failed`); fail++; }
    } catch (err: any) {
      console.log(`  ✗ Error: ${err.message?.slice(0, 100)}`);
      fail++;
    }
    if (i < NEW_PAIRS.length - 1) await new Promise(r => setTimeout(r, 700));
  }

  const total = await prisma.comparison.count();
  console.log(`\nDone: ${ok} generated, ${fail} failed. Total in DB: ${total}`);
  await prisma.$disconnect();
}

main().catch(console.error);
