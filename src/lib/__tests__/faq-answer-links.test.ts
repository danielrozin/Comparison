import { describe, expect, it } from "vitest";
import { getSubcategoryFaqs } from "@/lib/data/subcategory-faqs";
import { faqAnswerParts, plainFaqAnswer } from "@/lib/faq-answer-links";
import { getConsolidatedCompareSlug } from "@/lib/redirects/compare-redirects";
import { isEditorialCompareSlug } from "@/lib/data/editorial-compares";

describe("basketball hub FAQ links", () => {
  it("points Steph vs Kobe and Jokic vs Embiid at the new pages", () => {
    const faqs = getSubcategoryFaqs("sports", "basketball");
    const popular = faqs.find((faq) => faq.question.includes("most popular"));
    expect(popular).toBeTruthy();
    const parts = faqAnswerParts(popular!.answer);
    const hrefs = parts.filter((part) => part.href).map((part) => part.href);
    expect(hrefs).toEqual([
      "/compare/lebron-vs-jordan",
      "/compare/kobe-bryant-vs-steph-curry",
      "/compare/durant-vs-lebron",
      "/compare/embiid-vs-jokic",
      "/compare/lakers-vs-celtics",
    ]);
    expect(plainFaqAnswer(popular!.answer)).toBe(
      "Top comparisons include LeBron James vs Michael Jordan, Steph Curry vs Kobe Bryant, Kevin Durant vs LeBron, Nikola Jokić vs Joel Embiid, and franchise comparisons like Lakers vs Celtics by championship count."
    );
    expect(isEditorialCompareSlug("embiid-vs-jokic")).toBe(true);
    expect(isEditorialCompareSlug("kobe-bryant-vs-steph-curry")).toBe(true);
    expect(isEditorialCompareSlug("durant-vs-lebron")).toBe(true);
    expect(isEditorialCompareSlug("lakers-vs-celtics")).toBe(true);
    expect(getConsolidatedCompareSlug("embiid-vs-jokic")).toBeNull();
    expect(getConsolidatedCompareSlug("kobe-bryant-vs-steph-curry")).toBeNull();
    expect(getConsolidatedCompareSlug("durant-vs-lebron")).toBeNull();
    expect(getConsolidatedCompareSlug("lakers-vs-celtics")).toBeNull();
    expect(getConsolidatedCompareSlug("lebron-vs-jordan")).toBeNull();
  });
});
