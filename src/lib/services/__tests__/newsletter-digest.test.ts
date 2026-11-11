import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getPrisma, getTrendingComparisons } = vi.hoisted(() => ({
  getPrisma: vi.fn(),
  getTrendingComparisons: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({ getPrisma }));
vi.mock("../comparison-service", () => ({ getTrendingComparisons }));

import {
  RESEND_SEND_INTERVAL_MS,
  resetResendRateLimitClock,
} from "../resend-rate-limit";
import { sendDigestEmail, sendWeeklyDigest } from "../newsletter-digest";

const RATE_LIMIT_BODY = {
  message: "Too many requests. You can only make 10 requests per second.",
};

const TRENDING = [
  {
    title: "Widget A vs Widget B",
    slug: "widget-a-vs-widget-b",
    category: "tech",
  },
];

function subscribers(count: number): { email: string }[] {
  return Array.from({ length: count }, (_, i) => ({
    email: `user${i + 1}@example.com`,
  }));
}

describe("sendDigestEmail / sendWeeklyDigest rate limiting", () => {
  const previousKey = process.env.RESEND_API_KEY;

  beforeEach(() => {
    process.env.RESEND_API_KEY = "re_test_key";
    getPrisma.mockReturnValue({
      newsletterSubscriber: {
        findMany: vi.fn(),
      },
    });
    getTrendingComparisons.mockResolvedValue(TRENDING);
    resetResendRateLimitClock();
    vi.restoreAllMocks();
    // restoreAllMocks clears the clock + prisma mocks' implementations if they
    // were spies; re-apply the clock reset and default prisma after.
    resetResendRateLimitClock();
    getPrisma.mockReturnValue({
      newsletterSubscriber: {
        findMany: vi.fn().mockResolvedValue(subscribers(24)),
      },
    });
    getTrendingComparisons.mockResolvedValue(TRENDING);
  });

  afterEach(() => {
    resetResendRateLimitClock();
    if (previousKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previousKey;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("paces 24 digest sends at 125ms and never opens a 10 req/s tight loop", async () => {
    let now = 1_000_000;
    const { resendRateLimitClock } = await import("../resend-rate-limit");
    resendRateLimitClock.now = () => now;
    resendRateLimitClock.sleep = async (ms) => {
      now += ms;
    };

    const requestTimes: number[] = [];
    const fetchMock = vi.fn(async () => {
      requestTimes.push(now);
      return new Response(JSON.stringify({ id: "ok" }), { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendWeeklyDigest();

    expect(result).toMatchObject({
      subscriberCount: 24,
      sentCount: 24,
      failedCount: 0,
      method: "resend",
    });
    // 24 subscriber emails + one trailing slot (no extra request) so the
    // cron-report notification can send without sharing a tight window.
    expect(fetchMock).toHaveBeenCalledTimes(24);
    expect(requestTimes[0]).toBe(1_000_000);
    for (let i = 1; i < requestTimes.length; i++) {
      expect(requestTimes[i] - requestTimes[i - 1]).toBe(RESEND_SEND_INTERVAL_MS);
    }
    for (const start of requestTimes) {
      const inWindow = requestTimes.filter((t) => t >= start && t < start + 1000);
      expect(inWindow.length).toBeLessThanOrEqual(8);
    }
  });

  it("retries a rate-limit response and counts the email as sent, not failed", async () => {
    const { resendRateLimitClock } = await import("../resend-rate-limit");
    const sleeps: number[] = [];
    resendRateLimitClock.sleep = async (ms) => {
      sleeps.push(ms);
    };

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify(RATE_LIMIT_BODY), { status: 429 })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: "retry-ok" }), { status: 200 })
      );
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendDigestEmail(
      "user@example.com",
      "<p>Weekly digest for {{email}}</p>"
    );

    expect(result).toEqual({ success: true, method: "resend" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(sleeps).toEqual([250]);

    const firstBody = JSON.parse(
      (fetchMock.mock.calls[0][1] as RequestInit).body as string
    );
    expect(firstBody.to).toBe("user@example.com");
    expect(firstBody.html).toContain("user%40example.com");
    expect(firstBody.subject).toBe("Your Weekly Comparison Digest - A Versus B");
  });

  it("does not use a tight-loop path when Resend rate-limits mid-batch", async () => {
    // Fake Resend: reject an 11th request inside any rolling 1s window.
    // The pre-fix tight loop would trip this; the paced loop should not.
    let now = 0;
    const { resendRateLimitClock } = await import("../resend-rate-limit");
    resendRateLimitClock.now = () => now;
    resendRateLimitClock.sleep = async (ms) => {
      now += ms;
    };

    const requestTimes: number[] = [];
    const fetchMock = vi.fn(async () => {
      const t = now;
      const recent = requestTimes.filter((prev) => t - prev < 1000);
      requestTimes.push(t);
      if (recent.length >= 10) {
        return new Response(JSON.stringify(RATE_LIMIT_BODY), { status: 429 });
      }
      return new Response(JSON.stringify({ id: "ok" }), { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendWeeklyDigest();

    expect(result.failedCount).toBe(0);
    expect(result.sentCount).toBe(24);
    expect(fetchMock).toHaveBeenCalledTimes(24);
    for (let i = 0; i < requestTimes.length; i++) {
      const t = requestTimes[i];
      const priorInWindow = requestTimes
        .slice(0, i)
        .filter((prev) => t - prev < 1000);
      expect(priorInWindow.length).toBeLessThan(10);
    }
  });
});
