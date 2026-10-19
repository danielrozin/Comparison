import { SITE_URL } from "@/lib/utils/constants";
import { claimIndexNowUrls, resetIndexNowLedgerForTests, type ClaimDeps, type IndexNowSubmitKind } from "@/lib/seo/indexnow-ledger";

/**
 * IndexNow integration — instantly notify participating search engines
 * (Bing, Yandex, Naver, Seznam, and others) of new or updated URLs so they
 * crawl them in minutes instead of days.
 *
 * IndexNow keys are PUBLIC by design — the key is served openly at
 * `/{key}.txt` so engines can verify ownership. There is no secret here.
 * The matching file lives at `public/${INDEXNOW_KEY}.txt`. Logs still never
 * print the key or the request body.
 *
 * Two entry points:
 *  - `notifyIndexNow(paths, source)`: call this from every publish/update
 *    path. It is synchronous, never throws, and never blocks the caller. URLs
 *    are queued, de-duplicated, checked (200, canonical, not noindex) and sent
 *    in one batch after the response (Next.js `after()`), with a timeout.
 *  - `submitIndexNowGuarded(urls, kind, source)`: what the bulk/cron routes
 *    call. Goes through the shared ledger (indexnow-ledger.ts): URLs any path
 *    sent recently are skipped and a daily cap applies.
 *  - `submitToIndexNow(urls)`: the raw POST. Do not call it directly from a
 *    route or cron; use one of the two above.
 *
 * Docs: https://www.indexnow.org/documentation
 */
export const INDEXNOW_KEY = "c774592d395cb18932c0cf35c828e1a6";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

// Per-request URL cap enforced by the IndexNow protocol.
const MAX_URLS_PER_REQUEST = 10000;
/** Abort the IndexNow POST after this long. */
export const INDEXNOW_SUBMIT_TIMEOUT_MS = 8000;
/** Abort each pre-submit page check after this long. */
export const INDEXNOW_VERIFY_TIMEOUT_MS = 5000;
/** Collect URLs for this long before one batched submit. */
const BATCH_WINDOW_MS = 1500;
/** Do not resubmit the same URL from the same warm instance within this window. */
const RECENT_TTL_MS = 10 * 60 * 1000;
const VERIFY_CONCURRENCY = 6;

const LOG_PREFIX = "[indexnow]";

function getHost(): string {
  try {
    return new URL(SITE_URL).host;
  } catch {
    return "www.aversusb.net";
  }
}

/**
 * Whether IndexNow submissions should actually fire. We only ping for the
 * real production host so local dev and Vercel preview deploys don't submit
 * URLs that engines can't resolve back to the key file. Never fires under
 * the test runner.
 */
export function isIndexNowEnabled(): boolean {
  if (process.env.INDEXNOW_DISABLED === "true") return false;
  if (process.env.VITEST || process.env.NODE_ENV === "test") return false;
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") return false;
  const host = getHost();
  return host === "www.aversusb.net" || host === "aversusb.net";
}

/** Paths that are never pages (APIs, feeds, sitemaps, files). */
const NON_PAGE_PATH = /^\/(?:api|_next|sitemap|feed)(?:\/|\.|$)|\.(?:xml|txt|json|ico|png|jpe?g|webp|svg|pdf)$/i;

/**
 * Resolve a path or absolute URL to the canonical form we submit:
 * our host, https, no query, no hash, no trailing slash (except root).
 * Returns null for other hosts and non-page paths.
 */
export function normalizeIndexNowUrl(input: string): string | null {
  if (typeof input !== "string") return null;
  const raw = input.trim();
  if (!raw) return null;
  let url: URL;
  try {
    url = raw.startsWith("http") ? new URL(raw) : new URL(raw.startsWith("/") ? raw : `/${raw}`, SITE_URL);
  } catch {
    return null;
  }
  if (url.host !== getHost()) return null;
  let path = url.pathname.replace(/\/{2,}/g, "/");
  if (path.length > 1) path = path.replace(/\/+$/, "");
  if (NON_PAGE_PATH.test(path)) return null;
  return `${new URL(SITE_URL).origin}${path === "/" ? "" : path}`;
}

