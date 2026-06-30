import { NextResponse } from "next/server";

// /.well-known/gpc.json — Global Privacy Control (GPC) signal declaration.
//
// GPC (https://globalprivacycontrol.org/) is a W3C standard that lets browsers
// signal "do not sell or share my personal data" to websites. Declaring support
// here tells GPC-aware browsers/tools that aversusb.net honors the signal.
//
// Referenced by: privacy-aware AI crawlers, CCPA/GDPR compliance scanners,
// browser extensions (Brave, DuckDuckGo Privacy Essentials), and Google's
// consent management crawl checks.

export async function GET() {
  return NextResponse.json(
    { gpc: true, lastUpdate: "2026-06-30" },
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
