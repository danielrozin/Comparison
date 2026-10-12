import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const db = vi.hoisted(() => ({
  mode: "ok" as "ok" | "error" | "missing",
}));

const redis = vi.hoisted(() => ({
  mode: "missing" as "ok" | "error" | "missing",
}));

vi.mock("@/lib/db/prisma", () => ({
  getPrisma: () => {
    if (db.mode === "missing") return null;
    return {
      $queryRaw: async () => {
        if (db.mode === "error") throw new Error("database down");
        return [{ ok: 1 }];
      },
    };
  },
}));

vi.mock("@/lib/services/redis", () => ({
  getRedis: () => {
    if (redis.mode === "missing") return null;
    return {
      ping: async () => {
        if (redis.mode === "error") throw new Error("redis down");
        return "PONG";
      },
    };
  },
}));

import { GET } from "../route";

describe("GET /api/health", () => {
  const previousKey = process.env.RESEND_API_KEY;
  const previousFrom = process.env.RESEND_FROM_EMAIL;

  beforeEach(() => {
    db.mode = "ok";
    redis.mode = "missing";
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM_EMAIL;
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("health check must not call fetch when email is not configured");
      })
    );
  });

  afterEach(() => {
    if (previousKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previousKey;
    if (previousFrom === undefined) delete process.env.RESEND_FROM_EMAIL;
    else process.env.RESEND_FROM_EMAIL = previousFrom;
    vi.unstubAllGlobals();
  });

  it("stays ok when Redis is not configured", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body.checks.redis).toEqual({ status: "not_configured", optional: true });
    expect(body.checks.database.status).toBe("ok");
  });

  it("does not degrade when a configured Redis ping fails", async () => {
    redis.mode = "error";
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body.checks.redis.status).toBe("error");
    expect(body.checks.redis.optional).toBe(true);
  });

  it("degrades when Postgres is down", async () => {
    db.mode = "error";
    const res = await GET();
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.status).toBe("degraded");
    expect(body.checks.database.status).toBe("error");
  });

  it("checks Resend with a GET and does not send a test email", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.RESEND_FROM_EMAIL = " A Versus B <hello@aversusb-mail.com>\n";
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      expect(String(url)).toBe("https://api.resend.com/domains");
      expect(init?.method ?? "GET").toBe("GET");
      expect(String(url)).not.toContain("/emails");
      return { ok: true, json: async () => ({ data: [] }) };
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.checks.email).toMatchObject({
      status: "ok",
      from: "A Versus B <hello@aversusb-mail.com>",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns 200 when the database is up and the Resend key is send-only", async () => {
    process.env.RESEND_API_KEY = "re_send_only";
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      expect(String(url)).toBe("https://api.resend.com/domains");
      expect(init?.method ?? "GET").toBe("GET");
      expect(String(url)).not.toContain("/emails");
      return {
        ok: false,
        status: 401,
        json: async () => ({
          statusCode: 401,
          name: "restricted_api_key",
          message: "This API key is restricted to only send emails.",
        }),
      };
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body.checks.database.status).toBe("ok");
    expect(body.checks.email.status).toBe("ok");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("degrades when Resend rejects the key for a reason other than send-only", async () => {
    process.env.RESEND_API_KEY = "re_invalid";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 401,
        json: async () => ({
          statusCode: 401,
          name: "validation_error",
          message: "API key is invalid",
        }),
      }))
    );

    const res = await GET();
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.status).toBe("degraded");
    expect(body.checks.email.status).toBe("error");
  });
});
