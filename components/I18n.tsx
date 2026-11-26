"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { localePath, makeT, type Dict, type Locale, type TFn } from "@/lib/i18n";

type Ctx = { locale: Locale; t: TFn; href: (path: string) => string };
const I18nContext = createContext<Ctx>({ locale: "en", t: makeT({}), href: (p) => p });

export function I18nProvider({ locale, dict, children }: { locale: Locale; dict: Dict; children: ReactNode }) {
  const value = useMemo(() => ({ locale, t: makeT(dict), href: (p: string) => localePath(locale, p) }), [locale, dict]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
