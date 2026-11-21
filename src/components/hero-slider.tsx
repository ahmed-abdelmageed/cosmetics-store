"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { pickLocale } from "@/i18n/pick-locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600";

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const locale = useLocale();
  const t = useTranslations("home");

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

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = () => setIndex((i) => (i - 1 + count) % count);

  useEffect(() => {
    if (count <= 1) return;
    const timer = setTimeout(next, 6000);
    return () => clearTimeout(timer);
  }, [next, count, index]);

  return (
    <section className="relative w-full h-[62vh] min-h-[420px] max-h-[640px] overflow-hidden bg-cream">
      {items.map((slide, i) => {
        const title = pickLocale(locale, slide.titleEn, slide.titleAr);
        const subtitle = pickLocale(locale, slide.subtitleEn, slide.subtitleAr);
        const active = i === index;
        return (
          <div
            key={slide.id}
            aria-hidden={!active}
            className={clsx(
              "absolute inset-0 transition-opacity duration-700",
              active ? "opacity-100 z-10" : "opacity-0 pointer-events-none"
            )}
          >
            <Image src={slide.image} alt={title} fill priority={i === 0} sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-ink/35 md:bg-transparent md:bg-gradient-to-r md:rtl:bg-gradient-to-l md:from-ink/55 md:to-transparent md:to-70%" />

            <div className="relative h-full container-app flex items-center">
              <div className="max-w-lg text-white">
                <h1 className="font-display text-4xl md:text-[3.25rem] font-medium leading-[1.1] mb-4">{title}</h1>
                {subtitle && <p className="text-base md:text-lg text-white/85 leading-relaxed mb-8">{subtitle}</p>}
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={slide.link || "/shop"}
                    className="inline-flex items-center bg-white text-ink hover:bg-cream px-7 py-3.5 rounded-[4px] text-sm font-medium transition-colors"
                  >
                    {t("shopNow")}
                  </Link>
                  <Link
                    href="/shop?onSale=1"
                    className="inline-flex items-center px-7 py-3.5 rounded-[4px] text-sm font-medium border border-white/70 text-white hover:bg-white hover:text-ink transition-colors"
                  >
                    {t("offers")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {count > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="hidden md:flex absolute z-20 start-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-ink items-center justify-center rounded-full"
          >
            <ChevronLeft size={18} className="rtl:rotate-180" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="hidden md:flex absolute z-20 end-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-ink items-center justify-center rounded-full"
          >
            <ChevronRight size={18} className="rtl:rotate-180" />
          </button>
          <div className="absolute z-20 bottom-5 inset-x-0 flex justify-center gap-2">
            {items.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={clsx(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/60 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
