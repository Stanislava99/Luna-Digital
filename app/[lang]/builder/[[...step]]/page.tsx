import { builderSteps } from "@/components/pages/BuilderPage";

export const generateStaticParams = builderSteps;
export const dynamicParams = false;

/* The planner itself is rendered by the layout; this page only validates the URL. */
export default function StepPage() {
  return null;
}
