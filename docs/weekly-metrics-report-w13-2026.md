# Weekly Metrics Report — Week 13, 2026

**Period:** March 24 - March 30, 2026
**Generated:** 2026-03-30
**Author:** Product Analyst
**Audience:** VP Product, CTO, CEO

---

## Executive Summary

This is the first baseline weekly report for both products. Analytics infrastructure was activated this week. Data collection has begun but most metrics require 2+ weeks of accumulation before meaningful trends emerge.

**Key takeaway:** Instrumentation is complete across both products. Focus this week was on establishing measurement foundations — not yet on optimization.

---

## Comparison (aversusb.net)

### North Star Metric
- **Metric:** Weekly active comparisons viewed
- **Baseline:** Collecting (target to be set Week 15)

### Content Health
| Metric | Value | Notes |
|--------|-------|-------|
| Total Comparisons | Live in DB | Auto-generated + manual |
| Total Entities | Live in DB | Products/items compared |
| Blog Articles | Live in DB | Supporting SEO content |
| Newsletter Subscribers | Live in DB | Email capture |
| Embed Partners | Live in DB | B2B integration |
| Keywords Tracked | Live in DB | SEO opportunity pipeline |

### Conversion Funnel (8-step)
| Step | Event | Expected Rate |
|------|-------|---------------|
| 1. Landing | page_view | 100% |
| 2. Search/Browse | comparison_search | ~40% |
| 3. View Comparison | comparison_view | ~30% |
| 4. Scroll 25% | scroll_depth_25 | ~22% |
| 5. Scroll 50% | scroll_depth_50 | ~15% |
| 6. Deep Engagement | 30s+ on page | ~10% |
| 7. Engage | vote/share/comment | ~5% |
| 8. Convert | affiliate_click/embed | ~1-2% |

*Actual rates will be populated after 2 weeks of GA4 data.*

### Active A/B Tests
| Test | Traffic | Goal | Status | Started |
|------|---------|------|--------|---------|
| Verdict-First Layout | 50% | Bounce Rate | Active | Mar 30 |
| CTA Button Style | 100% | Affiliate Click | Active | Mar 30 |
| Social Proof Elements | 100% | Engagement | Scheduled May 15 | — |

### Custom Events Tracked: 18
Categories: discovery (2), consideration (1), exploration (1), conversion (1), partnership (3), amplification (1), lead_capture (2), engagement (3), retention (3), experimentation (1)

---

## SmartReview (reviewiq.com)

### North Star Metric
- **Metric:** Reviews submitted per week
- **Baseline:** Collecting (target to be set Week 15)

### Content Health
| Metric | Value | Notes |
|--------|-------|-------|
| Total Products | Live in DB | Product catalog size |
| Total Categories | Live in DB | Category taxonomy |
| Total Reviews | Live in DB | User-generated reviews |
| Total Users | Live in DB | Registered users |
| Total Discussions | Live in DB | Community threads |
| Total Votes | Live in DB | Content quality signals |

### Conversion Funnel (8-step)
| Step | Event | Expected Rate |
|------|-------|---------------|
| 1. Landing | page_view | 100% |
| 2. Browse Category | category_viewed | ~60% |
| 3. View Product | product_viewed | ~35% |
| 4. Start Review | write_review_step:1 | ~8% |
| 5. Rate Product | write_review_step:2 | ~6% |
| 6. Write Content | write_review_step:3 | ~4% |
| 7. Verify & Submit | write_review_step:4 | ~3% |
| 8. Submitted | review_submitted | ~2% |

*Actual rates will be populated after 2 weeks of GA4 data.*

### New Feature Funnels (ready for deployment)
| Feature | Events | Conversion Target |
|---------|--------|-------------------|
| Email Capture | email_capture_shown → submit | >5% |
| Account-Required Reviews | auth_gate_shown → signup | >30% |
| Quick Answer | quick_answer_view → expand | >15% |

### Custom Events Tracked: 19 (13 base + 6 new feature events)
Categories: discovery (3), consideration (1), conversion (4), engagement (4), lead_capture (4), others (3)

---

## A/B Test Recommendations

Based on current product state and analytics infrastructure, here are the recommended experiments:

