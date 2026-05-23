/**
 * DAN-374 May content cycle — high-volume, high-commercial-intent X-vs-Y pairs.
 *
 * Generated via Claude (Haiku 4.5) + Tavily enrichment, written to the Neon
 * production DB with status=published. No DataForSEO dependency (DAN-695 blocked)
 * and no publish/deploy step (DAN-689 blocked) — pages render the moment Vercel
 * is restored.
 *
 * Pairs concentrate on under-served but high-CPC categories per the 2026-05-23
 * DB audit: insurance, finance/banking, credit cards, crypto, streaming, meal
 * kits, health/DTC, travel, telecom, tax/ecommerce SaaS.
 *
 * Run:  cd <Comparison> && node scripts/gen-dan374-may-batch.mjs
 */
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const NEW_PAIRS = [
  // Insurance (very high CPC)
  ["Lemonade", "Geico"], ["USAA", "Geico"], ["Liberty Mutual", "Geico"],
  ["Nationwide", "State Farm"], ["Farmers", "Allstate"], ["Root", "Geico"],
  ["The General", "Geico"], ["Esurance", "Geico"],
  // Banking / fintech (high CPC)
  ["Chase", "Bank of America"], ["Capital One", "Chase"], ["Ally", "Marcus"],
  ["SoFi", "Chime"], ["Chime", "Cash App"], ["Venmo", "Cash App"],
  ["PayPal", "Venmo"], ["Zelle", "Venmo"], ["Wells Fargo", "Chase"],
  // Investing / brokerages
  ["Robinhood", "Webull"], ["Fidelity", "Vanguard"], ["Schwab", "Fidelity"],
  ["Robinhood", "Fidelity"], ["Acorns", "Robinhood"], ["Wealthfront", "Betterment"],
  // Credit cards
  ["Amex Gold", "Chase Sapphire Preferred"], ["Chase Sapphire Preferred", "Chase Sapphire Reserve"],
  ["Amex Platinum", "Chase Sapphire Reserve"], ["Capital One Venture", "Chase Sapphire Preferred"],
  // Crypto exchanges
  ["Coinbase", "Binance"], ["Coinbase", "Kraken"], ["Binance", "Kraken"],
  ["Crypto.com", "Coinbase"], ["Gemini", "Coinbase"],
  // Streaming (high volume)
  ["Netflix", "Disney Plus"], ["Hulu", "Netflix"], ["HBO Max", "Netflix"],
  ["Disney Plus", "Hulu"], ["Peacock", "Paramount Plus"], ["YouTube TV", "Hulu Live TV"],
  ["Sling TV", "YouTube TV"],
  // Meal kits / food delivery
  ["HelloFresh", "Blue Apron"], ["HelloFresh", "Home Chef"], ["Factor", "HelloFresh"],
  ["DoorDash", "Uber Eats"], ["DoorDash", "Grubhub"], ["Instacart", "Amazon Fresh"],
  // Health / fitness / DTC
  ["Hims", "Roman"], ["Ro", "Hims"], ["Noom", "WeightWatchers"],
  ["Calm", "Headspace"], ["Peloton", "NordicTrack"], ["BetterHelp", "Talkspace"],
  ["Ozempic", "Wegovy"], ["Ozempic", "Mounjaro"],
  // Travel / booking (high CPC)
  ["Booking.com", "Expedia"], ["Expedia", "Priceline"], ["Airbnb", "Vrbo"],
  ["Kayak", "Expedia"], ["Hotels.com", "Booking.com"], ["Tripadvisor", "Expedia"],
  // Telecom / internet
  ["AT&T", "Xfinity"], ["Spectrum", "Xfinity"], ["Starlink", "Xfinity"],
  ["Mint Mobile", "Visible"], ["T-Mobile Home Internet", "Starlink"],
  // Tax / ecommerce / marketing SaaS
  ["TurboTax", "H&R Block"], ["TurboTax", "FreeTaxUSA"], ["Shopify", "WooCommerce"],
  ["Squarespace", "Wix"], ["Wix", "WordPress"], ["Shopify", "BigCommerce"],
  ["Mailchimp", "Constant Contact"], ["HubSpot", "Salesforce"],
];

