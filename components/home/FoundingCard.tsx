"use client";

import { useToast } from "@/components/Toast";
import { FOUNDING } from "@/lib/site";
import { useContact } from "./ContactContext";

/** "Claim a founding spot" button: ticks the founding box and starts a message. */
export function ClaimFoundingButton() {
  const toast = useToast();
  const { prefill } = useContact();
  const open = FOUNDING.total - FOUNDING.taken;
  if (open <= 0) {
    return <button className="btn btn--light" type="button" disabled>All spots taken</button>;
  }
  return (
    <button
      className="btn btn--light"
      type="button"
      onClick={() => {
        prefill((f) => ({
          founding: true,
          message: f.message.trim() ? f.message : "Hi Luna! I'd like one of the founding client spots. Here's what I'm looking to build: ",
        }));
        toast("Founding spot selected");
      }}
    >
      Claim a founding spot <span aria-hidden="true">→</span>
    </button>
  );
}

/** Row of moons: filled = taken, outlined = still open. */
export function FoundingSpots() {
  const { total, taken } = FOUNDING;
  const open = total - taken;
  return (
    <>
      <div className="spots" role="img" aria-label={`${open} of ${total} founding spots open`}>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`spot-moon ${i < taken ? "is-taken" : "is-open"}`} style={{ animationDelay: `${i * 0.25}s` }} />
        ))}
      </div>
      <p className="spots__text">{open > 0 ? `${open} of ${total} spots open` : "All founding spots are taken"}</p>
    </>
  );
}
