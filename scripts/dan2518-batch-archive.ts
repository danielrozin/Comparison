/**
 * DAN-2518 — batch archive tool for the PATH A corpus consolidation (DAN-2159).
 *
 * Takes a CSV slug list and retires those /compare/* pages in bulk, with an
 * audit trail and a rollback file for every run.
 *
 * CSV format (header required):
 *
 *   slug,action,target
 *   messi-vs-ronaldo-2026,noindex,
 *   ronaldo-vs-messi,redirect_to,messi-vs-ronaldo
 *
 * `target` may also be inlined as `redirect_to:messi-vs-ronaldo` in the action
 * column; both spellings are accepted so a two-column CSV works.
 *
 * Actions
 *   noindex      → status="archived". The row leaves the sitemap
 *                  (canonicalComparisonWhere) and /compare/{slug} 404s via
 *                  getStaticProps (DAN-1886/DAN-2065). The row and its content
 *                  are preserved, so republishing is a one-column update.
 *   redirect_to  → status="archived" AND the slug is written into
 *                  compare-batch-archive-redirects.generated.ts, which
 *                  next.config.ts redirects() serves at the edge.
 *
 * Safety
 *   - Dry run by default; nothing is written without --apply.
 *   - Hard cap of 500 rows per batch (MAX_BATCH).
 *   - Idempotent: rows already archived are counted as no-ops, not errors.
 *   - Refuses a redirect whose target is not a published, non-redirected slug
 *     (DAN-2045: a redirect onto a 404 is worse than the 404).
 *   - Refuses to archive a slug that is a redirect *target* for something else.
 *   - Writes archive-batches/{batchId}.json (rollback) + .log (audit trail).
 *
 * Usage
 *   npx tsx scripts/dan2518-batch-archive.ts --csv batch.csv                 # dry run
 *   npx tsx scripts/dan2518-batch-archive.ts --csv batch.csv --apply
 *   npx tsx scripts/dan2518-batch-archive.ts --csv batch.csv --apply --indexnow
 *   npx tsx scripts/dan2518-batch-archive.ts --rollback archive-batches/<id>.json --apply
 *
 * After an --apply run that produced redirects, commit the regenerated
 * compare-batch-archive-redirects.generated.ts and deploy — the DB change is
 * live immediately but the edge redirect only exists after a build.
 */
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const MAX_BATCH = 500;
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aversusb.net";
const BATCH_DIR = path.join(process.cwd(), "archive-batches");
const GENERATED_REDIRECTS = path.join(
  process.cwd(),
  "src/lib/redirects/compare-batch-archive-redirects.generated.ts",
);

type Action = "noindex" | "redirect_to";
type Row = { slug: string; action: Action; target?: string };
type RollbackEntry = { slug: string; previousStatus: string; action: Action; target?: string };

function parseArgs(argv: string[]) {
  const get = (flag: string) => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  return {
    csv: get("--csv"),
    rollback: get("--rollback"),
    apply: argv.includes("--apply"),
    indexnow: argv.includes("--indexnow"),
    batchId: get("--batch-id"),
  };
}

/**
 * Minimal CSV reader. The slug list is machine-generated (slugs are
 * `[a-z0-9-]+`), so quoted fields and embedded commas cannot occur — a real CSV
 * parser would add a dependency for no reachable case.
 */
function parseCsv(file: string): Row[] {
  const lines = fs
    .readFileSync(file, "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#"));

  if (lines.length === 0) throw new Error(`${file} is empty`);

  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const iSlug = header.indexOf("slug");
  const iAction = header.indexOf("action");
  const iTarget = header.indexOf("target");
  if (iSlug < 0 || iAction < 0) {
    throw new Error(`${file}: header must contain "slug" and "action" columns (got: ${header.join(",")})`);
  }

  const rows: Row[] = [];
  const seen = new Set<string>();
  for (const line of lines.slice(1)) {
    const cells = line.split(",").map((c) => c.trim());
    const slug = cells[iSlug];
    let action = cells[iAction];
    let target = iTarget >= 0 ? cells[iTarget] : undefined;

    if (!slug) continue;
    // `redirect_to:survivor-slug` inline form (keeps two-column CSVs working).
    if (action?.startsWith("redirect_to:")) {
      target = action.slice("redirect_to:".length).trim();
      action = "redirect_to";
    }
    if (action !== "noindex" && action !== "redirect_to") {
      throw new Error(`${file}: unknown action "${action}" for slug "${slug}" (expected noindex | redirect_to)`);
    }
    if (action === "redirect_to" && !target) {
      throw new Error(`${file}: action redirect_to for "${slug}" has no target slug`);
    }
    if (target && target === slug) {
      throw new Error(`${file}: "${slug}" redirects to itself`);
    }
    if (seen.has(slug)) throw new Error(`${file}: duplicate slug "${slug}"`);
    seen.add(slug);

    rows.push({ slug, action: action as Action, target: target || undefined });
  }

  if (rows.length > MAX_BATCH) {
    throw new Error(`${file}: ${rows.length} rows exceeds the ${MAX_BATCH}-row batch cap — split the file`);
  }
  return rows;
}

