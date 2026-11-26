"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/I18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LogoMark } from "@/components/Logo";

const LINKS = [
  { href: "#story", label: "Our work" },
  { href: "#work", label: "Services & prices" },
  { href: "#founding", label: "Founding offer" },
  { href: "#contact", label: "Contact", className: "nav__contact" },
];

export function Nav() {
  const { t, href } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  // Scrolled state + reading progress bar
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 20);
      setProgress(max > 0 ? y / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the link of the section in the middle of the screen
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    document.querySelectorAll("section[id]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Mobile menu: lock page scroll, close on Escape
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" style={{ transform: `scaleX(${progress})` }} />
      <header className={`nav${scrolled ? " is-scrolled" : ""}`} id="nav">
        <div className="nav__inner">
          <a href="#top" className="logo" aria-label={t("Luna Digital home")}>
            <LogoMark />
            <span>Luna Digital</span>
          </a>
          <nav className={`nav__links${open ? " is-open" : ""}`} id="navLinks" aria-label={t("Main")}>
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`${l.className ?? ""}${active === l.href ? " is-active" : ""}`.trim() || undefined}
                onClick={() => setOpen(false)}
              >
                {t(l.label)}
              </a>
            ))}
            <Link href={href("/builder")} className="btn btn--sm btn--primary nav__cta" onClick={() => setOpen(false)}>
              {t("Plan your website")}
            </Link>
          </nav>
          <LanguageSwitcher />
          <button
            className="nav__toggle"
            aria-label={t(open ? "Close menu" : "Open menu")}
            aria-expanded={open}
            aria-controls="navLinks"
            onClick={() => setOpen((o) => !o)}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
    </>
  );
}
