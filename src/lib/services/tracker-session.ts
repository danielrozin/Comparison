/**
 * Lightweight "tracker session" — a signed cookie containing the email of a
 * confirmed comparison-tracker subscriber. Lets us flip the TrackComparisonCard
 * into the "Tracking ✓" state on subsequent visits without a full auth system.
 *
 * Cookie name: tracker_session
 * Payload:     { email: string }
 * Lifetime:    180 days (rolling — refreshed on each visit by the API).
 */

import jwt from "jsonwebtoken";
import type { NextResponse } from "next/server";

export const TRACKER_COOKIE = "tracker_session";
export const TRACKER_TTL_SECONDS = 180 * 24 * 60 * 60; // 180 days

function getSecret(): string | null {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
  return secret || null;
}

export interface TrackerSessionPayload {
  email: string;
}

export function signTrackerSession(email: string): string | null {
  const secret = getSecret();
  if (!secret) return null;
  return jwt.sign({ email: email.toLowerCase().trim() }, secret, {
    expiresIn: TRACKER_TTL_SECONDS,
  });
}

export function verifyTrackerSession(
  token: string | undefined | null,
): TrackerSessionPayload | null {
  if (!token) return null;
  const secret = getSecret();
  if (!secret) return null;
  try {
    const decoded = jwt.verify(token, secret) as { email?: string };
    if (!decoded.email) return null;
    return { email: decoded.email.toLowerCase().trim() };
  } catch {
    return null;
  }
}

export function setTrackerCookie(response: NextResponse, email: string): void {
  const token = signTrackerSession(email);
  if (!token) return;
  response.cookies.set(TRACKER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TRACKER_TTL_SECONDS,
  });
}

export function clearTrackerCookie(response: NextResponse): void {
  response.cookies.set(TRACKER_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
