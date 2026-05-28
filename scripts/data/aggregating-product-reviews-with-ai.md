When someone searches "AirPods Pro 2 vs Sony WF-1000XM5," they don't want another opinion piece. They want the aggregate truth — what do *thousands* of real users actually think, across every source that matters?

That's what we built at [aversusb.net](https://www.aversusb.net/). Here's how the review aggregation pipeline works under the hood.

## The Challenge: Reviews Are Messy

Product reviews exist everywhere — Amazon, Reddit, YouTube comments, RTINGS, Wirecutter, G2, Trustpilot. The data is:

- **Scattered** across 50+ sources with different formats
- **Inconsistent** — "AirPods Pro 2" vs "Apple AirPods Pro (2nd Generation)" vs "APP2"
- **Noisy** — spam reviews, promotional content, outdated info
- **Unstructured** — free text with no standard schema

Our job: turn this chaos into structured, reliable comparison data.

## Step 1: Entity Resolution

Before you can aggregate reviews, you need to know *which product* each review is about. This sounds trivial. It's not.

```typescript
// These all refer to the same product:
const aliases = [
  "AirPods Pro 2",
  "AirPods Pro (2nd gen)",
  "Apple AirPods Pro 2nd Generation",
  "APP2",
  "AirPods Pro USB-C",
  "airpods pro 2022",
];
```

Our approach:

1. **Seed entities** from manufacturer specs (canonical names, model numbers, SKUs)
2. **Fuzzy matching** with normalized strings — strip punctuation, lowercase, expand abbreviations
3. **AI disambiguation** — for edge cases, Claude determines whether "Galaxy Buds" in a 2024 review means Buds3, Buds2 Pro, or Buds FE based on surrounding context
4. **Manual overrides** — a small lookup table for known tricky cases

Entity resolution accuracy improved from ~78% to ~96% after we added the AI disambiguation step.

## Step 2: Multi-Source Collection

We pull reviews from multiple source types:

| Source Type | Examples | What We Extract |
|-------------|----------|-----------------|
| Structured | Amazon, G2, RTINGS | Ratings, pros/cons |
| Semi-structured | Reddit, forums | Opinions in context |
| Expert | Wirecutter, Tom's Guide | Detailed test results |
| Social | YouTube, Twitter | Sentiment signals |

Each source type gets a different weight in our aggregate scoring:

- **Expert reviews** (Wirecutter, RTINGS): 2x weight — standardized testing
- **Verified purchase reviews** (Amazon): 1.5x weight
- **Community discussions** (Reddit): 1x weight — great for real-world usage patterns
- **Social mentions**: 0.5x weight — signal, not substance

## Step 3: Attribute Extraction

Raw reviews are free text. We need structured attributes.

For earbuds, our target schema:

- Sound quality (1-5)
- ANC effectiveness (1-5)
- Comfort (1-5)
- Battery life (hours, verified against specs)
- Value for money (1-5)
- Build quality (1-5)

We use Claude to extract these from review text:

```typescript
const prompt = `
  Extract product attribute ratings from this review.
  Only extract attributes explicitly mentioned.
  Return null for attributes not discussed.

  Review: "${reviewText}"
  Product: "${productName}"

  Return JSON: { soundQuality, anc, comfort, batteryLife, value, buildQuality }
`;
```

Key insight: **always return null for unmentioned attributes**, never infer. A review that says "great sound" but doesn't mention ANC should not generate an ANC score. This avoids hallucinated data contaminating the aggregate.

## Step 4: Sentiment Aggregation

With structured attributes from thousands of reviews, we compute weighted aggregates:

```typescript
function aggregateRatings(reviews: ExtractedReview[]): AggregateScore {
  const weighted = reviews.map(r => ({
    ...r,
    weight: SOURCE_WEIGHTS[r.source] * recencyFactor(r.date)
  }));

  // Only include attributes with 10+ data points
  const attributes = ATTRIBUTE_KEYS.filter(attr =>
    weighted.filter(r => r[attr] !== null).length >= 10
  );

  return attributes.reduce((acc, attr) => {
    const valid = weighted.filter(r => r[attr] !== null);
    const sum = valid.reduce((s, r) => s + r[attr] * r.weight, 0);
    const totalWeight = valid.reduce((s, r) => s + r.weight, 0);
    acc[attr] = Math.round((sum / totalWeight) * 10) / 10;
    return acc;
  }, {});
}
```

The `recencyFactor` gives newer reviews more weight — a 2024 review about firmware-updated ANC is more relevant than a 2022 launch-day review.

## What We Learned

### 1. Source diversity beats volume

500 Amazon reviews + 50 Reddit threads + 5 expert reviews gives a more accurate picture than 5,000 Amazon reviews alone. Each source captures different usage patterns and user segments.

### 2. Negative reviews are more informative

Users who rate a product 3/5 tend to write the most detailed, attribute-specific reviews. Five-star reviews often say "love it!" (not useful). One-star reviews are often about shipping/returns (not product quality). Three-star reviews are gold.

### 3. AI extraction needs guardrails

Without explicit instructions to return null for unmentioned attributes, Claude will sometimes infer ratings from context. "These earbuds have great ANC" does NOT imply anything about comfort. We added validation that rejects any extraction where >80% of attributes are rated — that's a sign the model is filling in blanks.

### 4. Freshness matters more than you think

Product firmware updates can dramatically change the experience. The AirPods Pro 2 got significantly better ANC via software update months after launch. Our recency weighting captures this — static aggregation would miss it.

## Results

Our aggregated comparison data now powers thousands of comparison pages on [aversusb.net](https://www.aversusb.net/). Each page shows:

- Weighted aggregate ratings across all sources
- Attribute-by-attribute breakdown
- Source count and freshness indicators
- Confidence scores (higher when more sources agree)

The average comparison page references data from 15+ review sources and 500+ individual reviews.

## Try It

Browse comparisons at [aversusb.net](https://www.aversusb.net/) — click any comparison to see the aggregated review data in action. A good place to start: [AirPods Pro 2 vs Sony WF-1000XM5](/compare/airpods-pro-2-vs-sony-wf-1000xm5).

You may also like our deep dives on [ChatGPT vs Claude](/compare/chatgpt-vs-claude) and [Anthropic vs OpenAI](/compare/anthropic-vs-openai) for more on the AI models powering this kind of work.

## Conclusion

Aggregating reviews at scale is less about volume and more about source diversity, careful entity resolution, and disciplined extraction. The biggest gains came from refusing to let the model guess — null values are a feature, not a bug. If you're building something similar, start with the boring parts (entity resolution, source weighting) before you reach for fancier modeling. That's where the accuracy lives.
