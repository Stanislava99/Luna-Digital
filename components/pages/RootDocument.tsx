import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ToastProvider } from "@/components/Toast";
import { DM_Serif_Display, Inter, Inter_Tight, Instrument_Serif } from "next/font/google";
import "@/app/styles.css";

import { I18nProvider } from "@/components/I18n";
import { getDict } from "@/lib/dictionaries";
import { LOCALES, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

/* Fonts are downloaded at build time and served from our own domain (used through these CSS variables).
   "subsets" only says which files to preload; Greek and Serbian letters load when a page needs them. */
const inter = Inter({ subsets: ["latin"], variable: "--f-inter" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--f-inter-tight" });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--f-instrument" });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--f-dm-serif", preload: false });

/*
 * Favicon, share image and apple icon come from app/icon.svg, app/opengraph-image.tsx and
 * app/apple-icon.tsx. Google Search Console: set GOOGLE_SITE_VERIFICATION in Vercel to the
 * code from the "HTML tag" method (only the content="..." value), then redeploy.
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Luna Digital",
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  twitter: { card: "summary_large_image" },
};

export const baseViewport: Viewport = {
  themeColor: "#f6f5f1",
  // Use the whole screen on phones with notches / rounded corners; layouts pad with safe-area insets
  viewportFit: "cover",
};

/** <html> for every page. Each language has its own root layout so the lang attribute is right. */
export function RootDocument({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={LOCALES[locale].html} className={[inter, interTight, instrumentSerif, dmSerif].map((f) => f.variable).join(" ")}>
      <body>
        <I18nProvider locale={locale} dict={getDict(locale)}>
          <ToastProvider>{children}</ToastProvider>
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
