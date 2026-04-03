# Weekly Metrics Report — Week 15, 2026

**Period:** April 7 – April 13, 2026
**Generated:** 2026-04-03 (pre-week framework — actuals to be filled Apr 14)
**Author:** Product Analyst
**Audience:** VP Product, CTO, CEO

---

## Executive Summary

Week 15 is the first report with 2+ full weeks of GA4 data. This enables:
- **North star metric baselines** (finalized)
- **Week-over-week comparisons** (W14 vs W15)
- **Preliminary funnel conversion rates** with real numbers
- **A/B test sample size evaluation** (14 days = minimum evaluation window)
- **GSC cross-reference analysis** with actual search data
- **Content velocity tracking** (new comparisons + articles per day)

---

## North Star Metrics — Baselines Set

| Product | North Star | Tracking Event | W14 Baseline | W15 Target |
|---------|-----------|----------------|-------------|------------|
| Comparison | Weekly active comparisons viewed | `comparison_view` | *To fill from GA4* | Baseline + 10% |
| SmartReview | Reviews submitted per week | `review_submitted` | *To fill from GA4* | Baseline + 10% |

**Methodology:** Baseline = W14 actuals (first full week). Targets use 10% WoW growth rate aligned with $1M ARR goal trajectory.

---

## Comparison (aversusb.net)

### Week-over-Week Summary

| Metric | W14 | W15 | WoW Change |
|--------|-----|-----|------------|
| Sessions | *TBD* | *TBD* | *TBD* |
| Unique Users | *TBD* | *TBD* | *TBD* |
| Bounce Rate | *TBD* | *TBD* | *TBD* |
| Avg Session Duration | *TBD* | *TBD* | *TBD* |
| Pages/Session | *TBD* | *TBD* | *TBD* |
| Comparison Views | *TBD* | *TBD* | *TBD* |
| Affiliate Clicks | *TBD* | *TBD* | *TBD* |

### Content Velocity

| Metric | W14 | W15 | WoW Change |
|--------|-----|-----|------------|
| New comparisons created | *TBD* | *TBD* | *TBD* |
| New blog articles | *TBD* | *TBD* | *TBD* |
| Avg comparisons/day | *TBD* | *TBD* | *TBD* |

### Conversion Funnel — First Real Numbers

| Step | Event | Expected | W15 Actual | vs Target |
|------|-------|----------|-----------|-----------|
| 1. Landing | page_view | 100% | *TBD* | — |
| 2. Search/Browse | comparison_search | ~40% | *TBD* | *TBD* |
| 3. View Comparison | comparison_view | ~30% | *TBD* | *TBD* |
| 4. Scroll 25% | scroll_depth_25 | ~22% | *TBD* | *TBD* |
| 5. Scroll 50% | scroll_depth_50 | ~15% | *TBD* | *TBD* |
| 6. Deep Engagement | 30s+ on page | ~10% | *TBD* | *TBD* |
| 7. Engage | vote/share/comment | ~5% | *TBD* | *TBD* |
| 8. Convert | affiliate/embed | ~1-2% | *TBD* | *TBD* |

**Critical drop-off points (steps with <50% progression):** *To be identified from data*

### A/B Test Evaluation (14-Day Checkpoint)

| Test | Variant A | Variant B | Sessions/Variant | Goal Metric | Result | Confidence |
|------|-----------|-----------|------------------|-------------|--------|------------|
| Verdict-First Layout | Classic | Verdict-first | *TBD* | Bounce Rate | *TBD* | *TBD* |
| CTA Button Style | Default | Styled | *TBD* | Affiliate Click | *TBD* | *TBD* |

**Decision criteria:**
- Minimum 1,000 sessions/variant for bounce rate (5pp MDE at 95% confidence)
- If below threshold: extend test 1 more week
- If above threshold: declare winner and roll out

### GSC Cross-Reference

| Insight Type | Count | Top Example |
|-------------|-------|-------------|
| High impressions, low CTR (pos ≤10, CTR <3%) | *TBD* | *TBD* |
| Striking distance (pos 5-15) | *TBD* | *TBD* |
| Quick wins (pos ≤3, CTR ≥5%) | *TBD* | *TBD* |

