/**
 * DAN-2160 Wave 7 — Final depth improvements + targeted internal links
 *
 * Actions:
 *  A. WW1 vs WW2 — expand keyDifferences 8→12, update expertAnalysis to
 *     specifically address "why is WW2 more famous than WW1" (pos 20 keyword)
 *  B. Internal links:
 *     · us-navy-vs-us-army → ww1-vs-ww2 (military authority signal)
 *     · marines-vs-army → ww1-vs-ww2
 *     · allstate-vs-geico → farmers-insurance-vs-state-farm
 *     · geico-vs-usaa → farmers-insurance-vs-state-farm
 *     · geico-vs-liberty-mutual → farmers-insurance-vs-state-farm
 *     · costco-vs-sam-s-club → ikea-vs-wayfair (retail authority)
 *  C. Update metaTitle for Kobe page to cover "kobe vs lebron accolades" more precisely
 *  D. Touch freshness on all modified pages + sitemap submit
 *
 * Run:
 *   node scripts/dan2160-wave7-final-depth.mjs --dry
 *   node scripts/dan2160-wave7-final-depth.mjs
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleAuth } from "google-auth-library";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const prisma = new PrismaClient();
const DRY = process.argv.includes("--dry");
const log = (...a) => console.log(...a);

// ── helpers ──────────────────────────────────────────────────────────────────

async function setKeyDiffs(slug, newDiffs) {
  const comp = await prisma.comparison.findUnique({ where: { slug }, select: { keyDifferences: true } });
  if (!comp) { log(`  ! skip: not found: ${slug}`); return; }
  const existing = Array.isArray(comp.keyDifferences) ? comp.keyDifferences : [];
  const existingLabels = new Set(existing.map(d => d.label?.toLowerCase()));
  const toAdd = newDiffs.filter(d => !existingLabels.has(d.label?.toLowerCase()));
  const merged = [...existing, ...toAdd];
  if (toAdd.length === 0) { log(`  skip (all keyDiffs exist): ${slug}`); return; }
  if (!DRY) {
    await prisma.comparison.update({ where: { slug }, data: { keyDifferences: merged } });
  }
  log(`  ${DRY ? "[DRY]" : "✓"} keyDiffs ${existing.length}→${merged.length} (+${toAdd.length}): ${slug}`);
}

async function setExpertAnalysis(slug, analysisText) {
  const comp = await prisma.comparison.findUnique({ where: { slug }, select: { content: true } });
  if (!comp) { log(`  ! skip: not found: ${slug}`); return; }
  const content = (comp.content && typeof comp.content === 'object') ? comp.content : {};
  if (!DRY) {
    await prisma.comparison.update({
      where: { slug },
      data: { content: { ...content, expertAnalysis: analysisText } }
    });
  }
  log(`  ${DRY ? "[DRY]" : "✓"} expertAnalysis updated (${analysisText.length} chars): ${slug}`);
}

async function updateMeta(slug, metaTitle, metaDescription) {
  if (!DRY) {
    await prisma.comparison.update({ where: { slug }, data: { metaTitle, metaDescription } });
  }
  log(`  ${DRY ? "[DRY]" : "✓"} meta updated: ${slug}`);
}

async function touchFreshness(slug) {
  if (!DRY) {
    await prisma.comparison.update({ where: { slug }, data: { updatedAt: new Date() } });
  }
  log(`  ${DRY ? "[DRY]" : "✓"} touched: ${slug}`);
}

async function upsertLink({ fromPath, toPath, anchorText, linkType = "related", score = 1.0 }) {
  const existing = await prisma.internalLink.findFirst({ where: { fromPath, toPath } });
  if (existing) { log(`  skip (exists): ${fromPath} → ${toPath}`); return false; }
  const fromSlug = fromPath.replace("/compare/", "").replace("/blog/", "");
  const fromComp = await prisma.comparison.findFirst({
    where: { slug: fromSlug, status: "published" }, select: { id: true },
  });
  const fromBlog = fromComp ? null : await prisma.blogArticle.findFirst({
    where: { slug: fromSlug, status: "published" }, select: { id: true },
  });
  if (!fromComp && !fromBlog) { log(`  · skip (source not published): ${fromPath}`); return false; }
  if (!DRY) {
    await prisma.internalLink.create({
      data: { fromPath, toPath, anchorText, linkType, position: "inline", score },
    });
  }
  log(`  ${DRY ? "[DRY]" : "✓"} link: ${fromPath} → ${toPath}`);
  return true;
}

// ── A. WW1 vs WW2 — keyDiffs 8→12 ───────────────────────────────────────────

log("\n── A. ww1-vs-ww2: expand keyDifferences 8→12 ──");

await setKeyDiffs("ww1-vs-ww2", [
  {
    label: "Civilian Deaths",
    winner: "tie",
    entityAValue: "~7 million civilians",
    entityBValue: "~45–55 million civilians",
    note: "WW2 deliberately targeted civilians; WW1 civilian deaths were largely from disease and famine"
  },
  {
    label: "Geographic Scope",
    winner: "tie",
    entityAValue: "Mainly Europe & Middle East",
    entityBValue: "Truly global: Europe, Pacific, Asia, Africa, Americas"
  },
  {
    label: "Air & Naval Power",
    winner: "tie",
    entityAValue: "Early biplanes; U-boat submarine campaign",
    entityBValue: "Strategic bombing, jet aircraft, radar; carrier-based Pacific war"
  },
  {
    label: "Economic Cost",
    winner: "tie",
    entityAValue: "~$186 billion (1913 dollars)",
    entityBValue: "~$4.1 trillion (1940s dollars) — 20× greater"
  }
]);

log("\n── A2. ww1-vs-ww2: update expertAnalysis ──");

await setExpertAnalysis("ww1-vs-ww2", `The single sharpest distinction between these two conflicts is scale of destruction, and it determines everything else about how historians, educators, and researchers approach each war. World War II was categorically larger in every measurable dimension — longer in duration (six years, 1939–1945, vs. four years for WW1), deadlier (70–85 million deaths vs. 20 million), and geographically broader (truly global across six continents vs. primarily European).

Why is WW2 more famous than WW1? Several factors converge. First, WW2's outcomes are more vivid and ongoing: the Holocaust, the atomic bombings of Hiroshima and Nagasaki, the founding of the United Nations, and the post-war order still shape geopolitics today. Second, WW2 produced clearer moral narratives — the Allied fight against Nazi Germany and Imperial Japan is widely taught as a defining struggle against fascism and genocide. Third, WW2's technology (nuclear weapons, jet aircraft, radar, rockets) directly gave rise to modern science and the Cold War arms race, making its legacy far more tangible in daily life.

WW1, by contrast, is the "forgotten war" outside Europe. Its causes (alliance systems, colonial rivalries, a single assassination) feel remote, its trench warfare is grimly repetitive, and its outcome (a flawed peace treaty) set the stage for WW2 without dramatically reshaping the world order. Europeans study WW1 intensely — it shaped France, Germany, and Britain profoundly — but globally, WW2's drama, scale, and ongoing legacy overshadow it.

For researchers and students: WW1 is essential context for WW2. WW2 cannot be understood without WW1's unresolved grievances (German humiliation by the Treaty of Versailles, economic instability, collapsed empires). In academic literature, WW1 receives more recent scholarly attention as historians reassess its causes — but in popular consciousness, WW2's Holocaust documentation, Allied heroism narratives, and nuclear legacy keep it permanently in the foreground.`);

log("\n── A3. ww1-vs-ww2: internal links ──");

await upsertLink({
  fromPath: "/compare/us-navy-vs-us-army",
  toPath: "/compare/ww1-vs-ww2",
  anchorText: "WW1 vs WW2: how America's wars compare"
});
await upsertLink({
  fromPath: "/compare/marines-vs-army",
  toPath: "/compare/ww1-vs-ww2",
  anchorText: "World War 1 vs World War 2"
});

await touchFreshness("ww1-vs-ww2");

// ── B. Farmers Insurance vs State Farm — more insurance links ─────────────────

log("\n── B. farmers-insurance-vs-state-farm: insurance site links ──");

await upsertLink({
  fromPath: "/compare/allstate-vs-geico",
  toPath: "/compare/farmers-insurance-vs-state-farm",
  anchorText: "Farmers vs State Farm home insurance comparison"
});
await upsertLink({
  fromPath: "/compare/geico-vs-usaa",
  toPath: "/compare/farmers-insurance-vs-state-farm",
  anchorText: "Farmers Insurance vs State Farm"
});
await upsertLink({
  fromPath: "/compare/geico-vs-liberty-mutual",
  toPath: "/compare/farmers-insurance-vs-state-farm",
  anchorText: "Farmers Insurance vs State Farm home insurance"
});

await touchFreshness("farmers-insurance-vs-state-farm");

// ── C. IKEA vs Wayfair — retail link ─────────────────────────────────────────

log("\n── C. ikea-vs-wayfair: retail link ──");

await upsertLink({
  fromPath: "/compare/costco-vs-sam-s-club",
  toPath: "/compare/ikea-vs-wayfair",
  anchorText: "IKEA vs Wayfair: which has better home furnishings?"
});

await touchFreshness("ikea-vs-wayfair");

// ── D. Kobe vs LeBron — meta refinement for "accolades" query ────────────────

log("\n── D. kobe-bryant-vs-lebron-james: meta refinement ──");

await updateMeta(
  "kobe-bryant-vs-lebron-james",
  "Kobe Bryant vs LeBron James: Career Stats, Accolades & GOAT Comparison",
  "Kobe Bryant vs LeBron James: 5 rings vs 4, 81-point game vs quadruple-doubles, scoring avg 25.0 vs 27.1. Full accolades, career stats & GOAT verdict — 2026 update."
);

await touchFreshness("kobe-bryant-vs-lebron-james");

// ── E. Submit sitemap ─────────────────────────────────────────────────────────

log("\n── E. Submit sitemap to Google Search Console ──");

if (!DRY) {
  try {
    const auth = new GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
      scopes: ["https://www.googleapis.com/auth/webmasters"],
    });
    const client = await auth.getClient();
    const { token } = await client.getAccessToken();
    const siteUrl = "sc-domain:aversusb.net";
    const sitemapUrl = "https://www.aversusb.net/sitemap.xml";
    const res = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
      { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok || res.status === 204) {
      log("  ✓ Sitemap submitted to GSC");
    } else {
      const body = await res.text();
      log(`  ⚠ GSC sitemap submit: ${res.status} ${body.slice(0, 200)}`);
    }
  } catch (e) {
    log(`  ⚠ GSC submit error: ${e.message}`);
  }
} else {
  log("  [DRY] Would submit sitemap to GSC");
}

// ── Summary ──────────────────────────────────────────────────────────────────

log("\n══════════════════════════════════════════════════");
log("  Wave 7 complete");
log("  · ww1-vs-ww2: keyDiffs 8→12, expertAnalysis updated, 2 new links");
log("  · farmers-insurance-vs-state-farm: 3 new insurance-site links");
log("  · ikea-vs-wayfair: 1 new retail link");
log("  · kobe-bryant-vs-lebron-james: meta refined for accolades query");
log("  Next: re-run node scripts/ppc-gate-status.mjs in 4-7 days");
log("══════════════════════════════════════════════════");

await prisma.$disconnect();
