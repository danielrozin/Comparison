/**
 * Input sanitization utilities for XSS and injection prevention.
 */

/** Strip HTML tags from a string */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

/** Escape HTML special characters */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/** Sanitize a search query: strip HTML, limit length, trim whitespace */
export function sanitizeSearchQuery(query: string, maxLength = 200): string {
  return stripHtml(query).trim().slice(0, maxLength);
}

/** Sanitize a slug: only allow lowercase alphanumeric and hyphens */
export function sanitizeSlug(slug: string, maxLength = 200): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, maxLength);
}

/** Sanitize a general text input: strip HTML, trim, limit length */
export function sanitizeText(input: string, maxLength = 2000): string {
  return stripHtml(input).trim().slice(0, maxLength);
}

/** Sanitize email: lowercase, trim, validate basic format */
export function sanitizeEmail(email: string): string | null {
  const cleaned = email.toLowerCase().trim().slice(0, 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) return null;
  return cleaned;
}

/**
 * Sanitize error messages for production responses.
 * Strips stack traces, file paths, and internal details.
 */
export function sanitizeErrorMessage(
  error: unknown,
  fallback = "An unexpected error occurred"
): string {
  if (process.env.NODE_ENV === "development") {
    return error instanceof Error ? error.message : String(error);
  }
  // In production, only return safe generic messages
  if (error instanceof Error) {
    const msg = error.message;
    // Allow known safe error patterns through
    if (
      msg.startsWith("Invalid") ||
      msg.startsWith("Not found") ||
      msg.startsWith("Unauthorized") ||
      msg.startsWith("Rate limit") ||
      msg.startsWith("Missing")
    ) {
      // Strip any file paths or stack-like content
      return msg.replace(/\s*at\s+.*$/gm, "").replace(/\/[\w./]+/g, "").trim();
    }
  }
  return fallback;
}