/** Re-emit the generated redirect layer with `additions` merged in. */
function writeGeneratedRedirects(additions: Record<string, string>, existing: Record<string, string>) {
  const merged = { ...existing, ...additions };
  const entries = Object.keys(merged)
    .sort()
    .map((from) => `  ${JSON.stringify(from)}: ${JSON.stringify(merged[from])},`)
    .join("\n");

  const source = fs.readFileSync(GENERATED_REDIRECTS, "utf8");
  const head = source.slice(0, source.indexOf("export const BATCH_ARCHIVE_CONSOLIDATIONS_DAN2518"));
  const body = entries.length
    ? entries
    : "  // (no batches applied yet — Phase 1 archive runs against this file)";

  fs.writeFileSync(
    GENERATED_REDIRECTS,
    `${head}export const BATCH_ARCHIVE_CONSOLIDATIONS_DAN2518: Record<string, string> = {\n${body}\n};\n`,
  );
  return merged;
}

async function loadExistingRedirects(): Promise<Record<string, string>> {
  const mod = await import("../src/lib/redirects/compare-batch-archive-redirects.generated");
  return { ...mod.BATCH_ARCHIVE_CONSOLIDATIONS_DAN2518 };
}

async function fireIndexNow(urls: string[]) {
  if (urls.length === 0) return;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.CRON_SECRET) headers.Authorization = `Bearer ${process.env.CRON_SECRET}`;
  const res = await fetch(`${SITE}/api/indexnow`, {
    method: "POST",
    headers,
    body: JSON.stringify({ urls }),
  });
  console.log(`IndexNow: ${res.status} for ${urls.length} archived URL(s) — ${await res.text()}`);
}

