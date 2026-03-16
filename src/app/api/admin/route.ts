import { NextRequest, NextResponse } from "next/server";
import { getAdminEvents, getAdminStats } from "@/lib/services/admin-logger";

const ADMIN_EMAIL = "Daniarozin@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "aversusb2026!";

// POST: login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = btoa(`${ADMIN_EMAIL}:${Date.now()}`);
      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

// GET: dashboard data
export async function GET(request: NextRequest) {
  const auth = request.headers.get("x-admin-token");
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = atob(auth);
    if (!decoded.startsWith(ADMIN_EMAIL)) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  return NextResponse.json({
    stats: getAdminStats(),
    recentEvents: getAdminEvents().slice(0, 50),
  });
}
