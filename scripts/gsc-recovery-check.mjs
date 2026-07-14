/**
 * GSC recovery check — daily clicks/impressions, site-wide and /compare/*.
 * Measures the June 2026 spam-update hit and tests whether recovery has begun.
 *
 * Usage: node scripts/gsc-recovery-check.mjs [days]
 */
import crypto from "crypto";
import fs from "fs";

// Load .env.local without extra deps (values may be quoted / contain '=').
for (const file of [".env.local", ".env"]) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}

const SITE = process.env.GSC_SITE_URL || "sc-domain:aversusb.net";
const DAYS = Number(process.argv[2] || 120);

async function getAccessToken() {
  const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  const header = Buffer.from(
    JSON.stringify({ alg: "RS256", typ: "JWT" })
  ).toString("base64url");
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

async function query(token, body) {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      SITE
    )}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error(`gsc ${res.status}: ${await res.text()}`);
  return (await res.json()).rows || [];
}

const iso = (d) => d.toISOString().slice(0, 10);
const end = new Date(Date.now() - 2 * 864e5); // GSC lags ~2 days
const start = new Date(end.getTime() - DAYS * 864e5);

const token = await getAccessToken();
const base = { startDate: iso(start), endDate: iso(end), dimensions: ["date"], rowLimit: 500 };

const all = await query(token, base);
const cmp = await query(token, {
  ...base,
  dimensionFilterGroups: [
    { filters: [{ dimension: "page", operator: "contains", expression: "/compare/" }] },
  ],
});

const byDate = new Map();
for (const r of all)
  byDate.set(r.keys[0], { date: r.keys[0], allClicks: r.clicks, allImpr: r.impressions, cmpClicks: 0, cmpImpr: 0 });
for (const r of cmp) {
  const e = byDate.get(r.keys[0]);
  if (e) {
    e.cmpClicks = r.clicks;
    e.cmpImpr = r.impressions;
  }
}
const rows = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));

// Weekly rollup — daily GSC numbers are too noisy to read a trend off.
const weeks = new Map();
for (const r of rows) {
  const d = new Date(r.date);
  const monday = new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * 864e5);
  const k = iso(monday);
  const w = weeks.get(k) || { week: k, allClicks: 0, allImpr: 0, cmpClicks: 0, cmpImpr: 0, days: 0 };
  w.allClicks += r.allClicks;
  w.allImpr += r.allImpr;
  w.cmpClicks += r.cmpClicks;
  w.cmpImpr += r.cmpImpr;
  w.days++;
  weeks.set(k, w);
}

console.log(`GSC property: ${SITE}`);
console.log(`Range: ${iso(start)} → ${iso(end)}  (${rows.length} days with data)\n`);
console.log("week (Mon)   days |  site clicks   site impr | /compare/ clicks  /compare/ impr");
console.log("-".repeat(84));
for (const w of [...weeks.values()].sort((a, b) => a.week.localeCompare(b.week))) {
  console.log(
    `${w.week}   ${String(w.days).padStart(2)} | ${String(w.allClicks).padStart(11)} ${String(
      w.allImpr
    ).padStart(11)} | ${String(w.cmpClicks).padStart(15)} ${String(w.cmpImpr).padStart(15)}` +
      (w.days < 7 ? "   (partial)" : "")
  );
}

fs.writeFileSync(
  "gsc-recovery-daily.json",
  JSON.stringify({ site: SITE, start: iso(start), end: iso(end), rows }, null, 2)
);
console.log("\nDaily rows written to gsc-recovery-daily.json");