**Top 5 optimization targets:**
1. *To fill from GSC data*
2. *To fill from GSC data*
3. *To fill from GSC data*
4. *To fill from GSC data*
5. *To fill from GSC data*

---

## SmartReview (reviewiq.com)

### Week-over-Week Summary

| Metric | W14 | W15 | WoW Change |
|--------|-----|-----|------------|
| Sessions | *TBD* | *TBD* | *TBD* |
| Products in DB | *TBD* | *TBD* | *TBD* |
| Reviews submitted | *TBD* | *TBD* | *TBD* |
| Users registered | *TBD* | *TBD* | *TBD* |

### Review Funnel — First Real Numbers

| Step | Event | Expected | W15 Actual | vs Target |
|------|-------|----------|-----------|-----------|
| 1. Landing | page_view | 100% | *TBD* | — |
| 2. Browse Category | category_viewed | ~60% | *TBD* | *TBD* |
| 3. View Product | product_viewed | ~35% | *TBD* | *TBD* |
| 4. Start Review | write_review_step:1 | ~8% | *TBD* | *TBD* |
| 5. Rate Product | write_review_step:2 | ~6% | *TBD* | *TBD* |
| 6. Write Content | write_review_step:3 | ~4% | *TBD* | *TBD* |
| 7. Verify & Submit | write_review_step:4 | ~3% | *TBD* | *TBD* |
| 8. Review Submitted | review_submitted | ~2% | *TBD* | *TBD* |

### New Feature Funnels

| Feature | Key Metric | Target | W15 Actual | Status |
|---------|-----------|--------|-----------|--------|
| Email Capture | submit / shown | >5% | *TBD* | *TBD* |
| Account-Required Reviews | signup / gate_shown | >30% | *TBD* | *TBD* |
| Quick Answer | expand / view | >15% | *TBD* | *TBD* |

---

## Cross-Product Analysis

### User Segmentation Framework (Week 3-4 Deliverable)

| Segment | Definition | Comparison | SmartReview | Action |
|---------|-----------|------------|-------------|--------|
| New vs Returning | GA4 user type | *TBD* split | *TBD* split | Higher returning % = sticky product |
| Mobile vs Desktop | GA4 device category | *TBD* split | *TBD* split | Optimize worse-performing device |
| Geo (US vs intl) | GA4 country | *TBD* split | *TBD* split | Localization if intl >30% |
| High-value users | 3+ sessions/week | *TBD* count | *TBD* count | Build retention features for this cohort |
| Search-driven | Arrived via organic search | *TBD* % | *TBD* % | SEO investment ROI |
| Direct/referral | Typed URL or backlink | *TBD* % | *TBD* % | Brand awareness metric |
| Category specialist | Views 3+ items in same category | *TBD* % | *TBD* % | Recommend related content |

### Engagement Comparison

| KPI | Comparison Target | Comparison Actual | SmartReview Target | SmartReview Actual |
|-----|------------------|-------------------|-------------------|-------------------|
| Vote/engage rate | >5% | *TBD* | N/A | *TBD* |
| Share rate | >2% | *TBD* | N/A | *TBD* |
| Search success | >60% | *TBD* | >60% | *TBD* |
| Newsletter conversion | >1% | *TBD* | >1% | *TBD* |

---

## Recommendations & Next Steps

### Immediate (based on W15 data)
1. **Set numeric north star targets** once baseline is confirmed
2. **A/B test decisions** — call winner or extend based on sample size
3. **Prioritize top 3 GSC striking-distance keywords** for content optimization
4. **Flag any funnel step with >60% drop-off** for UX Designer review

### Week 16-17 Planned
5. **Monthly deep dive** — first monthly report with 4 weeks of data
6. **Cohort retention analysis** — W13 vs W14 vs W15 cohorts
7. **A/B test #3 prep** — social proof elements (scheduled May 15)
8. **Competitive benchmarking** — compare our funnel rates to industry norms

---

*Data source: GA4 (G-0BWYZ5V9QK, G-9ZZV60ESL3), Redis event log, PostgreSQL, GSC API*
*Dashboard: /admin/analytics > Weekly Report tab (now with WoW comparison)*
*Next report: W16 (April 14-20) — first monthly deep dive eligible*
