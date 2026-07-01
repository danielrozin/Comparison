import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

/**
 * GET /api/cron/trending-freshness
 *
 * Daily cron that identifies the top-50 comparisons by viewCount whose
 * shortAnswer still references "2025" and regenerates a fresh 2026-current
 * summary using Claude Haiku.
 *
 * Why: shortAnswer appears in meta descriptions, Open Graph snippets, voice
 * assistant citations, and AI Overview answer boxes. Stale "2025" references
 * undermine trust signals and reduce click-through on SERPs (DAN-1619 priority 6).
 *
 * Only rewrites shortAnswer — does not touch attributes, FAQs, or verdict,
 * so it's safe to run daily alongside the full content-refresh cron.
 *
 * Schedule in vercel.json:
 *   { "path": "/api/cron/trending-freshness", "schedule": "0 12 * * *" }
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { getPrisma } = await import("@/lib/db/prisma");
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "No database connection" }, { status: 503 });
  }

  // Top 50 comparisons by view count where shortAnswer still mentions 2025
  const stale = await prisma.comparison.findMany({
    where: {
      status: "published",
      shortAnswer: { contains: "2025" },
    },
    select: { id: true, slug: true, title: true, shortAnswer: true, verdict: true },
    orderBy: { viewCount: "desc" },
    take: 50,
  });

  if (!stale.length) {
    return NextResponse.json({ message: "No stale shortAnswer fields found", updated: 0 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }
  const anthropic = new Anthropic({ apiKey, timeout: 20000, maxRetries: 0 });

  // Process up to 10 per run to stay within budget
  const batch = stale.slice(0, 10);
  const results: { slug: string; updated: boolean; error?: string }[] = [];

  for (const comp of batch) {
    try {
      const msg = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        messages: [
          {
            role: "user",
            content: `Rewrite this comparison summary for "${comp.title}" to be current for 2026. Remove any 2025-specific dates or references and replace with accurate 2026 data where known, or use timeless phrasing.

Current summary:
"${comp.shortAnswer}"

Return ONLY the rewritten summary (2-3 sentences, no quotes, no prefix text). Keep it factual, concise, and decision-focused.`,
          },
        ],
      });

      const newSummary = msg.content[0]?.type === "text"
        ? msg.content[0].text.trim().replace(/^["']|["']$/g, "")
        : "";

      if (!newSummary || newSummary.length < 30) {
        results.push({ slug: comp.slug, updated: false, error: "Empty response" });
        continue;
      }

      await prisma.comparison.update({
        where: { id: comp.id },
        data: {
          shortAnswer: newSummary,
          updatedAt: new Date(),
        },
      });

      results.push({ slug: comp.slug, updated: true });
    } catch (err) {
      results.push({ slug: comp.slug, updated: false, error: String(err) });
    }
  }

  const updatedCount = results.filter((r) => r.updated).length;
  return NextResponse.json({
    staleFound: stale.length,
    processed: batch.length,
    updated: updatedCount,
    results,
  });
}
