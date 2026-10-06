import { describe, expect, it } from "vitest";
import {
  CASHIERS_CHECK_DECISION_COMPARES,
  composeBlogArticleParts,
  decisionComparesForBlog,
  extractBodyCompareSlugs,
  indexAfterFirstHeading,
  selectInlineComparisonSlugs,
  splitHtmlForInlineComparisonCards,
} from "@/lib/blog/inline-comparison-card";

function paragraph(text: string): string {
  return `<p class="text-text-secondary leading-relaxed my-4">${text}</p>`;
}

function heading(id: string, text: string): string {
  return `<h2 id="${id}" class="text-2xl font-bold">${text}</h2>`;
}

/** A long article so the 60% card has room to land. */
function longArticle(): string {
  const chunks = [
    paragraph("A cashier's check is a check drawn on the bank itself."),
    heading("what-is", "What is a cashier's check?"),
    paragraph(
      'Banks differ. See <a href="/compare/bank-of-america-vs-chase">Chase vs Bank of America</a>.',
    ),
    paragraph("Second section of the guide, still near the top."),
    paragraph(
      'Another pair: <a href="/compare/capital-one-vs-chase?ref=body">Capital One vs Chase</a>.',
    ),
    paragraph("Middle of the article, where a reader is still deciding."),
    paragraph("More detail about fees, holds, and who the check is made out to."),
    paragraph(
      'Money transfer: <a href="/compare/revolut-vs-wise">Revolut vs Wise</a> and again <a href="/compare/bank-of-america-vs-chase">the same banks</a>.',
    ),
    paragraph("Later advice that most search readers never scroll far enough to use."),
    heading("sources", "Sources"),
    paragraph("Last notes."),
  ];
  return chunks.join("\n");
}

describe("selectInlineComparisonSlugs", () => {
  it("prefers body links, then related slugs, and keeps at most three", () => {
    const html = longArticle();
    expect(extractBodyCompareSlugs(html)).toEqual([
      "bank-of-america-vs-chase",
      "capital-one-vs-chase",
      "revolut-vs-wise",
    ]);
    expect(
      selectInlineComparisonSlugs({
        bodyHtml: html,
        relatedSlugs: ["revolut-vs-wise", "macbook-air-vs-macbook-pro", "android-vs-ios"],
      }),
    ).toEqual([
      "bank-of-america-vs-chase",
      "capital-one-vs-chase",
      "revolut-vs-wise",
    ]);
  });

  it("fills from related slugs when the body has fewer than three live links", () => {
    const html = `${paragraph("Intro")}${heading("h", "Heading")}${paragraph(
      'Only <a href="/compare/macbook-air-vs-macbook-pro">Air vs Pro</a>.',
    )}`;
    expect(
      selectInlineComparisonSlugs({
        bodyHtml: html,
        relatedSlugs: ["macbook-air-vs-macbook-pro", "dell-xps-13-vs-macbook-air", "mac-vs-windows"],
      }),
    ).toEqual([
      "macbook-air-vs-macbook-pro",
      "dell-xps-13-vs-macbook-air",
      "mac-vs-windows",
    ]);
  });

  it("returns nothing when there is no published match to show", () => {
    expect(
      selectInlineComparisonSlugs({
        bodyHtml: paragraph("No comparisons here."),
        relatedSlugs: [],
      }),
    ).toEqual([]);
  });

  it("uses only the published cashier's-check decision pages on the mapped posts", () => {
    const html = longArticle();
    const bankSlugs = [
      "bank-of-america-vs-chase",
      "capital-one-vs-chase",
      "revolut-vs-wise",
    ];
    const liveDecisions = CASHIERS_CHECK_DECISION_COMPARES.map((item) => item.slug);

    for (const blogSlug of [
      "how-to-get-a-cashiers-check",
      "can-you-deposit-cash-at-an-atm",
      "does-walmart-cash-checks",
    ]) {
      expect(decisionComparesForBlog(blogSlug).map((item) => item.slug)).toEqual(liveDecisions);
      expect(
        selectInlineComparisonSlugs({
          bodyHtml: html,
          relatedSlugs: bankSlugs,
          preferredSlugs: liveDecisions,
          preferMappedOnly: true,
        }),
      ).toEqual(liveDecisions);
    }

    expect(decisionComparesForBlog("macbook-air-weight-guide")).toEqual([]);
    expect(
      selectInlineComparisonSlugs({
        bodyHtml: html,
        relatedSlugs: bankSlugs,
        preferredSlugs: ["cashiers-check-vs-money-order"],
        preferMappedOnly: true,
      }),
    ).toEqual(["cashiers-check-vs-money-order"]);
  });

  it("hides the card on a mapped post when those decision pages are not published yet", () => {
    expect(
      selectInlineComparisonSlugs({
        bodyHtml: longArticle(),
        relatedSlugs: ["bank-of-america-vs-chase", "capital-one-vs-chase"],
        preferredSlugs: [],
        preferMappedOnly: true,
      }),
    ).toEqual([]);
  });
});

