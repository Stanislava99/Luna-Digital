import { ImageResponse } from "next/og";

/* Home-screen icon for iPhone, also a PNG fallback for crawlers that skip SVG favicons. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f6f5f1" }}>
        <svg width="120" height="120" viewBox="0 0 32 32">
          <path d="M20 4a12 12 0 1 0 8 20A10 10 0 0 1 20 4z" fill="#4f46e5" />
        </svg>
      </div>
    ),
    size,
  );
}
