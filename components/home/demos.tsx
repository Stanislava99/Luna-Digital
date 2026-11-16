"use client";

/* Live, clickable mini-examples shown in the price popup (one per project type). */
import { useState, type KeyboardEvent, type ReactNode } from "react";
import { useToast } from "@/components/Toast";

export type ProjectType = "landing" | "website" | "shop" | "webapp" | "mobile" | "custom";

function Browser({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="browser">
      <div className="browser__bar"><i></i><i></i><i></i><span className="browser__url">🔒 {url}</span></div>
      {children}
    </div>
  );
}

const onEnter = (fn: () => void) => (e: KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") { e.preventDefault(); fn(); }
};

/* ---------- Landing page: email signup ---------- */
function LandingDemo() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState(false);
  const [done, setDone] = useState(false);
  const submit = () => (/^\S+@\S+\.\S+$/.test(email) ? setDone(true) : setErr(true));
  return (
    <Browser url="beanandco.com">
      <div className="dm dm--landing">
        <div className="dm-nav"><b>☕ Bean &amp; Co.</b><span className="dm-muted">Open Mon–Sat</span></div>
        <div className="dm-hero">
          <span className="dm-tag">New in town</span>
          <h5>Fresh coffee beans,<br />delivered every Monday.</h5>
          <p>Roasted this week, at your door by 9am.</p>
          {!done && (
            <div className="dm-signup">
              <input type="email" placeholder="your@email.com" aria-label="Email (example)" className={err ? "dm-err" : undefined}
                value={email} onChange={(e) => { setEmail(e.target.value); setErr(false); }} onKeyDown={onEnter(submit)} />
              <button type="button" onClick={submit}>Get 10% off</button>
            </div>
          )}
          {done && <p className="dm-done">🎉 You&apos;re in! The discount code is on its way.</p>}
        </div>
      </div>
    </Browser>
  );
}

