import type { Metadata } from "next";
import { Planner } from "@/components/planner/Planner";
import "./builder.css";

export const metadata: Metadata = {
  title: "Plan Your Rental Website",
  description:
    "Design your holiday rental or guesthouse website step by step and see it come to life. Pick a style, choose sections like gallery, calendar and online booking, and request your price.",
  alternates: { canonical: "/builder" },
  openGraph: {
    title: "Plan your rental website · Luna Digital",
    description: "Pick a style and features, watch your site build itself, request your price.",
    url: "/builder",
  },
};

/**
 * The planner lives in the layout so it keeps its state while the URL
 * changes from step to step (/builder → /builder/style → …).
 */
export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Planner />
      {children}
    </>
  );
}
