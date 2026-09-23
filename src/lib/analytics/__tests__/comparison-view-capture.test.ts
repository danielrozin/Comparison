/**
 * ROO-48 — comparison_viewed fires with $pageview, before React hydration,
 * for every /compare/:slug page (design/AI and the rest of the template).
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect, beforeEach, vi } from "vitest";

const capture = vi.fn();

vi.mock("posthog-js", () => ({
  default: {
    capture: (...args: unknown[]) => capture(...args),
    identify: vi.fn(),
  },
}));

vi.mock("@/lib/services/clarity-service", () => ({
  tagComparisonView: vi.fn(),
  tagSearchQuery: vi.fn(),
  tagExperimentVariant: vi.fn(),
  tagUserAction: vi.fn(),
  tagEngagement: vi.fn(),
}));

import {
  captureComparisonViewed,
  captureComparisonViewedFromLocation,
  parseCompareSlug,
  readCompareCategory,
  resetComparisonViewedCaptureForTests,
} from "../comparison-view-capture";

function installCompareDocument(slug: string, category: string, search = "") {
  window.history.pushState({}, "", `/compare/${slug}${search}`);
  document.body.innerHTML = "";
  const payload = document.createElement("script");
  payload.id = "__NEXT_DATA__";
  payload.type = "application/json";
  payload.textContent = JSON.stringify({
    props: { pageProps: { slug, comparison: { category } } },
  });
  document.body.appendChild(payload);
}

describe("comparison_viewed early fire path (ROO-48)", () => {
  beforeEach(() => {
    capture.mockClear();
    resetComparisonViewedCaptureForTests();
    window.history.pushState({}, "", "/");
    document.body.innerHTML = "";
  });

  it("reads a single compare slug and ignores other routes", () => {
    expect(parseCompareSlug("/compare/figma-vs-sketch")).toBe("figma-vs-sketch");
    expect(parseCompareSlug("/compare/canva-vs-photoshop/")).toBe("canva-vs-photoshop");
    expect(parseCompareSlug("/compare/chatgpt-vs-gemini?utm=1")).toBe("chatgpt-vs-gemini");
    expect(parseCompareSlug("/compare/youtube-music-vs-soundcloud")).toBe(
      "youtube-music-vs-soundcloud",
    );
    expect(parseCompareSlug("/compare/us-vs-china-gdp")).toBe("us-vs-china-gdp");
    expect(parseCompareSlug("/")).toBeNull();
    expect(parseCompareSlug("/blog/figma-vs-sketch")).toBeNull();
    expect(parseCompareSlug("/compare")).toBeNull();
    expect(parseCompareSlug("/trending")).toBeNull();
  });

  it("reads category from the page payload and falls back when it is missing", () => {
    installCompareDocument("figma-vs-sketch", "design");
    expect(readCompareCategory(document)).toBe("design");

    document.getElementById("__NEXT_DATA__")!.textContent = "{not-json";
    expect(readCompareCategory(document)).toBe("general");
    expect(readCompareCategory(null)).toBe("general");
  });

  it.each([
    ["figma-vs-sketch", "design"],
    ["canva-vs-photoshop", "design"],
    ["chatgpt-vs-gemini", "technology"],
    ["youtube-music-vs-soundcloud", "music"],
    ["notion-vs-obsidian-vs-logseq", "productivity"],
    ["excel-vs-airtable", "productivity"],
  ])("captures comparison_viewed for /compare/%s before hydration", (slug, category) => {
    installCompareDocument(slug, category, "?source_page=blog-hub");

    expect(captureComparisonViewedFromLocation()).toBe(true);

    expect(capture).toHaveBeenCalledTimes(1);
    expect(capture).toHaveBeenCalledWith(
      "comparison_viewed",
      {
        comparison_slug: slug,
        category,
        source_page: "blog-hub",
      },
      { send_instantly: true },
    );
  });

  it("does not capture on non-compare documents", () => {
    window.history.pushState({}, "", "/blog/best-design-tools");
    expect(captureComparisonViewedFromLocation()).toBe(false);
    expect(capture).not.toHaveBeenCalled();
  });

  it("dedupes the bootstrap capture and the hydrated tracker for the same slug", async () => {
    installCompareDocument("figma-vs-sketch", "design");
    const { trackComparisonView } = await import("@/lib/utils/analytics");

    expect(captureComparisonViewedFromLocation()).toBe(true);
    trackComparisonView("figma-vs-sketch", "design");
    captureComparisonViewed("figma-vs-sketch", "design");

    const viewed = capture.mock.calls.filter((call) => call[0] === "comparison_viewed");
    expect(viewed).toHaveLength(1);
    expect(viewed[0]?.[1]).toEqual({
      comparison_slug: "figma-vs-sketch",
      category: "design",
    });
    expect(viewed[0]?.[2]).toEqual({ send_instantly: true });
  });

  it("still captures from the hydrated tracker when the bootstrap did not run", async () => {
    window.history.pushState({}, "", "/compare/canva-vs-photoshop");
    const { trackComparisonView } = await import("@/lib/utils/analytics");

    trackComparisonView("canva-vs-photoshop", "design");

    expect(capture).toHaveBeenCalledWith(
      "comparison_viewed",
      expect.objectContaining({
        comparison_slug: "canva-vs-photoshop",
        category: "design",
      }),
      undefined,
    );
  });

  it("fires again when the visitor moves to a different compare slug", () => {
    installCompareDocument("chatgpt-vs-gemini", "technology");
    expect(captureComparisonViewedFromLocation()).toBe(true);

    installCompareDocument("figma-vs-sketch", "design");
    expect(captureComparisonViewedFromLocation()).toBe(true);

    expect(capture.mock.calls.map((call) => call[1]?.comparison_slug)).toEqual([
      "chatgpt-vs-gemini",
      "figma-vs-sketch",
    ]);
  });

  it("is armed in the PostHog bootstrap, after init, not only in the compare chunk", () => {
    const source = readFileSync(
      path.resolve(process.cwd(), "instrumentation-client.ts"),
      "utf8",
    );
    const initAt = source.indexOf("posthog.init");
    const captureAt = source.indexOf("captureComparisonViewedFromLocation()");
    expect(initAt).toBeGreaterThan(-1);
    expect(captureAt).toBeGreaterThan(initAt);
  });
});
