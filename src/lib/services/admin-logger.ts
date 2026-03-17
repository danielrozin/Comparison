/**
 * Admin Event Logger
 * Uses Upstash Redis for persistent storage across serverless invocations.
 * Falls back to in-memory storage if Redis is not configured.
 */

import { getRedis } from "./redis";

export interface AdminEvent {
  id: string;
  type: "search" | "generation" | "feedback" | "contact" | "page_view";
  data: Record<string, unknown>;
  timestamp: string;
}

const EVENTS_KEY = "admin:events";
const MAX_EVENTS = 500;

// In-memory fallback (only used if Redis is not configured)
const memoryLog: AdminEvent[] = [];

export async function logAdminEvent(type: AdminEvent["type"], data: Record<string, unknown>) {
  const event: AdminEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    data,
    timestamp: new Date().toISOString(),
  };

  const redis = getRedis();
  if (redis) {
    try {
      // Push to the front of the list
      await redis.lpush(EVENTS_KEY, JSON.stringify(event));
      // Trim to max size
      await redis.ltrim(EVENTS_KEY, 0, MAX_EVENTS - 1);
      return;
    } catch (err) {
      console.error("Redis logAdminEvent error:", err);
    }
  }

  // Fallback: in-memory
  memoryLog.unshift(event);
  if (memoryLog.length > MAX_EVENTS) memoryLog.pop();
}

export async function getAdminEvents(): Promise<AdminEvent[]> {
  const redis = getRedis();
  if (redis) {
    try {
      const raw = await redis.lrange(EVENTS_KEY, 0, 49);
      return raw.map((item) => {
        if (typeof item === "string") return JSON.parse(item);
        return item as AdminEvent;
      });
    } catch (err) {
      console.error("Redis getAdminEvents error:", err);
    }
  }
  return memoryLog;
}

export async function getAdminStats() {
  const redis = getRedis();
  let events: AdminEvent[] = [];

  if (redis) {
    try {
      const raw = await redis.lrange(EVENTS_KEY, 0, MAX_EVENTS - 1);
      events = raw.map((item) => {
        if (typeof item === "string") return JSON.parse(item);
        return item as AdminEvent;
      });
    } catch (err) {
      console.error("Redis getAdminStats error:", err);
      events = memoryLog;
    }
  } else {
    events = memoryLog;
  }

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const todayEvents = events.filter((e) => e.timestamp.startsWith(today));

  return {
    totalEvents: events.length,
    todayEvents: todayEvents.length,
    searches: events.filter((e) => e.type === "search").length,
    generations: events.filter((e) => e.type === "generation").length,
    feedbacks: events.filter((e) => e.type === "feedback").length,
    contacts: events.filter((e) => e.type === "contact").length,
    todaySearches: todayEvents.filter((e) => e.type === "search").length,
    todayGenerations: todayEvents.filter((e) => e.type === "generation").length,
  };
}
