import Link from "next/link";

export function LogoMark({ gradient = false }: { gradient?: boolean }) {
  if (!gradient) {
    return (
      <svg viewBox="0 0 32 32" className="logo__mark" aria-hidden="true">
        <path d="M20 3a13 13 0 1 0 9 22A11 11 0 0 1 20 3z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" className="logo__mark" aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e8edff" />
          <stop offset="1" stopColor="#8b9cff" />
        </linearGradient>
      </defs>
      <path d="M20 3a13 13 0 1 0 9 22A11 11 0 0 1 20 3z" fill="url(#lg)" />
    </svg>
  );
}

export function Logo({ href = "/", gradient = false }: { href?: string; gradient?: boolean }) {
  return (
    <Link href={href} className="logo" aria-label="Luna Digital home">
      <LogoMark gradient={gradient} />
      <span>Luna Digital</span>
    </Link>
  );
}
