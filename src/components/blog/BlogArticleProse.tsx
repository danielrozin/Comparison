import { BlogBodyCompareClickTracker } from "@/components/blog/BlogBodyCompareClickTracker";
import {
  BlogInlineComparisonCard,
  type InlineComparisonLink,
} from "@/components/blog/BlogInlineComparisonCard";
import { BlogInlineCompareCtas } from "@/components/blog/BlogInlineCompareCtas";
import type { BlogArticlePart } from "@/lib/blog/inline-comparison-card";

export type ArticleRenderPart =
  | BlogArticlePart
  | { kind: "nba-cta"; slug: string; label: string };

/**
 * The article body: HTML from the markdown renderer, with comparison
 * cards and any older per-article CTAs dropped in at the planned spots.
 *
 * The first chunks keep the `prose-custom` class so the speakable
 * selectors still point at the opening paragraph and the first heading.
 * Later chunks skip that class so a mid-article paragraph is not treated
 * as the opening one.
 */
export function BlogArticleProse({
  parts,
  articleSlug,
  links,
  intro,
  nbaSourcePage,
  liveSlugs,
}: {
  parts: readonly ArticleRenderPart[];
  articleSlug: string;
  links: readonly InlineComparisonLink[];
  intro?: {
    sourcePage: string;
    heading?: string;
    links: readonly { slug: string; label: string }[];
  } | null;
  nbaSourcePage?: string;
  liveSlugs?: ReadonlySet<string>;
}) {
  let seenParagraph = false;
  let seenHeading = false;

  return (
    <div data-blog-prose="">
      <BlogBodyCompareClickTracker articleSlug={articleSlug} />
      {parts.map((part, index) => {
        if (part.kind === "card") {
          if (links.length === 0) return null;
          return (
            <BlogInlineComparisonCard
              key={`card-${part.position}`}
              articleSlug={articleSlug}
              position={part.position}
              links={links}
            />
          );
        }

        if (part.kind === "intro-cta") {
          if (!intro || intro.links.length === 0) return null;
          return (
            <BlogInlineCompareCtas
              key="intro-cta"
              sourcePage={intro.sourcePage}
              links={intro.links}
              heading={intro.heading}
            />
          );
        }

        if (part.kind === "nba-cta") {
          if (!nbaSourcePage || !liveSlugs?.has(part.slug)) return null;
          return (
            <BlogInlineCompareCtas
              key={`nba-${part.slug}-${index}`}
              sourcePage={nbaSourcePage}
              heading={part.label}
              links={[{ slug: part.slug, label: "See the comparison" }]}
            />
          );
        }

        if (!part.html.trim()) return null;

        // Class the chunks that hold the opening paragraph and the first
        // heading. Once both have been covered, later chunks stay unmarked.
        const markSpeakable = !seenParagraph || !seenHeading;
        if (/<p\b/i.test(part.html)) seenParagraph = true;
        if (/<h[23]\b/i.test(part.html)) seenHeading = true;

        return (
          <div
            key={`html-${index}`}
            className={markSpeakable ? "prose-custom" : undefined}
            dangerouslySetInnerHTML={{ __html: part.html }}
          />
        );
      })}
    </div>
  );
}