/**
 * Submit one or more absolute URLs (or site-root-relative paths) to IndexNow.
 * Never throws; returns a result summary. Relative paths are resolved
 * against SITE_URL. Does not check the pages: use `notifyIndexNow` for
 * publish paths, or `filterIndexableUrls` first.
 */
export async function submitToIndexNow(
  urls: string[],
  deps: { fetchImpl?: typeof fetch; timeoutMs?: number; enabled?: boolean } = {}
): Promise<{ submitted: number; ok: boolean; status?: number; skipped?: string }> {
  const enabled = deps.enabled ?? isIndexNowEnabled();
  if (!enabled) {
    return { submitted: 0, ok: false, skipped: "disabled-or-non-prod" };
  }

  const host = getHost();
  const normalized = Array.from(
    new Set(
      urls
        .filter((u) => typeof u === "string" && u.length > 0)
        .map((u) => (u.startsWith("http") ? u : `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`))
        // Only submit URLs that belong to our verified host.
        .filter((u) => {
          try {
            return new URL(u).host === host;
          } catch {
            return false;
          }
        })
    )
  ).slice(0, MAX_URLS_PER_REQUEST);

  if (normalized.length === 0) {
    return { submitted: 0, ok: false, skipped: "no-valid-urls" };
  }

  const fetchImpl = deps.fetchImpl ?? fetch;
  try {
    const res = await fetchImpl(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: normalized,
      }),
      signal: AbortSignal.timeout(deps.timeoutMs ?? INDEXNOW_SUBMIT_TIMEOUT_MS),
    });
    // 200 = accepted, 202 = accepted (pending verification). Both are success.
    const ok = res.status === 200 || res.status === 202;
    if (!ok) {
      console.warn(`${LOG_PREFIX} submission returned HTTP ${res.status} for ${normalized.length} URLs`);
    }
    return { submitted: ok ? normalized.length : 0, ok, status: res.status };
  } catch (e) {
    const reason = e instanceof Error ? `${e.name}: ${e.message}` : "unknown error";
    console.warn(`${LOG_PREFIX} submission failed for ${normalized.length} URLs (${reason})`);
    return { submitted: 0, ok: false };
  }
}

/**
 * Submit through the shared ledger: drops URLs sent recently by any path
 * (24h for publish, 7 days for sweeps) and anything over today's cap, then
 * POSTs the rest and records them. Never throws.
 */
export async function submitIndexNowGuarded(
  urls: string[],
  kind: IndexNowSubmitKind,
  source: string,
  deps: { fetchImpl?: typeof fetch; timeoutMs?: number; enabled?: boolean; ledger?: ClaimDeps } = {}
): Promise<{
  submitted: number;
  ok: boolean;
  status?: number;
  skipped?: string;
  candidates: number;
  deduped: number;
  capped: number;
}> {
  const enabled = deps.enabled ?? isIndexNowEnabled();
  const candidates = [...new Set(urls.map((u) => normalizeIndexNowUrl(u)).filter((u): u is string => !!u))];
  if (!enabled) {
    return { submitted: 0, ok: false, skipped: "disabled-or-non-prod", candidates: candidates.length, deduped: 0, capped: 0 };
  }
  const claim = await claimIndexNowUrls(candidates, kind, deps.ledger);
  const deduped = claim.dropped.filter((d) => d.reason === "recently-submitted").length;
  const capped = claim.dropped.length - deduped;
  if (claim.allowed.length === 0) {
    console.info(`${LOG_PREFIX} source=${source} candidates=${candidates.length} submitted=0 deduped=${deduped} capped=${capped}`);
    return { submitted: 0, ok: false, skipped: capped > 0 ? "daily-cap" : "no-new-urls", candidates: candidates.length, deduped, capped };
  }
  const result = await submitToIndexNow(claim.allowed, { fetchImpl: deps.fetchImpl, timeoutMs: deps.timeoutMs, enabled: true });
  await claim.settle(result.ok);
  console.info(
    `${LOG_PREFIX} source=${source} candidates=${candidates.length} submitted=${result.submitted} ` +
      `status=${result.status ?? "none"} deduped=${deduped} capped=${capped}`
  );
  return { ...result, candidates: candidates.length, deduped, capped };
}

