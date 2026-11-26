import Link from "next/link";
import { LogoMark } from "@/components/Logo";

/** Logo header for simple text pages. */
export function PageTop({ href = "/" }: { href?: string }) {
  return (
    <header className="container page__top">
      <Link href={href} className="logo" aria-label="Luna Digital home"><LogoMark /><span>Luna Digital</span></Link>
    </header>
  );
}
