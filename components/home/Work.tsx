"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { useToast } from "@/components/Toast";
import { track } from "@/lib/analytics";
import { money, prefersReducedMotion } from "@/lib/site";
import { useContact } from "./ContactContext";
import { DEMOS, type ProjectType } from "./demos";

type Cat = "web" | "app" | "software";

const PROJECTS: { type: ProjectType; cat: Cat; price: number; weeks: number; desc: string; shot: React.ReactNode }[] = [
  { type: "landing", cat: "web", price: 200, weeks: 1, desc: "One page, one goal: sign-ups, bookings or calls.",
    shot: <div className="mock"><i></i><i></i><i></i><div className="mock__hero"></div><div className="mock__row"><span></span></div></div> },
  { type: "website", cat: "web", price: 400, weeks: 2, desc: "Home, about, prices and contact pages for your business.",
    shot: <div className="mock"><i></i><i></i><i></i><div className="mock__hero"></div><div className="mock__row"><span></span><span></span><span></span></div></div> },
  { type: "shop", cat: "web", price: 900, weeks: 3, desc: "Sell products online with a cart and card payments.",
    shot: <div className="mock"><i></i><i></i><i></i><div className="mock__grid"><span></span><span></span><span></span><span></span></div></div> },
  { type: "webapp", cat: "app", price: 600, weeks: 6, desc: "Dashboards, booking systems and client portals.",
    shot: <div className="mock mock--dash"><div className="mock__side"></div><div className="mock__main"><div className="mock__row"><span></span><span></span><span></span></div><div className="mock__chart mock__chart--bars"></div></div></div> },
  { type: "mobile", cat: "app", price: 2500, weeks: 8, desc: "An app for iPhone and Android, on your customers' phones.",
    shot: <div className="mock mock--phone"><div className="mock__bar"></div><div className="mock__card"></div><div className="mock__card"></div><div className="mock__card mock__card--sm"></div></div> },
  { type: "custom", cat: "software", price: 3000, weeks: 8, desc: "Stock, orders and staff tools that replace spreadsheets.",
    shot: <div className="mock mock--dash"><div className="mock__side"></div><div className="mock__main"><div className="mock__chart"></div><div className="mock__row"><span></span><span></span></div></div></div> },
];

const ADDONS = [
  { value: "Edit it yourself (CMS)", label: "Edit it yourself", note: "Change text & photos without us", price: 100, weeks: 0 },
  { value: "More languages", label: "More languages", note: "Your site in 2+ languages", price: 80, weeks: 0 },
  { value: "Logo & brand", label: "Logo & brand", note: "Logo, colours and fonts", price: 150, weeks: 1 },
  { value: "Google-ready (SEO & visitor stats)", label: "Google-ready", note: "Show up in search + visitor stats", price: 60, weeks: 0 },
  { value: "Connect your tools (payments, bookings, email)", label: "Connect your tools", note: "Payments, bookings, email lists", price: 150, weeks: 1 },
  { value: "AI assistant", label: "AI assistant", note: "A chatbot that answers customers", price: 300, weeks: 1 },
];

const PACES = { standard: { label: "Standard", mult: 1, wmult: 1 }, rush: { label: "Rush +30%", mult: 1.3, wmult: 0.6 } };
type Pace = keyof typeof PACES;

const FILTERS: [string, string][] = [["all", "All"], ["web", "Websites"], ["app", "Apps"], ["software", "Software"]];

const round = (n: number) => (n >= 1000 ? Math.round(n / 50) * 50 : Math.round(n / 10) * 10);

/** Animates a number towards `to` (ease-out, 600ms). */
function useTween(to: number) {
  const [value, setValue] = useState(to);
  const from = useRef(to);
  useEffect(() => {
    if (prefersReducedMotion()) { setValue(to); from.current = to; return; }
    const start = performance.now(), a = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min((now - start) / 600, 1);
      const v = a + (to - a) * (1 - Math.pow(1 - k, 3));
      from.current = v;
      setValue(v);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Guarantee the final value even if animation frames are paused (background tab)
    const done = setTimeout(() => { from.current = to; setValue(to); }, 700);
    return () => { cancelAnimationFrame(raf); clearTimeout(done); };
  }, [to]);
  return value;
}

export function Work() {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<ProjectType | null>(null);

  return (
    <section className="section" id="work">
      <div className="container">
        <Reveal as="header" className="section__head section__head--row">
          <div>
            <p className="eyebrow">Services &amp; prices</p>
            <h2>What we can build for you</h2>
            <p className="section__sub">Click any example to try it, see the price and pick extras.</p>
          </div>
          <div className="filters" role="tablist" aria-label="Filter projects">
            {FILTERS.map(([id, label]) => (
              <button key={id} className={`filter${filter === id ? " is-active" : ""}`} role="tab" aria-selected={filter === id}
                onClick={() => setFilter(id)}>
                {label}
              </button>
            ))}
          </div>
        </Reveal>
        <div className="work">
          {PROJECTS.map((p, i) => (
            <Reveal as="article" key={p.type} index={i} onClick={() => setOpen(p.type)}
              className={`project${filter !== "all" && p.cat !== filter ? " is-hidden" : ""}`}>
              <div className="project__shot">{p.shot}</div>
              <div className="project__meta">
                <div className="project__title"><h3>{DEMOS[p.type].title}</h3><span className="pill">from {money.format(p.price)}</span></div>
                <p>{p.desc}</p>
              </div>
              <button type="button" className="project__open" aria-haspopup="dialog">Try it &amp; see price <span aria-hidden="true">→</span></button>
            </Reveal>
          ))}
        </div>
      </div>
      <CaseModal type={open} onClose={() => setOpen(null)} />
    </section>
  );
}

