import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/db/prisma";

const BestFAQSchema = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});

const BestListItemSchema = z.object({
  position: z.number().int().positive(),
  name: z.string().min(1),
  anchor: z.string().min(1),
});

const BestPageSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  title: z.string().min(1).max(300),
  description: z.string().min(1).max(500),
  h1: z.string().min(1).max(300),
  authorName: z.string().default("AversusB Editorial"),
  authorUrl: z.string().optional(),
  category: z.string().optional(),
  bodyMarkdown: z.string().min(100),
  listItems: z.array(BestListItemSchema).min(1).max(20),
  faqs: z.array(BestFAQSchema).min(1).max(20),
  publishedAt: z.string().datetime().optional(),
});

const BatchPublishSchema = z.object({
  pages: z.array(BestPageSchema).min(1).max(50),
  apiKey: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key") ?? request.headers.get("authorization")?.replace("Bearer ", "");
  if (apiKey !== process.env.ADMIN_API_KEY && apiKey !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BatchPublishSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  const { pages } = parsed.data;
  const results: { slug: string; status: "created" | "updated" | "error"; error?: string }[] = [];

  for (const page of pages) {
    try {
      const now = new Date();
      await prisma.bestPage.upsert({
        where: { slug: page.slug },
        create: {
          slug: page.slug,
          title: page.title,
          description: page.description,
          h1: page.h1,
          authorName: page.authorName,
          authorUrl: page.authorUrl,
          category: page.category,
          bodyMarkdown: page.bodyMarkdown,
          listItems: page.listItems,
          faqs: page.faqs,
          status: "published",
          publishedAt: page.publishedAt ? new Date(page.publishedAt) : now,
        },
        update: {
          title: page.title,
          description: page.description,
          h1: page.h1,
          authorName: page.authorName,
          authorUrl: page.authorUrl,
          category: page.category,
          bodyMarkdown: page.bodyMarkdown,
          listItems: page.listItems,
          faqs: page.faqs,
          status: "published",
        },
      });

      const existing = await prisma.bestPage.findUnique({ where: { slug: page.slug }, select: { createdAt: true } });
      results.push({ slug: page.slug, status: existing && existing.createdAt < now ? "updated" : "created" });
    } catch (err) {
      results.push({ slug: page.slug, status: "error", error: err instanceof Error ? err.message : "Unknown error" });
    }
  }

  const created = results.filter((r) => r.status === "created").length;
  const updated = results.filter((r) => r.status === "updated").length;
  const errors = results.filter((r) => r.status === "error").length;

  return NextResponse.json({
    success: errors === 0,
    summary: { created, updated, errors, total: pages.length },
    results,
  });
}