function makeSlug(a, b) {
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "").replace(/^-+/, "");
  return [norm(a), norm(b)].sort().join("-vs-");
}

async function tavilySearch(query) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return "";
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, query, max_results: 3 }),
    });
    if (!res.ok) return "";
    const data = await res.json();
    return (data.results || []).map((r) => `- ${r.content?.slice(0, 300)}`).join("\n");
  } catch { return ""; }
}

function categoryFor(a, b) {
  const both = (a + " " + b).toLowerCase();
  if (/geico|progressive|state.farm|allstate|lemonade|usaa|liberty.mutual|nationwide|farmers|root|the general|esurance/.test(both)) return "insurance";
  if (/chase|bank of america|capital one|ally|marcus|sofi|chime|cash app|venmo|paypal|zelle|wells fargo|robinhood|webull|fidelity|vanguard|schwab|acorns|wealthfront|betterment|coinbase|binance|kraken|crypto\.com|gemini|amex|sapphire|platinum|venture|turbotax|h&r block|freetaxusa/.test(both)) return "finance";
  if (/netflix|disney|hulu|hbo|max|peacock|paramount|youtube tv|sling/.test(both)) return "entertainment";
  if (/hellofresh|blue apron|home chef|factor|doordash|uber eats|grubhub|instacart|amazon fresh/.test(both)) return "food_and_drink";
  if (/hims|roman|\bro\b|noom|weightwatchers|calm|headspace|peloton|nordictrack|betterhelp|talkspace|ozempic|wegovy|mounjaro/.test(both)) return "health";
  if (/booking|expedia|priceline|airbnb|vrbo|kayak|hotels\.com|tripadvisor/.test(both)) return "travel";
  if (/at&t|xfinity|spectrum|starlink|mint mobile|visible|t-mobile|home internet/.test(both)) return "products";
  if (/shopify|woocommerce|squarespace|wix|wordpress|bigcommerce|mailchimp|constant contact|hubspot|salesforce/.test(both)) return "software";
  return "products";
}

