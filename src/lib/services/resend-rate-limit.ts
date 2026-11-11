/**
 * Helpers for staying under Resend's 10 requests-per-second limit.
 *
 * The weekly digest used to fire one /emails request per subscriber in a tight
 * loop. At 24 subscribers that burst tripped 429s ("Too many requests. You can
 * only make 10 requests per second."), so 15 of 24 digest emails failed and
 * the follow-up cron-report notification fell through to a broken Web3Forms
 * fallback. Pace sends at ~8/s and retry 429s before giving up.
 */

export const RESEND_SAFE_REQUESTS_PER_SECOND = 8;
export const RESEND_SEND_INTERVAL_MS = Math.ceil(
  1000 / RESEND_SAFE_REQUESTS_PER_SECOND
); // 125ms

export const RESEND_RATE_LIMIT_RETRY_DELAYS_MS = [250, 500, 1000] as const;

export type SleepFn = (ms: number) => Promise<void>;
export type NowFn = () => number;

export const defaultSleep: SleepFn = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mutable clock used by production senders. Tests replace `sleep` / `now`
 * so they can assert pacing and retries without waiting on real timers.
 */
export const resendRateLimitClock: { sleep: SleepFn; now: NowFn } = {
  sleep: defaultSleep,
  now: Date.now,
};

export function resetResendRateLimitClock(): void {
  resendRateLimitClock.sleep = defaultSleep;
  resendRateLimitClock.now = Date.now;
}

export function isResendRateLimitError(
  statusOrMessage?: number | string | null,
  body?: unknown
): boolean {
  if (statusOrMessage === 429) return true;

  const chunks: string[] = [];
  if (typeof statusOrMessage === "string") chunks.push(statusOrMessage);
  if (typeof body === "string") {
    chunks.push(body);
  } else if (body != null) {
    try {
      chunks.push(JSON.stringify(body));
    } catch {
      // ignore unstringifiable bodies
    }
  }

  return /too many requests|\b429\b/i.test(chunks.join(" "));
}

export function createResendSendPacer(options?: {
  intervalMs?: number;
  sleep?: SleepFn;
  now?: NowFn;
}): { waitForSlot: () => Promise<void>; reset: () => void } {
  const intervalMs = options?.intervalMs ?? RESEND_SEND_INTERVAL_MS;
  const sleep = options?.sleep ?? ((ms) => resendRateLimitClock.sleep(ms));
  const now = options?.now ?? (() => resendRateLimitClock.now());
  let nextAllowedAt = 0;

  return {
    async waitForSlot() {
      const wait = nextAllowedAt - now();
      if (wait > 0) await sleep(wait);
      nextAllowedAt = now() + intervalMs;
    },
    reset() {
      nextAllowedAt = 0;
    },
  };
}

/**
 * Run `send` and, if the result looks like a Resend rate limit, retry after
 * 250ms / 500ms / 1000ms. Returns the last result (success or exhausted).
 */
export async function withResendRateLimitRetry<T>(
  send: () => Promise<T>,
  isRateLimited: (result: T) => boolean,
  options?: { delaysMs?: readonly number[]; sleep?: SleepFn }
): Promise<T> {
  const delays = options?.delaysMs ?? RESEND_RATE_LIMIT_RETRY_DELAYS_MS;
  const sleep = options?.sleep ?? ((ms) => resendRateLimitClock.sleep(ms));

  let result = await send();
  for (let i = 0; i < delays.length && isRateLimited(result); i++) {
    await sleep(delays[i]);
    result = await send();
  }
  return result;
}
