# Weekly Metrics Report — Week 14, 2026

**Period:** March 31 – April 6, 2026
**Generated:** 2026-04-02 (mid-week preliminary)
**Author:** Product Analyst
**Audience:** VP Product, CTO, CEO

---

## Executive Summary

Week 14 is the first week with active GA4 and Clarity instrumentation across both products. Data collection began March 30. This mid-week report covers the first 3 days of live tracking. Full-week numbers will be finalized in the W15 report.

**Key takeaway:** Instrumentation is confirmed active. Early signals show comparison search and view events are firing. A/B tests (verdict-first layout, CTA button style) are accumulating variant assignments. Baseline targets remain preliminary until we reach minimum sample sizes (~1,000 sessions/variant).

---

## Comparison (aversusb.net)

### North Star Metric
- **Metric:** Weekly active comparisons viewed
- **Status:** Collecting — first 3 days of data in GA4
- **Baseline target:** To be set Week 15 (after 2 full weeks)

### Instrumentation Health Check
| Check | Status | Notes |
|-------|--------|-------|
| GA4 property (G-0BWYZ5V9QK) | Active | Events streaming |
| Clarity project (w2svnzrk4f) | Active | Session recordings capturing |
| 18 custom events | Deployed | All event functions in `analytics.ts` |
| Conversion funnel (8-step) | Wired | `conversion_funnel` events firing on scroll/engage |
| A/B experiment tracking | Active | `experiment_view` events with variant assignment |

### Content Health (DB Snapshot)
| Metric | Source |
|--------|--------|
| Comparisons | PostgreSQL `comparison` table — live count |
| Entities | PostgreSQL `entity` table — live count |
| Blog Articles | PostgreSQL `blogArticle` table — live count |
| Newsletter Subscribers | PostgreSQL `newsletterSubscriber` — live count |
| Embed Partners | PostgreSQL `embedPartner` — live count |
| Keywords Tracked | PostgreSQL `keywordOpportunity` — live count |

*Exact counts available via `/api/analytics?section=live`*

### Conversion Funnel — Expected vs Preliminary
| Step | Event | Expected Rate | W14 Status |
|------|-------|---------------|------------|
| 1. Landing | page_view | 100% | Collecting |
| 2. Search/Browse | comparison_search | ~40% | Collecting |
| 3. View Comparison | comparison_view | ~30% | Collecting |
| 4. Scroll 25% | scroll_depth_25 | ~22% | Collecting |
| 5. Scroll 50% | scroll_depth_50 | ~15% | Collecting |
| 6. Deep Engagement | 30s+ on page | ~10% | Collecting |
| 7. Engage | vote/share/comment | ~5% | Collecting |
| 8. Convert | affiliate_click/embed | ~1-2% | Collecting |

**Note:** Actual funnel rates require GA4 Explorations funnel report with ≥500 sessions per step. Current sample is insufficient for reliable percentages. First reliable funnel will be in W15 or W16 report.

### A/B Test Status
| Test | Traffic | Goal | Days Running | Est. Sessions | Min Needed | Status |
|------|---------|------|-------------|---------------|------------|--------|
| Verdict-First Layout | 50% | Bounce Rate | 3 | ~TBD | 1,000/variant | Accumulating |
| CTA Button Style | 100% | Affiliate Click | 3 | ~TBD | 1,000/variant | Accumulating |
| Social Proof Elements | — | Engagement | — | — | — | Scheduled May 15 |

**Do not evaluate A/B tests yet.** Minimum 2 full weeks (April 14) before any directional conclusions.

### Early Signals to Watch (GA4)
1. **Bounce rate by page type** — Are comparison pages retaining better than blog pages?
2. **Search-to-view ratio** — Is `comparison_view / comparison_search` above 60%?
3. **Mobile vs desktop engagement** — Scroll depth differences by device
4. **Exit intent trigger rate** — How often does the desktop exit intent fire vs mobile scroll-back?

---

## SmartReview (reviewiq.com)

### North Star Metric
- **Metric:** Reviews submitted per week
- **Status:** Collecting — GA4 property G-9ZZV60ESL3 active
- **Baseline target:** To be set Week 15

