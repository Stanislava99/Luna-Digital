/* ==========================================================
   Luna Digital — Rental website planner
   ========================================================== */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const CONTACT_EMAIL = "contact@lunadigital.pro";
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- Data ---------------- */
const TYPES = {
  apartment: {
    icon: "🏙️", label: "Apartment", desc: "A flat or studio in town", name: "Sea View Apartment", unit: "night", maxGuests: 4,
    tagline: { en: "A bright apartment, steps from everything.", de: "Eine helle Wohnung, alles ganz nah.", it: "Un appartamento luminoso, vicino a tutto." },
    story: "A bright, freshly renovated apartment with everything you need for a relaxed stay, from a fully equipped kitchen to a balcony made for slow breakfasts.",
    stats: [["2", "Bedrooms"], ["4", "Guests"], ["1", "Bathroom"]],
    photos: [["🌅", "Balcony view"], ["🛋️", "Living room"], ["🛏️", "Bedroom"], ["🍳", "Kitchen"], ["🛁", "Bathroom"]],
    amen: ["❄️ Air conditioning", "🍳 Full kitchen"],
  },
  villa: {
    icon: "🏡", label: "Villa or house", desc: "A whole house, maybe with a pool", name: "Villa Olive", unit: "night", maxGuests: 8,
    tagline: { en: "Your private villa, with room for everyone.", de: "Ihre private Villa, mit Platz für alle.", it: "La tua villa privata, con spazio per tutti." },
    story: "A spacious family villa with a private pool, shaded garden and big dining table, perfect for families and friends travelling together.",
    stats: [["4", "Bedrooms"], ["8", "Guests"], ["Pool", "Private"]],
    photos: [["🏊", "Private pool"], ["🛋️", "Lounge"], ["🛏️", "Master bedroom"], ["🍽️", "Dining"], ["🌿", "Garden"]],
    amen: ["🏊 Private pool", "🔥 BBQ"],
  },
  rooms: {
    icon: "🛎️", label: "Guesthouse / rooms", desc: "Rooms, B&B or a small hotel", name: "Guesthouse Lina", unit: "room / night", maxGuests: 3,
    tagline: { en: "Cosy rooms and a warm welcome.", de: "Gemütliche Zimmer und ein herzliches Willkommen.", it: "Camere accoglienti e un caldo benvenuto." },
    story: "A family-run guesthouse with six cosy rooms, homemade breakfast every morning and hosts who know every hidden corner of the area.",
    stats: [["6", "Rooms"], ["☕", "Breakfast"], ["24/7", "Check-in"]],
    photos: [["🛏️", "Double room"], ["☕", "Breakfast"], ["🪴", "Terrace"], ["🛁", "Bathroom"], ["🔑", "Reception"]],
    amen: ["☕ Breakfast included", "🧳 Luggage storage"],
  },
  cabin: {
    icon: "🌲", label: "Cabin / glamping", desc: "Nature stays, tents, chalets", name: "Pine Cabin", unit: "night", maxGuests: 4,
    tagline: { en: "Slow down in nature.", de: "Entschleunigen in der Natur.", it: "Rallenta, immerso nella natura." },
    story: "A wooden cabin surrounded by forest, with a crackling fireplace, a hot tub under the stars and nothing but birdsong for neighbours.",
    stats: [["2", "Bedrooms"], ["🔥", "Fireplace"], ["♨️", "Hot tub"]],
    photos: [["⭐", "Night sky"], ["🔥", "Fireplace"], ["🛏️", "Loft bed"], ["🌲", "Forest walk"], ["♨️", "Hot tub"]],
    amen: ["🔥 Fireplace", "♨️ Hot tub"],
  },
};
const BASE_AMEN = ["📶 Fast Wi-Fi", "🅿️ Free parking", "📺 Smart TV", "🧺 Washing machine"];

const THEMES = {
  coastal: { label: "Coastal breeze", desc: "Light, fresh, sea blues", scene: "sea", vars: { bg: "#ffffff", surface: "#eff7fa", text: "#13293d", muted: "#5b6b78", primary: "#0e7490", accent: "#f59e0b", head: '"DM Serif Display", serif', body: '"Inter", sans-serif', radius: "14px" }, tiles: ["#bae6fd", "#7dd3fc", "#fde68a", "#a5f3fc", "#fecdd3", "#c7d2fe"] },
  lodge: { label: "Mountain lodge", desc: "Warm woods, deep greens", scene: "mountain", vars: { bg: "#fbf8f3", surface: "#f1ebe1", text: "#2b2118", muted: "#6f6253", primary: "#3f6212", accent: "#b45309", head: '"DM Serif Display", serif', body: '"Nunito", sans-serif', radius: "10px" }, tiles: ["#d9f99d", "#a3b18a", "#e7c9a9", "#bbf7d0", "#fcd9a8", "#d6ccc2"] },
  city: { label: "City modern", desc: "Bold, clean, minimal", scene: "city", vars: { bg: "#ffffff", surface: "#f3f3f1", text: "#0a0a0a", muted: "#5f5f5f", primary: "#111111", accent: "#65a30d", head: '"Space Grotesk", sans-serif', body: '"Inter", sans-serif', radius: "4px" }, tiles: ["#e5e5e5", "#d9f99d", "#c4b5fd", "#fbcfe8", "#d4d4d4", "#a5b4fc"] },
  boho: { label: "Sunny boho", desc: "Terracotta, sand, relaxed", scene: "desert", vars: { bg: "#fffaf4", surface: "#f8ece0", text: "#3b2618", muted: "#7a5f4c", primary: "#c2410c", accent: "#ca8a04", head: '"Nunito", sans-serif', body: '"Nunito", sans-serif', radius: "22px" }, tiles: ["#fed7aa", "#fdba74", "#fef3c7", "#fecaca", "#e9d5ff", "#fde68a"] },
};

