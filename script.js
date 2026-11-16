/* ==========================================================
   Luna Digital — interactions
   ========================================================== */

/* ---- Settings you may want to change ---- */
const CONFIG = {
  // Where the contact form posts (Vercel function in api/contact.js).
  // If it's unreachable or not configured yet, the form opens the visitor's email app instead.
  FORM_ENDPOINT: "/api/contact",
  CONTACT_EMAIL: "contact@lunadigital.pro",
  STUDIO_TIMEZONE: "Europe/Berlin", // used for the "open now" indicator (CET)
  STUDIO_HOURS: { start: 9, end: 18, days: [1, 2, 3, 4, 5] }, // Mon–Fri
  CURRENCY: "EUR",
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

$("#year").textContent = new Date().getFullYear();

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("is-visible"), 2600);
}

/* ---------- Nav: scrolled state, progress bar, mobile menu, active link ---------- */
const nav = $("#nav");
const progress = $(".scroll-progress");
function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("is-scrolled", y > 20);
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const toggle = $("#navToggle");
const links = $("#navLinks");
function setMenu(open) {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  links.classList.toggle("is-open", open);
  document.body.style.overflow = open ? "hidden" : "";
}
toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
$$("a", links).forEach((a) => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      $$(".nav__links a").forEach((a) =>
        a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`)
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
$$("section[id]").forEach((s) => sectionObserver.observe(s));

/* ---------- Starfield ---------- */
(function starfield() {
  const canvas = $("#stars");
  if (!canvas) return; // no starfield in the current design
  const ctx = canvas.getContext("2d");
  let w, h, dpr, stars = [], shooting = null;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    const count = Math.round((innerWidth * innerHeight) / 3200);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 0.8 + 0.2,
      r: (Math.random() * 1.2 + 0.3) * dpr,
      t: Math.random() * Math.PI * 2,
      s: Math.random() * 0.02 + 0.005,
      hue: Math.random() < 0.15 ? 40 : 230,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    const scroll = window.scrollY * dpr;

    for (const s of stars) {
      s.t += s.s;
      const alpha = 0.35 + Math.sin(s.t) * 0.35 + s.z * 0.3;
      let x = s.x + mouse.x * s.z * 30 * dpr;
      let y = (s.y - scroll * s.z * 0.15) % h;
      if (y < 0) y += h;
      ctx.beginPath();
      ctx.arc(x, y, s.r * s.z, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, 80%, 90%, ${Math.max(0, alpha)})`;
      ctx.fill();
    }

    // occasional shooting star
    if (!shooting && Math.random() < 0.004) {
      shooting = { x: Math.random() * w * 0.7, y: Math.random() * h * 0.4, vx: 14 * dpr, vy: 6 * dpr, life: 1 };
    }
    if (shooting) {
      const { x, y, vx, vy, life } = shooting;
      const grad = ctx.createLinearGradient(x, y, x - vx * 8, y - vy * 8);
      grad.addColorStop(0, `rgba(255,255,255,${life})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5 * dpr;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - vx * 8, y - vy * 8);
      ctx.stroke();
      shooting.x += vx; shooting.y += vy; shooting.life -= 0.02;
      if (shooting.life <= 0 || shooting.x > w) shooting = null;
    }
    requestAnimationFrame(draw);
  }

  addEventListener("resize", resize);
  addEventListener("pointermove", (e) => {
    mouse.tx = e.clientX / innerWidth - 0.5;
    mouse.ty = e.clientY / innerHeight - 0.5;
  });
  resize();
  if (reduceMotion) {
    // single static frame
    stars.forEach((s) => { ctx.beginPath(); ctx.arc(s.x, s.y, s.r * s.z, 0, 7); ctx.fillStyle = "rgba(220,225,255,.6)"; ctx.fill(); });
  } else {
    draw();
  }
})();

/* ---------- Real moon phase (tonight) ---------- */
const SYNODIC = 29.530588853;
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14); // reference new moon

function moonPhase(date = new Date()) {
  const days = (date.getTime() - KNOWN_NEW_MOON) / 86400000;
  return (((days / SYNODIC) % 1) + 1) % 1; // 0 = new, 0.5 = full
}
function phaseName(p) {
  if (p < 0.03 || p > 0.97) return "New moon";
  if (p < 0.22) return "Waxing crescent";
  if (p < 0.28) return "First quarter";
  if (p < 0.47) return "Waxing gibbous";
  if (p < 0.53) return "Full moon";
  if (p < 0.72) return "Waning gibbous";
  if (p < 0.78) return "Last quarter";
  return "Waning crescent";
}
// SVG path of the lit part of the moon for phase p
function phasePath(p, cx = 20, cy = 20, r = 16) {
  const c = Math.cos(2 * Math.PI * p);
  const rx = Math.abs(c) * r;
  const waxing = p < 0.5;
  const limbSweep = waxing ? 1 : 0;
  const termSweep = waxing ? (c > 0 ? 0 : 1) : (c > 0 ? 1 : 0);
  return `M${cx} ${cy - r} A${r} ${r} 0 0 ${limbSweep} ${cx} ${cy + r} A${rx} ${r} 0 0 ${termSweep} ${cx} ${cy - r}Z`;
}

(function initMoon() {
  const p = moonPhase();
  const illum = Math.round(((1 - Math.cos(2 * Math.PI * p)) / 2) * 100);
  $("#badgePhase").setAttribute("d", phasePath(p));
  const badge = $("#badgePhase");
  if (badge) badge.closest("svg").setAttribute("aria-label", `Tonight: ${phaseName(p).toLowerCase()}, ${illum}% lit`);

  $$(".phase").forEach((el) => {
    $(".moon-lit", el).setAttribute("d", phasePath(parseFloat(el.dataset.phase)));
  });
})();

/* ---------- Hero word rotator ---------- */
(function rotator() {
  const el = $("#rotator");
  if (!el) return;
  const words = ["dark", "browser", "App Store", "market", "spotlight"];
  let i = 0;
  if (reduceMotion) return;
  setInterval(() => {
    el.classList.add("is-out");
    setTimeout(() => {
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.classList.remove("is-out");
    }, 380);
  }, 2600);
})();

/* ---------- Hero moon parallax + magnetic button ---------- */
const heroMoon = $("#heroMoon");
if (heroMoon && !reduceMotion && matchMedia("(pointer: fine)").matches) {
  addEventListener("pointermove", (e) => {
    const x = (e.clientX / innerWidth - 0.5) * 24;
    const y = (e.clientY / innerHeight - 0.5) * 24;
    heroMoon.style.transform = `translate(${x}px, ${y}px)`;
  });
  $$(".magnetic").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
  });
}

/* ---------- Spotlight cards ---------- */
$$(".spot").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

/* ---------- Count-up numbers ---------- */
function countUp(el) {
  const to = parseFloat(el.dataset.to);
  const dec = parseInt(el.dataset.dec || "0", 10);
  if (reduceMotion) { el.textContent = to.toFixed(dec); return; }
  const dur = 1600;
  const start = performance.now();
  (function tick(now) {
    const k = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - k, 3);
    el.textContent = (to * eased).toFixed(dec);
    if (k < 1) requestAnimationFrame(tick);
  })(start);
}

/* ---------- Score rings ---------- */
function fillScore(el) {
  const score = parseInt(el.dataset.score, 10);
  const circ = 2 * Math.PI * 52;
  $(".score__fg", el).style.strokeDashoffset = circ * (1 - score / 100);
  const b = $("b", el);
  b.dataset.to = score;
  countUp(b);
}

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      // stagger siblings
      const siblings = $$(":scope > .reveal", el.parentElement);
      el.style.transitionDelay = `${Math.max(0, siblings.indexOf(el)) * 80}ms`;
      el.classList.add("is-visible");
      $$(".count", el).forEach(countUp);
      if (el.classList.contains("scores")) $$(".score", el).forEach(fillScore);
      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.15 }
);
$$(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------- Work filters ---------- */
$$(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".filter").forEach((b) => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-selected", String(b === btn));
    });
    const f = btn.dataset.filter;
    $$(".project").forEach((p) => {
      const show = f === "all" || p.dataset.cat === f;
      p.classList.toggle("is-hidden", !show);
      if (show) p.classList.add("is-visible");
    });
  });
});

/* ---------- Live examples (one per project type) ---------- */
const browser = (url, inner) =>
  `<div class="browser"><div class="browser__bar"><i></i><i></i><i></i><span class="browser__url">🔒 ${url}</span></div>${inner}</div>`;

const DEMOS = {
  landing: {
    title: "Landing page",
    example: "Bean & Co. coffee shop",
    desc: "One page with one goal: get visitors to sign up, book or call you. Perfect for a new business, product, event or special offer.",
    hint: "👆 Try it: type an email and press the button.",
    html: () => browser("beanandco.com", `
      <div class="dm dm--landing">
        <div class="dm-nav"><b>☕ Bean &amp; Co.</b><span class="dm-muted">Open Mon–Sat</span></div>
        <div class="dm-hero">
          <span class="dm-tag">New in town</span>
          <h5>Fresh coffee beans,<br>delivered every Monday.</h5>
          <p>Roasted this week, at your door by 9am.</p>
          <div class="dm-signup">
            <input type="email" placeholder="your@email.com" aria-label="Email (example)" data-enter="signup" />
            <button type="button" data-act="signup">Get 10% off</button>
          </div>
          <p class="dm-done" hidden>🎉 You're in! The discount code is on its way.</p>
        </div>
      </div>`),
  },
  website: {
    title: "Business website",
    example: "Smile Dental clinic",
    desc: "A few pages that present your business: home, about, services and contact. Your shop window on the internet, open 24/7.",
    hint: "👆 Try it: click the menu, then book a visit.",
    html: () => browser("smiledental.com", `
      <div class="dm dm--site">
        <div class="dm-nav"><b>🦷 Smile Dental</b>
          <nav class="dm-tabs">
            <button type="button" class="is-on" data-act="tab" data-tab="home">Home</button>
            <button type="button" data-act="tab" data-tab="about">About</button>
            <button type="button" data-act="tab" data-tab="services">Prices</button>
            <button type="button" data-act="tab" data-tab="contact">Book</button>
          </nav>
        </div>
        <div class="dm-page" data-page="home">
          <h5>Gentle care for the whole family.</h5>
          <p>A modern clinic in the city centre, with evening appointments.</p>
          <button type="button" class="dm-btn" data-act="tab" data-tab="contact">Book a visit →</button>
        </div>
        <div class="dm-page" data-page="about" hidden>
          <h5>About us</h5>
          <p>Three dentists who believe a check-up should never be scary. Kids welcome!</p>
        </div>
        <div class="dm-page" data-page="services" hidden>
          <h5>Prices</h5>
          <ul class="dm-list"><li>Check-up <b>€20</b></li><li>Cleaning <b>€35</b></li><li>Whitening <b>€90</b></li></ul>
        </div>
        <div class="dm-page" data-page="contact" hidden>
          <h5>Pick a time</h5>
          <div class="dm-slots">
            <button type="button" data-act="slot">Mon 10:00</button><button type="button" data-act="slot">Tue 17:30</button><button type="button" data-act="slot">Thu 12:00</button>
          </div>
          <button type="button" class="dm-btn" data-act="book" disabled>Confirm booking</button>
          <p class="dm-done" hidden></p>
        </div>
      </div>`),
  },
  shop: {
    title: "Online store",
    example: "Orbit & Oak furniture",
    desc: "Sell your products online. Customers browse, add to cart and pay by card, and you get an email for every order.",
    hint: "👆 Try it: add a few things to the cart and check out.",
    html: () => browser("orbitandoak.com", `
      <div class="dm dm--shop">
        <div class="dm-nav"><b>🌳 Orbit &amp; Oak</b><span class="dm-cart" id="dmCart">🛒 0 items · €0</span></div>
        <div class="dm-products">
          <div class="dm-prod"><span class="em">🪑</span><b>Oak chair</b><span>€89</span><button type="button" data-act="add" data-price="89">Add to cart</button></div>
          <div class="dm-prod"><span class="em">💡</span><b>Desk lamp</b><span>€45</span><button type="button" data-act="add" data-price="45">Add to cart</button></div>
          <div class="dm-prod"><span class="em">🪴</span><b>Planter</b><span>€24</span><button type="button" data-act="add" data-price="24">Add to cart</button></div>
        </div>
        <div class="dm-checkout"><span class="dm-muted" id="dmShopMsg">Free delivery over €100</span><button type="button" class="dm-btn" data-act="checkout" disabled>Checkout</button></div>
      </div>`),
  },
  webapp: {
    title: "Web app",
    example: "Ledgerly sales dashboard",
    desc: "A tool people log into and use every day in the browser: dashboards, booking systems, client portals, members' areas.",
    hint: "👆 Try it: switch Week / Month, tick a task or add your own.",
    html: () => browser("app.ledgerly.com", `
      <div class="dm dm--app">
        <div class="dm-side" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        <div class="dm-main">
          <div class="dm-row">
            <div><span class="dm-muted">Sales this <span id="dmRangeName">week</span></span><div class="dm-kpi" id="dmKpi">€4,820</div></div>
            <div class="dm-seg"><button type="button" class="is-on" data-act="range" data-range="week">Week</button><button type="button" data-act="range" data-range="month">Month</button></div>
          </div>
          <div class="dm-bars" id="dmBars"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
          <div class="dm-tasks" id="dmTasks">
            <label><input type="checkbox" /><span>Send invoice to Marko</span></label>
            <label><input type="checkbox" checked /><span>Call the accountant</span></label>
          </div>
          <div class="dm-add"><input type="text" placeholder="Add a task…" aria-label="New task (example)" data-enter="addtask" /><button type="button" data-act="addtask">Add</button></div>
        </div>
      </div>`),
  },
  mobile: {
    title: "Mobile app",
    example: "Daily habits app",
    desc: "An app your customers download from the App Store or Google Play, so your business lives right on their phone.",
    hint: "👆 Try it: tap the habits to complete your day.",
    html: () => `
      <div class="phone"><div class="phone__notch"></div>
        <div class="dm dm--mobile">
          <p class="dm-muted dm-center">Good morning, Ana 👋</p>
          <div class="dm-ring" id="dmRing" style="--p:0"><b id="dmRingText">0%</b></div>
          <button type="button" class="dm-habit" data-act="habit"><span>💧 Drink water</span><span class="tick">✓</span></button>
          <button type="button" class="dm-habit" data-act="habit"><span>🚶 10,000 steps</span><span class="tick">✓</span></button>
          <button type="button" class="dm-habit" data-act="habit"><span>📖 Read 20 minutes</span><span class="tick">✓</span></button>
          <button type="button" class="dm-habit" data-act="habit"><span>🧘 Stretch</span><span class="tick">✓</span></button>
        </div>
        <div class="dm-tabbar" aria-hidden="true"><span>🏠</span><span>📊</span><span>⚙️</span></div>
      </div>`,
  },
  custom: {
    title: "Custom software",
    example: "Stock manager for a food shop",
    desc: "Software made for the way your business works: stock, orders, staff schedules, reports. It replaces messy spreadsheets and paperwork.",
    hint: "👆 Try it: search, click a status to change it, or restock.",
    html: () => browser("stock.yourcompany.com", `
      <div class="dm dm--custom">
        <div class="dm-row dm-pad">
          <input type="text" class="dm-search" placeholder="🔍 Search products…" aria-label="Search products (example)" />
          <button type="button" class="dm-btn" data-act="restock">Restock low items</button>
        </div>
        <table class="dm-table">
          <thead><tr><th>Product</th><th>In stock</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Olive oil 1L</td><td>124</td><td><button type="button" class="dm-status st-ok" data-act="status">In stock</button></td></tr>
            <tr><td>Honey 500g</td><td>8</td><td><button type="button" class="dm-status st-low" data-act="status">Low</button></td></tr>
            <tr><td>Ajvar jar</td><td>0</td><td><button type="button" class="dm-status st-out" data-act="status">Out</button></td></tr>
            <tr><td>Herbal tea</td><td>57</td><td><button type="button" class="dm-status st-ok" data-act="status">In stock</button></td></tr>
            <tr><td>Goat cheese</td><td>5</td><td><button type="button" class="dm-status st-low" data-act="status">Low</button></td></tr>
          </tbody>
        </table>
      </div>`),
  },
};

const CHART = { week: { kpi: "€4,820", bars: [40, 65, 50, 80, 60, 95, 70] }, month: { kpi: "€19,340", bars: [55, 70, 85, 60, 90, 75, 100] } };
const STATUSES = [["In stock", "st-ok"], ["Low", "st-low"], ["Out", "st-out"]];
const previewStage = $("#previewStage");
let shopCart = { items: 0, total: 0 };

function renderDemo(type) {
  const d = DEMOS[type];
  if (!d || !previewStage) return;
  $("#previewTitle").textContent = d.title;
  $("#previewEyebrow").textContent = `Example: ${d.example}`;
  $("#previewDesc").textContent = d.desc;
  $("#previewHint").textContent = d.hint;
  previewStage.innerHTML = d.html();
  shopCart = { items: 0, total: 0 };
  const bars = $("#dmBars", previewStage);
  if (bars) setBars("week");
}

function setBars(range) {
  $$("#dmBars span", previewStage).forEach((b, i) => (b.style.height = `${CHART[range].bars[i]}%`));
  $("#dmKpi", previewStage).textContent = CHART[range].kpi;
  $("#dmRangeName", previewStage).textContent = range;
}

function updateRing() {
  const all = $$(".dm-habit", previewStage);
  const done = all.filter((h) => h.classList.contains("is-done")).length;
  const pct = Math.round((done / all.length) * 100);
  $("#dmRing", previewStage).style.setProperty("--p", pct);
  $("#dmRingText", previewStage).textContent = pct === 100 ? "🎉" : `${pct}%`;
}

if (previewStage) {
  previewStage.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b || !previewStage.contains(b)) return;
    const root = previewStage;
    switch (b.dataset.act) {
      case "signup": {
        const input = b.previousElementSibling;
        if (!/^\S+@\S+\.\S+$/.test(input.value)) { input.classList.add("dm-err"); input.focus(); return; }
        b.parentElement.hidden = true;
        b.parentElement.nextElementSibling.hidden = false;
        break;
      }
      case "tab":
        $$(".dm-page", root).forEach((p) => (p.hidden = p.dataset.page !== b.dataset.tab));
        $$(".dm-tabs button", root).forEach((t) => t.classList.toggle("is-on", t.dataset.tab === b.dataset.tab));
        break;
      case "slot":
        $$(".dm-slots button", root).forEach((t) => t.classList.toggle("is-on", t === b));
        $('[data-act="book"]', root).disabled = false;
        break;
      case "book": {
        const slot = $(".dm-slots .is-on", root);
        const done = b.nextElementSibling;
        done.textContent = `✓ Booked for ${slot.textContent}. See you then!`;
        done.hidden = false;
        b.disabled = true;
        break;
      }
      case "add": {
        shopCart.items += 1;
        shopCart.total += +b.dataset.price;
        const cart = $("#dmCart", root);
        cart.textContent = `🛒 ${shopCart.items} item${shopCart.items === 1 ? "" : "s"} · €${shopCart.total}`;
        cart.classList.remove("bump"); void cart.offsetWidth; cart.classList.add("bump");
        $('[data-act="checkout"]', root).disabled = false;
        $("#dmShopMsg", root).textContent = shopCart.total >= 100 ? "✓ Free delivery unlocked" : `€${100 - shopCart.total} more for free delivery`;
        break;
      }
      case "checkout":
        $("#dmShopMsg", root).textContent = `✓ Order placed! Confirmation sent (€${shopCart.total}).`;
        b.disabled = true;
        $$('[data-act="add"]', root).forEach((x) => (x.disabled = true));
        break;
      case "range":
        $$(".dm-seg button", root).forEach((t) => t.classList.toggle("is-on", t === b));
        setBars(b.dataset.range);
        break;
      case "addtask": {
        const input = b.previousElementSibling;
        const text = input.value.trim();
        if (!text) { input.focus(); return; }
        const label = document.createElement("label");
        label.innerHTML = '<input type="checkbox" /><span></span>';
        label.querySelector("span").textContent = text;
        $("#dmTasks", root).appendChild(label);
        input.value = "";
        break;
      }
      case "habit":
        b.classList.toggle("is-done");
        updateRing();
        break;
      case "status": {
        const i = STATUSES.findIndex(([t]) => t === b.textContent);
        const [text, cls] = STATUSES[(i + 1) % STATUSES.length];
        b.textContent = text;
        b.className = `dm-status ${cls}`;
        break;
      }
      case "restock":
        $$(".dm-status", root).forEach((s) => {
          if (s.textContent !== "In stock") {
            s.textContent = "In stock"; s.className = "dm-status st-ok";
            s.closest("tr").children[1].textContent = "50";
          }
        });
        toast("Restock order sent to supplier (example)");
        break;
    }
  });

  previewStage.addEventListener("keydown", (e) => {
    const t = e.target.dataset && e.target.dataset.enter;
    if (e.key === "Enter" && t) {
      e.preventDefault();
      $(`[data-act="${t}"]`, previewStage).click();
    }
  });

  previewStage.addEventListener("input", (e) => {
    if (e.target.classList.contains("dm-err")) e.target.classList.remove("dm-err");
    if (e.target.matches(".dm-search")) {
      const q = e.target.value.toLowerCase();
      $$(".dm-table tbody tr", previewStage).forEach((r) => (r.hidden = !r.textContent.toLowerCase().includes(q)));
    }
  });
}

/* ---------- Estimator ---------- */
const money = new Intl.NumberFormat("en-IE", { style: "currency", currency: CONFIG.CURRENCY, maximumFractionDigits: 0 });
const estForm = $("#estimator");
let lastEstimate = { low: 0, high: 0 };
let currentEstimate = null;

function tweenNumber(el, from, to) {
  if (reduceMotion) { el.textContent = money.format(to); return; }
  const id = (el._tween = (el._tween || 0) + 1);
  // Guarantee the final value even if animation frames are paused (e.g. background tab)
  setTimeout(() => { if (el._tween === id) el.textContent = money.format(to); }, 700);
  const start = performance.now();
  (function tick(now) {
    if (el._tween !== id) return;
    const k = Math.min((now - start) / 600, 1);
    const eased = 1 - Math.pow(1 - k, 3);
    el.textContent = money.format(from + (to - from) * eased);
    if (k < 1) requestAnimationFrame(tick);
  })(start);
}

function calcEstimate() {
  const type = $("input[name=type]:checked", estForm);
  const pace = $("input[name=pace]:checked", estForm);
  const addons = $$("input[name=addon]:checked", estForm);

  let price = +type.dataset.price;
  let weeks = +type.dataset.weeks;
  addons.forEach((a) => { price += +a.dataset.price; weeks += +a.dataset.weeks; });
  price *= +pace.dataset.mult;
  weeks = Math.max(1, Math.round(weeks * +pace.dataset.wmult));

  const round = (n) => (n >= 1000 ? Math.round(n / 50) * 50 : Math.round(n / 10) * 10);
  const low = round(price);
  const high = round(price * 1.25);
  const weeksHigh = weeks + Math.max(1, Math.ceil(weeks * 0.25));

  tweenNumber($("#estLow"), lastEstimate.low, low);
  tweenNumber($("#estHigh"), lastEstimate.high, high);
  lastEstimate = { low, high };
  $("#estWeeks").textContent = `${weeks}–${weeksHigh} weeks`;
  $("#estFounding").textContent = `${money.format(round(low * 0.8))} – ${money.format(round(high * 0.8))}`;
  $("#estBar").style.width = `${Math.min(100, (high / 5000) * 100)}%`;

  currentEstimate = {
    type: type.nextElementSibling.textContent.trim(),
    addons: addons.map((a) => a.value),
    pace: pace.nextElementSibling.textContent.replace(/[^\w\s]/g, "").trim(),
    low, high, weeks: `${weeks}–${weeksHigh} weeks`,
  };
}
estForm.addEventListener("change", (e) => {
  if (e.target.closest("#previewStage")) return; // clicks inside the live example
  if (e.target.name === "type") renderDemo(e.target.value);
  calcEstimate();
});
renderDemo($("input[name=type]:checked", estForm).value);
calcEstimate();

/* ---------- Analytics (Vercel Web Analytics) ---------- */
function track(path, eventName, data) {
  try {
    if (typeof window.va !== "function") return;
    if (path) window.va("pageview", { route: path, path });
    if (eventName) window.va("event", { name: eventName, data });
  } catch { /* analytics must never break the page */ }
}

/* ---------- Example + price popup ---------- */
const caseModal = $("#caseModal");
function openCase(type) {
  const radio = $(`input[name=type][value="${type}"]`, estForm);
  if (!radio) return;
  radio.checked = true;
  $$("input[name=addon]", estForm).forEach((a) => (a.checked = false));
  $("input[name=pace][value=standard]", estForm).checked = true;
  renderDemo(type);
  calcEstimate();
  caseModal.showModal();
  $(".case__inner", caseModal).scrollTop = 0;
  track(`/prices/${type}`, "Price popup opened", { type });
  document.body.style.overflow = "hidden";
}
$$(".project").forEach((card) => card.addEventListener("click", () => openCase(card.dataset.type)));
$("#caseClose").addEventListener("click", () => caseModal.close());
caseModal.addEventListener("click", (e) => { if (e.target === caseModal) caseModal.close(); });
caseModal.addEventListener("close", () => (document.body.style.overflow = ""));

$("#sendEstimate").addEventListener("click", () => {
  const e = currentEstimate;
  const msg =
    `Hi Luna! I'd like a quote for: ${e.type}.\n` +
    (e.addons.length ? `Add-ons: ${e.addons.join(", ")}.\n` : "") +
    `Timeline: ${e.pace.toLowerCase()} (${e.weeks}).\n` +
    `Online estimate: ${money.format(e.low)} – ${money.format(e.high)}.\n\n` +
    `I'm interested in a founding client spot (20% off).\n\n` +
    `A bit more about the project: `;
  const textarea = $("#message");
  textarea.value = msg;
  // pre-select matching budget chip
  const budget = e.high < 300 ? "Under €300" : e.high < 1000 ? "€300–1,000" : e.high < 3000 ? "€1,000–3,000" : "€3,000+";
  const chip = $$("input[name=budget]").find((i) => i.value === budget);
  if (chip) chip.checked = true;
  $("#foundingCheck").checked = true;
  caseModal.close();
  $("#contact").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  setTimeout(() => $("#name").focus({ preventScroll: true }), 700);
  toast("Added to your message");
  track(null, "I want this clicked", { type: e.type, estimate: e.low });
});

/* ---------- Reviews carousel ---------- */
(function carousel() {
  const root = $("#carousel");
  if (!root) return; // no reviews carousel on the page
  const track = $("#track");
  const cards = $$(".review", track);
  const dotsWrap = $("#dots");
  let index = 0, perView = 3, pages = 1, timer;

  function measure() {
    perView = Math.max(1, Math.round(track.clientWidth / cards[0].offsetWidth));
    pages = cards.length - perView + 1;
    dotsWrap.innerHTML = "";
    for (let i = 0; i < pages; i++) {
      const d = document.createElement("button");
      d.setAttribute("aria-label", `Go to review ${i + 1}`);
      d.addEventListener("click", () => { go(i); restart(); });
      dotsWrap.appendChild(d);
    }
    go(Math.min(index, pages - 1));
  }
  function offset(i) {
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return -i * (cards[0].offsetWidth + gap);
  }
  function go(i) {
    index = (i + pages) % pages;
    track.style.transform = `translateX(${offset(index)}px)`;
    $$("button", dotsWrap).forEach((d, j) => d.classList.toggle("is-active", j === index));
  }
  function restart() {
    clearInterval(timer);
    if (!reduceMotion) timer = setInterval(() => go(index + 1), 6000);
  }

  $("#prev").addEventListener("click", () => { go(index - 1); restart(); });
  $("#next").addEventListener("click", () => { go(index + 1); restart(); });
  root.addEventListener("pointerenter", () => clearInterval(timer));
  root.addEventListener("pointerleave", restart);
  root.addEventListener("focusin", () => clearInterval(timer));

  // drag / swipe
  let startX = 0, dx = 0, dragging = false;
  track.addEventListener("pointerdown", (e) => {
    dragging = true; startX = e.clientX; dx = 0;
    track.classList.add("is-dragging");
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    dx = e.clientX - startX;
    track.style.transform = `translateX(${offset(index) + dx}px)`;
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    track.classList.remove("is-dragging");
    if (Math.abs(dx) > 60) go(index + (dx < 0 ? 1 : -1)); else go(index);
    restart();
  };
  track.addEventListener("pointerup", end);
  track.addEventListener("pointercancel", end);

  addEventListener("resize", measure);
  measure();
  restart();
})();

/* ---------- Copy email ---------- */
$$(".copy").forEach((btn) =>
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      toast("Email copied to clipboard");
    } catch {
      toast(btn.dataset.copy);
    }
  })
);

