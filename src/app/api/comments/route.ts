import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { getPrisma } from "@/lib/db/prisma";

const commentSchema = z.object({
  comparisonId: z.string().min(1).max(200),
  name: z.string().max(100).transform((s) => s.trim()).default("Anonymous"),
  text: z.string().min(1).max(2000).transform((s) => s.trim()),
  // Honeypot field — must be empty if real user
  website: z.string().max(500).optional(),
});

// In-memory fallback store
const memoryComments: Map<string, {
  id: string;
  comparisonId: string;
  name: string;
  text: string;
  likes: number;
  hasLinks: boolean;
  flagged: boolean;
  published: boolean;
  createdAt: string;
}[]> = new Map();

// In-memory rate limiting (per IP, supplement to middleware)
const submitTimestamps: Map<string, number[]> = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3; // max 3 comments per minute per IP

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip + (process.env.IP_HASH_SALT || "aversusb")).digest("hex").slice(0, 16);
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

const URL_REGEX = /https?:\/\/|www\.|\.com\/|\.net\/|\.org\//i;

function containsLinks(text: string): boolean {
  return URL_REGEX.test(text);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { comparisonId, name, text, website } = parsed.data;

    // Honeypot check — bots fill hidden fields
    if (website) {
      // Silently accept but don't store (don't reveal the trap)
      return NextResponse.json({
        success: true,
        comment: {
          id: `c-${Date.now()}`,
          name,
          text,
          likes: 0,
          hasLinks: false,
          flagged: false,
          createdAt: new Date().toISOString(),
        },
      });
    }

    // Rate limiting per IP
    const clientIp = getClientIp(request);
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many comments. Please try again in a minute." },
        { status: 429 }
      );
    }

    const hasLinks = containsLinks(text);
    const ipHash = hashIp(clientIp);

    const prisma = getPrisma();

    if (prisma) {
      const comment = await prisma.comment.create({
        data: {
          comparisonId,
          name: name || "Anonymous",
          text,
          hasLinks,
          flagged: hasLinks, // auto-flag comments with links for moderation
          published: true,   // auto-publish, but flagged ones can be reviewed
          ipHash,
        },
      });

      recordSubmission(clientIp);

      return NextResponse.json({
        success: true,
        comment: {
          id: comment.id,
          name: comment.name,
          text: comment.text,
          likes: comment.likes,
          hasLinks: comment.hasLinks,
          flagged: comment.flagged,
          createdAt: comment.createdAt.toISOString(),
        },
      });
    }

    // Fallback: in-memory store
    const comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      comparisonId,
      name: name || "Anonymous",
      text,
      likes: 0,
      hasLinks,
      flagged: hasLinks,
      published: true,
      createdAt: new Date().toISOString(),
    };

    const existing = memoryComments.get(comparisonId) || [];
    existing.unshift(comment);
    memoryComments.set(comparisonId, existing);

    recordSubmission(clientIp);

    return NextResponse.json({
      success: true,
      comment: {
        id: comment.id,
        name: comment.name,
        text: comment.text,
        likes: comment.likes,
        hasLinks: comment.hasLinks,
        flagged: comment.flagged,
        createdAt: comment.createdAt,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const comparisonId = request.nextUrl.searchParams.get("comparisonId");
  if (!comparisonId) {
    return NextResponse.json({ error: "comparisonId required" }, { status: 400 });
  }

  const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  const prisma = getPrisma();

  if (prisma) {
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { comparisonId, published: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          text: true,
          likes: true,
          hasLinks: true,
          createdAt: true,
        },
      }),
      prisma.comment.count({
        where: { comparisonId, published: true },
      }),
    ]);

    return NextResponse.json({
      comments: comments.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  }

  // Fallback: in-memory
  const all = (memoryComments.get(comparisonId) || []).filter((c) => c.published);
  const total = all.length;
  const comments = all.slice(skip, skip + limit);

  return NextResponse.json({
    comments: comments.map((c) => ({
      id: c.id,
      name: c.name,
      text: c.text,
      likes: c.likes,
      hasLinks: c.hasLinks,
      createdAt: c.createdAt,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
