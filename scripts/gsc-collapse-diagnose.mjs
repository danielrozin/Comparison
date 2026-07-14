/**
 * Diagnose the late-June 2026 organic collapse.
 *
 * Distinguishes the two hypotheses that imply completely different fixes:
 *   A) DEINDEXING / serving failure  -> page count earning impressions collapses,
 *      surviving pages hold their positions.  Fix = reindex (fast).
 *   B) ALGORITHMIC DEMOTION (spam update) -> page count roughly holds,
 *      average position craters.  Fix = content quality (slow).
 */
import crypto from "crypto";
import fs from "fs";

for (const file of [".env.local", ".env"]) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
      v = v.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}

const SITE = process.env.GSC_SITE_URL || "sc-domain:aversusb.net";

async function getAccessToken() {
  const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({
      iss: key.client_email,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  ).toString("base64url");
  const sig = crypto.sign(
    "RSA-SHA256",
    Buffer.from(`${header}.${payload}`),
    key.private_key.replace(/\\n/g, "\n")
  );
  const jwt = `${header}.${payload}.${sig.toString("base64url")}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  if (!res.ok) throw new Error(`token ${res.status}: ${await res.text()}`);
  return (await res.json()).access_token;
}

async function q(token, body) {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error(`gsc ${res.status}: ${await res.text()}`);
  return (await res.json()).rows || [];
}

const token = await getAccessToken();

const WINDOWS = {
  before: { startDate: "2026-06-15", endDate: "2026-06-25" },
  after: { startDate: "2026-07-02", endDate: "2026-07-12" },
};

const out = {};
for (const [name, win] of Object.entries(WINDOWS)) {
  const pages = await q(token, { ...win, dimensions: ["page"], rowLimit: 5000 });
  const queries = await q(token, { ...win, dimensions: ["query"], rowLimit: 5000 });
  const impr = pages.reduce((s, r) => s + r.impressions, 0);
  const clicks = pages.reduce((s, r) => s + r.clicks, 0);
  // Impression-weighted average position: an unweighted mean lets a page with
  // 1 impression at rank 3 mask a page with 5,000 impressions at rank 80.
  const wPos = impr ? pages.reduce((s, r) => s + r.position * r.impressions, 0) / impr : 0;
  out[name] = {
    window: `${win.startDate}..${win.endDate}`,
    pages: pages.length,
    queries: queries.length,
    impressions: impr,
    clicks,
    avgPosition: +wPos.toFixed(1),
    pageSet: new Set(pages.map((r) => r.keys[0])),
    top: pages.sort((a, b) => b.impressions - a.impressions).slice(0, 8),
  };
}

const b = out.before,
  a = out.after;
const pct = (x, y) => (x ? `${(((y - x) / x) * 100).toFixed(1)}%` : "n/a");

console.log(`GSC property: ${SITE}\n`);
console.log("                      BEFORE          AFTER          change");
console.log("                 " + "-".repeat(48));
console.log(`window           ${b.window}  ${a.window}`);
console.log(
  `pages w/ impr    ${String(b.pages).padStart(10)}  ${String(a.pages).padStart(13)}   ${pct(b.pages, a.pages)}`
);
console.log(
  `queries          ${String(b.queries).padStart(10)}  ${String(a.queries).padStart(13)}   ${pct(b.queries, a.queries)}`
);
console.log(
  `impressions      ${String(b.impressions).padStart(10)}  ${String(a.impressions).padStart(13)}   ${pct(b.impressions, a.impressions)}`
);
console.log(
  `clicks           ${String(b.clicks).padStart(10)}  ${String(a.clicks).padStart(13)}   ${pct(b.clicks, a.clicks)}`
);
console.log(
  `avg position     ${String(b.avgPosition).padStart(10)}  ${String(a.avgPosition).padStart(13)}   ${(a.avgPosition - b.avgPosition).toFixed(1)} ranks`
);

const survived = [...b.pageSet].filter((p) => a.pageSet.has(p));
const lost = [...b.pageSet].filter((p) => !a.pageSet.has(p));
console.log(`\npages present before AND after : ${survived.length}`);
console.log(`pages that vanished entirely   : ${lost.length}`);

console.log("\n--- verdict signal ---");
const pageDrop = b.pages ? (b.pages - a.pages) / b.pages : 0;
const posDrop = a.avgPosition - b.avgPosition;
if (pageDrop > 0.5 && posDrop < 15) {
  console.log("DEINDEXING / SERVING FAILURE: pages vanished from the index while");
  console.log("surviving pages held rank. Fix = restore crawl + reindex (fast).");
} else if (pageDrop < 0.3 && posDrop > 15) {
  console.log("ALGORITHMIC DEMOTION: pages still indexed but ranking far worse.");
  console.log("Fix = content quality (slow, months).");
} else {
  console.log(`MIXED / inconclusive — pageDrop=${(pageDrop * 100).toFixed(0)}%, posDrop=${posDrop.toFixed(1)} ranks.`);
}

console.log("\nTop pages BEFORE:");
for (const r of b.top)
  console.log(`  ${String(r.impressions).padStart(6)} impr  pos ${String(r.position.toFixed(1)).padStart(5)}  ${r.keys[0].replace("https://www.aversusb.net", "")}`);
console.log("\nTop pages AFTER:");
for (const r of a.top)
  console.log(`  ${String(r.impressions).padStart(6)} impr  pos ${String(r.position.toFixed(1)).padStart(5)}  ${r.keys[0].replace("https://www.aversusb.net", "")}`);