### Comparison — Active Tests

**1. Verdict-First Layout (Running)**
- **Hypothesis:** Showing the verdict/winner at top of comparison pages will reduce bounce rate by surfacing the answer faster
- **Measurement:** Compare `bounce_rate` between control (classic layout) and treatment (verdict-first) in GA4
- **Minimum sample:** ~1,000 sessions per variant for 95% confidence on >5pp bounce rate change
- **Duration:** 2 months (ends May 30). Do not evaluate before April 14 (2 full weeks)
- **GA4 filter:** `experiment_view` event where `experiment_name = verdict-first-layout`, segment by `variant`

**2. CTA Button Style (Running)**
- **Hypothesis:** Changing affiliate CTA from "Check Price" (amber) to "Buy Now" (green) will increase click-through rate
- **Measurement:** Compare `affiliate_click` rate between variants
- **Note:** 100% traffic with A/B split, all users see the experiment. Filter by `experiment_view` variant
- **Risk:** "Buy Now" may set wrong expectations if link goes to product page, not checkout. Monitor return-to-page rate

**3. Social Proof Elements (Scheduled May 15)**
- **Hypothesis:** Showing vote counts, recent reviews, and "X people compared this today" will increase engagement
- **Pre-work needed:** Ensure vote/comparison count components are ready. Set up `engagement_rate` composite metric in GA4 (votes + shares + comments per session)

### SmartReview — Recommended New Tests

**4. Review Form Simplification (Proposed)**
- **Hypothesis:** Reducing review form from 4 steps to 2 (combined rating+content, then submit) will increase completion rate
- **Goal metric:** `review_submitted / write_review_step:1` (funnel completion rate)
- **Target improvement:** Current expected 25% → 35%+
- **Priority:** High — direct impact on North Star metric

**5. Smart Category Recommendations (Proposed)**
- **Hypothesis:** Showing personalized category suggestions on landing page will increase category browse rate
- **Goal metric:** `category_viewed / page_view`
- **Target improvement:** 60% → 70%+
- **Priority:** Medium — improves top-of-funnel

**6. Quick Answer Placement (Proposed — after feature launch)**
- **Hypothesis:** Placing Quick Answers above the fold vs below reviews section will increase engagement
- **Goal metric:** `quick_answer_expand / quick_answer_view`
- **Priority:** Medium — depends on Quick Answer feature deployment

---

## User Segmentation Framework

### Proposed Segments

| Segment | Definition | Key Metrics |
|---------|------------|-------------|
| **New Visitors** | First session (GA4 `first_visit`) | Bounce rate, pages/session, time on site |
| **Returning Visitors** | 2+ sessions, no account | Return frequency, content depth, email capture rate |
| **Registered Users** | Have account | Review rate, vote rate, discussion participation |
| **Power Users** | 5+ reviews OR 3+ discussions | Retention, feature adoption, referral potential |
| **Mobile Users** | Device category = mobile | Completion rates, scroll depth, exit intent triggers |
| **Search Arrivals** | Medium = organic search | Landing page performance, query intent match |
| **Direct/Referral** | Medium = direct or referral | Brand awareness indicator, loyalty signal |

### GA4 Implementation
- Create audiences in GA4 Admin for each segment
- Use `user_properties` for registered/power user classification
- Set up comparison reports per segment in GA4 Explorations
- Cross-reference with Clarity heatmaps per device type

---

## Callouts & Action Items

1. **Data collection underway** — Wait until April 14 (Week 15) before drawing trend conclusions
2. **A/B tests active** — Do not change comparison page layout or CTA styling during experiment period
3. **New feature events ready** — Email capture, auth gate, and Quick Answer tracking functions are deployed and waiting for feature code
4. **Clarity verification needed** — Confirm session recordings are capturing in both products
5. **GSC integration** — Cross-reference GA4 traffic data with Google Search Console for high-impression/low-CTR page optimization (Week 15+)

---

## Next Report (Week 14)
- First look at actual GA4 data (7 days of collection)
- Preliminary bounce rate and session duration baselines
- A/B test sample size check (verdict-first + CTA button)
- Feature deployment status check