async function rollback(file: string, apply: boolean) {
  const entries: RollbackEntry[] = JSON.parse(fs.readFileSync(file, "utf8")).entries;
  console.log(`Rollback ${file}: restoring ${entries.length} row(s)`);
  if (!apply) {
    for (const e of entries) console.log(`  would restore ${e.slug} → ${e.previousStatus}`);
    console.log("\nDRY RUN — re-run with --apply.");
    return;
  }
  for (const e of entries) {
    await prisma.comparison.updateMany({ where: { slug: e.slug }, data: { status: e.previousStatus } });
  }
  // Drop any redirects this batch introduced.
  const introduced = entries.filter((e) => e.action === "redirect_to").map((e) => e.slug);
  if (introduced.length) {
    const existing = await loadExistingRedirects();
    for (const slug of introduced) delete existing[slug];
    writeGeneratedRedirects({}, existing);
    console.log(`Removed ${introduced.length} redirect(s) from the generated map — commit + deploy to take effect.`);
  }
  console.log(`Restored ${entries.length} row(s).`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.rollback) return rollback(args.rollback, args.apply);
  if (!args.csv) {
    console.error("Usage: --csv <file> [--apply] [--indexnow] | --rollback <file> --apply");
    process.exit(1);
  }

  const rows = parseCsv(args.csv);
  const batchId = args.batchId || `batch-${path.basename(args.csv).replace(/\W+/g, "-")}-${rows.length}`;
  console.log(`Batch ${batchId}: ${rows.length} row(s) from ${args.csv}\n`);

  // --- Validate against the DB -------------------------------------------
  const slugs = rows.map((r) => r.slug);
  const targets = rows.filter((r) => r.target).map((r) => r.target!);
  const dbRows = await prisma.comparison.findMany({
    where: { slug: { in: [...new Set([...slugs, ...targets])] } },
    select: { slug: true, status: true },
  });
  const statusBySlug = new Map(dbRows.map((r) => [r.slug, r.status]));

  const { isRedirectedCompareSlug } = await import("../src/lib/redirects/compare-redirects");

  const errors: string[] = [];
  const skipped: string[] = [];
  const actionable: Row[] = [];
  const targetSlugs = new Set(targets);

  for (const row of rows) {
    const status = statusBySlug.get(row.slug);
    if (!status) {
      errors.push(`${row.slug}: no such comparison row`);
      continue;
    }
    if (targetSlugs.has(row.slug)) {
      errors.push(`${row.slug}: is a redirect target in this same batch — cannot also be archived`);
      continue;
    }
    if (row.action === "redirect_to") {
      const targetStatus = statusBySlug.get(row.target!);
      if (targetStatus !== "published") {
        // DAN-2045: never point a redirect at a page that does not render.
        errors.push(`${row.slug}: target "${row.target}" is ${targetStatus ?? "missing"}, not published`);
        continue;
      }
      if (isRedirectedCompareSlug(row.target!)) {
        errors.push(`${row.slug}: target "${row.target}" is itself a redirect source — would chain`);
        continue;
      }
    }
    if (status === "archived") {
      skipped.push(`${row.slug} (already archived)`);
      // Still emit the redirect: archiving and redirecting are separate steps and
      // a previous run may have done only the first.
      if (row.action === "redirect_to") actionable.push(row);
      continue;
    }
    actionable.push(row);
  }

  if (errors.length) {
    console.error(`REFUSING BATCH — ${errors.length} invalid row(s):`);
    for (const e of errors) console.error(`  ✗ ${e}`);
    process.exit(1);
  }

  const toArchive = actionable.filter((r) => statusBySlug.get(r.slug) !== "archived");
  const redirects = Object.fromEntries(
    actionable.filter((r) => r.action === "redirect_to").map((r) => [r.slug, r.target!]),
  );

  console.log(`  archive:  ${toArchive.length}`);
  console.log(`  redirect: ${Object.keys(redirects).length}`);
  console.log(`  no-op:    ${skipped.length}`);
  for (const s of skipped) console.log(`    - ${s}`);

  if (!args.apply) {
    console.log("\nDRY RUN — no writes. Re-run with --apply.");
    return;
  }

  // --- Apply --------------------------------------------------------------
  fs.mkdirSync(BATCH_DIR, { recursive: true });
  // Every actionable row, not just the newly-archived ones: a redirect emitted
  // for a slug that was ALREADY archived still needs to be undoable, and
  // restoring previousStatus="archived" on it is a no-op.
  const rollbackEntries: RollbackEntry[] = actionable.map((r) => ({
    slug: r.slug,
    previousStatus: statusBySlug.get(r.slug)!,
    action: r.action,
    target: r.target,
  }));
  const stamp = new Date().toISOString();
  // Rollback file is written BEFORE the mutation so a crash mid-batch is still
  // recoverable.
  fs.writeFileSync(
    path.join(BATCH_DIR, `${batchId}.json`),
    JSON.stringify({ batchId, csv: args.csv, appliedAt: stamp, entries: rollbackEntries }, null, 2),
  );

  let archived = 0;
  const log: string[] = [`# ${batchId} applied ${stamp}`];
  for (const r of toArchive) {
    const res = await prisma.comparison.updateMany({
      where: { slug: r.slug, status: { not: "archived" } },
      data: { status: "archived" },
    });
    archived += res.count;
    log.push(`${r.slug}\t${statusBySlug.get(r.slug)} -> archived\t${r.action}${r.target ? ` -> ${r.target}` : ""}`);
  }

  let redirectTotal = 0;
  if (Object.keys(redirects).length) {
    const merged = writeGeneratedRedirects(redirects, await loadExistingRedirects());
    redirectTotal = Object.keys(merged).length;
    log.push(`generated redirects: +${Object.keys(redirects).length} (${redirectTotal} total in layer)`);
  }

  fs.writeFileSync(path.join(BATCH_DIR, `${batchId}.log`), log.join("\n") + "\n");

  console.log(`\nArchived ${archived} row(s). Rollback: archive-batches/${batchId}.json`);

  if (args.indexnow) {
    await fireIndexNow(toArchive.map((r) => `${SITE}/compare/${r.slug}`));
  } else {
    console.log("(skipped IndexNow — pass --indexnow to request recrawl of the archived URLs)");
  }

  if (redirectTotal) {
    console.log(
      `\nNEXT: commit compare-batch-archive-redirects.generated.ts and deploy — the edge 301s do not exist until a build ships.`,
    );
  }
  console.log(
    `NEXT: lower CANONICAL_COMPARISON_COUNT_FALLBACK by ${archived} in the same PR (corpus-count-truthfulness.test.ts enforces this).`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
