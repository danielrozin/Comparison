"use client";

import { COMPARE_FOOTER_REDDIT_THREAD_URL } from "@/lib/community/reddit-thread";
import { trackCommunityLinkClicked } from "@/lib/utils/analytics";

/** ROO-165: small, disclosed community link at the foot of /compare pages. */
export function CompareRedditFooterLink({ compareSlug }: { compareSlug: string }) {
  return (
    <p className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 text-xs text-text-secondary" data-testid="compare-reddit-footer">
      <a
        href={COMPARE_FOOTER_REDDIT_THREAD_URL}
        target="_blank"
        rel="noopener"
        className="underline underline-offset-2 hover:text-primary-700"
        onClick={() => trackCommunityLinkClicked({ placement: "compare_footer", compare_slug: compareSlug })}
      >
        Debate this on r/ThisOrThatDebate
      </a>{" "}
      (run by the AversusB team)
    </p>
  );
}
