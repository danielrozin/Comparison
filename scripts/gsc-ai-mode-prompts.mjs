/**
 * GSC "prompt-like" query mining (Nov 2026 AI Mode research).
 *
 * AI Mode clicks/impressions are merged into GSC's Web search type and can't be
 * filtered directly. Long, conversational queries are the best available proxy
 * (Chris Long / Nectiv, Feb 2026). This script pulls them with GSC's RE2 regex
 * filter, plus question-style queries (Ahrefs), and prints a monthly KPI line
 * and the top queries so they can be clustered into new comparison topics.
 *
 * Usage: node scripts/gsc-ai-mode-prompts.mjs [days=90] [out.json]
 * Needs GOOGLE_SERVICE_ACCOUNT_KEY (JSON, optionally wrapped in quotes).
 */
import { GoogleAuth } from "google-auth-library";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// An explicitly exported key wins over .env.local (which may hold an empty/stale one).
const EXPLICIT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const PROMPT_REGEX = "^(?:\\S+\\s+){9,}\\S+$"; // 10+ words (Nectiv)
export const QUESTION_REGEX = "\\b(why|what|when|are|will|does|should|where|who|how|can|do|is|which)\\b"; // Ahrefs

const SITE = "sc-domain:aversusb.net";

function loadKey() {
  let raw = (EXPLICIT_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "").trim();
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not set");
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) raw = raw.slice(1, -1);
  try {
    return JSON.parse(raw);
  } catch {
    // dotenv expands "\n" inside double quotes into real newlines, which are
    // illegal inside a JSON string — re-escape them.
    return JSON.parse(raw.replace(/\r?\n/g, "\\n"));
  }
}

async function query(token, body) {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) throw new Error(`GSC ${res.status}: ${await res.text()}`);
  return (await res.json()).rows || [];
}

const filter = (expression) => [{ filters: [{ dimension: "query", operator: "includingRegex", expression }] }];

async function main() {
  const days = Number(process.argv[2] || 90);
  const out = process.argv[3];
  const end = new Date(Date.now() - 2 * 864e5);
  const start = new Date(end.getTime() - days * 864e5);
  const range = { startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10) };

  const auth = new GoogleAuth({ credentials: loadKey(), scopes: ["https://www.googleapis.com/auth/webmasters.readonly"] });
  const { token } = await (await auth.getClient()).getAccessToken();

  const [total] = await query(token, { ...range, rowLimit: 1 });
  const [promptTotal] = await query(token, { ...range, dimensionFilterGroups: filter(PROMPT_REGEX), rowLimit: 1 });
  const [questionTotal] = await query(token, { ...range, dimensionFilterGroups: filter(QUESTION_REGEX), rowLimit: 1 });
  const monthly = await query(token, { ...range, dimensions: ["date"], dimensionFilterGroups: filter(PROMPT_REGEX), rowLimit: 500 });
  const prompts = await query(token, { ...range, dimensions: ["query", "page"], dimensionFilterGroups: filter(PROMPT_REGEX), rowLimit: 1000 });

  const byMonth = {};
  for (const r of monthly) {
    const m = r.keys[0].slice(0, 7);
    byMonth[m] ??= { impressions: 0, clicks: 0 };
    byMonth[m].impressions += r.impressions;
    byMonth[m].clicks += r.clicks;
  }
  const pct = (a, b) => (b ? ((100 * a) / b).toFixed(2) + "%" : "n/a");
  const report = {
    range,
    totals: {
      all: { impressions: total?.impressions ?? 0, clicks: total?.clicks ?? 0 },
      promptLike10Words: { impressions: promptTotal?.impressions ?? 0, clicks: promptTotal?.clicks ?? 0 },
      questions: { impressions: questionTotal?.impressions ?? 0, clicks: questionTotal?.clicks ?? 0 },
    },
    shareOfImpressions: {
      promptLike10Words: pct(promptTotal?.impressions ?? 0, total?.impressions ?? 0),
      questions: pct(questionTotal?.impressions ?? 0, total?.impressions ?? 0),
    },
    promptLikeByMonth: byMonth,
    topPromptQueries: prompts
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 100)
      .map((r) => ({ query: r.keys[0], page: r.keys[1], impressions: r.impressions, clicks: r.clicks, position: +r.position.toFixed(1) })),
  };
  if (out) fs.writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ...report, topPromptQueries: report.topPromptQueries.slice(0, 25) }, null, 2));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
