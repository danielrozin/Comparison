import { describe, it, expect } from "vitest";

import { COMPARE_REDIRECTS, getConsolidatedCompareSlug } from "../compare-redirects";
import {
  HTML_SUFFIX_COMPARE_STATUS,
  compareHtmlSuffixRedirectPath,
  resolveHtmlSuffixCompareRedirect,
} from "../html-suffix-compare";

const LIVE_SPORTS = [
  "neymar-vs-mbappe",
  "haaland-vs-mbappe",
  "messi-vs-ronaldo",
  // Verified live 200 on 2026-09-23. The HTML-suffixed variant strips back
  // to this slug; it is not rewritten onto a different sports page.
  "neymar-vs-cristiano-ronaldo-career-stats-comparison-2026",
] as const;

describe("ROO-25 HTML-suffix compare strip", () => {
  it("301s the Neymar and Messi HTML-suffix samples to their live canonicals", () => {
    expect(HTML_SUFFIX_COMPARE_STATUS).toBe(301);

    const samples: Array<[string, string]> = [
      [
        "/compare/neymar-vs-mbappe:A%3Cb%3ENeymar",
        "/compare/neymar-vs-mbappe",
      ],
      [
        "/compare/neymar-vs-mbappe:A<b>Neymar",
        "/compare/neymar-vs-mbappe",
      ],
      [
        "/compare/messi-vs-ronaldo:A%3Cb%3EMessi",
        "/compare/messi-vs-ronaldo",
      ],
      [
        "/compare/messi-vs-ronaldo:A<b>Messi",
        "/compare/messi-vs-ronaldo",
      ],
      [
        "/compare/neymar-vs-cristiano-ronaldo-career-stats-comparison-2026:P%3Cb%3ENeymar%3C/b",
        "/compare/neymar-vs-cristiano-ronaldo-career-stats-comparison-2026",
      ],
      [
        "/compare/neymar-vs-cristiano-ronaldo-career-stats-comparison-2026:P<b>Neymar</b",
        "/compare/neymar-vs-cristiano-ronaldo-career-stats-comparison-2026",
      ],
    ];

    for (const [from, to] of samples) {
      expect(compareHtmlSuffixRedirectPath(from), from).toBe(to);
      expect(resolveHtmlSuffixCompareRedirect(from), from).toBe(
        to.replace("/compare/", ""),
      );
      expect(to.includes("%"), to).toBe(false);
      expect(to.includes("<"), to).toBe(false);
      expect(to.includes(":"), to).toBe(false);
    }
  });

  it("accepts the same samples as a bare slug or an absolute URL", () => {
    expect(
      resolveHtmlSuffixCompareRedirect("neymar-vs-mbappe:A%3Cb%3ENeymar"),
    ).toBe("neymar-vs-mbappe");
    expect(
      resolveHtmlSuffixCompareRedirect(
        "https://www.aversusb.net/compare/messi-vs-ronaldo:A%3Cb%3EMessi",
      ),
    ).toBe("messi-vs-ronaldo");
  });

  it("never redirects live healthy sports compares", () => {
    for (const live of LIVE_SPORTS) {
      expect(resolveHtmlSuffixCompareRedirect(live), live).toBeNull();
      expect(resolveHtmlSuffixCompareRedirect(`/compare/${live}`), live).toBeNull();
      expect(getConsolidatedCompareSlug(live), live).toBeNull();
      expect(
        COMPARE_REDIRECTS.some((r) => r.source === `/compare/${live}`),
        `${live} is live and must not be a redirect source`,
      ).toBe(false);
    }
  });

  it("does not fold colon tails that are not HTML, or unrelated routes", () => {
    expect(
      resolveHtmlSuffixCompareRedirect("/compare/neymar-vs-mbappe:career-stats"),
    ).toBeNull();
    expect(resolveHtmlSuffixCompareRedirect("/compare/djokovic-vs-nadal")).toBeNull();
    expect(
      resolveHtmlSuffixCompareRedirect("/compare/djokovic-vs-federer"),
    ).toBeNull();
    expect(
      resolveHtmlSuffixCompareRedirect("/compare/haaland-vs-mbappe"),
    ).toBeNull();
    expect(
      compareHtmlSuffixRedirectPath("/blog/neymar-vs-mbappe:A<b>Neymar"),
    ).toBeNull();
    expect(
      resolveHtmlSuffixCompareRedirect("/compare/foo-vs-bar/extra:A<b>x"),
    ).toBeNull();
    expect(
      resolveHtmlSuffixCompareRedirect("grubhub-vs-grubhub:A<b>X"),
    ).toBeNull();
    expect(resolveHtmlSuffixCompareRedirect("")).toBeNull();
  });

  it("strips a plausible unpublished base, and one-hops a known alias", () => {
    expect(
      resolveHtmlSuffixCompareRedirect("/compare/alpha-vs-beta:A%3Cb%3EAlpha"),
    ).toBe("alpha-vs-beta");

    expect(getConsolidatedCompareSlug("neymar-vs-mbape")).toBe("neymar-vs-mbappe");
    expect(
      resolveHtmlSuffixCompareRedirect("/compare/neymar-vs-mbape:A%3Cb%3ENeymar"),
    ).toBe("neymar-vs-mbappe");
  });

  it("lowercases a mixed-case base and ignores an encoded colon", () => {
    expect(
      compareHtmlSuffixRedirectPath("/compare/Neymar-vs-Mbappe:A%3Cb%3ENeymar"),
    ).toBe("/compare/neymar-vs-mbappe");
    expect(
      compareHtmlSuffixRedirectPath(
        "/compare/messi-vs-ronaldo%3AA%3Cb%3EMessi",
      ),
    ).toBe("/compare/messi-vs-ronaldo");
  });
});
