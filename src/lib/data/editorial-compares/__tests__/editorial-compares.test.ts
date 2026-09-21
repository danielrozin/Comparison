import { describe, it, expect } from "vitest";
import { comparisonPageSchema } from "@/lib/seo/schema";
import {
  getEditorialComparison,
  isEditorialCompareSlug,
  listEditorialCompareSlugs,
  listEditorialCompareSitemapEntries,
} from "../index";

const SIGNAL_FAQS = [
  "Is Signal more private than WhatsApp?",
  "Does WhatsApp use the Signal Protocol?",
  "Which is better for group chats?",
  "Can I use Signal or WhatsApp without a phone number?",
  "Which is better for international / family chats?",
  "Signal vs WhatsApp for business — which should teams use?",
  "Are both end-to-end encrypted by default?",
];

describe("ROO-27 editorial messaging compares", () => {
  it("registers the three messaging slugs as published catalog pages", () => {
    expect(listEditorialCompareSlugs().sort()).toEqual([
      "signal-vs-telegram",
      "signal-vs-whatsapp",
      "whatsapp-vs-telegram",
    ]);
    for (const slug of listEditorialCompareSlugs()) {
      expect(isEditorialCompareSlug(slug)).toBe(true);
      const page = getEditorialComparison(slug);
      expect(page?.metadata.status).toBe("published");
      expect(page?.entities.length).toBe(2);
      expect(page?.faqs.length).toBeGreaterThanOrEqual(7);
      expect(page?.quickAnswer?.tldr).toBeTruthy();
      expect(page?.shortAnswer).toBe(page?.quickAnswer?.tldr);
    }
  });

  it("keeps Signal vs WhatsApp FAQ questions 1:1 with the writer brief", () => {
    const page = getEditorialComparison("signal-vs-whatsapp");
    expect(page).toBeTruthy();
    expect(page!.faqs.map((f) => f.question)).toEqual(SIGNAL_FAQS);
    expect(page!.title).toMatch(/Signal vs WhatsApp/);
    expect(/[0-9.]+\s*(billion|million|B\+|M\+)/i.test(page!.shortAnswer ?? "")).toBe(
      false
    );
  });

  it("emits FAQPage JSON-LD from the same visible FAQ list", () => {
    const page = getEditorialComparison("signal-vs-whatsapp")!;
    const schemas = comparisonPageSchema(page) as Array<{
      "@type"?: string;
      mainEntity?: { name: string }[];
    }>;
    const faq = schemas.find((n) => n["@type"] === "FAQPage");
    expect(faq).toBeTruthy();
    expect((faq?.mainEntity ?? []).map((q) => q.name)).toEqual(SIGNAL_FAQS);
  });

  it("lists every editorial slug for sitemap / entity discovery", () => {
    const slugs = listEditorialCompareSitemapEntries().map((e) => e.slug);
    expect(slugs).toContain("signal-vs-whatsapp");
    expect(slugs).toContain("signal-vs-telegram");
    expect(slugs).toContain("whatsapp-vs-telegram");
  });
});
