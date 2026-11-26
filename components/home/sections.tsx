/* Static homepage sections (server components: no JavaScript sent to the browser). */
import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LogoMark } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { Rich } from "@/components/Rich";
import { getI18n } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { CONTACT_EMAIL, FOUNDING, unsplash } from "@/lib/site";
import { ClaimFoundingButton, FoundingSpots } from "./FoundingCard";
import { MoonBadge } from "./MoonBadge";

const Check = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17l9-10" /></svg>;

export function Hero({ locale }: { locale: Locale }) {
  const { t, href } = getI18n(locale);
  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true"></div>
      <div className="container hero__center">
        {/* No <Reveal> here: it hides content until JavaScript runs, which delays the first paint of the main text */}
        <a className="badge" href="#founding">
          <MoonBadge />
          <span className="badge__arrow" aria-hidden="true">→</span>
        </a>
        <h1 className="hero__title"><Rich text={t("Booking websites for <em>holiday rentals</em>")} /></h1>
        <p className="hero__lead">
          {t("Websites that bring you more direct bookings, for villas, apartments, guesthouses and small businesses. With online booking, calendars synced with Airbnb & Booking.com, and a fixed price agreed before we start.")}
        </p>
        <div className="hero__ctas">
          <Link href={href("/builder")} className="btn btn--primary btn--lg">{t("Plan your website")}{" "}<span aria-hidden="true">→</span></Link>
          <a href="#work" className="btn btn--ghost btn--lg">{t("See services & prices")}</a>
        </div>
        <ul className="trust">
          <li><Check />{t("Fixed price before we start")}</li>
          <li><Check />{t("Live in 1–3 weeks")}</li>
          <li><Check />{t("30 days of free help")}</li>
        </ul>
      </div>

      {/* Product showcase */}
      <div className="container">
        <div className="showcase" aria-hidden="true">
          <div className="sc-browser">
            <div className="sc-bar"><i></i><i></i><i></i><span>🔒 villaolive.com</span></div>
            <div className="sc-site">
              <div className="sc-nav"><b>Villa Olive</b><span>{t("Gallery")}</span><span>{t("Availability")}</span><span>{t("Reviews")}</span><span className="sc-btn">{t("Book now")}</span></div>
              <div className="sc-hero">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="sc-hero__img" src="https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?auto=format&fit=crop&w=1600&q=70" srcSet={[480, 800, 1200, 1600].map((w) => `${unsplash("1613977257365-aaae5a9817ff", w)} ${w}w`).join(", ")} sizes="(max-width: 1040px) 100vw, 1000px" alt="" fetchPriority="high" />
                <div className="sc-hero__txt"><small>{t("📍 Lake Ohrid")}</small><strong>Villa Olive</strong><span>{t("Your private villa, with room for everyone.")}</span></div>
              </div>
              <div className="sc-row">
                <div className="sc-cal">
                  <span className="sc-label">{t("Availability · December")}</span>
                  <div className="sc-grid">
                    {"..bb....b..sss..bbb..".split("").map((c, i) => (
                      <i key={i} className={c === "b" ? "b" : c === "s" ? "s" : undefined} />
                    ))}
                  </div>
                </div>
                <div className="sc-book"><b>€80</b><small>{t("/ night")}</small><div className="sc-lines"><span>{t("3 nights")}</span><span>€240</span></div><span className="sc-btn sc-btn--full">{t("Pay €{total} & book", { total: 260 })}</span></div>
              </div>
            </div>
          </div>
          <div className="sc-float sc-float--a">
            <span className="sc-ico sc-ico--green"><svg viewBox="0 0 24 24"><path d="M5 12.5 10 17l9-10" /></svg></span>
            <span><b>{t("New booking")}</b><small>{t("Anna · 3 nights · €260")}</small></span>
          </div>
          <div className="sc-float sc-float--b">
            <span className="sc-ico"><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2M20 4v5h-5M4 20v-5h5" /></svg></span>
            <span><b>{t("Calendars synced")}</b><small>Airbnb · Booking.com</small></span>
          </div>
          <div className="sc-float sc-float--c">
            <span className="sc-stars">★★★★★</span><small>{t("“Even better than the photos”")}</small>
          </div>
        </div>
        <p className="showcase__note">{t("Villa Olive is an example we made, not a real client.")}</p>
      </div>
    </section>
  );
}

