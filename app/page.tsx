import { ContactProvider } from "@/components/home/ContactContext";
import { ContactSection } from "@/components/home/ContactSection";
import { Nav } from "@/components/home/Nav";
import { Footer, Founding, Hero, Included, PlannerPromo, Story, Why } from "@/components/home/sections";
import { Work } from "@/components/home/Work";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

/* Structured data (schema.org) so Google knows who we are and what we sell. Prices match Work.tsx. */
const offer = (name: string, price: number, description: string) => ({
  "@type": "Offer",
  priceCurrency: "EUR",
  priceSpecification: { "@type": "PriceSpecification", minPrice: price, priceCurrency: "EUR" },
  itemOffered: { "@type": "Service", name, description },
});

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Luna Digital",
      publisher: { "@id": `${SITE_URL}/#org` },
      inLanguage: "en",
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
        "Booking websites for holiday rentals, guesthouses and small businesses: online booking, calendars synced with Airbnb and Booking.com, fixed prices from €200.",
      priceRange: "€200+",
      areaServed: "Europe",
      makesOffer: [
        offer("Landing page", 200, "One page, one goal: sign-ups, bookings or calls."),
        offer("Business website", 400, "Home, about, prices and contact pages for your business."),
        offer("Web app", 600, "Dashboards, booking systems and client portals."),
        offer("Online store", 900, "Sell products online with a cart and card payments."),
        offer("Mobile app", 2500, "An app for iPhone and Android."),
        offer("Custom software", 3000, "Stock, orders and staff tools that replace spreadsheets."),
      ],
    },
  ],
};

export default function HomePage() {
  return (
    <ContactProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <Nav />
      <main id="top">
        <Hero />
        <Included />
        <PlannerPromo />
        <Story />
        <Work />
        <Why />
        <Founding />
        <ContactSection />
      </main>
      <Footer />
    </ContactProvider>
  );
}
