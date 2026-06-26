/**
 * Embeddings helper (DAN-520 gate #2).
 *
 * Thin wrapper around a small text-embedding model used by the blog dedup
 * gate to catch *semantic* near-duplicates whose surface tokens differ
 * (e.g. "Apple Notebook Mass Reference 2026" vs an existing
 * "macbook-pro-weight" article). The deterministic gates in dedup-gate.ts
 * only compare shared tokens, so they miss this class entirely.
 *
 * Provider: OpenAI `text-embedding-3-small` by default (cheapest viable —
 * ~$0.02 / 1M tokens). Anthropic does not currently expose an embeddings
 * endpoint; swap EMBEDDING_PROVIDER / the request below for Voyage or Cohere
 * if a single-vendor stack is wanted later.
 *
 * Fail-open by design: when no API key is configured (or the call fails) the
 * helpers return null and the caller skips the semantic gate — mirroring the
 * getPrisma()/getRedis() register-on-demand pattern elsewhere in this repo.
 * The deterministic gates still run, so dedup never *depends* on the API.
 */

const DEFAULT_MODEL = "text-embedding-3-small";
const OPENAI_EMBEDDINGS_URL = "https://api.openai.com/v1/embeddings";
// OpenAI caps a single embeddings request at 2048 inputs; stay well under.
const BATCH_SIZE = 256;

function getApiKey(): string | null {
  const key = process.env.OPENAI_API_KEY || process.env.EMBEDDING_API_KEY;
  if (!key || key.trim() === "") return null;
  return key;
}

export function getEmbeddingModel(): string {
  return process.env.EMBEDDING_MODEL || DEFAULT_MODEL;
}

/** True when an embeddings provider is configured. Cheap pre-check. */
export function embeddingsEnabled(): boolean {
  return getApiKey() !== null;
}

async function callOpenAIEmbeddings(inputs: string[]): Promise<number[][] | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  if (inputs.length === 0) return [];

  try {
    const res = await fetch(OPENAI_EMBEDDINGS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: getEmbeddingModel(), input: inputs }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn(`[embeddings] OpenAI ${res.status}: ${body.slice(0, 200)}`);
      return null;
    }

    const json = (await res.json()) as {
      data?: Array<{ index: number; embedding: number[] }>;
    };
    if (!json.data || !Array.isArray(json.data)) return null;

    // OpenAI returns results in request order, but sort by index defensively.
    return [...json.data]
      .sort((a, b) => a.index - b.index)
      .map((d) => d.embedding);
  } catch (err) {
    console.warn("[embeddings] request failed:", err);
    return null;
  }
}

/**
 * Embed a single string. Returns null when embeddings are disabled or the
 * request fails (fail-open).
 */
export async function embedText(text: string): Promise<number[] | null> {
  if (!text || text.trim() === "") return null;
  const out = await callOpenAIEmbeddings([text]);
  if (!out || out.length === 0) return null;
  return out[0] ?? null;
}

/**
 * Embed many strings, automatically chunked into provider-sized batches.
 * Returns null when embeddings are disabled. On a partial/failed batch the
 * affected entries are null so callers can skip them individually.
 */
export async function embedTexts(texts: string[]): Promise<(number[] | null)[] | null> {
  if (!embeddingsEnabled()) return null;
  if (texts.length === 0) return [];

  const results: (number[] | null)[] = [];
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const chunk = texts.slice(i, i + BATCH_SIZE);
    const embedded = await callOpenAIEmbeddings(chunk);
    if (!embedded) {
      // Whole batch failed — record nulls so indices stay aligned.
      for (let j = 0; j < chunk.length; j++) results.push(null);
    } else {
      for (let j = 0; j < chunk.length; j++) results.push(embedded[j] ?? null);
    }
  }
  return results;
}

/**
 * Cosine similarity between two equal-length dense vectors. Returns 0 when
 * either vector is empty/zero-magnitude or lengths differ (treated as "not
 * comparable" rather than throwing — keeps the gate fail-open).
 */
export function cosineSimilarityVec(a: number[], b: number[]): number {
  if (!a || !b || a.length === 0 || b.length === 0 || a.length !== b.length) {
    return 0;
  }
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}
