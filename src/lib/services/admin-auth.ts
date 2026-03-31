import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "Daniarozin@gmail.com";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is required");
  return secret;
}

export function verifyAdmin(
  request: NextRequest,
): { authorized: true } | { authorized: false; response: NextResponse } {
  const auth = request.headers.get("x-admin-token");
  if (!auth) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  try {
    const decoded = jwt.verify(auth, getJwtSecret()) as {
      email: string;
      role: string;
    };
    if (decoded.email !== ADMIN_EMAIL || decoded.role !== "admin") {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: "Invalid token" },
          { status: 401 },
        ),
      };
    }
  } catch {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }

  return { authorized: true };
}
