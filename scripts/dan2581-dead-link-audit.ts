/**
 * DAN-2581 — full-site internal dead-link audit.
 *
 * Crawls every URL in the live sitemap, extracts every internal anchor, and
 * status-checks each distinct target WITHOUT following redirects, so a 301 source
 * is reported separately from a hard 404. Reports both by target and by the source
 * section that emitted the link, because the fix always lives at the source.
 *
 * This is the measurement that found the defect: 680 dead targets across 444 of
 * 1,948 pages on 2026-07-21, 764 of them on /blog. Re-run it after any consolidation
 * batch — the canonical catalog shrinks every time, and every surface that stores a
 * `/compare/*` target instead of resolving one at render will rot again.
 *
 *   npx tsx scripts/dan2581-dead-link-audit.ts [--base https://www.aversusb.net]
 *
 * Needs no credentials: it reads production over HTTP exactly as a crawler would.
 * Exits non-zero when any dead link is found, so it can gate a deploy.
 */

const BASE =
  process.argv.find((a) => a.startsWith("--base="))?.slice("--base=".length) ??
  "https://www.aversusb.net";

const UA = "Mozilla/5.0 (compatible; aversusb-linkaudit/1.0; DAN-2581)";
const CONCURRENCY = 12;

/** Sections whose links we resolve. Anything else is off-site or non-indexable. */
const LINK_RE = /href="(\/(?:entity|alternatives|compare|category|best|blog|hub)\/[^"#?]*)"/g;

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out = new Array<R>(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      for (;;) {
        const i = cursor++;
        if (i >= items.length) return;
        out[i] = await fn(items[i]);
      }
    })
  );
  return out;
}

async function text(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  return res.ok ? res.text() : "";
}

function section(url: string): string {
  const path = url.replace(BASE, "");
  return "/" + (path.split("/")[1] || "");
}

async function sitemapUrls(): Promise<string[]> {
  const index = await text(`${BASE}/sitemap.xml`);
  const children = Array.from(index.matchAll(/<loc>([^<]+)<\/loc>/g))
    .map((m) => m[1])
    // video/image sitemaps carry no crawlable page URLs of their own
    .filter((u) => /\/sitemap\/\d+\.xml$/.test(u));

  const pages = new Set<string>();
  for (const child of children) {
    for (const m of (await text(child)).matchAll(/<loc>([^<]+)<\/loc>/g)) pages.add(m[1]);
  }
  return Array.from(pages);
}

async function main() {
  const pages = await sitemapUrls();
  console.log(`Crawling ${pages.length} sitemap URLs on ${BASE}`);

  const sources = new Map<string, Set<string>>(); // target path -> source urls
  let crawled = 0;
  await mapLimit(pages, CONCURRENCY, async (url) => {
    const html = await text(url).catch(() => "");
    if (++crawled % 250 === 0) console.log(`  … ${crawled}/${pages.length}`);
    for (const m of html.matchAll(LINK_RE)) {
      const target = m[1];
      if (!sources.has(target)) sources.set(target, new Set());
      sources.get(target)!.add(url);
    }
  });

  const targets = Array.from(sources.keys());
  console.log(`Status-checking ${targets.length} distinct internal targets`);

  const statuses = await mapLimit(targets, CONCURRENCY, async (path) => {
    try {
      const res = await fetch(BASE + path, {
        headers: { "User-Agent": UA },
        redirect: "manual",
      });
      return { path, status: res.status };
    } catch {
      return { path, status: 0 };
    }
  });

  const dead = statuses.filter((s) => s.status === 404);
  const redirected = statuses.filter((s) => s.status === 301 || s.status === 308);

  const bySource = new Map<string, { links: number; pages: Set<string> }>();
  for (const { path } of dead) {
    for (const src of sources.get(path)!) {
      const sec = section(src);
      if (!bySource.has(sec)) bySource.set(sec, { links: 0, pages: new Set() });
      const bucket = bySource.get(sec)!;
      bucket.links += 1;
      bucket.pages.add(src);
    }
  }

  console.log(`\n404 targets:            ${dead.length}`);
  console.log(`301/308 source targets: ${redirected.length}`);
  console.log(`\nDead links by SOURCE section (the surface that needs the fix):`);
  for (const [sec, b] of Array.from(bySource).sort((a, b) => b[1].links - a[1].links)) {
    console.log(`  ${sec.padEnd(16)} ${String(b.links).padStart(5)} links across ${b.pages.size} pages`);
  }

  if (dead.length) {
    console.log(`\nDead targets (first 40):`);
    for (const { path } of dead.slice(0, 40)) {
      console.log(`  ${path}  <- ${Array.from(sources.get(path)!)[0]}`);
    }
  }

  process.exit(dead.length === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
