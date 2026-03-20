import { NextRequest, NextResponse } from "next/server";
import { listBlogArticles } from "@/lib/services/blog-generator";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "12", 10));
  const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));
  const status = searchParams.get("status") || "published";

  const result = await listBlogArticles({ category, limit, offset, status });

  return NextResponse.json(result);
}