const ICON = {
  gallery: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 8"/>',
  amenities: '<path d="M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0M12 19h.01"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  booking: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
  sync: '<path d="M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2M20 4v5h-5M4 20v-5h5"/>',
  reviews: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
  map: '<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  guide: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  languages: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  chat: '<path d="M4 20l1.5-4A8 8 0 1 1 8 19z"/>',
  domain: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  logo: '<path d="M19 4a9 9 0 1 0 0 16A7.5 7.5 0 0 1 19 4z"/>',
  copy: '<path d="M4 20h4L20 8l-4-4L4 16z"/>',
  photos: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  care: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
};

const FEATURES = [
  { id: "gallery", name: "Photo gallery", desc: "Big, clickable photos of your place", price: 40, w: 0.25, sec: "gallery" },
  { id: "amenities", name: "Amenities", desc: "Wi-Fi, parking, pool… at a glance", price: 20, w: 0, sec: "about" },
  { id: "calendar", name: "Availability calendar", desc: "Guests see free and booked dates", price: 80, w: 0.5, sec: "book" },
  { id: "booking", name: "Online booking & payments", desc: "Guests book and pay by card on your site, with no platform commission", price: 200, w: 1, sec: "book", needs: "calendar", tag: "Popular" },
  { id: "sync", name: "Airbnb & Booking.com sync", desc: "Calendars stay in sync, so no double bookings", price: 80, w: 0.5, sec: "book", needs: "calendar" },
  { id: "reviews", name: "Guest reviews", desc: "Show what your guests say", price: 30, w: 0, sec: "reviews" },
  { id: "map", name: "Map & neighbourhood", desc: "Where you are and what's nearby", price: 30, w: 0, sec: "map" },
  { id: "guide", name: "Local guide", desc: "Your favourite beaches, restaurants and tips", price: 40, w: 0.5, sec: "guide" },
  { id: "languages", name: "More languages", desc: "Your site in English, German and Italian", price: 60, w: 0.5, sec: "top" },
  { id: "chat", name: "WhatsApp chat button", desc: "Guests message you in one tap", price: 20, w: 0, sec: "chat" },
];
const EXTRAS = [
  { id: "domain", name: "Domain & hosting setup", desc: "yourplace.com, set up and secure", price: 30, w: 0 },
  { id: "copy", name: "We write the texts", desc: "Descriptions written for you, in plain words", price: 50, w: 0.5 },
  { id: "photos", name: "Photo touch-up", desc: "We brighten, straighten and crop your photos", price: 40, w: 0.5 },
  { id: "logo", name: "Logo", desc: "A simple, clean logo for your place", price: 150, w: 1 },
  { id: "care", name: "Care plan", desc: "Updates, backups and small changes every month", monthly: 20, w: 0 },
];
const BASE_PRICE = 200;
const PACE = { relaxed: { mult: 1, wmult: 1.5, label: "No rush" }, standard: { mult: 1, wmult: 1, label: "Standard" }, rush: { mult: 1.3, wmult: 0.6, label: "Rush (+30%)" } };

const T = {
  en: { gallery: "Gallery", avail: "Availability", reviews: "Reviews", location: "Location", guide: "Things to do", contact: "Contact", book: "Book now", check: "Check availability", photos: "See photos", night: "night", about: "About", amen: "What's included", from: "from", nearby: "What's nearby", welcome: "Welcome to", look: "Take a look inside", stay: "Book your stay", free: "When is it free?", love: "Guests love it here", tips: "Our local tips", ask: "Questions? Just ask." },
  de: { gallery: "Galerie", avail: "Verfügbarkeit", reviews: "Bewertungen", location: "Lage", guide: "Ausflugstipps", contact: "Kontakt", book: "Jetzt buchen", check: "Verfügbarkeit prüfen", photos: "Fotos ansehen", night: "Nacht", about: "Über uns", amen: "Ausstattung", from: "ab", nearby: "In der Nähe", welcome: "Willkommen in", look: "Ein Blick hinein", stay: "Aufenthalt buchen", free: "Wann ist frei?", love: "Gäste sind begeistert", tips: "Unsere Tipps", ask: "Fragen? Schreiben Sie uns." },
  it: { gallery: "Galleria", avail: "Disponibilità", reviews: "Recensioni", location: "Posizione", guide: "Cosa fare", contact: "Contatti", book: "Prenota ora", check: "Verifica disponibilità", photos: "Vedi foto", night: "notte", about: "Chi siamo", amen: "Servizi", from: "da", nearby: "Nei dintorni", welcome: "Benvenuti a", look: "Uno sguardo dentro", stay: "Prenota il soggiorno", free: "Quando è libero?", love: "Gli ospiti lo adorano", tips: "I nostri consigli", ask: "Domande? Scrivici." },
};
const STEPS = ["Your place", "Look", "Sections", "Extras", "Send"];

/* ---------------- State ---------------- */
const DEFAULT = { step: 0, type: "apartment", name: "", location: "", price: 80, theme: "coastal", features: ["gallery", "calendar"], extras: [], pace: "standard", device: "desktop" };
let state = load();
const demo = { lang: "en", monthOffset: 0, start: null, end: null, guests: 2, booked: false, lightbox: null, chatOpen: false };

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem("luna-plan") || "null");
    if (saved && TYPES[saved.type] && THEMES[saved.theme]) return { ...DEFAULT, ...saved, step: Math.min(saved.step || 0, 3) };
  } catch { /* storage unavailable */ }
  return { ...DEFAULT };
}
function save() { try { localStorage.setItem("luna-plan", JSON.stringify(state)); } catch { /* ignore */ } }
const has = (id) => state.features.includes(id);
const placeName = () => state.name.trim() || TYPES[state.type].name;
const placeLoc = () => state.location.trim() || "City centre";
const slug = () => placeName().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "").slice(0, 24) || "yourplace";

/* ---------------- Pricing ---------------- */
function calc() {
  let total = BASE_PRICE, w = 1;
  const lines = [["Home page & contact", BASE_PRICE]];
  FEATURES.forEach((f) => { if (has(f.id)) { total += f.price; w += f.w; lines.push([f.name, f.price]); } });
  let monthly = 0;
  EXTRAS.forEach((x) => {
    if (!state.extras.includes(x.id)) return;
    if (x.monthly) { monthly += x.monthly; return; }
    total += x.price; w += x.w; lines.push([x.name, x.price]);
  });
  const pace = PACE[state.pace];
  const r10 = (n) => Math.round(n / 10) * 10;
  const low = r10(total * pace.mult);
  const high = r10(total * pace.mult * 1.2);
  const weeks = Math.max(1, Math.round(w * pace.wmult));
  return { lines, low, high, monthly, weeks, weeksText: `${weeks}–${weeks + 1} weeks`, rush: state.pace === "rush" };
}

