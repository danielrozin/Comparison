/**
 * Generate Batch 2 of "does X have Y" tactical blog posts.
 * DAN-1412 follow-up: Wells Fargo Zelle, Amazon Apple Pay, Netflix Sports, Instacart Apple Pay, AmEx Zelle
 * Run: npx dotenv -e .env.local -- npx tsx scripts/gen-blogs-batch2.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const anthropic = new Anthropic({
  apiKey: (process.env.ANTHROPIC_API_KEY || "").replace(/\\n/g, "").trim(),
});

interface BlogTopic {
  title: string;
  slug: string;
  category: string;
  searchQuery: string;
  competitors: string;
  relatedComparePages: string[];
}

const BATCH2_TOPICS: BlogTopic[] = [
  {
    title: "Does Wells Fargo Have Zelle? (2026 Guide)",
    slug: "does-wells-fargo-have-zelle-in-2026-guide",
    category: "business",
    searchQuery: "Wells Fargo Zelle 2026 how to use send money",
    competitors: "Wells Fargo Zelle vs Chase Zelle vs Bank of America Zelle",
    relatedComparePages: [
      "wells-fargo-vs-chase",
      "wells-fargo-vs-bank-of-america",
      "chase-vs-bank-of-america",
    ],
  },
  {
    title: "Does Amazon Take Apple Pay? (2026 Answer)",
    slug: "does-amazon-take-apple-pay-in-2026",
    category: "technology",
    searchQuery: "Amazon Apple Pay 2026 payment methods accepted",
    competitors: "Amazon payment methods vs Walmart vs Target Apple Pay",
    relatedComparePages: [
      "amazon-vs-walmart",
      "apple-pay-vs-google-pay",
      "amazon-vs-target",
    ],
  },
  {
    title: "Does Netflix Have Live Sports? (2026)",
    slug: "does-netflix-have-live-sports-in-2026-whats-available",
    category: "entertainment",
    searchQuery: "Netflix live sports 2026 WWE NFL events",
    competitors: "Netflix vs ESPN+ vs Peacock vs Amazon Prime Video live sports",
    relatedComparePages: [
      "netflix-vs-espn-plus",
      "netflix-vs-peacock",
      "netflix-vs-amazon-prime-video",
    ],
  },
  {
    title: "Does Instacart Accept Apple Pay? (2026)",
    slug: "does-instacart-accept-apple-pay-in-2026",
    category: "technology",
    searchQuery: "Instacart Apple Pay 2026 payment methods accepted",
    competitors: "Instacart payment methods vs DoorDash vs Uber Eats Apple Pay",
    relatedComparePages: [
      "instacart-vs-doordash",
      "instacart-vs-uber-eats",
      "doordash-vs-uber-eats",
    ],
  },
  {
    title: "Does AmEx Have Zelle? (2026)",
    slug: "does-amex-have-zelle-in-2026-alternatives-explained",
    category: "business",
    searchQuery: "American Express Amex Zelle 2026 peer to peer payments",
    competitors: "AmEx vs Chase Zelle vs Venmo vs PayPal payment transfer options",
    relatedComparePages: [
      "american-express-vs-chase",
      "venmo-vs-zelle",
      "paypal-vs-venmo",
    ],
  },
];

async function tavilySearch(query: string): Promise<string> {
  const apiKey = (process.env.TAVILY_API_KEY || "").replace(/\\n/g, "").trim();
  if (!apiKey) return "";
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, query, max_results: 5, search_depth: "basic" }),
    });
    if (!res.ok) return "";
    const data: any = await res.json();
    return (data.results || [])
      .map((r: any) => `- ${r.title}: ${r.content?.slice(0, 400)}`)
      .join("\n");
  } catch {
    return "";
  }
}

async function generateBlog(topic: BlogTopic): Promise<boolean> {
  // Check if already exists
  const existing = await prisma.blogArticle.findUnique({ where: { slug: topic.slug } });
  if (existing) {
    console.log(`  ⏭ Already exists: ${topic.slug}`);
    return true;
  }

  // Enrich with Tavily
  const enrichment = await tavilySearch(topic.searchQuery);
  const competitorEnrichment = await tavilySearch(topic.competitors);

  // Build internal link suggestions
  const internalLinks = topic.relatedComparePages
    .map((s) => `[${s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}](/compare/${s})`)
    .join(", ");

  const prompt = `You are a professional content writer for "A Versus B" (aversusb.net), a comparison and answer platform.

Write an SEO-optimized blog article for the exact title: "${topic.title}"

CONTENT REQUIREMENTS:
1. **Opening paragraph** — Answer the "does X have Y" question DIRECTLY in the very first sentence. No fluff. Example: "Yes, Wells Fargo supports Zelle — here's how to use it."
2. **How-to section** — If the answer is yes, explain step-by-step how to use the feature. If no, explain why not and what alternatives exist.
3. **Competitor comparison** — Include a section comparing ${topic.competitors}. Use a markdown table for a side-by-side view.
4. **Internal links** — Naturally weave in links to our comparison pages: ${internalLinks}. Use the format [anchor text](/compare/slug).
5. **FAQ section** — End with an "## Frequently Asked Questions" section with 4-5 Q&As covering common related queries. Format each as **Q:** / **A:**.
6. **Length** — 900–1200 words total.
7. **Tone** — Factual, helpful, no fluff. Answer-first format.
8. **Year** — Reflect 2026 current state throughout.

CATEGORY: ${topic.category}

${enrichment ? `\nRecent web research on the main topic:\n${enrichment}` : ""}
${competitorEnrichment ? `\nRecent web research on competitors:\n${competitorEnrichment}` : ""}

Return ONLY valid JSON (no markdown code fences, no extra text before/after):
{
  "title": "Exact article title",
  "excerpt": "2-3 sentence compelling summary that directly answers the question",
  "content": "Full markdown article content (900-1200 words)",
  "category": "${topic.category}",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "metaTitle": "SEO title 50-60 chars with primary keyword first",
  "metaDescription": "SEO description 150-160 chars, verb-first CTA, answers the question",
  "relatedComparisonSlugs": ${JSON.stringify(topic.relatedComparePages)}
}`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = (message.content[0] as any).text || "";
  let jsonText = rawText.trim();

  // Strip markdown code fences if present
  const fenceMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) jsonText = fenceMatch[1].trim();

  // Strip any leading/trailing non-JSON text
  const jsonStart = jsonText.indexOf("{");
  const jsonEnd = jsonText.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1) {
    jsonText = jsonText.slice(jsonStart, jsonEnd + 1);
  }

  let data: any;
  try {
    data = JSON.parse(jsonText);
  } catch (e) {
    console.error(`  ✗ JSON parse failed. Raw response snippet:`, rawText.slice(0, 200));
    return false;
  }

  await prisma.blogArticle.upsert({
    where: { slug: topic.slug },
    create: {
      slug: topic.slug,
      title: data.title || topic.title,
      excerpt: data.excerpt || null,
      content: data.content || "",
      category: data.category || topic.category,
      tags: data.tags || [],
      metaTitle: data.metaTitle || topic.title,
      metaDescription: data.metaDescription || "",
      relatedComparisonSlugs: data.relatedComparisonSlugs || topic.relatedComparePages,
      status: "published",
      isAutoGenerated: true,
      publishedAt: new Date(),
    },
    update: {
      title: data.title || topic.title,
      excerpt: data.excerpt,
      content: data.content || "",
      category: data.category || topic.category,
      tags: data.tags || [],
      metaTitle: data.metaTitle || topic.title,
      metaDescription: data.metaDescription || "",
      relatedComparisonSlugs: data.relatedComparisonSlugs || topic.relatedComparePages,
      status: "published",
      publishedAt: new Date(),
    },
  });

  return true;
}

async function main() {
  console.log(`\n=== Batch 2 Blog Generation — "Does X Have Y" ===`);
  console.log(`Generating ${BATCH2_TOPICS.length} blog articles...\n`);

  let success = 0;
  let failed = 0;
  const generatedSlugs: string[] = [];

  for (let i = 0; i < BATCH2_TOPICS.length; i++) {
    const topic = BATCH2_TOPICS[i];
    console.log(`[${i + 1}/${BATCH2_TOPICS.length}] ${topic.title}`);
    const start = Date.now();
    try {
      const ok = await generateBlog(topic);
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      if (ok) {
        console.log(`  ✓ ${elapsed}s — slug: ${topic.slug}`);
        success++;
        generatedSlugs.push(topic.slug);
      } else {
        console.log(`  ✗ Failed in ${elapsed}s`);
        failed++;
      }
    } catch (err: any) {
      console.log(`  ✗ Error: ${err.message?.slice(0, 150)}`);
      failed++;
    }
    // Small delay between calls to avoid rate limits
    if (i < BATCH2_TOPICS.length - 1) await new Promise((r) => setTimeout(r, 800));
  }

  console.log(`\n=== Results ===`);
  console.log(`Success: ${success} | Failed: ${failed}`);

  const total = await prisma.blogArticle.count({ where: { status: "published" } });
  console.log(`Total published blog articles in DB: ${total}`);

  if (generatedSlugs.length > 0) {
    console.log(`\nGenerated slugs (for IndexNow):`);
    generatedSlugs.forEach((s) => console.log(`  https://www.aversusb.net/blog/${s}`));
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
