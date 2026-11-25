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

  // Nov 2026: real products and people were refused as unknown_entity.
  const wiki = (titlesFor: Record<string, string[]>, wikidata: Record<string, string[]> = {}) =>
    vi.fn(async (input: URL) => {
      const q = input.searchParams.get("search") ?? "";
      if (input.hostname === "www.wikidata.org") {
        return { ok: true, json: async () => ({ search: (wikidata[q] ?? []).map((label) => ({ label })) }) };
      }
      return { ok: true, json: async () => [q, titlesFor[q] ?? [], [], []] };
    }) as unknown as typeof fetch;

  it("matches a surname or an apostrophe-split name", async () => {
    expect(await lookupEntity("messi", wiki({ messi: ["Lionel Messi", "Messiah"] }))).toBe("yes");
    expect(await lookupEntity("domino s", wiki({ "domino s": ["Domino's"] }))).toBe("yes");
  });

  it("falls back to the brand when the model has no page", async () => {
    const f = wiki({ "macbook air": ["MacBook Air (Apple silicon)"], zoho: ["Zoho Corporation"] });
    expect(await lookupEntity("macbook air m4", f)).toBe("yes");
    expect(await lookupEntity("zoho books", f)).toBe("yes");
  });

  it("falls back to Wikidata for software without a Wikipedia page", async () => {
    expect(await lookupEntity("weaviate", wiki({}, { weaviate: ["Weaviate"] }))).toBe("yes");
    expect(await lookupEntity("asdfqwer", wiki({}, {}))).toBe("no");
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
