import { describe, it, expect, vi } from "vitest";
import { purgeExpiredConsentRecords, retentionCutoff } from "../consent-retention";

describe("retentionCutoff", () => {
  it("subtracts the configured number of years from the supplied date", () => {
    const now = new Date("2030-06-15T12:00:00.000Z");
    const cutoff = retentionCutoff(now, 3);
    expect(cutoff.toISOString()).toBe("2027-06-15T12:00:00.000Z");
  });

  it("defaults to 3 years when called with no args", () => {
    const now = new Date("2030-01-01T00:00:00.000Z");
    const cutoff = retentionCutoff(now);
    expect(cutoff.toISOString()).toBe("2027-01-01T00:00:00.000Z");
  });

  it("handles leap-day cutoffs without throwing", () => {
    // 2032-02-29 minus 3 years lands on 2029-02-28 in UTC because Feb 29
    // does not exist in 2029. setUTCFullYear performs the JS-standard rollover.
    const now = new Date("2032-02-29T00:00:00.000Z");
    const cutoff = retentionCutoff(now, 3);
    expect(cutoff.getUTCFullYear()).toBe(2029);
  });
});

describe("purgeExpiredConsentRecords", () => {
  it("calls deleteMany with grantedAt < cutoff and returns the count", async () => {
    const now = new Date("2030-06-15T12:00:00.000Z");
    const expectedCutoff = new Date("2027-06-15T12:00:00.000Z");

    const deleteMany = vi.fn().mockResolvedValue({ count: 7 });
    const fakePrisma = { consentRecord: { deleteMany } } as unknown as Parameters<
      typeof purgeExpiredConsentRecords
    >[0];

    const result = await purgeExpiredConsentRecords(fakePrisma, { now });

    expect(deleteMany).toHaveBeenCalledTimes(1);
    expect(deleteMany).toHaveBeenCalledWith({
      where: { grantedAt: { lt: expectedCutoff } },
    });
    expect(result.cutoff.toISOString()).toBe(expectedCutoff.toISOString());
    expect(result.deletedCount).toBe(7);
  });

  it("respects an override years value", async () => {
    const now = new Date("2030-06-15T12:00:00.000Z");
    const deleteMany = vi.fn().mockResolvedValue({ count: 0 });
    const fakePrisma = { consentRecord: { deleteMany } } as unknown as Parameters<
      typeof purgeExpiredConsentRecords
    >[0];

    await purgeExpiredConsentRecords(fakePrisma, { now, years: 1 });

    expect(deleteMany).toHaveBeenCalledWith({
      where: { grantedAt: { lt: new Date("2029-06-15T12:00:00.000Z") } },
    });
  });

  it("propagates deleteMany errors so callers can fail loud", async () => {
    const deleteMany = vi.fn().mockRejectedValue(new Error("DB down"));
    const fakePrisma = { consentRecord: { deleteMany } } as unknown as Parameters<
      typeof purgeExpiredConsentRecords
    >[0];

    await expect(purgeExpiredConsentRecords(fakePrisma)).rejects.toThrow("DB down");
  });

  it("returns deletedCount: 0 when nothing matches", async () => {
    const deleteMany = vi.fn().mockResolvedValue({ count: 0 });
    const fakePrisma = { consentRecord: { deleteMany } } as unknown as Parameters<
      typeof purgeExpiredConsentRecords
    >[0];

    const result = await purgeExpiredConsentRecords(fakePrisma);
    expect(result.deletedCount).toBe(0);
  });
});
