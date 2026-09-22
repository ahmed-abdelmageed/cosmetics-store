"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { pickLocale } from "@/i18n/pick-locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  id: string;
  titleEn: string;
  titleAr: string;
  subtitleEn?: string | null;
  subtitleAr?: string | null;
  image: string;
  link?: string | null;
};

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const locale = useLocale();
  const t = useTranslations("home");

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (!slides.length) return null;

  return (
    <div className="relative w-full aspect-[16/7] md:aspect-[16/5] overflow-hidden rounded-2xl">
      {slides.map((slide, i) => {
        const title = pickLocale(locale, slide.titleEn, slide.titleAr);
        const subtitle = pickLocale(locale, slide.subtitleEn, slide.subtitleAr);
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Image src={slide.image} alt={title} fill priority={i === 0} sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-center text-white p-6">
              <h2 className="text-2xl md:text-4xl font-bold mb-2">{title}</h2>
              {subtitle && <p className="text-sm md:text-lg mb-4">{subtitle}</p>}
              {slide.link && (
                <Link
                  href={slide.link}
                  className="bg-amber-600 hover:bg-amber-700 px-6 py-2 rounded-full text-sm font-semibold"
                >
                  {t("viewAll")}
                </Link>
              )}
            </div>
          </div>
        );
      })}

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={next}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                className={`w-2.5 h-2.5 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
