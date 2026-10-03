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
    const links = faqAnswerSegments(answer).filter((segment) => segment.type === "link");
    expect(links).toEqual([
      { type: "link", label: "LeBron James vs Michael Jordan", href: "/compare/lebron-vs-jordan" },
      { type: "link", label: "Steph Curry vs Kobe Bryant", href: "/compare/kobe-bryant-vs-steph-curry" },
      { type: "link", label: "Kevin Durant vs LeBron", href: "/compare/durant-vs-lebron" },
      { type: "link", label: "Nikola Jokić vs Joel Embiid", href: "/compare/embiid-vs-jokic" },
      { type: "link", label: "Lakers vs Celtics", href: "/compare/lakers-vs-celtics" },
    ]);

    const plain = faqAnswerPlainText(answer);
    expect(plain).toContain("Kevin Durant vs LeBron");
    expect(plain).not.toContain("[Kevin Durant vs LeBron]");
    expect(plain).not.toContain("/compare/durant-vs-lebron");
    expect(plain).not.toMatch(/404|redirect/);
  });
});
