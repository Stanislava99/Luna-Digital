/* Plan state, saving to the browser, and price calculation (pure functions, easy to test). */
import {
  BASE_PRICE, EXTRAS, FEATURES, PACE, STYLES, TYPES,
  type ExtraId, type FeatureId, type FontId, type PaceId, type PlaceType, type StyleId, type ThemeId,
} from "./data";

export type Plan = {
  type: PlaceType;
  name: string;
  location: string;
  price: number;
  style: StyleId;
  theme: ThemeId;
  font: FontId;
  customNote: string;
  customLinks: string;
  features: FeatureId[];
  extras: ExtraId[];
  pace: PaceId;
  device: "desktop" | "phone";
  step: number;
};

export const DEFAULT_PLAN: Plan = {
  type: "apartment", name: "", location: "", price: 80, style: "luna", theme: "coastal", font: "classic",
  customNote: "", customLinks: "", features: ["gallery", "calendar"], extras: [], pace: "standard", device: "desktop", step: 0,
};

const STORAGE_KEY = "luna-plan";

/** Reads a saved plan and repairs anything from older versions of the planner. */
export function loadPlan(): Plan {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") as Partial<Plan> | null;
    if (!saved || !(saved.type && saved.type in TYPES)) return DEFAULT_PLAN;
    const style: StyleId = saved.style && saved.style in STYLES ? saved.style : "luna";
    return {
      ...DEFAULT_PLAN,
      ...saved,
      style,
      theme: STYLES[style].theme,
      font: STYLES[style].font,
      features: (saved.features ?? []).filter((id) => FEATURES.some((f) => f.id === id)),
      extras: (saved.extras ?? []).filter((id) => EXTRAS.some((x) => x.id === id)),
      pace: saved.pace === "rush" ? "rush" : "standard",
      device: saved.device === "phone" ? "phone" : "desktop",
      step: Math.max(0, Math.min(saved.step ?? 0, 3)),
    };
  } catch {
    return DEFAULT_PLAN;
  }
}

export function savePlan(plan: Plan) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  } catch {
    /* storage unavailable (private mode) */
  }
}

/** Amenities and map are part of the home page, so they're always on. */
export const hasSection = (plan: Plan, id: FeatureId | "amenities" | "map") =>
  id === "amenities" || id === "map" || plan.features.includes(id);

export const placeName = (p: Plan) => p.name.trim() || TYPES[p.type].name;
export const placeLoc = (p: Plan) => p.location.trim() || "City centre";
export const slug = (p: Plan) =>
  placeName(p).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "").slice(0, 24) || "yourplace";

export const r10 = (n: number) => Math.round(n / 10) * 10;

export type Estimate = {
  lines: [string, number][];
  monthlyLines: [string, number][];
  low: number;
  high: number;
  monthly: number;
  weeks: number;
  weeksText: string;
};

export function estimate(plan: Plan): Estimate {
  let total = BASE_PRICE, w = 1, monthly = 0;
  const lines: [string, number][] = [["Home page (incl. amenities, map & contact)", BASE_PRICE]];
  const monthlyLines: [string, number][] = [];

  const stylePrice = STYLES[plan.style].price;
  if (stylePrice) { total += stylePrice; w += 0.5; lines.push(["Custom design (call + your own style)", stylePrice]); }

  FEATURES.forEach((f) => {
    if (plan.features.includes(f.id)) { total += f.price; w += f.w; lines.push([f.name, f.price]); }
  });
  EXTRAS.forEach((x) => {
    if (!plan.extras.includes(x.id)) return;
    if (x.monthly) { monthly += x.monthly; monthlyLines.push([x.name, x.monthly]); return; }
    total += x.price ?? 0; w += x.w; lines.push([x.name, x.price ?? 0]);
  });

  const pace = PACE[plan.pace];
  const weeks = Math.max(1, Math.round(w * pace.wmult));
  return {
    lines, monthlyLines, monthly, weeks,
    low: r10(total * pace.mult),
    high: r10(total * pace.mult * 1.2),
    weeksText: `${weeks}–${weeks + 1} weeks`,
  };
}

/** Turns features on/off, keeping dependencies (booking & sync need the calendar) consistent. */
export function toggleFeature(features: FeatureId[], id: FeatureId, on: boolean): { features: FeatureId[]; note?: string } {
  const f = FEATURES.find((x) => x.id === id)!;
  let next = new Set(features);
  let note: string | undefined;
  if (on) {
    next.add(id);
    if (f.needs && !next.has(f.needs)) { next.add(f.needs); note = `Added the calendar too: ${f.name.toLowerCase()} needs it`; }
  } else {
    next.delete(id);
    FEATURES.filter((x) => x.needs === id && next.has(x.id)).forEach((dep) => {
      next.delete(dep.id);
      note = `Removed ${dep.name.toLowerCase()}: it needs the calendar`;
    });
  }
  next = new Set(FEATURES.map((x) => x.id).filter((x) => next.has(x)));
  return { features: [...next], note };
}
