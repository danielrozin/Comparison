import * as dotenv from "dotenv";
dotenv.config({ path: "/Users/danielrozin/Comparison/.env.local" });
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Anthropic = require("/Users/danielrozin/Comparison/node_modules/@anthropic-ai/sdk");
const anthropic = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY });
import { writeFileSync, readFileSync, existsSync } from "fs";

const PAIRS_BATCH2 = [
  { slug: "claude-vs-gpt-4", entityA: "Claude", entityB: "GPT-4" },
  { slug: "cursor-vs-claude-code", entityA: "Cursor", entityB: "Claude Code" },
  { slug: "asana-vs-trello", entityA: "Asana", entityB: "Trello" },
  { slug: "linear-vs-jira", entityA: "Linear", entityB: "Jira" },
  { slug: "aws-vs-google-cloud", entityA: "AWS", entityB: "Google Cloud" },
  { slug: "vercel-vs-netlify", entityA: "Vercel", entityB: "Netlify" },
  { slug: "supabase-vs-firebase", entityA: "Supabase", entityB: "Firebase" },
  { slug: "coinbase-vs-binance", entityA: "Coinbase", entityB: "Binance" },
  { slug: "fidelity-vs-schwab", entityA: "Fidelity", entityB: "Schwab" },
  { slug: "japan-vs-china", entityA: "Japan", entityB: "China" },
  { slug: "lebron-vs-jordan", entityA: "LeBron", entityB: "Jordan" },
  { slug: "ps5-vs-xbox-series-x", entityA: "PS5", entityB: "Xbox Series X" },
  { slug: "uk-vs-usa", entityA: "UK", entityB: "USA" },
  { slug: "india-vs-china", entityA: "India", entityB: "China" },
  { slug: "canada-vs-australia", entityA: "Canada", entityB: "Australia" },
  { slug: "netflix-vs-max-comparison-2026", entityA: "Netflix", entityB: "Max" },
  { slug: "notion-vs-obsidian", entityA: "Notion", entityB: "Obsidian" },
  { slug: "apple-watch-vs-samsung-galaxy-watch", entityA: "Apple Watch", entityB: "Samsung Galaxy Watch" },
  { slug: "dyson-vs-shark", entityA: "Dyson", entityB: "Shark" },
  { slug: "airpods-pro-vs-sony-wf-1000xm5", entityA: "AirPods Pro", entityB: "Sony WF-1000XM5" },
];

async function tavilySearch(query) {
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: process.env.TAVILY_API_KEY, query, max_results: 3, include_domains: ["quora.com", "reddit.com"] }),
    });
    const data = await res.json();
    return (data.results || []).slice(0, 1).map(r => ({ url: r.url, title: r.title }))[0] || null;
  } catch { return null; }
}

async function generateAnswer(entityA, entityB, slug) {
  const prompt = "Write a helpful 150-word Reddit answer comparing " + entityA + " and " + entityB + ". End naturally with: For a detailed breakdown, aversusb.net/compare/" + slug + " covers all the key differences.";
  const r = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  });
  return r.content[0].text;
}

async function main() {
  const existing = existsSync("/Users/danielrozin/Comparison/backlink-outreach-list.md") 
    ? readFileSync("/Users/danielrozin/Comparison/backlink-outreach-list.md", "utf8") 
    : "";
  
  let additions = "\n\n---\n\n## Batch 2 — " + new Date().toISOString().slice(0, 10) + "\n\n";
  let count = 0;
  
  for (const { slug, entityA, entityB } of PAIRS_BATCH2) {
    const thread = await tavilySearch("site:reddit.com OR site:quora.com " + entityA + " vs " + entityB);
    const answer = await generateAnswer(entityA, entityB, slug);
    additions += "### " + entityA + " vs " + entityB + "\n\n";
    additions += "**Page:** https://aversusb.net/compare/" + slug + "\n\n";
    if (thread) {
      additions += "**Thread:** [" + thread.title + "](" + thread.url + ")\n\n";
    } else {
      additions += "**Thread:** Search Reddit/Quora for '" + entityA + " vs " + entityB + "'\n\n";
    }
    additions += "**Draft:**\n\n" + answer + "\n\n";
    count++;
    console.log("done: " + entityA + " vs " + entityB);
    await new Promise(r => setTimeout(r, 500));
  }
  
  writeFileSync("/Users/danielrozin/Comparison/backlink-outreach-list.md", existing + additions);
  console.log("Added " + count + " more drafts. Total file updated.");
}
main().catch(console.error);
