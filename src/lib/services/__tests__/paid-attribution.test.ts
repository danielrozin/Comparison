/**
 * DAN-2591 — paid-traffic attribution via Amazon tracking-ID segregation.
 *
 * The critical case is the OFF case: with NEXT_PUBLIC_AMAZON_TAG_PAID unset,
 * every outbound link must be byte-identical to today for every session,
 * including ?src=paid ones.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const ORGANIC_TAG = "goldenroz94-20";
const PAID_TAG = "goldenrozpaid-20";

const AMAZON_URL = `https://www.amazon.com/s?k=Sony%20WH-1000XM5&tag=${ORGANIC_TAG}`;
const NON_AMAZON_URL = "https://nordvpn.com";
const GOOGLE_URL = "https://www.google.com/search?q=Norway";

/** Load the module fresh so module-level env reads pick up the stubbed value. */
async function loadModule(paidTag?: string) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_AMAZON_AFFILIATE_TAG", ORGANIC_TAG);
  if (paidTag === undefined) {
    vi.stubEnv("NEXT_PUBLIC_AMAZON_TAG_PAID", "");
  } else {
    vi.stubEnv("NEXT_PUBLIC_AMAZON_TAG_PAID", paidTag);
  }
  return import("../paid-attribution");
}

function visit(search: string) {
  window.history.replaceState({}, "", `/compare/a-vs-b${search}`);
}

beforeEach(() => {
  window.sessionStorage.clear();
  visit("");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("paid attribution — OFF (no paid tag configured)", () => {
  it("is inert and leaves every URL untouched, even on a ?src=paid session", async () => {
    const { isPaidAttributionActive, withPaidAmazonTag } = await loadModule();
    visit("?src=paid");

    expect(isPaidAttributionActive()).toBe(false);
    expect(withPaidAmazonTag(AMAZON_URL)).toBe(AMAZON_URL);
    expect(withPaidAmazonTag(NON_AMAZON_URL)).toBe(NON_AMAZON_URL);
    expect(withPaidAmazonTag(GOOGLE_URL)).toBe(GOOGLE_URL);
  });

  it("leaves DB-stored links with a foreign tag untouched", async () => {
    const { withPaidAmazonTag } = await loadModule();
    visit("?src=paid");

    const dbLink = "https://www.amazon.com/dp/B0CHWRXH8B?tag=someone-else-20";
    expect(withPaidAmazonTag(dbLink)).toBe(dbLink);
  });

  it("stays inert when the paid tag equals the organic tag", async () => {
    const { isPaidAttributionActive, withPaidAmazonTag } =
      await loadModule(ORGANIC_TAG);
    visit("?src=paid");

    expect(isPaidAttributionActive()).toBe(false);
    expect(withPaidAmazonTag(AMAZON_URL)).toBe(AMAZON_URL);
  });
});

describe("paid attribution — ON (paid tag configured)", () => {
  it("swaps the tag on a ?src=paid landing", async () => {
    const { withPaidAmazonTag, isPaidAttributionActive } =
      await loadModule(PAID_TAG);
    visit("?src=paid");

    expect(isPaidAttributionActive()).toBe(true);
    expect(withPaidAmazonTag(AMAZON_URL)).toBe(
      `https://www.amazon.com/s?k=Sony%20WH-1000XM5&tag=${PAID_TAG}`,
    );
  });

  it("keeps the paid tag on a second page view without ?src=paid", async () => {
    const { withPaidAmazonTag } = await loadModule(PAID_TAG);
    visit("?src=paid");
    withPaidAmazonTag(AMAZON_URL); // landing persists the flag

    visit(""); // navigate to a second comparison page, no query param
    expect(withPaidAmazonTag(AMAZON_URL)).toContain(`tag=${PAID_TAG}`);
  });

  it("leaves organic sessions on the live tag", async () => {
    const { withPaidAmazonTag } = await loadModule(PAID_TAG);
    visit("?utm_source=newsletter");

    expect(withPaidAmazonTag(AMAZON_URL)).toBe(AMAZON_URL);
  });

  it("never touches non-Amazon destinations", async () => {
    const { withPaidAmazonTag } = await loadModule(PAID_TAG);
    visit("?src=paid");

    expect(withPaidAmazonTag(NON_AMAZON_URL)).toBe(NON_AMAZON_URL);
    expect(withPaidAmazonTag(GOOGLE_URL)).toBe(GOOGLE_URL);
    expect(withPaidAmazonTag("")).toBe("");
    expect(withPaidAmazonTag("/compare/a-vs-b")).toBe("/compare/a-vs-b");
  });

  it("appends a tag to an Amazon URL that has none, preserving the fragment", async () => {
    const { withPaidAmazonTag } = await loadModule(PAID_TAG);
    visit("?src=paid");

    expect(withPaidAmazonTag("https://www.amazon.com/dp/B0CHWRXH8B")).toBe(
      `https://www.amazon.com/dp/B0CHWRXH8B?tag=${PAID_TAG}`,
    );
    expect(
      withPaidAmazonTag("https://www.amazon.co.uk/dp/B0CHWRXH8B?th=1#reviews"),
    ).toBe(`https://www.amazon.co.uk/dp/B0CHWRXH8B?th=1&tag=${PAID_TAG}#reviews`);
  });

  it("rewrites only the tag param, leaving the rest of the query encoded as-is", async () => {
    const { withPaidAmazonTag } = await loadModule(PAID_TAG);
    visit("?src=paid");

    expect(
      withPaidAmazonTag(
        `https://www.amazon.com/s?k=Bose%20QC%20Ultra&tag=${ORGANIC_TAG}&ref=nb`,
      ),
    ).toBe(`https://www.amazon.com/s?k=Bose%20QC%20Ultra&tag=${PAID_TAG}&ref=nb`);
  });
});
