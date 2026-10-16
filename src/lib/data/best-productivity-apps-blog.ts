/**
 * ROO-235: repo override for /blog/best-productivity-apps-2026.
 * Prices read on 16 October 2026 from each vendor's own pricing page or
 * US App Store listing. Todoist's pricing page renders prices client-side,
 * so its price points are not stated. No ratings, benchmarks, or usage stats.
 */

import type { BlogArticle } from "@/lib/services/blog-generator";

export const BEST_PRODUCTIVITY_APPS_BLOG_SLUG = "best-productivity-apps-2026";

const PUBLISHED_AT = "2026-07-11T16:10:53.486Z";
const UPDATED_AT = "2026-10-16T00:00:00Z";

const CONTENT = `*Analysis. Drafted with AI from web research. Updated October 16, 2026.*

**Updated Oct 2026.** For most people, Todoist (cross-platform) or Things 3 (Apple-only) covers tasks, Notion or Obsidian covers notes, and Reclaim.ai or Sunsama covers scheduling. Raycast speeds up a Mac, and Superhuman Mail is worth it only if email is your bottleneck. Pick one tool per job and stop there.

| App | Job | Free option | Paid list price (USD) | Platforms |
| --- | --- | --- | --- | --- |
| Todoist | Tasks | Yes | See vendor page | Web, Mac, Windows, iOS, Android |
| Things 3 | Tasks | No | One-time: $9.99 iPhone, $19.99 iPad, $49.99 Mac | Apple only |
| Notion | Notes and databases | Free plan | Plus $10, Business $20 per member/month (yearly) | Web, desktop, mobile |
| Obsidian | Notes | Free | Sync $4/user/month yearly ($5 monthly); Publish $8/site/month yearly ($10 monthly) | Desktop, mobile |
| Reclaim.ai | Automatic time-blocking | Lite, free | Starter $10, Business $15 per seat/month (yearly) | Web, Google and Outlook calendars |
| Sunsama | Daily planning | Free trial | Pro $17/month yearly, $22 monthly | Web, desktop, mobile |
| Raycast | Mac launcher | Free | Pro $10/month or $96/year | Mac |
| Superhuman Mail | Email | No (Mail is in Business) | Business $33/member/month yearly, $40 monthly | Web, desktop, mobile |

*Table: Productivity apps by job, free option, list price, and platforms, October 2026.*

## Which task manager should you use?

**Todoist** runs on web, Mac, Windows, iOS, and Android and takes natural-language input such as "submit report every Friday at 3pm". It has a free plan; paid plan prices appear on Todoist's pricing page. It is the safe default for mixed-device users and teams.

**Things 3** is Apple-only with no subscription. You buy each version once: $9.99 for iPhone, $19.99 for iPad, and $49.99 for Mac on the US App Store. Choose it if you live entirely on Apple devices and prefer a one-time purchase.

## Notion or Obsidian for notes?

**Notion** combines notes, databases, wikis, and project boards in one cloud workspace. The Free plan covers personal use; Plus is $10 and Business is $20 per member per month on yearly billing. It suits teams and anyone who wants structured, linked databases.

**Obsidian** stores notes as local Markdown files on your own disk and is free. Optional Sync costs $4 per user per month billed yearly ($5 monthly), and Publish costs $8 per site per month billed yearly ($10 monthly). It suits writers, researchers, and anyone who wants notes they fully own.

## Reclaim.ai or Sunsama for scheduling?

Both turn a task list into calendar time. **Reclaim.ai** does it automatically: it defends focus time and reschedules tasks and habits when meetings move. Lite is free; Starter is $10 and Business is $15 per seat per month on yearly billing.

**Sunsama** is a guided, manual daily plan: each morning you pull tasks onto a realistic schedule. Pro is $17 a month billed yearly or $22 billed monthly, after a free trial.

## Is Raycast worth it on a Mac?

**Raycast** replaces Spotlight with a keyboard-driven command bar for launching apps, clipboard history, window layouts, and extensions. The core app is free. Pro, which adds AI features, is $10 a month or $96 a year.

## What happened to Superhuman's pricing?

Superhuman is now a suite (Mail, Grammarly, Docs, and Go). Superhuman Mail is included in the Business plan at $33 per member per month billed yearly, or $40 billed monthly. The Free and Pro ($12 yearly, $15 monthly) plans cover Grammarly, Docs, and Go, not Mail.

## Quick picks

| Need | Pick |
| --- | --- |
| Cross-platform tasks | Todoist |
| Apple-only tasks, one-time price | Things 3 |
| Team workspace and databases | Notion |
| Private, local notes | Obsidian |
| Automatic focus time | Reclaim.ai |
| Daily planning ritual | Sunsama |
| Mac keyboard workflow | Raycast |
| Very high email volume | Superhuman Mail |

## How to avoid tool-hopping

- Give a new tool at least 30 days before judging it.
- Keep one task app, one notes app, and one planning method.
- If a habit is the problem, a new app will not fix it.
- Adopt a tool only when a specific, recurring problem (missed tasks, lost notes, overbooked days) points to the gap it fills.

## FAQ

### What is the best productivity app in 2026?

There is no single best app. Todoist is the safest cross-platform task manager, Things 3 is the pick for Apple-only users who want a one-time purchase, and Notion or Obsidian covers notes. Choose by the job you need done.

### Is Things 3 a subscription?

No. Things 3 is a one-time purchase per platform: $9.99 for iPhone, $19.99 for iPad, and $49.99 for Mac on the US App Store.

### Is Obsidian free?

Yes. Obsidian is free. Sync ($4 per user per month billed yearly) and Publish ($8 per site per month billed yearly) are optional paid add-ons.

### How much does Notion cost?

Notion has a Free plan. Plus is $10 and Business is $20 per member per month with yearly billing.

### Reclaim.ai or Sunsama: which is better?

Reclaim.ai is better if you want scheduling done for you; its Lite plan is free. Sunsama is better if you want a deliberate daily planning routine; Pro is $17 a month billed yearly.

### How much does Superhuman cost?

Superhuman Mail comes with the Business plan at $33 per member per month billed yearly, or $40 billed monthly.

## Related comparisons

- [Notion vs Obsidian](/compare/notion-vs-obsidian)

## Sources

- [Todoist pricing](https://www.todoist.com/pricing)
- [Things 3 for iPhone](https://apps.apple.com/us/app/things-3/id904237743), [iPad](https://apps.apple.com/us/app/things-3-for-ipad/id904244226), and [Mac](https://apps.apple.com/us/app/things-3/id904280696) on the App Store
- [Notion pricing](https://www.notion.com/pricing)
- [Obsidian pricing](https://obsidian.md/pricing)
- [Reclaim.ai pricing](https://reclaim.ai/pricing)
- [Sunsama pricing](https://www.sunsama.com/pricing)
- [Raycast pricing](https://www.raycast.com/pricing)
- [Superhuman plans](https://superhuman.com/plans)
`;