/* ---------------- Scenes (hero artwork) ---------------- */
function scene(kind, uid = "s") {
  const svg = (inner, defs) => `<svg viewBox="0 0 800 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>${defs}</defs>${inner}</svg>`;
  if (kind === "sea") {
    return svg(`
      <rect width="800" height="420" fill="url(#${uid}sky)"/>
      <circle cx="560" cy="110" r="46" fill="#fff6d5"/><circle cx="560" cy="110" r="78" fill="#fff6d5" opacity=".25"/>
      <rect y="250" width="800" height="170" fill="url(#${uid}sea)"/>
      <path d="M0 280q50-10 100 0t100 0 100 0 100 0 100 0 100 0 100 0 100 0" stroke="#e0f7ff" stroke-width="3" fill="none" opacity=".6"/>
      <path d="M0 320q50-10 100 0t100 0 100 0 100 0 100 0 100 0 100 0 100 0" stroke="#e0f7ff" stroke-width="3" fill="none" opacity=".4"/>
      <path d="M800 250 L800 180 Q680 150 540 200 L500 250Z" fill="#c2a27a"/>
      <g fill="#fff"><rect x="700" y="140" width="60" height="50"/><rect x="640" y="152" width="50" height="45"/><rect x="586" y="166" width="44" height="40"/></g>
      <g fill="#38bdf8"><rect x="712" y="152" width="12" height="14"/><rect x="738" y="152" width="12" height="14"/><rect x="652" y="164" width="10" height="12"/><rect x="598" y="176" width="10" height="12"/></g>
      <path d="M430 300 l18 -26 l18 26z" fill="#fff" opacity=".9"/>`,
      `<linearGradient id="${uid}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7dd3fc"/><stop offset="1" stop-color="#fde68a"/></linearGradient>
       <linearGradient id="${uid}sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0891b2"/><stop offset="1" stop-color="#155e75"/></linearGradient>`);
  }
  if (kind === "mountain") {
    let pines = "";
    for (let i = 0; i < 18; i++) { const x = i * 47 + (i % 3) * 9, h = 40 + (i * 13) % 30; pines += `<path d="M${x} 420 l18 -${h + 40} l18 ${h + 40}z" fill="#1f3d2b"/>`; }
    return svg(`
      <rect width="800" height="420" fill="url(#${uid}sky)"/>
      <circle cx="560" cy="130" r="44" fill="#fff1d6"/>
      <path d="M0 300 L150 140 L260 240 L380 110 L520 260 L640 160 L800 290 L800 420 L0 420Z" fill="#6b8f71"/>
      <path d="M380 110 L420 150 L400 150 L380 135 L360 150 L345 148Z" fill="#fff"/>
      <path d="M0 340 L120 250 L260 330 L420 230 L600 330 L800 260 L800 420 L0 420Z" fill="#40624a"/>
      ${pines}`,
      `<linearGradient id="${uid}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fcd9a8"/><stop offset="1" stop-color="#f6b98a"/></linearGradient>`);
  }
  if (kind === "city") {
    let b = "", wins = "";
    const blds = [[0, 200, 90], [95, 140, 70], [170, 230, 60], [235, 110, 85], [325, 180, 70], [400, 90, 95], [500, 160, 80], [585, 210, 60], [650, 130, 75], [730, 190, 70]];
    blds.forEach(([x, y, w], i) => {
      b += `<rect x="${x}" y="${y}" width="${w}" height="${420 - y}" fill="${i % 2 ? "#1e1b4b" : "#272361"}"/>`;
      for (let yy = y + 14; yy < 400; yy += 22) for (let xx = x + 10; xx < x + w - 10; xx += 18) if ((xx * 7 + yy * 3 + i) % 5 < 2) wins += `<rect x="${xx}" y="${yy}" width="8" height="10" fill="#fde68a" opacity=".9"/>`;
    });
    return svg(`<rect width="800" height="420" fill="url(#${uid}sky)"/><circle cx="640" cy="120" r="40" fill="#fde2f3" opacity=".9"/>${b}${wins}`,
      `<linearGradient id="${uid}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4338ca"/><stop offset=".7" stop-color="#db2777"/><stop offset="1" stop-color="#fb923c"/></linearGradient>`);
  }
  return svg(`
    <rect width="800" height="420" fill="url(#${uid}sky)"/>
    <circle cx="400" cy="250" r="110" fill="#fff1c1" opacity=".95"/>
    <path d="M0 300 Q200 230 420 300 T800 280 L800 420 L0 420Z" fill="#fdba74"/>
    <path d="M0 350 Q260 290 520 350 T800 340 L800 420 L0 420Z" fill="#ea580c" opacity=".85"/>
    <g fill="#7c2d12"><rect x="140" y="230" width="14" height="80" rx="7"/><rect x="122" y="252" width="12" height="34" rx="6"/><rect x="160" y="246" width="12" height="30" rx="6"/></g>
    <path d="M620 330 q0 -70 50 -70 q50 0 50 70z" fill="#c2410c"/><path d="M645 330 q0 -45 25 -45 q25 0 25 45z" fill="#fed7aa"/>`,
    `<linearGradient id="${uid}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fed7aa"/><stop offset="1" stop-color="#fb923c"/></linearGradient>`);
}

