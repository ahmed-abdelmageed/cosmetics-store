"use client";

import { useEffect, useRef } from "react";

/**
 * Moves its content slightly slower than the page scroll. Disabled when the user prefers reduced motion.
 * Position it with extra height around its parent (e.g. `-top-[20%] -bottom-[20%]`) so edges never show.
 */
export default function Parallax({
  children,
  strength = 0.12,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const parent = el.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
      // The layer is 20% taller than its parent on each side; never shift past that margin.
      const max = rect.height * 0.18;
      const shift = Math.max(-max, Math.min(max, -offset * strength));
      el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [strength]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
