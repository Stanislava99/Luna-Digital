/* ==========================================================
   Rental website planner: content and translations (prices: lib/planPrices.ts)
   ========================================================== */
import type { ReactNode } from "react";

export type PlaceType = "apartment" | "villa" | "rooms" | "cabin";
export type Lang = "en" | "de" | "it";
export type StyleId = "luna" | "custom";
export type ThemeId = "coastal" | "lodge" | "midnight";
export type FontId = "classic" | "elegant" | "modern" | "clean" | "friendly";
export type PaceId = "standard" | "rush";
export type FeatureId = "gallery" | "calendar" | "booking" | "sync" | "reviews" | "guide" | "languages" | "chat";
export type ExtraId = "domain" | "copy" | "logo" | "care";
export type SectionId = "top" | "about" | "gallery" | "book" | "reviews" | "map" | "guide" | "contact" | "chat";

type PlaceInfo = {
  icon: string; label: string; desc: string; name: string; unit: string; maxGuests: number;
  tagline: Record<Lang, string>; story: string; stats: [string, string][]; amen: string[];
};

export const TYPES: Record<PlaceType, PlaceInfo> = {
  apartment: {
    icon: "🏙️", label: "Apartment", desc: "A flat or studio in town", name: "Sea View Apartment", unit: "night", maxGuests: 4,
    tagline: { en: "A bright apartment, steps from everything.", de: "Eine helle Wohnung, alles ganz nah.", it: "Un appartamento luminoso, vicino a tutto." },
    story: "A bright, freshly renovated apartment with everything you need for a relaxed stay, from a fully equipped kitchen to a balcony made for slow breakfasts.",
    stats: [["2", "Bedrooms"], ["4", "Guests"], ["1", "Bathroom"]],
    amen: ["❄️ Air conditioning", "🍳 Full kitchen"],
  },
  villa: {
    icon: "🏡", label: "Villa or house", desc: "A whole house, maybe with a pool", name: "Villa Olive", unit: "night", maxGuests: 8,
    tagline: { en: "Your private villa, with room for everyone.", de: "Ihre private Villa, mit Platz für alle.", it: "La tua villa privata, con spazio per tutti." },
    story: "A spacious family villa with a private pool, shaded garden and big dining table, perfect for families and friends travelling together.",
    stats: [["4", "Bedrooms"], ["8", "Guests"], ["Pool", "Private"]],
    amen: ["🏊 Private pool", "🔥 BBQ"],
  },
  rooms: {
    icon: "🛎️", label: "Guesthouse / rooms", desc: "Rooms, B&B or a small hotel", name: "Guesthouse Lina", unit: "room / night", maxGuests: 3,
    tagline: { en: "Cosy rooms and a warm welcome.", de: "Gemütliche Zimmer und ein herzliches Willkommen.", it: "Camere accoglienti e un caldo benvenuto." },
    story: "A family-run guesthouse with six cosy rooms, homemade breakfast every morning and hosts who know every hidden corner of the area.",
    stats: [["6", "Rooms"], ["☕", "Breakfast"], ["24/7", "Check-in"]],
    amen: ["☕ Breakfast included", "🧳 Luggage storage"],
  },
  cabin: {
    icon: "🌲", label: "Cabin / glamping", desc: "Nature stays, tents, chalets", name: "Pine Cabin", unit: "night", maxGuests: 4,
    tagline: { en: "Slow down in nature.", de: "Entschleunigen in der Natur.", it: "Rallenta, immerso nella natura." },
    story: "A wooden cabin surrounded by forest, with a crackling fireplace, a hot tub under the stars and nothing but birdsong for neighbours.",
    stats: [["2", "Bedrooms"], ["🔥", "Fireplace"], ["♨️", "Hot tub"]],
    amen: ["🔥 Fireplace", "♨️ Hot tub"],
  },
};

export const STYLES: Record<StyleId, { label: string; desc: string; theme: ThemeId; font: FontId }> = {
  luna: { label: "Let Luna design it", desc: "We create a style made just for your place. Always included.", theme: "coastal", font: "classic" },
  custom: { label: "Custom", desc: "Your own idea: after you send your plan, we'll have a call to design it together.", theme: "coastal", font: "classic" },
};