// ---------------------------------------------------------------------------
// Pre-submit check: only canonical, indexable, HTTP 200 pages go out.
// ---------------------------------------------------------------------------

export type IndexabilityResult =
  | { ok: true; url: string }
  | { ok: false; url: string; reason: string };

function hasNoindex(value: string | null | undefined): boolean {
  return !!value && /(?:^|[\s,])(?:noindex|none)(?:$|[\s,])/i.test(value);
}

function attr(tag: string, name: string): string | null {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  if (!m) return null;
  return m[2] ?? m[3] ?? m[4] ?? null;
}

/**
 * Inspect a fetched page: robots meta and rel=canonical. Scans the whole
 * document because Next.js can stream metadata tags after </head>.
 */
export function inspectHtmlForIndexability(url: string, html: string): IndexabilityResult {
  const head = html;
  for (const tag of head.match(/<meta\b[^>]*>/gi) ?? []) {
    const name = (attr(tag, "name") ?? "").toLowerCase();
    if (name === "robots" || name === "bingbot" || name === "googlebot") {
      if (hasNoindex(attr(tag, "content"))) return { ok: false, url, reason: "meta-noindex" };
    }
  }
  for (const tag of head.match(/<link\b[^>]*>/gi) ?? []) {
    const rel = (attr(tag, "rel") ?? "").toLowerCase().split(/\s+/);
    if (!rel.includes("canonical")) continue;
    const href = attr(tag, "href");
    if (!href) continue;
    let canonical: string | null;
    try {
      canonical = normalizeIndexNowUrl(new URL(href, url).toString());
    } catch {
      canonical = null;
    }
    if (canonical !== url) return { ok: false, url, reason: "not-canonical" };
  }
  return { ok: true, url };
}

/**
 * GET the page and accept it only when it answers 200 directly (no redirect),
 * has no noindex (header or meta), and its rel=canonical (if any) is itself.
 */
export async function checkIndexable(
  url: string,
  deps: { fetchImpl?: typeof fetch; timeoutMs?: number } = {}
): Promise<IndexabilityResult> {
  const fetchImpl = deps.fetchImpl ?? fetch;
  try {
    const res = await fetchImpl(url, {
      method: "GET",
      redirect: "manual",
      headers: { "User-Agent": "AversusB-IndexNow-Check/1.0", Accept: "text/html" },
      cache: "no-store",
      signal: AbortSignal.timeout(deps.timeoutMs ?? INDEXNOW_VERIFY_TIMEOUT_MS),
    });
    if (res.status !== 200) return { ok: false, url, reason: `http-${res.status}` };
    if (hasNoindex(res.headers.get("x-robots-tag"))) return { ok: false, url, reason: "header-noindex" };
    const html = await res.text();
    return inspectHtmlForIndexability(url, html);
  } catch (e) {
    const reason = e instanceof Error && e.name === "TimeoutError" ? "check-timeout" : "check-failed";
    return { ok: false, url, reason };
  }
}

