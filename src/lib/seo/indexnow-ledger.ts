import { getRedis } from "@/lib/services/redis";

/**
 * Shared IndexNow submission ledger (ROO-268 follow-up).
 *
 * Every IndexNow submit path (publish hooks, /api/revalidate, the
 * /api/indexnow sweep and the indexnow-recent cron) goes through
 * `claimIndexNowUrls()` before posting, so:
 *
 *  - a URL already sent recently by ANY path is not sent again
 *    (publish hooks: 24h; sitemap sweeps: 7 days), and
 *  - the site never sends more than a fixed number of URLs per UTC day
 *    (INDEXNOW_DAILY_CAP, default 1000). Sweeps may use at most
 *    INDEXNOW_SWEEP_DAILY_CAP (default 600) of it, so publishes always
 *    have headroom.
 *
 * The ledger lives in Upstash Redis (the same KV the rest of the app uses),
 * so it is shared across serverless instances and crons. When Redis is not
 * configured or errors, it falls back to an in-memory ledger for this
 * instance with the same rules: never more permissive than the shared one.
 * Nothing here throws to the caller.
 */

export type IndexNowSubmitKind = "publish" | "sweep";

export const INDEXNOW_PUBLISH_DEDUPE_MS = 24 * 60 * 60 * 1000;
export const INDEXNOW_SWEEP_DEDUPE_MS = 7 * 24 * 60 * 60 * 1000;
const SENT_KEY_TTL_S = 8 * 24 * 60 * 60;
const DAY_KEY_TTL_S = 2 * 24 * 60 * 60;
const MGET_CHUNK = 500;

const SENT_PREFIX = "indexnow:sent:";
const DAY_PREFIX = "indexnow:day:";

function intEnv(name: string, fallback: number): number {
  const n = Number(process.env[name]);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
}

export function indexNowDailyCap(): number {
  return intEnv("INDEXNOW_DAILY_CAP", 1000);
}

export function indexNowSweepDailyCap(): number {
  return Math.min(intEnv("INDEXNOW_SWEEP_DAILY_CAP", 600), indexNowDailyCap());
}

