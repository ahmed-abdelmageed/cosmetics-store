"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { X } from "lucide-react";
import clsx from "clsx";
import ProductGallery from "@/components/product-gallery";
import AddToCartButton from "@/components/add-to-cart-button";
import { formatPrice, getFinalPrice } from "@/lib/utils";
import { pickLocale } from "@/i18n/pick-locale";
import type { CardProduct } from "@/components/product-card";

export default function QuickView({ product, onClose }: { product: CardProduct; onClose: () => void }) {
  const t = useTranslations("product");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [shown, setShown] = useState(false);

  const name = pickLocale(locale, product.nameEn, product.nameAr);
  const description = pickLocale(locale, product.descriptionEn ?? "", product.descriptionAr ?? "");
  const finalPrice = getFinalPrice(product.price, product.discountPercent, product.discountActive);
  const hasDiscount = product.discountActive && product.discountPercent > 0;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[55] flex items-end md:items-center justify-center md:p-6" role="dialog" aria-label={name}>
      <div
        onClick={onClose}
        className={clsx("absolute inset-0 bg-ink/45 transition-opacity duration-300", shown ? "opacity-100" : "opacity-0")}
      />
      <div
        className={clsx(
          "relative w-full md:max-w-4xl max-h-[92vh] overflow-y-auto bg-background rounded-t-xl md:rounded-lg shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          shown ? "opacity-100 translate-y-0 md:scale-100" : "opacity-0 translate-y-10 md:translate-y-4 md:scale-[0.98]"
        )}
      >
        <button
          onClick={onClose}
          aria-label={t("close")}
          className="absolute top-3 end-3 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center"
        >
          <X size={18} />
        </button>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 p-5 md:p-8">
          <ProductGallery
            images={product.images}
            alt={name}
            noImageLabel={tCommon("noImage")}
            badge={hasDiscount ? `-${product.discountPercent}%` : undefined}
          />
          <div className="flex flex-col">
            <h2 className="font-display text-2xl md:text-3xl text-ink leading-tight mb-3 md:pe-8">{name}</h2>
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-xl font-medium text-ink">{formatPrice(finalPrice)}</span>
              {hasDiscount && <span className="text-ink/40 line-through text-sm">{formatPrice(product.price)}</span>}
            </div>
            {description && <p className="text-sm text-ink/70 leading-7 mb-6 line-clamp-5 whitespace-pre-line">{description}</p>}
            <div className="mt-auto space-y-4">
              <AddToCartButton
                product={{ id: product.id, name, price: finalPrice, image: product.images[0], stock: product.stock }}
                onAdded={onClose}
              />
              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="block text-center text-sm text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink"
              >
                {t("viewDetails")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
