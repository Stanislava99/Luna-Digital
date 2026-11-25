"use client";

/* ==========================================================
   Rental website planner: 5 steps on the left, live preview on the right.
   On phones, tablets and short screens the preview fills the screen and the
   steps sit in a bottom sheet; after the last choice it slides down once to
   show the website, then goes on to the price request.
   Each step has its own URL (/builder, /builder/style, …) so the browser's
   back button works and Vercel Analytics shows where visitors drop off.
   ========================================================== */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { LogoMark } from "@/components/Logo";
import { useToast } from "@/components/Toast";
import { track } from "@/lib/analytics";
import { CONTACT_EMAIL, EMAIL_RE, openMailClient, prefersReducedMotion, sendToServer } from "@/lib/site";
import { EXTRAS, FEATURES, ICON, PACE, STEPS, STYLES, TYPES, type Extra, type Feature, type PaceId, type PlaceType, type StyleId } from "./data";
import { DEFAULT_PLAN, buildTime, loadPlan, placeLoc, placeName, savePlan, slug, toggleFeature, type Plan } from "./plan";
import { Preview, type PreviewHandle } from "./Preview";

const LAST = STEPS.length - 1;
/** Same breakpoint as the stacked (phone / short screen) layout in builder.css. */
const STACKED = "(max-width: 900px), (max-height: 560px)";

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
);

function stepFromPath(pathname: string) {
  const seg = pathname.replace(/^\/builder\/?/, "").split("/")[0];
  if (seg === "sent") return LAST;
  const i = STEPS.findIndex((s) => s.slug === seg);
  return i < 0 ? 0 : i;
}
const stepUrl = (i: number) => `/builder${STEPS[i].slug ? `/${STEPS[i].slug}` : ""}`;

