<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the A Versus B comparison site (Next.js 15, Pages Router). PostHog is initialized client-side via `instrumentation-client.ts` (Next.js 15.3+ pattern) with a reverse proxy through `/ingest` to avoid ad-blocker interference. A server-side client (`src/lib/posthog-server.ts`) handles event capture from App Router API routes. All capture calls were added to the existing `analytics.ts` hub and two component files, leaving all other GA4/Meta Pixel/Clarity code untouched.

| Event name | Description | File |
|---|---|---|
| `comparison_viewed` | User viewed a comparison page | `src/lib/utils/analytics.ts` |
| `comparison_poll_voted` | User voted in the head-to-head poll | `src/lib/utils/analytics.ts` + `src/app/api/comparisons/poll/route.ts` |
| `verdict_feedback_voted` | User voted thumbs-up/down on the AI verdict | `src/lib/utils/analytics.ts` |
| `comparison_tracker_submitted` | User submitted email to track a comparison | `src/lib/utils/analytics.ts` |
| `newsletter_subscribed` | User subscribed to the newsletter | `src/lib/utils/analytics.ts` + `src/app/api/newsletter/route.ts` |
| `affiliate_link_clicked` | User clicked an affiliate CTA link | `src/lib/utils/analytics.ts` |
| `share_clicked` | User clicked a social share button | `src/lib/utils/analytics.ts` |
| `comment_submitted` | User submitted a comment | `src/lib/utils/analytics.ts` |
| `comparison_search_performed` | User performed a search query | `src/lib/utils/analytics.ts` |
| `scroll_depth_milestone` | User scrolled to a depth milestone (25/50/75/90%) | `src/components/engagement/ConversionFunnelTracker.tsx` |

## Next steps

We've built a dashboard and five insights to monitor user behavior and conversion:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/505329/dashboard/1825042)
- Comparison views over time: https://us.posthog.com/project/505329/insights/zqrbZOVn
- Engagement funnel (view → scroll → subscribe): https://us.posthog.com/project/505329/insights/77ymsv1x
- Verdict feedback votes by direction: https://us.posthog.com/project/505329/insights/e878grHb
- Newsletter + tracker conversions: https://us.posthog.com/project/505329/insights/wjf9j1Fk
- Affiliate clicks vs comparison views: https://us.posthog.com/project/505329/insights/d8fDgVD2

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
