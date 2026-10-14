import { describe, it, expect } from "vitest";
import { isThirdPartyException } from "../third-party-errors";

const exceptionEvent = (list: unknown) => ({
  event: "$exception",
  properties: { $exception_list: list },
});

describe("isThirdPartyException", () => {
  it("drops the Subscribe with Google error (single third-party frame)", () => {
    const { event, properties } = exceptionEvent([
      {
        value: "not connected",
        stacktrace: {
          frames: [
            {
              function: "Os.getTarget",
              filename: "https://news.google.com/swg/js/v1/publisher.js",
            },
          ],
        },
      },
    ]);
    expect(isThirdPartyException(event, properties)).toBe(true);
  });

  it("drops adsbygoogle, gtag, and Clarity errors", () => {
    for (const filename of [
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
      "https://www.googletagmanager.com/gtag/js",
      "https://www.clarity.ms/tag/abc",
    ]) {
      const { event, properties } = exceptionEvent([
        { value: "boom", stacktrace: { frames: [{ filename }] } },
      ]);
      expect(isThirdPartyException(event, properties)).toBe(true);
    }
  });

  it("drops browser extension errors", () => {
    const { event, properties } = exceptionEvent([
      {
        value: "message",
        stacktrace: {
          frames: [{ filename: "chrome-extension://abcdef/content.js" }],
        },
      },
    ]);
    expect(isThirdPartyException(event, properties)).toBe(true);
  });

  it("drops opaque cross-origin 'Script error.' with no frames", () => {
    const { event, properties } = exceptionEvent([{ value: "Script error." }]);
    expect(isThirdPartyException(event, properties)).toBe(true);
  });

  it("keeps first-party errors", () => {
    const { event, properties } = exceptionEvent([
      {
        value: "Cannot read properties of undefined",
        stacktrace: {
          frames: [{ filename: "https://aversusb.com/_next/static/chunk.js" }],
        },
      },
    ]);
    expect(isThirdPartyException(event, properties)).toBe(false);
  });

  it("keeps an error that touches our code even if a third-party frame is present", () => {
    const { event, properties } = exceptionEvent([
      {
        value: "boom",
        stacktrace: {
          frames: [
            { filename: "https://news.google.com/swg/js/v1/publisher.js" },
            { filename: "https://aversusb.com/_next/static/chunk.js" },
          ],
        },
      },
    ]);
    expect(isThirdPartyException(event, properties)).toBe(false);
  });

  it("ignores non-exception events", () => {
    expect(isThirdPartyException("$pageview", { $current_url: "/" })).toBe(false);
  });

  it("keeps an exception with no stack and no opaque marker", () => {
    const { event, properties } = exceptionEvent([{ value: "real bug" }]);
    expect(isThirdPartyException(event, properties)).toBe(false);
  });

  describe("translated-page React DOM errors", () => {
    const reactFrame = {
      filename: "https://www.aversusb.net/_next/static/chunks/4bd1b696.js",
    };
    const domError = (value: string, language?: string) => ({
      $exception_list: [
        { type: "DOMException", value, stacktrace: { frames: [reactFrame] } },
      ],
      ...(language ? { $browser_language: language } : {}),
    });
    const insertBefore =
      "NotFoundError: Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.";
    const removeChild =
      "NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.";

    it("drops insertBefore and removeChild errors from a non-English browser", () => {
      expect(isThirdPartyException("$exception", domError(insertBefore, "zh-CN"))).toBe(true);
      expect(isThirdPartyException("$exception", domError(removeChild, "de"))).toBe(true);
    });

    it("keeps the same errors from an English browser", () => {
      expect(isThirdPartyException("$exception", domError(insertBefore, "en-US"))).toBe(false);
      expect(isThirdPartyException("$exception", domError(removeChild, "en"))).toBe(false);
    });

    it("keeps the same errors when the browser language is unknown", () => {
      expect(isThirdPartyException("$exception", domError(insertBefore))).toBe(false);
    });

    it("keeps other first-party errors from a non-English browser", () => {
      expect(
        isThirdPartyException(
          "$exception",
          domError("TypeError: Cannot read properties of undefined", "zh-CN"),
        ),
      ).toBe(false);
    });
  });
});
