import { NextRequest, NextResponse } from "next/server";
import { sendOutreachEmail } from "@/lib/services/email";

const RECIPIENTS = [
  "Daniarozin@gmail.com",
  "Shai.and1@gmail.com",
];

export async function POST(req: NextRequest) {
  // Protect with CRON_SECRET or ADMIN_TOKEN
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const adminToken = process.env.ADMIN_TOKEN;

  const token = authHeader?.replace("Bearer ", "");
  if (!token || (token !== cronSecret && token !== adminToken)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { subject?: string; html?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const subject = body.subject || `Weekly Status Report — ${new Date().toISOString().slice(0, 10)}`;
  const html = body.html;

  if (!html) {
    return NextResponse.json({ error: "Missing 'html' field in body" }, { status: 400 });
  }

  const results = await Promise.all(
    RECIPIENTS.map(async (to) => {
      const result = await sendOutreachEmail({ to, subject, html });
      return { to, ...result };
    })
  );

  const allSuccess = results.every((r) => r.success);
  return NextResponse.json({ success: allSuccess, results }, { status: allSuccess ? 200 : 500 });
}
