import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { executePromotionRecheck } = vi.hoisted(() => ({
  executePromotionRecheck: vi.fn(async () => ({
    enabled: true,
    processed: 0,
    deferred: 0,
    promoted: [],
    failed: [],
    tavilyCalls: 0,
    anthropicCalls: 0,
  })),
}));

vi.mock("@/lib/generation/promotion-recheck", async () => {
  const actual = await vi.importActual<typeof import("@/lib/generation/promotion-recheck")>(
    "@/lib/generation/promotion-recheck",
  );
  return {
    ...actual,
    executePromotionRecheck,
  };
});

import { GET } from "@/app/api/cron/promote-provisional/route";

function call(authorization?: string) {
  return GET(
    new NextRequest("http://localhost/api/cron/promote-provisional", {
      headers: authorization ? { authorization } : {},
    }),
  );
}

describe("GET /api/cron/promote-provisional", () => {
  beforeEach(() => {
    executePromotionRecheck.mockClear();
    vi.stubEnv("CRON_SECRET", "cron-secret");
    vi.stubEnv("GENERATION_FREEZE", "true");
    vi.stubEnv("PROMOTION_RECHECK_ENABLED", "false");
  });

  it("rejects a missing cron secret", async () => {
    const response = await call();
    expect(response.status).toBe(401);
    expect(executePromotionRecheck).not.toHaveBeenCalled();
  });

  it("stays off unless the promotion flag is set, even while generation is frozen", async () => {
    const response = await call("Bearer cron-secret");
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("disabled");
    expect(executePromotionRecheck).not.toHaveBeenCalled();
  });

  it("runs when the promotion flag is on and does not consult the generation freeze", async () => {
    vi.stubEnv("PROMOTION_RECHECK_ENABLED", "true");
    const response = await call("Bearer cron-secret");
    expect(response.status).toBe(200);
    expect(executePromotionRecheck).toHaveBeenCalledTimes(1);
  });
});
