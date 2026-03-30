import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("x-admin-token");
  const adminToken = process.env.ADMIN_TOKEN;
  if (adminToken && authHeader !== adminToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }

  try {
    const [totalCount, dailyBreakdown, avgEase, avgTrust, motivationBreakdown, discoveryBreakdown, triggerBreakdown, trustFactorBreakdown, optInCount] = await Promise.all([
      prisma.smartReviewSurvey.count(),
      prisma.$queryRaw`
        SELECT DATE(created_at) as date, COUNT(*)::int as count
        FROM smartreview_surveys
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
      ` as Promise<Array<{ date: string; count: number }>>,
      prisma.smartReviewSurvey.aggregate({ _avg: { q2Ease: true } }),
      prisma.smartReviewSurvey.aggregate({ _avg: { q3Trust: true } }),
      prisma.$queryRaw`
        SELECT q1_motivation as motivation, COUNT(*)::int as count
        FROM smartreview_surveys
        GROUP BY q1_motivation
        ORDER BY count DESC
      ` as Promise<Array<{ motivation: string; count: number }>>,
      prisma.$queryRaw`
        SELECT q4_discovery as discovery, COUNT(*)::int as count
        FROM smartreview_surveys
        GROUP BY q4_discovery
        ORDER BY count DESC
      ` as Promise<Array<{ discovery: string; count: number }>>,
      prisma.$queryRaw`
        SELECT trigger_type as trigger, COUNT(*)::int as count
        FROM smartreview_surveys
        GROUP BY trigger_type
        ORDER BY count DESC
      ` as Promise<Array<{ trigger: string; count: number }>>,
      prisma.$queryRaw`
        SELECT unnest(q3_trust_factors) as factor, COUNT(*)::int as count
        FROM smartreview_surveys
        GROUP BY factor
        ORDER BY count DESC
      ` as Promise<Array<{ factor: string; count: number }>>,
      prisma.smartReviewSurvey.count({ where: { optInEmail: { not: null } } }),
    ]);

    return NextResponse.json({
      totalCount,
      avgEase: avgEase._avg.q2Ease || 0,
      avgTrust: avgTrust._avg.q3Trust || 0,
      optInCount,
      dailyBreakdown,
      motivationBreakdown,
      discoveryBreakdown,
      triggerBreakdown,
      trustFactorBreakdown,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
