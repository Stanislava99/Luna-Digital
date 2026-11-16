import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ToastProvider } from "@/components/Toast";
import "./styles.css";

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M20 4a12 12 0 1 0 8 20A10 10 0 0 1 20 4z' fill='%234f46e5'/%3E%3C/svg%3E";

export const metadata: Metadata = {
  metadataBase: new URL("https://lunadigital.pro"),
  title: "Luna Digital · Booking Websites for Rentals & Small Businesses",
  description:
    "Luna Digital builds booking websites for holiday rentals, guesthouses and small businesses: online booking, calendars synced with Airbnb and Booking.com, clear prices from €200.",
  alternates: { canonical: "/" },
  icons: { icon: FAVICON },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Luna Digital",
    title: "Luna Digital · Websites that bring you more bookings",
    description: "Booking websites for holiday rentals, guesthouses and small businesses. Clear prices from €200.",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f6f5f1",
  // Use the whole screen on phones with notches / rounded corners; layouts pad with safe-area insets
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@500;600;700&family=Nunito:wght@500;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ToastProvider>{children}</ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
