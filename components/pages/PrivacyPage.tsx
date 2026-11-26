import { Footer } from "@/components/home/sections";
import { PageTop } from "@/components/PageTop";
import { getI18n } from "@/lib/dictionaries";
import { pageMetadata, type Locale } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/site";

export const privacyMetadata = (locale: Locale) => {
  const { t } = getI18n(locale);
  return pageMetadata(locale, "/privacy", `${t("Privacy")} · Luna Digital`, t("What Luna Digital does with the details you send us through the contact form and the website planner."));
};

/* Describes what the code does today: update it when a form, analytics or an outside service changes. */
export function PrivacyPage({ locale }: { locale: Locale }) {
  const { t, href } = getI18n(locale);
  const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;
  return (
    <>
      <PageTop href={href("/")} />
      <main className="container page">
        <h1>{t("Privacy")}</h1>
        <p>{t("Last updated: 25 November 2026. Questions? Write to")} {mail}.</p>

        <h2>{t("What you send us")}</h2>
        <p>{t("When you use the contact form or request a price, we receive what you typed: your name, email, project details and, if you add them, your business name, budget, phone number and website plan. We use it to answer you and prepare your quote. We don't sell it.")}</p>

        <h2>{t("How it reaches us")}</h2>
        <p>{t("Form messages are delivered to our inbox by Resend, an email service. If that isn't available, the site opens your own email app instead.")}</p>

        <h2>{t("Website planner")}</h2>
        <p>{t("Your planner choices are saved in your own browser so you can continue later. We only receive them when you send your request. You can remove them by clearing this site's data in your browser.")}</p>

        <h2>{t("Visitor statistics and hosting")}</h2>
        <p>{t("The site is hosted by Vercel and uses Vercel Web Analytics to count visits. It doesn't use cookies for this. Some photos load from Unsplash and from seaandskivillas.com, and those servers receive your IP address, as with any image on the web.")}</p>

        <h2>{t("Your choices")}</h2>
        <p>{t("You can ask us what we hold about you, or ask us to correct or delete it, at")} {mail}.</p>
      </main>
      <Footer locale={locale} />
    </>
  );
}
