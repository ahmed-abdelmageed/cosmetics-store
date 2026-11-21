"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/lib/cart-store";
import { Minus, Plus } from "lucide-react";

type Props = {
  product: { id: string; name: string; price: number; image?: string; stock: number };
};

export default function AddToCartButton({ product }: Props) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const t = useTranslations("product");

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border border-line rounded-[4px]">
        <button className="p-3" onClick={() => setQty((q) => Math.max(1, q - 1))}>
          <Minus size={16} />
        </button>
        <span className="w-8 text-center">{qty}</span>
        <button className="p-3" onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}>
          <Plus size={16} />
        </button>
      </div>
      <button
        disabled={product.stock <= 0}
        onClick={() => {
          addItem(product, qty);
          toast.success(t("addedToCart"));
        }}
        className="btn-primary flex-1 py-3.5"
      >
        {t("addToCart")}
      </button>
    </div>
  );
}
