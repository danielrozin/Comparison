// Decides whether a browser exception was thrown inside a third-party script we
// load but do not own. PostHog's `capture_exceptions` reports every one of
// these as a first-party issue, so an error inside Google's Subscribe with
// Google (news.google.com/.../publisher.js), adsbygoogle, gtag, Microsoft
// Clarity, or a browser extension lands in the same inbox as our own bugs and
// buries them. We cannot fix code we do not own, so we drop it before send.

// Match on the script origin in a frame filename. Each entry maps to a script
// the site loads (or a browser extension) whose errors are not our code.
const THIRD_PARTY_SOURCES = [
  "news.google.com", // Subscribe with Google / Preferred Sources
  "googlesyndication.com", // adsbygoogle
  "googletagmanager.com", // gtag
  "google-analytics.com", // gtag
  "clarity.ms", // Microsoft Clarity
  "chrome-extension://",
  "moz-extension://",
  "safari-extension://",
  "safari-web-extension://",
] as const;

interface StackFrame {
  filename?: string;
}

interface ExceptionItem {
  value?: string;
  stacktrace?: { frames?: StackFrame[] };
}

function isThirdPartySource(filename: string): boolean {
  return THIRD_PARTY_SOURCES.some((source) => filename.includes(source));
}

/**
 * True when a PostHog `$exception` event originates entirely in third-party
 * code. First-party errors stay untouched: a single frame in our own code
 * keeps the exception.
 */
export function isThirdPartyException(
  event: string | undefined,
  properties: Record<string, unknown> | undefined,
): boolean {
  if (event !== "$exception") return false;

  const list = properties?.["$exception_list"];
  if (!Array.isArray(list)) return false;

  const filenames: string[] = [];
  let opaqueScriptError = false;

  for (const item of list as ExceptionItem[]) {
    for (const frame of item?.stacktrace?.frames ?? []) {
      if (typeof frame?.filename === "string" && frame.filename) {
        filenames.push(frame.filename);
      }
    }
    // A cross-origin script reports an opaque "Script error." with no usable
    // stack. It can only come from another origin, so it is never our code.
    if (item?.value === "Script error.") opaqueScriptError = true;
  }

  if (filenames.length === 0) return opaqueScriptError;

  // Keep the error unless every located frame sits in a third-party script.
  return filenames.every(isThirdPartySource);
}