export const FONTS: Record<FontId, { head: string; body: string; hw: number }> = {
  classic: { head: '"DM Serif Display", serif', body: '"Inter", sans-serif', hw: 400 },
  elegant: { head: '"Instrument Serif", serif', body: '"Inter", sans-serif', hw: 400 },
  modern: { head: '"Space Grotesk", sans-serif', body: '"Inter", sans-serif', hw: 700 },
  clean: { head: '"Inter Tight", sans-serif', body: '"Inter", sans-serif', hw: 700 },
  friendly: { head: '"Nunito", sans-serif', body: '"Nunito", sans-serif', hw: 800 },
};

export const THEMES: Record<ThemeId, { vars: Record<"bg" | "surface" | "text" | "muted" | "primary" | "accent" | "radius", string>; tiles: string[] }> = {
  coastal: { vars: { bg: "#ffffff", surface: "#eff7fa", text: "#13293d", muted: "#5b6b78", primary: "#0e7490", accent: "#f59e0b", radius: "14px" }, tiles: ["#bae6fd", "#7dd3fc", "#fde68a", "#a5f3fc", "#fecdd3", "#c7d2fe"] },
  lodge: { vars: { bg: "#fbf8f3", surface: "#f1ebe1", text: "#2b2118", muted: "#6f6253", primary: "#3f6212", accent: "#b45309", radius: "10px" }, tiles: ["#d9f99d", "#a3b18a", "#e7c9a9", "#bbf7d0", "#fcd9a8", "#d6ccc2"] },
  midnight: { vars: { bg: "#111318", surface: "#1a1d24", text: "#f3efe6", muted: "#a7a297", primary: "#c9a96e", accent: "#c9a96e", radius: "4px" }, tiles: ["#2a2d36", "#3a3326", "#22252d", "#4a3f2b", "#2f333d", "#3b3528"] },
};

/* Free photos from Unsplash (unsplash.com/license): [photo id, caption] */
export const PHOTOS: Record<PlaceType, { hero: string; gallery: [string, string][] }> = {
  apartment: { hero: "1583847268964-b28dc8f51f92", gallery: [["1702830499141-a0634d87d6af", "Balcony view"], ["1758448511322-8bfc73daf606", "Living room"], ["1616486029423-aaa4789e8c9a", "Bedroom"], ["1556911220-bff31c812dba", "Kitchen"], ["1584622650111-993a426fbf0a", "Bathroom"]] },
  villa: { hero: "1613977257365-aaae5a9817ff", gallery: [["1596178067639-5c6e68aea6dc", "Private pool"], ["1721222203415-69033eaf3bd1", "Lounge"], ["1600210491305-7396500b5b31", "Master bedroom"], ["1716807335187-a848ce5b56ba", "Dining"], ["1623625434531-d130448273c1", "Garden"]] },
  rooms: { hero: "1599493867961-1bc9808137a9", gallery: [["1611892440504-42a792e24d32", "Double room"], ["1504754524776-8f4f37790ca0", "Breakfast"], ["1657639754447-950d2f314481", "Terrace"], ["1631889993959-41b4e9c6e3c5", "Bathroom"], ["1621293954908-907159247fc8", "Reception"]] },
  cabin: { hero: "1570793005386-840846445fed", gallery: [["1488866022504-f2584929ca5f", "Night sky"], ["1631941150945-837cb81fc7e2", "Fireplace"], ["1768578927774-76bfec4f9c5d", "Loft"], ["1441974231531-c6227db76b6e", "Forest walk"], ["1633512424746-0cb5240e064d", "Hot tub"]] },
};
export const GUIDE_PHOTOS = {
  sea: ["1507525428034-b723cf961d3e", "1653551532342-1cae4bbb2296", "1540946485063-a40da27545f8"],
  nature: ["1501554728187-ce583db33af7", "1722587965667-80edfe0fe388", "1569965335962-2317ff2a7658"],
};

export const BASE_AMEN = ["📶 Fast Wi-Fi", "🅿️ Free parking", "📺 Smart TV", "🧺 Washing machine"];

export const ICON: Record<string, ReactNode> = {
  home: <path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  gallery: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 8" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  booking: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h4" /></>,
  sync: <path d="M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2M20 4v5h-5M4 20v-5h5" />,
  reviews: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z" />,
  guide: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></>,
  languages: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  chat: <path d="M4 20l1.5-4A8 8 0 1 1 8 19z" />,
  domain: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />,
  logo: <path d="M19 4a9 9 0 1 0 0 16A7.5 7.5 0 0 1 19 4z" />,
  copy: <path d="M4 20h4L20 8l-4-4L4 16z" />,
  care: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
};

