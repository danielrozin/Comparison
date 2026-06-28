/**
 * Generate Cleveland Browns NFL matchup comparison pages.
 * Run: npx tsx scripts/gen-nfl-browns-matchups.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// DATABASE_URL is read from the environment (.env.local / Vercel env).
// Never hardcode connection strings with credentials here — see DAN-1513.
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Add it to .env.local or your shell environment before running this script."
  );
}

import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const NFL_PAIRS: [string, string][] = [
  ["Cleveland Browns", "Minnesota Vikings"],
  ["Cleveland Browns", "Las Vegas Raiders"],
  ["Cleveland Browns", "San Francisco 49ers"],
  ["Cleveland Browns", "Green Bay Packers"],
  ["Cleveland Browns", "Tennessee Titans"],
  ["Cleveland Browns", "Chicago Bears"],
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
  if (existing) {
    console.log(`  ⏭  Already exists: ${slug}`);
    return true;
  }

  const [compData, aData, bData] = await Promise.all([
    tavilySearch(`${entityA} vs ${entityB} NFL comparison 2025 2026 head-to-head history`),
    tavilySearch(`${entityA} NFL 2025 season record stats quarterback`),
    tavilySearch(`${entityB} NFL 2025 season record stats quarterback`),
  ]);
  const enrichment = [compData, aData, bData].filter(Boolean).join("\n");

  const categoryHint = "sports";

  const prompt = `You are an NFL sports comparison expert. Generate a structured comparison between the "${entityA}" and "${entityB}" NFL teams.

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "title": "${entityA} vs ${entityB}",
  "shortAnswer": "2-3 sentence factual summary of the key difference between these two NFL teams",
  "keyDifferences": [
    {"label": "Attribute Name", "entityAValue": "value", "entityBValue": "value", "winner": "a" or "b" or "tie"}
  ],
  "verdict": "2-3 sentence balanced conclusion about which team has the edge and why",
  "category": "sports",
  "entities": [
    {
      "name": "${entityA}",
      "shortDesc": "One-line description of the team",
      "entityType": "nfl-team",
      "pros": ["pro1", "pro2", "pro3"],
      "cons": ["con1", "con2"],
      "bestFor": "What type of fan or fantasy football scenario this team suits best"
    },
    {
      "name": "${entityB}",
      "shortDesc": "One-line description of the team",
      "entityType": "nfl-team",
      "pros": ["pro1", "pro2", "pro3"],
      "cons": ["con1", "con2"],
      "bestFor": "What type of fan or fantasy football scenario this team suits best"
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

Requirements:
- 6-8 keyDifferences covering: 2025-2026 Season Record, Quarterback, Super Bowl Wins, All-Time Head-to-Head, Points Per Game (2025), Defense Ranking (2025), Playoff Appearances (last 10 years), Key Player
- 6-8 attributes with real NFL data: wins/losses, QB stats, team history stats, scoring averages
- 3-5 FAQs about the head-to-head matchup history, upcoming schedule, and team comparisons
- 3-5 pros and 2-3 cons per team
- Be factual with real NFL statistics. Focus on 2025-2026 season performance and historical head-to-head records
- Category must be "sports"
- entityType must be "nfl-team"

${enrichment ? `\nCurrent NFL data:\n${enrichment}` : ""}`;

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
    create: { slug: categoryHint, name: "Sports" },
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
      verdict: data.verdict || null, category: "sports",
      metaTitle: data.metaTitle || `${entityA} vs ${entityB} | NFL Comparison`,
      metaDescription: data.metaDescription || `Compare ${entityA} and ${entityB} NFL teams side by side.`,
      status: "published", isAutoGenerated: true, publishedAt: new Date(),
    },
    update: {
      title: data.title, shortAnswer: data.shortAnswer, keyDifferences: data.keyDifferences,
      verdict: data.verdict, category: "sports",
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
  console.log(`Generating ${NFL_PAIRS.length} Cleveland Browns NFL matchup pages...\n`);
  let ok = 0, fail = 0;

  for (let i = 0; i < NFL_PAIRS.length; i++) {
    const [a, b] = NFL_PAIRS[i];
    console.log(`[${i + 1}/${NFL_PAIRS.length}] ${a} vs ${b}`);
    try {
      const result = await generateOne(a, b);
      if (result) { console.log(`  ✓ Done`); ok++; }
      else { console.log(`  ✗ Failed`); fail++; }
    } catch (err: any) {
      console.log(`  ✗ Error: ${err.message?.slice(0, 100)}`);
      fail++;
    }
    if (i < NFL_PAIRS.length - 1) await new Promise(r => setTimeout(r, 2000));
  }

  const total = await prisma.comparison.count();
  console.log(`\nDone: ${ok} generated, ${fail} failed. Total in DB: ${total}`);
  await prisma.$disconnect();
}

main().catch(console.error);
