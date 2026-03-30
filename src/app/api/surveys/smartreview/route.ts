import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/db/prisma";
import { logAdminEvent } from "@/lib/services/admin-logger";

const surveySchema = z.object({
  triggerType: z.enum(["form_submit_success", "form_abandon", "browse_5_pages"]),
  entitySlug: z.string().max(500).nullable().optional(),
  deviceType: z.enum(["mobile", "tablet", "desktop"]),
  referralSource: z.string().max(500).nullable().optional(),
  userType: z.enum(["new", "returning"]).nullable().optional(),
  userRole: z.enum(["reviewer", "reader"]),
  q1Motivation: z.string().min(1).max(100),
  q1Other: z.string().max(200).nullable().optional(),
  q2Ease: z.number().int().min(1).max(5),
  q2Difficulty: z.string().max(300).nullable().optional(),
  q3Trust: z.number().int().min(1).max(5),
  q3TrustFactors: z.array(z.string().max(50)).max(10).default([]),
  q4Discovery: z.string().min(1).max(100),
  q4Other: z.string().max(200).nullable().optional(),
  q5Feature: z.string().max(300).nullable().optional(),
  optInEmail: z.string().email().max(254).nullable().optional().or(z.literal("")),
  completionTimeSec: z.number().int().min(0).max(3600).nullable().optional(),
  stepsCompleted: z.number().int().min(1).max(5).default(5),
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
      await prisma.smartReviewSurvey.create({
        data: {
          triggerType: data.triggerType,
          entitySlug: data.entitySlug || null,
          deviceType: data.deviceType,
          referralSource: data.referralSource || null,
          userType: data.userType || null,
          userRole: data.userRole,
          q1Motivation: data.q1Motivation,
          q1Other: data.q1Other || null,
          q2Ease: data.q2Ease,
          q2Difficulty: data.q2Difficulty || null,
          q3Trust: data.q3Trust,
          q3TrustFactors: data.q3TrustFactors,
          q4Discovery: data.q4Discovery,
          q4Other: data.q4Other || null,
          q5Feature: data.q5Feature || null,
          optInEmail: data.optInEmail || null,
          completionTimeSec: data.completionTimeSec ?? null,
          stepsCompleted: data.stepsCompleted,
        },
      });
    }

    await logAdminEvent("survey_response", {
      type: "smartreview",
      triggerType: data.triggerType,
      userRole: data.userRole,
      q2Ease: data.q2Ease,
      q3Trust: data.q3Trust,
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
