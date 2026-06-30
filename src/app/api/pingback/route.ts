import { NextRequest, NextResponse } from "next/server";

// XML-RPC Pingback endpoint — https://www.hixie.ch/specs/pingback/pingback
//
// WordPress, Ghost, and other CMS platforms send pingbacks when they link to
// aversusb.net. Receiving the pingback lets us discover inbound links before
// Googlebot crawls the source page — accelerating backlink velocity signals.
//
// This endpoint accepts the pingback ping and acknowledges it per spec (200).
// Content-Type must be text/xml for XML-RPC compliance.

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // Extract source/target from XML-RPC ping
    const sourceMatch = body.match(/<value><string>([^<]+)<\/string><\/value>/g);
    const source = sourceMatch?.[0]?.replace(/<[^>]+>/g, "") ?? "unknown";
    const target = sourceMatch?.[1]?.replace(/<[^>]+>/g, "") ?? "unknown";

    // Validate target is on our domain
    if (target && !target.includes("aversusb.net")) {
      const errorXml = `<?xml version="1.0"?><methodResponse><fault><value><struct>
        <member><name>faultCode</name><value><int>33</int></value></member>
        <member><name>faultString</name><value><string>The specified target URL cannot be used as a target.</string></value></member>
      </struct></value></fault></methodResponse>`;
      return new NextResponse(errorXml, {
        status: 200,
        headers: { "Content-Type": "text/xml; charset=utf-8" },
      });
    }

    // Log for analytics (fire-and-forget)
    console.log(`[pingback] source=${source} target=${target}`);

    const successXml = `<?xml version="1.0"?><methodResponse><params><param>
      <value><string>Pingback registered.</string></value>
    </param></params></methodResponse>`;

    return new NextResponse(successXml, {
      status: 200,
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "X-Pingback": `https://www.aversusb.net/api/pingback`,
      },
    });
  } catch {
    return new NextResponse("Bad Request", { status: 400 });
  }
}
