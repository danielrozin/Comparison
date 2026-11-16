/**
 * ROO-453 — internal links carry data-source-page instead of ?source_page=,
 * and the landing page still gets its source_page for PostHog.
 */
import { describe, it, expect, beforeEach } from "vitest";
import {
  INTERNAL_SOURCE_TTL_MS,
  installInternalSourceTracking,
  landingSourcePage,
  rememberInternalSource,
  resetInternalSourceTrackingForTests,
} from "../internal-source";

describe("internal source attribution", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    resetInternalSourceTrackingForTests();
    document.body.innerHTML = "";
  });

  it("prefers ?source_page= from the URL", () => {
    rememberInternalSource("home", "/compare/a-vs-b", 1000);
    expect(landingSourcePage({ pathname: "/compare/a-vs-b", search: "?source_page=blog-x" }, 1000)).toBe("blog-x");
  });

  it("returns the stored source for the clicked path within the TTL", () => {
    rememberInternalSource("compare-related", "/compare/a-vs-b", 1000);
    expect(landingSourcePage({ pathname: "/compare/a-vs-b", search: "" }, 2000)).toBe("compare-related");
  });

  it("ignores a stored source for a different path or after the TTL", () => {
    rememberInternalSource("home", "/compare/a-vs-b", 1000);
    expect(landingSourcePage({ pathname: "/compare/c-vs-d", search: "" }, 1500)).toBeUndefined();
    expect(
      landingSourcePage({ pathname: "/compare/a-vs-b", search: "" }, 1000 + INTERNAL_SOURCE_TTL_MS + 1),
    ).toBeUndefined();
  });

  it("records clicks on a[data-source-page] through one delegated listener", () => {
    installInternalSourceTracking(document);
    document.body.innerHTML =
      '<a id="l" href="/compare/rtx-5070-vs-rtx-5060-ti" data-source-page="compare-next"><span id="inner">x</span></a>';
    const inner = document.getElementById("inner")!;
    inner.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(landingSourcePage({ pathname: "/compare/rtx-5070-vs-rtx-5060-ti", search: "" })).toBe("compare-next");
  });

  it("does not record plain links without the attribute", () => {
    installInternalSourceTracking(document);
    document.body.innerHTML = '<a id="l" href="/compare/a-vs-b">x</a>';
    document.getElementById("l")!.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(landingSourcePage({ pathname: "/compare/a-vs-b", search: "" })).toBeUndefined();
  });
});
