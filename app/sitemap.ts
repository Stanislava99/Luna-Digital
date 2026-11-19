import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** /sitemap.xml: submit this URL in Google Search Console. Planner steps share /builder as canonical. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/builder`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}
