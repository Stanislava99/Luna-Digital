/* Server side only: client components get their language from <I18nProvider>. */
import bs from "./dict/bs.json";
import el from "./dict/el.json";
import es from "./dict/es.json";
import hr from "./dict/hr.json";
import me from "./dict/me.json";
import sr from "./dict/sr.json";
import { localePath, makeT, type Dict, type Locale } from "./i18n";

const DICTS: Record<Locale, Dict> = { en: {}, sr, hr, bs, me, el, es };

export const getDict = (locale: Locale) => DICTS[locale];
export const getI18n = (locale: Locale) => ({ t: makeT(DICTS[locale]), href: (path: string) => localePath(locale, path) });
