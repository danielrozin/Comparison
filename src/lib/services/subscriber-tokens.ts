import crypto from "crypto";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aversusb.net";

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function buildConfirmUrl(token: string): string {
  return `${SITE_URL}/api/newsletter/confirm?token=${token}`;
}

export function buildUnsubscribeUrl(token: string): string {
  return `${SITE_URL}/api/newsletter/unsubscribe?token=${token}`;
}