/* ---------- Business website: tabs + booking a slot ---------- */
const SLOTS = ["Mon 10:00", "Tue 17:30", "Thu 12:00"];
function WebsiteDemo() {
  const [tab, setTab] = useState("home");
  const [slot, setSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const tabs: [string, string][] = [["home", "Home"], ["about", "About"], ["services", "Prices"], ["contact", "Book"]];
  return (
    <Browser url="smiledental.com">
      <div className="dm dm--site">
        <div className="dm-nav"><b>🦷 Smile Dental</b>
          <nav className="dm-tabs">
            {tabs.map(([id, label]) => (
              <button key={id} type="button" className={tab === id ? "is-on" : undefined} onClick={() => setTab(id)}>{label}</button>
            ))}
          </nav>
        </div>
        {tab === "home" && (
          <div className="dm-page">
            <h5>Gentle care for the whole family.</h5>
            <p>A modern clinic in the city centre, with evening appointments.</p>
            <button type="button" className="dm-btn" onClick={() => setTab("contact")}>Book a visit →</button>
          </div>
        )}
        {tab === "about" && (
          <div className="dm-page"><h5>About us</h5><p>Three dentists who believe a check-up should never be scary. Kids welcome!</p></div>
        )}
        {tab === "services" && (
          <div className="dm-page">
            <h5>Prices</h5>
            <ul className="dm-list"><li>Check-up <b>€20</b></li><li>Cleaning <b>€35</b></li><li>Whitening <b>€90</b></li></ul>
          </div>
        )}
        {tab === "contact" && (
          <div className="dm-page">
            <h5>Pick a time</h5>
            <div className="dm-slots">
              {SLOTS.map((s) => (
                <button key={s} type="button" className={slot === s ? "is-on" : undefined} onClick={() => { setSlot(s); setBooked(false); }}>{s}</button>
              ))}
            </div>
            <button type="button" className="dm-btn" disabled={!slot || booked} onClick={() => setBooked(true)}>Confirm booking</button>
            {booked && <p className="dm-done">✓ Booked for {slot}. See you then!</p>}
          </div>
        )}
      </div>
    </Browser>
  );
}

/* ---------- Online store: cart + checkout ---------- */
const PRODUCTS = [["🪑", "Oak chair", 89], ["💡", "Desk lamp", 45], ["🪴", "Planter", 24]] as const;
function ShopDemo() {
  const [cart, setCart] = useState({ items: 0, total: 0 });
  const [bump, setBump] = useState(0);
  const [ordered, setOrdered] = useState(false);
  const msg = ordered
    ? `✓ Order placed! Confirmation sent (€${cart.total}).`
    : cart.items === 0 ? "Free delivery over €100"
    : cart.total >= 100 ? "✓ Free delivery unlocked" : `€${100 - cart.total} more for free delivery`;
  return (
    <Browser url="orbitandoak.com">
      <div className="dm dm--shop">
        <div className="dm-nav"><b>🌳 Orbit &amp; Oak</b>
          <span key={bump} className={`dm-cart${bump ? " bump" : ""}`}>🛒 {cart.items} item{cart.items === 1 ? "" : "s"} · €{cart.total}</span>
        </div>
        <div className="dm-products">
          {PRODUCTS.map(([em, name, price]) => (
            <div className="dm-prod" key={name}>
              <span className="em">{em}</span><b>{name}</b><span>€{price}</span>
              <button type="button" disabled={ordered}
                onClick={() => { setCart((c) => ({ items: c.items + 1, total: c.total + price })); setBump((b) => b + 1); }}>
                Add to cart
              </button>
            </div>
          ))}
        </div>
        <div className="dm-checkout">
          <span className="dm-muted">{msg}</span>
          <button type="button" className="dm-btn" disabled={!cart.items || ordered} onClick={() => setOrdered(true)}>Checkout</button>
        </div>
      </div>
    </Browser>
  );
}

/* ---------- Web app: chart range + task list ---------- */
const CHART = { week: { kpi: "€4,820", bars: [40, 65, 50, 80, 60, 95, 70] }, month: { kpi: "€19,340", bars: [55, 70, 85, 60, 90, 75, 100] } };
function WebAppDemo() {
  const [range, setRange] = useState<keyof typeof CHART>("week");
  const [tasks, setTasks] = useState([{ text: "Send invoice to Marko", done: false }, { text: "Call the accountant", done: true }]);
  const [draft, setDraft] = useState("");
  const add = () => {
    const text = draft.trim();
    if (!text) return;
    setTasks((t) => [...t, { text, done: false }]);
    setDraft("");
  };
  return (
    <Browser url="app.ledgerly.com">
      <div className="dm dm--app">
        <div className="dm-side" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        <div className="dm-main">
          <div className="dm-row">
            <div><span className="dm-muted">Sales this {range}</span><div className="dm-kpi">{CHART[range].kpi}</div></div>
            <div className="dm-seg">
              {(["week", "month"] as const).map((r) => (
                <button key={r} type="button" className={range === r ? "is-on" : undefined} onClick={() => setRange(r)}>
                  {r === "week" ? "Week" : "Month"}
                </button>
              ))}
            </div>
          </div>
          <div className="dm-bars">{CHART[range].bars.map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}</div>
          <div className="dm-tasks">
            {tasks.map((t, i) => (
              <label key={i}>
                <input type="checkbox" checked={t.done}
                  onChange={() => setTasks((all) => all.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))} />
                <span>{t.text}</span>
              </label>
            ))}
          </div>
          <div className="dm-add">
            <input type="text" placeholder="Add a task…" aria-label="New task (example)" value={draft}
              onChange={(e) => setDraft(e.target.value)} onKeyDown={onEnter(add)} />
            <button type="button" onClick={add}>Add</button>
          </div>
        </div>
      </div>
    </Browser>
  );
}

/* ---------- Mobile app: habits ring ---------- */
const HABITS = ["💧 Drink water", "🚶 10,000 steps", "📖 Read 20 minutes", "🧘 Stretch"];
function MobileDemo() {
  const [done, setDone] = useState<boolean[]>(HABITS.map(() => false));
  const pct = Math.round((done.filter(Boolean).length / HABITS.length) * 100);
  return (
    <div className="phone"><div className="phone__notch"></div>
      <div className="dm dm--mobile">
        <p className="dm-muted dm-center">Good morning, Ana 👋</p>
        <div className="dm-ring" style={{ "--p": pct } as React.CSSProperties}><b>{pct === 100 ? "🎉" : `${pct}%`}</b></div>
        {HABITS.map((h, i) => (
          <button key={h} type="button" className={`dm-habit${done[i] ? " is-done" : ""}`}
            onClick={() => setDone((d) => d.map((x, j) => (j === i ? !x : x)))}>
            <span>{h}</span><span className="tick">✓</span>
          </button>
        ))}
      </div>
      <div className="dm-tabbar" aria-hidden="true"><span>🏠</span><span>📊</span><span>⚙️</span></div>
    </div>
  );
}

