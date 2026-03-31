import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const body = await request.json();

    const { comparisonSlug, category, deviceType, referralSource, q1Intent, q2Found, q2Missing, q3Rating, q4Improvement, q5Discovery, optInEmail } = body;

    if (!comparisonSlug) {
      return NextResponse.json({ error: "comparisonSlug is required" }, { status: 400 });
    }

    if (q3Rating !== undefined && q3Rating !== null && (q3Rating < 1 || q3Rating > 5)) {
      return NextResponse.json({ error: "q3Rating must be between 1 and 5" }, { status: 400 });
    }

    const survey = await prisma.interceptSurvey.create({
      data: {
        comparisonSlug,
        category: category || null,
        deviceType: deviceType || null,
        referralSource: referralSource || null,
        q1Intent: q1Intent || null,
        q2Found: q2Found ?? null,
        q2Missing: q2Missing || null,
        q3Rating: q3Rating ?? null,
        q4Improvement: q4Improvement || null,
        q5Discovery: q5Discovery || null,
        optInEmail: optInEmail || null,
      },
    });

    return NextResponse.json({ id: survey.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to submit intercept survey:", error);
    return NextResponse.json({ error: "Failed to submit survey" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const sp = request.nextUrl.searchParams;
    const category = sp.get("category") || undefined;
    const comparisonSlug = sp.get("comparisonSlug") || undefined;
    const limit = Math.min(Number(sp.get("limit")) || 50, 200);
    const offset = Number(sp.get("offset")) || 0;

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (comparisonSlug) where.comparisonSlug = comparisonSlug;

    const [surveys, total] = await Promise.all([
      prisma.interceptSurvey.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.interceptSurvey.count({ where }),
    ]);

    return NextResponse.json({ surveys, total, limit, offset });
  } catch (error) {
    console.error("Failed to fetch intercept surveys:", error);
    return NextResponse.json({ error: "Failed to fetch surveys" }, { status: 500 });
  }
}