export type Feature = { id: FeatureId; name: string; desc: string; w: number; sec: SectionId; needs?: FeatureId; tag?: string };
export const FEATURES: Feature[] = [
  { id: "gallery", name: "Photo gallery", desc: "Big, clickable photos of your place", w: 0.25, sec: "gallery" },
  { id: "calendar", name: "Availability calendar", desc: "Guests see free and booked dates", w: 0.5, sec: "book" },
  { id: "booking", name: "Online booking & payments", desc: "Guests book and pay by card on your site, with no platform commission", w: 1, sec: "book", needs: "calendar", tag: "Popular" },
  { id: "sync", name: "Airbnb & Booking.com sync", desc: "Calendars stay in sync, so no double bookings", w: 0.5, sec: "book", needs: "calendar" },
  { id: "reviews", name: "Guest reviews", desc: "Show what your guests say", w: 0, sec: "reviews" },
  { id: "guide", name: "Local guide", desc: "Your favourite beaches, restaurants and tips", w: 0.5, sec: "guide" },
  { id: "languages", name: "More languages", desc: "Your site in English, German and Italian", w: 0.5, sec: "top" },
  { id: "chat", name: "WhatsApp chat button", desc: "Guests message you in one tap", w: 0, sec: "chat" },
];

export type Extra = { id: ExtraId; name: string; desc: string; w: number };
export const EXTRAS: Extra[] = [
  { id: "domain", name: "Domain & hosting", desc: "yourplace.com, set up, secure and kept online", w: 0 },
  { id: "copy", name: "We write the texts", desc: "Descriptions written for you, in plain words", w: 0.5 },
  { id: "logo", name: "Logo", desc: "A simple, clean logo for your place", w: 1 },
  { id: "care", name: "Care plan", desc: "Updates, backups and small changes every month", w: 0 },
];

export const PACE: Record<PaceId, { wmult: number; label: string; short: string }> = {
  standard: { wmult: 1, label: "Standard", short: "Standard" },
  rush: { wmult: 0.6, label: "Rush", short: "Rush" },
};

export const T: Record<Lang, Record<string, string>> = {
  en: { gallery: "Gallery", avail: "Availability", reviews: "Reviews", location: "Location", guide: "Things to do", contact: "Contact", book: "Book now", check: "Check availability", photos: "See photos", night: "night", about: "About", amen: "What's included", from: "from", nearby: "What's nearby", welcome: "Welcome to", look: "Take a look inside", stay: "Book your stay", free: "When is it free?", love: "Guests love it here", tips: "Our local tips", ask: "Questions? Just ask." },
  de: { gallery: "Galerie", avail: "Verfügbarkeit", reviews: "Bewertungen", location: "Lage", guide: "Ausflugstipps", contact: "Kontakt", book: "Jetzt buchen", check: "Verfügbarkeit prüfen", photos: "Fotos ansehen", night: "Nacht", about: "Über uns", amen: "Ausstattung", from: "ab", nearby: "In der Nähe", welcome: "Willkommen in", look: "Ein Blick hinein", stay: "Aufenthalt buchen", free: "Wann ist frei?", love: "Gäste sind begeistert", tips: "Unsere Tipps", ask: "Fragen? Schreiben Sie uns." },
  it: { gallery: "Galleria", avail: "Disponibilità", reviews: "Recensioni", location: "Posizione", guide: "Cosa fare", contact: "Contatti", book: "Prenota ora", check: "Verifica disponibilità", photos: "Vedi foto", night: "notte", about: "Chi siamo", amen: "Servizi", from: "da", nearby: "Nei dintorni", welcome: "Benvenuti a", look: "Uno sguardo dentro", stay: "Prenota il soggiorno", free: "Quando è libero?", love: "Gli ospiti lo adorano", tips: "I nostri consigli", ask: "Domande? Scrivici." },
};

/** Planner steps. Each has its own URL (/builder/<slug>), so analytics shows where people drop off. */
export const STEPS = [
  { label: "Your place", slug: "" },
  { label: "Style", slug: "style" },
  { label: "Sections", slug: "sections" },
  { label: "Extras", slug: "extras" },
  { label: "Request price", slug: "send" },
] as const;
