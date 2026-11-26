import type { ReactNode } from "react";
import { STEPS } from "@/components/planner/data";
import { Planner } from "@/components/planner/Planner";
import "@/components/planner/builder.css";
import { getI18n } from "@/lib/dictionaries";
import { pageMetadata, type Locale } from "@/lib/i18n";

export const builderMetadata = (locale: Locale) => {
  const { t } = getI18n(locale);
  return pageMetadata(locale, "/builder", t("Plan Your Rental Website · Luna Digital"),
    t("Design your holiday rental or guesthouse website step by step and see it come to life. Pick a style, choose sections like gallery, calendar and online booking, and request your price."));
};

/** Every step URL, pre-rendered at build time; anything else is a 404. */
export const builderSteps = () => [{ step: [] as string[] }, ...[...STEPS.map((s) => s.slug as string).filter(Boolean), "sent"].map((s) => ({ step: [s] }))];

/**
 * The planner lives in the layout so it keeps its state while the URL
 * changes from step to step (/builder → /builder/style → …).
 */
export function BuilderShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Planner />
      {children}
    </>
  );
}
