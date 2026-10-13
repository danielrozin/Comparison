import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { AuthorByline } from "@/components/comparison/AuthorByline";
import {
  AI_DISCLOSURE,
  EDITORIAL_TEAM_NAME,
  blogAuthorName,
  blogOgAuthors,
  blogReviewFields,
  editorialTeamAuthorNode,
  isHumanReviewedBlogSlug,
} from "@/lib/editorial/blog-authorship";
import { HUMAN_REVIEWED_SLUGS } from "@/lib/editorial/human-reviewed";

const root = path.resolve(__dirname, "../../../..");
const read = (p: string) => readFileSync(path.join(root, p), "utf8");

describe("blog authorship allowlist", () => {
  it("allowlist is empty so no post is human reviewed", () => {
    expect(HUMAN_REVIEWED_SLUGS).toEqual([]);
    expect(isHumanReviewedBlogSlug("imax-vs-dolby-cinema")).toBe(false);
  });

  it("non-allowlisted posts get the organization author and no review fields", () => {
    expect(blogAuthorName("any-post")).toBe(EDITORIAL_TEAM_NAME);
    expect(blogOgAuthors("any-post")[0]).not.toContain("daniel-rozin");
    expect(editorialTeamAuthorNode()).toMatchObject({ "@type": "Organization", name: "AversusB Editorial Team" });
    expect(blogReviewFields("any-post", "2026-10-01", [{}])).toEqual({});
  });

  it("allowlisted posts keep review fields", () => {
    HUMAN_REVIEWED_SLUGS.push("reviewed-post");
    try {
      expect(blogAuthorName("reviewed-post")).toBe("Daniel Rozin");
      expect(blogReviewFields("reviewed-post", "2026-10-01", ["x"])).toEqual({ lastReviewed: "2026-10-01", reviewedBy: ["x"] });
    } finally {
      HUMAN_REVIEWED_SLUGS.pop();
    }
  });
});

describe("AuthorByline editorial variant", () => {
  it("shows Analysis, the team and the disclosure, with no badge or Daniel", () => {
    render(<AuthorByline updatedAt="2026-10-01T00:00:00.000Z" isHumanReviewed={false} variant="editorial" wordCount={800} />);
    expect(screen.getByText("Analysis")).toBeTruthy();
    expect(screen.getByText(EDITORIAL_TEAM_NAME)).toBeTruthy();
    expect(screen.getByText(AI_DISCLOSURE)).toBeTruthy();
    expect(screen.queryByText("Human reviewed")).toBeNull();
    expect(screen.queryByText("Daniel Rozin")).toBeNull();
  });
});

describe("blog pages route authorship through the allowlist", () => {
  const files = [
    "src/app/blog/[slug]/page.tsx",
    "src/app/blog/page.tsx",
    "src/app/blog/best-ai-assistant-2026/page.tsx",
    "src/app/blog/best-cloud-platform-2026/page.tsx",
  ];
  it.each(files)("%s has no hardcoded review flag or Daniel author meta", (f) => {
    const src = read(f);
    expect(src).not.toMatch(/isHumanReviewed=\{true\}/);
    expect(src).not.toMatch(/"citation_author": "Daniel Rozin"/);
    expect(src).not.toMatch(/"DC.creator": "Daniel Rozin"/);
    expect(src).not.toMatch(/^\s*reviewedBy:/m);
    expect(src).not.toMatch(/authors: \[`\$\{SITE_URL\}\/authors\/daniel-rozin`\]/);
  });
});

describe("inline body byline", () => {
  it("drops the generated 'By Daniel Rozin' line for non-allowlisted posts", async () => {
    const { stripUnreviewedBodyByline } = await import("@/lib/editorial/blog-authorship");
    const body = "Intro line\n\n*By Daniel Rozin | A Versus B | June 27, 2027*\n\n## Heading\nDaniel Rozin founded the site.";
    const out = stripUnreviewedBodyByline(body, "imax-vs-dolby-cinema-2026-is-the-premium-ticket-worth-it");
    expect(out).not.toMatch(/By Daniel Rozin/);
    expect(out).toContain("## Heading");
    expect(out).toContain("Daniel Rozin founded the site.");
    HUMAN_REVIEWED_SLUGS.push("reviewed-post");
    try {
      expect(stripUnreviewedBodyByline(body, "reviewed-post")).toBe(body);
    } finally {
      HUMAN_REVIEWED_SLUGS.pop();
    }
  });
});
