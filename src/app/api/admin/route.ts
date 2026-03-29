import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { getAdminEvents, getAdminStats } from "@/lib/services/admin-logger";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "Daniarozin@gmail.com";

function getAdminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new Error("ADMIN_PASSWORD environment variable is required");
  return pw;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is required");
  return secret;
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST: login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { email, password } = parsed.data;

    if (email === ADMIN_EMAIL && password === getAdminPassword()) {
      const token = jwt.sign({ email, role: "admin" }, getJwtSecret(), {
        expiresIn: "24h",
      });
      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("environment variable")) {
      console.error("Admin config error:", error.message);
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }
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
    const decoded = jwt.verify(auth, getJwtSecret()) as { email: string; role: string };
    if (decoded.email !== ADMIN_EMAIL || decoded.role !== "admin") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const [stats, recentEvents] = await Promise.all([
    getAdminStats(),
    getAdminEvents(),
  ]);

  return NextResponse.json({
    stats,
    recentEvents: recentEvents.slice(0, 50),
  });
}
