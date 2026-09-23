/**
 * ROO-42 — member hash upsert, revoke, and lookup.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

type Hash = Record<string, string>;

const redisBox = vi.hoisted(() => {
  const hashes = new Map<string, Hash>();
  const strings = new Map<string, string>();
  const api = {
    hashes,
    strings,
    enabled: true,
    reset() {
      hashes.clear();
      strings.clear();
      api.enabled = true;
    },
    async hset(key: string, fields: Hash) {
      const current = hashes.get(key) ?? {};
      Object.assign(current, fields);
      hashes.set(key, current);
      return Object.keys(fields).length;
    },
    async hgetall(key: string) {
      const current = hashes.get(key);
      return current ? { ...current } : null;
    },
    async get(key: string) {
      return strings.get(key) ?? null;
    },
    async set(key: string, value: string) {
      strings.set(key, value);
      return "OK";
    },
  };
  return api;
});

vi.mock("@/lib/services/redis", () => ({
  getRedis: () => (redisBox.enabled ? redisBox : null),
}));

import { lookupMember, revokeMember, upsertMember } from "../members";

describe("monetization member hash", () => {
  beforeEach(() => {
    redisBox.reset();
  });

  it("upserts monetization:member:{email} for O(1) lookup", async () => {
    const ok = await upsertMember({
      email: "Buyer@Example.com",
      plan: "pro",
      interval: "year",
      stripeCustomer: "cus_abc",
      stripeSubscription: "sub_xyz",
      src: "header",
      status: "active",
      replaceSubscription: true,
      updatedAt: "2026-09-23T05:00:00.000Z",
    });

    expect(ok).toBe(true);
    const hash = redisBox.hashes.get("monetization:member:buyer@example.com");
    expect(hash).toEqual({
      email: "buyer@example.com",
      plan: "pro",
      interval: "year",
      stripeCustomer: "cus_abc",
      stripeSubscription: "sub_xyz",
      src: "header",
      status: "active",
      active: "1",
      updatedAt: "2026-09-23T05:00:00.000Z",
    });
    expect(redisBox.strings.get("monetization:member-by-subscription:sub_xyz")).toBe(
      "buyer@example.com",
    );
    expect(redisBox.strings.get("monetization:member-by-customer:cus_abc")).toBe(
      "buyer@example.com",
    );

    const lookedUp = await lookupMember("buyer@example.com");
    expect(lookedUp).toEqual({
      available: true,
      member: expect.objectContaining({
        email: "buyer@example.com",
        plan: "pro",
        interval: "year",
        stripeCustomer: "cus_abc",
        stripeSubscription: "sub_xyz",
        status: "active",
        active: true,
      }),
    });
  });

  it("does not wipe plan when a later subscription event omits it", async () => {
    await upsertMember({
      email: "buyer@example.com",
      plan: "pro",
      interval: "year",
      stripeCustomer: "cus_abc",
      stripeSubscription: "sub_xyz",
      status: "active",
      replaceSubscription: true,
    });

    const ok = await upsertMember({
      email: "buyer@example.com",
      stripeSubscription: "sub_xyz",
      status: "past_due",
      replaceSubscription: false,
      updatedAt: "2026-09-23T06:00:00.000Z",
    });

    expect(ok).toBe(true);
    const hash = redisBox.hashes.get("monetization:member:buyer@example.com");
    expect(hash?.plan).toBe("pro");
    expect(hash?.interval).toBe("year");
    expect(hash?.status).toBe("past_due");
    expect(hash?.active).toBe("0");
  });

  it("revokes by subscription id and keeps the plan fields", async () => {
    await upsertMember({
      email: "buyer@example.com",
      plan: "business",
      interval: "month",
      stripeCustomer: "cus_abc",
      stripeSubscription: "sub_xyz",
      status: "active",
      replaceSubscription: true,
    });

    const result = await revokeMember({
      stripeSubscription: "sub_xyz",
      stripeCustomer: "cus_abc",
      updatedAt: "2026-09-23T07:00:00.000Z",
    });

    expect(result).toEqual({ revoked: true, email: "buyer@example.com" });
    const hash = redisBox.hashes.get("monetization:member:buyer@example.com");
    expect(hash).toMatchObject({
      plan: "business",
      interval: "month",
      stripeCustomer: "cus_abc",
      stripeSubscription: "sub_xyz",
      status: "canceled",
      active: "0",
      updatedAt: "2026-09-23T07:00:00.000Z",
    });

    const lookedUp = await lookupMember("BUYER@example.com");
    expect(lookedUp.available).toBe(true);
    if (lookedUp.available) {
      expect(lookedUp.member?.active).toBe(false);
      expect(lookedUp.member?.status).toBe("canceled");
      expect(lookedUp.member?.plan).toBe("business");
    }
  });

  it("does not revoke a newer subscription when an older one is deleted", async () => {
    await upsertMember({
      email: "buyer@example.com",
      plan: "pro",
      interval: "year",
      stripeCustomer: "cus_abc",
      stripeSubscription: "sub_new",
      status: "active",
      replaceSubscription: true,
    });

    const result = await revokeMember({
      stripeSubscription: "sub_old",
      stripeCustomer: "cus_abc",
    });

    expect(result.revoked).toBe(false);
    expect(redisBox.hashes.get("monetization:member:buyer@example.com")?.status).toBe("active");
    expect(redisBox.hashes.get("monetization:member:buyer@example.com")?.active).toBe("1");
  });

  it("skips the hash when Redis is not configured", async () => {
    redisBox.enabled = false;
    const ok = await upsertMember({
      email: "buyer@example.com",
      plan: "pro",
      interval: "month",
      status: "active",
      replaceSubscription: true,
    });
    expect(ok).toBe(false);
    expect(redisBox.hashes.size).toBe(0);

    const lookedUp = await lookupMember("buyer@example.com");
    expect(lookedUp).toEqual({ available: false });
  });
});
