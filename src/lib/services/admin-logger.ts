/**
 * Admin Event Logger
 * Stores events in memory for the admin dashboard
 */

export interface AdminEvent {
  id: string;
  type: "search" | "generation" | "feedback" | "contact" | "page_view";
  data: Record<string, unknown>;
  timestamp: string;
}

const eventLog: AdminEvent[] = [];
const MAX_EVENTS = 500;

export function logAdminEvent(type: AdminEvent["type"], data: Record<string, unknown>) {
  eventLog.unshift({
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    data,
    timestamp: new Date().toISOString(),
  });
  if (eventLog.length > MAX_EVENTS) eventLog.pop();
}

export function getAdminEvents(): AdminEvent[] {
  return eventLog;
}

export function getAdminStats() {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const todayEvents = eventLog.filter((e) => e.timestamp.startsWith(today));

  return {
    totalEvents: eventLog.length,
    todayEvents: todayEvents.length,
    searches: eventLog.filter((e) => e.type === "search").length,
    generations: eventLog.filter((e) => e.type === "generation").length,
    feedbacks: eventLog.filter((e) => e.type === "feedback").length,
    contacts: eventLog.filter((e) => e.type === "contact").length,
    todaySearches: todayEvents.filter((e) => e.type === "search").length,
    todayGenerations: todayEvents.filter((e) => e.type === "generation").length,
  };
}
