/**
 * ROO-317: provider failures (e.g. Anthropic 401 "invalid x-api-key") were
 * only visible as errorStage "anthropic" in PostHog. Send a short, scrubbed
 * copy of the error so the next outage is diagnosable from analytics alone.
 */
export function cleanGenerationError(raw: string | undefined | null): string {
  if (!raw) return "";
  return raw
    .replace(/sk-[A-Za-z0-9_-]{8,}/g, "[redacted]")
    .replace(/(bearer|x-api-key[":\s]*)\s*[A-Za-z0-9._-]{20,}/gi, "$1[redacted]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
}
