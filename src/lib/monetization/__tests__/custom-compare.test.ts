/**
 * ROO-49 — custom compare is allowed for an active member and refused
 * with a pricing link otherwise.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

type Hash = Record<string, string>;

const sendNotificationEmail = vi.fn().mockResolvedValue({ success: true, method: "resend" });

const redisBox = vi.hoisted(() => {
  const hashes = new Map<string, Hash>();
  const strings = new Map<string, string>();
  const lists = new Map<string, string[]>();
  const sets = new Map<string, Set<string>>();
  const api = {
    hashes,
    lists,
    enabled: true,
    reset() {
      hashes.clear();
      strings.clear();
      lists.clear();
      sets.clear();
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
    async sadd(key: string, member: string) {
      let set = sets.get(key);
      if (!set) {
        set = new Set();
        sets.set(key, set);
      }
      const sizeBefore = set.size;
      set.add(member);
      return set.size > sizeBefore ? 1 : 0;
    },
    async scard(key: string) {
      return sets.get(key)?.size ?? 0;
    },
    async srem(key: string, member: string) {
      const set = sets.get(key);
      if (!set) return 0;
      return set.delete(member) ? 1 : 0;
    },
    async expire() {
      return 1;
    },
    async lpush(key: string, value: string) {
      const list = lists.get(key) ?? [];
      list.unshift(value);
      lists.set(key, list);
      return list.length;
    },
  };
  return api;
});

vi.mock("@/lib/services/redis", () => ({
  getRedis: () => (redisBox.enabled ? redisBox : null),
}));

vi.mock("@/lib/services/email", () => ({
  sendNotificationEmail: (...args: unknown[]) => sendNotificationEmail(...args),
}));

vi.mock("@/lib/db/prisma", () => ({
  getPrisma: () => null,
}));

import { revokeMember, upsertMember } from "../members";
import { CUSTOM_COMPARE_LOG_KEY, submitCustomCompare } from "../custom-compare";
import { POST } from "@/app/api/custom-compare/route";
import { NextRequest } from "next/server";

const now = new Date("2026-09-24T12:00:00.000Z");

describe("submitCustomCompare", () => {
  beforeEach(async () => {
    redisBox.reset();
    sendNotificationEmail.mockClear();
    await upsertMember({
      email: "buyer@example.com",
      plan: "pro",
      interval: "year",
      stripeCustomer: "cus_abc",
      stripeSubscription: "sub_abc",
      status: "active",
      replaceSubscription: true,
    });
  });

  it("sends a non-member to pricing instead of accepting the request", async () => {
    const result = await submitCustomCompare(
      { entityA: "Notion", entityB: "Obsidian", email: "free@example.com" },
      now
    );
    expect(result).toMatchObject({
      ok: false,
      status: 403,
      code: "upgrade_required",
      upgradeUrl: "/pricing?src=custom-compare",
    });
    expect(sendNotificationEmail).not.toHaveBeenCalled();
    expect(redisBox.lists.get(CUSTOM_COMPARE_LOG_KEY)).toBeUndefined();
  });

  it("queues an active member and alerts founders", async () => {
    const result = await submitCustomCompare(
      { entityA: "Notion", entityB: "Obsidian", email: "Buyer@Example.com", note: "offline mode" },
      now
    );
    expect(result).toMatchObject({ ok: true, status: 200, alreadyQueued: false, remaining: 1, limit: 2 });
    expect(sendNotificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "custom-compare",
        senderEmail: "buyer@example.com",
      })
    );
    const log = redisBox.lists.get(CUSTOM_COMPARE_LOG_KEY) ?? [];
    expect(log[0]).toContain("Notion");
    expect(log[0]).toContain("offline mode");
  });

  it("refuses a canceled member with the same upgrade link", async () => {
    await revokeMember({ email: "buyer@example.com", stripeSubscription: "sub_abc" });
    const result = await submitCustomCompare(
      { entityA: "Notion", entityB: "Obsidian", email: "buyer@example.com" },
      now
    );
    expect(result).toMatchObject({
      ok: false,
      status: 403,
      code: "upgrade_required",
      upgradeUrl: "/pricing?src=custom-compare",
    });
    expect(result.ok === false && result.error).toMatch(/not active/);
  });

  it("stops at two new matchups in the same month", async () => {
    const first = await submitCustomCompare(
      { entityA: "Notion", entityB: "Obsidian", email: "buyer@example.com" },
      now
    );
    const second = await submitCustomCompare(
      { entityA: "Linear", entityB: "Jira", email: "buyer@example.com" },
      now
    );
    const third = await submitCustomCompare(
      { entityA: "Figma", entityB: "Sketch", email: "buyer@example.com" },
      now
    );
    expect(first).toMatchObject({ ok: true, remaining: 1 });
    expect(second).toMatchObject({ ok: true, remaining: 0 });
    expect(third).toMatchObject({ ok: false, status: 429, code: "monthly_limit", remaining: 0 });
  });

  it("does not spend a second credit when the same pair is submitted again", async () => {
    await submitCustomCompare(
      { entityA: "Obsidian", entityB: "Notion", email: "buyer@example.com" },
      now
    );
    sendNotificationEmail.mockClear();
    const again = await submitCustomCompare(
      { entityA: "Notion", entityB: "Obsidian", email: "buyer@example.com" },
      now
    );
    expect(again).toMatchObject({ ok: true, alreadyQueued: true, remaining: 1 });
    expect(sendNotificationEmail).not.toHaveBeenCalled();
  });

  it("returns 503 when the membership store is down", async () => {
    redisBox.enabled = false;
    const result = await submitCustomCompare(
      { entityA: "Notion", entityB: "Obsidian", email: "buyer@example.com" },
      now
    );
    expect(result).toMatchObject({ ok: false, status: 503, code: "unavailable" });
  });
});

describe("POST /api/custom-compare", () => {
  beforeEach(() => {
    redisBox.reset();
  });

  it("returns the upgrade payload for a free email", async () => {
    const req = new NextRequest("https://www.aversusb.net/api/custom-compare", {
      method: "POST",
      body: JSON.stringify({ entityA: "Notion", entityB: "Obsidian", email: "free@example.com" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.upgradeUrl).toBe("/pricing?src=custom-compare");
    expect(body.ok).toBe(false);
  });
});