/* ---------- Studio open/closed indicator ---------- */
(function studioStatus() {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: CONFIG.STUDIO_TIMEZONE, weekday: "short", hour: "numeric", hour12: false,
    }).formatToParts(new Date());
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.find((p) => p.type === "weekday").value);
    const hour = parseInt(parts.find((p) => p.type === "hour").value, 10) % 24;
    const { start, end, days } = CONFIG.STUDIO_HOURS;
    const open = days.includes(day) && hour >= start && hour < end;
    $("#studioStatus").innerHTML = open
      ? `<span class="open">● Open now</span> · Mon–Fri, 9:00–18:00 CET`
      : `Mon–Fri, 9:00–18:00 CET · we'll reply next business day`;
  } catch { /* keep default text */ }
})();

/* ---------- Contact form ---------- */
(function contactForm() {
  const form = $("#contactForm");
  const btn = $("#submitBtn");
  const success = $("#formSuccess");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const rules = {
    name: (v) => v.trim().length > 1,
    email: (v) => emailRe.test(v.trim()),
    message: (v) => v.trim().length >= 10,
  };

  function validate(field) {
    const input = form.elements[field];
    const ok = rules[field](input.value);
    input.closest(".field").classList.toggle("is-invalid", !ok);
    input.setAttribute("aria-invalid", String(!ok));
    return ok;
  }
  Object.keys(rules).forEach((f) => {
    form.elements[f].addEventListener("blur", () => form.elements[f].value && validate(f));
    form.elements[f].addEventListener("input", () => {
      if (form.elements[f].closest(".field").classList.contains("is-invalid")) validate(f);
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const results = Object.keys(rules).map(validate);
    if (results.includes(false)) {
      const first = $(".is-invalid input, .is-invalid textarea", form);
      first && first.focus();
      return;
    }
    if (form.elements._gotcha.value) return; // bot

    const data = Object.fromEntries(new FormData(form));
    btn.classList.add("is-loading");
    btn.disabled = true;

    async function sendToServer() {
      if (!CONFIG.FORM_ENDPOINT) return false;
      try {
        const res = await fetch(CONFIG.FORM_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(new FormData(form)).toString(),
        });
        const json = await res.json().catch(() => ({}));
        return res.ok && json.ok === true;
      } catch {
        return false;
      }
    }

    function openMailClient() {
      const subject = `${data.founding ? "[Founding client] " : ""}New project enquiry from ${data.name}${data.company ? ` (${data.company})` : ""}`;
      const body =
        `Name: ${data.name}\nEmail: ${data.email}\n` +
        (data.company ? `Company: ${data.company}\n` : "") +
        (data.budget ? `Budget: ${data.budget}\n` : "") +
        (data.founding ? `Founding client spot: Yes\n` : "") +
        `\n${data.message}`;
      window.location.href = `mailto:${CONFIG.CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    try {
      const sent = await sendToServer();
      if (!sent) {
        // Server unavailable — let the visitor send it from their own email app
        openMailClient();
        toast("Opening your email app to finish sending…");
        await new Promise((r) => setTimeout(r, 600));
      }
      $("#successName").textContent = data.name.trim().split(" ")[0];
      success.hidden = false;
      track("/contact/sent", "Contact form sent", { founding: !!data.founding });
      form.reset();
    } catch {
      toast(`Something went wrong — please email us at ${CONFIG.CONTACT_EMAIL}`);
    } finally {
      btn.classList.remove("is-loading");
      btn.disabled = false;
    }
  });

  $("#resetForm").addEventListener("click", () => {
    success.hidden = true;
    $("#name").focus();
  });
})();

/* ---------- Founding client spots ---------- */
(function founding() {
  const wrap = $("#spots");
  if (!wrap) return;
  const total = parseInt(wrap.dataset.total, 10) || 5;
  const taken = Math.min(total, parseInt(wrap.dataset.taken, 10) || 0);
  const open = total - taken;
  for (let i = 0; i < total; i++) {
    const m = document.createElement("span");
    m.className = `spot-moon ${i < taken ? "is-taken" : "is-open"}`;
    m.style.animationDelay = `${i * 0.25}s`;
    wrap.appendChild(m);
  }
  wrap.setAttribute("role", "img");
  wrap.setAttribute("aria-label", `${open} of ${total} founding spots open`);
  $("#spotsText").textContent = open > 0 ? `${open} of ${total} spots open` : "All founding spots are taken";

  const btn = $("#claimFounding");
  if (open === 0) { btn.disabled = true; btn.textContent = "All spots taken"; return; }
  btn.addEventListener("click", () => {
    $("#foundingCheck").checked = true;
    const msg = $("#message");
    if (!msg.value.trim()) msg.value = "Hi Luna! I'd like one of the founding client spots. Here's what I'm looking to build: ";
    $("#contact").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    setTimeout(() => $("#name").focus({ preventScroll: true }), 700);
    toast("Founding spot selected");
  });
})();
