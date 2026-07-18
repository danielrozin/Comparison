import { NextResponse } from "next/server";

// DAN-1980 — RETIRED. The paid usability-study recruitment was removed by the
// founder: the banner, form, and this sign-up handler no longer collect
// participants, because we are not currently running the study and cannot honour
// the "$25 gift card" promise. The endpoint now rejects all sign-ups with 410
// Gone so any cached client or stray link cannot enrol new people or trigger a
// notification email. Existing sign-ups remain retrievable at
// /api/ux-study/signups for triage/deletion.

export async function POST() {
  return NextResponse.json(
    { error: "The usability study is closed and no longer accepting sign-ups." },
    { status: 410 },
  );
}

export async function GET() {
  return NextResponse.json({ status: "closed" }, { status: 410 });
}
