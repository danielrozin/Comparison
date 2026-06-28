import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/services/redis", () => ({
  getRedis: () => null,
}));

vi.mock("@/lib/db/prisma", () => ({
  getPrisma: () => null,
}));

import {
  contentTokens,
  topicSignature,
  slugPrefixKey,
  decideDedup,
  decideSemanticDedup,
  checkBlogDedup,
  __TESTING__,
} from "../dedup-gate";
import { cosineSimilarityVec } from "../embeddings";

describe("contentTokens", () => {
  it("strips years, stop words, SEO modifiers, short tokens, dedupes, preserves order", () => {
    expect(
      contentTokens("Macbook Pro Weight 2025-2026 Complete Specs Comparison Guide")
    ).toEqual(["macbook", "pro", "weight", "specs"]);
  });

  it("handles punctuation and whitespace", () => {
    expect(
      contentTokens("AI Chatbots Compared: ChatGPT vs Claude vs Gemini in 2026")
    ).toEqual(["chatbots", "chatgpt", "claude", "gemini"]);
  });
});

describe("topicSignature", () => {
  it("collapses all 8 macbook-pro-weight title variants to the same signature", () => {
    const titles = [
      "Macbook Pro Weight 2024-2025: How New Models Compare to Previous Generations",
      "Macbook Pro Weight 2025-2026: Complete Guide to All Models",
      "Macbook Pro Weight 2025-2026: Complete Specs Comparison Guide",
      "Macbook Pro Weight 2026: All Models Compared and Specs",
      "Macbook Pro Weight by Model 2024-2025 and 2026 Specs Compared",
      "Macbook Pro Weight by Model 2024-2026 Specs Compared",
      "Macbook Pro Weight Comparison 2024-2026: All Models Specs Guide",
      "Macbook Pro Weight Comparison 2024-2026: Why the Latest Models Changed",
    ];
    const sigs = new Set(titles.map(topicSignature));
    expect(sigs.size).toBe(1);
    expect(sigs.has("macbook|pro|weight")).toBe(true);
  });

  it("returns distinct signatures for legitimately different topics", () => {
    const a = topicSignature("Bitcoin vs Ethereum: Which Crypto Should You Invest In? (2026 Guide)");
    const b = topicSignature("Netflix vs Disney+: Who's Winning the Streaming Wars in 2026?");
    const c = topicSignature("Running vs Walking for Weight Loss: Which Burns More Fat?");
    expect(a).not.toBe(b);
    expect(b).not.toBe(c);
    expect(a).not.toBe(c);
  });

  it("returns empty string when title has < 2 content tokens (skip gate)", () => {
    expect(topicSignature("Best 2026")).toBe("");
    expect(topicSignature("")).toBe("");
  });
});

describe("slugPrefixKey", () => {
  it("strips year tokens and returns first 5 token prefix", () => {
    expect(
      slugPrefixKey("macbook-pro-weight-2024-2025-by-model-and-specs-compared")
    ).toBe("macbook-pro-weight-by-model");
    expect(
      slugPrefixKey("macbook-pro-weight-by-model-2024-2026-specs-compared")
    ).toBe("macbook-pro-weight-by-model");
  });

  it("returns null for slugs too short for a stable 5-token prefix", () => {
    expect(slugPrefixKey("short-slug")).toBeNull();
    expect(slugPrefixKey("only-four-tokens-here")).toBeNull();
  });
});

