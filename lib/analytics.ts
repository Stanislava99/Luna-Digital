import { track as vercelTrack } from "@vercel/analytics";

type Data = Record<string, string | number | boolean | null>;

/**
 * Custom event for Vercel Web Analytics (shown on Pro plans).
 * Pageviews (including each planner step, which has its own URL) are
 * recorded automatically by the <Analytics /> component.
 */
export function track(name: string, data?: Data) {
  try {
    vercelTrack(name, data);
  } catch {
    /* analytics must never break the page */
  }
}
