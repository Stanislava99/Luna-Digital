"use client";

/* The live, clickable preview of the guest's future website. */
import {
  createContext, useContext, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState,
  type CSSProperties, type ReactNode, type Ref,
} from "react";
import { useToast } from "@/components/Toast";
import { prefersReducedMotion, unsplash } from "@/lib/site";
import { BASE_AMEN, FONTS, GUIDE_PHOTOS, PHOTOS, T, THEMES, TYPES, type Lang, type SectionId } from "./data";
import { hasSection, placeLoc, placeName, slug, type Plan } from "./plan";

export type PreviewHandle = {
  /** Scroll the preview to a section and briefly highlight it. */
  flash: (sec: SectionId) => void;
  scrollToTop: (smooth?: boolean) => void;
};

type Demo = { lang: Lang; monthOffset: number; start: number | null; end: number | null; guests: number; booked: boolean; lightbox: number | null; chatOpen: boolean };
const INITIAL_DEMO: Demo = { lang: "en", monthOffset: 0, start: null, end: null, guests: 2, booked: false, lightbox: null, chatOpen: false };

/* Sections that appear after the first render get a fade-in */
const AnimateNew = createContext(false);
function Sec({ id, alt, children }: { id: SectionId; alt?: boolean; children: ReactNode }) {
  const animate = useContext(AnimateNew);
  const [isNew] = useState(animate);
  return (
    <section className={`pv-sec${alt ? " pv-sec--alt" : ""}${isNew ? " is-new" : ""}`} data-sec={id}>
      <div className="pv-wrap">{children}</div>
    </section>
  );
}

