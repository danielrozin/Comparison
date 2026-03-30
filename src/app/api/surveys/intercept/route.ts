import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/db/prisma";
import { logAdminEvent } from "@/lib/services/admin-logger";

const surveySchema = z.object({
  comparisonSlug: z.string().min(1).max(500),
  category: z.string().max(100).nullable().optional(),
  deviceType: z.enum(["mobile", "tablet", "desktop"]),
  referralSource: z.string().max(500).nullable().optional(),
  q1Intent: z.enum(["purchase", "curiosity", "project", "browsing", "other"]),
  q1Other: z.string().max(200).nullable().optional(),
  q2Found: z.boolean(),
  q2Missing: z.string().max(200).nullable().optional(),
  q3Rating: z.number().int().min(1).max(5),
  q4Improvement: z.string().max(300).nullable().optional(),
  q5Discovery: z.enum(["search", "social", "shared", "direct", "other"]),
  q5Other: z.string().max(200).nullable().optional(),
  optInEmail: z.string().email().max(254).nullable().optional().or(z.literal("")),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = surveySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const prisma = getPrisma();
    if (prisma) {
      await prisma.interceptSurvey.create({
        data: {
          comparisonSlug: data.comparisonSlug,
          category: data.category || null,
          deviceType: data.deviceType,
          referralSource: data.referralSource || null,
          q1Intent: data.q1Intent,
          q1Other: data.q1Other || null,
          q2Found: data.q2Found,
          q2Missing: data.q2Missing || null,
          q3Rating: data.q3Rating,
          q4Improvement: data.q4Improvement || null,
          q5Discovery: data.q5Discovery,
          q5Other: data.q5Other || null,
          optInEmail: data.optInEmail || null,
        },
      });
    }

    await logAdminEvent("survey_response", {
      type: "intercept",
      comparisonSlug: data.comparisonSlug,
      q1Intent: data.q1Intent,
      q3Rating: data.q3Rating,
      q5Discovery: data.q5Discovery,
      hasEmail: !!data.optInEmail,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit survey" },
      { status: 500 }
    );
  }
}