function CaseModal({ type, onClose }: { type: ProjectType | null; onClose: () => void }) {
  const toast = useToast();
  const { prefill } = useContact();
  const dialog = useRef<HTMLDialogElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [addons, setAddons] = useState<string[]>([]);
  const [pace, setPace] = useState<Pace>("standard");
  const [shown, setShown] = useState<ProjectType>("landing");

  // Open / close the native <dialog>; every opening starts fresh
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (type) {
      setShown(type);
      setAddons([]);
      setPace("standard");
      if (!d.open) d.showModal();
      inner.current?.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
      track("Price popup opened", { type });
    } else if (d.open) {
      d.close();
    }
  }, [type]);

  const project = PROJECTS.find((p) => p.type === shown)!;
  const est = useMemo(() => {
    let price = project.price, weeks = project.weeks;
    ADDONS.filter((a) => addons.includes(a.value)).forEach((a) => { price += a.price; weeks += a.weeks; });
    price *= PACES[pace].mult;
    weeks = Math.max(1, Math.round(weeks * PACES[pace].wmult));
    const low = round(price), high = round(price * 1.25);
    const weeksHigh = weeks + Math.max(1, Math.ceil(weeks * 0.25));
    return { low, high, weeks: `${weeks}–${weeksHigh} weeks` };
  }, [project, addons, pace]);

  const low = useTween(est.low);
  const high = useTween(est.high);
  const demo = DEMOS[shown];

  function sendEstimate() {
    const title = demo.title;
    const message =
      `Hi Luna! I'd like a quote for: ${title}.\n` +
      (addons.length ? `Add-ons: ${addons.join(", ")}.\n` : "") +
      `Timeline: ${PACES[pace].label.replace(/[^\w\s]/g, "").trim().toLowerCase()} (${est.weeks}).\n` +
      `Online estimate: ${money.format(est.low)} – ${money.format(est.high)}.\n\n` +
      `I'm interested in a founding client spot (20% off).\n\n` +
      `A bit more about the project: `;
    const budget = est.high < 300 ? "Under €300" : est.high < 1000 ? "€300–1,000" : est.high < 3000 ? "€1,000–3,000" : "€3,000+";
    onClose();
    prefill({ message, budget, founding: true });
    toast("Added to your message");
    track("I want this clicked", { type: title, estimate: est.low });
  }

  const toggleAddon = (v: string) => setAddons((a) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v]));

  return (
    <dialog
      ref={dialog}
      className="case"
      aria-labelledby="previewTitle"
      onClose={() => { document.body.style.overflow = ""; onClose(); }}
      onClick={(e) => e.target === dialog.current && onClose()}
    >
      <div className="case__inner" ref={inner}>
        <button className="icon-btn case__close" type="button" aria-label="Close" onClick={onClose}>✕</button>
        <div className="estimator">
          <form className="estimator__form" onSubmit={(e) => e.preventDefault()}>
            <div className="case__head">
              <p className="eyebrow">Example: {demo.example}</p>
              <h3 id="previewTitle">{demo.title}</h3>
              <p>{demo.desc}</p>
              <p className="preview__hint">{demo.hint}</p>
            </div>
            {/* key resets the example every time the popup opens */}
            <div className="preview__stage" aria-live="polite">{type && <demo.Demo key={type} />}</div>

            <fieldset>
              <legend>Add extras</legend>
              <div className="choices choices--multi">
                {ADDONS.map((a) => (
                  <label className="choice" key={a.value}>
                    <input type="checkbox" name="addon" value={a.value} checked={addons.includes(a.value)} onChange={() => toggleAddon(a.value)} />
                    <span>{a.label}<small>{a.note} · +€{a.price}</small></span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>When do you need it?</legend>
              <div className="segmented">
                {(Object.keys(PACES) as Pace[]).map((p) => (
                  <label key={p}>
                    <input type="radio" name="pace" value={p} checked={pace === p} onChange={() => setPace(p)} />
                    <span>{PACES[p].label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </form>

          <aside className="estimator__result" aria-live="polite">
            <p className="result__label">Price</p>
            <p className="result__price"><span>{money.format(low)}</span> – <span>{money.format(high)}</span></p>
            <div className="result__row">
              <div><span>Timeline</span><b>{est.weeks}</b></div>
              <div className="result__gold"><span>Founding price (−20%)</span><b>{money.format(round(est.low * 0.8))} – {money.format(round(est.high * 0.8))}</b></div>
            </div>
            <div className="result__bar"><span style={{ width: `${Math.min(100, (est.high / 5000) * 100)}%` }}></span></div>
            <p className="result__note">Includes design, building, testing, launch and 30 days of free help. Final price agreed after a free call.</p>
            <button className="btn btn--primary btn--block" type="button" onClick={sendEstimate}>I want this →</button>
          </aside>
        </div>
      </div>
    </dialog>
  );
}