/** Run `checkIndexable` over a list with bounded concurrency. */
export async function filterIndexableUrls(
  urls: string[],
  deps: { fetchImpl?: typeof fetch; timeoutMs?: number; concurrency?: number } = {}
): Promise<{ indexable: string[]; dropped: { url: string; reason: string }[] }> {
  const results: IndexabilityResult[] = new Array(urls.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(deps.concurrency ?? VERIFY_CONCURRENCY, urls.length) }, async () => {
    while (next < urls.length) {
      const i = next++;
      results[i] = await checkIndexable(urls[i], deps);
    }
  });
  await Promise.all(workers);
  const indexable: string[] = [];
  const dropped: { url: string; reason: string }[] = [];
  for (const r of results) {
    if (r.ok) indexable.push(r.url);
    else dropped.push({ url: r.url, reason: r.reason });
  }
  return { indexable, dropped };
}

// ---------------------------------------------------------------------------
// Publish hook: queue + batch + dedupe + fire-and-forget.
// ---------------------------------------------------------------------------

const pending = new Map<string, Set<string>>(); // url -> sources
const recentlySubmitted = new Map<string, number>(); // url -> submitted at (ms)
let flushScheduled = false;

export interface IndexNowFlushDeps {
  fetchImpl?: typeof fetch;
  enabled?: boolean;
  now?: () => number;
  verifyTimeoutMs?: number;
  submitTimeoutMs?: number;
  ledger?: ClaimDeps;
}

export interface IndexNowFlushResult {
  queued: number;
  submitted: number;
  ok: boolean;
  status?: number;
  skipped?: string;
  dropped: { url: string; reason: string }[];
}

/**
 * Queue pages for IndexNow after a publish or update. Safe to call from any
 * write path: synchronous, never throws, never awaits network. Pass only
 * pages that are published; the batch is still checked for 200 / canonical
 * / not-noindex before anything is sent.
 */
export function notifyIndexNow(pathsOrUrls: string | string[], source: string): void {
  try {
    const list = Array.isArray(pathsOrUrls) ? pathsOrUrls : [pathsOrUrls];
    let added = 0;
    for (const item of list) {
      const url = normalizeIndexNowUrl(item);
      if (!url) continue;
      const sources = pending.get(url) ?? new Set<string>();
      sources.add(source);
      pending.set(url, sources);
      added++;
    }
    if (added === 0 || flushScheduled) return;
    flushScheduled = true;
    scheduleFlush();
  } catch (e) {
    console.warn(`${LOG_PREFIX} notify failed (${source}):`, e instanceof Error ? e.message : "unknown error");
  }
}

function scheduleFlush(): void {
  const run = async () => {
    await new Promise((resolve) => setTimeout(resolve, BATCH_WINDOW_MS));
    try {
      await flushIndexNowQueue();
    } catch (e) {
      console.warn(`${LOG_PREFIX} flush failed:`, e instanceof Error ? e.message : "unknown error");
    }
  };
  // Inside an App Router request, `after()` runs the flush once the response
  // is sent and keeps the function alive for it. Loaded lazily: this module is
  // also bundled into Pages Router code, where a static import of `after` is
  // a build error. Outside a request scope (scripts, Pages API routes, tests)
  // `after()` throws and the flush runs as a plain background promise.
  void import("next/server")
    .then((mod) => {
      try {
        mod.after(run);
      } catch {
        void run();
      }
    })
    .catch(() => {
      void run();
    });
}