/* ---------------- Controls (left panel) ---------------- */
function buildControls() {
  $("#typeCards").innerHTML = Object.entries(TYPES).map(([id, t]) => `
    <label class="bp-card"><input type="radio" name="type" value="${id}" ${state.type === id ? "checked" : ""} />
      <span class="bp-card__body"><span class="bp-card__icon" aria-hidden="true">${t.icon}</span><b>${t.label}</b><small>${t.desc}</small></span></label>`).join("");

  $("#themeCards").innerHTML = Object.entries(THEMES).map(([id, t]) => `
    <label class="bp-card"><input type="radio" name="theme" value="${id}" ${state.theme === id ? "checked" : ""} />
      <span class="bp-card__body">
        <span class="bp-theme__swatch">${scene(t.scene, "sw" + id)}<span class="bp-theme__font" style="font-family:${t.vars.head.replace(/"/g, "'")}">Aa</span></span>
        <b>${t.label}</b><small>${t.desc}</small>
        <span class="bp-theme__dots">${[t.vars.primary, t.vars.accent, t.vars.surface].map((c) => `<i style="background:${c}"></i>`).join("")}</span>
      </span></label>`).join("");

  const toggle = (list, name, checkedArr) => list.map((f) => `
    <label class="bp-toggle"><input type="checkbox" name="${name}" value="${f.id}" ${checkedArr.includes(f.id) ? "checked" : ""} />
      <span class="bp-toggle__body">
        <span class="bp-ico" aria-hidden="true"><svg viewBox="0 0 24 24">${ICON[f.id]}</svg></span>
        <span><b>${f.name}${f.tag ? `<span class="bp-tag">${f.tag}</span>` : ""}</b><small>${f.desc}</small></span>
        <span class="bp-price">${f.monthly ? `€${f.monthly}/mo` : `+€${f.price}`}<span class="bp-switch" aria-hidden="true"></span></span>
      </span></label>`).join("");
  $("#featureList").innerHTML = toggle(FEATURES, "feature", state.features);
  $("#extraList").innerHTML = toggle(EXTRAS, "extra", state.extras);

  $("#fName").value = state.name;
  $("#fName").placeholder = TYPES[state.type].name;
  $("#fLocation").value = state.location;
  $("#fLocation").placeholder = "e.g. Old Town, near the beach";
  $("#fPrice").value = state.price;
  $(`input[name=pace][value=${state.pace}]`).checked = true;

  $("#stepper").innerHTML = STEPS.map((s, i) => `<li><button type="button" data-goto="${i}"><span class="n">${i + 1}</span><span class="lbl">${s}</span></button></li>`).join("");
}

/* ---------------- Preview rendering ---------------- */
function themeStyle() {
  const v = THEMES[state.theme].vars;
  return `--pv-bg:${v.bg};--pv-surface:${v.surface};--pv-text:${v.text};--pv-muted:${v.muted};--pv-primary:${v.primary};--pv-accent:${v.accent};--pv-head:${v.head};--pv-body:${v.body};--pv-radius:${v.radius};`;
}

