import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aversusb.net";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return new NextResponse(confirmPage("Missing confirmation token.", false), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return new NextResponse(confirmPage("Service temporarily unavailable.", false), {
      status: 503,
      headers: { "Content-Type": "text/html" },
    });
  }

  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { confirmToken: token },
    });

    if (!subscriber) {
      return new NextResponse(confirmPage("Invalid or expired confirmation link.", false), {
        status: 404,
        headers: { "Content-Type": "text/html" },
      });
    }

    if (subscriber.status === "active" && subscriber.confirmedAt) {
      return new NextResponse(confirmPage(subscriber.email, true, true), {
        headers: { "Content-Type": "text/html" },
      });
    }

    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: "active",
        confirmedAt: new Date(),
        confirmToken: null, // Invalidate token after use
      },
    });

    return new NextResponse(confirmPage(subscriber.email, true, false), {
      headers: { "Content-Type": "text/html" },
    });
  } catch (err) {
    console.error("Confirm error:", err);
    return new NextResponse(confirmPage("Something went wrong. Please try again.", false), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }
}

function confirmPage(emailOrError: string, success: boolean, alreadyConfirmed = false): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${success ? "Subscription Confirmed" : "Error"} - A Versus B</title>
  <style>
    body { margin: 0; padding: 40px 16px; background: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; justify-content: center; }
    .card { max-width: 480px; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; }
    h1 { margin: 0 0 12px; color: #111827; font-size: 24px; }
    p { margin: 0; color: #6b7280; font-size: 15px; line-height: 1.6; }
    .check { font-size: 48px; margin-bottom: 16px; }
    a { color: #4f46e5; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    ${
      success
        ? `<div class="check">&#10003;</div>
           <h1>${alreadyConfirmed ? "Already Confirmed" : "You're In!"}</h1>
           <p><strong>${emailOrError}</strong> ${alreadyConfirmed ? "was already confirmed." : "has been confirmed."} You'll receive our best comparisons and alerts.</p>
           <p style="margin-top: 16px;"><a href="${SITE_URL}">Start browsing comparisons</a></p>`
        : `<h1>Oops</h1>
           <p>${emailOrError}</p>
           <p style="margin-top: 16px;"><a href="${SITE_URL}">Back to A Versus B</a></p>`
    }
  </div>
</body>
</html>`;
}
