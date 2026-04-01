import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || "";
    const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);

    const survey = await prisma.fullSurveyResponse.create({
      data: {
        responses: body,
        deviceType: isMobile ? "mobile" : "desktop",
      },
    });

    return NextResponse.json({ id: survey.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to submit full survey response:", error);
    return NextResponse.json({ error: "Failed to submit survey" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const sp = request.nextUrl.searchParams;
    const limit = Math.min(Number(sp.get("limit")) || 50, 200);
    const offset = Number(sp.get("offset")) || 0;

    const [surveys, total] = await Promise.all([
      prisma.fullSurveyResponse.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.fullSurveyResponse.count(),
    ]);

    return NextResponse.json({ surveys, total, limit, offset });
  } catch (error) {
    console.error("Failed to fetch full survey responses:", error);
    return NextResponse.json({ error: "Failed to fetch surveys" }, { status: 500 });
  }
}
