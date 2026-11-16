"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

type RevealProps = {
  as?: ElementType;
  className?: string;
  /** Position among siblings, used to stagger the fade-in (80ms each). */
  index?: number;
  style?: CSSProperties;
  children?: ReactNode;
  [attr: string]: unknown;
};

/** Fades its content in the first time it scrolls into view. */
export function Reveal({ as: Tag = "div", className = "", index = 0, style, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${className} reveal${shown ? " is-visible" : ""}`.trim()}
      style={{ transitionDelay: `${index * 80}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