export function Preview({ plan, ref }: { plan: Plan; ref: Ref<PreviewHandle> }) {
  const toast = useToast();
  const [demo, setDemoState] = useState<Demo>(INITIAL_DEMO);
  const setDemo = (patch: Partial<Demo>) => setDemoState((d) => ({ ...d, ...patch }));
  const pvRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [lbBox, setLbBox] = useState({ top: 0, height: 0 });

  const scroller = () => pvRef.current?.parentElement ?? null;
  const has = (id: Parameters<typeof hasSection>[1]) => hasSection(plan, id);

  useEffect(() => setMounted(true), []);

  function flash(sec: SectionId) {
    requestAnimationFrame(() => {
      const el = pvRef.current?.querySelector<HTMLElement>(`[data-sec="${sec}"]`);
      const sc = scroller();
      if (!el || !sc) return;
      if (sec !== "chat") sc.scrollTo({ top: sec === "top" ? 0 : el.offsetTop - 58, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      el.classList.remove("flash");
      void el.offsetWidth; // restart the animation
      el.classList.add("flash");
    });
  }

  useImperativeHandle(ref, () => ({
    flash,
    scrollToTop(smooth = true) {
      scroller()?.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
    },
  }));

  // Changing the type of place closes the photo viewer
  useEffect(() => setDemo({ lightbox: null }), [plan.type]);
  // Switching the WhatsApp button on shows its greeting
  const chatOn = plan.features.includes("chat");
  useEffect(() => { if (chatOn) setDemo({ chatOpen: true }); }, [chatOn]);

  // Photo viewer covers only the visible part of the preview, and stops scrolling behind it
  const lightboxOpen = demo.lightbox !== null && has("gallery");
  useLayoutEffect(() => {
    const sc = scroller();
    if (!sc) return;
    if (lightboxOpen) { setLbBox({ top: sc.scrollTop, height: sc.clientHeight }); sc.style.overflowY = "hidden"; }
    else sc.style.overflowY = "";
  }, [lightboxOpen]);

  const t = TYPES[plan.type];
  const th = THEMES[plan.theme];
  const f = FONTS[plan.font];
  const lang: Lang = has("languages") ? demo.lang : "en";
  const L = T[lang];
  const name = placeName(plan), loc = placeLoc(plan), price = Math.max(10, plan.price || 80);
  const tileBg = (i: number) => `linear-gradient(135deg, ${th.tiles[i % th.tiles.length]}, ${th.tiles[(i + 1) % th.tiles.length]})`;
  const unit = t.unit === "night" ? L.night : t.unit;

  const links = ([
    has("gallery") && ["gallery", L.gallery], has("calendar") && ["book", L.avail], has("reviews") && ["reviews", L.reviews],
    ["map", L.location], has("guide") && ["guide", L.guide], ["contact", L.contact],
  ].filter(Boolean)) as [SectionId, string][];
  const primaryCta: [string, SectionId] = has("booking") ? [L.book, "book"] : has("calendar") ? [L.check, "book"] : [L.contact, "contact"];
  const go = flash;

  const style = {
    "--pv-bg": th.vars.bg, "--pv-surface": th.vars.surface, "--pv-text": th.vars.text, "--pv-muted": th.vars.muted,
    "--pv-primary": th.vars.primary, "--pv-accent": th.vars.accent, "--pv-head": f.head, "--pv-body": f.body,
    "--pv-hw": f.hw, "--pv-radius": th.vars.radius,
  } as CSSProperties;

  const gallery = PHOTOS[plan.type].gallery;
  const guidePhotos = GUIDE_PHOTOS[plan.type === "cabin" ? "nature" : "sea"];

  return (
    <AnimateNew.Provider value={mounted}>
      <div className="pv" ref={pvRef} style={style} data-style={plan.style}>
        {/* NAV */}
        <nav className="pv-nav" data-sec="top">
          <div className="pv-wrap">
            <span className="pv-logo">{name}</span>
            <div className="pv-links">
              {links.map(([id, l]) => <a key={id} onClick={() => go(id)}>{l}</a>)}
              {has("languages") && (
                <span className="pv-lang">
                  {(["en", "de", "it"] as Lang[]).map((l) => (
                    <button key={l} type="button" className={demo.lang === l ? "is-on" : undefined} onClick={() => setDemo({ lang: l })}>{l.toUpperCase()}</button>
                  ))}
                </span>
              )}
              <button type="button" className="pv-btn" onClick={() => go(primaryCta[1])}>{primaryCta[0]}</button>
            </div>
          </div>
        </nav>

        {plan.style === "custom" && (
          <div className="pv-ribbon"><span>✦</span> Your custom design: we&apos;ll plan it together on a call after you send your plan</div>
        )}
        {plan.style === "luna" && (
          <div className="pv-ribbon pv-ribbon--luna"><span>☾</span> Luna will design a unique style for {name}. This is a neutral preview for now</div>
        )}

        {/* HERO */}
        <header className="pv-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="pv-hero__scene"><img src={unsplash(PHOTOS[plan.type].hero, 1600)} alt={`${t.label} photo`} /></div>
          <div className="pv-wrap">
            <span className="pv-hero__loc">📍 {loc}</span>
            <h2>{name}</h2>
            <p>{t.tagline[lang]}</p>
            <div className="pv-hero__cta">
              <button type="button" className="pv-btn" onClick={() => go(primaryCta[1])}>{primaryCta[0]} →</button>
              {has("gallery") && <button type="button" className="pv-btn pv-btn--ghost" onClick={() => go("gallery")}>{L.photos}</button>}
              <span className="pv-hero__price">{L.from} <b>€{price}</b> / {unit}</span>
            </div>
          </div>
        </header>

        {/* ABOUT + AMENITIES */}
        <section className="pv-sec" data-sec="about">
          <div className="pv-wrap pv-about">
            <div>
              <span className="pv-kicker">{L.about}</span><h2>{L.welcome} {name}</h2><p>{t.story}</p>
              <div className="pv-amen" aria-label={L.amen}>{[...t.amen, ...BASE_AMEN].map((a) => <span key={a}>{a}</span>)}</div>
            </div>
            <div className="pv-stats">{t.stats.map(([n, l]) => <div className="pv-stat" key={l}><b>{n}</b><span>{l}</span></div>)}</div>
          </div>
        </section>

        {/* GALLERY */}
        {has("gallery") && (
          <Sec id="gallery" alt>
            <div className="pv-head"><div><span className="pv-kicker">{L.gallery}</span><h2>{L.look}</h2></div><p>Click a photo to open it</p></div>
            <div className="pv-gallery">
              {gallery.map(([id, c], i) => (
                <button key={id} type="button" className="pv-photo" style={{ background: tileBg(i) }} aria-label={`Open photo: ${c}`} onClick={() => setDemo({ lightbox: i })}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={unsplash(id, i === 0 ? 900 : 500)} alt={c} loading="lazy" /><span>{c}</span>
                </button>
              ))}
            </div>
          </Sec>
        )}

        {/* CALENDAR + BOOKING */}
        {has("calendar") && <Booking plan={plan} demo={demo} setDemo={setDemo} L={L} price={price} unit={unit} onAsk={() => go("contact")} onToast={toast} />}

        {/* REVIEWS */}
        {has("reviews") && (
          <Sec id="reviews" alt>
            <div className="pv-head"><div><span className="pv-kicker">{L.reviews}</span><h2>{L.love}</h2></div><span className="pv-score"><b>4.9</b><span className="pv-stars">★★★★★</span></span></div>
            <div className="pv-reviews">
              {[
                ["AK", "Anna, Germany", "Even better than the photos. Spotless, quiet and the hosts thought of everything. We're already planning our next stay!"],
                ["MR", "Marco, Italy", `Perfect location in ${loc}. Check-in was easy and the recommendations were spot on.`],
                ["SL", "Sophie, France", "We felt at home from the first minute. Thank you for the warm welcome and the little extras."],
              ].map(([a, n, q]) => (
                <article className="pv-review" key={a}><span className="pv-stars">★★★★★</span><p>“{q}”</p><footer><span className="pv-avatar">{a}</span>{n}</footer></article>
              ))}
            </div>
          </Sec>
        )}

        {/* MAP (always part of the home page) */}
        <section className="pv-sec" data-sec="map">
          <div className="pv-wrap">
            <div className="pv-head"><div><span className="pv-kicker">{L.location}</span><h2>{loc}</h2></div></div>
            <div className="pv-map">
              <div className="pv-map__img"><MapArt /><span className="pv-pin" aria-hidden="true"></span></div>
              <div className="pv-near">
                <p style={{ fontWeight: 700, color: "var(--pv-text)" }}>{L.nearby}</p>
                {(plan.type === "cabin"
                  ? [["🥾 Hiking trail", "2 min walk"], ["🏞️ Lake", "10 min drive"], ["🛒 Village shop", "5 min drive"], ["🍽️ Mountain restaurant", "8 min drive"]]
                  : [["🏖️ Beach", "5 min walk"], ["🍽️ Restaurants", "2 min walk"], ["🛒 Supermarket", "4 min walk"], ["🚌 Bus stop", "3 min walk"]]
                ).map(([a, b]) => <div key={a}><span>{a}</span><b>{b}</b></div>)}
              </div>
            </div>
          </div>
        </section>

        {/* LOCAL GUIDE */}
        {has("guide") && (
          <Sec id="guide" alt>
            <div className="pv-head"><div><span className="pv-kicker">{L.guide}</span><h2>{L.tips}</h2></div></div>
            <div className="pv-guide">
              {(plan.type === "cabin"
                ? [["Best trails", "Three easy walks with amazing views"], ["Where to eat", "Cosy taverns with local food"], ["Lake day", "Swim, paddle and picnic"]]
                : [["Quiet beaches", "Our favourite spots away from the crowds"], ["Where to eat", "Local places we love"], ["Day trips", `Easy trips from ${loc}`]]
              ).map(([title, d], i) => (
                <article key={title}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <div className="img" style={{ background: tileBg(i + 2) }}><img src={unsplash(guidePhotos[i], 600)} alt={title} loading="lazy" /></div>
                  <div className="txt"><h3>{title}</h3><p>{d}</p></div>
                </article>
              ))}
            </div>
          </Sec>
        )}

        {/* CONTACT */}
        <section className="pv-sec" data-sec="contact">
          <div className="pv-wrap pv-contact">
            <div>
              <span className="pv-kicker">{L.contact}</span><h2>{L.ask}</h2><p>We usually reply within an hour.</p>
              <div className="pv-contact__list">
                <div>✉️ hello@{slug(plan)}.com</div>
                {has("chat") && <div>💬 WhatsApp: tap the green button</div>}
                <div>📍 {loc}</div>
              </div>
            </div>
            <div className="pv-form">
              <div className="fake">Your name</div><div className="fake">Email</div><div className="fake fake--tall">Message</div>
              <button type="button" className="pv-btn" onClick={() => toast("Message sent (demo)")}>Send message</button>
            </div>
          </div>
        </section>
        <footer className="pv-foot">
          © {new Date().getFullYear()} {name} · {loc}<br />
          <small>Example photos from <a href="https://unsplash.com" target="_blank" rel="noopener">Unsplash</a></small>
        </footer>

        {/* WHATSAPP */}
        {has("chat") && (
          <div className="pv-chat" data-sec="chat">
            {demo.chatOpen && <div className="pv-chat__bubble">👋 Hi! This is {name}. How can we help?</div>}
            <button type="button" className="pv-chat__btn" aria-label="Open WhatsApp chat" onClick={() => setDemo({ chatOpen: !demo.chatOpen })}>
              <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.1z" /></svg>
            </button>
          </div>
        )}

        {/* PHOTO VIEWER */}
        {lightboxOpen && demo.lightbox !== null && (
          <div className="pv-lightbox" style={{ top: lbBox.top, bottom: "auto", height: lbBox.height }}
            onClick={(e) => e.target === e.currentTarget && setDemo({ lightbox: null })}>
            <button type="button" className="pv-lightbox__close" aria-label="Close" onClick={() => setDemo({ lightbox: null })}>✕</button>
            <button type="button" className="pv-lightbox__nav pv-lightbox__nav--prev" aria-label="Previous"
              onClick={() => setDemo({ lightbox: (demo.lightbox! - 1 + gallery.length) % gallery.length })}>‹</button>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="pv-lightbox__img" src={unsplash(gallery[demo.lightbox][0], 1400)} alt={gallery[demo.lightbox][1]} />
              <p className="pv-lightbox__cap">{gallery[demo.lightbox][1]} · {demo.lightbox + 1} / {gallery.length}</p>
            </div>
            <button type="button" className="pv-lightbox__nav pv-lightbox__nav--next" aria-label="Next"
              onClick={() => setDemo({ lightbox: (demo.lightbox! + 1) % gallery.length })}>›</button>
          </div>
        )}
      </div>
    </AnimateNew.Provider>
  );
}

/* ---------------- Calendar + booking ---------------- */
const dayKey = (y: number, m: number, d: number) => y * 10000 + (m + 1) * 100 + d;
const toDate = (k: number) => new Date(Math.floor(k / 10000), (Math.floor(k / 100) % 100) - 1, k % 100);
const fmt = (k: number) => toDate(k).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
/** Example booked nights (the same every visit). */
const isBooked = (y: number, m: number, d: number) => (d * 7 + m * 3 + y) % 11 < 3;

function Booking({ plan, demo, setDemo, L, price, unit, onAsk, onToast }: {
  plan: Plan; demo: Demo; setDemo: (p: Partial<Demo>) => void; L: Record<string, string>;
  price: number; unit: string; onAsk: () => void; onToast: (m: string) => void;
}) {
  const has = (id: Parameters<typeof hasSection>[1]) => hasSection(plan, id);
  const today = new Date();
  const first = new Date(today.getFullYear(), today.getMonth() + demo.monthOffset, 1);
  const y = first.getFullYear(), m = first.getMonth();
  const days = new Date(y, m + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7;
  const todayKey = dayKey(today.getFullYear(), today.getMonth(), today.getDate());
  const monthName = first.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  const { start, end } = demo;
  const nights = start && end ? Math.round((toDate(end).getTime() - toDate(start).getTime()) / 864e5) : 0;
  const cleaning = 20;
  const total = nights * price + (nights ? cleaning : 0);

  function pickDay(k: number) {
    if (!start || end || k <= start) { setDemo({ start: k, end: null, booked: false }); return; }
    // Don't allow a stay over booked nights
    for (const d = toDate(start); d < toDate(k); d.setDate(d.getDate() + 1)) {
      if (isBooked(d.getFullYear(), d.getMonth(), d.getDate())) {
        setDemo({ start: k, end: null, booked: false });
        onToast("Those dates include booked nights");
        return;
      }
    }
    setDemo({ end: k, booked: false });
  }

  return (
    <Sec id="book">
      <div className="pv-head">
        <div><span className="pv-kicker">{L.avail}</span><h2>{has("booking") ? L.stay : L.free}</h2></div>
        {has("sync") && <span className="pv-sync">↻ Synced with Airbnb &amp; Booking.com</span>}
      </div>
      <div className="pv-book">
        <div className="pv-cal">
          <div className="pv-cal__head">
            <b>{monthName}</b>
            <div className="pv-cal__nav">
              <button type="button" disabled={demo.monthOffset <= 0} aria-label="Previous month" onClick={() => setDemo({ monthOffset: Math.max(0, demo.monthOffset - 1) })}>‹</button>
              <button type="button" aria-label="Next month" onClick={() => setDemo({ monthOffset: demo.monthOffset + 1 })}>›</button>
            </div>
          </div>
          <div className="pv-cal__grid">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => <span key={d} className="pv-cal__dow">{d}</span>)}
            {Array.from({ length: lead }, (_, i) => <span key={`e${i}`} />)}
            {Array.from({ length: days }, (_, i) => {
              const d = i + 1, k = dayKey(y, m, d), booked = isBooked(y, m, d), past = k < todayKey;
              const cls = [
                "pv-day", booked && "is-booked", start === k && "is-start",
                (end === k || (start === k && !end)) && "is-end", start && end && k > start && k < end && "in-range",
              ].filter(Boolean).join(" ");
              return (
                <button key={k} type="button" className={cls} disabled={booked || past}
                  data-src={booked && has("sync") ? (d % 2 ? "a" : "b") : undefined}
                  aria-label={`${d} ${monthName}${booked ? " (booked)" : ""}`} onClick={() => pickDay(k)}>
                  {d}
                </button>
              );
            })}
          </div>
          <div className="pv-cal__legend">
            <span><i style={{ background: "var(--pv-primary)" }}></i>Your dates</span>
            <span><i style={{ background: "#cbd5e1" }}></i>Booked</span>
            {has("sync") && <><span><i style={{ background: "#ff5a5f" }}></i>From Airbnb</span><span><i style={{ background: "#2563eb" }}></i>From Booking.com</span></>}
          </div>
        </div>

        {has("booking") ? (
          <div className="pv-widget">
            <div className="pv-widget__price"><b>€{price}</b> / {unit}</div>
            <div className="pv-widget__dates">
              <div><small>Check-in</small>{start ? fmt(start) : "Add date"}</div>
              <div><small>Check-out</small>{end ? fmt(end) : "Add date"}</div>
            </div>
            <div className="pv-guests">
              <span>Guests</span>
              <span className="pv-step">
                <button type="button" aria-label="Fewer guests" onClick={() => setDemo({ guests: Math.max(1, demo.guests - 1) })}>−</button>
                <b>{demo.guests}</b>
                <button type="button" aria-label="More guests" onClick={() => setDemo({ guests: Math.min(TYPES[plan.type].maxGuests, demo.guests + 1) })}>+</button>
              </span>
            </div>
            {nights ? (
              <div className="pv-lines">
                <div><span>€{price} × {nights} night{nights > 1 ? "s" : ""}</span><span>€{price * nights}</span></div>
                <div><span>Cleaning</span><span>€{cleaning}</span></div>
                <div><span>Total</span><span>€{total}</span></div>
              </div>
            ) : <p className="pv-note">Pick your dates in the calendar.</p>}
            {demo.booked ? (
              <div className="pv-ok">✓ Booked! Confirmation sent to the guest, and the dates are blocked{has("sync") ? " on Airbnb & Booking.com too" : ""}.</div>
            ) : (
              <button type="button" className="pv-btn" disabled={!nights} onClick={() => setDemo({ booked: true })}>
                {nights ? `Pay €${total} & book` : L.book}
              </button>
            )}
            <div className="pv-pay"><span>VISA</span><span>Mastercard</span><span>Apple Pay</span><span>Google Pay</span></div>
          </div>
        ) : (
          <div className="pv-widget">
            <div className="pv-widget__price"><b>€{price}</b> / {unit}</div>
            {nights && start && end ? <p>{fmt(start)} → {fmt(end)} · {nights} night{nights > 1 ? "s" : ""}</p> : <p className="pv-note">Pick your dates in the calendar.</p>}
            <button type="button" className="pv-btn" disabled={!nights} onClick={onAsk}>Ask about these dates</button>
            <p className="pv-note">Online booking &amp; payments can be added any time.</p>
          </div>
        )}
      </div>
    </Sec>
  );
}

function MapArt() {
  return (
    <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="260" fill="#eef1ec" />
      <path d="M0 190 Q120 170 220 200 T400 180 L400 260 L0 260Z" fill="#a5d8ec" />
      <ellipse cx="80" cy="70" rx="60" ry="38" fill="#cfe8c4" /><ellipse cx="320" cy="90" rx="44" ry="30" fill="#cfe8c4" />
      <g stroke="#fff" strokeWidth="9" fill="none" strokeLinecap="round"><path d="M0 120 H400" /><path d="M200 0 V185" /><path d="M60 0 Q120 120 300 260" /></g>
      <g stroke="#fde68a" strokeWidth="4" fill="none"><path d="M0 120 H400" /></g>
      <g fill="#dfe3dc">{[[230, 30], [250, 60], [140, 140], [260, 140], [300, 40], [120, 20]].map(([x, yy]) => <rect key={`${x}-${yy}`} x={x} y={yy} width="34" height="22" rx="3" />)}</g>
    </svg>
  );
}
