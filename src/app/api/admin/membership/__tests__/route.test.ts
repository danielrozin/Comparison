/**
 * ROO-42 — GET /api/admin/membership?email=
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";

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

import { upsertMember } from "@/lib/monetization/members";

async function getMembership(email: string | null, headers: Record<string, string> = {}) {
  const { GET } = await import("../route");
  const url = new URL("https://aversusb.net/api/admin/membership");
  if (email !== null) url.searchParams.set("email", email);
  const req = new NextRequest(url, { headers });
  return GET(req);
}

describe("GET /api/admin/membership", () => {
  const previousAdmin = process.env.ADMIN_TOKEN;
  const previousCron = process.env.CRON_SECRET;

  beforeEach(() => {
    redisBox.reset();
    process.env.ADMIN_TOKEN = "admin-secret";
    delete process.env.CRON_SECRET;
  });

  afterEach(() => {
    if (previousAdmin === undefined) delete process.env.ADMIN_TOKEN;
    else process.env.ADMIN_TOKEN = previousAdmin;
    if (previousCron === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = previousCron;
  });

  it("rejects missing and wrong secrets", async () => {
    const missing = await getMembership("buyer@example.com");
    expect(missing.status).toBe(401);

    const wrong = await getMembership("buyer@example.com", {
      authorization: "Bearer nope",
    });
    expect(wrong.status).toBe(401);
  });

  it("returns 503 when no admin secret is configured", async () => {
    delete process.env.ADMIN_TOKEN;
    delete process.env.CRON_SECRET;
    const res = await getMembership("buyer@example.com", {
      authorization: "Bearer admin-secret",
    });
    expect(res.status).toBe(503);
  });

  it("returns the plan for an authorized email lookup", async () => {
    await upsertMember({
      email: "buyer@example.com",
      plan: "pro",
      interval: "year",
      stripeCustomer: "cus_abc",
      stripeSubscription: "sub_xyz",
      status: "active",
      src: "header",
      replaceSubscription: true,
      updatedAt: "2026-09-23T05:00:00.000Z",
    });

    const res = await getMembership("Buyer@Example.com", {
      "x-admin-token": "admin-secret",
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      email: "buyer@example.com",
      found: true,
      active: true,
      plan: "pro",
      interval: "year",
      status: "active",
      stripeCustomer: "cus_abc",
      stripeSubscription: "sub_xyz",
      updatedAt: "2026-09-23T05:00:00.000Z",
      src: "header",
    });
  });

  it("accepts CRON_SECRET and reports a canceled member as inactive", async () => {
    process.env.CRON_SECRET = "cron-secret";
    await upsertMember({
      email: "buyer@example.com",
      plan: "pro",
      interval: "month",
      stripeCustomer: "cus_abc",
      stripeSubscription: "sub_xyz",
      status: "canceled",
      replaceSubscription: true,
      updatedAt: "2026-09-23T08:00:00.000Z",
    });

    const res = await getMembership("buyer@example.com", {
      authorization: "Bearer cron-secret",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.found).toBe(true);
    expect(body.active).toBe(false);
    expect(body.status).toBe("canceled");
    expect(body.plan).toBe("pro");
  });

  it("returns found:false for an email that never paid", async () => {
    const res = await getMembership("nobody@example.com", {
      authorization: "Bearer admin-secret",
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      email: "nobody@example.com",
      found: false,
      active: false,
      plan: null,
    });
  });

  it("validates the email query param", async () => {
    const missing = await getMembership(null, { authorization: "Bearer admin-secret" });
    expect(missing.status).toBe(400);

    const invalid = await getMembership("not-an-email", {
      authorization: "Bearer admin-secret",
    });
    expect(invalid.status).toBe(400);
  });

  it("returns 503 when Redis is not configured", async () => {
    redisBox.enabled = false;
    const res = await getMembership("buyer@example.com", {
      authorization: "Bearer admin-secret",
    });
    expect(res.status).toBe(503);
  });
});