function renderPreview() {
  const t = TYPES[state.type], th = THEMES[state.theme], L = T[has("languages") ? demo.lang : "en"];
  const name = esc(placeName()), loc = esc(placeLoc()), price = Math.max(10, +state.price || 80);
  const tiles = th.tiles;
  const tileBg = (i) => `linear-gradient(135deg, ${tiles[i % tiles.length]}, ${tiles[(i + 1) % tiles.length]})`;
  const links = [
    has("gallery") && ["gallery", L.gallery], has("calendar") && ["book", L.avail], has("reviews") && ["reviews", L.reviews],
    has("map") && ["map", L.location], has("guide") && ["guide", L.guide], ["contact", L.contact],
  ].filter(Boolean);
  const primaryCta = has("booking") ? [L.book, "book"] : has("calendar") ? [L.check, "book"] : [L.contact, "contact"];

  let h = "";
  // NAV
  h += `<nav class="pv-nav" data-sec="top"><div class="pv-wrap">
    <span class="pv-logo">${name}</span>
    <div class="pv-links">${links.map(([id, l]) => `<a data-go="${id}">${l}</a>`).join("")}
      ${has("languages") ? `<span class="pv-lang">${["en", "de", "it"].map((l) => `<button type="button" data-lang="${l}" class="${demo.lang === l ? "is-on" : ""}">${l.toUpperCase()}</button>`).join("")}</span>` : ""}
      <button type="button" class="pv-btn" data-go="${primaryCta[1]}">${primaryCta[0]}</button>
    </div></div></nav>`;

  // HERO
  h += `<header class="pv-hero"><div class="pv-hero__scene">${scene(th.scene, "hero")}</div><div class="pv-wrap">
    <span class="pv-hero__loc">📍 ${loc}</span>
    <h2>${name}</h2>
    <p>${esc(t.tagline[has("languages") ? demo.lang : "en"])}</p>
    <div class="pv-hero__cta">
      <button type="button" class="pv-btn" data-go="${primaryCta[1]}">${primaryCta[0]} →</button>
      ${has("gallery") ? `<button type="button" class="pv-btn pv-btn--ghost" data-go="gallery">${L.photos}</button>` : ""}
      <span class="pv-hero__price">${L.from} <b>€${price}</b> / ${t.unit === "night" ? L.night : t.unit}</span>
    </div></div></header>`;

  // ABOUT (+ amenities)
  h += `<section class="pv-sec" data-sec="about"><div class="pv-wrap pv-about">
    <div><span class="pv-kicker">${L.about}</span><h2>${L.welcome} ${name}</h2><p>${t.story}</p>
      ${has("amenities") ? `<div class="pv-amen" aria-label="${L.amen}">${[...t.amen, ...BASE_AMEN].map((a) => `<span>${a}</span>`).join("")}</div>` : ""}
    </div>
    <div class="pv-stats">${t.stats.map(([n, l]) => `<div class="pv-stat"><b>${n}</b><span>${l}</span></div>`).join("")}</div>
  </div></section>`;

  // GALLERY
  if (has("gallery")) {
    h += `<section class="pv-sec pv-sec--alt" data-sec="gallery"><div class="pv-wrap">
      <div class="pv-head"><div><span class="pv-kicker">${L.gallery}</span><h2>${L.look}</h2></div><p>Click a photo to open it</p></div>
      <div class="pv-gallery">${t.photos.map(([e, c], i) => `<button type="button" class="pv-photo" data-photo="${i}" style="background:${tileBg(i)}" aria-label="Open photo: ${c}">${e}<span>${c}</span></button>`).join("")}</div>
    </div></section>`;
  }

  // CALENDAR + BOOKING
  if (has("calendar")) h += renderBooking(L, price);

  // REVIEWS
  if (has("reviews")) {
    const rv = [
      ["AK", "Anna, Germany", `Even better than the photos. Spotless, quiet and the hosts thought of everything. We're already planning our next stay!`],
      ["MR", "Marco, Italy", `Perfect location in ${loc}. Check-in was easy and the recommendations were spot on.`],
      ["SL", "Sophie, France", `We felt at home from the first minute. Thank you for the warm welcome and the little extras.`],
    ];
    h += `<section class="pv-sec pv-sec--alt" data-sec="reviews"><div class="pv-wrap">
      <div class="pv-head"><div><span class="pv-kicker">${L.reviews}</span><h2>${L.love}</h2></div><span class="pv-score"><b>4.9</b><span class="pv-stars">★★★★★</span></span></div>
      <div class="pv-reviews">${rv.map(([a, n, q]) => `<article class="pv-review"><span class="pv-stars">★★★★★</span><p>“${esc(q)}”</p><footer><span class="pv-avatar">${a}</span>${n}</footer></article>`).join("")}</div>
    </div></section>`;
  }

  // MAP
  if (has("map")) {
    const near = state.type === "cabin"
      ? [["🥾 Hiking trail", "2 min walk"], ["🏞️ Lake", "10 min drive"], ["🛒 Village shop", "5 min drive"], ["🍽️ Mountain restaurant", "8 min drive"]]
      : [["🏖️ Beach", "5 min walk"], ["🍽️ Restaurants", "2 min walk"], ["🛒 Supermarket", "4 min walk"], ["🚌 Bus stop", "3 min walk"]];
    h += `<section class="pv-sec" data-sec="map"><div class="pv-wrap">
      <div class="pv-head"><div><span class="pv-kicker">${L.location}</span><h2>${loc}</h2></div></div>
      <div class="pv-map">
        <div class="pv-map__img">${mapSvg()}<span class="pv-pin" aria-hidden="true"></span></div>
        <div class="pv-near"><p style="font-weight:700;color:var(--pv-text)">${L.nearby}</p>${near.map(([a, b]) => `<div><span>${a}</span><b>${b}</b></div>`).join("")}</div>
      </div></div></section>`;
  }

  // GUIDE
  if (has("guide")) {
    const g = state.type === "cabin"
      ? [["🥾", "Best trails", "Three easy walks with amazing views"], ["🍲", "Where to eat", "Cosy taverns with local food"], ["🛶", "Lake day", "Swim, paddle and picnic"]]
      : [["🏖️", "Quiet beaches", "Our favourite spots away from the crowds"], ["🍝", "Where to eat", "Local places we love"], ["⛵", "Day trips", `Easy trips from ${loc}`]];
    h += `<section class="pv-sec pv-sec--alt" data-sec="guide"><div class="pv-wrap">
      <div class="pv-head"><div><span class="pv-kicker">${L.guide}</span><h2>${L.tips}</h2></div></div>
      <div class="pv-guide">${g.map(([e, ti, d], i) => `<article><div class="img" style="background:${tileBg(i + 2)}">${e}</div><div class="txt"><h3>${ti}</h3><p>${esc(d)}</p></div></article>`).join("")}</div>
    </div></section>`;
  }

  // CONTACT
  h += `<section class="pv-sec" data-sec="contact"><div class="pv-wrap pv-contact">
    <div><span class="pv-kicker">${L.contact}</span><h2>${L.ask}</h2><p>We usually reply within an hour.</p>
      <div class="pv-contact__list"><div>✉️ hello@${slug()}.com</div>${has("chat") ? `<div>💬 WhatsApp: tap the green button</div>` : ""}<div>📍 ${loc}</div></div></div>
    <div class="pv-form"><div class="fake">Your name</div><div class="fake">Email</div><div class="fake fake--tall">Message</div><button type="button" class="pv-btn" data-toast="Message sent (demo)">Send message</button></div>
  </div></section>`;
  h += `<footer class="pv-foot">© ${new Date().getFullYear()} ${name} · ${loc}</footer>`;

  // CHAT
  if (has("chat")) {
    h += `<div class="pv-chat" data-sec="chat">${demo.chatOpen ? `<div class="pv-chat__bubble">👋 Hi! This is ${name}. How can we help?</div>` : ""}
      <button type="button" class="pv-chat__btn" data-chat aria-label="Open WhatsApp chat"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.1z"/></svg></button></div>`;
  }

  // LIGHTBOX
  if (demo.lightbox !== null && has("gallery")) {
    const [e, c] = t.photos[demo.lightbox];
    h += `<div class="pv-lightbox" data-lb-bg><button type="button" class="pv-lightbox__close" data-lb-close aria-label="Close">✕</button>
      <button type="button" class="pv-lightbox__nav pv-lightbox__nav--prev" data-lb="-1" aria-label="Previous">‹</button>
      <div><div class="pv-lightbox__img" style="background:${tileBg(demo.lightbox)}">${e}</div><p class="pv-lightbox__cap">${c} · ${demo.lightbox + 1} / ${t.photos.length}</p></div>
      <button type="button" class="pv-lightbox__nav pv-lightbox__nav--next" data-lb="1" aria-label="Next">›</button></div>`;
  }

  const pv = $("#pv");
  const scroller = $("#pvScroll");
  const keep = scroller.scrollTop;
  pv.setAttribute("style", themeStyle());
  pv.innerHTML = h;
  // animate only sections that just appeared
  const now = new Set($$("[data-sec]", pv).map((s) => s.dataset.sec));
  if (renderPreview.prev) $$(".pv-sec", pv).forEach((s) => { if (!renderPreview.prev.has(s.dataset.sec)) s.classList.add("is-new"); });
  renderPreview.prev = now;
  $("#frame").style.setProperty("--pv-bg", THEMES[state.theme].vars.bg);
  scroller.style.scrollBehavior = "auto";
  scroller.scrollTop = keep;
  scroller.style.scrollBehavior = "";
  $("#pvUrl").textContent = `🔒 ${slug()}.com`;
}

