import { ImageResponse } from "next/og";

/* Share image for links on WhatsApp, Facebook, LinkedIn, X and Google Discover. */
export const alt = "Luna Digital · Booking websites for holiday rentals and small businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #f6f5f1 0%, #ecebff 100%)",
          color: "#16142b",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40, fontFamily: "sans-serif", fontWeight: 700 }}>
          <svg width="56" height="56" viewBox="0 0 32 32">
            <path d="M20 4a12 12 0 1 0 8 20A10 10 0 0 1 20 4z" fill="#4f46e5" />
          </svg>
          Luna Digital
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 84, lineHeight: 1.05, letterSpacing: -2 }}>
            Websites that bring you more bookings
          </div>
          <div style={{ fontSize: 30, color: "#55536b", fontFamily: "sans-serif" }}>
            Online booking · Airbnb &amp; Booking.com calendar sync · from €200
          </div>
        </div>
        <div style={{ fontSize: 28, color: "#4f46e5", fontFamily: "sans-serif", fontWeight: 600 }}>lunadigital.pro</div>
      </div>
    ),
    size,
  );
}