### Instrumentation Health Check
| Check | Status | Notes |
|-------|--------|-------|
| GA4 property (G-9ZZV60ESL3) | Active | Events streaming |
| Clarity project (w3w5leh6ae) | Active | Session recordings |
| 19 custom events (13 base + 6 feature) | Deployed | All in `analytics.ts` and `tracking/analytics.ts` |
| Review submission funnel (8-step) | Wired | `write_review_step` events by step |
| Feature funnels (3) | Wired | Email capture, auth gate, Quick Answer |

### Content Health (DB Snapshot)
| Metric | Source |
|--------|--------|
| Products | PostgreSQL `product` table |
| Categories | PostgreSQL `category` table |
| Reviews | PostgreSQL `review` table |
| Users | PostgreSQL `user` table |
| Discussions | PostgreSQL `discussionThread` table |
| Votes | PostgreSQL `vote` table |

*Exact counts via `/api/analytics?section=live`*

### Review Funnel — Expected vs Preliminary
| Step | Event | Expected Rate | W14 Status |
|------|-------|---------------|------------|
| 1. Landing | page_view | 100% | Collecting |
| 2. Browse Category | category_viewed | ~60% | Collecting |
| 3. View Product | product_viewed | ~35% | Collecting |
| 4. Start Review | write_review_step:1 | ~8% | Collecting |
| 5. Rate Product | write_review_step:2 | ~6% | Collecting |
| 6. Write Content | write_review_step:3 | ~4% | Collecting |
| 7. Verify & Submit | write_review_step:4 | ~3% | Collecting |
| 8. Review Submitted | review_submitted | ~2% | Collecting |

### New Feature Funnels (Monitoring)
| Feature | Key Metric | Target | W14 Status |
|---------|-----------|--------|------------|
| Email Capture | capture_submit / capture_shown | >5% | Collecting |
| Account-Required Reviews | auth_signup / auth_gate_shown | >30% | Collecting |
| Quick Answer | qa_expand / qa_view | >15% | Collecting |

---

## Cross-Product Analysis

### Shared Patterns to Monitor
| Signal | Comparison | SmartReview | Action If Divergent |
|--------|------------|-------------|---------------------|
| Mobile bounce rate | TBD | TBD | Prioritize mobile UX for worse-performing product |
| Search success rate | comparison_view/search | result_clicked/search | Improve search relevance on lower performer |
| Newsletter capture | newsletter_signup/sessions | newsletter_signup/sessions | Replicate better-converting placement |
| Avg session duration | Target >2min | Target >3min | Deep-dive content engagement patterns |

### GSC Cross-Reference (Planned for W15+)
Once 2 weeks of GA4 data is available, cross-reference with Google Search Console:
1. **High-impression / low-CTR pages** — Meta title/description optimization candidates
2. **High-CTR / high-bounce pages** — Content-expectation mismatch (search intent vs page content)
3. **Rising queries** — New comparison opportunities from organic search terms
4. **Position 5-15 keywords** — "Striking distance" opportunities for targeted optimization

---

## A/B Test Recommendations Update

### Active Tests — No Changes Needed
Both active experiments (verdict-first layout, CTA button style) are accumulating data as designed. No intervention required until April 14 evaluation window.

### Proposed Tests — Updated Priority
| Test | Product | Priority | Prerequisite |
|------|---------|----------|-------------|
| Review Form Simplification (4→2 steps) | SmartReview | **High** | W15 funnel data showing step 3-4 drop-off |
| Smart Category Recommendations | SmartReview | Medium | W15 category browse rate data |
| Quick Answer Placement (above/below fold) | SmartReview | Medium | Quick Answer feature deployed |
| Social Proof Elements | Comparison | Medium | Scheduled May 15 — component prep needed |

---

## Callouts & Action Items

1. **Data accumulation on track** — 3 days collected, need 11 more for reliable baselines
2. **A/B tests: hands off until April 14** — Do not modify comparison page layout or CTA styling
3. **Clarity recordings** — Spot-check 5-10 session recordings per product to verify capture quality
4. **SmartReview env vars** — Confirm `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_CLARITY_ID` are set in production
5. **GSC API integration** — Scheduled for W15 report to enable automated high-impression/low-CTR analysis

---

## Next Report (Week 15 — April 7-13)
- **First real GA4 numbers** — Sessions, users, bounce rate, duration for both products
- **Preliminary funnel rates** — At least top-of-funnel steps with actual percentages
- **A/B test sample size check** — Are we on track for April 14 evaluation?
- **GSC cross-reference** — First high-impression/low-CTR page analysis
- **North star metric baselines** — Set targets for weekly active comparisons and reviews/week
