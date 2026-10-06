/**
 * ROO-165 — the in-article comparison card is a real link, and the click
 * carries placement, position, the article slug, and the comparison slug.
 */
import { fireEvent, render, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const trackRelatedComparisonClick = vi.fn();

vi.mock("@/lib/utils/analytics", () => ({
  trackRelatedComparisonClick: (...args: unknown[]) => trackRelatedComparisonClick(...args),
}));

import { BlogInlineComparisonCard } from "../BlogInlineComparisonCard";
import { BlogBodyCompareClickTracker } from "../BlogBodyCompareClickTracker";

const ARTICLE = "how-to-get-a-cashiers-check";
const LINKS = [
  { slug: "bank-of-america-vs-chase", title: "Bank of America vs Chase" },
  { slug: "capital-one-vs-chase", title: "Capital One vs Chase" },
  { slug: "revolut-vs-wise", title: "Revolut vs Wise" },
];

describe("BlogInlineComparisonCard", () => {
  beforeEach(() => {
    trackRelatedComparisonClick.mockClear();
  });

  it("renders real compare links and records placement, position, and slugs", () => {
    const { container } = render(
      <BlogInlineComparisonCard articleSlug={ARTICLE} position="top" links={LINKS} />,
    );
    const view = within(container);

    expect(view.getByRole("heading", { name: "Compare the options in this article" })).toBeTruthy();
    expect(view.getByTestId("blog-inline-comparison-card")).toHaveAttribute("data-position", "top");

    for (const link of LINKS) {
      const anchor = view.getByRole("link", { name: link.title });
      expect(anchor).toHaveAttribute(
        "href",
        `/compare/${link.slug}?source_page=${encodeURIComponent(`/blog/${ARTICLE}`)}`,
      );
      fireEvent.click(anchor);
      expect(trackRelatedComparisonClick).toHaveBeenCalledWith(`/blog/${ARTICLE}`, link.slug, {
        placement: "blog_inline_card",
        position: "top",
        article_slug: ARTICLE,
      });
    }
  });

  it("uses the mid position on the second card", () => {
    const { container } = render(
      <BlogInlineComparisonCard articleSlug={ARTICLE} position="mid" links={LINKS.slice(0, 2)} />,
    );
    fireEvent.click(within(container).getByRole("link", { name: LINKS[0].title }));
    expect(trackRelatedComparisonClick).toHaveBeenCalledWith(`/blog/${ARTICLE}`, LINKS[0].slug, {
      placement: "blog_inline_card",
      position: "mid",
      article_slug: ARTICLE,
    });
  });

  it("renders nothing when there is no comparison to show", () => {
    const { container } = render(
      <BlogInlineComparisonCard articleSlug={ARTICLE} position="top" links={[]} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe("BlogBodyCompareClickTracker", () => {
  beforeEach(() => {
    trackRelatedComparisonClick.mockClear();
  });

  it("records in-body compare clicks and skips links that already track themselves", () => {
    const { container } = render(
      <div data-blog-prose="">
        <BlogBodyCompareClickTracker articleSlug={ARTICLE} />
        <a href="/compare/bank-of-america-vs-chase">Chase in the paragraph</a>
        <div data-inline-comparison-card="">
          <a href="/compare/capital-one-vs-chase">Card link</a>
        </div>
        <div data-testid="blog-inline-compare-ctas">
          <a href="/compare/revolut-vs-wise">Intro CTA</a>
        </div>
        <a href="/blog/other">Not a comparison</a>
      </div>,
    );
    const view = within(container);

    fireEvent.click(view.getByRole("link", { name: "Chase in the paragraph" }));
    expect(trackRelatedComparisonClick).toHaveBeenCalledTimes(1);
    expect(trackRelatedComparisonClick).toHaveBeenCalledWith(
      `/blog/${ARTICLE}`,
      "bank-of-america-vs-chase",
      { placement: "blog_body_link", article_slug: ARTICLE },
    );

    fireEvent.click(view.getByRole("link", { name: "Card link" }));
    fireEvent.click(view.getByRole("link", { name: "Intro CTA" }));
    fireEvent.click(view.getByRole("link", { name: "Not a comparison" }));
    expect(trackRelatedComparisonClick).toHaveBeenCalledTimes(1);
  });
});
