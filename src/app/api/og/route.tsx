import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "Compare Anything";
  const entityA = searchParams.get("a") || "";
  const entityB = searchParams.get("b") || "";
  const category = searchParams.get("cat") || "";
  const type = searchParams.get("type") || "comparison"; // comparison, category, home

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 40%, #7c3aed 100%)",
          padding: "60px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "18px",
              fontWeight: 800,
            }}
          >
            VS
          </div>
          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "20px", fontWeight: 600 }}>
            aversusb.net
          </span>
          {category && (
            <span
              style={{
                color: "white",
                fontSize: "14px",
                fontWeight: 600,
                background: "rgba(255,255,255,0.15)",
                padding: "4px 12px",
                borderRadius: "20px",
                marginLeft: "auto",
                textTransform: "capitalize",
              }}
            >
              {category}
            </span>
          )}
        </div>

        {type === "comparison" && entityA && entityB ? (
          /* VS Layout */
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "40px",
            }}
          >
            {/* Entity A */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "60px",
                  background: "rgba(255,255,255,0.15)",
                  border: "3px solid rgba(255,255,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "48px",
                  fontWeight: 800,
                  color: "white",
                  marginBottom: "16px",
                }}
              >
                {entityA.charAt(0).toUpperCase()}
              </div>
              <span
                style={{
                  color: "white",
                  fontSize: "28px",
                  fontWeight: 700,
                  textAlign: "center",
                  maxWidth: "300px",
                  lineHeight: 1.2,
                }}
              >
                {entityA}
              </span>
            </div>

            {/* VS Badge */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "40px",
                background: "rgba(0,0,0,0.3)",
                border: "3px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: 900,
                color: "white",
                flexShrink: 0,
              }}
            >
              VS
            </div>

            {/* Entity B */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "60px",
                  background: "rgba(255,255,255,0.1)",
                  border: "3px solid rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "48px",
                  fontWeight: 800,
                  color: "rgba(255,255,255,0.9)",
                  marginBottom: "16px",
                }}
              >
                {entityB.charAt(0).toUpperCase()}
              </div>
              <span
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "28px",
                  fontWeight: 700,
                  textAlign: "center",
                  maxWidth: "300px",
                  lineHeight: 1.2,
                }}
              >
                {entityB}
              </span>
            </div>
          </div>
        ) : (
          /* Generic layout */
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "white",
                fontSize: "52px",
                fontWeight: 800,
                lineHeight: 1.15,
                maxWidth: "900px",
              }}
            >
              {title}
            </span>
          </div>
        )}

        {/* Bottom tagline */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "30px" }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px" }}>
            The fastest way to compare anything
          </span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
            2026
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
