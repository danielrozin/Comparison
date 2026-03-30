import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return new NextResponse(unsubscribePage("Missing email parameter.", false), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  const normalizedEmail = decodeURIComponent(email).toLowerCase().trim();
  const prisma = getPrisma();

  if (prisma) {
    try {
      await prisma.newsletterSubscriber.updateMany({
        where: { email: normalizedEmail },
        data: { status: "unsubscribed", updatedAt: new Date() },
      });
    } catch (err) {
      console.error("Unsubscribe error:", err);
      return new NextResponse(unsubscribePage("Something went wrong. Please try again.", false), {
        status: 500,
        headers: { "Content-Type": "text/html" },
      });
    }
  }

  return new NextResponse(unsubscribePage(normalizedEmail, true), {
    headers: { "Content-Type": "text/html" },
  });
}

function unsubscribePage(emailOrError: string, success: boolean): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${success ? "Unsubscribed" : "Error"} - A Versus B</title>
  <style>
    body { margin: 0; padding: 40px 16px; background: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; justify-content: center; }
    .card { max-width: 480px; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; }
    h1 { margin: 0 0 12px; color: #111827; font-size: 24px; }
    p { margin: 0; color: #6b7280; font-size: 15px; line-height: 1.6; }
    a { color: #4f46e5; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    ${
      success
        ? `<h1>You've been unsubscribed</h1>
           <p><strong>${emailOrError}</strong> has been removed from our mailing list. You won't receive any more emails from us.</p>
           <p style="margin-top: 16px;"><a href="/">Back to A Versus B</a></p>`
        : `<h1>Oops</h1>
           <p>${emailOrError}</p>
           <p style="margin-top: 16px;"><a href="/">Back to A Versus B</a></p>`
    }
  </div>
</body>
</html>`;
}
