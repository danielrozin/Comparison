# Monetization Plan — aversusb.net

Goal: turn the site from a free reference into a revenue product. Stripe lands
in days; everything here is built Stripe-ready and converts from day one even
before keys exist.

## The honest read (analytics hat first)

- Traffic is still in post-June-27 recovery. Ad/affiliate revenue scales with
  traffic we do not have yet — so the near-term money is **selling a product
  directly to the visitors we do get**, at high intent.
- The visitors we get arrive mid-decision ("X vs Y") — the highest-intent
  moment on the internet. The product to sell is **certainty and time**:
  a custom comparison on demand, the data behind it, and updates when the
  verdict changes.
- One editorial line we never cross (it is asserted in our FAQ schema):
  **verdicts are never for sale.** Sponsorship of slots, yes someday;
  paying to win a comparison, never. That promise *is* the product.

## Product ladder

| Tier | Price | What they buy |
|---|---|---|
| Free | $0 | Every comparison, forever. The SEO moat — never gated. |
| **Pro (founding)** | **$49/yr** (reg. $90) or $9/mo | 2 custom comparisons/mo built on request within 24h · PDF export · verdict-change + price-drop alerts · ad-free · founding price locked for life |
| **Business** | $99/mo (founding $49) | API access · white-label embeds without attribution · bulk CSV of comparison data · priority support |

Why these: Pro monetizes the /requests behavior that already exists (people
ask for comparisons we haven't built). Business monetizes /developers + /embed,
which already exist as free surfaces.

## Conversion architecture

```
every page ──► header "Pricing" ──► /pricing ──► checkout
comparison page ──► "Get the full report (PDF)" ──► /pricing?src=compare
/requests ──► "Skip the queue — Pro builds it in 24h" ──► /pricing?src=requests
/developers ──► "Production API keys" ──► /pricing?src=api
```

Checkout is one endpoint, `POST /api/checkout`:
- **With `STRIPE_SECRET_KEY` + price env vars set** → creates a Stripe
  Checkout Session and redirects. Card details are entered on Stripe's page
  only — we never touch or store card numbers.
- **Until then** → founding-member reservation: email + plan captured to
  Redis, notification email fired, PostHog event recorded. Copy says plainly:
  nothing is charged today; checkout opens this week; the founding price is
  locked to the reservation.

Flipping from reservation-mode to live checkout is: set the Stripe env vars.
No deploy, no code change.

## Analytics (PostHog, already wired)

Events: `pricing_viewed` (with `src`), `checkout_started` (plan, interval),
`reservation_created` (plan), later `checkout_completed` via Stripe webhook.
Funnel to watch: pricing_viewed → checkout_started → completed, split by `src`.

## Task board

**Content engine — running (freeze lifted 2026-08-26 per founder directive)**
- [x] Wave 1 (08-26): 12 comparisons + 8 blogs — reviewed, published, indexed
- [x] Wave 2 (08-28): 20 comparisons + 6 blogs — buildFirst tier now 33/33 done
- [ ] Wave 3: SERP-verify the next 40 clusters from the 917 backlog, then generate
- [x] AEO question bank folded into FAQ blocks (08-30): 101 PAA answers across
      31 live target pages, 22 questions deliberately skipped (forecasts, named
      opinions, individual medical/legal advice, off-scope rankings).
      Tooling: `scripts/aeo-faq-foldin.mjs` (--generate locally → reviewable
      JSON; --apply via the "AEO FAQ fold-in" GH workflow). Re-run --generate
      after wave 3 lands — the other 35 bank targets aren't built yet.
      Side find: em-dashes in X-Summary headers were 500'ing /api/faq and
      /api/answer on 11 of 29 pages — fixed with `headerSafe()` (19 routes).

**Phase 1 — shipped in this commit**
- [x] `src/lib/monetization/plans.ts` — single source of truth for tiers/pricing
- [x] `/pricing` page (Offer schema, founding-member framing, honest copy)
- [x] `POST /api/checkout` — Stripe when configured, reservation until then
- [x] Header + footer "Pricing" links
- [x] /requests upsell banner
- [x] Pro upsell card on every /compare/* page (src=compare-{slug})
- [x] PostHog server events on reservation/checkout

**Phase 2 — when Stripe keys land (days)**
- [ ] Create Stripe products/prices, set `STRIPE_SECRET_KEY`,
      `STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_PRO_YEARLY`,
      `STRIPE_PRICE_BUSINESS_MONTHLY` in Vercel
- [x] `/api/stripe/webhook` — built and inert until `STRIPE_WEBHOOK_SECRET`
      is set; verifies signatures, dedupes events, records members to Redis,
      notifies Info@ on purchase and cancel, fires `checkout_completed`
- [ ] Point a Stripe webhook endpoint at `/api/stripe/webhook`
      (event: checkout.session.completed, customer.subscription.deleted)
      and set `STRIPE_WEBHOOK_SECRET`
- [ ] Email the reservation list (they locked founding price) with checkout
      links. Draft (send via sendOutreachEmail, from Info@, replyTo founder):

      Subject: Your founding price is live — $49/yr, locked
      Body: You reserved the founding price on A Versus B Pro. Checkout is
      now open — your price stays $49/year for as long as you subscribe
      (public price is $90). [Checkout link]. Your first custom comparison:
      reply to this email with any matchup and it's live within 24 hours.
      — Daniel & Shai

      List: Redis `monetization:reservations`; send day-of-Stripe only.
- [x] Success page `/pricing/thanks` (noindex)

**Phase 3 — deliver the Pro promises**
- [ ] Custom-comparison request form for Pro users → generation queue
      (per-request unfreeze; DAN-2157 freeze stays on for bulk)
- [ ] PDF export of any comparison (server-render → print CSS → PDF)
- [ ] Verdict-change alerts (weekly diff job + Resend email)
- [ ] Gate: simple auth (email magic link) before this phase

**Phase 4 — Business tier delivery**
- [ ] API keys tied to subscription (api-key-service exists)
- [ ] Embed attribution toggle for paying partners
- [ ] Bulk CSV export endpoint

**Parallel — BD motions (no code)**
- [ ] Outreach to the 9 best-of list vendors: "you rank #N — license the badge"
      (badge/licensing is a classic comparison-site revenue line)
- [ ] Affiliate coverage audit: every product comparison with purchase intent
      should carry a monetized CTA (scripts/audit-affiliate-logic.mjs)
