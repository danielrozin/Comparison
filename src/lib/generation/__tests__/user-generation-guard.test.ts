import { afterEach, describe, expect, it, vi } from "vitest";
import {
  entityCheckMode,
  lookupEntity,
  queryBlockReason,
  validateRealEntities,
} from "@/lib/generation/user-generation-guard";

describe("queryBlockReason", () => {
  it("blocks NSFW tokens, abuse, and nonsense without blocking real names", () => {
    expect(queryBlockReason("porn", "thailand")).toBe("nsfw");
    expect(queryBlockReason("please kill yourself", "notes")).toBe("abuse");
    expect(queryBlockReason("qwertyuiop", "thailand")).toBe("nonsense");
    expect(queryBlockReason("aaaaabc", "thailand")).toBe("nonsense");
    expect(queryBlockReason("Thailand", "Vietnam")).toBeNull();
    expect(queryBlockReason("Middlesex", "Sussex")).toBeNull();
  });
});

describe("lookupEntity", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("accepts a multi-word name when Wikipedia returns that title", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => ["New York", ["New York City", "New York"], [], []],
    })) as unknown as typeof fetch;
    expect(await lookupEntity("New York", fetchImpl)).toBe("yes");
  });

  it("returns no when nothing resembles the query", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => ["asdfqwer", ["Something Else"], [], []],
    })) as unknown as typeof fetch;
    expect(await lookupEntity("asdfqwer", fetchImpl)).toBe("no");
  });

  it("returns error on timeout-style failures", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("aborted");
    }) as unknown as typeof fetch;
    expect(await lookupEntity("Thailand", fetchImpl)).toBe("error");
  });
});

describe("validateRealEntities", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("skips the lookup when the check is off", async () => {
    vi.stubEnv("USER_GENERATION_ENTITY_CHECK", "off");
    const fetchImpl = vi.fn() as unknown as typeof fetch;
    expect(await validateRealEntities("nope", "also", fetchImpl)).toEqual({ ok: true });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("fails closed when the lookup errors", async () => {
    vi.stubEnv("USER_GENERATION_ENTITY_CHECK", "fail-closed");
    expect(entityCheckMode()).toBe("fail-closed");
    const fetchImpl = vi.fn(async () => {
      throw new Error("down");
    }) as unknown as typeof fetch;
    const result = await validateRealEntities("Thailand", "Vietnam", fetchImpl);
    expect(result.ok).toBe(false);
  });

  it("fails open on lookup errors but still rejects a definitive miss", async () => {
    vi.stubEnv("USER_GENERATION_ENTITY_CHECK", "fail-open");
    const down = vi.fn(async () => {
      throw new Error("down");
    }) as unknown as typeof fetch;
    expect(await validateRealEntities("Thailand", "Vietnam", down)).toEqual({ ok: true });

    const miss = vi.fn(async () => ({
      ok: true,
      json: async () => ["nope", [], [], []],
    })) as unknown as typeof fetch;
    const rejected = await validateRealEntities("Thailand", "Vietnam", miss);
    expect(rejected.ok).toBe(false);
  });
});
