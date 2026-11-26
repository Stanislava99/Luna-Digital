/**
 * Planner prices. Server only: imported by /api/contact, never by the planner itself,
 * so visitors don't get prices in the page. Our own notification email includes the
 * estimate, so we can prepare the invoice and reply by hand.
 */
import { EXTRAS, FEATURES, type ExtraId, type FeatureId, type PaceId, type StyleId } from "@/components/planner/data";
import { money } from "@/lib/site";

/** Home page with amenities, map and contact is always included. */
const BASE_PRICE = 250;
const CUSTOM_STYLE_PRICE = 100;
const FEATURE_PRICES: Record<FeatureId, number> = {
  gallery: 20, calendar: 20, booking: 150, sync: 40, reviews: 30, guide: 15, languages: 20, chat: 10,
};
const EXTRA_PRICES: Record<ExtraId, { once?: number; monthly?: number }> = {
  domain: { monthly: 10 }, copy: { once: 50 }, logo: { once: 150 }, care: { monthly: 20 },
};
const RUSH_MULT = 1.3;
const FOUNDING_MULT = 0.8;

const r10 = (n: number) => Math.round(n / 10) * 10;

export type PlanChoices = { style: StyleId; features: FeatureId[]; extras: ExtraId[]; pace: PaceId };

/** Parses the choices sent by the planner; unknown values are ignored. Null when there is no plan. */
export function parseChoices(raw: unknown): PlanChoices | null {
  if (typeof raw !== "string" || !raw || raw.length > 2000) return null;
  try {
    const p = JSON.parse(raw) as Record<string, unknown> | null;
    if (!p || typeof p !== "object") return null;
    const picked = (v: unknown) => (Array.isArray(v) ? v : []) as unknown[];
    return {
      style: p.style === "custom" ? "custom" : "luna",
      features: FEATURES.map((f) => f.id).filter((id) => picked(p.features).includes(id)),
      extras: EXTRAS.map((x) => x.id).filter((id) => picked(p.extras).includes(id)),
      pace: p.pace === "rush" ? "rush" : "standard",
    };
  } catch {
    return null;
  }
}

/** Itemised estimate as plain text, for our own email. */
export function estimateText(c: PlanChoices, founding: boolean): string {
  const lines: [string, number][] = [["Home page (incl. amenities, map & contact)", BASE_PRICE]];
  let monthly = 0;
  if (c.style === "custom") lines.push(["Custom design (call + own style)", CUSTOM_STYLE_PRICE]);
  FEATURES.forEach((f) => { if (c.features.includes(f.id)) lines.push([f.name, FEATURE_PRICES[f.id]]); });
  const monthlyLines: string[] = [];
  EXTRAS.forEach((x) => {
    if (!c.extras.includes(x.id)) return;
    const p = EXTRA_PRICES[x.id];
    if (p.monthly) { monthly += p.monthly; monthlyLines.push(`- ${x.name}: €${p.monthly}/month`); }
    if (p.once) lines.push([x.name, p.once]);
  });
  const total = lines.reduce((sum, [, p]) => sum + p, 0) * (c.pace === "rush" ? RUSH_MULT : 1);
  const low = r10(total), high = r10(total * 1.2);
  const range = (mult: number) => `${money.format(r10(low * mult))} – ${money.format(r10(high * mult))}`;
  return [
    "INTERNAL PRICE ESTIMATE (delete from the quoted text when you reply)",
    ...lines.map(([n, p]) => `- ${n}: €${p}`),
    ...monthlyLines,
    c.pace === "rush" ? "- Rush: +30%" : "",
    `Estimate: ${range(1)}${monthly ? ` + €${monthly}/month` : ""}`,
    founding ? `Founding client price (-20%): ${range(FOUNDING_MULT)}` : "",
  ].filter(Boolean).join("\n");
}
