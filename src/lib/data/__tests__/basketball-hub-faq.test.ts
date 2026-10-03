import { describe, expect, it } from "vitest";
import {
  faqAnswerPlainText,
  faqAnswerSegments,
  getSubcategoryFaqs,
} from "../subcategory-faqs";

describe("basketball hub FAQ", () => {
  it("links Kevin Durant vs LeBron and keeps schema text free of markup", () => {
    const faqs = getSubcategoryFaqs("sports", "basketball");
    const popular = faqs.find((faq) => faq.question === "What are the most popular basketball comparisons?");
    expect(popular).toBeTruthy();

    const answer = popular!.answer;
    const link = faqAnswerSegments(answer).find((segment) => segment.type === "link");
    expect(link).toEqual({
      type: "link",
      label: "Kevin Durant vs LeBron",
      href: "/compare/durant-vs-lebron",
    });

    const plain = faqAnswerPlainText(answer);
    expect(plain).toContain("Kevin Durant vs LeBron");
    expect(plain).not.toContain("[Kevin Durant vs LeBron]");
    expect(plain).not.toContain("/compare/durant-vs-lebron");
    expect(plain).not.toMatch(/404|redirect/);
  });
});
