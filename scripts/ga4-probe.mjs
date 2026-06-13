/**
 * GA4 read-path probe for DAN-710.
 * Reuses the same SA JWT auth as gsc-service.ts but with the analytics.readonly scope.
 * 1) Mints an access token.
 * 2) Lists GA4 account summaries (Admin API) the SA can see -> finds the numeric property ID.
 * 3) If a property is found, runs a Data API report for /compare/* sessions across both windows.
 * Read-only. Prints results to stdout. No secrets are printed.
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";

// --- load GOOGLE_SERVICE_ACCOUNT_KEY from .env.local without extra deps ---
function loadKey() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  const txt = fs.readFileSync(envPath, "utf8");
  const m = txt.match(/^GOOGLE_SERVICE_ACCOUNT_KEY=(.*)$/m);
  if (!m) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY not found in .env.local");
  let val = m[1].trim();
  if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
    val = val.slice(1, -1);
  }
  return JSON.parse(val);
}

async function getToken(key, scope) {
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({
      iss: key.client_email,
      scope,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  ).toString("base64url");
  const signature = crypto.sign("RSA-SHA256", Buffer.from(`${header}.${payload}`), key.private_key);
  const jwt = `${header}.${payload}.${signature.toString("base64url")}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`token exchange ${res.status}: ${text}`);
  return JSON.parse(text).access_token;
}

async function main() {
  const key = loadKey();
  console.log("SA:", key.client_email);
  console.log("project:", key.project_id);

  let token;
  try {
    token = await getToken(key, "https://www.googleapis.com/auth/analytics.readonly");
    console.log("TOKEN: ok (analytics.readonly)");
  } catch (e) {
    console.log("TOKEN: FAILED ->", e.message);
    return;
  }

  // --- Admin API: list account summaries (properties the SA has access to) ---
  console.log("\n=== GA4 Admin API: accountSummaries ===");
  const adminRes = await fetch(
    "https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const adminText = await adminRes.text();
  console.log("status:", adminRes.status);
  if (!adminRes.ok) {
    console.log("body:", adminText.slice(0, 800));
    console.log("\n>>> SA cannot list GA4 properties. Either Admin API not enabled or SA has no property access.");
    return;
  }
  const admin = JSON.parse(adminText);
  const summaries = admin.accountSummaries || [];
  if (summaries.length === 0) {
    console.log(">>> Auth works but SA has access to ZERO GA4 properties. Needs Viewer grant on the property.");
    return;
  }
  const props = [];
  for (const acct of summaries) {
    for (const p of acct.propertySummaries || []) {
      props.push({ account: acct.displayName, property: p.property, name: p.displayName });
    }
  }
  console.log(JSON.stringify(props, null, 2));

  // --- Try to identify the property for G-0BWYZ5V9QK and report /compare/* sessions ---
  // We do not have a direct measurementId->property map via v1beta easily; report on each candidate.
  const windows = [
    { name: "Mar30-May22", start: "2026-03-30", end: "2026-05-22" },
    { name: "last7days", start: "7daysAgo", end: "today" },
  ];
  for (const pr of props) {
    console.log(`\n=== Data API report for ${pr.property} (${pr.name}) ===`);
    for (const w of windows) {
      const body = {
        dateRanges: [{ startDate: w.start, endDate: w.end }],
        dimensions: [],
        metrics: [{ name: "sessions" }, { name: "totalUsers" }, { name: "screenPageViews" }],
        dimensionFilter: {
          filter: {
            fieldName: "pagePath",
            stringFilter: { matchType: "BEGINS_WITH", value: "/compare/" },
          },
        },
      };
      const r = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/${pr.property}:runReport`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const t = await r.text();
      if (!r.ok) {
        console.log(`  [${w.name}] status ${r.status}: ${t.slice(0, 300)}`);
        continue;
      }
      const data = JSON.parse(t);
      const row = data.rows?.[0]?.metricValues?.map((m) => m.value) || ["0", "0", "0"];
      console.log(`  [${w.name}] /compare/* sessions=${row[0]} users=${row[1]} views=${row[2]}`);
    }
  }
}

main().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
