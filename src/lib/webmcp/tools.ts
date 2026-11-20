// WebMCP tool definitions (Chrome origin trial; Gemini in Chrome is adding
// support). Lets an in-browser AI agent call our search/compare directly instead
// of scraping the DOM. Read-only, same-origin, public endpoints only.
// API shape: document.modelContext.registerTool({ name, description,
// inputSchema, annotations, execute }, { signal }) — developer.chrome.com/docs/ai/webmcp.

export interface WebMcpTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean };
  execute: (input: Record<string, unknown>) => Promise<unknown>;
}

type Fetcher = (url: string) => Promise<{ ok: boolean; json: () => Promise<unknown> }>;

export function slugifyEntity(name: string): string {
  return name
    .toLowerCase()
    .replace(/\+/g, " plus ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface SearchResult {
  slug: string;
  title: string;
  url: string;
}

async function search(fetcher: Fetcher, origin: string, query: string, limit: number): Promise<SearchResult[]> {
  const res = await fetcher(`${origin}/api/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  if (!res.ok) throw new Error(`Search failed for "${query}". Try a shorter product name.`);
  const data = (await res.json()) as { results?: SearchResult[] };
  return (data.results ?? []).slice(0, limit).map((r) => ({ slug: r.slug, title: r.title, url: r.url }));
}

export function buildWebMcpTools(origin: string, fetcher: Fetcher): WebMcpTool[] {
  return [
    {
      name: "search_comparisons",
      description:
        "Searches A Versus B for published side-by-side product, service or brand comparisons. Returns titles and URLs of matching comparison pages.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "A product, brand or topic, e.g. 'Netflix' or 'PS5 vs Xbox'." },
          limit: { type: "number", description: "Maximum results to return (1-10). Defaults to 5." },
        },
        required: ["query"],
      },
      annotations: { readOnlyHint: true },
      async execute(input) {
        const query = String(input.query ?? "").trim();
        if (!query) throw new Error("Provide a query, for example 'Netflix'.");
        const limit = Math.min(10, Math.max(1, Number(input.limit) || 5));
        const results = await search(fetcher, origin, query, limit);
        return { query, results, count: results.length };
      },
    },
    {
      name: "compare_products",
      description:
        "Finds the A Versus B comparison page for two named products or services (for example 'Netflix' and 'YouTube Premium') and returns its URL. If none is published yet, returns the URL where a new comparison can be generated.",
      inputSchema: {
        type: "object",
        properties: {
          productA: { type: "string", description: "First product, brand or service name." },
          productB: { type: "string", description: "Second product, brand or service name." },
        },
        required: ["productA", "productB"],
      },
      annotations: { readOnlyHint: true },
      async execute(input) {
        const a = String(input.productA ?? "").trim();
        const b = String(input.productB ?? "").trim();
        if (!a || !b) throw new Error("Provide both productA and productB.");
        const sa = slugifyEntity(a);
        const sb = slugifyEntity(b);
        const results = await search(fetcher, origin, `${a} vs ${b}`, 10);
        const match = results.find((r) => r.slug.includes(sa) && r.slug.includes(sb));
        if (match) return { found: true, title: match.title, url: match.url };
        return {
          found: false,
          url: `${origin}/compare/${sa}-vs-${sb}`,
          note: "No published comparison yet; this page generates one on demand.",
        };
      },
    },
  ];
}
