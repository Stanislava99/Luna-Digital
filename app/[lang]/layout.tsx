import { notFound } from "next/navigation";
import { baseMetadata, baseViewport, RootDocument } from "@/components/pages/RootDocument";
import { isLocale, OTHER_LOCALES } from "@/lib/i18n";

export const metadata = baseMetadata;
export const viewport = baseViewport;
export const dynamicParams = false;
export const generateStaticParams = () => OTHER_LOCALES.map((lang) => ({ lang }));

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <RootDocument locale={lang}>{children}</RootDocument>;
}
