import { PrivacyPage, privacyMetadata } from "@/components/pages/PrivacyPage";
import type { Locale } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

/* The layout has already checked that lang is a known language. */
export const generateMetadata = async ({ params }: Props) => privacyMetadata((await params).lang as Locale);

export default async function Page({ params }: Props) {
  return <PrivacyPage locale={(await params).lang as Locale} />;
}
