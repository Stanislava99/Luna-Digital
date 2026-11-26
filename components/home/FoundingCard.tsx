"use client";

import { useI18n } from "@/components/I18n";
import { useToast } from "@/components/Toast";
import { FOUNDING } from "@/lib/site";
import { useContact } from "./ContactContext";

/** "Claim a founding spot" button: ticks the founding box and starts a message. */
export function ClaimFoundingButton() {
  const { t } = useI18n();
  const toast = useToast();
  const { prefill } = useContact();
  const open = FOUNDING.total - FOUNDING.taken;
  if (open <= 0) {
    return <button className="btn btn--light" type="button" disabled>{t("All spots taken")}</button>;
  }
  return (
    <button
      className="btn btn--light"
      type="button"
      onClick={() => {
        prefill((f) => ({
          founding: true,
          message: f.message.trim() ? f.message : t("Hi Luna! I'd like one of the founding client spots. Here's what I'm looking to build:") + " ",
        }));
        toast(t("Founding spot selected"));
      }}
    >
      {t("Claim a founding spot")} <span aria-hidden="true">→</span>
    </button>
  );
}

/** Row of moons: filled = taken, outlined = still open. */
export function FoundingSpots() {
  const { t } = useI18n();
  const { total, taken } = FOUNDING;
  const open = total - taken;
  return (
    <>
      <div className="spots" role="img" aria-label={t("{open} of {total} spots open", { open, total })}>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`spot-moon ${i < taken ? "is-taken" : "is-open"}`} style={{ animationDelay: `${i * 0.25}s` }} />
        ))}
      </div>
      <p className="spots__text">{open > 0 ? t("{open} of {total} spots open", { open, total }) : t("All spots taken")}</p>
    </>
  );
}
