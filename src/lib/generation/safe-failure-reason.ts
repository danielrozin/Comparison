/**
 * A failure code safe to send to analytics.
 *
 * Generation errors sometimes include provider text ("invalid x-api-key").
 * The fallback event keeps a short code such as "anthropic" or "timeout"
 * and drops anything that is not a code. A suffix after ":" (the entity
 * name on `unknown_entity:mailchimp`) is removed so the code stays generic.
 */

const SAFE_REASON = /^[a-z][a-z0-9_]{0,39}$/;

export function safeGenerationFailureReason(value: unknown, fallback: string): string {
  const raw = typeof value === "string" ? value.trim().toLowerCase() : "";
  const code = raw.split(":")[0] ?? "";
  if (SAFE_REASON.test(code)) return code;
  return SAFE_REASON.test(fallback) ? fallback : "unknown";
}
