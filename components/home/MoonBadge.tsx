"use client";

import { useEffect, useState } from "react";
import { FOUNDING } from "@/lib/site";

const SYNODIC = 29.530588853;
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

/** Tonight's real moon phase: 0 = new, 0.5 = full. */
function moonPhase(date = new Date()) {
  const days = (date.getTime() - KNOWN_NEW_MOON) / 86400000;
  return (((days / SYNODIC) % 1) + 1) % 1;
}

function phaseName(p: number) {
  if (p < 0.03 || p > 0.97) return "New moon";
  if (p < 0.22) return "Waxing crescent";
  if (p < 0.28) return "First quarter";
  if (p < 0.47) return "Waxing gibbous";
  if (p < 0.53) return "Full moon";
  if (p < 0.72) return "Waning gibbous";
  if (p < 0.78) return "Last quarter";
  return "Waning crescent";
}

/** SVG path of the lit part of the moon. */
function phasePath(p: number, cx = 20, cy = 20, r = 16) {
  const c = Math.cos(2 * Math.PI * p);
  const rx = Math.abs(c) * r;
  const waxing = p < 0.5;
  const limbSweep = waxing ? 1 : 0;
  const termSweep = waxing ? (c > 0 ? 0 : 1) : c > 0 ? 1 : 0;
  return `M${cx} ${cy - r} A${r} ${r} 0 0 ${limbSweep} ${cx} ${cy + r} A${rx} ${r} 0 0 ${termSweep} ${cx} ${cy - r}Z`;
}

export function MoonBadge() {
  // Computed after mount so the server and browser render the same HTML
  const [phase, setPhase] = useState<number | null>(null);
  useEffect(() => setPhase(moonPhase()), []);

  const left = FOUNDING.total - FOUNDING.taken;
  const illum = phase === null ? 0 : Math.round(((1 - Math.cos(2 * Math.PI * phase)) / 2) * 100);

  return (
    <>
      <svg
        viewBox="0 0 40 40"
        className="badge__moon"
        aria-label={phase === null ? undefined : `Tonight: ${phaseName(phase).toLowerCase()}, ${illum}% lit`}
        aria-hidden={phase === null ? true : undefined}
      >
        <circle cx="20" cy="20" r="16" className="moon-dark" />
        <path className="moon-lit" d={phase === null ? "" : phasePath(phase)} />
      </svg>
      <span>
        <b>Only {left} left:</b> founding client spots at 20% off
      </span>
    </>
  );
}
