import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { getPrisma } from "@/lib/db/prisma";

const reviewSchema = z.object({
  entitySlug: z.string().min(1).max(200),
  productName: z.string().min(1).max(200).transform((s) => s.trim()),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(1).max(2000).transform((s) => s.trim()),
  pros: z.string().max(1000).transform((s) => s.trim()).default(""),
  cons: z.string().max(1000).transform((s) => s.trim()).default(""),
  authorName: z.string().max(100).transform((s) => s.trim()).default("Anonymous"),
  website: z.string().max(500).optional(), // honeypot
});

// In-memory fallback store
const memoryReviews: Map<
  string,
  {
    id: string;
    entitySlug: string;
    productName: string;
    rating: number;
    text: string;
    pros: string;
    cons: string;
    authorName: string;
    flagged: boolean;
    published: boolean;
    createdAt: string;
  }[]
> = new Map();

// Rate limiting
const submitTimestamps: Map<string, number[]> = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function hashIp(ip: string): string {
  return crypto
    .createHash("sha256")
    .update(ip + (process.env.IP_HASH_SALT || "aversusb"))
    .digest("hex")
    .slice(0, 16);
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = submitTimestamps.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  submitTimestamps.set(ip, recent);
  return recent.length >= RATE_LIMIT_MAX;
}

function recordSubmission(ip: string): void {
  const timestamps = submitTimestamps.get(ip) || [];
  timestamps.push(Date.now());
  submitTimestamps.set(ip, timestamps);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { entitySlug, productName, rating, text, pros, cons, authorName, website } = parsed.data;

    // Honeypot check
    if (website) {
      return NextResponse.json({
        success: true,
        review: { id: `r-${Date.now()}`, rating, text, published: true, createdAt: new Date().toISOString() },
      });
    }

    const clientIp = getClientIp(request);
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many reviews. Please try again in a minute." },
        { status: 429 }
      );
    }

    // Moderation: auto-publish if text > 100 chars, flag shorter reviews
    const shouldFlag = text.length < 100;
    const ipHash = hashIp(clientIp);

    const prisma = getPrisma();

    if (prisma) {
      const review = await prisma.review.create({
        data: {
          entitySlug,
          productName,
          rating,
          text,
          pros,
          cons,
          authorName: authorName || "Anonymous",
          flagged: shouldFlag,
          published: true,
          ipHash,
        },
      });

      recordSubmission(clientIp);

      return NextResponse.json({
        success: true,
        review: {
          id: review.id,
          entitySlug: review.entitySlug,
          productName: review.productName,
          rating: review.rating,
          text: review.text,
          pros: review.pros,
          cons: review.cons,
          authorName: review.authorName,
          flagged: review.flagged,
          published: review.published,
          createdAt: review.createdAt.toISOString(),
        },
      });
    }

    // Fallback: in-memory
    const review = {
      id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      entitySlug,
      productName,
      rating,
      text,
      pros,
      cons,
      authorName: authorName || "Anonymous",
      flagged: shouldFlag,
      published: true,
      createdAt: new Date().toISOString(),
    };

    const existing = memoryReviews.get(entitySlug) || [];
    existing.unshift(review);
    memoryReviews.set(entitySlug, existing);

    recordSubmission(clientIp);

    return NextResponse.json({ success: true, review });
  } catch {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const entitySlug = request.nextUrl.searchParams.get("entitySlug");
  if (!entitySlug) {
    return NextResponse.json({ error: "entitySlug required" }, { status: 400 });
  }

  const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  const prisma = getPrisma();

  if (prisma) {
    const [reviews, total, stats] = await Promise.all([
      prisma.review.findMany({
        where: { entitySlug, published: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          entitySlug: true,
          productName: true,
          rating: true,
          text: true,
          pros: true,
          cons: true,
          authorName: true,
          createdAt: true,
        },
      }),
      prisma.review.count({ where: { entitySlug, published: true } }),
      prisma.review.aggregate({
        where: { entitySlug, published: true },
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    return NextResponse.json({
      reviews: reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      averageRating: stats._avg.rating || 0,
      totalReviews: stats._count.rating,
    });
  }

  // Fallback: in-memory
  const all = (memoryReviews.get(entitySlug) || []).filter((r) => r.published);
  const total = all.length;
  const reviews = all.slice(skip, skip + limit);
  const avgRating = total > 0 ? all.reduce((sum, r) => sum + r.rating, 0) / total : 0;

  return NextResponse.json({
    reviews,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    averageRating: avgRating,
    totalReviews: total,
  });
}
