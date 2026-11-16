import { ContactProvider } from "@/components/home/ContactContext";
import { ContactSection } from "@/components/home/ContactSection";
import { Nav } from "@/components/home/Nav";
import { Footer, Founding, Hero, Included, PlannerPromo, Story, Why } from "@/components/home/sections";
import { Work } from "@/components/home/Work";

export default function HomePage() {
  return (
    <ContactProvider>
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
