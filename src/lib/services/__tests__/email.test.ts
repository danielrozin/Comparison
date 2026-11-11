import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { resendSend } = vi.hoisted(() => ({
  resendSend: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class Resend {
    emails = { send: resendSend };
  },
}));

import {
  DEFAULT_ADMIN_NOTIFICATION_EMAILS,
  parseAdminNotificationEmails,
  sendNotificationEmail,
} from "../email";
import { resetResendRateLimitClock } from "../resend-rate-limit";
import { resendFromAddress } from "../resend-from";

describe("parseAdminNotificationEmails", () => {
  it("defaults to both founders when unset or blank", () => {
    expect(parseAdminNotificationEmails(undefined)).toEqual([
      ...DEFAULT_ADMIN_NOTIFICATION_EMAILS,
    ]);
    expect(parseAdminNotificationEmails("")).toEqual([
      ...DEFAULT_ADMIN_NOTIFICATION_EMAILS,
    ]);
    expect(parseAdminNotificationEmails("  ; , ")).toEqual([
      ...DEFAULT_ADMIN_NOTIFICATION_EMAILS,
    ]);
  });

  it("splits comma or semicolon lists and trims whitespace", () => {
    expect(
      parseAdminNotificationEmails("daniarozin@gmail.com, shai.and1@gmail.com")
    ).toEqual(["daniarozin@gmail.com", "shai.and1@gmail.com"]);
    expect(
      parseAdminNotificationEmails("a@x.com; b@y.com,c@z.com")
    ).toEqual(["a@x.com", "b@y.com", "c@z.com"]);
  });

  it("accepts both founder inboxes as one Production env value", () => {
    expect(
      parseAdminNotificationEmails("daniarozin@gmail.com,Shai.and1@gmail.com")
    ).toEqual(["daniarozin@gmail.com", "Shai.and1@gmail.com"]);
  });

  it("keeps a single explicit override", () => {
    expect(parseAdminNotificationEmails("ops@aversusb.net")).toEqual([
      "ops@aversusb.net",
    ]);
  });

  it("deduplicates addresses case-insensitively", () => {
    expect(
      parseAdminNotificationEmails(
        "Daniarozin@gmail.com, daniarozin@gmail.com; SHAI.AND1@gmail.com"
      )
    ).toEqual(["Daniarozin@gmail.com", "SHAI.AND1@gmail.com"]);
  });
});

describe("resendFromAddress", () => {
  const previous = process.env.RESEND_FROM_EMAIL;

  afterEach(() => {
    if (previous === undefined) delete process.env.RESEND_FROM_EMAIL;
    else process.env.RESEND_FROM_EMAIL = previous;
  });

  it("strips whitespace and newlines from RESEND_FROM_EMAIL", () => {
    process.env.RESEND_FROM_EMAIL = " A Versus B <hello@aversusb-mail.com>\r\n";
    expect(resendFromAddress()).toBe("A Versus B <hello@aversusb-mail.com>");
  });
});

describe("sendNotificationEmail rate-limit retry", () => {
  const previousKey = process.env.RESEND_API_KEY;
  const previousWeb3 = process.env.WEB3FORMS_ACCESS_KEY;

  beforeEach(() => {
    process.env.RESEND_API_KEY = "re_test_key";
    delete process.env.WEB3FORMS_ACCESS_KEY;
    resetResendRateLimitClock();
    resendSend.mockReset();
  });

  afterEach(() => {
    resetResendRateLimitClock();
    if (previousKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previousKey;
    if (previousWeb3 === undefined) delete process.env.WEB3FORMS_ACCESS_KEY;
    else process.env.WEB3FORMS_ACCESS_KEY = previousWeb3;
    vi.unstubAllGlobals();
  });

  it("retries a Resend 429 and delivers the cron report without using Web3Forms", async () => {
    const { resendRateLimitClock } = await import("../resend-rate-limit");
    const sleeps: number[] = [];
    resendRateLimitClock.sleep = async (ms) => {
      sleeps.push(ms);
    };

    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    resendSend
      .mockResolvedValueOnce({
        data: null,
        error: {
          message: "Too many requests. You can only make 10 requests per second.",
        },
      })
      .mockResolvedValueOnce({
        data: { id: "cron-report-1" },
        error: null,
      });

    const result = await sendNotificationEmail({
      subject: "Weekly Digest Sent",
      type: "cron-report",
      message: "Subscribers: 24\nSent: 24\nFailed: 0\nMethod: resend",
    });

    expect(result).toEqual({ success: true, method: "resend" });
    expect(resendSend).toHaveBeenCalledTimes(2);
    expect(sleeps).toEqual([250]);
    expect(fetchMock).not.toHaveBeenCalled();

    const payload = resendSend.mock.calls[0][0];
    expect(payload.to).toEqual([...DEFAULT_ADMIN_NOTIFICATION_EMAILS]);
    expect(payload.subject).toBe("[A Versus B] Weekly Digest Sent");
    expect(payload.text).toContain("Type: cron-report");
    expect(payload.text).toContain("Failed: 0");
  });

  it("retries Resend rate limits before falling back to Web3Forms", async () => {
    process.env.WEB3FORMS_ACCESS_KEY = "w3_test";
    const { resendRateLimitClock } = await import("../resend-rate-limit");
    const sleeps: number[] = [];
    resendRateLimitClock.sleep = async (ms) => {
      sleeps.push(ms);
    };

    resendSend.mockResolvedValue({
      data: null,
      error: {
        message: "Too many requests. You can only make 10 requests per second.",
      },
    });

    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ success: true }), { status: 200 })
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendNotificationEmail({
      subject: "Weekly Digest Sent",
      type: "cron-report",
      message: "Subscribers: 24\nSent: 9\nFailed: 15\nMethod: resend",
    });

    expect(resendSend).toHaveBeenCalledTimes(4);
    expect(sleeps).toEqual([250, 500, 1000]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ success: true, method: "web3forms" });
  });
});
