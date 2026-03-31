import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const body = await request.json();

    const { userType, actionType, category, reviewCompletionTimeSec, formFieldsFilled, surveyCompleted, q1Intent, q2Found, q2Missing, q3Rating, q4Improvement, q5Discovery, deviceType, referralSource, optInEmail } = body;

    if (q3Rating !== undefined && q3Rating !== null && (q3Rating < 1 || q3Rating > 5)) {
      return NextResponse.json({ error: "q3Rating must be between 1 and 5" }, { status: 400 });
    }

    const survey = await prisma.smartreviewSurvey.create({
      data: {
        userType: userType || null,
        actionType: actionType || null,
        category: category || null,
        reviewCompletionTimeSec: reviewCompletionTimeSec ?? null,
        formFieldsFilled: formFieldsFilled ?? null,
        surveyCompleted: surveyCompleted ?? false,
        q1Intent: q1Intent || null,
        q2Found: q2Found ?? null,
        q2Missing: q2Missing || null,
        q3Rating: q3Rating ?? null,
        q4Improvement: q4Improvement || null,
        q5Discovery: q5Discovery || null,
        deviceType: deviceType || null,
        referralSource: referralSource || null,
        optInEmail: optInEmail || null,
      },
    });

    return NextResponse.json({ id: survey.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to submit smartreview survey:", error);
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
    const userType = sp.get("userType") || undefined;
    const surveyCompleted = sp.get("surveyCompleted");
    const limit = Math.min(Number(sp.get("limit")) || 50, 200);
    const offset = Number(sp.get("offset")) || 0;

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (userType) where.userType = userType;
    if (surveyCompleted !== null) {
      where.surveyCompleted = surveyCompleted === "true";
    }

    const [surveys, total] = await Promise.all([
      prisma.smartreviewSurvey.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.smartreviewSurvey.count({ where }),
    ]);

    return NextResponse.json({ surveys, total, limit, offset });
  } catch (error) {
    console.error("Failed to fetch smartreview surveys:", error);
    return NextResponse.json({ error: "Failed to fetch surveys" }, { status: 500 });
  }
}
