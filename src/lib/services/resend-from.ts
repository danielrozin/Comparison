const DEFAULT_RESEND_FROM = "A Versus B <hello@aversusb-mail.com>";

/**
 * Drop CR/LF and surrounding whitespace from an env value.
 * Production has shipped sender addresses with a trailing newline, which
 * Resend then rejects.
 */
export function stripEnvWhitespace(raw: string | undefined | null): string {
  return (raw ?? "").replace(/[\r\n]+/g, "").trim();
}

/** `RESEND_FROM_EMAIL`, trimmed, or the default verified sender. */
export function resendFromAddress(): string {
  return stripEnvWhitespace(process.env.RESEND_FROM_EMAIL) || DEFAULT_RESEND_FROM;
}

/** Optional override, trimmed the same way. Falls back to `resendFromAddress()`. */
export function resendNotificationFromAddress(): string {
  return stripEnvWhitespace(process.env.RESEND_NOTIFICATION_FROM) || resendFromAddress();
}
