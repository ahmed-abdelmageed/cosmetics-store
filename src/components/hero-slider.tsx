"use client";

import { useState, useEffect, useCallback, useRef, Fragment } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { pickLocale } from "@/i18n/pick-locale";
import { ArrowRight, ShieldCheck, Wallet } from "lucide-react";
import clsx from "clsx";

type Slide = {
  id: string;
  titleEn: string;
  titleAr: string;
  subtitleEn?: string | null;
  subtitleAr?: string | null;
  image: string;
  link?: string | null;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&h=1200&fit=crop&crop=faces&q=80&auto=format";
const INTERVAL = 6000;

/** Removes the *highlight* markers, for alt text and plain contexts. */
const plain = (s: string) => s.replace(/\*/g, "");

/**
 * Renders a slide title. Words wrapped in *stars* get the accent colour and a hand-drawn underline,
 * e.g. "Makeup that *lasts* all day". Titles without stars render normally.
 */
function Title({ text, italic }: { text: string; italic: boolean }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <span key={i} className={clsx("relative inline-block text-brand-600", italic && "italic")}>
            {part.slice(1, -1)}
            <svg
              aria-hidden="true"
              viewBox="0 0 300 12"
              preserveAspectRatio="none"
              className="absolute -bottom-1.5 inset-x-0 w-full h-[0.22em] text-brand-300"
            >
              <path
                d="M2 9c60-6 180-9 296-4"
                pathLength={1}
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="1"
                className="animate-draw"
                style={{ animationDelay: "450ms" }}
              />
            </svg>
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}

/** Counts up from 0 once on mount. */
function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = requestAnimationFrame(() => setValue(end));
      return () => cancelAnimationFrame(raf);
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1800);
      setValue(Math.round(end * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end]);
  return (
    <span className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

export default function HeroSlider({
  slides,
  stats,
}: {
  slides: Slide[];
  stats: { products: number; categories: number };
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const locale = useLocale();
  const t = useTranslations("home");
  const isAr = locale === "ar";

  const items: Slide[] = slides.length
    ? slides
    : [
        {
          id: "fallback",
          titleEn: t("heroTitle"),
          titleAr: t("heroTitle"),
          subtitleEn: t("heroSubtitle"),
          subtitleAr: t("heroSubtitle"),
          image: FALLBACK_IMAGE,
          link: "/shop",
        },
      ];
  const count = items.length;
  const slide = items[index];
  const title = pickLocale(locale, slide.titleEn, slide.titleAr);
  const subtitle = pickLocale(locale, slide.subtitleEn, slide.subtitleAr);

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = () => setIndex((i) => (i - 1 + count) % count);

  useEffect(() => {
    if (count <= 1 || paused) return;
    const timer = setTimeout(next, INTERVAL);
    return () => clearTimeout(timer);
  }, [next, count, paused, index]);

  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null || count <= 1) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 45) return;
    if (isAr ? dx > 0 : dx < 0) next();
    else prev();
  };

  const statItems = [
    { key: "p", node: <CountUp end={stats.products} suffix="+" />, label: t("statProducts") },
    { key: "c", node: <CountUp end={stats.categories} />, label: t("statCategories") },
    { key: "a", node: <CountUp end={100} suffix="%" />, label: t("statAuthentic") },
  ];

  return (
    <section
      className="relative overflow-hidden bg-[linear-gradient(135deg,#fbf5ef_0%,#fbf9f6_45%,#f7ece7_100%)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Soft glows */}
      <div className="pointer-events-none absolute -top-40 -end-40 h-[620px] w-[620px] rounded-full bg-brand-100/80 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -start-32 h-[480px] w-[480px] rounded-full bg-rose-200/30 blur-3xl" />

      <div className="relative container-app grid lg:grid-cols-2 gap-12 lg:gap-8 items-center lg:min-h-[calc(100svh-108px)] py-12 lg:py-16">
        {/* Copy */}
        <div className="text-center lg:text-start">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium text-ink/80 ring-1 ring-brand-200 shadow-sm animate-fade">
            <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
            {t("heroBadge")}
          </span>

          <div key={`copy-${index}`}>
            <h1
              className="mt-6 font-display text-[40px] leading-[1.12] sm:text-6xl xl:text-[66px] font-semibold text-ink [text-wrap:balance] animate-rise"
              style={{ animationDelay: "60ms" }}
            >
              <Title text={title} italic={!isAr} />
            </h1>
            {subtitle && (
              <p
                className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-ink/60 leading-relaxed animate-rise"
                style={{ animationDelay: "160ms" }}
              >
                {subtitle}
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link
              href={slide.link || "/shop"}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-4 font-semibold text-white shadow-[0_14px_30px_-12px_rgba(154,96,64,0.55)] transition hover:bg-brand-700 hover:-translate-y-0.5"
            >
              {t("shopNow")}
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
              />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 font-semibold text-ink ring-1 ring-ink/15 transition hover:ring-brand-500 hover:text-brand-700"
            >
              {t("exploreProducts")}
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-3 max-w-lg mx-auto lg:mx-0 divide-x divide-ink/10 rounded-2xl bg-white/80 backdrop-blur ring-1 ring-ink/5 shadow-[0_10px_30px_-15px_rgba(31,26,23,0.18)]">
            {statItems.map((s) => (
              <div key={s.key} className="px-3 py-4 text-center">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-2xl sm:text-3xl font-semibold text-ink" dir="ltr">
                  {s.node}
                </dd>
                <p className="mt-1 text-xs sm:text-sm text-ink/50">{s.label}</p>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual */}
        <div
          className="relative mx-auto w-full max-w-[540px] aspect-square touch-pan-y animate-fade"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="absolute inset-[6%] rounded-full bg-gradient-to-br from-brand-100 via-white to-rose-100 shadow-[0_30px_60px_-25px_rgba(95,58,40,0.35)]" />
          <div className="absolute inset-[6%] rounded-full border-2 border-dashed border-brand-300/70 animate-[spin_60s_linear_infinite]" />

          <div className="absolute inset-[12%] rounded-full overflow-hidden shadow-[0_25px_50px_-20px_rgba(95,58,40,0.45)]">
            {items.map((s, i) => {
              const active = i === index;
              return (
                <div
                  key={s.id}
                  aria-hidden={!active}
                  className={clsx(
                    "absolute inset-0 transition-[opacity,transform] duration-700 ease-out",
                    active ? "opacity-100 scale-100 rotate-0 z-10" : "opacity-0 scale-[1.08] rotate-3"
                  )}
                >
                  <Image
                    src={s.image}
                    alt={plain(pickLocale(locale, s.titleEn, s.titleAr))}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 1024px) 420px, 76vw"
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>

          {/* Floating badges */}
          <div className="absolute start-0 top-[14%] z-20 hidden sm:flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-[0_14px_35px_-12px_rgba(31,26,23,0.25)] ring-1 ring-ink/5 animate-float">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <ShieldCheck size={19} />
            </span>
            <div className="text-start">
              <p className="text-sm font-semibold text-ink">{t("heroCard1Title")}</p>
              <p className="text-xs text-ink/50">{t("heroCard1Sub")}</p>
            </div>
          </div>
          <div className="absolute end-0 bottom-[14%] z-20 hidden sm:flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-[0_14px_35px_-12px_rgba(31,26,23,0.25)] ring-1 ring-ink/5 animate-float [animation-delay:-3s]">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-500">
              <Wallet size={19} />
            </span>
            <div className="text-start">
              <p className="text-sm font-semibold text-ink">{t("heroCard2Title")}</p>
              <p className="text-xs text-ink/50">{t("heroCard2Sub")}</p>
            </div>
          </div>

          {count > 1 && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {items.map((s, i) => (
                <button
                  key={s.id}
                  aria-label={`${i + 1} / ${count}`}
                  onClick={() => setIndex(i)}
                  className={clsx(
                    "h-2 rounded-full transition-all duration-300",
                    i === index ? "w-8 bg-brand-600" : "w-2 bg-ink/20 hover:bg-ink/35"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
