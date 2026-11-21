"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import clsx from "clsx";

/**
 * Horizontal, snap-scrolling rail with arrow buttons and a progress bar.
 * Works with touch/trackpad swipe and in both LTR and RTL.
 */
export default function Carousel({
  children,
  itemClassName = "w-[46%] sm:w-[31%] lg:w-[23.5%]",
  className,
}: {
  children: React.ReactNode;
  itemClassName?: string;
  className?: string;
}) {
  const t = useTranslations("home");
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [thumb, setThumb] = useState(1);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft); // scrollLeft is negative in RTL
    setThumb(el.scrollWidth ? el.clientWidth / el.scrollWidth : 1);
    setProgress(max > 0 ? pos / max : 0);
    setAtStart(pos <= 2);
    setAtEnd(pos >= max - 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [measure]);

  const scroll = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    const step = el.clientWidth * 0.85 * direction;
    el.scrollBy({ left: rtl ? -step : step, behavior: "smooth" });
  };

  const items = Children.toArray(children);
  const scrollable = thumb < 0.999;

  return (
    <div className={clsx("relative", className)}>
      <div
        ref={trackRef}
        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 md:mx-0 md:px-0 scroll-px-4 md:scroll-px-0"
      >
        {items.map((child, i) => (
          <div key={i} className={clsx("shrink-0 snap-start", itemClassName)}>
            {child}
          </div>
        ))}
      </div>

      {scrollable && (
        <div className="mt-8 flex items-center gap-6">
          <div className="relative flex-1 h-[2px] bg-line rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 start-0 bg-ink rounded-full transition-[inset-inline-start] duration-150 ease-out"
              style={{
                width: `${thumb * 100}%`,
                insetInlineStart: `${progress * (1 - thumb) * 100}%`,
              }}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll(-1)}
              disabled={atStart}
              aria-label={t("previous")}
              className="w-10 h-10 rounded-full border border-line bg-white text-ink flex items-center justify-center transition-all hover:border-ink hover:bg-ink hover:text-white disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowLeft size={16} className="rtl:rotate-180" />
            </button>
            <button
              onClick={() => scroll(1)}
              disabled={atEnd}
              aria-label={t("next")}
              className="w-10 h-10 rounded-full border border-line bg-white text-ink flex items-center justify-center transition-all hover:border-ink hover:bg-ink hover:text-white disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowRight size={16} className="rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