describe("splitHtmlForInlineComparisonCards", () => {
  it("puts the top card immediately after the first h2 and the mid card near 60%", () => {
    const html = longArticle();
    const parts = splitHtmlForInlineComparisonCards(html);
    const positions = parts.filter((part) => part.kind === "card").map((part) => part.position);
    expect(positions).toEqual(["top", "mid"]);

    const topIndex = parts.findIndex((part) => part.kind === "card" && part.position === "top");
    const beforeTop = parts[topIndex - 1];
    expect(beforeTop?.kind).toBe("html");
    if (beforeTop?.kind === "html") {
      expect(beforeTop.html.trimEnd().endsWith("</h2>")).toBe(true);
      expect(beforeTop.html).toContain("What is a cashier's check?");
    }

    const joined = parts
      .filter((part) => part.kind === "html")
      .map((part) => (part.kind === "html" ? part.html : ""))
      .join("");
    expect(joined).toBe(html);

    const midIndex = parts.findIndex((part) => part.kind === "card" && part.position === "mid");
    const beforeMid = parts.slice(0, midIndex).reduce((total, part) => {
      return total + (part.kind === "html" ? part.html.length : 0);
    }, 0);
    const ratio = beforeMid / html.length;
    expect(ratio).toBeGreaterThan(0.45);
    expect(ratio).toBeLessThan(0.8);
    expect(beforeMid).toBeGreaterThan(indexAfterFirstHeading(html) ?? 0);
  });

  it("uses the first h3 when the article has no h2", () => {
    const html = `${paragraph("Intro")}<h3 id="only">Only heading</h3>${paragraph("After")}`;
    const parts = splitHtmlForInlineComparisonCards(html);
    expect(parts.some((part) => part.kind === "card" && part.position === "top")).toBe(true);
    expect(parts.some((part) => part.kind === "card" && part.position === "mid")).toBe(false);
    const before = parts[0];
    expect(before.kind).toBe("html");
    if (before.kind === "html") expect(before.html.trimEnd().endsWith("</h3>")).toBe(true);
  });

  it("does not add a card when the article has no heading and is short", () => {
    const html = paragraph("Just a paragraph.");
    expect(splitHtmlForInlineComparisonCards(html)).toEqual([{ kind: "html", html }]);
  });
});

describe("composeBlogArticleParts", () => {
  it("keeps the intro CTA before the first heading and the card after it", () => {
    const html = longArticle();
    const parts = composeBlogArticleParts(html, { cards: true, introCta: true });
    const kinds = parts.map((part) => (part.kind === "card" ? `card:${part.position}` : part.kind));
    expect(kinds[0]).toBe("html");
    expect(kinds[1]).toBe("intro-cta");
    expect(kinds).toContain("card:top");
    expect(kinds).toContain("card:mid");

    const lead = parts[0];
    expect(lead.kind).toBe("html");
    if (lead.kind === "html") {
      expect(lead.html).toContain("drawn on the bank");
      expect(lead.html).not.toContain("<h2");
    }

    const h2Part = parts.find(
      (part) => part.kind === "html" && part.html.includes("What is a cashier's check?"),
    );
    expect(h2Part?.kind).toBe("html");
    const h2At = parts.indexOf(h2Part!);
    expect(parts[h2At + 1]).toEqual({ kind: "card", position: "top" });

    const joined = parts
      .filter((part) => part.kind === "html")
      .map((part) => (part.kind === "html" ? part.html : ""))
      .join("");
    expect(joined).toBe(html);
  });

  it("leaves a single html block when the article has no card and no intro CTA", () => {
    const html = paragraph("Plain.");
    expect(composeBlogArticleParts(html, { cards: false, introCta: false })).toEqual([
      { kind: "html", html },
    ]);
  });
});
