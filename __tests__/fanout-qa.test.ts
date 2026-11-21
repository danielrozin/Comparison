import { describe, expect, it } from "vitest";
import type { ComparisonPageData as Comparison } from "@/types";
import { applyCompareContentOverride, COMPARE_CONTENT_OVERRIDES } from "@/lib/data/compare-content-overrides";
import { applyBlogFanout, BLOG_FANOUT, IKEA_WAYFAIR_SLUG } from "@/lib/data/blog-fanout-qa";
import { getBlogSchemaExtras } from "@/lib/data/blog-schema-extras";

const SLUG = "bloomberg-vs-the-wall-street-journal";

function wsjRow(): Comparison {
  return {
    id: "c1",
    slug: SLUG,
    title: "The Wall Street Journal vs Bloomberg",
    entities: [
      { id: "wsj", name: "The Wall Street Journal", pros: ["Affordable digital subscription ($39/month)", "Keep me"], cons: [] },
      { id: "bbg", name: "Bloomberg", pros: ["Excellent free website and mobile app access"], cons: ["Keep"] },
    ],
    keyDifferences: [
      { label: "Best For Students", entityAValue: "$15/month", entityBValue: "No student or personal subscription available", winner: "a" },
      { label: "Primary Strength", entityAValue: "x", entityBValue: "y", winner: "tie" },
    ],
    attributes: [
      {
        id: "a1",
        slug: "digital-subscription-price",
        name: "Digital Subscription Price",
        unit: null,
        category: null,
        dataType: "number",
        higherIsBetter: false,
        values: [
          { entityId: "wsj", valueText: "$39", valueNumber: 39, valueBoolean: null, winner: false },
          { entityId: "bbg", valueText: "Free (Premium: Variable)", valueNumber: 0, valueBoolean: null, winner: true },
        ],
      },
    ],
    faqs: [
      { question: "Can you get Bloomberg or WSJ for free?", answer: "Bloomberg is enterprise-only" },
      { question: "Does Bloomberg own the Wall Street Journal?", answer: "No." },
    ],
  } as unknown as Comparison;
}

describe("applyCompareContentOverride", () => {
  it("corrects the wrong Bloomberg facts everywhere they render", () => {
    const input = wsjRow();
    const out = applyCompareContentOverride(SLUG, input);
    const kd = out.keyDifferences.find((d) => d.label === "Best For Students")!;
    expect(kd.entityBValue).toMatch(/student plan/i);
    expect(kd.entityAValue).toBe("$15/month"); // unpatched side kept
    const bbgPrice = out.attributes[0].values.find((v) => v.entityId === "bbg")!;
    expect(bbgPrice.valueText).toMatch(/\$40/);
    expect(bbgPrice.winner).toBe(false);
    expect(out.entities[1].pros[0]).toMatch(/for individuals/);
    expect(out.entities[0].pros[1]).toBe("Keep me");
    expect(out.faqs.find((f) => f.question.startsWith("Can you get"))!.answer).not.toMatch(/enterprise-only/);
    expect(JSON.stringify(out)).not.toMatch(/No student or personal subscription|enterprise-only|Excellent free website/);
    // input not mutated
    expect(input.keyDifferences[0].entityBValue).toMatch(/No student/);
  });

  it("puts fan-out Q&A first and keeps existing FAQs after", () => {
    const out = applyCompareContentOverride(SLUG, wsjRow());
    const fanout = COMPARE_CONTENT_OVERRIDES[SLUG].fanoutFaqs!;
    expect(out.faqs.slice(0, fanout.length)).toEqual(fanout);
    expect(out.faqs).toHaveLength(fanout.length + 2);
  });

  it("is a no-op for slugs without an override", () => {
    const input = { ...wsjRow(), slug: "x-vs-y" };
    expect(applyCompareContentOverride("x-vs-y", input)).toBe(input);
  });
});

describe("fan-out answers are quotable", () => {
  const all = [
    ...Object.values(COMPARE_CONTENT_OVERRIDES).flatMap((o) => o.fanoutFaqs ?? []),
    ...Object.values(BLOG_FANOUT).flatMap((b) => b.faqs),
  ];
  it.each(all.map((f) => [f.question, f.answer]))("%s", (_q, answer) => {
    const first = answer.split(/(?<=[.!?])\s/)[0];
    expect(first.length).toBeLessThanOrEqual(160);
    expect(answer).not.toMatch(/^(It|They|This)\b/);
  });
});

describe("applyBlogFanout", () => {
  const md =
    "# Title\n\nIntro.\n\n## The Core Difference\n\nText.\n\n| **Return policy** | 365-day return, must return to store | 30-day return, free returns on most items |\n";

  it("inserts Quick answers before the first H2 and applies corrections", () => {
    const out = applyBlogFanout(IKEA_WAYFAIR_SLUG, md);
    expect(out.indexOf("## Quick answers: IKEA vs Wayfair")).toBeLessThan(out.indexOf("## The Core Difference"));
    expect(out.indexOf("Intro.")).toBeLessThan(out.indexOf("## Quick answers"));
    expect(out).toContain("### How does IKEA compare with Wayfair for bookcases and storage?");
    expect(out).not.toContain("free returns on most items");
    expect(out).toContain("180 days opened");
  });

  it("is idempotent and leaves other posts alone", () => {
    const once = applyBlogFanout(IKEA_WAYFAIR_SLUG, md);
    expect(applyBlogFanout(IKEA_WAYFAIR_SLUG, once)).toBe(once);
    expect(applyBlogFanout("other-post", md)).toBe(md);
  });

  it("FAQPage schema mirrors the visible Quick answers", () => {
    expect(getBlogSchemaExtras(IKEA_WAYFAIR_SLUG)?.faqs).toEqual(BLOG_FANOUT[IKEA_WAYFAIR_SLUG].faqs);
  });
});
