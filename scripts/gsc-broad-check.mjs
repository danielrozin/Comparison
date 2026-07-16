/**
 * Broad GSC check — what are our actual top rankings?
 */
import { GoogleAuth } from "google-auth-library";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const KEY = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
const SITE = "sc-domain:aversusb.net";

async function getToken() {
  const auth = new GoogleAuth({
    credentials: KEY,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  return token;
}

const end = new Date("2026-07-14");
const start = new Date("2026-07-07");
const startDate = start.toISOString().split("T")[0];
const endDate = end.toISOString().split("T")[0];

const token = await getToken();

// All keywords in top 20 with 1+ impressions
const res = await fetch(
  `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
  {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit: 500,
      startRow: 0,
    }),
  }
);
const data = await res.json();
if (data.error) { console.error(data.error); process.exit(1); }
const rows = data.rows || [];
console.log(`Total rows returned: ${rows.length}`);

// Page 1
const p1 = rows.filter(r => r.position <= 10).sort((a,b) => a.position - b.position);
const p2 = rows.filter(r => r.position > 10 && r.position <= 20).sort((a,b) => a.position - b.position);

console.log(`\n=== PAGE 1 (pos ≤10): ${p1.length} keywords ===`);
for (const r of p1.slice(0, 30)) {
  console.log(`  pos ${r.position.toFixed(1).padStart(5)}  impr=${String(r.impressions).padStart(5)}  clicks=${r.clicks}  "${r.keys[0]}"`);
}

console.log(`\n=== STRIKING DISTANCE (pos 10-20): ${p2.length} keywords ===`);
for (const r of p2.slice(0, 40)) {
  console.log(`  pos ${r.position.toFixed(1).padStart(5)}  impr=${String(r.impressions).padStart(5)}  clicks=${r.clicks}  "${r.keys[0]}"`);
}

// Check specific target queries with wider date range
console.log(`\n=== TARGET QUERIES — 30-day range ===`);
const res2 = await fetch(
  `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
  {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      startDate: "2026-06-15",
      endDate: "2026-07-14",
      dimensions: ["query"],
      rowLimit: 500,
    }),
  }
);
const data2 = await res2.json();
const rows2 = data2.rows || [];
const targets = ["ww1 vs ww2","soundcloud vs youtube music","expedia","capital one vs chase","ikea vs wayfair","kobe","youtube music vs soundcloud","virat kohli","macbook air vs macbook pro","amazon vs best buy","farmers insurance vs state farm"];
for (const kw of targets) {
  const match = rows2.filter(r => r.keys[0].includes(kw.toLowerCase()) || kw.toLowerCase().includes(r.keys[0]));
  for (const m of match.slice(0,3)) {
    console.log(`  pos ${m.position.toFixed(1).padStart(5)}  impr=${m.impressions}  "${m.keys[0]}"`);
  }
}
