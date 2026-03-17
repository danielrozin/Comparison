import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "180px",
          height: "180px",
          borderRadius: "36px",
          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: "72px",
            fontWeight: 800,
            fontFamily: "system-ui",
            letterSpacing: "-2px",
          }}
        >
          VS
        </span>
      </div>
    ),
    { ...size }
  );
}
