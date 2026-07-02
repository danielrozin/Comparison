import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

/**
 * GET /api/cron/faq-backfill
 *
 * Daily cron that identifies published comparisons with fewer than 3 FAQs and
 * generates additional Q&A pairs using Claude Haiku. Targeting 15 comparisons
 * per run at ~2-3 FAQs each keeps the total within the 60s Vercel budget.
 *
 * Why: FAQPage schema is a primary citation source for Google AI Overviews and
 * voice assistants. Pages with <3 FAQs miss the "People Also Ask" coverage
 * that drives featured-snippet placements (DAN-1619 priority 7).
 *
 * Schedule in vercel.json:
 *   { "path": "/api/cron/faq-backfill", "schedule": "0 11 * * *" }
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

  // Find top-viewed published comparisons where faqCount < 3
  const candidates = await prisma.$queryRaw<
    { id: string; slug: string; title: string; faq_count: bigint }[]
  >`
    SELECT c.id, c.slug, c.title, COUNT(f.id) AS faq_count
    FROM comparisons c
    LEFT JOIN faqs f ON f.comparison_id = c.id
    WHERE c.status = 'published'
    GROUP BY c.id, c.slug, c.title
    HAVING COUNT(f.id) < 3
    ORDER BY c.view_count DESC
    LIMIT 15
  `;

  if (!candidates.length) {
    return NextResponse.json({ message: "No comparisons need FAQ backfill", processed: 0 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }
  const anthropic = new Anthropic({ apiKey, timeout: 30000, maxRetries: 0 });

  const results: { slug: string; added: number; error?: string }[] = [];

  for (const candidate of candidates) {
    const currentFaqCount = Number(candidate.faq_count);
    const needed = 3 - currentFaqCount; // generate enough to reach 3

    // Fetch existing FAQs to avoid duplicates
    const existing = await prisma.fAQ.findMany({
      where: { comparisonId: candidate.id },
      select: { question: true },
    });
    const existingQs = existing.map((f) => f.question).join("\n- ");

    try {
      const msg = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        messages: [
          {
            role: "user",
            content: `Generate exactly ${needed} additional FAQ entries for the comparison page: "${candidate.title}".
${existingQs ? `\nExisting questions (DO NOT repeat):\n- ${existingQs}` : ""}

Return ONLY a JSON array with this exact structure (no markdown, no code blocks):
[
  {"question": "Question text?", "answer": "Answer text (2-3 sentences, factual, current for 2026)."},
  ...
]

Rules:
- Questions must be what users actually search for ("Which is better for...", "Can I...", "Is X worth...")
- Answers must be specific, factual, and mention both entities
- Do not include questions already listed above
- Focus on decision-making and practical use cases`,
          },
        ],
      });

      const raw = msg.content[0]?.type === "text" ? msg.content[0].text.trim() : "";
      let faqs: { question: string; answer: string }[] = [];
      try {
        // Strip any accidental markdown fences
        const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
        faqs = JSON.parse(cleaned);
      } catch {
        results.push({ slug: candidate.slug, added: 0, error: "JSON parse failed" });
        continue;
      }

      if (!Array.isArray(faqs) || faqs.length === 0) {
        results.push({ slug: candidate.slug, added: 0, error: "Empty FAQ array" });
        continue;
      }

      // Insert only well-formed FAQs
      let added = 0;
      for (const faq of faqs.slice(0, needed)) {
        if (!faq.question || !faq.answer) continue;
        await prisma.fAQ.create({
          data: {
            question: faq.question,
            answer: faq.answer,
            comparisonId: candidate.id,
          },
        });
        added++;
      }
      results.push({ slug: candidate.slug, added });
    } catch (err) {
      results.push({ slug: candidate.slug, added: 0, error: String(err) });
    }
  }

  const totalAdded = results.reduce((s, r) => s + r.added, 0);
  return NextResponse.json({ processed: results.length, totalAdded, results });
}
