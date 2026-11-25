/* Static homepage sections (server components: no JavaScript sent to the browser). */
import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { CONTACT_EMAIL, FOUNDING } from "@/lib/site";
import { ClaimFoundingButton, FoundingSpots } from "./FoundingCard";
import { MoonBadge } from "./MoonBadge";

const Check = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17l9-10" /></svg>;

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true"></div>
      <div className="container hero__center">
        <Reveal as="a" className="badge" href="#founding">
          <MoonBadge />
          <span className="badge__arrow" aria-hidden="true">→</span>
        </Reveal>
        <Reveal as="h1" className="hero__title">Websites that bring you more <em>bookings</em></Reveal>
        <Reveal as="p" className="hero__lead">
          Beautiful websites for holiday rentals, guesthouses and small businesses, with online booking, calendars synced
          with Airbnb &amp; Booking.com, and clear prices from €200.
        </Reveal>
        <Reveal className="hero__ctas">
          <Link href="/builder" className="btn btn--primary btn--lg">Plan your website <span aria-hidden="true">→</span></Link>
          <a href="#work" className="btn btn--ghost btn--lg">See services &amp; prices</a>
        </Reveal>
        <Reveal as="ul" className="trust">
          <li><Check />Fixed prices from €200</li>
          <li><Check />Live in 1–3 weeks</li>
          <li><Check />30 days of free help</li>
        </Reveal>
      </div>

      {/* Product showcase */}
      <div className="container">
        <Reveal className="showcase" aria-hidden="true">
          <div className="sc-browser">
            <div className="sc-bar"><i></i><i></i><i></i><span>🔒 villaolive.com</span></div>
            <div className="sc-site">
              <div className="sc-nav"><b>Villa Olive</b><span>Gallery</span><span>Availability</span><span>Reviews</span><span className="sc-btn">Book now</span></div>
              <div className="sc-hero">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="sc-hero__img" src="https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?auto=format&fit=crop&w=1600&q=70" alt="" fetchPriority="high" />
                <div className="sc-hero__txt"><small>📍 Lake Ohrid</small><strong>Villa Olive</strong><span>Your private villa, with room for everyone.</span></div>
              </div>
              <div className="sc-row">
                <div className="sc-cal">
                  <span className="sc-label">Availability · December</span>
                  <div className="sc-grid">
                    {"..bb....b..sss..bbb..".split("").map((c, i) => (
                      <i key={i} className={c === "b" ? "b" : c === "s" ? "s" : undefined} />
                    ))}
                  </div>
                </div>
                <div className="sc-book"><b>€80</b><small>/ night</small><div className="sc-lines"><span>3 nights</span><span>€240</span></div><span className="sc-btn sc-btn--full">Pay €260 &amp; book</span></div>
              </div>
            </div>
          </div>
          <div className="sc-float sc-float--a">
            <span className="sc-ico sc-ico--green"><svg viewBox="0 0 24 24"><path d="M5 12.5 10 17l9-10" /></svg></span>
            <span><b>New booking</b><small>Anna · 3 nights · €260</small></span>
          </div>
          <div className="sc-float sc-float--b">
            <span className="sc-ico"><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2M20 4v5h-5M4 20v-5h5" /></svg></span>
            <span><b>Calendars synced</b><small>Airbnb · Booking.com</small></span>
          </div>
          <div className="sc-float sc-float--c">
            <span className="sc-stars">★★★★★</span><small>“Even better than the photos”</small>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Included() {
  const items = ["Mobile-friendly", "Google-ready", "Secure https", "Fast loading", "You own everything", "Plain-language updates"];
  return (
    <section className="included" aria-label="Included in every project">
      <div className="container included__inner">
        <span className="included__label">Included in every project</span>
        <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>
      </div>
    </section>
  );
}

