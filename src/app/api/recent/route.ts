import { NextRequest, NextResponse } from "next/server";
import { classifyComparison } from "@/lib/services/categorizer";
import { logAdminEvent } from "@/lib/services/admin-logger";
import { getRedis } from "@/lib/services/redis";

export interface RecentSearch {
  slug: string;
  title: string;
  entityA: string;
  entityB: string;
  category: string;
  subcategory: string;
  tags: string[];
  searchedAt: string;
  generated: boolean;
}

const RECENT_KEY = "recent:searches";
const MAX_RECENT = 100;

// In-memory fallback
const memorySearches: RecentSearch[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, entityA, entityB, generated } = body;

    if (!slug || !entityA || !entityB) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const classification = classifyComparison(entityA, entityB);

    const entry: RecentSearch = {
      slug,
      title: title || `${entityA} vs ${entityB}`,
      entityA,
      entityB,
      category: classification.category,
      subcategory: classification.subcategory,
      tags: classification.tags,
      searchedAt: new Date().toISOString(),
      generated: generated || false,
    };

    const redis = getRedis();
    if (redis) {
      try {
        // Remove existing entry with same slug, then push to front
        const all = await redis.lrange(RECENT_KEY, 0, MAX_RECENT - 1);
        const filtered = all.filter((item) => {
          const parsed = typeof item === "string" ? JSON.parse(item) : item;
          return parsed.slug !== slug;
        });
        // Rebuild list: new entry first, then existing (without duplicate)
        await redis.del(RECENT_KEY);
        const items = [JSON.stringify(entry), ...filtered.map((i) => typeof i === "string" ? i : JSON.stringify(i))].slice(0, MAX_RECENT);
        if (items.length > 0) {
          await redis.lpush(RECENT_KEY, ...items.reverse());
        }
      } catch (err) {
        console.error("Redis recent search error:", err);
      }
    } else {
      // Fallback: in-memory
      const existingIdx = memorySearches.findIndex((s) => s.slug === slug);
      if (existingIdx !== -1) memorySearches.splice(existingIdx, 1);
      memorySearches.unshift(entry);
      if (memorySearches.length > MAX_RECENT) memorySearches.pop();
    }

    // Log to admin panel
    await logAdminEvent(generated ? "generation" : "search", {
      slug,
      title: entry.title,
      category: classification.category,
      subcategory: classification.subcategory,
      tags: classification.tags,
    });

    return NextResponse.json({ success: true, classification });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET() {
  const redis = getRedis();
  if (redis) {
    try {
      const raw = await redis.lrange(RECENT_KEY, 0, 19);
      const searches = raw.map((item) => {
        if (typeof item === "string") return JSON.parse(item);
        return item as RecentSearch;
      });
      return NextResponse.json({ count: searches.length, searches });
    } catch (err) {
      console.error("Redis recent GET error:", err);
    }
  }
  return NextResponse.json({
    count: memorySearches.length,
    searches: memorySearches.slice(0, 20),
  });
}