export function Included({ locale }: { locale: Locale }) {
  const { t } = getI18n(locale);
  const items = ["Mobile-friendly", "Google basics set up", "Secure https", "Fast loading", "You own everything", "Plain-language updates"];
  return (
    <section className="included" aria-label={t("Included in every project")}>
      <div className="container included__inner">
        <span className="included__label">{t("Included in every project")}</span>
        <ul>{items.map((i) => <li key={i}>{t(i)}</li>)}</ul>
      </div>
    </section>
  );
}

export function PlannerPromo({ locale }: { locale: Locale }) {
  const { t, href } = getI18n(locale);
  const steps = ["Your place", "Pick a style", "Choose sections", "Extras", "Request your price"];
  return (
    <section className="section" id="planner">
      <div className="container">
        <Reveal className="promo">
          <div className="promo__copy">
            <p className="eyebrow eyebrow--light">{t("Website planner")}</p>
            <h2><Rich text={t("Have a rental? Design your website in <em>2 minutes</em>.")} /></h2>
            <p className="promo__sub">{t("Pick a style, switch on a gallery, calendar or online booking, and watch your future website build itself. Tell us your wish, request the price, and we'll email it to you. No sign-up.")}</p>
            <ol className="promo__steps">{steps.map((s, i) => <li key={s}><b>{i + 1}</b>{t(s)}</li>)}</ol>
            <Link href={href("/builder")} className="btn btn--light btn--lg">{t("Start planning")}{" "}<span aria-hidden="true">→</span></Link>
          </div>
          <Link href={href("/builder")} className="promo__visual" aria-label={t("Open the website planner")}>
            <div className="pm">
              <div className="pm__panel">
                <span className="pm__step">{t("Step 3 of 5")}</span>
                <b>{t("Choose your sections")}</b>
                {[["Photo gallery", true], ["Availability calendar", true], ["Online booking", true], ["Guest reviews", false]].map(([label, on]) => (
                  <div key={label as string} className={`pm__toggle${on ? " is-on" : ""}`}><span>{t(label as string)}</span><i></i></div>
                ))}
                <div className="pm__total"><small>{t("Your website")}</small><b>{t("4 sections")}</b></div>
              </div>
              <div className="pm__preview">
                <div className="pm__hero"></div>
                <div className="pm__lines"><i></i><i></i><i></i></div>
                <div className="pm__tiles"><i></i><i></i><i></i></div>
              </div>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function Story({ locale }: { locale: Locale }) {
  const { t, href } = getI18n(locale);
  const site = "https://seaandskivillas.com/";
  /* eslint-disable @next/next/no-img-element */
  return (
    <section className="section" id="story">
      <div className="container">
        <Reveal as="header" className="section__head">
          <p className="eyebrow">{t("Success story")}</p>
          <h2><Rich text={t("Built by Luna: <em>Sea & Ski Villas</em>")} /></h2>
          <p className="section__sub">{t("A real direct-booking website we designed and built for a host with two holiday houses.")}</p>
        </Reveal>
        <Reveal className="story">
          <a className="story__visual" href={site} target="_blank" rel="noopener" aria-label={t("Open seaandskivillas.com in a new tab")}>
            <span className="story__live"><span className="story__dot"></span>{t("Live website")}</span>
            <div className="story__browser">
              <div className="sc-bar"><i></i><i></i><i></i><span>🔒 seaandskivillas.com</span></div>
              <div className="story__promo">{t("Book direct, save 10% →")}</div>
              <div className="story__split">
                <img className="story__img story__img--ski" src="https://seaandskivillas.com/_next/image?url=%2Fphotos%2Fgate%2Fbansko.jpg&w=1080&q=75" alt={t("Villa Kaja, a ski chalet in Bansko")} loading="lazy" />
                <img className="story__img story__img--sea" src="https://seaandskivillas.com/_next/image?url=%2Fphotos%2Fgate%2Fsea.jpg&w=1080&q=75" alt={t("Jani's Beach House by the sea in Greece")} loading="lazy" />
                <div className="story__logo"><img src="https://seaandskivillas.com/brand/mark-light.svg" alt="" loading="lazy" /><b>SEA &amp; SKI</b><small>{t("Coast. Mountains. Your escape.")}</small></div>
                <div className="story__cap story__cap--l"><small>{t("SKI · WINTER")}</small><b>Villa Kaja</b></div>
                <div className="story__cap story__cap--r"><small>{t("SEA · SUMMER")}</small><b>Jani&apos;s Beach House</b></div>
              </div>
            </div>
          </a>
          <div className="story__copy">
            <p className="story__lead">{t("Two private holiday houses, one host: a ski chalet in Bansko, Bulgaria, and a beach house near Thessaloniki, Greece. Guests book directly with the host and pay 10% less than on booking platforms.")}</p>
            <h3 className="story__h">{t("What we built")}</h3>
            <ul className="checks">
              <li>{t("A split homepage that shows both houses at a glance")}</li>
              <li>{t("Live availability, with the direct price shown next to the platform price")}</li>
              <li>{t("Secure card deposits with Stripe: 50% now, the rest on arrival")}</li>
              <li>{t("Booking requests the host confirms within 48 hours")}</li>
              <li>{t("Photo galleries and full details for each house")}</li>
            </ul>
            <div className="story__facts">
              <div><b>2</b><span>{t("houses")}</span></div>
              <div><b>2</b><span>{t("countries")}</span></div>
              <div><b>Stripe</b><span>{t("secure payments")}</span></div>
            </div>
            <div className="story__ctas">
              <a href={site} target="_blank" rel="noopener" className="btn btn--primary">{t("Visit the live site")}{" "}<span aria-hidden="true">↗</span></a>
              <Link href={href("/builder")} className="btn btn--ghost">{t("Plan a site like this")}</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const PERKS = [
  { title: "Fast", text: "Opens in a blink, even on a slow phone connection.", icon: <path d="M13 2 4 14h7l-1 8 9-12h-7z" /> },
  { title: "Works on every screen", text: "Looks right on phones, tablets and computers.", icon: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></> },
  { title: "Easy to find on Google", text: "Set up so people searching for you actually find you.", icon: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></> },
  { title: "Safe and secure", text: "A secure connection (the padlock) and spam protection built in.", icon: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></> },
];

export function Why({ locale }: { locale: Locale }) {
  const { t } = getI18n(locale);
  return (
    <section className="section" id="why">
      <div className="container">
        <Reveal as="header" className="section__head">
          <p className="eyebrow">{t("Why Luna")}</p>
          <h2><Rich text={t("Simple, honest, <em>built to work</em>")} /></h2>
        </Reveal>
        <div className="bento">
          <Reveal className="bento__card bento__card--wide">
            <p className="bento__lead">{t("No tech talk and no surprises. You tell us what you need, we explain it in plain words and build it properly.")}</p>
            <ul className="checks">
              <li>{t("You talk directly to the person building your site")}</li>
              <li>{t("A fixed price agreed before we start, no hidden costs")}</li>
              <li>{t("The website is 100% yours when it's done")}</li>
              <li>{t("30 days of free help after launch")}</li>
            </ul>
          </Reveal>
          {PERKS.map((p, i) => (
            <Reveal key={p.title} className="bento__card perk" index={i + 1}>
              <span className="perk__icon" aria-hidden="true"><svg viewBox="0 0 24 24">{p.icon}</svg></span>
              <b>{t(p.title)}</b>
              <p>{t(p.text)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Answers repeat what the site already promises; keep them in step with the planner and Work.tsx. */
const FAQS = [
  { q: "Do I need my own website if I'm already on Airbnb or Booking.com?", a: "You can keep your listings. Your own website is one more way for guests to find you and book with you directly, without paying platform commission on those bookings." },
  { q: "Will my calendar stay in sync with Airbnb and Booking.com?", a: "Yes, if you choose calendar sync. It connects your calendars, so dates booked in one place are blocked in the others. Platforms can take some time to pick up a change, so we explain how it works before launch." },
  { q: "Can guests book and pay on my website?", a: "Yes, with the online booking option guests can book and pay by card. If you prefer, you can start with an availability calendar and a contact form, and add online booking later." },
  { q: "How much does a rental website cost?", a: "It depends on what you need. Choose your sections in the planner and we email you a price within one business day. Asking is free, and the final price is fixed before we start." },
  { q: "Is there a monthly fee?", a: "The website itself is a one-time project. Domain and hosting have a running cost, and a monthly care plan with updates and small changes is optional. Card payment providers also charge their own fees." },
  { q: "How long does it take?", a: "Most websites are live in 1 to 3 weeks. Your quote includes the timing for your project." },
  { q: "Can my website be in more than one language?", a: "Yes. Choose the languages option in the planner and tell us which languages your guests speak." },
  { q: "Who owns the website?", a: "You do. The website is 100% yours when it's done, and 30 days of free help after launch are included." },
];

export function Faq({ locale }: { locale: Locale }) {
  const { t } = getI18n(locale);
  return (
    <section className="section" id="faq">
      <div className="container faq">
        <Reveal as="header" className="section__head">
          <p className="eyebrow">{t("FAQ")}</p>
          <h2><Rich text={t("Questions hosts <em>ask us</em>")} /></h2>
        </Reveal>
        <div className="faq__list">
          {FAQS.map((f) => (
            <details key={f.q}>
              <summary>{t(f.q)}</summary>
              <p>{t(f.a)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Founding({ locale }: { locale: Locale }) {
  const { t } = getI18n(locale);
  return (
    <section className="section" id="founding">
      <div className="container">
        <Reveal className="band">
          <div className="band__glow" aria-hidden="true"></div>
          <div className="founding">
            <div className="founding__copy">
              <p className="eyebrow">{t("Founding clients")}</p>
              <h2><Rich text={t("Be one of our <em>first five</em>")} /></h2>
              <p className="founding__sub">
                <Rich text={t("Luna Digital is new, and we'd rather say so than pretend otherwise. We're taking on <b>five founding clients at 20% off</b> any project. In return we ask for one thing: an honest review when we're done.")} />{" "}
                <b>{t("{taken} of {total} spots are already taken.", FOUNDING)}</b>
              </p>
              <ul className="checks">
                <li>{t("20% off the full project quote")}</li>
                <li>{t("A direct line to the people building it, no account managers")}</li>
                <li>{t("Priority scheduling and obsessive attention to detail")}</li>
                <li>{t("Your project featured in our portfolio (only with your OK)")}</li>
              </ul>
              <div className="hero__ctas">
                <ClaimFoundingButton />
                <a href="#work" className="btn btn--outline-light">{t("See prices")}</a>
              </div>
            </div>
            <aside className="founding__card">
              <p className="result__label">{t("Founding spots")}</p>
              <FoundingSpots />
              <div className="founding__deal">
                <div><span>{t("You get")}</span><b>{t("20% off")}</b></div>
                <div><span>{t("We ask for")}</span><b>{t("An honest review")}</b></div>
              </div>
              <p className="result__note">{t("Honest means honest: good or bad, in your own words. Your discount never depends on what you write.")}</p>
            </aside>
          </div>
        </Reveal>
        {/* REAL CLIENT REVIEWS: add Frosina's review here (only once approved) */}
      </div>
    </section>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  const { t, href } = getI18n(locale);
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <a href={href("/")} className="logo"><LogoMark /><span>Luna Digital</span></a>
          <p className="footer__tag">{t("Booking websites for rentals and small businesses.")}</p>
        </div>
        <nav className="footer__links" aria-label={t("Footer")}>
          <Link href={href("/builder")}>{t("Website planner")}</Link>
          <a href={href("/#story")}>{t("Our work")}</a>
          <a href={href("/#work")}>{t("Services & prices")}</a>
          <a href={href("/#founding")}>{t("Founding offer")}</a>
          <a href={href("/#faq")}>{t("FAQ")}</a>
          <a href={href("/#contact")}>{t("Contact")}</a>
          <Link href={href("/privacy")}>{t("Privacy")}</Link>
          <LanguageSwitcher />
        </nav>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Luna Digital · <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></span>
        <a href="#top" className="to-top">{t("Back to top ↑")}</a>
      </div>
    </footer>
  );
}
