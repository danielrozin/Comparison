/**
 * H74 — AI tools, retail extended, food delivery, fitness equipment
 * Run: npx tsx scripts/gen-h74.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const PAIRS: [string, string, string][] = [
  // AI tools — extremely high search volume in 2026
  ["ChatGPT", "Gemini", "technology"],
  ["Claude", "Gemini", "technology"],
  ["Perplexity", "Google Search", "technology"],
  ["Grok", "ChatGPT", "technology"],
  ["GitHub Copilot", "Cursor", "technology"],
  ["Cursor", "Windsurf", "technology"],
  ["Midjourney", "Stable Diffusion", "technology"],
  ["DALL-E", "Midjourney", "technology"],
  ["ElevenLabs", "OpenAI Voice", "technology"],
  ["Sora", "Runway", "technology"],
  // Retail extended
  ["Costco", "BJ's Wholesale", "products"],
  ["Aldi", "Lidl", "products"],
  ["Whole Foods", "Sprouts", "products"],
  ["Trader Joe's", "Aldi", "products"],
  ["Target", "Walmart", "products"],
  ["Best Buy", "Amazon", "products"],
  // Food delivery extended
  ["Uber Eats", "DoorDash", "products"],
  ["Grubhub", "DoorDash", "products"],
  ["Instacart", "Amazon Fresh", "products"],
  ["HelloFresh", "Blue Apron", "products"],
  // Fitness equipment
  ["Peloton", "NordicTrack", "products"],
  ["Bowflex", "Peloton", "products"],
  ["Tonal", "Tempo", "products"],
  // Pet products
  ["Chewy", "Amazon", "products"],
  ["Petco", "PetSmart", "products"],
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

async function generateOne(entityA: string, entityB: string, category: string): Promise<boolean> {
  const slug = makeSlug(entityA, entityB);
  const existing = await prisma.comparison.findUnique({ where: { slug } });
  if (existing) { console.log(`  ⏭  exists: ${slug}`); return true; }

  const [compData, aData, bData] = await Promise.all([
    tavilySearch(`${entityA} vs ${entityB} comparison 2026`),
    tavilySearch(`${entityA} features stats 2026`),
    tavilySearch(`${entityB} features stats 2026`),
  ]);
  const enrichment = [compData, aData, bData].filter(Boolean).join("\n");

  const prompt = `Generate a structured comparison between "${entityA}" and "${entityB}". Return ONLY valid JSON:
{
  "title": "${entityA} vs ${entityB}",
  "shortAnswer": "2-3 sentence summary",
  "keyDifferences": [{"label": "Name", "entityAValue": "val", "entityBValue": "val", "winner": "a"|"b"|"tie"}],
  "verdict": "2-3 sentence conclusion",
  "category": "${category}",
  "entities": [
    {"name": "${entityA}", "shortDesc": "one line", "entityType": "product", "pros": ["p1","p2","p3"], "cons": ["c1","c2"], "bestFor": "who"},
    {"name": "${entityB}", "shortDesc": "one line", "entityType": "product", "pros": ["p1","p2","p3"], "cons": ["c1","c2"], "bestFor": "who"}
  ],
  "attributes": [{"name": "Attr", "unit": null, "category": "Group", "dataType": "text", "higherIsBetter": null, "entityAValue": "val", "entityANumber": null, "entityBValue": "val", "entityBNumber": null, "winner": null}],
  "faqs": [{"question": "Q?", "answer": "A."}],
  "metaTitle": "SEO title <60 chars",
  "metaDescription": "SEO desc <155 chars"
}
6-8 keyDifferences, 6-8 attributes, 3-5 FAQs, real data/stats. Year 2026.
${enrichment ? `\nData:\n${enrichment}` : ""}`;

  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 3000,
    messages: [{ role: "user", content: prompt }],
  });

  let jsonText = ((msg.content[0] as any).text || "").trim();
  const m = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (m) jsonText = m[1].trim();
  const obj = jsonText.match(/\{[\s\S]*\}/);
  if (!obj) { console.error(`  ✗ no JSON for ${slug}`); return false; }

  let data: any;
  try { data = JSON.parse(obj[0]); } catch { console.error(`  ✗ parse fail ${slug}`); return false; }

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
  for (const faq of data.faqs || []) {
    await prisma.fAQ.create({ data: { question: faq.question, answer: faq.answer, comparisonId: comp.id } });
  }
  for (const attr of data.attributes || []) {
    try {
      const aSlug = (attr.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "") || `attr-${Date.now()}`;
      let dbAttr = await prisma.attribute.findFirst({ where: { slug: aSlug, entityTypeId: et.id } });
      if (!dbAttr) dbAttr = await prisma.attribute.create({ data: { slug: aSlug, name: attr.name || aSlug, unit: attr.unit || null, dataType: attr.dataType || "text", category: attr.category || null, higherIsBetter: typeof attr.higherIsBetter === "boolean" ? attr.higherIsBetter : null, entityTypeId: et.id } });
      await prisma.attributeValue.deleteMany({ where: { entityId: entA.id, attributeId: dbAttr.id } });
      await prisma.attributeValue.create({ data: { entityId: entA.id, attributeId: dbAttr.id, valueText: attr.entityAValue ? String(attr.entityAValue) : null, valueNumber: typeof attr.entityANumber === "number" ? attr.entityANumber : null } });
      await prisma.attributeValue.deleteMany({ where: { entityId: entB.id, attributeId: dbAttr.id } });
      await prisma.attributeValue.create({ data: { entityId: entB.id, attributeId: dbAttr.id, valueText: attr.entityBValue ? String(attr.entityBValue) : null, valueNumber: typeof attr.entityBNumber === "number" ? attr.entityBNumber : null } });
    } catch { /* skip */ }
  }
  return true;
}

async function main() {
  console.log(`H74: generating ${PAIRS.length} pairs...\n`);
  let ok = 0, fail = 0;
  for (let i = 0; i < PAIRS.length; i++) {
    const [a, b, cat] = PAIRS[i];
    console.log(`[${i+1}/${PAIRS.length}] ${a} vs ${b}`);
    try {
      const r = await generateOne(a, b, cat);
      if (r) { console.log(`  ✓`); ok++; } else { fail++; }
    } catch (e: any) {
      console.log(`  ✗ ${e.message?.slice(0,80)}`); fail++;
    }
    if (i < PAIRS.length - 1) await new Promise(r => setTimeout(r, 2000));
  }
  const total = await prisma.comparison.count();
  console.log(`\nDone: ${ok} ok, ${fail} failed. DB total: ${total}`);
  await prisma.$disconnect();
}
main().catch(console.error);
