import { describe, it, expect } from "vitest";

import {
  DEFAULT_ADMIN_NOTIFICATION_EMAILS,
  parseAdminNotificationEmails,
} from "../email";

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