/** Drain the queue: dedupe, check each page, submit one batch, log a summary. */
export async function flushIndexNowQueue(deps: IndexNowFlushDeps = {}): Promise<IndexNowFlushResult> {
  const now = deps.now ?? Date.now;
  const batch = [...pending.entries()];
  pending.clear();
  flushScheduled = false;

  const sources = [...new Set(batch.flatMap(([, s]) => [...s]))].sort().join(",");
  const dropped: { url: string; reason: string }[] = [];

  for (const [url, at] of recentlySubmitted) {
    if (now() - at > RECENT_TTL_MS) recentlySubmitted.delete(url);
  }
  const fresh: string[] = [];
  for (const [url] of batch) {
    if (recentlySubmitted.has(url)) dropped.push({ url, reason: "recently-submitted" });
    else fresh.push(url);
  }

  const enabled = deps.enabled ?? isIndexNowEnabled();
  if (!enabled) {
    if (batch.length > 0) {
      console.info(`${LOG_PREFIX} skipped ${batch.length} URLs (disabled or non-production) source=${sources}`);
    }
    return { queued: batch.length, submitted: 0, ok: false, skipped: "disabled-or-non-prod", dropped };
  }
  if (fresh.length === 0) {
    return { queued: batch.length, submitted: 0, ok: false, skipped: "no-new-urls", dropped };
  }

  const checked = await filterIndexableUrls(fresh, {
    fetchImpl: deps.fetchImpl,
    timeoutMs: deps.verifyTimeoutMs,
  });
  dropped.push(...checked.dropped);

  if (checked.indexable.length === 0) {
    console.info(
      `${LOG_PREFIX} nothing to submit source=${sources} queued=${batch.length} dropped=${formatDropped(dropped)}`
    );
    return { queued: batch.length, submitted: 0, ok: false, skipped: "no-indexable-urls", dropped };
  }

  // Shared ledger: skip URLs a cron or another instance sent recently, and
  // respect the daily cap.
  const claim = await claimIndexNowUrls(checked.indexable, "publish", { now, ...deps.ledger });
  dropped.push(...claim.dropped);
  if (claim.allowed.length === 0) {
    console.info(
      `${LOG_PREFIX} nothing to submit source=${sources} queued=${batch.length} dropped=${formatDropped(dropped)}`
    );
    const capped = claim.dropped.some((d) => d.reason === "daily-cap");
    return { queued: batch.length, submitted: 0, ok: false, skipped: capped ? "daily-cap" : "no-new-urls", dropped };
  }

  const result = await submitToIndexNow(claim.allowed, {
    fetchImpl: deps.fetchImpl,
    timeoutMs: deps.submitTimeoutMs,
    enabled: true,
  });
  await claim.settle(result.ok);
  if (result.ok) {
    for (const url of claim.allowed) recentlySubmitted.set(url, now());
  }
  const line =
    `${LOG_PREFIX} source=${sources} queued=${batch.length} submitted=${result.submitted} ` +
    `status=${result.status ?? "none"} urls=${claim.allowed.join(" ")}` +
    (dropped.length ? ` dropped=${formatDropped(dropped)}` : "");
  if (result.ok) console.info(line);
  else console.warn(line);
  return { queued: batch.length, submitted: result.submitted, ok: result.ok, status: result.status, dropped };
}

function formatDropped(dropped: { url: string; reason: string }[]): string {
  return dropped.map((d) => `${d.url}(${d.reason})`).join(" ");
}

/**
 * For handlers where `after()` is unavailable (Pages Router API routes):
 * queue and drain now. Still never throws; bounded by the check and submit
 * timeouts.
 */
export async function notifyIndexNowNow(
  pathsOrUrls: string | string[],
  source: string,
  deps: IndexNowFlushDeps = {}
): Promise<IndexNowFlushResult | null> {
  notifyIndexNow(pathsOrUrls, source);
  try {
    return await flushIndexNowQueue(deps);
  } catch (e) {
    console.warn(`${LOG_PREFIX} flush failed (${source}):`, e instanceof Error ? e.message : "unknown error");
    return null;
  }
}

/** Test helper: clear queue and dedupe memory. */
export function resetIndexNowQueueForTests(): void {
  pending.clear();
  recentlySubmitted.clear();
  flushScheduled = false;
  resetIndexNowLedgerForTests();
}

/** Test/diagnostic helper: URLs currently waiting for the next flush. */
export function pendingIndexNowUrls(): string[] {
  return [...pending.keys()];
}

/**
 * Convenience helper for a single comparison slug (queued, checked, batched).
 */
export function submitComparisonToIndexNow(slug: string): Promise<void> {
  notifyIndexNow(`/compare/${slug}`, "comparison");
  return Promise.resolve();
}
