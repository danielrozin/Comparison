import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { getPrisma } = vi.hoisted(() => ({
  getPrisma: vi.fn(() => null),
}));

vi.mock("@/lib/db/prisma", () => ({
  getPrisma,
}));

import { GET } from "@/app/api/cron/faq-backfill/route";

function call(authorization?: string) {
  return GET(
    new NextRequest("http://localhost/api/cron/faq-backfill", {
      headers: authorization ? { authorization } : {},
    }),
  );
}

describe("GET /api/cron/faq-backfill", () => {
  beforeEach(() => {
    getPrisma.mockClear();
    vi.stubEnv("CRON_SECRET", "cron-secret");
    vi.stubEnv("CRON_FAQ_BACKFILL_ENABLED", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects a missing cron secret before any database work", async () => {
    vi.stubEnv("CRON_FAQ_BACKFILL_ENABLED", "true");
    const response = await call();
    expect(response.status).toBe(401);
    expect(getPrisma).not.toHaveBeenCalled();
  });

  it("stays off and does not open the database when the flag is unset", async () => {
    vi.stubEnv("CRON_FAQ_BACKFILL_ENABLED", undefined);
    const response = await call("Bearer cron-secret");
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({
      status: "disabled",
      reason: "CRON_FAQ_BACKFILL_ENABLED is not true",
    });
    expect(getPrisma).not.toHaveBeenCalled();
  });

  it("stays off for any value other than true", async () => {
    for (const value of ["false", "1", "yes", "TRUE "]) {
      getPrisma.mockClear();
      vi.stubEnv("CRON_FAQ_BACKFILL_ENABLED", value);
      const response = await call("Bearer cron-secret");
      expect(response.status).toBe(200);
      expect((await response.json()).status).toBe("disabled");
      expect(getPrisma).not.toHaveBeenCalled();
    }
  });

  it("reaches the database only when the flag is true, and still does not write if there is no client", async () => {
    vi.stubEnv("CRON_FAQ_BACKFILL_ENABLED", "TRUE");
    const response = await call("Bearer cron-secret");
    expect(response.status).toBe(503);
    expect(getPrisma).toHaveBeenCalledTimes(1);
  });
});