async function generateOne(entityA, entityB) {
  const slug = makeSlug(entityA, entityB);
  const existing = await prisma.comparison.findUnique({ where: { slug } });
  if (existing) return "skip";

  const [compData, aData, bData] = await Promise.all([
    tavilySearch(`${entityA} vs ${entityB} comparison 2026`),
    tavilySearch(`${entityA} latest features pricing 2026`),
    tavilySearch(`${entityB} latest features pricing 2026`),
  ]);
  const enrichment = [compData, aData, bData].filter(Boolean).join("\n");
  const categoryHint = categoryFor(entityA, entityB);

  const prompt = `You are a comparison data expert. Generate a structured comparison between "${entityA}" and "${entityB}".

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "title": "${entityA} vs ${entityB}",
  "shortAnswer": "2-3 sentence factual summary of the key difference",
  "keyDifferences": [{"label": "Attribute Name", "entityAValue": "value", "entityBValue": "value", "winner": "a" or "b" or "tie"}],
  "verdict": "2-3 sentence balanced conclusion",
  "category": "${categoryHint}",
  "entities": [
    {"name": "${entityA}", "shortDesc": "One-line description", "entityType": "platform", "pros": ["pro1","pro2","pro3"], "cons": ["con1","con2"], "bestFor": "Who should choose this"},
    {"name": "${entityB}", "shortDesc": "One-line description", "entityType": "platform", "pros": ["pro1","pro2","pro3"], "cons": ["con1","con2"], "bestFor": "Who should choose this"}
  ],
  "attributes": [{"name": "Attribute", "unit": null, "category": "Category Group", "dataType": "text", "higherIsBetter": null, "entityAValue": "value", "entityANumber": null, "entityBValue": "value", "entityBNumber": null, "winner": "a" or "b" or "tie" or null}],
  "faqs": [{"question": "Common question?", "answer": "Detailed answer."}],
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

  let jsonText = ((message.content[0] && message.content[0].text) || "").trim();
  const fence = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) jsonText = fence[1].trim();
  let data;
  try { data = JSON.parse(jsonText); }
  catch {
    const obj = jsonText.match(/\{[\s\S]*\}/);
    if (!obj) return "parsefail";
    try { data = JSON.parse(obj[0]); } catch { return "parsefail"; }
  }

  const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "").replace(/^-+/, "");
  const entityASlug = norm(data.entities?.[0]?.name || entityA);
  const entityBSlug = norm(data.entities?.[1]?.name || entityB);

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
      slug, title: data.title || `${entityA} vs ${entityB}`, shortAnswer: data.shortAnswer || null,
      keyDifferences: data.keyDifferences || [], verdict: data.verdict || null, category: data.category || categoryHint,
      metaTitle: data.metaTitle || `${entityA} vs ${entityB} | Comparison 2026`,
      metaDescription: data.metaDescription || `Compare ${entityA} and ${entityB} side by side.`,
      status: "published", isAutoGenerated: true, publishedAt: new Date(),
    },
    update: {
      title: data.title, shortAnswer: data.shortAnswer, keyDifferences: data.keyDifferences, verdict: data.verdict,
      category: data.category || categoryHint, metaTitle: data.metaTitle, metaDescription: data.metaDescription,
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
      const attrSlug = norm(attr.name) || `attr-${Date.now()}`;
      let dbAttr = await prisma.attribute.findFirst({ where: { slug: attrSlug, entityTypeId: entityType.id } });
      if (!dbAttr) {
        dbAttr = await prisma.attribute.create({
          data: { slug: attrSlug, name: attr.name || attrSlug, unit: attr.unit || null, dataType: attr.dataType || "text", category: attr.category || null, higherIsBetter: typeof attr.higherIsBetter === "boolean" ? attr.higherIsBetter : null, entityTypeId: entityType.id },
        });
      }
      await prisma.attributeValue.deleteMany({ where: { entityId: entA.id, attributeId: dbAttr.id } });
      await prisma.attributeValue.create({ data: { entityId: entA.id, attributeId: dbAttr.id, valueText: attr.entityAValue != null ? String(attr.entityAValue) : null, valueNumber: typeof attr.entityANumber === "number" ? attr.entityANumber : null } });
      await prisma.attributeValue.deleteMany({ where: { entityId: entB.id, attributeId: dbAttr.id } });
      await prisma.attributeValue.create({ data: { entityId: entB.id, attributeId: dbAttr.id, valueText: attr.entityBValue != null ? String(attr.entityBValue) : null, valueNumber: typeof attr.entityBNumber === "number" ? attr.entityBNumber : null } });
    } catch { /* skip attribute errors */ }
  }
  return "ok";
}

// Optional: pass a path to a JSON file of [[a,b],...] pairs to run a different
// curated batch without editing this file (supports the ongoing content cycle).
function loadPairs() {
  const arg = process.argv[2];
  if (!arg) return NEW_PAIRS;
  const raw = JSON.parse(readFileSync(path.resolve(process.cwd(), arg), "utf8"));
  if (!Array.isArray(raw)) throw new Error("pairs file must be a JSON array of [a,b] tuples");
  return raw;
}

async function main() {
  const PAIRS = loadPairs();
  const startTotal = await prisma.comparison.count();
  console.log(`Start total: ${startTotal}. Candidate pairs: ${PAIRS.length}\n`);
  let ok = 0, skip = 0, fail = 0;
  const created = [];
  for (let i = 0; i < PAIRS.length; i++) {
    const [a, b] = PAIRS[i];
    const slug = makeSlug(a, b);
    process.stdout.write(`[${i + 1}/${PAIRS.length}] ${slug} ... `);
    try {
      const r = await generateOne(a, b);
      if (r === "ok") { ok++; created.push(slug); console.log("OK"); }
      else if (r === "skip") { skip++; console.log("skip (exists)"); }
      else { fail++; console.log(`FAIL (${r})`); }
    } catch (e) { fail++; console.log(`ERR ${String(e.message || e).slice(0, 120)}`); }
    if (i < PAIRS.length - 1) await new Promise((r) => setTimeout(r, 1200));
  }
  const endTotal = await prisma.comparison.count();
  console.log(`\n=== DONE ===`);
  console.log(`generated=${ok} skipped=${skip} failed=${fail}`);
  console.log(`total: ${startTotal} -> ${endTotal} (delta +${endTotal - startTotal})`);
  console.log(`CREATED_SLUGS:${created.join(",")}`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
