import { describe, it, expect, afterEach } from "vitest";

import {
  DEFAULT_ADMIN_NOTIFICATION_EMAILS,
  parseAdminNotificationEmails,
} from "../email";
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
