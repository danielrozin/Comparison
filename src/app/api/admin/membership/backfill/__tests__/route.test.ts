import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/monetization/backfill-pro-members", () => ({
  backfillProMembers: vi.fn(async ({ dryRun }: { dryRun: boolean }) => ({
    ok: true,
    dryRun,
    since: "2026-09-20T00:00:00.000Z",
    priceIds: ["price_pro_year"],
    scanned: 0,
    matched: 0,
    upserted: 0,
    skipped: 0,
    truncated: false,
    members: [],
  })),
}));

import { backfillProMembers } from "@/lib/monetization/backfill-pro-members";
import { POST } from "../route";

describe("POST /api/admin/membership/backfill", () => {
  const previousAdmin = process.env.ADMIN_TOKEN;

  beforeEach(() => {
    process.env.ADMIN_TOKEN = "admin-secret";
    vi.mocked(backfillProMembers).mockClear();
  });

  afterEach(() => {
    if (previousAdmin === undefined) delete process.env.ADMIN_TOKEN;
    else process.env.ADMIN_TOKEN = previousAdmin;
  });

  it("rejects callers without the admin secret", async () => {
    const req = new NextRequest("https://aversusb.net/api/admin/membership/backfill", {
      method: "POST",
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
    expect(backfillProMembers).not.toHaveBeenCalled();
  });

  it("defaults to a dry-run", async () => {
    const req = new NextRequest("https://aversusb.net/api/admin/membership/backfill", {
      method: "POST",
      headers: { authorization: "Bearer admin-secret" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(backfillProMembers).toHaveBeenCalledWith({ dryRun: true });
    expect(await res.json()).toMatchObject({ dryRun: true });
  });

  it("writes only when dryRun=false", async () => {
    const req = new NextRequest(
      "https://aversusb.net/api/admin/membership/backfill?dryRun=false",
      { method: "POST", headers: { "x-admin-token": "admin-secret" } }
    );
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(backfillProMembers).toHaveBeenCalledWith({ dryRun: false });
  });
});