function mapSvg() {
  return `<svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="400" height="260" fill="#eef1ec"/>
    <path d="M0 190 Q120 170 220 200 T400 180 L400 260 L0 260Z" fill="#a5d8ec"/>
    <ellipse cx="80" cy="70" rx="60" ry="38" fill="#cfe8c4"/><ellipse cx="320" cy="90" rx="44" ry="30" fill="#cfe8c4"/>
    <g stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"><path d="M0 120 H400"/><path d="M200 0 V185"/><path d="M60 0 Q120 120 300 260"/></g>
    <g stroke="#fde68a" stroke-width="4" fill="none"><path d="M0 120 H400"/></g>
    <g fill="#dfe3dc">${[[230, 30], [250, 60], [140, 140], [260, 140], [300, 40], [120, 20]].map(([x, y]) => `<rect x="${x}" y="${y}" width="34" height="22" rx="3"/>`).join("")}</g>
  </svg>`;
}

/* ---------- Calendar + booking ---------- */
function monthInfo() {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + demo.monthOffset, 1);
  return { y: d.getFullYear(), m: d.getMonth(), days: new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(), first: (d.getDay() + 6) % 7, today: now };
}
const key = (y, m, d) => y * 10000 + (m + 1) * 100 + d;
function isBooked(y, m, d) { return ((d * 7 + m * 3 + y) % 11) < 3; }
function bookedSource(d) { return d % 2 ? "a" : "b"; }
function nights() { return demo.start && demo.end ? Math.round((toDate(demo.end) - toDate(demo.start)) / 864e5) : 0; }
function toDate(k) { return new Date(Math.floor(k / 10000), Math.floor(k / 100) % 100 - 1, k % 100); }
const fmt = (k) => toDate(k).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

function renderBooking(L, price) {
  const { y, m, days, first, today } = monthInfo();
  const todayKey = key(today.getFullYear(), today.getMonth(), today.getDate());
  const monthName = new Date(y, m, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  let cells = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => `<span class="pv-cal__dow">${d}</span>`).join("");
  for (let i = 0; i < first; i++) cells += "<span></span>";
  for (let d = 1; d <= days; d++) {
    const k = key(y, m, d);
    const booked = isBooked(y, m, d);
    const past = k < todayKey;
    const cls = [booked && "is-booked", demo.start === k && "is-start", (demo.end === k || (demo.start === k && !demo.end)) && "is-end", demo.start && demo.end && k > demo.start && k < demo.end && "in-range"].filter(Boolean).join(" ");
    cells += `<button type="button" class="pv-day ${cls}" data-day="${k}" ${booked || past ? "disabled" : ""} ${booked && has("sync") ? `data-src="${bookedSource(d)}"` : ""} aria-label="${d} ${monthName}${booked ? " (booked)" : ""}">${d}</button>`;
  }
  const n = nights();
  const unit = TYPES[state.type].unit === "night" ? L.night : TYPES[state.type].unit;
  const cleaning = 20;
  const total = n * price + (n ? cleaning : 0);

  let widget;
  if (has("booking")) {
    widget = `<div class="pv-widget">
      <div class="pv-widget__price"><b>€${price}</b> / ${unit}</div>
      <div class="pv-widget__dates"><div><small>Check-in</small>${demo.start ? fmt(demo.start) : "Add date"}</div><div><small>Check-out</small>${demo.end ? fmt(demo.end) : "Add date"}</div></div>
      <div class="pv-guests"><span>Guests</span><span class="pv-step"><button type="button" data-guests="-1" aria-label="Fewer guests">−</button><b>${demo.guests}</b><button type="button" data-guests="1" aria-label="More guests">+</button></span></div>
      ${n ? `<div class="pv-lines"><div><span>€${price} × ${n} night${n > 1 ? "s" : ""}</span><span>€${price * n}</span></div><div><span>Cleaning</span><span>€${cleaning}</span></div><div><span>Total</span><span>€${total}</span></div></div>` : `<p class="pv-note">Pick your dates in the calendar.</p>`}
      ${demo.booked ? `<div class="pv-ok">✓ Booked! Confirmation sent to the guest, and the dates are blocked${has("sync") ? " on Airbnb & Booking.com too" : ""}.</div>`
        : `<button type="button" class="pv-btn" data-book ${n ? "" : "disabled"}>${n ? `Pay €${total} & book` : L.book}</button>`}
      <div class="pv-pay"><span>VISA</span><span>Mastercard</span><span>Apple Pay</span><span>Google Pay</span></div>
    </div>`;
  } else {
    widget = `<div class="pv-widget">
      <div class="pv-widget__price"><b>€${price}</b> / ${unit}</div>
      ${n ? `<p>${fmt(demo.start)} → ${fmt(demo.end)} · ${n} night${n > 1 ? "s" : ""}</p>` : `<p class="pv-note">Pick your dates in the calendar.</p>`}
      <button type="button" class="pv-btn" data-go="contact" ${n ? "" : "disabled"}>Ask about these dates</button>
      <p class="pv-note">Online booking & payments can be added any time.</p>
    </div>`;
  }

  return `<section class="pv-sec" data-sec="book"><div class="pv-wrap">
    <div class="pv-head"><div><span class="pv-kicker">${L.avail}</span><h2>${has("booking") ? L.stay : L.free}</h2></div>
      ${has("sync") ? `<span class="pv-sync">↻ Synced with Airbnb &amp; Booking.com</span>` : ""}</div>
    <div class="pv-book">
      <div class="pv-cal">
        <div class="pv-cal__head"><b>${monthName}</b><div class="pv-cal__nav"><button type="button" data-month="-1" ${demo.monthOffset <= 0 ? "disabled" : ""} aria-label="Previous month">‹</button><button type="button" data-month="1" aria-label="Next month">›</button></div></div>
        <div class="pv-cal__grid">${cells}</div>
        <div class="pv-cal__legend"><span><i style="background:var(--pv-primary)"></i>Your dates</span><span><i style="background:#cbd5e1"></i>Booked</span>${has("sync") ? `<span><i style="background:#ff5a5f"></i>From Airbnb</span><span><i style="background:#2563eb"></i>From Booking.com</span>` : ""}</div>
      </div>
      ${widget}
    </div></div></section>`;
}

