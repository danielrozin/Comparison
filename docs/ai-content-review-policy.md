# AI content review policy (ROO-160)

> Adopted 2026-10-18 (approved by Daniel Rozin). Applies to every compare,
> answer, best and blog page, plus its title element, meta description,
> structured data and image alt text.

Background: on 2026-10-01 Google updated its guidance on generative AI
content to say AI output should be fact-checked before publishing, and that
this covers titles, meta descriptions, structured data and alt text.

## The policy

1. **AI-drafted pages may publish after the automated gates pass.**
   Lint, Type Check, Secret Scan, CI Build, the Vercel preview, the page's
   own tests, and the source check by the reviewer agent (every number
   traced to a primary source linked on the page; titles, meta, JSON-LD and
   alt text checked against the same sources). Publishing does not wait for
   a human.
2. **They are disclosed as AI-drafted, always.** The section is labeled
   "Analysis" and carries "Drafted with AI from web research." The author is
   the A Versus B organization. No personal byline, no "Reviewed by",
   no `reviewedBy` / `lastReviewed` / `isHumanReviewed` in JSON-LD.
3. **"Human reviewed" means Daniel actually reviewed it.** A slug goes on
   `HUMAN_REVIEWED_SLUGS` (`src/lib/editorial/human-reviewed.ts`) only after
   Daniel has personally checked the facts, title, meta description,
   structured data and alt text, and has recorded that in
   `HUMAN_REVIEW_SIGNOFFS` in the same file. A test fails the build if a
   slug is listed without a complete sign-off. The database
   `isHumanReviewed` flag is not a review and is never shown to readers.
   The list is empty today.
4. **No automated jobs rewrite live pages.** The daily AI rewrite jobs stay
   off (#351). Corrections to a live page go through a PR like any other
   change.
5. **Batch hold only during Google rollouts.** The hold on large batches of
   new AI pages ended when the September 2026 spam update finished
   (2026-10-08). While a future core or spam update is rolling out (Search
   Status Dashboard), ship single pages and hold large batches until it is
   marked complete.
6. **Errors are fixed fast.** A reported factual error is fixed or the claim
   removed within 2 working days, and the page's "Updated" date changes only
   when its content changes.

## Checklist for every AI-drafted page (reviewer agent)

- [ ] Every figure has a primary source on the page and matches it.
- [ ] Title element and meta description make no claim the body doesn't support.
- [ ] JSON-LD matches the visible page; no Daniel author/reviewer.
- [ ] Image alt text describes the image and makes no claim.
- [ ] "Analysis" label and "Drafted with AI from web research." present.
- [ ] Not on `HUMAN_REVIEWED_SLUGS` unless Daniel's sign-off is recorded.