export function utcDay(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/** Minimal Redis surface used here; lets tests pass a fake. */
export interface LedgerStore {
  mget(keys: string[]): Promise<(string | number | null)[]>;
  markSent(keys: string[], value: string, ttlSeconds: number): Promise<void>;
  /** Atomically add `by` to a day counter and return the new value. */
  incrBy(key: string, by: number, ttlSeconds: number): Promise<number>;
  decrBy(key: string, by: number): Promise<void>;
}

function redisStore(): LedgerStore | null {
  const r = getRedis();
  if (!r) return null;
  return {
    async mget(keys) {
      if (keys.length === 0) return [];
      return (await r.mget<(string | number | null)[]>(...keys)) ?? [];
    },
    async markSent(keys, value, ttlSeconds) {
      if (keys.length === 0) return;
      const p = r.pipeline();
      for (const k of keys) p.set(k, value, { ex: ttlSeconds });
      await p.exec();
    },
    async incrBy(key, by, ttlSeconds) {
      const p = r.pipeline();
      p.incrby(key, by);
      p.expire(key, ttlSeconds);
      const [n] = (await p.exec()) as [number, unknown];
      return Number(n);
    },
    async decrBy(key, by) {
      await r.decrby(key, by);
    },
  };
}

// In-memory fallback (per warm instance).
const memSent = new Map<string, { value: string; expiresAt: number }>();
const memCounters = new Map<string, number>();

function memoryStore(now: () => number): LedgerStore {
  return {
    async mget(keys) {
      return keys.map((k) => {
        const e = memSent.get(k);
        if (!e) return null;
        if (e.expiresAt <= now()) {
          memSent.delete(k);
          return null;
        }
        return e.value;
      });
    },
    async markSent(keys, value, ttlSeconds) {
      for (const k of keys) memSent.set(k, { value, expiresAt: now() + ttlSeconds * 1000 });
    },
    async incrBy(key, by) {
      const n = (memCounters.get(key) ?? 0) + by;
      memCounters.set(key, n);
      return n;
    },
    async decrBy(key, by) {
      memCounters.set(key, (memCounters.get(key) ?? 0) - by);
    },
  };
}

export function resetIndexNowLedgerForTests(): void {
  memSent.clear();
  memCounters.clear();
}

export interface ClaimDeps {
  store?: LedgerStore | null;
  now?: () => number;
  dailyCap?: number;
  sweepDailyCap?: number;
}

export interface ClaimResult {
  /** URLs this caller may submit now (reserved against the daily cap). */
  allowed: string[];
  dropped: { url: string; reason: "recently-submitted" | "daily-cap" }[];
  /** Call after the POST: records allowed URLs as sent, or releases the reservation on failure. */
  settle(ok: boolean): Promise<void>;
}

/**
 * Reserve URLs for one IndexNow submit. Drops URLs sent recently by any
 * path and anything over today's cap. Always resolves.
 */
export async function claimIndexNowUrls(
  urls: string[],
  kind: IndexNowSubmitKind,
  deps: ClaimDeps = {}
): Promise<ClaimResult> {
  const now = deps.now ?? Date.now;
  const unique = [...new Set(urls)];
  const dropped: ClaimResult["dropped"] = [];
  const windowMs = kind === "sweep" ? INDEXNOW_SWEEP_DEDUPE_MS : INDEXNOW_PUBLISH_DEDUPE_MS;

  let store: LedgerStore = memoryStore(now);
  if (deps.store !== undefined) store = deps.store ?? memoryStore(now);
  else {
    const r = redisStore();
    if (r) store = r;
  }

  const run = async (s: LedgerStore): Promise<ClaimResult> => {
    // 1) Shared recent-submission de-duplication.
    const fresh: string[] = [];
    for (let i = 0; i < unique.length; i += MGET_CHUNK) {
      const chunk = unique.slice(i, i + MGET_CHUNK);
      const values = await s.mget(chunk.map((u) => SENT_PREFIX + u));
      chunk.forEach((u, j) => {
        const at = Number(values[j]);
        if (Number.isFinite(at) && at > 0 && now() - at < windowMs) dropped.push({ url: u, reason: "recently-submitted" });
        else fresh.push(u);
      });
    }

    // 2) Daily cap (total, plus a lower sub-cap for sweeps).
    const day = utcDay(now());
    const totalKey = `${DAY_PREFIX}${day}`;
    const sweepKey = `${DAY_PREFIX}${day}:sweep`;
    const reserved: { key: string; n: number }[] = [];
    let allowedCount = fresh.length;
    const reserve = async (key: string, cap: number) => {
      if (allowedCount === 0) return;
      const after = await s.incrBy(key, allowedCount, DAY_KEY_TTL_S);
      const before = after - allowedCount;
      const fits = Math.max(0, Math.min(allowedCount, cap - before));
      if (fits < allowedCount) await s.decrBy(key, allowedCount - fits);
      // Earlier reservations shrink to the new count too.
      for (const r of reserved) {
        if (r.n > fits) {
          await s.decrBy(r.key, r.n - fits);
          r.n = fits;
        }
      }
      reserved.push({ key, n: fits });
      allowedCount = fits;
    };
    if (kind === "sweep") await reserve(sweepKey, deps.sweepDailyCap ?? indexNowSweepDailyCap());
    await reserve(totalKey, deps.dailyCap ?? indexNowDailyCap());

    const allowed = fresh.slice(0, allowedCount);
    for (const u of fresh.slice(allowedCount)) dropped.push({ url: u, reason: "daily-cap" });

    return {
      allowed,
      dropped,
      async settle(ok: boolean) {
        try {
          if (ok) await s.markSent(allowed.map((u) => SENT_PREFIX + u), String(now()), SENT_KEY_TTL_S);
          else for (const r of reserved) if (r.n > 0) await s.decrBy(r.key, r.n);
        } catch {
          // Ledger write failures never surface to the caller.
        }
      },
    };
  };

  try {
    return await run(store);
  } catch {
    dropped.length = 0;
    try {
      return await run(memoryStore(now));
    } catch {
      return { allowed: [], dropped: unique.map((url) => ({ url, reason: "daily-cap" as const })), async settle() {} };
    }
  }
}
