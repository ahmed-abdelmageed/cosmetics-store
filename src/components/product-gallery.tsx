"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { ImageOff } from "lucide-react";

export default function ProductGallery({
  images,
  alt,
  badge,
  noImageLabel,
}: {
  images: string[];
  alt: string;
  badge?: string;
  noImageLabel: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/5] bg-cream rounded-md flex flex-col gap-2 items-center justify-center text-ink/25">
        <ImageOff size={32} />
        <span className="text-xs">{noImageLabel}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4">
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2.5 md:w-20 shrink-0">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`${alt} ${i + 1}`}
              className={clsx(
                "relative w-16 md:w-full aspect-[4/5] rounded overflow-hidden bg-cream transition-all duration-300",
                i === active ? "ring-1 ring-ink ring-offset-2 ring-offset-background" : "opacity-60 hover:opacity-100"
              )}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="group relative flex-1 aspect-[4/5] bg-cream rounded-md overflow-hidden">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={i === active ? alt : ""}
            fill
            priority={i === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
            className={clsx(
              "object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]",
              i === active ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
        {badge && (
          <span className="absolute top-4 start-4 bg-white text-brand-800 text-xs font-semibold px-2 py-1 rounded-[3px]">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
