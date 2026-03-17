import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "7px",
          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: "14px",
            fontWeight: 800,
            fontFamily: "system-ui",
            letterSpacing: "-0.5px",
          }}
        >
          VS
        </span>
      </div>
    ),
    { ...size }
  );
}
