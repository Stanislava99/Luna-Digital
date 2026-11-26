import type { MetadataRoute } from "next";
import { ALL_LOCALES, languageAlternates, localePath } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

/** /sitemap.xml: submit this URL in Google Search Console. Planner steps share /builder as canonical. */
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/builder", "/privacy"].flatMap((path) =>
    ALL_LOCALES.map((l) => ({ url: `${SITE_URL}${localePath(l, path)}`, alternates: { languages: languageAlternates(path) } })));
}
