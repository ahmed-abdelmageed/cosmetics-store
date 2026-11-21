"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartDrawer, useCartStore } from "@/lib/cart-store";
import { formatPrice, getFinalPrice } from "@/lib/utils";
import { pickLocale } from "@/i18n/pick-locale";
import { ShoppingBag, ImageOff, Eye } from "lucide-react";
import QuickView from "@/components/quick-view";

export type CardProduct = {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  price: number;
  discountPercent: number;
  discountActive: boolean;
  images: string[];
  stock: number;
  descriptionEn?: string;
  descriptionAr?: string;
};

export default function ProductCard({ product }: { product: CardProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const notifyAdded = useCartDrawer((s) => s.notifyAdded);
  const locale = useLocale();
  const t = useTranslations("product");
  const name = pickLocale(locale, product.nameEn, product.nameAr);
  const finalPrice = getFinalPrice(product.price, product.discountPercent, product.discountActive);
  const hasDiscount = product.discountActive && product.discountPercent > 0;
  const outOfStock = product.stock <= 0;
  const [quickOpen, setQuickOpen] = useState(false);
  const closeQuick = useCallback(() => setQuickOpen(false), []);

  const handleAdd = () => {
    if (outOfStock) {
      toast.error(t("outOfStock"));
      return;
    }
    addItem({ id: product.id, name, price: finalPrice, image: product.images[0], stock: product.stock }, 1);
    notifyAdded();
  };

  return (
    <div className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-cream">
        <Link href={`/product/${product.slug}`} className="absolute inset-0" aria-label={name}>
          {product.images[0] ? (
            <>
              <Image
                src={product.images[0]}
                alt={name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              {product.images[1] && (
                <Image
                  src={product.images[1]}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink/20">
              <ImageOff size={32} />
            </div>
          )}
        </Link>

        <div className="absolute top-3 start-3 flex flex-col gap-1.5 pointer-events-none">
          {hasDiscount && (
            <span className="bg-white text-brand-800 text-[11px] font-semibold px-2 py-0.5 rounded-[3px]">
              -{product.discountPercent}%
            </span>
          )}
          {outOfStock && (
            <span className="bg-ink/80 text-white text-[11px] font-medium px-2 py-0.5 rounded-[3px]">
              {t("unavailable")}
            </span>
          )}
        </div>

        <button
          onClick={() => setQuickOpen(true)}
          aria-label={t("quickView")}
          title={t("quickView")}
          className="absolute top-3 end-3 w-9 h-9 rounded-full bg-white/95 text-ink shadow-sm flex items-center justify-center transition-all duration-300 hover:bg-ink hover:text-white md:opacity-0 md:-translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 focus-visible:opacity-100"
        >
          <Eye size={16} />
        </button>

        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="absolute bottom-3 inset-x-3 bg-white text-ink hover:bg-ink hover:text-white rounded-[4px] py-2.5 text-xs font-medium flex items-center justify-center gap-2 shadow-sm transition-all duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 disabled:opacity-0 disabled:pointer-events-none"
        >
          <ShoppingBag size={15} />
          {t("addToCart")}
        </button>
      </div>

      <div className="pt-3">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm text-ink line-clamp-2 leading-snug hover:underline underline-offset-4">
            {name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2 mt-1">
          <span className={hasDiscount ? "text-sm text-brand-700 font-medium" : "text-sm text-ink font-medium"}>
            {formatPrice(finalPrice)}
          </span>
          {hasDiscount && <span className="text-ink/40 line-through text-xs">{formatPrice(product.price)}</span>}
        </div>
      </div>
      {quickOpen && <QuickView product={product} onClose={closeQuick} />}
    </div>
  );
}
