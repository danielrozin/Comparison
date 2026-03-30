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
    const [totalCount, dailyBreakdown, categoryBreakdown, avgRating, intentBreakdown, discoveryBreakdown, optInCount] = await Promise.all([
      prisma.interceptSurvey.count(),
      prisma.$queryRaw`
        SELECT DATE(created_at) as date, COUNT(*)::int as count
        FROM intercept_surveys
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
      ` as Promise<Array<{ date: string; count: number }>>,
      prisma.$queryRaw`
        SELECT COALESCE(category, 'uncategorized') as category, COUNT(*)::int as count
        FROM intercept_surveys
        GROUP BY category
        ORDER BY count DESC
      ` as Promise<Array<{ category: string; count: number }>>,
      prisma.interceptSurvey.aggregate({ _avg: { q3Rating: true } }),
      prisma.$queryRaw`
        SELECT q1_intent as intent, COUNT(*)::int as count
        FROM intercept_surveys
        GROUP BY q1_intent
        ORDER BY count DESC
      ` as Promise<Array<{ intent: string; count: number }>>,
      prisma.$queryRaw`
        SELECT q5_discovery as discovery, COUNT(*)::int as count
        FROM intercept_surveys
        GROUP BY q5_discovery
        ORDER BY count DESC
      ` as Promise<Array<{ discovery: string; count: number }>>,
      prisma.interceptSurvey.count({ where: { optInEmail: { not: null } } }),
    ]);

    return NextResponse.json({
      totalCount,
      avgRating: avgRating._avg.q3Rating || 0,
      optInCount,
      dailyBreakdown,
      categoryBreakdown,
      intentBreakdown,
      discoveryBreakdown,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
