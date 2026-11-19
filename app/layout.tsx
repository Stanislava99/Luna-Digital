import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ToastProvider } from "@/components/Toast";
import "./styles.css";

import { SITE_URL } from "@/lib/site";

/*
 * Favicon, share image and apple icon come from app/icon.svg, app/opengraph-image.tsx and
 * app/apple-icon.tsx. Google Search Console: set GOOGLE_SITE_VERIFICATION in Vercel to the
 * code from the "HTML tag" method (only the content="..." value), then redeploy.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Luna Digital · Booking Websites for Rentals & Small Businesses",
    template: "%s · Luna Digital",
  },
  description:
    "Luna Digital builds booking websites for holiday rentals, guesthouses and small businesses: online booking, calendars synced with Airbnb and Booking.com, clear prices from €200.",
  applicationName: "Luna Digital",
  keywords: [
    "booking website",
    "holiday rental website",
    "vacation rental website",
    "guesthouse website",
    "direct booking website",
    "Airbnb calendar sync",
    "Booking.com calendar sync",
    "website for small business",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Luna Digital",
    locale: "en_GB",
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
