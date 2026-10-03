/**
 * Lives outside src/pages so next build does not treat this file as a route.
 * The missing-compare 404 puts a real title, a search box, and live
 * popular comparisons in the first HTML. None of that waits for hydration.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getTrendingComparisons = vi.fn();
const filterLiveCompareSlugs = vi.fn();

vi.mock("next/head", () => ({
  default: ({ children }: { children: unknown }) => children,
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children?: ReactNode;
    onClick?: () => void;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("next/router", () => ({
  useRouter: () => ({
    replace: vi.fn(),
    events: { on: vi.fn(), off: vi.fn() },
  }),
}));

vi.mock("@/lib/services/comparison-service", () => ({
  getTrendingComparisons: (...args: unknown[]) => getTrendingComparisons(...args),
}));

vi.mock("@/lib/seo/resolve-internal-links", () => ({
  filterLiveCompareSlugs: (...args: unknown[]) => filterLiveCompareSlugs(...args),
}));

import PagesNotFound, { MISSING_COMPARE_TITLE, getStaticProps } from "@/pages/404";

const popular = [
  { slug: "usa-vs-china", label: "USA vs China" },
  { slug: "iphone-17-vs-samsung-s26", label: "iPhone 17 vs Samsung Galaxy S26" },
  { slug: "messi-vs-ronaldo", label: "Messi vs Ronaldo" },
  { slug: "japan-vs-china", label: "Japan vs China" },
  { slug: "ps5-vs-xbox-series-x", label: "PS5 vs Xbox Series X" },
];

describe("missing-compare 404 server HTML", () => {
  it("includes the title, the search box, and five live compares before client load", () => {
    const html = renderToStaticMarkup(<PagesNotFound generationEnabled={false} popular={popular} />);

    expect(html).toContain(`<title>${MISSING_COMPARE_TITLE}</title>`);
    expect(MISSING_COMPARE_TITLE).toBe("Comparison not found | A Versus B");
    expect(html).toContain('name="robots" content="noindex, nofollow"');
    expect(html).toContain('action="/search"');
    expect(html).toContain('name="surface" value="not_found_form"');
    expect(html).toContain('name="q"');
    expect(html).not.toMatch(/24 hours/i);

    for (const item of popular) {
      expect(html).toContain(`href="/compare/${item.slug}"`);
      expect(html).toContain(item.label);
    }
  });
});

describe("generic app 404", () => {
  it("records not_found_viewed and is noindex", () => {
    const source = readFileSync(path.resolve(process.cwd(), "src/app/not-found.tsx"), "utf8");
    expect(source).toContain("NotFoundViewTracker");
    expect(source).toContain("index: false");
    expect(source).not.toContain('content="noindex, nofollow"');
  });
});

describe("missing-compare 404 popular links", () => {
  beforeEach(() => {
    getTrendingComparisons.mockReset();
    filterLiveCompareSlugs.mockReset();
  });

  it("uses the same live filter as /custom-compare and keeps five", async () => {
    const ranked = [
      ...popular.map((item) => ({ slug: item.slug, title: item.label, category: "sports" })),
      { slug: "dead-vs-page", title: "Dead vs Page", category: "sports" },
      { slug: "extra-vs-live", title: "Extra vs Live", category: "sports" },
    ];
    getTrendingComparisons.mockResolvedValue(ranked);
    filterLiveCompareSlugs.mockImplementation(async (slugs: string[]) =>
      slugs.filter((slug) => slug !== "dead-vs-page"),
    );

    const result = await getStaticProps();
    expect(result.props.generationEnabled).toBe(false);
    expect(result.props.popular).toHaveLength(5);
    expect(result.props.popular.map((item) => item.slug)).toEqual(popular.map((item) => item.slug));
    expect(result.props.popular.some((item) => item.slug === "dead-vs-page")).toBe(false);
    expect(getTrendingComparisons).toHaveBeenCalledWith(12);
  });
});
