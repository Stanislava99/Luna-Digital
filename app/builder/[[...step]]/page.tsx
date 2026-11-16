import { notFound } from "next/navigation";
import { STEPS } from "@/components/planner/data";

const VALID = new Set<string>([...STEPS.map((s) => s.slug).filter(Boolean), "sent"]);

/** Pre-render every step URL at build time. */
export function generateStaticParams() {
  return [{ step: [] }, ...[...VALID].map((s) => ({ step: [s] }))];
}
export const dynamicParams = false;

/* The planner itself is rendered by the layout; this page only validates the URL. */
export default async function StepPage({ params }: { params: Promise<{ step?: string[] }> }) {
  const { step = [] } = await params;
  if (step.length > 1 || (step[0] && !VALID.has(step[0]))) notFound();
  return null;
}