describe("decideDedup", () => {
  const macbookExisting = {
    slug: "macbook-pro-weight-2025-2026-complete-specs-comparison-guide",
    title: "Macbook Pro Weight 2025-2026: Complete Specs Comparison Guide",
  };

  it("rejects on topic-signature match across the macbook-pro-weight cluster", () => {
    const result = decideDedup(
      "Macbook Pro Weight Comparison 2024-2026: Why the Latest Models Changed",
      "macbook-pro-weight-comparison-2024-2026-why-the-latest-models-changed",
      [macbookExisting]
    );
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("topic_signature_match");
    expect(result.conflictingSlug).toBe(macbookExisting.slug);
  });

  it("rejects on slug-prefix collision when years differ", () => {
    const result = decideDedup(
      // Title intentionally crafted to NOT trip the signature gate so we
      // isolate gate #1 behavior.
      "Different Headline About Battery 2027",
      "macbook-pro-weight-by-model-2027-and-2028-summary",
      [
        {
          slug: "macbook-pro-weight-by-model-2024-2025-and-2026-specs-compared",
          title: "Macbook Pro Weight by Model 2024-2025 and 2026 Specs Compared",
        },
      ]
    );
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("slug_prefix_collision");
  });

  it("allows truly distinct articles", () => {
    expect(
      decideDedup(
        "Bitcoin vs Ethereum 2026 Investment Guide",
        "bitcoin-vs-ethereum-2026-investment-guide",
        [macbookExisting]
      ).ok
    ).toBe(true);
  });

  it("treats same-slug existing row as upsert (not a collision)", () => {
    expect(
      decideDedup(macbookExisting.title, macbookExisting.slug, [macbookExisting]).ok
    ).toBe(true);
  });

  it("is no-op against an empty existing set", () => {
    expect(
      decideDedup("Anything Goes Here 2026", "anything-goes-here-2026", []).ok
    ).toBe(true);
  });
});

describe("cosineSimilarityVec", () => {
  it("returns 1 for identical vectors and 0 for orthogonal", () => {
    expect(cosineSimilarityVec([1, 2, 3], [1, 2, 3])).toBeCloseTo(1, 6);
    expect(cosineSimilarityVec([1, 0, 0], [0, 1, 0])).toBe(0);
  });

  it("returns 0 for empty, zero-magnitude, or mismatched-length vectors", () => {
    expect(cosineSimilarityVec([], [1, 2])).toBe(0);
    expect(cosineSimilarityVec([0, 0], [1, 1])).toBe(0);
    expect(cosineSimilarityVec([1, 2, 3], [1, 2])).toBe(0);
  });
});

describe("decideSemanticDedup", () => {
  // Stands in for "Apple Notebook Mass Reference 2026" — a real near-dup of
  // an existing macbook-pro-weight article that shares NO surface tokens, so
  // the deterministic gates (#1-#3) cannot see it. Vectors are hand-crafted
  // so the test is deterministic and needs no embeddings API.
  const proposed = [1, 0.05, 0];

  it("rejects a near-dup whose embedding cosine >= threshold", () => {
    const result = decideSemanticDedup("apple-notebook-mass-reference-2026", proposed, [
      { slug: "macbook-pro-weight-2026", title: "Macbook Pro Weight 2026", embedding: [1, 0, 0] },
    ]);
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("title_cosine_similarity");
    expect(result.conflictingSlug).toBe("macbook-pro-weight-2026");
    expect(result.score).toBeGreaterThanOrEqual(__TESTING__.EMBEDDING_SIMILARITY_THRESHOLD);
  });

  it("does NOT reject a legitimately distinct article (low cosine)", () => {
    const result = decideSemanticDedup("bitcoin-vs-ethereum-2026", proposed, [
      { slug: "running-vs-walking", title: "Running vs Walking", embedding: [0, 1, 0] },
    ]);
    expect(result.ok).toBe(true);
  });

  it("skips candidates with no stored embedding and the same-slug row", () => {
    const result = decideSemanticDedup("macbook-pro-weight-2026", proposed, [
      // same slug = upsert path
      { slug: "macbook-pro-weight-2026", title: "Macbook Pro Weight 2026", embedding: [1, 0, 0] },
      // unembedded candidate must be ignored, not crash
      { slug: "some-other-article", title: "Some Other Article", embedding: [] },
    ]);
    expect(result.ok).toBe(true);
  });

  it("is a no-op when the proposed embedding is empty (fail-open)", () => {
    const result = decideSemanticDedup("anything", [], [
      { slug: "macbook-pro-weight-2026", title: "Macbook Pro Weight 2026", embedding: [1, 0, 0] },
    ]);
    expect(result.ok).toBe(true);
  });
});

describe("checkBlogDedup", () => {
  it("fails open (returns ok) when no DB is configured", async () => {
    const result = await checkBlogDedup(
      "Macbook Pro Weight Comparison 2026",
      "macbook-pro-weight-comparison-2026"
    );
    expect(result.ok).toBe(true);
  });

  it("returns ok when title or slug is empty", async () => {
    expect((await checkBlogDedup("", "some-slug")).ok).toBe(true);
    expect((await checkBlogDedup("Some Title", "")).ok).toBe(true);
  });
});