/* ---------------- Steps / navigation ---------------- */
function showStep(i, focus = true) {
  state.step = Math.max(0, Math.min(STEPS.length - 1, i));
  $$(".bp-step").forEach((s) => (s.hidden = +s.dataset.step !== state.step));
  $$("#stepper button").forEach((b, j) => {
    b.classList.toggle("is-current", j === state.step);
    b.classList.toggle("is-done", j < state.step);
    b.setAttribute("aria-current", j === state.step ? "step" : "false");
  });
  $("#prevBtn").disabled = state.step === 0;
  const next = $("#nextBtn");
  next.hidden = state.step === STEPS.length - 1;
  next.textContent = state.step === STEPS.length - 2 ? "See my plan →" : "Next →";
  if (state.step === STEPS.length - 1) renderSummary();
  $(".bp-steps").scrollTop = 0;
  if (focus) { const h = $(`.bp-step[data-step="${state.step}"] h1`); h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  if (innerWidth <= 900 && focus) $(".bp-panel").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  save();
}

function updateTotal() {
  const c = calc();
  const el = $("#totalPrice");
  const text = c.low === c.high ? money.format(c.low) : `${money.format(c.low)}–${money.format(c.high).replace("€", "€")}`;
  if (el.textContent !== text) { el.textContent = text; el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
  $("#totalMeta").textContent = `about ${c.weeksText}${c.monthly ? ` · +€${c.monthly}/month` : ""}`;
}

function renderSummary() {
  const c = calc(), t = TYPES[state.type], th = THEMES[state.theme];
  const r10 = (n) => Math.round(n / 10) * 10;
  $("#summary").innerHTML = `
    <div class="bp-summary__row bp-summary__row--head"><span>${esc(placeName())}</span><span>${t.label}</span></div>
    <div class="bp-summary__row"><span>Location</span><span>${esc(placeLoc())}</span></div>
    <div class="bp-summary__row"><span>Style</span><span>${th.label}</span></div>
    ${c.lines.map(([n, p]) => `<div class="bp-summary__row"><span>${n}</span><span>€${p}</span></div>`).join("")}
    ${c.monthly ? `<div class="bp-summary__row"><span>Care plan</span><span>€${c.monthly}/month</span></div>` : ""}
    <div class="bp-summary__row"><span>Timing</span><span>${PACE[state.pace].label} · ${c.weeksText}</span></div>
    <div class="bp-summary__total">
      <span class="big">${money.format(c.low)} – ${money.format(c.high)}</span>
      <div class="founding"><span>Founding client price (−20%)</span><b>${money.format(r10(c.low * 0.8))} – ${money.format(r10(c.high * 0.8))}</b></div>
      <small>Final fixed price agreed after a free call. Includes design, building, testing, launch and 30 days of free help.</small>
    </div>`;
}

function flashSection(sec) {
  requestAnimationFrame(() => {
    const el = $(`[data-sec="${sec}"]`, $("#pv"));
    if (!el) return;
    const scroller = $("#pvScroll");
    if (sec !== "chat") scroller.scrollTo({ top: sec === "top" ? 0 : el.offsetTop - 58, behavior: reduceMotion ? "auto" : "smooth" });
    el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
  });
}

/* ---------------- Events: controls ---------------- */
function wireControls() {
  $("#steps").addEventListener("change", (e) => {
    const el = e.target;
    if (el.name === "type") { state.type = el.value; $("#fName").placeholder = TYPES[state.type].name; demo.lightbox = null; renderPreview(); $("#pvScroll").scrollTop = 0; }
    else if (el.name === "theme") { state.theme = el.value; renderPreview(); $("#pvScroll").scrollTo({ top: 0, behavior: "smooth" }); }
    else if (el.name === "feature") {
      const f = FEATURES.find((x) => x.id === el.value);
      if (el.checked) {
        if (!state.features.includes(f.id)) state.features.push(f.id);
        if (f.needs && !state.features.includes(f.needs)) { state.features.push(f.needs); $(`input[name=feature][value=${f.needs}]`).checked = true; toast(`Added the calendar too: ${f.name.toLowerCase()} needs it`); }
      } else {
        state.features = state.features.filter((x) => x !== f.id);
        FEATURES.filter((x) => x.needs === f.id && state.features.includes(x.id)).forEach((dep) => {
          state.features = state.features.filter((x) => x !== dep.id);
          $(`input[name=feature][value=${dep.id}]`).checked = false;
          toast(`Removed ${dep.name.toLowerCase()}: it needs the calendar`);
        });
      }
      state.features = FEATURES.map((x) => x.id).filter((id) => state.features.includes(id));
      if (f.id === "languages" && !el.checked) demo.lang = "en";
      if (f.id === "chat" && el.checked) demo.chatOpen = true;
      renderPreview();
      if (el.checked) flashSection(f.sec);
    } else if (el.name === "extra") {
      state.extras = el.checked ? [...new Set([...state.extras, el.value])] : state.extras.filter((x) => x !== el.value);
      if (el.value === "domain" && el.checked) toast(`We'll set up ${slug()}.com (if it's free)`);
    } else if (el.name === "pace") state.pace = el.value;
    updateTotal(); save();
  });

  $("#fName").addEventListener("input", (e) => { state.name = e.target.value; renderPreview(); save(); });
  $("#fLocation").addEventListener("input", (e) => { state.location = e.target.value; renderPreview(); save(); });
  $("#fPrice").addEventListener("input", (e) => { const v = parseInt(e.target.value, 10); if (v > 0) { state.price = Math.min(v, 5000); renderPreview(); save(); } });
  $("#fName").addEventListener("focus", () => $("#pvScroll").scrollTo({ top: 0, behavior: "smooth" }));

  $("#prevBtn").addEventListener("click", () => showStep(state.step - 1));
  $("#nextBtn").addEventListener("click", () => showStep(state.step + 1));
  $("#stepper").addEventListener("click", (e) => { const b = e.target.closest("[data-goto]"); if (b) showStep(+b.dataset.goto); });

  $$(".bp-device button").forEach((b) => b.addEventListener("click", () => {
    state.device = b.dataset.device;
    $("#frame").dataset.device = state.device;
    $$(".bp-device button").forEach((x) => { x.classList.toggle("is-on", x === b); x.setAttribute("aria-checked", String(x === b)); });
    save();
  }));
}

/* ---------------- Events: interactive preview ---------------- */
function wirePreview() {
  const pv = $("#pv");
  pv.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go]");
    if (go && !go.disabled) { flashSection(go.dataset.go); return; }
    const lang = e.target.closest("[data-lang]");
    if (lang) { demo.lang = lang.dataset.lang; renderPreview(); return; }
    const photo = e.target.closest("[data-photo]");
    if (photo) { demo.lightbox = +photo.dataset.photo; renderPreview(); return; }
    if (e.target.closest("[data-lb-close]") || e.target.matches("[data-lb-bg]")) { demo.lightbox = null; renderPreview(); return; }
    const lb = e.target.closest("[data-lb]");
    if (lb) { const n = TYPES[state.type].photos.length; demo.lightbox = (demo.lightbox + +lb.dataset.lb + n) % n; renderPreview(); return; }
    const mo = e.target.closest("[data-month]");
    if (mo && !mo.disabled) { demo.monthOffset = Math.max(0, demo.monthOffset + +mo.dataset.month); renderPreview(); return; }
    const day = e.target.closest("[data-day]");
    if (day && !day.disabled) { pickDay(+day.dataset.day); renderPreview(); return; }
    const g = e.target.closest("[data-guests]");
    if (g) { demo.guests = Math.max(1, Math.min(TYPES[state.type].maxGuests, demo.guests + +g.dataset.guests)); renderPreview(); return; }
    if (e.target.closest("[data-book]")) { demo.booked = true; renderPreview(); return; }
    if (e.target.closest("[data-chat]")) { demo.chatOpen = !demo.chatOpen; renderPreview(); return; }
    const tst = e.target.closest("[data-toast]");
    if (tst) toast(tst.dataset.toast);
  });
}

