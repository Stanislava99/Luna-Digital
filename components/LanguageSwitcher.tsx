"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ALL_LOCALES, LOCALES, localePath, stripLocale } from "@/lib/i18n";
import { useI18n } from "./I18n";

/** Links to this same page in every language (real links, so search engines follow them too). */
export function LanguageSwitcher() {
  const { locale, t } = useI18n();
  const path = stripLocale(usePathname());
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const close = (e: Event) => {
      const d = ref.current;
      if (!d?.open) return;
      if (e instanceof KeyboardEvent) {
        if (e.key !== "Escape") return;
        d.querySelector("summary")?.focus();
      } else if (d.contains(e.target as Node)) return;
      d.open = false;
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", close);
    return () => { document.removeEventListener("click", close); document.removeEventListener("keydown", close); };
  }, []);

  return (
    <details className="lang" ref={ref}>
      <summary aria-label={`${t("Language")}: ${LOCALES[locale].name}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
        <span>{locale.toUpperCase()}</span>
      </summary>
      <ul>
        {ALL_LOCALES.map((l) => (
          <li key={l}>
            <a href={localePath(l, path)} hrefLang={LOCALES[l].hreflang} lang={LOCALES[l].html} aria-current={l === locale ? "true" : undefined}>{LOCALES[l].name}</a>
          </li>
        ))}
      </ul>
    </details>
  );
}
