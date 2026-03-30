import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { SITE_URL } from "@/lib/utils/constants";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${SITE_URL}/newsletter/confirmed?status=error`);
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.redirect(`${SITE_URL}/newsletter/confirmed?status=error`);
  }

  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { confirmationToken: token },
    });

    if (!subscriber) {
      return NextResponse.redirect(
        `${SITE_URL}/newsletter/confirmed?status=invalid`
      );
    }

    if (subscriber.status === "active") {
      return NextResponse.redirect(
        `${SITE_URL}/newsletter/confirmed?status=already`
      );
    }

    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: "active",
        confirmedAt: new Date(),
        confirmationToken: null,
        subscribedAt: new Date(),
      },
    });

    return NextResponse.redirect(
      `${SITE_URL}/newsletter/confirmed?status=success`
    );
  } catch (error) {
    console.error("Newsletter confirmation error:", error);
    return NextResponse.redirect(`${SITE_URL}/newsletter/confirmed?status=error`);
  }
}