export function PlannerPromo() {
  const steps = ["Your place", "Pick a style", "Choose sections", "Extras", "Request your price"];
  return (
    <section className="section" id="planner">
      <div className="container">
        <Reveal className="promo">
          <div className="promo__copy">
            <p className="eyebrow eyebrow--light">Website planner</p>
            <h2>Have a rental? Design your website in <em>2 minutes</em>.</h2>
            <p className="promo__sub">Pick a style, switch on a gallery, calendar or online booking, and watch your future website build itself. Tell us your wish, request the price, and we&apos;ll email it to you. No sign-up.</p>
            <ol className="promo__steps">{steps.map((s, i) => <li key={s}><b>{i + 1}</b>{s}</li>)}</ol>
            <Link href="/builder" className="btn btn--light btn--lg">Start planning <span aria-hidden="true">→</span></Link>
          </div>
          <Link href="/builder" className="promo__visual" aria-label="Open the website planner">
            <div className="pm">
              <div className="pm__panel">
                <span className="pm__step">Step 3 of 5</span>
                <b>Choose your sections</b>
                {[["Photo gallery", true], ["Availability calendar", true], ["Online booking", true], ["Guest reviews", false]].map(([label, on]) => (
                  <div key={label as string} className={`pm__toggle${on ? " is-on" : ""}`}><span>{label}</span><i></i></div>
                ))}
                <div className="pm__total"><small>Your website</small><b>4 sections</b></div>
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

export function Story() {
  const site = "https://seaandskivillas.com/";
  /* eslint-disable @next/next/no-img-element */
  return (
    <section className="section" id="story">
      <div className="container">
        <Reveal as="header" className="section__head">
          <p className="eyebrow">Success story</p>
          <h2>Built by Luna: <em>Sea &amp; Ski Villas</em></h2>
          <p className="section__sub">A real direct-booking website we designed and built for a host with two holiday houses.</p>
        </Reveal>
        <Reveal className="story">
          <a className="story__visual" href={site} target="_blank" rel="noopener" aria-label="Open seaandskivillas.com in a new tab">
            <span className="story__live"><span className="story__dot"></span>Live website</span>
            <div className="story__browser">
              <div className="sc-bar"><i></i><i></i><i></i><span>🔒 seaandskivillas.com</span></div>
              <div className="story__promo">Book direct, save 10% →</div>
              <div className="story__split">
                <img className="story__img story__img--ski" src="https://seaandskivillas.com/_next/image?url=%2Fphotos%2Fgate%2Fbansko.jpg&w=1080&q=75" alt="Villa Kaja, a ski chalet in Bansko" loading="lazy" />
                <img className="story__img story__img--sea" src="https://seaandskivillas.com/_next/image?url=%2Fphotos%2Fgate%2Fsea.jpg&w=1080&q=75" alt="Jani's Beach House by the sea in Greece" loading="lazy" />
                <div className="story__logo"><img src="https://seaandskivillas.com/brand/mark-light.svg" alt="" loading="lazy" /><b>SEA &amp; SKI</b><small>Coast. Mountains. Your escape.</small></div>
                <div className="story__cap story__cap--l"><small>SKI · WINTER</small><b>Villa Kaja</b></div>
                <div className="story__cap story__cap--r"><small>SEA · SUMMER</small><b>Jani&apos;s Beach House</b></div>
              </div>
            </div>
          </a>
          <div className="story__copy">
            <p className="story__lead">Two private holiday houses, one host: a ski chalet in Bansko, Bulgaria, and a beach house near Thessaloniki, Greece. Guests book directly with the host and pay 10% less than on booking platforms.</p>
            <h3 className="story__h">What we built</h3>
            <ul className="checks">
              <li>A split homepage that shows both houses at a glance</li>
              <li>Live availability, with the direct price shown next to the platform price</li>
              <li>Secure card deposits with Stripe: 50% now, the rest on arrival</li>
              <li>Booking requests the host confirms within 48 hours</li>
              <li>Photo galleries and full details for each house</li>
            </ul>
            <div className="story__facts">
              <div><b>2</b><span>houses</span></div>
              <div><b>2</b><span>countries</span></div>
              <div><b>Stripe</b><span>secure payments</span></div>
            </div>
            <div className="story__ctas">
              <a href={site} target="_blank" rel="noopener" className="btn btn--primary">Visit the live site <span aria-hidden="true">↗</span></a>
              <Link href="/builder" className="btn btn--ghost">Plan a site like this</Link>
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

export function Why() {
  return (
    <section className="section" id="why">
      <div className="container">
        <Reveal as="header" className="section__head">
          <p className="eyebrow">Why Luna</p>
          <h2>Simple, honest, <em>built to work</em></h2>
        </Reveal>
        <div className="bento">
          <Reveal className="bento__card bento__card--wide">
            <p className="bento__lead">No tech talk and no surprises. You tell us what you need, we explain it in plain words and build it properly.</p>
            <ul className="checks">
              <li>You talk directly to the person building your site</li>
              <li>A fixed price agreed before we start, no hidden costs</li>
              <li>The website is 100% yours when it&apos;s done</li>
              <li>30 days of free help after launch</li>
            </ul>
          </Reveal>
          {PERKS.map((p, i) => (
            <Reveal key={p.title} className="bento__card perk" index={i + 1}>
              <span className="perk__icon" aria-hidden="true"><svg viewBox="0 0 24 24">{p.icon}</svg></span>
              <b>{p.title}</b>
              <p>{p.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const NUMBER_WORDS = ["No", "One", "Two", "Three", "Four", "Five"];

export function Founding() {
  const left = FOUNDING.total - FOUNDING.taken;
  return (
    <section className="section" id="founding">
      <div className="container">
        <Reveal className="band">
          <div className="band__glow" aria-hidden="true"></div>
          <div className="founding">
            <div className="founding__copy">
              <p className="eyebrow">Founding clients</p>
              <h2>Be one of our <em>first five</em></h2>
              <p className="founding__sub">
                Luna Digital is new, and we&apos;d rather say so than pretend otherwise. We&apos;re taking on <b>five founding clients at 20% off</b> any
                project. In return we ask for one thing: an honest review when we&apos;re done.{" "}
                <b>
                  {NUMBER_WORDS[FOUNDING.taken]} spot{FOUNDING.taken === 1 ? " is" : "s are"} already taken, so only {NUMBER_WORDS[left].toLowerCase()} {left === 1 ? "is" : "are"} left.
                </b>
              </p>
              <ul className="checks">
                <li>20% off the full project quote</li>
                <li>A direct line to the people building it, no account managers</li>
                <li>Priority scheduling and obsessive attention to detail</li>
                <li>Your project featured in our portfolio (only with your OK)</li>
              </ul>
              <div className="hero__ctas">
                <ClaimFoundingButton />
                <a href="#work" className="btn btn--outline-light">See prices</a>
              </div>
            </div>
            <aside className="founding__card">
              <p className="result__label">Founding spots</p>
              <FoundingSpots />
              <div className="founding__deal">
                <div><span>You get</span><b>20% off</b></div>
                <div><span>We ask for</span><b>An honest review</b></div>
              </div>
              <p className="result__note">Honest means honest: good or bad, in your own words. Your discount never depends on what you write.</p>
            </aside>
          </div>
        </Reveal>
        {/* REAL CLIENT REVIEWS: add Frosina's review here (only once approved) */}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <a href="#top" className="logo"><LogoMark /><span>Luna Digital</span></a>
          <p className="footer__tag">Booking websites for rentals and small businesses.</p>
        </div>
        <nav className="footer__links" aria-label="Footer">
          <Link href="/builder">Website planner</Link>
          <a href="#story">Our work</a>
          <a href="#work">Services &amp; prices</a>
          <a href="#founding">Founding offer</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Luna Digital · <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></span>
        <a href="#top" className="to-top">Back to top ↑</a>
      </div>
    </footer>
  );
}
