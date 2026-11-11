import { afterEach, describe, expect, it, vi } from "vitest";

import {
  RESEND_SEND_INTERVAL_MS,
  createResendSendPacer,
  isResendRateLimitError,
  resetResendRateLimitClock,
  withResendRateLimitRetry,
} from "../resend-rate-limit";

afterEach(() => {
  resetResendRateLimitClock();
  vi.restoreAllMocks();
});

describe("isResendRateLimitError", () => {
  it("detects HTTP 429 and Resend's too-many-requests message", () => {
    expect(isResendRateLimitError(429)).toBe(true);
    expect(
      isResendRateLimitError(
        200,
        { message: "Too many requests. You can only make 10 requests per second." }
      )
    ).toBe(true);
    expect(
      isResendRateLimitError(
        "Too many requests. You can only make 10 requests per second."
      )
    ).toBe(true);
    expect(isResendRateLimitError(403, { message: "domain is not verified" })).toBe(
      false
    );
    expect(isResendRateLimitError(200, { id: "ok" })).toBe(false);
  });
});

describe("createResendSendPacer", () => {
  it("spaces 24 sends at 125ms so a 10 req/s window is never exceeded", async () => {
    let now = 0;
    const sleeps: number[] = [];
    const pacer = createResendSendPacer({
      intervalMs: RESEND_SEND_INTERVAL_MS,
      now: () => now,
      sleep: async (ms) => {
        sleeps.push(ms);
        now += ms;
      },
    });

    const startTimes: number[] = [];
    for (let i = 0; i < 24; i++) {
      await pacer.waitForSlot();
      startTimes.push(now);
    }

    expect(startTimes).toEqual(
      Array.from({ length: 24 }, (_, i) => i * RESEND_SEND_INTERVAL_MS)
    );
    expect(sleeps).toHaveLength(23);
    expect(sleeps.every((ms) => ms === RESEND_SEND_INTERVAL_MS)).toBe(true);

    // Sliding 1s windows should stay at or under 8 starts (the safe rate).
    for (const start of startTimes) {
      const inWindow = startTimes.filter((t) => t >= start && t < start + 1000);
      expect(inWindow.length).toBeLessThanOrEqual(8);
    }
  });

  it("does not wait when the previous slot is already in the past", async () => {
    let now = 0;
    const sleep = vi.fn(async (ms: number) => {
      now += ms;
    });
    const pacer = createResendSendPacer({
      intervalMs: 125,
      now: () => now,
      sleep,
    });

    await pacer.waitForSlot();
    now = 200;
    await pacer.waitForSlot();
    expect(sleep).not.toHaveBeenCalled();
  });
});

describe("withResendRateLimitRetry", () => {
  it("returns the first success without sleeping", async () => {
    const sleep = vi.fn(async (_ms: number) => undefined);
    const send = vi.fn(async () => ({ ok: true }));
    const result = await withResendRateLimitRetry(send, (r) => !r.ok, {
      sleep,
    });
    expect(result).toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it("retries a rate-limit style failure and then succeeds", async () => {
    const sleep = vi.fn(async (_ms: number) => undefined);
    const send = vi
      .fn(async (): Promise<{ ok: boolean; rateLimited: boolean }> => ({
        ok: false,
        rateLimited: false,
      }))
      .mockResolvedValueOnce({ ok: false, rateLimited: true })
      .mockResolvedValueOnce({ ok: true, rateLimited: false });

    const result = await withResendRateLimitRetry(
      send,
      (r) => !r.ok && r.rateLimited,
      { sleep }
    );

    expect(result).toEqual({ ok: true, rateLimited: false });
    expect(send).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledTimes(1);
    expect(sleep).toHaveBeenCalledWith(250);
  });

  it("does not retry a non-rate-limit failure", async () => {
    const sleep = vi.fn(async (_ms: number) => undefined);
    const send = vi.fn(async () => ({ ok: false, rateLimited: false }));
    const result = await withResendRateLimitRetry(
      send,
      (r) => !r.ok && r.rateLimited,
      { sleep }
    );
    expect(result).toEqual({ ok: false, rateLimited: false });
    expect(send).toHaveBeenCalledTimes(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it("stops after the scheduled retries and returns the last failure", async () => {
    const sleep = vi.fn(async (_ms: number) => undefined);
    const send = vi.fn(async () => ({ ok: false, rateLimited: true }));
    const result = await withResendRateLimitRetry(
      send,
      (r) => !r.ok && r.rateLimited,
      { sleep, delaysMs: [250, 500, 1000] }
    );
    expect(result).toEqual({ ok: false, rateLimited: true });
    expect(send).toHaveBeenCalledTimes(4);
    expect(sleep.mock.calls.map((c) => c[0])).toEqual([250, 500, 1000]);
  });
});