export const BEST_PRODUCTIVITY_APPS_FAQS = [
  {
    question: "What is the best productivity app in 2026?",
    answer:
      "There is no single best app. Todoist is the safest cross-platform task manager, Things 3 is the pick for Apple-only users who want a one-time purchase, and Notion or Obsidian covers notes. Choose by the job you need done.",
  },
  {
    question: "Is Things 3 a subscription?",
    answer:
      "No. Things 3 is a one-time purchase per platform: $9.99 for iPhone, $19.99 for iPad, and $49.99 for Mac on the US App Store.",
  },
  {
    question: "Is Obsidian free?",
    answer:
      "Yes. Obsidian is free. Sync ($4 per user per month billed yearly) and Publish ($8 per site per month billed yearly) are optional paid add-ons.",
  },
  {
    question: "How much does Notion cost?",
    answer: "Notion has a Free plan. Plus is $10 and Business is $20 per member per month with yearly billing.",
  },
  {
    question: "Reclaim.ai or Sunsama: which is better?",
    answer:
      "Reclaim.ai is better if you want scheduling done for you; its Lite plan is free. Sunsama is better if you want a deliberate daily planning routine; Pro is $17 a month billed yearly.",
  },
  {
    question: "How much does Superhuman cost?",
    answer:
      "Superhuman Mail comes with the Business plan at $33 per member per month billed yearly, or $40 billed monthly.",
  },
];

export const BEST_PRODUCTIVITY_APPS_ARTICLE: BlogArticle = {
  id: "blog-best-productivity-apps-2026",
  slug: BEST_PRODUCTIVITY_APPS_BLOG_SLUG,
  title: "Best Productivity Apps of 2026: What Actually Works",
  excerpt:
    "Todoist, Things 3, Notion, Obsidian, Reclaim.ai, Sunsama, Raycast, and Superhuman compared by job, free option, and official list price.",
  content: CONTENT,
  category: "technology",
  tags: ["productivity", "task management", "note taking", "time blocking", "apps"],
  metaTitle: "Best Productivity Apps of 2026: What Actually Works",
  metaDescription:
    "The best productivity apps of 2026 — Todoist, Things 3, Notion, Obsidian, Reclaim, Sunsama, Raycast & Superhuman — judged by evidence, not hype.",
  relatedComparisonSlugs: ["notion-vs-obsidian"],
  status: "published",
  publishedAt: PUBLISHED_AT,
  createdAt: PUBLISHED_AT,
  updatedAt: UPDATED_AT,
  viewCount: 0,
};
