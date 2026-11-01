"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { AffiliateDisclosure } from "@/components/comparison/AffiliateDisclosure";
import { usePaidAffiliateHref } from "@/lib/hooks/usePaidAffiliateHref";
import {
  AVB_AFF_BLOCK_BLOG_FLAG,
  AVB_AFF_BLOCK_BLOG_PLACEMENT,
  type BlogAffPick,
  getBlogAffBlock,
  isAffBlockTestVariant,
  isAvbAffBlockBlogPath,
} from "@/lib/growth/avb-aff-block-blog";
import { trackAffiliateClick } from "@/lib/utils/analytics";

/**
 * ROO-359. Mount only on an experiment path. Control (and a flag that is
 * still off or still loading) renders nothing, so the page stays as it is
 * today. The test arm renders one compact block.
 *
 * Do not consult the user agent. AI crawlers are not filtered here. If
 * PostHog never boots — consent off, or a preview host — there is no arm
 * to assign, and the page stays on control.
 */
export function BlogAffiliateExperiment({ path }: { path: string }) {
  const block = getBlogAffBlock(path);
  const [variant, setVariant] = useState<string | boolean | null>(null);

  useEffect(() => {
    // Path is the only input. Off-list pages never ask PostHog for the flag,
    // so they are not counted in the experiment.
    if (!isAvbAffBlockBlogPath(path)) return;
    let active = true;

    const apply = () => {
      if (!active) return;
      let value: string | boolean | undefined;
      try {
        value = posthog.getFeatureFlag(AVB_AFF_BLOCK_BLOG_FLAG);
      } catch {
        return;
      }
      // Undefined means "still loading" or "flag inactive". Stay on control
      // (no block) until a real control/test value arrives.
      if (value === undefined) return;
      const arm = value === true ? "test" : value === false ? "control" : String(value);
      try {
        posthog.register({ avb_aff_block_blog: arm });
      } catch {
        // Analytics must never break the page.
      }
      setVariant(value);
    };

    let unsubscribe: (() => void) | undefined;
    try {
      // Fires immediately when flags are already cached, otherwise once they
      // load. That single call is what records the exposure for both arms.
      const off = posthog.onFeatureFlags(apply);
      if (typeof off === "function") unsubscribe = off;
    } catch {
      // PostHog is not initialized. Leave the page on control.
    }

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [path]);

  if (!block || !isAffBlockTestVariant(variant)) return null;

  const card = (
    <section
      aria-label={block.heading}
      data-flag={AVB_AFF_BLOCK_BLOG_FLAG}
      data-variant="test"
      className={`rounded-xl border border-amber-200 bg-amber-50/40 p-4 ${
        block.path === "/blog" ? "" : "mb-6"
      }`}
    >
      <h2 className="text-sm font-semibold text-text">{block.heading}</h2>
      <p className="mt-1 text-xs text-text-secondary leading-relaxed">{block.intro}</p>
      <ul
        className={`mt-3 grid gap-2 ${
          block.picks.length > 2 ? "sm:grid-cols-3" : "sm:grid-cols-2"
        }`}
      >
        {block.picks.map((pick) => (
          <li key={pick.product}>
            <BlogAffPickLink pick={pick} path={block.path} />
          </li>
        ))}
      </ul>
      <AffiliateDisclosure />
    </section>
  );

  if (block.path === "/blog") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">{card}</div>
    );
  }

  return card;
}

/**
 * One outbound link. The paid-attribution hook cannot run inside `.map`.
 */
function BlogAffPickLink({ pick, path }: { pick: BlogAffPick; path: string }) {
  const href = usePaidAffiliateHref(pick.url);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      aria-label={`Check price for ${pick.product} on Amazon, opens in a new tab`}
      className="group flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-white px-3 py-2 no-underline transition-colors hover:border-amber-400 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
      onClick={() => {
        trackAffiliateClick(pick.product, AVB_AFF_BLOCK_BLOG_PLACEMENT, path, {
          url: href,
          partner: pick.partner,
          label: pick.label,
          cta_type: "affiliate",
          variant: "test",
          experiment: AVB_AFF_BLOCK_BLOG_FLAG,
          page_path: path,
        });
      }}
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium text-text truncate group-hover:text-amber-800">
          {pick.product}
        </span>
        <span className="block text-xs text-text-secondary truncate">{pick.blurb}</span>
      </span>
      <span className="flex-shrink-0 text-xs font-semibold text-amber-700">
        Check price <span aria-hidden="true">&rarr;</span>
      </span>
    </a>
  );
}