/* ---------- Custom software: stock table ---------- */
const STATUSES = [["In stock", "st-ok"], ["Low", "st-low"], ["Out", "st-out"]] as const;
const STOCK = [["Olive oil 1L", 124, 0], ["Honey 500g", 8, 1], ["Ajvar jar", 0, 2], ["Herbal tea", 57, 0], ["Goat cheese", 5, 1]] as const;
function CustomDemo() {
  const toast = useToast();
  const [rows, setRows] = useState(STOCK.map(([name, qty, status]) => ({ name, qty: qty as number, status: status as number })));
  const [q, setQ] = useState("");
  const restock = () => {
    setRows((r) => r.map((x) => (x.status === 0 ? x : { ...x, status: 0, qty: 50 })));
    toast("Restock order sent to supplier (example)");
  };
  return (
    <Browser url="stock.yourcompany.com">
      <div className="dm dm--custom">
        <div className="dm-row dm-pad">
          <input type="text" className="dm-search" placeholder="🔍 Search products…" aria-label="Search products (example)"
            value={q} onChange={(e) => setQ(e.target.value)} />
          <button type="button" className="dm-btn" onClick={restock}>Restock low items</button>
        </div>
        <table className="dm-table">
          <thead><tr><th>Product</th><th>In stock</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((r, i) => {
              const [label, cls] = STATUSES[r.status];
              const match = `${r.name} ${r.qty} ${label}`.toLowerCase().includes(q.toLowerCase());
              return (
                <tr key={r.name} hidden={!match}>
                  <td>{r.name}</td><td>{r.qty}</td>
                  <td>
                    <button type="button" className={`dm-status ${cls}`}
                      onClick={() => setRows((all) => all.map((x, j) => (j === i ? { ...x, status: (x.status + 1) % 3 } : x)))}>
                      {label}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Browser>
  );
}

export const DEMOS: Record<ProjectType, { title: string; example: string; desc: string; hint: string; Demo: () => ReactNode }> = {
  landing: {
    title: "Landing page", example: "Bean & Co. coffee shop",
    desc: "One page with one goal: get visitors to sign up, book or call you. Perfect for a new business, product, event or special offer.",
    hint: "👆 Try it: type an email and press the button.", Demo: LandingDemo,
  },
  website: {
    title: "Business website", example: "Smile Dental clinic",
    desc: "A few pages that present your business: home, about, services and contact. Your shop window on the internet, open 24/7.",
    hint: "👆 Try it: click the menu, then book a visit.", Demo: WebsiteDemo,
  },
  shop: {
    title: "Online store", example: "Orbit & Oak furniture",
    desc: "Sell your products online. Customers browse, add to cart and pay by card, and you get an email for every order.",
    hint: "👆 Try it: add a few things to the cart and check out.", Demo: ShopDemo,
  },
  webapp: {
    title: "Web app", example: "Ledgerly sales dashboard",
    desc: "A tool people log into and use every day in the browser: dashboards, booking systems, client portals, members' areas.",
    hint: "👆 Try it: switch Week / Month, tick a task or add your own.", Demo: WebAppDemo,
  },
  mobile: {
    title: "Mobile app", example: "Daily habits app",
    desc: "An app your customers download from the App Store or Google Play, so your business lives right on their phone.",
    hint: "👆 Try it: tap the habits to complete your day.", Demo: MobileDemo,
  },
  custom: {
    title: "Custom software", example: "Stock manager for a food shop",
    desc: "Software made for the way your business works: stock, orders, staff schedules, reports. It replaces messy spreadsheets and paperwork.",
    hint: "👆 Try it: search, click a status to change it, or restock.", Demo: CustomDemo,
  },
};
