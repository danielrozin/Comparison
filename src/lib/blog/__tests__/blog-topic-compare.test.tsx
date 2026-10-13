import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  generatedCompareTitle,
  topicBuildSlug,
  topicCompareCandidates,
} from "@/lib/blog/blog-topic-compare";
import { selectInlineComparisonSlugs } from "@/lib/blog/inline-comparison-card";

const track = vi.hoisted(() => vi.fn());
vi.mock("@/lib/utils/analytics", () => ({ trackRelatedComparisonClick: track }));
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children?: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import { BlogInlineComparisonCard } from "@/components/blog/BlogInlineComparisonCard";
import { BlogBodyCompareClickTracker } from "@/components/blog/BlogBodyCompareClickTracker";

describe("topic matching from slug and title", () => {
  it("finds delta-vs-united in both orders for the lounge post", () => {
    const c = topicCompareCandidates(
      "delta-vs-united-airlines-lounge-access-2026-sky-club-vs-united-club",
      "Delta vs United Airlines Lounge Access 2026: Sky Club vs United Club",
    );
    expect(c).toContain("delta-vs-united");
    expect(c).toContain("united-vs-delta");
    expect(c).toContain("delta-vs-united-airlines");
    expect(c.some((s) => /lounge|2026|access/.test(s))).toBe(false);
  });

  it("strips -2026 / -review and keeps both orderings", () => {
    expect(topicCompareCandidates("airpods-pro-vs-sony-wf-1000xm5-review-2026")).toEqual(
      expect.arrayContaining(["airpods-pro-vs-sony", "sony-vs-airpods-pro"]),
    );
  });

  it("uses the title when the slug has no vs", () => {
    expect(topicCompareCandidates("premium-screens-explained", "IMAX vs Dolby Cinema: worth it?")).toContain(
      "imax-vs-dolby-cinema",
    );
  });

  it("builds a canonical slug for a clear X vs Y with no live page", () => {
    expect(topicBuildSlug("imax-vs-dolby-cinema-2026-is-the-premium-ticket-worth-it")).toBe("dolby-cinema-vs-imax");
    expect(generatedCompareTitle("dolby-cinema-vs-imax")).toMatch(/Dolby Cinema vs I(MAX|max)/);
  });

  it("returns nothing for posts that are not X vs Y", () => {
    expect(topicCompareCandidates("how-to-get-a-cashiers-check")).toEqual([]);
    expect(topicBuildSlug("how-to-get-a-cashiers-check")).toBeNull();
  });

  it("topic matches go first, and a mapped-only post ignores them", () => {
    expect(
      selectInlineComparisonSlugs({ bodyHtml: "", relatedSlugs: ["a-vs-b"], topicSlugs: ["delta-vs-united"] }),
    ).toEqual(["delta-vs-united", "a-vs-b"]);
    expect(
      selectInlineComparisonSlugs({
        bodyHtml: "",
        relatedSlugs: [],
        preferredSlugs: [],
        preferMappedOnly: true,
        topicSlugs: ["delta-vs-united"],
      }),
    ).toEqual([]);
  });
});

describe("inline card rendering and tracking", () => {
  beforeEach(() => track.mockClear());

  it("never renders an empty card", () => {
    const { container } = render(<BlogInlineComparisonCard articleSlug="x" position="top" links={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("marks builder links nofollow and fires one event with generated=true", () => {
    render(
      <div data-blog-prose="">
        <BlogBodyCompareClickTracker articleSlug="imax-post" />
        <BlogInlineComparisonCard
          articleSlug="imax-post"
          position="mid"
          links={[{ slug: "dolby-cinema-vs-imax", title: "Dolby Cinema vs IMAX", generated: true }]}
        />
      </div>,
    );
    const link = screen.getByRole("link", { name: /Dolby Cinema vs IMAX/ });
    expect(link).toHaveAttribute("rel", "nofollow");
    fireEvent.click(link);
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith("/blog/imax-post", "dolby-cinema-vs-imax", {
      placement: "blog_inline_card",
      position: "mid",
      article_slug: "imax-post",
      comparison_slug: "dolby-cinema-vs-imax",
      generated: true,
    });
  });

  it("live links are followed and body links carry blog_body_link", () => {
    render(
      <div data-blog-prose="">
        <BlogBodyCompareClickTracker articleSlug="lounge" />
        <BlogInlineComparisonCard articleSlug="lounge" position="top" links={[{ slug: "delta-vs-united", title: "Delta vs United" }]} />
        <p dangerouslySetInnerHTML={{ __html: '<a href="/compare/delta-vs-united">body link</a>' }} />
      </div>,
    );
    const card = screen.getByRole("link", { name: /Delta vs United/ });
    expect(card).not.toHaveAttribute("rel");
    fireEvent.click(card);
    expect(track).toHaveBeenLastCalledWith("/blog/lounge", "delta-vs-united", expect.objectContaining({
      placement: "blog_inline_card",
      position: "top",
      generated: false,
    }));
    fireEvent.click(screen.getByText("body link"));
    expect(track).toHaveBeenCalledTimes(2);
    expect(track).toHaveBeenLastCalledWith("/blog/lounge", "delta-vs-united", {
      placement: "blog_body_link",
      article_slug: "lounge",
      comparison_slug: "delta-vs-united",
      generated: false,
    });
  });
});
