/**
 * Languages. English lives at /, the others at /<code> (e.g. /sr/builder).
 * Texts are written in English in the components and looked up in lib/dict/<code>.json;
 * `npm run i18n` lists anything that is missing.
 */
import type { Metadata } from "next";
import { SITE_URL } from "./site";

export const LOCALES = {
  en: { name: "English", html: "en", hreflang: "en", og: "en_GB" },
  sr: { name: "Srpski", html: "sr-Latn", hreflang: "sr", og: "sr_RS" },
  hr: { name: "Hrvatski", html: "hr", hreflang: "hr", og: "hr_HR" },
  bs: { name: "Bosanski", html: "bs", hreflang: "bs", og: "bs_BA" },
  // Google has no hreflang code for Montenegrin, so it is marked as Serbian for Montenegro
  me: { name: "Crnogorski", html: "sr-Latn-ME", hreflang: "sr-ME", og: "sr_ME" },
  el: { name: "Ελληνικά", html: "el", hreflang: "el", og: "el_GR" },
  es: { name: "Español", html: "es", hreflang: "es", og: "es_ES" },
} as const;

export type Locale = keyof typeof LOCALES;
export type Dict = Record<string, string>;
export type Vars = Record<string, string | number>;
export type TFn = (text: string, vars?: Vars) => string;

export const ALL_LOCALES = Object.keys(LOCALES) as Locale[];
export const OTHER_LOCALES = ALL_LOCALES.filter((l) => l !== "en");
export const isLocale = (v: string): v is Locale => v in LOCALES;

export const makeT = (dict: Dict): TFn => (text, vars) => {
  const s = dict[text] ?? text;
  return vars ? s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : s;
};

/** "/builder" → "/sr/builder" */
export const localePath = (locale: Locale, path = "/") =>
  locale === "en" ? path : `/${locale}${path === "/" ? "" : path.startsWith("/#") ? path.slice(1) : path}`;

/** "/sr/builder" → "/builder" */
export const stripLocale = (pathname: string) => {
  const seg = pathname.split("/")[1];
  return isLocale(seg) && seg !== "en" ? pathname.slice(seg.length + 1) || "/" : pathname;
};

/** app/opengraph-image.tsx. Named here because pages set their own openGraph, which replaces the automatic one. */
const SHARE_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "Luna Digital" };

export const languageAlternates = (path: string) => ({
  ...Object.fromEntries(ALL_LOCALES.map((l) => [LOCALES[l].hreflang, `${SITE_URL}${localePath(l, path)}`])),
  "x-default": `${SITE_URL}${path}`,
});

/** Title, description, canonical and hreflang for one page in one language. */
export function pageMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: localePath(locale, path), languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: "Luna Digital", locale: LOCALES[locale].og, url: localePath(locale, path), title, description, images: [SHARE_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [SHARE_IMAGE] },
  };
}
