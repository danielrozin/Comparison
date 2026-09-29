import { beforeEach, describe, expect, it, vi } from "vitest";

const counts = vi.hoisted(() => ({ hour: 0, day: 0, global: 0 }));
const created = vi.hoisted(() => vi.fn(async () => ({ id: "1" })));

vi.mock("@/lib/db/prisma", () => ({
  getPrisma: () => ({
    userGenerationRequest: {
      count: vi.fn(async ({ where }: { where: { ipHash?: string; createdAt: { gte: Date } } }) => {
        const age = Date.now() - where.createdAt.gte.getTime();
        if (!where.ipHash) return counts.global;
        if (age < 2 * 60 * 60 * 1000) return counts.hour;
        return counts.day;
      }),
      create: created,
      deleteMany: vi.fn(async () => ({ count: 0 })),
    },
  }),
}));

import { consumeUserGenerationSlot, userGenerationDailyCap } from "@/lib/generation/user-generation-rate-limit";

describe("consumeUserGenerationSlot", () => {
  beforeEach(() => {
    counts.hour = 0;
    counts.day = 0;
    counts.global = 0;
    created.mockClear();
    vi.stubEnv("USER_GENERATION_DAILY_CAP", "150");
  });

  it("records a request under the limits", async () => {
    const decision = await consumeUserGenerationSlot("203.0.113.8", "thailand-vs-vietnam");
    expect(decision).toEqual({ allowed: true });
    expect(created).toHaveBeenCalledOnce();
  });

  it("stops an IP after 3 in an hour, 10 in a day, and the global cap", async () => {
    counts.hour = 3;
    expect(await consumeUserGenerationSlot("203.0.113.8", "a-vs-b")).toEqual({
      allowed: false,
      reason: "ip_hour",
    });

    counts.hour = 0;
    counts.day = 10;
    expect(await consumeUserGenerationSlot("203.0.113.8", "a-vs-b")).toEqual({
      allowed: false,
      reason: "ip_day",
    });

    counts.day = 0;
    counts.global = 150;
    expect(userGenerationDailyCap()).toBe(150);
    expect(await consumeUserGenerationSlot("203.0.113.9", "a-vs-b")).toEqual({
      allowed: false,
      reason: "global_day",
    });
    expect(created).not.toHaveBeenCalled();
  });
});
