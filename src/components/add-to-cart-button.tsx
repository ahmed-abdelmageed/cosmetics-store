"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCartDrawer, useCartStore } from "@/lib/cart-store";
import { Check, Minus, Plus } from "lucide-react";

type Props = {
  product: { id: string; name: string; price: number; image?: string; stock: number };
  onAdded?: () => void;
};

export default function AddToCartButton({ product, onAdded }: Props) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const notifyAdded = useCartDrawer((s) => s.notifyAdded);
  const t = useTranslations("product");
  const outOfStock = product.stock <= 0;

  return (
    <div className="space-y-3">
      <p className="label">{t("quantity")}</p>
      <div className="flex items-stretch gap-3">
        <div className="flex items-center border border-line rounded-[4px] bg-white">
          <button
            className="px-3.5 h-full text-ink/60 hover:text-ink disabled:opacity-30 transition-colors"
            disabled={qty <= 1}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            <Minus size={15} />
          </button>
          <span key={qty} className="w-8 text-center tabular-nums animate-fade">
            {qty}
          </span>
          <button
            className="px-3.5 h-full text-ink/60 hover:text-ink disabled:opacity-30 transition-colors"
            disabled={qty >= (product.stock || 99)}
            onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
          >
            <Plus size={15} />
          </button>
        </div>
        <button
          disabled={outOfStock}
          onClick={() => {
            addItem(product, qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 1600);
            onAdded?.();
            notifyAdded();
          }}
          className="btn-primary flex-1 py-4 relative overflow-hidden"
        >
          <span className={`flex items-center gap-2 transition-all duration-300 ${added ? "-translate-y-8 opacity-0" : ""}`}>
            {outOfStock ? t("unavailable") : t("addToCart")}
          </span>
          <span
            className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300 ${
              added ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <Check size={16} /> {t("addedToCart")}
          </span>
        </button>
      </div>
    </div>
  );
}
