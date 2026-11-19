/** Site-wide settings and small helpers shared by the homepage and the planner. */
export const SITE_URL = "https://lunadigital.pro";
export const CONTACT_EMAIL = "contact@lunadigital.pro";
export const FORM_ENDPOINT = "/api/contact";

/** Founding client offer: change `taken` when a spot is filled (0–5). */
export const FOUNDING = { total: 5, taken: 3 };

export const money = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Unsplash photo URL (free photos, unsplash.com/license). */
export const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

/**
 * Sends a form to the contact API. Returns false when email sending isn't
 * configured (or the network fails), so the caller can fall back to mailto.
 */
export async function sendToServer(fields: Record<string, string>): Promise<boolean> {
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(fields).toString(),
    });
    const json = (await res.json().catch(() => ({}))) as { ok?: boolean };
    return res.ok && json.ok === true;
  } catch {
    return false;
  }
}

export function openMailClient(subject: string, body: string) {
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
