import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  HUMAN_REVIEWED_SLUGS,
  HUMAN_REVIEW_SIGNOFFS,
  unsignedReviewedSlugs,
} from "@/lib/editorial/human-reviewed";

describe("AI content review policy (ROO-160)", () => {
  it("lists no reviewed slug without Daniel's complete sign-off", () => {
    expect(unsignedReviewedSlugs(HUMAN_REVIEWED_SLUGS, HUMAN_REVIEW_SIGNOFFS)).toEqual([]);
  });

  it("rejects a slug with no sign-off or a partial one", () => {
    expect(unsignedReviewedSlugs(["a-vs-b"], {})).toEqual(["a-vs-b"]);
    expect(
      unsignedReviewedSlugs(["a-vs-b"], {
        "a-vs-b": { reviewer: "Daniel Rozin", reviewedOn: "2026-10-18", checked: ["facts", "title"] },
      }),
    ).toEqual(["a-vs-b"]);
  });

  it("accepts a complete sign-off", () => {
    expect(
      unsignedReviewedSlugs(["a-vs-b"], {
        "a-vs-b": {
          reviewer: "Daniel Rozin",
          reviewedOn: "2026-10-18",
          checked: ["facts", "title", "meta", "schema", "alt"],
        },
      }),
    ).toEqual([]);
  });

  it("keeps the AI disclosure and Analysis label in the policy doc", () => {
    const doc = readFileSync(path.join(process.cwd(), "docs/ai-content-review-policy.md"), "utf8");
    expect(doc).toContain("Drafted with AI from web research.");
    expect(doc).toContain('"Analysis"');
  });
});
