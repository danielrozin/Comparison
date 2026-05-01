import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { setTrackerCookie } from "@/lib/services/tracker-session";
import { logAdminEvent } from "@/lib/services/admin-logger";
import { SITE_URL } from "@/lib/utils/constants";

function redirect(slug: string | null, status: "confirmed" | "invalid" | "expired"): NextResponse {
  const target = slug
    ? `${SITE_URL}/compare/${slug}?tracker=${status}`
    : `${SITE_URL}/?tracker=${status}`;
  return NextResponse.redirect(target, { status: 303 });
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return redirect(null, "invalid");
  }

  const prisma = getPrisma();
  if (!prisma) {
    return redirect(null, "expired");
  }

  const tracker = await prisma.comparisonTracker.findUnique({
    where: { confirmationToken: token },
  });

  if (!tracker) {
    return redirect(null, "invalid");
  }

  // Single-use token: consume it and activate the tracker.
  await prisma.comparisonTracker.update({
    where: { id: tracker.id },
    data: {
      status: "active",
      confirmedAt: tracker.confirmedAt ?? new Date(),
      confirmationToken: null,
    },
  });

  await logAdminEvent("contact", {
    subtype: "tracker_confirmed",
    email: tracker.email,
    comparisonSlug: tracker.comparisonSlug,
  });

  const response = redirect(tracker.comparisonSlug, "confirmed");
  setTrackerCookie(response, tracker.email);
  return response;
}
