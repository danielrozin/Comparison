/**
 * Ask Google directly why the vanished URLs are not indexed.
 * Uses the GSC URL Inspection API — returns coverageState / verdict / robots /
 * page-fetch status per URL, which is the only authoritative answer to
 * "deindexed for quality" vs "never crawled" vs "blocked".
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

const URLS = [
  // top pre-collapse traffic drivers that vanished
  "https://www.aversusb.net/compare/messi-vs-ronaldo",
  "https://www.aversusb.net/compare/youtube-music-vs-soundcloud",
  "https://www.aversusb.net/compare/medium-vs-substack",
  "https://www.aversusb.net/compare/real-madrid-vs-barcelona-trophies-all-time-2026",
  // a survivor, as control
  "https://www.aversusb.net/compare/splunk-vs-datadog",
  // homepage, as control
  "https://www.aversusb.net/",
];

const token = await getAccessToken();

for (const u of URLS) {
  const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inspectionUrl: u, siteUrl: SITE }),
  });
  if (!res.ok) {
    console.log(`${u}\n  ERROR ${res.status}: ${(await res.text()).slice(0, 200)}\n`);
    continue;
  }
  const r = (await res.json()).inspectionResult || {};
  const idx = r.indexStatusResult || {};
  console.log(u.replace("https://www.aversusb.net", "") || "/");
  console.log(`  verdict          : ${idx.verdict}`);
  console.log(`  coverageState    : ${idx.coverageState}`);
  console.log(`  robotsTxtState   : ${idx.robotsTxtState}`);
  console.log(`  indexingState    : ${idx.indexingState}`);
  console.log(`  pageFetchState   : ${idx.pageFetchState}`);
  console.log(`  lastCrawlTime    : ${idx.lastCrawlTime || "never"}`);
  console.log(`  googleCanonical  : ${(idx.googleCanonical || "-").replace("https://www.aversusb.net", "")}`);
  console.log(`  userCanonical    : ${(idx.userCanonical || "-").replace("https://www.aversusb.net", "")}`);
  console.log();
}
