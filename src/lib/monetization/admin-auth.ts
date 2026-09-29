import { NextRequest } from "next/server";

/**
 * Founder / ops auth shared by admin membership routes.
 *   Authorization: Bearer $ADMIN_TOKEN
 *   Authorization: Bearer $CRON_SECRET
 *   x-admin-token: $ADMIN_TOKEN
 */
export function configuredAdminSecrets(): string[] {
  return [process.env.ADMIN_TOKEN, process.env.CRON_SECRET].filter(
    (value): value is string => Boolean(value)
  );
}

export function isAdminAuthorized(request: NextRequest): boolean {
  const secrets = configuredAdminSecrets();
  if (secrets.length === 0) return false;

  const headerToken = request.headers.get("x-admin-token")?.trim() ?? "";
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() ?? "";
  const presented = headerToken || bearer;
  if (!presented) return false;
  return secrets.includes(presented);
}