export function Planner() {
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const step = stepFromPath(pathname);

  const [plan, setPlanState] = useState<Plan>(DEFAULT_PLAN);
  const [loaded, setLoaded] = useState(false);
  const preview = useRef<PreviewHandle>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const firstStep = useRef(true);
  /** Phones, tablets and short screens: the choices sit in a bottom sheet over a
      full-screen preview. "peek" slides the sheet down so the visitor sees the result. */
  const [peek, setPeek] = useState(false);

  const setPlan = (patch: Partial<Plan>) => setPlanState((p) => ({ ...p, ...patch }));

  // Load the saved plan (browser only), and continue where the visitor left off
  useEffect(() => {
    const saved = loadPlan();
    setPlanState(saved);
    setLoaded(true);
    if (stepFromPath(window.location.pathname) === 0 && saved.step > 0) router.replace(stepUrl(saved.step), { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { if (loaded) savePlan({ ...plan, step }); }, [plan, step, loaded]);

  // On every step change: open the sheet, scroll the panel up and move focus to the heading
  useEffect(() => {
    setPeek(false);
    if (firstStep.current) { firstStep.current = false; return; }
    stepsRef.current?.scrollTo(0, 0);
    const h = stepsRef.current?.querySelector<HTMLElement>(`[data-step="${step}"] h1`);
    h?.focus({ preventScroll: true });
  }, [step]);

  /** Bottom sheet: slide it down to show the website, or back up to keep choosing. */
  function showResult() {
    setPeek(true);
    preview.current?.scrollToTop(!prefersReducedMotion());
  }
  function editChoices() {
    setPeek(false);
    if (window.matchMedia(STACKED).matches) stepsRef.current?.focus({ preventScroll: true });
  }

  const goTo = (i: number) => router.push(stepUrl(Math.max(0, Math.min(LAST, i))), { scroll: false });

  /* ---------- Handlers ---------- */
  function pickType(type: PlaceType) {
    setPlan({ type });
    preview.current?.scrollToTop(false);
  }
  function pickStyle(style: StyleId) {
    setPlan({ style, theme: STYLES[style].theme, font: STYLES[style].font });
    preview.current?.scrollToTop();
    if (style === "custom") setTimeout(() => document.getElementById("customNote")?.focus(), 200);
  }
  function setFeature(f: Feature, on: boolean) {
    const { features, note } = toggleFeature(plan.features, f.id, on);
    setPlan({ features });
    if (note) toast(note);
    if (on) preview.current?.flash(f.sec);
  }
  function bulk(all: boolean) {
    setPlan({ features: all ? FEATURES.map((f) => f.id) : [] });
    preview.current?.scrollToTop();
    toast(all ? "All sections added" : "Only the home page & contact left");
  }
  function setExtra(x: Extra, on: boolean) {
    setPlan({ extras: on ? [...new Set([...plan.extras, x.id])] : plan.extras.filter((id) => id !== x.id) });
    if (x.id === "domain" && on) toast(`We'll set up ${slug(plan)}.com (if it's free)`);
  }

  const sectionCount = plan.features.length + 1; // + home page

  return (
    <div className="bp">
      <header className="bp-head">
        <Link href="/" className="logo" aria-label="Luna Digital home"><LogoMark gradient /><span>Luna Digital</span></Link>
        <ol className="stepper" aria-label="Steps">
          {STEPS.map((s, i) => (
            <li key={s.label}>
              <button type="button" className={i === step ? "is-current" : i < step ? "is-done" : undefined}
                aria-current={i === step ? "step" : undefined} onClick={() => goTo(i)}>
                <span className="n">{i + 1}</span><span className="lbl">{s.label}</span>
              </button>
            </li>
          ))}
        </ol>
        <Link href="/" className="bp-back">← Back to site</Link>
      </header>

      <main className="bp-main">
        {/* ============ LEFT: CONTROLS ============ */}
        <section className={`bp-panel${peek ? " is-peek" : ""}`} aria-label="Plan your website">
          {/* Bottom-sheet handle (phones, tablets, short screens only) */}
          <button type="button" className="bp-sheet-handle" aria-expanded={!peek} aria-controls="bpSteps"
            onClick={() => (peek ? editChoices() : showResult())}>
            <i aria-hidden="true"></i>
            <span>{peek ? <>Step {step + 1} of {STEPS.length} · {STEPS[step].label} <b>Change</b></> : "Hide choices"}</span>
          </button>
          <div className="bp-steps" id="bpSteps" ref={stepsRef} tabIndex={-1}>
            <Step i={0} current={step} title="Tell us about your place" sub="Watch the live preview: it's your future website, building itself as you go.">
              <fieldset className="bp-field">
                <legend>What do you rent out?</legend>
                <div className="bp-cards bp-cards--2">
                  {(Object.keys(TYPES) as PlaceType[]).map((id) => (
                    <label className="bp-card" key={id}>
                      <input type="radio" name="type" value={id} checked={plan.type === id} onChange={() => pickType(id)} />
                      <span className="bp-card__body"><span className="bp-card__icon" aria-hidden="true">{TYPES[id].icon}</span><b>{TYPES[id].label}</b><small>{TYPES[id].desc}</small></span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="bp-grid2">
                <label className="bp-input">
                  <span>Name of your place</span>
                  <input type="text" maxLength={40} autoComplete="off" placeholder={TYPES[plan.type].name} value={plan.name}
                    onChange={(e) => setPlan({ name: e.target.value })} onFocus={() => preview.current?.scrollToTop()} />
                </label>
                <label className="bp-input">
                  <span>Where is it?</span>
                  <input type="text" maxLength={40} autoComplete="off" placeholder="e.g. Old Town, near the beach" value={plan.location}
                    onChange={(e) => setPlan({ location: e.target.value })} />
                </label>
              </div>
              <label className="bp-input bp-input--price">
                <span>Price per night</span>
                <div className="bp-prefix"><b>€</b>
                  <input type="number" min={10} max={2000} step={5} inputMode="numeric" defaultValue={plan.price} key={loaded ? "loaded" : "initial"}
                    onChange={(e) => { const v = parseInt(e.target.value, 10); if (v > 0) setPlan({ price: Math.min(v, 5000) }); }} />
                </div>
              </label>
            </Step>

            <Step i={1} current={step} title="Choose a style" sub="Let us design a style that fits your place, or bring your own idea and we'll design it together on a call.">
              <div className="bp-cards bp-styles">
                {(Object.keys(STYLES) as StyleId[]).map((id) => (
                  <label className={`bp-card${id === "custom" ? " bp-card--custom" : ""}`} key={id}>
                    <input type="radio" name="style" value={id} checked={plan.style === id} onChange={() => pickStyle(id)} />
                    <span className="bp-card__body"><StyleThumb id={id} /><b>{STYLES[id].label}</b><small>{STYLES[id].desc}</small></span>
                  </label>
                ))}
              </div>
              <div className="bp-custom" hidden={plan.style !== "luna"}>
                <p className="bp-custom__title">We&apos;ll design it for you</p>
                <p className="bp-custom__note">We look at your place, your photos and your guests, then create a style that fits. You&apos;ll see the first design before anything is built, and we adjust it until you love it.</p>
              </div>
              <div className="bp-custom" hidden={plan.style !== "custom"}>
                <p className="bp-custom__title">Your own idea, designed together</p>
                <p className="bp-custom__note">After you send your plan, we&apos;ll book a short call (or you can describe it by email) to talk through the look you want: colours, mood, examples you like.</p>
                <label className="bp-input"><span>Have a first idea already? <small>(optional)</small></span>
                  <textarea id="customNote" rows={3} maxLength={600} placeholder="e.g. Bright and Scandinavian, lots of white and wood, big photos, a calm feel…"
                    value={plan.customNote} onChange={(e) => setPlan({ customNote: e.target.value })} /></label>
                <label className="bp-input"><span>Websites you like <small>(optional)</small></span>
                  <input type="text" maxLength={300} placeholder="Links to websites or Pinterest boards you love"
                    value={plan.customLinks} onChange={(e) => setPlan({ customLinks: e.target.value })} /></label>
              </div>
            </Step>

            <Step i={2} current={step} title="Choose your sections" sub="Switch sections on and see them appear. Try them out in the preview.">
              <div className="bp-bulk" role="group" aria-label="Select sections">
                <span>Sections</span>
                <button type="button" className="bp-bulk__btn" onClick={() => bulk(true)}>Select all</button>
                <button type="button" className="bp-bulk__btn" onClick={() => bulk(false)}>Deselect all</button>
              </div>
              <div className="bp-included">
                <span className="bp-ico" aria-hidden="true"><svg viewBox="0 0 24 24">{ICON.home}</svg></span>
                <div><b>Home page</b><small>Big photo, your story, amenities, map and contact details. Always included.</small></div>
              </div>
              <div className="bp-toggles">
                {FEATURES.map((f) => <Toggle key={f.id} item={f} checked={plan.features.includes(f.id)} onChange={(on) => setFeature(f, on)} />)}
              </div>
            </Step>

            <Step i={3} current={step} title="Extras & timing" sub="Optional help to get you online faster and looking great.">
              <div className="bp-toggles">
                {EXTRAS.map((x) => <Toggle key={x.id} item={x} checked={plan.extras.includes(x.id)} onChange={(on) => setExtra(x, on)} />)}
              </div>
              <fieldset className="bp-field">
                <legend>When do you need it?</legend>
                <div className="segmented">
                  {(Object.keys(PACE) as PaceId[]).map((p) => (
                    <label key={p}><input type="radio" name="pace" value={p} checked={plan.pace === p} onChange={() => setPlan({ pace: p })} /><span>{PACE[p].short}</span></label>
                  ))}
                </div>
              </fieldset>
            </Step>

            <SendStep plan={plan} current={step} setPlan={setPlan} />
          </div>

          {/* sticky footer: summary + navigation */}
          <div className="bp-foot">
            <div className="bp-total" aria-live="polite">
              <span>Your website</span>
              <b key={sectionCount} className={loaded ? "bump" : undefined}>{sectionCount} section{sectionCount === 1 ? "" : "s"}</b>
              <small>about {buildTime(plan)}</small>
            </div>
            <div className="bp-nav">
              {/* Wide screens: Back / Next. Bottom sheet: choose → see the result → next. */}
              <button type="button" className="btn btn--ghost nav-back" disabled={step === 0} onClick={() => goTo(step - 1)}>Back</button>
              <button type="button" className="btn btn--primary nav-wide" hidden={step === LAST} onClick={() => goTo(step + 1)}>
                {step === LAST - 1 ? "See my plan →" : "Next →"}
              </button>
              {/* Bottom sheet: Next through the choices; after the last choice (Extras)
                  the sheet slides down once to show the website, then on to the request. */}
              <button type="button" className="btn btn--primary nav-sheet" hidden={step === LAST}
                onClick={() => (step === LAST - 1 ? showResult() : goTo(step + 1))}>
                {step === LAST - 1 ? <><EyeIcon /> See my website</> : "Next →"}
              </button>
              <button type="button" className="btn btn--ghost nav-peek" onClick={editChoices}>Edit</button>
              <button type="button" className="btn btn--primary nav-peek" onClick={() => (step === LAST ? editChoices() : goTo(step + 1))}>
                {step === LAST ? "Request my price →" : step === LAST - 1 ? "Request my price →" : "Next →"}
              </button>
            </div>
          </div>
        </section>

        {/* ============ RIGHT: LIVE PREVIEW ============ */}
        <section className="bp-stage" aria-label="Live preview of your website">
          <div className="bp-stage__bar">
            <span className="bp-live"><i></i> Live preview</span>
            <div className="bp-device" role="radiogroup" aria-label="Preview device">
              {(["desktop", "phone"] as const).map((d) => (
                <button key={d} type="button" className={plan.device === d ? "is-on" : undefined} role="radio" aria-checked={plan.device === d} onClick={() => setPlan({ device: d })}>
                  {d === "desktop"
                    ? <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg>
                    : <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></svg>}
                  {d === "desktop" ? " Desktop" : " Phone"}
                </button>
              ))}
            </div>
          </div>
          <div className="bp-frame" data-device={plan.device} style={{ "--pv-bg": "#ffffff" } as React.CSSProperties}>
            <div className="bp-frame__bar"><i></i><i></i><i></i><span className="bp-url">🔒 {slug(plan)}.com</span></div>
            <div className="bp-frame__notch" aria-hidden="true"></div>
            <div className="pv-scroll">
              <Preview plan={plan} ref={preview} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ---------------- Pieces ---------------- */
function Step({ i, current, title, sub, children }: { i: number; current: number; title: string; sub: string; children: ReactNode }) {
  return (
    <div className="bp-step" data-step={i} hidden={i !== current}>
      <p className="eyebrow">Step {i + 1} of {STEPS.length}</p>
      <h1 tabIndex={-1}>{title}</h1>
      <p className="bp-sub">{sub}</p>
      {children}
    </div>
  );
}

function Toggle({ item, checked, onChange }: { item: Feature | Extra; checked: boolean; onChange: (on: boolean) => void }) {
  const tag = "tag" in item ? item.tag : undefined;
  return (
    <label className="bp-toggle">
      <input type="checkbox" value={item.id} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="bp-toggle__body">
        <span className="bp-ico" aria-hidden="true"><svg viewBox="0 0 24 24">{ICON[item.id]}</svg></span>
        <span><b>{item.name}{tag && <span className="bp-tag">{tag}</span>}</b><small>{item.desc}</small></span>
        <span className="bp-price"><span className="bp-switch" aria-hidden="true"></span></span>
      </span>
    </label>
  );
}

function StyleThumb({ id }: { id: StyleId }) {
  if (id === "custom") {
    return (
      <span className="st2 st2--custom" aria-hidden="true">
        <span className="st2-custom">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></svg>
          <b>Your own idea</b><small>We&apos;ll talk it through on a call</small>
        </span>
      </span>
    );
  }
  return (
    <span className="st2 st2--luna" aria-hidden="true">
      <span className="st2-custom st2-custom--luna">
        <svg viewBox="0 0 32 32"><path d="M20 3a13 13 0 1 0 9 22A11 11 0 0 1 20 3z" /></svg>
        <b>Designed by Luna</b><small>Made just for your place</small>
      </span>
    </span>
  );
}

/* ---------------- Step 5: summary + price request ---------------- */
function SendStep({ plan, current, setPlan }: { plan: Plan; current: number; setPlan: (patch: Partial<Plan>) => void }) {
  const toast = useToast();
  const router = useRouter();
  const weeksText = buildTime(plan);
  const sections = ["Home page (incl. amenities & map)", ...FEATURES.filter((f) => plan.features.includes(f.id)).map((f) => f.name)];
  const extras = EXTRAS.filter((x) => plan.extras.includes(x.id)).map((x) => x.name);
  const t = TYPES[plan.type];
  const [form, setForm] = useState({ name: "", email: "", phone: "", founding: true, _gotcha: "" });
  const [bad, setBad] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ name: string; mail?: { subject: string; body: string } } | null>(null);
  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errors = [form.name.trim().length < 2 && "name", !EMAIL_RE.test(form.email.trim()) && "email"].filter(Boolean) as string[];
    setBad(errors);
    if (errors.length) { document.querySelector<HTMLInputElement>(`#planForm [name=${errors[0]}]`)?.focus(); return; }
    if (form._gotcha) return;

    const custom = plan.style === "custom";
    const message = [
      "Price request (from the Luna planner)",
      "",
      `Place: ${placeName(plan)} (${t.label}), ${placeLoc(plan)}, €${plan.price}/${t.unit}`,
      `Style: ${STYLES[plan.style].label}${plan.style === "luna" ? " (Luna designs it)" : " (book a design call)"}`,
      custom && plan.customNote.trim() ? `Their design idea: ${plan.customNote.trim()}` : "",
      custom && plan.customLinks.trim() ? `Websites they like: ${plan.customLinks.trim()}` : "",
      `Sections: ${sections.join(", ")}`,
      `Extras: ${extras.join(", ") || "none"}`,
      `Timing: ${PACE[plan.pace].label}, ${weeksText}`,
      form.phone ? `Phone / WhatsApp: ${form.phone}` : "",
      plan.wish.trim() ? `\nTheir wish:\n${plan.wish.trim()}` : "",
    ].filter((l) => l !== "").join("\n");

    setLoading(true);
    const firstName = form.name.trim().split(" ")[0];
    const sent = await sendToServer({
      name: form.name.trim(), email: form.email.trim(), company: placeName(plan),
      message,
      // The server adds our price estimate to the email we receive
      plan: JSON.stringify({ style: plan.style, features: plan.features, extras: plan.extras, pace: plan.pace }),
      ...(form.founding ? { founding: "Yes" } : {}),
    });
    setLoading(false);
    if (!sent) {
      // Server unavailable: the visitor still has to press Send in their own email app,
      // so don't claim the request was sent yet.
      const mail = {
        subject: `${form.founding ? "[Founding client] " : ""}Price request: ${placeName(plan)}`,
        body: `Name: ${form.name}\nEmail: ${form.email}\n\n${message}`,
      };
      openMailClient(mail.subject, mail.body);
      toast("Opening your email app to finish sending…");
      setDone({ name: firstName, mail });
      track("Plan email opened", { type: plan.type, style: plan.style, sections: plan.features.length });
      return;
    }
    setDone({ name: firstName });
    router.replace("/builder/sent", { scroll: false }); // recorded as its own page in analytics
    track("Plan sent", { type: plan.type, style: plan.style, sections: plan.features.length });
  }

  const inputClass = (n: string) => `bp-input${bad.includes(n) ? " is-invalid" : ""}`;

  return (
    <div className="bp-step" data-step={LAST} hidden={current !== LAST}>
      <p className="eyebrow">Step {STEPS.length} of {STEPS.length}</p>
      <h1 tabIndex={-1}>Request your price</h1>
      {done === null ? (
        <>
          <p className="bp-sub">Check your choices and tell us your wish. We&apos;ll email you the price, an invoice and all the information within one business day. Asking is free, with no obligation.</p>
          <div className="bp-summary">
            <div className="bp-summary__row bp-summary__row--head"><span>{placeName(plan)}</span><span>{t.label}</span></div>
            <div className="bp-summary__row"><span>Location</span><span>{placeLoc(plan)}</span></div>
            <div className="bp-summary__row"><span>Style</span><span>{STYLES[plan.style].label}</span></div>
            {plan.style === "custom" && plan.customNote.trim() && (
              <div className="bp-summary__row"><span>Your idea</span>
                <span className="bp-summary__note">{plan.customNote.trim().slice(0, 120)}{plan.customNote.trim().length > 120 ? "…" : ""}</span></div>
            )}
            <div className="bp-summary__row"><span>Sections</span><span className="bp-summary__note">{sections.join(", ")}</span></div>
            {extras.length > 0 && <div className="bp-summary__row"><span>Extras</span><span className="bp-summary__note">{extras.join(", ")}</span></div>}
            <div className="bp-summary__row"><span>Timing</span><span>{PACE[plan.pace].label} · {weeksText}</span></div>
          </div>

          <form className="bp-form" id="planForm" noValidate onSubmit={onSubmit}>
            <label className="bp-input"><span>Describe your wish <small>(optional)</small></span>
              <textarea name="wish" rows={5} maxLength={1500} placeholder="Tell us in your own words what you'd like: how the website should feel, what guests should be able to do, when you need it…"
                value={plan.wish} onChange={(e) => setPlan({ wish: e.target.value })} /></label>
            <div className="bp-grid2">
              <label className={inputClass("name")}><span>Your name</span>
                <input type="text" name="name" autoComplete="name" required value={form.name} onChange={(e) => set({ name: e.target.value })} /></label>
              <label className={inputClass("email")}><span>Email</span>
                <input type="email" name="email" autoComplete="email" required value={form.email} onChange={(e) => set({ email: e.target.value })} /></label>
            </div>
            <label className="bp-input"><span>Phone or WhatsApp <small>(optional)</small></span>
              <input type="tel" name="phone" autoComplete="tel" value={form.phone} onChange={(e) => set({ phone: e.target.value })} /></label>
            <label className="check">
              <input type="checkbox" name="founding" checked={form.founding} onChange={(e) => set({ founding: e.target.checked })} />
              <span>Apply my founding client discount (20% off, in exchange for an honest review)</span>
            </label>
            <input type="text" name="_gotcha" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form._gotcha} onChange={(e) => set({ _gotcha: e.target.value })} />
            {bad.length > 0 && (
              <p className="bp-error" role="alert">{bad.includes("name") ? "Please tell us your name." : "Please enter a valid email so we can send you the price."}</p>
            )}
            <button className={`btn btn--primary btn--block${loading ? " is-loading" : ""}`} type="submit" disabled={loading}>
              <span className="btn__label">Request price</span><span className="spinner" aria-hidden="true"></span>
            </button>
          </form>
        </>
      ) : (
        <div className="bp-done">
          <div className="bp-done__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{done.mail ? <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></> : <path d="M5 12.5 10 17l9-10" />}</svg>
          </div>
          {done.mail ? (
            <>
              <h2>Almost there, {done.name}!</h2>
              <p>Your request is ready in a new email. Press <b>Send</b> in your email app to send it to us. If nothing opened, write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
              <button type="button" className="btn btn--primary" onClick={() => openMailClient(done.mail!.subject, done.mail!.body)}>Open the email again</button>
              <button type="button" className="btn btn--ghost" onClick={() => setDone(null)}>Back to my plan</button>
            </>
          ) : (
            <>
              <h2>Request sent!</h2>
              <p>Thanks, {done.name}. We&apos;ll look at your wishes and email you the price, an invoice and all the information within one business day.</p>
              <Link href="/" className="btn btn--ghost">Back to Luna Digital</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
