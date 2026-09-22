"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, getFinalPrice } from "@/lib/utils";
import { pickLocale } from "@/i18n/pick-locale";
import { ShoppingCart } from "lucide-react";

type Product = {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  price: number;
  discountPercent: number;
  discountActive: boolean;
  images: string[];
  stock: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const locale = useLocale();
  const t = useTranslations("product");
  const name = pickLocale(locale, product.nameEn, product.nameAr);
  const finalPrice = getFinalPrice(product.price, product.discountPercent, product.discountActive);
  const hasDiscount = product.discountActive && product.discountPercent > 0;

  return (
    <div className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-neutral-50">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">No image</div>
        )}
        {hasDiscount && (
          <span className="absolute top-2 right-2 bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{product.discountPercent}%
          </span>
        )}
      </Link>
      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-sm line-clamp-1">{name}</h3>
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-amber-700 font-bold">{formatPrice(finalPrice)}</span>
          {hasDiscount && (
            <span className="text-gray-400 line-through text-xs">{formatPrice(product.price)}</span>
          )}
        </div>
        <button
          onClick={() => {
            if (product.stock <= 0) {
              toast.error(t("outOfStock"));
              return;
            }
            addItem(
              {
                id: product.id,
                name,
                price: finalPrice,
                image: product.images[0],
                stock: product.stock,
              },
              1
            );
            toast.success(t("addedToCart"));
          }}
          className="mt-3 w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          disabled={product.stock <= 0}
        >
          <ShoppingCart size={16} />
          {product.stock <= 0 ? t("unavailable") : t("addToCart")}
        </button>
      </div>
    </div>
  );
}
