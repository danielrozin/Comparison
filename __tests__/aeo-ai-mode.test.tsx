import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { buildKeyTakeaways, takeawaySentence, TAKEAWAY_MAX_CHARS } from "@/lib/seo/key-takeaways";
import { KeyTakeaways } from "@/components/comparison/KeyTakeaways";
import { classifyAiReferral } from "@/lib/utils/ai-referral";
import { buildWebMcpTools, slugifyEntity } from "@/lib/webmcp/tools";
import type { KeyDifference } from "@/types";

// Live keyDifferences of /compare/netflix-vs-youtube-premium (Nov 2026).
const DIFFS: KeyDifference[] = [
  { label: "Primary Content Type", winner: "tie", entityAValue: "Original TV shows and licensed films", entityBValue: "User-generated videos and music library (300M+ tracks)" },
  { label: "Monthly Subscription Price (Basic Ad-Supported)", winner: "a", entityAValue: "$9.00", entityBValue: "$9.99" },
  { label: "Monthly Subscription Price (Premium Ad-Free)", winner: "b", entityAValue: "$15.49 (Standard with ads removed)", entityBValue: "$14.99" },
  { label: "Global Subscriber Count", winner: "a", entityAValue: "282 million", entityBValue: "100+ million Premium subscribers" },
  { label: "Offline Download Feature", winner: "tie", entityAValue: "Yes, available on all plans", entityBValue: "Yes, YouTube Premium members can download videos" },
  { label: "Simultaneous Streams (Premium Plan)", winner: "b", entityAValue: "4 screens on Premium", entityBValue: "Unlimited streams on all devices" },
];

describe("key takeaways", () => {
  it("builds 3-5 standalone sentences that name both products and stay ≤160 chars", () => {
    const t = buildKeyTakeaways(DIFFS, "Netflix", "YouTube Premium");
    expect(t.length).toBeGreaterThanOrEqual(3);
    expect(t.length).toBeLessThanOrEqual(5);
    for (const s of t) {
      expect(s.length).toBeLessThanOrEqual(TAKEAWAY_MAX_CHARS);
      expect(s).toContain("Netflix");
      expect(s).toContain("YouTube Premium");
      expect(s.endsWith(".")).toBe(true);
    }
    expect(t[0]).toBe("Monthly Subscription Price (Basic Ad-Supported) — Netflix: $9.00; YouTube Premium: $9.99.");
  });

  it("puts numeric, decided differences first", () => {
    const t = buildKeyTakeaways(DIFFS, "Netflix", "YouTube Premium");
    expect(t.slice(0, 3).every((s) => /\d/.test(s))).toBe(true);
  });

  it("skips placeholder values and returns [] for thin pages", () => {
    expect(takeawaySentence({ label: "Price", entityAValue: "N/A", entityBValue: "$5" }, "A", "B")).toBeNull();
    expect(buildKeyTakeaways(DIFFS.slice(0, 2), "Netflix", "YouTube Premium")).toEqual([]);
    expect(buildKeyTakeaways(undefined, "A", "B")).toEqual([]);
  });

  it("stays grammatical for plural labels and identical values", () => {
    expect(takeawaySentence({ label: "Package Deals", entityAValue: "Limited packages", entityBValue: "Extensive bundles" }, "Kayak", "Expedia")).toBe(
      "Package Deals — Kayak: Limited packages; Expedia: Extensive bundles.",
    );
    expect(takeawaySentence({ label: "Offline Downloads", entityAValue: "Yes", entityBValue: "yes." }, "A", "B")).toBe("Offline Downloads — A and B: Yes.");
  });

  it("renders a server-side list, or nothing when thin", () => {
    const { container, rerender } = render(<KeyTakeaways differences={DIFFS} nameA="Netflix" nameB="YouTube Premium" />);
    expect(screen.getByRole("heading", { name: /Netflix vs YouTube Premium: key takeaways/ })).toBeTruthy();
    expect(container.querySelectorAll("li").length).toBeGreaterThanOrEqual(3);
    rerender(<KeyTakeaways differences={DIFFS.slice(0, 1)} nameA="Netflix" nameB="YouTube Premium" />);
    expect(container.querySelector("#key-takeaways")).toBeNull();
  });
});

describe("classifyAiReferral", () => {
  it.each([
    ["", "https://chatgpt.com/", "chatgpt"],
    ["", "https://chat.openai.com/c/abc", "chatgpt"],
    ["?utm_source=chatgpt.com", "", "chatgpt"],
    ["", "https://www.perplexity.ai/search?q=x", "perplexity"],
    ["", "https://gemini.google.com/app", "gemini"],
    ["", "https://copilot.microsoft.com/", "copilot"],
    ["", "https://claude.ai/chat/1", "claude"],
  ])("%s %s → %s", (search, ref, want) => {
    expect(classifyAiReferral(search, ref)).toBe(want);
  });

  it("does not treat Google search or unrelated hosts as AI", () => {
    expect(classifyAiReferral("", "https://www.google.com/")).toBeNull();
    expect(classifyAiReferral("", "https://notchatgpt.com.evil.io/")).toBeNull();
    expect(classifyAiReferral("", "")).toBeNull();
    expect(classifyAiReferral("", "not a url")).toBeNull();
  });
});

describe("WebMCP tools", () => {
  const fetcher = vi.fn(async (url: string) => ({
    ok: true,
    json: async () => ({
      results: url.toLowerCase().includes("youtube")
        ? [{ slug: "netflix-vs-youtube-premium", title: "Netflix vs YouTube Premium", url: "https://www.aversusb.net/compare/netflix-vs-youtube-premium" }]
        : [],
    }),
  }));
  const tools = buildWebMcpTools("https://www.aversusb.net", fetcher);
  const byName = Object.fromEntries(tools.map((t) => [t.name, t]));

  it("declares read-only tools with JSON schemas", () => {
    expect(Object.keys(byName).sort()).toEqual(["compare_products", "search_comparisons"]);
    for (const t of tools) {
      expect(t.annotations?.readOnlyHint).toBe(true);
      expect(t.inputSchema.type).toBe("object");
    }
  });

  it("compare_products returns the published page when it exists", async () => {
    await expect(byName.compare_products.execute({ productA: "Netflix", productB: "YouTube Premium" })).resolves.toMatchObject({
      found: true,
      url: "https://www.aversusb.net/compare/netflix-vs-youtube-premium",
    });
  });

  it("compare_products falls back to the on-demand URL", async () => {
    await expect(byName.compare_products.execute({ productA: "Disney+", productB: "Hulu" })).resolves.toMatchObject({
      found: false,
      url: "https://www.aversusb.net/compare/disney-plus-vs-hulu",
    });
  });

  it("validates input with a descriptive error", async () => {
    await expect(byName.search_comparisons.execute({ query: " " })).rejects.toThrow(/Provide a query/);
    expect(slugifyEntity("AT&T Fiber")).toBe("at-and-t-fiber");
  });
});
