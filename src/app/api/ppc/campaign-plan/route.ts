import { NextRequest, NextResponse } from "next/server";
import { generateCampaignPlan } from "@/lib/services/ppc-campaign-service";

/**
 * GET /api/ppc/campaign-plan
 * Generates a structured Google Ads campaign plan with ad groups, keywords, and ad copy.
 * Query params: budget (monthly, default 2000)
 * Auth: Bearer ADMIN_TOKEN
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.ADMIN_TOKEN && authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const budget = parseInt(searchParams.get("budget") || "2000", 10);

  try {
    const plan = await generateCampaignPlan(budget);

    return NextResponse.json({
      campaign: plan,
      summary: {
        campaignName: plan.campaignName,
        monthlyBudget: `$${plan.monthlyBudget}`,
        dailyBudget: `$${plan.dailyBudget}`,
        adGroupCount: plan.adGroups.length,
        totalKeywords: plan.totalKeywords,
        estimatedMonthlyClicks: plan.estimatedMonthlyClicks,
        estimatedAvgCpc: `$${plan.estimatedAvgCpc}`,
      },
    });
  } catch (error) {
    console.error("Campaign plan error:", error);
    return NextResponse.json(
      { error: "Failed to generate campaign plan" },
      { status: 500 }
    );
  }
}
