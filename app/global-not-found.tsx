import type { Metadata } from "next";
import Link from "next/link";
import { baseMetadata, RootDocument } from "@/components/pages/RootDocument";
import { PageTop } from "@/components/PageTop";

export const metadata: Metadata = { ...baseMetadata, title: "Page not found · Luna Digital", robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <RootDocument locale="en">
      <PageTop />
      <main className="container page">
        <h1>We can&apos;t find that page</h1>
        <p>The link may be old or mistyped. Here is where you can go next.</p>
        <div className="hero__ctas">
          <Link href="/" className="btn btn--primary">Go to the homepage</Link>
          <Link href="/builder" className="btn btn--ghost">Plan your website</Link>
        </div>
      </main>
    </RootDocument>
  );
}
