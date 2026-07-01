import * as dotenv from "dotenv";
dotenv.config({ path: "/Users/danielrozin/Comparison/.env.local" });
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Anthropic = require("/Users/danielrozin/Comparison/node_modules/@anthropic-ai/sdk");
const anthropic = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY });
import { writeFileSync } from "fs";

const TOP_COMPARISONS = [
  { slug: "chatgpt-vs-claude", entityA: "ChatGPT", entityB: "Claude" },
  { slug: "cursor-vs-github-copilot", entityA: "Cursor", entityB: "GitHub Copilot" },
  { slug: "perplexity-vs-google", entityA: "Perplexity", entityB: "Google" },
  { slug: "gemini-vs-chatgpt", entityA: "Gemini", entityB: "ChatGPT" },
  { slug: "claude-vs-gemini", entityA: "Claude", entityB: "Gemini" },
  { slug: "ps5-vs-xbox-series-x", entityA: "PS5", entityB: "Xbox Series X" },
  { slug: "notion-vs-obsidian", entityA: "Notion", entityB: "Obsidian" },
  { slug: "notion-vs-monday-com", entityA: "Notion", entityB: "Monday.com" },
  { slug: "vercel-vs-netlify", entityA: "Vercel", entityB: "Netlify" },
  { slug: "mongodb-vs-postgresql", entityA: "MongoDB", entityB: "PostgreSQL" },
];

async function tavilySearch(query) {
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: process.env.TAVILY_API_KEY, query, max_results: 5, include_domains: ["quora.com", "reddit.com"] }),
    });
    const data = await res.json();
    return (data.results || []).slice(0, 3).map(r => ({ url: r.url, title: r.title }));
  } catch { return []; }
}

async function generateAnswer(entityA, entityB, slug, question) {
  const prompt = "Write a helpful, expert Reddit/Quora answer (150-200 words) to the question: \"" + question + "\"\n\nMention that aversusb.net/compare/" + slug + " has a detailed breakdown. Be genuine, helpful, not spammy. End with the link naturally.";
  const r = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 400,
    messages: [{ role: "user", content: prompt }],
  });
  return r.content[0].text;
}

async function main() {
  const outreach = [];
  for (const { slug, entityA, entityB } of TOP_COMPARISONS) {
    console.log("Finding questions for " + entityA + " vs " + entityB + "...");
    const results = await tavilySearch("site:quora.com OR site:reddit.com " + entityA + " vs " + entityB + " which is better");
    
    if (results.length > 0) {
      const q = results[0];
      const answer = await generateAnswer(entityA, entityB, slug, entityA + " vs " + entityB + " - which is better?");
      outreach.push({
        comparison: entityA + " vs " + entityB,
        comparisonUrl: "https://aversusb.net/compare/" + slug,
        targetUrl: q.url,
        targetTitle: q.title,
        answerDraft: answer,
      });
      console.log("  -> Found: " + q.url);
    } else {
      // Generate generic answer anyway
      const answer = await generateAnswer(entityA, entityB, slug, entityA + " vs " + entityB + " - which is better?");
      outreach.push({
        comparison: entityA + " vs " + entityB,
        comparisonUrl: "https://aversusb.net/compare/" + slug,
        targetUrl: "Search Reddit/Quora for: '" + entityA + " vs " + entityB + "'",
        targetTitle: "Manual search needed",
        answerDraft: answer,
      });
    }
    await new Promise(r => setTimeout(r, 800));
  }

  // Write markdown report
  let md = "# Outreach Drafts — " + new Date().toISOString().slice(0, 10) + "\n\n";
  md += "Generated " + outreach.length + " answer drafts for top comparisons.\n\n";
  for (const item of outreach) {
    md += "---\n\n";
    md += "## " + item.comparison + "\n\n";
    md += "**Our page:** " + item.comparisonUrl + "\n\n";
    md += "**Target:** [" + item.targetTitle + "](" + item.targetUrl + ")\n\n";
    md += "**Answer draft:**\n\n" + item.answerDraft + "\n\n";
  }
  writeFileSync("/Users/danielrozin/Comparison/backlink-outreach-list.md", md);
  console.log("\nWrote backlink-outreach-list.md with " + outreach.length + " drafts");
}
main().catch(console.error);