function pickDay(k) {
  demo.booked = false;
  if (!demo.start || demo.end || k <= demo.start) { demo.start = k; demo.end = null; return; }
  // don't allow a range over booked nights
  for (let d = toDate(demo.start); d < toDate(k); d.setDate(d.getDate() + 1)) {
    if (isBooked(d.getFullYear(), d.getMonth(), d.getDate())) { demo.start = k; demo.end = null; toast("Those dates include booked nights"); return; }
  }
  demo.end = k;
}

/* ---------------- Send plan ---------------- */
function wireForm() {
  const form = $("#planForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = $("#formError");
    const data = Object.fromEntries(new FormData(form));
    const bad = [];
    $$(".bp-input", form).forEach((l) => l.classList.remove("is-invalid"));
    if ((data.name || "").trim().length < 2) bad.push("name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((data.email || "").trim())) bad.push("email");
    if (bad.length) {
      bad.forEach((n) => form.elements[n].closest(".bp-input").classList.add("is-invalid"));
      err.textContent = bad.includes("name") ? "Please tell us your name." : "Please enter a valid email so we can reply.";
      err.hidden = false; form.elements[bad[0]].focus(); return;
    }
    err.hidden = true;
    if (data._gotcha) return;

    const c = calc(), t = TYPES[state.type];
    const r10 = (n) => Math.round(n / 10) * 10;
    const message = [
      "Rental website plan (from the Luna planner)",
      "",
      `Place: ${placeName()} (${t.label}), ${placeLoc()}, €${state.price}/${t.unit}`,
      `Style: ${THEMES[state.theme].label}`,
      `Sections: Home page & contact${state.features.length ? ", " + FEATURES.filter((f) => has(f.id)).map((f) => f.name).join(", ") : ""}`,
      `Extras: ${EXTRAS.filter((x) => state.extras.includes(x.id)).map((x) => x.name).join(", ") || "none"}`,
      `Timing: ${PACE[state.pace].label}, ${c.weeksText}`,
      `Estimate: ${money.format(c.low)} – ${money.format(c.high)}${c.monthly ? ` + €${c.monthly}/month` : ""}`,
      data.founding ? `Founding client price: ${money.format(r10(c.low * 0.8))} – ${money.format(r10(c.high * 0.8))}` : "",
      data.phone ? `Phone / WhatsApp: ${data.phone}` : "",
      data.notes ? `\nNotes: ${data.notes}` : "",
    ].filter((l) => l !== "").join("\n");

    const btn = $("#sendPlan");
    btn.classList.add("is-loading"); btn.disabled = true;
    const payload = new URLSearchParams({ name: data.name.trim(), email: data.email.trim(), company: placeName(), budget: `${money.format(c.low)}–${money.format(c.high)}`, message, ...(data.founding ? { founding: "Yes" } : {}) });
    let sent = false;
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" }, body: payload.toString() });
      const json = await res.json().catch(() => ({}));
      sent = res.ok && json.ok === true;
    } catch { sent = false; }
    if (!sent) {
      location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`${data.founding ? "[Founding client] " : ""}Website plan: ${placeName()}`)}&body=${encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\n${message}`)}`;
      toast("Opening your email app to finish sending…");
      await new Promise((r) => setTimeout(r, 600));
    }
    btn.classList.remove("is-loading"); btn.disabled = false;
    $("#doneName").textContent = data.name.trim().split(" ")[0];
    form.hidden = true; $("#summary").hidden = true;
    $(".bp-step[data-step='4'] .bp-sub").hidden = true;
    $("#planDone").hidden = false;
  });
}

/* ---------------- Toast ---------------- */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg; t.classList.add("is-visible");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("is-visible"), 2600);
}

/* ---------------- Init ---------------- */
buildControls();
wireControls();
wirePreview();
wireForm();
renderPreview();
updateTotal();
$("#frame").dataset.device = state.device;
$$(".bp-device button").forEach((x) => { const on = x.dataset.device === state.device; x.classList.toggle("is-on", on); x.setAttribute("aria-checked", String(on)); });
showStep(state.step, false);
