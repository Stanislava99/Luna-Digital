import { ContactProvider } from "@/components/home/ContactContext";
import { ContactSection } from "@/components/home/ContactSection";
import { Nav } from "@/components/home/Nav";
import { Faq, Footer, Founding, Hero, Included, PlannerPromo, Story, Why } from "@/components/home/sections";
import { Work } from "@/components/home/Work";
import { getI18n } from "@/lib/dictionaries";
import { LOCALES, localePath, pageMetadata, type Locale, type TFn } from "@/lib/i18n";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

/* Structured data (schema.org) so Google knows who we are and what we sell. Prices match Work.tsx. */
const offer = (name: string, price: number, description: string) => ({
  "@type": "Offer",
  priceCurrency: "EUR",
  priceSpecification: { "@type": "PriceSpecification", minPrice: price, priceCurrency: "EUR" },
  itemOffered: { "@type": "Service", name, description },
});

export const homeMetadata = (locale: Locale) => {
  const { t } = getI18n(locale);
  return pageMetadata(locale, "/", t("Booking Websites for Holiday Rentals | Luna Digital"),
    t("Get your own booking website for your villa, apartment or guesthouse. Calendars sync with Airbnb and Booking.com. Plan yours in 2 minutes."));
};

const jsonLd = (locale: Locale, t: TFn) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}${localePath(locale)}`,
      name: "Luna Digital",
      publisher: { "@id": `${SITE_URL}/#org` },
      inLanguage: LOCALES[locale].html,
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#org`,
      name: "Luna Digital",
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/apple-icon`,
      image: `${SITE_URL}/opengraph-image`,
      email: CONTACT_EMAIL,
      description:
        t("Booking websites for holiday rentals, guesthouses and small businesses: online booking, calendars synced with Airbnb and Booking.com, and a fixed price agreed before we start."),
      priceRange: "€200+",
      areaServed: "Europe",
      makesOffer: [
        offer(t("Landing page"), 200, t("One page, one goal: sign-ups, bookings or calls.")),
        offer(t("Business website"), 400, t("Home, about, prices and contact pages for your business.")),
        offer(t("Web app"), 600, t("Dashboards, booking systems and client portals.")),
        offer(t("Online store"), 900, t("Sell products online with a cart and card payments.")),
        offer(t("Mobile app"), 2500, t("An app for iPhone and Android.")),
        offer(t("Custom software"), 3000, t("Stock, orders and staff tools that replace spreadsheets.")),
      ],
    },
  ],
});

export function HomePage({ locale }: { locale: Locale }) {
  const { t } = getI18n(locale);
  return (
    <ContactProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(locale, t)) }} />
      <Nav />
      <main id="top">
        <Hero locale={locale} />
        <Included locale={locale} />
        <PlannerPromo locale={locale} />
        <Story locale={locale} />
        <Work />
        <Why locale={locale} />
        <Founding locale={locale} />
        <Faq locale={locale} />
        <ContactSection />
      </main>
      <Footer locale={locale} />
    </ContactProvider>
  );
}
